#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync, statSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

const ROOT = resolve(import.meta.dirname, '..');
const CHANGESET_DIR = join(ROOT, '.changeset');
const DOCS_DIR = join(ROOT, 'docs');

function log(msg) {
  console.log(`[release:prepare] ${msg}`);
}

function warn(msg) {
  console.warn(`[release:prepare] ⚠  ${msg}`);
}

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

const changesetFiles = readdirSync(CHANGESET_DIR).filter(
  (f) => f.endsWith('.md') && f !== 'README.md' && f !== 'config.json'
);

if (changesetFiles.length === 0) {
  log('No pending changesets found. Nothing to prepare.');
  process.exit(0);
}

const changesets = changesetFiles.map((f) => {
  const content = readFileSync(join(CHANGESET_DIR, f), 'utf8');
  const lines = content.split('\n');
  const headerEnd = lines.findIndex((l) => l.trim() === '---' && l.startsWith('---'));
  const frontmatter = lines.slice(0, headerEnd);
  const description = lines.slice(headerEnd + 1).join('\n').trim();
  const packages = [];
  for (const line of frontmatter) {
    const match = line.match(/^"@stem-tuition\/([^"]+)"\s*:\s*"(major|minor|patch)"/);
    if (match) {
      packages.push({ name: `@stem-tuition/${match[1]}`, type: match[2] });
    }
  }
  return { file: f, packages, description };
});

const allPkg = new Set();
const pkgMap = {};
for (const cs of changesets) {
  for (const p of cs.packages) {
    allPkg.add(p.name);
    if (!pkgMap[p.name]) pkgMap[p.name] = [];
    pkgMap[p.name].push(cs);
  }
}

log(`Found ${changesets.length} pending changeset(s) affecting ${allPkg.size} package(s):`);
for (const name of [...allPkg].sort()) {
  const types = [...new Set(pkgMap[name].flatMap((cs) => cs.packages.filter((p) => p.name === name).map((p) => p.type)))];
  log(`  ${name} (${types.join(', ')})`);
}

log('\n--- CHANGELOG ---');

const today = new Date().toISOString().slice(0, 10);
const changelogPath = join(ROOT, 'docs/CHANGELOG.md');
let changelog = readFileSync(changelogPath, 'utf8');

const hasNextSection = changelog.includes('## [NEXT]');
const newChangelogSection = hasNextSection ? null : `
## [NEXT] — ${today}

[EDIT: Refine narrative summary]

### Added
${changesets.flatMap((cs) => cs.packages.filter((p) => p.type === 'major' || p.type === 'minor').map((p) => `- ${p.name}: ${cs.description.split('\n')[0] || 'New feature'}`)).join('\n')}

### Changed
${changesets.flatMap((cs) => cs.packages.filter((p) => p.type === 'patch').map((p) => `- ${p.name}: ${cs.description.split('\n')[0] || 'Bug fix'}`)).join('\n')}

### Fixed
${changesets.flatMap((cs) => cs.packages.filter((p) => p.type === 'patch').map((p) => `- ${p.name}: ${cs.description.split('\n')[0] || 'Bug fix'}`)).join('\n')}

### Packages Updated
${[...allPkg].sort().map((n) => `- ${n}: pending`).join('\n')}

---

`;

if (!hasNextSection) {
  const insertIdx = changelog.indexOf('\n---\n');
  const insertionPoint = insertIdx !== -1 ? insertIdx + 5 : changelog.length;
  changelog = changelog.slice(0, insertionPoint) + newChangelogSection + changelog.slice(insertionPoint);
  writeFileSync(changelogPath, changelog);
  log('  ✓ docs/CHANGELOG.md — NEXT section added');
}

log('\n--- DEVLOG ---');

const devlogPath = join(ROOT, 'docs/DEVLOG.md');
let devlog = readFileSync(devlogPath, 'utf8');

const newDevlogEntry = `
## ${today} — [EDIT: Release title]

**What happened:**
${changesets.map((cs) => `- ${cs.file.replace('.md', '')}: ${cs.description.split('\n')[0]}`).join('\n')}

**Packages affected:**
${[...allPkg].sort().map((n) => `- ${n}`).join('\n')}

**Tests:**
[EDIT: Run pnpm release:validate before proceeding]

**Struggles:**
[EDIT: Add human insight here]

**Learnings:**
[EDIT: Add human insight here]

**Next:**
[EDIT: Next phase or milestone]

---

`;

devlog = devlog.replace('---\n\n## [Template', `${newDevlogEntry}---\n\n## [Template`);
writeFileSync(devlogPath, devlog);
log('  ✓ docs/DEVLOG.md — new entry added');

log('\n--- Component Registry ---');

const registryDir = join(ROOT, 'docs/component-registry');
if (existsSync(registryDir)) {
  const registryFiles = readdirSync(registryDir).filter((f) => f.endsWith('.md'));
  for (const rf of registryFiles) {
    log(`  Scanning ${rf}...`);
  }
}

log('\n✓ release:prepare complete.');
log('');
log('Next steps:');
log(`  1. Edit docs/CHANGELOG.md — refine narrative, remove [EDIT] markers`);
log(`  2. Edit docs/DEVLOG.md — write Struggles/Learnings, remove [EDIT] markers`);
log(`  3. Resolve any registry warnings above`);
log(`  4. git add -A`);
log(`  5. pnpm release:validate`);
