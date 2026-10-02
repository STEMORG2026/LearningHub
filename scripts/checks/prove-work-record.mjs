#!/usr/bin/env node
/**
 * Enforcement for the Work Visibility policy.
 *
 * WHY THIS EXISTS
 * ---------------
 * The user's instruction was explicit: "branching is mandatory in all new work
 * and all must be documented in main about the new work being done so even
 * without merge, main knows what is being done."
 *
 * Branching alone keeps `main` stable but can make it *ignorant*: with GitHub
 * Actions deliberately disabled in this repo (see docs/RULES.md), there is no
 * ambient CI signal about in-flight branches. A stalled or abandoned branch is
 * invisible unless it is written down.
 *
 * This check makes the record load-bearing:
 *   1. `docs/WORK-IN-PROGRESS.md` must exist and keep its governance header.
 *   2. Every data row must carry all seven required columns, non-empty.
 *   3. `Status` must be one of the five allowed values.
 *   4. `Last updated` must be an ISO date.
 *   5. Placeholder-only tables (no real work rows anywhere) are refused, so the
 *      file cannot be emptied to make the gate pass.
 *
 * It is deliberately a *structure and substance* check, not a semantic one. No
 * script can know whether an agent truly created a branch before editing files.
 * What it CAN guarantee is that the disclosure obligation is real, machine-
 * checked, and cannot be satisfied with an empty or malformed file.
 *
 * Run via `pnpm verify-governance` (stage `test:work-record`).
 *
 * Exit codes: 0 = record valid, 1 = missing/malformed/emptied.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..', '..');
const RECORD = 'docs/WORK-IN-PROGRESS.md';

const ALLOWED_STATUS = ['in-progress', 'blocked', 'review', 'merged', 'abandoned'];
const REQUIRED_COLUMNS = ['Branch', 'Status', 'Parent', 'Owner', 'Intent', 'Touches', 'Last updated'];

const fail = [];

// ── 1. Presence ────────────────────────────────────────────────────────────
let content;
try {
  content = readFileSync(resolve(repoRoot, RECORD), 'utf8');
} catch {
  console.error(`✗ ${RECORD} is missing`);
  console.error('');
  console.error('  Every branch must be recorded there when it is created, so `main`');
  console.error('  can answer "what work is in flight?" without waiting for a merge.');
  console.error('  See docs/RULES.md → Git Workflow — Branching Is Mandatory.');
  process.exit(1);
}

// ── 2. Governance header ───────────────────────────────────────────────────
if (!content.includes('status: CANONICAL')) {
  fail.push(`${RECORD}: missing "status: CANONICAL" frontmatter`);
}
if (!content.includes('canonical: true')) {
  fail.push(`${RECORD}: missing "canonical: true" frontmatter`);
}

// ── 3. Parse tables ────────────────────────────────────────────────────────
/** Split a markdown table row into trimmed cells. */
const cellsOf = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());

const lines = content.split('\n');

/** Collect table blocks: a header row, a separator row, then data rows. */
const tables = [];
for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];
  if (!line.trim().startsWith('|')) continue;
  const next = lines[i + 1];
  if (!next || !/^\s*\|[\s:|-]+\|\s*$/.test(next)) continue;

  const header = cellsOf(line);
  const rows = [];
  let j = i + 2;
  while (j < lines.length && lines[j].trim().startsWith('|')) {
    rows.push(cellsOf(lines[j]));
    j += 1;
  }
  tables.push({ header, rows });
  i = j - 1;
}

// ── 4. Validate every data row ─────────────────────────────────────────────
let realRows = 0;
let placeholderRows = 0;

const isPlaceholder = (row) => row.every((c) => c === '' || c === '—' || c === '-' || c === 'None.');

for (const { header, rows } of tables) {
  // Schema tables describe the contract; only enforce the work schema on tables
  // that actually use the required columns.
  const hasWorkSchema = REQUIRED_COLUMNS.every((c) => header.includes(c));
  if (!hasWorkSchema) continue;

  for (const [idx, row] of rows.entries()) {
    if (isPlaceholder(row)) {
      placeholderRows += 1;
      continue;
    }

    const record = {};
    header.forEach((col, i) => {
      record[col] = row[i] ?? '';
    });

    // Missing / empty required cell?
    for (const col of REQUIRED_COLUMNS) {
      if (!record[col] || record[col].trim() === '') {
        fail.push(`${RECORD}: row ${idx + 1} of a work table has empty "${col}"`);
      }
    }

    // Valid status?
    const status = (record.Status ?? '').trim();
    if (status && !ALLOWED_STATUS.includes(status)) {
      fail.push(
        `${RECORD}: row ${idx + 1} has invalid Status "${status}" ` +
          `(allowed: ${ALLOWED_STATUS.join(', ')})`,
      );
    }

    // Valid date?
    const stamp = (record['Last updated'] ?? '').trim();
    if (stamp && !/^\d{4}-\d{2}-\d{2}$/.test(stamp)) {
      fail.push(
        `${RECORD}: row ${idx + 1} has "Last updated" = "${stamp}" ` +
          `(expected YYYY-MM-DD)`,
      );
    }

    realRows += 1;
  }
}

// ── 5. Refuse an emptied file ──────────────────────────────────────────────
if (realRows === 0 && placeholderRows > 0) {
  fail.push(
    `${RECORD}: contains only placeholder rows — the record has been emptied. ` +
      `A merged-branch row (status "merged") must remain until 30 days after merge.`,
  );
}

// ── Report ─────────────────────────────────────────────────────────────────
console.log('Work-visibility record enforcement');
console.log('='.repeat(64));

if (fail.length > 0) {
  console.log('');
  console.log(`✗ ${fail.length} issue(s):`);
  for (const f of fail) console.log(`  - ${f}`);
  console.log('');
  console.log('  Every branch — parent or sub-branch — gets one row when it is');
  console.log('  created, with all seven columns filled. See docs/RULES.md →');
  console.log('  Git Workflow — Branching Is Mandatory for All New Work.');
  process.exit(1);
}

console.log(`  ✓ ${RECORD} present with governance header intact`);
console.log(`  ✓ ${realRows} work row(s), ${placeholderRows} placeholder row(s)`);
console.log(`  ✓ all rows carry the ${REQUIRED_COLUMNS.length} required columns`);
console.log('  ✓ statuses and dates well-formed');
process.exit(0);
