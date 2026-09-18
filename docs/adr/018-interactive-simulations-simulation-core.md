---
title: "ADR-018: Interactive Simulations Do Not Consume simulation-core"
status: ACCEPTED
date: 2026-09-18
last_updated: 2026-09-18
canonical: true
---

# ADR-018: Interactive Simulations Do Not Consume simulation-core

## Status
Accepted

## Date
2026-09-04

## Context

The Phase 8 packages `lesson-renderer` and `interactive-simulations` declared
`core`, `tracer`, and (`interactive-simulations` only) `simulation-core` as
dependencies. `docs/ROADMAP.md` Phase 8 "Remaining" and the post-rename
implementation plan (W7.3) flagged that several of these were declared but not
imported, and that neither content package carried the tracer instrumentation the
roadmap expected.

A byte-level audit of the current source found the *actual* state differs from the
earlier finding:

- `lesson-renderer` imports and uses all three of its declared dependencies
  (`content-provider` types, `core` `getDefaultEventBus`, `tracer`
  `Tracer.getInstance()`). Nothing is unused.
- `interactive-simulations` imports and uses `core` (`getDefaultEventBus`) and
  `tracer` (`Tracer.getInstance()`). Only `simulation-core` is declared-but-unused.
- Both simulation components and `stem-lesson` already wrap their `run()`/render
  paths with `Tracer` spans — the "missing tracer instrumentation" expectation is
  already met.

The genuine residue is exactly one unused dependency: `simulation-core` in
`interactive-simulations`.

## Decision

1. **Remove `@learninghub/simulation-core`** from `interactive-simulations`
   `dependencies`. The widgets (`stem-circuit-sim`, `stem-mechanics-sim`) carry
   inline physics (Ohm's law, F=ma) as teaching demonstrations; they are not, and
   were never intended to be, consumers of the `simulation-core` orbital-mechanics
   engine. The package description is corrected to state this honestly.
2. **Keep `core` and `tracer`** in both content packages — they are used, and the
   tracer instrumentation is a roadmap expectation (ADR-008) that is now confirmed
   present.

No new dependencies are introduced; this decision *removes* a dead one.

## Alternatives Considered

**1. Wire `simulation-core` into the widgets.** Rejected — the widgets teach simple
one-step relationships interactively; pulling in the full n-body/orbital engine
would add coupling without pedagogical value, and would invert the separation of
concerns ADR-006/006-v2 established (pure math in `simulation-core`, teaching UI in
`interactive-simulations`).

**2. Drop `tracer` as well and strip instrumentation.** Rejected — observability
is a non-negotiable (ADR-008) and is already wired correctly.

**3. Leave the unused dependency in place.** Rejected — dead dependencies violate
`DEPENDENCY_POLICY.md` and inflate install/build surface for no benefit.

## Consequences

### Positive
- `interactive-simulations` declares only what it imports; the Phase 8
  "declared-but-unused dependency" item is closed.
- Package descriptions now match actual behavior (no false "wraps simulation-core"
  claim).

### Negative
- None material; no consumers depended on `interactive-simulations` re-exporting
  `simulation-core` (it never did).

### Neutral
- The `simulation-core` engine remains fully in place for its own consumers; this
  change only severs the phantom linkage from `interactive-simulations`.