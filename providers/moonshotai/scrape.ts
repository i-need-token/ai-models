import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Pricing } from "../../types/index";

const provider = defineProvider({
  id: "moonshotai",
  name: "Moonshot AI",
  url: "https://platform.kimi.com",
  api_docs: "https://platform.kimi.com/docs",
  apis: {
    openai: "https://api.moonshot.cn/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party docs accessed 2026-05-16)
// Source: https://platform.kimi.com/docs/pricing/chat-k26
//         https://platform.kimi.com/docs/pricing/chat-k25
//         https://platform.kimi.com/docs/pricing/chat-k2
//         https://platform.kimi.com/docs/pricing/chat-v1
//         https://platform.kimi.com/docs/api/models-overview
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context: number;
  output: number;
  modalities: { input: ("text" | "image")[]; output: "text"[] };
  deprecated: boolean;
  reasoning?: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  // K2.6 series (latest)
  "kimi-k2.6": {
    name: "Kimi K2.6",
    context: 262144,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    deprecated: false,
    reasoning: true,
  },
  "kimi-k2.6-long": {
    name: "Kimi K2.6 Long",
    context: 262144,
    output: 65536,
    modalities: { input: ["text", "image"], output: ["text"] },
    deprecated: false,
    reasoning: true,
  },

  // K2.5 series
  "kimi-k2.5": {
    name: "Kimi K2.5",
    context: 262144,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    deprecated: false,
    reasoning: true,
  },

  // K2 series (retiring May 25, 2026)
  "kimi-k2-0905-preview": {
    name: "Kimi K2 (0905 Preview)",
    context: 262144,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: true,
  },
  "kimi-k2-0711-preview": {
    name: "Kimi K2 (0711 Preview)",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: true,
  },
  "kimi-k2-turbo-preview": {
    name: "Kimi K2 Turbo Preview",
    context: 262144,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: true,
  },
  "kimi-k2-thinking": {
    name: "Kimi K2 Thinking",
    context: 262144,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: true,
    reasoning: true,
  },
  "kimi-k2-thinking-turbo": {
    name: "Kimi K2 Thinking Turbo",
    context: 262144,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    deprecated: true,
    reasoning: true,
  },

  // Vision series
  "kimi-vl-a3b-thinking": {
    name: "Kimi VL A3B Thinking",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    deprecated: false,
    reasoning: true,
  },
  "kimi-vl-a3b": {
    name: "Kimi VL A3B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    deprecated: false,
  },

  // V1 series (deprecated)
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
  "moonshot-v1-8k-vision-preview": {
    name: "Moonshot V1 Vision (8K)",
    context: 8192,
    output: 4096,
    modalities: { input: ["text", "image"], output: ["text"] },
    deprecated: true,
  },
  "moonshot-v1-32k-vision-preview": {
    name: "Moonshot V1 Vision (32K)",
    context: 32768,
    output: 4096,
    modalities: { input: ["text", "image"], output: ["text"] },
    deprecated: true,
  },
  "moonshot-v1-128k-vision-preview": {
    name: "Moonshot V1 Vision (128K)",
    context: 131072,
    output: 4096,
    modalities: { input: ["text", "image"], output: ["text"] },
    deprecated: true,
  },
};

// Pricing — CNY per million tokens
// Source: https://platform.kimi.com/docs/pricing/chat-k26
//         https://platform.kimi.com/docs/pricing/chat-k25
//         https://platform.kimi.com/docs/pricing/chat-k2
//         https://platform.kimi.com/docs/pricing/chat-v1
const HARDCODED_PRICING: Record<string, Pricing> = {
  // K2.6 series
  "kimi-k2.6": { currency: "CNY", input: 6.5, output: 27, cache_read: 1.1 },
  "kimi-k2.6-long": { currency: "CNY", input: 6.5, output: 27, cache_read: 1.1 },

  // K2.5 series
  "kimi-k2.5": { currency: "CNY", input: 4, output: 21, cache_read: 0.7 },

  // K2 series (retiring May 25, 2026)
  "kimi-k2-0905-preview": { currency: "CNY", input: 4, output: 16, cache_read: 1 },
  "kimi-k2-0711-preview": { currency: "CNY", input: 4, output: 16, cache_read: 1 },
  "kimi-k2-turbo-preview": { currency: "CNY", input: 8, output: 58, cache_read: 1 },
  "kimi-k2-thinking": { currency: "CNY", input: 4, output: 16, cache_read: 1 },
  "kimi-k2-thinking-turbo": { currency: "CNY", input: 8, output: 58, cache_read: 1 },

  // Vision series
  "kimi-vl-a3b-thinking": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },
  "kimi-vl-a3b": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },

  // V1 series (deprecated) — no cache_read pricing listed in docs
  "moonshot-v1-8k": { currency: "CNY", input: 2, output: 10 },
  "moonshot-v1-32k": { currency: "CNY", input: 5, output: 20 },
  "moonshot-v1-128k": { currency: "CNY", input: 10, output: 30 },
  "moonshot-v1-8k-vision-preview": { currency: "CNY", input: 2, output: 10 },
  "moonshot-v1-32k-vision-preview": { currency: "CNY", input: 5, output: 20 },
  "moonshot-v1-128k-vision-preview": { currency: "CNY", input: 10, output: 30 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.startsWith("kimi-k2.6")) return "kimi-k2.6";
  if (id.startsWith("kimi-k2.5")) return "kimi-k2.5";
  if (id.startsWith("kimi-k2-thinking-turbo")) return "kimi-k2-thinking-turbo";
  if (id.startsWith("kimi-k2-thinking")) return "kimi-k2-thinking";
  if (id.startsWith("kimi-k2-turbo")) return "kimi-k2-turbo";
  if (id.startsWith("kimi-k2-0905")) return "kimi-k2-0905";
  if (id.startsWith("kimi-k2-0711")) return "kimi-k2-0711";
  if (id.startsWith("kimi-k2")) return "kimi-k2";
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
        ...(info.reasoning ? { reasoning: true } : {}),
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
