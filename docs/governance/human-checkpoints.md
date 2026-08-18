# Human Checkpoints

**Version:** 3.0.0
**Status:** Active
**Owner:** Architecture
**Applies To:** All packages and apps
**Related:** `CONSTITUTION.md`, `policies/HUMAN_INVOLVEMENT.md`

## Purpose

Records human-approved architectural decisions so future agents know what has
already been decided. Per the constitution (§25), an AI agent must not repeatedly
ask the human to re-decide an already-approved decision unless new information
materially changes the situation.

## Records

| Date | Decision | Status | Reason | Affected systems |
|------|----------|--------|--------|------------------|
| 2026-08-11 | Adopt the STEM Ecosystem development constitution as `docs/CONSTITUTION.md`; reconcile governance artifacts into the existing `docs/` taxonomy | Approved | Human-approved adoption (ADR-011) | Documentation governance, interface registry, AI session protocol |

## Process

- A record is added only after a human approves a decision.
- `Status` values: `Approved`, `Superseded`, `Rejected`.
- A superseding decision adds a new row linking back to the superseded one.
