# Debugging Guide

**Version:** 3.0.0
**Purpose:** Systematic approach to finding and fixing problems

---

## 1. First Principles of Debugging

When something breaks, follow this hierarchy:

```
1. IS THE EVENT BEING PUBLISHED?      → Enable debug_events
2. IS THE FUNCTION BEING CALLED?       → Enable tracer
3. IS THE INPUT WHAT YOU EXPECT?       → Check console logs
4. IS THE COMPONENT IN THE REGISTRY?   → Check component-registry/
5. IS IT A TEST FAILURE?               → Run pnpm test --filter=[package]
```

**Never** start by reading source code. Always start by observing the system's behavior.

---

## 2. Debugging Tools

| Tool | How to enable | What it shows |
|------|---------------|---------------|
| Event Bus Log | `?debug_events=true` in URL | Every event published, its type, and payload |
| Tracer | `?trace=true` in URL | Function call durations, span waterfall |
| Component Inspector | Browser DevTools → Elements panel | Web Component shadow DOM, attributes, events |
| Console Logging | Open browser console (F12) | All console.log/warn/error from packages |
| Network Tab | Browser DevTools → Network | API calls, asset loading, timing |

---

## 3. Event Bus Debugging

Add `?debug_events=true` to see ALL cross-module communication in real-time:

```
http://localhost:8085/?debug_events=true
```

Console output:

```
[EVENT BUS] quiz:started          { quizId: "q-set-3", questionCount: 5 }
[EVENT BUS] quiz:answer-submitted { questionId: "q-42", answer: "F=ma" }
[EVENT BUS] audio:play-sound      { sound: "correct-answer", volume: 0.8 }
[EVENT BUS] quiz:completed        { score: 8, total: 10 }
```

**When debugging:**
- If you expect a `quiz:completed` event but don't see it → the quiz module is not publishing
- If you see `quiz:completed` but no `audio:play-sound` → the audio module is not subscribing
- The Event Bus reveals exactly which modules are talking (and which are not)

### Listening to ALL events programmatically:

```typescript
// In browser console, paste:
import { eventBus } from '@learninghub/core';
eventBus.subscribe('*', (event) => {
  console.log(`[EVENT BUS] ${event.type}`, event.data);
});
```

---

## 4. Tracer Debugging (Performance & Path Analysis)

Add `?trace=true` to see function execution times:

```
http://localhost:8085/?trace=true
```

Output (live):

```
┌─ TRACE: quiz:check-answer (45ms) ──────────────────┐
│  validate-answer .............. 2ms                 │
│  check-answer ................. 8ms                 │
│  calculate-score .............. 3ms                 │
│  misconception-check .......... 1ms                 │
│  total ........................ 14ms                │
│                                                     │
│  ⚠️ SLOW PATH DETECTED:                             │
│  audio-synth:play-correct-sound took 25ms           │
│  → Consider pre-loading audio files                 │
└─────────────────────────────────────────────────────┘
```

**What to look for:**
- **Long durations** — a function taking >100ms needs investigation
- **Unexpected paths** — a function being called when it shouldn't be
- **Missing spans** — if a function should be traced but isn't, it's not instrumented
- **Path not taken** — if an optimization path exists but isn't being used

### Trace Dashboard

When `?trace=true` is active, a floating panel appears in the browser:

```
┌─── TRACER DASHBOARD ──────────────────────────────┐
│  Active Spans: 3                                    │
│  Slowest: audio:play (25ms)                         │
│  Total: 45ms                                        │
│                                                     │
│  [▼] Expand all                                     │
│  [⏸] Pause                                          │
│  [📋] Copy trace                                    │
└─────────────────────────────────────────────────────┘
```

---

## 5. Component Inspector

Once components are built as Web Components with `mode: 'open'`, you can inspect them in DevTools:

```
Browser DevTools → Elements tab
  ├── <stem-quiz concept="newtons-law">
  │   ├── #shadow-root (open)          ← inspect internal DOM
  │   │   ├── <style>                  ← scoped styles
  │   │   ├── <div class="card">       ← rendered template
  │   │   └── <button>Submit</button>
  │   └── attributes:                  ← current attributes
  │       concept="newtons-law"
  │       difficulty="medium"
  │       score="8"
```

**Check:**
- Are the attributes correct? → The component received the right inputs
- Is the Shadow DOM rendering? → The component mounted
- Are events firing? → Check Event Listeners tab

---

## 6. Using the Component Registry to Locate Code

When you find a bug, use the registry to jump directly to the source:

```
# From the bug description, find the component:
# "The quiz shows wrong score"
#
# Check docs/component-registry/RENDERING.md:
#   stem-quiz → packages/quiz-engine/src/index.ts:12         ← component definition
#             → packages/quiz-engine/src/internal/template.ts:42  ← score display

# Check docs/component-registry/STATE.md:
#   quiz-engine → packages/quiz-engine/src/internal/scorer.ts:18  ← score calculation

# Check docs/component-registry/TESTING.md:
#   scorer.test.ts → packages/quiz-engine/src/internal/scorer.test.ts:25  ← score test
```

Open the exact file and line number. No searching.

---

## 7. Common Failure Modes

| Symptom | Likely Cause | Where to look |
|---------|-------------|---------------|
| Quiz not loading | Event Bus not initialized | Check `packages/core/` initialization |
| Audio not playing | Audio context suspended (browser policy) | Check `playSparkSound()` in `packages/audio-synth/` |
| Hover effects not triggering | Cooldown state stuck | Check `packages/hover-engine/` state machine |
| Legacy page broken | Forbidden import from packages/ | Run `pnpm lint:arch` |
| Component not rendering | Attribute name mismatch | Check `observedAttributes` in component |
| Tests failing | Dependency changed signature | Run `pnpm test --filter="[changed]"` to find affected |
| Build fails | Circular dependency | Run `pnpm lint:circular` |
| Performance slow | Function taking too long | Enable `?trace=true` and find the slow span |

---

## 8. Performance Path Analysis

When you want to optimize a user flow:

```bash
# 1. Enable tracing
open http://localhost:8085/?trace=true

# 2. Perform the action (e.g., complete a quiz)
# 3. Look at the trace output:

# If you see:
# audio:play-correct-sound .......... 350ms  ← TOO SLOW
#
# The fix might be:
# - Pre-load audio files on page load
# - Use a shorter audio clip
# - Cache the AudioContext

# After fix, verify:
# audio:play-correct-sound .......... 15ms   ← FIXED
```

**The trace tells you exactly what to optimize.** No guessing.

---

## 9. Rollback Procedure

If a change causes issues in production:

```bash
# Option 1: Disable the feature flag
# In the router/shell, flip the flag:
featureFlags.set('use-new-quiz', false);

# Option 2: Revert the commit
git revert HEAD
git push origin main

# Option 3: Restore previous version
git checkout v2.0.0
```

All rollback procedures are documented in the PR description before merge.
