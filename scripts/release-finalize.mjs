#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, unlinkSync, readdirSync } from 'fs';
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

function currentPhaseIdx(phases) {
  const idx = phases.findIndex((p) => p.status !== 'completed');
  return idx !== -1 ? idx : null;
}

function phaseStatusForDoc(phase) {
  if (phase.status === 'completed') return '🟢 Completed';
  if (phase.status === 'planned') return '🔵 Not started';
  return phase.status;
}

function progressBarFilled(n) {
  return '█'.repeat(Math.min(10, n)) + '░'.repeat(Math.max(0, 10 - n));
}

function countTests(pkgDir) {
  const testDir = join(pkgDir, 'tests');
  if (!existsSync(testDir)) return 0;
  const files = readdirSync(testDir).filter((f) => f.endsWith('.test.ts'));
  let count = 0;
  for (const f of files) {
    const content = readFileSync(join(testDir, f), 'utf8');
    count += (content.match(/\b(it|test)\s*\(/g) || []).length;
  }
  return count;
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

let phaseState = { phases: [] };
if (existsSync(PHASE_PATH)) {
  phaseState = JSON.parse(readFileSync(PHASE_PATH, 'utf8'));
}

const newlyCompletedIds = token.newlyCompletedPhaseIds || [];
const newlyCompleted = phaseState.phases.filter((p) => newlyCompletedIds.includes(p.id));

if (newlyCompleted.length > 0) {
  const phases = phaseState.phases;
  const roadMapPath = join(ROOT, 'docs/ROADMAP.md');
  let roadmap = readFileSync(roadMapPath, 'utf8');
  const agentsPath = join(ROOT, 'AGENTS.md');
  let agents = readFileSync(agentsPath, 'utf8');

  // 3a: ROADMAP progress bar
  const progressBar = phases.map((p) => {
    const bar = progressBarFilled(p.status === 'completed' ? 10 : 0);
    return `PHASE ${p.id} ${bar}  ${p.name}`;
  }).join('\n');

  const autoProgressOpen = '<!-- AUTO:phase-progress -->';
  const autoProgressClose = '<!-- END AUTO:phase-progress -->';
  let pStart = roadmap.indexOf(autoProgressOpen);
  let pEnd = roadmap.indexOf(autoProgressClose);
  if (pStart !== -1 && pEnd !== -1) {
    roadmap = roadmap.slice(0, pStart + autoProgressOpen.length) + '\n```\n' + progressBar + '\n```\n' + roadmap.slice(pEnd);
    log('  ✓ docs/ROADMAP.md — progress bar updated');
  }

  // 3b: Per-phase status lines
  for (const phase of phases) {
    const marker = `<!-- AUTO:phase-${phase.id}-status -->`;
    const markerEnd = `<!-- END AUTO:phase-${phase.id}-status -->`;
    pStart = roadmap.indexOf(marker);
    pEnd = roadmap.indexOf(markerEnd, pStart);
    if (pStart !== -1 && pEnd !== -1) {
      const statusText = phaseStatusForDoc(phase);
      roadmap = roadmap.slice(0, pStart + marker.length) + statusText + roadmap.slice(pEnd);
      log(`  ✓ Phase ${phase.id} status → ${statusText}`);
    }
  }
  writeFileSync(roadMapPath, roadmap);

  // 3c: AGENTS.md phase map
  const autoPhaseMapOpen = '<!-- AUTO:phase-map -->';
  const autoPhaseMapClose = '<!-- END AUTO:phase-map -->';
  pStart = agents.indexOf(autoPhaseMapOpen);
  pEnd = agents.indexOf(autoPhaseMapClose);
  if (pStart !== -1 && pEnd !== -1) {
    const cur = currentPhaseIdx(phases);
    const phaseLines = phases.map((p) => {
      const bar = progressBarFilled(p.status === 'completed' ? 10 : 0);
      const isCurrent = cur !== null && p.id === cur;
      const suffix = isCurrent ? '   ← CURRENT' : '';
      return `PHASE ${p.id} ${bar}  ${p.name}${suffix}`;
    }).join('\n');
    agents = agents.slice(0, pStart + autoPhaseMapOpen.length) + '\n```\n' + phaseLines + '\n```\n' + agents.slice(pEnd);
    log('  ✓ AGENTS.md — phase map updated');
  }

  // 3d: AGENTS.md package map
  const autoPkgMapOpen = '<!-- AUTO:package-map -->';
  const autoPkgMapClose = '<!-- END AUTO:package-map -->';
  pStart = agents.indexOf(autoPkgMapOpen);
  pEnd = agents.indexOf(autoPkgMapClose, pStart);
  if (pStart !== -1 && pEnd !== -1) {
    const pkgLines = phases.filter((p) => p.packages.length > 0).flatMap((p) =>
      p.packages.map((pkgName) => {
        const pkgDir = join(ROOT, 'packages', pkgName);
        let keyFiles = '';
        if (existsSync(pkgDir)) {
          const srcFiles = readdirSync(join(pkgDir, 'src')).filter((f) => f.endsWith('.ts'));
          keyFiles = srcFiles.map((f) => `src/${f}`).join(', ');
        }
        return `| \`packages/${pkgName}/\` | ${p.name} | \`${keyFiles || 'N/A'}\` |`;
      })
    ).join('\n');
    agents = agents.slice(0, pStart + autoPkgMapOpen.length) + '\n| Package | Responsibility | Key files |\n|---------|---------------|-----------|\n' + pkgLines + '\n' + agents.slice(pEnd);
    log('  ✓ AGENTS.md — package map updated');
  }
  writeFileSync(agentsPath, agents);

  // 3e: Component registry — RENDERING.md
  const renderingPath = join(ROOT, 'docs/component-registry/RENDERING.md');
  let rendering = readFileSync(renderingPath, 'utf8');
  for (const phase of newlyCompleted) {
    const marker = `<!-- AUTO:rendering-phase-${phase.id} -->`;
    const markerEnd = `<!-- END AUTO:rendering-phase-${phase.id} -->`;
    pStart = rendering.indexOf(marker);
    pEnd = rendering.indexOf(markerEnd, pStart);
    if (pStart !== -1 && pEnd !== -1) {
      const rows = phase.packages.map((pkgName) => {
        const pkgDir = join(ROOT, 'packages', pkgName);
        let defFiles = '';
        if (existsSync(pkgDir)) {
          const srcFiles = readdirSync(join(pkgDir, 'src')).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
          defFiles = srcFiles.map((f) => `src/${f}`).join(', ');
        }
        return `| ${pkgName} | \`packages/${pkgName}/\` | \`${defFiles || 'N/A'}\` | — | — | Extracted (Phase ${phase.id}) |`;
      }).join('\n');
      const table = '\n| Component | Package | Definition | Template | Styles | Status |\n|-----------|---------|-----------|----------|--------|--------|\n' + rows + '\n';
      rendering = rendering.slice(0, pStart + marker.length) + table + rendering.slice(pEnd);
      log(`  ✓ docs/component-registry/RENDERING.md — Phase ${phase.id} entries updated`);
    }
  }
  writeFileSync(renderingPath, rendering);

  // 3f: Component registry — STATE.md
  const statePath = join(ROOT, 'docs/component-registry/STATE.md');
  let state = readFileSync(statePath, 'utf8');
  for (const phase of newlyCompleted) {
    const marker = `<!-- AUTO:state-phase-${phase.id} -->`;
    const markerEnd = `<!-- END AUTO:state-phase-${phase.id} -->`;
    pStart = state.indexOf(marker);
    pEnd = state.indexOf(markerEnd, pStart);
    if (pStart !== -1 && pEnd !== -1) {
      const rows = phase.packages.map((pkgName) => {
        const dir = join(ROOT, 'packages', pkgName, 'src');
        let items = '';
        if (existsSync(dir)) {
          items = readdirSync(dir).filter((f) => f.endsWith('.ts')).map((f) => `\`packages/${pkgName}/src/${f}\``).join(', ');
        }
        return `| State (${pkgName}) | — | ${items || 'N/A'} | Extracted (Phase ${phase.id}) |`;
      }).join('\n');
      const table = '\n| State | Type | Location | Notes |\n|-------|------|----------|-------|\n' + rows + '\n';
      state = state.slice(0, pStart + marker.length) + table + state.slice(pEnd);
      log(`  ✓ docs/component-registry/STATE.md — Phase ${phase.id} entries updated`);
    }
  }
  writeFileSync(statePath, state);

  // 3g: Component registry — TESTING.md
  const testingPath = join(ROOT, 'docs/component-registry/TESTING.md');
  let testing = readFileSync(testingPath, 'utf8');
  const testingMarker = '<!-- AUTO:testing-table -->';
  const testingMarkerEnd = '<!-- END AUTO:testing-table -->';
  pStart = testing.indexOf(testingMarker);
  pEnd = testing.indexOf(testingMarkerEnd, pStart);
  if (pStart !== -1 && pEnd !== -1) {
    const allPkgRows = phases.filter((p) => p.packages.length > 0).flatMap((p) =>
      p.packages.map((pkgName) => {
        const pkgDir = join(ROOT, 'packages', pkgName);
        let tests = `⚪ Placeholder`;
        let testType = 'Unit';
        if (existsSync(join(pkgDir, 'tests'))) {
          const testFiles = readdirSync(join(pkgDir, 'tests')).filter((f) => f.endsWith('.test.ts') && f !== 'placeholder.test.ts');
          if (testFiles.length > 0) {
            const count = countTests(pkgDir);
            tests = `🟢 Written (${count} tests)`;
          }
        }
        return `| \`packages/${pkgName}/\` | \`tests/*.test.ts\` | ${testType} | — | ${tests} |`;
      })
    ).join('\n');
    const table = '\n| Package | Test file | Type | Coverage target | Status |\n|---------|-----------|------|----------------|--------|\n' + allPkgRows + '\n';
    testing = testing.slice(0, pStart + testingMarker.length) + table + testing.slice(pEnd);
    log('  ✓ docs/component-registry/TESTING.md — entries updated');
  }
  writeFileSync(testingPath, testing);

  // 3h: Write .phase.json (completedVersion, completedDate)
  const rootVersion = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
  const today = new Date().toISOString().slice(0, 10);
  for (const phase of newlyCompleted) {
    if (phase.completedVersion === null) phase.completedVersion = rootVersion;
    if (phase.completedDate === null) phase.completedDate = today;
  }
  writeFileSync(PHASE_PATH, JSON.stringify(phaseState, null, 2) + '\n');
  log(`  ✓ .phase.json — completedVersion/completedDate written for phases ${newlyCompleted.map((p) => p.id).join(', ')}`);
} else {
  log('  No newly completed phases — phase documentation unchanged');
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
