---
title: "ADR-024: Advisory-Scoped Dependency Overrides (Removing the Bare Overrides)"
status: ACCEPTED
date: 2026-09-30
canonical: true
---

# ADR-024: Advisory-Scoped Dependency Overrides

## Status

ACCEPTED — implemented on branch `chore/remove-redundant-overrides`, guarded by `pnpm test:deps:drift`.

## Context

### What the override block is for

`[FACT]` `pnpm-workspace.yaml` carries an `overrides:` block. pnpm applies
`overrides` to **every** package in the workspace, and an override **outranks
each package's own declared range**. It is the only mechanism that can force a
transitive dependency — something no manifest names directly — to a patched
version.

`[FACT]` The block exists to hold **security floors**: when a CVE is published
against a transitive dependency, the override pins the earliest patched release
so that no package anywhere in the tree can resolve a vulnerable version.

### How the redundancy came to be

`[FACT]` Commit `84e516d` (2026-08-19, *"ci: fix main CI (turbo build, vitest 3,
audit gate, registry drift)"*) introduced the block in its current shape. The
commit message records the intent:

> Upgrade vitest 1.6 -> 3.2.7 and vite 5 -> 7 via pnpm-workspace overrides
> (fixes critical vitest UI + high vite advisories); scoped overrides for
> nanoid/tmp/fast-uri/brace-expansion/js-yaml.

`[FACT]` At that moment **every one of those overrides was legitimate.** The tree
carried a *critical* advisory in `@vitest/ui` and a *high* advisory in `vite`,
and the upgrade could not be landed through the normal manifest route. The
override was the correct tool for an urgent fix.

`[INFERENCE]` The mistake was not adding an override. The mistake was adding a
**bare** override — `vitest: ^3.2.7` — when a **scoped** one would have done the
same job. The block ended up containing two structurally different kinds of
entry that look alike at a glance:

| Kind | Form | Effect |
|---|---|---|
| **Bare** | `vitest: ^3.2.7` | Replaces the declared range everywhere. `package.json` can no longer describe reality. |
| **Advisory-scoped** | `"nanoid@<3.3.18": ^3.3.18"` | Constrains only the vulnerable versions named. Every other resolution still follows the declared range. |

`[FACT]` The block held **three bare overrides** (`vitest`, `@vitest/coverage-v8`,
`vite`) alongside **twelve advisory-scoped security pins**. Only the three bare
ones were redundant.

### The problem the redundancy caused

`[FACT]` The redundancy was invisible for six weeks and then defeated two
dependency upgrades in a row.

1. **Commit `68b7249`** (2026-09-01) — dependabot's "testing group" bump moved
   `vitest` from `3.2.7` → `4.1.11` **in the manifests**. The bare override
   outranked them. pnpm kept installing `3.2.7`. The upgrade was a **no-op for a
   month**, and every gate stayed green.
2. **Commit `9e3f143`** (2026-09-30, PR #61 "build group") — the same thing
   happened to `vite`: manifests declared `^8.3.1`, the override resolved
   `7.3.6`.

`[FACT]` The defect class is precise and worth stating on its own:

> **A manifest declared a version the resolver would never install.**

`[INFERENCE]` This is the most dangerous shape of dependency bug because it is
invisible to every existing signal:

- **`pnpm audit`** — passes. The lockfile is internally consistent and the
  security floors are honoured.
- **Typecheck / build / tests** — pass. They run against whatever installed, and
  what installed was a working version.
- **Diff review** — passes. The `package.json` diff is *correct*; the maintainer
  who approved `^4.1.11` approved exactly the right change.
- **Dependabot** — reports success and closes the PR.

`[FACT]` The divergence only surfaced when the redundant overrides were deleted:
vitest jumped `3.2.7 → 4.1.11` and vite `7.3.6 → 8.3.1`, and **six packages
immediately failed their coverage thresholds** — not because the code changed,
but because vitest 4's v8 provider measures and attributes coverage differently.

`[INFERENCE]` That second-order failure is the real cost. A month of drift was
banked, and it was paid out all at once, in a context where the connection
between cause and effect had been erased by time.

### Options considered

**A. Keep the bare overrides and document them.** The upgrade never lands, but
nothing breaks. Rejected: this institutionalises the lie. Manifests would
permanently advertise versions that never install, and every future dependabot
bump of `vitest`/`vite` would silently no-op again.

**B. Delete all fifteen overrides.** Simplify to zero overrides. Rejected: the
twelve advisory-scoped pins are **load-bearing**. Deleting them reintroduces the
CVEs they were written to close — verified by inspection of the advisory IDs in
the comments (`nanoid`, `tmp`, `fast-uri`, `brace-expansion` ×3, `js-yaml` ×2,
`undici` ×2, `sharp`).

**C. Convert the three bare overrides to advisory-scoped pins.** Preserve the
security intent, restore manifest truthfulness. Rejected as unnecessary: once
the manifests declare `^4.1.11` and `^8.3.1`, the *range itself* already exceeds
every vulnerable version. An override would constrain nothing.

**D. Delete only the three bare overrides; keep all twelve scoped pins; update
the manifests; regenerate the lockfile.** **Chosen.**

## Decision

**Delete the three bare overrides. Keep all twelve advisory-scoped security
pins. Make `package.json` the single source of truth for version ranges, and
enforce the invariant mechanically.**

Specifics:

1. **Remove** `vitest`, `@vitest/coverage-v8`, and `vite` from `overrides`.
   The workspace now resolves vitest `4.1.11`, `@vitest/coverage-v8` `4.1.11`,
   and vite `8.3.1` — the versions the manifests had been declaring.
2. **Retain** every advisory-scoped security pin, unchanged and functional.
3. **Record the convention** as a comment block at the top of
   `pnpm-workspace.yaml`: every override MUST be advisory-scoped, never bare.
4. **Add a falsifiable guard**, `scripts/checks/prove-deps-drift.mjs`, run as
   `pnpm test:deps:drift` and wired into `verify-governance`. It fails when:
   - any manifest declares a range that does not include the resolved version, or
   - any override in `pnpm-workspace.yaml` is written in bare form.
5. **Do not weaken any coverage threshold.** The six packages that failed after
   the upgrade were repaired by adding real, mutation-verified tests. Thresholds
   were held constant and are expected to ratchet **upward** over time.

### On the coverage failures

`[FACT]` Removing the overrides exposed real gaps that the old vitest had been
hiding, and it also produced one false alarm. Both were resolved without touching
a threshold:

- **Genuine gaps** — `packages/tracer` (async-rejection paths and the `maxSpans`
  guard), `packages/admin` (the entire `updateUser` success path), `apps/shell`
  (`did-you-know` localStorage failure, `hover-effects` clear/leave branches,
  `render` navigation handler), `packages/lesson-renderer` (the
  IntersectionObserver callback body), plus `audio-synth`, `progress`, and
  `quiz-engine`. Each was closed with tests proven to fail against a mutated
  source.
- **A capability gap, not a test gap** — `packages/admin`'s `adminUsers` store
  had **no creation path**, so `updateUser`'s success branch was unreachable by
  any test or any other package. `packages/video` has `createSession`;
  `packages/auth` has `register`; `admin` had nothing. Closed by adding
  `createUser` — a real API, mirroring `auth.register` — not by excluding the
  package from coverage.
- **A coverage-tool artefact was misdiagnosed, then corrected** — the
  `lesson-renderer` IntersectionObserver callback was initially recorded as a
  v8 attribution artefact. On closer inspection the code was **genuinely
  unexecuted**: jsdom never fires intersection events, so the callback body was
  dead under test. Driving the callback directly took the file to 100% lines and
  the package over its threshold. This is recorded because the first diagnosis
  was wrong and the record should say so.

## Alternatives Considered

| Option | Why rejected |
|---|---|
| **A. Keep the bare overrides, document them** | Institutionalises untruthful manifests; every future `vitest`/`vite` dependabot bump no-ops silently. The exact failure already observed twice. |
| **B. Delete all fifteen overrides** | Reintroduces the CVEs the twelve scoped pins were written to close. They are load-bearing, not decoration. |
| **C. Convert the three bare overrides to scoped pins** | Once manifests declare `^4.1.11`/`^8.3.1`, the declared range already exceeds every vulnerable version. A pin would constrain nothing and add noise. |
| **D. Delete the three bare overrides, keep the scoped pins** | **Chosen.** Restores manifest truthfulness, preserves every security floor, and lands the upgrades that had been deferred for a month. |
| **E. Weaken the coverage thresholds to get green** | Explicitly forbidden by the project owner: *"donot weaken the threshhold … keep the thresh hold and add real test, recalibrate test not threshhold."* Also wrong on the merits — the failures were real gaps, and lowering the floor would have erased the signal permanently. |
| **F. Exclude the failing packages/files from coverage** | Hides the gap rather than closing it. Same objection as E, with worse optics. |

## Consequences

**Positive**

- `package.json` becomes the single source of truth for version ranges again.
  A declared range that cannot be satisfied is now impossible to commit.
- vitest `3.2.7 → 4.1.11` and vite `7.3.6 → 8.3.1` actually land — the upgrades
  dependabot thought it shipped a month ago.
- The twelve security pins remain in force; no CVE is reopened.
- The new drift guard converts a silent, month-long failure into an immediate,
  loud one. It was proven falsifiable against three mutants, including a faithful
  reproduction of the original bare-override defect.
- Coverage **rose** substantially in every package that was touched, with no
  threshold change: `admin` 50% → 100% functions, `tracer` branch 80.43% →
  91.3%, `lesson-renderer` 73.07% → 75% (threshold met), `shell` branch 60% →
  72.85%, plus `audio-synth`, `progress`, and `quiz-engine`.
- One real user-facing bug was found and fixed in the process: the quiz score
  badge in `packages/quiz-engine/src/internal/web-component.ts` did not update
  after a correct answer until the next question rendered.

**Negative / accepted costs**

- Removing the bare overrides forced a month of deferred upgrade work to be paid
  in a single change, which is why this ADR is long. That cost was *deferred*,
  not *created*, by this decision.
- The drift guard checks declared-vs-resolved against `node_modules`, so it must
  run after an install. It is a post-install gate, not a pre-install one.
- The guard's semver matcher is deliberately minimal (`^`, `~`, comparisons,
  `||`, x-ranges). Exotic ranges — `npm:` aliases, `>=1 <2` chains with
  prereleases — are skipped rather than mis-evaluated, so a small class of
  declarations goes unchecked by design.

**Neutral**

- `packages/admin` gains a public API (`createUser`), which required updating
  `ARCHITECTURE.toml`'s `publicApi` list and the package README to satisfy the
  doc-coverage gate. The package's `status` and `maturity` are unchanged.

## Related

- ADR-005: pnpm + Turborepo Monorepo (owns the workspace configuration this ADR amends)
- ADR-006: TypeScript Strict Mode (the pin restored in PR #70, adjacent to this work)
- ADR-010: Automated Release & Documentation Governance Pipeline
- ADR-023: Restore the Verification Gate and the STEMMA Seam (the previous exercise of the same principle: capability before content)
- `docs/RULES.md` — Testing Requirements → Coverage Ratchet; Git Workflow → Always Push to a Branch
- `scripts/checks/prove-deps-drift.mjs` — the enforcement introduced here

## Provenance

| Commit | Date | Event |
|---|---|---|
| `84e516d` | 2026-08-19 | Overrides introduced (legitimately) to force an urgent vitest/vite security upgrade |
| `68b7249` | 2026-09-01 | dependabot bumps vitest `3.2.7 → 4.1.11` in manifests; override silently defeats it |
| `9e3f143` | 2026-09-30 | Same failure for vite `7.3.6 → 8.3.1` (PR #61) |
| *this change* | 2026-09-30 | Bare overrides removed; upgrades land; drift guard added |
