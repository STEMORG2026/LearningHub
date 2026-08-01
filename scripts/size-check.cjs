#!/usr/bin/env node
const { readFileSync, statSync, readdirSync, existsSync } = require('fs');
const { gzipSync } = require('zlib');
const { join, relative } = require('path');

const root = join(__dirname, '..');
const configPath = join(root, 'bundlesize.config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));

let totalErrors = 0;

for (const entry of config.files) {
  const baseDir = join(root, entry.path.replace(/\*.*$/, ''));
  const pattern = entry.path.split('/').pop();
  const maxBytes = parseSize(entry.maxSize);
  const files = findFiles(baseDir, pattern);
  for (const file of files) {
    const raw = statSync(file).size;
    // Libraries are measured as raw dist bytes; applications as gzip (entry.gzip).
    const size = entry.gzip === true ? gzipSync(readFileSync(file)).length : raw;
    const rel = relative(root, file);
    if (size > maxBytes) {
      console.error(`❌ ${rel}: ${formatSize(size)} > ${entry.maxSize}${entry.gzip ? ' (gzip)' : ''}`);
      totalErrors++;
    } else {
      console.log(`✓ ${rel}: ${formatSize(size)} <= ${entry.maxSize}${entry.gzip ? ' (gzip)' : ''}`);
    }
  }
}

if (totalErrors > 0) {
  console.error(`\n❌ ${totalErrors} file(s) exceed size limit`);
  process.exit(1);
}

console.log('\n✅ All size checks passed');
process.exit(0);

function findFiles(dir, pattern) {
  const results = [];
  if (!existsSync(dir)) return results;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(full, pattern));
    } else if (entry.isFile() && pattern === '*.js' && entry.name.endsWith('.js')) {
      results.push(full);
    }
  }
  return results;
}

function parseSize(s) {
  const match = s.match(/^(\d+(?:\.\d+)?)\s*(kB|MB|B)$/);
  if (!match) throw new Error(`Invalid size: ${s}`);
  const num = parseFloat(match[1]);
  const unit = match[2];
  if (unit === 'kB') return num * 1024;
  if (unit === 'MB') return num * 1024 * 1024;
  return num;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
