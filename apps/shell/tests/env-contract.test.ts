import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

// Anchor to the repository root regardless of the vitest CWD.
const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../../..');
const shellSrc = join(repoRoot, 'apps/shell/src');
const envExamplePath = join(repoRoot, '.env.example');

/**
 * Every environment variable the shell reads at build time, discovered by
 * scanning the source. Sourced from `import.meta.env.<NAME>` accesses, which is
 * the only mechanism Vite inlines into the bundle.
 */
function envVarsReadInSource(): string[] {
  const files: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith('.d.ts')) files.push(full);
    }
  };
  walk(shellSrc);

  const found = new Set<string>();
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(/import\.meta\.env\.([A-Z0-9_]+)/g)) {
      const name = match[1];
      if (name) found.add(name);
    }
  }
  return [...found].sort();
}

/** Variable names documented in `.env.example` as active (uncommented) entries. */
function envVarsDocumented(): string[] {
  const text = readFileSync(envExamplePath, 'utf8');
  const found = new Set<string>();
  for (const line of text.split('\n')) {
    const match = /^([A-Z][A-Z0-9_]*)=/.exec(line);
    if (match?.[1]) found.add(match[1]);
  }
  return [...found].sort();
}

/** Variable names declared on `ImportMetaEnv` in `vite-env.d.ts`. */
function envVarsDeclared(): string[] {
  const text = readFileSync(join(shellSrc, 'vite-env.d.ts'), 'utf8');
  const body = text.slice(text.indexOf('interface ImportMetaEnv'));
  const found = new Set<string>();
  for (const match of body.matchAll(/readonly\s+([A-Z][A-Z0-9_]*)\??\s*:/g)) {
    const name = match[1];
    if (name) found.add(name);
  }
  return [...found].sort();
}

describe('.env.example ↔ source env reads (no drift)', () => {
  it('every variable the shell reads is documented in .env.example', () => {
    const read = envVarsReadInSource();
    const documented = envVarsDocumented();
    // The assertion that matters: source is the contract, docs must keep up.
    expect(read.filter((v) => !documented.includes(v))).toEqual([]);
  });

  it('every variable the shell reads is declared on ImportMetaEnv', () => {
    const read = envVarsReadInSource();
    const declared = envVarsDeclared();
    expect(read.filter((v) => !declared.includes(v))).toEqual([]);
  });

  it('every documented variable is actually read (no phantom entries)', () => {
    const documented = envVarsDocumented();
    const read = envVarsReadInSource();
    // A documented-but-unread variable is a lie in the contract: it tells a
    // contributor to set something that has no effect.
    expect(documented.filter((v) => !read.includes(v))).toEqual([]);
  });

  it('every declared variable is actually read (no stale declarations)', () => {
    const declared = envVarsDeclared();
    const read = envVarsReadInSource();
    expect(declared.filter((v) => !read.includes(v))).toEqual([]);
  });

  it('discovers the known variables (guards the scanner itself)', () => {
    // If the regexes above silently stopped matching, every drift assertion
    // would pass vacuously. Pin the currently-known variable so a broken
    // scanner fails loudly instead.
    expect(envVarsReadInSource()).toContain('VITE_PROFESSOR_J_URL');
  });

  it('does not document the unread OpenRouter key', () => {
    // SEC-001: a `VITE_*` secret would be inlined into the public bundle.
    // It was never read; it must not reappear in the contract.
    expect(envVarsDocumented()).not.toContain('VITE_OPENROUTER_API_KEY');
    expect(envVarsDeclared()).not.toContain('VITE_OPENROUTER_API_KEY');
  });
});
