// GitHub webhook signature verification. GitHub signs the raw request body with
// the webhook secret (HMAC-SHA256) and sends it as `X-Hub-Signature-256:
// sha256=<hex>`. We recompute over the EXACT raw bytes and compare in constant
// time. Without this, anyone who learns the endpoint could forge catalog changes
// into the projection — so the webhook is authenticated even in the demo.
import crypto from 'node:crypto';

export function verifyGithubSignature(rawBody, signatureHeader, secret) {
  if (!secret || !signatureHeader) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(String(signatureHeader));
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
