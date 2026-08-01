# @stem-tuition/shell

## Purpose

Application shell: routing between the frozen `legacy/` site and modern `packages/*` modules. Currently a scaffold — the future production entry point.

## Public API

- None yet (Vite entry `src/index.ts` is a placeholder; exports are intentionally empty)

## Inputs

- Route (path) resolved by the shell

## Outputs

- Delegates to `legacy/` (redirect/iframe) or loads modern modules directly

## Public Contracts

- Contract classes: `api`

## Dependencies

- None yet (will depend on `packages/*` as routing lands)

## Extension Points

- This package becomes the production entry when Phase 7 features (auth, progress, admin) land — the root `index.html` deprecation notice references it

## Examples

```bash
pnpm dev:shell   # Vite dev server for the shell
```
