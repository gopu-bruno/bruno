const { ipcMain } = require('electron');
const axios = require('axios');

// Default registry index location — the rate-limit-free raw CDN URL. Kept in
// sync with REGISTRY_INDEX_RAW_URL in @usebruno/registry-ui; the renderer passes
// the canonical URL, this is just a fallback.
const DEFAULT_REGISTRY_INDEX_URL
  = 'https://raw.githubusercontent.com/gopu-bruno/collection-registry/main/index.json';

// The registry repo that holds collections/<ns>/<name>.json entries.
const REGISTRY_REPO = 'gopu-bruno/collection-registry';
const REGISTRY_BASE_BRANCH = 'main';

const ghMessage = (err) => (err.response && err.response.data && err.response.data.message) || err.message;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Create a branch off `base` and add a single file to it, on owner/repo.
async function ghCreateBranchWithFile({ owner, repo, headers, base, branch, filePath, content, message }) {
  const baseRef = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${base}`, { headers, timeout: 30000 });
  await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/refs`, { ref: `refs/heads/${branch}`, sha: baseRef.data.object.sha }, { headers, timeout: 30000 });
  await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, { message, content, branch }, { headers, timeout: 30000 });
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

  // Publish a version = create a GitHub Release + upload the opencollection.yml
  // asset. This runs in MAIN on purpose: the renderer can create a release
  // (api.github.com sends CORS headers) but CANNOT upload the asset
  // (uploads.github.com sends none), and main is not subject to CORS. The PAT
  // is used here and never persisted.
  ipcMain.handle('renderer:publish-collection', async (event, { repo, tag, name, body, yaml, pat } = {}) => {
    const m = String(repo || '').match(/github\.com[/:]([^/]+)\/([^/.\s]+)/i);
    if (!m) throw new Error('Unrecognized GitHub repo URL.');
    if (!pat) throw new Error('A GitHub token is required to publish.');
    if (!tag) throw new Error('A release tag is required.');
    const owner = m[1];
    const repoName = m[2].replace(/\.git$/, '');
    const headers = {
      'Authorization': `Bearer ${pat}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    // 1) Create the release (and its git tag).
    let release;
    try {
      const res = await axios.post(
        `https://api.github.com/repos/${owner}/${repoName}/releases`,
        { tag_name: tag, name: name || tag, body: body || '' },
        { headers, timeout: 30000 }
      );
      release = res.data;
    } catch (err) {
      const status = err.response && err.response.status;
      const msg = (err.response && err.response.data && err.response.data.message) || err.message;
      if (status === 401) throw new Error('GitHub rejected the token (401). Check the PAT and its scopes (needs contents:write).');
      if (status === 403) throw new Error(`GitHub forbade the request (403): ${msg}`);
      if (status === 404) throw new Error(`Repo not found or token lacks access (404): ${owner}/${repoName}`);
      if (status === 422) throw new Error(`Tag "${tag}" may already exist (422): ${msg}`);
      throw new Error(`Failed to create release: ${msg}`);
    }

    // 2) Upload the asset. The file's raw bytes ARE the request body; the
    // filename rides in the upload_url's ?name= param.
    const uploadUrl = String(release.upload_url || '').replace(/\{[^}]*\}$/, '') + '?name=opencollection.yml';
    let asset;
    try {
      const res = await axios.post(uploadUrl, yaml || '', {
        headers: { ...headers, 'Content-Type': 'text/yaml' },
        maxBodyLength: Infinity,
        timeout: 60000
      });
      asset = res.data;
    } catch (err) {
      const msg = (err.response && err.response.data && err.response.data.message) || err.message;
      throw new Error(`Release ${release.html_url} created, but the asset upload failed: ${msg}`);
    }

    return { releaseUrl: release.html_url, assetUrl: asset.browser_download_url, tag };
  });

  // List a collection on the registry = open a PR to collection-registry that
  // adds collections/<ns>/<name>.json. Done once, the first time a collection is
  // published; later version bumps need no PR (the index re-bakes counts from
  // the entry's source repo). The maintainer still reviews/merges before it lists.
  //
  // Two paths so ANY publisher can do this in-app, not just collaborators:
  //   • have write → branch + file directly on the registry repo
  //   • no write   → fork the repo to the user's account, branch + file there,
  //                  and open the PR from the fork (standard fork-and-PR).
  ipcMain.handle('renderer:open-registry-pr', async (event, { entry, pat } = {}) => {
    if (!entry || !entry.ns || !entry.name) throw new Error('A valid registry entry (ns + name) is required.');
    if (!pat) throw new Error('A GitHub token is required to open the listing PR.');
    const [owner, repo] = REGISTRY_REPO.split('/');
    const headers = {
      'Authorization': `Bearer ${pat}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    const filePath = `collections/${entry.ns}/${entry.name}.json`;
    const branch = `add-${entry.ns}-${entry.name}-${Date.now()}`;
    const content = Buffer.from(JSON.stringify(entry, null, 2) + '\n', 'utf8').toString('base64');
    const message = `Add ${entry.ns}/${entry.name} collection`;

    let head = branch; // same-repo head, unless we fork
    let viaFork = false;

    try {
      // Path A — direct branch on the registry repo (write access).
      await ghCreateBranchWithFile({ owner, repo, headers, base: REGISTRY_BASE_BRANCH, branch, filePath, content, message });
    } catch (err) {
      const status = err.response && err.response.status;
      if (status === 401) throw new Error('GitHub rejected the token (401). Check the PAT.');
      if (status !== 403 && status !== 404) {
        if (status === 422) throw new Error(`Couldn't prepare the branch (422): ${ghMessage(err)}`);
        throw new Error(`Failed to prepare the listing branch: ${ghMessage(err)}`);
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
        await ghCreateBranchWithFile({ owner: login, repo, headers, base: REGISTRY_BASE_BRANCH, branch, filePath, content, message });
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
          title: `Add ${entry.ns}/${entry.name}`,
          head,
          base: REGISTRY_BASE_BRANCH,
          body: `Adds \`${filePath}\` to list **${entry.title || entry.ns + '/' + entry.name}** on the registry.`
        },
        { headers, timeout: 30000 }
      );
      return { prUrl: pr.data.html_url, viaFork };
    } catch (err) {
      if (err.response && err.response.status === 422) throw new Error(`Couldn't open the PR (422) — it may already exist: ${ghMessage(err)}`);
      throw new Error(`Failed to open listing PR: ${ghMessage(err)}`);
    }
  });
};

module.exports = registerRegistryIpc;
