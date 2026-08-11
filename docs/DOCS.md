# Docs Taxonomy

**Version:** 3.0.0
**Status:** Active Evolution
**Owner:** Architecture
**Related:** `RULES.md`, `docs/ARCHITECTURE/README.md`, `REPOSITORY_HEALTH.md`, `policies/PACKAGE_METADATA.md`
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
| **Governance policy** (normative) | `docs/policies/` | Architect | Human-authored, ADR-tracked |
| **Architecture charter + C4 diagrams** | `docs/ARCHITECTURE/` | Architect | Charter prose is hand-maintained; diagrams regen on topology changes |
| **Decision log** | `docs/adr/` | Architect | One file per decision, numbered |
| **Component inventory** | `docs/component-registry/` | Automation + contributors | `docs:sync` / registry PRs |
| **Generated operational docs** | `docs/REPOSITORY_HEALTH.md`, `docs/dependency-graph.svg` | Automation | `pnpm docs:sync`, `pnpm generate:graph` |
| **Standards & guides** (non-normative) | `docs/guides/` | Varies | Human-authored, maintainer-reviewed |

---

## Flat vs. Directory

The single top-level `ARCHITECTURE.md` was superseded by the `docs/ARCHITECTURE/`
directory (charter `README.md` + C4 set). The same pattern applies going forward:

- **A single top-level concept stays a flat file** (e.g. `RULES.md`,
  `CHANGELOG.md`).
- **A multi-document concept becomes a directory** with a `README.md` index.
  The `README.md` is the entry point; sibling files hold detail.
- **Governance policies group under `docs/policies/`**; standards, guides, and
  how-tos group under `docs/guides/`. Reference machinery that pins a doc at the
  root (see `scripts/release/*.mjs` and `scripts/generate/*.mjs`) keeps those
  files there.

The docs-map graph in `docs/ARCHITECTURE/README.md` is the canonical overview and
MUST be updated when the tree gains or loses a top-level entry.

---

## Ownership & Update Rules

1. **Policy text is authored once** — a governance topic lives in exactly one
   normative document; every other reference is a link, not a copy.
2. **Generated content is never hand-edited.** `<!-- AUTO:... -->` regions in
   `ROADMAP.md`, `AGENTS.md`, and the TESTING table are owned by
   `scripts/generate/docs-sync.mjs`. `REPOSITORY_HEALTH.md` is owned by
   `scripts/generate/generate-health.mjs`. `docs/dependency-graph.svg` is produced
   by `pnpm generate:graph` (dependency-cruise + graphviz). Hand-edits are overwritten.
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
| `CONSTITUTION.md` | Development constitution (vision, operating principles, governance overview) | Architect | Human |
| `DOCS.md` | Taxonomy | Architect | Human (this file) |
| `REPOSITORY_HEALTH.md` | Generated | Automation | `docs:sync` |
| `dependency-graph.svg` | Generated | Automation | `generate:graph` |
| `ROADMAP.md` | Plan | Architect | Human + `docs:sync` |
| `CHANGELOG.md` | History | Automation | Release pipeline |
| `DEVLOG.md` | Diary | Contributors | Human |
| `ARCHITECTURE/` | Charter + C4 set | Architect | Human (+ graph regen) |
| `policies/API_CONTRACT.md` | Governance policy | Architect | Human |
| `policies/EVENT_BUS_CONTRACT.md` | Governance policy | Architect | Human |
| `policies/VERSIONING.md` | Governance policy | Architect | Human |
| `policies/DEPENDENCY_POLICY.md` | Governance policy | Architect | Human |
| `policies/RELIABILITY.md` | Governance policy | Architect | Human |
| `policies/OBSERVABILITY.md` | Governance policy | Architect | Human |
| `policies/PACKAGE_LIFECYCLE.md` | Governance policy | Architect | Human |
| `policies/PACKAGE_METADATA.md` | Governance policy | Architect | Human |
| `policies/SECURITY.md` | Governance policy | Architect | Human |
| `policies/ACCESSIBILITY.md` | Standard | Maintainer | Human |
| `policies/PERFORMANCE.md` | Standard | Maintainer | Human |
| `policies/HUMAN_INVOLVEMENT.md` | Contract | Architect | Human |
| `governance/interface-registry.md` | Registry | Architect | Human (freeze changes need ADR) |
| `governance/human-checkpoints.md` | Registry | Architect | Human |
| `governance/ai-prompts/README.md` | Registry | Architect | Human |
| `governance/architecture-exceptions.md` | Registry | Architect | Human |
| `governance/change-log.md` | Registry | Architect | Human (points to `CHANGELOG.md`) |
| `guides/QUICKSTART.md` | Guide | Maintainer | Human |
| `guides/DEBUGGING.md` | Guide | Maintainer | Human |
| `guides/COMPONENT_STANDARDS.md` | Standard | Maintainer | Human |
| `guides/GLOSSARY.md` | Reference | Maintainer | Human |
| `guides/FLOWCHARTS.md` | Reference | Maintainer | Human |
| `guides/DEPLOYMENT.md` | Guide | Maintainer | Human |
| `component-registry/` | Inventory | Automation | Registry PRs |
| `adr/` | Decision log | Architect | One file per ADR |
| `testing/UNIVERSAL_TESTING_STANDARD.md` | Standard | Maintainer | Human |
| `testing/education-platform-checklist.md` | Checklist | Product + Dev | Human |
| `testing/pipeline-gap-analysis.md` | Analysis | Product + Dev | Human (working document) |

---

## CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| — | 2026-08-11 | Add `CONSTITUTION.md` (development constitution) and `governance/` registries (interface-registry, human-checkpoints, ai-prompts, architecture-exceptions, change-log) |
| — | 2026-08-02 | Add `docs/testing/pipeline-gap-analysis.md` (current-pipeline vs standard mapping) |
| — | 2026-08-02 | Add `testing/` directory: universal testing standard + education platform checklist |
| 3.0.1 | 2026-08-01 | Group governance policies under `policies/`, standards/guides under `guides/`; root keeps `RULES.md`, `DOCS.md`, `CHANGELOG.md`, `DEVLOG.md`, `ROADMAP.md`, `REPOSITORY_HEALTH.md` |
| 3.0.0 | 2026-08-01 | Initial taxonomy: flat-vs-directory rule, ownership table, generated-content policy |
