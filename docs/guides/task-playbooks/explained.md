# Playbook: Explained (deep-dive)

**Version:** 3.0.0
**Gate:** Local → PR
**Applies To:** authoring the "Explained" section — the phenomenon / working principle /
hard topic explained fully, starting simple and scaling up

---

## Purpose

The "Explained" section is where a lesson goes **deep**. It is the place for the
phenomenon, the working principle of a technology, and the hard topics — for
enthusiasts, professionals and nerds. Its defining property:

> **It starts simple and scales as it needs to.**

Every reader gets a plain-language opener; each deeper rung adds real depth for the
reader who wants it. No reader is left behind; no expert is left bored.

## The rung structure

```
intro   →  a plain-language statement anyone can follow
Rung 1  →  Curious        (anyone starting out)
Rung 2  →  Enthusiast     (comfortable with the basics)
Rung 3  →  Professional   (applied / engineering depth)
Rung 4  →  Nerd           (the fullest, most general treatment)
```

Rules:
- **At least 2 rungs.** Most concepts warrant 3–4. One rung is not a deep-dive.
- **Rung 1 is always `Curious`** and reads in plain language, no jargon gate.
- **Each rung builds on the previous** — nothing assumes knowledge introduced in a
  later rung.
- **The final rung earns "Nerd"** only if it is genuinely the most general/deep
  treatment (e.g. moves to Noether's theorem, field theory, the general integral) —
  not just "bigger words."

## How to author one

1. **[ ] Name the phenomenon.**
   `phenomenon` states *what* you are fully explaining (e.g. "Why a rocket needs no air
   to push on"). One concrete subject, not a menu.
2. **[ ] Write a plain `intro`.**
   Any reader (including a curious child) must follow the opener. *(Test: read it to a
   non-physicist; if they stumble, simplify.)*
3. **[ ] Write Rung 1 (Curious) in everyday words**, with one concrete image or example.
4. **[ ] Scale Rung 2 (Enthusiast)** — introduce the real quantities and the one key
   formula, still readable aloud.
5. **[ ] Scale Rung 3 (Professional)** — applied depth engineers actually use: control
   volumes, the general integral, real design choices. Show *why* the general form
   matters in practice.
6. **[ ] Scale Rung 4 (Nerd)** — the most general treatment and the honest boundary
   of the concept (what breaks it: field theory, relativity, non-conservation).
7. **[ ] Keep every rung truthful.**
   Physics/maths claims must be correct at every depth. When a simpler rung states
   something the deepest rung refines, say so explicitly (e.g. "…assumes constant
   mass, which is false for a rocket").
8. **[ ] Connect to the technology.**
   If the concept underlies a technology (rocket engines, braking, power stations),
   the Professional rung should explain the *working principle* of that technology in
   terms of the concept.

## Content model mapping

In `NarrativeContent`:

```
deepDive: {
  phenomenon: string,
  intro: string,
  rungs: LessonDepthRung[]   // level + audience + body, Curious first
}
```

The composer emits a `deep-dive` section whose **first rung is open** by default in the
renderer; deeper rungs are collapsed until the reader expands them. Verify this in the
renderer test (`tests.md`).

## Common failings to avoid

| Failing | Fix |
|---|---|
| Rung 1 assumes a formula | Rewrite for a competitor to no physics. |
| Rungs don't escalate | Each rung must add depth, not repeat. |
| "Nerd" rung is just long | Make it *more general*, not *more words*. |
| A claim contradicts a lower rung | State the refinement explicitly. |
| Only 1 rung | Add at least a Curious + Enthusiast pair. |

## Definition of done

- [ ] `phenomenon` names one concrete subject.
- [ ] `intro` reads plainly to a non-specialist.
- [ ] Rung 1 is `Curious`, in everyday words.
- [ ] ≥2 rungs, each building on the prior, scaling to real depth.
- [ ] The deepest rung is honest about the concept's boundary.
- [ ] Renderer shows rung 1 open, others collapsed (asserted in a test).