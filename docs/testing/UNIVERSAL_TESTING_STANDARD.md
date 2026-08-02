# Universal Testing Standard v1.0

**Version:** 3.0.0
**Status:** Stable foundation
**Owner:** Architecture
**Related:** `docs/testing/education-platform-checklist.md`, `docs/RULES.md`
**Applies To:** All current and future products

---

## Purpose

A layered testing standard that separates concerns into orthogonal axes so that
every product can derive its own concrete checklists without redefining the
standard. This is the stable conceptual model; operational refinements land in
later minor versions, tool profiles in v2.0.

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

8. Contract Testing (for independently versioned services/microservices)

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
- Visual regression

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

### Observability *(Conditional)*
- Logs
- Metrics
- Traces
- Health checks
- Alerts

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
- Mutation Testing (Advanced)
- Chaos Engineering (Advanced)

---

## VI. Reference Mappings

These make the taxonomy actionable.

### A. Quality Attribute × Test Level

| Quality       | Primary Levels                        |
| ------------- | ------------------------------------- |
| Functional    | Unit → Integration → API → E2E        |
| Visual        | Component → E2E                       |
| Accessibility | Static → Component → E2E              |
| Security      | Static → Integration → API → E2E      |
| Performance   | Integration → API → E2E               |
| Observability | Integration → Production Verification |

### B. Lifecycle Gate × Test Level

| Gate                    | Typical Tests                           |
| ----------------------- | --------------------------------------- |
| Local                   | Static, Unit                            |
| Pull Request            | Unit, Component, Integration, API       |
| Merge                   | Integration, API, Baseline E2E          |
| Nightly                 | Full E2E, Performance, Security, Visual |
| Staging                 | Full Regression, Manual, UAT            |
| Production Verification | Smoke, Synthetic Monitoring             |
| Rollback                | Rollback Tests                          |

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
