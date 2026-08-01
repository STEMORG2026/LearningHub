#!/usr/bin/env node
/**
 * generate-tree — regenerates the repo map at `tree.txt`.
 *
 * Three-tier filtering:
 *   1. HARD SKIP  — transient/vendor dirs never traversed
 *   2. ALWAYS SHOW — .env / .env.* / *.local bypass gitignore (annotated [local, not committed])
 *   3. GITIGNORE GOVERNS — everything else piped through `git check-ignore --stdin`
 *
 * Output is deterministic: header uses the git short SHA (no timestamp), so
 * running twice against the same tree produces zero diff.
 *
 * Usage: pnpm docs:sync  (or: node scripts/generate/generate-tree.mjs)
 */

import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT = join(ROOT, 'tree.txt');

// Tier 1 — never traverse these directories.
const HARD_SKIP = new Set([
  '.git', 'node_modules', '.pnpm-store', 'dist', 'build', 'coverage',
  '.turbo', '.next', '.nuxt', '__pycache__', '.venv', 'venv',
  '.pytest_cache', '.mypy_cache', 'tmp', 'temp', 'test-results',
]);

// Tier 2 — always show despite gitignore.
const ALWAYS_SHOW = /^\.env(\.|$)|\.local$/;

// Never appear in the output at all.
const EXCLUDE = new Set(['pnpm-lock.yaml', 'tree.txt']);

const files = new Set(); // relative paths that survived tiers 1-2
const alwaysShow = new Set();
const dirs = new Set(['']); // relative dirs ('' = repo root)

function walk(dirRel) {
  const abs = join(ROOT, dirRel);
  let entries;
  try {
    entries = readdirSync(abs, { withFileTypes: true });
  } catch {
    return;
  }
  entries.sort((a, b) =>
    a.isDirectory() === b.isDirectory()
      ? a.name.localeCompare(b.name)
      : a.isDirectory()
        ? -1
        : 1,
  );
  for (const e of entries) {
    if (e.isDirectory()) {
      if (HARD_SKIP.has(e.name) || e.name === 'legacy') continue;
      const rel = dirRel ? `${dirRel}/${e.name}` : e.name;
      dirs.add(rel);
      walk(rel);
    } else {
      if (EXCLUDE.has(e.name)) continue;
      const rel = dirRel ? `${dirRel}/${e.name}` : e.name;
      if (ALWAYS_SHOW.test(e.name)) {
        alwaysShow.add(rel);
        files.add(rel);
      } else {
        files.add(rel);
      }
    }
  }
}

walk('');

// Tier 3 — let .gitignore decide for everything not in ALWAYS_SHOW.
const ignored = new Set();
const checkable = [...files].filter((f) => !alwaysShow.has(f));
if (checkable.length > 0) {
  const res = spawnSync('git', ['check-ignore', '--stdin'], {
    cwd: ROOT,
    input: `${checkable.join('\n')}\n`,
    encoding: 'utf8',
  });
  for (const line of (res.stdout || '').split('\n')) {
    if (line.trim()) ignored.add(line.trim());
  }
}

const visible = [...files].filter((f) => alwaysShow.has(f) || !ignored.has(f));

// ──── Tree construction ────
function makeDir(name) {
  return { name, isDir: true, collapsed: false, children: [], files: [] };
}

const root = makeDir('');

function findChild(node, name, isDir) {
  return node.children.find((c) => c.name === name && c.isDir === isDir);
}

for (const d of dirs) {
  if (d === '') continue;
  const parts = d.split('/');
  let node = root;
  for (let i = 0; i < parts.length; i++) {
    let child = findChild(node, parts[i], true);
    if (!child) {
      child = makeDir(parts[i]);
      node.children.push(child);
    }
    node = child;
  }
}

for (const f of visible) {
  const parts = f.split('/');
  const name = parts.pop();
  let node = root;
  for (const p of parts) {
    let child = findChild(node, p, true);
    if (!child) {
      child = makeDir(p);
      node.children.push(child);
    }
    node = child;
  }
  node.files.push(name);
}

// legacy/ is always collapsed to a single marker line.
if (existsSync(join(ROOT, 'legacy'))) {
  const legacy = makeDir('legacy');
  legacy.collapsed = true;
  root.children.push(legacy);
}

// ──── Annotation rules ────
const ENTRY_RE = /^(main|index|app|server)(\.|$)/i;
const SCHEMA_RE = /\.(schema|types|model)\./i;
const SCHEMA_BARE = /^(schema|types|model|data)$/i;
const TEST_RE = /\.(test|spec)\./i;

function annotate(fileName, parentDir, isRoot) {
  if (alwaysShow.has(parentDir ? `${parentDir}/${fileName}` : fileName)) {
    return '[local, not committed]';
  }
  if (parentDir === '__tests__' || TEST_RE.test(fileName)) return '[test]';
  const inEntryScope = isRoot || parentDir === 'src' || parentDir === 'public';
  if (inEntryScope && ENTRY_RE.test(fileName)) return '[entry]';
  const base = fileName.replace(/\.[^.]*$/, '');
  if (SCHEMA_RE.test(fileName) || SCHEMA_BARE.test(base)) return '[schema]';
  return '';
}

// ──── Rendering (dirs first, then files, alphabetical) ────
const lines = [];

function sortChildren(node) {
  node.children.sort((a, b) =>
    a.isDir === b.isDir
      ? a.name.localeCompare(b.name)
      : a.isDir
        ? -1
        : 1,
  );
  node.files.sort((a, b) => a.localeCompare(b));
  for (const c of node.children) sortChildren(c);
}

function render(node, prefix, isRootNode) {
  sortChildren(node);
  const all = [
    ...node.children.map((c) => ({ kind: 'dir', node: c })),
    ...node.files.map((f) => ({ kind: 'file', name: f, parentDir: node.name, isRoot: isRootNode })),
  ];
  all.forEach((item, i) => {
    const last = i === all.length - 1;
    const connector = last ? '└── ' : '├── ';
    const pad = last ? '    ' : '│   ';
    if (item.kind === 'dir') {
      const n = item.node;
      if (n.collapsed) {
        lines.push(`${prefix}${connector}${n.name}/  [frozen] read-only, never edit`);
      } else {
        lines.push(`${prefix}${connector}${n.name}/`);
        render(n, prefix + pad, false);
      }
    } else {
      const note = annotate(item.name, item.parentDir, item.isRoot);
      lines.push(`${prefix}${connector}${item.name}${note ? '  ' + note : ''}`);
    }
  });
}

let sha = 'no-commit';
const r = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' });
if (r.status === 0) sha = (r.stdout || '').trim();

const body = [];
body.push(`STEM-TUITION/  ${sha}`);
render(root, '', true);
body.push(...lines);
body.push('');
body.push('generated by pnpm docs:sync');

writeFileSync(OUT, `${body.join('\n')}\n`);
console.log(`[generate-tree] ✓ ${OUT}`);
