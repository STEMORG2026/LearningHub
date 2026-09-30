# @learninghub/interactive-simulations

**Version:** 1.0.0

Interactive simulation components for STEM education.

## Public API

- `StemCircuitSim` — Interactive circuit simulation Web Component
- `StemMechanicsSim` — Interactive mechanics simulation Web Component
- `StemOpticsSim` — Interactive optics simulation Web Component
- `optics-physics` — pure, DOM-free optics formulas used by `StemOpticsSim`

### `StemCircuitSim`

Registered custom element (see `src/stem-circuit-sim.ts`). Learners drag voltage and resistance
sliders and observe current via Ohm's law (`V = I × R → I = V / R`). Emits through the shared
`EventBus` (`getDefaultEventBus()` from `@learninghub/core`) and traces via `@learninghub/tracer`.
Styling is encapsulated in a `template` + shadow root, so the component is self-contained and
theme-agnostic.

### `StemMechanicsSim`

Registered custom element (see `src/stem-mechanics-sim.ts`). Mechanics/forces simulation following
the same contract shape as `StemCircuitSim`: an `EventBus` emitter plus `Tracer` instrumentation.

### `StemOpticsSim`

Registered custom element (see `src/stem-optics-sim.ts`). Learners adjust the two refractive
indices, the angle of incidence, a focal length, and an object distance, and observe the refracted
ray plus the resulting image. Same integration contract as its siblings: `simulation:complete` is
published on the shared `EventBus` **and** dispatched as a bubbling DOM `CustomEvent`, and the run
is traced with `Tracer.getInstance().startSpan('stem-optics-sim:run')`.

Unlike the other two widgets, **all arithmetic lives in `./optics-physics` as pure functions.**
That separation was mandated by ADR-015 Follow-up #3:

> "If a third simulation is added, extract the inline formula into a testable pure function before
> the pattern sets."

The reason is testability. `stem-mechanics-sim` and `stem-circuit-sim` embed their formulas inside
`#run()`, so their arithmetic is only reachable by clicking a button and can only be observed
indirectly through rendered text. Optics has sign conventions (real vs virtual, converging vs
diverging) that are easy to get subtly wrong; putting them behind a DOM click would make those
errors nearly invisible.

### `optics-physics`

Pure, DOM-free module. Exports `angleOfRefraction` (Snell's law, with explicit total-internal-
reflection reporting), `criticalAngle`, `thinLens` (the thin-lens equation, returning
`NO_SOLUTION` when the object sits exactly at the focal point), `imageDistanceFor`,
`angleOfReflection`, `reflectOffHorizontal`, and `describeImage`.

Sign and unit conventions are documented at the top of `src/optics-physics.ts` — degrees at the
public boundary, centimetres for optics lengths, and the standard Cartesian sign convention in
which `f > 0` is converging and a real object has `u > 0`.

Non-physical input throws rather than returning `NaN`, so a bad value surfaces as an error at the
call site instead of propagating silently into the UI:
`angleOfRefraction` rejects refractive indices below 1, and `thinLens` rejects a zero focal length.

```ts
export { StemMechanicsSim } from './stem-mechanics-sim';
export { StemCircuitSim } from './stem-circuit-sim';
export { StemOpticsSim } from './stem-optics-sim';
export { angleOfRefraction, criticalAngle, thinLens, /* … */ } from './optics-physics';
```

### History of this entry

Until this release, `StemOpticsSim` appeared in `ARCHITECTURE.toml` under `publicApi` but **no such
symbol existed anywhere in the repository**. The doc-coverage gate flagged it on every run.

Of the two resolutions recorded here, **option 2 (implement) was chosen**: optics is still in
scope, so the component now exists, is registered, is re-exported from `src/index.ts`, and is
covered by tests. The declaration is therefore accurate rather than removed.


## Dependencies

- `@learninghub/core`
- `@learninghub/tracer`
