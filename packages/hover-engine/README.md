# @learninghub/hover-engine

## Purpose

Hover animation state machine: style selection and a cooldown protocol that prevents hover-spam on interactive cards.

## Public API

- `HOVER_STYLES`, `COOLDOWN_MAX`
- `initCooldownState()`, `pickHoverStyle()`, `updateCooldown()`, `isStyleInCooldown()`
- Types: `HoverStyle`, `CooldownState`

## Inputs

- `pickHoverStyle(state, ...)` — current cooldown state + preference inputs

## Outputs

- A chosen `HoverStyle` + updated `CooldownState`

## Public Contracts

- Contract classes: `interface`

## Dependencies

- `@learninghub/core`, `@learninghub/tracer`

## Extension Points

- Add a hover style by extending `HOVER_STYLES` (styling lives in `src/styles.css`, tokens in `--hover-*`)

## Examples

```ts
import { initCooldownState, pickHoverStyle } from '@learninghub/hover-engine';

let state = initCooldownState();
const style = pickHoverStyle(state);
state = updateCooldown(state, style);
```
