#!/usr/bin/env node
// Real component-registry enforcement (ADR-009).
//
// For every file in docs/component-registry/ this checks:
//   1. Header contract: **Version:** and **Purpose:** present.
//   2. File:line references actually exist (file present, line within bounds).
//   3. No phantom entries: a resolvable reference to a missing file is an error,
//      unless the row/section is explicitly marked Future/Planned (documented intent).
//   4. Web Component coverage: every customElements.define('<name>', ...) in
//      packages/*/src must appear in RENDERING.md.
//
// References may be:
//   - absolute from repo root:  `packages/x/src/y.ts:12`, `legacy/js/z.js:4`
//   - relative to a package column:  `src/internal/wc.ts` under `packages/q/src`-style cells
//   - relative to legacy:  `js/...`, `css/...` under a `legacy/` cell
// Glob patterns (`tests/*.test.ts`), event names, and non-path tokens are skipped.
const { readFileSync, existsSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

const root = join(__dirname, '..');
const registryDir = join(root, 'docs/component-registry');
const packagesDir = join(root, 'packages');
const SOURCE_EXT = /\.(ts|js|cjs|mjs|css|html)$/;
const PLANNED_WORDS = /future|planned/i;

const errors = [];
const warnings = [];
const checkedFiles = new Set();

// ──── Header contract ────
function checkHeader(file, content) {
  if (!content.includes('**Version:**')) errors.push(`${file}: missing **Version:** header`);
  if (!content.includes('**Purpose:**')) errors.push(`${file}: missing **Purpose:** header`);
}

// ──── Web Component coverage (ADR-009: every component has a registry entry) ────
function findWebComponents() {
  const names = new Set();
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === 'dist' || entry === 'coverage' || entry === 'node_modules') continue;
        walk(full);
      } else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) {
        const content = readFileSync(full, 'utf8');
        const re = /customElements\.define\(\s*['"]([^'"]+)['"]/g;
        let m;
        while ((m = re.exec(content)) !== null) names.add(m[1]);
      }
    }
  };
  for (const pkg of readdirSync(packagesDir)) walk(join(packagesDir, pkg));
  return [...names];
}

function checkComponentCoverage() {
  const renderingPath = join(registryDir, 'RENDERING.md');
  if (!existsSync(renderingPath)) return;
  const rendering = readFileSync(renderingPath, 'utf8');
  for (const name of findWebComponents()) {
    checkedFiles.add(name);
    if (!rendering.includes(name)) {
      errors.push(
        `RENDERING.md: Web Component <${name}> is registered in code but missing from the rendering registry`,
      );
    }
  }
}

// ──── File:line existence ────
function lineCount(file) {
  return readFileSync(file, 'utf8').split('\n').length;
}

function resolveToken(token, pkgRoot, planned) {
  if (!token) return;
  // Skip globs, URLs, DOM ids, and tokens without a source extension.
  if (token.includes('*') || token.includes('://') || token.includes('#')) return;
  const lineMatch = token.match(/^(.*):(\d+)$/);
  const pathOnly = lineMatch ? lineMatch[1] : token;
  const line = lineMatch ? parseInt(lineMatch[2], 10) : null;
  if (!SOURCE_EXT.test(pathOnly)) return;

  let file = null;
  if (/^(packages|apps|legacy)\//.test(pathOnly)) {
    file = join(root, pathOnly);
  } else if (/^src\//.test(pathOnly) && pkgRoot) {
    file = join(pkgRoot, pathOnly);
  } else if (/^(js|css|tests)\//.test(pathOnly) && pkgRoot && pkgRoot.endsWith('legacy')) {
    file = join(pkgRoot, pathOnly);
  } else {
    return; // not resolvable deterministically — skip rather than guess
  }

  checkedFiles.add(file);
  if (!existsSync(file)) {
    const msg = `${file} — referenced but missing from the codebase`;
    if (planned) warnings.push(msg);
    else errors.push(msg);
    return;
  }
  if (line !== null) {
    const total = lineCount(file);
    if (line > total) {
      errors.push(`${file}:${line} — line exceeds file length (${total} lines)`);
    } else if (line < 1) {
      errors.push(`${file}:${line} — line must be >= 1`);
    }
  }
}

function processFile(fileName) {
  const filePath = join(registryDir, fileName);
  const content = readFileSync(filePath, 'utf8');
  checkHeader(fileName, content);

  let section = '';
  let rows = content.split('\n');
  for (let i = 0; i < rows.length; i++) {
    const line = rows[i];
    if (/^#{1,6}\s/.test(line)) section = line;
    if (!line.trim().startsWith('|')) continue;

    const cells = line
      .split('|')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    if (cells.length < 2) continue;

    // Determine row package root (e.g. `packages/quiz-engine/`, `legacy/`).
    let pkgRoot = null;
    const pkgCell = cells.find((c) => /^packages\/[\w-]+\/$/.test(c));
    if (pkgCell) pkgRoot = join(root, pkgCell.replace(/\/$/, ''));
    else if (cells.includes('legacy/')) pkgRoot = join(root, 'legacy');

    const rowText = line;
    const planned = PLANNED_WORDS.test(section) || PLANNED_WORDS.test(rowText);

    for (const cell of cells) {
      const tokens = (cell.match(/`([^`]+)`/g) || []).flatMap((t) =>
        t.slice(1, -1).split(','),
      );
      for (const raw of tokens) {
        resolveToken(raw.trim(), pkgRoot, planned);
      }
    }
  }
}

// ──── Run ────
function main() {
  if (!existsSync(registryDir)) {
    console.log('[verify-registry] ⚠  No component-registry directory found — skipping');
    process.exit(0);
  }

  checkComponentCoverage();

  const files = readdirSync(registryDir).filter((f) => f.endsWith('.md')).sort();
  for (const file of files) processFile(file);

  if (warnings.length > 0) {
    console.log(`[verify-registry] ⚠ ${warnings.length} warning(s) (future/planned refs):`);
    warnings.forEach((w) => console.log(`  ${w}`));
  }

  if (errors.length > 0) {
    console.error(`[verify-registry] ❌ ${errors.length} error(s):`);
    errors.forEach((e) => console.error(`  ${e}`));
    process.exit(1);
  }

  console.log(
    `[verify-registry] ✅ ${files.length} registry file(s) pass; ${checkedFiles.size} file reference(s) verified`,
  );
  process.exit(0);
}

main();
