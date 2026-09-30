# Testing Registry

**Version:** 3.0.0

**Purpose:** Every test file and what it covers.

---

## New Module Tests

<!-- AUTO:testing-table -->
| Package | Test file | Type | Coverage target | Status |
|---------|-----------|------|----------------|--------|
| `packages/core/` | `tests/*.test.ts` | Unit | — | 🟢 Written (77 tests) |
| `packages/tracer/` | `tests/*.test.ts` | Unit | — | 🟢 Written (48 tests) |
| `packages/audio-synth/` | `tests/*.test.ts` | Unit | — | 🟢 Written (25 tests) |
| `packages/core/` | `tests/*.test.ts` | Unit | — | 🟢 Written (77 tests) |
| `packages/acl/` | `tests/*.test.ts` | Unit | — | 🟢 Written (19 tests) |
| `packages/quiz-engine/` | `tests/*.test.ts` | Unit | — | 🟢 Written (59 tests) |
| `packages/hover-engine/` | `tests/*.test.ts` | Unit | — | 🟢 Written (12 tests) |
| `packages/simulation-core/` | `tests/*.test.ts` | Unit | — | 🟢 Written (70 tests) |
| `packages/auth/` | `tests/*.test.ts` | Unit | — | 🟢 Written (13 tests) |
| `packages/progress/` | `tests/*.test.ts` | Unit | — | 🟢 Written (16 tests) |
| `packages/admin/` | `tests/*.test.ts` | Unit | — | 🟢 Written (39 tests) |
| `packages/payments/` | `tests/*.test.ts` | Unit | — | 🟢 Written (10 tests) |
| `packages/video/` | `tests/*.test.ts` | Unit | — | 🟢 Written (12 tests) |
| `packages/content-provider/` | `tests/*.test.ts` | Unit | — | 🟢 Written (43 tests) |
| `packages/interactive-simulations/` | `tests/*.test.ts` | Unit | — | 🟢 Written (76 tests) |
| `packages/lesson-renderer/` | `tests/*.test.ts` | Unit | — | 🟢 Written (58 tests) |
| `packages/content-engine/` | `tests/*.test.ts` | Unit | — | 🟢 Written (49 tests) |
| `packages/pj-client/` | `tests/*.test.ts` | Unit | — | 🟢 Written (7 tests) |
| `packages/pj-types/` | `tests/*.test.ts` | Unit | — | 🟢 Written (4 tests) |
| `packages/pj-auth/` | `tests/*.test.ts` | Unit | — | 🟢 Written (11 tests) |
| `packages/pj-audit/` | `tests/*.test.ts` | Unit | — | 🟢 Written (8 tests) |
| `packages/pj-policy/` | `tests/*.test.ts` | Unit | — | 🟢 Written (16 tests) |
| `packages/ecosystem-dashboard/` | `tests/*.test.ts` | Unit | — | 🟢 Written (13 tests) |
| `packages/cross-repo-visibility/` | `tests/*.test.ts` | Unit | — | 🟢 Written (10 tests) |
<!-- END AUTO:testing-table -->

## E2E Tests (Planned)

> These specs are **documented intent, not committed files** (commit `ce2139c` removed the
> original broken specs — wrong import paths). `verify-registry` reports them as warnings
> rather than errors precisely because this section is marked Planned. Create the files
> and move the rows into the table above to clear the warnings.

| Test | File | Covers | Status |
|------|------|--------|--------|
| Quiz flow | `packages/quiz-engine/tests/e2e/quiz-flow.spec.ts` | Full quiz: load → answer → score | `PLANNED` — not yet written |
| Audio playback | `packages/audio-synth/tests/e2e/audio.spec.ts` | Sound plays on quiz completion | `PLANNED` — not yet written |
| Simulation | `packages/simulation-core/tests/e2e/simulation.spec.ts` | Physics simulation renders correctly | `PLANNED` — not yet written |
