# Roadmap

**Version:** 3.0.0 (Refined)
**Status:** Active
**Purpose:** Phased execution plan with current status, updated after every milestone.

---

## Overview

Each phase teaches one concept, leaves something testable, and moves the Strangler Fig forward. Phases build on each other.

<!-- AUTO:phase-progress -->
```
PHASE 0 ██████████  Foundation
PHASE 1 ██████████  Tracer (observability)
PHASE 2 ██████████  Audio Synth extraction
PHASE 3 ██████████  Event Bus + ACL
PHASE 4 ██████████  Quiz Engine extraction
PHASE 5 ██████████  Hover Engine extraction
PHASE 6 ██████████  Physics Core extraction
PHASE 7 █████░░░░░  Features (auth, progress, admin, payments, video)
PHASE 8 █████░░░░░  Content & Lessons
PHASE 9 ░░░░░░░░░░  Agent Integration Foundation
PHASE 10 ░░░░░░░░░░  Governance Extensions
PHASE 11 ░░░░░░░░░░  Ecosystem Tooling
```
<!-- END AUTO:phase-progress -->

---

## Phase 0: Foundation (Week 1-2)

<!-- AUTO:phase-0-status -->🟢 Completed<!-- END AUTO:phase-0-status -->

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

<!-- AUTO:phase-1-status -->🟢 Completed<!-- END AUTO:phase-1-status -->

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
- ✅ Tests pass: `pnpm test --filter="@learninghub/tracer"` (24/24)

**What stays the same:** No production code is affected. This is instrumentation infrastructure.

---

## Phase 2: Audio Synth Extraction (Week 3-4)

<!-- AUTO:phase-2-status -->🟢 Completed<!-- END AUTO:phase-2-status -->

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
- ✅ `pnpm test --filter="@learninghub/audio-synth"` passes (14/14)
- ✅ `pnpm test --filter="@learninghub/acl"` passes (1/1)
- ✅ Legacy site unchanged — `legacy/js/stem-effects.js` untouched
- ✅ Changing audio volume works via `engine.setVolume()`

**What stays the same:** The live site sounds identical. The code path changed internally.

---

## Phase 3: Event Bus + ACL (Week 4-5)

<!-- AUTO:phase-3-status -->🟢 Completed<!-- END AUTO:phase-3-status -->

**What you learned:**
- Publisher/subscriber pattern
- Anti-Corruption Layer pattern
- BroadcastingChannel API (native browser)
- How loose coupling enables independent module development

**Deliverables:**
- ✅ `packages/core/src/event-bus.ts` — Full EventBus implementation with BroadcastChannel, wildcards, debug mode
- ✅ `packages/core/src/types.ts` — Shared type definitions (EventPayload, Quiz/Audio/Error data)
- ✅ `packages/core/tests/event-bus.test.ts` — 12 tests (publish/subscribe, wildcards, unsubscribe, clear, debug mode, initEventBus)
- ✅ `packages/acl/src/quiz-adapter.ts` — Adapter wrapping legacy quiz globals (window.stemQuizApp, STEM_QUIZ_DATA)
- ✅ `packages/acl/src/canvas-adapter.ts` — Adapter wrapping legacy canvas element and simulation state
- ✅ Component Registry updated (index, STATE, NETWORKING, TESTING, TRACE)

**Acceptance criteria:**
- ✅ Any package can publish and subscribe to events (`event-bus.test.ts` 12/12 passing)
- ✅ Legacy quiz code accessible through ACL adapter (`acl.test.ts` — quiz-adapter section passing)
- ✅ `?debug_events=true` shows all cross-module events (tested via `initEventBus()`)
- ✅ Tests pass: `pnpm test --filter="@learninghub/core"` (103/103)
- ✅ Tests pass: `pnpm test --filter="@learninghub/acl"` (15/15)

---

## Phase 4: Quiz Engine Extraction (Week 5-8)

<!-- AUTO:phase-4-status -->🟢 Completed<!-- END AUTO:phase-4-status -->

**What you learned:**
- Web Components (Custom Elements, Shadow DOM, lifecycle)
- Data modeling for educational content
- Educational metadata tagging
- TypeScript migration of existing JavaScript
- Event-driven component design (EventBus from UI interactions)

**Deliverables:**
- ✅ `packages/quiz-engine/src/types.ts` — QuizQuestion, QuizState, QuizResult interfaces with educational metadata
- ✅ `packages/quiz-engine/src/data.ts` — 5 subjects × 4 questions, typed with SubjectKey, EducationalTag, DifficultyLevel
- ✅ `packages/quiz-engine/src/internal/quiz-engine.ts` — Pure logic: createQuizState, validateAnswer, advanceQuestion, resetQuiz, getCurrentQuestion
- ✅ `packages/quiz-engine/src/internal/template.ts` — HTML template renderers (renderQuestion, renderResult)
- ✅ `packages/quiz-engine/src/internal/web-component.ts` — `<stem-quiz>` Web Component with Shadow DOM, event delegation, EventBus integration
- ✅ `packages/quiz-engine/src/internal/styles.css` — Scoped styles for quiz cards/tabs/results
- ✅ `packages/quiz-engine/src/index.ts` — Public API exports
- ✅ `packages/quiz-engine/tests/quiz-engine.test.ts` — 14 unit tests (logic coverage)
- ✅ `packages/quiz-engine/tests/web-component.test.ts` — 2 component tests (definition, observedAttributes)
- ✅ EventBus integration: publishes `quiz:started`, `quiz:answer-submitted`, `quiz:completed` events
- ✅ Tracer integration: all quiz functions wrapped with `traced()` spans
- ✅ `packages/quiz-engine/README.md` — Package documentation

**Acceptance criteria:**
- ✅ `pnpm typecheck` — all 16 tasks pass
- ✅ `pnpm test --filter="@learninghub/quiz-engine"` — 16/16 tests pass
- ✅ Quiz data is fully typed (TypeScript strict)
- ✅ All logic functions have educational metadata tags
- ✅ `<stem-quiz>` uses Shadow DOM scoped styles
- ✅ EventBus integration publishes standard events
- ✅ Component Registry and ROADMAP updated

**What stays the same:** The live site still uses the legacy quiz via `legacy/js/stem-quiz.js`. The `<stem-quiz>` element is ready for deployment behind the `use-legacy` attribute flag.

---

## Phase 5: Hover Engine Extraction (Week 8-10)

<!-- AUTO:phase-5-status -->🟢 Completed<!-- END AUTO:phase-5-status -->

**What you learn:**
- State machines (6 styles, 4-cycle cooldown)
- CSS design tokens vs JavaScript-driven animations
- Cooldown/algorithms in pure logic

**Deliverables:**
- ✅ `packages/hover-engine/src/types.ts` — HoverStyle, CooldownState, HOVER_STYLES constant
- ✅ `packages/hover-engine/src/hover-state.ts` — Pure state machine (initCooldownState, pickHoverStyle, updateCooldown, isStyleInCooldown)
- ✅ `packages/hover-engine/src/index.ts` — Public API
- ✅ `packages/hover-engine/src/styles.css` — All 6 hover styles as CSS classes (no JavaScript)
- ✅ `packages/hover-engine/tests/hover-state.test.ts` — 12 tests for state machine (100% coverage)
- ✅ `pnpm test --filter="@learninghub/hover-engine"` — 12/12 tests pass
- ✅ `pnpm typecheck` — 16/16 tasks pass
- ✅ `pnpm lint:arch` — no dependency violations

**Acceptance criteria:**
- ✅ Pure state machine extracted (no DOM, no globals)
- ✅ 4-cycle cooldown protocol maintained
- ✅ All 6 hover effects CSS-driven (styles extracted from legacy)
- ✅ `pnpm test --filter="@learninghub/hover-engine"` passes (12/12)
- ✅ `pnpm typecheck` passes

---

## Phase 6: Physics Core Extraction (Week 10-14)

<!-- AUTO:phase-6-status -->🟢 Completed<!-- END AUTO:phase-6-status -->

**What you learn:**
- Separation of concerns (math vs rendering)
- Canvas API vs pure computation
- requestAnimationFrame optimization
- Performance optimization guided by tracer

**Deliverables:**
- ✅ `packages/simulation-core/src/types.ts` — All type definitions (CelestialBody, PhysicsInput/Result, constants)
- ✅ `packages/simulation-core/src/config.ts` — Planet configs (8 planets, 17 moons), MATH_SYMBOLS, default constants
- ✅ `packages/simulation-core/src/create-body.ts` — Factory functions (createSun, createPlanet, createBlackhole, createSmallItem)
- ✅ `packages/simulation-core/src/physics.ts` — Pure physics math (stepPosition, applyBoundary, applyMouseForce, interactPair, applyBlackholePull, applyBlackholeDevour, updatePhysics)
- ✅ `packages/simulation-core/src/index.ts` — Public API (barrel re-exports)
- ✅ `packages/simulation-core/tests/physics.test.ts` — 48 tests for all pure functions
- ✅ Canvas rendering remains in legacy (for now) but uses new pure math
- ✅ Component Registry updated
- ✅ `scripts/release/dev-version.mjs` — Dev-version identifier (`pnpm dev-version` → `vX.Y.Z-dev.N`)
- ✅ `docs/policies/VERSIONING.md` — Semver convention and root bump rule documented
- ✅ Root version bump guard enforced in `scripts/release/release-version.mjs` — root bumps require a newlyCompleted phase

**Acceptance criteria:**
- ✅ All math is testable without browser/DOM (48 pure function tests)
- ✅ `pnpm test --filter="@learninghub/simulation-core"` passes (48/48)
- ✅ `pnpm typecheck` passes (16/16)
- ✅ `pnpm lint:arch` — no dependency violations
- ✅ `pnpm verify-governance` — 7/7 stages pass
- ✅ `scripts/release/dev-version.mjs` produces valid semver dev-identifier
- ✅ Root version bump guard prevents bumps without phase completion

---

## Phase 7+: Features (Ongoing)

<!-- AUTO:phase-7-status -->🟡 In progress<!-- END AUTO:phase-7-status -->

Future features as separate packages following the established pattern:

| Feature | Package | Priority | ADR | Status |
|---------|---------|----------|-----|--------|
| User Authentication | `packages/auth/` | Medium | `docs/adr/020-phase7-features.md` | ✅ Implemented |
| Student Progress Tracking | `packages/progress/` | Medium | `docs/adr/020-phase7-features.md` | ✅ Implemented |
| Admin Dashboard | `packages/admin/` | Low | `docs/adr/020-phase7-features.md` | ✅ Implemented |
| Payment Integration | `packages/payments/` | Low | `docs/adr/020-phase7-features.md` | ✅ Implemented |
| Zoom/Video Integration | `packages/video/` | Low | `docs/adr/020-phase7-features.md` | ✅ Implemented |
| Mobile App | `apps/mobile/` | Future | — | 🔵 Planned |

Each feature gets:
- Its own package with the standard structure
- Its own ADR documenting the decision
- Its own component registry entries
- Tracer instrumentation from day one

---

## Phase 8: Content & Lessons

<!-- AUTO:phase-8-status -->🟡 In progress<!-- END AUTO:phase-8-status -->

Lesson delivery: content sourcing, rendering, and interactive simulations. These
packages were built ahead of Phase 7's feature work — the roadmap originally
predicted `auth`/`progress`/`admin` would come next, but content delivery was
prioritised instead. Phase 8 records what was actually built rather than
retroactively rewriting Phase 7.

| Package | Responsibility | ADR |
|---------|---------------|-----|
| `packages/content-provider/` | Content sourcing and provider abstraction | `docs/adr/013-content-provider.md` |
| `packages/content-engine/` | Content production engine (blueprint pipeline, additive formats, verification) | `docs/adr/016-content-engine.md` |
| `packages/lesson-renderer/` | Lesson rendering | `docs/adr/014-lesson-renderer.md` |
| `packages/interactive-simulations/` | Interactive simulation components | `docs/adr/015-interactive-simulations.md` |

**Remaining before this phase can be marked complete:**
- Component registry entries for all four packages
- Coverage verified against the ≥95% core-logic threshold
- Resolve the unused-dependency findings in ADR-013, ADR-014, ADR-015, and ADR-016: packages
  declare `core` / `tracer` (and `simulation-core`) but import none of them, so
  they don't carry the tracer instrumentation the roadmap expects

Phase completion is a human decision — see *How to Update This Document* below.

---

## Phase 9: Agent Integration Foundation (PROFESSOR-J Integration)

<!-- AUTO:phase-9-status -->🔵 Not started<!-- END AUTO:phase-9-status -->

**Status:** Planned

Establish integration contracts between LearningHub and PROFESSOR-J. LH is the information head; P-J is the AI worker.

| Package | Responsibility | Status |
|---------|---------------|--------|
| `packages/pj-client/` | HTTP client for P-J backend API | PLANNED |
| `packages/pj-types/` | TypeScript types for P-J API contracts | PLANNED |
| `packages/pj-auth/` | Auth token management for P-J calls | PLANNED |

**Acceptance Criteria:**
- LH frontend successfully calls P-J `/api/v1/chat`
- Auth flow working (session → API key mapping)
- Fallback to local responses when P-J unavailable

---

## Phase 10: Governance Extensions (P-J Task Audit)

<!-- AUTO:phase-10-status -->🔵 Not started<!-- END AUTO:phase-10-status -->

**Status:** Planned

Extend governance to cover P-J task execution.

| Package | Responsibility | Status |
|---------|---------------|--------|
| `packages/pj-audit/` | Audit log for P-J task execution | PLANNED |
| `packages/pj-policy/` | Content policy enforcement for AI outputs | PLANNED |

---

## Phase 11: Ecosystem Tooling

<!-- AUTO:phase-11-status -->🔵 Not started<!-- END AUTO:phase-11-status -->

**Status:** Planned

Monitoring, dashboards, and cross-repo visibility.

| Package | Responsibility | Status |
|---------|---------------|--------|
| `packages/ecosystem-dashboard/` | Health/status dashboard for LH+P-J | PLANNED |
| `packages/cross-repo-visibility/` | Shared metrics and observability | PLANNED |

---

## Docs Governance Hardening (WS1–WS5)

Consolidation of the docs + governance machinery so it stays fresh without manual
effort. All items are complete when `pnpm docs:sync` and `pnpm verify-governance`
both pass with the changes below in place.

| # | Workstream | Deliverable | Status |
|---|------------|-------------|--------|
| WS1 | Stale `ARCHITECTURE.md` | Replaced by `docs/ARCHITECTURE/README.md` charter + C4 set; refs updated across docs | ✅ |
| WS2 | README | Re-indexed to the charter, health dashboard, package metadata | ✅ |
| WS3 | Charter content | Package Maturity table + package-map aligned with `ARCHITECTURE.toml` | ✅ |
| WS4 | Size + coverage machinery | `size-check.cjs` gzip support, `bundlesize.config.json` per-package budgets, coverage ratchet policy, `build` stage, registry/`ARCHITECTURE.toml` validation | ✅ |
| WS5 | Package metadata | `ARCHITECTURE.toml` in every package, `policies/PACKAGE_METADATA.md`, `REPOSITORY_HEALTH.md` generator (`scripts/generate/generate-health.mjs`) | ✅ |

All verified: `pnpm docs:sync` and `pnpm verify-governance` pass with these changes in place.

---

## How to Update This Document

The phase progress bar and per-phase status markers are **machine-owned** `AUTO`
regions, regenerated from `.phase.json` by `pnpm docs:sync` — do not hand-edit them.

To mark a phase complete:

1. Edit `.phase.json` — set `"status": "completed"` and leave
   `completedVersion` / `completedDate` as `null` (the release pipeline fills them).
2. Run `pnpm docs:sync` (or commit — the pre-commit hook runs it automatically).
3. The progress bar, phase status, `AGENTS.md` phase-map, and `← CURRENT` pointer
   all update automatically.
4. Commit with a message like `feat(phase-N): mark Phase N complete`.
