---
title: "ADR-001: Strangler Fig Migration"
status: ACCEPTED
date: 2026-07-30
last_updated: 2026-07-30
canonical: true
---

# ADR-001: Strangler Fig Migration

## Status
Accepted

## Date
2026-07-30

## Context
STEM-TUITION is currently a vanilla HTML/CSS/JS monolith. The codebase works, but:
- `stem-effects.js` (1311 lines) mixes 4 separate concerns
- Business logic is coupled to DOM
- No package manager or build tool
- Debugging is difficult because nothing is isolated
- Adding features requires modifying the core bundle, risking regressions

A full rewrite would leave the site broken for months. We need a strategy that lets us improve the codebase while keeping the site live.

## Decision
We adopt the **Strangler Fig Pattern**:
1. Freeze the current codebase as `legacy/` (read-only)
2. Build new functionality in `packages/` alongside legacy code
3. Gradually extract features from legacy into packages
4. Route traffic between legacy and modern via a shell router
5. Feature-flag every new module for instant rollback

## Alternatives Considered
- **Full rewrite:** Too risky, site would be down for months
- **Do nothing:** Code quality degrades, debugging remains hard
- **Incremental refactor in-place:** High risk of breaking legacy code

## Consequences
### Positive
- Site stays live during entire migration
- Each extraction is testable in isolation
- Can roll back any module instantly via feature flag
- Learn the pattern once (audio synth), then apply it to all modules

### Negative
- Dual maintenance during transition (legacy + modern)
- Must maintain ACL adapters until migration completes

### Neutral
- Introduces build tools (Vite, Turborepo) for modern modules only
- Legacy remains build-free

## Compliance
- [x] Educational Fitness Functions satisfied — migration does not change user experience
- [x] Architecture Fitness Functions defined — legacy isolation enforced by `pnpm lint:arch`
- [x] Migration plan documented — see `docs/ROADMAP.md`
- [x] Rollback procedure defined — feature flags for every module
