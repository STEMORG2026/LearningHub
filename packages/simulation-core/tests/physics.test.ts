import { describe, it, expect } from 'vitest';
import {
  stepPosition,
  applyBoundary,
  applyMouseForce,
  interactPair,
  applySunGravity,
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
import { PLANET_CONFIGS, MATH_SYMBOLS, SUN_GRAVITY_CONSTANT } from '../src/config';
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

  // Added 2026-09-30 (mutation gap P5). The pre-existing "resolves elastic
  // collision" test only asserts the bodies separate (toBeLessThan/toBeGreaterThan).
  // That assertion still holds when the impulse formula divides by `mass * mass`
  // instead of `mass + mass`, so the suite could not tell a correct momentum
  // exchange from a broken one. These tests pin the *exchange* itself.
  it('exchanges momentum in the correct direction (head-on, unequal mass)', () => {
    const b1 = makeBody({ id: 'a', x: 490, y: 500, vx: 9, vy: 0, radius: 20, mass: 400 });
    const b2 = makeBody({ id: 'b', x: 510, y: 500, vx: -1, vy: 0, radius: 20, mass: 300 });
    const result = interactPair(b1, b2, 1.0);

    // A heavier body hitting a lighter one must transfer most of its momentum.
    // With a correct impulse (denominator mass1 + mass2) the heavy body is
    // nearly stopped and the light one is thrown forward hard. A wrong
    // denominator (mass1 * mass2) collapses the impulse, so the heavy body
    // barely slows — the single most consequential difference in this function.
    expect(result.b1.vx).toBeCloseTo(0.4286, 3); // 3/7
    expect(result.b2.vx).toBeCloseTo(10.4286, 3); // 73/7
  });

  it('gives the lighter body the larger velocity change', () => {
    const heavy = makeBody({ id: 'heavy', x: 490, y: 500, vx: 9, vy: 0, radius: 20, mass: 4000 });
    const light = makeBody({ id: 'light', x: 510, y: 500, vx: -1, vy: 0, radius: 20, mass: 100 });
    const result = interactPair(heavy, light, 1.0);

    const heavyDelta = Math.abs(result.b1.vx - heavy.vx);
    const lightDelta = Math.abs(result.b2.vx - light.vx);
    expect(lightDelta).toBeGreaterThan(heavyDelta);
  });

  it('conserves total momentum for a head-on pair', () => {
    // NOTE: `interactPair` applies the Coulomb force AND the collision impulse in
    // the same call, so momentum is conserved only to within the Coulomb
    // contribution (a residual of ~0.03 for these masses), not to machine
    // precision. The tolerance below is chosen to sit above that residual while
    // remaining far below any wrong-denominator deviation (which is ~11 in
    // velocity terms, i.e. thousands in momentum terms).
    const b1 = makeBody({ id: 'a', x: 490, y: 500, vx: 9, vy: 0, radius: 20, mass: 400 });
    const b2 = makeBody({ id: 'b', x: 510, y: 500, vx: -1, vy: 0, radius: 20, mass: 300 });
    const before = b1.mass * b1.vx + b2.mass * b2.vx;
    const result = interactPair(b1, b2, 1.0);
    const after = result.b1.mass * result.b1.vx + result.b2.mass * result.b2.vx;
    expect(Math.abs(after - before)).toBeLessThan(0.05);
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

  it('pulls from far away (infinite range)', () => {
    const b = makeBody({ id: 'b', x: 1000, y: 500, vx: 0, vy: 0 });
    const next = applyBlackholePull(b, blackhole);
    expect(next.vx).toBeLessThan(0);
    expect(next.vx).toBeGreaterThan(-0.02);
  });

  it('does nothing when body is too close (<= 10)', () => {
    const b = makeBody({ x: 505, y: 500 });
    const next = applyBlackholePull(b, blackhole);
    expect(next).toBe(b);
  });

  it('pulls heavier bodies more slowly', () => {
    const light = makeBody({ id: 'l', x: 700, y: 500, vx: 0, vy: 0, mass: 100 });
    const heavy = makeBody({ id: 'h', x: 700, y: 500, vx: 0, vy: 0, mass: 10000 });
    const lightDelta = Math.abs(applyBlackholePull(light, blackhole).vx);
    const heavyDelta = Math.abs(applyBlackholePull(heavy, blackhole).vx);
    expect(lightDelta).toBeGreaterThan(heavyDelta);
  });

  it('caps pull force', () => {
    const b = makeBody({ id: 'b', x: 520, y: 500, vx: 0, vy: 0, mass: 100 });
    const next = applyBlackholePull(b, blackhole);
    expect(next.vx).toBe(-4.0);
  });

  it('pulls harder when closer (inverse-square falloff)', () => {
    const near = makeBody({ id: 'n', x: 550, y: 500, vx: 0, vy: 0 });
    const far = makeBody({ id: 'f', x: 700, y: 500, vx: 0, vy: 0 });
    const nearDelta = Math.abs(applyBlackholePull(near, blackhole).vx);
    const farDelta = Math.abs(applyBlackholePull(far, blackhole).vx);
    expect(nearDelta).toBeGreaterThan(farDelta);
  });

  it('scales pull distance with blackhole radius', () => {
    const bigBh = makeBody({ id: 'bh', x: 500, y: 500, radius: 500 });
    const b = makeBody({ id: 'b', x: 1000, y: 500, vx: 0, vy: 0 });
    const next = applyBlackholePull(b, bigBh);
    expect(next.vx).toBeLessThan(0);
    expect(next.vy).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// applySunGravity
// ---------------------------------------------------------------------------
describe('applySunGravity', () => {
  const sun = makeBody({
    id: 'sun',
    type: 'big_sun',
    x: 500,
    y: 500,
    radius: 150,
    mass: 33750,
    charge: 0,
  });

  it('pulls a planet toward the sun', () => {
    const planet = makeBody({ id: 'p', x: 716, y: 500, vx: 0, vy: 0 });
    const next = applySunGravity(planet, sun, 1);
    expect(next.vx).toBeLessThan(0);
    expect(next.vy).toBe(0);
  });

  it('scales with inverse-square distance', () => {
    const near = makeBody({ id: 'n', x: 640, y: 500, vx: 0, vy: 0 });
    const far = makeBody({ id: 'f', x: 1060, y: 500, vx: 0, vy: 0 });
    const nearDelta = Math.abs(applySunGravity(near, sun, 1).vx);
    const farDelta = Math.abs(applySunGravity(far, sun, 1).vx);
    expect(nearDelta).toBeCloseTo(farDelta * 16, 5);
  });

  it('scales by timeScale', () => {
    const planet = makeBody({ id: 'p', x: 716, y: 500, vx: 0, vy: 0 });
    const full = applySunGravity(planet, sun, 1);
    const half = applySunGravity(planet, sun, 0.5);
    expect(half.vx).toBeCloseTo(full.vx * 0.5, 10);
  });

  it('ignores non-planet bodies', () => {
    const item = makeBody({ id: 'i', type: 'rocket', x: 716, y: 500, vx: 0, vy: 0 });
    const next = applySunGravity(item, sun, 1);
    expect(next).toBe(item);
  });

  it('ignores the sun itself', () => {
    const next = applySunGravity(sun, sun, 1);
    expect(next).toBe(sun);
  });

  it('uses SUN_GRAVITY_CONSTANT for the acceleration', () => {
    const planet = makeBody({ id: 'p', x: 716, y: 500, vx: 0, vy: 0 });
    const next = applySunGravity(planet, sun, 1);
    expect(next.vx).toBeCloseTo(-(SUN_GRAVITY_CONSTANT * 33750) / (216 * 216), 10);
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

  it('consumes devoured body (marks isExploded)', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 40 });
    const b = makeBody({ id: 'b', x: 520, y: 500, radius: 20 });
    const result = applyBlackholeDevour(b, bh, W, H);
    expect(result.devoured).toBe(true);
    expect(result.body.isExploded).toBe(true);
  });

  it('explodes blackhole when it grows too large', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 750 });
    const b = makeBody({ id: 'b', x: 520, y: 500, radius: 100 });
    const result = applyBlackholeDevour(b, bh, W, H);
    expect(result.exploded).toBe(true);
    expect(result.blackhole.isExploded).toBe(true);
    expect(result.blackhole.radius).toBe(40);
  });

  it('uses a custom explode radius when provided', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 240 });
    const b = makeBody({ id: 'b', x: 520, y: 500, radius: 100 });
    const result = applyBlackholeDevour(b, bh, W, H, 250);
    expect(result.exploded).toBe(true);
    expect(result.blackhole.isExploded).toBe(true);
    expect(result.blackhole.radius).toBe(40);
  });

  it('explodes exactly at the 2x sun cap', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 285, type: 'super_blackhole' });
    const b = makeBody({ id: 'b', x: 520, y: 500, radius: 100 });
    const result = applyBlackholeDevour(b, bh, W, H, 300);
    expect(result.exploded).toBe(true);
    expect(result.blackhole.isExploded).toBe(true);
  });

  it('stops growth at the 2x sun cap without exploding below it', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 285, type: 'super_blackhole' });
    const b = makeBody({ id: 'b', x: 520, y: 500, radius: 50 });
    const result = applyBlackholeDevour(b, bh, W, H, 300);
    expect(result.exploded).toBe(false);
    expect(result.blackhole.radius).toBe(300);
    expect(result.blackhole.isExploded).toBe(false);
  });

  it('devours the sun when the blackhole reaches it', () => {
    const sun = makeBody({ id: 'sun', type: 'big_sun', x: 500, y: 500, radius: 150, mass: 33750 });
    const bh = makeBody({ id: 'bh', type: 'super_blackhole', x: 620, y: 500, radius: 300 });
    const result = applyBlackholeDevour(sun, bh, W, H, 300);
    expect(result.devoured).toBe(true);
    expect(result.body.isExploded).toBe(true);
    expect(result.exploded).toBe(true);
  });

  // Added 2026-09-30 (mutation gap P6). Every pre-existing growth test used a
  // large body (radius 100 / 50 / 150), where Math.max(radius * 0.3, 6) is
  // always driven by the *radius* term. The `6` floor was therefore never
  // exercised: changing it to 0 left the suite green. This test uses a body
  // small enough that radius * 0.3 < 6, so only the floor can be responsible
  // for the growth.
  it('grows by the minimum amount of 6 when devouring a very small body', () => {
    const bh = makeBody({ id: 'bh', type: 'super_blackhole', x: 500, y: 500, radius: 100 });
    // radius 10 => radius * 0.3 = 3, which is below the floor of 6.
    // Body must sit INSIDE devourDist (100 + 10 = 110) to be devoured at all.
    const tiny = makeBody({ id: 'tiny', x: 550, y: 500, radius: 10 });
    const result = applyBlackholeDevour(tiny, bh, W, H, 10_000);

    expect(result.devoured).toBe(true);
    // 100 + max(3, 6) === 106, NOT 103.
    expect(result.radiusDelta).toBe(6);
    expect(result.blackhole.radius).toBe(106);
  });

  it('uses radius * 0.3 when that exceeds the floor', () => {
    const bh = makeBody({ id: 'bh', type: 'super_blackhole', x: 500, y: 500, radius: 100 });
    // radius 100 => 30 > 6, so the radius term must win. devourDist = 200.
    const big = makeBody({ id: 'big', x: 550, y: 500, radius: 100 });
    const result = applyBlackholeDevour(big, bh, W, H, 10_000);

    expect(result.devoured).toBe(true);
    expect(result.radiusDelta).toBe(30);
    expect(result.blackhole.radius).toBe(130);
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

  it('honors a custom blackhole explode radius in updatePhysics', () => {
    const bh = makeBody({ id: 'bh', x: 500, y: 500, radius: 430, type: 'super_blackhole' });
    const b = makeBody({ id: 'b', x: 520, y: 500, radius: 100 });
    const input = defaultInput({
      bodies: [bh, b],
      blackholeDisabled: false,
      blackholeExplodeRadius: 450,
    });
    const result = updatePhysics(input);
    expect(result.blackholeExploded).toBe(true);
    const exploded = result.bodies.find((bdy) => bdy.id === 'bh')!;
    expect(exploded.isExploded).toBe(true);
  });

  it('devours bodies with multiple blackholes', () => {
    const bh1 = makeBody({ id: 'bh1', x: 300, y: 500, radius: 40, type: 'super_blackhole' });
    const bh2 = makeBody({ id: 'bh2', x: 700, y: 500, radius: 40, type: 'super_blackhole' });
    const b = makeBody({ id: 'b', x: 310, y: 500, radius: 10 });
    const input = defaultInput({
      bodies: [bh1, bh2, b],
      blackholeDisabled: false,
    });
    const result = updatePhysics(input);
    expect(result.devours.length).toBeGreaterThanOrEqual(1);
    const consumed = result.bodies.find((bdy) => bdy.id === 'b')!;
    expect(consumed.isExploded).toBe(true);
  });

  it('keeps a planet in a stable orbit under sun gravity (shockwave recovery)', () => {
    const sun = makeBody({
      id: 'sun',
      type: 'big_sun',
      x: 1000,
      y: 1000,
      radius: 150,
      mass: 33750,
      charge: 0,
    });
    const planet = makeBody({
      id: 'p',
      type: 'giant_planet',
      x: 1216,
      y: 1000,
      vx: 0,
      vy: 0.4752,
      radius: 26,
      mass: 676,
      charge: 0,
    });
    const input = defaultInput({
      bodies: [sun, planet],
      width: 3000,
      height: 3000,
      timeScale: 0.6,
      blackholeDisabled: true,
    });
    let bodies = [sun, planet];
    let minR = Infinity;
    let maxR = 0;
    for (let i = 0; i < 10000; i++) {
      const result = updatePhysics({ ...input, bodies });
      bodies = result.bodies;
      const p = bodies.find((b) => b.id === 'p')!;
      const r = Math.hypot(p.x - 1000, p.y - 1000);
      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
    }
    expect(maxR).toBeLessThan(1200);
    expect(minR).toBeGreaterThan(170);
    expect(maxR - minR).toBeLessThan(400);
  });

  it('recovers a bounded orbit after a shockwave impulse', () => {
    const sun = makeBody({
      id: 'sun',
      type: 'big_sun',
      x: 1000,
      y: 1000,
      radius: 150,
      mass: 33750,
      charge: 0,
    });
    const planet = makeBody({
      id: 'p',
      type: 'giant_planet',
      x: 1216,
      y: 1000,
      vx: 0,
      vy: 0.4752,
      radius: 26,
      mass: 676,
      charge: 0,
    });
    const input = defaultInput({
      bodies: [sun, planet],
      width: 3000,
      height: 3000,
      timeScale: 0.6,
      blackholeDisabled: true,
    });
    let bodies = [sun, planet];
    for (let i = 0; i < 400; i++) {
      const result = updatePhysics({ ...input, bodies });
      bodies = result.bodies;
    }
    let p = bodies.find((b) => b.id === 'p')!;
    p = { ...p, vx: p.vx - 0.9, vy: p.vy + 0.2 };
    bodies = bodies.map((b) => (b.id === 'p' ? p : b));
    let minR = Infinity;
    let maxR = 0;
    let lastR = 0;
    for (let i = 0; i < 12000; i++) {
      const result = updatePhysics({ ...input, bodies });
      bodies = result.bodies;
      const planetBody = bodies.find((b) => b.id === 'p')!;
      const r = Math.hypot(planetBody.x - 1000, planetBody.y - 1000);
      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
      lastR = r;
    }
    expect(maxR).toBeLessThan(2500);
    expect(minR).toBeGreaterThan(170);
    expect(lastR).toBeLessThan(1500);
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
