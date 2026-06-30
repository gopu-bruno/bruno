// Git-side helpers for the incremental webhook path: given a push's before/after
// SHAs, figure out exactly which catalog entry files changed, sync the working
// tree to the new commit, and read individual entries from disk.
//
// We read from the LOCAL catalog checkout (config.catalogDir) — the same source
// the full rebuild uses — so incremental and full-rebuild can never disagree
// about what's on disk. The webhook just tells us WHICH files to re-read.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const exec = promisify(execFile);
const git = (catalogDir, ...args) => exec('git', ['-C', catalogDir, ...args]);

// Only files that look like a catalog entry: collection/<letter>/<ns>/<name>.json
const ENTRY_RE = /^collection\/[^/]+\/[^/]+\/[^/]+\.json$/;

// collection/<letter>/<ns>/<name>.json -> "ns/name" (the coordinate), or null.
export function coordinateFromPath(relPath) {
  const m = String(relPath).match(/^collection\/[^/]+\/([^/]+)\/([^/]+)\.json$/);
  return m ? `${m[1]}/${m[2]}` : null;
}

// Cheap pre-check from the push payload (no git): could this push touch any
// catalog entry? Lets the webhook early-out of the fetch/diff on pushes that
// obviously change nothing under collection/ — e.g. the CI's `index.json` rebuild
// commit. Conservative: GitHub caps `commits[]` at 20, so if the list is
// missing/empty/at-cap we can't trust it's complete and return true (let the
// authoritative diff decide). Uses the `collection/` prefix, not the strict
// entry regex — a stray non-entry path under collection/ just means we don't skip.
export function pushMayTouchEntries(body) {
  const commits = body && Array.isArray(body.commits) ? body.commits : null;
  if (!commits || commits.length === 0 || commits.length >= 20) return true;
  return commits.some((c) =>
    [...(c.added || []), ...(c.modified || []), ...(c.removed || [])]
      .some((p) => String(p).startsWith('collection/'))
  );
}

// Fetch the new commit, list changed entry files between before..after, then sync
// the working tree to `after`. Returns the changed entry paths, or null when the
// base is unknown (branch create / force-push / missing history) — the caller
// should then fall back to a full rebuild to reconcile.
export async function fetchAndDiff({ catalogDir, branch, before, after }) {
  await git(catalogDir, 'fetch', 'origin', branch);

  const target = after || `origin/${branch}`;
  const baseUnknown = !before || /^0+$/.test(String(before));

  if (baseUnknown) {
    await git(catalogDir, 'reset', '--hard', target);
    return null; // signal: reconcile with a full rebuild
  }

  let changed = [];
  try {
    const { stdout } = await git(catalogDir, 'diff', '--name-only', before, after);
    changed = stdout.split('\n').map((s) => s.trim()).filter((p) => ENTRY_RE.test(p));
  } catch {
    // before/after not both resolvable locally — reconcile fully.
    await git(catalogDir, 'reset', '--hard', target);
    return null;
  }

  await git(catalogDir, 'reset', '--hard', target);
  return changed;
}

// Read one entry file from the synced checkout. Returns the parsed object, or
// null when the file no longer exists (a delisted/renamed entry).
export async function readEntryFile(catalogDir, relPath) {
  const full = join(catalogDir, relPath);
  if (!existsSync(full)) return null;
  return JSON.parse(await readFile(full, 'utf8'));
}
