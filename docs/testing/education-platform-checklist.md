# Education Platform Testing Checklist

**Version:** 3.0.0
**Status:** Active
**Owner:** Product + Dev collaboration (compliance items jointly owned)
**Related:** `docs/testing/UNIVERSAL_TESTING_STANDARD.md`, `docs/policies/ACCESSIBILITY.md`, `docs/policies/PERFORMANCE.md`, `docs/policies/SECURITY.md`, `docs/policies/RELIABILITY.md`
**Applies To:** STEM Tuition web application (marketing + student/parent/tutor-facing features)

---

## Purpose

This checklist operationalizes the **Universal Testing Standard** taxonomy for an
education/STEM tutoring platform. Each item expands a Quality Attribute with a
concrete verification, mapped to a test level, lifecycle gate, automation status,
and owner. It is the executable counterpart of the taxonomy — domain-specific,
not a replacement for it.

Check an item `[x]` only when its verification is both **written** and **passing
in CI** (or explicitly accepted as manual).

---

## How to Use

- **Columns:**
  - **Level** — primary test level(s): `Static`, `Unit`, `Component`, `Integration`, `API`, `E2E`, `Manual`.
  - **Gate** — where it is enforced: `Local`, `PR`, `Merge`, `Nightly`, `Staging`, `Prod Verify`.
  - **Auto** — `A` Automated, `S` Semi-automated, `M` Manual.
  - **Owner** — `Dev`, `QA`, `Product`, `Security`, `Product+Dev`.
- **Risk tag** — `[CRIT]` blocks release, `[HIGH]` blocks merge, `[MED]` nightly, `[LOW]` on-demand.
- Compliance items default to **Product + Dev** ownership unless stated otherwise.

---

## 1. Functional

Validates business logic, user flows, and state management.

| # | Verification item | Level | Gate | Auto | Owner |
|---|---|---|---|---|---|
| F-01 | `[ ]` Class tier filtering (All / Gr 1–8 / SEE / NEB / A-Level) returns the correct cards and updates on re-filter | Integration | PR | A | Dev |
| F-02 | `[ ]` Enrollment flow converts from each entry point (hero CTA, class card, estimator form, WhatsApp deep-link) | E2E | Merge | A | QA |
| F-03 | `[ ]` Fee estimator maps grade + subject selection to correct weekly commitment estimate and updates live | Unit → Integration | PR | A | Dev |
| F-04 | `[ ]` Quiz engine scores correctly, shows instant feedback, and supports retake without stale state | Unit → E2E | PR | A | Dev |
| F-05 | `[ ]` Progress tracking persists per student (server or local) and survives navigation/reload | Integration | PR | A | Dev |
| F-06 | `[ ]` STEM scale converter (Celsius↔Fahrenheit, m↔ft, km↔mi) returns correct values incl. edge cases | Unit | PR | A | Dev |
| F-07 | `[ ]` Formula matrix renders all formulas and is filterable by subject | Component | PR | A | Dev |
| F-08 | `[ ]` Pioneer wall filters by field (Physics/Math/CS) correctly | Integration | PR | A | Dev |
| F-09 | `[CRIT]` Payment via local gateway (mobile banking, eSewa, Khalti) completes end-to-end and reflects in enrollment | E2E | Staging | S | QA |
| F-10 | `[HIGH]` Payment failure or timeout leaves no partial enrollment and allows idempotent retry | Integration | PR | A | Dev |
| F-11 | `[MED]` Tutor booking / calendar flow (future) rejects double-booking | Integration | Staging | S | Product |
| F-12 | `[MED]` Certificate generation (future) uses correct student/grade data | Integration | Staging | S | Product |

---

## 2. Usability / UX

Learnability, error recovery, empty states, and user feedback.

| # | Verification item | Level | Gate | Auto | Owner |
|---|---|---|---|---|---|
| U-01 | `[ ]` First-time student/parent onboarding can be completed without external help | E2E | Nightly | S | Product |
| U-02 | `[ ]` Empty states render for no classes, no progress, no quiz history (no raw errors) | Component | PR | A | Dev |
| U-03 | `[ ]` Network loss mid-quiz shows clear recovery prompt and resumes without data loss | E2E | Nightly | S | Dev |
| U-04 | `[ ]` Form validation errors are inline, specific, and recoverable (contact form, estimator) | Component | PR | A | Dev |
| U-05 | `[ ]` Video stall/error surfaces a retry affordance, not a dead screen | Component | PR | A | Dev |
| U-06 | `[ ]` Tutor dashboard (future) is learnable by a non-technical tutor in < 10 min | Manual | Staging | M | Product |
| U-07 | `[HIGH]` Every destructive/irreversible action (cancel enrollment, delete progress) requires confirmation and offers undo where possible | Component | PR | A | Product |

---

## 3. Visual / UI

Layout, styling, responsive design, and visual regression.

| # | Verification item | Level | Gate | Auto | Owner |
|---|---|---|---|---|---|
| V-01 | `[ ]` Glass-card surfaces (class cards, widgets, panels) render consistently across pages | Component | PR | A | Dev |
| V-02 | `[ ]` KaTeX formulas render identically to reference (no over/underflow in card layouts) | Component | PR | S | Dev |
| V-03 | `[ ]` Horizontal scroll carousels (classes, pioneers) behave on touch and mouse | E2E | Nightly | S | QA |
| V-04 | `[ ]` Dark/light mode keeps contrast and readability for study sessions | Component | PR | S | Dev |
| V-05 | `[HIGH]` Key pages have visual-regression baselines (home, classes, contact, about) with no unintended drift | E2E | Nightly | A | QA |
| V-06 | `[ ]` Cosmic background / hero animations do not break layout at any breakpoint | E2E | Nightly | A | QA |

---

## 4. Compatibility

Browsers, devices, screen sizes, and input methods.

| # | Verification item | Level | Gate | Auto | Owner |
|---|---|---|---|---|---|
| C-01 | `[HIGH]` Supported browsers: latest Chrome, Edge, Firefox, Safari (iOS) — core flows pass | E2E | Nightly | S | QA |
| C-02 | `[ ]` Mobile Safari (primary student device) renders carousels, quiz, and estimator correctly | E2E | Nightly | S | QA |
| C-03 | `[ ]` Tablet landscape (whiteboard/tutor mode) has usable layouts | E2E | Nightly | S | QA |
| C-04 | `[MED]` PWA/service-worker offline pages load (quiz continuation, notes) | E2E | Nightly | S | Dev |
| C-05 | `[ ]` Keyboard-only navigation works for all interactive surfaces | E2E | PR | A | Dev |
| C-06 | `[ ]` Touch input (tap targets ≥ 44px, no hover-only controls) validated | E2E | Nightly | S | QA |

---

## 5. Accessibility

WCAG, keyboard, screen readers, contrast, reduced motion.

| # | Verification item | Level | Gate | Auto | Owner |
|---|---|---|---|---|---|
| A-01 | `[CRIT]` axe-core scan passes on every page (no violations) | E2E | PR | A | Dev |
| A-02 | `[HIGH]` Math content exposes **MathML** output for assistive tech (KaTeX → MathML where appropriate) | Component | PR | S | Dev |
| A-03 | `[ ]` Custom elements (icons, cards, quiz) expose correct roles/ARIA | Component | PR | A | Dev |
| A-04 | `[HIGH]` Modal (enroll), carousel, and quiz manage focus correctly (trap, restore, dismiss) | E2E | PR | A | Dev |
| A-05 | `[ ]` Color contrast ≥ WCAG AA for text and interactive elements | Static | PR | A | Dev |
| A-06 | `[ ]` Reduced-motion preference disables/calms animations (cosmic bg, hover effects) | Component | PR | A | Dev |
| A-07 | `[ ]` Screen-reader smoke test on quiz + estimator flows (NVDA/VoiceOver) | Manual | Nightly | M | QA |

---

## 6. Performance

Core Web Vitals, latency, load, scalability.

| # | Verification item | Level | Gate | Auto | Owner |
|---|---|---|---|---|---|
| P-01 | `[CRIT]` Home LCP < 2.5s on 4G mobile profile | E2E | Nightly | A | Dev |
| P-02 | `[HIGH]` Quiz route load < 1s (JS + data) | Integration | PR | A | Dev |
| P-03 | `[ ]` Self-hosted HLS video startup < 3s to first frame; YouTube embeds lazy-loaded | E2E | Nightly | S | Dev |
| P-04 | `[HIGH]` Bundle-size budget enforced per route (e.g., ≤ 150 KB gzip) | Static | PR | A | Dev |
| P-05 | `[ ]` Cosmic background suspends rendering on idle to avoid background CPU burn | Unit | PR | A | Dev |
| P-06 | `[MED]` CLI (CLS < 0.1, TBT < 200ms) tracked per page in CI | E2E | Nightly | A | QA |
| P-07 | `[MED]` Fee estimator + quiz scale to large subject/class catalogs without jank | Integration | Nightly | S | Dev |

---

## 7. Resilience

Network failures, offline, third-party failures, graceful degradation, recovery.

| # | Verification item | Level | Gate | Auto | Owner |
|---|---|---|---|---|---|
| R-01 | `[HIGH]` **Offline quiz continuation** — attempt survives disconnection and syncs on reconnect | E2E | Nightly | S | Dev |
| R-02 | `[HIGH]` Lesson text and downloaded notes/PDFs available offline (cached) | E2E | Nightly | S | Dev |
| R-03 | `[HIGH]` Progress cached locally and auto-synced on reconnect without duplicates | Integration | PR | A | Dev |
| R-04 | `[ ]` HLS stream degrades (bitrate ladder) on poor networks instead of failing | E2E | Nightly | S | Dev |
| R-05 | `[ ]` YouTube embed failure falls back gracefully (poster + retry) | Component | PR | A | Dev |
| R-06 | `[MED]` Payment gateway timeout produces a recoverable state (no double charge, no lost enrollment) | Integration | Staging | S | Dev |
| R-07 | `[MED]` Third-party font/CDN failure degrades to system fonts without layout break | Component | PR | A | Dev |

---

## 8. Security

Authentication, authorization, OWASP, secrets, dependency vulnerabilities.

| # | Verification item | Level | Gate | Auto | Owner |
|---|---|---|---|---|---|
| S-01 | `[CRIT]` Role-based access enforced (student / parent / tutor / admin; institution future) — no privilege escalation | Integration | PR | A | Dev |
| S-02 | `[CRIT]` Student PII encrypted in transit (TLS) and at rest; never in client logs | Static → Integration | PR | A | Security |
| S-03 | `[HIGH]` CSP present and blocks inline scripts (KaTeX/YouTube allowed via nonce/host allow-list) | Static | PR | A | Security |
| S-04 | `[HIGH]` Dependency vulnerabilities blocked in CI (`audit` fail on high/critical) | Static | PR | A | Security |
| S-05 | `[HIGH]` Payment callback/webhook signature verified (eSewa/Khalti/mobile banking) | Integration | Staging | A | Security |
| S-06 | `[ ]` No secrets in repo or client bundle (env-injected only) | Static | PR | A | Security |
| S-07 | `[ ]` Quiz/data inputs sanitized against XSS | Unit | PR | A | Dev |

---

## 9. Privacy & Compliance

GDPR (EU), Nepal data protection, consent, retention, auditability.

| # | Verification item | Level | Gate | Auto | Owner |
|---|---|---|---|---|---|
| PC-01 | `[CRIT]` GDPR consent flow (EU students) — explicit, granular, revocable; analytics gated on consent | Integration | PR | S | Product+Dev |
| PC-02 | `[HIGH]` Right to erasure / data export works for student records | Integration | Staging | S | Product+Dev |
| PC-03 | `[HIGH]` Minors' data treated under applicable child-protection rules (parental consent path) | Integration | Staging | S | Product+Dev |
| PC-04 | `[ ]` Data retention policy enforced (e.g., progress history, payment records 10 yrs) | Integration | Staging | S | Product+Dev |
| PC-05 | `[ ]` Privacy policy + consent evidence auditable (timestamped record of consent) | Integration | Staging | S | Product+Dev |
| PC-06 | `[ ]` Analytics/tracking inventory documented and matches what is shipped | Manual | Staging | M | Product+Dev |

---

## 10. Content & SEO

Metadata, structured data, links, indexing, content quality.

| # | Verification item | Level | Gate | Auto | Owner |
|---|---|---|---|---|---|
| O-01 | `[HIGH]` Course/Offer schema.org markup validates on class pages | Static | PR | A | Product |
| O-02 | `[ ]` Meta titles/descriptions/OG tags present on all pages (social sharing) | Static | PR | A | Product |
| O-03 | `[ ]` Internal links resolve (no broken hrefs) across pages | E2E | Nightly | A | QA |
| O-04 | `[ ]` Sitemap covers dynamic class/program pages and is auto-refreshed | Integration | Nightly | A | Product |
| O-05 | `[MED]` Curriculum content aligns to SEE/NEB/A-Level keywords without stuffing | Manual | Staging | M | Product |
| O-06 | `[ ]` Content quality check: no stale/duplicate class or tutor listings | Manual | Staging | M | Product |

---

## 11. Internationalization *(Conditional — Nepal + EU primary)*

Translation, locale formatting.

| # | Verification item | Level | Gate | Auto | Owner |
|---|---|---|---|---|---|
| I-01 | `[ ]` UI supports Nepali + English; text extraction is keyed (no hard-coded copy) | Static | PR | A | Dev |
| I-02 | `[ ]` Fees/numbers render in Devanagari numerals for `ne` locale where required | Component | PR | A | Dev |
| I-03 | `[ ]` Date/fee formats locale-aware (Nepal vs EU) | Unit | PR | A | Dev |
| I-04 | `[ ]` Layout is RTL-ready structurally (future Arabic) without hard-coded `left`/`right` | Static | PR | S | Dev |
| I-05 | `[MED]` Missing-translation fallback defined (no raw keys leaked to users) | Component | PR | A | Dev |

---

## 12. Observability *(Conditional — Core for any production system)*

Logs, metrics, traces, health checks, alerts.

| # | Verification item | Level | Gate | Auto | Owner |
|---|---|---|---|---|---|
| OB-01 | `[CRIT]` Health check endpoint reports app + dependency (DB/payment) status | Integration | Prod Verify | A | Dev |
| OB-02 | `[ ]` Structured logs on key flows (enrollment, quiz submit, payment) without PII | Unit | PR | A | Dev |
| OB-03 | `[ ]` Error tracking captures client-side exceptions with context | Integration | PR | A | Dev |
| OB-04 | `[HIGH]` Payment/conversion funnel metrics surfaced to Product dashboard | Integration | Nightly | S | Product+Dev |
| OB-05 | `[ ]` Synthetic smoke check in production alerts on critical-path failure | E2E | Prod Verify | A | QA |

---

## Cross-Cutting Checks (from taxonomy §V)

| # | Practice | Verification item | Gate | Auto | Owner |
|---|---|---|---|---|---|
| X-01 | Regression | Unit ≥ 10× Component ≥ 5× E2E by count (enforced) | PR | A | Dev |
| X-02 | Flakiness | Per-suite flake rate ≤ 1%; flaky tests quarantined → fixed → re-enabled | Merge | A | QA |
| X-03 | Mutation | Mutation testing required for core logic (`simulation-core`, `quiz-engine`, `hover-engine`) | Nightly | S | Dev |
| X-04 | Test data | Fixtures for unit; seeded DB for E2E; synthetic data for prod smoke | PR | A | QA |
| X-05 | Traceability | Every checklist item links to a test file or tracked manual step | PR | A | QA |

---

## Future / Deferred

Tracked explicitly so scope stays honest.

- `[ ]` Video download (storage + licensing complexity) — **future versions only**
- `[ ]` WebRTC live sessions — **far future**, resilience items deferred with it
- `[ ]` Institution accounts (multi-tenant enrollment/reporting) — audit functional, security, and privacy items on addition
- `[ ]` AI-assisted features (quiz generation, adaptive difficulty) — add AI domain extension checks on introduction
