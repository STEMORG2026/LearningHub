# @learninghub/payments

**Version:** 1.0.0

Payment integration — subscriptions, transactions, webhook handling.

## Public API

- `createSubscription(userId, tier)` — Create a new subscription
- `cancelSubscription(subscriptionId)` — Cancel a subscription
- `getSubscription(subscriptionId)` — Get subscription details
- `getUserSubscriptions(userId)` — List all user subscriptions
- `createTransaction(userId, amount, currency, description)` — Create a transaction
- `completeTransaction(transactionId)` — Mark transaction as completed
- `isSubscriptionActive(subscription)` — Check if subscription is active
- `getTierPrice(tier)` — Get price for a tier
- `tracedCreateSubscription`, `tracedCreateTransaction` — Traced wrappers

## Events

- `payments:subscription-created` — Published when subscription is created
- `payments:subscription-canceled` — Published when subscription is canceled
- `payments:transaction-created` — Published when transaction is created
- `payments:transaction-completed` — Published when transaction completes

## Dependencies

- `@learninghub/core` (EventBus)
- `@learninghub/tracer` (instrumentation)
