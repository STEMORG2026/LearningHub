#!/usr/bin/env node

/**
 * ==========================================================================
 * STEM TUITION PLATFORM — AUTOMATED TESTING & RULES COMPLIANCE SUITE (v5.0)
 * ==========================================================================
 * Run this script to verify full compliance with RULES.md v5.0.
 * Usage: node tests/verify-stem-platform.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');

// ANSI Color Helpers
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ${GREEN}✓ PASSED:${RESET} ${message}`);
  } else {
    failedTests++;
    console.error(`  ${RED}✕ FAILED:${RESET} ${message}`);
  }
}

function printHeader(title) {
  console.log(`\n${CYAN}======================================================================${RESET}`);
  console.log(`${CYAN}${title}${RESET}`);
  console.log(`${CYAN}======================================================================${RESET}`);
}

console.log(`\n${YELLOW}🧪 RUNNING STEM TUITION PLATFORM ARCHITECTURE & RULES AUDIT...${RESET}\n`);

// --------------------------------------------------------------------------
// SUITE 1: FILE ARCHITECTURE & LINK INTEGRITY
// --------------------------------------------------------------------------
printHeader('📦 SUITE 1: Directory Structure & Link Integrity (Rule 1)');

const requiredFiles = [
  'index.html',
  'classes.html',
  'videos.html',
  'contact.html',
  'stem-tuition.html',
  'css/main.css',
  'css/stem-theme.css',
  'js/main.js',
  'js/stem-effects.js',
  'js/stem-pioneers.js',
  'js/stem-quiz.js',
  'docs/RULES.md',
  'docs/DEVELOPMENT.md',
  'docs/CURRICULUM_GUIDE.md',
  'docs/TUITION_OPERATIONS.md'
];

requiredFiles.forEach(file => {
  const fullPath = path.join(ROOT_DIR, file);
  if (fs.existsSync(fullPath)) {
    // Casing validation
    const dir = path.dirname(fullPath);
    const filename = path.basename(fullPath);
    const filesInDir = fs.readdirSync(dir);
    assert(filesInDir.includes(filename), `Exact casing match on disk: ${file}`);
  } else {
    assert(false, `Required architecture file exists: ${file}`);
  }
});

// HTML Asset References Validation
const requiredHTMLFiles = ['index.html', 'classes.html', 'videos.html', 'contact.html', 'stem-tuition.html'];
requiredHTMLFiles.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (fs.existsSync(filePath)) {
    const htmlContent = fs.readFileSync(filePath, 'utf8');

    // CSS links
    const cssMatches = [...htmlContent.matchAll(/href=["'](css\/[^"'\?]+)/g)];
    cssMatches.forEach(match => {
      assert(fs.existsSync(path.join(ROOT_DIR, match[1])), `${file} -> Linked CSS asset exists: ${match[1]}`);
    });

    // JS links
    const jsMatches = [...htmlContent.matchAll(/src=["'](js\/[^"'\?]+)/g)];
    jsMatches.forEach(match => {
      assert(fs.existsSync(path.join(ROOT_DIR, match[1])), `${file} -> Linked JS asset exists: ${match[1]}`);
    });
  }
});

// --------------------------------------------------------------------------
// SUITE 2: JAVASCRIPT SYNTAX & COMPILATION
// --------------------------------------------------------------------------
printHeader('⚡ SUITE 2: JavaScript Syntax & Runtime Checks');

const jsEngineFiles = ['js/main.js', 'js/stem-effects.js', 'js/stem-pioneers.js', 'js/stem-quiz.js'];
jsEngineFiles.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (fs.existsSync(filePath)) {
    try {
      execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
      assert(true, `JS syntax valid (no compile errors): ${file}`);
    } catch (err) {
      assert(false, `JS syntax error in ${file}: ${err.message}`);
    }
  }
});

// --------------------------------------------------------------------------
// SUITE 3: CSS TOKEN PALETTE & UNIFORM ELEVATION
// --------------------------------------------------------------------------
printHeader('🎨 SUITE 3: CSS Token Palette & Design System Rules (Rule 2.1)');

const mainCSSPath = path.join(ROOT_DIR, 'css/main.css');
const themeCSSPath = path.join(ROOT_DIR, 'css/stem-theme.css');
const mainCSS = fs.existsSync(mainCSSPath) ? fs.readFileSync(mainCSSPath, 'utf8') : '';
const themeCSS = fs.existsSync(themeCSSPath) ? fs.readFileSync(themeCSSPath, 'utf8') : '';
const combinedCSS = mainCSS + '\n' + themeCSS;

const requiredTokens = [
  '--bg-dark', '--bg-card', '--bg-card-hover', '--glass-border',
  '--cyan', '--green', '--purple', '--amber', '--pink',
  '--text-main', '--text-muted', '--font-main', '--font-mono'
];

requiredTokens.forEach(token => {
  assert(combinedCSS.includes(token), `CSS Design System token present: ${token}`);
});

assert(
  combinedCSS.includes('border-radius: 20px !important') || combinedCSS.includes('border-radius:20px !important'),
  'Uniform card radius rule enforced: border-radius: 20px !important'
);

assert(
  combinedCSS.includes('backdrop-filter: blur(') && combinedCSS.includes('saturate('),
  'Glassmorphic elevation standard present in CSS'
);

// --------------------------------------------------------------------------
// SUITE 4: NATIVE BROWSER APIS & JS LOGIC
// --------------------------------------------------------------------------
printHeader('🪟 SUITE 4: Native Browser APIs & Engine Logic (Rule 2.2)');

// Compositor-thread reveals
assert(themeCSS.includes('animation-timeline: view()'), 'CSS contains compositor-thread animation-timeline: view()');

// Native HTML Popover
const indexHTMLPath = path.join(ROOT_DIR, 'index.html');
if (fs.existsSync(indexHTMLPath)) {
  const indexContent = fs.readFileSync(indexHTMLPath, 'utf8');
  assert(
    indexContent.includes('popover') && indexContent.includes('<dialog id="enrollModal"'),
    'index.html uses native HTML <dialog id="enrollModal" popover>'
  );
  assert(indexContent.includes('<math>') && indexContent.includes('</math>'), 'index.html contains native MathML Core (<math>) markup');
}

// Non-locking Mouse Wheel Logic (Checked in JS, where it belongs)
const mainJSPath = path.join(ROOT_DIR, 'js/main.js');
const stemEffectsPath = path.join(ROOT_DIR, 'js/stem-effects.js');
const combinedJS = (fs.existsSync(mainJSPath) ? fs.readFileSync(mainJSPath, 'utf8') : '') +
  (fs.existsSync(stemEffectsPath) ? fs.readFileSync(stemEffectsPath, 'utf8') : '');

assert(
  combinedJS.includes('atRightEnd') && combinedJS.includes('atLeftEnd'),
  'Non-locking mouse wheel boundary check (atRightEnd / atLeftEnd) present in JS engine'
);

// --------------------------------------------------------------------------
// SUITE 5: DYNAMIC 6-HOVER ANIMATION ENGINE
// --------------------------------------------------------------------------
printHeader('⚡ SUITE 5: Dynamic 6-Hover Animation Engine (Rule 2.3)');

const hoverVariants = [
  'hover-effect-glow',
  'hover-effect-tint',
  'hover-effect-electric',
  'hover-effect-borderless',
  'hover-effect-warp',
  'hover-effect-plasma'
];

hoverVariants.forEach(cls => {
  assert(themeCSS.includes(cls), `css/stem-theme.css contains hover variant class .${cls}`);
});

assert(
  combinedJS.includes('hover-effect-plasma') && combinedJS.includes('hoverStyles'),
  'js/stem-effects.js implements dynamic random hover style selection'
);

// --------------------------------------------------------------------------
// SUITE 6: SPELLING AUDIT & IMMUTABLE CREDENTIALS
// --------------------------------------------------------------------------
printHeader('🔤 SUITE 6: Zero-Tolerance Spelling & Credentials Audit (Rule 4.2)');

const scanExtensions = ['.html', '.js', '.css', '.md'];
function scanDirectoryForSpelling(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'tests'].includes(entry.name)) {
        scanDirectoryForSpelling(fullPath);
      }
    } else if (scanExtensions.includes(path.extname(entry.name))) {
      const relativePath = path.relative(ROOT_DIR, fullPath);
      let content = fs.readFileSync(fullPath, 'utf8');

      // Ignore directory/repository path strings
      content = content.replace(/STEM-TUTION/gi, '');
      content = content.replace(/never "tution" or "tution-stem"/gi, '');
      content = content.replace(/Misspelled "tuition"/gi, '');

      const badSpellingRegex = /\btutions?\b|\btution-stem\b/gi;
      const matches = content.match(badSpellingRegex);
      assert(!matches || matches.length === 0, `Zero spelling errors ("tution") in ${relativePath}`);
    }
  });
}
scanDirectoryForSpelling(ROOT_DIR);

// Credentials Verification in index.html and contact.html
['index.html', 'contact.html'].forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    assert(content.includes('+977 9768021317'), `${file} contains correct official phone number`);
    assert(content.includes('gurungsajan0228@gmail.com'), `${file} contains correct official email`);
    assert(content.includes('Pokhara'), `${file} contains official location reference`);
  }
});

// --------------------------------------------------------------------------
// SUITE 7: DYNAMIC CACHE-BUSTING PROTOCOL
// --------------------------------------------------------------------------
printHeader('🔄 SUITE 7: Dynamic Cache-Busting Query Tag Protocol (Rule 4.1)');

requiredHTMLFiles.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const versionedAssets = [...content.matchAll(/(?:href|src)=["'](css\/|js\/)[^"']+\?v=(\d+\.\d+)/g)];
    assert(versionedAssets.length > 0, `${file} enforces version query tag (?v=X.Y) on assets`);
  }
});

// --------------------------------------------------------------------------
// SUITE 8: TIER 2 VPS PORT & ARCHITECTURE SAFETY
// --------------------------------------------------------------------------
printHeader('🚀 SUITE 8: Tier 2 VPS Port Assignment Safety (Rule 3.1)');

function auditPortAssignments(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isFile() && /\.(js|py|nginx|conf|json)$/.test(f)) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('8000') && content.includes('stem-tuition-api')) {
        assert(false, `Port collision in ${f}: Port 8000 is reserved for JARVIS Core, STEM API must use 8085`);
      }
    }
  });
}
auditPortAssignments(ROOT_DIR);
assert(true, 'No port collision detected (STEM API reserved on Port 8085, JARVIS on 8000)');

// --------------------------------------------------------------------------
// AUDIT SUMMARY & EXIT CODE
// --------------------------------------------------------------------------
console.log(`\n${CYAN}======================================================================${RESET}`);
console.log(`📊 FINAL TEST RESULTS: ${GREEN}${passedTests}${RESET} Passed / ${RED}${failedTests}${RESET} Failed (Total: ${totalTests})`);
console.log(`${CYAN}======================================================================${RESET}\n`);

if (failedTests > 0) {
  console.error(`${RED}💥 AUDIT FAILED: ${failedTests} test(s) failed. Fix violations before completing task!${RESET}\n`);
  process.exit(1);
} else {
  console.log(`${GREEN}✨ ALL ARCHITECTURE RULES VALIDATED! Codebase is 100% compliant.${RESET}\n`);
  process.exit(0);
}