# 📜 RULES.md – STEM Tuition Architecture & Guidelines (v5.0 Dual-Tier System)

This document is the authoritative technical reference for maintaining, editing, and extending the **STEM Tuition** web platform. Compliance with these rules is strictly mandatory across both the current static frontend and future VPS backend expansions.

---

## 📂 1. Directory Structure & File Architecture

All files **MUST** maintain exact casing, location, and naming conventions.

```
STEM-TUITION/
├── index.html              # Modern STEM Hub (Hero, Horizontal Carousels, Estimator, Pioneers, Quiz, Tools)
├── classes.html            # Classes & Curriculum Page (Grade 1-8, SEE 9-10, NEB 11-12, A-Levels, Batch Timings)
├── videos.html             # Video Lessons, Study Notes, Syllabus Downloads, Student Reviews
├── contact.html            # Contact & Admissions (Inquiry Form, WhatsApp, Operating Hours, FAQs)
├── stem-tuition.html       # Comprehensive Class Details & Subject Overview
├── css/
│   ├── main.css            # Core Design System, Token Palette, Layout Grids, Nav, Footer
│   └── stem-theme.css      # Card Styles, 6 Extended Hover Animations, Pioneer Spotlight, Quiz & Physics CSS
├── js/
│   ├── main.js             # Navigation, Native Scroll Engines, Popover Handlers, Tabs
│   ├── stem-effects.js     # Canvas Engine, 6-Hover Engine, Sound FX, Non-Locking Wheel Handler
│   ├── stem-pioneers.js    # STEM Pioneers Wall Renderer & Floating Spotlight Engine
│   └── stem-quiz.js        # Interactive STEM Quiz Engine (Physics, Math, Chemistry, CS)
└── docs/
    ├── RULES.md            # Authoritative Rules & Standard Guidelines Document
    ├── DEVELOPMENT.md      # Developer Handbook & Component Guides
    ├── CURRICULUM_GUIDE.md # Syllabus Breakdown (NEB, SEE, A-Levels)
    └── TUITION_OPERATIONS.md # Operating SOPs for Pokhara Classes

```

---

## 🎨 2. Tier 1: Static Architecture (Pure Frontend SOTA)

All static code must run without build steps, framework dependencies, or bundle overhead while leveraging cutting-edge browser capabilities.

### 2.1 CSS Token Palette & Glassmorphic Elevation

All UI components **MUST** strictly extend these CSS root variables:

```css
:root {
  --bg-dark: #070a14;
  --bg-card: rgba(255, 255, 255, 0.03);
  --bg-card-hover: rgba(255, 255, 255, 0.06);
  --glass-border: rgba(255, 255, 255, 0.08);
  --cyan: #38bdf8;
  --green: #34d399;
  --purple: #c084fc;
  --amber: #fbbf24;
  --pink: #ec4899;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --font-main: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

```

* **Uniform Radius Rule**: ALL interactive containers and cards (`.soft-card`, `.class-card`, `.pioneer-card`, `.quiz-container`, `.modal-card`, `.calc-card`, `.stat-card`, etc.) **MUST** enforce exact border rounding:
```css
border-radius: 20px !important;

```


* **Elevated Glass Container Standard**:
```css
background: var(--bg-card);
border: 1.5px solid var(--glass-border);
box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1);
backdrop-filter: blur(16px) saturate(180%);
-webkit-backdrop-filter: blur(16px) saturate(180%);

```


* **Button & Pill Radii**: Action buttons (`.btn-primary`, `.btn-secondary`, `.nav-cta`) enforce `border-radius: 30px`; form inputs enforce `border-radius: 12px`.

### 2.2 Modern Native Browser APIs (Zero JS Overheads)

1. **Compositor-Thread Scroll Reveals**: Use native CSS `animation-timeline: view()` so scroll reveals run on the GPU thread off JS main loop.
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.reveal-on-scroll {
  animation: fadeUp linear both;
  animation-timeline: view();
  animation-range: entry 10% cover 30%;
}

```


2. **Native HTML Popover API**: Modals (`#enrollModal`) **MUST** use the native HTML `popover` attribute and CSS `@starting-style` for accessible, top-layer modal rendering without custom JS focus traps.
```html
<dialog id="enrollModal" popover class="modal-card">...</dialog>

```


3. **MathML Core Math Expressions**: Formulas and scientific equations MUST use HTML MathML Core (`<math>`) rather than unrendered LaTeX text strings.
4. **Non-Locking Mouse-Wheel Carousel Logic**: Horizontal scroll tracks MUST check boundaries before capturing `deltaY` wheel events:
```javascript
document.querySelectorAll('.h-scroll-container').forEach(container => {
  container.addEventListener('wheel', (evt) => {
    const atRightEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
    const atLeftEnd = container.scrollLeft <= 0;

    if ((evt.deltaY > 0 && !atRightEnd) || (evt.deltaY < 0 && !atLeftEnd)) {
      evt.preventDefault();
      container.scrollBy({ left: evt.deltaY * 1.5, behavior: 'smooth' });
    }
  }, { passive: false });
});

```



### 2.3 Dynamic Hover Animation Engine (6 Styles)

Every `mouseenter` event attached via `js/stem-effects.js` MUST attach one randomly selected hover class from the 6 system variants:

1. `.hover-effect-glow`: HSL color-cycling border glow.
2. `.hover-effect-tint`: Solid accent border flash with background tinting.
3. `.hover-effect-electric`: SVG displacement map (`url(#lightningDistort)`) electric shock border.
4. `.hover-effect-borderless`: Outline dissolution with backdrop blur elevation (`blur(24px)`).
5. `.hover-effect-warp`: Chromatic dual-offset purple (`#c084fc`) and cyan (`#38bdf8`) border split.
6. `.hover-effect-plasma`: Conic-gradient solar plasma flare.

* **4-Cycle Style Cooldown Protocol**: When a hover animation style is randomly triggered on an element, that specific style enters a **4-cycle cooldown**. It cannot be selected again until at least 4 distinct new hover animation styles have been selected from the pool.

### 2.4 Visual Engine Default State & Floating Toast Protocol

The 3D canvas physics engine and floating control widget (`⚙️ Visuals`) in `js/stem-effects.js` **MUST** enforce the following immutable default state on initial load:

* **Background Animation**: `OFF` (`isBackgroundDisabled = true`)
* **Audio & Sound FX**: `OFF` (`isAudioMuted = true`)
* **Blackhole Engine**: `OFF` (`isBlackholeDisabled = true`)
* **Collision Intensity**: `50%` (`isHalfIntensity = true`)
* **Notification Toast Protocol**: Do NOT block the screen with an initial modal overlay. Instead, display a non-intrusive floating toast banner (`.stem-bg-toast`) at random intervals (every 45-75s) notifying users: *"💡 Tip: Interactive 3D physics background animation is available!"* with a **"✨ Turn On"** action button.

### 2.5 STEM Tuition Canvas Visibility & Layer Stacking Rule

All background canvas elements (`#bg-canvas, canvas`) **MUST** enforce non-blocking fixed full-viewport canvas visibility and rigid layer stacking:

```css
/* STEM Tuition Canvas Visibility Rule */
#bg-canvas, canvas {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 0 !important;
  pointer-events: none !important;
}

#stemBackgroundCanvas {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 1 !important; /* Layer 1: Above body bg, below UI content */
  pointer-events: none !important;
}
```

* **Layer 0**: `body` background gradient & grid pattern (`z-index: 0`).
* **Layer 1**: `#stemBackgroundCanvas` 3D physics universe (`z-index: 1 !important`).
* **Layer 2**: Interactive UI content containers (`nav`, `main`, `section`, `.card`, `.soft-card`, `.class-card`) set to `position: relative; z-index: 2;`.
* **Layer 999999**: Floating Visual Controls Widget (`.stem-corner-widget`) & Toast (`.stem-bg-toast`) assigned highest priority (`z-index: 999999 !important;`).

---

## 🚀 3. Tier 2: Future VPS Expansion Architecture (Server-Side & Node/JARVIS Integrations)

When migrating from static hosting to a dedicated VPS, the platform transitions into a hybrid SSR/API architecture.

```
       [ Client Browser ]
               │
               ▼ (Port 443 / SSL)
       ┌───────────────┐
       │ Nginx Proxy   │
       └───────┬───────┘
               │
       ┌───────┴───────────────────────┐
       │                               │
       ▼ (Port 8085)                   ▼ (Port 8000)
┌─────────────────────────┐   ┌─────────────────────────┐
│ STEM Node/Fastify API   │   │ JARVIS Core Services    │
│ (Dynamic Seats, Leads,  │   │ (AI Tutors, Automated   │
│ SQLite/Postgres DB)     │   │ Analytics, Backups)     │
└─────────────────────────┘   └─────────────────────────┘

```

### 3.1 Port Architecture & Process Management

* **Port Allocation**:
* **Port `8085**`: Reserved for STEM Tuition Application & Web API Services.
* **Port `8000**`: Strictly reserved for local JARVIS backend platform services.


* **Process Manager**: All production VPS Node/Python services **MUST** run under `pm2` or Docker containers with auto-restart policies:
```bash
pm2 start server.js --name "stem-tuition-api" --port 8085

```



### 3.2 Nginx Reverse Proxy Configuration Standard

All VPS traffic MUST pass through Nginx configured with TLS 1.3, HTTP/2, Gzip/Brotli compression, and proxy buffers:

```nginx
server {
    listen 443 ssl http2;
    server_name stemtuitionpokhara.com;

    ssl_certificate /etc/letsencrypt/live/stemtuitionpokhara.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stemtuitionpokhara.com/privkey.pem;

    # Static Asset Caching
    location ~* \.(css|js|png|jpg|webp|svg|woff2)$ {
        root /var/www/stem-tuition;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Dynamic API Routes Proxy to Port 8085
    location /api/ {
        proxy_pass http://127.0.0.1:8085/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}

```

### 3.3 State Management & Data Layer Rules

* **Database Protocol**: Use lightweight, zero-latency persistence (SQLite via Drizzle ORM or PostgreSQL). SQLite databases MUST reside in an encrypted container or non-public directory (`/var/data/stem.db`).
* **Real-Time Dynamic Seat Sync**: Live class seat countdowns ("Only 2 seats left") MUST sync using native **Server-Sent Events (SSE)** (`/api/seats/stream`) or lightweight WebSockets.
* **Admission Lead Ingestion Pipeline**:
```
[Inquiry Form] ──> POST /api/leads ──> SQLite DB ──> Webhook to WhatsApp / Telegram

```



### 3.4 Production Security & Headers Standard

When serving via VPS, Nginx or Node middleware **MUST** inject the following HTTP security headers:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;" always;

```

---

## 🔄 4. Operational Integrity, Spelling & Cache-Busting Protocol

### 4.1 Cache-Busting Protocol (Static Release Pipeline)

Every release update on the static tier **MUST** increment the version query parameter across all HTML files:

```html
<link rel="stylesheet" href="css/main.css?v=13.0"/>
<link rel="stylesheet" href="css/stem-theme.css?v=13.0"/>
<script src="js/main.js?v=13.0"></script>

```

### 4.2 Content Integrity & Vocabulary Directives

* **Zero-Tolerance Spelling Rule**: The word **"Tuition"** **MUST** always be spelled correctly (never "tution" or "tution-stem").
* **Official Immutable Credentials**:
* **Phone**: `+977 9768021317`
* **Email**: `gurungsajan0228@gmail.com`
* **WhatsApp**: `[https://wa.me/9779768021317](https://wa.me/9779768021317)`
* **Location**: Pokhara, Nepal

### 4.3 Mandatory Server Restart & Verification Directive

* **Automatic Web Server Restart Rule**: Every single time any file (`.html`, `.css`, `.js`, `.md`) or configuration is modified, updated, or created, you **MUST** automatically restart the HTTP web server on Port `8085` (`python3 -m http.server 8085`) and run `node tests/verify-stem-platform.js` to guarantee the live environment serves updated assets.

---

## 📋 5. Operational Guidelines Summary

| Feature / Standard | Tier 1: Static Hosting | Tier 2: Future VPS Deployment |
| --- | --- | --- |
| **Hosting Platform** | GitHub Pages / Cloudflare Pages | Dedicated Linux VPS (Ubuntu/Debian) |
| **Port Assignment** | Standard HTTP/HTTPS | Frontend via Nginx, API on **Port `8085**` |
| **Animations** | CSS `animation-timeline: view()` | CSS Native + SSE triggered live UI events |
| **Modals** | Native HTML `<dialog popover>` | Native Popover + Server API confirmation |
| **Data Storage** | LocalStorage / Pre-filled URLs | SQLite / PostgreSQL + Drizzle ORM |
| **Form Handling** | Direct WhatsApp Redirects | REST API (`/api/leads`) + Webhook Alerts |
