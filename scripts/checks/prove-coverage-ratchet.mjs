#!/usr/bin/env node
/**
 * Enforcement for the Coverage Ratchet — thresholds may only move UPWARD.
 *
 * WHY THIS EXISTS
 * ---------------
 * `docs/RULES.md` states that per-package coverage thresholds "only ever move
 * upward". Nothing enforced that. A contributor facing a red build had a
 * one-line escape hatch: lower the threshold. That is the single most tempting
 * way to make a gate go green without fixing anything, and it is invisible in
 * review when buried in a large diff.
 *
 * This check closes that hole. It compares every `vitest.config.*.ts`
 * `thresholds` block against the same file on the base ref and fails if any
 * metric went DOWN, or if a threshold block was deleted entirely.
 *
 * Raising a threshold is always allowed and never needs justification here —
 * the ratchet only resists loosening.
 *
 * WHY GIT-DIFF AND NOT A COMMITTED BASELINE
 * -----------------------------------------
 * A committed baseline JSON could itself be edited in the same PR that lowers
 * the threshold, defeating the check. Comparing against the base ref means the
 * only way to loosen a threshold is to change it in a commit that this check
 * can see — there is no second file to quietly update alongside it.
 *
 * Run via `pnpm verify-governance` (stage `test:coverage:ratchet`).
 *
 * Exit codes: 0 = no threshold loosened, 1 = at least one regressed.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const args = process.argv.slice(2);
const baseFlag = args.indexOf('--base');
let base = baseFlag !== -1 ? args[baseFlag + 1] : null;

const pass = [];
const fail = [];

/** Spawn a git command, returning stdout or null on any failure. */
function git(...gitArgs) {
  try {
    return execFileSync('git', gitArgs, { cwd: repoRoot, encoding: 'utf8' });
  } catch {
    return null;
  }
}

/**
 * Resolve the base ref: explicit flag, else origin/main, else main, else HEAD~
 * when there is no base to compare against (single-commit repo).
 */
function resolveBase() {
  if (base) return base;
  if (git('rev-parse', '--verify', 'origin/main')) return 'origin/main';
  if (git('rev-parse', '--verify', 'main')) return 'main';
  return null;
}

/**
 * Extract the numeric `thresholds` values from a vitest config's source text.
 *
 * Reads the `thresholds: { ... }` object and captures `metric: number` pairs.
 * Deliberately tolerant of formatting; it only needs the numbers.
 */
function parseThresholds(src) {
  const out = {};
  if (!src) return out;
  const idx = src.indexOf('thresholds');
  if (idx === -1) return out;
  // Slice a bounded window after `thresholds` so we read the object that
  // belongs to it and not an unrelated later block.
  const window = src.slice(idx, idx + 600);
  const open = window.indexOf('{');
  if (open === -1) return out;
  let depth = 0;
  let end = -1;
  for (let i = open; i < window.length; i += 1) {
    if (window[i] === '{') depth += 1;
    else if (window[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const body = window.slice(open + 1, end === -1 ? window.length : end);
  for (const m of body.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(\d+(?:\.\d+)?)/g)) {
    const key = m[1];
    const value = Number(m[2]);
    if (key && Number.isFinite(value)) out[key] = value;
  }
  return out;
}

/** Read a file's content at an arbitrary git ref (null if absent there). */
function contentAt(ref, relPath) {
  const text = git('show', `${ref}:${relPath}`);
  return text === null ? null : text;
}

/** Discover every vitest config in the workspace. */
function configFiles() {
  const found = [];
  for (const scope of ['packages', 'apps']) {
    const dir = join(repoRoot, scope);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      const pkgDir = join(dir, name);
      if (!statSync(pkgDir).isDirectory()) continue;
      for (const entry of readdirSync(pkgDir)) {
        if (/^vitest\.config\.(ts|mts|js|mjs)$/.test(entry)) {
          found.push(`${scope}/${name}/${entry}`);
        }
      }
    }
  }
  return found.sort();
}

console.log('Coverage-threshold ratchet enforcement');
console.log('='.repeat(64));

const baseRef = resolveBase();

if (!baseRef) {
  console.log('  ⚠ no base ref available — ratchet cannot compare (skipped)');
  process.exit(0);
}

pass.push(`base ref for comparison: ${baseRef}`);

let checked = 0;
let raised = 0;

for (const rel of configFiles()) {
  const current = parseThresholds(readFileSync(join(repoRoot, rel), 'utf8'));
  const previousSrc = contentAt(baseRef, rel);
  const previous = parseThresholds(previousSrc);

  // A brand-new package has no baseline; nothing to ratchet against.
  if (previousSrc === null) {
    pass.push(`${rel} is new — no baseline to ratchet`);
    continue;
  }

  checked += 1;

  // Removing a threshold block entirely is the crudest form of loosening.
  if (Object.keys(previous).length > 0 && Object.keys(current).length === 0) {
    fail.push(
      `${rel} — threshold block REMOVED (was ${JSON.stringify(previous)}); ` +
        'thresholds may rise but never disappear',
    );
    continue;
  }

  for (const [metric, before] of Object.entries(previous)) {
    const after = current[metric];
    if (after === undefined) {
      fail.push(`${rel} — '${metric}' threshold REMOVED (was ${before})`);
      continue;
    }
    if (after < before) {
      fail.push(`${rel} — '${metric}' LOWERED ${before} → ${after} (ratchet may only rise)`);
    } else if (after > before) {
      raised += 1;
      pass.push(`${rel} — '${metric}' raised ${before} → ${after}`);
    }
  }
}

if (checked === 0) {
  fail.push('no comparable vitest configs found — the ratchet is not actually checking anything');
}

pass.forEach((p) => console.log(`  ✓ ${p}`));
fail.forEach((f) => console.log(`  ✗ ${f}`));

console.log('-'.repeat(64));
console.log(`  ${checked} config(s) compared · ${raised} threshold(s) raised · ${fail.length} regression(s)`);

if (fail.length > 0) {
  console.error('\n✗ Coverage thresholds were loosened. Raise tests, not the escape hatch.');
  process.exit(1);
}

console.log('✓ No coverage threshold was lowered — the ratchet holds.');
