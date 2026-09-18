/**
 * Inquiry message builder — pure, DOM-free.
 *
 * Turns the contact form fields into a pre-filled WhatsApp message so a lead is
 * never silently dropped (see docs/IMPLEMENTATION-PLAN.md W1.2). No network call,
 * no backend — the message is handed to a `wa.me` link, which matches the
 * workspace OUT-of-scope rules (no form-backend SaaS).
 */

export interface InquiryFields {
  name: string;
  phone: string;
  grade: string;
  message: string;
}

const DEFAULT_FIELDS: InquiryFields = {
  name: '',
  phone: '',
  grade: '',
  message: '',
};

/**
 * Build a human-readable, structured WhatsApp inquiry message.
 *
 * Always leads with the brand greeting; empty fields are rendered as `—` so the
 * owner can see at a glance what the prospective student left out (rather than
 * producing a broken-looking message).
 */
export function buildInquiryMessage(fields: Partial<InquiryFields>): string {
  const f: InquiryFields = { ...DEFAULT_FIELDS, ...fields };

  const lines: string[] = [
    'Hi LearningHub Pokhara! I would like to inquire about classes.',
    `Name: ${f.name.trim() || '—'}`,
    `Phone/WhatsApp: ${f.phone.trim() || '—'}`,
    `Program: ${f.grade.trim() || '—'}`,
  ];

  const message = f.message.trim();
  if (message) {
    lines.push(`Message: ${message}`);
  }

  return lines.join('\n');
}