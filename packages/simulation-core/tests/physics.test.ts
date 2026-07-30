import { describe, it, expect } from 'vitest';
import {
  stepPosition,
  applyBoundary,
  applyMouseForce,
  interactPair,
  applyBlackholePull,
  applyBlackholeDevour,
  computeForceMult,
  updatePhysics,
  type InteractPairResult,
  type DevourResult,
} from '../src/physics';
import {
  createSun,
  createPlanet,
  createBlackhole,
  createSmallItem,
  resetIdCounter,
} from '../src/create-body';
import { PLANET_CONFIGS, MATH_SYMBOLS } from '../src/config';
import {
  BODY_TYPES,
  type CelestialBody,
  type PhysicsInput,
} from '../src/types';

function makeBody(overrides: Partial<CelestialBody> = {}): CelestialBody {
  return {
    id: 'test_body',
    name: 'Test',
    type: 'giant_planet',
    x: 500,
    y: 500,
    vx: 0,
    vy: 0,
    radius: 20,
    mass: 400,
    charge: 1,
    rotation: 0,
    vRot: 0.01,
    isExploded: false,
    ...overrides,
  };
}

function defaultInput(overrides: Partial<PhysicsInput> = {}): PhysicsInput {
  return {
    bodies: [],
    width: 1000,
    height: 800,
    mouseX: -1000,
    mouseY: -1000,
    mouseRadius: 180,
    timeScale: 1,
    halfIntensity: false,
    blackholeDisabled: true,
    cosmicViewActive: false,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// stepPosition
// ---------------------------------------------------------------------------
describe('stepPosition', () => {
  it('updates position by velocity * timeScale', () => {
    const b = makeBody({ x: 100, y: 200, vx: 3, vy: -4 });
    const next = stepPosition(b, 1);
    expect(next.x).toBe(103);
    expect(next.y).toBe(196);
  });

  it('scales velocity by timeScale', () => {
    const b = makeBody({ x: 0, y: 0, vx: 2, vy: 3 });
    const next = stepPosition(b, 0.5);
    expect(next.x).toBe(1);
    expect(next.y).toBe(1.5);
  });

  it('updates rotation by vRot * timeScale', () => {
    const b = makeBody({ rotation: 1.0, vRot: 0.5 });
    const next = stepPosition(b, 2);
    expect(next.rotation).toBe(2.0);
  });

  it('returns a new object (immutable)', () => {
    const b = makeBody();
    const next = stepPosition(b, 1);
    expect(next).not.toBe(b);
  });
});

// ---------------------------------------------------------------------------
// applyBoundary
// ---------------------------------------------------------------------------
describe('applyBoundary', () => {
  const W = 1000;
  const H = 800;

  it('bounces off left edge', () => {
    const b = makeBody({ x: 5, y: 500, vx: -10, vy: 0, radius: 20 });
    const next = applyBoundary(b, W, H);
    expect(next.x).toBe(20);
    expect(next.vx).toBeGreaterThan(0);
    expect(next.vx).toBeCloseTo(8.5);
  });

  it('bounces off right edge', () => {
    const b = makeBody({ x: 990, y: 500, vx: 10, vy: 0, radius: 20 });
    const next = applyBoundary(b, W, H);
    expect(next.x).toBe(980);
    expect(next.vx).toBeLessThan(0);
    expect(next.vx).toBeCloseTo(-8.5);
  });

  it('bounces off top edge', () => {
    const b = makeBody({ x: 500, y: 5, vx: 0, vy: -10, radius: 20 });
    const next = applyBoundary(b, W, H);
    expect(next.y).toBe(20);
    expect(next.vy).toBeGreaterThan(0);
  });

  it('bounces off bottom edge', () => {
    const b = makeBody({ x: 500, y: 790, vx: 0, vy: 10, radius: 20 });
    const next = applyBoundary(b, W, H);
    expect(next.y).toBe(780);
    expect(next.vy).toBeLessThan(0);
  });

  it('returns same body when well inside bounds', () => {
    const b = makeBody({ x: 500, y: 400 });
    const next = applyBoundary(b, W, H);
    expect(next.x).toBe(500);
    expect(next.y).toBe(400);
  });

  it('returns a new object', () => {
    const b = makeBody({ x: 500, y: 400 });
    const next = applyBoundary(b, W, H);
    expect(next).not.toBe(b);
  });
});

// ---------------------------------------------------------------------------
// applyMouseForce
// ---------------------------------------------------------------------------
describe('applyMouseForce', () => {
  it('accelerates body toward mouse', () => {
    const b = makeBody({ x: 500, y: 500, vx: 0, vy: 0 });
    const next = applyMouseForce(b, 500, 400, 180, 1.0);
    expect(next.vy).toBeLessThan(0);
    expect(next.vx).toBe(0);
  });

  it('does nothing when mouse is far away', () => {
    const b = makeBody({ x: 500, y: 500, vx: 0, vy: 0 });
    const next = applyMouseForce(b, 500, 50, 180, 1.0);
    expect(next).toBe(b);
  });

  it('does nothing when mouse is too close (<=5)', () => {
    const b = makeBody({ x: 500, y: 500, vx: 0, vy: 0 });
    const next = applyMouseForce(b, 502, 501, 180, 1.0);
    expect(next).toBe(b);
  });

  it('scales force by forceMult', () => {
    const b = makeBody({ x: 500, y: 500, vx: 0, vy: 0 });
    const full = applyMouseForce(b, 500, 400, 180, 1.0);
    const half = applyMouseForce(b, 500, 400, 180, 0.5);
    expect(half.vy).toBeCloseTo(full.vy * 0.5, 10);
  });
});

// ---------------------------------------------------------------------------
// interactPair
// ---------------------------------------------------------------------------
describe('interactPair', () => {
  it('repels bodies with same charge', () => {
    const b1 = makeBody({ id: 'a', x: 400, y: 500, charge: 1 });
    const b2 = makeBody({ id: 'b', x: 600, y: 500, charge: 1 });
    const result = interactPair(b1, b2, 1.0);
    expect(result.b1.vx).toBeGreaterThan(0);
    expect(result.b2.vx).toBeLessThan(0);
  });

  it('attracts bodies with opposite charge', () => {
    const b1 = makeBody({ id: 'a', x: 400, y: 500, charge: 1 });
    const b2 = makeBody({ id: 'b', x: 600, y: 500, charge: -1 });
    const result = interactPair(b1, b2, 1.0);
    expect(result.b1.vx).toBeLessThan(0);
    expect(result.b2.vx).toBeGreaterThan(0);
  });

  it('resolves elastic collision when overlapping', () => {
    const b1 = makeBody({ id: 'a', x: 490, y: 500, vx: 5, vy: 0, radius: 20 });
    const b2 = makeBody({ id: 'b', x: 510, y: 500, vx: -5, vy: 0, radius: 20 });
    const result = interactPair(b1, b2, 1.0);
    expect(result.collision).not.toBeNull();
    expect(result.collision!.bodyAId).toBe('a');
    expect(result.collision!.bodyBId).toBe('b');
    expect(result.b1.x).toBeLessThan(b1.x);
    expect(result.b2.x).toBeGreaterThan(b2.x);
  });

  it('returns null collision when not overlapping', () => {
    const b1 = makeBody({ id: 'a', x: 400, y: 500, radius: 20 });
    const b2 = makeBody({ id: 'b', x: 600, y: 500, radius: 20 });
    const result = interactPair(b1, b2, 1.0);
    expect(result.collision).toBeNull();
  });

  it('marks collision giant when either radius > 35', () => {
    const b1 = makeBody({ id: 'a', x: 490, y: 500, radius: 40 });
    const b2 = makeBody({ id: 'b', x: 510, y: 500, radius: 20 });
    const result = interactPair(b1, b2, 1.0);
    expect(result.collision).not.toBeNull();
    expect(result.collision!.isGiant).toBe(true);
  });

  it('returns new objects (immutable)', () => {
    const b1 = makeBody({ id: 'a', x: 400, y: 500 });
    const b2 = makeBody({ id: 'b', x: 600, y: 500 });
    const result = interactPair(b1, b2, 1.0);
    expect(result.b1).not.toBe(b1);
    expect(result.b2).not.toBe(b2);
  });

  it('skips interaction when distance <= INTERACTION_MIN_DIST', () => {
    const b1 = makeBody({ id: 'a', x: 499, y: 500, charge: 1 });
    const b2 = makeBody({ id: 'b', x: 501, y: 500, charge: 1 });
    const result = interactPair(b1, b2, 1.0);
    expect(result.b1.vx).toBe(0);
    expect(result.b2.vx).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// applyBlackholePull
// ---------------------------------------------------------------------------
describe('applyBlackholePull', () => {
  const blackhole = makeBody({
    id: 'bh',
    x: 500,
    y: 500,
    radius: 40,
  });

  it('pulls body toward blackhole', () => {
    const b = makeBody({ id: 'b', x: 600, y: 500, vx: 0, vy: 0 });
    const next = applyBlackholePull(b, blackhole);
    expect(next.vx).toBeLessThan(0);
    expect(next.vy).toBe(0);
  });

  it('does nothing when body is far (> 420)', () => {
    const b = makeBody({ x: 1000, y: 500 });
    const next = applyBlackholePull(b, blackhole);
    expect(next).toBe(b);
  });

  it('does nothing when body is too close (<= 10)', () => {
    const b = makeBody({ x: 505, y: 500 });
    const next = applyBlackholePull(b, blackhole);
    expect(next).toBe(b);
  });

  it('caps pull force', () => {
    const b = makeBody({ id: 'b', x: 510, y: 500, vx: 0, vy: 0 });
    const next = applyBlackholePull(b, blackhole);
    expect(Math.abs(next.vx)).toBeLessThanOrEqual(4.0);
  });
});

// ---------------------------------------------------------------------------
// applyBlackholeDevour
// ---------------------------------------------------------------------------
describe('applyBlackholeDevour', () => {
  const W = 1000;
  const H = 800;

  it('devours body within range and grows blackhole', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 40 });
    const b = makeBody({ id: 'b', x: 520, y: 500, radius: 20 });
    const result = applyBlackholeDevour(b, bh, W, H);
    expect(result.devoured).toBe(true);
    expect(result.blackhole.radius).toBeGreaterThan(40);
  });

  it('does not devour when body is far', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 40 });
    const b = makeBody({ x: 700, y: 500, radius: 20 });
    const result = applyBlackholeDevour(b, bh, W, H);
    expect(result.devoured).toBe(false);
    expect(result.blackhole).toBe(bh);
  });

  it('respawns devoured body at edge', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 40 });
    const b = makeBody({ id: 'b', x: 520, y: 500, radius: 20 });
    const result = applyBlackholeDevour(b, bh, W, H);
    expect(result.body.x).toBeLessThanOrEqual(W + 20);
    expect(result.body.y).toBeGreaterThanOrEqual(0);
    expect(result.body.y).toBeLessThanOrEqual(H);
  });

  it('explodes blackhole when it grows too large', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 750 });
    const b = makeBody({ id: 'b', x: 520, y: 500, radius: 100 });
    const result = applyBlackholeDevour(b, bh, W, H);
    expect(result.exploded).toBe(true);
    expect(result.blackhole.isExploded).toBe(true);
    expect(result.blackhole.radius).toBe(40);
  });
});

// ---------------------------------------------------------------------------
// computeForceMult
// ---------------------------------------------------------------------------
describe('computeForceMult', () => {
  it('returns 1.0 when full intensity and normal view', () => {
    expect(computeForceMult(false, false)).toBe(1.0);
  });

  it('returns 0.5 when half intensity', () => {
    expect(computeForceMult(true, false)).toBe(0.5);
  });

  it('returns 1.35 when cosmic view active', () => {
    expect(computeForceMult(false, true)).toBe(1.35);
  });

  it('returns 0.675 when half intensity and cosmic view', () => {
    expect(computeForceMult(true, true)).toBe(0.675);
  });
});

// ---------------------------------------------------------------------------
// updatePhysics (integration)
// ---------------------------------------------------------------------------
describe('updatePhysics', () => {
  it('steps all bodies forward', () => {
    const b1 = makeBody({ id: 'a', x: 100, y: 200, vx: 2, vy: 3 });
    const input = defaultInput({ bodies: [b1] });
    const result = updatePhysics(input);
    expect(result.bodies[0]!.x).toBe(102);
    expect(result.bodies[0]!.y).toBe(203);
  });

  it('skips exploded bodies', () => {
    const b1 = makeBody({ id: 'a', x: 100, y: 200, vx: 2, vy: 3, isExploded: true });
    const input = defaultInput({ bodies: [b1] });
    const result = updatePhysics(input);
    expect(result.bodies[0]!.x).toBe(100);
    expect(result.bodies[0]!.y).toBe(200);
  });

  it('reports collisions', () => {
    const b1 = makeBody({ id: 'a', x: 490, y: 500, vx: 5, vy: 0, radius: 20 });
    const b2 = makeBody({ id: 'b', x: 510, y: 500, vx: -5, vy: 0, radius: 20 });
    const input = defaultInput({ bodies: [b1, b2] });
    const result = updatePhysics(input);
    expect(result.collisions.length).toBeGreaterThanOrEqual(1);
  });

  it('applies blackhole pull (velocity change)', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 40, type: 'super_blackhole' });
    const b = makeBody({ id: 'b', x: 600, y: 500, radius: 20, vx: 0, vy: 0 });
    const input = defaultInput({
      bodies: [b, bh],
      blackholeDisabled: false,
    });
    const result = updatePhysics(input);
    const pulledBody = result.bodies.find((bdy) => bdy.id === 'b')!;
    expect(pulledBody.vx).toBeLessThan(0);
  });

  it('does not process blackhole when disabled', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 40, type: 'super_blackhole' });
    const b = makeBody({ id: 'b', x: 520, y: 500, radius: 20 });
    const input = defaultInput({
      bodies: [b, bh],
      blackholeDisabled: true,
    });
    const result = updatePhysics(input);
    expect(result.devours.length).toBe(0);
  });

  it('applies devour via applyBlackholeDevour directly (multi-frame scenario)', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 40 });
    const b = makeBody({ id: 'b', x: 530, y: 500, radius: 10 });
    const result: DevourResult = applyBlackholeDevour(b, bh, 1000, 800);
    expect(result.devoured).toBe(true);
    expect(result.blackhole.radius).toBeGreaterThan(40);
  });

  it('explodes blackhole when radius exceeds threshold via applyBlackholeDevour', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 750 });
    const b = makeBody({ id: 'b', x: 520, y: 500, radius: 100 });
    const result: DevourResult = applyBlackholeDevour(b, bh, 1000, 800);
    expect(result.exploded).toBe(true);
    expect(result.blackhole.isExploded).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// create-body factories
// ---------------------------------------------------------------------------
describe('createSun', () => {
  it('creates a big_sun body at the correct position', () => {
    resetIdCounter();
    const sun = createSun(1000, 800);
    expect(sun.type).toBe('big_sun');
    expect(sun.name).toBe('Sun');
    expect(sun.x).toBeCloseTo(500, -1);
    expect(sun.y).toBeCloseTo(360, -1);
    expect(sun.radius).toBe(75);
    expect(sun.charge).toBe(1);
    expect(sun.isExploded).toBe(false);
  });
});

describe('createPlanet', () => {
  it('creates a giant_planet from config', () => {
    resetIdCounter();
    const config = PLANET_CONFIGS[2]!;
    const planet = createPlanet(config, 2, 8, 500, 360);
    expect(planet.type).toBe('giant_planet');
    expect(planet.name).toBe('Earth');
    expect(planet.radius).toBe(26);
    expect(planet.mass).toBe(26 * 26);
    expect(planet.isExploded).toBe(false);
  });

  it('alternates charge by index', () => {
    resetIdCounter();
    const p1 = createPlanet(PLANET_CONFIGS[0]!, 0, 8, 500, 360);
    const p2 = createPlanet(PLANET_CONFIGS[1]!, 1, 8, 500, 360);
    expect(p1.charge).toBe(1);
    expect(p2.charge).toBe(-1);
  });
});

describe('createBlackhole', () => {
  it('creates a super_blackhole body', () => {
    resetIdCounter();
    const bh = createBlackhole(1000, 800);
    expect(bh.type).toBe('super_blackhole');
    expect(bh.charge).toBe(-1);
    expect(bh.radius).toBe(40);
    expect(bh.mass).toBe(14000);
    expect(bh.isExploded).toBe(false);
  });
});

describe('createSmallItem', () => {
  it('creates a small item with random properties', () => {
    resetIdCounter();
    const item = createSmallItem('rocket', '', 1000, 800);
    expect(item.type).toBe('rocket');
    expect(item.isExploded).toBe(false);
    expect(item.x).toBeGreaterThanOrEqual(0);
    expect(item.x).toBeLessThanOrEqual(1000);
    expect(item.y).toBeGreaterThanOrEqual(0);
    expect(item.y).toBeLessThanOrEqual(800);
  });

  it('stores text for math_symbol type', () => {
    resetIdCounter();
    const item = createSmallItem('math_symbol', 'E=mc²', 1000, 800);
    expect(item.text).toBe('E=mc²');
  });
});

describe('resetIdCounter', () => {
  it('resets sequential IDs', () => {
    resetIdCounter();
    const s1 = createSun(1000, 800);
    const s2 = createSun(1000, 800);
    expect(s2.id).not.toBe(s1.id);
    resetIdCounter();
    const s3 = createSun(1000, 800);
    expect(s3.id).toBe(s1.id);
  });
});

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------
describe('type exports', () => {
  it('exports BODY_TYPES tuple', () => {
    expect(BODY_TYPES).toContain('big_sun');
    expect(BODY_TYPES).toContain('super_blackhole');
  });
});
