import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "upstage",
  name: "Upstage",
  url: "https://www.upstage.ai",
  api_docs: "https://console.upstage.ai/docs",
  apis: {
    openai: "https://api.upstage.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model details: https://console.upstage.ai/docs/models (CSR)
// - Model history: https://console.upstage.ai/docs/models/history (CSR)
// - Pricing: https://www.upstage.ai/pricing/api (CSR)
// - API: https://api.upstage.ai/v1 (OpenAI-compatible, requires auth)
//
// Upstage produces Solar LLMs and Document Intelligence models.
// Optimized for Korean with English and Japanese support.
// ---------------------------------------------------------------------------

// Pricing (USD) — from upstage.ai pricing page
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Chat LLMs — USD per 1M tokens
  "solar-pro3": { currency: "USD", input: 0.15, output: 0.6, cache_read: 0.015 },
  "solar-pro2": { currency: "USD", input: 0.15, output: 0.6, cache_read: 0.015 },
  "solar-mini": { currency: "USD", input: 0.15, output: 0.15 },

  // Embed — USD per 1M tokens
  "solar-embedding-1-large": { currency: "USD", input: 0.1, output: 0 },

  // Document Intelligence — USD per page
  "document-parse": { currency: "USD", unit: "per_request", price: 0.01 },
  "document-ocr": { currency: "USD", unit: "per_request", price: 0.0015 },
  "information-extract": { currency: "USD", unit: "per_request", price: 0.04 },
  "document-classify": { currency: "USD", unit: "per_request", price: 0.004 },
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

  // --- Generative Intelligence (Chat LLMs) ---
  models.push(
    defineModel({
      id: "solar-pro3",
      name: "Solar Pro 3",
      family: "solar",
      temperature: true,
      reasoning: true,
      tool_call: true,
      open_weights: false,
      limit: { context: 128000, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["solar-pro3"] as Pricing,
      release_date: "2026-01-26",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "solar-pro2",
      name: "Solar Pro 2",
      family: "solar",
      temperature: true,
      reasoning: true,
      tool_call: true,
      open_weights: false,
      limit: { context: 65536, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["solar-pro2"] as Pricing,
      release_date: "2025-07-10",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "solar-mini",
      name: "Solar Mini",
      family: "solar",
      temperature: true,
      tool_call: true,
      open_weights: true,
      limit: { context: 32768, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["solar-mini"] as Pricing,
      release_date: "2024-06-12",
      last_updated: today,
    }),
  );

  // --- Embed ---
  models.push(
    defineModel({
      id: "solar-embedding-1-large",
      name: "Solar Embedding 1 Large",
      family: "solar-embedding",
      temperature: false,
      open_weights: true,
      limit: { context: 4000, output: 0 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["solar-embedding-1-large"] as Pricing,
      release_date: "2024-05-10",
      last_updated: today,
    }),
  );

  // --- Document Intelligence ---
  models.push(
    defineModel({
      id: "document-parse",
      name: "Document Parse",
      family: "document-parse",
      temperature: false,
      attachment: true,
      limit: { context: 100, output: 0 },
      modalities: { input: ["image", "pdf"], output: ["text"] },
      pricing: HARDCODED_PRICING["document-parse"] as Pricing,
      release_date: "2024-02-28",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "document-ocr",
      name: "Document OCR",
      family: "document-ocr",
      temperature: false,
      attachment: true,
      limit: { context: 30, output: 0 },
      modalities: { input: ["image", "pdf"], output: ["text"] },
      pricing: HARDCODED_PRICING["document-ocr"] as Pricing,
      release_date: "2023-04-10",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "information-extract",
      name: "Information Extract",
      family: "information-extract",
      temperature: false,
      attachment: true,
      limit: { context: 100, output: 0 },
      modalities: { input: ["image", "pdf"], output: ["text"] },
      pricing: HARDCODED_PRICING["information-extract"] as Pricing,
      release_date: "2025-05-29",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "document-classify",
      name: "Document Classify",
      family: "document-classify",
      temperature: false,
      attachment: true,
      limit: { context: 100, output: 0 },
      modalities: { input: ["image", "pdf"], output: ["text"] },
      pricing: HARDCODED_PRICING["document-classify"] as Pricing,
      release_date: "2025-08-30",
      last_updated: today,
    }),
  );

  console.log(`  Upstage: ${models.length} models`);

  return { provider, models };
}
