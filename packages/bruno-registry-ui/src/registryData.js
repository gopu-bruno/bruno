// Bundled fallback snapshot — opencollection.dev
// Identity model: GitHub-style namespace (owner/repo); the registry is a thin
// index over real git repos. This is only a pre-load fallback shaped exactly
// like the live index (fetchRegistryIndex); real data replaces it on mount.
// No usage stats are stored — only authored metadata + editorial flags.

export const PUBLIC_FEATURED = [
  { ns: 'stripe', name: 'stripe-api', title: 'Stripe API', tagline: 'Official Stripe REST API collection — payments, customers, webhooks.', category: 'payments', verified: true, official: true, langs: ['REST', 'Webhooks'], color: '#635bff' },
  { ns: 'github', name: 'rest-api', title: 'GitHub REST API', tagline: 'Full GitHub REST API v2022-11-28, 600+ requests with examples.', category: 'devops', verified: true, official: true, langs: ['REST', 'GraphQL'], color: '#24292e' },
  { ns: 'openai', name: 'openai-api', title: 'OpenAI API', tagline: 'Chat, embeddings, audio, images — the complete OpenAI API surface.', category: 'ai', verified: true, official: true, langs: ['REST', 'Streaming'], color: '#10a37f' },
];

export const PUBLIC_TRENDING = [
  { ns: 'anthropic', name: 'claude-api', title: 'Claude Messages API', tagline: 'Anthropic Messages API with tool use and prompt caching.', category: 'ai', verified: true, official: true, langs: ['REST', 'Streaming'], color: '#d97757' },
];

export const PUBLIC_CATEGORIES = [
  { id: 'payments', label: 'Payments',         icon: 'card',    count: 1 },
  { id: 'ai',       label: 'AI & ML',          icon: 'sparkle', count: 2 },
  { id: 'devops',   label: 'DevOps & Infra',   icon: 'server',  count: 1 },
];

// Registry → data map, keyed by host. The default public registry is opencollection.dev.
export const REGISTRY_DATA = {
  'opencollection.dev': {
    featured: PUBLIC_FEATURED,
    trending: PUBLIC_TRENDING,
    categories: PUBLIC_CATEGORIES,
    totalCollections: 4,
    publishers: 4,
  },
};

export const DEFAULT_REGISTRY = { id: 'oc-public', name: 'OpenCollection', host: 'opencollection.dev', kind: 'public' };

export function getRegistryData(registry) {
  if (!registry) return REGISTRY_DATA['opencollection.dev'];
  return REGISTRY_DATA[registry.host] || REGISTRY_DATA['opencollection.dev'];
}

// --- Live, git-backed index -------------------------------------------------
// The real registry is a git repo of one-file-per-collection entries; CI rolls
// them into a single index.json. Consumers fetch that file and search it
// client-side — no server.
//
// Two fetch strategies, one per host:
//
//  • Website (this module's fetchRegistryIndex) reads via the GitHub *contents
//    API* (raw media type). The API reflects git immediately (no CDN cache), so
//    a just-merged PR shows up on the next refresh — but it's rate-limited
//    (60 req/hr unauthenticated) and CORS-enabled for the browser.
//    Override with VITE_REGISTRY_INDEX_URL.
//
//  • Desktop app fetches REGISTRY_INDEX_RAW_URL (raw.githubusercontent.com) from
//    the Electron MAIN process (renderer CSP blocks external connect-src). raw
//    has NO rate limit — ideal for the demo — at the cost of a ~5-min CDN cache.
//    See bruno-electron `renderer:fetch-registry-index` + bruno-app's Registry host.

// raw CDN — no rate limit (hammer refresh freely in dev), ~5-min cache.
export const REGISTRY_INDEX_RAW_URL =
  'https://raw.githubusercontent.com/gopu-bruno/registry-hybrid/main/index.json';

// GitHub contents API — reflects a just-merged PR immediately, but rate-limited
// to 60 req/hr unauthenticated.
export const REGISTRY_INDEX_CONTENTS_API_URL =
  'https://api.github.com/repos/gopu-bruno/registry-hybrid/contents/index.json';

// Website index source — toggle by commenting/uncommenting (only ONE active).
// VITE_REGISTRY_INDEX_URL overrides either when set.
//
// TESTING (active): raw CDN — no rate limit while developing.
export const REGISTRY_INDEX_URL = (import.meta.env && import.meta.env.VITE_REGISTRY_INDEX_URL) || REGISTRY_INDEX_RAW_URL;
// DEMOING: GitHub contents API — reflects git immediately. Comment the line
// above and uncomment the line below before a demo.
// export const REGISTRY_INDEX_URL = (import.meta.env && import.meta.env.VITE_REGISTRY_INDEX_URL) || REGISTRY_INDEX_CONTENTS_API_URL;

export async function fetchRegistryIndex(url = REGISTRY_INDEX_URL) {
  const isGithubApi = url.startsWith('https://api.github.com/');
  const res = await fetch(url, {
    cache: 'no-store',
    headers: isGithubApi ? { Accept: 'application/vnd.github.raw' } : undefined,
  });
  if (!res.ok) throw new Error(`Registry index fetch failed: ${res.status}`);
  return res.json();
}

// --- Versions & sources -----------------------------------------------------
// A registry entry carries a `versions` array; each version is independently
// sourced (git or url). The index build bakes in `latestVersion`, but we
// recompute defensively here so the UI also works on un-baked / fallback data.

export function parseGithubRepo(url) {
  const m = String(url || '').match(/github\.com[/:]([^/]+)\/([^/.\s]+)/i);
  return m ? { owner: m[1], repo: m[2].replace(/\.git$/, '') } : null;
}

// Host-agnostic "looks like a git remote" check — accepts any host (GitHub,
// GitLab, Bitbucket, self-hosted) over http(s)/ssh/git, plus scp-style
// git@host:owner/repo. Used to validate a git source without assuming a host.
export function isGitRepoUrl(url) {
  const s = String(url || '').trim();
  if (!s) return false;
  if (/^[^@\s]+@[^:\s]+:.+/.test(s)) return true; // scp-like: git@host:path
  try {
    const u = new URL(s);
    if (!['http:', 'https:', 'ssh:', 'git:'].includes(u.protocol)) return false;
    return !!u.hostname && u.pathname.replace(/^\/+|\/+$/g, '').length > 0;
  } catch {
    return false;
  }
}

// Compare two versions by semver precedence. Core (major.minor.patch) compares
// numerically; a prerelease (e.g. 1.0.0-beta) ranks BELOW its release; prerelease
// identifiers compare dot-wise. Returns >0 if a is newer. Mirrors cmpVersion in
// the registry's build-index.mjs — keep the two in sync.
export function cmpVersion(a, b) {
  const parse = (v) => {
    const core = String(v == null ? '' : v).trim().replace(/^v/, '').split('+')[0];
    const [main, pre] = core.split('-');
    const nums = main.split('.').map((n) => (/^\d+$/.test(n) ? Number(n) : 0));
    while (nums.length < 3) nums.push(0);
    return { nums, pre: pre || null };
  };
  const pa = parse(a), pb = parse(b);
  for (let i = 0; i < 3; i++) if (pa.nums[i] !== pb.nums[i]) return pa.nums[i] - pb.nums[i];
  if (!pa.pre && !pb.pre) return 0;
  if (!pa.pre) return 1;   // release outranks prerelease
  if (!pb.pre) return -1;
  const ai = pa.pre.split('.'), bi = pb.pre.split('.');
  for (let i = 0; i < Math.max(ai.length, bi.length); i++) {
    const x = ai[i], y = bi[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    const xn = /^\d+$/.test(x), yn = /^\d+$/.test(y);
    if (xn && yn) { if (Number(x) !== Number(y)) return Number(x) - Number(y); }
    else if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}

// A collection's versions, newest-first.
export function sortedVersions(collection) {
  return [...((collection && collection.versions) || [])].sort((a, b) => cmpVersion(b.version, a.version));
}

// The newest version object (honoring a baked `latestVersion` if present), or null.
export function latestVersionEntry(collection) {
  if (!collection) return null;
  if (collection.latestVersion) {
    const hit = (collection.versions || []).find((v) => v.version === collection.latestVersion);
    if (hit) return hit;
  }
  return sortedVersions(collection)[0] || null;
}

export function latestVersionLabel(collection) {
  return (collection && collection.latestVersion) || (latestVersionEntry(collection) || {}).version || null;
}

// Resolve a version's git source ({ repo, ref, subdir }) — null for non-git
// versions or when no repo is set.
export function gitSourceOf(versionEntry) {
  if (!versionEntry || versionEntry.type !== 'git') return null;
  const s = versionEntry.source || {};
  if (!s.repo) return null;
  return { repo: s.repo, ref: s.ref || null, subdir: s.subdir && s.subdir !== '.' ? s.subdir : null };
}

// Build one version object from the publish form.
export function buildVersionEntry(meta) {
  const m = meta || {};
  const type = m.type === 'url' ? 'url' : 'git';
  const v = { version: (m.version || '').trim() || '1.0.0', type };
  if (type === 'git') {
    const source = { repo: (m.repo || '').trim() };
    const ref = (m.ref || '').trim();
    const subdir = (m.subdir || '').trim();
    if (ref) source.ref = ref;
    if (subdir && subdir !== '.') source.subdir = subdir;
    v.source = source;
  } else {
    v.source = { url: (m.url || '').trim() };
  }
  if ((m.hash || '').trim()) v.hash = m.hash.trim();
  return v;
}

// Build the registry entry (collection/<letter>/<ns>/<name>.json) from collected
// publish metadata. Only what the publisher authors — editorial flags are added
// by maintainers during review, and install counts come from a separate API.
export function buildRegistryEntry(meta) {
  const m = meta || {};
  const langs = (m.langs || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const entry = {
    ns: (m.ns || '').trim(),
    name: (m.name || '').trim(),
    title: (m.title || '').trim(),
    category: m.category || 'devops',
  };
  if ((m.tagline || '').trim()) entry.tagline = m.tagline.trim();
  if (langs.length) entry.langs = langs;
  if ((m.color || '').trim()) entry.color = m.color.trim();
  entry.versions = [buildVersionEntry(m)];
  return entry;
}

// Path of an entry's file within the registry repo (sharded by ns's first char).
export function registryEntryPath(entry) {
  const ns = (entry && entry.ns) || '';
  const name = (entry && entry.name) || '';
  return `collection/${ns[0] || '_'}/${ns}/${name}.json`;
}

// --- Presentation, derived client-side --------------------------------------
// The index is a pure catalog ({ collections, totalCollections, publishers }).
// featured / trending / categories are NOT baked into it — they're derived here
// from the flags/category on each entry, so the data contract isn't coupled to
// any one homepage and entries aren't duplicated.
export const CATEGORY_META = {
  payments:     { label: 'Payments',         icon: 'card' },
  ai:           { label: 'AI & ML',          icon: 'sparkle' },
  auth:         { label: 'Auth & Identity',  icon: 'key' },
  devops:       { label: 'DevOps & Infra',   icon: 'server' },
  comms:        { label: 'Communications',   icon: 'message' },
  data:         { label: 'Data & Analytics', icon: 'chart' },
  storage:      { label: 'Storage & CDN',    icon: 'box' },
  productivity: { label: 'Productivity',     icon: 'layout' },
};

// Shape the find page expects, derived from a fetched index. Accepts the pure
// catalog ({ collections }) and, defensively, an older { all } index — returns
// null for an empty/missing index so the host can fall back to its snapshot.
export function deriveHome(index) {
  const collections = (index && (index.collections || index.all)) || [];
  if (!collections.length) return null;
  const sorted = [...collections].sort((a, b) => a.title.localeCompare(b.title));
  const featured = sorted.filter((c) => c.featured).slice(0, 3);
  const trending = sorted.filter((c) => c.trending && !c.featured);
  const counts = {};
  for (const c of collections) counts[c.category] = (counts[c.category] || 0) + 1;
  const categories = Object.entries(CATEGORY_META)
    .map(([id, meta]) => ({ id, label: meta.label, icon: meta.icon, count: counts[id] || 0 }))
    .filter((c) => c.count > 0);
  return {
    featured,
    trending,
    categories,
    all: sorted,
    totalCollections: index.totalCollections != null ? index.totalCollections : collections.length,
    publishers: index.publishers != null ? index.publishers : new Set(collections.map((c) => c.ns)).size,
  };
}

// --- Install counts (separate public API) -----------------------------------
// The registry stores NO usage stats — counts come from a public API keyed by
// ns/name, configured via VITE_REGISTRY_STATS_URL. Returns null when the API
// is unconfigured or any call fails, so the UI hides the stat until it's live.
export const REGISTRY_STATS_URL = (import.meta.env && import.meta.env.VITE_REGISTRY_STATS_URL) || '';

export async function fetchInstallCount(ns, name) {
  if (!REGISTRY_STATS_URL || !ns || !name) return null;
  try {
    const res = await fetch(`${REGISTRY_STATS_URL.replace(/\/$/, '')}/installs/${ns}/${name}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data.installs === 'number') return data.installs;
    if (typeof data.count === 'number') return data.count;
    return null;
  } catch {
    return null; // API down / unreachable — caller hides the stat
  }
}
