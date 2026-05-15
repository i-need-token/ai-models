import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "aion",
  name: "Aion Labs",
  url: "https://aionlabs.ai",
  api_docs: "https://docs.aionlabs.ai",
  apis: {
    openai: "https://api.aionlabs.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs & pricing: Aion Labs docs
//   https://docs.aionlabs.ai/models (browser-verified CSR page)
//   https://docs.aionlabs.ai/pricing (browser-verified CSR page)
//
// Pricing is in USD per 1M tokens with separate input/output rates.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from pricing page
const HARDCODED_PRICING: Record<string, Pricing> = {
  "aion-1.0-mini": { currency: "USD", input: 0.7, output: 1.4 },
  "aion-1.0": { currency: "USD", input: 4, output: 8 },
  "aion-2.0": { currency: "USD", input: 0.8, output: 1.6 },
  "aion-2.5": { currency: "USD", input: 1, output: 3 },
  "aion-rp-llama-3.1-8b": { currency: "USD", input: 0.8, output: 1.6 },
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

  // --- Aion 1.0 Mini (128K, cost-efficient) ---

  models.push(
    defineModel({
      id: "aion-1.0-mini",
      name: "Aion 1.0 Mini",
      family: "aion-1.0",
      temperature: true,
      limit: { context: 131072, output: 32768 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["aion-1.0-mini"] as Pricing,
      release_date: "2024-06",
      last_updated: today,
    }),
  );

  // --- Aion 1.0 (128K, flagship) ---

  models.push(
    defineModel({
      id: "aion-1.0",
      name: "Aion 1.0",
      family: "aion-1.0",
      temperature: true,
      limit: { context: 131072, output: 32768 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["aion-1.0"] as Pricing,
      release_date: "2024-06",
      last_updated: today,
    }),
  );

  // --- Aion 2.0 (128K, improved efficiency) ---

  models.push(
    defineModel({
      id: "aion-2.0",
      name: "Aion 2.0",
      family: "aion-2.0",
      temperature: true,
      limit: { context: 131072, output: 32768 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["aion-2.0"] as Pricing,
      release_date: "2025-01",
      last_updated: today,
    }),
  );

  // --- Aion 2.5 (128K, latest) ---

  models.push(
    defineModel({
      id: "aion-2.5",
      name: "Aion 2.5",
      family: "aion-2.5",
      temperature: true,
      limit: { context: 131072, output: 32768 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["aion-2.5"] as Pricing,
      release_date: "2025-04",
      last_updated: today,
    }),
  );

  // --- Aion RP Llama 3.1 8B (32K, roleplay fine-tune of Llama 3.1 8B) ---

  models.push(
    defineModel({
      id: "aion-rp-llama-3.1-8b",
      name: "Aion RP Llama 3.1 8B",
      family: "aion-rp",
      temperature: true,
      limit: { context: 32768, output: 32768 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["aion-rp-llama-3.1-8b"] as Pricing,
      release_date: "2024-09",
      last_updated: today,
    }),
  );

  console.log(`  Aion Labs: ${models.length} models`);

  return { provider, models };
}
