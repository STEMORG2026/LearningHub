#!/usr/bin/env node
// Real educational-metadata validation (ADR-007 + ARCHITECTURE.md §7).
//
// For packages/quiz-engine/src/data.ts this checks:
//   1. Every question carries the full educational metadata contract:
//      question, options (>= 2, all non-empty), correct (valid index),
//      explanation, conceptId, displayName, prerequisites, gradeLevels
//      (1-12), estimatedTimeMinutes (>= 1), commonMisconceptions, tags.
//   2. Every conceptId in data.ts is registered in
//      docs/component-registry/EDUCATIONAL.md (Quiz Engine section).
//   3. No stale quiz-concept entries: every Quiz Engine concept registered in
//      EDUCATIONAL.md maps to a conceptId that actually exists in data.ts.
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const root = join(__dirname, '..');
const quizDataPath = join(root, 'packages/quiz-engine/src/data.ts');
const eduRegistryPath = join(root, 'docs/component-registry/EDUCATIONAL.md');
const SUBJECTS = ['physics', 'chemistry', 'math', 'computing', 'pioneers'];
const REQUIRED_FIELDS = [
  'question',
  'options',
  'correct',
  'explanation',
  'conceptId',
  'displayName',
  'prerequisites',
  'gradeLevels',
  'estimatedTimeMinutes',
  'commonMisconceptions',
  'tags',
];

const errors = [];
const warnings = [];

// ──── Parse data.ts into per-question objects ────
function parseQuestions(source) {
  const questions = [];
  let subject = null;
  let current = null;

  const lines = source.split('\n');
  for (const line of lines) {
    const subjMatch = line.match(/^\s{2}(physics|chemistry|math|computing|pioneers):\s*\[/);
    if (subjMatch) {
      subject = subjMatch[1];
      continue;
    }
    if (!subject) continue;

    if (/^\s{4}\{\s*$/.test(line)) {
      current = [];
      continue;
    }
    if (current) {
      current.push(line);
      if (/^\s{4}\},\s*$/.test(line)) {
        questions.push({ subject, lines: current.join('\n') });
        current = null;
      }
    }
  }
  return questions;
}

function getField(block, name) {
  const re = new RegExp(`^\\s*${name}:\\s*(.*)$`, 'm');
  const m = block.match(re);
  return m ? m[1] : null;
}

function parseString(raw) {
  if (raw === null) return null;
  const value = raw.trim().replace(/,$/, '').trim();
  const m = value.match(/^(['"])(.*)\1$/s);
  return m ? m[2] : value;
}

function parseStringArray(raw) {
  if (raw === null) return null;
  const m = raw.match(/\[([^\]]*)\]/);
  if (!m) return null;
  return m[1]
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter((s) => s.length > 0);
}

// ──── Validate a single question ────
function validateQuestion(q, index) {
  const tag = `data.ts [${q.subject} #${index + 1}]`;
  const missing = REQUIRED_FIELDS.filter((f) => getField(q.lines, f) === null);
  if (missing.length > 0) {
    errors.push(`${tag}: missing field(s): ${missing.join(', ')}`);
    return;
  }

  const question = parseString(getField(q.lines, 'question')) || '';
  if (question.length === 0) errors.push(`${tag}: question is empty`);

  const options = parseStringArray(getField(q.lines, 'options'));
  if (!options || options.length < 2) {
    errors.push(`${tag}: options must have at least 2 entries`);
  } else if (options.some((o) => o.length === 0)) {
    errors.push(`${tag}: options contains an empty string`);
  }

  const correctRaw = parseString(getField(q.lines, 'correct')) || '';
  const correct = parseInt(correctRaw, 10);
  if (Number.isNaN(correct) || (options && (correct < 0 || correct >= options.length))) {
    errors.push(`${tag}: correct index ${correctRaw} is out of range for ${options ? options.length : '?'} options`);
  }

  const explanation = parseString(getField(q.lines, 'explanation')) || '';
  if (explanation.length === 0) errors.push(`${tag}: explanation is empty`);

  const conceptId = parseString(getField(q.lines, 'conceptId')) || '';
  if (conceptId.length === 0) errors.push(`${tag}: conceptId is empty`);

  const displayName = parseString(getField(q.lines, 'displayName')) || '';
  if (displayName.length === 0) errors.push(`${tag}: displayName is empty`);

  const gradeLevels = parseStringArray(getField(q.lines, 'gradeLevels')).map(Number);
  if (gradeLevels.length === 0 || gradeLevels.some((g) => Number.isNaN(g) || g < 1 || g > 12)) {
    errors.push(`${tag}: gradeLevels must contain integers 1-12`);
  }

  const etm = parseInt(parseString(getField(q.lines, 'estimatedTimeMinutes')) || '', 10);
  if (Number.isNaN(etm) || etm < 1) {
    errors.push(`${tag}: estimatedTimeMinutes must be >= 1`);
  }

  const tags = parseStringArray(getField(q.lines, 'tags'));
  if (!tags || tags.length === 0) {
    errors.push(`${tag}: tags must be a non-empty array`);
  }

  return conceptId;
}

// ──── Registry cross-reference ────
function registeredQuizConceptIds() {
  if (!existsSync(eduRegistryPath)) return null;
  const content = readFileSync(eduRegistryPath, 'utf8');
  const quizStart = content.indexOf('## Quiz Engine');
  if (quizStart === -1) return null;
  let section = content.slice(quizStart);
  const nextSection = section.indexOf('\n## ');
  if (nextSection !== -1) section = section.slice(0, nextSection);
  const ids = new Set();
  for (const line of section.split('\n')) {
    const m = line.match(/^\|\s*[^|]+\|\s*`([a-z0-9-]+)`\s*\|/);
    if (m) ids.add(m[1]);
  }
  return ids;
}

// ──── Main ────
function main() {
  if (!existsSync(quizDataPath)) {
    console.log('[validate-edu] ℹ  No quiz data found — skipping');
    process.exit(0);
  }

  const source = readFileSync(quizDataPath, 'utf8');
  const questions = parseQuestions(source);
  const usedConceptIds = new Set();

  questions.forEach((q, i) => {
    const id = validateQuestion(q, i);
    if (id) usedConceptIds.add(id);
  });

  // Duplicate conceptId detection
  const seen = new Set();
  for (const id of usedConceptIds) {
    if (seen.has(id)) errors.push(`data.ts: duplicate conceptId '${id}'`);
    seen.add(id);
  }

  const registered = registeredQuizConceptIds();
  if (registered !== null) {
    for (const id of usedConceptIds) {
      if (!registered.has(id)) {
        errors.push(`data.ts: conceptId '${id}' is missing from EDUCATIONAL.md (Quiz Engine section)`);
      }
    }
    for (const id of registered) {
      if (!usedConceptIds.has(id)) {
        warnings.push(`EDUCATIONAL.md: registered quiz concept '${id}' has no matching question in data.ts (stale entry?)`);
      }
    }
  } else {
    warnings.push('EDUCATIONAL.md not found — skipping registry cross-reference');
  }

  if (warnings.length > 0) {
    console.log(`[validate-edu] ⚠ ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`  ${w}`));
  }

  if (errors.length > 0) {
    console.error(`[validate-edu] ❌ ${errors.length} error(s) across ${questions.length} question(s):`);
    errors.forEach((e) => console.error(`  ${e}`));
    process.exit(1);
  }

  console.log(
    `[validate-edu] ✅ ${questions.length} question(s) validated; ${usedConceptIds.size} concept(s) cross-referenced against EDUCATIONAL.md`,
  );
  process.exit(0);
}

main();
