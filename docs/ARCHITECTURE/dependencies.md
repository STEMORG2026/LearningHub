# Dependencies

**Version:** 3.0.0
**Status:** Enforced
**Owner:** Architecture
**Applies To:** All packages and apps
**Related:** `ARCHITECTURE/README.md`, `RULES.md`, `docs/ARCHITECTURE/containers.md`

---

## Module Dependency Rules

These rules are **enforced by automation** (`pnpm lint:arch` via
`dependency-cruiser`). Violations block merge. Circular dependencies are enforced
by `pnpm lint:circular` (madge).

```
         ┌─────────────────────────────┐
         │        apps/shell           │
         │  (can access legacy OR any  │
         │   package via ACL/EventBus) │
         └──────┬──────────────────────┘
                │
    ┌───────────┴───────────┐
    │                       │
    ▼                       ▼
┌──────────────┐    ┌──────────────┐
│   legacy/    │    │  packages/*  │
│  FROZEN ZONE │    │ NEW MODULES  │
│  Read-only   │    │              │
└──────┬───────┘    └──────┬───────┘
       │                   │
       │    ┌──────────────┐
       └────►  packages/   ◄────┘
            │   acl/       │
            │  (adapters)  │
            └──────┬───────┘
                   │
          ┌────────┴────────┐
          ▼                  ▼
┌──────────────────┐  ┌──────────────────┐
│  legacy/         │  │  packages/*      │
│  (via adapter)   │  │  (direct calls)  │
└──────────────────┘  └──────────────────┘
```

## Allowed Imports

| From | To | Allowed? | Notes |
|------|----|----------|-------|
| `packages/*` | `legacy/*` | ❌ FORBIDDEN | Must go through `packages/acl/` |
| `packages/*` | `packages/core/` | ✅ Yes | Event Bus is the shared backbone |
| `packages/*` | `packages/tracer/` | ✅ Yes | Any module can be traced |
| `packages/*` | `packages/acl/` | ✅ Yes | Use adapters for legacy access |
| `packages/*` | `packages/*` (other) | ⚠️ Via Event Bus only | No direct function calls between packages |
| `legacy/*` | `packages/*` | ❌ FORBIDDEN | Legacy cannot import new modules |
| `legacy/` | `legacy/` | ✅ Yes | Within frozen zone |
| `apps/shell/` | `legacy/` | ✅ Redirect | Shell delegates to legacy via redirect/iframe |
| `apps/shell/` | `packages/*` | ✅ Yes | Shell loads modern modules directly |

## Generated Dependency Graph

A live graph of the current dependency structure is generated from the code:

```bash
pnpm generate:graph   # → docs/dependency-graph.svg
```

This SVG is the authoritative visual representation of the current package
topology and must be regenerated whenever package boundaries change.
