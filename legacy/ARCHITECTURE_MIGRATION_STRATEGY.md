# [SUPERSEDED] Architecture Migration Strategy & Strangler Fig Plan

> **⚠️ This document is superseded.** See `docs/ROADMAP.md` for the current phased migration plan, `docs/ARCHITECTURE.md` for architecture, and `docs/FLOWCHARTS.md` for visual diagrams.  
> **Kept for historical reference only.**

**Project:** STEM Tuition Platform (v1.0.0)  
**Date:** 2023-10-27  
**Status:** Ready for Modular Extraction  

---

## 1. Current Dependency Graph

The current system is a **Monolithic Frontend** with tight coupling between the DOM, Canvas Engine, and UI Logic.

```mermaid
graph TD
    subgraph Legacy_Monolith ["Legacy Monolith (stem-effects.js + index.html)"]
        DOM[DOM / HTML Structure]
        CSS[CSS Design System]
        JS_Core[stem-effects.js Main Entry]
        
        subgraph Modules ["Internal Modules (Coupled)"]
            CanvasEng[Canvas Engine (Physics/Stars)]
            QuizEng[Quiz Engine]
            UI_Cards[Card Hover Animations]
            Nav[Navigation & Routing]
            Audio[Audio Synth]
        end
        
        DOM --> JS_Core
        CSS --> DOM
        JS_Core --> CanvasEng
        JS_Core --> QuizEng
        JS_Core --> UI_Cards
        JS_Core --> Nav
        JS_Core --> Audio
        
        CanvasEng -.->|Direct DOM Manipulation| DOM
        QuizEng -.->|Direct DOM Manipulation| DOM
        UI_Cards -.->|Direct DOM Manipulation| DOM
    end

    subgraph External ["External Dependencies"]
        Browser[Browser APIs: requestAnimationFrame, WebAudio, Canvas2D]
        LocalStore[localStorage]
    end

    JS_Core --> Browser
    JS_Core --> LocalStore
```

**Key Coupling Issues:**
1.  **Direct DOM Access:** Modules manipulate `document.getElementById` directly, making them hard to test or move.
2.  **Global State:** Shared state (e.g., `currentTheme`, `audioEnabled`) is implicit or global.
3.  **Single Bundle:** All logic resides in one file (`stem-effects.js`), creating a "Big Ball of Mud" risk as it grows.

---

## 2. Architectural Seams for Strangler Fig Extraction

Seams are logical boundaries where we can cut the monolith to extract services incrementally.

| Seam ID | Boundary Description | Extraction Candidate | Interface Type |
| :--- | :--- | :--- | :--- |
| **S1** | **Visual Rendering** | Canvas Physics Engine | `<canvas>` Context API |
| **S2** | **User Interaction** | Quiz Engine | Custom Events / PostMessage |
| **S3** | **Content Display** | Grade/Subject Cards | Web Components / Shadow DOM |
| **S4** | **Navigation** | Router / View Switcher | URL Hash / History API |
| **S5** | **System Utilities** | Audio & Storage | Facade Pattern |

### Strangler Fig Strategy
We will not rewrite the whole app at once. Instead, we will:
1.  Create a **New Shell** (Module Federation or Micro-frontends).
2.  Identify a **Seam** (e.g., The Quiz).
3.  Build the **New Module** (React/Vue/Svelte) in isolation.
4.  Route traffic for `/quiz` to the new module via the **Anti-Corruption Layer**.
5.  Remove the old quiz code from the monolith.
6.  Repeat until the monolith is strangled.

---

## 3. Module Migration Risk Ranking

Ranked by **Complexity** (Logic density) vs. **Coupling** (Dependencies on other parts).

| Rank | Module | Risk Level | Reason | Migration Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Canvas Physics Engine** | 🔴 **High** | Heavy math, direct canvas context access, RAF loops, tight coupling to resize events. | **Extract First.** Isolate rendering logic into a pure function library, then wrap in a Web Component. |
| **2** | **Quiz Engine** | 🟠 **Med-High** | Complex state machine (question -> answer -> feedback), audio triggers, DOM updates. | **Extract Second.** High business value. Move to a framework with strong state management (e.g., React/Zustand). |
| **3** | **Card Hover System** | 🟡 **Medium** | Heavy CSS reliance, JS class toggling. Low logic, high visual fidelity risk. | **Refactor in Place.** Convert to CSS-only or lightweight Web Component before full extraction. |
| **4** | **Navigation/Routing** | 🟡 **Medium** | Controls the entire app flow. Breaking this breaks everything. | **Extract Last.** Keep as the "Shell" that orchestrates other micro-frontends. |
| **5** | **Audio Synth** | 🟢 **Low** | Pure utility, no DOM dependencies. | **Library Extraction.** Move to a standalone `utils/audio.js` module immediately. |

---

## 4. Anti-Corruption Layer (ACL) Interfaces

The ACL prevents legacy code from contaminating new modules and vice-versa.

### A. Event Bus Adapter (Legacy ↔ New)
*Purpose:* Decouple communication. Legacy fires custom events; New modules listen via a standardized adapter.

```javascript
// acl-event-bridge.js
export class EventBridge {
  constructor() {
    this.channel = new BroadcastChannel('stem-migration');
  }

  // Legacy calls this
  publish(type, payload) {
    this.channel.postMessage({ type, payload, source: 'legacy' });
  }

  // New Module subscribes to this
  subscribe(type, callback) {
    this.channel.onmessage = (msg) => {
      if (msg.data.type === type) callback(msg.data.payload);
    };
  }
}
```

### B. DOM Facade (For Canvas Extraction)
*Purpose:* Prevent new Canvas module from knowing about the specific legacy HTML structure.

```javascript
// acl-canvas-facade.js
export class CanvasFacade {
  constructor(containerId) {
    this.canvas = document.getElementById(containerId);
    this.ctx = this.canvas.getContext('2d');
  }

  // Expose only necessary drawing methods, hide DOM details
  resize(width, height) { /* ... */ }
  clear() { /* ... */ }
  drawParticle(x, y, color) { /* ... */ }
}
```

### C. Router Interceptor
*Purpose:* Intercept navigation requests to decide whether to load Legacy or New Module.

```javascript
// acl-router.js
const ROUTE_MAP = {
  '/quiz': 'NEW_QUIZ_MODULE',
  '/physics': 'NEW_CANVAS_MODULE',
  '/home': 'LEGACY_MONOLITH'
};

window.addEventListener('hashchange', (e) => {
  const route = location.hash;
  if (ROUTE_MAP[route] === 'NEW_QUIZ_MODULE') {
    e.preventDefault();
    loadMicroFrontend('quiz-app');
  }
});
```

---

## 5. Recommended Order of Vertical-Slice Migrations

We migrate **Vertical Slices** (full feature stacks) rather than horizontal layers.

### Phase 1: The "Safe" Utility Slice (Weeks 1-2)
*   **Target:** Audio Synth & LocalStorage Utils.
*   **Why:** Low risk, no UI, immediate benefit for testing.
*   **Action:** Extract to `@stem/utils`. Update monolith to import via CDN/NPM.

### Phase 2: The "Visual" Slice (Weeks 3-5)
*   **Target:** Physics Canvas Engine (Solar System/Gravity).
*   **Why:** High complexity, isolated rendering context. Proves we can handle heavy JS.
*   **Action:** Rewrite as a Web Component (`<stem-physics-canvas>`). Mount inside legacy container.

### Phase 3: The "Interactive" Slice (Weeks 6-9)
*   **Target:** Quiz Engine.
*   **Why:** Core business logic, requires state management.
*   **Action:** Build in React/Vue. Use ACL Event Bridge for score reporting to legacy header/footer.

### Phase 4: The "Content" Slice (Weeks 10-12)
*   **Target:** Grade/Subject Cards & Hover Effects.
*   **Why:** High CSS coupling.
*   **Action:** Convert to Storybook components. Replace legacy DOM nodes one by one.

### Phase 5: The "Shell" (Weeks 13+)
*   **Target:** Navigation & Layout.
*   **Why:** Final step. Once all features are extracted, the shell becomes the new router.
*   **Action:** Deprecate `index.html` monolith. Serve new Shell.

---

## 6. Automated Architecture Fitness Functions

These functions can be run in CI/CD (GitHub Actions) to prevent architectural regression.

### F1: Dependency Cycle Detection
*Goal:* Ensure no circular dependencies between modules.
*Tool:* `madge` or `dependency-cruiser`
*Command:*
```bash
npx madge --circular src/**/*.js
# Fail build if exit code != 0
```

### F2: Module Size Budget
*Goal:* Prevent extracted modules from becoming bloated.
*Tool:* `webpack-bundle-analyzer` or custom script
*Rule:* No single module > 50KB (gzipped).
*Script:*
```javascript
// fitness-size.js
const MAX_SIZE = 51200; // 50KB
const size = fs.statSync(path).size;
if (size > MAX_SIZE) throw new Error(`Module ${path} exceeds size limit!`);
```

### F3: Forbidden Import Rules
*Goal:* Prevent new modules from importing legacy internals.
*Tool:* `dependency-cruiser`
*Config (`.dependency-cruiser.js`):*
```javascript
forbidden: [
  {
    name: 'no-legacy-imports',
    severity: 'error',
    from: { path: 'src/new-modules/' },
    to: { path: 'src/legacy-monolith/', pathNot: 'src/legacy-monolith/acl/' }
  }
]
```

### F4: Test Coverage Threshold per Module
*Goal:* Ensure extracted modules are tested before merging.
*Tool:* `jest` / `vitest`
*Rule:* New modules must have >90% coverage; Legacy can stay at 70%.

### F5: DOM Access Enforcement
*Goal:* Ensure new modules don't touch `document.body` directly.
*Tool:* ESLint Custom Rule
*Rule:* Disallow `document.querySelector` outside of `acl/` directory.

---

## 7. Target Architecture Diagram

### Current State (Monolith)
*(See Section 1)*

### Future State (Modular Micro-Frontends)

```mermaid
graph TB
    subgraph Client_Browser ["Client Browser"]
        Shell[New Shell App (Router/Layout)]
        
        subgraph MFEs ["Micro-Frontends (Independent Deployments)"]
            MFE_Quiz[Quiz Module (React)]
            MFE_Physics[Physics Module (Web Component)]
            MFE_Cards[Cards Module (Vue/Svelte)]
        end
        
        subgraph ACL ["Anti-Corruption Layer"]
            EventBus[Event Bridge]
            AuthProxy[Auth Proxy]
            StyleLib[Shared Design Tokens]
        end
    end

    subgraph Legacy_Zone ["Legacy Zone (Strangled Over Time)"]
        Mono[Remaining Monolith (shrinking)]
    end

    subgraph Infrastructure ["Infrastructure"]
        CDN[CDN / Static Host]
        API[Backend API (Future)]
    end

    Shell --> MFE_Quiz
    Shell --> MFE_Physics
    Shell --> MFE_Cards
    Shell -->|Fallback| Mono
    
    MFE_Quiz <-->|Events| EventBus
    MFE_Physics <-->|Events| EventBus
    Mono <-->|Events| EventBus
    
    Shell --> StyleLib
    MFE_Quiz --> StyleLib
    
    Shell --> CDN
    MFE_Quiz --> CDN
    Mono --> CDN
```

### Key Changes in Target State:
1.  **Independent Deployment:** Quiz, Physics, and Cards can be deployed without rebuilding the whole app.
2.  **Technology Agnostic:** Physics can be Vanilla JS/WebComponent, Quiz can be React, Cards can be Vue.
3.  **Shared Kernel:** Design tokens and Event Bus are shared libraries, not coupled code.
4.  **Resilience:** If the Quiz module fails, the rest of the site (Home, Physics) remains functional.

---

## 8. Next Steps for Implementation

1.  **Setup CI Pipeline:** Add `dependency-cruiser` and size checks to GitHub Actions.
2.  **Initialize Repo Structure:** Create folders for `apps/shell`, `apps/quiz`, `packages/acl`.
3.  **Build the ACL:** Implement the `EventBridge` and verify communication between two dummy iframes/modules.
4.  **Execute Phase 1:** Extract Audio Utils and verify via bundle analysis.
