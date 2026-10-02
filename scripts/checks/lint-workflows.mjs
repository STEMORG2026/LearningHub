#!/usr/bin/env node
/**
 * Lint every GitHub Actions workflow file.
 *
 * WHY THIS EXISTS
 * ---------------
 * A malformed workflow does not fail loudly — GitHub either refuses to register
 * it or fails the run at parse time, and the failure surfaces as "no CI ran",
 * which looks identical to "CI is not configured". That silence is how this
 * repository ended up with ten workflows parked in `workflows-disabled/` and no
 * signal that anything was missing.
 *
 * `actionlint` catches that class of defect: invalid expression contexts,
 * unknown `needs` targets, bad `runs-on` labels, shellcheck-level script
 * problems. It found a real one on first run here — `secrets` used in a
 * job-level `if:`, which GitHub does not permit.
 *
 * ADVISORY LOCALLY, AUTHORITATIVE IN CI
 * -------------------------------------
 * `actionlint` is not a repo dependency (it is a Go binary), so it may be
 * absent on a contributor's machine. When it is missing:
 *   - in CI  → FAIL, because CI installs it and a missing tool means the step
 *              was misconfigured.
 *   - locally → WARN and pass, so a contributor without the binary can still
 *               push. The pre-push gate is not the place to block on a tool
 *               that the project does not ship.
 *
 * Exit codes: 0 = clean (or locally skipped), 1 = lint errors.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const workflowsDir = join(repoRoot, '.github', 'workflows');

const inCI = Boolean(process.env.CI || process.env.GITHUB_ACTIONS);

if (!existsSync(workflowsDir)) {
  console.error('✗ .github/workflows/ does not exist — no workflow can ever run.');
  console.error('  If workflows are parked in .github/workflows-disabled/, move them back.');
  process.exit(1);
}

const files = readdirSync(workflowsDir).filter((f) => /\.ya?ml$/.test(f)).sort();

if (files.length === 0) {
  console.error('✗ .github/workflows/ exists but contains no workflow files.');
  process.exit(1);
}

console.log('Workflow lint (actionlint)');
console.log('='.repeat(64));
console.log(`  ${files.length} workflow file(s): ${files.join(', ')}`);

let actionlint = null;
try {
  execFileSync('actionlint', ['--version'], { stdio: 'ignore' });
  actionlint = 'actionlint';
} catch {
  actionlint = null;
}

if (!actionlint) {
  if (inCI) {
    console.error('\n✗ actionlint is not installed, and this is CI.');
    console.error('  CI must install it before running this check — a missing tool here');
    console.error('  means the workflow step is misconfigured, not that the check passed.');
    process.exit(1);
  }
  console.log('\n  ⚠ actionlint not found on PATH — skipping locally (advisory here).');
  console.log('    CI installs and runs it. To check locally:');
  console.log('      https://github.com/rhysd/actionlint#install');
  process.exit(0);
}

try {
  const out = execFileSync(actionlint, ['-color', ...files.map((f) => join('.github', 'workflows', f))], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  if (out.trim()) console.log(out.trim());
  console.log('-'.repeat(64));
  console.log(`✓ all ${files.length} workflow file(s) pass actionlint.`);
} catch (err) {
  const detail = `${err.stdout ?? ''}${err.stderr ?? ''}`.trim();
  console.error(detail || '✗ actionlint reported errors.');
  console.error('\n✗ Workflow lint failed — fix the reported workflow defects.');
  process.exit(1);
}
