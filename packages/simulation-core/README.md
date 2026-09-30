# @learninghub/simulation-core

## Purpose

Pure physics math for the gravity simulation: Newtonian gravity, collision, boundary, mouse force, blackhole pull/devour. No DOM, no canvas — fully testable.

## Public API

- Bodies: `createSun`, `createPlanet`, `createBlackhole`, `createSmallItem`, `resetIdCounter`
- Physics: `stepPosition`, `applyBoundary`, `applyMouseForce`, `interactPair`, `applySunGravity`, `applyBlackholePull`, `applyBlackholeDevour`, `computeForceMult`, `updatePhysics`
- Constants/config: `PLANET_CONFIGS`, `BODY_TYPES`, `SUN_GRAVITY_CONSTANT`, physics tuning constants, `MATH_SYMBOLS`

### `applySunGravity(body, sun, timeScale) => CelestialBody`

Pure Newtonian attraction toward the sun. Applies to `giant_planet` bodies only, and returns
`body` **unchanged** (not an error) when any guard trips:

- `body.type !== 'giant_planet'`, or
- `body.isExploded`, or
- `body.id === sun.id` (a body is never attracted to itself), or
- `dist <= 0` or `dist < sun.radius * 0.5` (inside the sun's inner radius).

Otherwise it returns a new body with the gravitational velocity delta applied:
`accel = SUN_GRAVITY_CONSTANT * sun.mass / dist²`, scaled by `timeScale`.

### `SUN_GRAVITY_CONSTANT = 0.0014452`

The tuning constant consumed by `applySunGravity`. Defined in `src/config.ts` and re-exported from
the package root. It is deliberately small because it multiplies `sun.mass` and divides by
`dist²` in simulation units (pixels), not SI metres — it is a *calibration* value, not a physical
constant. Changing it re-tunes every orbit in the gravity simulation, so it should only be
adjusted together with `PLANET_CONFIGS`.

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
