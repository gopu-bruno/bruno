// Rebuild the projection from git. Prefers a local catalog checkout (fast dev
// loop); otherwise clones/updates the public catalog repo. This is what an
// index-repo merge webhook (or a poll) would trigger in prod.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { config } from '../src/config.mjs';
import { build } from '../src/build.mjs';
import { closePool } from '../src/db.mjs';

function ensureCatalog() {
  // 1) A local checkout was pointed at — use it as-is (dev loop, no network).
  if (config.catalogDir && existsSync(join(config.catalogDir, 'collection'))) {
    console.log(`• Using local catalog: ${config.catalogDir}`);
    return config.catalogDir;
  }
  // 2) Clone/update the public catalog into ./data/catalog.
  const dir = join(process.cwd(), 'data', 'catalog');
  const git = (...args) => execFileSync('git', args, { stdio: 'inherit' });
  if (existsSync(join(dir, '.git'))) {
    console.log(`• Updating catalog clone: ${dir}`);
    git('-C', dir, 'fetch', '--depth', '1', 'origin', config.catalogBranch);
    git('-C', dir, 'reset', '--hard', `origin/${config.catalogBranch}`);
  } else {
    console.log(`• Cloning catalog ${config.catalogGit} -> ${dir}`);
    git('clone', '--depth', '1', '--branch', config.catalogBranch, config.catalogGit, dir);
  }
  return dir;
}

async function main() {
  const catalogDir = ensureCatalog();
  const { count } = await build({ catalogDir });
  console.log(`✓ Rebuilt projection — ${count} collection(s). Counts (install_events) untouched.`);
  await closePool();
}

main().catch(async (e) => {
  console.error('✗ rebuild failed:', e.message);
  await closePool().catch(() => {});
  process.exit(1);
});
