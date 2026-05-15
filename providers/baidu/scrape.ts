import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "baidu",
  name: "Baidu",
  url: "https://yiyan.baidu.com",
  api_docs: "https://cloud.baidu.com/doc/WENXINWORKSHOP",
  apis: {
    openai: "https://qianfan.baidubce.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - ERNIE model specs & pricing: OpenRouter API https://openrouter.ai/api/v1/models
//   (baidu/* models — context windows, max output, modalities, USD pricing)
// - CoBuddy & Qianfan-OCR-Fast specs & pricing: Baidu Qianfan API
//   https://qianfan.baidubce.com/v1/models
// - Model descriptions: OpenRouter + Qianfan API descriptions
//
// Baidu's own documentation (cloud.baidu.com) is CSR and geo-blocked from CLI.
// The Qianfan API only returns 2 of Baidu's own models (cobuddy, qianfan-ocr-fast).
// ERNIE model data sourced from OpenRouter which mirrors Baidu's specifications.
// Pricing is in USD per 1M tokens (from OpenRouter).
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens)
const HARDCODED_PRICING: Record<string, Pricing> = {
  "ernie-4.5-21b-a3b": { currency: "USD", input: 0.07, output: 0.28 },
  "ernie-4.5-21b-a3b-thinking": { currency: "USD", input: 0.07, output: 0.28 },
  "ernie-4.5-300b-a47b": { currency: "USD", input: 0.28, output: 1.1 },
  "ernie-4.5-vl-28b-a3b": { currency: "USD", input: 0.14, output: 0.56 },
  "ernie-4.5-vl-424b-a47b": { currency: "USD", input: 0.42, output: 1.25 },
  cobuddy: { unit: "free" },
  "qianfan-ocr-fast": { currency: "USD", input: 0.68, output: 2.81 },
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

  // --- ERNIE 4.5 21B A3B (lightweight MoE, 21B total / 3B active) ---

  models.push(
    defineModel({
      id: "ernie-4.5-21b-a3b",
      name: "ERNIE 4.5 21B A3B",
      family: "ernie",
      temperature: true,
      tool_call: true,
      limit: { context: 120000, output: 8000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["ernie-4.5-21b-a3b"] as Pricing,
      release_date: "2025-03-01",
      last_updated: today,
    }),
  );

  // --- ERNIE 4.5 21B A3B Thinking (reasoning variant) ---

  models.push(
    defineModel({
      id: "ernie-4.5-21b-a3b-thinking",
      name: "ERNIE 4.5 21B A3B Thinking",
      family: "ernie",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 131072, output: 65536 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["ernie-4.5-21b-a3b-thinking"] as Pricing,
      release_date: "2025-03-01",
      last_updated: today,
    }),
  );

  // --- ERNIE 4.5 300B A47B (flagship MoE, 300B total / 47B active) ---

  models.push(
    defineModel({
      id: "ernie-4.5-300b-a47b",
      name: "ERNIE 4.5 300B A47B",
      family: "ernie",
      temperature: true,
      tool_call: true,
      limit: { context: 123000, output: 12000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["ernie-4.5-300b-a47b"] as Pricing,
      release_date: "2025-03-01",
      last_updated: today,
    }),
  );

  // --- ERNIE 4.5 VL 28B A3B (multimodal MoE, 28B total / 3B active) ---

  models.push(
    defineModel({
      id: "ernie-4.5-vl-28b-a3b",
      name: "ERNIE 4.5 VL 28B A3B",
      family: "ernie",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 30000, output: 8000 },
      modalities: {
        input: ["text", "image"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["ernie-4.5-vl-28b-a3b"] as Pricing,
      release_date: "2025-03-01",
      last_updated: today,
    }),
  );

  // --- ERNIE 4.5 VL 424B A47B (flagship multimodal MoE, 424B total / 47B active) ---

  models.push(
    defineModel({
      id: "ernie-4.5-vl-424b-a47b",
      name: "ERNIE 4.5 VL 424B A47B",
      family: "ernie",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 123000, output: 16000 },
      modalities: {
        input: ["text", "image"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["ernie-4.5-vl-424b-a47b"] as Pricing,
      release_date: "2025-03-01",
      last_updated: today,
    }),
  );

  // --- CoBuddy (free code generation model) ---

  models.push(
    defineModel({
      id: "cobuddy",
      name: "CoBuddy",
      family: "cobuddy",
      temperature: true,
      tool_call: true,
      limit: { context: 131072, output: 65536 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["cobuddy"] as Pricing,
      release_date: "2025-01-01",
      last_updated: today,
    }),
  );

  // --- Qianfan OCR Fast (domain-specific OCR model) ---

  models.push(
    defineModel({
      id: "qianfan-ocr-fast",
      name: "Qianfan OCR Fast",
      family: "qianfan",
      temperature: true,
      attachment: true,
      limit: { context: 65536, output: 28672 },
      modalities: {
        input: ["text", "image"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["qianfan-ocr-fast"] as Pricing,
      release_date: "2025-01-01",
      last_updated: today,
    }),
  );

  console.log(`  Baidu: ${models.length} models`);

  return { provider, models };
}
