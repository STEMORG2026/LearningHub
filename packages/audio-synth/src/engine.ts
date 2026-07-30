import { playSparkSound, playCollisionSound, playExplosionSound, playMotionHum } from './synth';
import type { SoundName, SoundResult } from './types';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private muted = true;
  private volume = 1.0;

  get isMuted(): boolean {
    return this.muted;
  }

  setMuted(val: boolean): void {
    this.muted = val;
  }

  get currentVolume(): number {
    return this.volume;
  }

  setVolume(val: number): void {
    this.volume = val;
  }

  getContext(): AudioContext {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext | undefined;
      if (AC) {
        this.ctx = new (AC as typeof AudioContext)();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx!;
  }

  play(name: SoundName, overrides?: { isGiant?: boolean; volume?: number }): SoundResult | null {
    if (this.muted) return null;

    const ctx = this.getContext();
    if (!ctx) return null;

    const vol = (overrides?.volume ?? this.volume);

    switch (name) {
      case 'spark':
        return playSparkSound(ctx, vol);
      case 'collision':
        return playCollisionSound(ctx, overrides?.isGiant ?? false, vol);
      case 'explosion':
        return playExplosionSound(ctx, vol);
      case 'motion-hum':
        return playMotionHum(ctx, vol);
    }
  }

  destroy(): void {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
