#!/usr/bin/env node
/**
 * Verify that generated documentation is committed and in sync.
 *
 * WHY THIS EXISTS
 * ---------------
 * This logic used to live as a `special` branch inside `scripts/ci-local.mjs`,
 * which meant it could only run through that one runner. It mirrors the
 * `docs-sync` job in `.github/workflows/ci.yml`, and extracting it makes it a
 * first-class stage that the gate ladder can call like any other.
 *
 * `pnpm docs:sync` regenerates machine-owned `AUTO:` regions and `tree.txt`.
 * If the working tree still differs afterwards, generated docs are stale — the
 * commit that changed `.phase.json`, a package, or a doc forgot to sync.
 *
 * tree.txt is special-cased: it stamps the HEAD sha it was generated at, so it
 * always differs by exactly one line between a commit and a re-generation. CI
 * allows that single-line drift; so does this.
 *
 * Exit codes: 0 = in sync, 1 = stale (or untracked files appeared).
 */

import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

function run(cmd, args) {
  return execFileSync(cmd, args, { cwd: repoRoot, encoding: 'utf8' });
}

function tryRun(cmd, args) {
  try {
    return { ok: true, out: run(cmd, args) };
  } catch (err) {
    return { ok: false, out: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

/**
 * The files `pnpm docs:sync` owns. Checking only these keeps the audit about
 * *generated* docs — a whole-tree `git diff` would fail on any unrelated
 * uncommitted edit, which makes the check useless during development.
 */
const GENERATED = [
  'docs/ROADMAP.md',
  'AGENTS.md',
  'docs/REPOSITORY_HEALTH.md',
  'docs/component-registry/RENDERING.md',
  'docs/component-registry/STATE.md',
  'docs/component-registry/TESTING.md',
];

console.log('Generated-docs sync check');
console.log('='.repeat(64));

const sync = tryRun('pnpm', ['docs:sync']);
if (!sync.ok) {
  console.error('✗ `pnpm docs:sync` failed:\n' + sync.out);
  process.exit(1);
}

// Only the generated set must be byte-identical after a sync.
const diff = tryRun('git', ['diff', '--exit-code', '--', ...GENERATED]);
if (!diff.ok) {
  console.error('✗ generated docs are out of sync:\n' + diff.out);
  console.error('\n  Run `pnpm docs:sync` and commit the result.');
  process.exit(1);
}
console.log(`  ✓ ${GENERATED.length} generated doc(s) match the tree`);

// tree.txt may drift by exactly one line — the HEAD stamp.
const numstat = run('git', ['diff', '--numstat', '--', 'tree.txt']).trim();
if (numstat) {
  const changed = numstat.split('\n').filter(Boolean).length;
  if (changed > 1) {
    console.error(`✗ tree.txt drifted beyond the sha stamp (${changed} entries)`);
    process.exit(1);
  }
  console.log('  ✓ tree.txt drift is only the sha stamp');
} else {
  console.log('  ✓ tree.txt unchanged');
}

// Untracked files are only a problem if `docs:sync` created them, so scope this
// to the paths it writes. A whole-tree check would flag files the author is
// still working on, which is not this audit's business.
const untracked = run('git', ['ls-files', '--others', '--exclude-standard', '--', 'docs/', 'AGENTS.md', 'tree.txt']).trim();
if (untracked) {
  console.error('✗ untracked files remain after docs:sync:\n' + untracked);
  process.exit(1);
}
console.log('  ✓ no untracked files');

console.log('-'.repeat(64));
console.log('✓ Generated documentation is in sync.');
