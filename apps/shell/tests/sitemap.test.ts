import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

// Anchor to the shell package root regardless of the vitest CWD.
const here = dirname(fileURLToPath(import.meta.url));
const shellRoot = resolve(here, '..');
const publicDir = join(shellRoot, 'public');

const SITE_BASE = 'https://learninghubstem.pages.dev';

function listedSitemapPaths(): string[] {
  const xml = readFileSync(join(publicDir, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? '');
  return locs.map((url) => {
    const path = url.replace(SITE_BASE, '');
    return path === '' ? '/' : path;
  });
}

function pagesOnDisk(): string[] {
  const files = readdirSync(shellRoot).filter((f) => f.endsWith('.html'));
  const paths = files
    .map((f) => (f === 'index.html' ? '/' : `/${f}`))
    .sort();
  return paths;
}

describe('sitemap.xml ↔ pages on disk', () => {
  it('lists every built page exactly once (no drift)', () => {
    const listed = listedSitemapPaths().sort();
    const onDisk = pagesOnDisk();
    expect(listed).toEqual(onDisk);
  });

  it('uses the canonical learninghubstem.pages.dev origin', () => {
    const xml = readFileSync(join(publicDir, 'sitemap.xml'), 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? '');
    expect(locs.length).toBeGreaterThan(0);
    for (const loc of locs) {
      expect(loc).toMatch(/^https:\/\/learninghubstem\.pages\.dev\//);
    }
  });

  it('robots.txt declares the sitemap', () => {
    const robots = readFileSync(join(publicDir, 'robots.txt'), 'utf8');
    expect(robots).toContain(`Sitemap: ${SITE_BASE}/sitemap.xml`);
  });
});