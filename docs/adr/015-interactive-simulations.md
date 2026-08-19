# ADR-015: Interactive Simulations Package

**Status:** Accepted
**Date:** 2026-08-19
**Owner:** Architecture
**Related:** `ADR-002` (Web Components as Default), `ADR-007` (Educational Fitness Functions), `ADR-014` (Lesson Renderer), `docs/policies/EVENT_BUS_CONTRACT.md`

---

## Context

Phase 6 extracted `packages/simulation-core/` — pure physics functions (`updatePhysics`,
`applySunGravity`, `interactPair`, and a large celestial-body/orbital toolkit) with no
DOM dependency. Separately, the lesson experience needed **interactive teaching
widgets**: small, focused simulations where a learner manipulates a variable and
observes the result, in service of a specific concept (F=ma, Ohm's law).

This ADR is written **retroactively**. The package shipped on 2026-08-17 in commit
`e27f907` without an ADR, which `docs/adr/README.md` §2.1 requires for any new package.
It was absent from `.phase.json`, so the documentation generator could not see it, and
the gap surfaced only in the 2026-08-19 audit.

The open question was whether these widgets are a **consumer** of `simulation-core` or
a **separate concern**.

## Decision

Create `packages/interactive-simulations/` exposing two Web Components:

| Element | Class | Concept taught |
|---|---|---|
| `<stem-mechanics-sim>` | `StemMechanicsSim` | Newton's second law (F=ma) |
| `<stem-circuit-sim>` | `StemCircuitSim` | Circuit behaviour |

Both follow the ADR-002 pattern: `HTMLElement` subclass, open Shadow DOM, guarded
`customElements.define`, and a `simulation:complete` DOM `CustomEvent` on completion
(`stem-mechanics-sim.ts:224`, `stem-circuit-sim.ts:154`).

Each simulation embeds a **predict-then-observe** step — the learner commits to a
prediction before running the simulation. This is a pedagogical constraint, consistent
with ADR-007's educational fitness functions, not an incidental UI choice.

### Decision: these widgets do NOT consume `simulation-core`

Despite the package description claiming it wraps `simulation-core`, the
implementation **imports nothing**. `StemMechanicsSim` computes acceleration inline
(`const acceleration = force / mass`, `stem-mechanics-sim.ts:161`).

This is the correct boundary, and it should be stated deliberately rather than left to
look like an oversight:

- `simulation-core` models **many-body celestial dynamics** — suns, planets, black
  holes, orbital mechanics, collision and devour events. Its public surface is built
  around `CelestialBody`, `PLANET_CONFIGS`, `applyBlackholePull`.
- A single-variable teaching widget needs **one arithmetic expression**, not a physics
  engine. Routing `force / mass` through `updatePhysics` would add coupling and
  conceptual overhead for zero benefit.

Different domains that happen to share the word "simulation". Keeping them separate
respects the YAGNI principle in `docs/RULES.md`.

**Consequence:** the declared dependency on `@stem-tuition/simulation-core` is
therefore wrong and should be removed — see Follow-up.

### Deviation: DOM CustomEvent instead of EventBus

As in ADR-014, `simulation:complete` is a DOM `CustomEvent`, not an
`EventBus.publish()` call, despite the `AGENTS.md` cross-package rule. Rationale is
identical: this is a local notification to the hosting DOM node, and the component
stays usable standalone. The `domain:action` naming convention is respected.

No lint rule enforces this distinction — `pnpm lint:arch` inspects import graphs, not
event mechanisms — so this ADR is the only record of the choice.

## Alternatives Considered

**1. Add these components to `simulation-core`.** Rejected — `simulation-core` is pure
logic with no DOM. Adding Web Components would violate the business-logic-purity rule
in `docs/RULES.md` and destroy its testability in a non-DOM environment.

**2. Build the widgets on top of `simulation-core`'s physics.** Rejected — domain
mismatch. `simulation-core` solves n-body celestial dynamics; these widgets teach a
single relationship with one formula. Forcing the dependency would couple a teaching
widget to an orbital-mechanics engine.

**3. Put the widgets inside `lesson-renderer`.** Rejected — conflates generic lesson
presentation (ADR-014) with concept-specific interactive content. Simulations must be
usable outside a lesson (e.g. standalone practice), and `lesson-renderer` should not
grow a new component per concept.

## Consequences

### Positive
- Simulations are independently testable — **19 tests passing**
- `simulation-core` stays pure and DOM-free; Phase 6's boundary holds
- Each widget is small enough to reason about as a teaching artifact
- Predict-then-observe is enforced structurally, not left to authoring discipline

### Negative
- **All three declared dependencies (`core`, `simulation-core`, `tracer`) are unused.**
  The package imports nothing. The `package.json` description ("Web Components wrapping
  simulation-core") is inaccurate and misleads readers about the architecture.
- No tracer instrumentation, despite `docs/policies/OBSERVABILITY.md` and the ROADMAP's
  "Tracer instrumentation from day one" expectation.
- Physics logic is inlined in the component, so it is not unit-testable apart from the
  DOM. Acceptable at one line; a smell if these widgets grow.
- A third simulation domain (optics, per the package description) is implied but not
  implemented.

### Neutral
- Package is `private: true` — internal to the monorepo
- Registered under Phase 8 (Content & Lessons) in `.phase.json`

## Follow-up

1. **Remove the three unused dependencies** and correct the `package.json`
   description, or add the tracer instrumentation they imply. The current state
   satisfies neither claim.
2. Add component registry entries for `<stem-mechanics-sim>` and `<stem-circuit-sim>`.
3. If a third simulation is added, extract the inline formula into a testable pure
   function before the pattern sets.

## Files

- `packages/interactive-simulations/src/stem-mechanics-sim.ts` — F=ma widget
- `packages/interactive-simulations/src/stem-circuit-sim.ts` — circuit widget
- `packages/interactive-simulations/src/index.ts` — public surface
- `packages/interactive-simulations/tests/` — 19 tests, all passing
