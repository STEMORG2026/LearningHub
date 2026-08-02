# Universal Testing Standard v1.1

**Version:** 3.0.0
**Status:** Stable foundation (v1.1 execution refinements)
**Owner:** Architecture
**Related:** `docs/testing/education-platform-checklist.md`, `docs/RULES.md`
**Applies To:** All current and future products

---

## Purpose

A layered testing standard that separates concerns into orthogonal axes so that
every product can derive its own concrete checklists without redefining the
standard. This is the stable conceptual model; operational refinements land in
later minor versions, tool profiles in v2.0.

**Version lineage:** v1.0 = core taxonomy (stable foundation) · v1.1 = execution
refinements (this version) · v1.2 = risk engine (planned) · v2.0 = tool profiles
(planned). See [Version History](#version-history).

---

## I. Testing Levels (How)

Defines the scope and isolation of tests.

**Core**

1. Static Verification
2. Unit Testing
3. Component Testing
4. Integration Testing
5. API Testing
6. System / End-to-End (E2E) Testing
7. Manual / Exploratory Testing

**Conditional**

8. Contract Testing — required for any **independently versioned API
   consumer/provider pair**, including frontend↔backend and third-party service
   boundaries, not only microservices. Applies when each side ships/deploys on
   its own cadence.

---

## II. Quality Attributes (What)

Defines what property is being validated.

### Functional
- Business logic
- User flows
- State management

### Usability / UX
- Learnability
- Error recovery
- Empty states
- User feedback

### Visual / UI
- Layout
- Styling
- Responsive design
- Visual regression (two scopes, see mapping A):
  - Component-level: component library visual baseline (e.g., Storybook/Chromatic)
  - E2E-level: full-page screenshot baseline on key routes (e.g., Playwright)

### Compatibility
- Browsers
- Devices
- Screen sizes
- Input methods

### Accessibility
- WCAG
- Keyboard navigation
- Screen readers
- Contrast
- Reduced motion

### Performance
- Core Web Vitals
- Latency
- Throughput
- Load
- Scalability

### Resilience
- Network failures
- Offline mode
- Third-party failures
- Graceful degradation
- Recovery

### Security
- Authentication
- Authorization
- OWASP risks
- Secrets
- Dependency vulnerabilities

### Privacy & Compliance
- GDPR/CCPA (or local equivalents)
- Consent
- Data retention
- Auditability

### Content & SEO
- Metadata
- Structured data
- Links
- Search indexing
- Content quality

### Internationalization *(Conditional)*
- Translation
- RTL
- Locale formatting

### Observability
- Logs
- Metrics
- Traces
- Health checks
- Alerts

*(Core — every production system needs health checks, structured logs, and
error capture; treated as Conditional only for pre-production prototypes.)*

---

## III. Lifecycle Gates (When)

1. Local / Pre-Commit
2. Pull Request (CI)
3. Merge to Main
4. Nightly / Scheduled
5. Staging / QA
6. Production Deploy
7. Production Verification
8. Release
9. Rollback Verification

---

## IV. Domain Extensions (Context)

These extend—not replace—the core standard.

- Marketing Website
- Blog / CMS
- SaaS
- E-Commerce
- Education
- AI / ML
- FinTech
- Healthcare
- GIS
- Games
- IoT
- Project-specific

---

## V. Cross-Cutting Practices (Governance)

These apply across every level, quality attribute, and lifecycle gate.

- Regression Testing
- Smoke Testing
- Sanity Testing
- Exploratory Testing
- Risk-Based Testing
- Test Data Management
- Traceability
- Coverage & Metrics
- Mutation Testing (Advanced) — *Conditional: required for core business-logic
  packages (e.g., simulation, quiz, scoring engines); optional elsewhere*
- Chaos Engineering (Advanced)

### Governance rules (v1.1)

- **Test Pyramid** — by test count, enforce `Unit ≥ 10 × Component ≥ 5 × E2E`.
  E2E is reserved for critical user paths; deep behavior belongs in lower layers.
- **Flakiness budget** — per-suite flake rate ≤ 1%. A flaky test is quarantined,
  fixed, and re-enabled; it never blocks a healthy pipeline by re-run gambling.
- **Test Data Management (TDM)** — data strategy is mapped per level (see B):
  unit fixtures, component/API fixtures, seeded staging DB for E2E, synthetic
  data for production smoke. TDM is a first-class gate input, not an afterthought.
- **Visual regression gate** — component baselines gate PRs; full-page baselines
  gate on Nightly (fast full-page sets are too brittle for every commit).

---

## VI. Reference Mappings

These make the taxonomy actionable.

### A. Quality Attribute × Test Level

| Quality       | Primary Levels                        |
| ------------- | ------------------------------------- |
| Functional    | Unit → Integration → API → E2E        |
| Visual (component) | Component                          |
| Visual (E2E page)  | E2E                                |
| Accessibility | Static → Component → E2E              |
| Security      | Static → Integration → API → E2E      |
| Performance   | Integration → API → E2E               |
| Observability | Integration → Production Verification |
| Contract      | API (consumer/provider pairs)         |

### B. Lifecycle Gate × Test Level (+ Test Data)

| Gate                    | Typical Tests                           | Test Data                          |
| ----------------------- | --------------------------------------- | ---------------------------------- |
| Local                   | Static, Unit                            | Inline fixtures                    |
| Pull Request            | Unit, Component, Integration, API       | Fixtures + mocked services         |
| Merge                   | Integration, API, Baseline E2E          | Seeded shared DB (ephemeral)       |
| Nightly                 | Full E2E, Performance, Security, Visual | Fresh seeded staging DB            |
| Staging                 | Full Regression, Manual, UAT            | Representative/anonymized data    |
| Production Verification | Smoke, Synthetic Monitoring             | Synthetic production-safe records  |
| Rollback                | Rollback Tests                          | Snapshot of pre-release state      |

### C. Ownership Matrix

Assign responsibility for each area:

- Developers
- QA Engineers
- DevOps / SRE
- Security
- Product / UX
- Stakeholders (UAT)

### D. Automation Matrix

Define:

- Automated
- Semi-automated
- Manual

for every test category.

### E. Evidence Matrix

Specify what proves a test passed:

- CI logs
- Reports
- Screenshots
- Coverage reports
- Security scans
- Performance reports
- Accessibility audits

---

## VII. Domain Checklists

This taxonomy should generate concrete checklists rather than embedding them.

Examples:

- Universal Website Checklist
- SaaS Checklist
- E-Commerce Checklist
- CMS Checklist
- Education Platform Checklist
- AI Application Checklist
- FinTech Checklist
- Healthcare Checklist

Each checklist expands the relevant Quality Attributes with actionable
verification items.

---

## Version History

> The `**Version:**` header above tracks the project release (set by
> `sync-versions`); this table tracks the standard's own semantic versions.

| Version | Date | Changes |
|---------|------|---------|
| **1.1.0** | 2026-08-02 | Execution refinements: refined Contract Testing trigger (any versioned consumer/provider pair); Observability promoted to Core; Visual regression split into component-level and E2E page-level scopes; added governance rules (test pyramid ratios, flakiness budget ≤1%, TDM mapping into Gate × Level, visual gate policy); Mutation Testing classified as conditional-required for core logic packages; mapping A/B updated to match |
| **1.0.0** | 2026-08-02 | Baseline taxonomy: levels, quality attributes, lifecycle gates, domain extensions, cross-cutting practices, reference mappings, domain checklist pattern |

---

## Design Philosophy

The standard stays clean by separating concerns:

- **Testing Levels** answer **how** tests are performed.
- **Quality Attributes** answer **what** is being validated.
- **Lifecycle Gates** answer **when** tests run.
- **Domain Extensions** answer **where** domain-specific risks apply.
- **Cross-Cutting Practices** define governance across all axes.
- **Reference Mappings** connect the axes into an executable testing strategy.
- **Domain Checklists** provide practical, project-specific validation.

This is a stable, extensible testing standard suitable for websites, web
applications, APIs, SaaS products, enterprise systems, and most modern software
projects. It is modular enough to evolve without changing its core structure,
and specific checklists can be derived from it for different domains and risk
profiles.
