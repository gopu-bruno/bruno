# registry-server

A **read-optimized projection** of the git-canonical OpenCollection registry,
plus a small **advisory install-count event log**. This is the cloud half of the
hybrid model.

## The governing rule

> **Canonical data lives in git. The cloud holds only rebuildable projections.**

This server is a **cache, not a system of record**. Test every table against:
*does it survive if the server vanishes?*

| Data | Where it's canonical | In this server |
|---|---|---|
| Collection content | git repos | not stored |
| Registration / index entry | git (PR-gated) | `collections` — **projection, rebuilt from git** |
| Search / discover / facets | — | derived from the projection |
| Install counts | nowhere (measured) | `install_events` — **advisory, persists**, a lower bound |

Everything except install counts is rebuildable from git. Counts are the one
thing git can't hold — they're *measured*, and explicitly **advisory**: a plain
`git clone` bypasses them, so they're a lower bound and never block an install.

## Stack

- **Node + Fastify** — lean JSON API. The schema/semver logic in `src/core/` is
  the shared "registry-core" — the same validation the catalog's `build-index`
  runs, so the projection can't drift from what the build accepts.
- **Postgres** — single store. JSONB entry blobs + `tsvector` FTS (`pg_trgm` for
  fuzzy) + `GROUP BY` facet counts + an append-only events table with an atomic
  rollup. No second system.

## Run it

```bash
npm install
npm run db:up        # start Postgres (docker compose, host port 5433)
npm run rebuild      # build the projection FROM GIT  (git -> Postgres)
npm start            # serve the API on :4500
# or all three:
npm run demo
```

By default the rebuild reads the **local** catalog checkout at
`/Users/.../registry-hybrid` (fast dev loop, no network). Point it elsewhere:

```bash
REGISTRY_CATALOG_DIR=/path/to/registry-hybrid npm run rebuild   # local path
REGISTRY_CATALOG_DIR= npm run rebuild                            # force git clone
```

## The demo moment — wipe & rebuild

The projection is a build artifact. Prove it:

```bash
docker exec registry-pg psql -U registry -d registry -c 'TRUNCATE collections;'
curl localhost:4500/v1/discover     # totalCollections: 0  — catalog gone
npm run rebuild                     # git -> Postgres, seconds
curl localhost:4500/v1/discover     # back to 8 — rebuilt from git
curl localhost:4500/v1/installs/stripe/stripe-api   # counts SURVIVED
```

Install counts survive because the rebuild only `TRUNCATE`s the projection
tables — never `install_events`. That's the whole thesis in one command: lose
the cloud, lose nothing canonical.

## Endpoints (UI-scoped — each exists because a screen renders it)

| Method | Path | Returns |
|---|---|---|
| GET | `/health` | `{ ok }` |
| GET | `/v1/discover` | `featured[]`, `trending[]`, `categories[]`, header `{ totalCollections, publishers, monthlyInstalls }` |
| GET | `/v1/search?q&sort&page&category` | `{ results[], total, facets, page, perPage }` |
| GET | `/v1/collection/:ns/:name` | index record + full git `entry` |
| GET | `/v1/installs/:ns/:name` | `{ installs }` (advisory) |
| POST | `/v1/installs/:ns/:name` | report a successful install (advisory; body `{ source }`) |

- `featured` = editorial flag read from the git entry (moves to cloud config
  with the trust migration). `trending` = top by **measured** install count —
  install something and it climbs. `sort=updated` falls back to title until the
  index records a real `updated` timestamp (see below).

## Known scope / deferred (honest list)

- **`stars` / `updated`**: the design's search can sort by these. We don't source
  them yet (host stars API / git commit time), so `sort=updated` falls back to
  title and there's no stars column. UI-scoped discipline — don't store what no
  screen can truthfully fill yet.
- **Provider-qualified namespaces**: still `ns/name` (`coordinate = ns/name`).
  The namespace migration is a separate, later pass; the endpoints move to
  `:provider/:owner/:name` then.
- **Tag-discovery poller**, **trust recompute**, **SSRF-guarded artifact probes**:
  `src/core/ssrf.mjs` is in place; the poller that uses it is future work.
- **Webhook-triggered rebuild**: today `rebuild` is manual / cron. Prod wires it
  to an index-repo merge webhook.
