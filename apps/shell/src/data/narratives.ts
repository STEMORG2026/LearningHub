/**
 * Authored narrative content — consumer-owned pedagogy layer (loader).
 *
 * Per CONSTITUTION.md §35, the teaching story, history, "what came before",
 * analogies, worked examples, the people who shaped an idea, respected/differing
 * views, and the scaling "Explained" deep-dive is owned by STEM-TUITION, not
 * LearningHubSTEM. These narratives wrap the canonical facts from the knowledge
 * base with the progressive story that makes a concept feel alive, connected and
 * historically honest.
 *
 * Attribution is deliberate: real people are honoured by name with their true
 * roles, their recorded words (sourced) and the timeline of their work. Where
 * history holds multiple respected or differing views, they are each given their
 * due weight rather than flattened. The "Explained" deep-dive starts simple and
 * scales up for enthusiasts, professionals and nerds.
 *
 * Each entry is keyed by the canonical concept id. The narrative layer composes
 * with the canonical fact via `composeNarrativeLesson`.
 *
 * The content is code-split: each batch is its own dynamically imported module so
 * no single built asset exceeds the size budget (bundlesize.config.json: 100 kB
 * gzip). Consumers load it lazily via `getNarratives()` — never by static import.
 */
import type { NarrativeContent } from '@stem-tuition/content-provider';

/**
 * Lazily load every authored narrative, code-splitting each batch into its own
 * chunk so no built asset exceeds the size budget (100 kB gzip per app asset).
 *
 * The batch files (narratives-batch1..8) each export `NARRATIVES_BATCHn`; merging
 * here composes the full authored set without bundling it into the initial chunk.
 */
export async function getNarratives(): Promise<Record<string, NarrativeContent>> {
  const [b1, b2, b3, b4, b5, b6, b7, b8] = await Promise.all([
    import('./narratives-batch1'),
    import('./narratives-batch2'),
    import('./narratives-batch3'),
    import('./narratives-batch4'),
    import('./narratives-batch5'),
    import('./narratives-batch6'),
    import('./narratives-batch7'),
    import('./narratives-batch8'),
  ]);
  return {
    ...b1.NARRATIVES_BATCH1,
    ...b2.NARRATIVES_BATCH2,
    ...b3.NARRATIVES_BATCH3,
    ...b4.NARRATIVES_BATCH4,
    ...b5.NARRATIVES_BATCH5,
    ...b6.NARRATIVES_BATCH6,
    ...b7.NARRATIVES_BATCH7,
    ...b8.NARRATIVES_BATCH8,
  };
}