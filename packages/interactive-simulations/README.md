# @learninghub/interactive-simulations

**Version:** 1.0.0

Interactive simulation components for STEM education.

## Public API

- `StemCircuitSim` — Interactive circuit simulation Web Component
- `StemMechanicsSim` — Interactive mechanics simulation Web Component
- `StemOpticsSim` — documented planned surface; **not yet exported** (see below)

### `StemCircuitSim`

Registered custom element (see `src/stem-circuit-sim.ts`). Learners drag voltage and resistance
sliders and observe current via Ohm's law (`V = I × R → I = V / R`). Emits through the shared
`EventBus` (`getDefaultEventBus()` from `@learninghub/core`) and traces via `@learninghub/tracer`.
Styling is encapsulated in a `template` + shadow root, so the component is self-contained and
theme-agnostic.

### `StemMechanicsSim`

Registered custom element (see `src/stem-mechanics-sim.ts`). Mechanics/forces simulation following
the same contract shape as `StemCircuitSim`: an `EventBus` emitter plus `Tracer` instrumentation.

### `StemOpticsSim` — declared but absent ⚠️

`StemOpticsSim` appears in this package's `ARCHITECTURE.toml` under `publicApi`, but **no such
symbol exists anywhere in the repository** — not in `src/`, not in `dist/`, and not in any commit
reachable from `HEAD`. `src/index.ts` exports exactly two components:

```ts
export { StemMechanicsSim } from './stem-mechanics-sim';
export { StemCircuitSim } from './stem-circuit-sim';
```

This entry is a **stale declaration**, not a missing implementation. A repo-wide search for
`StemOpticsSim` returns exactly one hit: the `ARCHITECTURE.toml` line itself. The doc-coverage
gate (`scripts/checks/verify-doc-coverage.mjs`) flags it on every run and is currently configured
as informational.

**Resolution options** (choose one rather than leaving the drift in place):

1. **Remove** `"StemOpticsSim"` from `publicApi` in `ARCHITECTURE.toml` — correct if the optics
   simulation was dropped from scope. This is the minimal, honest fix.
2. **Implement** the component (`src/stem-optics-sim.ts`, registered and re-exported from
   `src/index.ts`) — correct if optics is still planned; until then the declaration overstates the
   public surface.

Option 1 is preferred unless there is an active plan to build it, because an exported-symbol list
is a contract: consumers may `import { StemOpticsSim }` based on this metadata and fail at runtime.


## Dependencies

- `@learninghub/core`
- `@learninghub/simulation-core`
- `@learninghub/tracer`
