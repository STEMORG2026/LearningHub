# Educational Metadata Registry

**Version:** 3.0.0

**Purpose:** Every learning module and its educational concept metadata.

---

## Quiz Engine (Phase 4 — Extracted)

| Concept | ID | Grade | Prerequisites | Misconceptions | Location |
|---------|----|-------|---------------|----------------|-----------|
| Newton's Third Law of Motion | `newtons-third-law` | 9-12 | force, interaction | action-reaction-cancel, only-contact-forces | `packages/quiz-engine/src/data.ts` |
| Speed of Light | `speed-of-light` | 9-12 | waves, electromagnetic-spectrum | light-instantaneous, light-needs-medium | `packages/quiz-engine/src/data.ts` |
| Ohm's Law | `ohms-law` | 10-12 | current, voltage, resistance | voltage-causes-current-directly, resistance-is-constant | `packages/quiz-engine/src/data.ts` |
| Atomic Structure | `atomic-structure` | 8-10 | atoms, elements | protons-move, neutrons-charged | `packages/quiz-engine/src/data.ts` |
| Atmospheric Composition | `atmospheric-composition` | 8-10 | atmosphere, gases | most-abundant-oxygen, co2-primary-gas | `packages/quiz-engine/src/data.ts` |
| pH Scale | `ph-scale` | 9-11 | acids, bases, concentration | water-is-acidic, ph-0-is-strongest | `packages/quiz-engine/src/data.ts` |
| History of the Periodic Table | `periodic-table-history` | 8-10 | elements, atomic-mass | mendeleev-discovered-elements, modern-table-same-order | `packages/quiz-engine/src/data.ts` |
| Chemical Bonding | `chemical-bonding` | 9-11 | valence-electrons, octet-rule | covalent-donates-electrons, ionic-shares-electrons | `packages/quiz-engine/src/data.ts` |
| Power Rule of Differentiation | `power-rule-differentiation` | 11-12 | limits, functions | derivative-is-slope-only, power-rule-adds-one | `packages/quiz-engine/src/data.ts` |
| Trigonometric Values | `trigonometric-values` | 10-12 | angles, right-triangles, unit-circle | sin-max-0.5, cos-90-equals-1 | `packages/quiz-engine/src/data.ts` |
| Pythagorean Theorem | `pythagorean-theorem` | 8-10 | squares, square-roots, triangles | hypotenuse-is-longest-leg, a-squared-plus-b-squared-equals-c | `packages/quiz-engine/src/data.ts` |
| Factorial Definition | `factorial-definition` | 10-12 | multiplication, combinatorics | zero-factorial-zero, factorial-only-integers | `packages/quiz-engine/src/data.ts` |
| Binary Number System | `binary-numbers` | 8-10 | decimal-system, place-value | binary-starts-with-1, binary-only-ones | `packages/quiz-engine/src/data.ts` |
| History of Computing | `history-of-computing` | 8-12 | — | turing-first-programmer, babbage-wrote-software | `packages/quiz-engine/src/data.ts` |
| Queue Data Structure | `queue-data-structure` | 10-12 | arrays, linked-lists | queue-is-lifo, stack-and-queue-same | `packages/quiz-engine/src/data.ts` |
| Computer Architecture Basics | `computer-architecture` | 6-8 | — | cpu-is-computer-brain-literal, cpu-stores-data | `packages/quiz-engine/src/data.ts` |
| Marie Curie | `marie-curie` | 8-12 | radioactivity | curie-won-one-nobel, curie-discovered-radium-only | `packages/quiz-engine/src/data.ts` |
| Aryabhata | `aryabhata` | 8-12 | number-systems, pi | zero-invented-by-arabs, aryabhata-only-astronomy | `packages/quiz-engine/src/data.ts` |
| Rosalind Franklin | `rosalind-franklin` | 9-12 | dna, x-ray-crystallography | watson-crick-discovered-dna, franklin-assistant-only | `packages/quiz-engine/src/data.ts` |
| Katherine Johnson | `katherine-johnson` | 8-12 | orbital-mechanics, geometry | computers-did-all-work, nasa-only-had-white-male-mathematicians | `packages/quiz-engine/src/data.ts` |

## Simulation Core (Phase 6 — Extracted)

| Concept | ID | Grade | Prerequisites | Misconceptions | Location |
|---------|----|-------|---------------|----------------|-------------------|
| Newtonian Gravity | `newtons-gravity` | 9-12 | `force, mass, distance` | `heavier-falls-faster, gravity-needs-air` | `packages/simulation-core/src/physics.ts:126` |
| Solar System | `solar-system` | 5-8 | `planets, orbits` | — | `packages/simulation-core/src/config.ts` |
| Elastic Collision | `elastic-collision` | 9-12 | `momentum, energy` | — | `packages/simulation-core/src/physics.ts:91` |
| Coulomb Force | `coulomb-force` | 11-12 | `charge, distance` | — | `packages/simulation-core/src/physics.ts:70` |

## App Shell (Phase 7 — Active)

| Concept | Location | Notes |
|---------|----------|-------|
| STEM pioneers wall | `apps/shell/src/data/pioneers.ts` | 20 STEM pioneers with biographies |
## Phase 8: Content & Lessons (Active)

| Concept | ID | Location | Notes |
|---------|----|----------|-------|
| LessonContent model | — | `packages/content-provider/src/content-provider.ts` | Content access boundary |
| Lesson rendering | — | `packages/lesson-renderer/src/stem-lesson.ts` | WC for lesson display |
| Circuit simulation | `circuit-sim` | `packages/interactive-simulations/src/stem-circuit-sim.ts` | Interactive STEM sim |
| Mechanics simulation | `mechanics-sim` | `packages/interactive-simulations/src/stem-mechanics-sim.ts` | Interactive STEM sim |
| Optics simulation | `optics-sim` | `packages/interactive-simulations/src/stem-optics-sim.ts` | Interactive STEM sim |
