// @vitest-environment jsdom
/**
 * Coverage for AudioEngine.getContext() / destroy().
 *
 * These live in their own file because the package's default environment is
 * `node` (see vitest.config.ts) and there is no `window` there — the audio
 * context is only constructible under a DOM environment. The main suite pins
 * `getContext` via spyOn, which is what left the construction path uncovered.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AudioEngine } from '../src/engine';

function createMockAudioContext(state: AudioContextState = 'running'): AudioContext {
  const mockOsc = {
    type: 'sine' as OscillatorType,
    frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn().mockReturnValue(undefined),
    start: vi.fn(),
    stop: vi.fn(),
  } as unknown as OscillatorNode;

  const mockGain = {
    gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn().mockReturnValue(undefined),
  } as unknown as GainNode;

  return {
    currentTime: 100,
    sampleRate: 44100,
    destination: {} as AudioDestinationNode,
    createOscillator: vi.fn().mockReturnValue(mockOsc),
    createGain: vi.fn().mockReturnValue(mockGain),
    resume: vi.fn(),
    close: vi.fn(),
    state,
  } as unknown as AudioContext;
}

/**
 * Build a constructor mock. `vi.fn()` implementations must be a `function` or
 * `class` for `new` to return the value under vitest 4 (arrow implementations
 * throw "did not use 'function' or 'class'").
 */
function mockCtor(instance: AudioContext): { ctor: typeof AudioContext; calls: () => number } {
  let count = 0;
  const ctor = function MockAudioContext(this: unknown) {
    count += 1;
    return instance;
  } as unknown as typeof AudioContext;
  return { ctor, calls: () => count };
}

describe('AudioEngine.getContext', () => {
  let ctx: AudioContext;
  const win = window as unknown as Record<string, unknown>;
  let originalAudioContext: unknown;

  beforeEach(() => {
    ctx = createMockAudioContext();
    originalAudioContext = win.AudioContext;
  });

  afterEach(() => {
    win.AudioContext = originalAudioContext;
    delete win.webkitAudioContext;
    vi.restoreAllMocks();
  });

  it('constructs a context lazily and reuses the same instance', () => {
    const { ctor, calls } = mockCtor(ctx);
    win.AudioContext = ctor;

    const engine = new AudioEngine();
    const first = engine.getContext();
    const second = engine.getContext();

    expect(calls()).toBe(1);
    expect(first).toBe(second);
  });

  it('resumes a suspended context', () => {
    const suspended = createMockAudioContext('suspended');
    win.AudioContext = mockCtor(suspended).ctor;

    const engine = new AudioEngine();
    engine.getContext();

    expect(suspended.resume).toHaveBeenCalledTimes(1);
  });

  it('does not resume an already-running context', () => {
    win.AudioContext = mockCtor(ctx).ctor;

    const engine = new AudioEngine();
    engine.getContext();

    expect(ctx.resume).not.toHaveBeenCalled();
  });

  it('falls back to webkitAudioContext when AudioContext is absent', () => {
    win.AudioContext = undefined;
    let count = 0;
    const webkit = function MockWebkitAudioContext(this: unknown) {
      count += 1;
      return ctx;
    };
    win.webkitAudioContext = webkit;

    const engine = new AudioEngine();
    const result = engine.getContext();

    expect(result).toBe(ctx);
    expect(count).toBe(1);
  });

  it('destroy() closes the context and allows re-construction', () => {
    const first = createMockAudioContext();
    const second = createMockAudioContext();
    let count = 0;
    const ctor = function MockAudioContext(this: unknown) {
      count += 1;
      return count === 1 ? first : second;
    } as unknown as typeof AudioContext;
    win.AudioContext = ctor;

    const engine = new AudioEngine();
    engine.getContext();
    engine.destroy();

    expect(first.close).toHaveBeenCalledTimes(1);

    engine.getContext();
    expect(count).toBe(2);
  });

  it('destroy() twice is safe', () => {
    win.AudioContext = mockCtor(ctx).ctor;

    const engine = new AudioEngine();
    engine.getContext();
    engine.destroy();

    expect(() => engine.destroy()).not.toThrow();
  });
});
