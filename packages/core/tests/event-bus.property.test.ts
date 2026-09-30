/**
 * Property-based tests for EventBus pattern matching (T-002).
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The 2026-09-30 adversarial test audit found that `patternToRegex()` — the
 * function that compiles every subscription pattern — could lose its `^...$`
 * anchors or its metacharacter escaping and the entire example-based suite
 * stayed GREEN. Both gaps were closed with three added example tests.
 *
 * Example tests, however, only pin the specific inputs someone thought of. The
 * properties below hold for ALL inputs, which is the class of guarantee the
 * audit could not get from `it('...')` cases alone:
 *
 *   P1  An exact pattern matches only its exact string (anchoring).
 *   P2  A pattern never matches a string it was not built to match
 *       (no accidental regex interpretation of literal metacharacters).
 *   P3  `*` is a true wildcard: it matches any suffix/prefix/infix.
 *   P4  Non-`*` metacharacters are LITERAL (`.`, `+`, `?`, `$`, `(`, `[`, `|`).
 *   P5  `subscribe`/`unsubscribe` round-trips: no leak, no double-delivery.
 *
 * A pattern is matched via the public `subscribe`/`publish` API rather than by
 * exporting the private `patternToRegex` — the export surface is part of the
 * package contract and should not be widened for testing convenience.
 *
 * FALSIFIABILITY: each property below was verified to FAIL when the
 * corresponding mutant is applied (see `scripts/checks/mutants.json`:
 * `event-bus:B3-ungrounded-regex`, `event-bus:B6-no-metachar-escape`).
 * A property that cannot fail is not a test.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { EventBus } from '../src/event-bus';

/** Build a bus, subscribe with `pattern`, publish `type`, report delivery. */
function delivers(pattern: string, type: string): boolean {
  const bus = new EventBus();
  let delivered = false;
  bus.subscribe(pattern, () => {
    delivered = true;
  });
  bus.publish(type, { data: {}, timestamp: new Date().toISOString(), schemaVersion: '1.0' });
  return delivered;
}

/**
 * Alphabets deliberately separated:
 *  - SAFE: characters with no meaning in a regex and no `*` — used for literal
 *    round-trip properties, so the expected result is unambiguous.
 *  - META: characters that ARE regex operators (but not `*`) — used to prove
 *    they are treated as literals.
 */
const SAFE_CHAR = fc.constantFrom(...'abcdefgABC0123456789:-_'.split(''));
const META_CHAR = fc.constantFrom('.', '+', '?', '$', '^', '(', ')', '[', ']', '{', '}', '|', '\\');

const safeString = (minLength = 1, maxLength = 12) =>
  fc.string({ minLength, maxLength, unit: SAFE_CHAR });

describe('EventBus pattern matching — property-based (T-002)', () => {
  // ── P1: anchoring ────────────────────────────────────────────────────────
  it('P1: an exact pattern matches its own string, for any string', () => {
    fc.assert(
      fc.property(safeString(), (s) => {
        expect(delivers(s, s)).toBe(true);
      }),
      { numRuns: 300 },
    );
  });

  it('P1b: an exact pattern does NOT match that string with any suffix appended', () => {
    // This is the property that the `B3-ungrounded-regex` mutant breaks: without
    // `^...$`, `delivers('a.b', 'a.bXYZ')` returns true and this fails.
    fc.assert(
      fc.property(safeString(), safeString(), (base, suffix) => {
        expect(delivers(base, base + suffix)).toBe(false);
      }),
      { numRuns: 300 },
    );
  });

  it('P1c: an exact pattern does NOT match that string with any prefix prepended', () => {
    fc.assert(
      fc.property(safeString(), safeString(), (base, prefix) => {
        expect(delivers(base, prefix + base)).toBe(false);
      }),
      { numRuns: 300 },
    );
  });

  // ── P2 / P4: literal metacharacters ──────────────────────────────────────
  it('P4: metacharacters in a pattern are literal, not regex operators', () => {
    // `B6-no-metachar-escape` breaks this: unescaped `.` becomes "any char", so
    // a pattern `a.c` would also match `axc`.
    fc.assert(
      fc.property(
        fc.array(META_CHAR, { minLength: 1, maxLength: 4 }),
        safeString(0, 3),
        safeString(0, 3),
        (metaChars, left, right) => {
          const pattern = left + metaChars.join('') + right;
          // The pattern must match itself...
          expect(delivers(pattern, pattern)).toBe(true);
        },
      ),
      { numRuns: 300 },
    );
  });

  it('P4b: a literal dot does not act as "any character"', () => {
    fc.assert(
      fc.property(safeString(0, 3), safeString(1, 3), (prefix, other) => {
        const pattern = `a.b${prefix}`;
        // Swap the literal `.` for a different real character — must not match.
        const mutated = `a${other}b${prefix}`;
        if (mutated === pattern) return; // identical string, not a counterexample
        expect(delivers(pattern, mutated)).toBe(false);
      }),
      { numRuns: 300 },
    );
  });

  it('P4c: a literal plus does not act as a quantifier', () => {
    fc.assert(
      fc.property(safeString(), (tail) => {
        const pattern = `x+y${tail}`;
        // `+` as a quantifier would let `x+y...` match `xxy...` or `y...`.
        expect(delivers(pattern, `xxy${tail}`)).toBe(false);
        expect(delivers(pattern, `y${tail}`)).toBe(false);
        expect(delivers(pattern, pattern)).toBe(true);
      }),
      { numRuns: 200 },
    );
  });

  // ── P3: wildcard semantics ───────────────────────────────────────────────
  it('P3: a trailing * matches any suffix', () => {
    fc.assert(
      fc.property(safeString(), safeString(0, 6), (prefix, suffix) => {
        expect(delivers(`${prefix}*`, prefix + suffix)).toBe(true);
      }),
      { numRuns: 300 },
    );
  });

  it('P3b: a trailing * matches the empty suffix too', () => {
    fc.assert(
      fc.property(safeString(), (prefix) => {
        expect(delivers(`${prefix}*`, prefix)).toBe(true);
      }),
      { numRuns: 200 },
    );
  });

  it('P3c: a middle * matches any infix', () => {
    fc.assert(
      fc.property(safeString(), safeString(0, 5), safeString(), (head, mid, tail) => {
        expect(delivers(`${head}*${tail}`, head + mid + tail)).toBe(true);
      }),
      { numRuns: 300 },
    );
  });

  it('P3d: a bare * matches everything', () => {
    fc.assert(
      fc.property(safeString(), (type) => {
        expect(delivers('*', type)).toBe(true);
      }),
      { numRuns: 200 },
    );
  });

  // ── P5: subscribe / unsubscribe round-trip ───────────────────────────────
  it('P5: unsubscribe stops delivery and is idempotent', () => {
    fc.assert(
      fc.property(safeString(), safeString(), (pattern, type) => {
        const bus = new EventBus();
        let calls = 0;
        const unsubscribe = bus.subscribe(pattern, () => {
          calls += 1;
        });

        const deliver = () =>
          bus.publish(type, { data: {}, timestamp: new Date().toISOString(), schemaVersion: '1.0' });

        deliver();
        const afterFirst = calls;

        unsubscribe();
        deliver();
        deliver();

        // No further deliveries after unsubscribing.
        expect(calls).toBe(afterFirst);
        // Unsubscribing again must be harmless.
        expect(() => unsubscribe()).not.toThrow();
      }),
      { numRuns: 200 },
    );
  });

  it('P5b: N subscriptions each receive exactly one delivery per publish', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 8 }), (n) => {
        const bus = new EventBus();
        const counts = Array.from({ length: n }, () => 0);
        counts.forEach((_, i) => {
          bus.subscribe('topic', () => {
            counts[i] = (counts[i] ?? 0) + 1;
          });
        });
        bus.publish('topic', { data: {}, timestamp: new Date().toISOString(), schemaVersion: '1.0' });
        expect(counts).toEqual(Array.from({ length: n }, () => 1));
      }),
      { numRuns: 100 },
    );
  });

  // ── P6: error isolation (REL-004) ────────────────────────────────────────
  it('P6: a throwing subscriber never prevents delivery to later subscribers', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (after) => {
        const bus = new EventBus();
        let reached = 0;
        // The first subscriber always throws.
        bus.subscribe('boom', () => {
          throw new Error('subscriber failure');
        });
        for (let i = 0; i < after; i += 1) {
          bus.subscribe('boom', () => {
            reached += 1;
          });
        }
        bus.publish('boom', { data: {}, timestamp: new Date().toISOString(), schemaVersion: '1.0' });
        expect(reached).toBe(after);
      }),
      { numRuns: 100 },
    );
  });
});
