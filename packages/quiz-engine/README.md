# @stem-tuition/quiz-engine

## Purpose

Interactive STEM quiz engine: typed question data, pure logic validation/scoring, and a `<stem-quiz>` Web Component.

## Public API

- `<stem-quiz>` Web Component (`StemQuiz`)
- Logic: `createQuizState`, `validateAnswer`, `advanceQuestion`, `resetQuiz`, `getCurrentQuestion`
- Rendering: `renderQuestion`, `renderResult`
- Data: `QUIZ_QUESTIONS`, `getQuestionsBySubject`, `getQuestionById`, `getResultMetadata`

## Inputs

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `subject` | string | `'physics'` | STEM subject identifier |
| `use-legacy` | boolean | `false` | Route to legacy quiz via ACL |

## Outputs

| Event | Detail | Description |
|-------|--------|-------------|
| `quiz:answer-submitted` | `{questionId, answer}` | User submitted an answer |
| `quiz:completed` | `{score, total}` | User completed the quiz |

## Public Contracts

- Contract classes: `api`, `event`, `interface`

## Dependencies

- `@stem-tuition/core`, `@stem-tuition/tracer`

## Extension Points

- Add a subject by extending `QUIZ_QUESTIONS` in `src/data.ts` (each question carries concept metadata)
- `internal/` is private — consume only the facade exported from `src/index.ts`

## Examples

```html
<stem-quiz subject="physics"></stem-quiz>
<stem-quiz subject="chemistry"></stem-quiz>
```
