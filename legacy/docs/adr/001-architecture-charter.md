# ADR-001: Establish Architecture Charter and Strangler Fig Migration Strategy

## Status
**Superseded** — replaced by ADR-001 through ADR-009 in `docs/adr/` (2026-07-30). The documents at `docs/ARCHITECTURE.md`, `docs/COMPONENT_STANDARDS.md`, `docs/EVENT_BUS_CONTRACT.md`, and `docs/RULES.md` now govern the project.

## Date
2026-07-29

## Context

The STEM Tuition Platform has been frozen at v1.0.0 with a comprehensive architecture fitness report showing excellent health (98/100). However, the current monolithic frontend architecture presents long-term risks:

1. **Single Bundle Risk:** All functionality resides in `stem-effects.js` (~51KB), creating a single point of failure
2. **Tight Coupling:** Canvas engine, quiz logic, hover animations, and audio synth are interdependent
3. **Limited Scalability:** Adding new features requires modifying the core bundle
4. **Framework Lock-in:** Unable to adopt better technologies for specific use cases
5. **Testing Limitations:** Business logic cannot be tested independently from DOM

The team needs a clear, principled approach to incrementally migrate toward a modular architecture without disrupting the stable, working platform.

## Decision

We adopt the **Strangler Fig Pattern** as our primary migration strategy, governed by a formal **Architecture Charter** that establishes:

### 1. Ten Non-Negotiable Principles
1. Legacy code is frozen (v1.0.0 tag is immutable baseline)
2. All new development happens outside legacy layer (`/src/modern/`)
3. Every migration must be reversible (feature flags required)
4. Prefer adapters over rewrites
5. Preserve behavior before improving implementation
6. Small, incremental migrations (max 2 weeks per vertical slice)
7. New modules must be independent and reusable
8. Business logic must never depend directly on DOM
9. User experience takes priority over framework choice
10. Educational value is more important than technical novelty

### 2. Dual Fitness Function Framework
All features must pass both:
- **Educational Fitness Functions:** 8-question interrogation ensuring pedagogical value
- **Architecture Fitness Functions:** 8 automated checks enforced on every PR

### 3. Technology Evaluation Process
All technology adoptions require a **Technology Decision Record (TDR)** documenting:
- Problem statement
- Alternatives considered
- Trade-offs and maintenance impact
- Migration complexity assessment

### 4. Migration Phases (52-week roadmap)
- **Phase 1 (Weeks 1-4):** Foundation (monorepo, shared kernel, event bus)
- **Phase 2 (Weeks 5-12):** First Strangle (Physics Canvas Engine → Web Component)
- **Phase 3 (Weeks 13-24):** Core Business Logic (Quiz Engine → React)
- **Phase 4 (Weeks 25-36):** UI Components (Card System → Vue)
- **Phase 5 (Weeks 37-52):** Platform Completion (Shell, Navigation, Progress Tracking)

### 5. Organizational Structure
- **Architectural Review Board:** Weekly review of proposals
- **Escalation Protocol:** Clear triggers for board intervention
- **Team Onboarding:** Structured 4-week ramp-up program

## Consequences

### Positive
- ✅ **Risk Mitigation:** Incremental migration reduces chance of catastrophic failure
- ✅ **Technology Flexibility:** Can adopt best-in-class tools per module (Web Components, React, Vue, Svelte)
- ✅ **Parallel Development:** Teams can work on independent modules simultaneously
- ✅ **Educational Focus:** Formal fitness functions ensure learning outcomes drive decisions
- ✅ **Reversibility:** Feature flags enable safe experimentation and quick rollback
- ✅ **Clear Governance:** Decision log (ADRs) creates institutional memory
- ✅ **Measurable Progress:** Quarterly success metrics track transformation

### Negative
- ⚠️ **Initial Overhead:** Setting up monorepo, CI/CD pipelines, and fitness function automation requires 2-4 weeks of investment
- ⚠️ **Cognitive Load:** Developers must learn multiple patterns (Event Bus, ACLs, feature flags)
- ⚠️ **Dual Maintenance:** Temporary need to maintain both legacy and modern code paths
- ⚠️ **Complexity:** Event Bus communication adds indirection compared to direct function calls
- ⚠️ **Documentation Burden:** ADR process requires discipline and time

### Neutral
- ➖ **Build Tool Introduction:** Vite will be introduced for new modules only; legacy remains build-free
- ➖ **Framework Diversity:** Different modules may use different frameworks (intentional polyglot approach)
- ➖ **Testing Infrastructure:** New testing tools (Vitest, Playwright) supplement existing manual testing

## Compliance Checklist

- [x] Educational Fitness Functions satisfied
  - Charter defines 8-question educational interrogation
  - Example provided for Physics Simulation feature
  - AI assistance guidelines prevent answer-giving
  
- [x] Architecture Fitness Functions defined
  - 8 automated checks specified with tooling recommendations
  - Integration points with CI/CD documented
  - Failure conditions clearly stated
  
- [x] Migration plan documented
  - 5-phase, 52-week roadmap with weekly granularity
  - Risk-ranked module extraction order
  - ACL patterns provided
  
- [x] Rollback procedure defined
  - Feature flag requirement for all new modules
  - A/B testing capability mandated
  - Emergency escalation protocol established

## Related Documents

- `/workspace/ARCHITECTURE_CHARTER.md` - Full charter document
- `/workspace/ARCHITECTURE_FITNESS_REPORT.md` - Baseline assessment
- `/workspace/ARCHITECTURE_MIGRATION_STRATEGY.md` - Detailed migration tactics
- `/workspace/VERSION_FREEZE.md` - v1.0.0 freeze documentation

## Next Steps

1. **Week 1:** 
   - Set up pnpm workspaces monorepo structure
   - Create `@stem/core` shared package
   - Implement Event Bus with BroadcastChannel
   
2. **Week 2:**
   - Configure ESLint rules for fitness functions
   - Set up Vitest and Playwright
   - Extract Audio Synth as first standalone library
   
3. **Week 3:**
   - Implement feature flag system
   - Document first architectural seam (Canvas Engine)
   - Begin Physics Engine Web Component prototype

## References

- Fowler, M. "Strangler Fig Application" - https://martinfowler.com/bliki/StranglerFigApplication.html
- Mezzalira, L. "Building Micro-Frontends" - Manning Publications, 2020
- Newman, S. "Monolith to Microservices" - O'Reilly Media, 2019

---

*Approved by:* Chief Software Architect  
*Review Date:* 2026-07-29  
*Next Review:* 2026-10-29 (Quarterly)
