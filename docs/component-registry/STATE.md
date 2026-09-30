# State Registry

**Version:** 3.0.0

**Purpose:** Every stateful module, reactive value, store, and data cache.

---

## Global State (Removed — legacy deleted)

| State | Type | Location | Notes |
|-------|------|----------|-------|
| `stemTimeScale` | number | removed | Physics speed multiplier |
| `audioCtx` | AudioContext\|null | removed | Web Audio context |
| `isAudioMuted` | boolean | removed | Sound toggle |
| `isBlackholeDisabled` | boolean | removed | Blackhole toggle |
| `isBackgroundDisabled` | boolean | removed | Background animation toggle |
| `isHalfIntensity` | boolean | removed | Intensity toggle |
| `STEM_QUIZ_DATA` | object | removed | Quiz question database |
| `STEM_PIONEERS` | object[] | removed | Pioneers database |

## Phase 2: Audio Synth (Extracted)

<!-- AUTO:state-phase-2 -->
| State | Type | Location | Notes |
|-------|------|----------|-------|
| AudioEngine | class | `packages/audio-synth/src/engine.ts:8` | Web Audio context + mute/volume |
<!-- END AUTO:state-phase-2 -->

## Phase 3: Event Bus + ACL (Active)

<!-- AUTO:state-phase-3 -->
| State | Type | Location | Notes |
|-------|------|----------|-------|
| Subscriber registry | SubscriptionEntry[] | `packages/core/src/event-bus.ts:12` | Internal to EventBus |
| Default EventBus instance | EventBus | `packages/core/src/event-bus.ts:82` | Module-level singleton |
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

## Phase 8: Content & Lessons (Active)

| State | Type | Location | Notes |
|-------|------|----------|-------|
| LessonContent cache | Map | `packages/content-provider/src/content-provider.ts` | In-memory content cache |
| Pipeline state | Object | `packages/content-engine/src/pipeline.ts` | Pipeline execution state |
| Lesson render state | WC state | `packages/lesson-renderer/src/stem-lesson.ts` | Lesson component state |
| Simulation state | WC state | `packages/interactive-simulations/src/stem-circuit-sim.ts` | Circuit sim state |
| Simulation state | WC state | `packages/interactive-simulations/src/stem-mechanics-sim.ts` | Mechanics sim state |
| Simulation state | WC state | `packages/interactive-simulations/src/stem-optics-sim.ts` | Optics sim state |

<!-- AUTO:state-phase-6 -->
| State | Type | Location | Notes |
|-------|------|----------|-------|
| Physics state | PhysicsInput | `packages/simulation-core/src/types.ts` | Bodies, dimensions, mouse, flags |
| Physics result | PhysicsResult | `packages/simulation-core/src/types.ts` | Updated bodies, collisions, devour events |
| CelestialBody | interface | `packages/simulation-core/src/types.ts` | Position, velocity, mass, charge, type |
| Planet configs | PlanetConfig[] | `packages/simulation-core/src/config.ts` | 8 planets with 17 moon definitions |
| Create-body factories | functions | `packages/simulation-core/src/create-body.ts` | createSun, createPlanet, createBlackhole, createSmallItem |
| Physics engine | functions | `packages/simulation-core/src/physics.ts` | stepPosition, applyBoundary, interactPair, blackhole, updatePhysics |
<!-- END AUTO:state-phase-6 -->
