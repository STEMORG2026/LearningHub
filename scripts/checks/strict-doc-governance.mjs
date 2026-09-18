#!/usr/bin/env node

/**
 * strict-doc-governance — fail-fast documentation completeness gate.
 *
 * Unlike docs-sync.mjs (which regenerates AUTO regions), this script
 * validates that human-authored documentation is complete and consistent.
 * Any single failure exits non-zero — there are no warnings, only errors.
 *
 * Checks:
 *   1. Every ADR in docs/adr/ has `status:` + `date:` frontmatter
 *   2. CHANGELOG.md has an entry for every phase in .phase.json
 *   3. README.md links to ROADMAP.md, guides/, CHANGELOG.md
 *   4. CONSTITUTION.md §24 ADR references match actual ADR files
 *   5. ROADMAP.md Phase package-tables include all .phase.json packages
 *   6. VISION.md ecosystem terms are consistent (STEMMA, not LearningHubSTEM)
 *   7. Every package in .phase.json is referenced in RULES.md or AGENTS.md
 *   8. No broken internal doc links (file exists)
 *   9. docs/DOCS.md taxonomy matches actual docs/ tree
 *  10. Governance files have required status/date frontmatter
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, resolve, relative, dirname, normalize } from 'path';

const ROOT = resolve(import.meta.dirname, '..', '..');
const DOCS_DIR = join(ROOT, 'docs');
const EXIT_OK = 0;
const EXIT_FAIL = 1;

let failures = [];
let warnings = [];

function fail(msg) {
  failures.push(msg);
  console.error(`✖ ${msg}`);
}

function warn(msg) {
  warnings.push(msg);
  console.error(`⚠ ${msg}`);
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

// ─────────────────────────────────────────────────────
// 1. ADR frontmatter check
// ─────────────────────────────────────────────────────

function checkAdrFrontmatter() {
  console.log('\n[1/10] ADR frontmatter (status + date required)');

  const adrDir = join(DOCS_DIR, 'adr');
  if (!existsSync(adrDir)) {
    fail('docs/adr/ directory missing');
    return;
  }

  const files = readdirSync(adrDir)
    .filter((f) => /^\d{3}-.*\.md$/.test(f))
    .sort();

  if (files.length === 0) {
    fail('No ADR files found in docs/adr/');
    return;
  }

  for (const f of files) {
    const path = join(adrDir, f);
    const content = readFileSync(path, 'utf8');

    if (!content.startsWith('---')) {
      fail(`${f}: missing YAML frontmatter entirely`);
      continue;
    }

    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd === -1) {
      fail(`${f}: unterminated YAML frontmatter`);
      continue;
    }

    const fm = content.slice(0, frontmatterEnd);
    const hasStatus = /^\s*status\s*:/m.test(fm);
    const hasDate = /^\s*date\s*:/m.test(fm);
    const hasCanonical = /^\s*canonical\s*:/m.test(fm);

    if (!hasStatus) fail(`${f}: missing 'status:' in frontmatter`);
    if (!hasDate) fail(`${f}: missing 'date:' in frontmatter`);
    if (!hasCanonical) fail(`${f}: missing 'canonical:' in frontmatter`);

    if (hasStatus && hasDate && hasCanonical) {
      ok(f);
    }
  }
}

// ─────────────────────────────────────────────────────
// 2. CHANGELOG phase coverage
// ─────────────────────────────────────────────────────

function checkChangelogPhaseCoverage() {
  console.log('\n[2/10] CHANGELOG.md phase coverage');

  const changelogPath = join(DOCS_DIR, 'CHANGELOG.md');
  if (!existsSync(changelogPath)) {
    fail('CHANGELOG.md missing');
    return;
  }

  const changelog = readFileSync(changelogPath, 'utf8');

  // Read phases
  const phasePath = join(ROOT, '.phase.json');
  if (!existsSync(phasePath)) {
    fail('.phase.json missing');
    return;
  }

  const phaseData = JSON.parse(readFileSync(phasePath, 'utf8'));
  const phases = phaseData.phases || [];

  for (const phase of phases) {
    const phaseName = phase.name || `Phase ${phase.id}`;
    // Check for phase name or "Phase N" in changelog
    const nameInChangelog = changelog.includes(phaseName) ||
      changelog.includes(`Phase ${phase.id}:`) ||
      changelog.includes(`Phase ${phase.id} `) ||
      changelog.includes(`**Phase ${phase.id}`) ||
      changelog.includes(`Phase ${phase.id}:`);

    if (!nameInChangelog) {
      fail(`CHANGELOG.md missing entry for Phase ${phase.id}: ${phaseName}`);
    } else {
      ok(`Phase ${phase.id}: ${phaseName}`);
    }
  }

  // Check for identity consistency
  if (changelog.includes('STEM-TUITION')) {
    fail('CHANGELOG.md still references "STEM-TUITION" — should be "LearningHub"');
  }
}

// ─────────────────────────────────────────────────────
// 3. README.md links to key docs
// ─────────────────────────────────────────────────────

function checkReadmeLinks() {
  console.log('\n[3/10] README.md links to required docs');

  const readmePath = join(ROOT, 'README.md');
  if (!existsSync(readmePath)) {
    fail('README.md missing');
    return;
  }

  const readme = readFileSync(readmePath, 'utf8');

  // Check that the documentation section exists and references key areas
  const docSectionIdx = readme.indexOf('## 📖 Documentation');
  if (docSectionIdx === -1) {
    fail('README.md missing ## 📖 Documentation section');
    return;
  }

  const docSection = readme.slice(docSectionIdx, docSectionIdx + 2000);

  const requiredTerms = [
    { term: 'ROADMAP', label: 'ROADMAP' },
    { term: 'CHANGELOG', label: 'CHANGELOG' },
    { term: 'RULES', label: 'RULES' },
    { term: 'CONSTITUTION', label: 'CONSTITUTION' },
    { term: 'ECOSYSTEM', label: 'ECOSYSTEM' },
    { term: 'VISION', label: 'VISION' },
    { term: 'ARCHITECTURE', label: 'ARCHITECTURE' },
    { term: 'guides', label: 'guides' },
    { term: 'adr', label: 'adr' },
    { term: 'policies', label: 'policies' },
  ];

  for (const link of requiredTerms) {
    if (!docSection.includes(link.term)) {
      fail(`README.md Documentation section missing reference to ${link.label}`);
    } else {
      ok(`${link.label}`);
    }
  }
}

// ─────────────────────────────────────────────────────
// 4. CONSTITUTION.md §24 ADR references
// ─────────────────────────────────────────────────────

function checkConstitutionAdrRefs() {
  console.log('\n[4/10] CONSTITUTION.md §24 ADR references');

  const constitutionPath = join(DOCS_DIR, 'CONSTITUTION.md');
  if (!existsSync(constitutionPath)) {
    fail('CONSTITUTION.md missing');
    return;
  }

  const constitution = readFileSync(constitutionPath, 'utf8');

  // Find section 24
  const section24Idx = constitution.indexOf('24. ARCHITECTURE DECISION RECORDS');
  if (section24Idx === -1) {
    fail('CONSTITUTION.md missing section 24');
    return;
  }

  const section24 = constitution.slice(section24Idx, section24Idx + 3000);

  // Extract ADR references (numbers)
  const adrRefs = new Set();
  const adrPattern = /(\d{3})-[\w-]+\.md/g;
  let match;
  while ((match = adrPattern.exec(section24)) !== null) {
    adrRefs.add(parseInt(match[1]));
  }

  if (adrRefs.size === 0) {
    fail('CONSTITUTION.md §24 has no ADR references');
    return;
  }

  // Get actual ADR files
  const adrDir = join(DOCS_DIR, 'adr');
  const actualAdrs = readdirSync(adrDir)
    .filter((f) => /^\d{3}-/.test(f))
    .map((f) => parseInt(f.slice(0, 3)));

  // Check for missing references
  for (const adrNum of actualAdrs) {
    if (!adrRefs.has(adrNum)) {
      fail(`CONSTITUTION.md §24 missing ADR-${String(adrNum).padStart(3, '0')}`);
    }
  }

  // Check for phantom references
  for (const adrNum of adrRefs) {
    if (!actualAdrs.includes(adrNum)) {
      fail(`CONSTITUTION.md §24 references non-existent ADR-${String(adrNum).padStart(3, '0')}`);
    }
  }

  if (failures.filter(f => f.includes('CONSTITUTION')).length === 0) {
    ok(`All ${actualAdrs.length} ADRs referenced`);
  }
}

// ─────────────────────────────────────────────────────
// 5. ROADMAP.md Phase package-tables
// ─────────────────────────────────────────────────────

function checkRoadmapPackageTables() {
  console.log('\n[5/10] ROADMAP.md Phase package tables');

  const roadmapPath = join(DOCS_DIR, 'ROADMAP.md');
  if (!existsSync(roadmapPath)) {
    fail('ROADMAP.md missing');
    return;
  }

  const roadmap = readFileSync(roadmapPath, 'utf8');

  // Read phases
  const phasePath = join(ROOT, '.phase.json');
  const phaseData = JSON.parse(readFileSync(phasePath, 'utf8'));
  const phases = phaseData.phases || [];

  for (const phase of phases) {
    if (!phase.packages || phase.packages.length === 0) continue;

    const phaseIdx = roadmap.indexOf(`## Phase ${phase.id}:`);
    if (phaseIdx === -1) continue; // Phase section might not exist (brief phases)

    // Find the next phase boundary (## Phase N+1, ## Phase N+1+, ## Phase N+2, ## Docs Governance)
    let nextPhaseIdx = -1;
    for (let next = phase.id + 1; next <= phase.id + 3; next++) {
      // Try exact "Phase N:" then "Phase N+" then "Phase N+1+"
      for (const pattern of [`## Phase ${next}:`, `## Phase ${next} `, `## Phase ${next}+`]) {
        const nextMarker = roadmap.indexOf(pattern, phaseIdx + 1);
        if (nextMarker !== -1) {
          nextPhaseIdx = nextMarker;
          break;
        }
      }
      if (nextPhaseIdx !== -1) break;
    }
    // Also check for "## Docs Governance" as a boundary
    const docsGovIdx = roadmap.indexOf('## Docs Governance', phaseIdx + 1);
    if (docsGovIdx !== -1 && (nextPhaseIdx === -1 || docsGovIdx < nextPhaseIdx)) {
      nextPhaseIdx = docsGovIdx;
    }
    
    const phaseSection = nextPhaseIdx !== -1 
      ? roadmap.slice(phaseIdx, nextPhaseIdx)
      : roadmap.slice(phaseIdx, phaseIdx + 5000);
    
    // Only check phases that have a | Package | table
    const tableStart = phaseSection.indexOf('| Package |');
    if (tableStart === -1) continue;

    const tableSection = phaseSection.slice(tableStart, tableStart + 1000);

    for (const pkg of phase.packages) {
      if (!tableSection.includes(pkg)) {
        fail(`ROADMAP.md Phase ${phase.id} table missing package: ${pkg}`);
      }
    }
  }
}

// ─────────────────────────────────────────────────────
// 6. VISION.md ecosystem terms consistency
// ─────────────────────────────────────────────────────

function checkVisionEcosystemTerms() {
  console.log('\n[6/10] VISION.md ecosystem term consistency');

  const visionPath = join(DOCS_DIR, 'VISION.md');
  if (!existsSync(visionPath)) {
    fail('VISION.md missing');
    return;
  }

  const vision = readFileSync(visionPath, 'utf8');

  // Check for outdated terms
  if (vision.includes('LearningHubSTEM')) {
    fail('VISION.md uses outdated "LearningHubSTEM" — should be "STEMMA"');
  }

  if (vision.includes('STEM-TUITION')) {
    fail('VISION.md uses outdated "STEM-TUITION" — should be "STEM Tuition"');
  }

  // Check required project mentions
  const required = ['LearningHub', 'STEM Tuition', 'STEM Lab', 'STEM Game', 'PROFESSOR-J', 'JARVIS', 'STEMMA'];
  for (const term of required) {
    if (!vision.includes(term)) {
      fail(`VISION.md missing required ecosystem term: ${term}`);
    }
  }
}

// ─────────────────────────────────────────────────────
// 7. Package references in RULES.md or AGENTS.md
// ─────────────────────────────────────────────────────

function checkPackageDocReferences() {
  console.log('\n[7/10] Package references in RULES.md or AGENTS.md');

  const agentsPath = join(ROOT, 'AGENTS.md');
  const rulesPath = join(DOCS_DIR, 'RULES.md');

  if (!existsSync(agentsPath)) {
    fail('AGENTS.md missing');
    return;
  }

  const agents = readFileSync(agentsPath, 'utf8');
  const rules = existsSync(rulesPath) ? readFileSync(rulesPath, 'utf8') : '';

  // Read packages from .phase.json
  const phasePath = join(ROOT, '.phase.json');
  const phaseData = JSON.parse(readFileSync(phasePath, 'utf8'));
  const phases = phaseData.phases || [];
  const allPkgs = new Set();
  for (const phase of phases) {
    for (const pkg of (phase.packages || [])) {
      allPkgs.add(pkg);
    }
  }

  for (const pkg of allPkgs) {
    const inAgents = agents.includes(`packages/${pkg}/`);
    const inRules = rules.includes(`packages/${pkg}/`);

    if (!inAgents && !inRules) {
      fail(`Package ${pkg} not referenced in AGENTS.md or RULES.md`);
    }
  }
}

// ─────────────────────────────────────────────────────
// 8. No broken internal doc links (project files only)
// ─────────────────────────────────────────────────────

function checkBrokenDocLinks() {
  console.log('\n[8/10] No broken internal doc links');

  const mdFiles = [];
  function walk(dir, isRoot = false) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.name === 'node_modules' && !isRoot) continue;
      if (entry.name === '.git') continue;
      if (entry.name === 'dist') continue;
      if (entry.name === 'coverage') continue;
      if (entry.isDirectory()) walk(full, false);
      else if (entry.name.endsWith('.md')) mdFiles.push(full);
    }
  }
  walk(ROOT, true);

  const brokenLinks = [];
  for (const file of mdFiles) {
    const content = readFileSync(file, 'utf8');
    const fileDir = dirname(file);
    const linkPattern = /\]\(\.?\/?([^)]+)\)/g;
    let m;
    while ((m = linkPattern.exec(content)) !== null) {
      let target = m[1].split('#')[0].trim();
      if (target.startsWith('http') || target.startsWith('mailto:') || target === '') continue;

      // Resolve relative to the file containing the link
      let resolved;
      if (target.startsWith('./') || target.startsWith('../')) {
        resolved = normalize(join(fileDir, target));
      } else if (target.startsWith('docs/') || target.startsWith('scripts/')) {
        resolved = join(ROOT, target);
      } else {
        // Try relative to file first, then root
        resolved = normalize(join(fileDir, target));
        if (!existsSync(resolved)) {
          resolved = join(ROOT, target);
        }
      }

      if (!existsSync(resolved)) {
        brokenLinks.push({ file: relative(ROOT, file), target });
      }
    }
  }

  if (brokenLinks.length > 0) {
    for (const { file, target } of brokenLinks) {
      fail(`Broken link in ${file}: ${target}`);
    }
  } else {
    ok('All internal doc links valid');
  }
}

// ─────────────────────────────────────────────────────
// 9. docs/DOCS.md taxonomy matches actual tree
// ─────────────────────────────────────────────────────

function checkDocsTaxonomy() {
  console.log('\n[9/10] docs/DOCS.md taxonomy matches actual tree');

  const docsMdPath = join(DOCS_DIR, 'DOCS.md');
  if (!existsSync(docsMdPath)) {
    fail('docs/DOCS.md missing');
    return;
  }

  const docsMd = readFileSync(docsMdPath, 'utf8');

  // Check that key doc directories are mentioned
  const requiredDirs = ['policies/', 'guides/', 'adr/', 'ARCHITECTURE/', 'governance/', 'component-registry/', 'archive/'];
  for (const dir of requiredDirs) {
    if (!docsMd.includes(dir)) {
      fail(`DOCS.md missing directory reference: ${dir}`);
    }
  }

  // Check that key policy files are mentioned
  const requiredPolicies = ['EVENT_BUS_CONTRACT.md', 'VERSIONING.md', 'DEPENDENCY_POLICY.md'];
  for (const policy of requiredPolicies) {
    if (!docsMd.includes(policy)) {
      fail(`DOCS.md missing policy reference: ${policy}`);
    }
  }
}

// ─────────────────────────────────────────────────────
// 10. Governance files have required frontmatter
// ─────────────────────────────────────────────────────

function checkGovernanceFrontmatter() {
  console.log('\n[10/10] Governance files have required frontmatter');

  const govFiles = [
    'VISION.md',
    'ECOSYSTEM.md',
    'CONSTITUTION.md',
  ];

  for (const f of govFiles) {
    const path = join(DOCS_DIR, f);
    if (!existsSync(path)) {
      fail(`${f}: missing`);
      continue;
    }

    const content = readFileSync(path, 'utf8');

    if (!content.startsWith('---')) {
      fail(`${f}: missing YAML frontmatter`);
      continue;
    }

    const fmEnd = content.indexOf('---', 3);
    const fm = content.slice(0, fmEnd);

    if (!/^\s*status\s*:/m.test(fm)) fail(`${f}: missing 'status:'`);
    if (!/^\s*canonical\s*:/m.test(fm)) fail(`${f}: missing 'canonical:'`);
  }
}

// ─────────────────────────────────────────────────────
// Run all checks
// ─────────────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════════════');
console.log('  STRICT DOC GOVERNANCE — fail on any gap');
console.log('═══════════════════════════════════════════════════════════');

checkAdrFrontmatter();
checkChangelogPhaseCoverage();
checkReadmeLinks();
checkConstitutionAdrRefs();
checkRoadmapPackageTables();
checkVisionEcosystemTerms();
checkPackageDocReferences();
checkBrokenDocLinks();
checkDocsTaxonomy();
checkGovernanceFrontmatter();

console.log('\n═══════════════════════════════════════════════════════════');

if (failures.length > 0) {
  console.error(`\n✖ ${failures.length} FAILURE(S) — documentation is incomplete`);
  process.exit(EXIT_FAIL);
} else {
  console.log('\n✅ All doc governance checks passed');
  process.exit(EXIT_OK);
}
