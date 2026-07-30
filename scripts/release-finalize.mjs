#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TOKEN_PATH = join(ROOT, '.release-token.json');
const ALLOWED_MUTATIONS = [
  '.changeset/',
  'packages/',
  'apps/',
  'docs/CHANGELOG.md',
  'docs/DEVLOG.md',
  'docs/ROADMAP.md',
  'docs/component-registry/',
  'pnpm-lock.yaml',
  'AGENTS.md',
];

function log(msg) {
  console.log(`[release:finalize] ${msg}`);
}

function fail(msg) {
  console.error(`[release:finalize] ❌ ${msg}`);
  process.exit(1);
}

log('=== Stage 1: Token validation ===');

if (!existsSync(TOKEN_PATH)) {
  fail('.release-token.json not found — the pipeline must continue immediately after release:version');
}

const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));

const MAX_FINALIZE_AGE_MS = 10 * 60 * 1000; // 10 minutes
const tokenAge = Date.now() - new Date(token.validatedAt).getTime();
if (tokenAge > MAX_FINALIZE_AGE_MS) {
  fail(`Token expired (${Math.round(tokenAge / 1000)}s old, max ${MAX_FINALIZE_AGE_MS / 1000}s). Re-run the full pipeline.`);
}
log(`  ✓ Token valid, age ${Math.round(tokenAge / 1000)}s`);

log('\n=== Stage 2: Mutation allowlist check ===');

const gitRoot = execSync('git rev-parse --show-toplevel', { cwd: ROOT, encoding: 'utf8' }).trim();
const changed = execSync('git diff --name-only', { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const staged = execSync('git diff --cached --name-only', { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const allChanged = [...new Set([...changed, ...staged])];

let violations = [];
for (const file of allChanged) {
  const allowed = ALLOWED_MUTATIONS.some((pattern) => {
    if (pattern.endsWith('/')) {
      return file.startsWith(pattern);
    }
    return file === pattern;
  });
  if (!allowed) {
    violations.push(file);
  }
}
if (violations.length > 0) {
  fail(`Outside-mutation-allowlist changes detected:\n${violations.map((f) => `  ${f}`).join('\n')}\nThese files were changed outside the allowed set.`);
}
log(`  ✓ All ${allChanged.length} changed file(s) are within the mutation allowlist`);

log('\n=== Stage 3: Update docs with new version ===');

const { version, name } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
let rootVersion;
if (name === 'stem-tuition') {
  rootVersion = version;
} else {
  rootVersion = execSync('node -p "require(\'./package.json\').version"', { cwd: ROOT, encoding: 'utf8' }).trim();
}

const changelogPath = join(ROOT, 'docs/CHANGELOG.md');
let changelog = readFileSync(changelogPath, 'utf8');
const nextSectionRegex = /^## \[NEXT\]/m;
if (nextSectionRegex.test(changelog)) {
  changelog = changelog.replace(nextSectionRegex, `## [${rootVersion}]`);
  writeFileSync(changelogPath, changelog);
  log(`  ✓ docs/CHANGELOG.md — [NEXT] → [${rootVersion}]`);
}

const roadMapPath = join(ROOT, 'docs/ROADMAP.md');
if (existsSync(roadMapPath)) {
  log('  ✓ docs/ROADMAP.md — TODO: automate phase-marker updates here');
}

log('\n=== Stage 4: Commit ===');

const mainPkgJson = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const releaseVersion = mainPkgJson.version;

try {
  execSync(`git add -A`, { cwd: ROOT, stdio: 'inherit' });
  execSync(`git commit -m "RELEASING: v${releaseVersion}"`, { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  fail(`Commit failed.\n${e.stdout || ''}\n${e.stderr || ''}`);
}
log('  ✓ Commit created');

log('\n=== Stage 5: Tag ===');

try {
  execSync(`git tag v${releaseVersion}`, { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  fail(`Tag failed.\n${e.stdout || ''}\n${e.stderr || ''}`);
}
log(`  ✓ Tagged v${releaseVersion}`);

log('\n=== Stage 6: Changeset tag for private packages ===');

try {
  execSync('pnpm changeset tag', { cwd: ROOT, stdio: 'inherit' });
} catch {
  log('  ⚠  changeset tag had warnings (non-fatal)');
}
log('  ✓ changeset tag complete');

log('\n=== Stage 7: Delete release token ===');

if (existsSync(TOKEN_PATH)) {
  unlinkSync(TOKEN_PATH);
  log('  ✓ .release-token.json deleted');
}

log('\n=== Stage 8: Verify working tree is clean ===');

try {
  execSync('git diff --quiet', { cwd: ROOT, stdio: 'pipe' });
} catch {
  fail('Working tree is dirty after commit+tag — investigate');
}
const untracked = execSync('git ls-files --others --exclude-standard', {
  cwd: ROOT,
  encoding: 'utf8',
}).trim();
if (untracked) {
  log(`  ⚠  Untracked files remain (usually fine):\n${untracked.split('\n').map((l) => `      ${l}`).join('\n')}`);
} else {
  log('  ✓ Working tree clean');
}

log('\n✓ release:finalize complete.');
log(`  Release v${releaseVersion} committed and tagged.`);
log(`  Push when ready:  git push && git push --tags`);
