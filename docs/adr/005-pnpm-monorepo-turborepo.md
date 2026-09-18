---
title: "ADR-005: pnpm + Turborepo Monorepo"
status: ACCEPTED
date: 2026-07-30
last_updated: 2026-07-30
canonical: true
---

# ADR-005: pnpm + Turborepo Monorepo

## Status
Accepted

## Date
2026-07-30

## Context
The project has multiple packages (`core`, `tracer`, `audio-synth`, `quiz-engine`, etc.) that need to be managed together. Options:
1. **pnpm + Turborepo** — strict dependency isolation, cached builds
2. **npm workspaces** — simpler but slower, less strict
3. **Single package (no monorepo)** — all code in one package, no separation

## Decision
We use **pnpm workspaces** with **Turborepo** as our build system.

**Rationale:**
- pnpm's strict dependency isolation prevents accidental cross-package imports
- Turborepo caches build outputs — only changed packages are rebuilt
- Standard tooling in the monorepo ecosystem
- pnpm is faster and more disk-efficient than npm or yarn

## Alternatives Considered
- **npm workspaces:** Less strict dependency isolation, slower
- **Single package:** No separation between concerns, defeats modularity

## Consequences
### Positive
- Fast builds (cached by Turborepo)
- Strict dependency graph enforced by pnpm
- Standard in the community — good documentation

### Negative
- Must learn pnpm concepts (workspaces, filters)
- Turborepo config adds initial setup overhead

### Neutral
- Existing legacy code remains in `legacy/` outside the monorepo
- Only new packages use the monorepo
