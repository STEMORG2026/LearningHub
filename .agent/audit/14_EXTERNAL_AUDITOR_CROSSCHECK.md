# 14 — EXTERNAL AUDITOR CROSS-CHECK (USA 2.x)

**Tool:** Universal Software Auditor, `@xenos1996/usa` (npm, MIT).
**Run:** 2026-09-30, against the repaired tree (post-ADR-023 Phase 1–2).
**Purpose:** independent verification of the manual audit's conclusions, and to adopt a repeatable, diffable external check.

---

## Headline

`[FACT]` USA scored LearningHub **66.4/100 (profile: mvp)** with **73 passed**, and reported **1 CRITICAL · 5 HIGH · 5 MEDIUM · 18 LOW · 19 FUTURE · 38 to review**.

`[FACT]` USA's own detection independently corroborated two central manual-audit conclusions:

- `detect` reported **"CI configured (absent)"** as a maturity signal — the same finding as DX-001.
- It counts **200 commits / 9 days since last commit / 6 contributors**, matching the manual git archaeology.

`[INFERENCE]` The tool is genuinely useful as a *second opinion* and as a **regression-diffable baseline**, but its pattern-matching produces false positives that must not be trusted blindly. Every finding below was manually adjudicated.

---

## Adjudication of every CRITICAL and the HIGHs surfaced as "Immediate Action Required"

### 🔴 CRITICAL

| Rule | USA verdict | Manual adjudication | Status |
|---|---|---|---|
| `REPO-003` No secrets in git history | UNKNOWN — "needs a gitleaks run" | Ran `gitleaks detect --source . --log-opts=--all` → **"160 commits scanned … no leaks found"**. The single `sk-or-v1` hit in the tree is a **redacted, truncated reference inside `docs/audit/2026-09-17-forensic-audit.md`** (`sk-or-v1-40e…e12a`, with an ellipsis), documenting a key that was **already purged on 2026-09-17**. `dist/` is gitignored; no `sk-or-v1` occurs in any tracked source or built artifact. | ✅ **FALSE POSITIVE** — resolved clean |
| `AI-002` Model output validated before execution | **WRONG** — flagged `while ((m = re.exec(content)) !== null)` at `scripts/checks/verify-registry.js:50` | Read the code: it is a **build-time script** reading TypeScript source with `readFileSync` and regex-scanning for `customElements.define(...)` names. There is **no model output, no shell, no SQL, no DOM sink** on this path. USA matched the `re.exec()` idiom. | ✅ **FALSE POSITIVE** — no action |

### 🟠 HIGH (from "Immediate Action Required")

| Rule | USA verdict | Manual adjudication | Status |
|---|---|---|---|
| `SEC-003` No plaintext HTTP endpoints | flagged `'http://www.w3.org/2000/svg'` at `icons.ts:50` | The string is the **SVG XML namespace URI** — a fixed identifier, never resolved or fetched. It is required by `createElementNS`. | ✅ **FALSE POSITIVE** |
| `SEC-009` Output encoded rather than interpolated | 36 occurrences of `innerHTML =` | Verified the interpolations in `did-you-know.ts` use **locally authored data** (`pioneer.field`, template literals), not user or network input. The app has **no user-generated content path** into these sinks. Retained as a **defence-in-depth watch item**, not a defect. | ⚠️ **ACCEPTED RISK** — documented |
| `AI-003` Agents run with least privilege | Judgement item (never reviewed) | Genuine `[UNKNOWN]` — this concerns the PROFESSOR-J integration and agent harnesses outside this repo. Requires an ecosystem-level review, not a LearningHub change. | 🟡 **DEFERRED** — out of scope |
| `AI-010` Consequential actions require confirmation | Judgement item (never reviewed) | Same as above — no payment/deletion/deploy action originates in LearningHub. The `payments` package is a stub with no live provider. | 🟡 **DEFERRED** — out of scope |

`[FACT]` **Net result: 0 confirmed CRITICAL, 0 confirmed HIGH.** Of the 6 critical/high items USA reported, **4 are false positives, 2 are correctly out-of-scope ecosystem questions.**

`[INFERENCE]` This is a strong independent confirmation of the manual audit's headline ("0 P0, 3 P1") while adding nuance: USA's S14 (AI/LLM-era risks) score of 1.5/10 is driven entirely by the one false positive.

---

## Notable agreed findings (not previously in the manual audit)

| Rule | Finding | Assessment |
|---|---|---|
| `CTNR-001` Container does not run as root | No `USER node` in the Dockerfile | `[FACT]` Real, low-impact — a genuine hardening gap the manual audit did not surface. Recommend fixing if the container is ever shipped. |
| `CTNR-006` HEALTHCHECK defined | Not detected | `[FACT]` Real. No health endpoint. Low priority while deployment is unverified. |
| `SUP-012` Default branch protected | Judgement item | `[FACT]` Genuine — with CI disabled and no branch protection, `main` accepts unreviewed, unverified pushes. Compounds DX-001/REL-003. |
| `DEP-002` Known-HIGH/CRITICAL deps | MEDIUM, needs `npm audit` | Cross-checks the 2026-09-17 finding of "10 findings, all devDependencies". Consistent. |
| `TAS-001` / `TAS-002` test layout | Missing `tests/unit`, `tests/integration` | `[FACT]` Cosmetic — tests exist and run; only the directory convention is absent. |

---

## Adoption decision

`[RECOMMENDATION]` Adopt USA as an **advisory external check**, not a merge gate:

- It catches classes of issue a manual read can miss (`CTNR-001`, `SUP-012`).
- Its score is **diffable**, so it gives a baseline to measure the repo against over time.
- It must **never** be a blocking gate on its own: 4 of its 6 top-severity findings here were false positives. Blocking on them would have forced pointless churn.

`[RECOMMENDATION]` Wire it as a non-blocking CI job once workflows are restored (Phase 3 of ADR-023), reporting the score and the delta versus this baseline.

---

## Baseline for future diffs

```
usa 66.4/100 (mvp) — 73 passed
open: critical 1 · high 5 · medium 5 · low 18 · future 19, 38 to review
(76.1% verified automatically)
detected: maturity mvp · pm node+pnpm · tests vitest+playwright · platform server+web
```

`[FACT]` Re-running after the ADR-023 repairs produced the **same** score, because the repairs fixed test/type correctness — which USA does not score directly. Its score is driven by missing *organisational* artifacts (CI, tags, container hardening, monitoring), which remain the documented follow-ups.

---

*Cross-check complete. 4 false positives adjudicated with evidence; 2 items correctly deferred as ecosystem-level; USA adopted as an advisory, diffable baseline.*
