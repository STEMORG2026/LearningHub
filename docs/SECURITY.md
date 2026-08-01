# Security Policy

**Version:** 3.0.0  
**Status:** ENFORCED  
**Owner:** Architecture  
**Applies To:** All code in `packages/*` and `apps/*`  
**Related:** `RULES.md`, `DEPENDENCY_POLICY.md`

---

## Scope

STEM-TUITION handles:
- Student contact information (name, phone, email) via contact forms
- WhatsApp integration for enrollment
- Future: authentication, progress tracking, payments

---

## Current State (Static Hosting)

| Risk | Status | Mitigation |
|------|--------|------------|
| XSS (Cross-Site Scripting) | ✅ Low | No user input rendered without sanitization. Forms submit to WhatsApp, not to a backend. |
| CSRF | ✅ N/A | No forms submit to external endpoints |
| Dependency vulnerabilities | ✅ None | Zero npm/bower dependencies in legacy code |
| Information disclosure | ✅ Low | No sensitive data in client-side code |
| Clickjacking | ⚠️ Medium | Add `X-Frame-Options: SAMEORIGIN` header on deployment |

---

## Rules

### Rule SEC-1: No Secrets in Code
```typescript
// ❌ FORBIDDEN: Hardcoded secrets
const API_KEY = 'sk-abc123...';

// ✅ REQUIRED: Environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) throw new Error('API_KEY not configured');
```

### Rule SEC-2: Input Validation (MANDATORY)
All user input MUST be validated with Zod schemas:

```typescript
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/),
  email: z.string().email().optional(),
  message: z.string().max(1000)
});

function handleContactForm(rawInput: unknown) {
  const parsed = ContactSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new SecurityError('Invalid form data', 'FORM_VALIDATION_FAILED');
  }
  // Process safely
}
```

### Rule SEC-3: XSS Prevention
```typescript
// ❌ FORBIDDEN: innerHTML with user data
element.innerHTML = userInput;

// ✅ REQUIRED: textContent
element.textContent = userInput;

// OR: sanitized HTML
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Rule SEC-4: PII Protection
- ❌ NO Personally Identifiable Information in localStorage
- ❌ NO analytics events containing student names
- ✅ All data transmission MUST use HTTPS in production
- ✅ Session tokens (future) MUST expire after 30 minutes inactive

### Rule SEC-5: CSP Headers (Production)
```nginx
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self';
  frame-ancestors 'none';
" always;
```

### Rule SEC-6: Dependency Security
```bash
# Run before every release
pnpm audit
# Keep dependencies updated
pnpm update --interactive
```

---

## Reporting a Vulnerability

**Current state (solo project):**  
If you find a security issue, contact: gurungsajan0228@gmail.com

**For production deployment:**  
A security.txt file will be added at `/.well-known/security.txt`
