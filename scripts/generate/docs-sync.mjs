#!/usr/bin/env node

/**
 * docs-sync — single deterministic documentation synchronizer.
 *
 * Reads .phase.json and the filesystem, and regenerates ONLY the
 * `<!-- AUTO:... -->` regions in:
 *   - docs/ROADMAP.md
 *   - AGENTS.md
 *   - docs/component-registry/RENDERING.md
 *   - docs/component-registry/STATE.md
 *   - docs/component-registry/TESTING.md
 *
 * Properties:
 *   - token-free (no .release-token.json required)
 *   - idempotent (running twice produces no additional changes)
 *   - deterministic (phase/package structure comes from .phase.json; file
 *     listings come from packages/ on disk)
 *   - guards against drift: fails if a packages/* directory is absent from
 *     .phase.json (see assertNoUnregisteredPackages below)
 *   - cannot mark phases completed
 *   - cannot write completedVersion/completedDate
 *   - never alters human-authored sections outside AUTO regions
 *
 * Usage: pnpm docs:sync
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..', '..');
const PHASE_PATH = join(ROOT, '.phase.json');
const PACKAGES_DIR = join(ROOT, 'packages');

function log(msg) {
  console.log(`[docs:sync] ${msg}`);
}

// ──── Helpers (shared with release scripts) ────

function currentPhaseIdx(phases) {
  const idx = phases.findIndex((p) => p.status !== 'completed');
  return idx !== -1 ? idx : null;
}

function phaseStatusForDoc(phase) {
  if (phase.status === 'completed') return '🟢 Completed';
  if (phase.status === 'planned') return '🔵 Not started';
  if (phase.status === 'in-progress') return '🟡 In progress';
  return phase.status;
}

function progressBarFilled(n) {
  return '█'.repeat(Math.min(10, n)) + '░'.repeat(Math.max(0, 10 - n));
}

// Progress bar segments for a phase. Only `completed` earns a full bar; an
// in-progress phase shows a partial bar so it is visibly distinct from both a
// finished phase and an untouched one. Never derive completion from this.
function phaseBarSegments(phase) {
  if (phase.status === 'completed') return 10;
  if (phase.status === 'in-progress') return 5;
  return 0;
}

function countTests(pkgDir) {
  const testDir = join(pkgDir, 'tests');
  if (!existsSync(testDir)) return 0;
  const files = readdirSync(testDir).filter((f) => f.endsWith('.test.ts')).sort();
  let count = 0;
  for (const f of files) {
    const content = readFileSync(join(testDir, f), 'utf8');
    count += (content.match(/\b(it|test)\s*\(/g) || []).length;
  }
  return count;
}

// ──── Region replacement ────

function replaceRegion(content, openMarker, closeMarker, replacement) {
  const start = content.indexOf(openMarker);
  if (start === -1) return null;
  const closeStart = content.indexOf(closeMarker, start + openMarker.length);
  if (closeStart === -1) return null;
  return (
    content.slice(0, start + openMarker.length) +
    replacement +
    content.slice(closeStart)
  );
}

function applyRegions(filePath, generators) {
  const fullPath = join(ROOT, filePath);
  if (!existsSync(fullPath)) {
    log(`  − ${filePath} not found — skipped`);
    return;
  }
  let content = readFileSync(fullPath, 'utf8');
  const original = content;
  for (const { open, close, build } of generators) {
    const next = replaceRegion(content, open, close, build(content));
    if (next !== null) content = next;
  }
  if (content !== original) {
    writeFileSync(fullPath, content);
    log(`  ✓ ${filePath} — AUTO sections regenerated`);
  } else {
    log(`  − ${filePath} — already in sync`);
  }
}

// ──── Read phase state ────

// ──── Drift guard ────

/**
 * Every directory under packages/ must be registered in .phase.json.
 *
 * The AUTO regions are built by walking .phase.json's phase→packages lists, so a
 * package that exists on disk but is absent from .phase.json is INVISIBLE to every
 * generated doc — silently. This guard converts that silent drift into a hard
 * failure. Historical note: content-provider, interactive-simulations and
 * lesson-renderer shipped 2026-08-17 and went undocumented until 2026-08-19
 * precisely because nothing checked this.
 */
function assertNoUnregisteredPackages(phases) {
  if (!existsSync(PACKAGES_DIR)) return;

  const onDisk = readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const registered = new Set(phases.flatMap((p) => p.packages ?? []));
  const missing = onDisk.filter((name) => !registered.has(name));

  if (missing.length > 0) {
    log('');
    log('✖ Unregistered packages found on disk:');
    for (const name of missing) log(`    packages/${name}/`);
    log('');
    log('  These exist on disk but are not listed in any .phase.json phase, so');
    log('  they are invisible to every generated doc region.');
    log('');
    log('  Fix: add each package to the "packages" array of the appropriate');
    log('  phase in .phase.json. Assigning a package to a phase is a human');
    log('  decision (docs/policies/HUMAN_INVOLVEMENT.md) — do not guess.');
    log('');
    process.exit(1);
  }
}

let phaseState = { phases: [] };
if (existsSync(PHASE_PATH)) {
  phaseState = JSON.parse(readFileSync(PHASE_PATH, 'utf8'));
}
const phases = Array.isArray(phaseState.phases) ? phaseState.phases : [];
if (phases.length === 0) {
  log('⚠ No phases found in .phase.json — nothing to regenerate.');
}

assertNoUnregisteredPackages(phases);

// Phases marked complete but not yet released. These are the only phases whose
// component-registry AUTO markers are filled — matching the release pipeline.
// Released phases keep their human-authored component/state tables untouched.
const newlyCompleted = phases.filter(
  (p) => p.status === 'completed' && p.completedDate === null
);

// ──── ROADMAP.md ────

applyRegions('docs/ROADMAP.md', [
  {
    open: '<!-- AUTO:phase-progress -->',
    close: '<!-- END AUTO:phase-progress -->',
    build: () => {
      const progressBar = phases
        .map((p) => {
          const bar = progressBarFilled(phaseBarSegments(p));
          return `PHASE ${p.id} ${bar}  ${p.name}`;
        })
        .join('\n');
      return `\n\`\`\`\n${progressBar}\n\`\`\`\n`;
    },
  },
  ...phases.map((phase) => ({
    open: `<!-- AUTO:phase-${phase.id}-status -->`,
    close: `<!-- END AUTO:phase-${phase.id}-status -->`,
    build: () => phaseStatusForDoc(phase),
  })),
]);

// ──── AGENTS.md ────

applyRegions('AGENTS.md', [
  {
    open: '<!-- AUTO:phase-map -->',
    close: '<!-- END AUTO:phase-map -->',
    build: () => {
      const cur = currentPhaseIdx(phases);
      const phaseLines = phases
        .map((p) => {
          const bar = progressBarFilled(phaseBarSegments(p));
          const isCurrent = cur !== null && p.id === cur;
          const suffix = isCurrent ? '   ← CURRENT' : '';
          return `PHASE ${p.id} ${bar}  ${p.name}${suffix}`;
        })
        .join('\n');
      return `\n\`\`\`\n${phaseLines}\n\`\`\`\n`;
    },
  },
  {
    open: '<!-- AUTO:package-map -->',
    close: '<!-- END AUTO:package-map -->',
    build: () => {
      const pkgLines = phases
        .filter((p) => p.packages.length > 0)
        .flatMap((p) =>
          p.packages.map((pkgName) => {
            const pkgDir = join(PACKAGES_DIR, pkgName);
            let keyFiles = '';
            if (existsSync(pkgDir)) {
              const srcFiles = readdirSync(join(pkgDir, 'src')).filter((f) =>
                f.endsWith('.ts')
              ).sort();
              keyFiles = srcFiles.map((f) => `src/${f}`).join(', ');
            }
            return `| \`packages/${pkgName}/\` | ${p.name} | \`${keyFiles || 'N/A'}\` |`;
          })
        )
        .join('\n');
      return (
        '\n| Package | Responsibility | Key files |\n' +
        '|---------|---------------|-----------|\n' +
        pkgLines +
        '\n'
      );
    },
  },
]);

// ──── Component registry — RENDERING.md ────

applyRegions('docs/component-registry/RENDERING.md', [
  ...newlyCompleted.map((phase) => ({
    open: `<!-- AUTO:rendering-phase-${phase.id} -->`,
    close: `<!-- END AUTO:rendering-phase-${phase.id} -->`,
    build: () => {
      const rows = phase.packages
        .map((pkgName) => {
          const pkgDir = join(PACKAGES_DIR, pkgName);
          let defFiles = '';
          if (existsSync(pkgDir)) {
            const srcFiles = readdirSync(join(pkgDir, 'src')).filter(
              (f) => f.endsWith('.ts') && f !== 'index.ts'
            ).sort();
            defFiles = srcFiles.map((f) => `src/${f}`).join(', ');
          }
          return `| ${pkgName} | \`packages/${pkgName}/\` | \`${defFiles || 'N/A'}\` | — | — | Extracted (Phase ${phase.id}) |`;
        })
        .join('\n');
      return (
        '\n| Component | Package | Definition | Template | Styles | Status |\n' +
        '|-----------|---------|-----------|----------|--------|--------|\n' +
        rows +
        '\n'
      );
    },
  })),
]);

// ──── Component registry — STATE.md ────

applyRegions('docs/component-registry/STATE.md', [
  ...newlyCompleted.map((phase) => ({
    open: `<!-- AUTO:state-phase-${phase.id} -->`,
    close: `<!-- END AUTO:state-phase-${phase.id} -->`,
    build: () => {
      const rows = phase.packages
        .map((pkgName) => {
          const dir = join(PACKAGES_DIR, pkgName, 'src');
          let items = '';
          if (existsSync(dir)) {
            items = readdirSync(dir)
              .filter((f) => f.endsWith('.ts'))
              .sort()
              .map((f) => `\`packages/${pkgName}/src/${f}\``)
              .join(', ');
          }
          return `| State (${pkgName}) | — | ${items || 'N/A'} | Extracted (Phase ${phase.id}) |`;
        })
        .join('\n');
      return (
        '\n| State | Type | Location | Notes |\n' +
        '|-------|------|----------|-------|\n' +
        rows +
        '\n'
      );
    },
  })),
]);

// ──── Component registry — TESTING.md ────

applyRegions('docs/component-registry/TESTING.md', [
  {
    open: '<!-- AUTO:testing-table -->',
    close: '<!-- END AUTO:testing-table -->',
    build: () => {
      const allPkgRows = phases
        .filter((p) => p.packages.length > 0)
        .flatMap((p) =>
          p.packages.map((pkgName) => {
            const pkgDir = join(PACKAGES_DIR, pkgName);
            let tests = '⚪ Placeholder';
            let testType = 'Unit';
            if (existsSync(join(pkgDir, 'tests'))) {
              const testFiles = readdirSync(join(pkgDir, 'tests')).filter(
                (f) => f.endsWith('.test.ts') && f !== 'placeholder.test.ts'
              );
              if (testFiles.length > 0) {
                const count = countTests(pkgDir);
                tests = `🟢 Written (${count} tests)`;
              }
            }
            return `| \`packages/${pkgName}/\` | \`tests/*.test.ts\` | ${testType} | — | ${tests} |`;
          })
        )
        .join('\n');
      return (
        '\n| Package | Test file | Type | Coverage target | Status |\n' +
        '|---------|-----------|------|----------------|--------|\n' +
        allPkgRows +
        '\n'
      );
    },
  },
]);

log('\n✓ docs-sync complete.');
