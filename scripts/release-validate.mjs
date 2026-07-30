#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

const ROOT = resolve(import.meta.dirname, '..');
const CHANGESET_DIR = join(ROOT, '.changeset');
const TOKEN_PATH = join(ROOT, '.release-token.json');

function log(msg) {
  console.log(`[release:validate] ${msg}`);
}

function fail(msg) {
  console.error(`[release:validate] ❌ ${msg}`);
  process.exit(1);
}

log('=== Stage 1: Human-input validation ===');

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

log('\n=== Stage 2: Changeset validation ===');

const changesetFiles = readdirSync(CHANGESET_DIR).filter(
  (f) => f.endsWith('.md') && f !== 'README.md' && f !== 'config.json'
);

if (changesetFiles.length === 0) {
  fail('No pending changesets. Create changesets before releasing.');
}

for (const f of changesetFiles) {
  const content = readFileSync(join(CHANGESET_DIR, f), 'utf8');
  if (!content.includes('---')) {
    fail(`Malformed changeset: ${f} — missing frontmatter delimiters`);
  }
}
log(`  ✓ ${changesetFiles.length} changeset(s) are well-formed`);

log('\n=== Stage 3: Working-tree check (pre-test) ===');

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

log('\n=== Stage 4: Governance validation ===');
try {
  execSync('pnpm verify-governance', { cwd: ROOT, stdio: 'inherit' });
} catch {
  fail('pnpm verify-governance failed. Fix governance issues before releasing.');
}
log('  ✓ Governance checks passed');

log('\n=== Stage 5: Authoritative tests ===');
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

log('\n=== Stage 6: Post-test working-tree check ===');
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

log('\n=== Stage 7: Write validation token ===');

const treeHash = execSync('git write-tree', { cwd: ROOT, encoding: 'utf8' }).trim();
const consumedChangesetFiles = changesetFiles.map((f) => `.changeset/${f}`);

const token = {
  validationPassed: true,
  treeHash,
  validatedAt: new Date().toISOString(),
  testCommand: 'pnpm test --force',
  testSummary,
  consumedChangesetFiles,
};

writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2) + '\n');
log(`  ✓ .release-token.json written (treeHash: ${treeHash.slice(0, 12)}...)`);

log('\n✓ release:validate complete. Ready for release:version.');
log(`  Run:  pnpm release:version`);
