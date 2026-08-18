import type { CelestialBody, PhysicsInput, PhysicsResult, CollisionEvent, DevourEvent } from './types';
import {
  BOUNCE_DAMPING,
  MOUSE_FORCE_COEFFICIENT,
  COULOMB_CONSTANT,
  INTERACTION_MIN_DIST,
  INTERACTION_MAX_DIST,
  BLACKHOLE_MAX_RADIUS_RATIO,
  BLACKHOLE_PULL_CAP,
  BLACKHOLE_GRAVITY_REF_MASS,
  BLACKHOLE_GRAVITY_MASS_CAP,
} from './types';
import { SUN_GRAVITY_CONSTANT } from './config';

export function stepPosition(body: CelestialBody, timeScale: number): CelestialBody {
  return {
    ...body,
    x: body.x + body.vx * timeScale,
    y: body.y + body.vy * timeScale,
    rotation: body.rotation + (body.vRot || 0.005) * timeScale,
  };
}

export function applySunGravity(
  body: CelestialBody,
  sun: CelestialBody,
  timeScale: number,
): CelestialBody {
  if (body.type !== 'giant_planet' || body.isExploded || body.id === sun.id) return body;
  const dx = sun.x - body.x;
  const dy = sun.y - body.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= 0 || dist < sun.radius * 0.5) return body;

  const accel = (SUN_GRAVITY_CONSTANT * sun.mass) / (dist * dist);
  return {
    ...body,
    vx: body.vx + (dx / dist) * accel * timeScale,
    vy: body.vy + (dy / dist) * accel * timeScale,
  };
}

export function applyBoundary(body: CelestialBody, width: number, height: number): CelestialBody {
  let { x, y, vx, vy } = body;
  if (x - body.radius < 0) {
    x = body.radius;
    vx *= -BOUNCE_DAMPING;
  }
  if (x + body.radius > width) {
    x = width - body.radius;
    vx *= -BOUNCE_DAMPING;
  }
  if (y - body.radius < 0) {
    y = body.radius;
    vy *= -BOUNCE_DAMPING;
  }
  if (y + body.radius > height) {
    y = height - body.radius;
    vy *= -BOUNCE_DAMPING;
  }
  return { ...body, x, y, vx, vy };
}

export function applyMouseForce(
  body: CelestialBody,
  mouseX: number,
  mouseY: number,
  mouseRadius: number,
  forceMult: number,
): CelestialBody {
  const mdx = mouseX - body.x;
  const mdy = mouseY - body.y;
  const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
  if (mDist >= mouseRadius || mDist <= 5) return body;

  const mForce = (1 - mDist / mouseRadius) * MOUSE_FORCE_COEFFICIENT * forceMult;
  return {
    ...body,
    vx: body.vx + (mdx / mDist) * mForce,
    vy: body.vy + (mdy / mDist) * mForce,
  };
}

export interface InteractPairResult {
  b1: CelestialBody;
  b2: CelestialBody;
  collision: CollisionEvent | null;
}

export function interactPair(b1: CelestialBody, b2: CelestialBody, forceMult: number): InteractPairResult {
  const dx = b2.x - b1.x;
  const dy = b2.y - b1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  let collision: CollisionEvent | null = null;
  let out1 = b1;
  let out2 = b2;

  if (
    b1.charge !== 0 &&
    b2.charge !== 0 &&
    dist > INTERACTION_MIN_DIST &&
    dist < INTERACTION_MAX_DIST
  ) {
    const force = (b1.charge * b2.charge < 0 ? -1 : 1) * (COULOMB_CONSTANT / (dist * dist)) * forceMult;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;

    out1 = {
      ...out1,
      vx: out1.vx + fx / (out1.radius * 0.2),
      vy: out1.vy + fy / (out1.radius * 0.2),
    };
    out2 = {
      ...out2,
      vx: out2.vx - fx / (out2.radius * 0.2),
      vy: out2.vy - fy / (out2.radius * 0.2),
    };
  }

  const minDist = b1.radius + b2.radius;
  if (dist < minDist && dist > 0) {
    const overlap = minDist - dist;
    const nx = dx / dist;
    const ny = dy / dist;

    out1 = {
      ...out1,
      x: out1.x - nx * overlap * 0.5,
      y: out1.y - ny * overlap * 0.5,
    };
    out2 = {
      ...out2,
      x: out2.x + nx * overlap * 0.5,
      y: out2.y + ny * overlap * 0.5,
    };

    const kx = out1.vx - out2.vx;
    const ky = out1.vy - out2.vy;
    const p = (2 * (nx * kx + ny * ky)) / (out1.mass + out2.mass);

    out1 = {
      ...out1,
      vx: out1.vx - p * out2.mass * nx,
      vy: out1.vy - p * out2.mass * ny,
    };
    out2 = {
      ...out2,
      vx: out2.vx + p * out1.mass * nx,
      vy: out2.vy + p * out1.mass * ny,
    };

    const isGiant = b1.radius > 35 || b2.radius > 35;
    collision = {
      bodyAId: b1.id,
      bodyBId: b2.id,
      isGiant,
    };
  }

  return { b1: out1, b2: out2, collision };
}

export function applyBlackholePull(
  body: CelestialBody,
  blackhole: CelestialBody,
): CelestialBody {
  const dx = blackhole.x - body.x;
  const dy = blackhole.y - body.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= 10) return body;

  const massFactor = Math.min(
    BLACKHOLE_GRAVITY_REF_MASS / Math.max(body.mass, 1),
    BLACKHOLE_GRAVITY_MASS_CAP,
  );
  const pull = (blackhole.radius * 0.5) * (180 / (dist * dist)) * massFactor;
  const capped = Math.min(pull, BLACKHOLE_PULL_CAP);
  return {
    ...body,
    vx: body.vx + (dx / dist) * capped,
    vy: body.vy + (dy / dist) * capped,
  };
}

export interface DevourResult {
  body: CelestialBody;
  blackhole: CelestialBody;
  devoured: boolean;
  exploded: boolean;
  radiusDelta: number;
}

export function applyBlackholeDevour(
  body: CelestialBody,
  blackhole: CelestialBody,
  width: number,
  height: number,
  explodeRadius: number = Math.max(width, height) * BLACKHOLE_MAX_RADIUS_RATIO,
): DevourResult {
  const dx = blackhole.x - body.x;
  const dy = blackhole.y - body.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const devourDist = blackhole.radius + body.radius;

  if (dist >= devourDist || body.isExploded) {
    return { body, blackhole, devoured: false, exploded: false, radiusDelta: 0 };
  }

  let newRadius = blackhole.radius + Math.max(body.radius * 0.3, 6);
  let exploded = false;

  if (newRadius > explodeRadius) {
    exploded = true;
    newRadius = 40;
  }

  const consumedBody: CelestialBody = {
    ...body,
    isExploded: true,
  };

  const newBlackhole: CelestialBody = {
    ...blackhole,
    radius: newRadius,
    isExploded: exploded,
  };

  return {
    body: consumedBody,
    blackhole: newBlackhole,
    devoured: true,
    exploded,
    radiusDelta: newRadius - blackhole.radius,
  };
}

export function computeForceMult(halfIntensity: boolean, cosmicViewActive: boolean): number {
  return (halfIntensity ? 0.5 : 1.0) * (cosmicViewActive ? 1.35 : 1.0);
}

export function updatePhysics(input: PhysicsInput): PhysicsResult {
  const forceMult = computeForceMult(input.halfIntensity, input.cosmicViewActive);
  const collisions: CollisionEvent[] = [];
  let devours: DevourEvent[] = [];
  let blackholeRadiusDelta = 0;
  let blackholeExploded = false;

  let bodies = input.bodies;

  const sunBody = bodies.find((b) => b.type === 'big_sun' && !b.isExploded);
  bodies = bodies.map((b) => (sunBody ? applySunGravity(b, sunBody, input.timeScale) : b));

  bodies = bodies.map((b) => {
    if (b.isExploded) return b;
    return stepPosition(b, input.timeScale);
  });

  bodies = bodies.map((b) => {
    if (b.isExploded) return b;
    return applyBoundary(b, input.width, input.height);
  });

  bodies = bodies.map((b) => {
    if (b.isExploded) return b;
    return applyMouseForce(b, input.mouseX, input.mouseY, input.mouseRadius, forceMult);
  });

  if (!input.blackholeDisabled) {
    const explodeRadius = input.blackholeExplodeRadius ?? Math.max(input.width, input.height) * BLACKHOLE_MAX_RADIUS_RATIO;
    const blackholeIndices: number[] = [];
    for (let i = 0; i < bodies.length; i++) {
      if (bodies[i]!.type === 'super_blackhole' && !bodies[i]!.isExploded) {
        blackholeIndices.push(i);
      }
    }

    for (const bhIdx of blackholeIndices) {
      for (let i = 0; i < bodies.length; i++) {
        if (i === bhIdx || bodies[i]!.isExploded) continue;
        bodies[i] = applyBlackholePull(bodies[i]!, bodies[bhIdx]!);
      }

      for (let i = 0; i < bodies.length; i++) {
        if (i === bhIdx || bodies[i]!.isExploded) continue;
        if (bodies[i]!.type === 'super_blackhole') continue;
        const devourResult = applyBlackholeDevour(bodies[i]!, bodies[bhIdx]!, input.width, input.height, explodeRadius);
        if (devourResult.devoured) {
          bodies[i] = devourResult.body;
          bodies[bhIdx] = devourResult.blackhole;
          blackholeRadiusDelta += devourResult.radiusDelta;
          if (devourResult.exploded) {
            blackholeExploded = true;
          }
          devours.push({
            blackholeId: bodies[bhIdx]!.id,
            devouredId: bodies[i]!.id,
          });
        }
      }
    }
  }

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      if (bodies[i]!.isExploded || bodies[j]!.isExploded) continue;
      const result = interactPair(bodies[i]!, bodies[j]!, forceMult);
      bodies[i] = result.b1;
      bodies[j] = result.b2;
      if (result.collision) {
        collisions.push(result.collision);
      }
    }
  }

  return {
    bodies,
    collisions,
    devours,
    blackholeRadiusDelta,
    blackholeExploded,
  };
}
