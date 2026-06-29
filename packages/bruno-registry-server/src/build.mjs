// Rebuild the projection from the git catalog. The heart of the "DB is a cache,
// git is canonical" claim: read collection/**/*.json, validate, derive the index
// record, TRUNCATE + repopulate the projection tables (and the tsvector for FTS).
// install_events / install_rollup are deliberately NOT touched — measured counts
// survive a rebuild. Run on every catalog change (merge webhook or poll).
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validateEntry, toIndexRecord } from '@usebruno/registry-core';
import { getPool, initSchema } from './db.mjs';

// Walk collection/**/*.json under a catalog dir, returning { entry, relPath }.
async function readCatalog(catalogDir) {
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
    await client.query('TRUNCATE collections; DELETE FROM meta;');

    for (const { entry } of found) {
      const rec = toIndexRecord(entry);
      await client.query(
        `INSERT INTO collections
           (coordinate, ns, name, title, tagline, category, featured, latest_version, repo, versions, entry, search)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
           setweight(to_tsvector('english', $4), 'A')
           || setweight(to_tsvector('english', coalesce($5,'')), 'B')
           || setweight(to_tsvector('simple', $2 || ' ' || $3), 'A'))`,
        [
          rec.coordinate, rec.ns, rec.name, rec.title, rec.tagline,
          rec.category, rec.featured, rec.latestVersion, rec.repo,
          JSON.stringify(rec.versions), JSON.stringify(entry)
        ]
      );
    }

    const publishers = new Set(found.map((f) => f.entry.ns)).size;
    await client.query(
      `INSERT INTO meta (key, value) VALUES ('totalCollections', $1), ('publishers', $2)`,
      [String(found.length), String(publishers)]
    );
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }

  return { count: found.length };
}
