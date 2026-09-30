import { describe, it, expect } from 'vitest';
import { ContentPolicyEngine, defaultPolicy } from '../src/policy';

describe('pj-policy', () => {
  describe('defaultPolicy', () => {
    it('allows safe content', () => {
      const result = defaultPolicy.check('Newton\'s second law states that F = m · a.');
      expect(result.allowed).toBe(true);
      expect(result.action).toBe('allow');
      expect(result.violations.length).toBe(0);
    });

    it('blocks PII (credit card pattern)', () => {
      const result = defaultPolicy.check('My card number is 4111 1111 1111 1111');
      expect(result.allowed).toBe(false);
      expect(result.action).toBe('block');
      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.violations[0].category).toBe('pii');
    });

    it('blocks harmful content', () => {
      const result = defaultPolicy.check('Here is how to hack into a system');
      expect(result.allowed).toBe(false);
      expect(result.action).toBe('block');
      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.violations[0].category).toBe('harmful');
    });

    it('returns timestamp in check result', () => {
      const before = Date.now();
      const result = defaultPolicy.check('Safe content');
      expect(result.timestamp).toBeGreaterThanOrEqual(before);
    });
  });

  describe('custom policy', () => {
    it('allows adding custom rules', () => {
      const engine = new ContentPolicyEngine();
      engine.addRule({
        id: 'test-rule',
        name: 'Test Rule',
        description: 'A test rule',
        category: 'spam',
        action: 'flag',
        enabled: true,
        priority: 10,
      });
      expect(engine.rules.length).toBe(5);
    });

    it('allows removing rules', () => {
      const engine = new ContentPolicyEngine();
      const initialCount = engine.rules.length;
      const removed = engine.removeRule('no-pii');
      expect(removed).toBe(true);
      expect(engine.rules.length).toBe(initialCount - 1);
    });

    it('allows toggling rules', () => {
      const engine = new ContentPolicyEngine();
      const before = engine.rules.find((r) => r.id === 'no-harm')?.enabled;
      engine.toggleRule('no-harm');
      const after = engine.rules.find((r) => r.id === 'no-harm')?.enabled;
      expect(after).toBe(!before);
    });

    it('returns false when removing nonexistent rule', () => {
      const engine = new ContentPolicyEngine();
      expect(engine.removeRule('nonexistent')).toBe(false);
    });

    it('returns false when toggling nonexistent rule', () => {
      const engine = new ContentPolicyEngine();
      expect(engine.toggleRule('nonexistent')).toBe(false);
    });
  });

  describe('strictMode', () => {
    it('can be instantiated with strict mode', () => {
      const engine = new ContentPolicyEngine({ strictMode: true });
      const result = engine.check('Some content');
      expect(result).toBeDefined();
    });
  });

  describe('logViolations', () => {
    it('can be instantiated with logViolations disabled', () => {
      const engine = new ContentPolicyEngine({ logViolations: false });
      const result = engine.check('Safe content');
      expect(result.allowed).toBe(true);
    });
  });

  // Regression tests for a production aliasing bug. `DEFAULT_RULES` is a
  // module-level array; assigning it by reference in the constructor and then
  // mutating it in place let one engine's edit corrupt the exported
  // `defaultPolicy` singleton AND every engine built afterwards, for the
  // lifetime of the process. In a content-moderation engine that means one
  // caller removing `no-pii` silently disables PII blocking for everyone else.
  //
  // These tests fail against the pre-fix source (verified by restoring it):
  // rules 4 -> 3 and `check` returning allowed for a credit-card number.
  describe('instance isolation (regression: shared DEFAULT_RULES)', () => {
    it("one engine removing a rule does not affect the module singleton", () => {
      const before = defaultPolicy.rules.length;
      const victim = new ContentPolicyEngine();
      victim.removeRule('no-pii');
      expect(defaultPolicy.rules.length).toBe(before);
      expect(defaultPolicy.rules.some((r) => r.id === 'no-pii')).toBe(true);
    });

    it('an engine created AFTER a mutation still gets the full default rule set', () => {
      new ContentPolicyEngine().removeRule('no-pii');
      const fresh = new ContentPolicyEngine();
      expect(fresh.rules.map((r) => r.id)).toEqual(
        expect.arrayContaining(['no-pii', 'no-harm', 'educational', 'flag-sensitive']),
      );
      expect(fresh.rules.length).toBe(4);
    });

    it('PII blocking survives another engine removing the no-pii rule', () => {
      new ContentPolicyEngine().removeRule('no-pii');
      const fresh = new ContentPolicyEngine();
      const result = fresh.check('My card number is 4111 1111 1111 1111');
      expect(result.allowed).toBe(false);
      expect(result.violations[0].category).toBe('pii');
    });

    it('toggling a rule on one engine does not disable it on another', () => {
      const a = new ContentPolicyEngine();
      a.toggleRule('no-pii');
      const b = new ContentPolicyEngine();
      expect(b.rules.find((r) => r.id === 'no-pii')?.enabled).toBe(true);
    });

    it('the engine does not retain a caller-supplied rule object', () => {
      const engine = new ContentPolicyEngine();
      const external = {
        id: 'external-rule',
        name: 'External',
        description: 'Supplied by a caller',
        category: 'spam' as const,
        action: 'flag' as const,
        enabled: true,
        priority: 10,
      };
      engine.addRule(external);
      external.enabled = false;
      expect(engine.rules.find((r) => r.id === 'external-rule')?.enabled).toBe(true);
    });
  });
});
