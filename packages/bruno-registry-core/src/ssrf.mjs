// SSRF guards for any URL the server fetches on behalf of PR-supplied data
// (tag-discovery poller, url-artifact probes). The catalog is open to PRs, so a
// `source.url`/`source.repo` is attacker-controllable — the server must never be
// tricked into hitting an internal address.
//
// NODE-ONLY (imports node:net). Exposed via the "./ssrf" subpath so it never
// enters a browser bundle — the app imports only the isomorphic core.
//
// Rules (P0): https only, block private/loopback/link-local IP literals, require
// a real public hostname. A full guard also re-checks the resolved IP after DNS.
import net from 'node:net';

function isPrivateV4(ip) {
  const p = ip.split('.').map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return true;
  const [a, b] = p;
  if (a === 10) return true;                        // 10.0.0.0/8
  if (a === 127) return true;                       // loopback
  if (a === 0) return true;                          // 0.0.0.0/8
  if (a === 169 && b === 254) return true;           // link-local (incl. cloud metadata 169.254.169.254)
  if (a === 172 && b >= 16 && b <= 31) return true;  // 172.16.0.0/12
  if (a === 192 && b === 168) return true;           // 192.168.0.0/16
  if (a >= 224) return true;                         // multicast / reserved
  return false;
}

function isPrivateV6(ip) {
  const s = ip.toLowerCase().replace(/^\[|\]$/g, '');
  if (s === '::1' || s === '::') return true;        // loopback / unspecified
  if (s.startsWith('fc') || s.startsWith('fd')) return true; // unique-local fc00::/7
  if (s.startsWith('fe80')) return true;             // link-local
  if (s.startsWith('::ffff:')) {                     // IPv4-mapped
    const v4 = s.slice('::ffff:'.length);
    return net.isIPv4(v4) ? isPrivateV4(v4) : true;
  }
  return false;
}

// Throws on a disallowed URL; returns the parsed URL when safe.
export function assertSafePublicUrl(raw, { allowedProtocols = ['https:'] } = {}) {
  let u;
  try {
    u = new URL(String(raw));
  } catch {
    throw new Error(`Not a valid URL: ${raw}`);
  }
  if (!allowedProtocols.includes(u.protocol)) {
    throw new Error(`Blocked protocol "${u.protocol}" (allowed: ${allowedProtocols.join(', ')})`);
  }
  const host = u.hostname;
  if (!host) throw new Error('URL has no host');
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal') || host.endsWith('.local')) {
    throw new Error(`Blocked internal host: ${host}`);
  }
  if (net.isIPv4(host) && isPrivateV4(host)) throw new Error(`Blocked private IPv4: ${host}`);
  if (net.isIPv6(host) && isPrivateV6(host)) throw new Error(`Blocked private IPv6: ${host}`);
  return u;
}

export function isSafePublicUrl(raw, opts) {
  try {
    assertSafePublicUrl(raw, opts);
    return true;
  } catch {
    return false;
  }
}
