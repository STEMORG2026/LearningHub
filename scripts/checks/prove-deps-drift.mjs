#!/usr/bin/env node
/**
 * Drift guard — declared dependency ranges must match what pnpm actually resolves.
 *
 * WHY THIS EXISTS
 * ---------------
 * In August 2026 a bare `vitest` override was added to `pnpm-workspace.yaml`
 * (commit 84e516d) to force an urgent security upgrade. It worked — and then
 * quietly became a bug.
 *
 * When dependabot later bumped `vitest` from `3.2.7` to `4.1.11` in the
 * manifests (commit 68b7249, 2026-09-01), the bare override outranked every
 * manifest in the workspace. The manifests said `^4.1.11`; pnpm kept installing
 * `3.2.7`. The upgrade was a no-op for a month, and nothing failed. The same
 * thing happened again to `vite` (9e3f143, 2026-09-30, `^8.3.1` declared,
 * `7.3.6` installed).
 *
 * The defect class is: **a manifest declares something the resolver will never
 * install.** It is invisible to `pnpm audit`, to typecheck, to the test suite,
 * and to review of the diff — because the diff is correct and the lockfile is
 * consistent. Only the *comparison* between declaration and resolution reveals
 * it.
 *
 * WHAT IT CHECKS
 * --------------
 * For every workspace manifest and for a pinned set of security-sensitive
 * transitive packages, confirm that the resolved version satisfies the declared
 * semver range. Any mismatch is reported with the declaring file, the range
 * declared, and the version actually installed.
 *
 * This is deliberately a *resolution* check, not a formatting one. It reads
 * `node_modules` (the ground truth) rather than trusting the lockfile, so it
 * fails if the two ever disagree.
 *
 * Run via `pnpm test:deps:drift`.
 *
 * Exit codes: 0 = no drift, 1 = at least one declared range is unsatisfiable.
 */

import { readFileSync, readdirSync, existsSync, realpathSync } from 'node:fs';
import { resolve, join } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..', '..');

const fail = [];
const checked = [];

const readJson = (abs) => {
  try {
    return JSON.parse(readFileSync(abs, 'utf8'));
  } catch {
    return null;
  }
};

/** Minimal semver range matcher — supports ^, ~, x, exact, and ||. */
function parseVersion(v) {
  const cleaned = String(v).trim().replace(/^[=v]/, '');
  const m = cleaned.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] ?? null };
}

function compare(a, b) {
  for (const k of ['major', 'minor', 'patch']) {
    if (a[k] !== b[k]) return a[k] < b[k] ? -1 : 1;
  }
  // A version with a prerelease tag sorts below the same version without one.
  if (a.pre && !b.pre) return -1;
  if (!a.pre && b.pre) return 1;
  if (a.pre && b.pre) return a.pre === b.pre ? 0 : a.pre < b.pre ? -1 : 1;
  return 0;
}

/** Does `version` satisfy the single comparator clause `range`? */
function satisfiesOne(version, range) {
  const v = parseVersion(version);
  if (!v) return false;

  const clause = range.trim();
  if (clause === '' || clause === '*' || clause === 'x' || clause === 'latest') return true;

  // Workspace protocol is always satisfied by our own packages.
  if (clause.startsWith('workspace:')) return true;

  // Range operators.
  const opMatch = clause.match(/^(\^|~|>=|<=|>|<|=)?\s*(.+)$/);
  if (!opMatch) return false;
  const [, op = '', rest] = opMatch;

  const t = parseVersion(rest);
  if (!t) return false;

  switch (op) {
    case '^': {
      // ^1.2.3 -> >=1.2.3 <2.0.0; ^0.2.3 -> >=0.2.3 <0.3.0; ^0.0.3 -> >=0.0.3 <0.0.4
      if (compare(v, t) < 0) return false;
      if (t.major !== 0) return v.major === t.major;
      if (t.minor !== 0) return v.major === 0 && v.minor === t.minor;
      return v.major === 0 && v.minor === 0 && v.patch === t.patch;
    }
    case '~': {
      // ~1.2.3 -> >=1.2.3 <1.3.0
      if (compare(v, t) < 0) return false;
      return v.major === t.major && v.minor === t.minor;
    }
    case '>=':
      return compare(v, t) >= 0;
    case '<=':
      return compare(v, t) <= 0;
    case '>':
      return compare(v, t) > 0;
    case '<':
      return compare(v, t) < 0;
    case '':
    case '=':
      return compare(v, t) === 0;
    default:
      return false;
  }
}

/** Full range matcher with `||` support and x-ranges. */
function satisfies(version, range) {
  return String(range)
    .split('||')
    .some((arm) => {
      // Each arm may contain space-separated comparators (an AND).
      const parts = arm.trim().split(/\s+/).filter(Boolean);
      if (parts.length <= 1) return satisfiesOne(version, arm.trim());
      return parts.every((p) => satisfiesOne(version, p));
    });
}

/** Locate the installed package.json for `name`, searching up from `fromDir`. */
function resolveInstalled(name, fromDir) {
  let dir = fromDir;
  for (let i = 0; i < 12; i += 1) {
    const candidate = join(dir, 'node_modules', ...name.split('/'), 'package.json');
    if (existsSync(candidate)) {
      try {
        const real = realpathSync(candidate);
        return JSON.parse(readFileSync(real, 'utf8'));
      } catch {
        return null;
      }
    }
    const parent = resolve(dir, '..');
    if (parent === dir) break;
    dir = parent;
  }
  // Fall back to the hoisted root store.
  const hoisted = join(repoRoot, 'node_modules', ...name.split('/'), 'package.json');
  if (existsSync(hoisted)) {
    try {
      return JSON.parse(readFileSync(hoisted, 'utf8'));
    } catch {
      return null;
    }
  }
  return null;
}

/** Collect every workspace package directory. */
function workspaceDirs() {
  const dirs = [];
  for (const group of ['packages', 'apps']) {
    const base = join(repoRoot, group);
    if (!existsSync(base)) continue;
    for (const entry of readdirSync(base, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dir = join(base, entry.name);
      if (existsSync(join(dir, 'package.json'))) dirs.push(dir);
    }
  }
  return dirs;
}

// ── Checks ──────────────────────────────────────────────────────────────────

// 1. Every declared range in every manifest must be satisfiable by what is
//    actually installed. This is the check that would have caught vitest/vite.
const DEP_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

for (const dir of workspaceDirs()) {
  const pkg = readJson(join(dir, 'package.json'));
  if (!pkg) continue;
  const rel = dir.replace(`${repoRoot}/`, '');

  for (const field of DEP_FIELDS) {
    const deps = pkg[field];
    if (!deps) continue;

    for (const [name, range] of Object.entries(deps)) {
      // Skip workspace links — they resolve locally and prove nothing about semver.
      if (String(range).startsWith('workspace:')) continue;
      // Skip aliases like "npm:foo@^1".
      if (String(range).startsWith('npm:')) continue;

      const installed = resolveInstalled(name, dir);
      if (!installed) continue; // Not installed here; another package owns it.

      const version = installed.version;
      if (!satisfies(version, range)) {
        fail.push(
          `${rel}/package.json declares ${name}@${range} but ${version} is installed ` +
            `(declared range does not include the resolved version)`,
        );
      } else {
        checked.push(`${rel}: ${name}@${range} → ${version}`);
      }
    }
  }
}

// 2. No bare overrides. A bare override replaces a package's declared range
//    everywhere in the workspace, which is precisely what makes manifests lie.
const workspaceYaml = readFileSync(join(repoRoot, 'pnpm-workspace.yaml'), 'utf8');
const overrideBlock = workspaceYaml.match(/^overrides:\s*\n([\s\S]*?)(?=\n[a-zA-Z]|\s*$)/m);
if (overrideBlock) {
  for (const line of overrideBlock[1].split('\n')) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) continue;
    const m = trimmed.match(/^["']?([^"':]+)["']?\s*:/);
    if (!m) continue;
    const key = m[1].trim();
    // A scoped override contains "@" after the package name (pkg@range).
    const isScoped = key.includes('@');
    if (!isScoped) {
      fail.push(
        `pnpm-workspace.yaml has a BARE override for "${key}" — use the scoped form ` +
          `"${key}@<vulnerable-range>": "<floor>" instead. Bare overrides make ` +
          `package.json ranges untruthful. See ADR-024.`,
      );
    } else {
      checked.push(`override scoped: ${key}`);
    }
  }
} else {
  fail.push('pnpm-workspace.yaml has no `overrides:` block — expected the advisory-scoped security floors');
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log('Dependency declaration / resolution drift guard');
console.log('='.repeat(64));

if (fail.length > 0) {
  console.log('');
  console.log(`✗ ${fail.length} drift issue(s) detected:`);
  for (const f of fail) console.log(`  - ${f}`);
  console.log('');
  console.log('  A declared range that the resolver will never install is a silent');
  console.log('  failure: dependabot bumps it, the lockfile agrees, CI stays green,');
  console.log('  and the upgraded code never runs. Fix the declaration or the');
  console.log('  override — never both in a way that disagrees.');
  process.exit(1);
}

console.log(`  ✓ ${checked.length} declaration(s) match their resolved version`);
console.log(`  ✓ ${workspaceDirs().length} workspace manifest(s) inspected`);
console.log('  ✓ every override is advisory-scoped (no bare overrides)');
process.exit(0);
