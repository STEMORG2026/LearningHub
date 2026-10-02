#!/usr/bin/env node
/**
 * verify-script-targets — every file a script or workflow invokes must exist.
 *
 * WHY THIS EXISTS
 * ---------------
 * `prove-gate-ladder` asserts that every stage named in a gate tier is a real
 * *script name* in `package.json`. Nothing asserted that the script's *body*
 * points at a file that exists. Those are different defects:
 *
 *   - a missing stage name      → caught by `prove-gate-ladder` / `prove-gate-integrity`
 *   - a stage whose file is gone → caught by NOTHING, until someone runs it
 *
 * The second class was live in this repository. `ci:local:list` pointed at
 * `scripts/ci-local.mjs`, which was deleted when the gate ladder replaced the
 * old local-CI runner — but the script entry stayed behind. `pnpm ci:local:list`
 * failed with MODULE_NOT_FOUND, and no guard noticed, because a broken script
 * that nothing in the gate calls is invisible to the gate.
 *
 * The defect class is: **a declared entry point that cannot execute.** It is
 * silent by construction — the only way to see it is to compare the reference
 * against the filesystem, which is what this check does.
 *
 * WHAT IT CHECKS
 * --------------
 * For every `package.json` script body and every active workflow file under
 * `.github/workflows/`, find literal interpreter invocations of a repo file
 * (`node scripts/…`, `python3 scripts/…`, `tsx scripts/…`, `bash scripts/…`,
 * `sh scripts/…`) and assert the referenced path exists on disk.
 *
 * Deliberately scoped to `scripts/` targets: that is where every real reference
 * in this repository lives, and a narrower scope keeps the check free of false
 * positives. Non-literal references (a path held in a shell variable) are out of
 * scope and would be a false negative, not a false positive.
 *
 * ADVISORY LOCALLY, AUTHORITATIVE IN CI
 * -------------------------------------
 * There is no environment split here: the check is pure filesystem comparison,
 * so it behaves identically on a developer machine and on a runner. It is wired
 * into `gate:prepush`, which means it also runs inside `verify-governance` (the
 * tiers nest), so it gates merge.
 *
 * Run via `pnpm test:script-targets`.
 *
 * Exit codes: 0 = every referenced target exists, 1 = at least one is missing.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * `--package <path>` points the check at a fixture manifest, and
 * `--package -` reads the manifest from stdin. The falsifiability proof
 * (`prove-script-targets.mjs`) uses stdin to plant a dangling reference
 * without writing a file or touching the real `package.json`.
 */
const argv = process.argv.slice(2);
const pkgFlag = argv.indexOf('--package');
const pkgArg = pkgFlag !== -1 ? argv[pkgFlag + 1] : null;
const fromStdin = pkgArg === '-';
const packagePath = fromStdin ? null : pkgArg ? resolve(repoRoot, pkgArg) : join(repoRoot, 'package.json');

/** Interpreters whose first non-flag argument is a repo file. */
const INTERPRETERS = 'node|python3|python|tsx|bash|sh';

/**
 * Match `<interpreter> [flags] scripts/<path>`.
 *
 * The optional flag group covers `node --experimental-x scripts/foo.mjs`; the
 * far more common `node scripts/foo.mjs --flag` needs nothing special because
 * the path is captured before the trailing flags.
 */
const TARGET_RE = new RegExp(
  `\\b(?:${INTERPRETERS})\\s+(?:--?[A-Za-z0-9][\\w=-]*\\s+)*(scripts/[A-Za-z0-9._/-]+)`,
  'g',
);

/** Collect every `scripts/…` target referenced in a block of text. */
function targetsIn(text) {
  const found = new Set();
  for (const m of text.matchAll(TARGET_RE)) found.add(m[1]);
  return found;
}

/** Strip whole-line comments so a comment that mentions a path is not a claim. */
const stripComments = (text) =>
  text
    .split('\n')
    .filter((line) => !/^\s*#/.test(line))
    .join('\n');

const findings = [];
const checked = [];

// ── 1. package.json scripts ────────────────────────────────────────────────
let pkg;
try {
  pkg = JSON.parse(fromStdin ? readFileSync(0, 'utf8') : readFileSync(packagePath, 'utf8'));
} catch (err) {
  console.error(`✗ could not read ${fromStdin ? '<stdin>' : packagePath}: ${err.message}`);
  process.exit(1);
}

for (const [name, body] of Object.entries(pkg.scripts ?? {})) {
  if (typeof body !== 'string') continue;
  for (const target of targetsIn(body)) {
    checked.push({ source: `package.json → ${name}`, target });
  }
}

// ── 2. Active workflow files ───────────────────────────────────────────────
// Only `.github/workflows/` — `.github/workflows-disabled/` holds parked files
// that no runner executes, so a stale reference there is not a live defect.
const workflowsDir = join(repoRoot, '.github', 'workflows');
if (existsSync(workflowsDir)) {
  for (const file of readdirSync(workflowsDir).filter((f) => /\.ya?ml$/.test(f)).sort()) {
    const text = stripComments(readFileSync(join(workflowsDir, file), 'utf8'));
    for (const target of targetsIn(text)) {
      checked.push({ source: `.github/workflows/${file}`, target });
    }
  }
}

// ── 3. Assert every referenced target exists ───────────────────────────────
console.log('Script-target existence check');
console.log('='.repeat(64));

for (const { source, target } of checked) {
  if (!existsSync(join(repoRoot, target))) {
    findings.push({ source, target });
  }
}

if (checked.length === 0) {
  // A check that scans nothing passes vacuously. Refuse that.
  console.error('✗ no script targets were found to check — the scan is not actually looking');
  process.exit(1);
}

console.log(`  scanned ${checked.length} referenced target(s)`);
for (const { source, target } of checked) {
  const mark = findings.some((f) => f.source === source && f.target === target) ? '✗' : '✓';
  console.log(`    ${mark} ${target}  ←  ${source}`);
}

if (findings.length > 0) {
  console.error('');
  console.error(`✗ ${findings.length} referenced target(s) do not exist:`);
  for (const f of findings) {
    console.error(`    ${f.target}  ←  ${f.source}`);
  }
  console.error('');
  console.error('  A declared entry point that cannot execute is a broken promise:');
  console.error('  `pnpm <script>` fails with MODULE_NOT_FOUND and nothing catches it.');
  console.error('  Restore the file, or remove/repoint the reference.');
  process.exit(1);
}

console.log('-'.repeat(64));
console.log('✓ every referenced script target exists.');
