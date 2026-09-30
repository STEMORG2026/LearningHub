import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  playSparkSound,
  playCollisionSound,
  playExplosionSound,
  playMotionHum,
} from '../src/synth';
import { AudioEngine } from '../src/engine';

// ── Mock Web Audio API ──────────────────────────────────────────
function createMockAudioContext(): AudioContext {
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

  const mockFilter = {
    type: 'lowpass' as BiquadFilterType,
    frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn().mockReturnValue(undefined),
  } as unknown as BiquadFilterNode;

  const mockBufferSource = {
    buffer: null,
    connect: vi.fn().mockReturnValue(undefined),
    start: vi.fn(),
    stop: vi.fn(),
  } as unknown as AudioBufferSourceNode;

  const mockBuffer = {
    getChannelData: vi.fn().mockReturnValue(new Float32Array(100)),
  } as unknown as AudioBuffer;

  return {
    currentTime: 100,
    sampleRate: 44100,
    destination: {} as AudioDestinationNode,
    createOscillator: vi.fn().mockReturnValue(mockOsc),
    createGain: vi.fn().mockReturnValue(mockGain),
    createBiquadFilter: vi.fn().mockReturnValue(mockFilter),
    createBufferSource: vi.fn().mockReturnValue(mockBufferSource),
    createBuffer: vi.fn().mockReturnValue(mockBuffer),
    resume: vi.fn(),
    close: vi.fn(),
    state: 'running',
  } as unknown as AudioContext;
}

// ── Tests ───────────────────────────────────────────────────────
describe('playSparkSound', () => {
  let ctx: AudioContext;

  beforeEach(() => {
    ctx = createMockAudioContext();
  });

  it('creates a sawtooth oscillator at 1400→280Hz for 0.12s', () => {
    const result = playSparkSound(ctx, 1.0);

    expect(result.name).toBe('spark');
    expect(result.duration).toBe(0.12);
    expect(result.oscillators).toHaveLength(1);
    expect(result.gainNodes).toHaveLength(1);

    const osc = ctx.createOscillator as ReturnType<typeof vi.fn>;
    expect(osc).toHaveBeenCalledTimes(1);

    const mockOsc = osc.mock.results[0]?.value as unknown as {
      type: string;
      frequency: { setValueAtTime: ReturnType<typeof vi.fn>; exponentialRampToValueAtTime: ReturnType<typeof vi.fn> };
    };
    expect(mockOsc.type).toBe('sawtooth');
    expect(mockOsc.frequency.setValueAtTime).toHaveBeenCalledWith(1400, 100);
    expect(mockOsc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(280, 100.12);
  });

  it('scales gain by volume parameter', () => {
    playSparkSound(ctx, 0.5);

    const gain = ctx.createGain as ReturnType<typeof vi.fn>;
    const mockGain = gain.mock.results[0]?.value as unknown as {
      gain: { setValueAtTime: ReturnType<typeof vi.fn> };
    };
    expect(mockGain.gain.setValueAtTime).toHaveBeenCalledWith(0.09, expect.any(Number));
  });
});

describe('playCollisionSound', () => {
  let ctx: AudioContext;

  beforeEach(() => {
    ctx = createMockAudioContext();
  });

  it('creates sine oscillator for normal collision', () => {
    const result = playCollisionSound(ctx, false, 1.0);

    expect(result.name).toBe('collision');
    expect(result.duration).toBe(0.18);
    expect(result.oscillators).toHaveLength(1);

    const osc = ctx.createOscillator as ReturnType<typeof vi.fn>;
    const mockOsc = osc.mock.results[0]?.value as unknown as {
      type: string;
      frequency: { setValueAtTime: ReturnType<typeof vi.fn>; exponentialRampToValueAtTime: ReturnType<typeof vi.fn> };
    };
    expect(mockOsc.type).toBe('sine');
    expect(mockOsc.frequency.setValueAtTime).toHaveBeenCalledWith(280, 100);
    expect(mockOsc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(80, 100.18);
  });

  it('creates triangle oscillator for giant collision with longer duration', () => {
    const result = playCollisionSound(ctx, true, 1.0);

    expect(result.duration).toBe(0.45);

    const osc = ctx.createOscillator as ReturnType<typeof vi.fn>;
    const mockOsc = osc.mock.results[0]?.value as unknown as {
      type: string;
      frequency: { setValueAtTime: ReturnType<typeof vi.fn> };
    };
    expect(mockOsc.type).toBe('triangle');
    expect(mockOsc.frequency.setValueAtTime).toHaveBeenCalledWith(160, 100);
  });
});

describe('playExplosionSound', () => {
  let ctx: AudioContext;

  beforeEach(() => {
    ctx = createMockAudioContext();
  });

  it('creates sine oscillator for sub-bass and noise buffer for blast', () => {
    const result = playExplosionSound(ctx, 1.0);

    expect(result.name).toBe('explosion');
    expect(result.oscillators).toHaveLength(1);
    expect(result.gainNodes).toHaveLength(2);
    expect(result.filterNodes).toHaveLength(1);
    expect(result.bufferSource).toBeDefined();
  });

  it('configures sub-bass oscillator correctly', () => {
    playExplosionSound(ctx, 1.0);

    const osc = ctx.createOscillator as ReturnType<typeof vi.fn>;
    const mockOsc = osc.mock.results[0]?.value as unknown as {
      type: string;
      frequency: { setValueAtTime: ReturnType<typeof vi.fn>; exponentialRampToValueAtTime: ReturnType<typeof vi.fn> };
    };
    expect(mockOsc.type).toBe('sine');
    expect(mockOsc.frequency.setValueAtTime).toHaveBeenCalledWith(140, 100);
    expect(mockOsc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(18, 101.6);
  });

  it('configures lowpass filter for noise blast', () => {
    playExplosionSound(ctx, 1.0);

    const filter = ctx.createBiquadFilter as ReturnType<typeof vi.fn>;
    expect(filter).toHaveBeenCalledTimes(1);

    const mockFilter = filter.mock.results[0]?.value as unknown as {
      type: string;
      frequency: { setValueAtTime: ReturnType<typeof vi.fn>; exponentialRampToValueAtTime: ReturnType<typeof vi.fn> };
    };
    expect(mockFilter.type).toBe('lowpass');
    expect(mockFilter.frequency.setValueAtTime).toHaveBeenCalledWith(800, 100);
    expect(mockFilter.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(50, 101.2);
  });
});

describe('playMotionHum', () => {
  let ctx: AudioContext;

  beforeEach(() => {
    ctx = createMockAudioContext();
  });

  it('creates sine oscillator at 75→45Hz for 0.35s', () => {
    const result = playMotionHum(ctx, 1.0);

    expect(result.name).toBe('motion-hum');
    expect(result.duration).toBe(0.35);

    const osc = ctx.createOscillator as ReturnType<typeof vi.fn>;
    const mockOsc = osc.mock.results[0]?.value as unknown as {
      type: string;
      frequency: { setValueAtTime: ReturnType<typeof vi.fn> };
    };
    expect(mockOsc.type).toBe('sine');
    expect(mockOsc.frequency.setValueAtTime).toHaveBeenCalledWith(75, 100);
  });
});

describe('AudioEngine', () => {
  let ctx: AudioContext;

  beforeEach(() => {
    ctx = createMockAudioContext();
  });

  it('returns null when muted', () => {
    const engine = new AudioEngine();
    engine.setMuted(true);
    vi.spyOn(engine as unknown as { getContext: () => AudioContext }, 'getContext' as never).mockReturnValue(ctx);

    const result = engine.play('spark');
    expect(result).toBeNull();
  });

  it('plays sound when not muted', () => {
    const engine = new AudioEngine();
    engine.setMuted(false);
    vi.spyOn(engine as unknown as { getContext: () => AudioContext }, 'getContext' as never).mockReturnValue(ctx);

    const result = engine.play('spark');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('spark');
  });

  it('uses overridden volume when provided', () => {
    const engine = new AudioEngine();
    engine.setMuted(false);
    engine.setVolume(1.0);
    vi.spyOn(engine as unknown as { getContext: () => AudioContext }, 'getContext' as never).mockReturnValue(ctx);

    const result = engine.play('spark', { volume: 0.3 });
    expect(result!.volume).toBe(0.3);
  });

  it('passes isGiant override to collision sound', () => {
    const engine = new AudioEngine();
    engine.setMuted(false);
    vi.spyOn(engine as unknown as { getContext: () => AudioContext }, 'getContext' as never).mockReturnValue(ctx);

    const result = engine.play('collision', { isGiant: true });
    expect(result!.name).toBe('collision');
    expect(result!.duration).toBe(0.45);
  });

  it('setVolume/getVolume roundtrip', () => {
    const engine = new AudioEngine();
    engine.setVolume(0.5);
    expect(engine.currentVolume).toBe(0.5);
  });

  it('setMuted/isMuted roundtrip', () => {
    const engine = new AudioEngine();
    expect(engine.isMuted).toBe(true);
    engine.setMuted(false);
    expect(engine.isMuted).toBe(false);
  });

  it('routes explosion through play()', () => {
    const engine = new AudioEngine();
    engine.setMuted(false);
    vi.spyOn(engine as unknown as { getContext: () => AudioContext }, 'getContext' as never).mockReturnValue(ctx);

    const result = engine.play('explosion');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('explosion');
  });

  it('routes motion-hum through play()', () => {
    const engine = new AudioEngine();
    engine.setMuted(false);
    vi.spyOn(engine as unknown as { getContext: () => AudioContext }, 'getContext' as never).mockReturnValue(ctx);

    const result = engine.play('motion-hum');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('motion-hum');
  });

  it('falls back to engine volume when no override is supplied', () => {
    const engine = new AudioEngine();
    engine.setMuted(false);
    engine.setVolume(0.25);
    vi.spyOn(engine as unknown as { getContext: () => AudioContext }, 'getContext' as never).mockReturnValue(ctx);

    const result = engine.play('motion-hum');
    expect(result!.volume).toBe(0.25);
  });

  it('defaults collision isGiant to false when not overridden', () => {
    const engine = new AudioEngine();
    engine.setMuted(false);
    vi.spyOn(engine as unknown as { getContext: () => AudioContext }, 'getContext' as never).mockReturnValue(ctx);

    const result = engine.play('collision');
    expect(result!.duration).toBe(0.18);
  });

  it('destroy() is a no-op when no context was ever created', () => {
    const engine = new AudioEngine();
    expect(() => engine.destroy()).not.toThrow();
  });
});
