# STEM-TUITION Architecture

**Version:** 2.0.0
**Status:** Active Evolution
**Project:** STEM-TUITION (independent project, not part of LearningHubSTEM)

---

## Purpose

This document describes the complete architecture of STEM-TUITION — how the code is organized, how modules connect, what each package is responsible for, and the rules that govern those connections.

---

## 1. Current State (v1.0.0 Frozen)

The current codebase is a vanilla HTML/CSS/JS monolith. All code lives at the project root. This state is frozen under git tag `v1.0.0` and will never be directly modified (except critical bug fixes).

```
STEM-TUITION/                          ← monolith (frozen)
├── index.html                          ← entry point
├── classes.html, videos.html, ...      ← pages
├── css/main.css                        ← design system
├── css/stem-theme.css                  ← card/hover styles
├── js/stem-effects.js (1311 lines)     ← 4 concerns mixed:
│                                        audio + hover + canvas + controls
├── js/stem-quiz.js (312 lines)         ← quiz data + renderer
├── js/stem-pioneers.js (328 lines)     ← pioneers data + renderer
├── js/main.js (92 lines)               ← DOM helpers
├── tests/verify-stem-platform.js       ← static analysis tests
└── docs/                               ← documentation
```

**Key problems identified:**
1. `stem-effects.js` mixes audio, hover animations, physics canvas, and visual controls — 4 separate concerns in one file
2. Business logic is interleaved with DOM manipulation
3. Global scope functions — no encapsulation
4. No test runner (tests are Node.js scripts doing string matching)
5. No package manager, no build step
6. HTML uses inline event handlers (`onclick`)

---

## 2. Target State (v3.0.0 — Modular)

```
STEM-TUITION/
├── apps/
│   └── shell/                          ← routing shell (thin index.html)
│       └── public/index.html           ← entry point, routes to legacy or modern
│
├── legacy/                             ← FROZEN — never edit
│   ├── index.html
│   ├── classes.html
│   ├── css/
│   ├── js/
│   └── tests/
│
├── packages/                           ← all new development
│   ├── core/                           ← Event Bus, shared types, utilities
│   ├── tracer/                         ← built-in observability (internal Langfuse)
│   ├── acl/                            ← Anti-Corruption Layer adapters
│   ├── audio-synth/                    ← Web Audio API synthesizer
│   ├── quiz-engine/                    ← quiz logic, data, scoring (Web Component)
│   ├── hover-engine/                   ← hover state machine, design tokens
│   └── simulation-core/                ← pure physics math (no canvas/DOM)
│
├── docs/                               ← all documentation
│   ├── ARCHITECTURE.md                 ← THIS FILE
│   ├── COMPONENT_STANDARDS.md          ← how to build components
│   ├── EVENT_BUS_CONTRACT.md           ← how modules communicate
│   ├── FLOWCHARTS.md                   ← visual diagrams
│   ├── QUICKSTART.md                   ← setup guide
│   ├── DEBUGGING.md                    ← troubleshooting guide
│   ├── ROADMAP.md                      ← migration phases
│   ├── GLOSSARY.md                     ← technical terms
│   ├── component-registry/             ← living map of every component + file:line
│   └── adr/                            ← Architecture Decision Records
│
├── .changeset/                         ← version bump automation
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── tsconfig.json
```

---

## 3. Module Dependency Rules

These rules are **enforced by automation** (`pnpm lint:arch`). Violations block merge.

```
         ┌─────────────────────────────┐
         │        apps/shell           │
         │  (can access legacy OR any  │
         │   package via ACL/EventBus) │
         └──────┬──────────────────────┘
                │
    ┌───────────┴───────────┐
    │                       │
    ▼                       ▼
┌──────────────┐    ┌──────────────┐
│   legacy/    │    │  packages/*  │
│  FROZEN ZONE │    │ NEW MODULES  │
│  Read-only   │    │              │
└──────┬───────┘    └──────┬───────┘
       │                   │
       │    ┌──────────────┐
       └────►  packages/   ◄────┘
            │   acl/       │
            │  (adapters)  │
            └──────┬───────┘
                   │
          ┌────────┴────────┐
          ▼                  ▼
┌──────────────────┐  ┌──────────────────┐
│  legacy/         │  │  packages/*      │
│  (via adapter)   │  │  (direct calls)  │
└──────────────────┘  └──────────────────┘
```

### Allowed imports

| From | To | Allowed? | Notes |
|------|----|----------|-------|
| `packages/*` | `legacy/*` | ❌ FORBIDDEN | Must go through `packages/acl/` |
| `packages/*` | `packages/core/` | ✅ Yes | Event Bus is the shared backbone |
| `packages/*` | `packages/tracer/` | ✅ Yes | Any module can be traced |
| `packages/*` | `packages/acl/` | ✅ Yes | Use adapters for legacy access |
| `packages/*` | `packages/*` (other) | ⚠️ Via Event Bus only | No direct function calls between packages |
| `legacy/*` | `packages/*` | ❌ FORBIDDEN | Legacy cannot import new modules |
| `legacy/` | `legacy/` | ✅ Yes | Within frozen zone |
| `apps/shell/` | `legacy/` | ✅ Redirect | Shell delegates to legacy via redirect/iframe |
| `apps/shell/` | `packages/*` | ✅ Yes | Shell loads modern modules directly |

---

## 4. Data Flow

### 4.1 User visits a page

```
Browser → apps/shell/public/index.html
                   │
          ┌────────┴────────┐
          ▼                  ▼
    Is the route        Is the route
    handled by a        ONLY in legacy?
    new module?              │
          │                  ▼
          ▼             Redirect to
    Load from        legacy/{route}.html
    packages/*
```

### 4.2 User interacts with a component

```
User clicks "Check Answer" on quiz
              │
              ▼
  <stem-quiz> Web Component
     │ (dispatches CustomEvent)
     ▼
  Event Bus (packages/core/)
     │ (broadcasts: quiz:answer-submitted)
     ▼
  ┌────────┬────────┬────────┐
  ▼        ▼        ▼        ▼
tracer   quiz-   audio-   analytics
(record  engine  synth    (future)
 timing) (score) (sound)
```

### 4.3 Trace waterfall (visible during debugging)

```
[TRACE] quiz:answer-submitted (45ms)
  ├── quiz-engine:validate-answer (2ms)
  ├── quiz-engine:check-answer (8ms)
  ├── quiz-engine:calculate-score (3ms)
  ├── event-bus:publish (1ms)
  ├── audio-synth:play-correct-sound (25ms)
  └── total: 39ms (time to result)
```

---

## 5. Package Map

| Package | Responsibility | Depends on | Key files |
|---------|---------------|------------|-----------|
| `core` | Event Bus, shared types, utilities | (none) | `src/event-bus.ts`, `src/types.ts` |
| `tracer` | Function timing, span trees, live dashboard | `core` | `src/tracer.ts`, `src/dashboard.ts` |
| `acl` | Adapters wrapping legacy code | `core`, `tracer` | `src/quiz-adapter.ts`, `src/canvas-adapter.ts` |
| `audio-synth` | Web Audio API sound effects | `core`, `tracer` | `src/synth.ts` |
| `quiz-engine` | Quiz data, logic, scoring, Web Component | `core`, `tracer` | `src/quiz-engine.ts`, `src/stem-quiz.ts` |
| `hover-engine` | Hover style state machine, cooldown protocol | `core`, `tracer` | `src/hover-state.ts`, `src/styles.css` |
| `simulation-core` | Pure physics math (Newtonian gravity) | `core`, `tracer` | `src/gravity.ts`, `src/bodies.ts` |
| `shell` | App entry, routing between legacy and modern | (all packages) | `public/index.html` |

---

## 6. Technology Stack

| Domain | Technology | Rationale |
|--------|------------|-----------|
| **Package Manager** | pnpm + Workspaces | Strict dependency isolation, disk efficient |
| **Build Tool** | Turborepo + Vite | Cached builds, fast dev server for new modules |
| **Language** | TypeScript 5.4+ (Strict) | Type safety for debugging, self-documenting |
| **Components** | Web Components (native) | Framework-agnostic, no build required, standard |
| **Styling** | CSS Custom Properties + Modern CSS | Pre-existing design system, no runtime overhead |
| **State Mgmt** | Event Bus (BroadcastChannel) | Native browser API, zero dependencies |
| **Testing** | Vitest (unit), Playwright (E2E), axe (a11y) | Fast, modern, comprehensive |
| **Observability** | `@stem-tuition/tracer` | Built-in, no external service needed |
| **Communication** | CustomEvent + BroadcastChannel | Native browser APIs, framework-agnostic |
| **Versioning** | Changesets | Automated, standardized, integrated with CI/CD |

---

## 7. Educational Metadata Standard

Every learning-related package must export educational metadata:

```typescript
export interface EducationalMetadata {
  conceptId: string;              // e.g. "newtons-second-law"
  displayName: string;            // e.g. "Newton's Second Law of Motion"
  prerequisites: string[];        // e.g. ["force", "mass", "acceleration"]
  gradeLevels: number[];          // e.g. [9, 10, 11, 12]
  estimatedTimeMinutes: number;   // e.g. 15
  commonMisconceptions: string[]; // e.g. ["heavier-objects-fall-faster"]
  tags: string[];                 // e.g. ["physics", "mechanics", "forces"]
}
```

This is used by:
- Component Registry (`docs/component-registry/EDUCATIONAL.md`)
- Debugging tool (shows which concept is being interacted with)
- Future analytics integration

---

## 8. Migration Progress Tracking

The Strangler Fig migration progress is tracked in `docs/component-registry/TRACE.md`:

```
PHASE 0: Foundation    ██████████ 100%
PHASE 1: Observability ██████████ 100%
PHASE 2: Audio Synth   ██████████ 100%
PHASE 3: Event Bus     ░░░░░░░░░░ 0%
PHASE 4: Quiz Engine   ░░░░░░░░░░ 0%
PHASE 5: Hover Engine  ░░░░░░░░░░ 0%
PHASE 6: Physics Core  ░░░░░░░░░░ 0%
PHASE 7+: Features     ░░░░░░░░░░ 0%
```

Each phase is updated in real time as packages are extracted and legacy code is strangled.

---

## 9. Related Documents

| Document | What it covers |
|----------|---------------|
| `COMPONENT_STANDARDS.md` | How to build a Web Component |
| `EVENT_BUS_CONTRACT.md` | Event naming, payloads, versioning |
| `FLOWCHARTS.md` | Visual diagrams of all connections |
| `QUICKSTART.md` | Setup and first contribution |
| `DEBUGGING.md` | Troubleshooting with tracer |
| `ROADMAP.md` | Phased execution plan |
| `GLOSSARY.md` | Technical terms defined |
| `RULES.md` | Non-negotiable coding rules |
| `SECURITY.md` | Security policies, input validation, CSP, data privacy |
| `PERFORMANCE.md` | Performance budgets, optimization rules, Core Web Vitals |
| `DEPLOYMENT.md` | Deployment guide (static → VPS), Nginx, CI/CD |
| `ACCESSIBILITY.md` | WCAG 2.2 AA standards, audit checklist, component a11y |
| `CHANGELOG.md` | Release history |
| `DEVLOG.md` | Development diary with decisions and learnings |
| `component-registry/` | Living map of every component |
| `adr/` | Architecture Decision Records |
