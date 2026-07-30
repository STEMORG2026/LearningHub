import type { CelestialBody, PlanetConfig, BodyType } from './types';
import {
  SUN_RADIUS,
  SUN_MASS_FACTOR,
  SUN_INITIAL_SPEED,
  SUN_VROT,
  SUN_POSITION_X_FRACTION,
  SUN_POSITION_Y_FRACTION,
  PLANET_ORBIT_START_RADIUS,
  PLANET_ORBIT_STEP,
  PLANET_SPEED_BASE,
  PLANET_SPEED_RANDOM,
  BLACKHOLE_RADIUS,
  BLACKHOLE_MASS,
  BLACKHOLE_VROT,
  BLACKHOLE_POSITION_X_FRACTION,
  BLACKHOLE_POSITION_Y_FRACTION,
  BLACKHOLE_INITIAL_VX,
  BLACKHOLE_INITIAL_VY,
  SMALL_ITEM_RADIUS_MIN,
  SMALL_ITEM_RADIUS_RANGE,
  SMALL_ITEM_SPEED,
  SMALL_ITEM_MASS_FACTOR,
  SMALL_ITEM_VROT_RANGE,
} from './config';

let _nextId = 0;

function nextId(prefix: string): string {
  _nextId++;
  return `${prefix}_${_nextId}`;
}

export function resetIdCounter(): void {
  _nextId = 0;
}

export function createSun(width: number, height: number): CelestialBody {
  return {
    id: nextId('primary_sun'),
    name: 'Sun',
    type: 'big_sun',
    x: SUN_POSITION_X_FRACTION * width,
    y: SUN_POSITION_Y_FRACTION * height,
    vx: (Math.random() - 0.5) * SUN_INITIAL_SPEED,
    vy: (Math.random() - 0.5) * SUN_INITIAL_SPEED,
    radius: SUN_RADIUS,
    mass: SUN_RADIUS * SUN_RADIUS * SUN_MASS_FACTOR,
    charge: 1,
    rotation: 0,
    vRot: SUN_VROT,
    isExploded: false,
  };
}

export function createPlanet(
  config: PlanetConfig,
  index: number,
  total: number,
  centerX: number,
  centerY: number,
): CelestialBody {
  const angle = (index / total) * Math.PI * 2;
  const orbitRadius = PLANET_ORBIT_START_RADIUS + index * PLANET_ORBIT_STEP;
  const speed = PLANET_SPEED_BASE + Math.random() * PLANET_SPEED_RANDOM;

  return {
    id: nextId(`planet_${config.name.toLowerCase()}`),
    name: config.name,
    type: 'giant_planet',
    x: centerX + Math.cos(angle) * orbitRadius,
    y: centerY + Math.sin(angle) * orbitRadius,
    vx: -Math.sin(angle) * speed,
    vy: Math.cos(angle) * speed,
    radius: config.radius,
    mass: config.radius * config.radius,
    charge: index % 2 === 0 ? 1 : -1,
    rotation: Math.random() * Math.PI * 2,
    vRot: (Math.random() - 0.5) * 0.012,
    isExploded: false,
  };
}

export function createBlackhole(width: number, height: number): CelestialBody {
  return {
    id: nextId('super_blackhole'),
    name: 'Supermassive Black Hole',
    type: 'super_blackhole',
    x: BLACKHOLE_POSITION_X_FRACTION * width,
    y: BLACKHOLE_POSITION_Y_FRACTION * height,
    vx: BLACKHOLE_INITIAL_VX,
    vy: BLACKHOLE_INITIAL_VY,
    radius: BLACKHOLE_RADIUS,
    mass: BLACKHOLE_MASS,
    charge: -1,
    rotation: 0,
    vRot: BLACKHOLE_VROT,
    isExploded: false,
  };
}

export function createSmallItem(
  bodyType: BodyType,
  text: string,
  width: number,
  height: number,
): CelestialBody {
  const r = SMALL_ITEM_RADIUS_MIN + Math.random() * SMALL_ITEM_RADIUS_RANGE;

  return {
    id: nextId('small_item'),
    name: text || bodyType,
    type: bodyType,
    text,
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * SMALL_ITEM_SPEED,
    vy: (Math.random() - 0.5) * SMALL_ITEM_SPEED,
    radius: r,
    mass: r * r * SMALL_ITEM_MASS_FACTOR,
    charge: Math.random() > 0.5 ? 1 : -1,
    rotation: Math.random() * Math.PI * 2,
    vRot: (Math.random() - 0.5) * SMALL_ITEM_VROT_RANGE,
    isExploded: false,
  };
}
