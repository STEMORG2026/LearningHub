# Rendering Registry

**Version:** 3.0.0

**Purpose:** Every Web Component, HTML template, and CSS file that renders to the screen.

---

## Core Infrastructure

| Component | Package | Definition | Template | Styles | Notes |
|-----------|---------|-----------|----------|--------|-------|
| Event Bus | `packages/core/` | `src/event-bus.ts` | — | — | No UI — pure logic |
| `<stem-tracer-dashboard>` | `packages/tracer/` | `src/dashboard.ts` | — | — | Floating panel when `?trace=true` |

## Phase 2: Audio Synth (EXTRACTED)

<!-- AUTO:rendering-phase-2 -->
| Component | Package | Definition | Template | Styles | Status |
|-----------|---------|-----------|----------|--------|--------|
| Synth functions | `packages/audio-synth/` | `src/synth.ts` | — | — | Extracted (Phase 2) |
| AudioEngine | `packages/audio-synth/` | `src/engine.ts` | — | — | Extracted (Phase 2) |
<!-- END AUTO:rendering-phase-2 -->

## Phase 4: Quiz Engine (EXTRACTED)

<!-- AUTO:rendering-phase-4 -->
| Component | Package | Definition | Template | Styles | Status |
|-----------|---------|-----------|----------|--------|--------|
| `<stem-quiz>` | `packages/quiz-engine/` | `src/internal/web-component.ts` | `src/internal/template.ts` | `src/internal/styles.css` | Extracted (Phase 4) |
<!-- END AUTO:rendering-phase-4 -->

## Phase 5: Hover Engine (EXTRACTED)

<!-- AUTO:rendering-phase-5 -->
| Component | Package | Definition | Template | Styles | Status |
|-----------|---------|-----------|----------|--------|--------|
| hover-engine | `packages/hover-engine/` | `src/hover-state.ts, src/types.ts` | — | — | Extracted (Phase 5) |
<!-- END AUTO:rendering-phase-5 -->

## Phase 6: Physics Core (EXTRACTED)

<!-- AUTO:rendering-phase-6 -->
| Component | Package | Definition | Template | Styles | Status |
|-----------|---------|-----------|----------|--------|--------|
| Types | `packages/simulation-core/` | `src/types.ts` | — | — | Extracted (Phase 6) |
| Config | `packages/simulation-core/` | `src/config.ts` | — | — | Extracted (Phase 6) |
| Factory functions | `packages/simulation-core/` | `src/create-body.ts` | — | — | Extracted (Phase 6) |
| Physics engine | `packages/simulation-core/` | `src/physics.ts` | — | — | Extracted (Phase 6) |
| Cosmic background renderer | `apps/shell/` | `src/lib/cosmic-background.ts` | — | `src/styles/base.css` | App shell (Phase 7) |
| Canvas contract | `packages/acl/` | `src/canvas-adapter.ts` | — | — | Extracted (Phase 3) |
| `<did-you-know>` widget | `apps/shell/` | `src/components/did-you-know.ts` | — | `src/styles/widgets.css` | App shell (Phase 7) |
<!-- END AUTO:rendering-phase-6 -->

## App Shell (Phase 7)

| Component | Package | Definition | Template | Styles | Notes |
|-----------|---------|-----------|----------|--------|-------|
| Icons | `apps/shell/` | `src/components/icons.ts` | — | `src/styles/base.css` | Inline SVG custom elements |
| Site header | `apps/shell/` | `src/components/site-header.ts` | — | `src/styles/layout.css` | Multi-page nav |
| Site footer | `apps/shell/` | `src/components/site-footer.ts` | — | `src/styles/layout.css` | Contact links |
| Enroll modal | `apps/shell/` | `src/components/enroll-modal.ts` | — | `src/styles/widgets.css` | Form modal |
| FAQ list | `apps/shell/` | `src/components/faq-list.ts` | — | `src/styles/widgets.css` | Accordion |
| Home page | `apps/shell/` | `index.html` | `src/index.ts` | `src/styles/main.css` | Hero + sections |
| `<stem-lesson>` | `packages/lesson-renderer/` | `src/stem-lesson.ts` | — | — | Lesson renderer |
| `<stem-circuit-sim>` | `packages/interactive-simulations/` | `src/stem-circuit-sim.ts` | — | — | Interactive circuit sim |
| `<stem-mechanics-sim>` | `packages/interactive-simulations/` | `src/stem-mechanics-sim.ts` | — | — | Interactive mechanics sim |
