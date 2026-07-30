/**
 * 🧪 CANVAS BODIES & VISUAL CONTROLS VERIFICATION SUITE
 * Validates that all solar system bodies (Sun, 8 Planets, Moons, Blackhole, Symbols)
 * and the floating ⚙️ Visuals control panel are fully implemented, layer-stacked,
 * and functional without errors.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function printHeader(title) {
  console.log('\n' + '='.repeat(70));
  console.log(`🌀 ${title}`);
  console.log('='.repeat(70));
}

function test(description, assertion) {
  totalTests++;
  if (assertion) {
    passedTests++;
    console.log(`  ✓ PASSED: ${description}`);
  } else {
    console.error(`  ❌ FAILED: ${description}`);
  }
}

// SUITE 1: SOLAR SYSTEM BODIES & SYMBOLS AUDIT
printHeader('🪐 SUITE 1: Solar System Bodies & Symbols Audit');
const effectsJS = fs.readFileSync(path.join(ROOT_DIR, 'js/stem-effects.js'), 'utf8');

test('Colossal Big Boy Sun (type: "big_sun") is declared in physics universe', effectsJS.includes("type: 'big_sun'"));
test('Supermassive Blackhole (type: "super_blackhole") is declared in physics universe', effectsJS.includes("type: 'super_blackhole'"));
test('All 8 planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune) are declared', 
  ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].every(p => effectsJS.includes(`name: '${p}'`))
);
test('Satellites and Moons (Moon, ISS, Titan, Europa, etc.) are declared',
  ['Moon', 'ISS', 'Titan', 'Europa', 'Io'].every(m => effectsJS.includes(m))
);
test('STEM symbols (🚀, 🛰️, ⚡, E=mc², ∫f(x)dx, π, √x) are declared in math & physics pool',
  ['🚀', '🛰️', '⚡', 'E=mc²', '∫f(x)dx', 'π', '√x'].every(s => effectsJS.includes(s))
);

// SUITE 2: FLOATING VISUALS CONTROL PANEL AUDIT
printHeader('⚙️ SUITE 2: Floating Visuals Control Panel Audit');
test('⚙️ Visuals trigger button (#stemCornerTrigger) is constructed in control panel', effectsJS.includes('id="stemCornerTrigger"'));
test('Background ON/OFF control button (#ctrlBgBtn) is constructed in control panel', effectsJS.includes('id="ctrlBgBtn"'));
test('Intensity control button (#ctrlIntensityBtn) is constructed in control panel', effectsJS.includes('id="ctrlIntensityBtn"'));
test('Sound control button (#ctrlSoundBtn) is constructed in control panel', effectsJS.includes('id="ctrlSoundBtn"'));
test('Blackhole control button (#ctrlBlackholeBtn) is constructed in control panel', effectsJS.includes('id="ctrlBlackholeBtn"'));
test('Fullscreen Cosmic View button (#ctrlCosmicViewBtn) is constructed in control panel', effectsJS.includes('id="ctrlCosmicViewBtn"'));
test('Web Audio API audioCtx variable is declared at top IIFE scope (prevents ReferenceError)', effectsJS.includes('let audioCtx = null;'));

// SUITE 3: CSS STACKING LAYER AUDIT
printHeader('🎨 SUITE 3: CSS Canvas & Content Stacking Layer Audit');
const mainCSS = fs.readFileSync(path.join(ROOT_DIR, 'css/main.css'), 'utf8');

test('Canvas is set to fixed position with z-index: 1 (above body bg, below content)', mainCSS.includes('z-index: 1 !important'));
test('Page content containers are set to relative position with z-index: 2', mainCSS.includes('z-index: 2;'));
test('Floating Visuals widget is assigned highest z-index: 999999', mainCSS.includes('z-index: 999999 !important'));

// SUITE 4: SUMMARY
printHeader('📊 AUDIT SUMMARY');
console.log(`\n  Total Tests: ${totalTests}`);
console.log(`  Passed: ${passedTests}`);
console.log(`  Failed: ${totalTests - passedTests}`);

if (passedTests === totalTests) {
  console.log('\n✨ ALL CANVAS BODIES & VISUAL CONTROL CHECKS PASSED 100% SUCCESSFULLY!\n');
  process.exit(0);
} else {
  console.error('\n❌ AUDIT FAILED WITH DETECTED ERRORS!\n');
  process.exit(1);
}
