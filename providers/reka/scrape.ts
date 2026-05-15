import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "reka",
  name: "Reka AI",
  url: "https://reka.ai",
  api_docs: "https://docs.reka.ai",
  apis: {
    openai: "https://api.reka.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs & pricing: OpenRouter API https://openrouter.ai/api/v1/models
//   (rekaai/* models — context windows, max output, modalities, USD pricing)
// - Model descriptions: OpenRouter model descriptions
//
// Reka AI produces multimodal AI models with native vision capabilities.
// The API requires authentication. Data sourced from OpenRouter.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from OpenRouter
const HARDCODED_PRICING: Record<string, Pricing> = {
  "reka-flash-3": { currency: "USD", input: 0.1, output: 0.4 },
  "reka-edge-2": { currency: "USD", input: 0.03, output: 0.1 },
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

  // --- Reka Flash 3 (21B MoE, multimodal) ---

  models.push(
    defineModel({
      id: "reka-flash-3",
      name: "Reka Flash 3",
      family: "reka-flash",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 131072, output: 16384 },
      modalities: {
        input: ["text", "image"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["reka-flash-3"] as Pricing,
      release_date: "2025-02-01",
      last_updated: today,
    }),
  );

  // --- Reka Edge 2 (7B, lightweight multimodal) ---

  models.push(
    defineModel({
      id: "reka-edge-2",
      name: "Reka Edge 2",
      family: "reka-edge",
      temperature: true,
      attachment: true,
      open_weights: true,
      limit: { context: 131072, output: 8192 },
      modalities: {
        input: ["text", "image"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["reka-edge-2"] as Pricing,
      release_date: "2025-01-01",
      last_updated: today,
    }),
  );

  console.log(`  Reka AI: ${models.length} models`);

  return { provider, models };
}
