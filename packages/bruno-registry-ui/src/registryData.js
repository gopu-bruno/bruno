// Bundled fallback snapshot — opencollection.dev
// Identity model: GitHub-style namespace (owner/repo); the registry is a thin
// index over real git repos. This is only a pre-load fallback shaped exactly
// like the live index (fetchRegistryIndex); real data replaces it on mount.
// No usage stats are stored — only authored metadata + editorial flags.

// Semver + the category catalog are shared with the server via the isomorphic
// @usebruno/registry-core, so version resolution and category labels can't drift
// between the app and the projection. (The node-only SSRF guard in that package
// is NOT imported here — it lives behind the "/ssrf" subpath.)
import { cmpVersion, CATEGORY_META } from '@usebruno/registry-core';

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

// Semver precedence now lives in @usebruno/registry-core (imported at the top of
// this file) — one implementation shared with the server, so the app and the
// rebuild can't disagree on which version is latest. Re-exported here so existing
// consumers (`import { cmpVersion } from '@usebruno/registry-ui'`) keep working.
export { cmpVersion };

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
// any one homepage and entries aren't duplicated. The category catalog itself
// (id -> label/icon) lives in @usebruno/registry-core, shared with the server's
// facet/discover output; re-exported here under its long-standing name.
export { CATEGORY_META };

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

// --- RegistrySource abstraction (Phase C) -----------------------------------
// One interface, two backings, so the same host code works against either half
// of the hybrid model:
//
//   StaticIndexSource — ONE index.json on any host (raw CDN, GitHub/GitLab/
//     self-hosted). deriveHome + client-side search. Works offline/serverless;
//     no counts, no real facets. This IS the deriveHome path, not thrown away.
//
//   ApiSource — the server's projection: /discover (real trending from measured
//     installs), /search (FTS + facet counts at scale), /collection, /installs
//     (read + advisory report). Honors the advisory contract — getDiscover()
//     falls back to a passed-in static source when the server is unreachable, so
//     browse/install survive a server outage.
//
// Both take an injected IO ({ getJson, postJson }) so the host decides transport:
// the website uses browser fetch; the desktop app routes through the Electron
// main process (renderer CSP blocks external fetch). Methods:
//   getDiscover()                      -> { featured, trending, categories, totalCollections, publishers, monthlyInstalls? }
//   search(query, filters)             -> { results, total, facets, page, perPage }
//   getCollection(ns, name)            -> a single record (or null)
//   getInstallCount(ns, name)          -> number | null
//   reportInstall(ns, name, source)    -> void (advisory; never throws to caller)

const browserIo = {
  getJson: (url, headers) => fetch(url, { cache: 'no-store', headers }).then((r) => {
    if (!r.ok) throw new Error(`GET ${url} -> ${r.status}`);
    return r.json();
  }),
  postJson: (url, body) => fetch(url, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {})
  }).then((r) => (r.ok ? r.json() : null))
};

export class StaticIndexSource {
  constructor({ indexUrl, statsUrl, io } = {}) {
    this.indexUrl = indexUrl || REGISTRY_INDEX_URL;
    this.statsUrl = statsUrl || REGISTRY_STATS_URL;
    this.io = io || browserIo;
    this._index = null;
    // Which backing served the last call — always 'static' for this source. The
    // host reads `source.lastMode` to show a "server vs offline index" badge.
    this.lastMode = 'static';
  }
  async _load() {
    if (!this._index) this._index = await this.io.getJson(this.indexUrl);
    return this._index;
  }
  async getDiscover() {
    return deriveHome(await this._load());
  }
  // Client-side search over the cached index — substring match on title/ns/name/
  // tagline, optional category filter, local facet counts.
  async search(query, filters = {}) {
    const index = await this._load();
    const all = (index && (index.collections || index.all)) || [];
    const q = String(query || '').trim().toLowerCase();
    const inCategory = (c) => !filters.category || c.category === filters.category;
    const matches = (c) => !q || [c.title, c.ns, c.name, c.tagline].some((f) => String(f || '').toLowerCase().includes(q));
    const results = all.filter((c) => inCategory(c) && matches(c)).sort((a, b) => a.title.localeCompare(b.title));
    const facetSet = all.filter(matches);
    const counts = {};
    for (const c of facetSet) counts[c.category] = (counts[c.category] || 0) + 1;
    const category = Object.entries(counts)
      .map(([id, count]) => ({ id, label: (CATEGORY_META[id] || {}).label || id, count }))
      .sort((a, b) => b.count - a.count);
    return { results, total: results.length, page: 1, perPage: results.length, facets: { category } };
  }
  async getCollection(ns, name) {
    const index = await this._load();
    const all = (index && (index.collections || index.all)) || [];
    return all.find((c) => c.ns === ns && c.name === name) || null;
  }
  async getInstallCount(ns, name) {
    if (!this.statsUrl) return null;
    try {
      const data = await this.io.getJson(`${this.statsUrl.replace(/\/$/, '')}/installs/${ns}/${name}`);
      return typeof data.installs === 'number' ? data.installs : (typeof data.count === 'number' ? data.count : null);
    } catch {
      return null;
    }
  }
  async reportInstall() { /* static index has no write path — advisory no-op */ }
}

export class ApiSource {
  // `fallback` is an optional StaticIndexSource used when the server is
  // unreachable — the advisory contract: browse/install survive an outage.
  constructor({ baseUrl, io, fallback } = {}) {
    this.base = String(baseUrl || '').replace(/\/$/, '');
    this.io = io || browserIo;
    this.fallback = fallback || null;
    // Which backing served the last catalog call: 'api' (the live server),
    // 'static' (fell back to the git-backed index), or 'error' (both failed).
    // The host reads `source.lastMode` after a call to render a status badge —
    // making the advisory fallback visible instead of silent.
    this.lastMode = null;
  }
  // Run a server call; on failure transparently fall back to the static index
  // and record which one actually answered.
  async _viaServer(serverCall, fallbackCall) {
    try {
      const out = await serverCall();
      this.lastMode = 'api';
      return out;
    } catch (e) {
      if (this.fallback) {
        this.lastMode = 'static';
        return fallbackCall();
      }
      this.lastMode = 'error';
      throw e;
    }
  }
  async getDiscover() {
    return this._viaServer(
      () => this.io.getJson(`${this.base}/v1/discover`),
      () => this.fallback.getDiscover()
    );
  }
  async search(query, filters = {}) {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.category) params.set('category', filters.category);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.page) params.set('page', String(filters.page));
    return this._viaServer(
      () => this.io.getJson(`${this.base}/v1/search?${params.toString()}`),
      () => this.fallback.search(query, filters)
    );
  }
  async getCollection(ns, name) {
    try {
      const out = await this.io.getJson(`${this.base}/v1/collection/${ns}/${name}`);
      this.lastMode = 'api';
      return out;
    } catch (e) {
      if (this.fallback) {
        this.lastMode = 'static';
        return this.fallback.getCollection(ns, name);
      }
      this.lastMode = 'error';
      return null;
    }
  }
  async getInstallCount(ns, name) {
    try {
      const data = await this.io.getJson(`${this.base}/v1/installs/${ns}/${name}`);
      return typeof data.installs === 'number' ? data.installs : null;
    } catch {
      return null;
    }
  }
  async reportInstall(ns, name, source) {
    // Advisory, fire-and-forget — failures must never surface to the user or
    // block the install that already succeeded.
    try {
      await this.io.postJson(`${this.base}/v1/installs/${ns}/${name}`, { source });
    } catch { /* swallow — advisory */ }
  }
}

// Build a source from a descriptor. `{ kind: 'api', baseUrl }` with an optional
// static fallback, or `{ kind: 'static', indexUrl, statsUrl }`.
export function createRegistrySource(descriptor = {}, io) {
  if (descriptor.kind === 'api' && descriptor.baseUrl) {
    const fallback = descriptor.indexUrl
      ? new StaticIndexSource({ indexUrl: descriptor.indexUrl, statsUrl: descriptor.statsUrl, io })
      : null;
    return new ApiSource({ baseUrl: descriptor.baseUrl, io, fallback });
  }
  return new StaticIndexSource({ indexUrl: descriptor.indexUrl, statsUrl: descriptor.statsUrl, io });
}
