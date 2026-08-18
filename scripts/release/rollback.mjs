#!/usr/bin/env node

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

function log(msg) {
  console.log(`[rollback] ${msg}`);
}

function fail(msg) {
  console.error(`[rollback] ❌ ${msg}`);
  process.exit(1);
}

// Parse args
const args = process.argv.slice(2);
let targetVersion = null;
let dryRun = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--version' || args[i] === '-v') {
    targetVersion = args[++i];
  } else if (args[i] === '--dry-run') {
    dryRun = true;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
Usage: node scripts/release/rollback.mjs [options]

Options:
  --version, -v <version>   Version to roll back to (e.g. 3.0.0)
  --dry-run                 Preview actions without executing
  --help, -h                Show this help

This script:
1. Finds the previous release version from git tags
2. Creates a revert changeset
3. Tags a new release with the reverted state
`);
    process.exit(0);
  }
}

if (!targetVersion) {
  // Find latest version from git tags
  try {
    const tags = execSync('git tag --list "v*" --sort=-version:refname', {
      cwd: ROOT,
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .filter(Boolean);
    if (tags.length === 0) {
      fail('No version tags found in git history.');
    }
    // Get the second-to-last tag (the one before current)
    if (tags.length < 2) {
      fail('Need at least 2 version tags to rollback. Only found: ' + tags[0]);
    }
    targetVersion = tags[1].replace(/^v/, '');
    log(`Auto-detected previous version: v${targetVersion}`);
  } catch (e) {
    fail(`Failed to read git tags: ${e.message}`);
  }
}

log(`Rolling back to v${targetVersion}`);

if (dryRun) {
  log('DRY RUN — no changes will be made');
  log(`Would create revert changeset for v${targetVersion}`);
  log(`Would run: pnpm changeset version`);
  log(`Would run: pnpm changeset publish`);
  log(`Would tag: v${targetVersion}`);
  process.exit(0);
}

// Check if working tree is clean
try {
  execSync('git diff --quiet', { cwd: ROOT, stdio: 'pipe' });
} catch {
  fail('Working tree is not clean. Commit or stash changes before rolling back.');
}

// Verify the target version tag exists
try {
  execSync(`git tag -l "v${targetVersion}"`, { cwd: ROOT, encoding: 'utf8' }).trim();
} catch {
  fail(`Tag v${targetVersion} does not exist.`);
}

// Step 1: Create a revert changeset
const changesetContent = `---
"@stem-tuition/shell": patch
---

Rollback to v${targetVersion} — revert recent release
`;

const changesetFile = `.changeset/rollback-v${targetVersion.replace(/\./g, '-')}.md`;
writeFileSync(join(ROOT, changesetFile), changesetContent);
log(`✓ Created changeset: ${changesetFile}`);

// Step 2: Checkout the target version's package.json files
log(`Checking out package versions from v${targetVersion}...`);
try {
  const pkgFiles = execSync(
    `git diff v${targetVersion} HEAD --name-only -- 'packages/*/package.json' 'apps/*/package.json'`,
    { cwd: ROOT, encoding: 'utf8' }
  )
    .trim()
    .split('\n')
    .filter(Boolean);

  for (const file of pkgFiles) {
    execSync(`git checkout v${targetVersion} -- ${file}`, { cwd: ROOT, stdio: 'pipe' });
    log(`  ✓ Reverted ${file}`);
  }
} catch (e) {
  fail(`Failed to revert package.json files: ${e.message}`);
}

// Step 3: Version bump via changeset
log('Running changeset version...');
try {
  execSync('pnpm changeset version', { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  fail('changeset version failed');
}

// Step 4: Publish
log('Publishing packages...');
try {
  execSync('pnpm changeset publish', {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, NPM_CONFIG_PROVENANCE: 'true' },
  });
} catch (e) {
  fail('changeset publish failed');
}

// Step 5: Tag the rollback release
const newVersion = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
log(`Tagging rollback release: v${newVersion}`);
try {
  execSync(`git tag v${newVersion}`, { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  fail('git tag failed');
}

log(`✓ Rollback complete. Published v${newVersion}`);
log(`  Target was: v${targetVersion}`);
log(`  Push with: git push && git push --tags`);
