import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioEngine } from '../src/engine';
import { playSound, synthesizeSpark, synthesizeCollision, synthesizeExplosion, synthesizeMotionHum } from '../src/synth';
import type { SoundName, SoundResult } from '../src/types';

// E2E integration tests for audio playback
describe('Audio Engine E2E Flow', () => {
  let audioEngine: AudioEngine;

  beforeEach(() => {
    // Create fresh audio engine for each test
    audioEngine = new AudioEngine();
  });

  afterEach(() => {
    // Clean up audio context
    audioEngine.destroy();
    vi.clearAllMocks();
  });

  it('should initialize audio engine and create context', () => {
    expect(audioEngine).toBeDefined();
    expect(audioEngine.getVolume()).toBe(1.0);
    expect(audioEngine.isMuted()).toBe(false);
  });

  it('should synthesize spark sound correctly', async () => {
    const result = await synthesizeSpark(audioEngine.getContext());
    expect(result).toBeDefined();
    expect(result.buffer).toBeInstanceOf(AudioBuffer);
    expect(result.duration).toBeGreaterThan(0);
  });

  it('should synthesize collision sound correctly', async () => {
    const result = await synthesizeCollision(audioEngine.getContext());
    expect(result).toBeDefined();
    expect(result.buffer).toBeInstanceOf(AudioBuffer);
    expect(result.duration).toBeGreaterThan(0);
  });

  it('should synthesize explosion sound correctly', async () => {
    const result = await synthesizeExplosion(audioEngine.getContext());
    expect(result).toBeDefined();
    expect(result.buffer).toBeInstanceOf(AudioBuffer);
    expect(result.duration).toBeGreaterThan(0);
  });

  it('should synthesize motion hum sound correctly', async () => {
    const result = await synthesizeMotionHum(audioEngine.getContext());
    expect(result).toBeDefined();
    expect(result.buffer).toBeInstanceOf(AudioBuffer);
    expect(result.duration).toBeGreaterThan(0);
  });

  it('should play all sound types through engine', async () => {
    const sounds: SoundName[] = ['spark', 'collision', 'explosion', 'motion-hum'];
    
    for (const sound of sounds) {
      const result = await audioEngine.playSound(sound);
      expect(result.success).toBe(true);
      expect(result.sound).toBe(sound);
    }
  });

  it('should handle volume control', async () => {
    audioEngine.setVolume(0.5);
    expect(audioEngine.getVolume()).toBe(0.5);
    
    const result = await audioEngine.playSound('spark');
    expect(result.success).toBe(true);
    
    audioEngine.setVolume(1.0);
    expect(audioEngine.getVolume()).toBe(1.0);
  });

  it('should handle mute/unmute', async () => {
    audioEngine.setMuted(true);
    expect(audioEngine.isMuted()).toBe(true);
    
    const result = await audioEngine.playSound('spark');
    // Even when muted, the sound should be queued successfully
    expect(result.success).toBe(true);
    
    audioEngine.setMuted(false);
    expect(audioEngine.isMuted()).toBe(false);
  });

  it('should handle rapid successive plays', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(audioEngine.playSound('spark'));
    }
    
    const results = await Promise.all(promises);
    results.forEach(result => {
      expect(result.success).toBe(true);
    });
  });

  it('should synthesize all sound types with correct parameters', async () => {
    const context = audioEngine.getContext();
    
    const spark = await synthesizeSpark(context);
    expect(spark.buffer.length).toBeGreaterThan(0);
    expect(spark.buffer.numberOfChannels).toBe(2);
    
    const collision = await synthesizeCollision(context);
    expect(collision.buffer.length).toBeGreaterThan(0);
    
    const explosion = await synthesizeExplosion(context);
    expect(explosion.buffer.length).toBeGreaterThan(0);
    
    const motionHum = await synthesizeMotionHum(context);
    expect(motionHum.buffer.length).toBeGreaterThan(0);
  });

  it('should clean up audio context on destroy', () => {
    const engine = new AudioEngine();
    engine.destroy();
    // After destroy, context should be closed
    expect(engine.getContext().state).toBe('closed');
  });
});