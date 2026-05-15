import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "microsoft",
  name: "Microsoft Phi",
  url: "https://azure.microsoft.com/en-us/products/phi",
  api_docs:
    "https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure?pivots=phi",
  apis: {
    openai: "https://models.inference.ai.azure.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs: Microsoft Azure Phi product page
//   https://azure.microsoft.com/en-us/products/phi
// - Model IDs: GitHub Models API https://models.github.ai/v1/models
// - Pricing: Azure Retail Prices API
//   https://prices.azure.com/api/retail/prices?productName=Azure%20Phi%20Models
//
// Microsoft Phi models, produced by Microsoft. Available via Azure MaaS
// (Model as a Service) and GitHub Models.
// Pricing is in USD per 1M tokens (Azure eastus standard MaaS).
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from Azure Retail Prices API
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Phi-4 series
  "microsoft-phi-4": { currency: "USD", input: 0.125, output: 0.5 },
  "microsoft-phi-4-mini": { currency: "USD", input: 0.075, output: 0.3 },
  "microsoft-phi-4-mini-reasoning": { currency: "USD", input: 0.075, output: 0.3 },
  "microsoft-phi-4-reasoning": { currency: "USD", input: 0.125, output: 0.5 },
  "microsoft-phi-4-reasoning-plus": { currency: "USD", input: 0.125, output: 0.5 },
  "microsoft-phi-4-mini-multimodal": { currency: "USD", input: 0.08, output: 0.32 },
  // Phi-3.5 series (deprecated)
  "microsoft-phi-3.5-mini": { currency: "USD", input: 0.13, output: 0.52 },
  "microsoft-phi-3.5-moe": { currency: "USD", input: 0.16, output: 0.64 },
  "microsoft-phi-3.5-vision": { currency: "USD", input: 0.13, output: 0.52 },
  // Phi-3 series (deprecated)
  "microsoft-phi-3-medium": { currency: "USD", input: 0.17, output: 0.68 },
  "microsoft-phi-3-small": { currency: "USD", input: 0.15, output: 0.6 },
  "microsoft-phi-3-mini": { currency: "USD", input: 0.13, output: 0.52 },
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

  // --- Phi-4 series (current) ---

  models.push(
    defineModel({
      id: "microsoft-phi-4",
      name: "Phi-4",
      family: "phi",
      temperature: true,
      tool_call: true,
      limit: { context: 16384, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["microsoft-phi-4"] as Pricing,
      release_date: "2024-12-12",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "microsoft-phi-4-mini",
      name: "Phi-4 Mini",
      family: "phi",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["microsoft-phi-4-mini"] as Pricing,
      release_date: "2025-02-26",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "microsoft-phi-4-mini-reasoning",
      name: "Phi-4 Mini Reasoning",
      family: "phi",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["microsoft-phi-4-mini-reasoning"] as Pricing,
      release_date: "2025-03-20",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "microsoft-phi-4-reasoning",
      name: "Phi-4 Reasoning",
      family: "phi",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 16384, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["microsoft-phi-4-reasoning"] as Pricing,
      release_date: "2025-04-15",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "microsoft-phi-4-reasoning-plus",
      name: "Phi-4 Reasoning Plus",
      family: "phi",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 16384, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["microsoft-phi-4-reasoning-plus"] as Pricing,
      release_date: "2025-04-15",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "microsoft-phi-4-mini-multimodal",
      name: "Phi-4 Mini Multimodal",
      family: "phi",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text", "image", "audio"], output: ["text"] },
      pricing: HARDCODED_PRICING["microsoft-phi-4-mini-multimodal"] as Pricing,
      release_date: "2025-02-26",
      last_updated: today,
    }),
  );

  // --- Phi-3.5 series (deprecated) ---

  models.push(
    defineModel({
      id: "microsoft-phi-3.5-mini",
      name: "Phi-3.5 Mini",
      family: "phi",
      temperature: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["microsoft-phi-3.5-mini"] as Pricing,
      release_date: "2024-08-20",
      last_updated: today,
      deprecated: true,
    }),
  );

  models.push(
    defineModel({
      id: "microsoft-phi-3.5-moe",
      name: "Phi-3.5 MoE",
      family: "phi",
      temperature: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["microsoft-phi-3.5-moe"] as Pricing,
      release_date: "2024-08-20",
      last_updated: today,
      deprecated: true,
    }),
  );

  models.push(
    defineModel({
      id: "microsoft-phi-3.5-vision",
      name: "Phi-3.5 Vision",
      family: "phi",
      temperature: true,
      attachment: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["microsoft-phi-3.5-vision"] as Pricing,
      release_date: "2024-08-20",
      last_updated: today,
      deprecated: true,
    }),
  );

  // --- Phi-3 series (deprecated) ---

  models.push(
    defineModel({
      id: "microsoft-phi-3-medium",
      name: "Phi-3 Medium",
      family: "phi",
      temperature: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["microsoft-phi-3-medium"] as Pricing,
      release_date: "2024-04-22",
      last_updated: today,
      deprecated: true,
    }),
  );

  models.push(
    defineModel({
      id: "microsoft-phi-3-small",
      name: "Phi-3 Small",
      family: "phi",
      temperature: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["microsoft-phi-3-small"] as Pricing,
      release_date: "2024-04-22",
      last_updated: today,
      deprecated: true,
    }),
  );

  models.push(
    defineModel({
      id: "microsoft-phi-3-mini",
      name: "Phi-3 Mini",
      family: "phi",
      temperature: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["microsoft-phi-3-mini"] as Pricing,
      release_date: "2024-04-22",
      last_updated: today,
      deprecated: true,
    }),
  );

  console.log(`  Microsoft Phi: ${models.length} models`);

  return { provider, models };
}
