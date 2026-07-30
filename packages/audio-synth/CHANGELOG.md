# @stem-tuition/audio-synth

## 1.0.0

### Major Changes

- Initial release after completing Phases 0-4 of the Strangler Fig migration

  **Phase 1 — Tracer:**

  - Span-based function timing with nesting, error tracking, and event listeners
  - `traced()` wrapper and `@traceDecorator()` for instrumentation
  - `<stem-tracer-dashboard>` Web Component for visualizing span trees
  - `?trace=true` and `?debug_events=true` query params for live debugging

  **Phase 2 — Audio Synth:**

  - 4 pure synthesis functions: spark, collision, explosion, motion-hum
  - AudioEngine with mute/volume/context management
  - ACL adapter bridging legacy globals to AudioEngine

  **Phase 3 — Event Bus + ACL:**

  - EventBus with publish/subscribe/unsubscribe, wildcards (`*`, `domain:*`), BroadcastChannel cross-tab
  - Debug mode via `?debug_events=true`
  - QuizAdapter and CanvasAdapter wrapping legacy globals
  - Shared type definitions (EventPayload, Quiz/Audio/Error data)

  **Phase 4 — Quiz Engine:**

  - Pure quiz logic: create, validate, score, advance, reset
  - Typed quiz data: 5 subjects × 4 questions with educational metadata
  - `<stem-quiz>` Web Component with Shadow DOM and EventBus integration
  - Educational metadata tagging for all quiz content

### Patch Changes

- Updated dependencies
  - @stem-tuition/tracer@1.0.0
  - @stem-tuition/core@1.0.0
