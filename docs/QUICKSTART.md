# Quickstart

**Version:** 3.0.0
**Purpose:** Set up the project and make your first change in under 10 minutes.

---

## Prerequisites

| Tool | Version | Why |
|------|---------|-----|
| Node.js | >= 18 | JavaScript runtime for build tools |
| pnpm | >= 8 | Package manager (faster, stricter than npm) |

Check versions:

```bash
node --version   # should be >= 18
pnpm --version   # should be >= 8
```

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/stem-tuition.git
cd stem-tuition

# 2. Install all dependencies (for all packages)
pnpm install

# 3. Configure the tracked pre-commit hook (required — not automatic on clone)
pnpm setup-hooks
#   core.hooksPath = scripts/git-hooks
#   Every commit now runs `pnpm docs:sync` and stages deterministic doc changes.

# 4. Run the legacy development server
python3 -m http.server 8085 --directory legacy/
# Open http://localhost:8085

# 5. Verify everything is working
pnpm verify-governance
# Should print: ✅ All checks passed
```

---

## Project Structure

```
STEM-TUITION/
├── legacy/                        ← Frozen v1.0.0 — don't edit
│   ├── index.html                  Entry point (serving live)
│   ├── css/
│   └── js/
│
├── packages/                       ← All new code lives here
│   ├── core/                       Event Bus + shared types
│   ├── tracer/                     Observability (internal Langfuse)
│   ├── acl/                        Anti-Corruption Layer adapters
│   ├── audio-synth/                Web Audio synthesizer
│   ├── quiz-engine/                Quiz engine + Web Component
│   ├── hover-engine/               Hover state machine
│   └── simulation-core/            Pure physics math
│
├── apps/
│   └── shell/                      Future app shell (routing)
│
├── docs/                           All documentation
│   ├── ARCHITECTURE.md
│   ├── RULES.md
│   ├── COMPONENT_STANDARDS.md
│   ├── FLOWCHARTS.md
│   ├── QUICKSTART.md              ← You are here
│   ├── DEBUGGING.md
│   ├── ROADMAP.md
│   ├── GLOSSARY.md
│   ├── HUMAN_INVOLVEMENT.md        Human vs. automation contract
│   ├── VERSIONING.md               Semver, dev-version, release workflow
│   ├── component-registry/         Living map of code locations
│   └── adr/                        Architecture Decision Records
│
├── scripts/                        Release pipeline + doc sync + hooks
│   ├── docs-sync.mjs               Deterministic AUTO-section synchronizer
│   ├── sync-versions.mjs           Syncs **Version:** headers in docs/
│   ├── dev-version.mjs             vX.Y.Z-dev.N identifier
│   ├── release-{prepare,validate,version,finalize}.mjs
│   └── git-hooks/pre-commit        Tracked pre-commit hook
│
├── pnpm-workspace.yaml
├── turbo.json
├── .phase.json                     Canonical phase-state source
├── package.json
└── tsconfig.json                   Shared TypeScript config
```

---

## Common Commands

```bash
# ──── Development ────

# Run legacy server (current live site)
pnpm dev:legacy

# Run new module dev server (Vite)
pnpm dev:shell

# ──── Testing ────

# Test only changed packages (fast — use during coding)
pnpm test --filter="[changed]"

# Test a specific package
pnpm test --filter="@stem-tuition/quiz-engine"

# Full governance check (all tests, lint, a11y, size)
pnpm verify-governance

# ──── Linting ────

# Architecture dependency lint
pnpm lint:arch

# TypeScript type check
pnpm typecheck

# ──── Version Management (4-Stage Pipeline) ────

# Create a changeset (new dependency change entry)
pnpm changeset

# Release pipeline — run in order:
pnpm release:prepare   # generates CHANGELOG/DEVLOG drafts, scans registry
pnpm release:validate  # no [EDIT:] markers, clean tree, verify-governance, tests, writes token
pnpm release:version   # token+TOCTOU guard → changeset version → sync-versions → typecheck → test
pnpm release:finalize  # mutation allowlist → finalize docs → commit → tag → clean up token

# NOTE: pnpm changeset version is intentionally DISABLED (guarded).
# Use the 4-stage pipeline above instead.

# ──── Documentation ────

# Regenerate AUTO documentation sections + sync **Version:** headers
# (runs automatically on every commit via the pre-commit hook)
pnpm docs:sync

# Check Component Registry is up to date
pnpm lint:registry

# Generate dependency graph (updates FLOWCHARTS.md)
pnpm generate:graph

# Show dev-version identifier (git describe → vX.Y.Z-dev.N)
pnpm dev-version
pnpm dev-version -- --json   # JSON output

# ──── Branching (Feature Branches Required) ────

# NEVER work directly on main. Always create a feature branch:
git checkout -b feat/your-feature-name
# Work, commit, test:
pnpm test --filter="[changed]"
pnpm verify-governance
git push -u origin feat/your-feature-name
# Create PR to merge into main
```

---

## Your First Contribution

1. Pick a package from the roadmap (e.g., `packages/audio-synth/`)
2. Read its `README.md` contract
3. Read the `COMPONENT_STANDARDS.md` to understand the pattern
4. Make your change
5. Run `pnpm test --filter="@stem-tuition/audio-synth"` to test only that package
6. Run `pnpm lint:arch` to check no forbidden imports
7. Commit: `git commit -m "feat(audio): add tone generation"`
8. Push: `git push`

---

## What to Read Next

| If you want to... | Read this |
|-------------------|-----------|
| Understand how modules connect | `ARCHITECTURE.md` |
| Learn how to build a component | `COMPONENT_STANDARDS.md` |
| See what's happening in real-time | `DEBUGGING.md` |
| Know what to work on next | `ROADMAP.md` |
| Look up a technical term | `GLOSSARY.md` |
| Find where code lives | `component-registry/` |
| Know who decides vs. automation | `HUMAN_INVOLVEMENT.md` |
| See release history | `CHANGELOG.md` |
| Read development journey | `DEVLOG.md` |
| Understand versioning | `VERSIONING.md` |
| Deploy to production | `DEPLOYMENT.md` |
