# Development Log

**Version:** 3.0.0
**Purpose:** Day-to-day record of decisions, struggles, learnings, and progress.  
**Format:** Newest entries first.

---

## 2026-07-31 — v3.0.0 Release Automation + Historical Catch-Up

**What happened:**
- Created 4-stage release pipeline: prepare → validate → version → finalize
- Created `.dependency-cruiser.js` enforcing architecture rules (no legacy imports, no cross-package)
- Updated `.changeset/config.json` to disable commit, enable private package version/tag
- Guarded `changeset:version` to prevent direct use
- Documented release workflow in QUICKSTART.md
- Filled Phase 1-4 entries into CHANGELOG.md, DEVLOG.md, component-registry

**Tests:**
- `pnpm test` — all tasks pass
- `pnpm verify-governance` — pass (dependency-cruiser now enforces architecture rules)

**Learnings:**
- TOCTOU guard via `git write-tree` token provides a simple yet effective safety net
- Dependency-cruiser rules mirror the ARCHITECTURE.md import constraints exactly — no drift possible

**Next:**
- Phase 5: Hover Engine

---

## 2026-07-31 — Phase 4 Complete: Quiz Engine

**What happened:**
- Extracted full quiz engine: 5 subjects × 4 questions with educational metadata
- Built `types.ts`, `data.ts`, `quiz-engine.ts` (pure logic with traced wrappers), `template.ts`, `styles.css`
- Created `<stem-quiz>` Web Component with Shadow DOM + EventBus integration
- Published events: `quiz:started`, `quiz:answer-submitted`, `quiz:completed`
- Wrote 14 unit tests + 2 Web Component tests
- Version bumped all active packages to 1.0.0, root to 3.0.0

**Struggles:**
- Build issues: unused import in template.ts, null safety in web-component.ts, vitest env needed jsdom
- All resolved; 174 tests pass across 15 tasks

**Next:**
- Release automation pipeline (4-stage)

---

## 2026-07-31 — Phase 3 Complete: Event Bus + ACL

**What happened:**
- Built EventBus with publish/subscribe/wildcards/BroadcastChannel support
- Added `?debug_events=true` for dev-time event visualization
- Created `packages/core/src/types.ts` with shared TypeScript types
- Built quiz-adapter and canvas-adapter as ACL bridge to legacy code
- Wrote 26 tests total (12 EventBus + 14 ACL)
- Created `AGENTS.md` for self-orientation

**Key decisions:**
- BroadcastChannel as transport layer for cross-window communication
- Event names follow `domain:action` pattern throughout

**Next:**
- Phase 4: Quiz Engine

---

## 2026-07-30 — Phase 2 Complete: Audio Synth

**What happened:**
- Extracted 4 pure synthesis functions from legacy `stem-effects.js`
- Built AudioEngine wrapper (context lifecycle, mute/volume control)
- Created ACL bridge for legacy globals
- Wrote 14 unit tests

**Key decisions:**
- Pure functions for synthesis (no side effects) — AudioEngine owns the side-effectful context
- Legacy bridge via ACL reads `window.isAudioMuted` etc.

**Next:**
- Phase 3: Event Bus + ACL

---

## 2026-07-30 — Phase 1 Complete: Tracer

**What happened:**
- Built Tracer singleton class with startSpan/endSpan/errorSpan/getSpanTree
- Created `traced()` function wrapper and `@traceDecorator()` class decorator
- Built `<stem-tracer-dashboard>` Web Component for visual span tree inspection
- Integrated with `?trace=true` and `?debug_events=true` query params
- Wrote 24 unit tests

**Key decisions:**
- Built-in tracer instead of external Langfuse (learning project, teaches observability)
- Decorator pattern for zero-intrusion instrumentation

**Next:**
- Phase 2: Audio Synth

---

## 2026-07-30 — Foundation Complete

**What happened:**
- Completed full architectural planning phase
- Wrote 27 documentation files covering architecture, standards, registry, ADRs, glossary, debugging, and roadmap
- Created monorepo with pnpm, Turborepo, TypeScript strict mode, Changesets
- Froze v1.0.0 legacy code under `legacy/` directory
- Rewrote README.md to describe actual project state (not conflated with LearningHubSTEM)

**Key decisions made:**
1. Web Components as default component architecture (ADR-002) — framework-agnostic shell, inner impl can be anything
2. Event Bus for all cross-module communication (ADR-003) — broadcast channel, zero dependencies
3. Built-in tracer instead of external service like Langfuse (ADR-008) — learning project, teaches observability
4. Component Registry with separate indexes per concern (not a monolith registry)

**Struggles:**
- Existing docs referred to `@learninghub/*` namespace — had to correct 5+ occurrences across RULES.md and ADRs
- Root had 4 ARCHITECTURE_*.md files and UPGRADE_GUIDE.md — deprecated all of them to avoid confusion
- Balancing technical accuracy with readability for a solo learner

**Next:**
- Review with Sajan (awaiting approval)
- Phase 1: Build the tracer package — foundational for all observability

---

## 2026-07-29 — Legacy Freeze & Architecture Sprint

**What happened:**
- v1.0.0 codebase assessed: 98/100 architecture fitness score
- Architecture Charter, Migration Strategy, Mission Acceptance documents created
- Strangler Fig pattern adopted as migration strategy
- Git tag `v1.0.0` created as immutable baseline
- All 105 compliance tests passing

**Key decisions:**
- Legacy code is frozen — no modifications except critical bug fixes
- All new development goes in `packages/` with TypeScript strict mode
- Educational Fitness Functions formalized (8-question interrogation for every feature)

**Note from past self to future self:**
> The temptation to "just fix this one thing" in legacy code will be strong. Don't. Every minute spent extracting is an investment in testability. Every minute spent patching legacy is debt.

---

## [Template for Future Entries]

```
## YYYY-MM-DD — [Title]

**What happened:**
- ...

**Key decisions:**
- ...

**Struggles:**
- ...

**Learnings:**
- ...

**Next:**
- ...
```
