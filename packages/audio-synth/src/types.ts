export interface SoundResult {
  name: string;
  duration: number;
  volume: number;
  oscillators: OscillatorNode[];
  gainNodes: GainNode[];
  filterNodes?: BiquadFilterNode[];
  bufferSource?: AudioBufferSourceNode;
}

export type SoundName = 'spark' | 'collision' | 'explosion' | 'motion-hum';
