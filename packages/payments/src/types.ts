export type SubscriptionTier = 'free' | 'student' | 'teacher' | 'institution';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'expired';
  startedAt: number;
  expiresAt: number | null;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string;
  createdAt: number;
}

export const TIER_PRICES: Record<SubscriptionTier, number> = {
  free: 0,
  student: 9.99,
  teacher: 19.99,
  institution: 99.99,
};

export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  if (subscription.status !== 'active') return false;
  if (subscription.expiresAt && subscription.expiresAt < Date.now()) return false;
  return true;
}

export function getTierPrice(tier: SubscriptionTier): number {
  return TIER_PRICES[tier];
}
