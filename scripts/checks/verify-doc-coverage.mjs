#!/usr/bin/env node

/**
 * Doc-coverage gate — every workspace must be documented.
 *
 * Adapted from the JARVIS `scripts/check_doc_coverage.py` pattern (three censuses
 * computed from the live tree, so nothing rots), reduced to what LearningHub
 * actually needs. It closes the blind spot this repo had: six packages existed with
 * zero documentation and nothing detected it.
 *
 * Census 1 — WORKSPACE COVERAGE: every `packages/<name>` and `apps/<name>` must
 *             have a `README.md` containing a documented public surface.
 * Census 2 — ARCHITECTURE METADATA: every workspace must have an
 *             `ARCHITECTURE.toml` with the required keys (the registry gate
 *             `verify-registry.js` consumes this).
 * Census 3 — PACKAGE DOC SYNC: every workspace named in `ARCHITECTURE.toml`
 *             `publicApi` must appear in that workspace's README.
 *
 * Usage:
 *   node scripts/checks/verify-doc-coverage.mjs            # human report
 *   node scripts/checks/verify-doc-coverage.mjs --strict   # exit 1 on findings
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..', '..');
const strict = process.argv.includes('--strict');

/** Workspaces deliberately exempt from the README requirement, with a reason. */
const EXEMPT = new Map([
  // Add { 'packages/foo': 'reason' } only with a documented justification.
]);

function listWorkspaces() {
  const out = [];
  for (const dir of ['packages', 'apps']) {
    const base = join(ROOT, dir);
    if (!existsSync(base)) continue;
    for (const entry of readdirSync(base, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (entry.name === 'node_modules') continue;
      out.push({ key: `${dir}/${entry.name}`, path: join(base, entry.name) });
    }
  }
  return out;
}

/** Extract the publicApi array from a minimal ARCHITECTURE.toml. */
function readPublicApi(tomlPath) {
  if (!existsSync(tomlPath)) return null;
  const text = readFileSync(tomlPath, 'utf8');
  const match = text.match(/publicApi\s*=\s*\[([\s\S]*?)\]/);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

const findings = [];

function fail(census, key, detail, fix) {
  findings.push({ census, key, detail, fix });
}

const workspaces = listWorkspaces();

// ── Census 1 — workspace coverage ────────────────────────────────────────────
for (const ws of workspaces) {
  if (EXEMPT.has(ws.key)) continue;
  const readme = join(ws.path, 'README.md');
  if (!existsSync(readme)) {
    fail(
      'workspace-coverage',
      ws.key,
      'no README.md — this workspace has zero documentation',
      `Add ${ws.key}/README.md describing purpose, public surface, and dependencies.`,
    );
  }
}

// ── Census 2 — architecture metadata ─────────────────────────────────────────
const REQUIRED_KEYS = ['owner', 'status', 'maturity', 'contracts', 'publicApi'];
for (const ws of workspaces) {
  const toml = join(ws.path, 'ARCHITECTURE.toml');
  if (!existsSync(toml)) {
    fail(
      'architecture-metadata',
      ws.key,
      'no ARCHITECTURE.toml',
      `Add ${ws.key}/ARCHITECTURE.toml (see any existing package for the shape).`,
    );
    continue;
  }
  const text = readFileSync(toml, 'utf8');
  const missing = REQUIRED_KEYS.filter((k) => !new RegExp(`^\\s*${k}\\s*=`, 'm').test(text));
  if (missing.length) {
    fail(
      'architecture-metadata',
      ws.key,
      `ARCHITECTURE.toml missing key(s): ${missing.join(', ')}`,
      `Add the missing keys to ${ws.key}/ARCHITECTURE.toml.`,
    );
  }
}

// ── Census 3 — public API documented in the README ───────────────────────────
for (const ws of workspaces) {
  if (EXEMPT.has(ws.key)) continue;
  const readme = join(ws.path, 'README.md');
  if (!existsSync(readme)) continue; // already reported by census 1
  const api = readPublicApi(join(ws.path, 'ARCHITECTURE.toml'));
  if (!api || api.length === 0) continue;
  const readmeText = readFileSync(readme, 'utf8');
  const undocumented = api.filter((symbol) => !readmeText.includes(symbol));
  if (undocumented.length) {
    fail(
      'public-api-doc-sync',
      ws.key,
      `${undocumented.length}/${api.length} public symbol(s) absent from README: ${undocumented.slice(0, 5).join(', ')}${undocumented.length > 5 ? ', …' : ''}`,
      `Document these symbols in ${ws.key}/README.md, or remove them from publicApi.`,
    );
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
const byCensus = findings.reduce((acc, f) => {
  (acc[f.census] ??= []).push(f);
  return acc;
}, {});

console.log(`[doc-coverage] ${workspaces.length} workspace(s) inspected`);

if (findings.length === 0) {
  console.log('[doc-coverage] ✅ every workspace is documented and has architecture metadata');
  process.exit(0);
}

for (const [census, items] of Object.entries(byCensus)) {
  console.log(`\n[doc-coverage] ${census} — ${items.length} finding(s)`);
  for (const f of items) {
    console.log(`  ✖ ${f.key}`);
    console.log(`      ${f.detail}`);
    console.log(`      fix: ${f.fix}`);
  }
}

console.log(`\n[doc-coverage] ${findings.length} finding(s) total.`);

if (strict) {
  console.log('[doc-coverage] FAIL (--strict)');
  process.exit(1);
}
console.log('[doc-coverage] informational only (pass --strict to fail the build)');
process.exit(0);
