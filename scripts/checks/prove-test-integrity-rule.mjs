#!/usr/bin/env node
/**
 * Enforcement for the Test Integrity — Falsifiability Protocol.
 *
 * WHY THIS EXISTS
 * ---------------
 * A rule that lives only in prose gets quietly deleted or softened, and then
 * nothing enforces it. This check makes the protocol itself machine-guarded:
 * it fails if the mandatory sections go missing, are gutted, or lose the
 * anti-cheating clauses that give them teeth.
 *
 * It is deliberately a *presence and substance* check, not a semantic one — no
 * script can verify that a human actually ran a test against pre-fix code. What
 * it CAN do is guarantee that every agent reading the governance files is told
 * to, and that the instruction cannot be removed without failing the build.
 *
 * Run via `pnpm verify-governance` (stage `test:integrity`).
 *
 * Exit codes: 0 = rule intact, 1 = rule missing/weakened.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..', '..');

const fail = [];
const pass = [];

const read = (rel) => {
  try {
    return readFileSync(resolve(repoRoot, rel), 'utf8');
  } catch {
    return null;
  }
};

/**
 * Each requirement is a (file, anchor, why) triple. `anchor` must appear
 * verbatim. Keep anchors short enough to survive rewording, but distinctive
 * enough that they cannot appear by accident.
 */
const REQUIREMENTS = [
  // ── docs/RULES.md — the canonical protocol ────────────────────────────────
  {
    file: 'docs/RULES.md',
    anchor: '### Test Integrity — Falsifiability Protocol (MANDATORY)',
    why: 'the canonical protocol section is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'A test that has never been observed to fail is not evidence',
    why: 'the core principle statement is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Restore the pre-fix code and watch the SAME test fail',
    why: 'step 2 of the protocol (the falsification step) is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'hand-reconstruct it',
    why: 'the git-extraction requirement is missing — hand-reconstructed bugs produce unfalsifiable probes',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Never disable, skip, weaken, or delete a test to',
    why: 'the anti-cheating clause is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Coverage is not evidence',
    why: 'the coverage-is-not-proof clause is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'A guard that has not been shown to fail is not a guard',
    why: 'the guard-falsifiability clause is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: '#### Fixing a Shared-State Bug (MANDATORY check list)',
    why: 'the shared-state fix checklist is missing — this is the pj-policy lesson',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Clone each element, not just the container',
    why: 'the shallow-copy clause is missing — a shallow copy makes the regression test unfalsifiable',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Never hand-reconstruct the bug',
    why: 'the true-pre-fix-source clause is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'pnpm test:flakes:prove',
    why: 'the enforcement hook reference is missing',
  },

  // ── AGENTS.md — the summary every agent reads first ───────────────────────
  {
    file: 'AGENTS.md',
    anchor: '### Test Integrity — Falsifiability (MANDATORY)',
    why: 'the agent-facing summary section is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: 'A test that has never been observed to fail is not evidence',
    why: 'the agent-facing core principle is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: 'MUST be observed to fail against the pre-fix code',
    why: 'the agent-facing falsification requirement is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: 'Never** weaken, skip, delete, or loosen an assertion',
    why: 'the agent-facing anti-cheating clause is missing',
  },
];

for (const { file, anchor, why } of REQUIREMENTS) {
  const content = read(file);
  if (content === null) {
    fail.push(`${file}: file not found`);
    continue;
  }
  if (!content.includes(anchor)) {
    fail.push(`${file}: MISSING "${anchor}" — ${why}`);
  } else {
    pass.push(`${file}: "${anchor.slice(0, 48)}…"`);
  }
}

// ── Report ─────────────────────────────────────────────────────────────────
console.log('Test Integrity rule enforcement');
console.log('='.repeat(64));

if (fail.length > 0) {
  console.log('');
  console.log(`✗ ${fail.length} requirement(s) not met:`);
  for (const f of fail) console.log(`  - ${f}`);
  console.log('');
  console.log('  The Test Integrity — Falsifiability Protocol is MANDATORY and must');
  console.log('  remain present and substantive in both docs/RULES.md (canonical) and');
  console.log('  AGENTS.md (agent-facing summary).');
  console.log('  Restore the missing clause(s) rather than relaxing this check.');
  process.exit(1);
}

console.log(`  ✓ all ${pass.length} requirement(s) present`);
console.log('');
console.log('  ✓ docs/RULES.md carries the canonical protocol');
console.log('  ✓ AGENTS.md carries the agent-facing summary');
console.log('  ✓ the anti-cheating and guard-falsifiability clauses are intact');
process.exit(0);
