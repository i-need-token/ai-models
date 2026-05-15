import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "tencent",
  name: "Tencent Hunyuan",
  url: "https://hunyuan.tencent.com",
  api_docs: "https://cloud.tencent.com/document/product/1729",
  apis: {
    openai: "https://api.hunyuan.cloud.tencent.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model details: https://cloud.tencent.com/document/product/1729/104753 (CSR)
// - Pricing: https://cloud.tencent.com/document/product/1729/97731 (CSR)
// - API: https://api.hunyuan.cloud.tencent.com/v1 (requires auth)
//
// Tencent Hunyuan (混元) models, produced by Tencent.
// Pricing is in Chinese Yuan (CNY) per 1M tokens.
// ---------------------------------------------------------------------------

// Pricing (CNY per 1M tokens) — from cloud.tencent.com pricing page
// Note: HY 2.0 models have tiered pricing based on input length
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Chat LLMs — CNY per 1M tokens
  "hunyuan-2.0-thinking": { currency: "CNY", input: 3.975, output: 15.9 },
  "hunyuan-2.0-instruct": { currency: "CNY", input: 3.18, output: 7.95 },
  "hunyuan-t1-latest": { currency: "CNY", input: 1, output: 4 },
  "hunyuan-turbos-latest": { currency: "CNY", input: 0.8, output: 2 },
  "hunyuan-a13b": { currency: "CNY", input: 0.5, output: 2 },
  "hunyuan-large-role-latest": { currency: "CNY", input: 2.4, output: 9.6 },
  "hunyuan-translation": { currency: "CNY", input: 1.2, output: 3.6 },
  "hunyuan-translation-lite": { currency: "CNY", input: 1, output: 3 },

  // Vision models — CNY per 1M tokens
  "hunyuan-vision-1.5-instruct": { currency: "CNY", input: 3, output: 9 },
  "hunyuan-turbos-vision": { currency: "CNY", input: 3, output: 9 },
  "hunyuan-t1-vision": { currency: "CNY", input: 3, output: 9 },
  "hunyuan-turbos-vision-video": { currency: "CNY", input: 3, output: 9 },

  // Embedding — CNY per 1M tokens
  "hunyuan-embedding": { currency: "CNY", input: 0.7, output: 0.7 },
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
      id: "hunyuan-2.0-thinking",
      name: "Tencent HY 2.0 Think",
      family: "hunyuan",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 64000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-2.0-thinking"] as Pricing,
      release_date: "2025-11-09",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hunyuan-2.0-instruct",
      name: "Tencent HY 2.0 Instruct",
      family: "hunyuan",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-2.0-instruct"] as Pricing,
      release_date: "2025-11-11",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hunyuan-t1-latest",
      name: "Hunyuan T1",
      family: "hunyuan",
      temperature: true,
      reasoning: true,
      limit: { context: 32000, output: 64000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-t1-latest"] as Pricing,
      release_date: "2025-03-21",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hunyuan-turbos-latest",
      name: "Hunyuan TurboS",
      family: "hunyuan",
      temperature: true,
      tool_call: true,
      limit: { context: 32000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-turbos-latest"] as Pricing,
      release_date: "2025-03-13",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hunyuan-a13b",
      name: "Hunyuan A13B",
      family: "hunyuan",
      temperature: true,
      reasoning: true,
      open_weights: true,
      limit: { context: 224000, output: 32000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-a13b"] as Pricing,
      release_date: "2025-06-25",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hunyuan-lite",
      name: "Hunyuan Lite",
      family: "hunyuan",
      temperature: true,
      open_weights: true,
      limit: { context: 250000, output: 6000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: { unit: "free" },
      release_date: "2024-04-25",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hunyuan-large-role-latest",
      name: "Hunyuan Role",
      family: "hunyuan",
      temperature: true,
      limit: { context: 28000, output: 4000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-large-role-latest"] as Pricing,
      release_date: "2025-09-24",
      last_updated: today,
    }),
  );

  // --- Translation ---
  models.push(
    defineModel({
      id: "hunyuan-translation",
      name: "Hunyuan Translation",
      family: "hunyuan",
      temperature: false,
      limit: { context: 4000, output: 4000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-translation"] as Pricing,
      release_date: "2025-10-14",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hunyuan-translation-lite",
      name: "Hunyuan Translation Lite",
      family: "hunyuan",
      temperature: false,
      limit: { context: 4000, output: 4000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-translation-lite"] as Pricing,
      release_date: "2025-06-06",
      last_updated: today,
    }),
  );

  // --- Vision ---
  models.push(
    defineModel({
      id: "hunyuan-vision-1.5-instruct",
      name: "Tencent HY Vision 1.5 Instruct",
      family: "hunyuan-vision",
      temperature: true,
      attachment: true,
      limit: { context: 24000, output: 16000 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-vision-1.5-instruct"] as Pricing,
      release_date: "2025-12-17",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hunyuan-turbos-vision",
      name: "Hunyuan TurboS Vision",
      family: "hunyuan-vision",
      temperature: true,
      attachment: true,
      limit: { context: 24000, output: 8000 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-turbos-vision"] as Pricing,
      release_date: "2025-07-28",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hunyuan-t1-vision",
      name: "Hunyuan T1 Vision",
      family: "hunyuan-vision",
      temperature: true,
      reasoning: true,
      attachment: true,
      limit: { context: 28000, output: 20000 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-t1-vision"] as Pricing,
      release_date: "2025-09-16",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hunyuan-turbos-vision-video",
      name: "Hunyuan TurboS Vision Video",
      family: "hunyuan-vision",
      temperature: true,
      attachment: true,
      limit: { context: 24000, output: 8000 },
      modalities: { input: ["text", "image", "video"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-turbos-vision-video"] as Pricing,
      release_date: "2025-07-28",
      last_updated: today,
    }),
  );

  // --- Embedding ---
  models.push(
    defineModel({
      id: "hunyuan-embedding",
      name: "Hunyuan Embedding",
      family: "hunyuan-embedding",
      temperature: false,
      limit: { context: 32000, output: 0 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-embedding"] as Pricing,
      release_date: "2024-01-05",
      last_updated: today,
    }),
  );

  console.log(`  Tencent Hunyuan: ${models.length} models`);

  return { provider, models };
}
