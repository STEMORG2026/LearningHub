#!/usr/bin/env node
/**
 * Enforcement for the Git Workflow — Always Push to a Branch policy.
 *
 * WHY THIS EXISTS
 * ---------------
 * The user instruction was explicit: "always push to branch … write it somewhere
 * so every agent follows it." Prose in a governance file is only durable if
 * something fails when it is removed. This check makes the branch-push policy
 * machine-guarded: if the rule is deleted, softened, or loses its teeth (the
 * grandfather clause, the recovery recipe, the no-force-push clause), the build
 * fails and the removal has to be argued for in the open.
 *
 * It is deliberately a *presence and substance* check, not a semantic one. No
 * script can observe where a `git push` actually went. What it CAN guarantee is
 * that every agent reading the governance files is told the rule, and that the
 * instruction cannot be quietly dropped.
 *
 * Run via `pnpm verify-governance` (stage `test:branch:rule`).
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
 * verbatim. Keep anchors short enough to survive line-wrapping on rewording,
 * but distinctive enough that they cannot appear by accident. No anchor may
 * span a line break — the governance files are hard-wrapped.
 */
const REQUIREMENTS = [
  // ── docs/RULES.md — the canonical policy ──────────────────────────────────
  {
    file: 'docs/RULES.md',
    anchor: '### Git Workflow — Always Push to a Branch (MANDATORY)',
    why: 'the canonical branch-push section is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Push to a branch. Every time. No exceptions.',
    why: 'the core policy statement is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Never push directly to `main`.',
    why: 'the directive form of the rule is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Never force-push `main`',
    why: 'the no-force-push clause is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'grandfathered',
    why: 'the grandfather clause for earlier direct-to-main pushes is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'git reset --hard origin/main',
    why: 'the recovery recipe (moving local commits off main) is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'pnpm test:branch:rule',
    why: 'the enforcement hook reference is missing',
  },

  // ── AGENTS.md — the agent-facing summary ──────────────────────────────────
  {
    file: 'AGENTS.md',
    anchor: '### Git Workflow — Always Push to a Branch (MANDATORY)',
    why: 'the agent-facing section is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: 'Never push directly to `main`.',
    why: 'the agent-facing core directive is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: 'Never force-push `main`.',
    why: 'the agent-facing no-force-push clause is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: 'Grandfather clause:',
    why: 'the agent-facing grandfather clause is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: 'pnpm test:branch:rule',
    why: 'the agent-facing enforcement pointer is missing',
  },

  // ── The stronger "all new work branches" policy ───────────────────────────
  {
    file: 'docs/RULES.md',
    anchor: '### Git Workflow — Branching Is Mandatory for All New Work (MANDATORY)',
    why: 'the mandatory-branching-for-new-work section is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Every unit of new work starts on a branch. Always. No exceptions.',
    why: 'the core new-work branching statement is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Branch before you edit.',
    why: 'the branch-before-editing directive is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'One coherent unit of work per branch.',
    why: 'the one-unit-per-branch rule is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Sub-branches are expected when work demands them.',
    why: 'the sub-branch provision is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Merge the sub-branch into its **parent**, then the parent into `main`.',
    why: 'the sub-branch merge target (into parent, not main) is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'docs/WORK-IN-PROGRESS.md',
    why: 'the work-visibility record reference is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Add the row when the branch is created',
    why: 'the document-at-creation rule is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'Never let the record drift.',
    why: 'the no-stale-rows rule is missing',
  },
  {
    file: 'docs/RULES.md',
    anchor: 'pnpm test:work-record',
    why: 'the work-record enforcement hook reference is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: '### Git Workflow — Branching Is Mandatory for All New Work (MANDATORY)',
    why: 'the agent-facing new-work branching section is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: 'Every unit of new work starts on a branch. Always. No exceptions.',
    why: 'the agent-facing new-work branching statement is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: 'Branch before you edit.',
    why: 'the agent-facing branch-before-editing directive is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: 'Sub-branches are expected.',
    why: 'the agent-facing sub-branch provision is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: 'docs/WORK-IN-PROGRESS.md',
    why: 'the agent-facing work-record reference is missing',
  },
  {
    file: 'AGENTS.md',
    anchor: 'pnpm test:work-record',
    why: 'the agent-facing work-record enforcement pointer is missing',
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
console.log('Branch-push rule enforcement');
console.log('='.repeat(64));

if (fail.length > 0) {
  console.log('');
  console.log(`✗ ${fail.length} requirement(s) not met:`);
  for (const f of fail) console.log(`  - ${f}`);
  console.log('');
  console.log('  "Always push to a branch, never directly to main" is MANDATORY and');
  console.log('  must remain present and substantive in both docs/RULES.md (canonical)');
  console.log('  and AGENTS.md (agent-facing summary).');
  console.log('  Restore the missing clause(s) rather than relaxing this check.');
  process.exit(1);
}

console.log(`  ✓ all ${pass.length} requirement(s) present`);
console.log('');
console.log('  ✓ docs/RULES.md carries the canonical policy');
console.log('  ✓ AGENTS.md carries the agent-facing summary');
console.log('  ✓ the grandfather and no-force-push clauses are intact');
process.exit(0);
