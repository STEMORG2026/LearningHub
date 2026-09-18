---
title: "ADR-004: Legacy Frozen Zone"
status: SUPERSEDED
date: 2026-07-30
last_updated: 2026-08-13
canonical: true
---

# ADR-004: Legacy Frozen Zone

## Status
Superseded by ADR-012

## Date
2026-07-30

## Context
The existing v1.0.0 codebase works but is unstructured. During migration, developers might be tempted to modify legacy files as "quick fixes" or "while they're in there." This creates two problems:
1. Changes to legacy code may introduce regressions in stable, tested functionality
2. The boundary between old and new blurs — you can't tell which code is legacy and which is modern

## Decision
All v1.0.0 code is moved to `legacy/` and frozen. The `legacy/` directory is **read-only**:
- **No new features** in legacy files
- **No refactoring** of legacy files
- **Bug fixes only** — and even bug fixes should prefer creating a new module that replaces the broken functionality

Exceptions require Architectural Review Board approval.

## Alternatives Considered
- **In-place refactoring:** High risk of breaking stable features
- **Gradual migration without freeze:** Blurs the boundary, creates confusion about what's legacy vs modern

## Consequences
### Positive
- Clear boundary between old and new code
- Stable v1.0.0 features remain untouched
- Can always roll back to legacy by removing feature flags

### Negative
- Bug fixes in legacy are slower (must go through review)
- May need to maintain some legacy code longer than ideal

### Neutral
- The `legacy/` directory shrinks over time as modules are extracted
- Git tag `v1.0.0` marks the frozen baseline
