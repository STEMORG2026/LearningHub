#!/usr/bin/env node
/**
 * Flake detector — order-dependence and non-determinism hunter.
 *
 * WHY THIS EXISTS
 * ---------------
 * A green suite proves the tests pass *in one particular order*. It does not
 * prove they pass in *every* order. Tests that share module-level state,
 * leak timers, mutate a singleton, or rely on a `beforeAll` in a sibling file
 * will pass today and fail the moment someone adds an import, renames a file,
 * or bumps a runner version that changes scheduling.
 *
 * Two independent failure modes are hunted here:
 *
 *   1. ORDER DEPENDENCE  — the test only passes because of what ran before it.
 *      Detected by running the suite with files and tests shuffled across
 *      several seeds. If seed A passes and seed B fails, the failing test is
 *      order-dependent, not flaky-at-random.
 *
 *   2. NON-DETERMINISM   — the test is unstable even at a fixed seed, because
 *      it races a timer, depends on wall-clock time, or reads real entropy.
 *      Detected by running the SAME seed more than once and requiring identical
 *      outcomes. A fixed seed that produces two different results is proof the
 *      test does not depend on the seed at all.
 *
 * Mode 2 is the important one. Re-running a suite N times without pinning the
 * seed is a weak test: if it fails you learn nothing about *why*. Pinning the
 * seed and requiring reproducibility separates "this test is order-sensitive"
 * from "this test is genuinely random", which are different bugs with different
 * fixes.
 *
 * DESIGN CONSTRAINTS
 * ------------------
 * - Zero custom test tooling. Vitest 4 already implements shuffling and seeding;
 *   reimplementing them would test my shuffle, not the suite.
 * - Cache-proof. `turbo test` caches on input hashes, so a second run can be a
 *   cache hit replaying the FIRST run's result. Every invocation here passes an
 *   explicit `--force` so a cache hit can never masquerade as a pass.
 * - Read-only. This script never writes to source, never edits a test, never
 *   touches the lockfile. It only runs the suite and reports.
 *
 * USAGE
 *   node scripts/checks/detect-flakes.mjs                  # default: 5 seeds x 2 reps
 *   node scripts/checks/detect-flakes.mjs --seeds=8        # more seeds = more orders
 *   node scripts/checks/detect-flakes.mjs --reps=3         # 3 runs per seed
 *   node scripts/checks/detect-flakes.mjs --filter=@learninghub/core
 *   node scripts/checks/detect-flakes.mjs --suite=packages/core
 *   node scripts/checks/detect-flakes.mjs --json=out.json  # machine-readable report
 *
 * EXIT CODES
 *   0 = no flakes detected
 *   1 = order dependence or non-determinism detected
 *   2 = harness error (suite could not be run at all)
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ── Argument parsing ───────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const has = (name) => args.includes(`--${name}`);

const seedCount = Number(flag('seeds', '5'));
const reps = Number(flag('reps', '2'));
const filter = flag('filter', null);
const suite = flag('suite', null);
const jsonOut = flag('json', null);
const baseSeed = Number(flag('base-seed', '1'));
// Bounded so a mistyped flag cannot spawn thousands of runs.
const MAX_RUNS = 40;

if (!Number.isInteger(seedCount) || seedCount < 1 || seedCount > 20) {
  console.error(`✗ --seeds must be an integer 1..20 (got ${flag('seeds', '5')})`);
  process.exit(2);
}
if (!Number.isInteger(reps) || reps < 1 || reps > 5) {
  console.error(`✗ --reps must be an integer 1..5 (got ${flag('reps', '2')})`);
  process.exit(2);
}
if (seedCount * reps > MAX_RUNS) {
  console.error(
    `✗ ${seedCount} seeds x ${reps} reps = ${seedCount * reps} runs exceeds the ` +
      `${MAX_RUNS}-run cap. Lower --seeds or --reps.`,
  );
  process.exit(2);
}

const repoRoot = resolve(import.meta.dirname, '..', '..');

// ── Build the invocation ───────────────────────────────────────────────────
// Two distinct shapes, and they are NOT interchangeable:
//
//   turbo:   turbo run test --force -- <vitest flags>
//            `--force` is TURBO's flag and must precede `--`.
//            Everything after `--` is forwarded to the package script.
//
//   direct:  pnpm --filter <pkg> test -- <vitest flags>
//            No turbo in the path, so no `--force` — vitest would reject it
//            with "Unknown option `--force`". There is no cache to defeat when
//            the runner is invoked directly.
//
// Getting this wrong is silent-ish: a misplaced `--force` makes vitest exit 1
// with a CACError, which reads as "every seed failed" — i.e. it looks like a
// catastrophic flake finding when it is actually a harness bug. Hence the
// assertion below: if EVERY run fails identically, that's a harness smell.
const VITEST_FLAGS = (seed) => [
  '--sequence.shuffle.files',
  '--sequence.shuffle.tests',
  `--sequence.seed=${seed}`,
  // Explicit rather than inheriting the package config: this script's whole
  // premise is that it controls ordering, so it must set it itself.
  '--reporter=dot',
];

function buildArgs(seed) {
  if (suite) {
    const pkg = `@learninghub/${suite.replace(/^packages\//, '')}`;
    return { cmd: 'pnpm', argv: ['--filter', pkg, 'test', '--', ...VITEST_FLAGS(seed)] };
  }
  const target = filter ? ['--filter', filter] : [];
  return {
    cmd: 'pnpm',
    argv: ['exec', 'turbo', 'run', 'test', ...target, '--force', '--', ...VITEST_FLAGS(seed)],
  };
}

const HARNESS_ERROR_SIGNATURES = [
  /CACError/i,
  /Unknown option/i,
  /command not found/i,
  /Cannot find module .*vitest/i,
  /ERR_PNPM_NO_MATCHING_VERSION/,
  /ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL/,
];
// ── Run classification ─────────────────────────────────────────────────────
// The exit code ALONE is not trustworthy. Verified empirically in this repo:
//
//   $ pnpm --filter @learninghub/does-not-exist test ; echo $?
//   No projects matched the filters in "/home/sajan/Projects/LearningHub"
//   0
//
// pnpm exits 0 having run NOTHING. A detector that trusted the exit code would
// report "no flakes detected" for a scope it never tested — the single most
// dangerous failure mode a verification tool can have, because it manufactures
// confidence. So a run only counts as a pass if it produced positive evidence
// that tests executed.

// ANSI escapes are stripped before ANY pattern matching. When output is piped
// rather than attached to a TTY, vitest still emits colour, which wraps tokens
// like "Test Files" in escape sequences and silently defeats every regex here.
// This is why `FORCE_COLOR=0` alone is not enough — the CI env var re-enables
// colour downstream. Stripping is the only robust answer.
const stripAnsi = (s) => s.replace(/\u001b\[[0-9;]*m/g, '');

const NO_PROJECT_MATCHED = /No projects matched the filters/i;
const looksLikeHarnessError = (out) => HARNESS_ERROR_SIGNATURES.some((re) => re.test(out));

// A real run always prints a vitest summary. Accept every observed shape:
//   "Test Files  3 passed (3)"
//   "Test Files  1 failed | 3 passed (4)"
//   "Tests  2 failed | 128 passed (130)"
const lookedLikeRealRun = (out) =>
  /Test Files\s+\d+/.test(out) || /Tests\s+\d+\s+(?:failed|passed)/.test(out);

function classify(res) {
  const out = stripAnsi(res.output);
  if (res.error) {
    return { verdict: 'harness-error', reason: res.error.message };
  }
  if (NO_PROJECT_MATCHED.test(out)) {
    return { verdict: 'harness-error', reason: 'no projects matched the filter (nothing was executed)' };
  }
  const ran = lookedLikeRealRun(out);
  if (!ran) {
    if (res.status !== 0 || looksLikeHarnessError(out)) {
      return { verdict: 'harness-error', reason: `runner failed before executing tests (exit ${res.status})` };
    }
    return { verdict: 'harness-error', reason: 'exit 0 but no test summary was printed — nothing verified' };
  }
  return { verdict: res.status === 0 ? 'pass' : 'fail', reason: null };
}

function runOnce(seed) {
  const { cmd, argv } = buildArgs(seed);
  const started = Date.now();
  const res = spawnSync(cmd, argv, {
    cwd: repoRoot,
    encoding: 'utf8',
    // Enough headroom for a cold turbo graph; a timeout is itself a finding.
    timeout: 15 * 60 * 1000,
    // Property tests intentionally log subscriber errors, and a shuffled run
    // can emit >150KB of stderr. The 1MB spawnSync default is close enough to
    // the real ceiling to risk a silent truncation, so raise it explicitly.
    maxBuffer: 64 * 1024 * 1024,
    // NO_COLOR + FORCE_COLOR together: belt and braces. Output is still
    // ANSI-stripped before matching, because CI=1 can re-enable colour anyway.
    env: { ...process.env, CI: '1', FORCE_COLOR: '0', NO_COLOR: '1' },
  });
  const output = `${res.stdout ?? ''}\n${res.stderr ?? ''}`;
  // spawnSync sets `error` on timeout/kill; treat those as failures with a
  // distinct label so they are never silently reported as "pass".
  if (res.error) {
    return { passed: false, output: `${output}\n[harness] ${res.error.message}`, durationMs: Date.now() - started, failedTests: [] };
  }
  const base = {
    passed: res.status === 0,
    status: res.status,
    output,
    durationMs: Date.now() - started,
    failedTests: extractFailures(output),
  };
  const c = classify(base);
  return { ...base, verdict: c.verdict, reason: c.reason, passed: c.verdict === 'pass' };
}

// ── Failure extraction ─────────────────────────────────────────────────────
// Vitest's `dot` reporter keeps failing test names. Pull the durable
// identifiers out so the report names the culprit instead of saying "a run
// failed". Matching several shapes because reporter output varies by version.
function extractFailures(rawOutput) {
  const output = stripAnsi(rawOutput);
  const found = new Set();
  const patterns = [
    /^\s*(?:×|✗|FAIL)\s+(.+?)(?:\s+\d+ms)?$/gm, // failing test lines
    /^\s*FAIL\s+(\S+)/gm, // file-level failure banner
    /AssertionError:.*?\n\s*.*?([\w./-]+\.test\.ts)/g, // assertion with a file
  ];
  for (const re of patterns) {
    for (const m of output.matchAll(re)) {
      const name = m[1].trim().replace(/\s+/g, ' ');
      if (name && name.length < 300) found.add(name);
    }
  }
  return [...found];
}

// ── The sweep ──────────────────────────────────────────────────────────────
console.log('Flake detection sweep');
console.log('='.repeat(64));
console.log(`  seeds        : ${seedCount} (base ${baseSeed})`);
console.log(`  reps per seed: ${reps}`);
console.log(`  scope        : ${suite ?? filter ?? '(all packages)'}`);
console.log(`  total runs   : ${seedCount * reps}`);
console.log('');

const seeds = Array.from({ length: seedCount }, (_, i) => baseSeed + i);

// Observation 1: order dependence. One run per distinct seed. Different seeds
// explore different orders; a failure in ANY seed is order-dependence evidence.
const perSeed = new Map();
let orderDependent = false;

for (const seed of seeds) {
  process.stdout.write(`  seed ${String(seed).padStart(6)} (order sweep) ... `);
  const r = runOnce(seed);
  perSeed.set(seed, [{ rep: 0, ...r }]);
  console.log(r.passed ? `pass ${r.durationMs}ms` : `FAIL ${r.durationMs}ms`);
  if (r.verdict === 'fail') orderDependent = true;
}

// Observation 2: non-determinism. Re-run each seed and require the outcome to
// be stable. Same seed, two different results => the result does not actually
// depend on the seed, which means the test reads real-world entropy.
let nonDeterministic = false;
const unstable = [];

if (reps > 1) {
  console.log('');
  for (const seed of seeds) {
    const baseline = perSeed.get(seed)[0];
    for (let rep = 1; rep < reps; rep += 1) {
      process.stdout.write(`  seed ${String(seed).padStart(6)} (rep ${rep})      ... `);
      const r = runOnce(seed);
      perSeed.get(seed).push({ rep, ...r });
      const agrees = r.passed === baseline.passed;
      // A harness error on the re-run is not "instability" — it is a broken
      // run. Only call it non-determinism when both runs genuinely executed
      // and disagreed about the outcome.
      const bothRan = r.verdict !== 'harness-error' && baseline.verdict !== 'harness-error';
      console.log(agrees ? `stable ${r.durationMs}ms` : `UNSTABLE ${baseline.passed ? 'pass' : 'FAIL'}->${r.passed ? 'pass' : 'FAIL'}`);
      if (!agrees && bothRan) {
        nonDeterministic = true;
        unstable.push({ seed, rep, baseline: baseline.passed, observed: r.passed });
      }
    }
  }
}

// ── Report ─────────────────────────────────────────────────────────────────
const allRuns = [...perSeed.values()].flat();
const failures = allRuns.filter((r) => r.verdict === 'fail');
const harnessErrors = allRuns.filter((r) => r.verdict === 'harness-error');
const culpritTests = [...new Set(failures.flatMap((r) => r.failedTests))];
const slowest = allRuns.reduce((a, b) => (a.durationMs > b.durationMs ? a : b));
const totalMs = allRuns.reduce((a, r) => a + r.durationMs, 0);

console.log('');
console.log('='.repeat(64));
console.log(`  runs executed      : ${allRuns.length}`);
console.log(`  runs that verified : ${allRuns.length - harnessErrors.length}`);
console.log(`  passing runs       : ${allRuns.filter((r) => r.verdict === 'pass').length}`);
console.log(`  failing runs       : ${failures.length}`);
if (harnessErrors.length) console.log(`  HARNESS ERRORS     : ${harnessErrors.length}`);
console.log(`  order dependence   : ${orderDependent ? 'DETECTED' : 'none'}`);
console.log(`  non-determinism    : ${nonDeterministic ? 'DETECTED' : 'none (all seeds reproducible)'}`);
console.log(`  wall time          : ${(totalMs / 1000).toFixed(1)}s (slowest single run ${slowest.durationMs}ms)`);

if (culpritTests.length) {
  console.log('');
  console.log('  named failures:');
  for (const t of culpritTests.slice(0, 20)) console.log(`    - ${t}`);
  if (culpritTests.length > 20) console.log(`    ... and ${culpritTests.length - 20} more`);
}

if (unstable.length) {
  console.log('');
  console.log('  non-deterministic seeds (same seed, different outcome):');
  for (const u of unstable) {
    console.log(`    - seed ${u.seed} rep ${u.rep}: ${u.baseline ? 'pass' : 'FAIL'} then ${u.observed ? 'pass' : 'FAIL'}`);
  }
}

if (jsonOut) {
  const report = {
    generatedAt: new Date().toISOString(),
    scope: suite ?? filter ?? 'all',
    seeds,
    reps,
    runs: allRuns.length,
    failingRuns: failures.length,
    orderDependent,
    nonDeterministic,
    culpritTests,
    unstable,
    durationsMs: allRuns.map((r) => r.durationMs),
  };
  writeFileSync(resolve(repoRoot, jsonOut), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`\n  machine-readable report -> ${jsonOut}`);
}

// A harness that reports "every run failed" MAY be broken — but it may also be
// reporting a genuine universal failure. The discriminator is not the failure
// COUNT, it is the failure KIND:
//
//   harness error  -> the runner never started (bad flag, missing binary,
//                     unresolvable package). Output contains CLI-level noise
//                     and no test ever reported a result.
//   real failure   -> the runner started and tests actually ran and failed.
//                     That is a finding, even if it is universal.
//
// Conflating the two would throw away true positives, which is worse than
// useless: it teaches the operator to ignore the alarm.
// ONLY true CLI/runner-level failures belong here. Note what is deliberately
// absent: pnpm's `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL` banner. pnpm prints that
// for ANY non-zero exit, including ordinary test failures, so treating it as a
// harness signal misclassifies every real finding as a broken config.

// ── Refuse to certify an untested scope ────────────────────────────────────
// This guard is the whole point of the run-classification work above. If any
// run did not actually execute tests, the sweep cannot claim the suite is
// flake-free — absence of evidence is not evidence of absence. Without this,
// `--suite=packages/typo` would print "No flakes detected" for a scope that
// pnpm silently skipped with exit 0.
if (harnessErrors.length > 0) {
  console.log('');
  console.log(`✗ HARNESS ERROR: ${harnessErrors.length}/${allRuns.length} run(s) never verified anything.`);
  for (const r of harnessErrors.slice(0, 3)) console.log(`  - ${r.reason}`);
  console.log('  Refusing to report a verdict for a scope that was not actually tested.');
  console.log(`  Verify manually: ${suite ? `pnpm --filter @learninghub/${suite.replace(/^packages\//, '')} test` : 'pnpm exec turbo run test'}`);
  process.exit(2);
}

// A total wipeout with tests genuinely executing is a real (if universal)
// finding, not a harness fault. Say so plainly so nobody "fixes" the alarm.
if (failures.length === allRuns.length && allRuns.length > 1) {
  console.log('');
  console.log('⚠ EVERY run failed — but tests DID execute, so this is a real finding,');
  console.log('  not a harness fault. A universally-failing suite is order-INDEPENDENT:');
  console.log('  expect an unconditional bug or a deliberately broken probe.');
}

console.log('');
const clean = !orderDependent && !nonDeterministic;
if (clean) {
  console.log(`✓ No flakes detected across ${allRuns.length} runs / ${seedCount} distinct orderings.`);
  process.exit(0);
}
console.log('✗ Flake risk detected. A test that is not order-independent is a latent CI failure.');
if (orderDependent && !nonDeterministic) {
  console.log('  Only order dependence was found: look for shared module state, singletons,');
  console.log('  leaked timers, or cleanup that assumes a sibling file ran first.');
}
if (nonDeterministic) {
  console.log('  Non-determinism at a FIXED seed: look for wall-clock reads, Math.random,');
  console.log('  real timers, unresolved promises, or filesystem/network access.');
}
process.exit(1);
