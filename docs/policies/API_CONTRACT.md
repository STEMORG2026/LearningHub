# API Contract

**Version:** 3.0.0
**Status:** Enforced
**Owner:** Architecture
**Applies To:** All packages and apps
**Related:** `RULES.md`, `EVENT_BUS_CONTRACT.md`, `VERSIONING.md`, `docs/adr/003-event-bus-communication.md`

---

## Purpose

This document governs **public contracts** — everything a package exposes to
other packages, apps, or the outside world. Public contracts are versioned,
immutable once accepted, and changed only through the deprecation process.

---

## 1. Contract Classes

Every public contract belongs to exactly one class. All classes are versioned.

| Class | Examples |
|-------|----------|
| **API** | exported functions, classes, methods, return values |
| **Interface** | `export interface` types consumed across packages |
| **Event** | Event Bus event names + payloads (`domain:action`) |
| **Adapter** | `packages/acl/` adapter signatures wrapping legacy |
| **Schema** | validated data shapes (e.g., quiz question schema) |
| **Configuration** | package/component configuration options |
| **CLI** | script commands and their flags |
| **Environment Variables** | env vars read at runtime/build time |

## 2. What Is "Public"?

A contract is **public** (governed here) when it is:

- exported from a package's public entry (`src/index.ts`), or
- consumed by another workspace package or app, or
- referenced by a component registry (`docs/component-registry/`) entry, or
- defined as an Event in `EVENT_BUS_CONTRACT.md`.

Internal helpers are exempt but SHOULD stay unexported.

## 3. Versioning Guarantees

Follows SemVer (`VERSIONING.md`):

- **MAJOR** — breaking change to any public contract
- **MINOR** — additive, backward-compatible change (new export, new optional field)
- **PATCH** — backward-compatible fix

**Compatibility guarantee:** additive changes are always safe for consumers.
Breaking changes require a MAJOR release and a documented migration path.

## 4. Contract Lifecycle

```
Draft → Stable → Deprecated → Removed
```

- **Draft** — experimental, may change without notice; must be marked `@experimental`
- **Stable** — accepted contract, immutable until deprecated
- **Deprecated** — still works, fully tested, marked `@deprecated`; removal only in
  a future MAJOR (see `VERSIONING.md` → Deprecation)
- **Removed** — deleted in a MAJOR release after a deprecation cycle

## 5. Rules

1. **Interfaces before implementation** — a public interface is defined and
   reviewed before its implementation (interface-first).
2. **Immutable once stable** — a stable contract is never edited in place; change
   via addition (new version) or deprecation.
3. **Events** — every event is versioned and listed in `EVENT_BUS_CONTRACT.md`
   before use; adding or changing an event requires Event Bus review.
4. **Schemas** — validated data shapes carry a schema version and reject unknown
   fields per their configuration.
5. **Migration requirement** — every breaking change ships a migration note
   (JSDoc + `CHANGELOG.md` + registry STATE.md update).
6. **Deprecated contracts MUST remain fully tested until removal.**

## 6. Review Requirements

Any new or changed public contract requires:

- ADR (new package / public interface / Event Bus change) — see `docs/adr/README.md`
- Architect review — see `docs/RULES.md` → Decision Matrix
- Component registry update — `docs/lint:registry` must stay green
