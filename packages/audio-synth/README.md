# @learninghub/audio-synth

## Purpose

Procedural Web Audio sound synthesizer. Four pure synthesis functions plus an `AudioEngine` with mute/volume/context management.

## Public API

- `AudioEngine` — audio context lifecycle, mute/volume, `play(name)`
- `playSparkSound()`, `playCollisionSound()`, `playExplosionSound()`, `playMotionHum()` — pure synthesis functions
- Types: `SoundResult`, `SoundName`

## Inputs

- `AudioEngine.play(name: SoundName, options?)`
- Each `play*Sound()` accepts oscillator/context parameters

## Outputs

- `SoundResult` describing the scheduled/played sound

## Public Contracts

- Contract classes: `api`, `schema`

## Dependencies

- `@learninghub/core`, `@learninghub/tracer`

## Extension Points

- Add a new `SoundName` + matching `play*Sound()` function; register it in `src/types.ts`
- `AudioEngine` is the facade — swap the underlying synthesis strategy without changing consumers

## Examples

```ts
import { AudioEngine } from '@learninghub/audio-synth';

const engine = new AudioEngine();
engine.play('spark');
```
