# Changelog

**Version:** 3.0.0 (auto — see sync-versions.mjs)

All notable changes to STEM-TUITION are documented here.

**Format:** [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)  
**Versioning:** [SemVer 2.0.0](https://semver.org/) — `major.minor.patch`

---

## [3.0.0] — 2026-07-31

### Added
- **Phase 4: Quiz Engine** — 5 subjects × 4 questions with educational metadata, pure logic engine, `renderQuestion`/`renderResult` templates, `<stem-quiz>` Web Component with Shadow DOM, EventBus integration (`quiz:started`, `quiz:answer-submitted`, `quiz:completed`), Tracer integration, 16 tests
- **Phase 3: Event Bus + ACL** — EventBus (publish/subscribe/wildcards/BroadcastChannel/`?debug_events=true`), `packages/core/src/types.ts`, quiz-adapter/canvas-adapter, 26 tests
- **Phase 2: Audio Synth** — 4 pure synthesis functions, AudioEngine, ACL bridge, 14 tests
- **Phase 1: Tracer** — Tracer singleton, `traced()`/`@traceDecorator()`, `<stem-tracer-dashboard>` WC, `initTracer()` for `?trace=true`/`?debug_events=true`, 24 tests
- **Release automation** — 4-stage pipeline (`release:prepare`, `release:validate`, `release:version`, `release:finalize`) with TOCTOU token, governance gate, mutation allowlist
- **Dependency cruiser** — `.dependency-cruiser.js` enforcing architecture import rules

### Changed
- Root `2.0.0` → `3.0.0`; tracer/audio-synth/core/quiz-engine/acl/shell: `0.0.0` → `1.0.0`
- `pnpm changeset:version` now guarded — must use 4-stage pipeline

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
