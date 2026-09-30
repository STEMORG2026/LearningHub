# LearningHub — Open STEM Learning Platform & Ecosystem Foundation

> **Status:** 🟢 Active Evolution  
> **Version:** 3.0.0 (Product-Agnostic Modular Edition)  
> **Mission:** Provide canonical knowledge infrastructure, simulation engines, quiz runtimes, and shared educational foundations for the broader STEM ecosystem.  
> **Last Updated:** 2026-09-04  

---

## 🌐 Strategic Identity & Ecosystem Role

**LearningHub** is an independent, product-agnostic **open STEM learning platform, knowledge infrastructure, and educational foundation** operating under **STEMXIS TECHNOLOGY PVT. LTD.**

LearningHub provides reusable knowledge models (grounded in STEMMA exports), framework-agnostic Web Components (`<stem-quiz>`, `<stem-lesson>`, `<stem-circuit-sim>`, `<stem-mechanics-sim>`), pure simulation logic, event-driven communication primitives (`@learninghub/core`), and execution tracing (`@learninghub/tracer`).

```text
                        STEMXIS TECHNOLOGY PVT. LTD.
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
     STEM Ecosystem                                        JARVIS
  (Educational Domain)                              (Personal AI OS)
           │                                                   │
  ┌────────┴────────┬──────────────┬──────────────┐            │
  ▼                 ▼              ▼              ▼            │
LearningHub     STEM Tuition    STEM Lab      STEM Game        │
(Canonical      (Commercial     (Practical    (Gamified        │
Foundation)      Tutoring)      Experiment)   Learning)        │
  │                 │              │              │            │
  └───► Knowledge ──┴──────────────┴──────────────┘            │
            │                                                  │
            ▼                                                  │
       PROFESSOR-J ◄── Shared Infrastructure Primitives ───────┘
   (Ecosystem AI OS)
```

---

## 🏗️ Product Agnosticism & Ecosystem Consumers

LearningHub core packages (`packages/*`) and app shells (`apps/*`) are decoupled from any single commercial product or regional tuition service. Key consumers include:

1. **STEM Tuition** — Commercial 1:1, cohort, and guided tutoring product (consumes lesson models & component packages).
2. **STEM Lab** — Practical experimental STEM simulation environment (consumes `@learninghub/simulation-core`).
3. **STEM Game** — Interactive and gamified learning environment (consumes `@learninghub/quiz-engine` & interactive components).
4. **PROFESSOR-J** — Major AI/agentic intelligence and orchestration layer of the STEM ecosystem (grounds Socratic tutoring in LearningHub knowledge interfaces).
5. **JARVIS** — Independent Personal AI OS sharing enterprise platform infrastructure (auth, tracing, model routes) with PROFESSOR-J.

---

## ⚠️ Governance & Architectural Rules

### 🚫 The "Iron Law" of Legacy & Decoupling
1. **Legacy Frozen Zone:** The `legacy/` directory is read-only.
2. **Product Agnosticism:** Core packages in `packages/*` MUST NOT contain commercial tuition pricing, home tuition marketing, or single-product assumptions.
3. **Adapter & Anti-Corruption Layers:** All cross-system integrations use versioned adapters or EventBus messages.

### 🎓 Educational Integrity Mandate
Every learning component must pass the **Educational Fitness Function** (see `docs/RULES.md` Section EDU):
- What concept does this teach?
- Does it address a specific student misconception?
- Is the interaction meaningful or just decorative?
- **If it doesn't improve learning, it doesn't ship.**

---

## 🧱 Repository Structure

```text
LearningHub/
├── apps/
│   └── shell/                    App shell & UI showcases
├── packages/                     Core foundation libraries
│   ├── core/                     Event Bus, shared types, primitives
│   ├── tracer/                   Built-in execution tracing
│   ├── acl/                      Anti-Corruption Layer adapters
│   ├── audio-synth/              Web Audio synthesizer
│   ├── quiz-engine/              Quiz logic & Web Component
│   ├── hover-engine/             Hover state machine
│   ├── simulation-core/          Pure physics math engine
│   ├── content-provider/         Content access & STEMMA adapter
│   ├── content-engine/           Lesson blueprint & pipeline engine
│   ├── lesson-renderer/          Lesson container Web Component
│   ├── interactive-simulations/  Circuit & mechanics simulation Web Components
│   ├── auth/                     User authentication — login, register, session, roles
│   ├── progress/                 Student progress tracking — lessons, scores, streaks
│   ├── admin/                    Admin dashboard — user management, system stats
│   ├── payments/                 Payment integration — subscriptions, transactions, webhooks
│   ├── video/                    Video/Zoom integration — session management, recording
│   ├── pj-types/                 TypeScript type definitions for PROFESSOR-J API contracts
│   ├── pj-client/                HTTP client for PROFESSOR-J backend API
│   ├── pj-auth/                  Auth token management for PROFESSOR-J API calls
│   ├── pj-audit/                 Audit log for PROFESSOR-J task execution
│   ├── pj-policy/                Content policy enforcement for AI outputs
│   ├── ecosystem-dashboard/      Health and status dashboard for LH+P-J ecosystem
│   └── cross-repo-visibility/    Shared metrics and observability across repos
├── docs/                         Canonical documentation
│   ├── VISION.md                 Canonical vision & boundaries
│   ├── ECOSYSTEM.md              Ecosystem topology & shared infrastructure matrix
│   ├── CONSTITUTION.md           Development constitution
│   ├── RULES.md                  Normative technical standards (enforceable)
│   ├── ARCHITECTURE/             Architecture charter & C4 diagrams
│   ├── archive/                  Archival index & historical plans
│   ├── adr/                      Architecture Decision Records (ADRs 001–024)
│   └── policies/                 Normative policies (EventBus, API, Security, etc.)
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── tsconfig.json
```

---

## 📖 Documentation

| Category | Files | Purpose |
|----------|-------|---------|
| **Governance** | `docs/VISION.md`, `docs/ECOSYSTEM.md`, `docs/CONSTITUTION.md`, `docs/RULES.md` | Canonical vision, ecosystem, constitution, enforceable rules |
| **Architecture** | `docs/ARCHITECTURE/README.md`, `docs/ARCHITECTURE/overview.md`, `docs/ARCHITECTURE/context.md`, `docs/ARCHITECTURE/containers.md`, `docs/ARCHITECTURE/components.md`, `docs/ARCHITECTURE/dependencies.md`, `docs/ARCHITECTURE/migration.md` | Charter + C4 diagrams |
| **Planning** | `docs/ROADMAP.md` | Phased roadmap & current status |
| **Guides** | `docs/guides/QUICKSTART.md`, `docs/guides/COMPONENT_STANDARDS.md`, `docs/guides/DEBUGGING.md`, `docs/guides/DEPLOYMENT.md`, `docs/guides/FLOWCHARTS.md`, `docs/guides/GLOSSARY.md` | Developer guides & standards |
| **Records** | `docs/adr/README.md`, `docs/adr/001`–`docs/adr/018`, `docs/CHANGELOG.md`, `docs/policies/` | Architecture Decision Records, release history, normative policies |
| **Archival** | `docs/archive/` | Historical plans, superseded proposals, obsolete roadmaps |

---

## 🛠️ Quickstart

```bash
# Setup dependencies & git hooks
pnpm install
pnpm setup-hooks

# Run verification suite
pnpm typecheck
pnpm test
pnpm verify-governance

# Start dev shell
pnpm dev:shell
```

See `docs/VISION.md` and `docs/ECOSYSTEM.md` for complete strategic and architectural guidance.
