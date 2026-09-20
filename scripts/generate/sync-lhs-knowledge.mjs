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

const SUPPORTED_EXPORT_VERSION = '2.1.0';

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

if (exportData.export_version !== SUPPORTED_EXPORT_VERSION) {
  console.error(
    `✗ Unsupported export version '${exportData.export_version}' (supported: '${SUPPORTED_EXPORT_VERSION}').`,
  );
  process.exit(1);
}

copyFileSync(SOURCE, TARGET);
console.log(`  ✓ ${SOURCE} → ${TARGET.replace(ROOT + '/', '')}`);
console.log(`    export_version: ${exportData.export_version}`);
console.log(`    generated_at:   ${exportData.generated_at}`);
console.log(`    entities:       ${exportData.entity_count}`);