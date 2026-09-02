#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CHANGESET_DIR = join(ROOT, '.changeset');
const TOKEN_PATH = join(ROOT, '.release-token.json');

function log(msg) {
  console.log(`[release:validate] ${msg}`);
}

function fail(msg) {
  console.error(`[release:validate] ❌ ${msg}`);
  process.exit(1);
}

log('=== Stage 1: Phase state validation ===');

const phasePath = join(ROOT, '.phase.json');
let phaseState;
try {
  phaseState = JSON.parse(readFileSync(phasePath, 'utf8'));
} catch {
  fail('.phase.json is missing or invalid JSON');
}

if (!Array.isArray(phaseState.phases)) {
  fail('.phase.json must contain a "phases" array');
}

for (const phase of phaseState.phases) {
  if (!['planned', 'completed'].includes(phase.status)) {
    fail(`Phase ${phase.id}: invalid status "${phase.status}" — must be "planned" or "completed"`);
  }
  if (!Array.isArray(phase.packages)) {
    fail(`Phase ${phase.id}: "packages" must be an array`);
  }
}

// Validate no completion-sequence gaps
const completedIds = phaseState.phases.filter((p) => p.status === 'completed').map((p) => p.id);
for (let i = 1; i < completedIds.length; i++) {
  if (completedIds[i] !== completedIds[i - 1] + 1) {
    fail(`Completion sequence gap: Phase ${completedIds[i - 1]} is completed but Phase ${completedIds[i]} is "planned"`);
  }
}

// Validate packages exist on disk
for (const phase of phaseState.phases) {
  for (const pkgName of phase.packages) {
    const pkgDir = join(ROOT, 'packages', pkgName);
    if (!readdirSync(join(ROOT, 'packages')).includes(pkgName)) {
      warn(`Phase ${phase.id}: package "${pkgName}" not found in packages/`);
    }
  }
}

log('  ✓ .phase.json is valid');

log('\n=== Stage 2: Human-input validation ===');

const changelog = readFileSync(join(ROOT, 'docs/CHANGELOG.md'), 'utf8');
const devlog = readFileSync(join(ROOT, 'docs/DEVLOG.md'), 'utf8');

const editPattern = /\[EDIT:/g;
let match;
let found = [];

while ((match = editPattern.exec(changelog)) !== null) {
  found.push(`  docs/CHANGELOG.md:${changelog.slice(0, match.index).split('\n').length}`);
}
while ((match = editPattern.exec(devlog)) !== null) {
  found.push(`  docs/DEVLOG.md:${devlog.slice(0, match.index).split('\n').length}`);
}

if (found.length > 0) {
  fail(`${found.length} [EDIT:] marker(s) remain — resolve before proceeding:\n${found.join('\n')}`);
}
log('  ✓ No [EDIT:] markers remain');

log('\n=== Stage 3: Release mode determination ===');

const changesetFiles = readdirSync(CHANGESET_DIR).filter(
  (f) => f.endsWith('.md') && f !== 'README.md' && f !== 'config.json'
);

const newlyCompleted = phaseState.phases.filter(
  (p) => p.status === 'completed' && p.completedDate === null
);

let releaseMode;
if (changesetFiles.length > 0) {
  releaseMode = 'versioned';
} else if (newlyCompleted.length > 0) {
  releaseMode = 'docs-only';
} else {
  fail('No pending changesets and no newly completed phases — this is not a valid release attempt.');
}

log(`  Release mode: ${releaseMode}`);
if (newlyCompleted.length > 0) {
  log(`  Newly completed phase(s): ${newlyCompleted.map((p) => `#${p.id}`).join(', ')}`);
}

if (releaseMode === 'versioned') {
  if (newlyCompleted.length === 0) {
    log('  ⚠  Root version bump advisory: no newlyCompleted phase exists.');
    log('  ⚠  A root version bump without a completed phase may be unintentional.');
    log('  ⚠  See docs/policies/VERSIONING.md §2.2 for the root bump rule.');
    log('  ⚠  If this is intentional, proceed. Otherwise, create a changeset or add a phase completion.');
  }

  log('\n=== Stage 4: Changeset validation ===');

  for (const f of changesetFiles) {
    const content = readFileSync(join(CHANGESET_DIR, f), 'utf8');
    if (!content.includes('---')) {
      fail(`Malformed changeset: ${f} — missing frontmatter delimiters`);
    }
  }
  log(`  ✓ ${changesetFiles.length} changeset(s) are well-formed`);

  // Advisory: check if changeset packages match newly completed phase
  if (newlyCompleted.length > 0) {
    const changedPkgs = new Set();
    for (const f of changesetFiles) {
      const content = readFileSync(join(CHANGESET_DIR, f), 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const m = line.match(/^"@learninghub\/([^"]+)"\s*:/);
        if (m) changedPkgs.add(m[1]);
      }
    }
    const expectedPkgs = new Set(newlyCompleted.flatMap((p) => p.packages));
    const hasOverlap = [...changedPkgs].some((p) => expectedPkgs.has(p));
    if (!hasOverlap) {
      log('  ⚠  Warning: changeset packages do not overlap with any newly completed phase — confirm this is intentional');
    }
  }
}

log('\n=== Stage 5: Working-tree check (pre-test) ===');

try {
  execSync('git diff --quiet', { cwd: ROOT, stdio: 'pipe' });
} catch {
  fail('Unstaged tracked-file changes exist. Stage or stash them:\n    git add -A  or  git stash');
}

const untracked = execSync('git ls-files --others --exclude-standard', {
  cwd: ROOT,
  encoding: 'utf8',
}).trim();
if (untracked) {
  fail(`Untracked files exist:\n${untracked}\nAdd them to .gitignore or git add them before validating.`);
}
log('  ✓ Working tree is clean (no unstaged, no untracked)');

log('\n=== Stage 6: Governance validation ===');
try {
  execSync('pnpm verify-governance', { cwd: ROOT, stdio: 'inherit' });
} catch {
  fail('pnpm verify-governance failed. Fix governance issues before releasing.');
}
log('  ✓ Governance checks passed');

log('\n=== Stage 7: Authoritative tests ===');
let testOutput;
try {
  testOutput = execSync('pnpm test --force', { cwd: ROOT, encoding: 'utf8' });
} catch (e) {
  fail(`pnpm test --force failed.\n${e.stdout || ''}\n${e.stderr || ''}`);
}
log('  ✓ All tests passed');

const testSummary = { passed: 0, failed: 0, total: 0 };
const summaryMatch = testOutput.match(/Tests\s+(\d+)\s+passed.*?(\d+)\s+failed.*?(\d+)\s+total/);
if (summaryMatch) {
  testSummary.passed = parseInt(summaryMatch[1], 10);
  testSummary.failed = parseInt(summaryMatch[2], 10);
  testSummary.total = parseInt(summaryMatch[3], 10);
} else {
  const simpleMatch = testOutput.match(/(\d+)\s+passed.*?(\d+)\s+failed/);
  if (simpleMatch) {
    testSummary.passed = parseInt(simpleMatch[1], 10);
    testSummary.failed = parseInt(simpleMatch[2], 10);
    testSummary.total = testSummary.passed + testSummary.failed;
  }
}
log(`  Result: ${testSummary.passed} passed, ${testSummary.failed} failed, ${testSummary.total} total`);

if (testSummary.failed > 0) {
  fail('Tests failed — cannot proceed with release.');
}

log('\n=== Stage 8: Post-test working-tree check ===');
try {
  execSync('git diff --quiet', { cwd: ROOT, stdio: 'pipe' });
} catch {
  fail('Tests left unstaged tracked-file changes. Investigate and fix before re-validating.');
}
const untrackedAfter = execSync('git ls-files --others --exclude-standard', {
  cwd: ROOT,
  encoding: 'utf8',
}).trim();
if (untrackedAfter) {
  fail(`Tests left untracked files:\n${untrackedAfter}\nAdd to .gitignore or clean up before re-validating.`);
}
log('  ✓ Working tree still clean after tests');

log('\n=== Stage 9: Write validation token ===');

const treeHash = execSync('git write-tree', { cwd: ROOT, encoding: 'utf8' }).trim();
const validatedChangesetFiles = changesetFiles.map((f) => `.changeset/${f}`);

const token = {
  validationPassed: true,
  releaseMode,
  newlyCompletedPhaseIds: newlyCompleted.map((p) => p.id),
  treeHash,
  validatedAt: new Date().toISOString(),
  testCommand: 'pnpm test --force',
  testSummary,
  validatedChangesetFiles,
};

writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2) + '\n');
log(`  ✓ .release-token.json written (mode: ${releaseMode}, treeHash: ${treeHash.slice(0, 12)}...)`);

log('\n✓ release:validate complete.');
log(`  Run:  pnpm release:version`);
