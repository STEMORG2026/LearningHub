import type { PlanetConfig } from './types';

export const SUN_RADIUS = 75;
export const SUN_MASS_FACTOR = 1.5;
export const SUN_INITIAL_SPEED = 0.12;
export const SUN_VROT = 0.002;
export const SUN_POSITION_X_FRACTION = 0.5;
export const SUN_POSITION_Y_FRACTION = 0.45;

export const PLANET_ORBIT_START_RADIUS = 135;
export const PLANET_ORBIT_STEP = 42;
export const PLANET_SPEED_BASE = 0.18;
export const PLANET_SPEED_RANDOM = 0.15;

// Tuned so that G * M_sun equals ORBIT_ANGULAR_BASE^2 * (Mercury orbit radius)^3
// (see apps/shell/src/lib/cosmic-background.ts) — keeps every planet on a stable
// circular orbit at its Kepler-scaled angular speed.
export const SUN_GRAVITY_CONSTANT = 0.0014452;

export const BLACKHOLE_RADIUS = 40;
export const BLACKHOLE_MASS = 14000;
export const BLACKHOLE_VROT = 0.02;
export const BLACKHOLE_POSITION_X_FRACTION = 0.22;
export const BLACKHOLE_POSITION_Y_FRACTION = 0.3;
export const BLACKHOLE_INITIAL_VX = 0.08;
export const BLACKHOLE_INITIAL_VY = -0.05;

export const SMALL_ITEM_RADIUS_MIN = 12;
export const SMALL_ITEM_RADIUS_RANGE = 8;
export const SMALL_ITEM_SPEED = 0.8;
export const SMALL_ITEM_MASS_FACTOR = 0.5;
export const SMALL_ITEM_VROT_RANGE = 0.03;

export const MATH_SYMBOLS = [
  'E=mc²', '∫f(x)dx', 'π', '√x', 'H₂O', 'CO₂', 'F=ma',
  'λ', 'Ω', '0101', 'sin(θ)', 'Δx', '∞', '∇×B', 'pH', 'C₆H₁₂O₆',
  'a=dv/dt', '∑xᵢ', 'd/dx', 'eⁱᵖ+1=0', 'Au', '⚡',
];

export const PLANET_CONFIGS: PlanetConfig[] = [
  {
    name: 'Mercury', radius: 16, color: '#a8a8a8', glow: 'rgba(168, 168, 168, 0.7)',
    moons: [{ name: 'Mariner', dist: 1.7, speed: 0.035, size: 2.2, icon: '🛰️' }],
  },
  {
    name: 'Venus', radius: 22, color: '#e6c280', glow: 'rgba(230, 194, 128, 0.75)',
    moons: [{ name: 'Akatsuki', dist: 1.7, speed: 0.03, size: 2.2, icon: '🛰️' }],
  },
  {
    name: 'Earth', radius: 26, color: '#2b82c5', glow: 'rgba(43, 130, 197, 0.8)',
    moons: [
      { name: 'Moon', dist: 2.0, speed: 0.025, size: 4.5, color: '#e0e0e0' },
      { name: 'ISS', dist: 1.5, speed: 0.045, size: 2.2, icon: '🛰️' },
    ],
  },
  {
    name: 'Mars', radius: 20, color: '#c85232', glow: 'rgba(200, 82, 50, 0.8)',
    moons: [
      { name: 'Phobos', dist: 1.7, speed: 0.038, size: 3.0, color: '#a08070' },
      { name: 'Deimos', dist: 2.4, speed: 0.022, size: 2.5, color: '#807060' },
    ],
  },
  {
    name: 'Jupiter', radius: 48, color: '#d9a05b', glow: 'rgba(217, 160, 91, 0.85)',
    moons: [
      { name: 'Io', dist: 1.7, speed: 0.032, size: 4.0, color: '#ffff80' },
      { name: 'Europa', dist: 2.2, speed: 0.025, size: 3.5, color: '#e6f2ff' },
      { name: 'Ganymede', dist: 2.7, speed: 0.019, size: 5.0, color: '#c2b280' },
      { name: 'Callisto', dist: 3.2, speed: 0.014, size: 4.2, color: '#808080' },
    ],
  },
  {
    name: 'Saturn', radius: 42, color: '#e8cd8c', glow: 'rgba(232, 205, 140, 0.85)',
    hasRings: true,
    moons: [
      { name: 'Titan', dist: 2.1, speed: 0.022, size: 4.8, color: '#ffb366' },
      { name: 'Enceladus', dist: 1.6, speed: 0.035, size: 3.2, color: '#ffffff' },
      { name: 'Mimas', dist: 1.3, speed: 0.042, size: 2.8, color: '#b3b3b3' },
    ],
  },
  {
    name: 'Uranus', radius: 32, color: '#5cc8d4', glow: 'rgba(92, 200, 212, 0.85)',
    hasRings: true,
    moons: [
      { name: 'Titania', dist: 1.9, speed: 0.026, size: 3.8, color: '#d9f2f5' },
      { name: 'Oberon', dist: 2.5, speed: 0.018, size: 3.6, color: '#b3d9e0' },
    ],
  },
  {
    name: 'Neptune', radius: 30, color: '#2649cf', glow: 'rgba(38, 73, 207, 0.85)',
    moons: [
      { name: 'Triton', dist: 2.0, speed: -0.022, size: 4.0, color: '#cce6ff' },
      { name: 'Nereid', dist: 2.7, speed: 0.014, size: 2.8, color: '#9999b3' },
    ],
  },
];
