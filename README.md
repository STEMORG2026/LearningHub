# STEM-TUITION — Modular STEM Education Platform

> **Status:** 🟢 Active Evolution (Strangler Fig Pattern)  
> **Version:** 3.0.0 (Modular Edition)  
> **Mission:** Transform a static tuition website into a modular, testable, and observable learning platform.  
> **Last Updated:** 2026-07-31

---

## What This Is

STEM-TUITION is a **solo project** — a tuition website for STEM subjects, targeting students in Pokhara, Nepal (SEE, NEB, A-Levels). It is **not part of LearningHubSTEM**, though it shares architectural patterns and conventions from the same developer.

This repository is currently migrating from a **frozen v1.0.0 vanilla monolith** to a **modular, TypeScript, Web Component-based architecture** using the Strangler Fig pattern.

---

## ⚠️ Critical Governance Directives

### 🚫 The "Iron Law" of Legacy
1. **Legacy is Read-Only:** The `legacy/` directory contains the frozen v1.0.0 monolith. **NO DIRECT MODIFICATIONS** are permitted.
2. **Strangler Fig Only:** New functionality must be built in `packages/` or `apps/` and routed around legacy code.
3. **Reversibility:** Every migration step must be revertible via feature flags.
4. **Adapter Pattern:** Communication between Legacy and Modern modules MUST occur through Anti-Corruption Layers (ACLs). Direct imports from `legacy/` into `packages/` are **forbidden**.

### 🎓 Educational Integrity Mandate
Every feature must pass the **Educational Fitness Function** (see `docs/RULES.md` Section EDU):
- What concept does this teach?
- Does it address a specific student misconception?
- Is the interaction meaningful or just decorative?
- **If it doesn't improve learning, it doesn't ship.**

---

## 🏗️ Architecture

```
STEM-TUITION/
├── legacy/                       ← FROZEN v1.0.0 monolith (read-only)
│   ├── index.html
│   ├── classes.html, videos.html, ...
│   ├── css/ (main.css, stem-theme.css)
│   └── js/ (main.js, stem-effects.js, stem-quiz.js, stem-pioneers.js)
│
├── packages/                     ← All new development
│   ├── core/                     Event Bus, shared types, utilities
│   ├── tracer/                   Built-in observability
│   ├── acl/                      Anti-Corruption Layer adapters
│   ├── audio-synth/              Web Audio synthesizer
│   ├── quiz-engine/              Quiz logic + Web Component
│   ├── hover-engine/             Hover state machine
│   └── simulation-core/          Pure physics math
│
├── apps/
│   └── shell/                    App shell (routing between legacy and modern)
│
├── docs/                         ← All documentation
│   ├── ARCHITECTURE.md           System architecture and module map
│   ├── RULES.md                  Non-negotiable coding rules
│   ├── COMPONENT_STANDARDS.md    Web Component patterns
│   ├── EVENT_BUS_CONTRACT.md     Cross-module communication
│   ├── FLOWCHARTS.md             Visual diagrams
│   ├── QUICKSTART.md             Setup guide
│   ├── DEBUGGING.md              Troubleshooting with tracer
│   ├── ROADMAP.md                Phased migration plan
│   ├── GLOSSARY.md               Technical terms explained
│   ├── component-registry/       Living map of code locations
│   └── adr/                      Architecture Decision Records
│
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── tsconfig.json
```

---

## 🛠️ Technology Stack

| Domain | Technology | Rationale |
|--------|------------|-----------|
| **Package Manager** | `pnpm` + Workspaces | Strict dependency isolation, disk efficiency |
| **Build Tool** | `Turborepo` + `Vite` | Cached builds, fast HMR for new modules |
| **Language** | `TypeScript 5.4+` (Strict) | Type safety as a fitness function |
| **Styling** | Modern CSS + Custom Properties | No runtime overhead, container queries, `:has()` |
| **Components** | Web Components (Custom Elements + Shadow DOM) | Framework-agnostic, native browser API |
| **Communication** | Event Bus (BroadcastChannel) | Loose coupling, full audit trail |
| **State Mgmt** | Event-driven (no global stores) | Predictable, traceable |
| **Testing** | `Vitest` + `Playwright` + `axe-core` | Fast unit + reliable E2E + accessibility |
| **Observability** | `@stem-tuition/tracer` (built-in) | Internal Langfuse — no external service needed |
| **Versioning** | `Changesets` | Automated, standardized, changelog generated |

---

## 🧪 Automated Fitness Functions (Enforced)

| # | Check | Command | What it prevents |
|---|-------|---------|-----------------|
| F1 | Circular deps | `pnpm lint:circular` | `packages/a → packages/b → packages/a` |
| F2 | Module size | `pnpm lint:size` | Package exceeding 50KB (gzipped) |
| F3 | Forbidden imports | `pnpm lint:arch` | `packages/*` importing `legacy/*` directly |
| F4 | Test coverage | `pnpm test:coverage` | < 90% on new modules |
| F5 | No global state | `pnpm lint:state` | `window.X = Y` in new code |
| F6 | No DOM in logic | `pnpm lint:dom` | `document.getElementById` in business logic |
| F7 | A11y gate | `pnpm test:a11y` | axe-core violations |
| F8 | Performance | `pnpm test:perf` | LCP > 2.5s, bundle > 300KB |

---

## 🎓 Quickstart

```bash
# Setup
pnpm install
pnpm verify-governance

# Development
pnpm dev:legacy          # Legacy site at http://localhost:8085
pnpm dev:shell           # Modern modules (Vite HMR)

# Testing (affected packages only)
pnpm test --filter="[changed]"

# Full governance check
pnpm verify-governance
```

See `docs/QUICKSTART.md` for detailed setup.

---

## 📚 Documentation Index

| Document | What it covers |
|----------|---------------|
| `ARCHITECTURE.md` | System overview, module map, data flow, dependency rules |
| `RULES.md` | Non-negotiable architectural, coding, CSS, testing, security rules |
| `COMPONENT_STANDARDS.md` | Web Component lifecycle, Shadow DOM, events |
| `EVENT_BUS_CONTRACT.md` | Event naming, payload schemas, debugging |
| `FLOWCHARTS.md` | Visual diagrams of every connection |
| `QUICKSTART.md` | Setup guide for new developers |
| `DEBUGGING.md` | How to trace issues with Event Bus and Tracer |
| `ROADMAP.md` | Phased migration plan with current status |
| `GLOSSARY.md` | Every technical term explained simply |
| `SECURITY.md` | Security policies, input validation, CSP, data privacy |
| `PERFORMANCE.md` | Performance budgets, optimization rules, Core Web Vitals |
| `DEPLOYMENT.md` | Deployment guide (static → VPS), Nginx config, CI/CD |
| `ACCESSIBILITY.md` | WCAG 2.2 AA standards, audit checklist, component a11y |
| `CHANGELOG.md` | Release history |
| `DEVLOG.md` | Development diary with decisions and learnings |
| `VERSIONING.md` | Semver convention, root bump rule, dev-version identifier |
| `component-registry/` | Living index of every component → file:line |
| `adr/` | Architecture Decision Records (why we chose what we chose) |

---

## 📜 License

All rights reserved. This platform serves as a private tuition service for STEM students in Pokhara, Nepal.

---

*Next Review: 2026-08-30 (Monthly Architecture Review)*
