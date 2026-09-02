# Playbook: Verify

**Version:** 3.0.0
**Gate:** Local → Merge
**Applies To:** the deterministic verification loop before any claim of working code

---

## Purpose

You only know a change works when you run the project's actual checks and can match the
evidence to the change surface. "It works" is not evidence; **output is evidence**.

## The verification loop

Work the steps in order. Each produces an artefact you point at.

1. **[ ] Confirm the environment** — `pnpm install` (or `--frozen-lockfile` when the
   lockfile is a known-good baseline) succeeds. *(Evidence: `exit 0`.)*
2. **[ ] Typecheck everything.**
   `pnpm typecheck`
   → all tasks pass. *(Evidence: `Tasks: N successful, N total`.)*
3. **[ ] Run the tests.**
   `pnpm test`
   → all pass. For your package, also the targeted suite. *(Evidence: pass counts,
   the names of tests that cover your change.)*
4. **[ ] Run the full governance gate.**
   `pnpm verify-governance`
   ↳ This runs lint:arch, lint:circular, lint:state, lint:dom, build, typecheck,
   test:coverage, a11y, size, validate-edu, registry. Target: `exit 0`.
5. **[ ] Match evidence to your change surface.**
   For each file you touched, name the check that exercises it. If a check does not
   cover *your* change, add a test or note the gap — do not claim coverage.
6. **[ ] Coverage of your new logic.**
   For any new pure-logic module, confirm meaningful statement coverage
   (`narrative.ts` historically 100%). `pnpm --filter=@learninghub/<pkg> test:coverage`
   *(Evidence: the % line for your module.)*
7. **[ ] Pre-existing vs regression triage.**
   If a gate fails: reproduce on a clean `main` checkout. Fails there → **pre-existing**
   (record it, decide scope); fails only here → **regression** (fix before proceeding).
   See `common.md`.
8. **[ ] Docs in sync** — `pnpm docs:sync` leaves no diff on AUTO regions
   (AM/PM extra). Commit it with the code.

## When CI is infra-blocked

If the CI `Verify governance` job is red for a *pre-existing* infra reason (e.g. a
dependency incompatibility on `main`), you may substitute the locally-reproducible
equivalent **and document it**:

- Run each gate command locally until it passes, or prove the failing step fails
  identically on `main`.
- State this in the PR body and in any `--no-verify` commit message (per `common.md`).

This substitution is a **documented exception**, not a bypass of review. The PR must
still pass human/agent review and every locally-runnable check.

## Definition of done

- [ ] Every gate run with recorded output.
- [ ] Evidence mapped to the changed surface (each touched file → a check).
- [ ] New logic has meaningful coverage.
- [ ] No untriaged failure: each one is proven regression (fixed) or pre-existing
      (recorded + scoped).