/**
 * optics-physics — pure, testable optics formulas.
 *
 * WHY THIS IS A SEPARATE MODULE
 * -----------------------------
 * ADR-015 Follow-up #3:
 *
 *   "If a third simulation is added, extract the inline formula into a testable
 *    pure function before the pattern sets."
 *
 * The first two simulations (`stem-mechanics-sim`, `stem-circuit-sim`) embed
 * their arithmetic directly in `#run()`, where it can only be exercised through
 * the DOM. That is tolerable for `a = F/m` and `I = V/R`, but optics involves
 * sign conventions (real vs virtual, converging vs diverging) that are easy to
 * get subtly wrong and impossible to test properly from inside a click handler.
 *
 * So every formula here is a pure function of its arguments: no DOM, no events,
 * no `this`, no clock. The component is a thin shell that reads inputs, calls
 * these, and renders the result. This mirrors the `simulation-core` design,
 * where physics lives apart from presentation.
 *
 * CONVENTIONS USED THROUGHOUT
 * ---------------------------
 * Angles are in DEGREES at the public boundary (that is what a learner types
 * and what a slider shows) and converted to radians internally only where the
 * trig functions require it.
 *
 * Lengths are in CENTIMETRES for the optics domain, which keeps the numbers
 * comfortable for a classroom (a 10 cm focal length, not 0.1 m).
 *
 * Sign convention is the standard Cartesian one, stated once here so no
 * individual function has to re-explain it:
 *
 *   - Distances are positive when measured in the direction the light travels
 *     (i.e. `u` for a real object is positive).
 *   - `f > 0`  converging lens / concave mirror
 *     `f < 0`  diverging lens / convex mirror
 *   - The thin-lens equation is written as  1/v = 1/f - 1/u,
 *     which yields `v > 0` for a real image and `v < 0` for a virtual image.
 */

/** Sentinel returned when a formula has no finite solution (e.g. rays parallel). */
export const NO_SOLUTION = null;

/** Ratio of a circle's circumference to its diameter — local to avoid Math.PI drift in docs. */
const DEG_PER_RAD = 180 / Math.PI;

export const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
export const toDegrees = (radians: number): number => radians * DEG_PER_RAD;

// ── Refraction (Snell's law) ───────────────────────────────────────────────

export interface RefractionResult {
  /** Angle of refraction, in degrees, measured from the normal. */
  angleDeg: number;
  /** True when light passes from a denser to a rarer medium with no valid refraction. */
  totalInternalReflection: boolean;
  /** The critical angle in degrees, when one exists for this medium pair. */
  criticalAngleDeg: number | null;
}

/**
 * Snell's law:  n₁·sin(θ₁) = n₂·sin(θ₂)
 *
 * Returns the angle of refraction for light crossing from a medium of index
 * `n1` into one of index `n2` at incidence angle `angleDeg` (from the normal).
 *
 * Total internal reflection occurs only when travelling from denser to rarer
 * (n1 > n2) and the incidence angle exceeds the critical angle. In that case
 * there is no refracted ray at all — this is reported explicitly rather than
 * by returning a NaN angle, because "the light does not emerge" is physically
 * meaningful and a caller must be able to distinguish it from bad input.
 *
 * Throws on non-physical input (index of refraction < 1) rather than silently
 * producing a meaningless number.
 */
export function angleOfRefraction(n1: number, n2: number, angleDeg: number): RefractionResult {
  if (!Number.isFinite(n1) || !Number.isFinite(n2) || !Number.isFinite(angleDeg)) {
    throw new Error('angleOfRefraction: all arguments must be finite numbers');
  }
  // A refractive index below 1 is not physical for a passive medium (it would
  // imply faster-than-light phase velocity).
  if (n1 < 1 || n2 < 1) {
    throw new Error('angleOfRefraction: refractive indices must be >= 1');
  }

  const sinTheta1 = Math.sin(toRadians(angleDeg));
  const sinTheta2 = (n1 / n2) * sinTheta1;

  // Critical angle exists only for denser → rarer; it is the incidence angle
  // whose refraction angle would be exactly 90°.
  const criticalAngleDeg =
    n1 > n2 ? toDegrees(Math.asin(Math.min(1, n2 / n1))) : null;

  if (sinTheta2 > 1) {
    // No real refracted ray. The critical angle is guaranteed non-null here
    // because sinTheta2 > 1 is only reachable when n1 > n2.
    return { angleDeg: 0, totalInternalReflection: true, criticalAngleDeg };
  }

  // Floating-point guard: asin of a value a hair above 1 (from rounding at
  // exactly the critical angle) would otherwise be NaN. Clamp into domain.
  const clamped = Math.max(-1, Math.min(1, sinTheta2));
  return {
    angleDeg: toDegrees(Math.asin(clamped)),
    totalInternalReflection: false,
    criticalAngleDeg,
  };
}

/**
 * The critical angle (degrees) for light going from `n1` into `n2`, or `null`
 * when no total internal reflection is possible (n1 <= n2).
 */
export function criticalAngle(n1: number, n2: number): number | null {
  if (n1 <= n2) return null;
  return toDegrees(Math.asin(n2 / n1));
}

// ── Thin lens / mirror equation ────────────────────────────────────────────

export interface LensResult {
  /** Image distance in cm. Positive = real image, negative = virtual image. */
  imageDistance: number;
  /** Magnification: negative means inverted, |m| > 1 means enlarged. */
  magnification: number;
  /** True when the rays actually converge (image is real). */
  real: boolean;
  /** True when the image is upright. */
  upright: boolean;
  /** True when the image is larger than the object. */
  enlarged: boolean;
}

/**
 * The thin-lens equation:  1/f = 1/u + 1/v  →  1/v = 1/f − 1/u
 *
 * `f` is the focal length (positive for a converging lens or concave mirror),
 * `u` is the object distance (positive for a real object), both in cm.
 *
 * Returns `NO_SOLUTION` when `u === f`: the refracted rays are parallel and no
 * image forms at a finite distance. This is the one genuinely unresolvable case
 * and it must not be silently reported as a number.
 *
 * Note that `1/v = 1/f − 1/u` is used rather than the algebraically tidier
 * `v = (u·f)/(u − f)` because the latter divides by zero at `u === f` and loses
 * the sign of the infinity, whereas the reciprocal form makes the singularity
 * explicit and lets us return NO_SOLUTION deliberately.
 */
export function thinLens(f: number, u: number): LensResult | typeof NO_SOLUTION {
  if (!Number.isFinite(f) || !Number.isFinite(u)) {
    throw new Error('thinLens: arguments must be finite numbers');
  }
  if (f === 0) {
    throw new Error('thinLens: focal length 0 is not physical');
  }
  // Object exactly at the focal point → parallel rays → image at infinity.
  if (u === f) return NO_SOLUTION;

  const invV = 1 / f - 1 / u;
  // Guard the degenerate case where f and u are huge and nearly equal: the
  // reciprocal can underflow to 0, which would report an infinite image
  // distance as if it were a number.
  if (invV === 0) return NO_SOLUTION;

  const imageDistance = 1 / invV;
  const magnification = -imageDistance / u;

  return {
    imageDistance,
    magnification,
    real: imageDistance > 0,
    upright: magnification > 0,
    enlarged: Math.abs(magnification) > 1,
  };
}

/**
 * Convenience wrapper: the ray diagram position of the image for a lens, in
 * cm, or `NO_SOLUTION`. Kept separate so a caller that only needs the distance
 * does not have to destructure `thinLens`.
 */
export function imageDistanceFor(f: number, u: number): number | null {
  const r = thinLens(f, u);
  return r === NO_SOLUTION ? NO_SOLUTION : r.imageDistance;
}

// ── Reflection ────────────────────────────────────────────────────────────

/**
 * Law of reflection: the angle of reflection equals the angle of incidence,
 * both measured from the surface normal. Trivial, but stated as a function so
 * the component and its tests share one definition rather than duplicating the
 * identity (and so a future non-flat surface can replace it in one place).
 */
export function angleOfReflection(angleDeg: number): number {
  if (!Number.isFinite(angleDeg)) {
    throw new Error('angleOfReflection: angle must be a finite number');
  }
  return Math.abs(angleDeg);
}

// ── Ray model helper ──────────────────────────────────────────────────────

export interface Vec2 {
  x: number;
  y: number;
}

/**
 * Direction of an incoming ray after specular reflection off a horizontal
 * surface (normal pointing "up", i.e. along −y), where angles are measured
 * from the normal. Used to draw the reflected ray in the ray-model view.
 *
 * The incoming direction is given as a unit-ish vector; only its direction
 * matters. Reflection off a horizontal plane negates the y component:
 *
 *   (dx, dy)  →  (dx, −dy)
 *
 * which is exactly "angle of incidence equals angle of reflection" in vector
 * form.
 */
export function reflectOffHorizontal(direction: Vec2): Vec2 {
  if (!Number.isFinite(direction.x) || !Number.isFinite(direction.y)) {
    throw new Error('reflectOffHorizontal: direction must be finite');
  }
  return { x: direction.x, y: -direction.y };
}

// ── Presentation helper ───────────────────────────────────────────────────

/**
 * Classify a lens result into the vocabulary a learner needs, for the feedback
 * line in the widget. Kept pure and exported so the wording is testable without
 * touching the DOM — and so there is exactly one place that decides what
 * "inverted, real, enlarged" is called.
 */
export function describeImage(result: LensResult): string {
  const parts: string[] = [];
  parts.push(result.real ? 'real' : 'virtual');
  parts.push(result.upright ? 'upright' : 'inverted');
  if (result.enlarged) parts.push('enlarged');
  else if (Math.abs(result.magnification) < 1) parts.push('diminished');
  else parts.push('same size');
  return parts.join(', ');
}
