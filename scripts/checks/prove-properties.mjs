/**
 * Falsifiability proof for the property-based tests (T-002).
 *
 * A property test that cannot fail proves nothing. This script applies the two
 * mutants that the original example-based suite failed to catch, runs ONLY the
 * property tests, and reports whether they detect each one.
 *
 * Safety model (learned the hard way — an earlier hand-edit corrupted the file):
 *   - refuses to start if a stale backup exists (means a previous crash)
 *   - snapshots the pristine source in memory AND on disk
 *   - restores in a `finally`, and verifies byte-equality afterwards
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';

const FILE = 'packages/core/src/event-bus.ts';
const BACKUP = '/tmp/eb-safe-backup.ts';

if (existsSync(BACKUP)) {
  console.error('✗ stale backup at ' + BACKUP + ' — a previous run did not clean up. Refusing to start.');
  process.exit(2);
}

copyFileSync(FILE, BACKUP);
const pristine = readFileSync(FILE, 'utf8');

const CASES = [
  {
    id: 'B3-unanchored-regex',
    desc: 'removes the ^...$ anchors',
    from: '  return new RegExp(`^${regexStr}$`);',
    to: '  return new RegExp(`${regexStr}`);',
  },
  {
    id: 'B6-no-metachar-escape',
    desc: 'treats metacharacters as regex operators',
    from: "  const escaped = pattern.replace(/[.+?^${}()|[\\]\\\\]/g, '\\\\$&');",
    to: '  const escaped = pattern;',
  },
];

const results = [];

try {
  for (const c of CASES) {
    if (!pristine.includes(c.from)) {
      results.push([c.id, 'ANCHOR NOT FOUND — mutant could not be applied']);
      continue;
    }

    writeFileSync(FILE, pristine.replace(c.from, c.to));

    let out = '';
    try {
      out = execSync('npx vitest run --root packages/core tests/event-bus.property.test.ts 2>&1', {
        encoding: 'utf8',
      });
    } catch (error) {
      out = String(error.stdout ?? '') + String(error.stderr ?? '');
    }

    const failedMatch = out.match(/Tests\s+(\d+) failed/);
    const killed = failedMatch !== null;
    results.push([
      c.id,
      killed ? `KILLED (${failedMatch[1]} property test(s) failed)` : 'SURVIVED — property cannot detect it',
    ]);

    writeFileSync(FILE, pristine);
  }
} finally {
  writeFileSync(FILE, pristine);
}

console.log('\n=== property-test falsifiability proof ===');
for (const [id, verdict] of results) {
  console.log('  ' + id.padEnd(22) + verdict);
}

const intact = readFileSync(FILE, 'utf8') === pristine;
console.log('\nsource restored byte-identical: ' + (intact ? 'YES ✓' : 'NO ✗'));

if (intact) rmSync(BACKUP, { force: true });

const allKilled = results.every(([, v]) => v.startsWith('KILLED'));
process.exit(allKilled ? 0 : 1);
