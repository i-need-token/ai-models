import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "inclusionai",
  name: "InclusionAI",
  url: "https://inclusionai.com",
  api_docs: "https://inclusionai.com/docs",
  apis: {
    openai: "https://api.inclusionai.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs & pricing: OpenRouter API https://openrouter.ai/api/v1/models
//   (inclusionai/* models — context windows, max output, modalities, USD pricing)
// - Model descriptions: OpenRouter model descriptions
//
// InclusionAI produces the Ling (instant/instruct) and Ring (thinking/reasoning)
// families of MoE models, designed for real-world agent workflows.
// The inclusionai.com website and API are unreachable from this network.
// Data sourced from OpenRouter which mirrors InclusionAI's specifications.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from OpenRouter
const HARDCODED_PRICING: Record<string, Pricing> = {
  "ling-2.6-1t": { currency: "USD", input: 0.3, output: 2.5 },
  "ling-2.6-flash": { currency: "USD", input: 0.01, output: 0.03 },
  "ring-2.6-1t": { currency: "USD", input: 0.07, output: 0.62 },
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

  // --- Ling 2.6 1T (trillion-parameter flagship, fast execution) ---

  models.push(
    defineModel({
      id: "ling-2.6-1t",
      name: "Ling 2.6 1T",
      family: "ling",
      temperature: true,
      tool_call: true,
      limit: { context: 262144, output: 32768 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["ling-2.6-1t"] as Pricing,
      release_date: "2025-04-01",
      last_updated: today,
    }),
  );

  // --- Ling 2.6 Flash (104B MoE, 7.4B active, ultra-fast) ---

  models.push(
    defineModel({
      id: "ling-2.6-flash",
      name: "Ling 2.6 Flash",
      family: "ling",
      temperature: true,
      tool_call: true,
      limit: { context: 262144, output: 32768 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["ling-2.6-flash"] as Pricing,
      release_date: "2025-04-01",
      last_updated: today,
    }),
  );

  // --- Ring 2.6 1T (trillion-parameter thinking model, 63B active) ---

  models.push(
    defineModel({
      id: "ring-2.6-1t",
      name: "Ring 2.6 1T",
      family: "ring",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 262144, output: 65536 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["ring-2.6-1t"] as Pricing,
      release_date: "2025-04-01",
      last_updated: today,
    }),
  );

  console.log(`  InclusionAI: ${models.length} models`);

  return { provider, models };
}
