#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TOKEN_PATH = join(ROOT, '.release-token.json');
const PHASE_PATH = join(ROOT, '.phase.json');

// Exact mutation allowlist — checked at commit time, not entry
const ALLOWED_MUTATIONS = [
  '.phase.json',
  'AGENTS.md',
  'docs/CHANGELOG.md',
  'docs/DEVLOG.md',
  'docs/ROADMAP.md',
  'docs/component-registry/RENDERING.md',
  'docs/component-registry/STATE.md',
  'docs/component-registry/TESTING.md',
  'packages/*/package.json',
  'packages/*/CHANGELOG.md',
  'apps/*/package.json',
  'apps/*/CHANGELOG.md',
  'pnpm-lock.yaml',
];

function log(msg) {
  console.log(`[release:finalize] ${msg}`);
}

function fail(msg) {
  console.error(`[release:finalize] ❌ ${msg}`);
  process.exit(1);
}

function fileMatchesPattern(file, pattern) {
  if (pattern.endsWith('/*/')) {
    const parts = file.split('/');
    const patternParts = pattern.split('/');
    if (parts.length !== patternParts.length) return false;
    for (let i = 0; i < parts.length; i++) {
      if (patternParts[i] === '*') continue;
      if (parts[i] !== patternParts[i]) return false;
    }
    return true;
  }
  if (pattern.endsWith('/*')) {
    const prefix = pattern.slice(0, -1);
    return file.startsWith(prefix);
  }
  return file === pattern;
}

log('=== Stage 1: Token validation ===');

if (!existsSync(TOKEN_PATH)) {
  fail('.release-token.json not found — the pipeline must continue immediately after release:version');
}

const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));

if (!['versioned', 'docs-only'].includes(token.releaseMode)) {
  fail(`Unknown release mode: ${token.releaseMode}`);
}

log(`  ✓ Token valid, mode: ${token.releaseMode}`);

log('\n=== Stage 2: Working tree integrity (pre-mutation) ===');

try {
  execSync('git diff --quiet', { cwd: ROOT, stdio: 'pipe' });
} catch {
  fail('Unstaged tracked changes exist. Stage or stash them before finalizing.');
}

const untracked = execSync('git ls-files --others --exclude-standard', {
  cwd: ROOT, encoding: 'utf8',
}).trim();
if (untracked) {
  fail(`Untracked files exist:\n${untracked}\nClean them up before finalizing.`);
}
log('  ✓ No unstaged, no untracked');

// ──── Versioned: finalize CHANGELOG ────

if (token.releaseMode === 'versioned') {
  log('\n=== Stage 3: Finalize CHANGELOG ===');

  const { version, name } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const rootVersion = name === 'stem-tuition' ? version
    : execSync('node -p "require(\'./package.json\').version"', { cwd: ROOT, encoding: 'utf8' }).trim();

  const changelogPath = join(ROOT, 'docs/CHANGELOG.md');
  let changelog = readFileSync(changelogPath, 'utf8');
  const nextSectionRegex = /^## \[NEXT\]/m;
  if (nextSectionRegex.test(changelog)) {
    changelog = changelog.replace(nextSectionRegex, `## [${rootVersion}]`);
    writeFileSync(changelogPath, changelog);
    log(`  ✓ docs/CHANGELOG.md — [NEXT] → [${rootVersion}]`);
  }
}

// ──── Phase documentation generation ────

log('\n=== Stage 4: Phase documentation update ===');

try {
  execSync('node scripts/docs-sync.mjs', { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  fail(`docs-sync.mjs failed.\n${e.stdout || ''}\n${e.stderr || ''}`);
}

let phaseState = { phases: [] };
if (existsSync(PHASE_PATH)) {
  phaseState = JSON.parse(readFileSync(PHASE_PATH, 'utf8'));
}

const newlyCompletedIds = token.newlyCompletedPhaseIds || [];
const newlyCompleted = phaseState.phases.filter((p) => newlyCompletedIds.includes(p.id));

if (newlyCompleted.length > 0) {
  // Write .phase.json (completedVersion, completedDate)
  const rootVersion = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
  const today = new Date().toISOString().slice(0, 10);
  for (const phase of newlyCompleted) {
    if (phase.completedVersion === null) phase.completedVersion = rootVersion;
    if (phase.completedDate === null) phase.completedDate = today;
  }
  writeFileSync(PHASE_PATH, JSON.stringify(phaseState, null, 2) + '\n');
  log(`  ✓ .phase.json — completedVersion/completedDate written for phases ${newlyCompleted.map((p) => p.id).join(', ')}`);
} else {
  log('  No newly completed phases — phase state unchanged');
}

// ──── Pre-commit mutation allowlist check ────

// Pipeline-introduced mutations only.
// The human-approved, validated baseline is authorized by the validation token,
// not by this allowlist. Only unstaged changes (introduced after validation)
// are checked against the allowlist.
log('\n=== Stage 5: Mutation allowlist check ===');

const mutated = execSync('git diff --name-only', { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').filter(Boolean);

const effectiveAllowlist = [
  ...ALLOWED_MUTATIONS,
  ...(token.consumedChangesets || []),
];

let violations = [];
for (const file of mutated) {
  const allowed = effectiveAllowlist.some((pattern) => fileMatchesPattern(file, pattern));
  if (!allowed) {
    violations.push(file);
  }
}
if (violations.length > 0) {
  fail(`Outside-mutation-allowlist changes detected:\n${violations.map((f) => `  ${f}`).join('\n')}\nThese files were changed outside the allowed set.`);
}
log(`  ✓ All ${mutated.length} mutated file(s) are within the mutation allowlist`);

// ──── Commit ────

log('\n=== Stage 6: Commit ===');

const mainPkgJson = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const releaseVersion = mainPkgJson.version;

let commitMsg;
if (token.releaseMode === 'versioned') {
  commitMsg = `RELEASING: v${releaseVersion}`;
} else {
  const phases = newlyCompleted.map((p) => `Phase ${p.id}`).join(', ');
  commitMsg = `docs: mark ${phases} complete`;
}

const preAddUntracked = execSync('git ls-files --others --exclude-standard', {
  cwd: ROOT, encoding: 'utf8',
}).trim();
if (preAddUntracked) {
  fail(`Untracked files exist before staging:\n${preAddUntracked}\nClean them up before git add -A.`);
}
log('  ✓ No untracked files before git add -A');

try {
  execSync(`git add -A`, { cwd: ROOT, stdio: 'inherit' });
  execSync(`git commit -m "${commitMsg}"`, { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  fail(`Commit failed.\n${e.stdout || ''}\n${e.stderr || ''}`);
}
log(`  ✓ Commit created: "${commitMsg}"`);

// ──── Tag (versioned only) ────

if (token.releaseMode === 'versioned') {
  log('\n=== Stage 7: Tag ===');

  try {
    execSync(`git tag v${releaseVersion}`, { cwd: ROOT, stdio: 'inherit' });
  } catch (e) {
    fail(`Tag failed.\n${e.stdout || ''}\n${e.stderr || ''}`);
  }
  log(`  ✓ Tagged v${releaseVersion}`);

  log('\n=== Stage 8: Changeset tag for private packages ===');

  try {
    execSync('pnpm changeset tag', { cwd: ROOT, stdio: 'inherit' });
  } catch {
    log('  ⚠  changeset tag had warnings (non-fatal)');
  }
  log('  ✓ changeset tag complete');
} else {
  log('\n=== Stage 6: Tag (skipped — docs-only) ===');
}

// ──── Cleanup ────

log('\n=== Stage 9: Delete release token ===');

if (existsSync(TOKEN_PATH)) {
  unlinkSync(TOKEN_PATH);
  log('  ✓ .release-token.json deleted');
}

log('\n=== Stage 10: Verify working tree is clean ===');

try {
  execSync('git diff --quiet', { cwd: ROOT, stdio: 'pipe' });
} catch {
  fail('Working tree is dirty after commit+tag — investigate');
}
const remainingUntracked = execSync('git ls-files --others --exclude-standard', {
  cwd: ROOT,
  encoding: 'utf8',
}).trim();
if (remainingUntracked) {
  log(`  ⚠  Untracked files remain (usually fine):\n${remainingUntracked.split('\n').map((l) => `      ${l}`).join('\n')}`);
} else {
  log('  ✓ Working tree clean');
}

log('\n✓ release:finalize complete.');
if (token.releaseMode === 'versioned') {
  log(`  Release v${releaseVersion} committed and tagged.`);
  log(`  Push when ready:  git push && git push --tags`);
} else {
  log(`  Docs-only phase completion committed.`);
  log(`  Push when ready:  git push`);
}
