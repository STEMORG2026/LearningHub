# State Registry

**Version:** 3.0.0

**Purpose:** Every stateful module, reactive value, store, and data cache.

---

## Global State (Legacy — Frozen)

| State | Type | Location | Notes |
|-------|------|----------|-------|
| `stemTimeScale` | number | `legacy/js/stem-effects.js:14` | Physics speed multiplier |
| `audioCtx` | AudioContext\|null | `legacy/js/stem-effects.js:15` | Web Audio context |
| `isAudioMuted` | boolean | `legacy/js/stem-effects.js:17` | Sound toggle (default: true) |
| `isBlackholeDisabled` | boolean | `legacy/js/stem-effects.js:18` | Blackhole toggle (default: true) |
| `isBackgroundDisabled` | boolean | `legacy/js/stem-effects.js:19` | Background animation toggle (default: true) |
| `isHalfIntensity` | boolean | `legacy/js/stem-effects.js:20` | Intensity toggle (default: true) |
| `STEM_QUIZ_DATA` | object | `legacy/js/stem-quiz.js:6` | Quiz question database |
| `STEM_PIONEERS` | object[] | `legacy/js/stem-pioneers.js:6` | Pioneers database |

## Phase 2: Audio Synth (Extracted)

<!-- AUTO:state-phase-2 -->
| State | Type | Location | Notes |
|-------|------|----------|-------|
| AudioEngine | class | `packages/audio-synth/src/engine.ts:8` | Web Audio context + mute/volume |
| Legacy globals bridge | via ACL | `packages/acl/src/audio-adapter.ts` | Reads `isAudioMuted`, `isHalfIntensity` |
<!-- END AUTO:state-phase-2 -->

## Phase 3: Event Bus + ACL (Active)

<!-- AUTO:state-phase-3 -->
| State | Type | Location | Notes |
|-------|------|----------|-------|
| Subscriber registry | SubscriptionEntry[] | `packages/core/src/event-bus.ts:12` | Internal to EventBus |
| Default EventBus instance | EventBus | `packages/core/src/event-bus.ts:82` | Module-level singleton |
| Legacy quiz state bridge | via ACL | `packages/acl/src/quiz-adapter.ts` | Reads `window.stemQuizApp`, `STEM_QUIZ_DATA` |
| Canvas simulation state bridge | via ACL | `packages/acl/src/canvas-adapter.ts` | Reads `#stemBackgroundCanvas` DOM state |
<!-- END AUTO:state-phase-3 -->

## Phase 4: Quiz Engine (Extracted)

<!-- AUTO:state-phase-4 -->
| State | Type | Location | Notes |
|-------|------|----------|-------|
| Quiz state | QuizState | `packages/quiz-engine/src/internal/quiz-engine.ts:5` | Current question index, score, answers |
<!-- END AUTO:state-phase-4 -->

## Phase 5: Hover Engine (Extracted)

<!-- AUTO:state-phase-5 -->
| State | Type | Location | Notes |
|-------|------|----------|-------|
| State (hover-engine) | — | `packages/hover-engine/src/hover-state.ts`, `packages/hover-engine/src/index.ts`, `packages/hover-engine/src/types.ts` | Extracted (Phase 5) |
<!-- END AUTO:state-phase-5 -->

## Phase 6: Physics Core (Not yet extracted)

| State | Type | Location | Notes |
|-------|------|----------|-------|
| (pending extraction) | — | `packages/simulation-core/src/gravity.ts` | Will hold body positions/velocities |
