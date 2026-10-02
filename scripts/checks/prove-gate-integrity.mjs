#!/usr/bin/env node
/**
 * Enforcement for the governance gate's own composition.
 *
 * WHY THIS EXISTS
 * ---------------
 * `pnpm verify-governance` is the single command CI runs to decide whether code
 * may merge. That makes it the highest-value target in the repository: delete a
 * stage from its chain and every check in that stage silently stops running,
 * while the command still exits 0 and CI still shows green.
 *
 * The existing guards protect the *content* of the rules (prose, thresholds,
 * docs). None of them protect the *wiring*. This one does: it asserts the
 * mandatory stages are still present in the chain, so removing or reordering
 * them out of existence fails the build.
 *
 * It is deliberately a composition check, not a semantic one — it cannot prove a
 * stage is honest, only that it is still there and still runs before merge.
 *
 * Exit codes: 0 = gate intact, 1 = a mandatory stage is missing.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * Stages that must always be part of `verify-governance`.
 *
 * Each entry is a stage that, if absent, means a whole class of defect can
 * reach `main` undetected. Stages added by in-flight branches are intentionally
 * NOT required here — requiring them would fail CI before they merge.
 */
const MANDATORY_STAGES = [
  { stage: 'lint:arch', why: 'architecture boundary violations' },
  { stage: 'lint:circular', why: 'import cycles' },
  { stage: 'build', why: 'packages must compile' },
  { stage: 'typecheck', why: 'type errors' },
  { stage: 'test:coverage', why: 'per-package coverage floors' },
  { stage: 'test:coverage:ratchet', why: 'thresholds may only move upward' },
  { stage: 'test:integrity:rule', why: 'the Falsifiability Protocol stays intact' },
  { stage: 'test:mutation:validate', why: 'the mutant catalogue stays live' },
  { stage: 'test:flakes:prove', why: 'the flake detector is proven to detect' },
];

const fail = [];
const pass = [];

const pkgPath = join(repoRoot, 'package.json');
if (!existsSync(pkgPath)) {
  console.error('✗ package.json not found — cannot verify gate composition');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const chain = pkg.scripts?.['verify-governance'];

console.log('Governance gate composition enforcement');
console.log('='.repeat(64));

if (typeof chain !== 'string' || chain.trim() === '') {
  console.error('✗ verify-governance script is missing or empty — the gate has been removed');
  process.exit(1);
}

const stages = chain
  .split('&&')
  .map((s) => s.trim().replace(/^pnpm\s+/, ''))
  .filter(Boolean);

pass.push(`verify-governance contains ${stages.length} stage(s)`);

for (const { stage, why } of MANDATORY_STAGES) {
  if (stages.includes(stage)) {
    pass.push(`mandatory stage present: ${stage} (guards ${why})`);
  } else {
    fail.push(`mandatory stage MISSING: ${stage} — ${why} would go undetected`);
  }
}

// A chain that no longer chains (single stage, no '&&') is a gutted gate.
if (stages.length < MANDATORY_STAGES.length) {
  fail.push(
    `gate has only ${stages.length} stage(s) but ${MANDATORY_STAGES.length} are mandatory — the chain was shortened`,
  );
}

pass.forEach((p) => console.log(`  ✓ ${p}`));
fail.forEach((f) => console.log(`  ✗ ${f}`));

console.log('-'.repeat(64));

if (fail.length > 0) {
  console.error('\n✗ The governance gate was weakened. Restore the missing stage(s).');
  process.exit(1);
}

console.log('✓ Governance gate composition intact — no mandatory stage was removed.');
