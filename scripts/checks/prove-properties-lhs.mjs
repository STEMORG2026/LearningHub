/**
 * Falsifiability proof for the `compareExportVersions` property tests (T-002).
 *
 * Applies mutants to `apps/shell/src/lib/lhs-adapter.ts` and runs ONLY the
 * property suite, reporting whether each mutant is detected.
 *
 * Safety: snapshots pristine source, restores in `finally`, verifies
 * byte-equality, and refuses to run if a stale backup is present.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';

const FILE = 'apps/shell/src/lib/lhs-adapter.ts';
const BACKUP = '/tmp/lhs-adapter-safe-backup.ts';

if (existsSync(BACKUP)) {
  console.error('✗ stale backup at ' + BACKUP + ' — refusing to start.');
  process.exit(2);
}

copyFileSync(FILE, BACKUP);
const pristine = readFileSync(FILE, 'utf8');

const CASES = [
  {
    id: 'A7-offbyone-compare',
    desc: 'off-by-one in segment comparison',
    from: '    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);',
    to: '    const diff = (pa[i] ?? 0) - (pb[i] ?? 0) - 1;',
  },
  {
    id: 'A2-invert-floor',
    desc: 'inverts the floor comparison',
    from: "  if (compareExportVersions(parsed.export_version, MIN_SUPPORTED_EXPORT_VERSION) < 0) {",
    to: "  if (compareExportVersions(parsed.export_version, MIN_SUPPORTED_EXPORT_VERSION) > 0) {",
  },
  {
    id: 'X-lexical-compare',
    desc: 'compares segments as strings instead of numbers',
    from: '    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);',
    to: '    const diff = String(pa[i] ?? 0) < String(pb[i] ?? 0) ? -1 : String(pa[i] ?? 0) > String(pb[i] ?? 0) ? 1 : 0;',
  },
];

const results = [];

try {
  for (const c of CASES) {
    if (!pristine.includes(c.from)) {
      results.push([c.id, 'ANCHOR NOT FOUND — mutant could not be applied']);
      continue;
    }
    // Only replace the FIRST occurrence of the loop-diff line (A7 and X share it).
    writeFileSync(FILE, pristine.replace(c.from, c.to));

    let out = '';
    try {
      out = execSync('npx vitest run --root apps/shell tests/lhs-adapter.property.test.ts 2>&1', {
        encoding: 'utf8',
      });
    } catch (error) {
      out = String(error.stdout ?? '') + String(error.stderr ?? '');
    }

    const failed = out.match(/Tests\s+(\d+) failed/);
    results.push([
      c.id,
      failed ? `KILLED (${failed[1]} property test(s) failed)` : 'SURVIVED — property cannot detect it',
    ]);

    writeFileSync(FILE, pristine);
  }
} finally {
  writeFileSync(FILE, pristine);
}

console.log('\n=== compareExportVersions property falsifiability ===');
for (const [id, verdict] of results) {
  console.log('  ' + id.padEnd(22) + verdict);
}

const intact = readFileSync(FILE, 'utf8') === pristine;
console.log('\nsource restored byte-identical: ' + (intact ? 'YES ✓' : 'NO ✗'));
if (intact) rmSync(BACKUP, { force: true });

process.exit(results.every(([, v]) => v.startsWith('KILLED')) ? 0 : 1);
