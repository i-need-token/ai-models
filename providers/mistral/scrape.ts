import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "mistral",
  name: "Mistral AI",
  url: "https://mistral.ai",
  api_docs: "https://docs.mistral.ai",
  apis: {
    openai: "https://api.mistral.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model IDs: GitHub Models API https://models.github.ai/v1/models
// - Pricing (most models): AWS Price List API
//   https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/index.json
// - Pricing (Codestral, Doc AI): Azure Retail Prices API
//   https://prices.azure.com/api/retail/prices?productName=Azure%20Mistral%20Models
//
// Mistral AI models, produced by Mistral AI. Available via AWS Bedrock,
// Azure Foundry, and the Mistral API (docs.mistral.ai currently unreachable).
// Pricing is in USD per 1M tokens.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens)
// AWS Bedrock us-east-1 standard on-demand unless noted
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Current models
  "mistral-large": { currency: "USD", input: 2.0, output: 6.0 },
  "mistral-small": { currency: "USD", input: 0.2, output: 0.6 },
  "mistral-nemo": { currency: "USD", input: 0.15, output: 0.15 },
  "mistral-medium": { currency: "USD", input: 0.4, output: 2.0 },
  codestral: { currency: "USD", input: 0.3, output: 0.9 },
  "ministral-3b": { currency: "USD", input: 0.04, output: 0.04 },
  "ministral-8b": { currency: "USD", input: 0.1, output: 0.1 },
  "pixtral-large": { currency: "USD", input: 2.0, output: 6.0 },
  // Deprecated models
  "mistral-large-2407": { currency: "USD", input: 4.0, output: 12.0 },
  "mixtral-8x22b": { currency: "USD", input: 0.8, output: 1.2 },
  "mixtral-8x7b": { currency: "USD", input: 0.45, output: 0.7 },
  "mistral-7b": { currency: "USD", input: 0.15, output: 0.2 },
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

  // --- Mistral Large 3 (March 2025) ---

  models.push(
    defineModel({
      id: "mistral-large",
      name: "Mistral Large",
      family: "mistral",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 128000, output: 8192 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["mistral-large"] as Pricing,
      release_date: "2025-03-18",
      last_updated: today,
    }),
  );

  // --- Mistral Medium (May 2025) ---

  models.push(
    defineModel({
      id: "mistral-medium",
      name: "Mistral Medium",
      family: "mistral",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 8192 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["mistral-medium"] as Pricing,
      release_date: "2025-05-07",
      last_updated: today,
    }),
  );

  // --- Mistral Small (September 2024) ---

  models.push(
    defineModel({
      id: "mistral-small",
      name: "Mistral Small",
      family: "mistral",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 8192 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["mistral-small"] as Pricing,
      release_date: "2024-09-18",
      last_updated: today,
    }),
  );

  // --- Mistral Nemo (July 2024) ---

  models.push(
    defineModel({
      id: "mistral-nemo",
      name: "Mistral Nemo",
      family: "mistral",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["mistral-nemo"] as Pricing,
      release_date: "2024-07-18",
      last_updated: today,
    }),
  );

  // --- Codestral (May 2024) ---

  models.push(
    defineModel({
      id: "codestral",
      name: "Codestral",
      family: "codestral",
      temperature: true,
      limit: { context: 256000, output: 8192 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["codestral"] as Pricing,
      release_date: "2024-05-29",
      last_updated: today,
    }),
  );

  // --- Ministral (September 2024) ---

  models.push(
    defineModel({
      id: "ministral-8b",
      name: "Ministral 8B",
      family: "ministral",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["ministral-8b"] as Pricing,
      release_date: "2024-09-18",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "ministral-3b",
      name: "Ministral 3B",
      family: "ministral",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["ministral-3b"] as Pricing,
      release_date: "2024-09-18",
      last_updated: today,
    }),
  );

  // --- Pixtral Large (November 2024) ---

  models.push(
    defineModel({
      id: "pixtral-large",
      name: "Pixtral Large",
      family: "pixtral",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 128000, output: 8192 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["pixtral-large"] as Pricing,
      release_date: "2024-11-18",
      last_updated: today,
    }),
  );

  // --- Deprecated models ---

  models.push(
    defineModel({
      id: "mistral-large-2407",
      name: "Mistral Large (2407)",
      family: "mistral",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 8192 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["mistral-large-2407"] as Pricing,
      release_date: "2024-07-24",
      last_updated: today,
      deprecated: true,
    }),
  );

  models.push(
    defineModel({
      id: "mixtral-8x22b",
      name: "Mixtral 8x22B",
      family: "mixtral",
      temperature: true,
      tool_call: true,
      limit: { context: 64000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["mixtral-8x22b"] as Pricing,
      release_date: "2024-04-10",
      last_updated: today,
      deprecated: true,
    }),
  );

  models.push(
    defineModel({
      id: "mixtral-8x7b",
      name: "Mixtral 8x7B",
      family: "mixtral",
      temperature: true,
      tool_call: true,
      limit: { context: 32000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["mixtral-8x7b"] as Pricing,
      release_date: "2023-12-11",
      last_updated: today,
      deprecated: true,
    }),
  );

  models.push(
    defineModel({
      id: "mistral-7b",
      name: "Mistral 7B",
      family: "mistral",
      temperature: true,
      limit: { context: 32000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["mistral-7b"] as Pricing,
      release_date: "2023-09-27",
      last_updated: today,
      deprecated: true,
    }),
  );

  console.log(`  Mistral AI: ${models.length} models`);

  return { provider, models };
}
