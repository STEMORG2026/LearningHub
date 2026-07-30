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

<!-- AUTO:testing-table -->
| Package | Test file | Type | Coverage target | Status |
|---------|-----------|------|----------------|--------|
| `packages/core/` | `tests/*.test.ts` | Unit | — | 🟢 Written (59 tests) |
| `packages/tracer/` | `tests/*.test.ts` | Unit | — | 🟢 Written (24 tests) |
| `packages/audio-synth/` | `tests/*.test.ts` | Unit | — | 🟢 Written (14 tests) |
| `packages/core/` | `tests/*.test.ts` | Unit | — | 🟢 Written (59 tests) |
| `packages/acl/` | `tests/*.test.ts` | Unit | — | 🟢 Written (14 tests) |
| `packages/quiz-engine/` | `tests/*.test.ts` | Unit | — | 🟢 Written (16 tests) |
| `packages/hover-engine/` | `tests/*.test.ts` | Unit | — | 🟢 Written (12 tests) |
| `packages/simulation-core/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
<!-- END AUTO:testing-table -->

## E2E Tests (Future)

| Test | File | Covers | Status |
|------|------|--------|--------|
| Quiz flow | `packages/quiz-engine/tests/e2e/quiz-flow.spec.ts` | Full quiz: load → answer → score | Future |
| Audio playback | `packages/audio-synth/tests/e2e/audio.spec.ts` | Sound plays on quiz completion | Future |
| Simulation | `packages/simulation-core/tests/e2e/simulation.spec.ts` | Physics simulation renders correctly | Future |
