import { describe, it, expect } from 'vitest';
import { createSubscription, cancelSubscription, getSubscription, getUserSubscriptions, createTransaction, completeTransaction } from '../src/internal/payments';
import { isSubscriptionActive, getTierPrice } from '../src/types';

describe('payments', () => {
  it('creates a subscription', () => {
    const sub = createSubscription('user-1', 'student');
    expect(sub.tier).toBe('student');
    expect(sub.status).toBe('active');
    expect(sub.userId).toBe('user-1');
  });

  it('cancels a subscription', () => {
    const sub = createSubscription('user-2', 'teacher');
    const canceled = cancelSubscription(sub.id);
    expect(canceled).not.toBeNull();
    expect(canceled!.status).toBe('canceled');
  });

  it('returns null for nonexistent subscription', () => {
    expect(getSubscription('nope')).toBeNull();
  });

  it('gets user subscriptions', () => {
    const subs = getUserSubscriptions('user-1');
    expect(subs.length).toBeGreaterThanOrEqual(1);
  });

  it('creates a transaction', () => {
    const tx = createTransaction('user-1', 9.99, 'USD', 'Monthly subscription');
    expect(tx.amount).toBe(9.99);
    expect(tx.status).toBe('pending');
  });

  it('completes a transaction', () => {
    const tx = createTransaction('user-1', 19.99, 'USD', 'Teacher plan');
    const completed = completeTransaction(tx.id);
    expect(completed!.status).toBe('completed');
  });

  describe('helpers', () => {
    it('isSubscriptionActive returns true for active sub', () => {
      const sub = createSubscription('user-3', 'student');
      expect(isSubscriptionActive(sub)).toBe(true);
    });

    it('isSubscriptionActive returns false for canceled sub', () => {
      const sub = createSubscription('user-4', 'student');
      cancelSubscription(sub.id);
      expect(isSubscriptionActive(sub)).toBe(false);
    });

    it('isSubscriptionActive returns false for null', () => {
      expect(isSubscriptionActive(null)).toBe(false);
    });

    it('getTierPrice returns correct price', () => {
      expect(getTierPrice('free')).toBe(0);
      expect(getTierPrice('student')).toBe(9.99);
      expect(getTierPrice('teacher')).toBe(19.99);
    });
  });
});
