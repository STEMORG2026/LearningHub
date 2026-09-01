# Playbook: Review

**Version:** 3.0.0
**Gate:** PR → Merge
**Applies To:** reviewing a STEM-TUITION change before merge (self-review or peer/agent review)

---

## Purpose

A change is merge-worthy only when a reviewer — human or agent — has checked
**accuracy, governance, scope, and safety**, not just that it builds.

## How to review

1. **[ ] Confirm the change is scoped.**
   The diff must match the declared `NOW` scope. Flag anything that silently expands
   scope (new deps outside the task, unrelated refactors, new platform features).
   *(Evidence: a short statement of what the diff *is* vs *is not*.)*
2. **[ ] Confirm governance boundaries.**
   - **Canonical facts** must come from LearningHubSTEM (no hand-editing of knowledge in
     STEM-TUITION). Narrative/pedagogy is consumer-owned (§35) — fine here, and it must
     not be pushed back into LearningHubSTEM.
   - **Imports**: no direct imports between sibling `packages/*` (except `core`,
     `tracer`); cross-package via EventBus/adapters.
   - **Purity**: business logic in packages must be DOM-free; DOM only in Web Component
     lifecycle callbacks / ACL adapters.
   - **No secrets**: gitleaks/CI secret scan green; no keys in the diff.
   *(Evidence: lint:arch + a source read for the purity/import rules.)*
3. **[ ] Confirm the educational accuracy** (for content changes).
   For each figure/timeline/perspective/deep-dive:
   - the person is correctly named with true role and lifetime;
   - the statement is genuinely theirs and correctly sourced (or no statement is claimed);
   - dates are correct (oldest-first timelines);
   - a respected/differing view is **given its due weight** — not caricatured,
     not flattened, not silently dropped.
   Flag any attribution you cannot verify. *(Evidence: the source cited for each claim;
   unresolved sources are review blockers.)*
4. **[ ] Confirm the change is tested.**
   - New section kinds/features have unit tests (composer, renderer).
   - Content changes have at least one integration/regression test.
   - The PR's test suite ran and passed. *(Evidence: named tests + pass output.)*
5. **[ ] Confirm architecture/typing.**
   - `strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`,
     `verbatimModuleSyntax` respected. Optional fields never assigned `undefined`.
   - Cross-package types resolve from rebuilt `dist` (rebuild `content-provider` first).
   *(Evidence: typecheck green.)*
6. **[ ] Confirm the release trail.**
   - Conventional commit messages (allowed scope in `.commitlintrc.json`).
   - A changeset exists when package behaviour changed (`.` `changeset/*.md`).
   - CI's `Commit messages` / `Changeset requirement` checks green (or pre-existing).
7. **[ ] Confirm docs are in sync.** `pnpm docs:sync` → clean AUTO regions.
8. **[ ] Decision.** `approve` / `request changes` with the specific blocking item named.

## Merge conditions

A merge requires:
- [ ] CI `Verify governance` green **or** the documented infra-blocked substitute
      (see `verify.md`).
- [ ] No open `[CRIT]`/`[HIGH]` test-checklist items affected by the change
      (`docs/testing/education-platform-checklist.md`).
- [ ] The change is on `main` only after a green gate (per `AGENTS.md` deploy rules:
      production deploys are CI-gated, preview-only from PRs).

## Definition of done

- [ ] Diff matched to scope; nothing silent.
- [ ] Governance boundaries (facts ↔ pedagogy, imports, purity, secrets) verified.
- [ ] Every historical claim sourced or flagged.
- [ ] Tests present and passing.
- [ ] Clean conventional-commit + changeset trail.
- [ ] Green gate (or documented substitute).