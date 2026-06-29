// The category catalog — id -> display label + icon name. The icons themselves
// render in the UI; this just supplies the label/icon id. Shared so the server's
// facet/discover output and the app's client-side derivation agree on the set.
export const CATEGORIES = {
  payments:     { label: 'Payments',         icon: 'card' },
  ai:           { label: 'AI & ML',          icon: 'sparkle' },
  auth:         { label: 'Auth & Identity',  icon: 'key' },
  devops:       { label: 'DevOps & Infra',   icon: 'server' },
  comms:        { label: 'Communications',   icon: 'message' },
  data:         { label: 'Data & Analytics', icon: 'chart' },
  storage:      { label: 'Storage & CDN',    icon: 'box' },
  productivity: { label: 'Productivity',     icon: 'layout' }
};

// The app historically referred to this map as CATEGORY_META — same data.
export const CATEGORY_META = CATEGORIES;

export const CATEGORY_IDS = Object.keys(CATEGORIES);
