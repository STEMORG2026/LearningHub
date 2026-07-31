#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHANGESET_DIR = join(ROOT, '.changeset');

function log(msg) {
  console.log(`[release:prepare] ${msg}`);
}

function warn(msg) {
  console.log(`[release:prepare] ⚠ ${msg}`);
}

// ──── Read .phase.json ────
const phasePath = join(ROOT, '.phase.json');
let phaseState = { phases: [] };
if (existsSync(phasePath)) {
  phaseState = JSON.parse(readFileSync(phasePath, 'utf8'));
}

// ──── Count test files per package ────
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

// ──── Determine release mode ────
const changesetFiles = readdirSync(CHANGESET_DIR).filter(
  (f) => f.endsWith('.md') && f !== 'README.md' && f !== 'config.json'
);

const newlyCompleted = phaseState.phases.filter(
  (p) => p.status === 'completed' && p.completedDate === null
);

let releaseMode = 'unknown';
if (changesetFiles.length > 0) {
  releaseMode = 'versioned';
} else if (newlyCompleted.length > 0) {
  releaseMode = 'docs-only';
  warn('No changesets — docs-only phase completion; no packages will be versioned');
} else {
  log('No pending changesets and no newly completed phases. Nothing to prepare.');
  process.exit(0);
}

log(`Release mode: ${releaseMode}`);
if (newlyCompleted.length > 0) {
  log(`Newly completed phase(s): ${newlyCompleted.map((p) => `#${p.id} (${p.name})`).join(', ')}`);
}

function sepIdx(lines, from = 0) {
  return lines.findIndex((l, i) => i >= from && l.trim() === '---');
}

const changesets = changesetFiles.map((f) => {
  const content = readFileSync(join(CHANGESET_DIR, f), 'utf8');
  const lines = content.split('\n');
  const firstSep = sepIdx(lines);
  const secondSep = sepIdx(lines, firstSep + 1);
  const frontmatter = lines.slice(firstSep + 1, secondSep);
  const description = lines.slice(secondSep + 1).join('\n').trim();
  const packages = [];
  for (const line of frontmatter) {
    const match = line.match(/^"@stem-tuition\/([^"]+)"\s*:\s*"(major|minor|patch)"/);
    if (match) {
      packages.push({ name: `@stem-tuition/${match[1]}`, type: match[2] });
    }
  }
  return { file: f, packages, description };
});

const allPkg = new Set();
const pkgMap = {};
for (const cs of changesets) {
  for (const p of cs.packages) {
    allPkg.add(p.name);
    if (!pkgMap[p.name]) pkgMap[p.name] = [];
    pkgMap[p.name].push(cs);
  }
}

log(`Found ${changesets.length} pending changeset(s) affecting ${allPkg.size} package(s):`);
for (const name of [...allPkg].sort()) {
  const types = [...new Set(pkgMap[name].flatMap((cs) => cs.packages.filter((p) => p.name === name).map((p) => p.type)))];
  log(`  ${name} (${types.join(', ')})`);
}

const today = new Date().toISOString().slice(0, 10);

if (releaseMode === 'versioned') {
  log('\n--- CHANGELOG ---');

  const changelogPath = join(ROOT, 'docs/CHANGELOG.md');
  let changelog = readFileSync(changelogPath, 'utf8');

  const hasNextSection = changelog.includes('## [NEXT]');
  const newChangelogSection = hasNextSection ? null : `
## [NEXT] — ${today}

[EDIT: Refine narrative summary]

### Added
${changesets.flatMap((cs) => cs.packages.filter((p) => p.type === 'major' || p.type === 'minor').map((p) => `- ${p.name}: ${cs.description.split('\n')[0] || 'New feature'}`)).join('\n')}

### Changed
${changesets.flatMap((cs) => cs.packages.filter((p) => p.type === 'patch').map((p) => `- ${p.name}: ${cs.description.split('\n')[0] || 'Bug fix'}`)).join('\n')}

### Fixed
${changesets.flatMap((cs) => cs.packages.filter((p) => p.type === 'patch').map((p) => `- ${p.name}: ${cs.description.split('\n')[0] || 'Bug fix'}`)).join('\n')}

### Packages Updated
${[...allPkg].sort().map((n) => `- ${n}: pending`).join('\n')}

---

`;

  if (!hasNextSection) {
    const sep = '\n---\n';
    const insertIdx = changelog.indexOf(sep);
    const insertionPoint = insertIdx !== -1 ? insertIdx + sep.length : changelog.length;
    changelog = changelog.slice(0, insertionPoint) + newChangelogSection + changelog.slice(insertionPoint);
    writeFileSync(changelogPath, changelog);
    log('  ✓ docs/CHANGELOG.md — NEXT section added');
  }
}

log('\n--- DEVLOG ---');

const devlogPath = join(ROOT, 'docs/DEVLOG.md');
let devlog = readFileSync(devlogPath, 'utf8');

const changesText = changesetFiles.length > 0
  ? changesets.map((cs) => `- ${cs.file.replace('.md', '')}: ${cs.description.split('\n')[0]}`).join('\n')
  : `- docs-only phase completion: ${newlyCompleted.map((p) => `Phase ${p.id} (${p.name})`).join(', ')}`;

const newDevlogEntry = `
## ${today} — ${changesetFiles.length > 0 ? '[EDIT: Release title]' : newlyCompleted.map((p) => `Phase ${p.id}: ${p.name} complete`).join('; ')}

**Changes:**
${changesText}

**Packages affected:**
${changesetFiles.length > 0 ? [...allPkg].sort().map((n) => `- ${n}`).join('\n') : newlyCompleted.flatMap((p) => p.packages.map((pkgName) => `- @stem-tuition/${pkgName}`)).join('\n')}

**Tests:**
[EDIT: Run pnpm release:validate before proceeding]

**Notes:**
[EDIT: Add human insight here — struggles, learnings, next]
[EDIT: Remove if nothing to add]

---

`;

devlog = devlog.replace('---\n\n## [Template', `${newDevlogEntry}---\n\n## [Template`);
writeFileSync(devlogPath, devlog);
log('  ✓ docs/DEVLOG.md — new entry added');

log('\n--- Phase Documentation ---');

try {
  execSync('node scripts/docs-sync.mjs', { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  warn(`docs-sync.mjs failed:\n${e.stdout || ''}\n${e.stderr || ''}`);
}

log('\n--- Test Counts ---');

const testCounts = {};
if (phaseState.phases) {
  for (const phase of phaseState.phases) {
    for (const pkgName of phase.packages) {
      const pkgDir = join(ROOT, 'packages', pkgName);
      if (existsSync(pkgDir)) {
        const count = countTests(pkgDir);
        testCounts[pkgName] = count;
        log(`  ${pkgName}: ${count} test(s) estimated`);
      }
    }
  }
}
log('  (Test counts are approximate — based on it()/test() regex scan)');

log('\n✓ release:prepare complete.');
log('');
log('=== HUMAN APPROVAL REQUIRED ===');
log('The release candidate has been drafted.');
log('Do NOT proceed without explicit human approval.');
log('');
log('Next steps:');
if (changesetFiles.length > 0) {
  log(`  1. Report the complete release candidate to the human`);
  log(`  2. Edit docs/CHANGELOG.md — refine narrative, remove [EDIT] markers`);
  log(`  3. Edit docs/DEVLOG.md — write Notes, remove [EDIT] markers`);
} else {
  log(`  1. Report the complete release candidate to the human`);
  log(`  2. Edit docs/DEVLOG.md — write Notes, remove [EDIT] markers`);
}
log(`  3. Review phase documentation above — verify phase status and progress`);
log(`  4. Wait for the human to explicitly approve the release candidate`);
log(`  5. After approval: git add -A`);
log(`  6. After approval: pnpm release:validate`);
log(`  7. After approval: pnpm release:version`);
log(`  8. After approval: pnpm release:finalize`);
