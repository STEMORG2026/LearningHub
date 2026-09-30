export type PolicyAction = 'allow' | 'flag' | 'block';

export type ContentCategory =
  | 'safe'
  | 'educational'
  | 'sensitive'
  | 'harmful'
  | 'pii'
  | 'spam';

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  category: ContentCategory;
  action: PolicyAction;
  enabled: boolean;
  priority: number;
}

export interface PolicyCheckResult {
  allowed: boolean;
  action: PolicyAction;
  violations: PolicyViolation[];
  timestamp: number;
}

export interface PolicyViolation {
  ruleId: string;
  ruleName: string;
  category: ContentCategory;
  reason: string;
  confidence: number;
}

export interface ContentPolicyConfig {
  rules: PolicyRule[];
  strictMode: boolean;
  logViolations: boolean;
}

// Frozen so that no code path can mutate a default rule object in place.
// `Object.freeze` is shallow, so each element is frozen too — a policy rule is
// a flat record, so one level is sufficient.
//
// The explicit `PolicyRule[]` annotation on the source array is required: without
// it TS widens `category`/`action` to `string` and the frozen result no longer
// satisfies `readonly PolicyRule[]`.
const DEFAULT_RULE_SOURCE: PolicyRule[] = [
  { id: 'no-pii', name: 'No PII', description: 'Block content containing personally identifiable information', category: 'pii', action: 'block', enabled: true, priority: 100 },
  { id: 'no-harm', name: 'No Harmful Content', description: 'Block harmful or dangerous content', category: 'harmful', action: 'block', enabled: true, priority: 90 },
  { id: 'educational', name: 'Educational Priority', description: 'Allow educational content through', category: 'educational', action: 'allow', enabled: true, priority: 80 },
  { id: 'flag-sensitive', name: 'Flag Sensitive', description: 'Flag sensitive content for review', category: 'sensitive', action: 'flag', enabled: true, priority: 50 },
];

const DEFAULT_RULES: readonly PolicyRule[] = DEFAULT_RULE_SOURCE.map((rule) =>
  Object.freeze(rule),
);

// Every engine gets its OWN copy of the rule records. `DEFAULT_RULES` is
// module-level and shared by every instance, so assigning it by reference (and
// then mutating it via addRule/removeRule/toggleRule) leaks one caller's edits
// into the exported `defaultPolicy` singleton and into every engine created
// afterwards — for the lifetime of the process. In a content-moderation engine
// that means one tenant removing a `no-pii` rule silently disables PII blocking
// for everyone else. Callers that supply their own rules get them cloned too,
// so the engine never mutates an object it does not own.
const cloneRules = (rules: readonly PolicyRule[]): PolicyRule[] => rules.map((rule) => ({ ...rule }));

export class ContentPolicyEngine {
  private config: ContentPolicyConfig;

  constructor(config: Partial<ContentPolicyConfig> = {}) {
    this.config = {
      rules: cloneRules(config.rules ?? DEFAULT_RULES),
      strictMode: config.strictMode ?? false,
      logViolations: config.logViolations ?? true,
    };
  }

  check(input: string): PolicyCheckResult {
    const violations: PolicyViolation[] = [];

    for (const rule of this.config.rules.filter((r) => r.enabled).sort((a, b) => b.priority - a.priority)) {
      const violation = this.evaluateRule(rule, input);
      if (violation) {
        violations.push(violation);
        if (rule.action === 'block') {
          return { allowed: false, action: 'block', violations, timestamp: Date.now() };
        }
      }
    }

    const hasFlag = violations.some((v) => this.config.rules.find((r) => r.id === v.ruleId)?.action === 'flag');
    return {
      allowed: violations.length === 0,
      action: hasFlag ? 'flag' : 'allow',
      violations,
      timestamp: Date.now(),
    };
  }

  private evaluateRule(rule: PolicyRule, input: string): PolicyViolation | null {
    const lower = input.toLowerCase();
    if (rule.category === 'pii' && /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/.test(input)) {
      return { ruleId: rule.id, ruleName: rule.name, category: rule.category, reason: 'Potential PII (credit card pattern)', confidence: 0.8 };
    }
    if (rule.category === 'harmful' && /\b(hack|exploit|malware)\b/.test(lower)) {
      return { ruleId: rule.id, ruleName: rule.name, category: rule.category, reason: 'Potentially harmful content detected', confidence: 0.7 };
    }
    return null;
  }

  addRule(rule: PolicyRule): void {
    // Store a copy, not the caller's object. Otherwise a caller that keeps a
    // reference and later mutates it silently reconfigures this engine's policy.
    this.config.rules.push({ ...rule });
  }

  removeRule(ruleId: string): boolean {
    const idx = this.config.rules.findIndex((r) => r.id === ruleId);
    if (idx >= 0) {
      this.config.rules.splice(idx, 1);
      return true;
    }
    return false;
  }

  toggleRule(ruleId: string): boolean {
    const rule = this.config.rules.find((r) => r.id === ruleId);
    if (rule) {
      rule.enabled = !rule.enabled;
      return true;
    }
    return false;
  }

  get rules(): PolicyRule[] {
    return [...this.config.rules];
  }
}

export const defaultPolicy = new ContentPolicyEngine();
