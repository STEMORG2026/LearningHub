#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// ──── Intentional re-verification ────
// Stages 3/6/7 re-run governance, typecheck, and tests AFTER the version
// mutation (changeset version + sync-versions.mjs). This is a defensive
// safety net — the mutation modifies package.json files and may introduce
// errors not present when release:validate ran. This is NOT a replacement
// for release:validate; it is post-mutation insurance.

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
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

if (!['versioned', 'docs-only'].includes(token.releaseMode)) {
  fail(`Unknown release mode: ${token.releaseMode}`);
}

log(`  ✓ Token valid, mode: ${token.releaseMode}`);

if (token.releaseMode === 'docs-only') {
  log('\n=== Docs-only release — skipping version bump ===');
  log('  No package versions changed. Proceed to release:finalize.');
  log('\n✓ release:version complete. Ready for release:finalize.');
  log('  Run:  pnpm release:finalize');
  process.exit(0);
}

log('\n=== Stage 2: Set consumed changesets (handoff to finalize) ===');

token.consumedChangesets = token.validatedChangesetFiles;
writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2) + '\n');
log(`  ✓ consumedChangesets written (${token.consumedChangesets.length} file(s))`);

log('\n=== Stage 3: Governance gate ===');

try {
  execSync('pnpm verify-governance', { cwd: ROOT, stdio: 'inherit' });
} catch {
  fail('pnpm verify-governance failed at version stage — governance is broken.');
}
log('  ✓ Governance checks passed');

log('\n=== Stage 4: Working tree integrity (pre-versioning) ===');

try {
  execSync('git diff --quiet', { cwd: ROOT, stdio: 'pipe' });
} catch {
  fail('Unstaged tracked changes exist. Stage or stash them before versioning.');
}

const untracked = execSync('git ls-files --others --exclude-standard', {
  cwd: ROOT, encoding: 'utf8',
}).trim();
if (untracked) {
  fail(`Untracked files exist:\n${untracked}\nClean them up before versioning.`);
}

const currentTreeHash = execSync('git write-tree', { cwd: ROOT, encoding: 'utf8' }).trim();
if (currentTreeHash !== token.treeHash) {
  fail(`TOCTOU violation: tree hash changed since validation.\n  Expected: ${token.treeHash}\n  Current:  ${currentTreeHash}\nWorking tree was modified since pnpm release:validate — re-validate.`);
}
log(`  ✓ No unstaged, no untracked, tree hash unchanged (${currentTreeHash.slice(0, 12)}...)`);

log('\n=== Stage 5: Bump versions via changeset ===');

try {
  execSync('pnpm changeset version', { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  fail(`pnpm changeset version failed.\n${e.stdout || ''}\n${e.stderr || ''}`);
}
log('  ✓ changeset version succeeded');

log('\n=== Stage 6: Sync version strings ===');

try {
  execSync('node scripts/sync-versions.mjs', { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  fail(`sync-versions.mjs failed.\n${e.stdout || ''}\n${e.stderr || ''}`);
}
log('  ✓ Version strings synchronized');

log('\n=== Stage 7: TypeScript type check ===');

try {
  execSync('pnpm typecheck', { cwd: ROOT, stdio: 'inherit' });
} catch {
  fail('pnpm typecheck failed — version bump introduced type errors.');
}
log('  ✓ TypeScript checks passed');

log('\n=== Stage 8: Run tests ===');

try {
  execSync('pnpm test', { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  fail(`Tests failed after version bump.\n${e.stdout || ''}\n${e.stderr || ''}`);
}
log('  ✓ All tests passed');

log('\n=== Stage 9: Delete consumed changesets ===');

for (const changesetFile of token.consumedChangesets) {
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
log('  Run:  pnpm release:finalize');
