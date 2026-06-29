// Semver precedence — the SINGLE implementation. Core (major.minor.patch)
// compares numerically; a prerelease (e.g. 1.0.0-beta) ranks BELOW its release;
// prerelease identifiers compare dot-wise (numeric vs string). Returns >0 if a is
// newer than b. Shared by the server (rebuild + API) and the app (registry-ui)
// so version resolution can't drift between them.

export const SEMVER_RE = /^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

export function cmpVersion(a, b) {
  const parse = (v) => {
    const core = String(v == null ? '' : v).trim().replace(/^v/, '').split('+')[0];
    const [main, pre] = core.split('-');
    const nums = main.split('.').map((n) => (/^\d+$/.test(n) ? Number(n) : 0));
    while (nums.length < 3) nums.push(0);
    return { nums, pre: pre || null };
  };
  const pa = parse(a), pb = parse(b);
  for (let i = 0; i < 3; i++) if (pa.nums[i] !== pb.nums[i]) return pa.nums[i] - pb.nums[i];
  if (!pa.pre && !pb.pre) return 0;
  if (!pa.pre) return 1; // release outranks prerelease
  if (!pb.pre) return -1;
  const ai = pa.pre.split('.'), bi = pb.pre.split('.');
  for (let i = 0; i < Math.max(ai.length, bi.length); i++) {
    const x = ai[i], y = bi[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    const xn = /^\d+$/.test(x), yn = /^\d+$/.test(y);
    if (xn && yn) { if (Number(x) !== Number(y)) return Number(x) - Number(y); }
    else if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}

// The newest version object in a `versions[]` array, or null.
export function latestVersionEntry(versions) {
  if (!Array.isArray(versions) || !versions.length) return null;
  return [...versions].sort((a, b) => cmpVersion(b.version, a.version))[0];
}

export const latestVersion = (versions) => {
  const v = latestVersionEntry(versions);
  return v ? v.version : null;
};
