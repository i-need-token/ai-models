import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "sarvam",
  name: "Sarvam AI",
  url: "https://www.sarvam.ai",
  api_docs: "https://docs.sarvam.ai",
  apis: {
    openai: "https://api.sarvam.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model details: https://docs.sarvam.ai/api-reference-docs/getting-started/models.mdx
// - Pricing: https://docs.sarvam.ai/api-reference-docs/pricing.mdx
// - API: https://api.sarvam.ai/v1/models (returns sarvam-105b, sarvam-30b)
//
// Sarvam AI produces models for Indian languages (22 Indic + English).
// Pricing is in Indian Rupees (INR).
// ---------------------------------------------------------------------------

// Pricing (USD per million tokens) — converted from INR at ~83.5 INR/USD
// Source: https://docs.sarvam.ai/api-reference-docs/pricing.mdx
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Chat LLMs — USD per 1M tokens (INR: 4/2.5/16 and 2.5/1.5/10)
  "sarvam-105b": { currency: "USD", input: 0.048, output: 0.192, cache_read: 0.03 },
  "sarvam-30b": { currency: "USD", input: 0.03, output: 0.12, cache_read: 0.018 },
  "sarvam-m": { currency: "USD", input: 0.03, output: 0.12 },

  // Speech-to-Text — INR 30/hour ≈ USD 0.36/hour ≈ USD 0.0001/sec
  "saaras-v3": { currency: "USD", unit: "per_second", price: 0.0001 },

  // Text-to-Speech — INR per 10K characters
  "bulbul-v3": { currency: "USD", unit: "per_request", price: 0.36 },
  "bulbul-v2": { currency: "USD", unit: "per_request", price: 0.18 },

  // Translation — INR per 10K characters
  "sarvam-translate": { currency: "USD", unit: "per_request", price: 0.24 },
  mayura: { currency: "USD", unit: "per_request", price: 0.24 },

  // Vision — INR 0.5/page ≈ USD 0.006/page
  "sarvam-vision": { currency: "USD", unit: "per_request", price: 0.006 },
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

  // --- Chat LLMs ---
  models.push(
    defineModel({
      id: "sarvam-105b",
      name: "Sarvam 105B",
      family: "sarvam-chat",
      temperature: true,
      reasoning: true,
      tool_call: true,
      open_weights: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["sarvam-105b"] as Pricing,
      release_date: "2025-07-01",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "sarvam-30b",
      name: "Sarvam 30B",
      family: "sarvam-chat",
      temperature: true,
      reasoning: true,
      tool_call: true,
      open_weights: true,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["sarvam-30b"] as Pricing,
      release_date: "2025-07-01",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "sarvam-m",
      name: "Sarvam-M",
      family: "sarvam-chat",
      temperature: true,
      reasoning: true,
      deprecated: true,
      open_weights: true,
      limit: { context: 32000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["sarvam-m"] as Pricing,
      release_date: "2024-10-01",
      last_updated: today,
    }),
  );

  // --- Speech-to-Text ---
  models.push(
    defineModel({
      id: "saaras-v3",
      name: "Saaras v3",
      family: "saaras",
      temperature: false,
      modalities: { input: ["audio"], output: ["text"] },
      pricing: HARDCODED_PRICING["saaras-v3"] as Pricing,
      release_date: "2025-01-01",
      last_updated: today,
    }),
  );

  // --- Text-to-Speech ---
  models.push(
    defineModel({
      id: "bulbul-v3",
      name: "Bulbul v3",
      family: "bulbul",
      temperature: false,
      modalities: { input: ["text"], output: ["audio"] },
      pricing: HARDCODED_PRICING["bulbul-v3"] as Pricing,
      release_date: "2025-03-01",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "bulbul-v2",
      name: "Bulbul v2",
      family: "bulbul",
      temperature: false,
      modalities: { input: ["text"], output: ["audio"] },
      pricing: HARDCODED_PRICING["bulbul-v2"] as Pricing,
      release_date: "2024-06-01",
      last_updated: today,
    }),
  );

  // --- Translation ---
  models.push(
    defineModel({
      id: "sarvam-translate",
      name: "Sarvam Translate",
      family: "sarvam-translate",
      temperature: false,
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["sarvam-translate"] as Pricing,
      release_date: "2024-08-01",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "mayura",
      name: "Mayura",
      family: "mayura",
      temperature: false,
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["mayura"] as Pricing,
      release_date: "2024-06-01",
      last_updated: today,
    }),
  );

  // --- Vision / Document Intelligence ---
  models.push(
    defineModel({
      id: "sarvam-vision",
      name: "Sarvam Vision",
      family: "sarvam-vision",
      temperature: false,
      attachment: true,
      open_weights: true,
      modalities: { input: ["text", "image", "pdf"], output: ["text"] },
      pricing: HARDCODED_PRICING["sarvam-vision"] as Pricing,
      release_date: "2025-01-01",
      last_updated: today,
    }),
  );

  console.log(`  Sarvam AI: ${models.length} models`);

  return { provider, models };
}
