// The single way a projection row is written — shared by the full rebuild
// (build.mjs) and the incremental webhook apply (incremental.mjs), so the two
// paths can't diverge on how a row (or its tsvector) is computed. Both go
// through upsertCollection; full rebuild just runs it over every entry after a
// TRUNCATE, incremental runs it over the changed ones.
import { toIndexRecord } from '@usebruno/registry-core';

// tsvector built inline from the same params as the row (title/tagline/ns/name).
const SEARCH = `
  setweight(to_tsvector('english', $4), 'A')
  || setweight(to_tsvector('english', coalesce($5,'')), 'B')
  || setweight(to_tsvector('simple', $2 || ' ' || $3), 'A')`;

// Insert-or-update one collection row from a git entry. ON CONFLICT keys on the
// coordinate, so a version bump / title edit updates in place; a brand-new
// listing inserts. Returns the coordinate.
export async function upsertCollection(client, entry) {
  const rec = toIndexRecord(entry);
  await client.query(
    `INSERT INTO collections
       (coordinate, ns, name, title, tagline, category, featured, latest_version, repo, versions, entry, search)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, ${SEARCH})
     ON CONFLICT (coordinate) DO UPDATE SET
       ns = EXCLUDED.ns, name = EXCLUDED.name, title = EXCLUDED.title, tagline = EXCLUDED.tagline,
       category = EXCLUDED.category, featured = EXCLUDED.featured, latest_version = EXCLUDED.latest_version,
       repo = EXCLUDED.repo, versions = EXCLUDED.versions, entry = EXCLUDED.entry, search = EXCLUDED.search`,
    [
      rec.coordinate, rec.ns, rec.name, rec.title, rec.tagline,
      rec.category, rec.featured, rec.latestVersion, rec.repo,
      JSON.stringify(rec.versions), JSON.stringify(entry)
    ]
  );
  return rec.coordinate;
}

// Remove a listing (a delisted/renamed entry). Returns true if a row was deleted.
export async function deleteCollection(client, coordinate) {
  const res = await client.query('DELETE FROM collections WHERE coordinate = $1', [coordinate]);
  return res.rowCount > 0;
}

// Recompute the header totals from the current projection. Cheap aggregate; run
// after any change (full or incremental) so the discover header stays exact.
export async function refreshMeta(client) {
  const total = (await client.query('SELECT count(*)::int AS n FROM collections')).rows[0].n;
  const publishers = (await client.query('SELECT count(DISTINCT ns)::int AS n FROM collections')).rows[0].n;
  await client.query(
    `INSERT INTO meta (key, value) VALUES ('totalCollections', $1), ('publishers', $2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [String(total), String(publishers)]
  );
  return { total, publishers };
}
