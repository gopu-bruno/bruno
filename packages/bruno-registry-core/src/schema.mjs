// Entry validation + index-record derivation. This is the contract the catalog's
// build, the server's rebuild, and (the validating parts of) the app all share —
// a malformed entry one would reject must be rejected by all. The server NEVER
// invents catalog fields; it projects what the git entry authored, plus measured
// (counts) and derived (latestVersion, repo host) data.
import { SEMVER_RE, latestVersion } from './semver.mjs';
import { CATEGORIES } from './categories.mjs';

const REQUIRED = ['ns', 'name', 'title', 'category', 'versions'];
const SOURCE_TYPES = ['git', 'url'];

export function validateEntry(entry, where = '<entry>') {
  for (const k of REQUIRED) {
    const v = entry[k];
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) {
      throw new Error(`${where}: missing required field "${k}"`);
    }
  }
  if (!CATEGORIES[entry.category]) {
    throw new Error(`${where}: unknown category "${entry.category}"`);
  }
  if (!Array.isArray(entry.versions) || !entry.versions.length) {
    throw new Error(`${where}: "versions" must be a non-empty array`);
  }
  for (const v of entry.versions) {
    if (!v || !v.version) throw new Error(`${where}: a version is missing "version"`);
    if (!SEMVER_RE.test(v.version)) throw new Error(`${where}: version "${v.version}" must be semver`);
    if (!SOURCE_TYPES.includes(v.type)) throw new Error(`${where}: version ${v.version} has invalid type "${v.type}"`);
    if (!v.source || typeof v.source !== 'object') throw new Error(`${where}: version ${v.version} is missing "source"`);
    if (v.type === 'git' && !v.source.repo) throw new Error(`${where}: version ${v.version} (git) is missing source.repo`);
    if (v.type === 'url' && !v.source.url) throw new Error(`${where}: version ${v.version} (url) is missing source.url`);
  }
  return true;
}

// The repo/host string the detail page shows under "Source". For the latest
// version: a git repo URL, or the host of a url artifact. Derived, never stored.
function deriveRepo(versions) {
  const sorted = [...versions].sort((a, b) => (a.version < b.version ? 1 : -1));
  const latest = sorted[0] || {};
  if (latest.type === 'git' && latest.source && latest.source.repo) return latest.source.repo;
  if (latest.type === 'url' && latest.source && latest.source.url) {
    try { return new URL(latest.source.url).host; } catch { return null; }
  }
  return null;
}

// Project a git entry into the server's index record: authored git fields + a
// derived `latestVersion`/`repo`. Measured (`downloads`) and other derived
// (`updated`) fields are layered on by the DB read, not here. `featured` stays
// for now (editorial flag in the entry until the trust migration moves it to
// cloud config); `trending` is NEVER read from the entry — it's computed from
// install counts.
export function toIndexRecord(entry) {
  return {
    ns: entry.ns,
    name: entry.name,
    coordinate: `${entry.ns}/${entry.name}`,
    title: entry.title,
    tagline: entry.tagline || null,
    category: entry.category,
    featured: !!entry.featured,
    versions: entry.versions,
    latestVersion: latestVersion(entry.versions),
    repo: deriveRepo(entry.versions)
  };
}
