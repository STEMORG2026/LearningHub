# LearningHub Archival Index & Strategy

---
status: CANONICAL
canonical: true
owner: Architecture / Governance
last_updated: 2026-09-04
---

## 1. Archival Purpose & Strategy

LearningHub maintains an explicit archival system to preserve the project's history, architectural evolution, superseded migration plans, and historical research without allowing them to contaminate the **current canonical truth**.

### Core Archival Invariants:
1. **Preservation without Contamination:** Historical documents, roadmaps, and plans are NEVER silently deleted if they contain project memory or useful future ideas. However, they are strictly isolated from current architecture.
2. **Machine-Readable Metadata:** Every document in the repository MUST contain front-matter metadata indicating its status:
   - `status: CANONICAL` — Authoritative, current project truth.
   - `status: SUPERSEDED` — Previously canonical but replaced by a newer vision or architecture.
   - `status: HISTORICAL` — Informational records of past state, migrations, or decisions.
   - `status: FUTURE_PROPOSAL` — Research or speculative ideas for future implementation.
   - `status: ARCHIVED` — Decommissioned or inactive documents preserved for historical context.
3. **Agent Non-Contamination:** AI coding agents and human developers MUST NOT use documents marked `status: HISTORICAL`, `status: SUPERSEDED`, or `status: ARCHIVED` as authoritative requirements or current implementation instructions.

---

## 2. Archival Document Roster

| Document Path | Original Context | Lifecycle Status | Superseded By / Current Truth |
|---------------|------------------|------------------|-------------------------------|
| `docs/archive/historical-stem-tuition-plan.md` | Post-rename STEM Tuition implementation plan (2026-09) | `HISTORICAL` | `docs/VISION.md`, `docs/ECOSYSTEM.md` |
| `docs/archive/future-research-content-production-engine-v2.md` | Multi-agent content production engine proposal | `FUTURE_PROPOSAL` | `docs/VISION.md` (Content Engine boundaries) |
| `docs/adr/*` | Architectural Decision Records (ADRs 001–016) | `HISTORICAL` / `DECISION_RECORD` | `docs/CONSTITUTION.md` & specific package specs |

---

## 3. Rules for Archiving Documents

When a document or specification is replaced or becomes obsolete:
1. Do not delete it if it holds historical value.
2. Move it to `docs/archive/` or add a clear header notice with `status: SUPERSEDED` and `superseded_by: <path>`.
3. Remove any references to it as a canonical source from `AGENTS.md`, `README.md`, and `docs/DOCS.md`.
4. Run `pnpm lint:docs` / `pnpm verify-governance` to ensure doc link integrity.
