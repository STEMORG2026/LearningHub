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

## Migration Progress

```
PHASE 1: tracer infrastructure     ██████████ 100%
PHASE 2: audio-spans               ██████████ 100%
PHASE 3: event-bus-spans           ██████████ 100%
PHASE 4: quiz-spans                ████░░░░░░ 40% (2/5 instrumented)
PHASE 5: hover-spans               ░░░░░░░░░░ 0%
PHASE 6: physics-spans             ░░░░░░░░░░ 0%

Total: 20 functions to instrument  ░░░░░░░░░░ 10% (tracer + 2 quiz spans active)
```
