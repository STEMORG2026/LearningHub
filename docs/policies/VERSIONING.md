# LearningHub Versioning

**Version:** 3.0.0
**Status:** Active
**Owner:** Architecture
**Applies To:** This repository and all packages
**Related:** `RULES.md`, `API_CONTRACT.md`, `PACKAGE_LIFECYCLE.md`, `docs/adr/README.md`, `docs/policies/HUMAN_INVOLVEMENT.md`

---

## 1. Purpose

This document defines the versioning conventions used across LearningHub — for the root monorepo, individual packages, and development builds.

---

## 2. Semver Convention

All packages follow [Semantic Versioning 2.0](https://semver.org/):

```
MAJOR.MINOR.PATCH
```

### 2.1 Root version (`package.json`)

The root `learninghub` version represents the overall project release. It SHOULD be bumped when:

- A **new phase** is completed (the Strangler Fig migration advances): bump MAJOR
- A **significant non-phase feature** lands: bump MINOR
- **Critical fixes** to infrastructure (build, CI, governance): bump PATCH

### 2.2 Root bump rule (ENFORCED)

Root version bumps are **only permitted** when a `newlyCompleted` phase exists in `.phase.json`. This rule prevents accidental root bumps from package-only changesets.

**Enforcement point:** `scripts/release/release-version.mjs` — after `pnpm changeset version` runs, if the root version changed but no phase in `.phase.json` has `status: "completed"` with `completedDate: null`, the script fails with a clear message.

### 2.3 Package versions

Each `packages/*` package has an independent version:

| Package | Initial | Notes |
|---------|---------|-------|
| `@learninghub/core` | `1.0.0` | Foundation — rare bumps |
| `@learninghub/tracer` | `1.0.0` | Observability — minor/patch only |
| `@learninghub/audio-synth` | `1.0.0` | Audio — evolves independently |
| `@learninghub/acl` | `1.0.0` | Adapters — bumps with new adapters |
| `@learninghub/quiz-engine` | `1.0.0` | Quiz — major for data changes |
| `@learninghub/hover-engine` | `1.0.0` | Hover — stable, rare bumps |
| `@learninghub/simulation-core` | `1.0.0` | Physics — evolves with features |
| `@learninghub/shell` | `1.0.0` | Shell — mirrors root |

Inert/scaffolded packages remain at `0.0.1` until they contain meaningful logic.

---

## 3. Dev-Version Identifier

During development (between releases), use `git describe` to generate a unique dev identifier:

```
pnpm dev-version
# → v3.0.0-dev.42
```

### 3.1 Format

```
v<latest-tag-version>-dev.<commits-since-tag>
```

- `<latest-tag-version>`: most recent `v*` git tag (e.g., `v3.0.0`)
- `<commits-since-tag>`: `git rev-list --count --first-parent` from that tag to `HEAD`
- If no tags exist: `v0.0.0-dev.0`

> **Note:** the base version comes from git tags. The docs currently reference
> `3.0.0`, but no `v3.0.0` tag has been created yet, so `pnpm dev-version` reports
> `v0.0.0-dev.0`. Tags are created by `release:finalize` for versioned releases —
> the tag and the documented version should be kept consistent.

### 3.2 JSON output

```bash
pnpm dev-version -- --json
# → {"version":"v3.0.0-dev.42","base":"3.0.0","commitsFromTag":42,"tag":"v3.0.0"}
```

### 3.3 Usage

- **Build output**: The dev-version may be displayed in debug UIs, error pages, or the tracer dashboard
- **NOT** stored in any `package.json` — it is a build-time/computed value only
- **NOT** changesets pre-release mode — it is a development state indicator, not a publishable version
- The identifier is deterministic for a given git commit

---

## 4. Release Versioning Workflow

```
Development  ──→  pnpm changeset (track changes)
                      │
                      ▼
                  pnpm release:prepare  ──→  Drafts docs, phase docs, docs-sync
                      │
                Human approval gate
                      │
                  git add -A  ──→  establishes the validated baseline
                      │
                      ▼
                  pnpm release:validate  ──→  Governance, tests, .phase.json check, writes TOCTOU token
                      │
                      ▼
                  pnpm release:version  ──→  changeset version + root bump guard + sync docs + delete consumed changesets
                      │
                      ▼
                  pnpm release:finalize  ──→  Commit, tag, push, stamp .phase.json dates, docs-sync
```

**Docs-only release:** when a phase is `completed` in `.phase.json` but there are
**zero** Changesets, the pipeline skips the version bump and package tags, and
commits the phase completion + documentation instead (`release:validate` /
`release:version` run in `docs-only` mode).

**Normal commits are not releases.** A commit runs `docs:sync` via the pre-commit
hook but never bumps versions or creates tags.

See `AGENTS.md` Release Workflow and `docs/policies/HUMAN_INVOLVEMENT.md` for the detailed
human-approval process.

---

## 5. Compatibility

Officially supported minimums (floors). **The tested baseline is tracked in
CI/package.json, not in governance text** — governance must not change when a tool
version updates.

| Toolchain | Minimum supported |
|-----------|-------------------|
| Node.js | ≥ 18 (LTS) |
| pnpm | ≥ 9 |
| TypeScript | ≥ 5.4 |
| ECMAScript target | ES2022 |
| Browsers | modern evergreen (last 2 versions); no IE |
| Build tooling | `tsc` + `turbo` |

**Rules:**

- Code MUST compile and run on the minimums above (floors).
- The **tested** environment is what CI actually runs — that is the source of truth
  for "known good" (see `package.json` / CI config), and may be newer than the floors.
- A floor change is a breaking change: it requires an ADR and is announced in a MAJOR
  release.

---

## 6. Deprecation

Contracts and packages follow the lifecycle
`Experimental → Stable → Deprecated → Removed`. **Deprecated APIs/events/interfaces
MUST remain fully tested until removal.**

- Deprecation is announced with a version, a replacement, and a migration path
  (warnings in the tracer/logs, JSDoc `@deprecated`, changelog entry).
- Removal happens only in a MAJOR release, after a deprecation cycle.
- Package-level state (Experimental/Incubating/Stable/Legacy/Deprecated/Archived) is
  governed by `docs/policies/PACKAGE_LIFECYCLE.md` — this section covers contracts and APIs.

---

## 7. Related Documents

| Document | What it covers |
|----------|---------------|
| `ARCHITECTURE/README.md` | Module layout, package map |
| `API_CONTRACT.md` | Public contract versioning, semver, migration |
| `PACKAGE_LIFECYCLE.md` | Package state transitions |
| `adr/README.md` | ADR index and decision log |
| `ROADMAP.md` | Phase execution plan |
| `AGENTS.md` | Release workflow, human approval gate |
| `scripts/release/dev-version.mjs` | Dev-version identifier implementation |
| `scripts/release/release-version.mjs` | Root bump guard implementation |
| `.phase.json` | Phase state (canonical source for newlyCompleted) |
| `.changeset/config.json` | Changeset configuration |
