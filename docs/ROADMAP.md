# Roadmap

**Version:** 2.0.0 (Refined)
**Status:** Active
**Purpose:** Phased execution plan with current status, updated after every milestone.

---

## Overview

Each phase teaches one concept, leaves something testable, and moves the Strangler Fig forward. Phases build on each other.

```
PHASE 0 ██████████  Foundation (monorepo + docs + freeze legacy)
PHASE 1 ██████████  Observability (tracer)
PHASE 2 ██████████  Audio Synth extraction
PHASE 3 ░░░░░░░░░░  Event Bus + ACL
PHASE 4 ░░░░░░░░░░  Quiz Engine extraction (Web Component)
PHASE 5 ░░░░░░░░░░  Hover Engine extraction
PHASE 6 ░░░░░░░░░░  Physics Core extraction
PHASE 7+ ░░░░░░░░░  Features (auth, progress, admin)
```

---

## Phase 0: Foundation (Week 1-2)

**Status:** 🟢 Completed

**What you learn:**
- What a monorepo is and why pnpm
- How TypeScript strict mode prevents bugs
- Why documentation is code (ADRs, component registry)
- How to freeze legacy and structure new code

**Deliverables:**
- `pnpm-workspace.yaml` with all packages
- `tsconfig.json` (strict mode)
- `turbo.json` for build caching
- `.changeset/config.json` for version automation
- All documentation written (ARCHITECTURE.md, RULES.md, COMPONENT_STANDARDS.md, etc.)
- All ADRs documented (001-009)
- `packages/core/` scaffolded with EventBus class (empty implementation)
- `packages/tracer/` scaffolded with Tracer class (empty implementation)
- Component Registry files created (index + RENDERING, STATE, etc.)
- Existing `legacy/` created with all v1.0.0 files moved in
- Shell `index.html` with redirect to `legacy/index.html`
- `pnpm verify-governance` command functional

**Acceptance criteria:**
- `pnpm install --frozen-lockfile` works
- `pnpm verify-governance` passes all checks
- Legacy site still works via `pnpm dev:legacy`
- Every document is written and linked from README

**What stays the same:** The live site is unchanged. All changes are structural/documentation.

---

## Phase 1: Observability (Week 2-3)

**Status:** 🟢 Completed

**What you learned:**
- Decorators and metaprogramming in TypeScript
- Span-based tracing (how Langfuse/Datadog work internally)
- Live dashboard rendering with Web Components
- Performance measurement and waterfall analysis

**Deliverables:**
- ✅ `packages/tracer/src/tracer.ts` — Tracer class with `startSpan()`, `endSpan()`, `getCurrentTraceId()`, span tree, event listeners
- ✅ `packages/tracer/src/dashboard.ts` — `<stem-tracer-dashboard>` Web Component with span tree, summary stats, drag support, collapsible nodes
- ✅ `packages/tracer/src/decorator.ts` — `traced()` wrapper function + `@traceDecorator()` method decorator
- ✅ `packages/tracer/src/types.ts` — Span, TracerConfig, TracerEvent, TracerListener types
- ✅ `packages/tracer/src/index.ts` — Public API with `initTracer()` for auto-detecting `?trace=true` / `?debug_events=true`
- ✅ 24 tests passing (start/end span, nesting, error, event listeners, disabled mode, traced wrapper, decorator)

**Acceptance criteria:**
- ✅ `?trace=true` shows floating dashboard (via `initTracer()`)
- ✅ `?debug_events=true` enriches console with trace ID + timestamp
- ✅ Tracer accurately measures function durations using `performance.now()`
- ✅ Tests pass: `pnpm test --filter="@stem-tuition/tracer"` (24/24)

**What stays the same:** No production code is affected. This is instrumentation infrastructure.

---

## Phase 2: Audio Synth Extraction (Week 3-4)

**Status:** 🟢 Completed

**What you learned:**
- Web Audio API (oscillators, gain nodes, envelopes)
- Module extraction (cutting code from a monolith without breaking things)
- Pure function testing (audio logic without DOM)
- First Strangler Fig success

**Deliverables:**
- ✅ `packages/audio-synth/src/synth.ts` — 4 pure synthesis functions extracted from `stem-effects.js`
- ✅ `packages/audio-synth/src/engine.ts` — `AudioEngine` class with mute/volume state, context management
- ✅ `packages/audio-synth/src/types.ts` — `SoundResult`, `SoundName` types
- ✅ `packages/audio-synth/src/index.ts` — Public API
- ✅ `packages/audio-synth/tests/synth.test.ts` — 14 tests (all sound params, frequency curves, volume scaling, engine behavior)
- ✅ `packages/acl/src/audio-adapter.ts` — Legacy adapter bridging globals (`isAudioMuted`, `isHalfIntensity`) to AudioEngine
- ✅ Component Registry updated

**Acceptance criteria:**
- ✅ All 4 original sounds play identically (spark, collision, explosion, motion-hum)
- ✅ `pnpm test --filter="@stem-tuition/audio-synth"` passes (14/14)
- ✅ `pnpm test --filter="@stem-tuition/acl"` passes (1/1)
- ✅ Legacy site unchanged — `legacy/js/stem-effects.js` untouched
- ✅ Changing audio volume works via `engine.setVolume()`

**What stays the same:** The live site sounds identical. The code path changed internally.

---

## Phase 3: Event Bus + ACL (Week 4-5)

**Status:** 🔵 Not started

**What you learn:**
- Publisher/subscriber pattern
- Anti-Corruption Layer pattern
- BroadcastingChannel API (native browser)
- How loose coupling enables independent module development

**Deliverables:**
- `packages/core/src/event-bus.ts` — Full EventBus implementation with BroadcastChannel
- `packages/core/src/types.ts` — Shared type definitions
- `packages/core/src/event-bus.test.ts` — Tests (publish/subscribe, wildcards, error handling)
- `packages/acl/src/quiz-adapter.ts` — Adapter wrapping legacy quiz global functions
- `packages/acl/src/canvas-adapter.ts` — Adapter wrapping legacy canvas global functions
- All existing modules migrated to use Event Bus for cross-module communication
- Component Registry updated

**Acceptance criteria:**
- Any package can publish and subscribe to events
- Legacy quiz code accessible through ACL adapter
- `?debug_events=true` shows all cross-module events
- Tests pass: `pnpm test --filter="@stem-tuition/core"`
- Tests pass: `pnpm test --filter="@stem-tuition/acl"`

---

## Phase 4: Quiz Engine Extraction (Week 5-8)

**Status:** 🔵 Not started

**What you learn:**
- Web Components (Custom Elements, Shadow DOM, lifecycle)
- Data modeling for educational content
- Educational metadata tagging
- TypeScript migration of existing JavaScript

**Deliverables:**
- `packages/quiz-engine/src/internal/quiz-engine.ts` — Pure logic (validate, score, track misconceptions)
- `packages/quiz-engine/src/internal/web-component.ts` — `<stem-quiz>` Web Component
- `packages/quiz-engine/src/internal/template.ts` — HTML template
- `packages/quiz-engine/src/internal/styles.css` — Scoped styles
- `packages/quiz-engine/src/internal/quiz-engine.test.ts` — Unit tests for all logic
- `packages/quiz-engine/tests/web-component.test.ts` — Component tests
- Educational metadata for each quiz question
- `<stem-quiz>` is feature-flagged — can toggle between legacy and new quiz

**Acceptance criteria:**
- Quiz works identically to legacy version
- `<stem-quiz>` Web Component can be used standalone on any HTML page
- Quiz data is typed (TypeScript strict)
- All functions have educational metadata tags
- `?trace=true` shows quiz answer flow with spans
- Tests pass (≥90% coverage)

---

## Phase 5: Hover Engine Extraction (Week 8-10)

**Status:** 🔵 Not started

**What you learn:**
- State machines (6 styles, 4-cycle cooldown)
- CSS design tokens vs JavaScript-driven animations
- Cooldown/algorithms in pure logic

**Deliverables:**
- `packages/hover-engine/src/hover-state.ts` — Pure state machine (style selection, cooldown tracking)
- `packages/hover-engine/src/index.ts` — Public API
- `packages/hover-engine/src/styles.css` — All 6 hover styles as CSS classes (no JavaScript)
- `packages/hover-engine/src/hover-state.test.ts` — Tests for state machine
- Legacy code updated to call new hover engine via ACL
- Design token system extended with hover animation tokens

**Acceptance criteria:**
- All 6 hover effects still work identically
- 4-cycle cooldown protocol maintained
- Hover styles are CSS-driven, not JavaScript-driven
- `pnpm test --filter="@stem-tuition/hover-engine"` passes

---

## Phase 6: Physics Core Extraction (Week 10-14)

**Status:** 🔵 Not started

**What you learn:**
- Separation of concerns (math vs rendering)
- Canvas API vs pure computation
- requestAnimationFrame optimization
- Performance optimization guided by tracer

**Deliverables:**
- `packages/simulation-core/src/gravity.ts` — Pure physics math (gravitational force, body position)
- `packages/simulation-core/src/bodies.ts` — Body definitions (sun, planets, moons)
- `packages/simulation-core/src/collision.ts` — Collision detection
- `packages/simulation-core/src/index.ts` — Public API
- `packages/simulation-core/src/gravity.test.ts` — Tests (gravitational calculations)
- `packages/simulation-core/src/bodies.test.ts` — Tests (body definitions)
- Canvas rendering remains in legacy (for now) but uses new pure math
- Component Registry updated

**Acceptance criteria:**
- Physics simulation produces identical results to legacy
- All math is testable without browser/DOM
- Performance improved (guided by tracer — identify slowest functions)
- `pnpm test --filter="@stem-tuition/simulation-core"` passes

---

## Phase 7+: Features (Ongoing)

**Status:** 🔵 Not started

Future features as separate packages following the established pattern:

| Feature | Package | Priority |
|---------|---------|----------|
| User Authentication | `packages/auth/` | Medium |
| Student Progress Tracking | `packages/progress/` | Medium |
| Admin Dashboard | `packages/admin/` | Low |
| Payment Integration | `packages/payments/` | Low |
| Zoom/Video Integration | `packages/video/` | Low |
| Mobile App | `apps/mobile/` | Future |

Each feature gets:
- Its own package with the standard structure
- Its own ADR documenting the decision
- Its own component registry entries
- Tracer instrumentation from day one

---

## How to Update This Document

After each phase:
1. Change the phase status from 🔵 Not started to 🟢 Completed
2. Update the progress bar at the top
3. Update the current phase row
4. Commit with message: `docs(roadmap): mark Phase N complete`
