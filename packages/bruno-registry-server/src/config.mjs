// All knobs in one place.
//
// Postgres is the projection store — a CACHE, not the system of record. The
// `collections` projection tables rebuild from git on every catalog change; only
// the `install_events` (measured, advisory) genuinely persist. Wiping the DB
// loses nothing canonical: re-run the rebuild and the catalog is back from git.
export const config = {
  port: Number(process.env.PORT || 4500),
  host: process.env.HOST || '127.0.0.1',

  // Matches docker-compose.yml (host port 5433 to avoid clashing with a local 5432).
  databaseUrl: process.env.DATABASE_URL || 'postgres://registry:registry@127.0.0.1:5433/registry',

  // The git catalog the projection is built from. Prefer a local checkout for a
  // fast dev loop (no clone); fall back to cloning the public repo.
  catalogDir: process.env.REGISTRY_CATALOG_DIR || '/Users/gopu_bruno/Documents/Projects/registry-hybrid',
  catalogGit: process.env.REGISTRY_CATALOG_GIT || 'https://github.com/gopu-bruno/registry-hybrid',
  catalogBranch: process.env.REGISTRY_CATALOG_BRANCH || 'main'
};
