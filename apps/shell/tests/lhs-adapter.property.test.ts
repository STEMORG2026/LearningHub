/**
 * Property-based tests for `compareExportVersions` (T-002).
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * This function decides whether a STEMMA knowledge corpus is acceptable
 * (`lhs-adapter.ts` compares the export version against
 * `MIN_SUPPORTED_EXPORT_VERSION = '2.0.0'`). A wrong answer either accepts a
 * corpus too old to parse, or rejects a perfectly modern one.
 *
 * The example tests pin specific pairs ("2.1.0 vs 2.0.0", etc.). The properties
 * below pin the *algebraic contract* the comparison must satisfy for ALL inputs:
 *
 *   P1  Trichotomy     — exactly one of <, ==, > holds for any pair.
 *   P2  Antisymmetry   — cmp(a,b) === -cmp(b,a).
 *   P3  Reflexivity    — cmp(a,a) === 0, for any well-formed version.
 *   P4  Transitivity   — a<b and b<c implies a<c.
 *   P5  Zero padding   — '2.0' and '2.0.0' compare equal (trailing zeros are
 *                        not significant), which is what a numeric-segment
 *                        comparison is supposed to give.
 *   P6  Sign is meaningful — the sign of the result matches arithmetic ordering
 *                        for single-segment numeric versions.
 *
 * FALSIFIABILITY: P5/P6 fail if the comparison is done lexically rather than
 * numerically (e.g. '10' < '9' as strings); P2 fails if the implementation
 * forgets to negate; P1 fails if the loop exits early with the wrong sign.
 * Verified by mutation — see `scripts/checks/mutants.json` mutant
 * `lhs-adapter:A7-offbyone-compare`.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { compareExportVersions } from '../src/lib/lhs-adapter';

/** A well-formed numeric version string with 1..4 dot-separated segments. */
const versionArb = fc
  .array(fc.nat({ max: 50 }), { minLength: 1, maxLength: 4 })
  .map((parts) => parts.join('.'));

/** The same, but as a numeric tuple so we can reason about expected ordering. */
const versionPartsArb = fc.array(fc.nat({ max: 50 }), { minLength: 1, maxLength: 4 });

/** Compare two numeric tuples the way the spec says it should behave. */
function tupleCompare(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) return Math.sign(diff);
  }
  return 0;
}

describe('compareExportVersions — property-based (T-002)', () => {
  // ── P1: trichotomy ───────────────────────────────────────────────────────
  it('P1: exactly one of <, ==, > holds for any pair', () => {
    fc.assert(
      fc.property(versionArb, versionArb, (a, b) => {
        const result = compareExportVersions(a, b);
        const sign = Math.sign(result);
        // The sign must be one of the three legal values...
        expect([-1, 0, 1]).toContain(sign);
        // ...and it must agree with the individual comparisons.
        const isLess = result < 0;
        const isEqual = result === 0;
        const isGreater = result > 0;
        expect([isLess, isEqual, isGreater].filter(Boolean)).toHaveLength(1);
      }),
      { numRuns: 500 },
    );
  });

  // ── P2: antisymmetry ─────────────────────────────────────────────────────
  it('P2: cmp(a, b) === -cmp(b, a)', () => {
    // NOTE: `-Math.sign(0)` is `-0`, and `Object.is(-0, 0)` is false, so a raw
    // `toBe` on negated signs fails for every equal pair. Normalise with `|| 0`
    // — a test artifact, not a defect in the comparison under test.
    const normalize = (n: number): number => Math.sign(n) || 0;
    fc.assert(
      fc.property(versionArb, versionArb, (a, b) => {
        expect(normalize(compareExportVersions(a, b))).toBe(
          normalize(-compareExportVersions(b, a)),
        );
      }),
      { numRuns: 500 },
    );
  });

  // ── P3: reflexivity ──────────────────────────────────────────────────────
  it('P3: cmp(a, a) === 0', () => {
    fc.assert(
      fc.property(versionArb, (a) => {
        expect(compareExportVersions(a, a)).toBe(0);
      }),
      { numRuns: 300 },
    );
  });

  // ── P4: transitivity ─────────────────────────────────────────────────────
  it('P4: ordering is transitive', () => {
    fc.assert(
      fc.property(versionArb, versionArb, versionArb, (a, b, c) => {
        if (compareExportVersions(a, b) < 0 && compareExportVersions(b, c) < 0) {
          expect(compareExportVersions(a, c)).toBeLessThan(0);
        }
        if (compareExportVersions(a, b) === 0 && compareExportVersions(b, c) === 0) {
          expect(compareExportVersions(a, c)).toBe(0);
        }
      }),
      { numRuns: 500 },
    );
  });

  // ── P5: trailing zeros are not significant ───────────────────────────────
  it('P5: trailing zero segments do not change the result', () => {
    // '2.0' and '2.0.0' must be equal: padding with zeros is numerically no-op.
    fc.assert(
      fc.property(versionPartsArb, fc.integer({ min: 0, max: 3 }), (parts, extraZeros) => {
        const base = parts.join('.');
        const padded = [...parts, ...Array.from({ length: extraZeros }, () => 0)].join('.');
        expect(compareExportVersions(base, padded)).toBe(0);

        // And padding ONE side must not change the sign against a third version.
        const other = parts.map((n) => n + 1).join('.');
        expect(Math.sign(compareExportVersions(base, other))).toBe(
          Math.sign(compareExportVersions(padded, other)),
        );
      }),
      { numRuns: 400 },
    );
  });

  // ── P6: numeric, not lexical ─────────────────────────────────────────────
  it('P6: segments compare numerically, not as strings', () => {
    // The classic lexical trap: '10' < '9' as strings, but 10 > 9 numerically.
    fc.assert(
      fc.property(versionPartsArb, versionPartsArb, (a, b) => {
        const va = a.join('.');
        const vb = b.join('.');
        expect(Math.sign(compareExportVersions(va, vb))).toBe(tupleCompare(a, b));
      }),
      { numRuns: 500 },
    );
  });

  // ── P7: a concrete regression anchor for the real floor ──────────────────
  it('P7: every version at or above the 2.0.0 floor compares >= 0 against it', () => {
    const FLOOR = '2.0.0';
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 40 }), fc.nat({ max: 40 }), (major, minor) => {
        // Anything >= 2.x.y must be accepted (not below the floor).
        const candidate = `${major}.${minor}.0`;
        expect(compareExportVersions(candidate, FLOOR)).toBeGreaterThanOrEqual(0);
        // Anything below major 2 must be rejected.
        if (major < 2) {
          expect(compareExportVersions(candidate, FLOOR)).toBeLessThan(0);
        }
      }),
      { numRuns: 300 },
    );
  });

  it('P7b: versions strictly below the floor are rejected', () => {
    const FLOOR = '2.0.0';
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1 }), fc.nat({ max: 99 }), (major, minor) => {
        expect(compareExportVersions(`${major}.${minor}.0`, FLOOR)).toBeLessThan(0);
      }),
      { numRuns: 200 },
    );
  });

  // ── P8: malformed input degrades, never throws ───────────────────────────
  it('P8: malformed versions never throw', () => {
    // The documented contract is narrow: a NON-NUMERIC segment parses as 0
    // ("so a malformed version degrades to 'too old' rather than throwing").
    // Note the property below is deliberately NOT "any string is too old" —
    // `'3'` and `'5junk'` are legitimately newer than 2.0.0, because
    // parseInt('3') and parseInt('5junk') are real numbers. Only input whose
    // LEADING segment is non-numeric degrades to 0 and lands below the floor.
    fc.assert(
      fc.property(fc.string({ maxLength: 10 }), (junk) => {
        expect(() => compareExportVersions(junk, '2.0.0')).not.toThrow();
        expect(Number.isFinite(compareExportVersions(junk, '2.0.0'))).toBe(true);
      }),
      { numRuns: 300 },
    );
  });

  it('P8b: input whose leading segment is non-numeric degrades below the floor', () => {
    // Constructed so the FIRST segment cannot parse as a number — e.g. 'abc',
    // 'x.y', ''. This is the case the degradation contract actually covers.
    const nonNumericLead = fc
      .stringMatching(/^[a-zA-Z_+-][a-zA-Z0-9_+-]*$/)
      .filter((s) => Number.isNaN(Number.parseInt(s, 10)))
      .chain((lead) =>
        fc.array(fc.nat({ max: 9 }), { maxLength: 3 }).map((rest) => [lead, ...rest].join('.')),
      );

    fc.assert(
      fc.property(nonNumericLead, (junk) => {
        expect(compareExportVersions(junk, '2.0.0')).toBeLessThan(0);
      }),
      { numRuns: 300 },
    );
  });
});
