# Pull Request

## Description
<!-- Provide a concise description of the changes -->

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or change that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] CI/CD or build pipeline change
- [ ] Refactoring (no functional changes)

## Agent Pre-Flight Verification Checklist
> **For AI coding agents (Jules, etc.): these MUST be checked before opening the PR**

- [ ] `pnpm quick` passes (arch/circular/state/dom lints + typecheck)
- [ ] `pnpm verify-governance` passes (11-stage gate)
- [ ] `pnpm docs:sync` executed and committed (if .phase.json, packages/, or docs changed)
- [ ] No direct imports between `packages/*` (all communication via `EventBus`)
- [ ] No `window`/`document` access outside Web Components / ACL adapters
- [ ] Unit tests added for new core logic (coverage ratchet respected)
- [ ] Changeset added via `pnpm changeset` if `packages/*/src/` or `apps/*/src/` was modified
- [ ] ADR created if new package, interface, or architectural decision introduced

## Release Workflow Reminder
> **Normal commits and PR merges do NOT perform releases.** Never run `pnpm release:*` inside a PR. Releases require human approval following `docs/policies/HUMAN_INVOLVEMENT.md`.

## Testing
<!-- Describe how you tested your changes -->
- [ ] Unit tests pass (`pnpm test`)
- [ ] E2E tests pass (`pnpm test:a11y`)
- [ ] Visual regression baselines updated (if UI changed)
- [ ] Lighthouse CI passes

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published

## Preview URL
<!-- Cloudflare Pages preview URL (populated automatically by CI) -->
<!-- Example: https://feat-my-branch.stem-tuition.pages.dev -->
