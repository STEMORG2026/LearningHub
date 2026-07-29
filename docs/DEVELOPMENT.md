# 🛠️ STEM Tuition — Technical Developer Handbook & Rules

This handbook provides technical architectural documentation, CSS design system rules, developer workflows, and guidelines for extending the STEM Tuition web platform.

For strict architectural rules, see [docs/RULES.md](file:///home/sajan/STEM-TUTION/docs/RULES.md).

---

## 1. Tech Stack & Architecture Overview

- **Core Tech Stack**: HTML5, CSS3, Vanilla ES6+ JavaScript (zero external dependencies).
- **Typography**: Google Fonts — `Syne` (Display/Headings) & `DM Sans` (Body text).
- **Design System**: Elevated dark glassmorphism (`var(--navy)` `#0a0f2e`) with backdrop blur filters, glowing borders, and HSL color cycles.
- **Card Boundaries**: All containers enforce `border-radius: 20px !important`, glass gradients, and participation in the **Random Dynamic Hover Border Animation System**.

---

## 2. Directory & Module Mapping

| Path | Purpose | Key Exports / Functions |
| :--- | :--- | :--- |
| `docs/RULES.md` | Authoritative Development Rules | Card rules, Hover styles, Physics engine rules, Cache-busting |
| `css/main.css` | Global styling & layout tokens | Navigation, Hero, Buttons, Grids, Responsive breakpoints |
| `css/stem-theme.css` | Component & Card styles | 4 Hover animations, Pioneer spotlight modal, Quiz styles |
| `js/main.js` | UI interactions | Navigation toggle, smooth scroll, IntersectionObserver `.reveal` |
| `js/stem-effects.js` | Physics canvas & effects | 8-planet solar system, gravitational attraction, visual controls, hover engine |
| `js/stem-pioneers.js` | Pioneer database & wall renderer | `STEM_PIONEERS` database, `renderSTEMPioneersWall()` |
| `js/stem-quiz.js` | Interactive Quiz Engine | `STEM_QUIZ_DATA` database, `STEMQuizApp` class |

---

## 3. Random Dynamic Hover Border Animation System

Hovering over any card triggers one of 4 randomized hover styles:
1. **✨ Style 1: HSL Neon Glow (`.hover-effect-glow`)**: HSL color-cycling border glow.
2. **💡 Style 2: Quiz Highlight Tint (`.hover-effect-tint`)**: Solid accent border pop with `rgba(255, 170, 0, 0.12)` background tint.
3. **⚡ Style 3: ZZZ Curly Electric Shock (`.hover-effect-electric`)**: Distorts the card border overlay (`::before`) into real zigzag/curly electric lightning waves using an SVG displacement filter (`url(#lightningDistort)`).
4. **🌫️ Style 4: Borderless Contrast Depth (`.hover-effect-borderless`)**: Glassmorphism backdrop blur with deep radial drop shadow.

> **CRITICAL RULE**: Never mutate `el.style.borderColor` or `el.style.boxShadow` in JavaScript, as inline styles override CSS hover rules!

---

## 4. How to Add New STEM Quiz Questions

To expand the STEM Quiz dataset, edit `js/stem-quiz.js` and add a question object to `STEM_QUIZ_DATA`:

```javascript
{
  category: "physics", // "physics" | "chemistry" | "mathematics" | "computing" | "pioneers"
  question: "What is Newton's Second Law of Motion?",
  options: [
    "F = ma",
    "E = mc^2",
    "V = IR",
    "P = IV"
  ],
  correct: 0,
  explanation: "Newton's Second Law states that force equals mass times acceleration (F = ma)."
}
```

---

## 5. How to Add New STEM Pioneers

To add a pioneer to the floating widget and pioneers wall, edit `js/stem-pioneers.js`:

```javascript
{
  id: "euler",
  name: "Leonhard Euler",
  title: "Master of Mathematics & Analysis",
  era: "1707 – 1783",
  field: "Mathematics & Physics",
  famousFor: "Formulating Euler's identity (e^(iπ) + 1 = 0) and graph theory.",
  didYouKnow: "Euler produced nearly 900 books and papers, continuing his output even after going completely blind!",
  gradient: "linear-gradient(135deg, #00d4ff, #a855f7)"
}
```

---

## 6. Running Local Dev Server & Cache Busting

Port `8000` is reserved for JARVIS services. Run the STEM Tuition local server on port **`8085`**:

```bash
python3 -m http.server 8085
```

When modifying CSS or JS, update query parameters (`?v=X.X`) across all `<link rel="stylesheet">` and `<script>` tags in HTML files to force immediate browser cache invalidation.
