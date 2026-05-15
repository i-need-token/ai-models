import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "xiaomi",
  name: "Xiaomi",
  url: "https://xiaomi.ai",
  api_docs: "https://xiaomi.ai/docs",
  apis: {
    openai: "https://api.xiaomi.ai",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs & pricing: OpenRouter API https://openrouter.ai/api/v1/models
//   (xiaomi/* models — context windows, max output, modalities, USD pricing)
// - Model descriptions: OpenRouter model descriptions
//
// Xiaomi's own API (api.xiaomi.ai) and docs (xiaomi.ai) are unreachable from
// this network. All data sourced from OpenRouter which mirrors Xiaomi's data.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from OpenRouter
const HARDCODED_PRICING: Record<string, Pricing> = {
  "mimo-v2-flash": { currency: "USD", input: 0.1, output: 0.3 },
  "mimo-v2-omni": { currency: "USD", input: 0.4, output: 2.0 },
  "mimo-v2-pro": { currency: "USD", input: 1.0, output: 3.0 },
  "mimo-v2.5": { currency: "USD", input: 0.4, output: 2.0 },
  "mimo-v2.5-pro": { currency: "USD", input: 1.0, output: 3.0 },
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

  // --- MiMo V2 Flash (309B MoE, 15B active, text-only) ---

  models.push(
    defineModel({
      id: "mimo-v2-flash",
      name: "MiMo V2 Flash",
      family: "mimo",
      temperature: true,
      tool_call: true,
      open_weights: true,
      limit: { context: 262144, output: 65536 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["mimo-v2-flash"] as Pricing,
      release_date: "2025-04-01",
      last_updated: today,
    }),
  );

  // --- MiMo V2 Omni (omni-modal: image/video/audio input) ---

  models.push(
    defineModel({
      id: "mimo-v2-omni",
      name: "MiMo V2 Omni",
      family: "mimo",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 262144, output: 65536 },
      modalities: {
        input: ["text", "image", "video", "audio"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["mimo-v2-omni"] as Pricing,
      release_date: "2025-05-01",
      last_updated: today,
    }),
  );

  // --- MiMo V2 Pro (1T params, 1M context, flagship agentic) ---

  models.push(
    defineModel({
      id: "mimo-v2-pro",
      name: "MiMo V2 Pro",
      family: "mimo",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 1048576, output: 131072 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["mimo-v2-pro"] as Pricing,
      release_date: "2025-06-01",
      last_updated: today,
    }),
  );

  // --- MiMo V2.5 (omnimodal, 1M context, Pro-level at half cost) ---

  models.push(
    defineModel({
      id: "mimo-v2.5",
      name: "MiMo V2.5",
      family: "mimo",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 1048576, output: 131072 },
      modalities: {
        input: ["text", "image", "video", "audio"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["mimo-v2.5"] as Pricing,
      release_date: "2025-09-01",
      last_updated: today,
    }),
  );

  // --- MiMo V2.5 Pro (flagship agentic, 1M context) ---

  models.push(
    defineModel({
      id: "mimo-v2.5-pro",
      name: "MiMo V2.5 Pro",
      family: "mimo",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 1048576, output: 16384 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["mimo-v2.5-pro"] as Pricing,
      release_date: "2025-09-01",
      last_updated: today,
    }),
  );

  console.log(`  Xiaomi: ${models.length} models`);

  return { provider, models };
}
