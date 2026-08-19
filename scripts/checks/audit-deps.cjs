#!/usr/bin/env node
// Dependency audit gate — used by .github/workflows/security.yml (Dependency audit).
//
// Runs `pnpm audit --audit-level high` and fails on any high/critical advisory
// EXCEPT a documented allowlist of advisories that have no published fix at the
// time of writing. Remove entries as fixes are published.
//
// Allowlist (re-evaluate weekly via the scheduled run):
// - GHSA-jmr9-qjv8-65gv (extract-zip unvalidated symlink path traversal, high):
//   the latest published version is 2.0.1; the advisory's patched 2.0.2 is not
//   yet published. Dev-only transitive dependency via @lhci/cli → lighthouse →
//   puppeteer-core → @puppeteer/browsers. Never shipped to production.
const ALLOWLIST = new Set(['GHSA-jmr9-qjv8-65gv']);

const { spawnSync } = require('node:child_process');

const result = spawnSync(
  'pnpm',
  ['audit', '--audit-level', 'high', '--json'],
  { encoding: 'utf8' },
);

let report = null;
try {
  report = result.stdout.trim() ? JSON.parse(result.stdout) : null;
} catch {
  report = null;
}

const failing = [];
const allowed = [];

if (report && report.advisories) {
  for (const advisory of Object.values(report.advisories)) {
    if (advisory.severity !== 'high' && advisory.severity !== 'critical') {
      continue;
    }
    const ghsa =
      advisory.github_advisory_id ||
      (advisory.url || '').match(/GHSA-[0-9a-zA-Z-]+/)?.[0] ||
      null;
    const entry =
      `${advisory.module_name} (${advisory.severity}) ` +
      `${ghsa || 'unknown'} — ${advisory.title || ''}`;
    if (ghsa && ALLOWLIST.has(ghsa)) {
      allowed.push(entry);
    } else {
      failing.push(entry);
    }
  }
}

for (const entry of allowed) {
  console.log(`[allowlisted] ${entry}`);
}
if (failing.length > 0) {
  console.error('High/critical vulnerabilities not covered by the allowlist:');
  for (const entry of failing) {
    console.error(`  - ${entry}`);
  }
  process.exitCode = 1;
} else if (result.status !== 0 && !report) {
  console.error('pnpm audit failed and produced no parseable JSON output.');
  console.error(result.stderr || result.stdout || `exit code ${result.status}`);
  process.exitCode = 1;
} else {
  const high = Object.values(report?.advisories ?? {}).filter(
    (a) => a.severity === 'high',
  ).length;
  const critical = Object.values(report?.advisories ?? {}).filter(
    (a) => a.severity === 'critical',
  ).length;
  console.log(
    `Audit gate passed. high=${high} critical=${critical} ` +
      `allowlisted=${allowed.length}`,
  );
}
