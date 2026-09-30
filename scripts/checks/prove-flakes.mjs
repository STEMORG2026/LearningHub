#!/usr/bin/env node
/**
 * Falsifiability proof for the flake detector.
 *
 * WHY THIS EXISTS
 * ---------------
 * A detector that always reports "clean" is worse than no detector: it
 * manufactures confidence. This script proves `detect-flakes.mjs` can actually
 * fail, by pointing it at scenarios with known-planted defects and asserting
 * it reacts correctly.
 *
 * It also guards the two false-negative bugs that were found and fixed during
 * development of the detector itself, both of which produced a cheerful
 * "✓ No flakes detected":
 *
 *   1. A bogus `--suite` name. `pnpm --filter <missing> test` exits 0 having
 *      run NOTHING, so an exit-code-only check certified an untested scope.
 *   2. ANSI escapes in captured output. Piped vitest output still contains
 *      colour codes that wrap "Test Files", silently defeating the regex that
 *      proves tests actually executed.
 *
 * Both are regression-tested below, because both were invisible failures that
 * looked exactly like success.
 *
 * SAFETY
 * ------
 * The order-dependent probe is a temporary file created under a clearly-marked
 * name and removed in a `finally` block. It never modifies existing sources or
 * existing tests. If the process is killed mid-run, the stale probe is refused
 * rather than silently reused.
 *
 * Usage:  node scripts/checks/prove-flakes.mjs
 * Exit:   0 = the detector behaved correctly in every scenario
 *         1 = the detector failed a scenario (it is not trustworthy)
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..', '..');
const PROBE = resolve(repoRoot, 'packages/core/tests/__flakeproof-probe.test.ts');
const DETECTOR = resolve(repoRoot, 'scripts/checks/detect-flakes.mjs');

const PROBE_SOURCE = `// TEMPORARY — created and deleted by scripts/checks/prove-flakes.mjs.
// Deliberately order-dependent: it requires a sibling test file to have already
// populated module-level state. Under shuffled ordering it must fail at least
// one seed, which is what makes it a valid positive control.
describe('flake-detector positive control', () => {
  it('fails unless a sibling ran first', () => {
    const seen = (globalThis as { __proofState?: string }).__proofState;
    (globalThis as { __proofState?: string }).__proofState = 'set';
    expect(seen).toBe('set');
  });
});
`;

// Refuse to start if a previous run died before cleanup, rather than
// interpreting someone else's leftover as part of this experiment.
if (existsSync(PROBE)) {
  console.error(`✗ stale probe found at ${PROBE}`);
  console.error('  A previous run did not clean up. Inspect and remove it, then retry.');
  process.exit(1);
}

const results = [];
let probeCreated = false;

function scenario(name, { seeds, reps, suite, expectExit, expectText }) {
  const args = ['--seeds', String(seeds), '--reps', String(reps)];
  if (suite) args.push(`--suite=${suite}`);
  const r = spawnSync('node', [DETECTOR, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, NO_COLOR: '1' },
  });
  const out = r.stdout + r.stderr;
  const exitOk = r.status === expectExit;
  const textOk = expectText ? expectText.test(out) : true;
  results.push({ name, pass: exitOk && textOk, exit: r.status, expected: expectExit, textOk, out });
  return { exitOk, textOk, out, status: r.status };
}

try {
  // ── Scenario 1: the detector must NOT certify a scope it never tested ────
  // Regression guard for the pnpm "No projects matched" false-negative.
  scenario('untested scope is refused (not certified)', {
    seeds: 2,
    reps: 1,
    suite: 'packages/definitely-not-a-real-package',
    expectExit: 2,
    expectText: /Refusing to report a verdict|HARNESS ERROR/,
  });

  // ── Scenario 2: a genuinely green suite must be certified clean ──────────
  scenario('clean suite is certified clean', {
    seeds: 2,
    reps: 2,
    suite: 'packages/core',
    expectExit: 0,
    expectText: /No flakes detected/,
  });

  // ── Scenario 3: planted order-dependence MUST be detected ────────────────
  // The core deliverable of this script: proof the detector can fail.
  writeFileSync(PROBE, PROBE_SOURCE);
  probeCreated = true;
  scenario('planted order-dependence is detected', {
    seeds: 3,
    reps: 1,
    suite: 'packages/core',
    expectExit: 1,
    expectText: /order dependence\s*:\s*DETECTED/,
  });
} finally {
  if (probeCreated && existsSync(PROBE)) {
    unlinkSync(PROBE);
  }
}

// Verify cleanup actually happened — a probe left behind would poison the real
// suite on the next run, which is exactly the kind of side effect a proof
// harness must never have.
if (existsSync(PROBE)) {
  console.error(`✗ cleanup failed: ${PROBE} still exists`);
  process.exit(1);
}

// ── Report ─────────────────────────────────────────────────────────────────
console.log('Flake-detector falsifiability proof');
console.log('='.repeat(64));
for (const r of results) {
  const mark = r.pass ? '✓' : '✗';
  const detail = r.pass ? '' : ` (exit ${r.exit}, expected ${r.expected}${r.textOk ? '' : ', output assertion failed'})`;
  console.log(`  ${mark} ${r.name}${detail}`);
}
console.log('');

const failed = results.filter((r) => !r.pass);
if (failed.length === 0) {
  console.log('✓ Detector is falsifiable: it detects planted flaws, certifies clean');
  console.log('  suites, and refuses to certify a scope it never actually tested.');
  console.log('  Probe removed; suite restored.');
  process.exit(0);
}

console.log(`✗ ${failed.length} scenario(s) failed — the detector cannot be trusted.`);
for (const f of failed) {
  console.log('');
  console.log(`  ── ${f.name} (exit ${f.exit}, expected ${f.expected}) ──`);
  for (const line of f.out.split('\n').slice(-25)) {
    if (line.trim()) console.log(`  | ${line}`);
  }
}
process.exit(1);
