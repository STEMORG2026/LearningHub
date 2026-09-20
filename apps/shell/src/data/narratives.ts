/**
 * Narrative content — local consumer data (no STEMMA dependency).
 * Stub: no narrative data available.
 */

export interface NarrativeContent {
  id: string;
  title: string;
  body: string;
}

export async function getNarratives(): Promise<Record<string, NarrativeContent>> {
  return {};
}
