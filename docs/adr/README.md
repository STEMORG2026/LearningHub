# Architecture Decision Records (ADR) — Index & Governance

**Version:** 3.0.0
**Status:** Enforced
**Owner:** Architecture
**Applies To:** All packages and apps
**Related:** `RULES.md`, `API_CONTRACT.md`, `VERSIONING.md`, `DEPENDENCY_POLICY.md`

---

## Purpose

This document is the **decision log** for STEM-TUITION and the **governance
process** that governs it. ADRs record architecturally significant decisions so
future contributors (human and AI) can reconstruct *why* the system is shaped the
way it is.

---

## 1. Index

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-001](001-strangler-fig-migration.md) | Strangler Fig Migration | Accepted |
| [ADR-002](002-web-components-as-default.md) | Web Components as Default Component Architecture | Accepted |
| [ADR-003](003-event-bus-communication.md) | Event Bus for Cross-Module Communication | Accepted |
| [ADR-004](004-legacy-frozen-zone.md) | Legacy Frozen Zone | Accepted |
| [ADR-005](005-pnpm-monorepo-turborepo.md) | pnpm + Turborepo Monorepo | Accepted |
| [ADR-006](006-typescript-strict-mode.md) | TypeScript Strict Mode | Accepted |
| [ADR-007](007-educational-fitness-functions.md) | Educational Fitness Functions | Accepted |
| [ADR-008](008-built-in-observability-tracer.md) | Built-in Observability (Tracer Package) | Accepted |
| [ADR-009](009-component-registry-enforcement.md) | Component Registry Enforcement | Accepted |
| [ADR-010](010-release-doc-governance.md) | Automated Release & Documentation Governance Pipeline | Accepted |
| [ADR-011](011-constitution-adoption.md) | Adoption of the Development Constitution | Accepted |

---

## 2. When an ADR Is Mandatory

An ADR is REQUIRED for any of the following:

1. **New package** (any `packages/*` or `apps/*`)
2. **Public interface or contract** — new or changed exported API/interface
3. **Public contract class** — API, Interface, Event, Adapter, Schema,
   Configuration, CLI, Environment Variables (see `API_CONTRACT.md`)
4. **Event Bus change** — new event, changed event name/payload, or changed
   eventing strategy
5. **Dependency introduction** — any new external dependency
   (`DEPENDENCY_POLICY.md`)
6. **Architectural pattern change** — e.g., new communication pattern, state
   management change, build-tooling change
7. **Major refactor** — restructure of a package's public surface or internal
   architecture that could affect consumers
8. **Phase-level decision** — anything that affects `.phase.json` phase semantics

If in doubt, write the ADR. A short ADR is far cheaper than an undocumented
decision.

## 3. Lifecycle

```
Draft → Accepted → Superseded | Rejected
```

- **Draft** — proposed, in PR review, not yet binding
- **Accepted** — approved; **immutable**; the decision stands until superseded
- **Superseded** — replaced by a newer ADR; the superseding ADR records
  `Supersedes ADR-NNN`
- **Rejected** — considered and declined; kept in the log to avoid re-debating

## 4. Ownership & Review

- **Author:** any contributor (human or agent) proposes the ADR in a PR.
- **Owner:** Architecture (the architecture domain; see document metadata).
- **Review:** ONE named maintainer (architect review) approves — no review board.
- Approval is recorded via merge of the ADR PR.

## 5. Superseding & Immutability

- **Accepted ADRs are immutable.** Never edit the Decision of an Accepted ADR.
  To change a decision, write a NEW ADR that references it.
- The new ADR MUST include `Supersedes ADR-NNN`.
- The superseded ADR's `Status` header is updated to `Superseded by ADR-NNN`
  (a header-only change; the decision text stays untouched).
- Every ADR SHOULD carry a `Supersedes` line in its header when applicable.

## 6. Template

ADRs follow the existing modern template (MADR-style). New ADRs MUST include:

```
# ADR-NNN: <Title>

## Status
<Accepted | Superseded by ADR-NNN | Rejected | Draft>
(Supersedes ADR-XXX — when applicable)

## Date
<YYYY-MM-DD>

## Context
<Why is this decision needed? What options exist?>

## Decision
<What was decided, and why>

## Alternatives Considered
<Options compared and why they were rejected>

## Consequences
### Positive
### Negative
### Neutral
```

## 7. Decision Records Are Part of the Doc Graph

Every ADR declares its `Related` documents in its header. This file is the index
into that graph; `docs/RULES.md` → Decision Matrix decides when the ADR process is
triggered.
