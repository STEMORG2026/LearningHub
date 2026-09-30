---
"@learninghub/admin": minor
"@learninghub/lesson-renderer": patch
"@learninghub/quiz-engine": patch
---

fix(deps): remove bare overrides so manifests match what installs

Remove the three **bare** overrides (`vitest`, `@vitest/coverage-v8`, `vite`) from
`pnpm-workspace.yaml`, landing the upgrades the manifests had been declaring for a
month without effect: vitest `3.2.7 → 4.1.11` and vite `7.3.6 → 8.3.1`. All twelve
advisory-scoped security pins are retained unchanged. See ADR-024.

- **@learninghub/admin** — add `createUser`, closing a capability gap: the store had
  no creation path, so `updateUser`'s success branch was unreachable by any caller.
  Mirrors `auth.register` / `video.createSession`. Pairs with `USER.md`-style seeding
  in tests; `publicApi` and README updated.
- **@learninghub/quiz-engine** — fix the score badge, which did not update after a
  correct answer until the next question rendered.
- **@learninghub/lesson-renderer** — no API change; scroll-reveal callback body is
  now covered, taking the package back over its branch threshold.

Also adds `pnpm test:deps:drift` (`scripts/checks/prove-deps-drift.mjs`), a falsifiable
guard wired into `verify-governance` that fails when any manifest declares a range the
resolver cannot satisfy, or when any override is written in bare form.

No coverage threshold was lowered. Repairing vitest 4's stricter coverage accounting
was done by adding mutation-verified tests.
