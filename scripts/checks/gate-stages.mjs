#!/usr/bin/env node
/**
 * Resolve the governance gate's tier composition.
 *
 * WHY THIS EXISTS
 * ---------------
 * The gate is a ladder of three tiers that must be *strictly nested*:
 *
 *   gate:precommit  ⊆  gate:prepush  ⊆  verify-governance
 *
 * Before this, there were two independently-maintained stage lists — one in
 * `package.json` (`verify-governance`) and one in `scripts/ci-local.mjs` — and
 * they had drifted badly. Measured drift: **8** guards ran in CI but not on
 * pre-push, and `audit:deps` ran on pre-push but not in `verify-governance`.
 * That last gap is precisely how a HIGH advisory sat undetected in the tree.
 *
 * Tiers are composed by *calling the previous tier* (`gate:prepush` begins with
 * `pnpm gate:precommit`), so nesting holds by construction. This module expands
 * those references back into a flat leaf-stage list so guards can assert what
 * actually runs — not what the string literally says.
 *
 * A stage is a leaf when it is not a `pnpm <script>` call to another gate tier.
 * Only names in `TIER_SCRIPTS` are expanded; everything else is a leaf, so
 * `pnpm test:coverage` stays one stage rather than being split into `test`.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** The three tiers, cheapest first. Order matters. */
export const TIERS = ['gate:precommit', 'gate:prepush', 'verify-governance'];

/** Scripts that compose other scripts and must be expanded. */
export const TIER_SCRIPTS = new Set(TIERS);

export function readScripts() {
  const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
  return pkg.scripts ?? {};
}

/**
 * Split a script body into individual `pnpm <script>` invocations.
 * Returns bare script names, e.g. `['lint:arch', 'gate:precommit']`.
 */
export function splitChain(body) {
  return body
    .split('&&')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^pnpm\s+/, ''))
    .map((s) => s.replace(/\s+.*$/, '')); // drop any trailing args
}

/**
 * Recursively expand a tier into its leaf stages, in execution order.
 * Throws on an unknown script or a cycle — a silently-empty expansion would
 * make every downstream assertion pass vacuously.
 */
export function expandTier(name, scripts = readScripts(), seen = new Set()) {
  if (seen.has(name)) {
    throw new Error(`cycle detected while expanding '${name}': ${[...seen].join(' -> ')} -> ${name}`);
  }
  const body = scripts[name];
  if (typeof body !== 'string' || body.trim() === '') {
    throw new Error(`script '${name}' is missing or empty`);
  }
  seen.add(name);
  const out = [];
  for (const stage of splitChain(body)) {
    if (TIER_SCRIPTS.has(stage)) {
      out.push(...expandTier(stage, scripts, new Set(seen)));
    } else {
      if (typeof scripts[stage] !== 'string') {
        throw new Error(`stage '${stage}' referenced by '${name}' is not a real script`);
      }
      out.push(stage);
    }
  }
  return out;
}

/** All tiers expanded, keyed by name. */
export function expandAll(scripts = readScripts()) {
  const map = {};
  for (const tier of TIERS) map[tier] = expandTier(tier, scripts);
  return map;
}

/**
 * CLI: `--list` prints the expanded tiers.
 *
 * `pnpm ci:local:list` used to shell out to `scripts/ci-local.mjs`, which was
 * deleted when this module replaced the old local-CI runner — the entry point
 * stayed behind and failed with MODULE_NOT_FOUND. It now prints the ladder from
 * the single source of truth, so the tiers can be inspected without reading
 * `package.json` by hand.
 *
 * Guarded on direct invocation so importing this module (as the ladder and
 * integrity guards do) stays silent.
 */
const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  if (!process.argv.includes('--list')) {
    console.error('usage: node scripts/checks/gate-stages.mjs --list');
    process.exit(1);
  }
  const expanded = expandAll(readScripts());
  for (const tier of TIERS) {
    const stages = expanded[tier];
    console.log(`${tier}  (${stages.length} stage${stages.length === 1 ? '' : 's'})`);
    for (const stage of stages) console.log(`  - ${stage}`);
  }
}
