import type { SoundResult, SoundName } from './types';

function createOscillator(
  ctx: AudioContext,
  type: OscillatorType,
  freqStart: number,
  freqEnd: number,
  gainValue: number,
  duration: number,
  now: number,
): { osc: OscillatorNode; gain: GainNode } {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, now);
  osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);

  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);

  return { osc, gain };
}

export function playSparkSound(ctx: AudioContext, volume: number): SoundResult {
  const now = ctx.currentTime;
  const duration = 0.12;

  const { osc, gain } = createOscillator(ctx, 'sawtooth', 1400, 280, 0.18 * volume, duration, now);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);

  return {
    name: 'spark',
    duration,
    volume,
    oscillators: [osc],
    gainNodes: [gain],
  };
}

export function playCollisionSound(ctx: AudioContext, isGiant: boolean, volume: number): SoundResult {
  const now = ctx.currentTime;
  const duration = isGiant ? 0.45 : 0.18;
  const oscType: OscillatorType = isGiant ? 'triangle' : 'sine';
  const freqStart = isGiant ? 160 : 280;
  const freqEnd = isGiant ? 35 : 80;
  const gainValue = (isGiant ? 0.35 : 0.15) * volume;

  const { osc, gain } = createOscillator(ctx, oscType, freqStart, freqEnd, gainValue, duration, now);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);

  return {
    name: 'collision',
    duration,
    volume,
    oscillators: [osc],
    gainNodes: [gain],
  };
}

export function playExplosionSound(ctx: AudioContext, volume: number): SoundResult {
  const now = ctx.currentTime;

  // Sub-bass boom
  const { osc: osc1, gain: gain1 } = createOscillator(ctx, 'sine', 140, 18, 0.25 * volume, 1.6, now);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 1.6);

  // Noise blast
  const bufferSize = Math.floor(ctx.sampleRate * 1.2);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(50, now + 1.2);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.18 * volume, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 1.2);

  return {
    name: 'explosion',
    duration: 1.6,
    volume,
    oscillators: [osc1],
    gainNodes: [gain1, noiseGain],
    filterNodes: [filter],
    bufferSource: noise,
  };
}

export function playMotionHum(ctx: AudioContext, volume: number): SoundResult {
  const now = ctx.currentTime;
  const duration = 0.35;

  const { osc, gain } = createOscillator(ctx, 'sine', 75, 45, 0.08 * volume, duration, now);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);

  return {
    name: 'motion-hum',
    duration,
    volume,
    oscillators: [osc],
    gainNodes: [gain],
  };
}

export type { SoundName, SoundResult };
