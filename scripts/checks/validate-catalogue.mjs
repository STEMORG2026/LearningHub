#!/usr/bin/env node
/**
 * Mutation-catalogue pre-flight validator.
 *
 * Run this BEFORE a mutation audit. It catches the three ways a catalogue
 * silently lies to you:
 *
 *   1. Dead suite configuration  — a suite declared but never used
 *   2. Unanchored mutants        — `find` appears 0 times (silently dead)
 *   3. Ambiguous mutants         — `find` appears >1 times (harness mutates an
 *                                  unpredictable occurrence)
 *
 * Plus: missing files, no-op mutants (find === replace), and mutants pointing at
 * suites that do not exist.
 *
 * Usage:
 *   node validate-catalogue.mjs [path/to/mutants.json]
 *
 * Exit codes: 0 = clean, 1 = problems found.
 *
 * A real example of why this matters: `vx *= -BOUNCE_DAMPING;` appeared TWICE in
 * a physics module (left-edge and right-edge bounce branches). No error was
 * raised, but the harness would have mutated an arbitrary one of the two. The
 * fix was to widen `find` to include the surrounding branch.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const cataloguePath = resolve(process.argv[2] ?? 'scripts/checks/mutants.json');

let catalogue;
try {
  catalogue = JSON.parse(readFileSync(cataloguePath, 'utf8'));
} catch (error) {
  console.error(`✗ cannot read/parse ${cataloguePath}: ${error.message}`);
  process.exit(1);
}

const mutants = Array.isArray(catalogue) ? catalogue : (catalogue.mutants ?? []);
const suites = Array.isArray(catalogue) ? {} : (catalogue.suites ?? {});

if (mutants.length === 0) {
  console.error('✗ catalogue contains zero mutants');
  process.exit(1);
}

const problems = [];

// ── 1. Per-mutant checks ───────────────────────────────────────────────────
for (const m of mutants) {
  const id = m.id ?? '(missing id)';

  if (!m.file) {
    problems.push(`${id}: no "file"`);
    continue;
  }

  let src;
  try {
    src = readFileSync(m.file, 'utf8');
  } catch {
    problems.push(`${id}: file not found -> ${m.file}`);
    continue;
  }

  if (typeof m.find !== 'string' || m.find.length === 0) {
    problems.push(`${id}: no "find" string`);
    continue;
  }

  const occurrences = src.split(m.find).length - 1;
  if (occurrences === 0) {
    problems.push(`${id}: "find" NOT FOUND (0) in ${m.file} — this mutant is silently dead`);
  } else if (occurrences > 1) {
    problems.push(
      `${id}: "find" AMBIGUOUS (${occurrences}x) in ${m.file} — widen the context so it anchors once`,
    );
  }

  if (typeof m.replace !== 'string') {
    problems.push(`${id}: no "replace" string`);
  } else if (m.replace === m.find) {
    problems.push(`${id}: "replace" equals "find" — this is a no-op mutant`);
  }

  if (m.suite && Object.keys(suites).length > 0 && !suites[m.suite]) {
    problems.push(`${id}: references undeclared suite "${m.suite}"`);
  }

  // An `equivalent` adjudication removes a survivor from the score, so it is the
  // single most abusable field in the catalogue. Require a substantive written
  // justification: the whole value of the label is the reasoning behind it, and
  // "equivalent" on its own is indistinguishable from sweeping a gap under a rug.
  if (m.equivalent !== undefined) {
    if (typeof m.equivalent !== 'string' || m.equivalent.trim().length < 20) {
      problems.push(
        `${id}: "equivalent" must be a written justification of at least 20 characters ` +
          `(got ${JSON.stringify(m.equivalent)}) — an unjustified equivalence claim hides a real gap`,
      );
    }
  }
}

// Suite schema check. A suite with the wrong shape (e.g. {command,dir} instead of
// {cmd,args}) makes execFileSync throw for EVERY mutant in that suite, which the
// harness reports as KILLED — a fabricated 100%. That exact mistake was made and
// caught only because the failure counts read "0 test(s) failed" while real kills
// read a nonzero count. Validate the shape explicitly so it cannot recur.
for (const [name, suite] of Object.entries(suites)) {
  if (!suite || typeof suite !== 'object') {
    problems.push(`SUITE "${name}": not an object`);
    continue;
  }
  if (typeof suite.cmd !== 'string' || !Array.isArray(suite.args)) {
    problems.push(
      `SUITE "${name}": must be {cmd: string, args: string[]} — found ` +
        `${JSON.stringify(Object.keys(suite))}. A malformed suite makes every one of its ` +
        `mutants "KILLED" without running any test (fabricated 100%).`,
    );
  }
}

// ── 2. Suite wiring ────────────────────────────────────────────────────────
const usedSuites = new Set(mutants.map((m) => m.suite).filter(Boolean));
for (const name of Object.keys(suites)) {
  if (!usedSuites.has(name)) {
    problems.push(`DEAD SUITE: "${name}" is declared but has zero mutants assigned`);
  }
}

// ── 3. Coverage report (informational) ─────────────────────────────────────
const perFile = {};
for (const m of mutants) {
  if (m.file) perFile[m.file] = (perFile[m.file] ?? 0) + 1;
}

console.log(`catalogue: ${cataloguePath}`);
console.log(`mutants:   ${mutants.length}`);
console.log(`files:     ${Object.keys(perFile).length}`);
console.log(`suites:    ${Object.keys(suites).length} declared, ${usedSuites.size} used`);
console.log('\nmutants per file (low counts on large modules are the highest-yield gaps):');
for (const [file, count] of Object.entries(perFile).sort((a, b) => a[1] - b[1])) {
  console.log(`  ${String(count).padStart(3)}  ${file}`);
}

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  • ${p}`);
  process.exit(1);
}

console.log('\n✓ catalogue is structurally sound');
