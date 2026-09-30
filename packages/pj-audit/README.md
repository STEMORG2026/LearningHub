# @learninghub/pj-audit

**Version:** 1.0.0

Audit log for PROFESSOR-J task execution (ADR-022, Phase 10 — governance extensions).

Records what the AI worker was asked to do and what it did, so orchestration is
reviewable after the fact. This is the LearningHub-side trail; PROFESSOR-J owns the
execution itself.

## Public API

- `AuditLog` — the append-and-query log class
  - `record(entry)` — append an entry
  - `query(criteria)` — filter entries via an `AuditQuery`
  - `getAll()` — every recorded entry
  - `clear()` — reset the log
- `globalAuditLog` — a shared `AuditLog` instance
- `AuditEntry` — one recorded action (`id`, `type`, `timestamp`, `details`)
- `AuditEventType` — the event-type union
- `AuditQuery` — the filter shape accepted by `query()`

## Status

`stable` / `incubating`. **This package currently has no consumer inside LearningHub** —
it is an integration surface for the Phase 10 governance work described in ADR-019 and
ADR-022.

## Dependencies

- `@learninghub/pj-types` (protocol types)
