import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "bytedance",
  name: "ByteDance",
  url: "https://seed.bytedance.com",
  api_docs: "https://www.volcengine.com/docs/82379/1298454",
  apis: {
    openai: "https://ark.cn-beijing.volces.com/api/v3",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs & pricing: OpenRouter API https://openrouter.ai/api/v1/models
//   (bytedance-seed/* and bytedance/ui-tars-* models)
//   — context windows, max output, modalities, USD pricing
// - Model descriptions: OpenRouter model descriptions
//
// ByteDance's Volcengine/Ark API requires authentication.
// The seed.bytedance.com website is CSR and not scrapable from CLI.
// All data sourced from OpenRouter which mirrors ByteDance's model specifications.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from OpenRouter
const HARDCODED_PRICING: Record<string, Pricing> = {
  "seed-1.6": { currency: "USD", input: 0.25, output: 2.0 },
  "seed-1.6-flash": { currency: "USD", input: 0.07, output: 0.3 },
  "seed-2.0-lite": { currency: "USD", input: 0.25, output: 2.0 },
  "seed-2.0-mini": { currency: "USD", input: 0.1, output: 0.4 },
  "ui-tars-1.5-7b": { currency: "USD", input: 0.1, output: 0.2 },
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

  // --- Seed 1.6 (general-purpose multimodal with adaptive deep thinking) ---

  models.push(
    defineModel({
      id: "seed-1.6",
      name: "Seed 1.6",
      family: "seed",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      limit: { context: 262144, output: 32768 },
      modalities: {
        input: ["text", "image", "video"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["seed-1.6"] as Pricing,
      release_date: "2025-03-01",
      last_updated: today,
    }),
  );

  // --- Seed 1.6 Flash (ultra-fast multimodal deep thinking) ---

  models.push(
    defineModel({
      id: "seed-1.6-flash",
      name: "Seed 1.6 Flash",
      family: "seed",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      limit: { context: 262144, output: 32768 },
      modalities: {
        input: ["text", "image", "video"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["seed-1.6-flash"] as Pricing,
      release_date: "2025-03-01",
      last_updated: today,
    }),
  );

  // --- Seed 2.0 Lite (cost-efficient enterprise model, multimodal + agent) ---

  models.push(
    defineModel({
      id: "seed-2.0-lite",
      name: "Seed 2.0 Lite",
      family: "seed",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      limit: { context: 262144, output: 131072 },
      modalities: {
        input: ["text", "image", "video"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["seed-2.0-lite"] as Pricing,
      release_date: "2025-05-01",
      last_updated: today,
    }),
  );

  // --- Seed 2.0 Mini (latency-sensitive, cost-sensitive, 4 reasoning effort modes) ---

  models.push(
    defineModel({
      id: "seed-2.0-mini",
      name: "Seed 2.0 Mini",
      family: "seed",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      limit: { context: 262144, output: 131072 },
      modalities: {
        input: ["text", "image", "video"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["seed-2.0-mini"] as Pricing,
      release_date: "2025-05-01",
      last_updated: today,
    }),
  );

  // --- UI-TARS 1.5 7B (GUI agent model for desktop/web/mobile) ---

  models.push(
    defineModel({
      id: "ui-tars-1.5-7b",
      name: "UI-TARS 1.5 7B",
      family: "ui-tars",
      temperature: true,
      attachment: true,
      limit: { context: 128000, output: 2048 },
      modalities: {
        input: ["text", "image"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["ui-tars-1.5-7b"] as Pricing,
      release_date: "2025-02-01",
      last_updated: today,
    }),
  );

  console.log(`  ByteDance: ${models.length} models`);

  return { provider, models };
}
