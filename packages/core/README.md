# @stem-tuition/core

## Purpose

Event Bus, shared types, and foundational utilities. Every cross-module message in the workspace flows through the Event Bus (`domain:action` events, see `docs/policies/EVENT_BUS_CONTRACT.md`).

## Public API

- `EventBus` — publish/subscribe/unsubscribe with `*` and `domain:*` wildcards
- `getDefaultEventBus()` — process-wide singleton (module-level guard)
- `initEventBus()` — idempotent setup hook
- Types: `EventPayload`, `EventHandler`, `SubscriptionEntry`, `QuizStartedData`, `QuizAnswerSubmittedData`, `QuizCompletedData`, `AudioPlaySoundData`, `ErrorData`

## Inputs

- `EventBus.publish(event: string, payload?: EventPayload)`
- `EventBus.subscribe(event, handler)`

## Outputs

- `SubscriptionEntry` (unsubscribe handle); events broadcast to all subscribers (incl. other tabs via BroadcastChannel)

## Public Contracts

- Contract classes: `api`, `interface`, `schema` (see `docs/policies/API_CONTRACT.md`)

## Dependencies

- None (foundation package)

## Extension Points

- Register a new event domain by following the `domain:action` naming rule and adding its payload type to `src/types.ts`
- The BroadcastChannel transport can be swapped behind the `EventBus` facade without touching subscribers

## Examples

```ts
import { getDefaultEventBus } from '@stem-tuition/core';

const bus = getDefaultEventBus();
const off = bus.subscribe('quiz:answer-submitted', (payload) => {
  console.log(payload.questionId);
});
bus.publish('quiz:answer-submitted', { questionId: 'q1', answer: 2 });
off();
```
