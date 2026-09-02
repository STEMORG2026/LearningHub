---
"@learninghub/acl": patch
"@learninghub/audio-synth": patch
"@learninghub/content-engine": patch
"@learninghub/content-provider": patch
"@learninghub/core": patch
"@learninghub/hover-engine": patch
"@learninghub/interactive-simulations": patch
"@learninghub/lesson-renderer": patch
"@learninghub/quiz-engine": patch
"@learninghub/shell": patch
"@learninghub/simulation-core": patch
"@learninghub/tracer": patch
---

chore(packages): rename @stem-tuition/* package scope to @learninghub/*

The product is now LearningHub; all 12 packages re-scope from the legacy
`@stem-tuition/*` to `@learninghub/*`. No runtime/API behavior change — only the
package identifiers, workspace wiring (turbo/ci/deploy/lockfile), and current-scope
docs update. Consumers must update import specifiers from `@stem-tuition/x` to
`@learninghub/x`. Historical CHANGELOGs/ADRs retain the legacy scope as provenance.