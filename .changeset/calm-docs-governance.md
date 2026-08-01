---
"@stem-tuition/core": patch
"@stem-tuition/tracer": patch
"@stem-tuition/audio-synth": patch
"@stem-tuition/acl": patch
"@stem-tuition/quiz-engine": patch
"@stem-tuition/hover-engine": patch
"@stem-tuition/simulation-core": patch
"@stem-tuition/shell": patch
---

docs(governance): add ARCHITECTURE.toml package metadata, health dashboard, and per-package size budgets

- Every package now declares owner/status/maturity/contracts/ADRs in `ARCHITECTURE.toml`
  (standard: `docs/PACKAGE_METADATA.md`), validated by `pnpm lint:registry` and surfaced
  in the generated `docs/REPOSITORY_HEALTH.md` (`pnpm docs:sync`).
- Architecture charter moved to `docs/ARCHITECTURE/README.md`; root `index.html` is now
  an explicit deprecation notice (removed in v4).
- Bundle budgets are per-package via `bundlesize.config.json` (apps measured gzip); the
  deprecated `bundlesize` dependency was removed in favor of `scripts/size-check.cjs`.
- Coverage thresholds are ratcheted in `vitest.config.*.ts` (upward only).
