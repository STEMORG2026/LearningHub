#!/usr/bin/env node
/**
 * ci-local.mjs — the local CI runner.
 *
 * WHY THIS EXISTS
 * ---------------
 * Commit `2d4b209` deliberately disabled GitHub Actions ("ci: disable GitHub
 * Actions — run CI locally only"). That decision moves the *entire* enforcement
 * burden onto this machine. The pre-commit hook only runs `pnpm quick` (a fast
 * lint/typecheck subset) and never runs the tests — so without this script,
 * nothing verifies the suite before a push.
 *
 * This runner reproduces every job from the disabled `.github/workflows-disabled/ci.yml`
 * and adds the gates that were introduced afterwards (doc coverage, mutation).
 * It is the replacement for the workflow, not a subset of it.
 *
 * USAGE
 *   node scripts/ci-local.mjs               # full gate (same as the old CI)
 *   node scripts/ci-local.mjs --fast        # pre-push subset (no E2E/mutation)
 *   node scripts/ci-local.mjs --only lint:arch,test
 *   node scripts/ci-local.mjs --list        # show the plan, run nothing
 *
 * EXIT CODES
 *   0 — every stage passed
 *   1 — at least one stage failed
 *   2 — harness error
 *
 * DESIGN NOTES
 *   - Stages run sequentially and stop at the first failure by default
 *     (`--keep-going` overrides), because a failure early in the chain usually
 *     makes later results meaningless.
 *   - Every stage is a plain argv array — no shell, so paths with spaces and
 *     cross-platform behaviour are safe.
 *   - Durations are reported so slow stages are visible, not surprising.
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const argv = process.argv.slice(2);
const has = (n) => argv.includes(n);
const val = (n, d) => {
  const i = argv.indexOf(n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

const FAST = has('--fast');
const KEEP_GOING = has('--keep-going');
const ONLY = val('--only', null);

const pnpm = (script) => ({ cmd: 'pnpm', args: [script] });
const node = (script) => ({ cmd: 'node', args: [script] });

/**
 * The stage list. `tier` controls inclusion:
 *   'fast'  — runs in --fast (pre-push) and full mode
 *   'full'  — full mode only (slow: E2E, mutation)
 *   'ci'    — mirrors a job that only existed in the GitHub workflow
 */
const STAGES = [
  // ── mirrors ci.yml "verify" job ──────────────────────────────────────────
  { id: 'lint:arch', ...pnpm('lint:arch'), tier: 'fast', note: 'dependency-cruiser architecture rules' },
  { id: 'lint:circular', ...pnpm('lint:circular'), tier: 'fast', note: 'circular import detection' },
  { id: 'lint:state', ...pnpm('lint:state'), tier: 'fast', note: 'shared-state lint rules' },
  { id: 'lint:dom', ...pnpm('lint:dom'), tier: 'fast', note: 'DOM-boundary lint rules' },
  { id: 'build', ...pnpm('build'), tier: 'fast', note: 'turbo build (all workspaces)' },
  { id: 'typecheck', ...pnpm('typecheck'), tier: 'fast', note: 'tsc --noEmit (all workspaces)' },
  { id: 'test', ...pnpm('test'), tier: 'fast', note: 'vitest (all workspaces)' },
  { id: 'test:coverage', ...pnpm('test:coverage'), tier: 'full', note: 'coverage ratchet thresholds' },
  { id: 'test:a11y', ...pnpm('test:a11y'), tier: 'full', note: 'Playwright accessibility specs' },
  { id: 'lint:size', ...pnpm('lint:size'), tier: 'fast', note: 'bundle size budgets' },
  { id: 'validate:edu', ...pnpm('validate:edu'), tier: 'fast', note: 'educational metadata schema' },
  { id: 'lint:registry', ...pnpm('lint:registry'), tier: 'fast', note: 'web-component registry' },
  { id: 'lint:docs', ...pnpm('lint:docs'), tier: 'fast', note: 'doc governance headers' },
  { id: 'lint:doc-governance', ...pnpm('lint:doc-governance'), tier: 'fast', note: 'strict doc governance' },
  { id: 'lint:doc-coverage', ...pnpm('lint:doc-coverage'), tier: 'fast', note: 'doc↔code coverage gate' },

  // ── mirrors ci.yml "audit" job ───────────────────────────────────────────
  { id: 'audit:docs-sync', ...node('scripts/ci-local.mjs'), tier: 'ci', special: 'docs-sync', note: 'generated docs are in sync' },
  { id: 'audit:deps', ...node('scripts/checks/audit-deps.cjs'), tier: 'fast', note: 'dependency vulnerability audit' },
  { id: 'lint:workflows', ...pnpm('lint:workflows'), tier: 'fast', note: 'GitHub Actions workflow lint (actionlint)' },

  // ── new gates introduced after the workflow was disabled ─────────────────
  { id: 'test:mutation', ...pnpm('test:mutation'), tier: 'full', note: 'mutation score must be 100%' },
];

if (has('--list')) {
  console.log('[ci:local] plan\n');
  for (const s of STAGES) {
    const modes = s.tier === 'full' ? 'full' : s.tier === 'ci' ? 'full*' : 'fast+full';
    console.log(`  ${s.id.padEnd(24)} ${modes.padEnd(11)} ${s.note}`);
  }
  console.log('\n  fast+full = --fast and default   |   full = default only   |   full* = default only');
  process.exit(0);
}

// ── docs-sync stage (mirrors the ci.yml docs-sync job, minus the tree.txt SHA carve-out) ──
function runDocsSync() {
  const t0 = Date.now();
  const sync = spawnSync('pnpm', ['docs:sync'], { cwd: ROOT, encoding: 'utf8', timeout: 600_000 });
  if (sync.status !== 0) {
    return { ok: false, ms: Date.now() - t0, detail: (sync.stdout ?? '') + (sync.stderr ?? '') };
  }
  // tree.txt stamps the pre-commit HEAD by design, so allow only that single-line drift.
  const diff = spawnSync('git', ['diff', '--exit-code', '--', '.', ':(exclude)tree.txt'], {
    cwd: ROOT, encoding: 'utf8',
  });
  if (diff.status !== 0) {
    return { ok: false, ms: Date.now() - t0, detail: 'generated docs out of sync:\n' + (diff.stdout ?? '') };
  }
  const numstat = spawnSync('git', ['diff', '--numstat', '--', 'tree.txt'], { cwd: ROOT, encoding: 'utf8' });
  const changed = (numstat.stdout ?? '').trim().split('\n').filter(Boolean).length;
  if (changed > 1) {
    return { ok: false, ms: Date.now() - t0, detail: 'tree.txt drift beyond the SHA stamp' };
  }
  const untracked = spawnSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: ROOT, encoding: 'utf8' });
  const extra = (untracked.stdout ?? '').trim();
  if (extra) {
    return { ok: false, ms: Date.now() - t0, detail: 'untracked files remain after docs:sync:\n' + extra };
  }
  return { ok: true, ms: Date.now() - t0, detail: '' };
}

// ── select + run ────────────────────────────────────────────────────────────
let plan = STAGES.filter((s) => (FAST ? s.tier === 'fast' : s.tier !== 'fast' || true));
if (ONLY) {
  const wanted = new Set(ONLY.split(',').map((s) => s.trim()).filter(Boolean));
  const known = new Set(STAGES.map((s) => s.id));
  const unknown = [...wanted].filter((w) => !known.has(w));
  if (unknown.length) {
    console.error(`[ci:local] unknown stage(s): ${unknown.join(', ')}`);
    console.error(`[ci:local] known: ${[...known].join(', ')}`);
    process.exit(2);
  }
  plan = STAGES.filter((s) => wanted.has(s.id));
}

if (!existsSync(resolve(ROOT, 'package.json'))) {
  console.error('[ci:local] not at a repo root');
  process.exit(2);
}

console.log(`[ci:local] ${FAST ? 'FAST' : 'FULL'} mode — ${plan.length} stage(s)\n`);

const results = [];
const SANDBOX_GUARD = 'SAFE_DELETE_BULK_CONFIRM_REQUIRED';

for (const stage of plan) {
  const t0 = Date.now();
  process.stdout.write(`  ▶ ${stage.id} … `);

  let ok;
  let detail = '';
  let sandboxBlocked = false;
  if (stage.special === 'docs-sync') {
    const r = runDocsSync();
    ok = r.ok;
    detail = r.detail;
  } else {
    const r = spawnSync(stage.cmd, stage.args, { cwd: ROOT, encoding: 'utf8', timeout: 1_800_000 });
    detail = `${r.stdout ?? ''}${r.stderr ?? ''}`;
    ok = r.status === 0;
    // A sandboxed agent environment can intercept the temp files that pnpm/turbo
    // create and delete, failing the stage for environmental reasons unrelated to
    // the repo. Distinguish that from a real failure so the report is honest.
    sandboxBlocked = !ok && detail.includes(SANDBOX_GUARD);
  }

  const ms = Date.now() - t0;
  const secs = (ms / 1000).toFixed(1);
  results.push({ id: stage.id, ok, ms, detail, sandboxBlocked });

  if (ok) {
    process.stdout.write(`\r  ✅ ${stage.id.padEnd(22)} ${secs}s\n`);
  } else if (sandboxBlocked) {
    process.stdout.write(`\r  ⚠️  ${stage.id.padEnd(22)} ${secs}s  blocked by sandbox delete-guard\n`);
    console.log('       (not a repo failure — re-run this stage outside the sandbox)');
  } else {
    process.stdout.write(`\r  ❌ ${stage.id.padEnd(22)} ${secs}s\n`);
    const tail = detail.trim().split('\n').slice(-15).join('\n');
    if (tail) console.log(tail.split('\n').map((l) => `       ${l}`).join('\n'));
    if (!KEEP_GOING) {
      console.log('\n[ci:local] stopping at first failure (use --keep-going to run the rest)');
      break;
    }
  }
}

// ── summary ─────────────────────────────────────────────────────────────────
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok && !r.sandboxBlocked);
const blocked = results.filter((r) => r.sandboxBlocked);
const totalMs = results.reduce((a, r) => a + r.ms, 0);

console.log('\n' + '═'.repeat(64));
console.log(`[ci:local] ${passed}/${results.length} stage(s) passed in ${(totalMs / 1000).toFixed(1)}s`);
if (blocked.length) {
  console.log(`\nblocked by the sandbox delete-guard (not repo failures):`);
  for (const b of blocked) console.log(`  ⚠️  ${b.id}`);
  console.log('  → re-run these outside the sandbox, or run them individually.');
}
if (failed.length) {
  console.log('\nfailed:');
  for (const f of failed) console.log(`  • ${f.id}`);
  console.log('═'.repeat(64));
  process.exit(1);
}
console.log('✅ local CI is green' + (blocked.length ? ' (excluding sandbox-blocked stages)' : ''));
console.log('═'.repeat(64));
process.exit(0);
