# Docs Taxonomy

**Version:** 3.0.0
**Status:** Active Evolution
**Owner:** Architecture
**Related:** `RULES.md`, `docs/ARCHITECTURE/README.md`, `REPOSITORY_HEALTH.md`, `PACKAGE_METADATA.md`
**Applies To:** `docs/`

---

## Purpose

This document defines how the `docs/` tree is organized: what kind of document
lives where, who owns it, and how it gets updated. It is the map for
`docs/ARCHITECTURE/README.md`'s Documentation Map section and resolves the old
flat-vs-directory ambiguity (ADR-tracked decision).

---

## Document Kinds

| Kind | Location | Owned by | Update source |
|------|----------|----------|---------------|
| **Governance policy** (normative) | Flat, `docs/` | Architect | Human-authored, ADR-tracked |
| **Architecture charter + C4 diagrams** | `docs/ARCHITECTURE/` | Architect | Charter prose is hand-maintained; diagrams regen on topology changes |
| **Decision log** | `docs/adr/` | Architect | One file per decision, numbered |
| **Component inventory** | `docs/component-registry/` | Automation + contributors | `docs:sync` / registry PRs |
| **Generated operational docs** | `docs/REPOSITORY_HEALTH.md`, `docs/dependency-graph.svg` | Automation | `pnpm docs:sync`, `pnpm generate:graph` |
| **Standards & guides** (non-normative) | Flat, `docs/` | Varies | Human-authored, maintainer-reviewed |

---

## Flat vs. Directory

The single top-level `ARCHITECTURE.md` was superseded by the `docs/ARCHITECTURE/`
directory (charter `README.md` + C4 set). The same pattern applies going forward:

- **A single top-level concept stays a flat file** (e.g. `EVENT_BUS_CONTRACT.md`).
- **A multi-document concept becomes a directory** with a `README.md` index.
  The `README.md` is the entry point; sibling files hold detail.

The docs-map graph in `docs/ARCHITECTURE/README.md` is the canonical overview and
MUST be updated when the tree gains or loses a top-level entry.

---

## Ownership & Update Rules

1. **Policy text is authored once** — a governance topic lives in exactly one
   normative document; every other reference is a link, not a copy.
2. **Generated content is never hand-edited.** `<!-- AUTO:... -->` regions in
   `ROADMAP.md`, `AGENTS.md`, and the TESTING table are owned by
   `scripts/docs-sync.mjs`. `REPOSITORY_HEALTH.md` is owned by
   `scripts/generate-health.mjs`. `docs/dependency-graph.svg` by
   `scripts/generate-graph.mjs`. Hand-edits are overwritten.
3. **Removal requires a deprecation note.** Before deleting a doc, add a one-line
   pointer in this file and in `CHANGELOG.md` explaining the replacement, then
   remove after one release cycle.
4. **New docs must be registered** here, in `docs/ARCHITECTURE/README.md`'s
   related-documents table, and in `RULES.md` References when they carry policy.
5. **Broken links fail CI** via `pnpm lint:registry` reference checking.

---

## Directory

| Document | Kind | Owner | Updated by |
|----------|------|-------|------------|
| `RULES.md` | Governance entry point | Architect | Human + `docs:sync` |
| `ARCHITECTURE/` | Charter + C4 set | Architect | Human (+ graph regen) |
| `API_CONTRACT.md` | Governance policy | Architect | Human |
| `EVENT_BUS_CONTRACT.md` | Governance policy | Architect | Human |
| `VERSIONING.md` | Governance policy | Architect | Human |
| `DEPENDENCY_POLICY.md` | Governance policy | Architect | Human |
| `RELIABILITY.md` | Governance policy | Architect | Human |
| `OBSERVABILITY.md` | Governance policy | Architect | Human |
| `PACKAGE_LIFECYCLE.md` | Governance policy | Architect | Human |
| `PACKAGE_METADATA.md` | Governance policy | Architect | Human |
| `COMPONENT_STANDARDS.md` | Standard | Maintainer | Human |
| `ACCESSIBILITY.md` | Standard | Maintainer | Human |
| `SECURITY.md` | Standard | Maintainer | Human |
| `PERFORMANCE.md` | Standard | Maintainer | Human |
| `HUMAN_INVOLVEMENT.md` | Contract | Architect | Human |
| `QUICKSTART.md` | Guide | Maintainer | Human |
| `DEBUGGING.md` | Guide | Maintainer | Human |
| `DOCS.md` | Taxonomy | Architect | Human (this file) |
| `REPOSITORY_HEALTH.md` | Generated | Automation | `docs:sync` |
| `dependency-graph.svg` | Generated | Automation | `generate:graph` |
| `ROADMAP.md` | Plan | Architect | Human + `docs:sync` |
| `CHANGELOG.md` | History | Automation | Release pipeline |
| `DEVLOG.md` | Diary | Contributors | Human |
| `component-registry/` | Inventory | Automation | Registry PRs |
| `adr/` | Decision log | Architect | One file per ADR |

---

## CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 3.0.0 | 2026-08-01 | Initial taxonomy: flat-vs-directory rule, ownership table, generated-content policy |
