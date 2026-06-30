# Bruno Registry — Architecture

How the registry works end to end: from an empty catalog, to someone publishing a
collection, to another user discovering and installing it.

## Mental model

> The registry stores **pointers, not payloads**. Git holds the truth, Postgres
> makes it searchable, PRs gate quality, and collection content is fetched on
> demand from wherever the publisher actually keeps it.

There is **one source of truth**: a git repository (`registry-hybrid`). Everything
else — the server's Postgres database and the static `index.json` — is a **cache
derived from git** and can be rebuilt from it at any time.

```
                       ┌─────────────────────────────┐
                       │   registry-hybrid (git repo) │  ← source of truth
                       │collection/<host>/<ns>/<n>.json│
                       │   index.json · verify files   │
                       └──────────────┬───────────────┘
              push webhook            │            CI: build-index.mjs
        ┌──────────────────┐         │         ┌──────────────────────┐
        ▼                  │         │         ▼                      │
┌──────────────┐          │         │   index.json (static)          │
│ Postgres      │  ← derived cache  │   committed back to repo       │
│ projection    │          │         │   served via raw git host     │
└──────┬────────┘          │         └───────────┬──────────────────┘
       │  /v1/* API                              │  fallback fetch
       ▼                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Bruno desktop app  (server primary, static index.json fallback)  │
└─────────────────────────────────────────────────────────────────┘
```

## Components

| Package | Role |
|---|---|
| `registry-hybrid` (separate repo) | The catalog. One JSON file per collection, plus `index.json`, the build script, and (pending) the namespace-verification files/scripts. **Source of truth.** |
| `bruno-registry-core` | Shared, host-agnostic logic: entry schema/validation (`schema.mjs`), semver (`semver.mjs`), generic git helpers (`catalog.mjs`). |
| `bruno-registry-server` | Keeps a clone of the catalog, projects it into Postgres, serves the `/v1` API. The curated, searchable, measurable layer. |
| `bruno-registry-ui` | Shared React UI + the two data sources (`ApiSource`, `StaticIndexSource`) and the source factory. |
| `bruno-app` / `bruno-electron` | The desktop app. Wires the UI to the server, handles install (git clone / url download), and drives the publish flow. |

## The data model

A collection is **one file**, grouped by the **host** that owns its namespace:

```
collection/github/stripe/stripe-api.json
collection/<host>/<ns>/<name>.json
```

`<host>` is the provider whose identity system can claim and edit names under it
— `github`, `gitlab`, `bitbucket`, … (a closed set). This **replaces the old
first-letter shard** (`collection/<l>/…`): the leading segment is no longer a
meaningless fan-out but a statement of *who may publish there* (see Act 3), and
it lets the verification check run per-host. Because the host is part of
identity, `github/stripe` and `gitlab/stripe` are **distinct** namespaces — the
same name on two providers is owned independently. The identity coordinate used
downstream (projection PK, `/v1/collection/...`) therefore becomes
`host/ns/name`.

All versions live in a single `versions` array. A version points at either a git
repo or a downloadable URL — never an uploaded payload:

```json
{
  "ns": "stripe",
  "name": "stripe-api",
  "title": "Stripe API",
  "tagline": "Official Stripe REST API collection.",
  "category": "payments",
  "versions": [
    {
      "version": "1.0.0",
      "type": "git",
      "source": { "repo": "https://github.com/stripe/stripe-api", "ref": "main", "subdir": "stripe-api" }
    },
    {
      "version": "1.1.0",
      "type": "url",
      "source": { "url": "https://cdn.example.com/stripe/stripe-api/1.1.0/opencollection.yml" },
      "hash": "sha256-<base64>"
    }
  ]
}
```

This shape is **host-agnostic**. A `git` source can point at GitHub, GitLab,
Bitbucket, or a self-hosted host; a `url` source is any HTTPS URL. Validation
rules live in `bruno-registry-core/src/schema.mjs`.

---

## The storyline

### Act 0 — The empty registry

The repo has an empty `collection/` directory and an `index.json` of
`{ "collections": [], "totalCollections": 0, "publishers": 0 }`. The server's
Postgres projection is empty. Nothing to discover yet.

### Act 1 — A publisher wants in

A publisher opens Bruno → Registry → **Publish**. The modal collects identity
(`ns`, `name`, `title`, `tagline`, `category`), a `version`, and a source:

- **git** — repo URL + optional `ref` (tag/branch/commit) + optional `subdir`, or
- **url** — a direct download URL + optional SHA-256 `hash`.

Plus a GitHub token to open the contribution. **The content is never uploaded** —
the publisher registers a pointer to where their collection already lives.

### Act 2 — The app turns it into a PR

`renderer:open-registry-pr` (`bruno-electron/src/ipc/registry.js`):

1. **Reads the existing entry** from upstream if the collection is already listed,
   so a version bump *appends* to the real `versions` array instead of clobbering
   a stale fork.
2. **Tries to write directly** — branch `publish-<ns>-<name>-<ts>`, PUT the file.
3. **Falls back to fork-and-PR** if it lacks write access.
4. **Opens a PR to `main`** — `Add <ns>/<name>` (or `…v<version>` for a bump).

Nothing is published yet — a human reviews the PR. This is the curation gate.

### Act 3 — Authorization: who may claim and edit a namespace

The catalog has **no server-side auth** — a publish is just a PR — so namespace
ownership is decided **at PR time**, before merge. The `<host>` segment of the
path (Act 0) names *which provider's identity system* owns the namespace, so the
check proves the PR author controls the matching account on that host, then
allows the change.

Two verification methods are under consideration — both are documented here so
we can decide later which way to go:

**Method 1 — `author` field in the source artifact.** The publisher names their
provider login(s) in the `author` field of the source `opencollection.yml`. At
PR time, CI fetches `opencollection.yml` from the pinned source (`repo` @ `ref`,
`subdir`) and confirms the PR author appears in `author`.

**Method 2 — a verification file in the source repo.** The publisher commits a
dedicated file (e.g. `.bruno-registry-owners`) into the source repo listing their
provider login(s). CI fetches it from the pinned source ref and confirms the PR
author is listed; the file's presence in a repo only a controller can write to is
itself the proof of access.

Common to both: the check reads from the **pinned source** (never from content
in the PR, which the author fully controls), and for an *edit* it resolves the
source from the namespace's existing (pre-PR) entry, so an established listing
can't be hijacked by repointing it at a repo the attacker owns.

> ⚠️ **Undecided and not yet enforced.** Neither method is wired into CI, and the
> host-based layout above is not yet migrated. Today
> `.github/workflows/build-index.yml` only runs entry validation
> (`build-index.mjs --check`) on PRs. Until one mechanism is chosen and a CI step
> performs the fetch-and-verify, ownership rests on manual PR review. See "Known
> gaps."

### Act 4 — Merge, and the server reacts

On merge, two independent things happen:

**(a) Static index rebuild (CI).** `build-index.yml` runs `build-index.mjs`, which
walks `collection/**/*.json`, validates each entry, verifies the path matches its
`host`/`ns`/`name`, computes `latestVersion`, and writes `index.json` back to the repo.
This file is the offline fallback the app reads when the server is down. Pure and
offline — no network, no stats.

**(b) Server ingestion (webhook).** GitHub fires a push webhook at
`/v1/webhook/github` (`server.mjs`):

1. **Verify** the HMAC-SHA256 signature; ignore non-push / non-`main`.
2. **Sync & diff** (`incremental.mjs` → `catalog.mjs`): `git fetch`,
   `git diff --name-only before..after` filtered to changed
   `collection/**/*.json`, then `git reset --hard`.
3. **Parse & validate** each changed entry; invalid entries are skipped and
   reported, not fatal.
4. **Upsert** into the `collections` table keyed by `coordinate = host/ns/name`,
   building a weighted `tsvector` (title A, tagline B). A vanished file → delisted.
5. **Refresh totals** (`totalCollections`, distinct `publishers`).

If the webhook's base commit is unknown (force-push, fresh branch), it discards
the incremental path and does a **full rebuild** (`build.mjs`) from the entire
`collection/` tree. Git is canonical, so a rebuild always reconciles.

### Act 5 — Discovery

The desktop app's data source is built by `createRegistrySource` in
`bruno-registry-ui/src/registryData.js`: an **`ApiSource` (server) primary** with a
**`StaticIndexSource` (raw `index.json`) fallback**. Every call goes through
`_viaServer()`, which hits the server first and only drops to the static index on
error (this flips the UI's Online/Offline badge).

- **`/v1/discover`** — featured (editorial flag, top 6 by installs), trending (top
  non-featured by installs), category counts, header totals incl. 30-day installs.
- **`/v1/search?q&category&sort&page`** — Postgres full-text search with a trigram
  fuzzy fallback, plus category facet counts over the whole result set.
- **`/v1/collection/:host/:ns/:name`** — the full entry for the detail page.

Listing and search are host-agnostic: cards key off `host/ns/name`, never raw URLs.

### Act 6 — Installation

The app reads the chosen version's source from the entry:

- **git source** → clone the repo (any host) at `ref`, take `subdir`.
- **url source** → HTTPS GET the artifact; if a `hash` is present, verify SHA-256
  (SRI-style) before importing.

Then it reports `POST /v1/installs/:ns/:name`, recording an `install_event`. These
advisory counts live in their own tables (`install_events`, `install_rollup`),
untouched by rebuilds, and feed "trending" and install-count displays.

---

## Postgres projection

`db.mjs` defines the schema. Key tables:

- **`collections`** — one row per collection. `coordinate` (PK = `host/ns/name`), `ns`,
  `name`, `title`, `tagline`, `category`, `featured`, `latest_version`, `repo`
  (derived from latest version's source), `versions` (JSONB), `entry` (full JSONB),
  `search` (TSVECTOR, GIN-indexed; title also trigram-indexed for fuzzy).
- **`meta`** — `key/value` header totals (`totalCollections`, `publishers`).
- **`install_events`** / **`install_rollup`** — measured install counts, separate
  from git so rebuilds never clobber them.

The same `upsertCollection()` path is used by both incremental ingestion and full
rebuild, so the two can never diverge.

## Host-agnosticism status

| Layer | Agnostic? | Notes |
|---|---|---|
| Entry schema | ✅ | `type: git \| url`, generic source URLs |
| Version resolution | ✅ | Pure local semver, no host APIs |
| Content fetch (git) | ✅ | Standard git CLI, any host |
| Content fetch (url) | ✅ | HTTPS GET + SRI hash |
| Listing / search / browse | ✅ | Keys off `host/ns/name`; `treeUrl()` handles GitHub/GitLab/Bitbucket + fallback |
| Index retrieval | ✅ logic | Server primary; static fallback URL defaults to a GitHub raw URL (overridable via `VITE_REGISTRY_INDEX_URL`) |
| Publish (PR flow) | ❌ | GitHub Contents/Pulls API, fork-and-PR, PAT |
| Webhook ingestion | ❌ | GitHub push event + `x-hub-signature-256` only |

The entire **consume** path (retrieve → list → search → browse → fetch → install)
is host-agnostic. Only **contribution** (publish PR + webhook) is GitHub-locked.

## Known gaps

- **Namespace verification is undecided and unenforced.** Two source-proof
  methods are documented (Act 3): an `author` field in the source
  `opencollection.yml`, or a committed verification file in the source repo. No
  CI step performs either fetch-and-verify yet. Pick one, then add the CI step.
- **Host-based layout is not migrated.** The data model now describes
  `collection/<host>/<ns>/<name>.json` and a `host/ns/name` coordinate, but the
  tree, the projection PK, and the `/v1/collection/...` route still use the
  first-letter shard and `ns/name`. Migrating is a breaking change to the
  coordinate and that route.
- **Static fallback URL is a literal GitHub raw URL** in the Electron default
  (`DEFAULT_REGISTRY_INDEX_URL`). Web builds can override via
  `VITE_REGISTRY_INDEX_URL`; the app default should move to config for full
  host-neutrality.
- **Publish + webhook are GitHub-specific.** Full agnosticism on the contribution
  side needs a `GitProvider` abstraction (branch/read/write/PR) and per-host
  webhook verification.

## Configuration

Server (`bruno-registry-server/src/config.mjs`): `REGISTRY_CATALOG_DIR`,
`REGISTRY_CATALOG_GIT`, webhook secret, Postgres connection, listen port.
App: `REGISTRY_API_URL` (server base, default `http://localhost:4500`).
Web/UI: `VITE_REGISTRY_INDEX_URL`, `VITE_REGISTRY_STATS_URL`.
