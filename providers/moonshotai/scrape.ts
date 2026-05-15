import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Pricing } from "../../types/index";

const provider = defineProvider({
  id: "moonshotai",
  name: "Moonshot AI",
  url: "https://platform.moonshot.cn",
  api_docs: "https://platform.moonshot.cn/docs",
  apis: {
    openai: "https://api.moonshot.cn/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party Mintlify docs accessed 2026-05-15)
// Source: https://platform.moonshot.cn/docs/api/models-overview.md
//         https://platform.moonshot.cn/docs/pricing/chat.md
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context: number;
  output: number;
  modalities: { input: ("text" | "image")[]; output: "text"[] };
  deprecated: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  // K2.6 series (latest)
  "kimi-k2.6": {
    name: "Kimi K2.6",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: false,
  },
  "kimi-k2.6-0528": {
    name: "Kimi K2.6 (0528)",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: false,
  },
  "kimi-k2.6-long": {
    name: "Kimi K2.6 Long",
    context: 131072,
    output: 65536,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: false,
  },

  // K2 series
  "kimi-k2": {
    name: "Kimi K2",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: false,
  },
  "kimi-k2-0711": {
    name: "Kimi K2 (0711)",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: false,
  },
  "kimi-k2-long": {
    name: "Kimi K2 Long",
    context: 131072,
    output: 65536,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: false,
  },

  // K1.5 series
  "kimi-k1.5": {
    name: "Kimi K1.5",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: false,
  },
  "kimi-latest": {
    name: "Kimi Latest",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: false,
  },

  // Vision series
  "kimi-vl-a3b-thinking": {
    name: "Kimi VL A3B Thinking",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    deprecated: false,
  },
  "kimi-vl-a3b": {
    name: "Kimi VL A3B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    deprecated: false,
  },

  // K1 series (deprecated)
  "moonshot-v1-8k": {
    name: "Moonshot V1 (8K)",
    context: 8192,
    output: 4096,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: true,
  },
  "moonshot-v1-32k": {
    name: "Moonshot V1 (32K)",
    context: 32768,
    output: 4096,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: true,
  },
  "moonshot-v1-128k": {
    name: "Moonshot V1 (128K)",
    context: 131072,
    output: 4096,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: true,
  },
};

// Pricing — CNY per million tokens
// Source: https://platform.moonshot.cn/docs/pricing/chat.md
const HARDCODED_PRICING: Record<string, Pricing> = {
  // K2.6 series
  "kimi-k2.6": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },
  "kimi-k2.6-0528": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },
  "kimi-k2.6-long": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },

  // K2 series
  "kimi-k2": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },
  "kimi-k2-0711": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },
  "kimi-k2-long": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },

  // K1.5 series
  "kimi-k1.5": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },
  "kimi-latest": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },

  // Vision series
  "kimi-vl-a3b-thinking": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },
  "kimi-vl-a3b": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },

  // V1 series (deprecated)
  "moonshot-v1-8k": { currency: "CNY", input: 12, output: 12, cache_read: 2.4 },
  "moonshot-v1-32k": { currency: "CNY", input: 24, output: 24, cache_read: 4.8 },
  "moonshot-v1-128k": { currency: "CNY", input: 60, output: 60, cache_read: 12 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.startsWith("kimi-k2.6")) return "kimi-k2.6";
  if (id.startsWith("kimi-k2")) return "kimi-k2";
  if (id.startsWith("kimi-k1.5")) return "kimi-k1.5";
  if (id.startsWith("kimi-latest")) return "kimi-latest";
  if (id.startsWith("kimi-vl")) return "kimi-vl";
  if (id.startsWith("moonshot-v1")) return "moonshot-v1";
  return "moonshotai";
}

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
  const models = [];

  for (const [id, info] of Object.entries(MODELS)) {
    const pricing = HARDCODED_PRICING[id] ?? { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id),
        temperature: true,
        limit: { context: info.context, output: info.output },
        modalities: info.modalities,
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  console.log(`  Moonshot AI: ${models.length} models`);

  return { provider, models };
}
