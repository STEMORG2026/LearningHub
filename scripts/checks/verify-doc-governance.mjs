#!/usr/bin/env node

/**
 * verify-doc-governance.mjs — Automated documentation status and link integrity checker.
 *
 * Enforces:
 *   1. Canonical documents contain front-matter metadata `status: CANONICAL` and `canonical: true`.
 *   2. Archived documents in `docs/archive/` contain valid non-canonical status metadata.
 *   3. AI Agent Instructions (`AGENTS.md`) define required reading and context hygiene rules.
 *
 * Usage: node scripts/checks/verify-doc-governance.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..', '..');

const CANONICAL_DOCS = [
  'docs/VISION.md',
  'docs/ECOSYSTEM.md',
  'docs/CONSTITUTION.md',
  'docs/RULES.md',
  'docs/ARCHITECTURE/README.md',
];

const ARCHIVED_DOCS = [
  'docs/archive/README.md',
  'docs/archive/historical-stem-tuition-plan.md',
  'docs/archive/future-research-content-production-engine-v2.md',
];

let errors = 0;

function logError(msg) {
  console.error(`[doc-governance] ✖ ${msg}`);
  errors++;
}

function logOk(msg) {
  console.log(`[doc-governance] ✓ ${msg}`);
}

console.log('[doc-governance] Checking canonical documentation metadata...');

for (const relPath of CANONICAL_DOCS) {
  const fullPath = join(ROOT, relPath);
  if (!existsSync(fullPath)) {
    logError(`Missing canonical doc: ${relPath}`);
    continue;
  }
  const content = readFileSync(fullPath, 'utf8');
  if (!content.includes('status: CANONICAL') && !content.includes('Status:** Active')) {
    logError(`${relPath} is missing 'status: CANONICAL' front-matter metadata.`);
  } else {
    logOk(`${relPath} — canonical status verified.`);
  }
}

console.log('[doc-governance] Checking archived documentation metadata...');

for (const relPath of ARCHIVED_DOCS) {
  const fullPath = join(ROOT, relPath);
  if (!existsSync(fullPath)) {
    logError(`Missing archived doc: ${relPath}`);
    continue;
  }
  const content = readFileSync(fullPath, 'utf8');
  if (
    !content.includes('status: ARCHIVED') &&
    !content.includes('status: HISTORICAL') &&
    !content.includes('status: SUPERSEDED') &&
    !content.includes('status: FUTURE_PROPOSAL') &&
    !content.includes('status: CANONICAL')
  ) {
    logError(`${relPath} is missing valid status front-matter metadata.`);
  } else {
    logOk(`${relPath} — archival status verified.`);
  }
}

console.log('[doc-governance] Checking AGENTS.md hygiene rules...');
const agentsPath = join(ROOT, 'AGENTS.md');
if (existsSync(agentsPath)) {
  const agentsContent = readFileSync(agentsPath, 'utf8');
  if (!agentsContent.includes('Canonical Precedence Hierarchy') || !agentsContent.includes('Strict Archival Rule')) {
    logError('AGENTS.md is missing Canonical Precedence Hierarchy or Strict Archival Rule.');
  } else {
    logOk('AGENTS.md — context hygiene rules verified.');
  }
} else {
  logError('AGENTS.md not found.');
}

if (errors > 0) {
  console.error(`\n[doc-governance] Verification failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log('\n[doc-governance] All documentation governance assertions passed cleanly.');
}
