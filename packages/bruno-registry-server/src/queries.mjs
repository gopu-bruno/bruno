// All SQL the API runs. Reads project the `collections` cache; writes append to
// the advisory `install_events` log and bump a rollup. Everything a screen needs
// is computed here from (git projection + measured counts) — nothing the UI
// renders is invented or stored beyond those two sources.
import { query } from './db.mjs';
import { CATEGORIES } from '@usebruno/registry-core';

// A collections row + its install total -> the record shape the UI renders.
function recordFromRow(row, total = 0, { trending = false } = {}) {
  return {
    ns: row.ns,
    name: row.name,
    coordinate: row.coordinate,
    title: row.title,
    tagline: row.tagline || undefined,
    category: row.category,
    featured: !!row.featured,
    trending,
    latestVersion: row.latest_version || undefined,
    versions: row.versions,
    repo: row.repo || undefined,
    downloads: Number(total) || 0,
    installs: Number(total) || 0
  };
}

// --- Advisory install counts ------------------------------------------------
// Append an event (the truth) and bump the rollup (the fast read). Advisory:
// best-effort, eventually consistent, a lower bound — `git clone` bypasses it.
export async function reportInstall({ ns, name, source }) {
  const coordinate = `${ns}/${name}`;
  await query('INSERT INTO install_events (ns, name, source) VALUES ($1, $2, $3)', [ns, name, source || null]);
  const { rows } = await query(
    `INSERT INTO install_rollup (coordinate, ns, name, total)
       VALUES ($1, $2, $3, 1)
     ON CONFLICT (coordinate) DO UPDATE SET total = install_rollup.total + 1
     RETURNING total`,
    [coordinate, ns, name]
  );
  return { coordinate, installs: Number(rows[0].total) };
}

export async function getInstalls(ns, name) {
  const { rows } = await query('SELECT total FROM install_rollup WHERE coordinate = $1', [`${ns}/${name}`]);
  return rows.length ? Number(rows[0].total) : 0;
}

async function metaInt(key, fallback) {
  const { rows } = await query('SELECT value FROM meta WHERE key = $1', [key]);
  return rows.length ? Number(rows[0].value) : fallback;
}

// Installs in the trailing 30 days — the discover header's "installs this month".
async function monthlyInstalls() {
  const { rows } = await query(`SELECT count(*)::int AS n FROM install_events WHERE day >= current_date - INTERVAL '30 days'`);
  return rows[0].n;
}

// --- Discover ----------------------------------------------------------------
// featured = editorial flag from the git entry (until the trust migration moves
// it to cloud config). trending = top by MEASURED installs — install something
// and it climbs. categories = GROUP BY with the label/icon catalog. header =
// light totals from meta + monthly installs.
export async function getDiscover() {
  const featuredRows = (await query(
    `SELECT c.*, coalesce(r.total, 0) AS total
       FROM collections c LEFT JOIN install_rollup r USING (coordinate)
      WHERE c.featured = true
      ORDER BY total DESC, c.title ASC
      LIMIT 6`
  )).rows;

  const trendingRows = (await query(
    `SELECT c.*, coalesce(r.total, 0) AS total
       FROM collections c LEFT JOIN install_rollup r USING (coordinate)
      WHERE c.featured = false AND coalesce(r.total, 0) > 0
      ORDER BY total DESC, c.title ASC
      LIMIT 6`
  )).rows;

  const catRows = (await query(
    `SELECT category, count(*)::int AS n FROM collections GROUP BY category`
  )).rows;
  const counts = Object.fromEntries(catRows.map((r) => [r.category, r.n]));
  const categories = Object.entries(CATEGORIES)
    .map(([id, meta]) => ({ id, label: meta.label, icon: meta.icon, count: counts[id] || 0 }))
    .filter((c) => c.count > 0);

  return {
    featured: featuredRows.map((r) => recordFromRow(r, r.total)),
    trending: trendingRows.map((r) => recordFromRow(r, r.total, { trending: true })),
    categories,
    totalCollections: await metaInt('totalCollections', featuredRows.length),
    publishers: await metaInt('publishers', 0),
    monthlyInstalls: await monthlyInstalls()
  };
}

// --- Search ------------------------------------------------------------------
// FTS (tsvector) for relevance; trigram fallback so a fuzzy/short query still
// matches. Sorts: relevance | downloads | updated (updated unavailable -> title).
// Facets with counts are the part a client can't do at scale: category counts
// over the WHOLE result set (not just the page).
const PER_PAGE = 20;

function ftsQuery(q) {
  // Build a prefix tsquery: term1:* & term2:* — tolerant of partial words.
  const terms = String(q || '').toLowerCase().match(/[a-z0-9]+/g) || [];
  return terms.map((t) => `${t}:*`).join(' & ');
}

export async function search({ q = '', sort = 'relevance', page = 1, category = '' } = {}) {
  const where = [];
  const params = [];
  let rankExpr = '0';

  const tsq = ftsQuery(q);
  if (tsq) {
    params.push(tsq);
    const p = `$${params.length}`;
    // tsvector match OR trigram similarity on title/ns/name (fuzzy).
    params.push(q);
    const praw = `$${params.length}`;
    where.push(`(c.search @@ to_tsquery('simple', ${p}) OR c.title % ${praw} OR c.ns % ${praw} OR c.name % ${praw})`);
    rankExpr = `ts_rank(c.search, to_tsquery('simple', ${p})) + greatest(similarity(c.title, ${praw}), similarity(c.ns, ${praw}), similarity(c.name, ${praw}))`;
  }
  if (category) {
    params.push(category);
    where.push(`category = $${params.length}`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const orderSql =
    sort === 'downloads' ? 'total DESC, c.title ASC'
    : sort === 'updated' ? 'c.title ASC' // no real timestamp yet — see README note
    : `${tsq ? 'rank DESC, ' : ''}total DESC, c.title ASC`;

  const limit = PER_PAGE;
  const offset = (Math.max(1, page) - 1) * PER_PAGE;

  const sql = `
    SELECT c.*, coalesce(r.total, 0) AS total, ${rankExpr} AS rank
      FROM collections c LEFT JOIN install_rollup r USING (coordinate)
      ${whereSql}
      ORDER BY ${orderSql}
      LIMIT ${limit} OFFSET ${offset}`;
  const rows = (await query(sql, params)).rows;

  const total = Number((await query(`SELECT count(*)::int AS n FROM collections c ${whereSql}`, params)).rows[0].n);

  // Category facet counts over the full match set (ignoring the category filter
  // itself, so the user can switch facets) — the at-scale value clients can't do.
  const facetParams = [];
  const facetWhere = [];
  if (tsq) {
    facetParams.push(tsq); const p = `$${facetParams.length}`;
    facetParams.push(q); const praw = `$${facetParams.length}`;
    facetWhere.push(`(search @@ to_tsquery('simple', ${p}) OR title % ${praw} OR ns % ${praw} OR name % ${praw})`);
  }
  const facetWhereSql = facetWhere.length ? `WHERE ${facetWhere.join(' AND ')}` : '';
  const facetRows = (await query(
    `SELECT category, count(*)::int AS n FROM collections ${facetWhereSql} GROUP BY category`,
    facetParams
  )).rows;
  const facets = {
    category: facetRows
      .map((r) => ({ id: r.category, label: (CATEGORIES[r.category] || {}).label || r.category, count: r.n }))
      .sort((a, b) => b.count - a.count)
  };

  return {
    results: rows.map((r) => recordFromRow(r, r.total, { trending: false })),
    total,
    page: Math.max(1, page),
    perPage: PER_PAGE,
    facets
  };
}

// --- Collection detail -------------------------------------------------------
export async function getCollection(ns, name) {
  const { rows } = await query(
    `SELECT c.*, coalesce(r.total, 0) AS total
       FROM collections c LEFT JOIN install_rollup r USING (coordinate)
      WHERE c.coordinate = $1`,
    [`${ns}/${name}`]
  );
  if (!rows.length) return null;
  const rec = recordFromRow(rows[0], rows[0].total);
  rec.entry = rows[0].entry; // full git entry blob for the detail page
  return rec;
}
