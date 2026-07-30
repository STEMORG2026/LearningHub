# Testing Registry

**Version:** 3.0.0

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
| `packages/core/` | `tests/event-bus.test.ts` | Unit | ≥95% lines | 🟢 Written (12 tests) |
| `packages/core/` | `tests/foundation.test.ts` | Unit | Integration | 🟢 Written (91 tests) |
| `packages/tracer/` | `tests/tracer.test.ts` | Unit | ≥95% lines | 🟢 Written (24 tests) |
| `packages/audio-synth/` | `tests/synth.test.ts` | Unit | ≥95% lines | 🟢 Written (14 tests) |
| `packages/acl/` | `tests/acl.test.ts` | Unit | ≥95% lines | 🟢 Written (14 tests) |
| `packages/quiz-engine/` | `tests/placeholder.test.ts` | Placeholder | — | ⚪ Placeholder |
| `packages/hover-engine/` | `tests/placeholder.test.ts` | Placeholder | — | ⚪ Placeholder |
| `packages/simulation-core/` | `tests/placeholder.test.ts` | Placeholder | — | ⚪ Placeholder |

## E2E Tests (Future)

| Test | File | Covers | Status |
|------|------|--------|--------|
| Quiz flow | `packages/quiz-engine/tests/e2e/quiz-flow.spec.ts` | Full quiz: load → answer → score | Future |
| Audio playback | `packages/audio-synth/tests/e2e/audio.spec.ts` | Sound plays on quiz completion | Future |
| Simulation | `packages/simulation-core/tests/e2e/simulation.spec.ts` | Physics simulation renders correctly | Future |
