# STEM-TUITION: Agent Instructions

> On session resume, re-read this file and the governance files it references before making changes.

---

## Required Reading (in this order)

1. **`AGENTS.md`** (this file) — quick reference
2. **`docs/CONSTITUTION.md`** — development constitution: ecosystem vision, operating principles, governance overview (this file is the development constitution)
3. **`docs/RULES.md`** — non-negotiable coding rules (697 lines, ENFORCED)
4. **`docs/policies/HUMAN_INVOLVEMENT.md`** — who decides vs. what automation does (release gates, doc ownership)
5. **`docs/ARCHITECTURE/README.md`** — architecture charter: module layout, import rules, data flow (the charter moved from `docs/ARCHITECTURE.md` to `docs/ARCHITECTURE/README.md`)
6. **`docs/policies/EVENT_BUS_CONTRACT.md`** — event naming, payloads, versioning (277 lines, ENFORCED)
7. **`docs/guides/COMPONENT_STANDARDS.md`** — Web Component patterns (414 lines, ENFORCED)
8. **`docs/adr/001-011`** — architecture decisions (11 files)
9. **`docs/ROADMAP.md`** — current phase, what's next (258 lines)

---

## Setup

```bash
pnpm install          # install all workspace dependencies
pnpm setup-hooks      # configure core.hooksPath = scripts/git-hooks
```

`pnpm setup-hooks` is required for a fresh clone — the pre-commit hook is tracked in
`scripts/git-hooks/` but only activated by `core.hooksPath`, which is a local (non-committed)
git config. Without it, commits skip documentation synchronization.

---

## Non-Negotiable Rules (summary)

### Legacy Isolation
- ❌ No direct imports from `legacy/` — use `packages/acl/` adapters
- ❌ No modifying files under `legacy/` (frozen zone)

### Business Logic Purity
- ✅ Business logic = pure functions, no DOM, no `window`, no `document`
- ✅ DOM access only in Web Component lifecycle callbacks or ACL adapters

### No Global Mutable State
- ❌ No `let`/`var` at module scope (except module-level singletons with guards)
- ❌ No assigning to `window.*`

### Cross-Package Communication
- ❌ No direct imports between `packages/*` packages (except `core` and `tracer`)
- ✅ All cross-module calls go through `EventBus.publish()`/`subscribe()`
- ✅ Event names follow `domain:action` pattern (e.g., `quiz:answer-submitted`)

### TypeScript
- `strict: true`, `exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true`
- `verbatimModuleSyntax: true` — use `import type` for type-only imports

### Testing
- Core logic: ≥95% line coverage
- Tests alongside code, same PR
- Run `pnpm test --filter="@stem-tuition/<pkg>"` before committing

---

## Verification Commands

```bash
pnpm typecheck          # 16 tasks, must all pass
pnpm test               # 15 tasks, must all pass
pnpm verify-governance  # CI pipeline (runs lint:arch, typecheck, test:coverage, etc.)
```

---

## Phase Map

<!-- AUTO:phase-map -->
```
PHASE 0 ██████████  Foundation
PHASE 1 ██████████  Tracer (observability)
PHASE 2 ██████████  Audio Synth extraction
PHASE 3 ██████████  Event Bus + ACL
PHASE 4 ██████████  Quiz Engine extraction
PHASE 5 ██████████  Hover Engine extraction
PHASE 6 ██████████  Physics Core extraction
PHASE 7 ░░░░░░░░░░  Features (auth, progress, admin)   ← CURRENT
```
<!-- END AUTO:phase-map -->

Current phase details in `docs/ROADMAP.md`.

---

## Package Map

<!-- AUTO:package-map -->
| Package | Responsibility | Key files |
|---------|---------------|-----------|
| `packages/core/` | Foundation | `src/event-bus.ts, src/index.ts, src/types.ts` |
| `packages/tracer/` | Tracer (observability) | `src/dashboard.ts, src/decorator.ts, src/index.ts, src/tracer.ts, src/types.ts` |
| `packages/audio-synth/` | Audio Synth extraction | `src/engine.ts, src/index.ts, src/synth.ts, src/types.ts` |
| `packages/core/` | Event Bus + ACL | `src/event-bus.ts, src/index.ts, src/types.ts` |
| `packages/acl/` | Event Bus + ACL | `src/canvas-adapter.ts, src/index.ts` |
| `packages/quiz-engine/` | Quiz Engine extraction | `src/data.ts, src/index.ts, src/types.ts` |
| `packages/hover-engine/` | Hover Engine extraction | `src/hover-state.ts, src/index.ts, src/types.ts` |
| `packages/simulation-core/` | Physics Core extraction | `src/config.ts, src/create-body.ts, src/index.ts, src/physics.ts, src/types.ts` |
<!-- END AUTO:package-map -->

---

## Documentation Synchronization

`pnpm docs:sync` is the deterministic documentation synchronizer
(`scripts/generate/docs-sync.mjs` + `scripts/generate/sync-versions.mjs`). It runs automatically on
every commit via the tracked pre-commit hook and during the release pipeline.

- `<!-- AUTO:... -->` regions are machine-owned. They are derived from `.phase.json`
  and `packages/*` on disk — do not hand-edit them; they get overwritten.
- Machine-owned (always regenerated): ROADMAP progress/status, AGENTS phase-map and
  package-map, the TESTING table.
- RENDERING/STATE markers are filled only for **newly-completed** phases
  (`status: completed` + `completedDate: null`). Once a phase is released, its
  RENDERING/STATE rows are human-curated and preserved — do not wholesale-regenerate them.
- `currentPhase` is **derived** from `.phase.json` (first phase that is not `completed`).
- Phase completion is a **human decision**: set `status: "completed"` in `.phase.json`
  and leave `completedVersion` / `completedDate` as `null`. The release pipeline fills
  those fields at release time.

---

## Pre-Generation Checklist (from `docs/RULES.md:507`)

Before writing any code, verify:
1. Target directory is `packages/*` or `apps/*`, never `legacy/`
2. No existing similar functionality in the codebase
3. Interfaces/types defined before implementation
4. Test coverage strategy identified
5. Educational impact considered (for learning modules)
6. Architectural constraints reviewed (import rules, EventBus, etc.)

---

---

## Release Workflow — Human Approval Required

After `pnpm release:prepare`, the agent MUST STOP and report the complete
release candidate to the human. Do NOT run any of the following without
explicit human approval:

- `git add -A`
- `pnpm release:validate`
- `pnpm release:version`
- `pnpm release:finalize`

The release pipeline sequence is:

```
agent work → prepare → human approval → git add → validate → version → finalize
```

The validation token authorizes the complete staged baseline.
The mutation allowlist governs only pipeline-introduced mutations after validation.
Phase source files (e.g., `packages/*/src/*`) are not added to the mutation allowlist.

Rules that govern the workflow:

- **Normal commits are not releases.** Committing work (which auto-runs `docs:sync`
  via the pre-commit hook) never bumps versions or creates tags.
- **Changesets record release intent only.** Creating a Changeset does not trigger a
  release; releases only happen through the four-stage pipeline.
- **The four-stage pipeline is the only official release workflow.** Direct
  `pnpm changeset version` is disabled.
- `git add -A` is mandatory before `pnpm release:validate` — it establishes the
  validated baseline that `release:validate` fingerprints with `git write-tree`.
- See `docs/policies/HUMAN_INVOLVEMENT.md` for the full human vs. automation contract.

---

## Self-Correction Protocol

If you detect a rule violation during generation:
1. Stop immediately
2. Report the specific rule violation
3. Propose an alternative
4. Wait for confirmation before proceeding
