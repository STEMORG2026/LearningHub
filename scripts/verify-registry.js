#!/usr/bin/env node
// Stub — verify component registry entries are current
// TODO: implement real verification logic
const { readFileSync, existsSync, readdirSync } = require('fs');
const { join } = require('path');

const root = join(__dirname, '..');
const registryDir = join(root, 'docs/component-registry');

if (!existsSync(registryDir)) {
  console.log('[verify-registry] ⚠  No component-registry directory found — skipping');
  process.exit(0);
}

const files = readdirSync(registryDir).filter((f) => f.endsWith('.md'));
let errors = [];

for (const file of files) {
  const content = readFileSync(join(registryDir, file), 'utf8');
  if (!content.includes('**Version:**')) {
    errors.push(`${file}: missing version header`);
  }
  if (!content.includes('**Purpose:**')) {
    errors.push(`${file}: missing purpose header`);
  }
}

if (errors.length > 0) {
  console.error(`[verify-registry] ❌ ${errors.length} error(s):`);
  errors.forEach((e) => console.error(`  ${e}`));
  process.exit(1);
}

console.log(`[verify-registry] ✅ ${files.length} registry file(s) pass basic validation`);
process.exit(0);
