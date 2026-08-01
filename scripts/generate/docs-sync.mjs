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
 *   - deterministic (derived from .phase.json + packages/ on disk)
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
  return phase.status;
}

function progressBarFilled(n) {
  return '█'.repeat(Math.min(10, n)) + '░'.repeat(Math.max(0, 10 - n));
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

let phaseState = { phases: [] };
if (existsSync(PHASE_PATH)) {
  phaseState = JSON.parse(readFileSync(PHASE_PATH, 'utf8'));
}
const phases = Array.isArray(phaseState.phases) ? phaseState.phases : [];
if (phases.length === 0) {
  log('⚠ No phases found in .phase.json — nothing to regenerate.');
}

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
          const bar = progressBarFilled(p.status === 'completed' ? 10 : 0);
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
          const bar = progressBarFilled(p.status === 'completed' ? 10 : 0);
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
