import { describe, it, expect } from 'vitest';
import { buildInquiryMessage } from '../src/lib/inquiry';

describe('buildInquiryMessage', () => {
  it('includes the brand greeting as the first line', () => {
    const msg = buildInquiryMessage({
      name: 'Aarav',
      phone: '+977 9800000000',
      grade: 'SEE Board',
      message: '',
    });
    expect(msg.split('\n')[0]).toBe(
      'Hi LearningHub Pokhara! I would like to inquire about classes.',
    );
  });

  it('renders all populated fields', () => {
    const msg = buildInquiryMessage({
      name: 'Aarav Sharma',
      phone: '+977 9800000000',
      grade: 'SEE Board',
      message: 'I prefer home tuition.',
    });
    expect(msg).toContain('Name: Aarav Sharma');
    expect(msg).toContain('Phone/WhatsApp: +977 9800000000');
    expect(msg).toContain('Program: SEE Board');
    expect(msg).toContain('Message: I prefer home tuition.');
  });

  it('renders missing fields as placeholders, not empty strings', () => {
    const msg = buildInquiryMessage({});
    expect(msg).toContain('Name: —');
    expect(msg).toContain('Phone/WhatsApp: —');
    expect(msg).toContain('Program: —');
    expect(msg).not.toContain('Message:');
  });

  it('omits the message line when message is empty or whitespace', () => {
    const msg = buildInquiryMessage({ name: 'A', message: '   ' });
    expect(msg).not.toContain('Message:');
  });

  it('trims whitespace from field values', () => {
    const msg = buildInquiryMessage({ name: '  Aarav  ' });
    expect(msg).toContain('Name: Aarav');
    expect(msg).not.toContain('Name:   Aarav  ');
  });

  it('ignores unknown/extra fields (only known fields are rendered)', () => {
    const msg = buildInquiryMessage({
      name: 'A',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      phone: 'P',
    } as any);
    expect(msg).toContain('Name: A');
    expect(msg).toContain('Phone/WhatsApp: P');
  });
});