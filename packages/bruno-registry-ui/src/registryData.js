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
  'https://raw.githubusercontent.com/gopu-bruno/collection-registry/main/index.json';

// GitHub contents API — reflects a just-merged PR immediately, but rate-limited
// to 60 req/hr unauthenticated.
export const REGISTRY_INDEX_CONTENTS_API_URL =
  'https://api.github.com/repos/gopu-bruno/collection-registry/contents/index.json';

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

// --- Live release stats (GitHub Releases) -----------------------------------
// The index already carries CI-baked usage stats (version/downloads/releases),
// but a collection's detail page re-fetches them straight from GitHub so the
// install count is current. Same model as the build pipeline: a version is a
// git tag, the install count is the sum of asset downloads, and several
// collections in one repo are told apart by a tag prefix.
const RELEASE_ASSET_RE = /opencollection.*\.ya?ml$/i;

export function parseGithubRepo(url) {
  const m = String(url || '').match(/github\.com[/:]([^/]+)\/([^/.\s]+)/i);
  return m ? { owner: m[1], repo: m[2].replace(/\.git$/, '') } : null;
}

export function releaseTagPrefix(collection) {
  const s = (collection && collection.source) || {};
  if (s.tagPrefix) return s.tagPrefix;
  if (s.subdir && s.subdir !== '.') return `${s.subdir}@`;
  return null; // whole-repo: every release belongs to this collection
}

function stripTagPrefix(tag, prefix) {
  if (prefix && tag.startsWith(prefix)) return tag.slice(prefix.length);
  return String(tag).replace(/^v/, '');
}

function assetDownloads(release) {
  return (release.assets || []).reduce((s, a) => s + (a.download_count || 0), 0);
}

function pickAsset(release) {
  const assets = release.assets || [];
  return assets.find((a) => RELEASE_ASSET_RE.test(a.name)) || assets[0] || null;
}

// Reduce raw GitHub releases to one collection's stats (shape matches the index).
export function deriveReleaseStats(releases, collection) {
  const prefix = releaseTagPrefix(collection);
  const mine = (releases || []).filter((r) => (prefix ? (r.tag_name || '').startsWith(prefix) : true));
  const sorted = mine.slice().sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));
  const latest = sorted.find((r) => !r.prerelease) || sorted[0] || null;
  const latestAsset = latest ? pickAsset(latest) : null;
  return {
    version: latest ? stripTagPrefix(latest.tag_name, prefix) : null,
    downloads: mine.reduce((s, r) => s + assetDownloads(r), 0),
    releaseCount: mine.length,
    latestAssetUrl: latestAsset ? latestAsset.browser_download_url : null,
    releases: sorted.slice(0, 20).map((r) => {
      const asset = pickAsset(r);
      return {
        version: stripTagPrefix(r.tag_name, prefix),
        tag: r.tag_name,
        publishedAt: r.published_at,
        downloads: assetDownloads(r),
        prerelease: !!r.prerelease,
        notes: (r.body || '').split('\n').find((l) => l.trim()) || '',
        assetUrl: asset ? asset.browser_download_url : null,
      };
    }),
  };
}

// The browser fetch below is UNAUTHENTICATED (a token can't be shipped to the
// client safely), so it's bound by GitHub's 60 req/hr-per-IP limit. To stay
// well under it we (a) only fetch on the detail page — never per card,
// (b) cache per session with a TTL so revisits are free, and (c) degrade
// silently to the CI-baked index stats on rate-limit/error rather than throw.
// The baked index.json (refreshed hourly by CI) is always the floor.
const RELEASE_TTL_MS = 10 * 60 * 1000; // 10 min
const _releaseMem = new Map(); // slug -> { at, stats }

function readReleaseCache(slug) {
  const m = _releaseMem.get(slug);
  if (m && Date.now() - m.at < RELEASE_TTL_MS) return m.stats;
  try {
    if (typeof sessionStorage !== 'undefined') {
      const raw = sessionStorage.getItem('oc-rel:' + slug);
      if (raw) {
        const o = JSON.parse(raw);
        if (Date.now() - o.at < RELEASE_TTL_MS) return o.stats;
      }
    }
  } catch { /* sessionStorage unavailable/full — ignore */ }
  return undefined;
}

function writeReleaseCache(slug, stats) {
  const rec = { at: Date.now(), stats };
  _releaseMem.set(slug, rec);
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('oc-rel:' + slug, JSON.stringify(rec));
  } catch { /* ignore quota/availability */ }
}

// Fetch a collection's live release stats from GitHub. Returns null when the
// repo can't be parsed OR when the live call fails / is rate-limited (the
// caller then keeps the index-baked stats); zero-stats if the repo has no
// releases. Pass { force: true } to bypass the session cache (e.g. a Refresh).
export async function fetchCollectionReleases(collection, { force = false } = {}) {
  const parsed = parseGithubRepo(collection && collection.source && collection.source.repo);
  if (!parsed) return null;
  const slug = `${collection.ns}/${collection.name}`;
  if (!force) {
    const cached = readReleaseCache(slug);
    if (cached !== undefined) return cached;
  }

  let res;
  try {
    res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases?per_page=100`, {
      cache: 'no-store',
      headers: { Accept: 'application/vnd.github+json' },
    });
  } catch {
    return null; // network error — fall back to baked stats
  }
  if (res.status === 403 || res.status === 429) return null; // rate-limited — degrade silently
  if (res.status === 404) {
    const zero = deriveReleaseStats([], collection);
    writeReleaseCache(slug, zero);
    return zero;
  }
  if (!res.ok) return null;
  const releases = (await res.json()).filter((r) => !r.draft);
  const stats = deriveReleaseStats(releases, collection);
  writeReleaseCache(slug, stats);
  return stats;
}
