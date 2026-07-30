# Rendering Registry

**Version:** 3.0.0

**Purpose:** Every Web Component, HTML template, and CSS file that renders to the screen.

---

## Core Infrastructure

| Component | Package | Definition | Template | Styles | Notes |
|-----------|---------|-----------|----------|--------|-------|
| Event Bus | `packages/core/` | `src/event-bus.ts` | — | — | No UI — pure logic |
| Tracer Dashboard | `packages/tracer/` | `src/dashboard.ts` | — | — | Floating panel when `?trace=true` |

## Phase 2: Audio Synth (EXTRACTED)

<!-- AUTO:rendering-phase-2 -->
| Component | Package | Definition | Template | Styles | Status |
|-----------|---------|-----------|----------|--------|--------|
| Synth functions | `packages/audio-synth/` | `src/synth.ts` | — | — | Extracted (Phase 2) |
| AudioEngine | `packages/audio-synth/` | `src/engine.ts` | — | — | Extracted (Phase 2) |
| Legacy audio | `legacy/` | `js/stem-effects.js:28` | — | — | Active (frozen) |
<!-- END AUTO:rendering-phase-2 -->

## Phase 4: Quiz Engine (EXTRACTED)

<!-- AUTO:rendering-phase-4 -->
| Component | Package | Definition | Template | Styles | Status |
|-----------|---------|-----------|----------|--------|--------|
| `<stem-quiz>` | `packages/quiz-engine/` | `src/internal/web-component.ts` | `src/internal/template.ts` | `src/internal/styles.css` | Extracted (Phase 4) |
| Legacy quiz | `legacy/` | `js/stem-quiz.js:1` | — | — | Active (frozen) |
<!-- END AUTO:rendering-phase-4 -->

## Phase 5: Hover Engine (EXTRACTED)

<!-- AUTO:rendering-phase-5 -->
| Component | Package | Definition | Template | Styles | Status |
|-----------|---------|-----------|----------|--------|--------|
| hover-engine | `packages/hover-engine/` | `src/hover-state.ts, src/types.ts` | — | — | Extracted (Phase 5) |
<!-- END AUTO:rendering-phase-5 -->

## Phase 6: Physics Core (NOT YET EXTRACTED)

| Component | Package | Definition | Template | Styles | Status |
|-----------|---------|-----------|----------|--------|--------|
| Physics math | `packages/simulation-core/` | `src/gravity.ts` | — | — | Not yet extracted |
| Canvas renderer | `legacy/` | `js/stem-effects.js:200` | — | `css/main.css:150` | Active (frozen) |

## Legacy (Frozen — Full List)

| File | Type | Lines | Purpose |
|------|------|-------|---------|
| `legacy/index.html` | HTML | 634 | Main landing page |
| `legacy/classes.html` | HTML | ~400 | Course catalog |
| `legacy/videos.html` | HTML | ~400 | Video lessons |
| `legacy/contact.html` | HTML | ~350 | Contact form |
| `legacy/stem-tuition.html` | HTML | ~250 | About page |
| `legacy/css/main.css` | CSS | 816 | Design system |
| `legacy/css/stem-theme.css` | CSS | 664 | Card/hover/quiz styles |
| `legacy/js/main.js` | JS | 92 | DOM utilities |
| `legacy/js/stem-effects.js` | JS | 1311 | Audio + hover + canvas + controls |
| `legacy/js/stem-quiz.js` | JS | 312 | Quiz data + renderer |
| `legacy/js/stem-pioneers.js` | JS | 328 | Pioneers data + wall |
