# ADR-010: Automated Release & Documentation Governance Pipeline

## Status
Accepted

## Date
2026-07-31

## Context
Phase and version state was scattered and hand-maintained, causing documentation
drift (e.g., RULES.md described a Husky hook setup that never existed; ROADMAP.md
told humans to hand-edit auto-generated markers; DEPLOYMENT.md documented a CI
pipeline that was not implemented). Documentation generation logic was duplicated
across `release-prepare.mjs` and `release-finalize.mjs` as inline blocks. `changeset
version` was directly invocable, bypassing any human approval gate. No document
recorded the human-vs-automation contract, and an early "regenerate everything"
approach to the component registry destroyed hand-curated content for released
phases during verification.

## Decision
1. **`.phase.json` is the canonical phase-state source.** `currentPhase` is derived
   from it (first phase that is not `completed`). Phase completion is a **human
   decision**: set `status: "completed"`, leaving `completedVersion` / `completedDate`
   as `null`. The release pipeline fills those fields at release time.
2. **`scripts/docs-sync.mjs` is the single deterministic documentation synchronizer.**
   It is idempotent, token-free, and regenerates only `<!-- AUTO:... -->` regions:
   - ROADMAP progress/status and AGENTS phase-map/package-map: always regenerated.
   - TESTING table: always regenerated (machine-derived test counts).
   - RENDERING/STATE markers: filled **only for newly-completed phases**
     (`status: completed` + `completedDate: null`). Released-phase rows are
     human-curated and **preserved** — never wholesale-regenerated.
   - It cannot mark phases complete and cannot write `completedVersion`/`completedDate`.
3. **Git hooks are tracked and configured via `core.hooksPath`.**
   `scripts/git-hooks/pre-commit` runs `pnpm docs:sync` + `git add -u` on every
   commit; `pnpm setup-hooks` configures `core.hooksPath = scripts/git-hooks`
   (required per clone — `core.hooksPath` is not cloned).
4. **The four-stage pipeline is the only official release workflow:**
   `release:prepare → human approval → git add -A → release:validate →
   release:version → release:finalize`. Direct `pnpm changeset version` is disabled.
   - **Human approval is mandatory** between `release:prepare` and `release:validate`.
   - `git add -A` establishes the validated baseline; `release:validate` fingerprints
     it with `git write-tree` into `.release-token.json` (gitignored).
   - `release:version` / `release:finalize` enforce a **TOCTOU** check against the
     token's tree hash, and `release:finalize` enforces a strict **mutation allowlist**.
   - **Docs-only releases** are supported: a completed phase with zero Changesets
     skips version bumps/tags and commits phase completion + documentation.
5. **Normal commits are not releases.** Changesets record release intent only.
6. **`vX.Y.Z-dev.N` is derived Git state**, never a package version
   (`git describe --tags` + `git rev-list --count --first-parent`).

## Alternatives Considered
- **Husky + lint-staged:** rejected — adds a dependency, the hook lives outside the
  repo (unversioned), and it was already misdocumented in RULES.md. Tracked hooks via
  `core.hooksPath` are zero-dependency and reproducible.
- **Full regeneration of all AUTO regions including RENDERING/STATE:** rejected —
  destroys human-curated content for released phases (observed during verification).
- **Manual documentation maintenance:** rejected — proven drift (RULES.md hooks,
  ROADMAP.md update instructions, DEPLOYMENT.md CI).
- **Single un-gated release script:** rejected — the operating contract requires a
  human approval boundary.
- **Token-less pipeline:** rejected — nothing would prevent validating a tree and
  then mutating it before versioning/finalizing.

## Consequences
### Positive
- Single source of truth for phase state (`.phase.json`) and documentation generation
  (`docs-sync`), eliminating duplicated inline generation.
- Idempotent, drift-free docs; the pre-commit hook keeps generated sections in sync
  on every commit.
- Enforced human approval + baseline fingerprinting (TOCTOU) + mutation allowlist
  make releases replayable and verifiable.
- The human-vs-automation contract is documented in `docs/HUMAN_INVOLVEMENT.md`.

### Negative
- `core.hooksPath` is a local git config — fresh clones have **no hooks** until
  `pnpm setup-hooks` runs.
- `docs-sync` must be maintained as the single generator; new generated sections
  must be added there, not in the release scripts.
- The RENDERING/STATE hybrid ownership is subtle (newly-completed vs released) and
  must be respected by any future tooling.
- Releases require a clean, fully-staged tree and approval discipline.

### Neutral
- `docs:sync` runs both on commit and inside the pipeline; it is idempotent, so the
  `release:finalize` commit that re-triggers the hook is harmless.
- `vX.Y.Z-dev.N` remains a build-time Git-derived identifier, never a package version.

## Known Gaps (accepted, deferred)
1. `scripts/verify-registry.js` is a **header-level stub** — it checks
   `**Version:**`/`**Purpose:**` presence but not the file:line existence
   enforcement described in ADR-009.
2. `scripts/validate-educational-metadata.js` is a **stub** (always passes).
3. `pnpm lint:circular`, `pnpm lint:state`, and `pnpm lint:dom` exist but are **not
   wired into** `pnpm verify-governance`.
4. **No git tags exist** despite docs referencing `3.0.0`; `pnpm dev-version`
   therefore reports `v0.0.0-dev.0`. Tags are created by `release:finalize`.
5. `docs/component-registry/TRACE.md` is hand-maintained and **not covered by
   `docs-sync`**.
6. No CI/CD exists in the repository; RULES.md and DEPLOYMENT.md document a GitHub
   Actions pipeline as **planned, not implemented**.

## Compliance
- [x] Documentation synchronization is deterministic and idempotent (`docs-sync`)
- [x] Phase state has a single canonical source (`.phase.json`)
- [x] Release approval boundary enforced (token + TOCTOU + mutation allowlist)
- [x] Docs-only releases supported
- [x] Human-vs-automation contract documented (`docs/HUMAN_INVOLVEMENT.md`)
- [ ] Deep registry enforcement (`verify-registry.js`) — gap, deferred
- [ ] CI/CD pipeline — planned, not implemented
