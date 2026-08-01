# Performance Guide

**Version:** 3.0.0  
**Status:** ENFORCED  
**Owner:** Architecture  
**Applies To:** All packages and apps  
**Related:** `RULES.md`, `DEPENDENCY_POLICY.md`  
**Purpose:** Performance budgets, monitoring, and optimization targets.

---

## Performance Budgets

| Metric | Target | Measurement | Tool |
|--------|--------|-------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | p75 of users | Lighthouse / Web Vitals |
| **FID** (First Input Delay) | < 100ms | p75 of users | Lighthouse / Web Vitals |
| **CLS** (Cumulative Layout Shift) | < 0.1 | p75 of users | Lighthouse / Web Vitals |
| **INP** (Interaction to Next Paint) | < 200ms | p75 of users | Lighthouse / Web Vitals |
| **Bundle size (legacy)** | < 300KB gzipped | per page | webpack-bundle-analyzer |
| **Module size (modern)** | per-package budgets in `bundlesize.config.json` (apps gzip) | per package | `pnpm lint:size` |

---

## Optimization Rules

### Rule PERF-1: Passive Event Listeners
```typescript
// ✅ REQUIRED: Passive for scroll/touch
element.addEventListener('scroll', handler, { passive: true });
element.addEventListener('wheel', handler, { passive: true });
element.addEventListener('touchstart', handler, { passive: true });

// ❌ WRONG: Blocking scroll
element.addEventListener('scroll', handler);
```

### Rule PERF-2: requestAnimationFrame for Animations
```typescript
// ✅ REQUIRED
function animate(timestamp: number) {
  updatePositions();
  render();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### Rule PERF-3: Lazy Load Heavy Modules
```typescript
// ✅ REQUIRED for modules > 50KB
const loadPhysicsEngine = async () => {
  const { PhysicsEngine } = await import('@stem-tuition/simulation-core');
  return new PhysicsEngine();
};

// Use only when needed
const engine = await loadPhysicsEngine();
```

### Rule PERF-4: Debounce Expensive Operations
```typescript
// ✅ REQUIRED for resize/scroll handlers
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

const handleResize = debounce(() => {
  recalculateLayout();
}, 100);
```

### Rule PERF-5: Canvas Optimization
```typescript
// ✅ REQUIRED for canvas rendering
// 1. Use offscreen canvas for heavy computations
const offscreen = new OffscreenCanvas(width, height);
const offCtx = offscreen.getContext('2d');

// 2. Reduce particle count on low-end devices
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;
const particleCount = prefersReducedMotion ? 20 : 100;

// 3. Batch draw calls
ctx.beginPath();
bodies.forEach(body => {
  ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
});
ctx.fill();
```

---

## Monitoring

### Development

```bash
# Run Lighthouse audit
pnpm test:perf

# Check bundle sizes
pnpm lint:size

# Trace slow functions (browser)
open http://localhost:8085/?trace=true
```

### Production (Future)

| Tool | Purpose | When |
|------|---------|------|
| Lighthouse CI | Core Web Vitals | Every PR |
| Web Vitals library | Real user monitoring | Production |
| `pnpm lint:size` (size-check.cjs) | Bundle regression vs. budgets | Every commit |

---

## Performance Checklist (Pre-Release)

- [ ] All event listeners are passive where possible
- [ ] Animations use requestAnimationFrame
- [ ] Heavy modules are lazy-loaded
- [ ] Canvas particle count adapts to device capability
- [ ] Bundle sizes are within budget
- [ ] LCP passes threshold (verify with Lighthouse)
- [ ] CLS passes threshold (no layout shifts)
- [ ] Images are optimized (WebP, lazy loading)
