# @learninghub/simulation-core

## Purpose

Pure physics math for the gravity simulation: Newtonian gravity, collision, boundary, mouse force, blackhole pull/devour. No DOM, no canvas — fully testable.

## Public API

- Bodies: `createSun`, `createPlanet`, `createBlackhole`, `createSmallItem`, `resetIdCounter`
- Physics: `stepPosition`, `applyBoundary`, `applyMouseForce`, `interactPair`, `applyBlackholePull`, `applyBlackholeDevour`, `computeForceMult`, `updatePhysics`
- Constants/config: `PLANET_CONFIGS`, `BODY_TYPES`, physics tuning constants, `MATH_SYMBOLS`

## Inputs

- Pure functions over `PhysicsInput` / body arrays + timestep

## Outputs

- `PhysicsResult`, `CollisionEvent`, `DevourEvent`, updated body positions/velocities

## Public Contracts

- Contract classes: `api`, `interface`, `schema`

## Dependencies

- `@learninghub/core`, `@learninghub/tracer`

## Extension Points

- Add a new body type in `src/create-body.ts` + register in `BODY_TYPES`; new forces slot into `updatePhysics`

## Examples

```ts
import { createSun, stepPosition } from '@learninghub/simulation-core';

const sun = createSun();
const next = stepPosition(sun, 0.016);
```
