# Testing Registry

**Version:** 3.0.0

**Purpose:** Every test file and what it covers.

---

## New Module Tests

<!-- AUTO:testing-table -->
| Package | Test file | Type | Coverage target | Status |
|---------|-----------|------|----------------|--------|
| `packages/core/` | `tests/*.test.ts` | Unit | — | 🟢 Written (56 tests) |
| `packages/tracer/` | `tests/*.test.ts` | Unit | — | 🟢 Written (24 tests) |
| `packages/audio-synth/` | `tests/*.test.ts` | Unit | — | 🟢 Written (14 tests) |
| `packages/core/` | `tests/*.test.ts` | Unit | — | 🟢 Written (56 tests) |
| `packages/acl/` | `tests/*.test.ts` | Unit | — | 🟢 Written (19 tests) |
| `packages/quiz-engine/` | `tests/*.test.ts` | Unit | — | 🟢 Written (16 tests) |
| `packages/hover-engine/` | `tests/*.test.ts` | Unit | — | 🟢 Written (12 tests) |
| `packages/simulation-core/` | `tests/*.test.ts` | Unit | — | 🟢 Written (65 tests) |
| `packages/content-provider/` | `tests/*.test.ts` | Unit | — | 🟢 Written (38 tests) |
| `packages/interactive-simulations/` | `tests/*.test.ts` | Unit | — | 🟢 Written (19 tests) |
| `packages/lesson-renderer/` | `tests/*.test.ts` | Unit | — | 🟢 Written (47 tests) |
<!-- END AUTO:testing-table -->

## E2E Tests (Future)

| Test | File | Covers | Status |
|------|------|--------|--------|
| Quiz flow | `packages/quiz-engine/tests/e2e/quiz-flow.spec.ts` | Full quiz: load → answer → score | Future |
| Audio playback | `packages/audio-synth/tests/e2e/audio.spec.ts` | Sound plays on quiz completion | Future |
| Simulation | `packages/simulation-core/tests/e2e/simulation.spec.ts` | Physics simulation renders correctly | Future |
