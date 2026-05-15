import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "perplexity",
  name: "Perplexity",
  url: "https://perplexity.ai",
  api_docs: "https://docs.perplexity.ai",
  apis: {
    openai: "https://api.perplexity.ai",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Pricing: Perplexity API documentation (Mintlify)
//   https://docs.perplexity.ai/docs/getting-started/pricing
//   (accessed via GitHub mirror: piercecohen1/perplexity-docs)
// - Model specs: OpenRouter API https://openrouter.ai/api/v1/models
//   (context window sizes for perplexity/* models)
//
// Perplexity Sonar models, produced by Perplexity. These are online
// search-augmented models that ground responses in web sources.
// Pricing is in USD per 1M tokens.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from Perplexity API documentation
const HARDCODED_PRICING: Record<string, Pricing> = {
  sonar: { currency: "USD", input: 1.0, output: 1.0 },
  "sonar-pro": { currency: "USD", input: 3.0, output: 15.0 },
  "sonar-reasoning-pro": { currency: "USD", input: 2.0, output: 8.0 },
  "sonar-deep-research": { currency: "USD", input: 2.0, output: 8.0 },
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

  // --- Sonar (base search model) ---

  models.push(
    defineModel({
      id: "sonar",
      name: "Sonar",
      family: "sonar",
      temperature: true,
      tool_call: true,
      limit: { context: 127072, output: 8192 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["sonar"] as Pricing,
      release_date: "2024-01-01",
      last_updated: today,
    }),
  );

  // --- Sonar Pro (advanced search) ---

  models.push(
    defineModel({
      id: "sonar-pro",
      name: "Sonar Pro",
      family: "sonar",
      temperature: true,
      tool_call: true,
      limit: { context: 200000, output: 8192 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["sonar-pro"] as Pricing,
      release_date: "2024-04-01",
      last_updated: today,
    }),
  );

  // --- Sonar Reasoning Pro (CoT reasoning) ---

  models.push(
    defineModel({
      id: "sonar-reasoning-pro",
      name: "Sonar Reasoning Pro",
      family: "sonar",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 8192 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["sonar-reasoning-pro"] as Pricing,
      release_date: "2024-10-01",
      last_updated: today,
    }),
  );

  // --- Sonar Deep Research (exhaustive research) ---

  models.push(
    defineModel({
      id: "sonar-deep-research",
      name: "Sonar Deep Research",
      family: "sonar",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 8192 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["sonar-deep-research"] as Pricing,
      release_date: "2025-02-01",
      last_updated: today,
    }),
  );

  console.log(`  Perplexity: ${models.length} models`);

  return { provider, models };
}
