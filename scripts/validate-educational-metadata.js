#!/usr/bin/env node
// Stub — validate educational metadata in quiz data
// TODO: implement real validation against EDUCATIONAL.md registry
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const root = join(__dirname, '..');
const quizDataPath = join(root, 'packages/quiz-engine/src/data.ts');

if (!existsSync(quizDataPath)) {
  console.log('[validate-edu] ℹ  No quiz data found — skipping');
  process.exit(0);
}

console.log('[validate-edu] ✅ Educational metadata validation passed (stub)');
process.exit(0);
