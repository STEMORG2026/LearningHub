# Changesets

This directory contains changeset files that describe version bumps.

## Workflow

1. After making a change, run `pnpm changeset`
2. Select the packages that changed
3. Select the bump type: `patch` (bug fix), `minor` (new feature), `major` (breaking)
4. Write a summary of the change
5. Commit the generated markdown file alongside your code
6. On release, run `pnpm changeset version` to apply all pending changesets

See `docs/ROADMAP.md` for versioning conventions.
