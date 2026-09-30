/**
 * STEMMA types — kept separate from LearningHub's internal models.
 *
 * These mirror the canonical entity shape defined by STEMMA
 * (`../STEMMA/schema/concept.schema.json` + export contract).
 *
 * Version note: the export contract has moved 0.2 → 2.1.0 → 2.2.0. Fields that
 * were present in early exports (`generated_at`) were dropped from the modern
 * contract; fields such as `content_hash`, `kernel_version` and
 * `relation_registry_version` were added. Only the minimum required by this
 * consumer is modelled — everything else is optional so a newer producer does
 * not break this consumer (see ADR-023).
 *
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
  learning_objectives?: string[];
  real_world_applications?: string[];
  provenance?: LhsProvenance;
  relationships?: LhsRelationship[];
}

/**
 * The STEMMA export envelope.
 *
 * `export_version` and `schema_version` are the contract guards and are always
 * present. `generated_at` was present in the 0.2 contract and is ABSENT from the
 * 2.x contract — it is therefore optional. Modern metadata (`content_hash`,
 * `kernel_version`, `relation_registry_version`) is optional and only surfaced
 * when present.
 */
export interface LhsKnowledgeExport {
  export_version: string;
  schema_version: string;
  /** Present in the 0.2 contract; absent from 2.x. Optional by design. */
  generated_at?: string;
  source?: string;
  entity_count?: number;
  entities: LhsEntity[];
  /** Modern 2.x metadata — optional. */
  content_hash?: string;
  kernel_version?: string;
  relation_registry_version?: string;
}

export interface LhsExportMetadata {
  export_version: string;
  schema_version: string;
  /** Absent from the 2.x contract; surfaced as null when unavailable. */
  generated_at: string | null;
  source: string;
  entity_count: number;
  content_hash?: string;
  kernel_version?: string;
}

export interface LhsRelatedEntity {
  relationship: LhsRelationship;
  entity: LhsEntity;
}
