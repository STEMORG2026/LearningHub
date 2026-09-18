# Changelog

**Version:** 3.0.0 (auto — see sync-versions.mjs)

All notable changes to **LearningHub** are documented here.

**Format:** [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)  
**Versioning:** [SemVer 2.0.0](https://semver.org/) — `major.minor.patch`

---

## [Unreleased] — 2026-09-18

### Added
- **Phase 7: Features** — Auth, progress tracking, admin dashboard (planned, partially implemented in shell)
- **Phase 8: Content & Lessons** — Multi-format lesson delivery system
  - `packages/content-provider/` — Content sourcing with provider abstraction (LHS adapter, local provider, narrative mapper, quiz mapper). Seam for STEMMA knowledge integration.
  - `packages/content-engine/` — Content production engine with blueprint-driven pipeline, additive formats, deterministic verification gates, stress-tested batch narrations
  - `packages/lesson-renderer/` — STEM lesson Web Component (`<stem-lesson>`), pure rendering logic
  - `packages/interactive-simulations/` — Circuit simulator (`<stem-circuit-sim>`), mechanics simulator (`<stem-mechanics-sim>`), EventBus integration
- **Product-agnostic shell** — Decoupled web shell with consumer showcase pages (game, lab, stemma, tuition, professor-j)
- **PROFESSOR-J integration** — Client library (OpenRouter Gemini, Socratic grounded prompt), floating chat drawer Web Component
- **Inquiry system** — WhatsApp lead bridge with pure message builder
- **Governance verification suite** — `scripts/verify.py`, `scripts/verify_export_contract.py`, `scripts/verify_git_safety.py`, `scripts/checks/verify-doc-governance.mjs`
- **ADR-017** — Ecosystem foundation realignment (product-agnostic LearningHub)
- **ADR-018** — Interactive simulations simulation-core integration
- **Updated canonical docs** — CONSTITUTION.md, VISION.md, ECOSYSTEM.md, IMPLEMENTATION-PLAN.md, ROADMAP.md with Phase 8 content

### Changed
- Package scope `@stem-tuition/*` → `@learninghub/*`
- Cloudflare Pages project `stem-tution` → `learninghubstem`
- `apps/shell` routes to product-agnostic foundation (no longer tuition-specific)

### Fixed
- Dependency violations in content-provider, lesson-renderer (unused core/tracer deps)
- Doc governance gaps — ADR headers, README links, ROADMAP completeness, CHANGELOG phase coverage

---

## [3.0.0] — 2026-07-31

### Added
- **Phase 0: Foundation** — pnpm workspace, Turborepo, TypeScript strict mode, changesets, monorepo scaffolding, documentation suite (ARCHITECTURE.md, COMPONENT_STANDARDS.md, ADR-001 through ADR-009), frozen legacy/, component registry with 6 indexes
- **Phase 6: Physics Core** — Pure physics math from `legacy/js/stem-effects.js:784-1311`. Types (`CelestialBody`, `PhysicsInput/Result`), config (8 planets, 17 moons), factory functions, physics engine (`stepPosition`, `applyBoundary`, `interactPair`, `applyBlackholePull/Devour`, `updatePhysics`). 48 tests, 96% stmt coverage. Last extraction from `stem-effects.js`
- **Phase 5: Hover Engine** — Hover state machine extracted from `legacy/js/stem-effects.js:227-261`. 4 pure functions (`initCooldownState`, `pickHoverStyle`, `updateCooldown`, `isStyleInCooldown`), 6 CSS hover classes, 12 tests, 100% line/branch/function coverage
- **Phase 4: Quiz Engine** — 5 subjects × 4 questions with educational metadata, pure logic engine, `renderQuestion`/`renderResult` templates, `<stem-quiz>` Web Component with Shadow DOM, EventBus integration (`quiz:started`, `quiz:answer-submitted`, `quiz:completed`), Tracer integration, 16 tests
- **Phase 3: Event Bus + ACL** — EventBus (publish/subscribe/wildcards/BroadcastChannel/`?debug_events=true`), `packages/core/src/types.ts`, quiz-adapter/canvas-adapter, 26 tests
- **Phase 2: Audio Synth** — 4 pure synthesis functions, AudioEngine, ACL bridge, 14 tests
- **Phase 1: Tracer** — Tracer singleton, `traced()`/`@traceDecorator()`, `<stem-tracer-dashboard>` WC, `initTracer()` for `?trace=true`/`?debug_events=true`, 24 tests
- **Release automation** — 4-stage pipeline (`release:prepare`, `release:validate`, `release:version`, `release:finalize`) with TOCTOU token, governance gate, mutation allowlist
- **Dependency cruiser** — `.dependency-cruiser.js` enforcing architecture import rules
- **Dev-version identifier** — `scripts/release/dev-version.mjs` outputs `vX.Y.Z-dev.N` via `git describe --tags`
- **Root version bump guard** — enforced in `scripts/release/release-version.mjs`; root bumps require a `newlyCompleted` phase
- **`docs/policies/VERSIONING.md`** — Documents semver convention, root bump rule, dev-version format

### Changed
- Root `2.0.0` → `3.0.0`; tracer/audio-synth/core/quiz-engine/acl/shell: `0.0.0` → `1.0.0`
- `pnpm changeset:version` now guarded — must use 4-stage pipeline
- Release pipeline: removed time-based token expiry, added working tree integrity checks (triple gate: `git diff --quiet` + `git ls-files --others` + `git write-tree`), `validatedChangesetFiles` → `consumedChangesets` provenance chain
- `release-validate.mjs` — advisory warning when root bump attempted without completed phase

## [2.0.0] — 2026-07-30

### Added
- Complete documentation suite: ARCHITECTURE.md, COMPONENT_STANDARDS.md, EVENT_BUS_CONTRACT.md, FLOWCHARTS.md, QUICKSTART.md, DEBUGGING.md, ROADMAP.md, GLOSSARY.md
- Component Registry with 6 indexes (RENDERING, STATE, NETWORKING, EDUCATIONAL, TESTING, TRACE)
- 9 Architecture Decision Records (ADR-001 through ADR-009)
- Monorepo infrastructure: pnpm workspace, Turborepo, TypeScript strict mode, Changesets
- 7 package scaffolds (core, tracer, acl, audio-synth, quiz-engine, hover-engine, simulation-core)
- Shell index.html at root that routes to legacy

### Changed
- Moved all v1.0.0 code into `legacy/` — frozen, read-only
- Rewrote README.md to reflect modular architecture
- Corrected `docs/RULES.md`: replaced all `@learninghub` → `@stem-tuition`
- Superseded 5 root-level ARCHITECTURE_*.md files with deprecation notices

### Fixed
- Inconsistent package namespace (`@learninghub` vs project name)

---

## [1.0.0] — 2026-07-29

### Added
- Complete static STEM tuition website with 5 HTML pages
- Interactive Canvas physics engine (solar system, gravity, blackhole)
- 6-variant hover animation engine with cooldown protocol
- STEM Quiz Engine with 5 categories
- STEM Pioneers wall with 11 historical figures
- Visual Controls Panel (⚙️ floating widget)
- Web Audio API procedural synthesizer
- Fee estimator and course calculator
- WhatsApp enrollment integration
- 105 automated compliance tests
- Git tag `v1.0.0` freeze

### Changed
- Complete redesign from previous version (not tracked)
