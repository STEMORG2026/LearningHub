#!/usr/bin/env node

import { execSync } from 'child_process';

let tag = '';
let commits = 0;

try {
  const describe = execSync(
    'git describe --tags --match "v*" --abbrev=0 2>/dev/null || true',
    { encoding: 'utf8' },
  ).trim();
  if (describe) {
    tag = describe;
    const count = execSync(
      `git rev-list --count "${tag}..HEAD" 2>/dev/null || echo 0`,
      { encoding: 'utf8' },
    ).trim();
    commits = parseInt(count, 10) || 0;
  }
} catch {
  // No tags or not a git repo — fall back to v0.0.0-dev.0
}

const baseVersion = tag && /^v\d+\.\d+\.\d+$/.test(tag) ? tag.slice(1) : '0.0.0';
const devIdentifier = `v${baseVersion}-dev.${commits}`;

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ version: devIdentifier, base: baseVersion, commitsFromTag: commits, tag }));
} else {
  console.log(devIdentifier);
}
