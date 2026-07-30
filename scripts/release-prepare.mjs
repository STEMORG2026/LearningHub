#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

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

if (newlyCompleted.length > 0) {
  // Generate ROADMAP progress bar
  const phases = phaseState.phases;
  const roadMapPath = join(ROOT, 'docs/ROADMAP.md');
  let roadmap = readFileSync(roadMapPath, 'utf8');

  const progressBar = phases.map((p) => {
    const totalPhases = 8;
    const bar = progressBarFilled(p.status === 'completed' ? 10 : 0);
    const name = p.name;
    return `PHASE ${p.id} ${bar}  ${name}`;
  }).join('\n');

  const autoProgressOpen = '<!-- AUTO:phase-progress -->';
  const autoProgressClose = '<!-- END AUTO:phase-progress -->';
  const progressStart = roadmap.indexOf(autoProgressOpen);
  const progressEnd = roadmap.indexOf(autoProgressClose);
  if (progressStart !== -1 && progressEnd !== -1) {
    const before = roadmap.slice(0, progressStart + autoProgressOpen.length);
    const after = roadmap.slice(progressEnd);
    roadmap = before + '\n```\n' + progressBar + '\n```\n' + after;
    writeFileSync(roadMapPath, roadmap);
    log('  ✓ docs/ROADMAP.md — progress bar drafted');
  }

  // Generate per-phase status lines
  for (const phase of phases) {
    const marker = `<!-- AUTO:phase-${phase.id}-status -->`;
    const markerEnd = `<!-- END AUTO:phase-${phase.id}-status -->`;
    const start = roadmap.indexOf(marker);
    const end = roadmap.indexOf(markerEnd, start);
    if (start !== -1 && end !== -1) {
      const statusText = phaseStatusForDoc(phase);
      const before = roadmap.slice(0, start + marker.length);
      const after = roadmap.slice(end);
      roadmap = before + statusText + after;
      writeFileSync(roadMapPath, roadmap);
      log(`  ✓ Phase ${phase.id} status → ${statusText}`);
    }
  }

  // Generate AGENTS.md phase map
  const agentsPath = join(ROOT, 'AGENTS.md');
  let agents = readFileSync(agentsPath, 'utf8');

  const autoPhaseMapOpen = '<!-- AUTO:phase-map -->';
  const autoPhaseMapClose = '<!-- END AUTO:phase-map -->';
  const pmStart = agents.indexOf(autoPhaseMapOpen);
  const pmEnd = agents.indexOf(autoPhaseMapClose);
  if (pmStart !== -1 && pmEnd !== -1) {
    const current = currentPhaseIdx(phases);
    const phaseLines = phases.map((p) => {
      const bar = progressBarFilled(p.status === 'completed' ? 10 : 0);
      const isCurrent = current !== null && p.id === current;
      const suffix = isCurrent ? '   ← CURRENT' : '';
      return `PHASE ${p.id} ${bar}  ${p.name}${suffix}`;
    }).join('\n');
    const beforeAgents = agents.slice(0, pmStart + autoPhaseMapOpen.length);
    const afterAgents = agents.slice(pmEnd);
    agents = beforeAgents + '\n```\n' + phaseLines + '\n```\n' + afterAgents;
    writeFileSync(agentsPath, agents);
    log('  ✓ AGENTS.md — phase map drafted');
  }

  // Generate AGENTS.md package map
  const autoPkgMapOpen = '<!-- AUTO:package-map -->';
  const autoPkgMapClose = '<!-- END AUTO:package-map -->';
  const pkgStart = agents.indexOf(autoPkgMapOpen);
  const pkgEnd = agents.indexOf(autoPkgMapClose, pkgStart);
  if (pkgStart !== -1 && pkgEnd !== -1) {
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
    const beforePkgs = agents.slice(0, pkgStart + autoPkgMapOpen.length);
    const afterPkgs = agents.slice(pkgEnd);
    agents = beforePkgs + '\n| Package | Responsibility | Key files |\n|---------|---------------|-----------|\n' + pkgLines + '\n' + afterPkgs;
    writeFileSync(agentsPath, agents);
    log('  ✓ AGENTS.md — package map drafted');
  }
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
