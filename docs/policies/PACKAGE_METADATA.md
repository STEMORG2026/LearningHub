# Package Metadata Standard

**Version:** 3.0.0
**Status:** Active Evolution
**Owner:** Architecture
**Related:** `RULES.md` → Package Metadata, `docs/ARCHITECTURE/README.md` → Package Maturity, `REPOSITORY_HEALTH.md`
**Applies To:** every `packages/*` and `apps/*`

---

## Purpose

Every workspace package declares its architecture in a single machine-readable
file: `ARCHITECTURE.toml` at the package root. It answers **who owns this, what
stage is it in, what are its public contracts, who may it depend on, and which
ADRs govern it** — the metadata the health dashboard and the package maturity
table are built from.

---

## Schema

```toml
# ARCHITECTURE.toml — package metadata standard (docs/policies/PACKAGE_METADATA.md)
owner = "Core Team"                # owning team / named maintainer (architect review = this person)
status = "stable"                    # lifecycle: experimental | incubating | stable | legacy | deprecated | archived
maturity = "proven"                  # maturity: incubating | proven | mature (plus legacy exit path)
contracts = ["api", "interface"]     # contract classes exported (see below)
publicApi = "src/index.ts"           # the public entry point (what the world may import)
dependencies = ["tracer"]            # workspace packages this package depends on (importable)
adrs = [1, 2]                        # ADRs that govern this package (docs/adr/NNN-*.md)
```

### Fields

| Field | Required | Values | Meaning |
|-------|----------|--------|---------|
| `owner` | ✅ | string | Owning team or named maintainer; "architect review" resolves here |
| `status` | ✅ | one of 6 lifecycle states | Package lifecycle state (see `PACKAGE_LIFECYCLE.md`) |
| `maturity` | ✅ | `incubating` / `proven` / `mature` | Confidence level (health score input) |
| `contracts` | ✅ | array of contract classes | Contract classes this package exports (see below) |
| `publicApi` | ✅ | file path | Public entry point (usually `src/index.ts`) |
| `dependencies` | ✅ | array of workspace package names | Importable workspace packages (must also be declared in `package.json`) |
| `adrs` | ✅ | array of integers | ADRs governing this package; each must exist in `docs/adr/` |

### Contract classes

`contracts` lists the classes of public contract the package exports. Valid
classes: `api`, `interface`, `event`, `adapter`, `schema`, `configuration`,
`cli`, `environment-variables`. The health dashboard and `docs:sync` read these
directly; `pnpm lint:registry` rejects unknown classes.

### Lifecycle states

`experimental` (new, breaking allowed) → `incubating` → `stable` → `legacy` →
`deprecated` → `archived`. New packages start at `experimental`. Status changes
require an ADR (see `PACKAGE_LIFECYCLE.md`).

### Maturity levels

- `incubating` — new or heavily changing; breaking changes allowed
- `proven` — used in production, stable public API
- `mature` — long-lived, stable for many releases (e.g. `core`)

---

## Rules

1. **Required everywhere.** Every `packages/*` and `apps/*` MUST have an
   `ARCHITECTURE.toml`. `pnpm lint:registry` fails on a missing file.
2. **No undefined references.** `dependencies` entries must exist as workspace
   packages; `adrs` entries must match a file in `docs/adr/`; both are enforced.
3. **Consistency with the registry.** The metadata is the source for the health
   dashboard; do not hand-edit `REPOSITORY_HEALTH.md` (it is regenerated).
4. **One place for the truth.** Contract lists live here, not duplicated in prose.
   Prose sections in `docs/ARCHITECTURE/README.md` are summaries that link here.
5. **Changes need an ADR** when they alter the package's public contract or status.

---

## Example

`packages/core/ARCHITECTURE.toml`:

```toml
# ARCHITECTURE.toml — package metadata standard (docs/policies/PACKAGE_METADATA.md)
owner = "Core Team"
status = "stable"
maturity = "mature"
contracts = ["api", "interface", "schema"]
publicApi = "src/index.ts"
dependencies = []
adrs = [1, 2, 3, 4]
```

---

## CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 3.0.0 | 2026-08-01 | Initial standard: `ARCHITECTURE.toml` schema, rules, lifecycle/maturity definitions |
