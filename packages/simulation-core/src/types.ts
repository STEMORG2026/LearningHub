export const BODY_TYPES = [
  'big_sun',
  'giant_planet',
  'super_blackhole',
  'rocket',
  'satellite',
  'circuit',
  'math_symbol',
] as const;

export type BodyType = typeof BODY_TYPES[number];

export interface MoonConfig {
  name: string;
  dist: number;
  speed: number;
  size: number;
  color?: string;
  icon?: string;
}

export interface PlanetConfig {
  name: string;
  radius: number;
  color: string;
  glow: string;
  hasRings?: boolean;
  moons: MoonConfig[];
}

export interface CelestialBody {
  id: string;
  name: string;
  type: BodyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  charge: number;
  rotation: number;
  vRot: number;
  isExploded: boolean;
  text?: string;
}

export interface MoonBody {
  id: string;
  parentId: string;
  name: string;
  dist: number;
  speed: number;
  size: number;
  color: string;
  icon?: string;
  angle: number;
}

export interface PhysicsInput {
  bodies: CelestialBody[];
  width: number;
  height: number;
  mouseX: number;
  mouseY: number;
  mouseRadius: number;
  timeScale: number;
  halfIntensity: boolean;
  blackholeDisabled: boolean;
  cosmicViewActive: boolean;
  blackholeExplodeRadius?: number;
}

export interface CollisionEvent {
  bodyAId: string;
  bodyBId: string;
  isGiant: boolean;
}

export interface DevourEvent {
  blackholeId: string;
  devouredId: string;
}

export interface PhysicsResult {
  bodies: CelestialBody[];
  collisions: CollisionEvent[];
  devours: DevourEvent[];
  blackholeRadiusDelta: number;
  blackholeExploded: boolean;
}

export const DEFAULT_MOUSE_RADIUS = 180;
export const BOUNCE_DAMPING = 0.85;
export const MOUSE_FORCE_COEFFICIENT = 0.45;
export const COULOMB_CONSTANT = 18;
export const INTERACTION_MIN_DIST = 10;
export const INTERACTION_MAX_DIST = 320;
export const BLACKHOLE_MAX_RADIUS_RATIO = 0.7;
export const BLACKHOLE_RESET_DELAY_MS = 60000;
export const COLLISION_SOUND_CHANCE = 0.25;
export const LIGHTNING_DRAW_DIST = 125;
export const BLACKHOLE_PULL_DIST = 420;
export const BLACKHOLE_PULL_CAP = 4.0;
export const SMALL_ITEM_COUNT = 16;
