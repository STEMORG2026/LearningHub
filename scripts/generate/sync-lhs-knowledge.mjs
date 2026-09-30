#!/usr/bin/env node

/**
 * Syncs the STEMMA knowledge export into this repo.
 *
 * Copies STEMMA/exports/knowledge.json → apps/shell/src/data/knowledge.json
 * so the shell build and CI are self-contained (no external path imports).
 *
 * Usage: node scripts/generate/sync-lhs-knowledge.mjs
 * Env:   LHS_ROOT — absolute path to the STEMMA repo
 *                   (default: ../STEMMA, a sibling of this repo)
 */

import { copyFileSync, existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..', '..');
const LHS_ROOT = process.env.LHS_ROOT
  ? resolve(process.env.LHS_ROOT)
  : resolve(ROOT, '..', 'STEMMA');
const SOURCE = join(LHS_ROOT, 'exports', 'knowledge.json');
const TARGET = join(ROOT, 'apps', 'shell', 'src', 'data', 'knowledge.json');

/**
 * Minimum accepted export version. This is a FLOOR, not an equality pin.
 *
 * A hard equality pin is what previously let this repo sync an unusable corpus:
 * the producer moved ahead (0.2 → 2.1.0 → 2.2.0) while the consumer pinned '2.1.0',
 * so a legitimate export was either rejected or silently mishandled. A floor lets a
 * newer producer proceed while still refusing a genuinely incompatible one.
 */
const MIN_SUPPORTED_EXPORT_VERSION = '2.0.0';

/** Refuse to write a corpus below this many entities unless --allow-empty is passed. */
const MIN_ENTITY_COUNT = 1;

const allowEmpty = process.argv.includes('--allow-empty');

function compareVersions(a, b) {
  const pa = String(a).split('.').map((n) => Number.parseInt(n, 10) || 0);
  const pb = String(b).split('.').map((n) => Number.parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

if (!existsSync(SOURCE)) {
  console.error(`✗ STEMMA export not found: ${SOURCE}`);
  console.error('  Expected at STEMMA/exports/knowledge.json.');
  console.error('  Set LHS_ROOT if the STEMMA repo lives elsewhere.');
  process.exit(1);
}

let exportData;
try {
  exportData = JSON.parse(readFileSync(SOURCE, 'utf8'));
} catch (err) {
  console.error(`✗ Could not parse export: ${err.message}`);
  process.exit(1);
}

// Guard 1 — version floor. Newer is fine; older is a hard stop.
if (compareVersions(exportData.export_version, MIN_SUPPORTED_EXPORT_VERSION) < 0) {
  console.error(
    `✗ Export version '${exportData.export_version}' is below the minimum supported ` +
      `'${MIN_SUPPORTED_EXPORT_VERSION}'. Refusing to sync an incompatible corpus.`,
  );
  process.exit(1);
}

// Guard 2 — empty-corpus guard. An empty export must never overwrite a vendored
// corpus silently. This is the guard whose absence let an empty corpus (0 entities,
// down from 224) be committed and break the entire consumer chain.
const entityCount = Array.isArray(exportData.entities)
  ? exportData.entities.length
  : typeof exportData.entity_count === 'number'
    ? exportData.entity_count
    : 0;

if (entityCount < MIN_ENTITY_COUNT && !allowEmpty) {
  console.error(
    `✗ Refusing to sync an EMPTY corpus (${entityCount} entities).\n` +
      `  Source: ${SOURCE}\n` +
      `  An empty export usually means STEMMA was mid-build or checked out incorrectly.\n` +
      `  If an empty corpus is genuinely intended, re-run with --allow-empty.`,
  );
  process.exit(1);
}

if (!Array.isArray(exportData.entities)) {
  console.error('✗ Malformed export: missing `entities` array.');
  process.exit(1);
}
if (typeof exportData.export_version !== 'string' || typeof exportData.schema_version !== 'string') {
  console.error('✗ Malformed export: missing `export_version` / `schema_version`.');
  process.exit(1);
}

copyFileSync(SOURCE, TARGET);
console.log(`  ✓ ${SOURCE} → ${TARGET.replace(ROOT + '/', '')}`);
console.log(`    export_version: ${exportData.export_version}`);
console.log(`    schema_version: ${exportData.schema_version}`);
console.log(`    generated_at:   ${exportData.generated_at ?? '(absent — 2.x contract)'}`);
console.log(`    entities:       ${entityCount}`);
if (entityCount < MIN_ENTITY_COUNT) {
  console.log('    ⚠ WARNING: empty corpus written because --allow-empty was passed.');
}