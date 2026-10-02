#!/usr/bin/env node
/**
 * Enforce that the governance gate is a STRICTLY NESTED ladder.
 *
 * WHY THIS EXISTS
 * ---------------
 * The gate runs at three points, cheapest first:
 *
 *   pre-commit  →  pre-push  →  CI
 *
 * The contract is that each tier is a **superset** of the one before it. That
 * makes the ladder *incremental*: the earlier a defect is caught, the cheaper
 * it is, and passing a cheap tier tells you something real about the expensive
 * one. If the nesting breaks, the cheap tiers become decoration — a green
 * pre-push no longer predicts a green CI, and people learn to ignore it.
 *
 * This was not hypothetical. Measured before this guard existed:
 *
 *   - 8 guards ran in CI but NOT on pre-push (branch rule, gate integrity,
 *     coverage ratchet, work record, integrity rule, deps drift, mutation
 *     catalogue, flake proof) — so you could push code violating the branching
 *     rule with no local warning at all.
 *   - `audit:deps` ran on pre-push but NOT in `verify-governance` — which is
 *     exactly how a HIGH advisory sat undetected in the tree.
 *
 * Nesting is now structural: each tier *calls* the previous one. This guard
 * expands those references (see `gate-stages.mjs`) and asserts the property
 * holds, plus that the hooks and CI are wired to the right tiers.
 *
 * Exit codes: 0 = ladder intact, 1 = nesting or wiring broken.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TIERS, expandAll, readScripts } from './gate-stages.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const pass = [];
const fail = [];

console.log('Governance gate ladder enforcement');
console.log('='.repeat(64));

let expanded;
try {
  expanded = expandAll(readScripts());
} catch (err) {
  console.error(`✗ could not expand the gate ladder: ${err.message}`);
  process.exit(1);
}

// ── 1. Every tier must actually run something ────────────────────────────────
for (const tier of TIERS) {
  const stages = expanded[tier];
  if (stages.length === 0) {
    fail.push(`'${tier}' expands to zero stages — the gate would pass vacuously`);
  } else {
    pass.push(`'${tier}' runs ${stages.length} stage(s)`);
  }
}

// ── 2. Strict nesting: each tier ⊇ the previous, in order ────────────────────
for (let i = 1; i < TIERS.length; i += 1) {
  const prev = TIERS[i - 1];
  const curr = TIERS[i];
  const prevSet = new Set(expanded[prev]);
  const currSet = new Set(expanded[curr]);
  const missing = [...prevSet].filter((s) => !currSet.has(s));
  if (missing.length > 0) {
    fail.push(
      `'${curr}' does NOT include every stage of '${prev}'. Missing: ${missing.join(', ')}`,
    );
  } else {
    pass.push(`'${curr}' ⊇ '${prev}'`);
  }
}

// ── 3. Duplicate stages mean the same work runs twice ────────────────────────
for (const tier of TIERS) {
  const seen = new Set();
  const dupes = [];
  for (const s of expanded[tier]) {
    if (seen.has(s)) dupes.push(s);
    seen.add(s);
  }
  if (dupes.length > 0) {
    fail.push(`'${tier}' runs the same stage twice: ${[...new Set(dupes)].join(', ')}`);
  } else {
    pass.push(`'${tier}' has no duplicate stages`);
  }
}

// ── 4. The hooks must call the tiers, not a private stage list ───────────────
const HOOKS = [
  { path: 'scripts/git-hooks/pre-commit', tier: 'gate:precommit' },
  { path: 'scripts/git-hooks/pre-push', tier: 'gate:prepush' },
];
for (const { path, tier } of HOOKS) {
  const full = join(repoRoot, path);
  if (!existsSync(full)) {
    fail.push(`${path} does not exist — the ${tier} tier has no trigger`);
    continue;
  }
  const body = readFileSync(full, 'utf8');
  if (body.includes(tier)) {
    pass.push(`${path} invokes '${tier}'`);
  } else {
    fail.push(`${path} does not invoke '${tier}' — the hook is not wired to the ladder`);
  }
}

// ── 5. CI must run the full tier ─────────────────────────────────────────────
const ciPath = join(repoRoot, '.github/workflows/ci.yml');
if (!existsSync(ciPath)) {
  fail.push('.github/workflows/ci.yml does not exist — CI cannot run the full tier');
} else {
  const ci = readFileSync(ciPath, 'utf8');
  if (ci.includes('pnpm verify-governance')) {
    pass.push('ci.yml runs the full tier (pnpm verify-governance)');
  } else {
    fail.push('ci.yml does not run `pnpm verify-governance` — CI is not the full tier');
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
pass.forEach((p) => console.log(`  ✓ ${p}`));
fail.forEach((f) => console.log(`  ✗ ${f}`));
console.log('-'.repeat(64));

if (fail.length > 0) {
  console.error(`\n✗ Gate ladder is broken (${fail.length} problem(s)).`);
  console.error('  Tiers must nest: gate:precommit ⊆ gate:prepush ⊆ verify-governance.');
  process.exit(1);
}

console.log('✓ Gate ladder is strictly nested and correctly wired.');
console.log(
  `  ${expanded['gate:precommit'].length} → ${expanded['gate:prepush'].length} → ${expanded['verify-governance'].length} stages`,
);
