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
    // This test must arrange its OWN state AND use an id no sibling can touch.
    // It previously read whatever another test had left behind for 'user-1',
    // so it passed only when `creates a subscription` happened to run first and
    // failed under shuffled execution.
    //
    // Note `payments.ts` keeps a module-level Map shared by every test in this
    // file, and 'user-1' is also used elsewhere. Reusing it here would mean the
    // count depends on how many siblings already ran — swapping one order
    // dependency for another. A dedicated id makes this test hermetic, so an
    // exact count is safe to assert.
    const USER = 'user-get-subscriptions';

    const first = createSubscription(USER, 'student');
    const second = createSubscription(USER, 'teacher');
    createSubscription('user-get-subscriptions-other', 'teacher');

    const subs = getUserSubscriptions(USER);

    expect(subs.length).toBe(2);
    // Filtering must actually filter. The previous `toBeGreaterThanOrEqual(1)`
    // would also have passed if the function ignored its argument entirely.
    expect(subs.every((s) => s.userId === USER)).toBe(true);
    expect(subs.map((s) => s.id)).toEqual(expect.arrayContaining([first.id, second.id]));
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
