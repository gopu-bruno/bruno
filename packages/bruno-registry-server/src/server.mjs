// The HTTP API — a thin read layer over the projection + the advisory count
// writes. Endpoints are UI-scoped: each exists because a rendered screen consumes
// it. Nothing here is a source of truth; if it burns down, rebuild from git.
//
//   GET  /health
//   GET  /v1/discover                      -> featured / trending / categories / header
//   GET  /v1/search?q&sort&page&category   -> { results, total, facets }
//   GET  /v1/collection/:ns/:name          -> index record + full git entry
//   GET  /v1/installs/:ns/:name            -> { installs }   (advisory)
//   POST /v1/installs/:ns/:name            -> report a successful install (advisory)
//   POST /v1/webhook/github                -> incremental projection update on catalog push
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config.mjs';
import { initSchema, getPool, closePool } from './db.mjs';
import { getDiscover, search, getCollection, getInstalls, reportInstall } from './queries.mjs';
import { applyPush } from './incremental.mjs';
import { pushMayTouchEntries } from './catalog.mjs';
import { verifyGithubSignature } from './github.mjs';

const app = Fastify({ logger: true });

// Keep the RAW request body alongside the parsed JSON — the webhook signature is
// an HMAC over the exact bytes GitHub sent, so re-stringifying won't match.
app.addContentTypeParser('application/json', { parseAs: 'buffer' }, (req, body, done) => {
  req.rawBody = body;
  if (!body || body.length === 0) return done(null, {});
  try {
    done(null, JSON.parse(body.toString('utf8')));
  } catch (e) {
    done(e);
  }
});

await app.register(cors, { origin: true }); // open CORS — read API, no credentials

app.get('/health', async () => {
  await getPool().query('SELECT 1');
  return { ok: true };
});

app.get('/v1/discover', async () => getDiscover());

app.get('/v1/search', async (req) => {
  const { q, sort, page, category } = req.query || {};
  return search({ q, sort, page: Number(page) || 1, category });
});

app.get('/v1/collection/:ns/:name', async (req, reply) => {
  const rec = await getCollection(req.params.ns, req.params.name);
  if (!rec) return reply.code(404).send({ error: 'not_found' });
  return rec;
});

app.get('/v1/installs/:ns/:name', async (req) => {
  const installs = await getInstalls(req.params.ns, req.params.name);
  return { installs };
});

// Advisory write — phone-home, coordinate-only, never blocks install. The app
// calls this AFTER a successful install; failures here are swallowed client-side.
app.post('/v1/installs/:ns/:name', async (req) => {
  const { ns, name } = req.params;
  const source = (req.body && req.body.source) || (req.query && req.query.source) || null;
  return reportInstall({ ns, name, source });
});

// Catalog webhook — GitHub posts here on every push to the catalog repo. We
// verify the signature, then incrementally apply ONLY the entry files that
// changed (upsert/delete), instead of rebuilding the whole projection. Counts
// are never touched. An unknown base falls back to a full rebuild to reconcile.
app.post('/v1/webhook/github', async (req, reply) => {
  if (!verifyGithubSignature(req.rawBody || Buffer.alloc(0), req.headers['x-hub-signature-256'], config.webhookSecret)) {
    return reply.code(401).send({ error: 'invalid_signature' });
  }
  const event = req.headers['x-github-event'];
  if (event === 'ping') return { ok: true, pong: true };
  if (event !== 'push') return { ignored: `event:${event}` };

  const body = req.body || {};
  const expectedRef = `refs/heads/${config.catalogBranch}`;
  if (body.ref && body.ref !== expectedRef) return { ignored: `ref:${body.ref}` };

  // Early-out: if the payload shows no catalog entry could have changed (e.g. the
  // CI's index.json rebuild commit), skip the git fetch/diff entirely.
  if (!pushMayTouchEntries(body)) return { ignored: 'no-entry-changes' };

  const result = await applyPush({ before: body.before, after: body.after });
  req.log.info({ webhook: result }, 'applied catalog push');
  return result;
});

async function start() {
  await initSchema();
  await app.listen({ port: config.port, host: config.host });
}

const shutdown = async () => {
  await app.close().catch(() => {});
  await closePool().catch(() => {});
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start().catch((e) => {
  app.log.error(e);
  process.exit(1);
});
