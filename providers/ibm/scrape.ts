import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "ibm",
  name: "IBM Granite",
  url: "https://www.ibm.com/granite",
  api_docs: "https://www.ibm.com/granite/docs",
  apis: {
    openai: "https://us-south.ml.cloud.ibm.com/ml/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs & pricing: OpenRouter API https://openrouter.ai/api/v1/models
//   (ibm-granite/* models — context windows, max output, USD pricing)
// - Model variants: IBM Granite documentation https://www.ibm.com/granite/docs/models
//   (granite-4.1-3b, granite-4.1-8b, granite-4.1-30b variants)
// - Model descriptions: OpenRouter + IBM Granite docs
//
// IBM Granite is an open-weight model family (Apache 2.0 license).
// IBM's watsonx.ai platform hosts these models but requires authentication.
// Pricing is from OpenRouter which mirrors IBM's specifications.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from OpenRouter
const HARDCODED_PRICING: Record<string, Pricing> = {
  "granite-4.0-h-micro": { currency: "USD", input: 0.02, output: 0.11 },
  "granite-4.1-3b-instruct": { currency: "USD", input: 0.02, output: 0.11 },
  "granite-4.1-8b-instruct": { currency: "USD", input: 0.05, output: 0.1 },
  "granite-4.1-30b-instruct": { currency: "USD", input: 0.2, output: 0.6 },
};

// ---------------------------------------------------------------------------
// Date helper
// ---------------------------------------------------------------------------

function getCurrentDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const today = getCurrentDate();
  const models: Model[] = [];

  // --- Granite 4.0 H Micro (3B params, compact edge model) ---

  models.push(
    defineModel({
      id: "granite-4.0-h-micro",
      name: "Granite 4.0 Micro",
      family: "granite",
      temperature: true,
      tool_call: true,
      open_weights: true,
      limit: { context: 131000, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["granite-4.0-h-micro"] as Pricing,
      release_date: "2025-01-01",
      last_updated: today,
    }),
  );

  // --- Granite 4.1 3B Instruct (compact, edge deployment) ---

  models.push(
    defineModel({
      id: "granite-4.1-3b-instruct",
      name: "Granite 4.1 3B Instruct",
      family: "granite",
      temperature: true,
      tool_call: true,
      open_weights: true,
      limit: { context: 131072, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["granite-4.1-3b-instruct"] as Pricing,
      release_date: "2025-06-01",
      last_updated: today,
    }),
  );

  // --- Granite 4.1 8B Instruct (general-purpose enterprise) ---

  models.push(
    defineModel({
      id: "granite-4.1-8b-instruct",
      name: "Granite 4.1 8B Instruct",
      family: "granite",
      temperature: true,
      tool_call: true,
      structured_output: true,
      open_weights: true,
      limit: { context: 131072, output: 131072 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["granite-4.1-8b-instruct"] as Pricing,
      release_date: "2025-06-01",
      last_updated: today,
    }),
  );

  // --- Granite 4.1 30B Instruct (complex reasoning, specialized tasks) ---

  models.push(
    defineModel({
      id: "granite-4.1-30b-instruct",
      name: "Granite 4.1 30B Instruct",
      family: "granite",
      temperature: true,
      tool_call: true,
      structured_output: true,
      open_weights: true,
      limit: { context: 131072, output: 32768 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["granite-4.1-30b-instruct"] as Pricing,
      release_date: "2025-06-01",
      last_updated: today,
    }),
  );

  console.log(`  IBM Granite: ${models.length} models`);

  return { provider, models };
}
