# @stem-tuition/quiz-engine

## Purpose
Interactive STEM quiz engine with typed question data, pure logic validation/scoring, and a `<stem-quiz>` Web Component.

## Attributes (Inputs)
| Attribute   | Type     | Default    | Description                     |
|-------------|----------|------------|---------------------------------|
| subject     | string   | 'physics'  | STEM subject identifier         |
| use-legacy  | boolean  | false      | Route to legacy quiz via ACL    |

## Events (Outputs)
| Event               | Detail              | Description                |
|---------------------|---------------------|----------------------------|
| quiz:answer-submitted | {questionId, answer} | User submitted an answer |
| quiz:completed      | {score, total}       | User completed the quiz   |

## Educational Metadata
- Subjects: physics, chemistry, math, computing, pioneers
- 20 questions total (4 per subject)
- Each question tagged with conceptId, prerequisites, grade levels, and misconceptions

## Dependencies
- @stem-tuition/core (Event Bus)
- @stem-tuition/tracer (observability)

## Usage
```html
<stem-quiz subject="physics"></stem-quiz>
<stem-quiz subject="chemistry"></stem-quiz>
```
