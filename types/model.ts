import type { Pricing } from "./pricing";

/** Supported model modality types */
export type ModelModality = "text" | "image" | "video" | "audio" | "pdf";

/**
 * Model snapshot (a dated version of a model)
 *
 * Different providers use different terminology:
 * - OpenAI: snapshot (e.g., gpt-4o-2024-08-06)
 * - Anthropic: dated model ID / model version (e.g., claude-sonnet-4-5-20250929)
 *
 * Snapshots inherit all parent Model fields and only override what differs.
 * Unspecified fields automatically inherit from the parent model.
 */
export type Snapshot = Partial<Omit<Model, "id" | "snapshots">> & {
  /** Snapshot ID, e.g., "claude-sonnet-4-5-20250929", "gpt-4o-2024-08-06" */
  id: string;
};

export interface Model {
  /** Stable model ID (no date suffix), e.g., "claude-sonnet-4-5", "gpt-4o" */
  id: string;
  /** Display name, e.g., "Claude Sonnet 4.5" */
  name: string;
  /** Model family, e.g., "claude-opus" */
  family: string;

  /** Supports reasoning/thinking mode */
  reasoning?: boolean;
  /** Supports temperature parameter */
  temperature?: boolean;
  /** Supports tool/function calling */
  tool_call?: boolean;
  /** Supports file attachments */
  attachment?: boolean;
  /** Supports structured/JSON output */
  structured_output?: boolean;
  /** Open-weight model */
  open_weights?: boolean;

  /** Deprecated — still accessible but not recommended for new projects */
  deprecated?: boolean;

  /** Pricing */
  pricing: Pricing;

  /** Context and output token limits */
  limit?: {
    /** Context window size (tokens) */
    context: number;
    /** Max output tokens */
    output: number;
  };

  /** Input/output modalities */
  modalities: {
    /** Supported input modalities */
    input: ModelModality[];
    /** Supported output modalities */
    output: ModelModality[];
  };

  /** Training data cutoff (YYYY-MM-DD or YYYY-MM) */
  knowledge?: string;
  /** Model release date (YYYY-MM-DD or YYYY-MM) — omitted if unknown */
  release_date?: string;
  /** Last data update date (YYYY-MM-DD or YYYY-MM) */
  last_updated: string;

  /** Model snapshots, ordered newest-first */
  snapshots?: Snapshot[];
}
