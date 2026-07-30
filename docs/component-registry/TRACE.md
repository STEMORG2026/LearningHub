# Trace Registry

**Version:** 2.0.0

**Purpose:** Every traced function, its parent span, child spans, and instrumentation status.

---

## Tracers by Phase

### Phase 2: Audio Synth

| Function | Span name | Parent | Instrumented | Location |
|----------|-----------|--------|--------------|----------|
| `playSparkSound()` | `audio:play-spark` | (root) | ❌ Not yet | `packages/audio-synth/src/synth.ts` |
| `playCollisionSound()` | `audio:play-collision` | (root) | ❌ Not yet | `packages/audio-synth/src/synth.ts` |
| `playExplosionSound()` | `audio:play-explosion` | (root) | ❌ Not yet | `packages/audio-synth/src/synth.ts` |

### Phase 4: Quiz Engine

| Function | Span name | Parent | Instrumented | Location |
|----------|-----------|--------|--------------|----------|
| `loadQuiz()` | `quiz:load` | `quiz:start` | ❌ Not yet | `packages/quiz-engine/src/internal/quiz-engine.ts` |
| `validateAnswer()` | `quiz:validate` | `quiz:check-answer` | ❌ Not yet | `packages/quiz-engine/src/internal/quiz-engine.ts` |
| `checkAnswer()` | `quiz:check-answer` | `quiz:answer-submitted` | ❌ Not yet | `packages/quiz-engine/src/internal/quiz-engine.ts` |
| `calculateScore()` | `quiz:calculate-score` | `quiz:check-answer` | ❌ Not yet | `packages/quiz-engine/src/internal/quiz-engine.ts` |
| `analyzeMisconception()` | `quiz:misconception` | `quiz:check-answer` | ❌ Not yet | `packages/quiz-engine/src/internal/quiz-engine.ts` |

### Phase 5: Hover Engine

| Function | Span name | Parent | Instrumented | Location |
|----------|-----------|--------|--------------|----------|
| `pickHoverStyle()` | `hover:pick-style` | `hover:apply` | ❌ Not yet | `packages/hover-engine/src/hover-state.ts` |
| `updateCooldown()` | `hover:update-cooldown` | `hover:pick-style` | ❌ Not yet | `packages/hover-engine/src/hover-state.ts` |

### Phase 6: Physics Core

| Function | Span name | Parent | Instrumented | Location |
|----------|-----------|--------|--------------|----------|
| `applyGravity()` | `physics:apply-gravity` | `physics:tick` | ❌ Not yet | `packages/simulation-core/src/gravity.ts` |
| `detectCollisions()` | `physics:detect-collisions` | `physics:tick` | ❌ Not yet | `packages/simulation-core/src/collision.ts` |
| `updatePositions()` | `physics:update-positions` | `physics:tick` | ❌ Not yet | `packages/simulation-core/src/gravity.ts` |
| `renderFrame()` | `canvas:render` | `physics:tick` | ❌ Not yet | `legacy/js/stem-effects.js` |

## Migration Progress

```
PHASE 1: tracer infrastructure     ░░░░░░░░░░ 0%
PHASE 2: audio-spans               ░░░░░░░░░░ 0%
PHASE 3: event-bus-spans           ░░░░░░░░░░ 0%
PHASE 4: quiz-spans                ░░░░░░░░░░ 0%
PHASE 5: hover-spans               ░░░░░░░░░░ 0%
PHASE 6: physics-spans             ░░░░░░░░░░ 0%

Total: 14 functions to instrument  ░░░░░░░░░░ 0%
```
