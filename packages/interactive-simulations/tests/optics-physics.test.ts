import { describe, it, expect } from 'vitest';
import {
  angleOfRefraction,
  angleOfReflection,
  criticalAngle,
  thinLens,
  imageDistanceFor,
  reflectOffHorizontal,
  describeImage,
  toRadians,
  toDegrees,
  NO_SOLUTION,
  type LensResult,
} from '../src/optics-physics';

/**
 * These tests exercise the pure optics formulas directly — no DOM, no component.
 *
 * That is the entire point of the ADR-015 Follow-up #3 extraction. The sibling
 * simulations can only be tested by clicking buttons, so a wrong sign convention
 * in `stem-mechanics-sim` is invisible unless it happens to change rendered
 * text. Here, every branch and every sign is reachable from a plain function
 * call, which is what makes the arithmetic genuinely verified rather than
 * incidentally exercised.
 */

describe('toRadians / toDegrees', () => {
  it('round-trips', () => {
    for (const deg of [0, 30, 45, 90, 180, 360]) {
      expect(toDegrees(toRadians(deg))).toBeCloseTo(deg, 9);
    }
  });

  it('converts the known identities', () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI, 12);
    expect(toDegrees(Math.PI / 2)).toBeCloseTo(90, 12);
  });
});

describe('angleOfRefraction — Snell\'s law', () => {
  it('bends toward the normal entering a denser medium', () => {
    // air (1.00) -> glass (1.50) at 30°: textbook value ~19.47°.
    const r = angleOfRefraction(1, 1.5, 30);
    expect(r.angleDeg).toBeCloseTo(19.4712, 3);
    expect(r.totalInternalReflection).toBe(false);
  });

  it('bends away from the normal entering a rarer medium', () => {
    // glass (1.50) -> air (1.00) at 20°: textbook value ~30.87°.
    const r = angleOfRefraction(1.5, 1, 20);
    expect(r.angleDeg).toBeCloseTo(30.8659, 3);
    expect(r.totalInternalReflection).toBe(false);
  });

  it('passes straight through when the media match', () => {
    // Same index on both sides => no bending at any angle.
    for (const angle of [0, 15, 45, 80]) {
      const r = angleOfRefraction(1.5, 1.5, angle);
      expect(r.angleDeg).toBeCloseTo(angle, 9);
      expect(r.totalInternalReflection).toBe(false);
    }
  });

  it('reports 0° for normal incidence regardless of media', () => {
    // At exactly 0° there is no refraction at all, even across a big step.
    const r = angleOfRefraction(1, 2.4, 0);
    expect(r.angleDeg).toBeCloseTo(0, 9);
  });

  it('is reversible — swapping the media inverts the step', () => {
    const down = angleOfRefraction(1, 1.5, 30);
    const up = angleOfRefraction(1.5, 1, down.angleDeg);
    expect(up.angleDeg).toBeCloseTo(30, 6);
  });

  describe('total internal reflection', () => {
    it('occurs beyond the critical angle (denser -> rarer)', () => {
      // Glass -> air, critical angle is ~41.81°.
      const r = angleOfRefraction(1.5, 1, 45);
      expect(r.totalInternalReflection).toBe(true);
      expect(r.criticalAngleDeg).toBeCloseTo(41.8103, 3);
    });

    it('does NOT occur just below the critical angle', () => {
      const r = angleOfRefraction(1.5, 1, 41);
      expect(r.totalInternalReflection).toBe(false);
      // Just under the critical angle the ray grazes almost along the boundary.
      // The exact value at 41° is ~79.77°, so assert against that rather than a
      // guessed round number — an assertion that is nearly-right is how a test
      // starts lying.
      expect(r.angleDeg).toBeCloseTo(79.7654, 3);
      expect(r.angleDeg).toBeLessThan(90);
    });

    it('never occurs going from rarer to denser', () => {
      // The critical angle is undefined in this direction, and even a grazing
      // 89.9° incidence refracts rather than reflecting internally.
      const r = angleOfRefraction(1, 1.5, 89.9);
      expect(r.totalInternalReflection).toBe(false);
      expect(r.criticalAngleDeg).toBeNull();
    });

    it('never occurs between identical media', () => {
      const r = angleOfRefraction(1.5, 1.5, 89.9);
      expect(r.totalInternalReflection).toBe(false);
      expect(r.criticalAngleDeg).toBeNull();
    });
  });

  it('throws on a non-physical refractive index', () => {
    // n < 1 would mean faster-than-light phase velocity in the medium.
    expect(() => angleOfRefraction(0.5, 1.5, 30)).toThrow(/>= 1/);
    expect(() => angleOfRefraction(1, 0.9, 30)).toThrow(/>= 1/);
  });

  it('throws on non-finite input rather than returning NaN', () => {
    expect(() => angleOfRefraction(NaN, 1.5, 30)).toThrow(/finite/);
    expect(() => angleOfRefraction(1, 1.5, Infinity)).toThrow(/finite/);
  });

  it('clamps at exactly the critical angle instead of yielding NaN', () => {
    // At precisely θc the refraction angle is 90°. Floating-point rounding can
    // push the asin argument marginally above 1; the result must stay finite.
    const crit = criticalAngle(1.5, 1)!;
    const r = angleOfRefraction(1.5, 1, crit);
    expect(Number.isFinite(r.angleDeg)).toBe(true);
    expect(r.angleDeg).toBeCloseTo(90, 6);
  });
});

describe('criticalAngle', () => {
  it('returns null when no TIR is possible', () => {
    expect(criticalAngle(1, 1.5)).toBeNull();
    expect(criticalAngle(1.5, 1.5)).toBeNull();
  });

  it('matches the known glass/air value', () => {
    expect(criticalAngle(1.5, 1)!).toBeCloseTo(41.8103, 3);
  });

  it('shrinks toward 0 as the density step grows', () => {
    // A larger n1/n2 ratio bends more, so the critical angle is reached sooner.
    const a = criticalAngle(1.5, 1)!;
    const b = criticalAngle(2.4, 1)!;
    expect(b).toBeLessThan(a);
    expect(b).toBeGreaterThan(0);
  });
});

describe('thinLens — 1/f = 1/u + 1/v', () => {
  it('forms a real, inverted, diminished image (u > 2f)', () => {
    const r = thinLens(10, 30) as LensResult;
    expect(r.imageDistance).toBeCloseTo(15, 9);
    expect(r.magnification).toBeCloseTo(-0.5, 9);
    expect(r.real).toBe(true);
    expect(r.upright).toBe(false);
    expect(r.enlarged).toBe(false);
  });

  it('forms a real, inverted, enlarged image (f < u < 2f)', () => {
    const r = thinLens(10, 15) as LensResult;
    expect(r.imageDistance).toBeCloseTo(30, 9);
    expect(r.magnification).toBeCloseTo(-2, 9);
    expect(r.real).toBe(true);
    expect(r.enlarged).toBe(true);
  });

  it('forms an image the same size at u = 2f', () => {
    const r = thinLens(10, 20) as LensResult;
    expect(r.imageDistance).toBeCloseTo(20, 9);
    expect(r.magnification).toBeCloseTo(-1, 9);
    expect(r.enlarged).toBe(false); // |m| === 1 is not "enlarged"
  });

  it('forms a virtual, upright, enlarged image (u < f)', () => {
    // The magnifying-glass case: object inside the focal length.
    const r = thinLens(10, 5) as LensResult;
    expect(r.imageDistance).toBeCloseTo(-10, 9);
    expect(r.magnification).toBeCloseTo(2, 9);
    expect(r.real).toBe(false);
    expect(r.upright).toBe(true);
    expect(r.enlarged).toBe(true);
  });

  it('forms a virtual, upright image with a diverging lens (f < 0)', () => {
    const r = thinLens(-15, 30) as LensResult;
    expect(r.imageDistance).toBeCloseTo(-10, 9);
    expect(r.real).toBe(false);
    expect(r.upright).toBe(true);
  });

  it('returns NO_SOLUTION when the object sits at the focal point', () => {
    // Rays emerge parallel; the image is at infinity and v is undefined.
    expect(thinLens(10, 10)).toBe(NO_SOLUTION);
    expect(thinLens(-20, -20)).toBe(NO_SOLUTION);
  });

  it('approaches the focal length as the object recedes to infinity', () => {
    // A very distant object images almost exactly at the focal plane.
    const r = thinLens(10, 1e6) as LensResult;
    expect(r.imageDistance).toBeCloseTo(10, 3);
  });

  it('throws on a zero focal length', () => {
    expect(() => thinLens(0, 30)).toThrow(/focal length 0/);
  });

  it('throws on non-finite input', () => {
    expect(() => thinLens(NaN, 30)).toThrow(/finite/);
    expect(() => thinLens(10, Infinity)).toThrow(/finite/);
  });

  it('is consistent with the 1/v = 1/f - 1/u definition', () => {
    // Independently recompute from the defining equation rather than trusting
    // the implementation's own algebra.
    for (const [f, u] of [[10, 30], [10, 5], [-15, 30], [25, 12], [-8, 4]] as const) {
      const r = thinLens(f, u) as LensResult;
      const invV = 1 / f - 1 / u;
      expect(r.imageDistance).toBeCloseTo(1 / invV, 6);
      expect(r.magnification).toBeCloseTo(-r.imageDistance / u, 6);
    }
  });
});

describe('imageDistanceFor', () => {
  it('returns the distance for a solvable case', () => {
    expect(imageDistanceFor(10, 30)).toBeCloseTo(15, 9);
  });

  it('returns NO_SOLUTION at the focal point', () => {
    expect(imageDistanceFor(10, 10)).toBe(NO_SOLUTION);
  });
});

describe('angleOfReflection', () => {
  it('equals the angle of incidence', () => {
    expect(angleOfReflection(35)).toBe(35);
    expect(angleOfReflection(0)).toBe(0);
    expect(angleOfReflection(89.9)).toBeCloseTo(89.9, 9);
  });

  it('normalises a negative angle to its magnitude', () => {
    expect(angleOfReflection(-35)).toBe(35);
  });

  it('throws on non-finite input', () => {
    expect(() => angleOfReflection(NaN)).toThrow(/finite/);
  });
});

describe('reflectOffHorizontal — ray model', () => {
  it('negates the y component and preserves x', () => {
    expect(reflectOffHorizontal({ x: 1, y: 1 })).toEqual({ x: 1, y: -1 });
    expect(reflectOffHorizontal({ x: 0.5, y: -0.5 })).toEqual({ x: 0.5, y: 0.5 });
  });

  it('leaves a horizontal ray unchanged', () => {
    // Travelling parallel to the surface, reflection does nothing.
    // NOTE: the y result is `-0`, not `0` — negating zero yields negative zero,
    // and `Object.is(-0, 0)` is false, so `toEqual` would reject the correct
    // value. Compare numerically instead. This is the same trap that bit the
    // `Math.sign` property test; it is a test artefact, not a code defect.
    const r = reflectOffHorizontal({ x: 1, y: 0 });
    expect(r.x).toBe(1);
    // Use toBeCloseTo, not toBe: `toBe` is Object.is, which distinguishes -0
    // from 0. The magnitude is what physics cares about.
    expect(r.y).toBeCloseTo(0, 12);
    // And document the sign explicitly, so the intent is unambiguous.
    expect(Object.is(r.y, -0)).toBe(true);
  });

  it('reverses a ray hitting the surface head-on', () => {
    // Straight down the normal reflects straight back up.
    expect(reflectOffHorizontal({ x: 0, y: 1 })).toEqual({ x: 0, y: -1 });
  });

  it('preserves direction magnitude (energy is not created)', () => {
    const before = { x: 3, y: 4 };
    const after = reflectOffHorizontal(before);
    const mag = (v: { x: number; y: number }) => Math.hypot(v.x, v.y);
    expect(mag(after)).toBeCloseTo(mag(before), 12);
  });

  it('throws on non-finite input', () => {
    expect(() => reflectOffHorizontal({ x: NaN, y: 1 })).toThrow(/finite/);
  });
});

describe('describeImage', () => {
  it('describes a real inverted diminished image', () => {
    expect(describeImage(thinLens(10, 30) as LensResult)).toBe('real, inverted, diminished');
  });

  it('describes a real inverted enlarged image', () => {
    expect(describeImage(thinLens(10, 15) as LensResult)).toBe('real, inverted, enlarged');
  });

  it('describes a virtual upright enlarged image', () => {
    expect(describeImage(thinLens(10, 5) as LensResult)).toBe('virtual, upright, enlarged');
  });

  it('describes a same-size image at u = 2f', () => {
    expect(describeImage(thinLens(10, 20) as LensResult)).toBe('real, inverted, same size');
  });
});
