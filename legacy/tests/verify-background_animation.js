#!/usr/bin/env node

/**
 * ==========================================================================
 * STEM TUITION PLATFORM — BACKGROUND ANIMATION COMPLIANCE TEST
 * ==========================================================================
 * Verifies dynamic background canvas engine, CSS keyframes, GPU scroll reveals,
 * and accessibility controls across the platform.
 * 
 * Usage: node tests/verify-background-animations.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// ANSI Color Formatting
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

console.log(`\n${YELLOW}🌀 AUDITING STEM PLATFORM BACKGROUND ANIMATIONS & ENGINES...${RESET}`);

// --------------------------------------------------------------------------
// SUITE 1: BACKGROUND CANVAS ENGINE & RENDER LOOP
// --------------------------------------------------------------------------
printHeader('🎨 SUITE 1: Canvas Background Engine (js/stem-effects.js)');

const effectsPath = path.join(ROOT_DIR, 'js/stem-effects.js');

if (fs.existsSync(effectsPath)) {
    const effectsJS = fs.readFileSync(effectsPath, 'utf8');

    // Check 1: Canvas context initialization
    assert(
        effectsJS.includes('.getContext(') || effectsJS.includes('getContext("2d")') || effectsJS.includes("getContext('2d')"),
        'js/stem-effects.js acquires 2D rendering context for background canvas'
    );

    // Check 2: Active render loop (requestAnimationFrame)
    assert(
        effectsJS.includes('requestAnimationFrame'),
        'Background engine uses requestAnimationFrame loop for hardware-accelerated rendering'
    );

    // Check 3: Window Resize handling for responsive background
    assert(
        effectsJS.includes('resize') && (effectsJS.includes('innerWidth') || effectsJS.includes('getBoundingClientRect')),
        'Background canvas includes window resize event handlers to maintain full-screen scaling'
    );

    // Check 4: Non-blocking performance optimization
    assert(
        effectsJS.includes('passive: true') || effectsJS.includes('{ passive: true }') || effectsJS.includes('pointer-events: none'),
        'Canvas background overlay uses non-blocking event handlers or pointer-events: none'
    );
} else {
    assert(false, 'js/stem-effects.js is missing from disk!');
}

// --------------------------------------------------------------------------
// SUITE 2: CANVAS MOUNT POINT IN HTML PAGES
// --------------------------------------------------------------------------
printHeader('🖼️ SUITE 2: HTML Background Canvas Mount Points');

const htmlPages = ['index.html', 'classes.html', 'videos.html', 'contact.html', 'stem-tuition.html'];

htmlPages.forEach(file => {
    const filePath = path.join(ROOT_DIR, file);
    if (fs.existsSync(filePath)) {
        const html = fs.readFileSync(filePath, 'utf8');

        // Checks if canvas exists OR if stem-effects.js script tag is injected to render background
        const hasCanvasTag = html.includes('<canvas');
        const hasEffectsScript = html.includes('js/stem-effects.js');

        assert(
            hasCanvasTag || hasEffectsScript,
            `${file} incorporates background animation engine (via <canvas> or stem-effects.js)`
        );
    }
});

// --------------------------------------------------------------------------
// SUITE 3: CSS KEYFRAMES & GPU COMPOSITOR ANIMATIONS
// --------------------------------------------------------------------------
printHeader('⚡ SUITE 3: CSS Background & Scroll Keyframes (css/stem-theme.css)');

const themePath = path.join(ROOT_DIR, 'css/stem-theme.css');
const mainCssPath = path.join(ROOT_DIR, 'css/main.css');

const themeCSS = fs.existsSync(themePath) ? fs.readFileSync(themePath, 'utf8') : '';
const mainCSS = fs.existsSync(mainCssPath) ? fs.readFileSync(mainCssPath, 'utf8') : '';
const combinedCSS = mainCSS + '\n' + themeCSS;

// Check 1: Keyframe definitions
assert(
    combinedCSS.includes('@keyframes'),
    'CSS files contain @keyframes definitions for animated background transitions'
);

// Check 2: Scroll-driven reveals
assert(
    combinedCSS.includes('animation-timeline: view()') || combinedCSS.includes('animation-timeline:view()'),
    'CSS uses native GPU compositor scroll reveal (animation-timeline: view())'
);

// Check 3: Conic dynamic background flares (Plasma / Electric)
assert(
    combinedCSS.includes('conic-gradient') || combinedCSS.includes('radial-gradient'),
    'CSS utilizes dynamic gradients (conic/radial) for plasma background overlays'
);

// --------------------------------------------------------------------------
// SUITE 4: ACCESSIBILITY & REDUCED MOTION SAFETY
// --------------------------------------------------------------------------
printHeader('♿ SUITE 4: Accessibility & prefers-reduced-motion Controls');

assert(
    combinedCSS.includes('prefers-reduced-motion'),
    'CSS includes @media (prefers-reduced-motion) overrides to disable intense background animations when requested'
);

if (fs.existsSync(effectsPath)) {
    const effectsJS = fs.readFileSync(effectsPath, 'utf8');
    assert(
        effectsJS.includes('prefers-reduced-motion') || effectsJS.includes('matchMedia'),
        'js/stem-effects.js respects system reduced-motion settings before running animation loop'
    );
}

// --------------------------------------------------------------------------
// SUMMARY & EXIT CODE
// --------------------------------------------------------------------------
console.log(`\n${CYAN}======================================================================${RESET}`);
console.log(`📊 ANIMATION AUDIT RESULTS: ${GREEN}${passedTests}${RESET} Passed / ${RED}${failedTests}${RESET} Failed (Total: ${totalTests})`);
console.log(`${CYAN}======================================================================${RESET}\n`);

if (failedTests > 0) {
    console.error(`${RED}💥 BACKGROUND ANIMATION TEST FAILED: ${failedTests} check(s) did not pass.${RESET}\n`);
    process.exit(1);
} else {
    console.log(`${GREEN}✨ ALL BACKGROUND ANIMATION CHECKS PASSED SUCCESSFULLY!${RESET}\n`);
    process.exit(0);
}