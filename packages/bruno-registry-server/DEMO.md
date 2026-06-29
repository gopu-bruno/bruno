# Hybrid Registry — Stakeholder Demo Runbook

Three pieces, one story: **git is canonical, the cloud is a rebuildable
projection, counts are advisory.**

```
registry-hybrid   the catalog       collection/<ns>/<name>.json  (git, PR-gated)  ← canonical
registry-server   the projection    Postgres: discover/search/counts             ← rebuildable cache
bruno (app)       the surface       Registry takeover, talks to the server        ← consumer
```

## 0. One-time setup

```bash
# Server
cd ~/Documents/Projects/bruno/packages/bruno-registry-server
npm install
npm run db:up          # Postgres in Docker (host :5433)
npm run rebuild        # build the projection FROM GIT
npm start              # API on :4500   (leave running)
```

The app already defaults to `http://localhost:4500` (override with
`REGISTRY_API_URL`). Build the shared UI + run the app:

```bash
cd ~/Documents/Projects/bruno
npm run build --workspace=packages/bruno-registry-ui   # already built; re-run if you edit it
npm run dev:web        # terminal A
npm run dev:electron   # terminal B  → open the Registry takeover
```

## 1. The narrative (what to click / say)

1. **Open the Registry** in the app. Discover renders **from the server's
   projection** — featured, categories, totals. *"This page is served from
   Postgres, but Postgres is a cache — every row was built from git."*

2. **Search** `stripe`, `api`, a typo like `payment`. Results + **category
   facet counts** come from Postgres FTS. *"Facet counts at scale are the thing
   a client can't compute over a static file — that's why the server exists."*

3. **Install** a collection (git clone or url artifact). After it lands, the app
   fires an **advisory** install report. *"Notice install still works even if
   the server is down — the report is fire-and-forget, never blocks."*

4. **Back to Discover → Trending.** The thing you just installed **climbs**.
   *"Trending isn't editorial — it's computed from measured installs."*

5. **The money shot — wipe & rebuild.** In a terminal:
   ```bash
   docker exec registry-pg psql -U registry -d registry -c 'TRUNCATE collections;'
   ```
   Refresh Discover → **empty**. Then:
   ```bash
   cd ~/Documents/Projects/bruno/packages/bruno-registry-server && npm run rebuild
   ```
   Refresh → **everything's back from git**. Install counts also survived here,
   because `rebuild` only truncates the projection tables (`collections` / `meta`)
   — never the count tables.
   *"Wiping the projection costs nothing: it's all rebuilt from git. Counts live
   in separate tables, so a rebuild doesn't touch them."*

   **Be precise about the bigger claim.** If the whole DB *burned down* (volume
   gone), we'd lose nothing **canonical** — the catalog + index rebuild from git.
   We *would* lose the install counts, and that's fine **by design**: counts are
   **advisory**, not canonical — a lower bound, bypassed by a plain `git clone`,
   never blocking an install. Don't overclaim "counts survive a burn-down"; they
   don't, and they're not supposed to.
   *"The line is between canonical data — content + the index, in git — and
   advisory measurements. Lose the cloud, lose nothing canonical. That's an index,
   not a system of record."*

## 2. Why this shape (the one-liner per stakeholder question)

- *"Where's the data?"* — Content + the registration index live in **git**,
  PR-gated and forkable. The server only holds what git can't: search structures
  and **advisory** counts.
- *"What if your server dies?"* — `npm run rebuild`. The projection is a build
  artifact; counts are advisory (a `git clone` bypasses them anyway).
- *"Lock-in?"* — None. It's an open index over real git repos.
- *"Production stack?"* — Node + Fastify + Postgres (FTS + facets + an
  append-only event log). One service, rebuilt from git on a merge webhook.

## 3. Reset to a clean demo state

```bash
npm run db:reset       # wipe the volume (loses advisory counts — fine)
npm run rebuild        # catalog back from git
# optionally pre-seed some installs so Trending isn't empty:
for c in anthropic/claude-api datadog/api hubspot/crm-api; do
  for i in 1 2 3; do curl -s -XPOST "localhost:4500/v1/installs/$c" -d '{}' -H 'content-type: application/json' >/dev/null; done
done
```

## Not in this build (deferred, by decision)

- **Provider-qualified namespaces** (`provider:owner/name`) — still `ns/name`.
  Scheduled as the last migration pass.
- **stars / real `updated` timestamps**, **tag-discovery poller**, **device-flow
  OAuth publish**, **webhook-triggered rebuild** — see packages/bruno-registry-server/README.
