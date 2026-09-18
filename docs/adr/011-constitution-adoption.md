---
title: "ADR-011: Adoption of the Development Constitution"
status: ACCEPTED
date: 2026-08-11
last_updated: 2026-08-11
canonical: true
---

# ADR-011: Adoption of the Development Constitution

## Status
Accepted

## Date
2026-08-11

## Context
The project governs via `docs/RULES.md` (the enforcement entry point) and a
document taxonomy defined in `docs/DOCS.md`, but lacked a top-level
**development constitution** that frames the long-term STEM ecosystem vision
(LearningHubSTEM, STEM Lab, STEM Game, JARVIS), the operating principles for
humans and AI agents, and the governance overview (interfaces, human checkpoints,
architecture exceptions, AI prompt preservation, decision escalation, session
protocol). Such a constitution was drafted by the human developer as the *STEM
ECOSYSTEM — DEVELOPMENT ARCHITECTURE, STANDARDS & GOVERNANCE* specification. This
ADR records its adoption and the reconciliation of the spec's proposed structure
with the repository's existing taxonomy.

## Decision
1. **Adopt the specification as `docs/CONSTITUTION.md`** — the canonical governing
   development document for the STEM ecosystem, pinned to the current product
   STEM-TUITION. It is added with repo-standard front matter (`**Version:**`,
   Status, Owner, Applies To, Related) so `scripts/generate/sync-versions.mjs`
   stamps it on `pnpm docs:sync`.
2. **`docs/RULES.md` remains the normative enforcement entry point.** The two
   documents are kept separate and not merged or duplicated:
   - `CONSTITUTION.md` owns the development process, ecosystem vision, operating
     principles, and governance overview.
   - `RULES.md` owns the enforceable principles, mandatory rules, and enforcement
     mechanisms.
3. **Reconcile the spec's proposed `governance/` layout into the existing
   taxonomy** (`docs/DOCS.md`). No parallel top-level `governance/` directory is
   created:
   - `governance/decisions/` → existing `docs/adr/` (no duplicate).
   - `governance/change-log.md` → existing `docs/CHANGELOG.md`; a
     `docs/governance/change-log.md` stub links to it (no duplicate policy text).
   - `governance/interface-registry.md` → `docs/governance/interface-registry.md`.
   - `governance/human-checkpoints.md` → `docs/governance/human-checkpoints.md`.
   - `governance/ai-prompts/` → `docs/governance/ai-prompts/`.
   - `governance/architecture-exceptions.md` → `docs/governance/architecture-exceptions.md`.
4. **The governance registries are created as minimal stubs** with the
   `lint:registry` header contract (`**Version:**`, `**Purpose:**`). The interface
   registry records `ContentProvider` as a **planned seam only** — no
   LearningHubSTEM integration is implemented.
5. **Register all new documents** in `docs/DOCS.md` (directory + change log),
   `docs/ARCHITECTURE/README.md` (docs-map + related documents), and
   `docs/RULES.md` (references + change log). `docs/AGENTS.md` required-reading
   list gains `docs/CONSTITUTION.md`.
6. **No application/source code changes** are part of this adoption.

## Alternatives Considered
- **Adopt the spec verbatim with a top-level `governance/` directory:** rejected —
  would introduce a parallel governance structure, contradicting `docs/DOCS.md`
  ("Governance policies group under `docs/policies/`... reference machinery keeps
  files at the root") and the repository rule that policy text is authored once.
- **Split the spec into a vision doc + fold norms into existing policies:** rejected
  for this change — more invasive; the human specified `docs/CONSTITUTION.md` as the
  canonical governing document with `RULES.md` kept as the enforcement entry point.
- **Make `CONSTITUTION.md` supersede `RULES.md`:** rejected — `RULES.md` remains the
  normative enforcement entry point per the human decision.

## Consequences
### Positive
- Single canonical governing document framing the ecosystem vision and development
  process, with explicit NOW/SEAM/LATER/OUT-OF-SCOPE discipline.
- Governance registries (interface registry, human checkpoints, AI prompts,
  architecture exceptions) give future humans/AI agents durable records.
- No duplicate policy text; all mappings point at existing canonical documents.
- `ContentProvider` seam is documented without speculative implementation.

### Negative
- A second top-level governance document (`CONSTITUTION.md`) increases the surface
  of "required reading"; this is mitigated by cross-referencing in `RULES.md`,
  `AGENTS.md`, and the architecture docs-map.
- The registry stubs carry no enforcement yet — they rely on human discipline until
  an automated check is added (deferred).

### Neutral
- `docs:sync` stamps the `**Version:**` header from `package.json` (3.0.0).
- The constitution references `docs/governance/*` which now exist as stubs.

## Known Gaps (accepted, deferred)
1. No automated check enforces the interface-registry freeze process yet.
2. `docs/governance/ai-prompts/` contains only a `README.md`; the first preserved
   prompt entry is recorded in its index.
3. The constitution's §22 recommends `governance/ai-prompts/` entries; preservation
   of significant prompts is an ongoing human/AI discipline, not automated.

## Compliance
- [x] `docs/CONSTITUTION.md` created as the canonical governing document
- [x] `docs/RULES.md` retained as normative enforcement entry point (not merged/duplicated)
- [x] Existing taxonomy preserved; `governance/` reconciled under `docs/`
- [x] No future ecosystem capabilities implemented
- [x] `ContentProvider` recorded as planned seam only; no LearningHubSTEM integration
- [x] No application/source code modified
- [x] Governance registries created as stubs
- [x] Documents registered in `DOCS.md`, `ARCHITECTURE/README.md`, `RULES.md`, `AGENTS.md`
