# Narration I/O Contract

**Version:** 3.0.0
**Part of:** [narration pipeline](../README.md)

The exact shapes the narration roles exchange. Minor (additive-only) extensions are
fine, but every role reads and writes these shapes, so keep them stable.

## 1. Research dossier (`ResearchDossier`) — Researcher → Writer

```jsonc
{
  "conceptId": "lhs:phys.impulse",
  "canonicalDefinition": "The product of ...",
  "symbol": "J",
  "unit": "newton second (N·s)",
  "equation": "J = F·Δt = Δp",
  "history": "The backstory in prose.",
  "figures": [
    {
      "name": "Isaac Newton",
      "role": "English mathematician and natural philosopher",
      "lifespan": "1643–1727",
      "contribution": "What they actually established.",
      "statement": "Their recorded words.",
      "statementSource": "Work, year (translator).",
      "verified": true
    }
  ],
  "timeline": [
    { "period": "1687", "event": "…", "figure": "Isaac Newton", "note": "why it matters" }
  ],
  "perspectives": [
    { "figure": "…", "view": "As they held it.", "standing": "superseded | refined | consensus", "note": "relation to modern view" }
  ],
  "whatCameBefore": "prerequisites in plain language",
  "connections": ["topic"],
  "applications": ["real setting as a tiny story"],
  "misconceptions": ["teaching story"],
  "deepDive": {
    "phenomenon": "subject",
    "curve": {
      "curious": "plain explanation",
      "enthusiast": "…",
      "professional": "practical, engineering-level",
      "nerd": "advanced, mathematically fearless"
    }
  },
  "workedExamples": ["step-by-step, with numbers"],
  "analogies": ["concrete everyday parallel"],
  "tryThis": "safe real-world activity",
  "funFacts": ["curiosity"],
  "unverifiedNotes": ["anything NOT verified — must be flagged, never silently used"]
}
```

## 2. Draft narrative (`NarrativeContent`) — Writer → Reviewer

Must satisfy the `NarrativeContent` interface in
`packages/content-provider/src/types.ts` exactly. Required fields:

- `conceptId`, `hook`, `history`, `figures[]`, `timeline[]`, `perspectives[]`,
  `deepDive{ phenomenon, intro, rungs[] }`, `whatCameBefore`, `connections[]`,
  `applications[]`, `workedExamples[]`, `analogies[]`, `misconceptions[]`,
  `tryThis`, `funFacts[]`, `estimatedTimeMinutes`.

Refer to `apps/shell/src/data/narratives.ts` and `narratives-batch2.ts` as
shape + tone references. Note `exactOptionalPropertyTypes` — never assign an optional
field to `undefined`; omit it instead. Use `import type` for type-only imports.

## 3. Review findings (`ReviewFindings`) — Reviewer → Writer

```jsonc
{
  "verdict": "pass" | "revisions",
  "issues": [
    {
      "field": "figures[0].statementSource",
      "problem": "Unverifiable source; the quote is not from this work.",
      "fix": "Replace with a verified source or mark UNVERIFIED." 
    }
  ],
  "notes": []
}
```

`verdict: "pass"` requires **no** blocking issues.

## 4. Master verdict (`MasterVerdict`) — Master Reviewer → approval loop

```jsonc
{
  "gate": "approve" | "refine",
  "scores": {
    "story": 0, "correctnessPassedByReviewer": true, "readability": 0,
    "deepDiveScale": 0, "interactiveReady": 0, "humanity": 0
  },
  "refinements": ["top things to fix, in priority order"],
  "notes": []
}
```

`gate: "approve"` means the lesson may ship. `refinements` may still list
nice-to-haves the reader can address without blocking.

## 5. Animation notes (`AnimationNotes`) — Animator → Writer

```jsonc
{
  "interactives": ["Where a learner could change a variable and see the effect."],
  "animations": ["What motion/change would teach the concept."],
  "figures": ["What visual would help."],
  "tryThisHooks": ["real-world activities tying to a simulation/observable demo."]
}
```

## Lifecycle

`ResearchDossier` → (Writer) → `NarrativeContent` draft → (Content Reviewer)
→ `ReviewFindings` → refine → (Master Reviewer) → `MasterVerdict` → approved
→ (Animator, advisory) → `AnimationNotes` → optional enrichment → integration
into `narratives-batchNN.ts`.