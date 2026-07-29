# 🏛️ STEM Tuition Platform - Architecture Charter

**Version:** 2.0.0 (LearningHub Ecosystem)  
**Status:** Active Evolution  
**Role:** Chief Software Architect  
**Date:** 2026-07-29  
**Current Date:** 2026-07-29  

---

## 🎯 Mission Statement

Transform the current static STEM tuition website into a **world-class, adaptive learning platform** through incremental, reversible migrations while preserving educational stability and performance.

We are not building a website. We are building a **digital ecosystem for scientific literacy**.

---

## 🧭 Core Philosophy

### The Three Pillars of Decision Making

Every architectural decision must satisfy at least two of these three pillars, and never violate any:

| Pillar | Definition | Success Metric |
|--------|------------|----------------|
| **🎓 Educational Integrity** | Does this improve how students learn, understand, and retain STEM concepts? | Learning outcome improvement, engagement time, concept mastery rate |
| **🏗️ Architectural Hygiene** | Does this improve maintainability, scalability, and developer experience? | Cycle-free dependencies, module independence, build time, onboarding time |
| **⚡ Performance & Accessibility** | Does this ensure fast, inclusive access for all students regardless of device or ability? | Lighthouse scores, core web vitals, WCAG 2.1 AA compliance, offline capability |

**Rule:** If a feature improves Educational Integrity but harms Architectural Hygiene, it must be re-architected. If it improves Performance but reduces Educational value, it must be reconsidered.

---

## 📜 Architecture Principles (The Ten Commandments)

These principles are **non-negotiable**. Violations require Architectural Review Board approval.

### 1. ❄️ Legacy Code is Frozen
- The `v1.0.0` tag represents an immutable baseline.
- No new features in legacy files (`stem-effects.js`, `index.html` root structure).
- Bug fixes only; no refactoring without migration intent.
- **Rationale:** Prevents regression in stable, tested functionality during migration.

### 2. 🌿 New Development Outside Legacy Layer
- All new code lives in `/src/modern/` (or equivalent namespaced directory).
- New modules must not import from legacy paths.
- Legacy can call new modules via adapters only.
- **Rationale:** Enables Strangler Fig pattern; clear boundary between old and new.

### 3. 🔙 Every Migration Must Be Reversible
- Feature flags guard all new module activations.
- Rollback procedure documented before merge.
- A/B testing capability required for major UI changes.
- **Rationale:** Reduces risk; enables safe experimentation.

### 4. 🔌 Prefer Adapters Over Rewrites
- Wrap legacy functionality in facades rather than replacing immediately.
- Use Anti-Corruption Layers (ACLs) to isolate legacy quirks.
- **Rationale:** Preserves business logic while modernizing implementation.

### 5. 🛡️ Preserve Behavior Before Improving Implementation
- Capture existing behavior with integration tests before migration.
- Visual regression testing for UI components.
- **Rationale:** Prevents accidental feature loss during refactoring.

### 6. 🐜 Small, Incremental Migrations
- Max migration scope: 2 weeks per vertical slice.
- Deploy daily; migrate weekly.
- **Rationale:** Reduces cognitive load; faster feedback loops.

### 7. 🧩 New Modules Must Be Independent and Reusable
- Zero shared mutable state between modules.
- Explicit interfaces (TypeScript interfaces or JSDoc contracts).
- Publish reusable modules to internal package registry.
- **Rationale:** Enables team parallelization; prevents coupling.

### 8. 🚫 Business Logic Never Depends Directly on DOM
- Pure functions for calculations, simulations, quizzes.
- DOM is a rendering detail injected via dependency injection.
- **Rationale:** Enables server-side rendering, testing, and alternative UIs (mobile apps, VR).

### 9. 👤 User Experience Takes Priority Over Framework Choice
- No framework adoption without UX justification.
- Measure impact on Core Web Vitals before and after.
- **Rationale:** Technology serves pedagogy, not vice versa.

### 10. 📚 Educational Value > Technical Novelty
- Reject features that look cool but don't teach.
- Every interactive element must have clear learning objectives.
- **Rationale:** We are educators first, engineers second.

---

## 🛠️ Technology Evaluation Framework

Before adopting any technology, complete this **Technology Decision Record (TDR)**:

```markdown
## TDR-XXX: [Technology Name]

### Problem Statement
What specific problem does this solve?

### Alternatives Considered
1. [Alternative A] - Why rejected?
2. [Alternative B] - Why rejected?

### Why This Technology?
- Solves problem because: ...
- Trade-offs accepted: ...
- Long-term maintenance impact: ...
- Migration complexity: Low/Medium/High

### Fitness Function Impact
- Maintainability: +/0/-
- Scalability: +/0/-
- Performance: +/0/-
- Accessibility: +/0/-
- Developer Experience: +/0/-

### Recommendation
[Adopt / Reject / Defer]
```

**Current Approved Stack:**
- **Runtime:** Vanilla ES6+ (no build step required for legacy compatibility)
- **Styling:** CSS Custom Properties + Modern CSS (Container Queries, :has())
- **State Management:** Event Bus (BroadcastChannel) + Immutable State Snapshots
- **Testing:** Vitest (unit), Playwright (E2E), Axe (accessibility)
- **Build Tool (New Modules Only):** Vite (for TypeScript support and HMR)

**Under Evaluation:**
- React/Vue/Svelte for complex interactive modules (Quiz 2.0, Simulations)
- Web Components for framework-agnostic reusable elements
- WebAssembly for physics simulations requiring high performance

---

## 🎓 Educational Fitness Functions

Every proposed feature must answer these **8 Questions**. Failure to answer any question results in automatic rejection.

### The Educational Interrogation

1. **📖 What concept does this teach?**
   - Must map to specific curriculum standard (e.g., "Newton's Second Law, GCSE Physics")
   
2. **🔗 What prerequisite knowledge is required?**
   - Must declare dependencies (e.g., "Requires understanding of velocity before acceleration")
   
3. **👁️ How is the concept visualized?**
   - Must provide at least one representation (graph, animation, diagram, simulation)
   
4. **👆 How does the student interact with it?**
   - Must define interaction model (drag-and-drop, slider, quiz, free-form input)
   
5. **🔄 How does the student practice it?**
   - Must include deliberate practice mechanism (spaced repetition, varied problem sets)
   
6. **📊 How is understanding measured?**
   - Must define assessment strategy (formative quiz, summative test, portfolio artifact)
   
7. **❌ What misconceptions are addressed?**
   - Must identify common errors and how the feature corrects them
   
8. **🤖 How can AI assist without replacing learning?**
   - Must define AI role (hint generator, misconception detector, personalization engine)
   - **Critical:** AI must not give direct answers; must scaffold thinking

### Example: Physics Simulation Feature

| Question | Answer |
|----------|--------|
| Concept | Projectile motion under gravity |
| Prerequisites | Velocity vectors, basic trigonometry |
| Visualization | Real-time trajectory path, velocity vector arrows |
| Interaction | Angle/speed sliders, launch button, pause/rewind |
| Practice | Challenge mode: hit target with limited attempts |
| Measurement | Accuracy score, time to solution, hint usage |
| Misconceptions | Addresses "heavier objects fall faster" by showing mass independence |
| AI Role | Detects repeated failures, suggests angle adjustments without giving exact value |

---

## 🏗️ Architecture Fitness Functions (Automated Enforcement)

These checks run on every PR. **Failure blocks merge.**

### F1: No Circular Dependencies
```bash
# Tool: madge
madge --circular src/modern/**/*
# Expected: No circular dependencies found
```

### F2: Module Size Budget
```bash
# Tool: bundlewatch
# Limit: 50KB gzipped per module
# Exception: Physics engines may request up to 100KB with justification
```

### F3: Forbidden Import Rules
```javascript
// Tool: dependency-cruiser
// Config: .dependency-cruiser.js
{
  name: 'no-legacy-imports-in-modern',
  from: { path: 'src/modern' },
  to: { path: 'src/legacy', pathNot: 'src/legacy/adapters' },
  level: 'error'
}
```

### F4: Test Coverage Threshold
```bash
# Tool: vitest --coverage
# Requirement: >90% branch coverage for new modules
# Legacy modules: >70% (incremental improvement)
```

### F5: No Global Mutable State
```bash
# Tool: ESLint custom rule
# Pattern: Disallow assignment to globalThis.* except in designated store modules
```

### F6: DOM Access Enforcement
```bash
# Tool: ESLint
# Rule: business-logic/no-dom-access
# Files in src/modern/business-logic/** cannot import 'document' or 'window'
```

### F7: Accessibility Gate
```bash
# Tool: axe-core via Playwright
# Requirement: Zero critical violations, <5 serious violations
# Manual review required for any violations
```

### F8: Performance Budget
```bash
# Tool: Lighthouse CI
# Metrics:
#   - LCP < 2.5s
#   - FID < 100ms  
#   - CLS < 0.1
#   - Bundle size increase < 10%
```

---

## 🗺️ Migration Strategy: Strangler Fig Pattern

### Current State (v1.0.0)
```
┌─────────────────────────────────────┐
│         Monolithic Frontend         │
│  ┌─────────────────────────────┐    │
│  │      stem-effects.js        │    │
│  │  - Canvas Engine            │    │
│  │  - Quiz Logic               │    │
│  │  - Hover Animations         │    │
│  │  - Audio Synth              │    │
│  │  - DOM Manipulation         │    │
│  └─────────────────────────────┘    │
│              ↓                      │
│         index.html                  │
└─────────────────────────────────────┘
```

### Target State (v3.0.0)
```
┌──────────────────────────────────────────────────────────┐
│                    Application Shell                      │
│  (Routing, Layout, Theme, Auth - Framework Agnostic)     │
└──────────────────────────────────────────────────────────┘
         ↓              ↓              ↓              ↓
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Physics   │ │    Quiz     │ │   Content   │ │  Progress   │
│  Simulator  │ │   Engine    │ │   Cards     │ │   Tracker   │
│  (WebComp)  │ │  (React)    │ │  (Vue)      │ │  (Svelte)   │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
         ↓              ↓              ↓              ↓
┌──────────────────────────────────────────────────────────┐
│                  Shared Kernel                            │
│  (Design Tokens, Event Bus, Utils, Types, ACLs)          │
└──────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────┐
│              Legacy Adapter Layer                         │
│  (Facades wrapping v1.0.0 functionality)                 │
└──────────────────────────────────────────────────────────┘
```

### Migration Phases

#### Phase 1: Foundation (Weeks 1-4)
- [ ] Set up monorepo structure (pnpm workspaces)
- [ ] Create shared kernel package (@stem/core)
- [ ] Implement Event Bus (BroadcastChannel + localStorage fallback)
- [ ] Extract Audio Synth as standalone library
- [ ] Add feature flag system

#### Phase 2: First Strangle (Weeks 5-12)
- [ ] Migrate Physics Canvas Engine to Web Component
- [ ] Create ACL between legacy and new physics module
- [ ] Deploy behind feature flag
- [ ] A/B test with 10% traffic

#### Phase 3: Core Business Logic (Weeks 13-24)
- [ ] Migrate Quiz Engine to React (better state management)
- [ ] Implement spaced repetition algorithm
- [ ] Add AI hint generator (rule-based initially)
- [ ] Deprecate legacy quiz code

#### Phase 4: UI Components (Weeks 25-36)
- [ ] Migrate Card System to Vue (reactive hover states)
- [ ] Implement 6-hover animation system as design tokens
- [ ] Add personalized recommendations

#### Phase 5: Platform Completion (Weeks 37-52)
- [ ] Build Application Shell (routing, layout)
- [ ] Migrate Navigation
- [ ] Implement user progress tracking
- [ ] Full deprecation of legacy bundle

---

## 📋 Decision Log Template

All architectural decisions must be recorded in `/docs/adr/` using this format:

```markdown
# ADR-XXX: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
What is the issue that we're seeing that is motivating this decision?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
### Positive
- ...

### Negative
- ...

### Neutral
- ...

## Compliance
- [ ] Educational Fitness Functions satisfied
- [ ] Architecture Fitness Functions defined
- [ ] Migration plan documented
- [ ] Rollback procedure defined
```

---

## 🚨 Escalation Protocol

### When to Escalate to Architectural Review Board

1. **Principle Violation:** Any proposal that violates the 10 Principles
2. **High-Risk Migration:** Modules ranked 🔴 High Risk
3. **Technology Adoption:** Introducing new frameworks or build tools
4. **Performance Regression:** >10% degradation in Core Web Vitals
5. **Accessibility Regression:** Any new critical WCAG violations

### Review Board Composition
- Chief Software Architect (Chair)
- Lead Educator / Pedagogy Expert
- Senior Frontend Engineer
- UX/UI Designer
- DevOps Engineer

### Review Cadence
- Weekly: Standard proposals
- Emergency: Within 48 hours for critical issues

---

## 📈 Success Metrics

### Quarterly Goals

| Metric | Baseline (v1.0.0) | Target (v2.0.0) | Target (v3.0.0) |
|--------|-------------------|-----------------|-----------------|
| **Student Engagement** | 3 min/session | 8 min/session | 15 min/session |
| **Concept Mastery Rate** | 45% | 65% | 80% |
| **Lighthouse Performance** | 92 | 95 | 98 |
| **Lighthouse Accessibility** | 85 | 95 | 100 |
| **Module Independence** | 0% | 60% | 100% |
| **Test Coverage** | 0% | 75% | 90% |
| **Deployment Frequency** | Manual | Weekly | Daily |
| **Mean Time to Recovery** | N/A | <1 hour | <15 minutes |

---

## 🤝 Team Onboarding

### Week 1: Orientation
- Read this charter
- Complete Educational Fitness Function training
- Set up development environment
- Run all fitness function tests locally

### Week 2: First Contribution
- Fix a bug in legacy code (under supervision)
- Write tests for existing functionality
- Document one architectural seam

### Week 3-4: First Migration
- Pair program on low-risk module extraction
- Learn Event Bus pattern
- Deploy first feature behind flag

### Month 2+: Independent Contribution
- Propose and implement vertical slice migration
- Lead Educational Fitness Function review for own features
- Mentor new team members

---

## 📚 Recommended Reading

### Architecture
- "Building Micro-Frontends" by Luca Mezzalira
- "Monolith to Microservices" by Sam Newman
- "Software Architecture for Developers" by Simon Brown

### Education Technology
- "How Learning Happens" by Paul Kirschner
- "Make It Stick" by Peter Brown
- "Understanding by Design" by Grant Wiggins

### Accessibility
- "Inclusive Components" by Heydon Pickering
- WCAG 2.1 Guidelines
- ARIA Authoring Practices

---

## 🔄 Charter Maintenance

This is a **living document**. Updates require:

1. Proposal via ADR (Architecture Decision Record)
2. Review Board approval
3. Team communication
4. Version bump and changelog entry

**Next Review Date:** 2026-10-29 (Quarterly)

---

*Signed,*  
**Chief Software Architect**  
**Date Signed:** 2026-07-29  
STEM Tuition Platform  
*"Building scientific literacy, one module at a time"*
