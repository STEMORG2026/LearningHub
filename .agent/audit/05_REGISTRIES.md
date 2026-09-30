# 05_REGISTRIES.md — LearningHub

> **Audit date:** 2026-09-30 · **Mode:** FULL · **Branch:** `main` · **Commit:** `2d4b20974b2c312c75a44d520adb7d42f8388eee` · **Worktree:** CLEAN
> Valid only for the recorded commit and worktree state.

---

## A. Annotation registry (`TODO` / `FIXME` / `HACK` / `XXX` / `DEPRECATED`)

**Result: the source tree is essentially annotation-free.** A repo-wide grep over `packages/ apps/ scripts/ e2e/` (excluding `node_modules` and `.test.ts`) returned **zero** `TODO`, `FIXME`, `HACK`, `XXX`, or `@deprecated` markers in production code.

| File:line | Marker | Exact text | Still valid? | Severity |
|---|---|---|---|---|
| `scripts/narrate/assembly-line.mjs:2` | `DEPRECATED` | `* DEPRECATED (ADR-016 N6). Superseded by the request-driven content engine.` | ✅ Yes — accurate | P3 |
| `docs/ROADMAP.md:277-282` | (prose backlog) | 3 named remaining items for Phase 8: registry entries, coverage verification, unused-dependency findings | Partially stale | P2 |
| `apps/shell/src/components/enroll-modal.ts:29` | (false positive) | `placeholder="e.g. 98XXXXXXXX"` — matched on `XXX` as a phone-number mask, not a marker | n/a | — |

**Interpretation:** zero in-code backlog markers is a double-edged signal. It means the codebase carries no visible debt annotations — but combined with `DOC-003`, it means the **roadmap is the only recorded intent**, and the roadmap is falsified. There is no mechanism for a future agent to discover unfinished work from the code itself.

**The one DEPRECATED marker:** `scripts/narrate/assembly-line.mjs` coexists with 4 prompt templates (`scripts/narrate/prompts/role-{writer,researcher,reviewer,master-reviewer}.txt`) and 6 narration playbook docs (`docs/guides/task-playbooks/narration/`). `[UNKNOWN]` whether those docs describe the deprecated assembly line or the superseding `content-engine` pipeline. **Resolving this requires reading the 6 narration playbook files** — flagged for a follow-up pass.

---

## B. Configuration surface

### B.1 Runtime environment variables

| Var | Source | Default | Read at | Purpose | Documented? | Actually used? |
|---|---|---|---|---|---|---|
| `VITE_PROFESSOR_J_URL` | `professor-j-client.ts:112`; also `packages/pj-client/dist/client.js:6` | `''` (same-origin) | Runtime | P-J backend base URL for `/api/v1/chat` | ❌ **NO** — absent from `.env.example` (DOC-002) | ✅ Yes |
| `VITE_OPENROUTER_API_KEY` | `.env.example` only | — | **nowhere** | Claimed P-J/OpenRouter token | ✅ Documented | ❌ **No** — no source file reads it (DOC-002) |

### B.2 Build/CI-only environment variables

| Var | Source | Written by | Read by | Purpose |
|---|---|---|---|---|
| `LHS_ROOT` | `sync-lhs-knowledge.mjs:18-19` | developer | sync script | STEMMA repo path; default `../STEMMA` |
| `GITHUB_TOKEN` | `.env.example` (commented) | developer | `scripts/release/*` | authenticated release pipeline |
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | `.env.example` (commented) | CI | `deploy.yml`, `wrangler` | Pages deploy |
| `CI` | `playwright.config.ts:6,7,10` | CI runner | Playwright | retries/workers/`reuseExistingServer` |
| `NPM_CONFIG_PROVENANCE` | `rollback.mjs:141` | script | npm | provenance attestation |

### B.3 URL-param feature flags

| Param | Values | Detected at | Effect |
|---|---|---|---|
| `?trace=true` | bool | `tracer/src/index.ts` `initTracer()` | Mounts `<stem-tracer-dashboard>` |
| `?debug_events=true` | bool | `core/src/event-bus.ts:95` `initEventBus()` | Enriches console + enables `debugMode` |

### B.4 Build constants

| Constant | File:line | Value | Purpose |
|---|---|---|---|
| `SUPPORTED_EXPORT_VERSION` | `apps/shell/src/lib/lhs-adapter.ts:22` | `'0.2'` | ⛔ **Stale** — rejects the shipped 2.1.0 data (DOC-001) |
| `SUPPORTED_EXPORT_VERSION` | `scripts/generate/sync-lhs-knowledge.mjs:24` | `'2.1.0'` | ✅ Matches data |
| `DEFAULT_MODEL` | `professor-j-client.ts:38` | `'google/gemini-3.7-flash'` | P-J chat model. ⚠️ Not verified against a live P-J |
| `MAX_TOKENS` (inline) | `professor-j-client.ts:71` | `800` | Chat response cap |
| `BROADCAST_CHANNEL_NAME` | `event-bus.ts:20` | `'learninghub-event-bus'` | Cross-tab bus |
| Bundle budgets | `bundlesize.config.json` | 100 kB/pkg, 150 kB gzip/app | Enforced by `lint:size` ✅ |
| Lighthouse budgets | `lighthouserc.json` | a11y ≥0.95, best-practices ≥0.9, SEO ≥0.85 | ⚠️ Only runs in the disabled `ci.yml` |
| Coverage floors | `packages/*/vitest.config.ts` | 34–87% lines | See §F |
| `engines.node` | root `package.json` | `>=22.13` | CI uses Node 22; local is 24 |

---

## C. Data model registry

| Model | File | Shape | Validation | Alignment |
|---|---|---|---|---|
| `EventPayload<T>` | `core/src/types.ts:1-6` | `{data, timestamp, schemaVersion, traceId?}` | ❌ None at runtime | Matches `EVENT_BUS_CONTRACT.md` intent |
| `QuizStartedData` / `QuizAnswerSubmittedData` / `QuizCompletedData` | `core/src/types.ts:16-39` | typed quiz event payloads | ❌ None | Consistent with `quiz-engine` usage |
| `AudioPlaySoundData` / `ErrorData` | `core/src/types.ts:41-54` | audio + error payloads | ❌ None | `ErrorData` is the natural sink for REL-004's fix |
| `LhsEntity` | `apps/shell/src/lib/lhs-types.ts:20-39` | STEMMA entity mirror | ❌ Type-only | ⛔ `generated_at` requirement stale (DOC-001) |
| `LhsEntity` (2nd definition) | `packages/content-provider/src/lhs-adapter.ts:24-47` | STEMMA entity mirror | ❌ Type-only | ⚠️ **Divergent duplicate** — has `examples`, `key_experiments`; shell version does not |
| `LhsKnowledgeExport` | `apps/shell/src/lib/lhs-types.ts:44-50` | Export envelope | `assertExportShape()` at runtime (`:52-60`) — checks 3 fields | ⛔ Stale vs 2.1.0 |
| `LessonContent` | `packages/content-provider/src/types.ts:183-193` | `{id, version, metadata, sections, questions, simulations, challenge?}` | ❌ Type-only | ✅ Central domain model, well-documented (210 lines of types) |
| `LessonSection` | `types.ts:91-109` | 16 `SectionKind`s + structured `figures`/`timeline`/`perspectives`/`depthRungs` | ❌ Type-only | ✅ Rich, thoughtful model |
| `LessonMetadata` | `types.ts:154-177` | conceptId, gradeLevels, prerequisites, misconceptions, learningObjectives, realWorldApplications | ❌ Type-only | ✅ |
| `Question` | `types.ts:115-124` | prompt, options, correctIndex, explanation, conceptId, difficulty | ❌ Type-only | ✅ Also validators exist in `validate-educational-metadata.js` |
| `SimulationConfig` / `ChallengeConfig` / `ContentFilter` | `types.ts:130-210` | simulation seed, challenge, query filter | ❌ Type-only | ✅ |
| `CelestialBody`, `PhysicsInput/Result` | `simulation-core/src/types.ts` | physics simulation state | ✅ Pure-function invariants | ✅ 99.14% covered |
| `QuizQuestion`, `QuizState`, `QuizResult` | `quiz-engine/src/types.ts` | quiz state machine | ✅ Pure logic | ✅ 16 tests |

**ORM / migrations / schema versioning:** **none.** No database exists. Persistence is entirely absent — no localStorage, no IndexedDB, no cookies for app state.

**Key observation:** there is **no runtime validation anywhere in the codebase** — no Zod (not a dependency), no hand-rolled validators for the event bus, and the only runtime check is `assertExportShape()` which verifies 3 of ~14 fields. `docs/policies/SECURITY.md:45` mandates Zod for all user input; no user input is parsed, so the rule is vacuously satisfied but the "schema-validated EventBus" claim in `VISION.md:68` is **false** (C5).

---

## D. API contract registry

### D.1 Outbound HTTP (the only network surface)

| Method | Path | Caller | Input | Output | Auth | Timeout | Fallback | Tests |
|---|---|---|---|---|---|---|---|---|
| `POST` | `${baseUrl}/api/v1/chat` | `apps/shell/src/lib/professor-j-client.ts:62` | `{messages: [{role,content}], model, max_tokens:800}` | `{message: string}` | `Bearer` **optional** (`:66`), no caller supplies it | ❌ **none** | ✅ `generateLocalGroundedResponse()` (`:84`) | ❌ **none** |
| `GET` | `${baseUrl}/api/v1/lh/ecosystem-info` | `professor-j-client.ts:93` | — | `unknown` JSON | ❌ none | ❌ **none** | ✅ Static object (`:98-103`) | ❌ **none** |

**Gaps:** no `AbortController`/timeout on either call — a hanging P-J keeps the promise pending indefinitely. No retry. No tests. The contract is defined by `ADR-022` and `ECOSYSTEM.md:163-170` but never exercised against a real backend. **`[UNKNOWN]`** whether P-J actually implements `/api/v1/lh/ecosystem-info`.

### D.2 Public library surfaces (package exports)

| Package | Exports | Consumer |
|---|---|---|
| `core` | `EventBus`, `getDefaultEventBus`, `initEventBus`, 6 interfaces, `SubscriptionEntry` | 12 packages |
| `tracer` | `Tracer`, `traced`, `initTracer` | 10 packages |
| `content-provider` | `mapLhsEntityToLesson`, `mapLhsEntitiesToLessons`, `composeNarrativeLesson`, `LessonContent` + 12 types, `getNarratives` | content-engine, lesson-renderer, shell |
| `simulation-core` | `stepPosition`, `applyBoundary`, `applyMouseForce`, `interactPair`, `applyBlackholePull`, `applyBlackholeDevour`, `updatePhysics`, `create*` factories, `PLANETS`, `MATH_SYMBOLS` | interactive-sims, shell |
| `quiz-engine` | `createQuizState`, `validateAnswer`, `advanceQuestion`, `resetQuiz`, `getCurrentQuestion`, `<stem-quiz>` | shell |
| `hover-engine` | `initCooldownState`, `pickHoverStyle`, `updateCooldown`, `isStyleInCooldown`, `HOVER_STYLES` | shell |
| `audio-synth` | `AudioEngine`, 4 synth fns | — (no consumer) |
| `acl` | `quiz-adapter`, `canvas-adapter`, `audio-adapter` | — (no consumer) |
| `content-engine` | `produce`, `FormatRegistry` | — (no consumer) |
| `lesson-renderer` | `<stem-lesson>` | shell |
| `interactive-simulations` | `<stem-circuit-sim>`, `<stem-mechanics-sim>` | shell |
| `auth` `/` `progress` `/` `admin` `/` `payments` `/` `video` | per-package API + types | **nobody** ⚠️ (except `auth` ← `pj-auth`) |

### D.3 UI routes (the only user-facing API)

11 routes built by Vite (`apps/shell/dist/`): `/`, `/classes.html`, `/videos.html`, `/contact.html`, `/about.html`, `/learn.html`, `/lab.html`, `/game.html`, `/stemma.html`, `/tuition.html`, `/professor-j.html`. All verified reachable — `test:a11y` passes 32/32 across 6 of them.

---

## E. Integration registry

| External dependency | Version | Call sites | Pinned? | Maintained? | Fallback | Risk |
|---|---|---|---|---|---|---|
| **PROFESSOR-J backend** | unknown (external repo) | `professor-j-client.ts:62,93` | n/a (URL env-driven) | `[UNKNOWN]` | ✅ local grounded responder | P2 — untested contract |
| **STEMMA corpus** | export contract `2.1.0` | `sync-lhs-knowledge.mjs` | ✅ version-checked | ✅ sibling repo exists | ❌ **none** | **P2 — currently empty** |
| `typescript` | root `^5.9.3`; packages split `^5.8.0` (7) vs `^7.0.2` (17) | all | ❌ split | ✅ | n/a | **P2 — DX-002** |
| `vitest` | declared `^4.1.8`/`^4.1.11`; **overridden → installed 3.2.7** | all 24 | ❌ contradicted | ✅ | n/a | **P2 — DX-002** |
| `@vitest/coverage-v8` | declared `^4.1.11`; overridden → `3.2.7` | all | ❌ | ✅ | n/a | P2 |
| `eslint` | `^10.8.1` (installed 10.9.1) | root | ✅ | ✅ | n/a | P3 |
| `turbo` | `^2.10.12` (installed 2.10.12) | root | ✅ | ✅ | n/a | P3 |
| `@playwright/test` | `^1.62.1` (installed 1.62.1) | root | ✅ | ✅ | n/a | P3 |
| `@changesets/cli` | `^3.0.1` (installed 3.0.1) | root | ✅ | ✅ | n/a | P3 |
| `dependency-cruiser` | `^18.2.0` | root | ✅ | ✅ | n/a | P3 |
| `madge` | `^8.0.0` | root | ✅ | ✅ | n/a | P3 |
| `@lhci/cli` | `^0.15.1` | disabled `ci.yml` only | ✅ | ✅ | n/a | P3 — pulls `extract-zip` GHSA allowlisted |
| `wrangler` | `^4.127.1` | deploy | ✅ | ✅ | n/a | P3 |
| `axe-core` / `@axe-core/playwright` | `^4.13.0` | `e2e/` | ✅ | ✅ | n/a | P3 |
| `commitlint` | `^21.2.2` | git hook + disabled CI | ✅ | ✅ | n/a | P3 |
| `zod` | **NOT A DEPENDENCY** | — | — | — | — | Documented as required but absent (C5) |
| `vite` | overridden → `^7.0.0` (shell built with v7.3.6) | shell build | ⚠️ via override | ✅ | n/a | P3 |

### E.1 Orphan packages — zero consumers (grep-verified)
| Package | Imported by |
|---|---|
| `pj-client` | **nothing** |
| `pj-auth` | **nothing** |
| `pj-audit` | **nothing** |
| `pj-policy` | **nothing** |
| `ecosystem-dashboard` | **nothing** |
| `cross-repo-visibility` | **nothing** |
| `pj-types` | `pj-client` only (itself an orphan) |

**6 packages with passing tests and no consumer** — 64 tests exercising code that nothing in the repository uses. `ARCH-001`, `PLAN-001`.

### E.2 Internal dependency edges (verified by `dependency-cruiser`, 645 dependencies, 0 violations)
`core`←12 · `tracer`←10 · `content-provider`←3 · `simulation-core`←2 · `pj-types`←4 · `auth`←1 (`pj-auth`) · `pj-client`←1 (`ecosystem-dashboard`).

---

## F. Test inventory

| Package | Files | Tests | Type | Quality | Coverage (lines) | Floor | Verdict |
|---|---|---|---|---|---|---|---|
| `acl` | 1 | 19 | unit | ⚠️ **tests against mocks of deleted `legacy/` globals** | not measured | 70 | ✅ pass / ⚠️ hollow |
| `admin` | 1 | 7 | unit | good | not measured | 80 | ✅ |
| `audio-synth` | 1 | 14 | unit | good (pure fns) | not measured | 87 | ✅ |
| `auth` | 1 | 13 | unit | good | not measured | 80 | ✅ |
| `content-engine` | 3 (**1 unloadable**) | 48 (+suite fail) | unit + stress | stress suite is strong (25 tests) | **unmeasurable** | 80 | ❌ |
| `content-provider` | 4 | 40 | unit | **strong** | **93.91%** | 80 | ✅ |
| `core` | 2 | 108 (**1 fail**) | unit + doc-completeness | mixed — 107 solid, 1 brittle doc assertion | **unmeasurable** | 84 | ❌ |
| `cross-repo-visibility` | 1 | 10 | unit | orphan | not measured | 80 | ✅ |
| `ecosystem-dashboard` | 1 | 13 | unit | orphan | not measured | 80 | ✅ |
| `hover-engine` | 1 | 12 | unit | **excellent** (100% funcs) | **93.54%** | 85 | ✅ |
| `interactive-simulations` | 2 | 19 | unit | good | not measured | 70 | ✅ |
| `lesson-renderer` | 1 | 56 | unit | **strong** | not measured | 80 | ✅ |
| `payments` | 1 | 10 | unit | good | not measured | 80 | ✅ |
| `pj-audit` | 1 | 8 | unit | orphan | not measured | 80 | ✅ |
| `pj-auth` | 1 | 11 | unit | orphan | not measured | 80 | ✅ |
| `pj-client` | 1 | 7 | unit | orphan | not measured | 80 | ✅ |
| `pj-policy` | 1 | 11 | unit | orphan | not measured | 80 | ✅ |
| `pj-types` | 1 | 4 | types | orphan | not measured | 80 | ✅ |
| `progress` | 1 | 7 | unit | good | not measured | 80 | ✅ |
| `quiz-engine` | 2 | 16 | unit + component | good | **69.96%** | 66 | ✅ (tight) |
| `simulation-core` | 1 | 65 | unit (pure) | **excellent** | **99.14%** | 87 | ✅ best |
| `tracer` | 1 | 24 | unit | ⚠️ **`dashboard.ts` 0%, `index.ts` 0%** | **44.11%** | 34 | ⚠️ hollow |
| `video` | 1 | 12 | unit | good | not measured | 80 | ✅ |
| `apps/shell` | 8 | 44 (**18 fail**) | unit + integration | mixed | **not measured** | 80 (`REPOSITORY_HEALTH.md:21`) | ❌ |
| `e2e/` (Playwright) | 4 specs | **32** | e2e + a11y + visual | **strong** | n/a | — | ✅ |

**Totals:** 355 tests passing in `packages/*`; 18 failing + 1 unloadable suite in `apps/shell`/`content-engine`; 32 e2e passing.

**Missing test types (repo-wide):** no contract tests (P-J API), no performance tests, no security tests, no failure-injection tests, no mutation testing, no visual-regression *code* (baselines exist as 7 PNGs).

**Weak/flaky/skipped:** none marked `.skip`/`.todo`/`.only`. `acl`'s tests are structurally hollow (mock deleted globals). `core`'s `foundation.test.ts` mixes real logic tests with a brittle docs-completeness assertion that has no business being in a package unit suite — it is the only reason `core` is red.

**Missing test file references (TEST-002):** the component registry references 3 e2e specs that do not exist —
`packages/quiz-engine/tests/e2e/quiz-flow.spec.ts`, `packages/audio-synth/tests/e2e/audio.spec.ts`, `packages/simulation-core/tests/e2e/simulation.spec.ts`. `verify-registry.js` warns but exits 0, so it can never fail.

---

## G. Documentation inventory

136 markdown files vs 130 source files. Accuracy assessed against code:

| Doc | Status | Accuracy vs code | Last updated (git) |
|---|---|---|---|
| `docs/VISION.md` | CANONICAL | ⚠️ Claim §3.1 `lhs:*` ingestion unsatisfiable (0 entities); §3.2 "NOT a monolithic DB" contradicted by `payments`/`auth` — **C1** | 2026-09-04 |
| `docs/ECOSYSTEM.md` | CANONICAL | Accurate on topology; describes an ACP "ORCHESTRATION PLANE" never built | 2026-09-18 |
| `docs/CONSTITUTION.md` | CANONICAL | 1,765 lines; referenced throughout; not line-audited (out of budget) | — |
| `docs/RULES.md` | CANONICAL | 1,063 lines; `≥95% coverage` claim not enforced (C4) | — |
| `docs/ARCHITECTURE/README.md` | CANONICAL | ⛔ §1 describes a **deleted `legacy/` dir** (**ARCH-002**); §2 target state omits 9 packages | 2026-09-04 |
| `docs/ROADMAP.md` | Active | ⛔ Phases 9/10/11 marked "Not started" but shipped (**DOC-003**); §7/8 admit drift | auto-generated blocks |
| `docs/REPOSITORY_HEALTH.md` | Generated | ✅ Faithful to `.phase.json` — including its errors. Lists 17 "stable" packages | `docs:sync` |
| `docs/IMPLEMENTATION-PLAN.md` | CANONICAL | ⚠️ Only **4 workstreams, all "NOW"**, none marked done. Stale relative to shipped Phase 8 | 2026-09-04 |
| `docs/CHANGELOG.md` | Auto-versioned | ⚠️ "[Unreleased] — 2026-09-18" describes Phase 8 content as Added, later deleted in `518615f` (2 days later) | 2026-09-18 |
| `docs/policies/SECURITY.md` | **ENFORCED** | ⛔ Says "STEM-TUITION handles"; scope describes pre-migration shape (**SEC-001**) | — |
| `docs/DOCS.md` | Active | ✅ Accurate taxonomy | — |
| `docs/DEVLOG.md` | Historical | ✅ Honest; last entry 2026-07-31 — **8 weeks behind** the Sept work | 2026-07-31 |
| `docs/adr/001–022` | 22 ADRs | ✅ All have status; ADR-004 `SUPERSEDED` correctly | — |
| `docs/audit/2026-09-17-forensic-audit.md` | ⛔ **no Version header** | Prior forensic audit (295 lines). **This is the file breaking `core`'s test** | 2026-09-17 |
| `docs/governance/`, `docs/testing/`, `docs/guides/` | Active | Not line-audited (budget) | — |
| `docs/archive/` | ARCHIVED | ✅ Correctly non-canonical | — |
| `README.md` | Active | ⛔ Package tree lists 11 of 24 (**DOC-004**); "verify-governance passes" false | 2026-09-04 |
| `AGENTS.md` | Active | ⚠️ AUTO package map is current; "package-level coupling" rules accurate; `pnpm typecheck — 16 tasks` stale (**it is 48**) | auto blocks 2026-09-19 |

**Documentation drift summary:** 7 documents contain claims contradicted by code (`README.md`, `VISION.md`, `ROADMAP.md`, `ARCHITECTURE/README.md`, `SECURITY.md`, `IMPLEMENTATION-PLAN.md`, `CHANGELOG.md`). `AGENTS.md` under-states the task count by 3× (16 vs 48). The documentation-to-code ratio (136:130) means drift has a wide surface.

---

## H. Core logic registry

| Component | Type | Algorithm | Complexity | Status |
|---|---|---|---|---|
| `EventBus.patternToRegex` | pattern compiler | regex-escape then `*`→`.*`, `^…$` anchored | O(len) per pattern, compiled once at `subscribe` | ✅ correct |
| `EventBus.dispatchToLocal` | dispatch | linear scan of subscribers with regex test | **O(n·m)** — n subscribers, m regex tests. Fine at current scale; **no indexing by prefix** | ⚠️ no error isolation (**REL-004**) |
| `hover-engine` cooldown | **state machine** | 6 styles, 4-cycle cooldown; `pickHoverStyle` avoids recently-used | O(6) | ✅ 100% funcs, 93.54% lines |
| `simulation-core.updatePhysics` | physics integration | per-body position step + boundary + mouse force + pairwise `interactPair` (Coulomb + elastic collision) + blackhole pull/devour | **O(n²) pairwise** — inherent to n-body; n is small (8 planets + 17 moons) | ✅ 99.14% |
| `simulation-core.interactPair` | interaction | Coulomb force + elastic collision resolution | O(1) | ✅ |
| `quiz-engine` state machine | state machine | `createQuizState` → `validateAnswer` → `advanceQuestion` → `getCurrentQuestion` | O(1) per step | ✅ 16 tests |
| `content-provider.mapLhsEntityToLesson` | transformer | entity → ordered `LessonSection[]` (narrative, equation, unit, misconceptions, objectives, applications) | O(sections) | ✅ tests pass |
| `content-provider.composeNarrativeLesson` | **orchestration** | merges canonical entity + consumer narrative; derives prerequisites from `logically_requires`/`mathematically_requires` relationships | O(sections + relationships) | ⚠️ **its integration tests currently fail** (no corpus) |
| `content-engine.produce` | pipeline | blueprint-driven multi-format production with deterministic verification gates | — | ⚠️ suite won't load |
| `learning-path.generateLearningPath` | sequencing | curriculum mapping → ordered steps with lock/unlock state | O(topics) | ⛔ **cannot run** (COR-001) |
| `cjheck`/retry/caching strategies | — | **none exist** | — | n/a |

**Retry strategies:** none anywhere. **Caching:** Turborepo build cache only (`turbo.json`). **Rate limits / backpressure:** none. **Orchestration:** `content-engine`'s `produce()` is the only pipeline-style orchestrator; the shell's `engine-init.ts` wires it up.
