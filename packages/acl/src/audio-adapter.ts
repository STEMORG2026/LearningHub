import { AudioEngine } from '@stem-tuition/audio-synth';

/**
 * Legacy Audio Adapter — bridges the v1.0.0 global-variable audio system
 * to the new AudioEngine from @stem-tuition/audio-synth.
 *
 * The legacy code uses module-level variables:
 *   - isAudioMuted (global), isHalfIntensity (global)
 *   - getAudioContext() (global IIFE-scoped)
 *
 * This adapter wraps those globals and delegates to the modern engine.
 * In Phase 3, this will also publish audio:play-sound events via the Event Bus.
 */

let engine: AudioEngine | null = null;

function getEngine(): AudioEngine {
  if (!engine) {
    engine = new AudioEngine();
  }
  return engine;
}

export function syncMutedState(): void {
  const muted = (window as unknown as Record<string, unknown>).isAudioMuted as boolean | undefined;
  if (muted !== undefined) {
    getEngine().setMuted(muted);
  }
}

export function syncIntensityState(): void {
  const halfIntensity = (window as unknown as Record<string, unknown>).isHalfIntensity as boolean | undefined;
  getEngine().setVolume(halfIntensity ? 0.5 : 1.0);
}

export function syncAllStates(): void {
  syncMutedState();
  syncIntensityState();
}

export function playSpark(): void {
  syncAllStates();
  getEngine().play('spark');
}

export function playCollision(isGiant: boolean): void {
  syncAllStates();
  getEngine().play('collision', { isGiant });
}

export function playExplosion(): void {
  syncAllStates();
  getEngine().play('explosion');
}

export function playMotionHum(): void {
  syncAllStates();
  getEngine().play('motion-hum');
}

export function getAudioContext(): AudioContext | null {
  try {
    return getEngine().getContext();
  } catch {
    return null;
  }
}

export { AudioEngine };
