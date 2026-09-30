# Testing Registry

**Version:** 3.0.0

**Purpose:** Every test file and what it covers.

---

## New Module Tests

<!-- AUTO:testing-table -->
| Package | Test file | Type | Coverage target | Status |
|---------|-----------|------|----------------|--------|
| `packages/core/` | `tests/*.test.ts` | Unit | — | 🟢 Written (77 tests) |
| `packages/tracer/` | `tests/*.test.ts` | Unit | — | 🟢 Written (24 tests) |
| `packages/audio-synth/` | `tests/*.test.ts` | Unit | — | 🟢 Written (14 tests) |
| `packages/core/` | `tests/*.test.ts` | Unit | — | 🟢 Written (77 tests) |
| `packages/acl/` | `tests/*.test.ts` | Unit | — | 🟢 Written (19 tests) |
| `packages/quiz-engine/` | `tests/*.test.ts` | Unit | — | 🟢 Written (22 tests) |
| `packages/hover-engine/` | `tests/*.test.ts` | Unit | — | 🟢 Written (12 tests) |
| `packages/simulation-core/` | `tests/*.test.ts` | Unit | — | 🟢 Written (70 tests) |
| `packages/auth/` | `tests/*.test.ts` | Unit | — | 🟢 Written (13 tests) |
| `packages/progress/` | `tests/*.test.ts` | Unit | — | 🟢 Written (7 tests) |
| `packages/admin/` | `tests/*.test.ts` | Unit | — | 🟢 Written (7 tests) |
| `packages/payments/` | `tests/*.test.ts` | Unit | — | 🟢 Written (10 tests) |
| `packages/video/` | `tests/*.test.ts` | Unit | — | 🟢 Written (12 tests) |
| `packages/content-provider/` | `tests/*.test.ts` | Unit | — | 🟢 Written (43 tests) |
| `packages/interactive-simulations/` | `tests/*.test.ts` | Unit | — | 🟢 Written (19 tests) |
| `packages/lesson-renderer/` | `tests/*.test.ts` | Unit | — | 🟢 Written (56 tests) |
| `packages/content-engine/` | `tests/*.test.ts` | Unit | — | 🟢 Written (49 tests) |
| `packages/pj-client/` | `tests/*.test.ts` | Unit | — | 🟢 Written (7 tests) |
| `packages/pj-types/` | `tests/*.test.ts` | Unit | — | 🟢 Written (4 tests) |
| `packages/pj-auth/` | `tests/*.test.ts` | Unit | — | 🟢 Written (11 tests) |
| `packages/pj-audit/` | `tests/*.test.ts` | Unit | — | 🟢 Written (8 tests) |
| `packages/pj-policy/` | `tests/*.test.ts` | Unit | — | 🟢 Written (11 tests) |
| `packages/ecosystem-dashboard/` | `tests/*.test.ts` | Unit | — | 🟢 Written (13 tests) |
| `packages/cross-repo-visibility/` | `tests/*.test.ts` | Unit | — | 🟢 Written (10 tests) |
<!-- END AUTO:testing-table -->

## E2E Tests (Future)

| Test | File | Covers | Status |
|------|------|--------|--------|
| Quiz flow | `packages/quiz-engine/tests/e2e/quiz-flow.spec.ts` | Full quiz: load → answer → score | Future |
| Audio playback | `packages/audio-synth/tests/e2e/audio.spec.ts` | Sound plays on quiz completion | Future |
| Simulation | `packages/simulation-core/tests/e2e/simulation.spec.ts` | Physics simulation renders correctly | Future |
