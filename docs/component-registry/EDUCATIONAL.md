# Educational Metadata Registry

**Version:** 2.0.0

**Purpose:** Every learning module and its educational concept metadata.

---

## Quiz Engine (Phase 4 — Not Yet Extracted)

| Concept | ID | Grade | Prerequisites | Misconceptions | Location (future) |
|---------|----|-------|---------------|----------------|-------------------|
| Newton's Laws | `newtons-laws` | 9-12 | `force, motion` | `action-reaction-cancels` | `packages/quiz-engine/src/data/physics.ts` |
| Speed of Light | `speed-of-light` | 9-12 | `waves, electromagnetism` | — | `packages/quiz-engine/src/data/physics.ts` |
| Ohm's Law | `ohms-law` | 9-12 | `voltage, current, resistance` | — | `packages/quiz-engine/src/data/physics.ts` |
| Atomic Structure | `atomic-structure` | 9-12 | `elements, matter` | — | `packages/quiz-engine/src/data/chemistry.ts` |
| Atmosphere Gases | `atmosphere-gases` | 9-10 | `earth-science, percentages` | — | `packages/quiz-engine/src/data/chemistry.ts` |
| pH Scale | `ph-scale` | 9-12 | `acids, bases` | — | `packages/quiz-engine/src/data/chemistry.ts` |
| Periodic Table | `periodic-table` | 9-12 | `elements, atomic-number` | — | `packages/quiz-engine/src/data/chemistry.ts` |
| Chemical Bonds | `chemical-bonds` | 9-12 | `electrons, valence` | — | `packages/quiz-engine/src/data/chemistry.ts` |

## Simulation Core (Phase 6 — Not Yet Extracted)

| Concept | ID | Grade | Prerequisites | Misconceptions | Location (future) |
|---------|----|-------|---------------|----------------|-------------------|
| Newtonian Gravity | `newtons-gravity` | 9-12 | `force, mass, distance` | `heavier-falls-faster, gravity-needs-air` | `packages/simulation-core/src/gravity.ts` |
| Solar System | `solar-system` | 5-8 | `planets, orbits` | — | `packages/simulation-core/src/bodies.ts` |

## Legacy (Frozen — reference only)

| Concept | Location | Notes |
|---------|----------|-------|
| All physics quiz | `legacy/js/stem-quiz.js:6` | Contains physics, chemistry, math, computing, pioneers |
| All pioneers | `legacy/js/stem-pioneers.js:6` | 11 STEM pioneers with biographies |
| Physics simulation | `legacy/js/stem-effects.js:200` | Canvas-based solar system |
