# Development Log

**Version:** 2.0.0
**Purpose:** Day-to-day record of decisions, struggles, learnings, and progress.  
**Format:** Newest entries first.

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
