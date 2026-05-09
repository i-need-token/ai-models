import type { Model } from "./model";

/** API format */
export type ApiFormat = "openai" | "anthropic" | "google";

/** API endpoints, keyed by format */
export type ApiEndpoints = Partial<Record<ApiFormat, string>>;

/** Aggregator group (models grouped by original provider) */
export type ProviderGroup = {
  /** Group ID, e.g., "openai", "anthropic" */
  id: string;
  /** Group display name, e.g., "OpenAI", "Anthropic" */
  name: string;
  /** Models in this group */
  models: Model[];
};

/** Provider */
export type Provider = {
  /** Provider ID, e.g., "openai", "anthropic", "openrouter" */
  id: string;
  /** Provider display name, e.g., "OpenAI", "Anthropic", "OpenRouter" */
  name: string;
  /** Official website URL */
  url: string;
  /** API documentation URL */
  api_docs?: string;
  /** API endpoints */
  apis: ApiEndpoints;
  /** Default currency, defaults to "USD" */
  currency?: "USD" | "CNY" | "EUR";
  /** Direct provider models */
  models?: Model[];
  /** Aggregator groups (models from other providers) */
  groups?: ProviderGroup[];
};
