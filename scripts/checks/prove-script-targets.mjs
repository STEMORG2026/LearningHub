#!/usr/bin/env node
/**
 * prove-script-targets — falsifiability proof for `verify-script-targets`.
 *
 * WHY THIS EXISTS
 * ---------------
 * `AGENTS.md` and `docs/RULES.md` state the rule this file obeys:
 *
 *   > A guard or detector you add must itself be shown to fail on a planted
 *   > defect (`scripts/checks/prove-*.mjs` is the pattern).
 *
 * A detector that has never been observed to fail is not evidence — it may be
 * passing because it checks nothing, or because it checks the wrong thing.
 *
 * WHAT IT PROVES
 * --------------
 *   1. The guard FAILS, and names the offending path, when a manifest declares a
 *      script that invokes a file which does not exist.
 *   2. The guard PASSES when every referenced file exists.
 *   3. The guard PASSES on this repository's real tree (which is the steady
 *      state it is meant to certify).
 *
 * Scenarios 1 and 2 feed the manifest over stdin (`--package -`), so no file is
 * written and no cleanup is required — the proof has no filesystem side effects.
 *
 * Run via `pnpm test:script-targets:prove`.
 *
 * Exit codes: 0 = the guard detects the planted defect and certifies the real
 * tree, 1 = the guard is not doing its job.
 */

import { spawnSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const GUARD = join(repoRoot, 'scripts', 'checks', 'verify-script-targets.mjs');

/** Run the guard against a fixture manifest (stdin) or the real tree. */
function runGuard({ manifest, realTree = false }) {
  const args = realTree ? [GUARD] : [GUARD, '--package', '-'];
  const res = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    input: realTree ? undefined : JSON.stringify(manifest),
  });
  return { exit: res.status, out: `${res.stdout ?? ''}${res.stderr ?? ''}` };
}

const results = [];

function scenario(name, fn) {
  const res = fn();
  results.push({ name, ...res });
}

// ── Scenario 1: a planted dangling reference MUST be detected ────────────────
const PLANTED = 'scripts/__planted__/does-not-exist.mjs';
scenario('planted dangling reference is detected', () => {
  const { exit, out } = runGuard({
    manifest: {
      scripts: {
        'looks-fine': 'node scripts/checks/gate-stages.mjs',
        broken: `node ${PLANTED}`,
      },
    },
  });
  return {
    pass: exit === 1 && out.includes(PLANTED),
    detail: `exit ${exit} (expected 1), names the path: ${out.includes(PLANTED)}`,
  };
});

// ── Scenario 2: a manifest whose targets all exist MUST pass ────────────────
scenario('valid references pass', () => {
  const { exit } = runGuard({
    manifest: {
      scripts: {
        a: 'node scripts/checks/gate-stages.mjs --list',
        b: 'node scripts/checks/mutate.mjs --allow-dirty --threshold 100',
      },
    },
  });
  return { pass: exit === 0, detail: `exit ${exit} (expected 0)` };
});

// ── Scenario 3: this repository's real tree MUST pass ───────────────────────
scenario('real tree passes', () => {
  const { exit, out } = runGuard({ realTree: true });
  return {
    pass: exit === 0,
    detail: exit === 0 ? 'exit 0' : `exit ${exit}\n${out.split('\n').slice(-8).join('\n')}`,
  };
});

// ── Report ─────────────────────────────────────────────────────────────────
console.log('Script-target guard falsifiability proof');
console.log('='.repeat(64));
for (const r of results) {
  console.log(`  ${r.pass ? '✓' : '✗'} ${r.name}${r.pass ? '' : ` — ${r.detail}`}`);
}
console.log('-'.repeat(64));

const failed = results.filter((r) => !r.pass);
if (failed.length > 0) {
  console.error(`\n✗ ${failed.length}/${results.length} scenario(s) failed.`);
  console.error('  The script-target guard is not falsifiable — fix it before trusting it.');
  process.exit(1);
}

console.log(`✓ all ${results.length} scenario(s) passed — the guard fails on a planted`);
console.log('  defect and certifies the real tree.');
