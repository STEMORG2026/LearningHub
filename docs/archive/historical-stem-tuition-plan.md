---
status: HISTORICAL
canonical: false
superseded_by: docs/VISION.md
description: Historical post-rename STEM Tuition implementation plan (2026-09)
---

# LearningHub Implementation Plan — Post-Rename (2026-09)

**Version:** 3.0.0
**Date:** 2026-09-02
**Author:** Hermes Agent (single authoritative copy — no peer-agent twin)
**Status:** Proposed — execution requires owner approval per workstream (W0 contains human-gated external steps)
**Supersedes:** nothing. `docs/ROADMAP.md` (`.phase.json`) remains the machine-owned phase
record; this plan sequences the work *around* it after the LearningHubSTEM→STEMMA /
STEM-TUITION→LearningHub re-brand (PRs #37, #38; A8 in flight as PRs #39/#40).

**Method note:** every finding below was read from the live code/CI/deploy logs on
2026-09-02 (commit `32e8c35`), not from roadmap claims. File:line evidence is given.

---

## 0. Executive summary

The platform engineering is far above SOTA for a solo static site: strict-TS Web Components
monorepo, contract-tested STEMMA consumer seam, 11-job CI with a11y + visual regression +
Lighthouse/size budgets + dependency-cruiser, coverage ratchet, docs-sync automation, and a
gated 4-stage release pipeline. What is *wrong* is concentrated in three places:

1. **Lead capture is fake** — the contact form shows an alert and silently discards every
   inquiry; the phone `tel:` link is literally broken.
2. **The re-brand is incomplete where it is user-visible or operationally load-bearing** —
   WhatsApp prefill still says "STEM Tuition Pokhara", monitor still watches the old
   `stem-tution.pages.dev`, governance docs (AGENTS/RULES/CONSTITUTION/README/Dockerfile)
   still carry the old name, and the progress-storage key rename in PR #40 wipes saved
   student progress without a migration.
3. **The marketing/SEO scaffolding every SOTA tuition site has is absent** — no sitemap, no
   JSON-LD, no og:image, no 404 page (a catch-all serves index at 200), no security
   headers, no analytics, no trust layer (testimonials, founder credentials, results).

Workstreams W0–W9 below fix all of it with exact files, TDD steps, and honest
NOW / SEAM / LATER / OUT classification.

---

## 1. Measured current state (2026-09-02)

| Area | Measured state |
|---|---|
| Phase | 0–6 completed; 7 planned; 8 in-progress (`apps/shell`, content packages) |
| Repo | `learninghub` v3.0.0, pnpm+turborepo, 11 packages + shell, ~26k LOC TS, 34 unit-test files |
| E2E | Playwright: accessibility, critical-path, shell-pages, visual-regression (+snapshots) |
| CI | 11 jobs incl. Lighthouse assertions, gzip size budgets, Trivy, gitleaks, commitlint, signed tags, docs-freshness, changeset provenance |
| Deploy | Cloudflare Pages; old project `stem-tution` live (HTTP 200); new `learninghubstem` created but deploy blocked: token auth error 10000 (missing Pages:Edit) |
| Open PRs | #39 (CF project migration, MERGEABLE), #40 (consumer re-brand, MERGEABLE) — both red only on pre-existing visual-regression + old-project CF checks |
| STEMMA seam | `apps/shell/src/data/knowledge.json` vendored via `pnpm sync:lhs`; `lhs-adapter.ts` pins `export_version 0.1` with dangling-ref + shape errors — contract-safe |

---

## 2. Vigorous review — what is WRONG (verified, with evidence)

Severity: **P0** breaks users/business now · **P1** breaks soon or misleads · **P2** hygiene.

### P0 — Correctness

| # | Finding | Evidence | Fix |
|---|---|---|---|
| W1.1 | **Broken phone link.** `tel:` href contains masked asterisks; displayed number is fine, the actual dial link is not. | `apps/shell/contact.html:37` `href="tel:+977****1317"` (also unfixed on PR #40 branch) | href → `tel:+9779768021317`; add e2e assertion that `tel:` href equals displayed number |
| W1.2 | **Contact form discards inquiries.** Submit handler shows `window.alert("…received…")` and sends nothing — no network call, no mailto, no WhatsApp handoff. Every lead is silently lost while the UI promises "We will call you shortly." | `apps/shell/src/lib/interactive.ts:79-87` | Build a prefilled WhatsApp message from the form fields and open `wa.me` (zero-backend, matches OUT-of-scope rules); delete the alert. Honest fallback: if owner prefers no funnel, copy must say so. TDD: unit-test the message builder |
| W1.3 | **Progress wipe on re-brand.** PR #40 renames localStorage key `stem-tuition-progress` → `learninghub-progress` with no read-migration; every existing student's saved progress is dropped at deploy. | `apps/shell/src/lib/progress-tracker.ts:25` (PR #40 branch: new key, `load()` has no legacy fallback) | One-time migration in `load()`: if new key absent and legacy key present, copy + remove legacy. TDD: jsdom test with both keys |
| W1.4 | **Dead/placeholder links on videos page.** All three "Sample Concept Videos" link to the channel root (not a lesson); one resource link is `href: '#'`. | `apps/shell/src/data/videos.ts:26,34,42` (channel root), `:53` (`'#'`) | Link real videos/PDFs or remove cards until real assets exist (honest-content rule) |

### P1 — Re-brand incompleteness (user-visible or operational)

| # | Finding | Evidence | Fix |
|---|---|---|---|
| W2.1 | **WhatsApp prefill still says old brand.** | `apps/shell/src/data/site.ts:30` `"Hi%20STEM%20Tuition%20Pokhara!…"` (not covered by PR #40) | → "Hi LearningHub!…" |
| W2.2 | **Uptime monitor watches the old site.** Default `SITE_URL` is `https://stem-tution.pages.dev` in 3 places; after cutover it monitors a deleted project (false green/red). | `.github/workflows/monitor.yml:28,75,89` | Default → `https://learninghubstem.pages.dev` (or set the `SITE_URL` secret) |
| W2.3 | **Release announcement + Dockerfile still old-name.** | `.github/workflows/release.yml:258`, `Dockerfile:1` | Rename strings |
| W2.4 | **Governance docs still old-name** (Level-2 identity). | `AGENTS.md:1`, `docs/RULES.md:1`, `docs/CONSTITUTION.md:10,65,156,348`, `README.md:1,12,38`, `package.json` description | Re-brand prose; keep historical records (changelogs, ADRs, DEVLOG) untouched per rename anti-patterns. README:12 also still says "not part of LearningHubSTEM" — update to the STEMMA consumer relationship |
| W2.5 | **Dual deploy paths.** The new `learninghubstem` Pages project runs the git integration *and* a wrangler deploy command *and* GitHub Actions `deploy.yml` also deploys. Two production sources conflict; the in-Pages wrangler call is what hit auth error 10000. | CF build log 2026-09-02 (`Executing user deploy command: … wrangler pages deploy`), `.github/workflows/deploy.yml` | Pick ONE production path: **GitHub Actions `deploy.yml`** (CI-gated, health-checked, governed). CF git integration = PR previews only (disable main auto-deploy, remove the custom deploy command) |
| W2.6 | **CF token lacks Pages permission** — root cause of the failed deploy. | Deploy log: `Authentication error [code: 10000]` on `/pages/projects/learninghubstem` | Re-mint token with **Account → Cloudflare Pages: Edit** (account-level), update the Pages project env var + GitHub `CF_API_TOKEN` secret. [HUMAN GATE — dashboard] |
| W2.7 | **Soft-404 catch-all.** `/*  /index.html  200` serves the homepage for every unknown URL with HTTP 200 — bad UX and SEO on a multi-page (non-SPA) site. | `apps/shell/public/_redirects:1` | Add `404.html`; delete the catch-all (no SPA routing exists) |

### P2 — Engineering hygiene

| # | Finding | Evidence | Fix |
|---|---|---|---|
| W7.1 | **Node drift.** CI pins node 22; Cloudflare detected nodejs 24.18.0. | workflows (node-version: 22) vs CF build log | Add `.nvmrc` (22) + set `NODE_VERSION=22` in Pages project env |
| W7.2 | **Coverage-claim drift.** AGENTS claims "≥95% line coverage for core logic" but the enforced floors are 34–87% (tracer 34%, quiz-engine 66%). | `docs/REPOSITORY_HEALTH.md` AUTO table vs `AGENTS.md` §Non-Negotiable Rules | Make the claim honest: floors are per-package ratchets (health table is authoritative); or schedule floor raises. Decide once, document in `docs/RULES.md` |
| W7.3 | **Declared-but-unused deps** in lesson-renderer / interactive-simulations (core/tracer/simulation-core declared, not imported) — already tracked as Phase 8 remaining work. | `docs/ROADMAP.md` Phase 8 "Remaining", ADR-014/015 | Either wire tracer instrumentation (roadmap expectation) or drop the deps; ADR the outcome |
| W7.4 | **Visual baselines stale** — `E2E visual regression` red on `main` since before the rename (last 4 runs, incl. PR #36 merge `90f1788`). | `gh run list --workflow smoke.yml --branch main` | After #40 merges, run `update-visual-baselines.yml` (workflow_dispatch), then a normal commit to re-trigger CI |

---

## 3. SOTA comparison — where LearningHub stands

### At or above SOTA (keep, do not regress)

- **Consumer contract seam**: version-pinned export (`SUPPORTED_EXPORT_VERSION = '0.1'`),
  shape/dangling-reference errors, vendored snapshot + `pnpm sync:lhs` — above typical practice.
- **CI/CD depth**: axe accessibility, Playwright visual regression + sharding, Lighthouse
  *assertions* (not just collection), gzip size budgets per chunk, dependency-cruiser + madge
  architecture rules, Trivy + gitleaks, commitlint, signed-tag verification, docs-freshness,
  changeset provenance chain, 4-stage release with human approval — well above solo-site norm.
- **Architecture**: strict TS (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`),
  event-bus isolation, Web Components, tracer observability, coverage ratchet, generated
  health dashboard, `ARCHITECTURE.toml` package metadata.
- **Ops**: uptime monitor with auto-issue, preview deployments, Dependabot, CODEOWNERS.
- **WhatsApp-first contact** matches regional best practice (low-friction, mobile-first) —
  once the prefill brand string and form handoff are fixed.

### Below SOTA — missing components (verified absent)

| Component | SOTA expectation | Evidence of absence |
|---|---|---|
| **Inquiry capture** | Form → owner inbox/chat with spam protection | `interactive.ts:79-87` alert-only |
| **SEO scaffold** | sitemap.xml + robots Sitemap line + per-page meta completeness | `public/robots.txt` (no Sitemap), no `sitemap.xml` |
| **Structured data** | JSON-LD: LocalBusiness/EducationalOrganization + FAQPage (rich results) | `grep 'application/ld+json'` → 0 |
| **Social preview** | og:image per page | `grep -c 'og:image' index.html` → 0 |
| **404 handling** | branded 404 with correct status | no `404.html`, catch-all serves 200 |
| **Security headers** | `_headers`: CSP, HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy | no `_headers` file |
| **Analytics** | privacy-friendly analytics (Cloudflare Web Analytics is free, cookieless) | none found |
| **Trust layer** | founder/teacher credentials, verifiable testimonials, results, real photos | `testimonial` count in index.html: 0; research: trust is the #1 parent decision factor |
| **Decision info** | batch schedule truth, fee context (or explicit "on inquiry") | `classes.ts` generic batches; no fee context |
| **Real media** | actual lesson videos, not channel-root placeholders | `videos.ts` hrefs |
| **Custom domain** | own domain + branded email; `*.pages.dev` is disposable-looking | still on pages.dev (A8 pending) |
| **Env pinning** | same runtime everywhere (.nvmrc / NODE_VERSION) | node 22 CI vs 24 Pages |

---

## 4. Additions to be made — workstreams

Classification per workspace taxonomy: **NOW** implement · **SEAM** cheap contract ·
**LATER** document only · **OUT** do not implement. `[H]` = human decision/action required.

### W0 — Finish the deployment cutover (NOW, `[H]` external)

- **T0.1 `[H]`** Re-mint CF API token with Account → Cloudflare Pages: Edit; update Pages
  project env + GitHub secret `CF_API_TOKEN`.
- **T0.2 `[H]`** In the CF dashboard: git integration → previews only (disable main
  auto-deploy); remove the custom deploy command. Production = `deploy.yml` only.
- **T0.3** Fix `monitor.yml` default `SITE_URL` (3 refs) → `https://learninghubstem.pages.dev`.
  Files: `.github/workflows/monitor.yml:28,75,89`. Verify: `act`-style YAML review; monitor run green on new URL.
- **T0.4** After T0.1–T0.2: merge PR #39, then PR #40 (both MERGEABLE; only pre-existing
  red checks block optics — see W7.4).
- **T0.5 `[H]`** Decide YouTube handle: `@LearningHubSTEM` links mismatch the new brand.
  Update `apps/shell/src/data/videos.ts` accordingly.

### W1 — Correctness fixes (NOW, TDD each)

- **T1.1** Fix `tel:` href. File: `apps/shell/contact.html:37`. Test: extend
  `e2e/shell-pages.spec.ts` — assert `contact .contact-item[href^="tel:"]` equals
  `tel:+9779768021317`.
- **T1.2** Real form funnel: export `buildInquiryMessage(fields): string` in
  `apps/shell/src/lib/inquiry.ts` (pure, unit-tested); `interactive.ts` opens
  `https://wa.me/9779768021317?text=<encoded>` in a new tab on submit. Tests: unit cases for
  empty/short/full input in `apps/shell/tests/inquiry.test.ts`; keep the e2e submit path green.
- **T1.3** Progress migration. File: `apps/shell/src/lib/progress-tracker.ts`. In `load()`:
  if `learninghub-progress` missing and `stem-tuition-progress` present → adopt, persist under
  new key, remove legacy key. Tests: `apps/shell/tests/progress-tracker.test.ts` (jsdom
  localStorage: fresh user / migrated user / no double-migrate).
- **T1.4** Kill placeholder links in `apps/shell/src/data/videos.ts` (real URLs or remove
  cards). `[H]` supplies real video/PDF URLs.
- **T1.5** `site.ts:30` prefill text → LearningHub (pairs with PR #40 content).

### W2 — Complete the internal re-brand (NOW, docs-only)

Files: `AGENTS.md:1`, `docs/RULES.md:1`, `docs/CONSTITUTION.md` (product identity lines),
`README.md` (title, :12 consumer relationship, :38 tree), `Dockerfile:1`,
`.github/workflows/release.yml:258`, `package.json` description.
Rules: no history rewriting; changelogs/ADRs/DEVLOG keep old names; run `pnpm docs:sync`
after; `pnpm verify-governance` green.

### W3 — SEO & discoverability scaffold (NOW)

- **T3.1** `apps/shell/public/sitemap.xml` (6 pages) + `Sitemap:` line in `robots.txt`;
  add a unit test that sitemap URLs == pages on disk (guard against drift).
- **T3.2** `404.html` (branded, links home/contact) + remove the catch-all from
  `_redirects`. E2E: unknown path returns 404 content (Playwright `response.status()`).
- **T3.3** JSON-LD: `EducationalOrganization` + `LocalBusiness` ( Pokhara, geo, phone,
  sameAs) in `index.html`/`about.html`; `FAQPage` generated from `src/data/faqs.ts` via a
  tiny render helper (unit-test the JSON-LD against the data file).
- **T3.4** One 1200×630 `og:image` brand asset `[H] supplies/approves image]`, referenced
  by all pages; per-page images LATER.

### W4 — Security headers (SEAM)

`apps/shell/public/_headers`: `X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options: DENY`, `Permissions-Policy` minimal, `Strict-Transport-Security`.
CSP **report-only first** (web components use inline styles; tighten in a later pass with
evidence from the report endpoint — do not break the site with a naive CSP). E2E: assert
headers present in preview response.

### W5 — Trust & conversion content (NOW content, no code) `[H]`

- Founder/teacher profile with real credentials on `about.html`.
- 2–3 verifiable testimonials **with consent**, or honest "first batches" copy — no
  fabricated results (marketing-claims honesty is already a workspace value).
- Real photos of the center/batches (no stock).
- Batch schedule truth + explicit fee policy ("fees on inquiry" is acceptable).
- Google Business Profile link + map/directions link on contact page `[H] supplies links]`.

### W6 — Analytics (SEAM) `[H]`

Cloudflare Web Analytics (free, cookieless, no consent banner needed): add the beacon token
via Pages dashboard or a single `<script>` include; assert presence in e2e.

### W7 — Engineering hygiene (NOW small)

- `.nvmrc` (22) + Pages `NODE_VERSION=22` `[H dashboard]`.
- Coverage-claim reconciliation (W7.2) — one honest paragraph in `docs/RULES.md`.
- ADR-014/015 unused-deps resolution or tracer wiring — tracked already in Phase 8.
- Visual-baseline refresh run after #40 (W7.4).

### W8 — Custom domain (LATER, `[H]` external)

Own domain + branded email + canonical redirects; fold into A8 documentation; keep
`learninghubstem.pages.dev` as redirect target only after the domain is live.

### W9 — Explicitly OUT of scope (do not implement now)

Backend auth/payments/admin (Phase 7 packages remain *planned* in `.phase.json` — a backend
is a human strategic decision), PWA, i18n, mobile app, AI chatbot (PROFESSOR-J is the
ecosystem's intelligence layer; LearningHub may *link* to it LATER), any form-backend SaaS
until the WhatsApp funnel is proven insufficient.

---

## 5. Sequencing & acceptance gates

1. **W0** (cutover) → gate: `learninghubstem.pages.dev` HTTP 200 + monitor green + #39/#40 merged.
2. **W1 + W2** (one "post-rename correctness" PR set) → gate: `pnpm typecheck && pnpm test`
   green; new unit/e2e tests pass; `pnpm verify-governance` green; no old-name strings in
   non-historical files (`git grep -i 'STEM-TUITION'` returns only history).
3. **W3 + W4** (SEO + headers PR) → gate: e2e 404/headers/sitemap tests green; Lighthouse
   stays within budgets; visual baselines refreshed once.
4. **W5** (content) → gate: human review of copy; no unverifiable claims.
5. **W6–W8** as approved.

Verification matrix (run what applies per PR): `pnpm typecheck` · `pnpm test` ·
`pnpm verify-governance` · `pnpm test:a11y` · preview-deploy smoke of changed pages.

## 6. Plan changelog

- 1.0.0 (2026-09-02) — Initial post-rename plan: vigorous review (P0/P1/P2), SOTA gap
  analysis, workstreams W0–W9 with TDD steps and human gates.
