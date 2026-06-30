// Incremental projection update — the webhook fast path. Instead of rebuilding
// the whole projection on every merge, apply ONLY the entry files a push changed:
//   • file present  -> validate + upsert that one row   (new listing, version
//                       bump, title/tagline/category edit — all the same op)
//   • file gone      -> delete that coordinate            (delisting / rename)
// then refresh the header totals. install_events / install_rollup are untouched.
//
// Correctness net: this is the FAST path, not the only path. If the push's base
// is unknown (force-push / branch create / missing history) we fall back to a
// full rebuild to reconcile — and the full rebuild stays available as the
// periodic self-heal, so a missed/misapplied event can never permanently drift
// the projection from git.
import { getPool } from './db.mjs';
import { validateEntry } from '@usebruno/registry-core';
import { upsertCollection, deleteCollection, refreshMeta } from './rows.mjs';
import { fetchAndDiff, coordinateFromPath, readEntryFile } from './catalog.mjs';
import { build } from './build.mjs';
import { config } from './config.mjs';

export async function applyPush({ before, after }) {
  const changed = await fetchAndDiff({
    catalogDir: config.catalogDir,
    branch: config.catalogBranch,
    before,
    after
  });

  // Unknown base — reconcile with a full rebuild (still incremental-safe: same
  // row writer, counts untouched).
  if (changed === null) {
    const { count } = await build({ catalogDir: config.catalogDir });
    return { mode: 'full-rebuild', reason: 'unknown-base', count };
  }
  if (!changed.length) return { mode: 'incremental', changedFiles: 0, upserted: [], deleted: [], invalid: [] };

  const upserted = [], deleted = [], invalid = [];
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    for (const relPath of changed) {
      const entry = await readEntryFile(config.catalogDir, relPath);
      if (!entry) {
        const coordinate = coordinateFromPath(relPath);
        if (coordinate && (await deleteCollection(client, coordinate))) deleted.push(coordinate);
        continue;
      }
      try {
        validateEntry(entry, relPath);
      } catch (e) {
        // A bad entry shouldn't have merged, but if it did, skip it rather than
        // poison the whole apply. Surfaced in the response for visibility.
        invalid.push({ path: relPath, error: e.message });
        continue;
      }
      upserted.push(await upsertCollection(client, entry));
    }
    await refreshMeta(client);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }

  return { mode: 'incremental', changedFiles: changed.length, upserted, deleted, invalid };
}
