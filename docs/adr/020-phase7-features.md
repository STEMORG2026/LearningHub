---
title: "ADR-020: Phase 7 Feature Packages"
status: ACCEPTED
date: 2026-09-19
---

# ADR-020: Phase 7 Feature Packages

## Status

ACCEPTED

## Context

Phase 7 in the ROADMAP defines "Features (auth, progress, admin)" as the next development priority after Phase 6 (Physics Core extraction). Three feature packages were specified:

1. **User Authentication** — registration, login, session management, roles
2. **Student Progress Tracking** — lesson progress, scores, streaks
3. **Admin Dashboard** — user management, system stats, search/filter

These packages follow the established LearningHub package pattern (pure logic, EventBus, Tracer).

## Decision

Create three new packages under `packages/`:

| Package | Path | Responsibility |
|---------|------|----------------|
| `auth` | `packages/auth/` | User authentication and role-based access control |
| `progress` | `packages/progress/` | Lesson progress tracking and user progress summaries |
| `admin` | `packages/admin/` | Admin dashboard with user management and system stats |

Each package uses:
- Pure TypeScript logic (no DOM, no `window`/`document`)
- EventBus for cross-package communication
- Tracer for observability
- Vitest for unit testing (≥80% coverage)

## Consequences

- Three new workspace packages added
- New event types: `auth:login`, `progress:lesson-started`, `progress:lesson-completed`, `admin:user-updated`
- Foundation for Phase 9+ integration with PROFESSOR-J orchestration plane

## Related

- ADR-019: Agentic Orchestration Capability (Phase 9+10+11)
- ROADMAP Phase 7: Features (auth, progress, admin)
