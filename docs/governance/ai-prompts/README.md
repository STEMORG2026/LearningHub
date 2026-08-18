# AI Prompts

**Version:** 3.0.0
**Status:** Active
**Owner:** Architecture
**Applies To:** AI-assisted development sessions
**Related:** `CONSTITUTION.md`, `AGENTS.md`

## Purpose

Preserves significant AI prompts that created architectural or governance
artifacts, so future maintainers can understand what the AI was instructed to do,
why a design emerged, and which constraints existed (constitution §32).

Trivial coding prompts are **not** preserved.

## How to Record

1. Name the file with a short kebab-case slug describing the decision, e.g.
   `adopt-constitution.md`.
2. Include: the prompt text, the date, the decision that resulted, and the
   resulting files/ADRs.

## Preserved Prompts

| Date | Prompt | Result |
|------|--------|--------|
| 2026-08-11 | Adopt the STEM Ecosystem governing spec as `docs/CONSTITUTION.md`, create governance stubs, register docs, add ADR-011 | `docs/CONSTITUTION.md`, `docs/governance/`, `docs/adr/011-constitution-adoption.md` |
