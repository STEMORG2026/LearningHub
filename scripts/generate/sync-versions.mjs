#!/usr/bin/env node

/**
 * Syncs document versions with project version.
 * Reads root package.json version, stamps it into all **Version:** headers in docs/*.md
 * 
 * Usage: node scripts/generate/sync-versions.mjs
 * Hook: runs automatically as part of `pnpm changeset version`
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..', '..');
const DOCS_DIR = join(ROOT, 'docs');

// Read project version
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const VERSION = pkg.version;

// Recursively find all .md files in docs/
function findMarkdownFiles(dir) {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

let updatedCount = 0;

const files = findMarkdownFiles(DOCS_DIR);
for (const file of files) {
  const content = readFileSync(file, 'utf8');
  // Replace **Version:** X.X.X with **Version:** VERSION
  const updated = content.replace(
    /^(\*\*Version:\*\*)\s+\d+\.\d+\.\d+/m,
    `$1 ${VERSION}`
  );
  if (updated !== content) {
    writeFileSync(file, updated);
    console.log(`  ✓ ${file.replace(ROOT + '/', '')}`);
    updatedCount++;
  }
}

console.log(`\nSynced ${updatedCount} docs to version ${VERSION}`);
