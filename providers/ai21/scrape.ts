import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "ai21",
  name: "AI21 Labs",
  url: "https://www.ai21.com",
  api_docs: "https://docs.ai21.com",
  apis: {
    openai: "https://api.ai21.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic AI21 scraper
//
// Sources:
// - Model list + pricing: https://api.ai21.com/studio/v1/models (public API)
// - Max output tokens: API docs at https://docs.ai21.com/reference/jamba-1-6-api-ref.md
//   "For Jamba models, the maximum allowed value is 4096 tokens."
// - Model details: https://docs.ai21.com/docs/jamba-foundation-models.md
// - Deprecation info: docs show deprecation dates for older models
//
// The API returns only current (non-deprecated) models with per-token pricing.
// Deprecated models are hardcoded below since the API no longer lists them.
// ---------------------------------------------------------------------------

// Max output tokens for ALL Jamba models (from API docs)
const MAX_OUTPUT_TOKENS = 4096;

// Deprecated models not returned by the API
const DEPRECATED_MODELS: Model[] = [
  defineModel({
    id: "jamba-mini-1.7",
    name: "Jamba Mini 1.7",
    family: "jamba-mini",
    temperature: true,
    deprecated: true,
    open_weights: true,
    limit: { context: 256000, output: MAX_OUTPUT_TOKENS },
    modalities: { input: ["text"], output: ["text"] },
    pricing: { currency: "USD", input: 0.2, output: 0.4 },
    release_date: "2025-07-01",
    last_updated: new Date().toISOString().split("T")[0] as string,
  }),
  defineModel({
    id: "jamba-large-1.6",
    name: "Jamba Large 1.6",
    family: "jamba-large",
    temperature: true,
    deprecated: true,
    open_weights: true,
    limit: { context: 256000, output: MAX_OUTPUT_TOKENS },
    modalities: { input: ["text"], output: ["text"] },
    pricing: { currency: "USD", input: 2, output: 8 },
    release_date: "2025-03-01",
    last_updated: new Date().toISOString().split("T")[0] as string,
  }),
  defineModel({
    id: "jamba-mini-1.6",
    name: "Jamba Mini 1.6",
    family: "jamba-mini",
    temperature: true,
    deprecated: true,
    open_weights: true,
    limit: { context: 256000, output: MAX_OUTPUT_TOKENS },
    modalities: { input: ["text"], output: ["text"] },
    pricing: { currency: "USD", input: 0.2, output: 0.4 },
    release_date: "2025-03-01",
    last_updated: new Date().toISOString().split("T")[0] as string,
  }),
];

// Jamba 3B is self-hosted only (no API endpoint), not in the API response
const JAMBA_3B: Model = defineModel({
  id: "jamba-3b",
  name: "Jamba 3B",
  family: "jamba-3b",
  temperature: true,
  open_weights: true,
  limit: { context: 256000, output: MAX_OUTPUT_TOKENS },
  modalities: { input: ["text"], output: ["text"] },
  pricing: { unit: "free" } as Pricing,
  knowledge: "2024-08-22",
  release_date: "2026-01-01",
  last_updated: new Date().toISOString().split("T")[0] as string,
});

// Map API model IDs to stable model IDs and families
const MODEL_MAP: Record<string, { id: string; name: string; family: string }> = {
  "jamba-large-1.7-2025-07": {
    id: "jamba-large",
    name: "Jamba Large",
    family: "jamba-large",
  },
  "jamba-mini-2-2026-01": {
    id: "jamba-mini",
    name: "Jamba Mini",
    family: "jamba-mini",
  },
};

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const today = new Date().toISOString().split("T")[0] as string;
  const models: Model[] = [];

  // Fetch current models from public API
  const response = await fetch("https://api.ai21.com/studio/v1/models");
  const data = (await response.json()) as {
    data: Array<{
      id: string;
      name: string;
      updated: string;
      context_length: number;
      max_completion_tokens: number;
      pricing: { prompt: string; completion: string };
    }>;
  };

  for (const apiModel of data.data) {
    const mapping = MODEL_MAP[apiModel.id];
    if (!mapping) {
      console.warn(`  AI21: Unknown model ${apiModel.id}, skipping`);
      continue;
    }

    // Convert per-token pricing to per-1M-token
    const promptPerToken = parseFloat(apiModel.pricing.prompt);
    const completionPerToken = parseFloat(apiModel.pricing.completion);
    const inputPerMTokens = Math.round(promptPerToken * 1e6 * 1e6) / 1e6;
    const outputPerMTokens = Math.round(completionPerToken * 1e6 * 1e6) / 1e6;

    // Derive release_date from "updated" field (format: "YYYY-MM")
    const releaseDate = `${apiModel.updated}-01`;

    models.push(
      defineModel({
        id: mapping.id,
        name: mapping.name,
        family: mapping.family,
        temperature: true,
        tool_call: true,
        structured_output: true,
        open_weights: true,
        limit: { context: apiModel.context_length, output: MAX_OUTPUT_TOKENS },
        modalities: { input: ["text"], output: ["text"] },
        pricing: { currency: "USD", input: inputPerMTokens, output: outputPerMTokens },
        knowledge: "2024-08-22",
        release_date: releaseDate,
        last_updated: today,
        snapshots: [{ id: apiModel.id }],
      }),
    );
  }

  // Add Jamba 3B (self-hosted only, not in API)
  models.push(JAMBA_3B);

  // Add deprecated models
  models.push(...DEPRECATED_MODELS);

  console.log(`  AI21 Labs: ${models.length} models`);

  return { provider, models };
}
