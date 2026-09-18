---
title: "ADR-003: Event Bus for Cross-Module Communication"
status: ACCEPTED
date: 2026-07-30
last_updated: 2026-07-30
canonical: true
---

# ADR-003: Event Bus for Cross-Module Communication

## Status
Accepted

## Date
2026-07-30

## Context
Modules need to communicate without being tightly coupled. Options:
1. **Direct imports** — one package imports another and calls functions directly
2. **Event Bus (pub/sub)** — modules publish events, subscribers receive them
3. **Dependency injection** — modules receive their dependencies via constructor

## Decision
We use an **Event Bus (BroadcastChannel)** for all cross-module communication.

Modules NEVER import each other directly. They communicate through the Event Bus:
- Publisher: `eventBus.publish('domain:action', { data })`
- Subscriber: `eventBus.subscribe('domain:action', handler)`

**Rationale:**
- Loose coupling — modules don't need to know about each other
- BroadcastChannel is a native browser API — zero dependencies
- Enables the Tracer to instrument all cross-module traffic
- Makes debugging easy — enable `?debug_events=true` and see every message
- Supports wildcard subscriptions for bulk handling

## Alternatives Considered
- **Direct imports:** Creates tight coupling, defeats the purpose of modular architecture
- **Dependency injection:** Requires a DI container, more complex setup

## Consequences
### Positive
- Full audit trail of all module communication
- Modules can be developed and tested independently
- Adding a new subscriber doesn't change the publisher

### Negative
- Indirect communication is harder to trace than direct calls (mitigated by Tracer)
- Payloads must be serializable (no function references across modules)

### Neutral
- Pattern may feel indirect at first but becomes natural with practice
- Event naming convention must be maintained (see `EVENT_BUS_CONTRACT.md`)
