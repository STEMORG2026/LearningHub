# STEM-TUITION Pipeline Gap Analysis

**Version:** 3.0.0
**Status:** Working document — snapshot as of 2026-08-02
**Owner:** Product + Dev
**Related:** `docs/testing/UNIVERSAL_TESTING_STANDARD.md`, `docs/testing/education-platform-checklist.md`
**Applies To:** `apps/shell`, `packages/*` (monorepo)

---

## Purpose

Maps the current verification pipeline against the **Universal Testing Standard**
Gate × Level matrix and Quality Attributes. This is the implementation gap
analysis: it shows what already exists, what is mislabeled or weak, and what must
be built — ranked by risk. Checklist item IDs (e.g., A-01, P-01) reference the
Education Platform Checklist.

---

## 1. Current Verification Pipeline

There is **no configured CI platform** (no `.github/workflows`, no GitLab/Azure
config). "CI" today means the local scripts in `package.json`, run by hand or by
a future external trigger.

| Gate | What runs today | Notes |
|------|-----------------|-------|
| **Pre-commit** | `docs:sync` only | No lint, typecheck, or tests at commit time |
| **PR (local)** | `verify-governance` / `quick` / `check` | Full suite is runnable locally but not enforced by a server |
| **Merge** | none (same as PR) | No distinct merge gate |
| **Nightly** | none | No scheduled runs |
| **Staging** | none | No staging environment |
| **Prod Verify** | none | No health/smoke/synthetic checks |
| **Rollback** | none | No rollback verification |

`verify-governance` composition: `lint:arch` → `lint:circular` → `lint:state` →
`lint:dom` → `build` → `typecheck` → `test:coverage` → `test:a11y` → `lint:size`
→ `validate:edu` → `lint:registry`.

---

## 2. Gate × Test Level Assessment

| Level | Status | Evidence / Gap |
|-------|--------|----------------|
| **Static** | ✅ Strong | arch/circular/state/dom lints, strict TS typecheck, `lint:size` (100 KB gzip budgets), `validate:edu`, `lint:registry` |
| **Unit** | ✅ Strong | ~248 tests across 7 packages; per-package coverage ratchets (sim-core 87% lines, hover-engine 100%, etc.) |
| **Component** | ⚠️ Weak | Only `quiz-engine` has a web-component test; `hover-effects`, `render.ts` templates, DYK/enroll-modal/faq components have no isolated tests |
| **Integration** | ⚠️ Partial | EventBus/ACL/audio-synth bridge tests, physics core integration; no jsdom-based component harness; no multi-package flow tests |
| **API** | ⏸️ N/A | No backend yet. Becomes **Required** when payment gateways (eSewa/Khalti/mobile banking) or any server API land |
| **E2E** | ⚠️ Weak | 10 tests: page-load smoke + basic renders + contact form submit; single browser (Chromium); **no axe scan**, no critical-path flows, no visual/perf/resilience |
| **Contract** | ⏸️ N/A | No independently versioned consumers/providers yet (see v1.1 refined trigger) |
| **Manual** | ⚠️ Ad hoc | Exploratory only; not tracked against the checklist |

---

## 3. Quality Attribute Coverage

| Attribute | Status | Notes |
|-----------|--------|-------|
| Functional | ⚠️ Partial | Quiz/physics/estimation logic unit-tested; carousels/filters smoke-tested; enrollment conversion (F-01..F-10) untested E2E |
| Usability / UX | ❌ | No empty-state, error-recovery, or validation-feedback tests (U-02..U-05) |
| Visual / UI | ❌ | No visual regression baselines (V-05) |
| Compatibility | ❌ | Single browser, no device/mobile-Safari matrix (C-01..C-04) |
| Accessibility | ❌ | `test:a11y` is **mislabeled** — it runs page smoke tests with no axe injection. A-01 (axe scan), A-02 (MathML), A-04 (focus) all missing |
| Performance | ⚠️ | Bundle-size gate only; no Core Web Vitals / Lighthouse (P-01, P-06) |
| Resilience | ❌ | No offline/network-failure/degradation tests (R-01..R-07); offline features don't exist yet |
| Security | ❌ | No dependency audit in CI, no CSP/secret checks (S-03, S-04); auth/authorization N/A until backend |
| Privacy & Compliance | ❌ | Nothing automated; GDPR/Nepal items are policy-only for now (PC-01..PC-06) |
| Content & SEO | ⚠️ | `validate:edu` checks metadata; no schema.org/structured-data/OG tests (O-01..O-04) |
| Internationalization | ⏸️ N/A | Single-language today; becomes Required with `ne` locale |
| Observability | ⚠️ | Tracer package + no-global-state lint exist; no health checks, no structured-log assertions, no prod smoke |

---

## 4. Test Pyramid Snapshot

| Layer | Count | Target (v1.1) | Verdict |
|-------|-------|---------------|---------|
| Unit | ~248 | base | ✅ |
| Component | ~2 (quiz WC) | ≥ 0.1 × Unit (~25) | ❌ far below |
| E2E | 10 | ≤ 0.1 × Unit (~25 cap) | ⚠️ within cap, but wrong focus (smoke > critical paths) |

The pyramid is bottom-heavy but **missing its middle**: components and
integrations are the weakest, highest-leverage gap.

---

## 5. Priority Gaps (Ranked by Risk)

| # | Gap | Risk | Checklist ref | Recommended action | Target gate | Owner | Status |
|---|-----|------|---------------|--------------------|-------------|-------|--------|
| G-1 | No real accessibility scan (a11y suite is smoke-only) | **High** — legal + usability | A-01, A-03, A-04 | Inject `@axe-core/playwright` into every page test; add focus-management + keyboard tests; rename suite | PR | Dev | ✅ DONE (2026-08-02) |
| G-2 | No CI platform — governance is hand-run | **High** — nothing is actually enforced | all | Add GitHub Actions running `verify-governance` on PR + merge | PR/Merge | Dev | ✅ DONE (2026-08-02) |
| G-3 | No critical-path E2E for core flows | **High** — money paths | F-01, F-03, F-04, F-09 | E2E for estimator, quiz attempt, class filter, payment (once backend) | Nightly | QA | Open |
| G-4 | Component tests near zero | High | V-01, U-02 | jsdom tests for hover-effects, render templates, DYK/enroll-modal/faq components | PR | Dev | Open |
| G-5 | No visual regression | Medium | V-05 | Playwright screenshot baselines for 5 routes + component states | Nightly | QA | Open |
| G-6 | No performance budget beyond bundle size | Medium | P-01, P-04, P-06 | Lighthouse CI with CWV budgets; keep `lint:size` | Nightly | Dev | Open |
| G-7 | No dependency audit | Medium | S-04 | `pnpm audit` in CI (fail on high/critical) | PR | Security | ✅ DONE (2026-08-02) |
| G-8 | No scheduled/nightly pipeline | Medium | — | Nightly cron for full E2E + perf + audit | Nightly | Dev | Open |
| G-9 | Pre-commit runs only docs:sync | Low-Med | — | Add `quick` (lints + typecheck) to pre-commit hook | Local | Dev | ✅ DONE (2026-08-02) |
| G-10 | No prod verification (smoke/health) | Low-Med (until backend) | OB-01, OB-05 | Health endpoint + synthetic smoke once a server exists | Prod Verify | Dev | Open |
| G-11 | Contract/API tests | Deferred | — | Required at first backend/payment integration | PR | Dev | Open |

---

## 6. Recommended Roadmap

**Phase A — Fix enforcement (1–2 sprints)** — ✅ DONE (2026-08-02)
1. Add CI workflow (G-2) running `verify-governance` + `pnpm audit` (G-7).
2. Add axe scan + keyboard/focus tests; rename the a11y suite (G-1).
3. Extend pre-commit hook with `quick` (G-9).

**Phase B — Build the middle (2–3 sprints)**
4. Component test harness (jsdom) for shell components (G-4).
5. Critical-path E2E: estimator, quiz, class filter (G-3).

**Phase C — Trust & trend (ongoing)**
6. Visual regression baselines (G-5).
7. Lighthouse CI budgets (G-6).
8. Nightly pipeline consolidating full E2E + perf + audit (G-8).

**Phase D — Backend triggers**
9. API + contract tests, prod smoke/health, payment E2E the moment any
   server/API or gateway integration lands (G-10, G-11).

---

## Appendix: Facts Captured (2026-08-02)

- Unit test counts: core 103, tracer 24, audio-synth 14, quiz-engine 16,
  hover-engine 12, acl 14, simulation-core 65 (total ≈ 248).
- E2E: `e2e/shell-pages.spec.ts`, 10 tests, Chromium default, no axe.
- Accessibility (post-fix): `e2e/accessibility.spec.ts` adds 5 axe scans
  (all pages, 0 violations) + landmark, modal focus-trap, and keyboard
  scroller tests.
- Coverage: per-package vitest ratchets (simulation-core lines 87, tracer 34).
- CI: `.github/workflows/ci.yml` runs `verify-governance` + `pnpm audit --prod`
  on PR and push to `main`; pre-commit hook runs `pnpm quick` then `docs:sync`.
- `test:a11y` runs the same Playwright suite as the smoke tests — no
  accessibility tooling is invoked.
- No `.github/workflows`, no `*.yml` CI config beyond workspace/lock files.
- Size budgets: applications gzip (≤ 100 KB), libraries raw dist bytes.
