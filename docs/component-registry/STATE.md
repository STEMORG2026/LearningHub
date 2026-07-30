# State Registry

**Version:** 2.0.0

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

## Phase 2: Audio Synth (Not yet extracted)

| State | Type | Location | Notes |
|-------|------|----------|-------|
| (pending extraction) | — | `packages/audio-synth/src/synth.ts` | Will hold AudioContext + volume |

## Phase 4: Quiz Engine (Not yet extracted)

| State | Type | Location | Notes |
|-------|------|----------|-------|
| (pending extraction) | — | `packages/quiz-engine/src/internal/quiz-engine.ts` | Will hold current quiz state |

## Phase 5: Hover Engine (Not yet extracted)

| State | Type | Location | Notes |
|-------|------|----------|-------|
| (pending extraction) | — | `packages/hover-engine/src/hover-state.ts` | Will hold cooldown state machine |

## Phase 6: Physics Core (Not yet extracted)

| State | Type | Location | Notes |
|-------|------|----------|-------|
| (pending extraction) | — | `packages/simulation-core/src/gravity.ts` | Will hold body positions/velocities |

## Core (Active)

| State | Type | Location | Notes |
|-------|------|----------|-------|
| Subscriber registry | Map | `packages/core/src/event-bus.ts` | Internal to Event Bus |
