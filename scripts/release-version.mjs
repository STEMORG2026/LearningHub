#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

const ROOT = resolve(import.meta.dirname, '..');
const TOKEN_PATH = join(ROOT, '.release-token.json');

function log(msg) {
  console.log(`[release:version] ${msg}`);
}

function fail(msg) {
  console.error(`[release:version] ❌ ${msg}`);
  process.exit(1);
}

log('=== Stage 1: Token validation ===');

if (!existsSync(TOKEN_PATH)) {
  fail('.release-token.json not found — run pnpm release:validate first');
}

const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));

if (!token.validationPassed) {
  fail('Token indicates validation did not pass. Re-run pnpm release:validate.');
}

const tokenAge = Date.now() - new Date(token.validatedAt).getTime();
const MAX_TOKEN_AGE_MS = 5 * 60 * 1000; // 5 minutes
if (tokenAge > MAX_TOKEN_AGE_MS) {
  fail(`Token expired (${Math.round(tokenAge / 1000)}s old, max ${MAX_TOKEN_AGE_MS / 1000}s). Re-run pnpm release:validate.`);
}
log(`  ✓ Token valid, age ${Math.round(tokenAge / 1000)}s`);

log('\n=== Stage 2: Tree-hash match (TOCTOU guard) ===');

const currentTreeHash = execSync('git write-tree', { cwd: ROOT, encoding: 'utf8' }).trim();
if (currentTreeHash !== token.treeHash) {
  fail(`TOCTOU violation: tree hash changed since validation.\n  Expected: ${token.treeHash}\n  Current:  ${currentTreeHash}\nWorking tree was modified since pnpm release:validate — re-validate.`);
}
log(`  ✓ Tree hash unchanged (${currentTreeHash.slice(0, 12)}...)`);

log('\n=== Stage 3: Governance gate ===');

try {
  execSync('pnpm verify-governance', { cwd: ROOT, stdio: 'inherit' });
} catch {
  fail('pnpm verify-governance failed at version stage — governance is broken.');
}
log('  ✓ Governance checks passed');

log('\n=== Stage 4: Bump versions via changeset ===');

try {
  execSync('pnpm changeset version', { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  fail(`pnpm changeset version failed.\n${e.stdout || ''}\n${e.stderr || ''}`);
}
log('  ✓ changeset version succeeded');

log('\n=== Stage 5: Sync version strings ===');

try {
  execSync('node scripts/sync-versions.mjs', { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  fail(`sync-versions.mjs failed.\n${e.stdout || ''}\n${e.stderr || ''}`);
}
log('  ✓ Version strings synchronized');

log('\n=== Stage 6: TypeScript type check ===');

try {
  execSync('pnpm typecheck', { cwd: ROOT, stdio: 'inherit' });
} catch {
  fail('pnpm typecheck failed — version bump introduced type errors.');
}
log('  ✓ TypeScript checks passed');

log('\n=== Stage 7: Run tests ===');

try {
  execSync('pnpm test', { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  fail(`Tests failed after version bump.\n${e.stdout || ''}\n${e.stderr || ''}`);
}
log('  ✓ All tests passed');

log('\n=== Stage 8: Delete consumed changesets ===');

for (const changesetFile of token.consumedChangesetFiles) {
  const fullPath = join(ROOT, changesetFile);
  if (existsSync(fullPath)) {
    try {
      unlinkSync(fullPath);
      log(`  ✓ Deleted ${changesetFile}`);
    } catch (e) {
      fail(`Could not delete ${changesetFile}: ${e.message}`);
    }
  } else {
    log(`  − ${changesetFile} already deleted`);
  }
}

log('\n✓ release:version complete. Ready for release:finalize.');
log(`  Run:  pnpm release:finalize`);
