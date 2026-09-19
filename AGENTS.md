# LearningHub: Agent Instructions & Governance

> On session resume, re-read this file and the canonical governance files before making changes.

---

## Required Reading (in precedence order)

1. **`AGENTS.md`** (this file) — quick reference & AI agent safety protocol
2. **`docs/VISION.md`** — **CANONICAL VISION**: ecosystem purpose, product agnosticism, scope boundaries
3. **`docs/ECOSYSTEM.md`** — **ECOSYSTEM ARCHITECTURE**: topology, project roles, STEMXIS shared infrastructure matrix
4. **`docs/CONSTITUTION.md`** — **DEVELOPMENT CONSTITUTION**: operating principles & development governance
5. **`docs/RULES.md`** — **NON-NEGOTIABLE TECHNICAL RULES** (ENFORCED)
6. **`docs/ARCHITECTURE/README.md`** — **ARCHITECTURE CHARTER**: package layout, data flow, dependency rules
7. **`docs/policies/EVENT_BUS_CONTRACT.md`** — event naming, payloads, versioning (ENFORCED)
8. **`docs/guides/COMPONENT_STANDARDS.md`** — Web Component patterns (ENFORCED)
9. **`docs/adr/`** — Architecture Decision Records (see `docs/adr/README.md`)
10. **`docs/archive/`** — Historical material & superseded plans (HISTORICAL ONLY — DO NOT TREAT AS CANONICAL)

---

## 🛡️ AI Agent Context Hygiene & Conflict Resolution

To prevent AI context contamination and accidental reliance on stale/superseded historical plans:

1. **Canonical Precedence Hierarchy:**
   `docs/VISION.md` > `docs/ECOSYSTEM.md` > `docs/CONSTITUTION.md` > `docs/RULES.md` > `docs/ARCHITECTURE/README.md` > `AGENTS.md`
2. **Strict Archival Rule:**
   Documents located under `docs/archive/` or containing front-matter headers `status: HISTORICAL`, `status: SUPERSEDED`, `status: ARCHIVED`, or `status: FUTURE_PROPOSAL` are strictly non-canonical information. **AI agents MUST NOT use archived or superseded documents as current implementation requirements.**
3. **Conflict Resolution:**
   If a historical document (e.g., an old ADR or devlog) conflicts with a file higher in the Canonical Precedence Hierarchy, the canonical document MUST govern. Update or supersede the stale document instead of incorporating contradictory requirements.

---

## Setup

```bash
pnpm install          # install all project dependencies
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
- Core logic (new modules): ≥95% line coverage; enforced floor is each package's
  per-package coverage ratchet (`vitest.config.*.ts` → `docs/REPOSITORY_HEALTH.md`)
- Tests alongside code, same PR
- Run `pnpm test --filter="@learninghub/<pkg>"` before committing

---

## Orchestration & Agent Protocol

LearningHub operates within an ecosystem of SOTA agent harnesses. The orchestration plane coordinates these agents via the **Agent Client Protocol (ACP)**.

### Reference Systems

| System | Architecture | Integration |
|--------|-------------|-------------|
| **DeepSeek Harness (dsh)** | Cordis plugin framework, 50+ packages | ACP server → `dsh --profile headless` |
| **Hermes Agent** | AIAgent class + tool registry | ACP client → Hermes gateway |
| **OpenCode** | TUI + headless server + web | ACP server → `opencode serve` |
| **AGY CLI** | Google AI agent CLI | CLI subprocess |

### Orchestration Rules

1. **ACP-first** — Agent Client Protocol is the lingua franca
2. **No package-level coupling** — All integration via ACP JSON-RPC
3. **Subagent delegation** — Route tasks to most capable subagent
4. **Graceful degradation** — Fall back to local execution
5. **Sandboxed by default** — All child execution through bubblewrap/E2B

See `docs/VISION.md` §5 and `docs/ECOSYSTEM.md` §6 for full details.

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
PHASE 7 █████░░░░░  Features (auth, progress, admin, payments, video)   ← CURRENT
PHASE 8 █████░░░░░  Content & Lessons
PHASE 9 ░░░░░░░░░░  Agent Integration Foundation
PHASE 10 ░░░░░░░░░░  Governance Extensions
PHASE 11 ░░░░░░░░░░  Ecosystem Tooling
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
| `packages/auth/` | Features (auth, progress, admin, payments, video) | `src/index.ts, src/types.ts` |
| `packages/progress/` | Features (auth, progress, admin, payments, video) | `src/index.ts, src/types.ts` |
| `packages/admin/` | Features (auth, progress, admin, payments, video) | `src/index.ts, src/types.ts` |
| `packages/payments/` | Features (auth, progress, admin, payments, video) | `src/index.ts, src/types.ts` |
| `packages/video/` | Features (auth, progress, admin, payments, video) | `src/index.ts, src/types.ts` |
| `packages/content-provider/` | Content & Lessons | `src/content-provider.ts, src/index.ts, src/lhs-adapter.ts, src/local-content-provider.ts, src/narrative.ts, src/quiz-mapper.ts, src/types.ts` |
| `packages/interactive-simulations/` | Content & Lessons | `src/index.ts, src/stem-circuit-sim.ts, src/stem-mechanics-sim.ts` |
| `packages/lesson-renderer/` | Content & Lessons | `src/index.ts, src/stem-lesson.ts` |
| `packages/content-engine/` | Content & Lessons | `src/blueprint.ts, src/formats.ts, src/index.ts, src/pipeline.ts, src/request.ts, src/verification.ts` |
| `packages/pj-client/` | Agent Integration Foundation | `src/client.ts, src/index.ts` |
| `packages/pj-types/` | Agent Integration Foundation | `src/index.ts, src/types.ts` |
| `packages/pj-auth/` | Agent Integration Foundation | `src/index.ts, src/token.ts` |
| `packages/pj-audit/` | Governance Extensions | `src/audit.ts, src/index.ts` |
| `packages/pj-policy/` | Governance Extensions | `src/index.ts, src/policy.ts` |
| `packages/ecosystem-dashboard/` | Ecosystem Tooling | `src/dashboard.ts, src/index.ts` |
| `packages/cross-repo-visibility/` | Ecosystem Tooling | `src/index.ts, src/metrics.ts` |
<!-- END AUTO:package-map -->

---

## Future Package Map (Phases 9–11)

| Package | Phase | Responsibility | Status |
|---------|-------|----------------|--------|
| `packages/acp-server/` | 9 | Agent Client Protocol server | PLANNED |
| `packages/subagent-manager/` | 9 | Spawn, control, steer, stop child agents | PLANNED |
| `packages/plugin-registry/` | 9 | Runtime capability discovery | PLANNED |
| `packages/hooks-system/` | 9 | Claude Code + Codex bridge | PLANNED |
| `packages/agent-router/` | 9 | Classify tasks, route to subagents | PLANNED |
| `packages/session-manager/` | 10 | Fork, resume, export, import sessions | PLANNED |
| `packages/tool-search/` | 10 | Find tools across connected agents | PLANNED |
| `packages/sandbox/` | 10 | Bubblewrap/E2B isolation | PLANNED |
| `packages/task-tracker/` | 10 | Todo/Plan/Goal decomposition | PLANNED |
| `packages/scheduler/` | 10 | Cron-like task scheduling | PLANNED |
| `packages/model-clients/` | 11 | 17+ LLM provider clients | PLANNED |
| `packages/memory/` | 11 | Hybrid BM25+Chroma memory | PLANNED |
| `packages/web-tools/` | 11 | Web search/fetch | PLANNED |
| `packages/browser/` | 11 | Browser control | PLANNED |
| `packages/computer-use/` | 11 | Desktop control | PLANNED |

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

## Deployment — Gated by CI

Production deploys are **gated**: nothing ships until CI is green.

- Cloudflare Pages git-integration **automatic production deployments are
  disabled** (dashboard: Builds & deployments → Branch control). The repo's
  GitHub integration is used for **preview (PR/branch) deployments only**.
- `Deploy to Cloudflare Pages (gated)` (`.github/workflows/deploy.yml`) is
  triggered by `workflow_run` on the **CI** workflow and deploys only when:
  1. CI completes with `conclusion == 'success'`, and
  2. the run is on `main` (`workflow_run.head_branch`).
- The CI gate is authoritative: its `Verify governance` job runs the full suite
  (typecheck, unit coverage, build, and the entire Playwright suite — core,
  accessibility, visual regression) plus docs-freshness, Lighthouse budgets,
  dependency audit, and signed-tag/commit-message checks.
- The deploy itself: `wrangler pages deploy apps/shell/dist --project-name=learninghub --branch=main`
  using the `CF_API_TOKEN` / `CF_ACCOUNT_ID` secrets, followed by an HTTP 200
  health check against `https://learninghub.pages.dev/`.
- `workflow_run` runs get a read-only token with no `actions` scope — the deploy
  workflow must not call the GitHub Actions API (no `gh api .../actions/runs`).

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
