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
