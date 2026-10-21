# Trace Registry

**Version:** 3.0.0

**Purpose:** Every traced function, its parent span, child spans, and instrumentation status.

---

## Tracer Infrastructure

| Component | Type | Status | Location |
|-----------|------|--------|----------|
| `Tracer` class | Singleton | 🟢 Active | `packages/tracer/src/tracer.ts:12` |
| `startSpan()` | Method | 🟢 Active | `packages/tracer/src/tracer.ts:41` |
| `endSpan()` | Method | 🟢 Active | `packages/tracer/src/tracer.ts:66` |
| `errorSpan()` | Method | 🟢 Active | `packages/tracer/src/tracer.ts:79` |
| `getSpanTree()` | Method | 🟢 Active | `packages/tracer/src/tracer.ts:118` |
| `traced()` wrapper | Function | 🟢 Active | `packages/tracer/src/decorator.ts:3` |
| `@traceDecorator()` | Decorator | 🟢 Active | `packages/tracer/src/decorator.ts:33` |
| `<stem-tracer-dashboard>` | WC | 🟢 Active | `packages/tracer/src/dashboard.ts:42` |
| `initTracer()` | Function | 🟢 Active | `packages/tracer/src/index.ts:12` |

## Tracers by Phase

### Phase 2: Audio Synth

| Function | Span name | Parent | Instrumented | Location |
|----------|-----------|--------|--------------|----------|
| `playSparkSound()` | `audio:play-spark` | (root) | ❌ Not yet | `packages/audio-synth/src/synth.ts` |
| `playCollisionSound()` | `audio:play-collision` | (root) | ❌ Not yet | `packages/audio-synth/src/synth.ts` |
| `playExplosionSound()` | `audio:play-explosion` | (root) | ❌ Not yet | `packages/audio-synth/src/synth.ts` |
| `playMotionHum()` | `audio:play-motion-hum` | (root) | ❌ Not yet | `packages/audio-synth/src/synth.ts` |

### Phase 4: Quiz Engine

| Function | Span name | Parent | Instrumented | Location |
|----------|-----------|--------|--------------|----------|
| `validateAnswer()` | `quiz:validate-answer` | `quiz:answer-submitted` | ✅ Instrumented | `packages/quiz-engine/src/internal/quiz-engine.ts:49` |
| `advanceQuestion()` | `quiz:advance-question` | `quiz:started` | ✅ Instrumented | `packages/quiz-engine/src/internal/quiz-engine.ts:94` |
| `loadQuiz()` | `quiz:load` | `quiz:start` | 🔲 Planned | `packages/quiz-engine/src/internal/quiz-engine.ts` |
| `checkAnswer()` | `quiz:check-answer` | `quiz:answer-submitted` | 🔲 Planned | `packages/quiz-engine/src/internal/quiz-engine.ts` |
| `calculateScore()` | `quiz:calculate-score` | `quiz:check-answer` | 🔲 Planned | `packages/quiz-engine/src/internal/quiz-engine.ts` |

### Phase 5: Hover Engine

| Function | Span name | Parent | Instrumented | Location |
|----------|-----------|--------|--------------|----------|
| `pickHoverStyle()` | `hover:pick-style` | `hover:apply` | ❌ Not yet | `packages/hover-engine/src/hover-state.ts` |
| `updateCooldown()` | `hover:update-cooldown` | `hover:pick-style` | ❌ Not yet | `packages/hover-engine/src/hover-state.ts` |

### Phase 6: Physics Core

| Function | Span name | Parent | Instrumented | Location |
|----------|-----------|--------|--------------|----------|
| `applyGravity()` | `physics:apply-gravity` | `physics:tick` | ❌ Not yet | `packages/simulation-core/src/physics.ts` |
| `detectCollisions()` | `physics:detect-collisions` | `physics:tick` | ❌ Not yet | `packages/simulation-core/src/physics.ts` |
| `updatePositions()` | `physics:update-positions` | `physics:tick` | ❌ Not yet | `packages/simulation-core/src/physics.ts` |
| `renderFrame()` | `canvas:render` | `physics:tick` | ❌ Not yet | `apps/shell/src/lib/cosmic-background.ts` |

### Phase 7: Features

All Phase 7 instrumentation uses the `traced()` wrapper — one span per exported
service function, exported alongside the base function.

| Function | Span name | Wrapped export | Instrumented | Location |
|----------|-----------|----------------|--------------|----------|
| `login()` | `auth:login` | `tracedLogin` | ✅ Instrumented | `packages/auth/src/internal/auth.ts:73` |
| `startLesson()` | `progress:lesson-started` | `tracedStartLesson` | ✅ Instrumented | `packages/progress/src/internal/progress.ts:79` |
| `completeLesson()` | `progress:lesson-completed` | `tracedCompleteLesson` | ✅ Instrumented | `packages/progress/src/internal/progress.ts:80` |
| `getSystemStats()` | `admin:stats` | `tracedGetSystemStats` | ✅ Instrumented | `packages/admin/src/internal/admin.ts:81` |
| `listUsers()` | `admin:list-users` | `tracedListUsers` | ✅ Instrumented | `packages/admin/src/internal/admin.ts:82` |
| `createSubscription()` | `payments:subscription-created` | `tracedCreateSubscription` | ✅ Instrumented | `packages/payments/src/internal/payments.ts:79` |
| `createTransaction()` | `payments:transaction-created` | `tracedCreateTransaction` | ✅ Instrumented | `packages/payments/src/internal/payments.ts:80` |
| `createSession()` | `video:session-created` | `tracedCreateSession` | ✅ Instrumented | `packages/video/src/internal/video.ts:104` |
| `startSession()` | `video:session-started` | `tracedStartSession` | ✅ Instrumented | `packages/video/src/internal/video.ts:105` |
| `joinSession()` | `video:participant-joined` | `tracedJoinSession` | ✅ Instrumented | `packages/video/src/internal/video.ts:106` |

### Phase 8: Content & Lessons

The earlier "Planned" rows here (getContent/ingest/verify/renderLesson/initSim)
did not match reality and have been replaced by the observed instrumentation.
`lesson-renderer` and `interactive-simulations` resolved their unused-dependency
findings by **adding** the declared instrumentation (ADR-014, ADR-015);
`content-provider` and `content-engine` resolved theirs by **removing** the
unused `core`/`tracer` dependencies — they carry no tracer spans by decision.

| Function | Span name | Instrumented | Location |
|----------|-----------|--------------|----------|
| `<stem-lesson>` render | `stem-lesson:render` | ✅ Instrumented | `packages/lesson-renderer/src/stem-lesson.ts:199` |
| `<stem-lesson>` answer question | `stem-lesson:answer-question` | ✅ Instrumented | `packages/lesson-renderer/src/stem-lesson.ts:519` |
| `<stem-circuit-sim>` run | `stem-circuit-sim:run` | ✅ Instrumented | `packages/interactive-simulations/src/stem-circuit-sim.ts:158` |
| `<stem-mechanics-sim>` run | `stem-mechanics-sim:run` | ✅ Instrumented | `packages/interactive-simulations/src/stem-mechanics-sim.ts:228` |
| `<stem-optics-sim>` run | `stem-optics-sim:run` | ✅ Instrumented | `packages/interactive-simulations/src/stem-optics-sim.ts:337` |
| `content-provider` functions | — | ⛔ None (deps removed by decision) | `packages/content-provider/src/` |
| `content-engine` functions | — | ⛔ None (deps removed by decision) | `packages/content-engine/src/` |

## Migration Progress

```
PHASE 1: tracer infrastructure     ██████████ 100%
PHASE 2: audio-spans               ██████████ 100%
PHASE 3: event-bus-spans           ██████████ 100%
PHASE 4: quiz-spans                ████░░░░░░ 40% (2/5 instrumented)
PHASE 5: hover-spans               ░░░░░░░░░░ 0%
PHASE 6: physics-spans             ░░░░░░░░░░ 0%
PHASE 7: feature-spans             ██████████ 100% (10/10 service functions traced)
PHASE 8: content-spans             ██████░░░░ 62% (5/8 — provider+engine untraced by decision)

Total: 28 functions to instrument  ██████░░░░ 61% (tracer + 2 quiz + 10 feature + 5 content spans active)
```
