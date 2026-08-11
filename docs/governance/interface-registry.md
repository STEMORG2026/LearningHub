# Interface Registry

**Version:** 3.0.0
**Status:** Active
**Owner:** Architecture
**Applies To:** All packages and apps
**Related:** `CONSTITUTION.md`, `RULES.md`, `policies/API_CONTRACT.md`, `docs/adr/README.md`

## Purpose

This registry records major architectural interfaces and their freeze state, per
the constitution (§13, §14). A **frozen** interface is a human-approved
architectural contract and cannot be casually modified. A **planned seam** is an
interface documented for future use that is **not** implemented yet.

Freeze/unfreeze changes require: human approval, an ADR, this registry update,
contract-test review, and re-freezing after the change (see
`docs/CONSTITUTION.md` §14).

## Registered Interfaces

| Interface | Status | Owned by | ADR | Notes |
|-----------|--------|----------|-----|-------|
| _(none registered yet)_ | — | — | — | First interface is registered here when a major boundary is proposed |

## Planned Seams

Seams are documented future boundaries — they are **not** implemented until a
milestone explicitly approves them. Do not implement a seam merely because it is
listed here.

| Seam | Intent | Implemented? |
|------|--------|--------------|
| `ContentProvider` | Content access boundary protecting future LearningHubSTEM integration (`CONSTITUTION.md` §11). Local content remains the only current implementation. | No — planned seam only |

## Change Log

| Date | Change | Approval |
|------|--------|----------|
| 2026-08-11 | Registry created (constitution adoption, ADR-011) | Human-approved |
