# 🔬 STEM Tuition — Pokhara, Nepal

Welcome to **STEM Tuition Pokhara**, a specialized academic learning platform and private tuition service dedicated to excellence in **Science, Technology, Engineering, and Mathematics (STEM)** education across Pokhara and digital learning channels.

> **Developer & Architecture Rules**: See [docs/RULES.md](file:///home/sajan/STEM-TUTION/docs/RULES.md) for strict card design, physics engine, and development guidelines.

---

## 🌟 Overview & Features

STEM Tuition provides personalized home tuition, group coaching, and interactive online learning for students ranging from foundational school levels (Grades 1–8) to national board exams (SEE & NEB 11/12) and international GCE A-Levels.

### 🧠 STEM Interactive Web Experience
- **🎯 Choose Your Grade & Subject Card Component**: Interactive grade selector (1-8, SEE 9-10, NEB 11-12, A-Levels) and subject checkboxes with live tuition recommendation calculations and instant pre-filled WhatsApp enrollment booking!
- **⚡ Random Dynamic Hover Border Engine**: Every card and container dynamically triggers one of 4 randomized hover animation styles:
  1. *✨ HSL Neon Glow* (`.hover-effect-glow`)
  2. *💡 Quiz Highlight Tint* (`.hover-effect-tint`)
  3. *⚡ ZZZ Curly Electric Shock* (`.hover-effect-electric` via SVG `feTurbulence` + `feDisplacementMap`)
  4. *🌫️ Borderless Contrast Depth* (`.hover-effect-borderless`)
- **🪐 Background Solar System & Physics Canvas**: Interactive canvas engine featuring 1 central Sun ($r=75$px), 8 planets with orbiting moons, Newton's Gravitational Attraction ($F_g \propto \frac{m_1 m_2}{r^{1.4}}$), rotating Milky Way Galaxy, and floating Visual Controls widget (`⚙️ Visuals` at `bottom: 24px; right: 24px; z-index: 999999 !important`). Default OFF load modal prompts: *Yes*, *No*, *Preview*.
- **⚡ Challenge Your STEM Brain (Interactive Quiz Engine)**: Subject-categorized quizzes (Physics, Chemistry, Math, Computing, Pioneers) with instant answer validation and explanations.
- **🧬 STEM Giants & Pioneers Wall & Spotlight Widget**: Non-intrusive floating widget highlighting legendary pioneers in STEM history (Newton, Curie, Einstein, Lovelace, Turing, Gauss, Aryabhata, Katherine Johnson).

---

## 🎓 Academic Offerings

| Level / Grade | Key Subjects Offered | Target Outcomes |
| :--- | :--- | :--- |
| **Grades 1 – 8** | Mathematics, General Science, English & Computing Basics | Foundational STEM understanding, logical problem solving |
| **SEE (Grades 9 – 10)** | Physics, Chemistry, Biology, Comp. Math, Opt. Math, English | SEE Board Distinction Preparation, conceptual mastery |
| **NEB (Grades 11 – 12)** | Physics, Higher Math, Chemistry, Computer Science, English | Board exam top tier scoring, IOE / IOM entrance foundations |
| **A-Levels (AS & A2)** | Cambridge Physics (9702), Chemistry (9701), Mathematics (9709) | Past paper drill, marking scheme mastery, UK university prep |

---

## 📂 Codebase & Folder Architecture

```text
STEM-TUTION/
├── css/
│   ├── main.css              # Consolidated design system, global resets, nav, footer, cards
│   └── stem-theme.css        # Card styles, 4 Hover border animations, Pioneer Spotlight, Quiz UI
├── js/
│   ├── main.js               # Mobile navbar toggle, reveal animations, FAQs
│   ├── stem-effects.js       # Physics canvas, 8-planet solar system, hover engine, visual controls
│   ├── stem-pioneers.js      # Pioneer database & non-intrusive floating widget engine
│   └── stem-quiz.js          # Interactive STEM Quiz Engine
├── docs/
│   ├── RULES.md              # Authoritative Development Rules & Architecture
│   ├── CURRICULUM_GUIDE.md   # Detailed syllabus breakdown for NEB, SEE & A-Levels
│   ├── TUITION_OPERATIONS.md # Operating procedures for home, group & Zoom sessions in Pokhara
│   └── DEVELOPMENT.md        # Technical developer guide & API reference
├── index.html                # Main landing page with Hero, Choose Grade/Subject Card, Quiz & Pioneers
├── classes.html              # Comprehensive grade-by-grade course catalog & timetable
├── stem-tuition.html          # About STEM Tuition mission, methodology, and resources
├── videos.html               # Sample video lessons, downloadable PDF study notes & reviews
├── contact.html              # Tuition inquiry form, contact info, location & FAQs
└── README.md                 # Primary project documentation
```

---

## 🚀 Running Locally & Web Server

STEM Tuition is built with pure Vanilla HTML5, CSS3, and JavaScript (ES6+).

> **Note on Ports**: Port `8000` is reserved for JARVIS services. STEM Tuition server runs on port **`8085`** to prevent port conflicts.

```bash
python3 -m http.server 8085
```
Open your browser to: [http://localhost:8085](http://localhost:8085)
