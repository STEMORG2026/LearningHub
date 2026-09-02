/**
 * @learninghub/content-engine
 *
 * General-purpose content-production engine (architecture v2, N1–N6).
 *
 * The seam (N1–N3): request model (ContentRequest), declarative format contract
 * (FormatSpec + registry), the Blueprint plan, hard-gate verification (deterministic
 * validators + LLM-agnostic verifier seam including intent/essence) and repair routing.
 *
 * The live pipeline (N4): `produce` drives Request → Blueprint → FormatGenerator →
 * deterministic + semantic verification → targeted repair → publish/hold/reject. It is
 * LLM-agnostic: semantic boundaries are injected callbacks, so it runs testably without
 * a network and a real runner (workflow/litellm/…) supplies those callbacks.
 *
 * Additive formats (N5): register any non-narrative FormatSpec (e.g. `quiz`) in the
 * registry with zero core change — see `formats.ts`.
 *
 * Nothing here touches the DOM or the live renderer.
 */
export * from './request';
export * from './formats';
export * from './blueprint';
export * from './verification';
export * from './pipeline';