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
| `packages/content-provider/` | `tests/*.test.ts` | Unit | — | 🟢 Written (40 tests) |
| `packages/interactive-simulations/` | `tests/*.test.ts` | Unit | — | 🟢 Written (19 tests) |
| `packages/lesson-renderer/` | `tests/*.test.ts` | Unit | — | 🟢 Written (56 tests) |
| `packages/content-engine/` | `tests/*.test.ts` | Unit | — | 🟢 Written (49 tests) |
| `packages/acp-server/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/subagent-manager/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/plugin-registry/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/hooks-system/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/agent-router/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/session-manager/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/tool-search/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/sandbox/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/task-tracker/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/scheduler/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/model-clients/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/memory/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/web-tools/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/browser/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
| `packages/computer-use/` | `tests/*.test.ts` | Unit | — | ⚪ Placeholder |
<!-- END AUTO:testing-table -->

## E2E Tests (Future)

| Test | File | Covers | Status |
|------|------|--------|--------|
| Quiz flow | `packages/quiz-engine/tests/e2e/quiz-flow.spec.ts` | Full quiz: load → answer → score | Future |
| Audio playback | `packages/audio-synth/tests/e2e/audio.spec.ts` | Sound plays on quiz completion | Future |
| Simulation | `packages/simulation-core/tests/e2e/simulation.spec.ts` | Physics simulation renders correctly | Future |
