# @stem-tuition/acl

## Purpose

Anti-Corruption Layer: adapters that bridge legacy globals (`legacy/js/*`) to typed, modern modules. Direct imports from `legacy/` are forbidden — everything goes through these adapters (see `docs/ARCHITECTURE/README.md` → Rule 1, `docs/adr/003`).

## Public API

- Audio: `playSpark`, `playCollision`, `playExplosion`, `playMotionHum`, `syncMutedState`, `syncIntensityState`, `syncAllStates`, `getAudioContext`, `AudioEngine`
- Quiz: `getQuizState`, `getSubjectQuestions`, `getAvailableSubjects`, `setQuizSubject`, `publishQuizStarted`, `publishQuizAnswerSubmitted`, `publishQuizCompleted`
- Canvas: `isCanvasActive`, `isBackgroundDisabled`, `getCanvasDimensions`, `getSimulationState`, `clickControlButton`, `enableBackground`, `disableBackground`

## Inputs

- Typed arguments (e.g., `setQuizSubject(subject: SubjectKey)`); adapters read/write legacy globals internally

## Outputs

- Typed results; events published on the Event Bus (e.g., `quiz:started`)

## Public Contracts

- Contract classes: `adapter`, `event`

## Dependencies

- `@stem-tuition/audio-synth`, `@stem-tuition/core`, `@stem-tuition/tracer`

## Extension Points

- Wrap a new legacy global by adding an adapter file here (e.g., `pioneers-adapter.ts`) and exporting it from `src/index.ts`

## Examples

```ts
import { getQuizState } from '@stem-tuition/acl';

const state = getQuizState(); // typed view over legacy quiz global
```
