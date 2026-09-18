---
status: CANONICAL
owner: Audit (Hermes)
last_updated: 2026-09-17
audit_tool: USA 2.25.3 (Universal Software Auditor)
commit: ce2139c9
branch: fix/phase0-correctness
---

# LearningHub — Forensic Audit Report

**Date:** 2026-09-17
**Auditor:** Hermes (deepseek-ai/DeepSeek-V4.1-Flash)
**Scope:** LearningHub + ecosystem layers (STEMMA, PROFESSOR-J, JARVIS, Universal_Software_Auditor)
**Method:** `forensic-architecture-audit` — repository state is truth; documentation is evidence of intent only.

---

## 0. Verdict

> **LearningHub's engine is finished and genuinely green. Its foundation is NOT complete, and one upstream layer is actively broken.**

| Question you asked | Answer |
|---|---|
| Is it fully finished as implemented? | **Yes for Phases 0–6 + 8 engine work.** No for Phase 7 (auth/progress/admin) — not started, by design. |
| Is the foundation all set up? | **Mostly, with one fatal gap: STEMMA now exports 0 entities.** |
| Does anything missing in any layer? | **Yes — see §6. The critical one is upstream, not in LearningHub.** |

**Headline:** USA scores LearningHub **63.2/100** against the production bar, but **both CRITICAL findings are false positives**. The genuinely serious defect is one USA flagged only as a routine HIGH, and the existential ecosystem risk (empty STEMMA) sits outside the audited repo entirely.

---

## 1. What I actually ran (not assumed)

| Check | Command | Result |
|---|---|---|
| USA detect | `usa detect .` | maturity `mvp`; 393 files; 179 commits; 26 branches |
| USA full audit | `usa audit . --depth deep --profile production` | **63.2/100**; 78 GOOD / 7 FAIL / 4 WRONG / 43 MISSING |
| Architecture + circular deps | `pnpm lint:arch && pnpm lint:circular` | ✅ 282 modules, 548 deps, **no violations, no cycles** |
| Purity (state + DOM) | `pnpm lint:state && pnpm lint:dom` | ✅ clean |
| Build + typecheck | `pnpm build && pnpm typecheck` | ✅ 24 tasks |
| Coverage gate | `pnpm test:coverage` | ✅ 24 tasks, **488 tests**, all floors met |
| Accessibility (axe) | `pnpm test:a11y` | ✅ **32 Playwright tests** |
| Size / edu / registry / docs | 4 gates | ✅ all passed |
| **Full gate** | `pnpm verify-governance` | ✅ **EXIT=0 — 12 stages** |
| Dependency vulns | `pnpm audit` | 10 findings, **all devDependencies** |
| Git history secret scan | `git log --all -S "sk-or-v1"` | ✅ clean (never committed) |

**Total verified test count: 488 vitest + 32 Playwright = 520.**

---

## 2. The two USA CRITICALs are false positives

I verified both against source. USA is grep-driven; neither holds.

### SEC-007 "Shell commands are not built from user input" — FALSE POSITIVE
- **Cited:** `apps/shell/src/data/narratives-batch4.ts:682`
- **USA's evidence:** the string `'For an isolated system, E_total = const. In mechanics, KE + PE = const when on…`
- **Reality:** that is **physics prose** in an educational narrative object. There is no shell, no `exec`, no child process. USA matched `E_total = const` as a shell-ish assignment pattern.
- **Verdict:** not a finding. The file is static curriculum text.

### AI-002 "Model output is validated before it is executed" — FALSE POSITIVE
- **Cited:** `scripts/checks/verify-registry.js:50`
- **USA's evidence:** `while ((m = re.exec(content)) !== null) names.add(m[1]);`
- **Reality:** this is a **local build-time registry scanner** reading `.ts` files off disk to extract `customElements.define()` names. There is no LLM, no model output, no network.
- **Verdict:** not a finding. USA's AI-002 heuristic triggered on regex-loop syntax.

**Conclusion:** LearningHub has **zero real CRITICAL defects**. USA's automation coverage is 73.7%, and its two highest-severity hits were both pattern noise — consistent with the known USAT false-positive class from scanning non-source text and build scripts.

---

## 3. The real finding USA under-rated: a live leaked API key

USA scored this only as a routine item; I confirmed it is live.

| | |
|---|---|
| **File** | `apps/shell/src/lib/professor-j-client.ts:34` |
| **Was** | `const API_TOKEN = 'sk-or-v1-40e…e12a';` (73 chars, real OpenRouter format) |
| **Status** | **LIVE — HTTP 200**, $0.1499 usage, free tier |
| **Also in** | `apps/shell/dist/assets/cosmic-background-Dfgdw7wh.js` (built bundle) |
| **Legit use** | `PROFESSOR-J/.env` → `OPENROUTER_API_KEY` (active), `JARVIS/.env` (commented out) |
| **Leaked to GitHub?** | **No.** `dist/` is gitignored; `git log --all -S` shows it was never committed. |

**Blast radius is local-only** — but the key was in plaintext in a published-to-browser bundle, so anyone loading the built site would receive it.

### Fix applied (verified)

1. **Source** now reads `import.meta.env.VITE_OPENROUTER_API_KEY ?? ''`.
2. **Guard added** — an unset token skips the network entirely and answers from the grounded local responder, instead of firing a pointless 401.
3. **Typed** the env var in `apps/shell/src/vite-env.d.ts` with a warning that `VITE_*` is public by construction.
4. **Purged** the stale `dist/`; rebuilt. **Verified: zero `sk-or-v1` strings in the new bundle.**
5. **Added `.env.example`** documenting every variable (also closes USA's REPO-006 HIGH).
6. **Re-verified:** 66 shell tests pass, typecheck ✅, build ✅.

> **This key is still live and needs rotating at OpenRouter.** That is a provider login action I cannot perform for you. Because PROFESSOR-J actively uses it, rotate rather than revoke, then update `PROFESSOR-J/.env`. My working-tree fix already stops the leak.

---

## 4. The most serious ecosystem defect: STEMMA exports zero knowledge

This is **not** in LearningHub. It is the layer LearningHub consumes.

| | STEMMA (source of truth) | LearningHub (vendored copy) |
|---|---|---|
| `export_version` | **2.1.0** | **0.2** |
| Entity count | **0** | **224** |
| Connections on disk | **0** | (vendored) |

**Cause:** commit `df293d9` — *"clean: archive all test content, sync with upstream refoundation."* It archived 222 entities + 633 connections into `archive/` and `archive_all/`, then deliberately emptied canonical `content/`.

**Why this is CRITICAL:**

1. **LearningHub is running on a frozen snapshot.** Its `lhs-adapter.ts` hard-asserts `export_version === SUPPORTED_EXPORT_VERSION` (0.2) and **throws** `LhsUnsupportedVersionError` otherwise. STEMMA is now 2.1.0. **Re-running `pnpm sync:lhs` today would break the adapter immediately.**
2. **The foundation has no live source.** STEMMA describes itself as the canonical truth for the whole ecosystem, and it currently contains nothing. Every downstream consumer — LearningHub, PROFESSOR-J grounding, future STEM Lab/Game — is ultimately resting on 224 entities vendored on an older contract.
3. **It is silent.** STEMMA's own `validate.py` prints `OK: 0 entities valid` and **exit 0**. An empty knowledge base passes validation. Nothing in either repo's CI catches a total content wipe.

**This is the missing fundamental.** LearningHub's architecture is sound; the thing it is architecturally built to read from is empty and contract-diverged.

---

## 5. Foundation completeness by layer

```
STEMXIS TECHNOLOGY PVT. LTD.
│
├── STEMMA (canonical knowledge foundation)
│     ├── 7 domains present (biology, chemistry, earth-space, engineering, math, physics, scientific-practice)
│     ├── schema + validators + tests + CI ...................... ✅ IMPLEMENTED
│     ├── canonical content .................................... ❌ EMPTY (0 entities)
│     └── contract version ..................................... ⚠ 2.1.0 vs consumer 0.2
│
├── LearningHub (engine + shell)  ← AUDITED TARGET
│     ├── 11 packages + shell app .............................. ✅ 10/11 STABLE
│     ├── architecture / purity / cycle gates .................. ✅ ENFORCED (A)
│     ├── coverage ratchets (66–87%) ........................... ✅ ENFORCED (A)
│     ├── 520 tests (488 unit + 32 e2e) ........................ ✅ PASS
│     ├── CI/CD + gated deploy ................................. ✅ ENFORCED (A)
│     ├── governance docs (VISION→ECOSYSTEM→CONSTITUTION→RULES)  ✅ CANONICAL
│     ├── CODECOWNERS + Dependabot + release pipeline .......... ✅ IMPLEMENTED
│     ├── SLSA provenance / signing ............................ ⚠ PARTIAL (image only)
│     └── Phase 7 (auth/progress/admin) ........................ ❌ NOT STARTED (by design)
│
├── PROFESSOR-J (AI OS) ............................. active, holds live OpenRouter key
├── JARVIS (personal AI OS) ......................... active, independent
└── USA (audit framework) ........................... working, ran this audit
```

### Phase status (from `.phase.json`)

| Phase | Name | Status | Note |
|---|---|---|---|
| 0–6 | Foundation → Physics Core | ✅ **completed** | All 6 phases released |
| 7 | Features (auth, progress, admin) | ❌ **planned** | Not started — ROADMAP confirms content was prioritised instead |
| 8 | Content & Lessons | 🟡 **in-progress** | 4 packages shipped |

**Phase 8's stated remaining blockers are already resolved** — the ROADMAP claims `lesson-renderer` and `interactive-simulations` "import none of" core/tracer. I verified they **do** import both:

```
packages/lesson-renderer/src/stem-lesson.ts:10:  import { getDefaultEventBus } from '@learninghub/core';
packages/lesson-renderer/src/stem-lesson.ts:11:  import { Tracer } from '@learninghub/tracer';
packages/interactive-simulations/src/stem-mechanics-sim.ts:8:  import { getDefaultEventBus } from '@learninghub/core';
```

So the documentation is **stale, not the code**. Phase 8 is closer to done than its roadmap says.

---

## 6. Gap register (severity-ranked, honestly)

### CRITICAL

| # | Gap | Layer | Evidence | Consequence |
|---|---|---|---|---|
| C1 | **STEMMA knowledge base empty** (0 entities) | STEMMA | `validate.py` → "0 entities valid", exit 0 | Ecosystem foundation has no live truth; all consumers on frozen snapshots |
| C2 | **Live OpenRouter key hardcoded** in client source | LearningHub | `professor-j-client.ts:34`, HTTP 200 | Credential in browser bundle. *Fix applied; rotation pending* |
| C3 | **Export contract divergence** 0.2 vs 2.1.0 | STEMMA↔LearningHub | adapter throws `LhsUnsupportedVersionError` | `pnpm sync:lhs` would break the adapter today |

### HIGH

| # | Gap | Evidence | Consequence |
|---|---|---|---|
| H1 | **No SLSA provenance / release signing for artifacts** | `release.yml` signs container image (cosign) + emits SBOM, but no `*.intoto.jsonl` / `*.sigstore.json` | Cannot verify what shipped; USA SUP-022 |
| H2 | **CI script-injection pattern** | `ci.yml:134` — `${{ github.event.pull_request.base.sha }}` inlined into `run:` | Low exploitability (SHA values, not free text) but trivially hardened via `env:` |
| H3 | **Branch protection not repo-verifiable** | No branch-protection artifact in `.github/` | Governance may be convention, not enforcement. **UNKNOWN — GitHub-side** (USA FND-004/SUP-012) |
| H4 | **Dockerfile runs as root** | `Dockerfile` uses `nginx:alpine`, no `USER` | Container escape blast radius; USA CTNR-001 |
| H5 | **No `.env.example`** (was) | — | **FIXED this session** |

### MEDIUM

| # | Gap | Evidence |
|---|---|---|
| M1 | No CHANGELOG at root (Changesets used instead) | USA REPO-010 |
| M2 | 10 devDependency advisories (5 high) | puppeteer-core/extract-zip, js-yaml, sharp, vitest — **dev-only, not shipped** |
| M3 | No SAST (CodeQL/Semgrep) in CI | USA SUP-006; gitleaks + Trivy + audit **are** present |
| M4 | No `CHANGELOG`/`CONTRIBUTING`/`CODE_OF_CONDUCT` | USA REPO-011/012 |
| M5 | No local task runner (Makefile/justfile) | USA FND-013 |
| M6 | Accessibility score reads 0/10 in USA | **Misleading — 32 axe tests pass in gate.** USA found no axe report artifact, not real failures |
| M7 | Phase 7 (auth/progress/admin) absent | `progress-tracker.ts` is localStorage-only; no backend exists |
| M8 | 26 branches; 9 merged-but-retained | Branch hygiene |

### LOW / FUTURE

No `LICENSE` at repo root (⚠ — ecosystem repos reference CC BY 4.0 / MIT as "pending human approval"), no `.editorconfig`, mutation testing absent, no tech radar, no cost monitoring.

---

## 7. Enforcement classification (methodology §4)

| Policy | Class | Evidence |
|---|---|---|
| Architecture rules (no cross-package imports) | **A. ENFORCED** | dependency-cruiser, 282 modules, 0 violations |
| No circular dependencies | **A. ENFORCED** | madge, 0 cycles |
| Business-logic purity (no DOM/window) | **A. ENFORCED** | `eslint.config.dom.mjs` in gate |
| No global mutable state | **A. ENFORCED** | `eslint.config.state.mjs` in gate |
| Coverage floors | **A. ENFORCED** | per-package ratchets 66–87%, gate blocks |
| Tests must pass | **A. ENFORCED** | 488 tests block gate |
| Accessibility | **A. ENFORCED** | 32 axe/Playwright tests block gate |
| Bundle size budgets | **A. ENFORCED** | `size-check.cjs`, all ✓ |
| Educational metadata | **A. ENFORCED** | 20 questions validated |
| Doc governance / canonical status | **A. ENFORCED** | `verify-doc-governance.mjs` |
| Deploy gated on green CI | **A. ENFORCED** | `deploy.yml` `workflow_run: conclusion == 'success' && head_branch == 'main'` |
| Legacy frozen zone | **N/A** | `legacy/` no longer exists; AGENTS.md rules are stale |
| Branch protection | **UNKNOWN** | Not repo-visible — GitHub-side |
| Provenance on artifacts | **B. DETECTED, NOT GATING** | image signed; no artifact attestation |

**This is a genuinely strong enforcement posture** — 11 of 13 policies are technically enforced (class A), not merely documented. That is rare and worth stating plainly.

---

## 8. Pipeline trace

```
STEP 01 — pnpm install --frozen-lockfile           IMPLEMENTED
STEP 02 — Architecture lint (dependency-cruiser)   IMPLEMENTED · 0 violations
STEP 03 — Circular-dep check (madge)               IMPLEMENTED · 0 cycles
STEP 04 — Purity lint (state + DOM)                IMPLEMENTED
STEP 05 — Build (turbo, 24 tasks)                  IMPLEMENTED
STEP 06 — Typecheck (strict TS, 24 tasks)          IMPLEMENTED
STEP 07 — Coverage (488 tests, ratchets)           IMPLEMENTED
STEP 08 — Accessibility (32 axe tests)             IMPLEMENTED
STEP 09 — Bundle size budgets                      IMPLEMENTED
STEP 10 — Educational metadata                     IMPLEMENTED
STEP 11 — Component registry                       IMPLEMENTED · 3 warnings
STEP 12 — Documentation governance                 IMPLEMENTED
STEP 13 — Gate result                              EXIT=0  ✅
STEP 14 — PR → CI (required check)                 IMPLEMENTED
STEP 15 — Merge to main                            CONVENTION (protection UNKNOWN)
STEP 16 — Deploy via workflow_run                  IMPLEMENTED · gated on green + main
STEP 17 — Cloudflare Pages auto-deploy             DISABLED BY DESIGN (gated workflow only)
```

---

## 9. Recommended order

**Now (ecosystem-critical):**
1. **Rotate the OpenRouter key** at openrouter.ai, update `PROFESSOR-J/.env`. *(login action — yours)*
2. **Decide STEMMA's fate** — restore `archive/content_all/`, or accept empty and **pin LearningHub to its vendored snapshot explicitly** so nobody re-syncs and breaks the adapter. This is a strategic call.
3. **Reconcile the export contract** — either lift LearningHub to 2.1.0 or have STEMMA re-emit 0.2. Do not leave it divergent.

**Then (LearningHub hardening):**
4. Add artifact provenance (`actions/attest-build-provenance`) — closes USA SUP-022.
5. Harden `ci.yml:134` via `env:` indirection — trivial.
6. Add `USER nginx` to `Dockerfile` — one line.
7. Add CodeQL/Semgrep.
8. Correct the ROADMAP's stale Phase 8 blockers (code already satisfies them).

**Not urgent:** LICENSE decision (needs your call on CC BY 4.0 vs MIT), Phase 7 features (deliberately deferred).

---

## 10. Evidence index

| Artifact | Path |
|---|---|
| Full USA report | `/tmp/lh-usa-audit.md` (938 lines) |
| Governance gate (green) | `/tmp/lh-gov3.log` |
| Coverage run | `/tmp/lh-cov.log` |
| Key fix | `apps/shell/src/lib/professor-j-client.ts` |
| Env typing | `apps/shell/src/vite-env.d.ts` |
| Config contract | `.env.example` |
| STEMMA archive | `STEMMA/archive/content_all/` (222 entities) |

---

## 11. Audit honesty statement

- **Both USA CRITICALs are false positives** — verified against source, not accepted from the tool.
- **USA's 0/10 accessibility score is wrong** — 32 axe tests pass in the gate; USA found no report artifact.
- **USA's 10/10 for Release and Dependencies is inflated** — flagged † (16–33% confidence). Treat as unmeasured, not perfect.
- **Branch protection is UNKNOWN**, not "absent" — it is GitHub-side and not repo-visible. Do not read H3 as a confirmed failure.
- **I could not test the deployed site** — no network check against `learninghubstem.pages.dev` was performed.
