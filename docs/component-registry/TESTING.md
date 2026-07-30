# Testing Registry

**Version:** 2.0.0

**Purpose:** Every test file and what it covers.

---

## Legacy Tests (Frozen)

| Test file | Type | Coverage | Status |
|-----------|------|----------|--------|
| `legacy/tests/verify-stem-platform.js` | Static analysis | File existence, casing, string matching | Frozen |
| `legacy/tests/verify-canvas-bodies-and-controls.js` | Static analysis | Canvas body declarations, control IDs | Frozen |
| `legacy/tests/verify-background_animation.js` | Static analysis | Animation engine compliance | Frozen |

## New Module Tests

| Package | Test file | Type | Coverage target | Status |
|---------|-----------|------|----------------|--------|
| `packages/core/` | `src/event-bus.test.ts` | Unit | ≥95% lines | Not yet written |
| `packages/tracer/` | `src/tracer.test.ts` | Unit | ≥95% lines | Not yet written |
| `packages/audio-synth/` | `src/internal/synth.test.ts` | Unit | ≥95% lines | Not yet written |
| `packages/quiz-engine/` | `src/internal/quiz-engine.test.ts` | Unit | ≥95% lines | Not yet written |
| `packages/quiz-engine/` | `tests/web-component.test.ts` | Component | ≥90% lines | Not yet written |
| `packages/hover-engine/` | `src/hover-state.test.ts` | Unit | ≥95% lines | Not yet written |
| `packages/simulation-core/` | `src/gravity.test.ts` | Unit | ≥95% lines | Not yet written |
| `packages/simulation-core/` | `src/bodies.test.ts` | Unit | ≥95% lines | Not yet written |
| `packages/acl/` | `src/quiz-adapter.test.ts` | Unit | ≥95% lines | Not yet written |
| `packages/acl/` | `src/canvas-adapter.test.ts` | Unit | ≥95% lines | Not yet written |

## E2E Tests (Future)

| Test | File | Covers | Status |
|------|------|--------|--------|
| Quiz flow | `packages/quiz-engine/tests/e2e/quiz-flow.spec.ts` | Full quiz: load → answer → score | Future |
| Audio playback | `packages/audio-synth/tests/e2e/audio.spec.ts` | Sound plays on quiz completion | Future |
| Simulation | `packages/simulation-core/tests/e2e/simulation.spec.ts` | Physics simulation renders correctly | Future |
