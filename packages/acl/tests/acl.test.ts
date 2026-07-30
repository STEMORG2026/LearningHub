import { describe, it, expect } from 'vitest';
import {
  playSpark,
  playCollision,
  playExplosion,
  playMotionHum,
  syncMutedState,
  syncIntensityState,
  getQuizState,
  getSubjectQuestions,
  getAvailableSubjects,
  isCanvasActive,
  getCanvasDimensions,
  isBackgroundDisabled,
  getSimulationState,
  enableBackground,
  disableBackground,
} from '../src/index';

describe('audio-adapter', () => {
  beforeEach(() => {
    (globalThis as any).isAudioMuted = false;
    (globalThis as any).isHalfIntensity = false;
  });

  it('syncMutedState reads global isAudioMuted', () => {
    (globalThis as any).isAudioMuted = true;
    expect(() => syncMutedState()).not.toThrow();
  });

  it('syncIntensityState reads global isHalfIntensity', () => {
    (globalThis as any).isHalfIntensity = true;
    expect(() => syncIntensityState()).not.toThrow();
  });

  it('playSpark does not throw', () => {
    expect(() => playSpark()).not.toThrow();
  });

  it('playCollision does not throw', () => {
    expect(() => playCollision(false)).not.toThrow();
    expect(() => playCollision(true)).not.toThrow();
  });

  it('playExplosion does not throw', () => {
    expect(() => playExplosion()).not.toThrow();
  });

  it('playMotionHum does not throw', () => {
    expect(() => playMotionHum()).not.toThrow();
  });
});

describe('quiz-adapter', () => {
  it('getQuizState returns null when no legacy quiz app', () => {
    expect(getQuizState()).toBeNull();
  });

  it('getAvailableSubjects returns empty array when no quiz data', () => {
    expect(getAvailableSubjects()).toEqual([]);
  });

  it('getSubjectQuestions returns null when no quiz data', () => {
    expect(getSubjectQuestions('physics')).toBeNull();
  });
});

describe('canvas-adapter', () => {
  it('isCanvasActive returns false when no canvas element', () => {
    expect(isCanvasActive()).toBe(false);
  });

  it('getCanvasDimensions returns null when no canvas element', () => {
    expect(getCanvasDimensions()).toBeNull();
  });

  it('isBackgroundDisabled returns false when no canvas element', () => {
    expect(isBackgroundDisabled()).toBe(false);
  });

  it('getSimulationState returns defaults when no canvas element', () => {
    const state = getSimulationState();
    expect(state.backgroundDisabled).toBe(false);
    expect(state.blackholeDisabled).toBe(true);
  });

  it('enableBackground and disableBackground do not throw when no canvas', () => {
    expect(() => enableBackground()).not.toThrow();
    expect(() => disableBackground()).not.toThrow();
  });
});
