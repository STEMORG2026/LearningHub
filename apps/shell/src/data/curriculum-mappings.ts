/**
 * Curriculum mappings — local consumer data (no STEMMA dependency).
 * Stub: no curriculum data available.
 */

export interface CurriculumInfo {
  id: string;
  name: string;
  region: string;
}

export type CurriculumId = string;

export const CURRICULUMS: Record<string, CurriculumInfo> = {};

export function getAvailableCurricula(): CurriculumInfo[] {
  return [];
}
