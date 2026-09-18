# @learninghub/payments

All notable changes to this package will be documented in this file.

## 1.0.0 — 2026-09-19

### Added
- Initial release: createSubscription, cancelSubscription, getSubscription, getUserSubscriptions
- Transaction management: createTransaction, completeTransaction
- Tier pricing and subscription status helpers
- EventBus integration (payments:subscription-created, payments:subscription-canceled, payments:transaction-created, payments:transaction-completed)
- Tracer instrumentation via tracedCreateSubscription, tracedCreateTransaction
- 11 unit tests
