/**
 * STEMMA types — kept separate from LearningHub's own models.
 *
 * These mirror the canonical entity shape defined by STEMMA
 * (`../STEMMA/schema/concept.schema.json` + export contract v0.1).
 * LearningHub models are NOT reused here: this file is the consumer boundary.
 */

export interface LhsRelationship {
  type: string;
  target: string;
  note?: string;
}

export interface LhsProvenance {
  ai_drafted: boolean;
  source_kind?: string | null;
  source?: string | null;
  reviewer?: string | null;
  reviewed_at?: string | null;
}

export interface LhsEntity {
  id: string;
  type: string;
  name: string;
  domain: string;
  status: string;
  definition: string;
  symbol?: string | null;
  unit?: string | null;
  equation?: string | null;
  common_misconceptions?: string[];
  provenance: LhsProvenance;
  relationships: LhsRelationship[];
}

export interface LhsKnowledgeExport {
  export_version: string;
  schema_version: string;
  generated_at: string;
  source: string;
  entity_count: number;
  entities: LhsEntity[];
}

export interface LhsExportMetadata {
  export_version: string;
  schema_version: string;
  generated_at: string;
  source: string;
  entity_count: number;
}

export interface LhsRelatedEntity {
  relationship: LhsRelationship;
  entity: LhsEntity;
}
