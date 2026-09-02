/**
 * @stem-tuition/content-engine
 *
 * General-purpose content-production engine seam (architecture v2, N1–N3).
 * Pure types + deterministic functions: the request model (ContentRequest), the
 * declarative format contract (FormatSpec + registry), the Blueprint plan, and
 * hard-gate verification (deterministic validators + an LLM-agnostic verifier seam
 * including intent/essence, plus repair routing).
 *
 * Nothing here touches the DOM or the live renderer — it establishes the seam that
 * content production plugs into without changing the 47 published narratives.
 */
export * from './request';
export * from './formats';
export * from './blueprint';
export * from './verification';