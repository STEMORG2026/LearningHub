import type { CelestialBody, PhysicsInput, PhysicsResult, CollisionEvent, DevourEvent } from './types';
import {
  BOUNCE_DAMPING,
  MOUSE_FORCE_COEFFICIENT,
  COULOMB_CONSTANT,
  INTERACTION_MIN_DIST,
  INTERACTION_MAX_DIST,
  BLACKHOLE_MAX_RADIUS_RATIO,
  BLACKHOLE_PULL_DIST,
  BLACKHOLE_PULL_CAP,
} from './types';

export function stepPosition(body: CelestialBody, timeScale: number): CelestialBody {
  return {
    ...body,
    x: body.x + body.vx * timeScale,
    y: body.y + body.vy * timeScale,
    rotation: body.rotation + (body.vRot || 0.005) * timeScale,
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

  if (dist > INTERACTION_MIN_DIST && dist < INTERACTION_MAX_DIST) {
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
  if (dist >= BLACKHOLE_PULL_DIST || dist <= 10) return body;

  const pull = (blackhole.radius * 0.5) * (180 / (dist * dist));
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
): DevourResult {
  const dx = blackhole.x - body.x;
  const dy = blackhole.y - body.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const devourDist = blackhole.radius + body.radius * 0.5;

  if (dist >= devourDist || body.isExploded) {
    return { body, blackhole, devoured: false, exploded: false, radiusDelta: 0 };
  }

  let newRadius = blackhole.radius + Math.min(body.radius * 0.05, 4);
  let exploded = false;

  if (newRadius > Math.max(width, height) * BLACKHOLE_MAX_RADIUS_RATIO) {
    exploded = true;
    newRadius = 40;
  }

  const resetBody: CelestialBody = {
    ...body,
    x: Math.random() > 0.5 ? -body.radius : width + body.radius,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2,
    isExploded: false,
  };

  const newBlackhole: CelestialBody = {
    ...blackhole,
    radius: newRadius,
    isExploded: exploded,
  };

  return {
    body: resetBody,
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

  let bodies = input.bodies.map((b) => {
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

  if (!input.blackholeDisabled) {
    const blackholeIdx = bodies.findIndex((b) => b.type === 'super_blackhole' && !b.isExploded);
    if (blackholeIdx !== -1) {
      for (let i = 0; i < bodies.length; i++) {
        if (i === blackholeIdx || bodies[i]!.isExploded) continue;
        bodies[i] = applyBlackholePull(bodies[i]!, bodies[blackholeIdx]!);
      }

      for (let i = 0; i < bodies.length; i++) {
        if (i === blackholeIdx || bodies[i]!.isExploded) continue;
        const devourResult = applyBlackholeDevour(bodies[i]!, bodies[blackholeIdx]!, input.width, input.height);
        if (devourResult.devoured) {
          bodies[i] = devourResult.body;
          bodies[blackholeIdx] = devourResult.blackhole;
          blackholeRadiusDelta += devourResult.radiusDelta;
          if (devourResult.exploded) {
            blackholeExploded = true;
          }
          devours.push({
            blackholeId: bodies[blackholeIdx]!.id,
            devouredId: bodies[i]!.id,
          });
        }
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
