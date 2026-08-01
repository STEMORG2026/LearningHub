# Package Lifecycle

**Version:** 3.0.0
**Status:** Enforced
**Owner:** Architecture
**Applies To:** All `packages/*` and `apps/*`
**Related:** `RULES.md`, `VERSIONING.md`, `API_CONTRACT.md`, `docs/adr/README.md`

---

## Purpose

This document defines the **lifecycle of packages** (not APIs — API/contract
deprecation lives in `VERSIONING.md` + `API_CONTRACT.md`). A package moves through
states as its maturity and usage change. States are recorded in the package
manifest and reflected in the component registry.

---

## Lifecycle States

```
Experimental → Incubating → Stable → Legacy → Deprecated → Archived
```

| State | Meaning | Versioning | Expectation |
|-------|---------|-----------|-------------|
| **Experimental** | Proof-of-concept, API may change daily | `0.x.0` | Not for external consumers; may be deleted without notice |
| **Incubating** | Real users, API stabilizing | `0.x.0` → `1.0.0` at promotion | Feedback gathered; API changes allowed but flagged |
| **Stable** | Production-safe, API frozen | `1.x.0`+ | SemVer promises apply; this is the default target state |
| **Legacy** | Superseded but still used by consumers | frozen | Bug fixes only; no new features |
| **Deprecated** | Replaced; consumers told to migrate | frozen | Removal scheduled; warnings emitted on use |
| **Archived** | Dead; code removed or quarantined | n/a | No longer shipped; registry entry updated |

## Promotion / Demotion Rules

- **Experimental → Incubating:** owning maintainer decision; must pass
  `verify-governance`; public contracts documented (`API_CONTRACT.md`).
- **Incubating → Stable:** must have an ADR, stable public contracts, ≥ the
  project's coverage bar, and a real consumer.
- **Stable → Legacy:** a newer package or approach supersedes it; a PR records
  the supersession.
- **Legacy → Deprecated:** deprecation announced in `CHANGELOG.md` + registry
  `STATE.md`; a migration target is named.
- **Deprecated → Archived:** only after the deprecation cycle and a MAJOR release
  window (`VERSIONING.md` → Deprecation).

## Rules

1. A package's state MUST be declared in its `package.json` (`description` prefix
   or `"status"` field) and in the component registry `index.md`.
2. **Stable packages never change state without an ADR.**
3. Deprecated packages MUST continue to work and stay tested until archived.
4. New packages MUST start as **Experimental** — never Stable.
5. Phase 7 feature packages (auth, progress, admin) start at Experimental.
