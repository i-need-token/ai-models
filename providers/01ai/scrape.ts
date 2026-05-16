import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "01ai",
  name: "01.AI",
  url: "https://www.01.ai",
  api_docs: "https://platform.lingyiwanwu.com/docs",
  apis: {
    openai: "https://api.lingyiwanwu.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model details & pricing: https://platform.lingyiwanwu.com/docs (RSC page)
// - API endpoint: https://api.lingyiwanwu.com/v1 (OpenAI-compatible)
//
// 01.AI produces the Yi series of large language models.
// Current API models use smart routing to select the best backend model.
// Pricing is in CNY per million tokens (combined input+output rate).
// Converted to USD at ~7.2 CNY/USD.
// ---------------------------------------------------------------------------

// Pricing (USD per million tokens) — converted from CNY at ~7.2 CNY/USD
// Source: https://platform.lingyiwanwu.com/docs
// Note: 01.AI charges the same rate for input and output tokens.
const HARDCODED_PRICING: Record<string, Pricing> = {
  // ¥0.99/1M token → $0.14/1M token
  "yi-lightning": { currency: "USD", input: 0.14, output: 0.14 },
  // ¥6/1M token → $0.83/1M token
  "yi-vision-v2": { currency: "USD", input: 0.83, output: 0.83 },
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

  // --- yi-lightning ---
  // Smart routing model: routes to DeepSeek-V3, Qwen3-30B-A3B, Yi-Lightning, etc.
  models.push(
    defineModel({
      id: "yi-lightning",
      name: "Yi Lightning",
      family: "yi",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 16384, output: 4096 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["yi-lightning"] as Pricing,
      release_date: "2024-10-01",
      last_updated: today,
    }),
  );

  // --- yi-vision-v2 ---
  // Vision model: routes to Qwen2.5-VL-72B-Instruct, Yi-Vision-V2, etc.
  models.push(
    defineModel({
      id: "yi-vision-v2",
      name: "Yi Vision v2",
      family: "yi-vision",
      temperature: true,
      attachment: true,
      limit: { context: 16384, output: 4096 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["yi-vision-v2"] as Pricing,
      release_date: "2024-10-01",
      last_updated: today,
    }),
  );

  console.log(`  01.AI: ${models.length} models`);

  return { provider, models };
}
