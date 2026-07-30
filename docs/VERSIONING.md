# STEM-TUITION Versioning

**Version:** 3.0.0
**Status:** Active

---

## 1. Purpose

This document defines the versioning conventions used across STEM-TUITION — for the root monorepo, individual packages, and development builds.

---

## 2. Semver Convention

All packages follow [Semantic Versioning 2.0](https://semver.org/):

```
MAJOR.MINOR.PATCH
```

### 2.1 Root version (`package.json`)

The root `stem-tuition` version represents the overall project release. It SHOULD be bumped when:

- A **new phase** is completed (the Strangler Fig migration advances): bump MAYOR
- A **significant non-phase feature** lands: bump MINOR
- **Critical fixes** to infrastructure (build, CI, governance): bump PATCH

### 2.2 Root bump rule (ENFORCED)

Root version bumps are **only permitted** when a `newlyCompleted` phase exists in `.phase.json`. This rule prevents accidental root bumps from package-only changesets.

**Enforcement point:** `scripts/release-version.mjs` — after `pnpm changeset version` runs, if the root version changed but no phase in `.phase.json` has `status: "completed"` with `completedDate: null`, the script fails with a clear message.

### 2.3 Package versions

Each `packages/*` package has an independent version:

| Package | Initial | Notes |
|---------|---------|-------|
| `@stem-tuition/core` | `1.0.0` | Foundation — rare bumps |
| `@stem-tuition/tracer` | `1.0.0` | Observability — minor/patch only |
| `@stem-tuition/audio-synth` | `1.0.0` | Audio — evolves independently |
| `@stem-tuition/acl` | `1.0.0` | Adapters — bumps with new adapters |
| `@stem-tuition/quiz-engine` | `1.0.0` | Quiz — major for data changes |
| `@stem-tuition/hover-engine` | `1.0.0` | Hover — stable, rare bumps |
| `@stem-tuition/simulation-core` | `1.0.0` | Physics — evolves with features |
| `@stem-tuition/shell` | `1.0.0` | Shell — mirrors root |

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
- `<commits-since-tag>`: `git rev-list --count` from that tag to `HEAD`
- If no tags exist: `v0.0.0-dev.0`

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
                  pnpm release:prepare  ──→  Drafts docs, phase docs
                      │
                Human approval gate
                      │
                      ▼
                  pnpm release:validate  ──→  Governance, tests, .phase.json check
                      │
                      ▼
                  pnpm release:version  ──→  changeset version + root bump guard + sync docs + delete consumed changesets
                      │
                      ▼
                  pnpm release:finalize  ──→  Commit, tag, push, stamp .phase.json dates
```

See `AGENTS.md` Release Workflow section for the detailed human-approval process.

---

## 5. Related Documents

| Document | What it covers |
|----------|---------------|
| `ARCHITECTURE.md` | Module layout, package map |
| `ROADMAP.md` | Phase execution plan |
| `AGENTS.md` | Release workflow, human approval gate |
| `scripts/dev-version.mjs` | Dev-version identifier implementation |
| `scripts/release-version.mjs` | Root bump guard implementation |
| `.phase.json` | Phase state (canonical source for newlyCompleted) |
| `.changeset/config.json` | Changeset configuration |
