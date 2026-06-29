// Postgres access — one pool, one database, shared by the rebuild and the API.
// The handoff's call: a single store for everything. Two concerns, two groups of
// tables:
//
//   collections (+ tsvector FTS, category index) — the PROJECTION. TRUNCATEd and
//     rebuilt from git on every rebuild. Nothing here is canonical.
//
//   install_events / install_rollup — the advisory count log. The rebuild NEVER
//     touches these: counts are measured, not in git, and a `git clone` bypasses
//     them, so they're advisory by nature and allowed to live outside git.
import pg from 'pg';
import { config } from './config.mjs';

const { Pool } = pg;

let pool;
export function getPool() {
  if (!pool) pool = new Pool({ connectionString: config.databaseUrl, max: 10 });
  return pool;
}

export const query = (text, params) => getPool().query(text, params);

// Idempotent schema. Safe to call on every boot and before every rebuild.
export async function initSchema() {
  const pool = getPool();
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS pg_trgm;

    CREATE TABLE IF NOT EXISTS collections (
      coordinate     TEXT PRIMARY KEY,
      ns             TEXT NOT NULL,
      name           TEXT NOT NULL,
      title          TEXT NOT NULL,
      tagline        TEXT,
      category       TEXT NOT NULL,
      featured       BOOLEAN NOT NULL DEFAULT false,
      latest_version TEXT,
      repo           TEXT,
      versions       JSONB NOT NULL,
      entry          JSONB NOT NULL,
      search         TSVECTOR
    );
    CREATE INDEX IF NOT EXISTS collections_search_idx   ON collections USING GIN (search);
    CREATE INDEX IF NOT EXISTS collections_category_idx ON collections (category);
    CREATE INDEX IF NOT EXISTS collections_title_trgm   ON collections USING GIN (title gin_trgm_ops);

    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS install_events (
      id     BIGSERIAL PRIMARY KEY,
      ns     TEXT NOT NULL,
      name   TEXT NOT NULL,
      ts     TIMESTAMPTZ NOT NULL DEFAULT now(),
      day    DATE NOT NULL DEFAULT current_date,
      source TEXT
    );
    CREATE INDEX IF NOT EXISTS install_events_coord_idx ON install_events (ns, name);
    CREATE INDEX IF NOT EXISTS install_events_day_idx   ON install_events (day);

    CREATE TABLE IF NOT EXISTS install_rollup (
      coordinate TEXT PRIMARY KEY,
      ns         TEXT NOT NULL,
      name       TEXT NOT NULL,
      total      BIGINT NOT NULL DEFAULT 0
    );
  `);
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
