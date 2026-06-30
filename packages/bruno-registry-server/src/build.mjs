// Rebuild the projection from the git catalog. The heart of the "DB is a cache,
// git is canonical" claim: read collection/**/*.json, validate, derive the index
// record, TRUNCATE + repopulate the projection tables (and the tsvector for FTS).
// install_events / install_rollup are deliberately NOT touched — measured counts
// survive a rebuild. Run on every catalog change (merge webhook or poll).
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validateEntry } from '@usebruno/registry-core';
import { getPool, initSchema } from './db.mjs';
import { upsertCollection, refreshMeta } from './rows.mjs';

// Walk collection/**/*.json under a catalog dir, returning { entry, relPath }.
export async function readCatalog(catalogDir) {
  const collectionsDir = join(catalogDir, 'collection');
  const out = [];
  async function walk(dir, rel) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const d of entries) {
      const childRel = rel ? `${rel}/${d.name}` : d.name;
      if (d.isDirectory()) await walk(join(dir, d.name), childRel);
      else if (d.name.endsWith('.json')) {
        let entry;
        try {
          entry = JSON.parse(await readFile(join(dir, d.name), 'utf8'));
        } catch (e) {
          throw new Error(`Invalid JSON in collection/${childRel}: ${e.message}`);
        }
        validateEntry(entry, `collection/${childRel}`);
        out.push({ entry, relPath: childRel });
      }
    }
  }
  await walk(collectionsDir, '');
  return out;
}

export async function build({ catalogDir }) {
  const found = await readCatalog(catalogDir);
  if (!found.length) throw new Error(`No collections found under ${catalogDir}/collection`);

  await initSchema();
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Projection only — counts (install_events / install_rollup) are left intact.
    // Full rebuild = truncate, then upsert every entry through the SAME row writer
    // the incremental webhook path uses, so the two can't diverge.
    await client.query('TRUNCATE collections;');
    for (const { entry } of found) await upsertCollection(client, entry);
    await refreshMeta(client);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }

  return { count: found.length };
}
