# Accessibility Guide

**Version:** 3.0.0  
**Status:** ENFORCED  
**Owner:** Architecture  
**Applies To:** All components and pages  
**Related:** `RULES.md`, `COMPONENT_STANDARDS.md`  
**Target:** WCAG 2.2 AA  
**Tooling:** axe-core via Playwright (automated) + manual review

---

## Requirements

Every component and page MUST pass these checks before shipping.

### Keyboard Navigation

| Requirement | How to test | Violation blocks merge? |
|------------|-------------|------------------------|
| All interactive elements reachable via Tab | Tab through page | ✅ Yes |
| Tab order follows visual order | Visual inspection | ✅ Yes |
| All interactive elements activatable with Enter/Space | Test each element | ✅ Yes |
| Focus indicator visible (not just browser default) | `:focus-visible` styles exist | ✅ Yes |
| No keyboard traps | Tab through without getting stuck | ✅ Yes |
| Skip-to-content link available | First Tab press shows skip link | ⚠️ Recommended |

### Screen Reader Support

```html
<!-- ✅ REQUIRED: ARIA labels on interactive controls -->
<button aria-label="Play sound effect">🔊</button>

<!-- ✅ REQUIRED: aria-live for dynamic content -->
<div aria-live="polite" role="status">
  Score: 8 out of 10
</div>

<!-- ✅ REQUIRED: Role attributes on custom elements -->
<stem-quiz role="application" aria-label="Physics quiz: Newton's Laws">
</stem-quiz>
```

### Color and Contrast

| Check | Standard | Tool |
|-------|----------|------|
| Text contrast | ≥ 4.5:1 (normal), ≥ 3:1 (large) | axe-core |
| Non-text contrast | ≥ 3:1 (UI components) | axe-core |
| Color not sole differentiator | Information not conveyed by color alone | Manual review |
| Focus indicators | ≥ 3:1 contrast against adjacent colors | Visual inspection |

### Reduced Motion

```css
/* ✅ REQUIRED in every component */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Semantic HTML

```html
<!-- ✅ REQUIRED: Use semantic elements -->
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<section aria-labelledby="quiz-heading">...</section>
<h1 id="quiz-heading">Physics Quiz</h1>

<!-- ❌ AVOID: Div soup -->
<div class="nav">...</div>
<div class="main-content">...</div>
```

---

## Component-Specific Requirements

### `<stem-quiz>`

- `role="application"` with `aria-label` describing the concept
- Each question is an `<fieldset>` with `<legend>`
- Answer options are `<button>` elements (not divs)
- Focus moves to next question on answer selection
- Timer announcements via `aria-live="polite"`
- Score announcement at completion via `role="status"`

### `<stem-simulation>` (Future)

- `role="application"` with `aria-label`
- Canvas has a text fallback description
- Controls are native HTML elements (not canvas-drawn)
- Speed/toggle controls have visible labels

### Canvas Animations (Legacy)

- `role="presentation"` or `aria-hidden="true"` because decorative
- No critical information in canvas alone
- Visual Controls widget has labelled buttons

---

## Audit Process

```bash
# 1. Run automated audit (part of verify-governance)
pnpm test:a11y

# 2. Manual checklist
- [ ] Tab through page — focus order logical
- [ ] All interactive elements reachable
- [ ] No keyboard traps
- [ ] Screen reader reads content in logical order
- [ ] Color contrast passes (check with axe devtools)
- [ ] Reduced motion respected
- [ ] All form inputs have labels
- [ ] Error messages announced via aria-live

# 3. Fix any violations
# 4. Re-run automated audit
# 5. Deploy
```

---

## Violation Escalation

| Priority | Violation | Action |
|----------|-----------|--------|
| 🔴 Critical | Keyboard trap, missing form label | Block merge, must fix |
| 🟠 Serious | Low contrast, missing alt text | Block merge, must fix |
| 🟡 Moderate | Non-semantic heading structure | Warning, fix in same sprint |
| 🟢 Minor | Suboptimal reading order | Note for next sprint |
