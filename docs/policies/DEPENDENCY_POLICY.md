# Dependency Policy

**Version:** 3.0.0
**Status:** Enforced
**Owner:** Architecture
**Applies To:** Root workspace and all packages
**Related:** `RULES.md`, `API_CONTRACT.md`, `SECURITY.md`, `docs/policies/PERFORMANCE.md`, `docs/adr/005-pnpm-monorepo-turborepo.md`

---

## Purpose

This document governs the introduction, evaluation, and removal of external
dependencies. The bias of this project is **fewer dependencies**, not more.

> **The single most important rule: prefer removing a dependency over adding one.**

---

## 1. Pre-Introduction Checklist

Before adding ANY dependency, evaluate and document every item:

| Criterion | Question to answer |
|-----------|--------------------|
| **Maintenance** | Is it actively maintained? Issue/PR response time? Last release? |
| **License** | License compatible with this project's usage (permissive preferred)? |
| **Bundle impact** | Size contribution vs `pnpm lint:size` budgets (`PERFORMANCE.md`)? |
| **Security** | Known CVEs? `pnpm audit` clean? Supply-chain posture? (`SECURITY.md`) |
| **Ecosystem maturity** | Widely adopted? Stable API? Backwards-compatible history? |
| **Alternatives** | Native/workspace option exists? What was compared and why this won? |
| **Long-term ownership** | If upstream dies, can this project fork or replace it cheaply? |

A dependency that fails any item is rejected unless the owning maintainer approves
an exception with written justification.

## 2. Approval

- **Any new dependency requires an ADR** (`docs/adr/README.md`) documenting the
  checklist above and the alternatives considered.
- Approval is by a **named maintainer** (architect review) in the PR — no board.
- The final decision is recorded in the ADR and referenced by the PR.

## 3. Preference Order

Choose dependencies in this order:

1. **No dependency** — native platform, browser API, or existing workspace code
2. **Workspace package** — already in `packages/*` (`@learninghub/*`)
3. **devDependency** — build/test-time only, never shipped
4. **Runtime dependency** — last resort, and only with ADR approval

## 4. Removal Over Addition

- Before adding a dependency, ask: **can an existing dependency be removed to
  offset this?** Net-zero or negative dependency growth is preferred.
- Dependencies with zero or low usage SHOULD be removed (see `VERSIONING.md` →
  Deprecation).
- Lockfile churn from removal is cheap; the cost of a permanent dependency is not.

## 5. Lockfile & Audit Hygiene

- `pnpm-lock.yaml` MUST be committed.
- `pnpm audit` SHOULD be clean; known-vulnerability entries block merge
  (`SECURITY.md`).
- Update dependencies deliberately via the release process, not silently.
