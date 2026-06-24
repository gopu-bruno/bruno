const { ipcMain } = require('electron');
const axios = require('axios');

// Default registry index location — the rate-limit-free raw CDN URL. Kept in
// sync with REGISTRY_INDEX_RAW_URL in @usebruno/registry-ui; the renderer passes
// the canonical URL, this is just a fallback.
const DEFAULT_REGISTRY_INDEX_URL
  = 'https://raw.githubusercontent.com/gopu-bruno/registry-hybrid/main/index.json';

// The registry repo that holds collection/<letter>/<ns>/<name>.json entries.
const REGISTRY_REPO = 'gopu-bruno/registry-hybrid';
const REGISTRY_BASE_BRANCH = 'main';

const ghMessage = (err) => (err.response && err.response.data && err.response.data.message) || err.message;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// File path for an entry, sharded by the first character of its namespace.
// Mirrors registryEntryPath() in @usebruno/registry-ui.
const entryFilePath = (entry) => {
  const ns = (entry && entry.ns) || '';
  const name = (entry && entry.name) || '';
  return `collection/${ns[0] || '_'}/${ns}/${name}.json`;
};

// Create a branch off `base` on owner/repo.
async function ghCreateBranch({ owner, repo, headers, base, branch }) {
  const baseRef = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${base}`, { headers, timeout: 30000 });
  await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/refs`, { ref: `refs/heads/${branch}`, sha: baseRef.data.object.sha }, { headers, timeout: 30000 });
}

// Read collection/<…>.json from owner/repo at `ref`. Returns { sha, entry } or
// null when the file doesn't exist (404). Other errors propagate.
async function ghReadEntryFile({ owner, repo, headers, filePath, ref }) {
  try {
    const cur = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${ref}`,
      { headers, timeout: 30000 }
    );
    return { sha: cur.data.sha, entry: JSON.parse(Buffer.from(cur.data.content, 'base64').toString('utf8')) };
  } catch (e) {
    if (e.response && e.response.status === 404) return null;
    throw e;
  }
}

// Write `finalEntry` to owner/repo@branch. Reads the existing blob sha on that
// branch (needed to UPDATE an existing file) and PUTs. Content is precomputed by
// the caller so the merge always uses the canonical upstream file, not a
// possibly-stale fork copy.
async function ghWriteEntryFile({ owner, repo, headers, branch, filePath, finalEntry, message }) {
  const existing = await ghReadEntryFile({ owner, repo, headers, filePath, ref: branch });
  const content = Buffer.from(JSON.stringify(finalEntry, null, 2) + '\n', 'utf8').toString('base64');
  const body = { message, content, branch };
  if (existing) body.sha = existing.sha;
  await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, body, { headers, timeout: 30000 });
}

// Merge a new version into an existing entry (append, deduped by version label).
function mergeVersion(baseEntry, version) {
  const merged = { ...baseEntry };
  const versions = Array.isArray(merged.versions) ? merged.versions.slice() : [];
  if (version && !versions.some((v) => v && v.version === version.version)) versions.push(version);
  merged.versions = versions;
  return merged;
}

// A just-created fork can take a moment to materialize — poll until it answers.
async function ghWaitForRepo({ owner, repo, headers, tries = 10, delayMs = 1500 }) {
  for (let i = 0; i < tries; i++) {
    try {
      await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers, timeout: 15000 });
      return true;
    } catch (e) {
      if (i === tries - 1) return false;
      await sleep(delayMs);
    }
  }
  return false;
}

const registerRegistryIpc = (mainWindow) => {
  // Fetch the registry index from the MAIN process.
  //
  // Why not fetch from the renderer (like the website does)? The renderer CSP
  // restricts connect-src to 'self', so an external fetch is blocked. The main
  // process has no such restriction and isn't subject to CORS — and we point it
  // at raw.githubusercontent.com, which has no API rate limit (great for demos).
  ipcMain.handle('renderer:fetch-registry-index', async (event, { url } = {}) => {
    const target = url || DEFAULT_REGISTRY_INDEX_URL;
    const res = await axios.get(target, {
      // raw CDN caches for ~5 min; bypass any local cache so refreshes are fresh.
      headers: { 'Cache-Control': 'no-cache' },
      responseType: 'json',
      timeout: 30000,
      validateStatus: (status) => status >= 200 && status < 300
    });
    return res.data;
  });

  // Publish = open a PR to the registry repo. Two acts, one handler:
  //   • LIST a new collection → create collection/<letter>/<ns>/<name>.json
  //   • ADD a version         → append a {version, type, source, hash?} to the
  //                             already-listed collection's file
  // There is no GitHub Release step — a version's artifact lives in its own git
  // repo or behind its url. The maintainer reviews/merges before it lists.
  //
  // Two paths so ANY publisher can do this in-app, not just collaborators:
  //   • have write → branch + file directly on the registry repo
  //   • no write   → fork the repo, branch + file there, open the PR from the fork.
  ipcMain.handle('renderer:open-registry-pr', async (event, { entry, version, alreadyListed, pat } = {}) => {
    if (!entry || !entry.ns || !entry.name) throw new Error('A valid registry entry (ns + name) is required.');
    if (!pat) throw new Error('A GitHub token is required to open the PR.');
    const [owner, repo] = REGISTRY_REPO.split('/');
    const headers = {
      'Authorization': `Bearer ${pat}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    const filePath = entryFilePath(entry);
    const branch = `publish-${entry.ns}-${entry.name}-${Date.now()}`;
    const message = alreadyListed
      ? `Add ${entry.ns}/${entry.name} v${version && version.version}`
      : `Add ${entry.ns}/${entry.name} collection`;

    // Compute the file content once, from the CANONICAL upstream file. For an
    // already-listed collection that means appending the version to upstream's
    // current entry (so a stale fork can't drop existing versions); otherwise
    // it's the new entry as-built (which already carries its first version).
    let finalEntry = entry;
    if (alreadyListed) {
      try {
        const upstream = await ghReadEntryFile({ owner, repo, headers, filePath, ref: REGISTRY_BASE_BRANCH });
        finalEntry = upstream ? mergeVersion(upstream.entry, version) : entry;
      } catch (e) {
        throw new Error(`Couldn't read the existing entry to append a version: ${ghMessage(e)}`);
      }
    }

    let head = branch; // same-repo head, unless we fork
    let viaFork = false;

    try {
      // Path A — direct branch on the registry repo (write access).
      await ghCreateBranch({ owner, repo, headers, base: REGISTRY_BASE_BRANCH, branch });
      await ghWriteEntryFile({ owner, repo, headers, branch, filePath, finalEntry, message });
    } catch (err) {
      const status = err.response && err.response.status;
      if (status === 401) throw new Error('GitHub rejected the token (401). Check the PAT.');
      if (status !== 403 && status !== 404) {
        if (status === 422) throw new Error(`Couldn't prepare the branch (422): ${ghMessage(err)}`);
        throw new Error(`Failed to prepare the PR branch: ${ghMessage(err)}`);
      }

      // Path B — no write: fork-and-PR.
      viaFork = true;
      let login;
      try {
        const me = await axios.get('https://api.github.com/user', { headers, timeout: 30000 });
        login = me.data.login;
      } catch (e) {
        throw new Error(`Can't write to ${REGISTRY_REPO} and couldn't read your GitHub user to fork: ${ghMessage(e)}`);
      }
      try {
        await axios.post(`https://api.github.com/repos/${owner}/${repo}/forks`, {}, { headers, timeout: 30000 });
      } catch (e) {
        throw new Error(`Couldn't fork ${REGISTRY_REPO}: ${ghMessage(e)} (the token needs public_repo scope).`);
      }
      const ready = await ghWaitForRepo({ owner: login, repo, headers });
      if (!ready) throw new Error('Your fork is still being created on GitHub — try again in a moment.');
      try {
        await ghCreateBranch({ owner: login, repo, headers, base: REGISTRY_BASE_BRANCH, branch });
        await ghWriteEntryFile({ owner: login, repo, headers, branch, filePath, finalEntry, message });
      } catch (e) {
        throw new Error(`Couldn't add the entry to your fork: ${ghMessage(e)}`);
      }
      head = `${login}:${branch}`;
    }

    // Open the PR on the upstream registry repo (works for direct or fork head).
    try {
      const pr = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/pulls`,
        {
          title: alreadyListed ? `Add ${entry.ns}/${entry.name} v${version && version.version}` : `Add ${entry.ns}/${entry.name}`,
          head,
          base: REGISTRY_BASE_BRANCH,
          body: alreadyListed
            ? `Adds version \`${version && version.version}\` to \`${filePath}\`.`
            : `Adds \`${filePath}\` to list **${entry.title || entry.ns + '/' + entry.name}** on the registry.`
        },
        { headers, timeout: 30000 }
      );
      return { prUrl: pr.data.html_url, viaFork };
    } catch (err) {
      if (err.response && err.response.status === 422) throw new Error(`Couldn't open the PR (422) — it may already exist: ${ghMessage(err)}`);
      throw new Error(`Failed to open PR: ${ghMessage(err)}`);
    }
  });
};

module.exports = registerRegistryIpc;
