import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "meta",
  name: "Meta Llama",
  url: "https://www.llama.com",
  api_docs: "https://www.llama.com/docs/overview",
  apis: {
    openai: "https://llama-api.meta.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs: GitHub model cards https://github.com/meta-llama/llama-models
// - Output limits: AWS Bedrock model parameters docs
//   https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-meta.html
// - Pricing: AWS Price List API
//   https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/index.json
//
// Meta Llama models, produced by Meta. Available via Amazon Bedrock and other
// cloud providers. Pricing is in USD per 1M tokens (AWS Bedrock us-east-1
// standard on-demand).
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from AWS Bedrock Price List API
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Llama 4 (MoE)
  "meta-llama-4-scout": { currency: "USD", input: 0.17, output: 0.66 },
  "meta-llama-4-maverick": { currency: "USD", input: 0.24, output: 0.97 },
  // Llama 3.3
  "meta-llama-3.3-70b": { currency: "USD", input: 0.72, output: 0.72 },
  // Llama 3.2 Vision
  "meta-llama-3.2-90b-vision": { currency: "USD", input: 0.72, output: 0.72 },
  "meta-llama-3.2-11b-vision": { currency: "USD", input: 0.16, output: 0.16 },
  // Llama 3.2 text
  "meta-llama-3.2-3b": { currency: "USD", input: 0.15, output: 0.15 },
  "meta-llama-3.2-1b": { currency: "USD", input: 0.1, output: 0.1 },
  // Llama 3.1
  "meta-llama-3.1-405b": { currency: "USD", input: 2.4, output: 2.4 },
  "meta-llama-3.1-70b": { currency: "USD", input: 0.72, output: 0.72 },
  "meta-llama-3.1-8b": { currency: "USD", input: 0.22, output: 0.22 },
  // Llama 3 (deprecated)
  "meta-llama-3-70b": { currency: "USD", input: 2.65, output: 3.5 },
  "meta-llama-3-8b": { currency: "USD", input: 0.3, output: 0.6 },
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

  // --- Llama 4 (April 5, 2025) ---

  models.push(
    defineModel({
      id: "meta-llama-4-scout",
      name: "Llama 4 Scout",
      family: "llama",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 10000000, output: 16384 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["meta-llama-4-scout"] as Pricing,
      release_date: "2025-04-05",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "meta-llama-4-maverick",
      name: "Llama 4 Maverick",
      family: "llama",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 1000000, output: 16384 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["meta-llama-4-maverick"] as Pricing,
      release_date: "2025-04-05",
      last_updated: today,
    }),
  );

  // --- Llama 3.3 (December 6, 2024) ---

  models.push(
    defineModel({
      id: "meta-llama-3.3-70b",
      name: "Llama 3.3 70B",
      family: "llama",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["meta-llama-3.3-70b"] as Pricing,
      release_date: "2024-12-06",
      last_updated: today,
    }),
  );

  // --- Llama 3.2 Vision (September 25, 2024) ---

  models.push(
    defineModel({
      id: "meta-llama-3.2-90b-vision",
      name: "Llama 3.2 90B Vision",
      family: "llama",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["meta-llama-3.2-90b-vision"] as Pricing,
      release_date: "2024-09-25",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "meta-llama-3.2-11b-vision",
      name: "Llama 3.2 11B Vision",
      family: "llama",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["meta-llama-3.2-11b-vision"] as Pricing,
      release_date: "2024-09-25",
      last_updated: today,
    }),
  );

  // --- Llama 3.2 text (October 24, 2024) ---

  models.push(
    defineModel({
      id: "meta-llama-3.2-3b",
      name: "Llama 3.2 3B",
      family: "llama",
      temperature: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["meta-llama-3.2-3b"] as Pricing,
      release_date: "2024-10-24",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "meta-llama-3.2-1b",
      name: "Llama 3.2 1B",
      family: "llama",
      temperature: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["meta-llama-3.2-1b"] as Pricing,
      release_date: "2024-10-24",
      last_updated: today,
    }),
  );

  // --- Llama 3.1 (July 23, 2024) ---

  models.push(
    defineModel({
      id: "meta-llama-3.1-405b",
      name: "Llama 3.1 405B",
      family: "llama",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["meta-llama-3.1-405b"] as Pricing,
      release_date: "2024-07-23",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "meta-llama-3.1-70b",
      name: "Llama 3.1 70B",
      family: "llama",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["meta-llama-3.1-70b"] as Pricing,
      release_date: "2024-07-23",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "meta-llama-3.1-8b",
      name: "Llama 3.1 8B",
      family: "llama",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["meta-llama-3.1-8b"] as Pricing,
      release_date: "2024-07-23",
      last_updated: today,
    }),
  );

  // --- Llama 3 (April 18, 2024) — deprecated ---

  models.push(
    defineModel({
      id: "meta-llama-3-70b",
      name: "Llama 3 70B",
      family: "llama",
      temperature: true,
      tool_call: true,
      limit: { context: 8192, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["meta-llama-3-70b"] as Pricing,
      release_date: "2024-04-18",
      last_updated: today,
      deprecated: true,
    }),
  );

  models.push(
    defineModel({
      id: "meta-llama-3-8b",
      name: "Llama 3 8B",
      family: "llama",
      temperature: true,
      limit: { context: 8192, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["meta-llama-3-8b"] as Pricing,
      release_date: "2024-04-18",
      last_updated: today,
      deprecated: true,
    }),
  );

  console.log(`  Meta Llama: ${models.length} models`);

  return { provider, models };
}
