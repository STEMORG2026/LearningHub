export const HOVER_STYLES = [
  'hover-effect-glow',
  'hover-effect-tint',
  'hover-effect-electric',
  'hover-effect-borderless',
  'hover-effect-warp',
  'hover-effect-plasma',
] as const;

export type HoverStyle = typeof HOVER_STYLES[number];

export const COOLDOWN_MAX = 4;

export interface CooldownState {
  queue: HoverStyle[];
}
