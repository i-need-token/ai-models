import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "xai",
  name: "xAI Grok",
  url: "https://x.ai",
  api_docs: "https://docs.x.ai",
  apis: {
    openai: "https://api.x.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model IDs: GitHub Models API https://models.github.ai/v1/models
// - Pricing: Azure Retail Prices API
//   https://prices.azure.com/api/retail/prices?productName=Azure%20Grok%20Models
// - Model specs: Microsoft Foundry docs (Azure-hosted Grok models)
//
// xAI Grok models, produced by xAI. Available via Azure Foundry and
// the xAI API (docs.x.ai currently unreachable from this network).
// Pricing is in USD per 1M tokens (Azure global standard, eastus region).
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from Azure Retail Prices API (global standard)
const HARDCODED_PRICING: Record<string, Pricing> = {
  "xai-grok-3": { currency: "USD", input: 3.0, output: 15.0 },
  "xai-grok-3-mini": { currency: "USD", input: 0.25, output: 1.27 },
  "xai-grok-4": { currency: "USD", input: 3.0, output: 15.0 },
  "xai-grok-4-fast": { currency: "USD", input: 0.2, output: 0.5 },
  "xai-grok-4.1": { currency: "USD", input: 0.2, output: 0.5 },
  "xai-grok-4.2": { currency: "USD", input: 2.0, output: 6.0 },
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

  // --- Grok-3 (December 2024) ---

  models.push(
    defineModel({
      id: "xai-grok-3",
      name: "Grok-3",
      family: "grok",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      limit: { context: 131072, output: 131072 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["xai-grok-3"] as Pricing,
      release_date: "2024-12-14",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "xai-grok-3-mini",
      name: "Grok-3 Mini",
      family: "grok",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      limit: { context: 131072, output: 131072 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["xai-grok-3-mini"] as Pricing,
      release_date: "2024-12-14",
      last_updated: today,
    }),
  );

  // --- Grok-4 (April 2025) ---

  models.push(
    defineModel({
      id: "xai-grok-4",
      name: "Grok-4",
      family: "grok",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      limit: { context: 131072, output: 131072 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["xai-grok-4"] as Pricing,
      release_date: "2025-04-15",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "xai-grok-4-fast",
      name: "Grok-4 Fast",
      family: "grok",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 131072, output: 131072 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["xai-grok-4-fast"] as Pricing,
      release_date: "2025-04-15",
      last_updated: today,
    }),
  );

  // --- Grok-4.1 (May 2025) ---

  models.push(
    defineModel({
      id: "xai-grok-4.1",
      name: "Grok-4.1",
      family: "grok",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      limit: { context: 131072, output: 131072 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["xai-grok-4.1"] as Pricing,
      release_date: "2025-05-15",
      last_updated: today,
    }),
  );

  // --- Grok-4.2 (May 2025) ---

  models.push(
    defineModel({
      id: "xai-grok-4.2",
      name: "Grok-4.2",
      family: "grok",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      limit: { context: 131072, output: 131072 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["xai-grok-4.2"] as Pricing,
      release_date: "2025-05-15",
      last_updated: today,
    }),
  );

  console.log(`  xAI Grok: ${models.length} models`);

  return { provider, models };
}
