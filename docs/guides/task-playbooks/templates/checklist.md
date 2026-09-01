# Task: <short kebab-case title>

**Version:** 1.0.0
**Scope classification:** `NOW` / `SEAM` / `LATER` / `OUT OF SCOPE`
**Playbook(s) used:** add-content / verify / review / tests / explained — list which
**Gate target:** Local → PR → Merge

---

## Scope (before any code)

- [ ] Declared `NOW` (what this milestone needs) — one line
- [ ] Declared `SEAM`/`LATER`/`OUT` for everything else (recorded, not implemented)

## Add content (add-content.md)

- [ ] Canonical entity exists in LearningHubSTEM (id: `lhs:*`)
- [ ] `Narratives[id]` entry added in `apps/shell/src/data/narratives.ts`
- [ ] Figures honored (name / lifespan / role / contribution / sourced statement)
- [ ] Timeline present (oldest → newest, dates correct)
- [ ] Differing views honored (each with truthful `standing`)
- [ ] Explained deep-dive present (≥2 rungs, Curious first) per `explained.md`

## Tests (tests.md)

- [ ] Composer/ordering test added (`content-provider/tests/narrative.test.ts`)
- [ ] Renderer test for any new section kind (`stem-lesson.test.ts`)
- [ ] Integration assertion (+ regression) on real data (`narrative-integration.test.ts`)
- [ ] Negative/fallback case present where meaningful

## Verify (verify.md)

- [ ] `pnpm typecheck` → all pass
- [ ] `pnpm test` → all pass
- [ ] `pnpm verify-governance` → exit 0 (or infra-blocked substitute documented)
- [ ] Coverage of new module ≥95% lines
- [ ] Docs in sync (`pnpm docs:sync` clean)

## Review (review.md)

- [ ] Scope matches the diff (nothing silent)
- [ ] Governance boundaries: facts↔pedagogy, imports, purity, secrets — all clean
- [ ] Every historical claim sourced or flagged
- [ ] Conventional commit + changeset present
- [ ] PR opened with test/verification evidence

## Done

- [ ] All evidence named; no `[ ]` without an artefact