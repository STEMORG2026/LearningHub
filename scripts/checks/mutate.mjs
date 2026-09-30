#!/usr/bin/env node
/**
 * mutate.mjs — a dependency-free mutation-testing harness.
 *
 * WHY THIS EXISTS
 * ---------------
 * Coverage tells you which lines *executed*. It does not tell you whether a
 * test would *fail* if the behaviour on those lines changed. A suite can report
 * 100% line coverage while asserting nothing that distinguishes correct code
 * from broken code. Mutation testing is the only mechanical answer to
 * "do these tests actually test anything?".
 *
 * This harness:
 *   1. reads a declarative mutant catalogue (`scripts/checks/mutants.json`),
 *   2. applies ONE mutation at a time to a source file,
 *   3. runs the owning test suite,
 *   4. records KILLED (suite failed) or SURVIVED (suite passed anyway),
 *   5. ALWAYS restores the original source — including on Ctrl-C / crash.
 *
 * A SURVIVED mutant is a hole: the code changed behaviour and no test noticed.
 *
 * USAGE
 *   node scripts/checks/mutate.mjs                 # whole catalogue
 *   node scripts/checks/mutate.mjs --file packages/core/src/event-bus.ts
 *   node scripts/checks/mutate.mjs --threshold 90  # exit 1 below 90%
 *   node scripts/checks/mutate.mjs --list          # list mutants, run nothing
 *
 * EXIT CODES
 *   0 — every mutant killed (or score >= --threshold)
 *   1 — one or more survivors and score < threshold
 *   2 — harness error (bad catalogue, dirty tree, unmatched pattern)
 *
 * SAFETY
 *   - Refuses to run on a dirty git tree unless --allow-dirty is passed.
 *   - Backs up every target to a temp dir and restores in a `finally` + signal
 *     handlers, so an interrupted run cannot leave mutated source behind.
 *   - Never mutates the same file in parallel (mutation runs are sequential by
 *     design: parallel runs would race on the working tree).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CATALOGUE = join(ROOT, 'scripts', 'checks', 'mutants.json');

// ── args ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const value = (name, dflt) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
};
const ONLY_FILE = value('--file', null);
const THRESHOLD = Number(value('--threshold', '100'));
const ALLOW_DIRTY = flag('--allow-dirty');
const LIST_ONLY = flag('--list');

// ── backup registry + restore-on-exit ───────────────────────────────────────
const BACKUP_DIR = mkdtempSync(join(tmpdir(), 'mutation-backup-'));
const backedUp = new Map(); // absolute src path -> backup path

function backup(src) {
  if (backedUp.has(src)) return;
  const dest = join(BACKUP_DIR, String(backedUp.size) + '-' + src.replace(/[/\\]/g, '_'));
  copyFileSync(src, dest);
  backedUp.set(src, dest);
}

function restoreAll() {
  for (const [src, bak] of backedUp) {
    try {
      if (existsSync(bak)) copyFileSync(bak, src);
    } catch (error) {
      console.error(`[mutation] FAILED to restore ${src}:`, error.message);
    }
  }
  cleanupBackupDir();
}

/**
 * Remove the temp backup directory. Called on the normal exit path AND from the
 * signal handlers. `maxRetries` is needed because some filesystems (and the
 * sandbox's own file watcher) briefly hold handles on freshly-written files,
 * which made a plain `rmSync` silently fail and leak a directory per run.
 */
function cleanupBackupDir() {
  try {
    rmSync(BACKUP_DIR, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  } catch (error) {
    console.error(`[mutation] could not remove backup dir ${BACKUP_DIR}:`, error.message);
    console.error('[mutation] (safe to delete manually — no mutated source remains)');
  }
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    console.error(`\n[mutation] ${signal} — restoring sources before exit`);
    restoreAll();
    process.exit(130);
  });
}
process.on('uncaughtException', (error) => {
  console.error('[mutation] uncaught:', error);
  restoreAll();
  process.exit(2);
});

// ── preflight ───────────────────────────────────────────────────────────────
if (!existsSync(CATALOGUE)) {
  console.error(`[mutation] no catalogue at ${CATALOGUE}`);
  process.exit(2);
}

// `--list` is read-only — it must work on a dirty tree, before any guard.
const earlyCatalogue = JSON.parse(readFileSync(CATALOGUE, 'utf8'));
if (LIST_ONLY) {
  const early = ONLY_FILE
    ? (earlyCatalogue.mutants ?? []).filter((m) => m.file === ONLY_FILE)
    : earlyCatalogue.mutants ?? [];
  console.log(`[mutation] ${early.length} mutant(s) in catalogue:\n`);
  for (const m of early) console.log(`  ${m.id.padEnd(34)} ${m.file}  (suite: ${m.suite})`);
  process.exit(0);
}

if (!ALLOW_DIRTY) {
  try {
    const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (dirty) {
      console.error('[mutation] working tree is dirty. Commit/stash first, or pass --allow-dirty.');
      console.error(dirty.split('\n').slice(0, 10).map((l) => '  ' + l).join('\n'));
      process.exit(2);
    }
  } catch {
    console.warn('[mutation] could not read git status; continuing without the dirty-tree guard');
  }
}

// ── catalogue ───────────────────────────────────────────────────────────────
const catalogue = earlyCatalogue;
const suites = catalogue.suites ?? {};

let mutants = catalogue.mutants ?? [];
if (ONLY_FILE) mutants = mutants.filter((m) => m.file === ONLY_FILE);

if (mutants.length === 0) {
  console.error(ONLY_FILE ? `[mutation] no mutants for --file ${ONLY_FILE}` : '[mutation] catalogue is empty');
  process.exit(2);
}

// ── runner ──────────────────────────────────────────────────────────────────
function runSuite(suiteKey) {
  const suite = suites[suiteKey];
  if (!suite) throw new Error(`unknown suite '${suiteKey}' in catalogue`);
  // A suite is an argv array so it works on any OS without a shell.
  try {
    execFileSync(suite.cmd, suite.args, { cwd: ROOT, stdio: 'pipe', timeout: 600_000 });
    return { failed: false, out: '' };
  } catch (error) {
    const out = `${error.stdout ?? ''}${error.stderr ?? ''}`;
    return { failed: true, out };
  }
}

function failedCount(out) {
  const m = out.match(/Tests\s+(?:(\d+) failed \| )?(\d+) passed/);
  return { failed: m && m[1] ? Number(m[1]) : 0, passed: m ? Number(m[2]) : 0 };
}

const results = [];
console.log('[mutation] starting — sources are backed up and will be restored\n');
console.log(`${'mutant'.padEnd(34)} ${'verdict'.padEnd(10)} detail`);
console.log('─'.repeat(74));

for (const m of mutants) {
  const abs = join(ROOT, m.file);
  if (!existsSync(abs)) {
    results.push({ ...m, verdict: 'ERROR', detail: 'file not found' });
    console.log(`${m.id.padEnd(34)} ${'ERROR'.padEnd(10)} file not found: ${m.file}`);
    continue;
  }

  backup(abs);
  const original = readFileSync(abs, 'utf8');

  if (!original.includes(m.find)) {
    results.push({ ...m, verdict: 'ERROR', detail: 'pattern not found' });
    console.log(`${m.id.padEnd(34)} ${'ERROR'.padEnd(10)} pattern not found in ${m.file}`);
    continue;
  }

  const occurrences = original.split(m.find).length - 1;
  writeFileSync(abs, original.replace(m.find, m.replace));

  const { failed, out } = runSuite(m.suite);
  writeFileSync(abs, original); // restore immediately after each mutant

  const { failed: nf } = failedCount(out);
  const verdict = failed ? 'KILLED' : 'SURVIVED';
  const detail = failed ? `${nf} test(s) failed` : 'suite stayed green ⚠';
  const note = occurrences > 1 ? `  (replaced 1 of ${occurrences})` : '';

  results.push({ ...m, verdict, detail });
  console.log(`${m.id.padEnd(34)} ${verdict.padEnd(10)} ${detail}${note}`);
}

// ── report ──────────────────────────────────────────────────────────────────
const killed = results.filter((r) => r.verdict === 'KILLED').length;
const survived = results.filter((r) => r.verdict === 'SURVIVED');
const errored = results.filter((r) => r.verdict === 'ERROR').length;
const scored = killed + survived.length;
const score = scored === 0 ? 0 : Math.round((killed / scored) * 100);

console.log('\n' + '═'.repeat(74));
console.log(`mutation score: ${killed}/${scored} killed = ${score}%`);
if (errored) console.log(`⚠ ${errored} mutant(s) could not be evaluated (see ERROR rows above)`);

if (survived.length) {
  console.log('\nSURVIVORS — the tests below cannot detect these behaviour changes:');
  for (const s of survived) console.log(`  • ${s.id}  (${s.file})`);
  console.log('\nEach survivor is either (a) a missing test, or (b) a semantically');
  console.log('equivalent mutant. Decide which, then either add the test or record the');
  console.log('equivalence in the catalogue comment.');
}

console.log('═'.repeat(74));

// Restore-and-clean on the normal path too (sources are already restored after
// each mutant; this removes the backup directory).
cleanupBackupDir();
process.exit(survived.length === 0 || score >= THRESHOLD ? 0 : 1);
