import { getDefaultEventBus } from '@learninghub/core';
import { traced } from '@learninghub/tracer';
import type { Subscription, Transaction, SubscriptionTier } from '../types';

const subscriptions = new Map<string, Subscription>();
const transactions = new Map<string, Transaction>();

export function createSubscription(userId: string, tier: SubscriptionTier): Subscription {
  const sub: Subscription = {
    id: crypto.randomUUID(),
    userId,
    tier,
    status: 'active',
    startedAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  subscriptions.set(sub.id, sub);
  getDefaultEventBus().publish('payments:subscription-created', {
    data: { subscriptionId: sub.id, userId, tier },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return sub;
}

export function cancelSubscription(subscriptionId: string): Subscription | null {
  const sub = subscriptions.get(subscriptionId);
  if (!sub) return null;
  sub.status = 'canceled';
  subscriptions.set(subscriptionId, sub);
  getDefaultEventBus().publish('payments:subscription-canceled', {
    data: { subscriptionId },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return sub;
}

export function getSubscription(subscriptionId: string): Subscription | null {
  return subscriptions.get(subscriptionId) ?? null;
}

export function getUserSubscriptions(userId: string): Subscription[] {
  return Array.from(subscriptions.values()).filter((s) => s.userId === userId);
}

export function createTransaction(userId: string, amount: number, currency: string, description: string): Transaction {
  const tx: Transaction = {
    id: crypto.randomUUID(),
    userId,
    amount,
    currency,
    status: 'pending',
    description,
    createdAt: Date.now(),
  };
  transactions.set(tx.id, tx);
  getDefaultEventBus().publish('payments:transaction-created', {
    data: { transactionId: tx.id, userId, amount, currency },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return tx;
}

export function completeTransaction(transactionId: string): Transaction | null {
  const tx = transactions.get(transactionId);
  if (!tx) return null;
  tx.status = 'completed';
  transactions.set(transactionId, tx);
  getDefaultEventBus().publish('payments:transaction-completed', {
    data: { transactionId, userId: tx.userId },
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0',
  });
  return tx;
}

export const tracedCreateSubscription = traced('payments:subscription-created', createSubscription);
export const tracedCreateTransaction = traced('payments:transaction-created', createTransaction);
