import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "fireworks",
  name: "Fireworks AI",
  url: "https://fireworks.ai",
  api_docs: "https://docs.fireworks.ai",
  apis: {
    openai: "https://api.fireworks.ai/inference/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Pricing: https://fireworks.ai/models (SSR page, browser-verified)
// - Model IDs: Fireworks API & docs
// - Context lengths: Fireworks models page
//
// Fireworks AI is an inference platform hosting models from other providers
// (DeepSeek, Moonshot AI, MiniMax, Zhipu AI, Alibaba, OpenAI, Meta)
// with its own per-token pricing.
//
// Only serverless models with explicit per-token pricing are included.
// On-demand models using tier-based pricing (by parameter count) are excluded
// because the tier assignment depends on model configuration details not
// available from the pricing page alone.
//
// Pricing shown is Fireworks AI's per-1M-token rate (USD).
// Some models have prompt caching pricing (cache_read).
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context: number;
  output: number;
  inputModalities: ModelModality[];
  outputModalities: ModelModality[];
  toolCall?: boolean;
  openWeights?: boolean;
  reasoning?: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  // --- DeepSeek family ---
  "deepseek-v4-pro": {
    name: "DeepSeek V4 Pro",
    context: 1048576,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },

  // --- Moonshot AI / Kimi family ---
  "kimi-k2.6": {
    name: "Kimi K2.6",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "kimi-k2.5": {
    name: "Kimi K2.5",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- MiniMax family ---
  "minimax-m2.7": {
    name: "MiniMax M2.7",
    context: 196608,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "minimax-m2.5": {
    name: "MiniMax M2.5",
    context: 196608,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Zhipu AI / ZAI GLM family ---
  "glm-5.1": {
    name: "GLM 5.1",
    context: 202752,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Alibaba Qwen family ---
  "qwen3.6-plus": {
    name: "Qwen 3.6 Plus",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- OpenAI GPT-OSS family ---
  "gpt-oss-20b": {
    name: "GPT OSS 20B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "gpt-oss-120b": {
    name: "GPT OSS 120B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Meta Llama family ---
  "llama4-scout-17b-16e-instruct": {
    name: "Llama 4 Scout 17Bx16E",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: https://fireworks.ai/models (browser-verified 2026-05-15)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  "deepseek-v4-pro": { currency: "USD", input: 1.74, output: 3.48 },
  "kimi-k2.6": { currency: "USD", input: 0.95, output: 4.0 },
  "kimi-k2.5": { currency: "USD", input: 0.6, output: 3.0 },
  "minimax-m2.7": { currency: "USD", input: 0.3, output: 1.2 },
  "minimax-m2.5": { currency: "USD", input: 0.3, output: 1.2 },
  "glm-5.1": { currency: "USD", input: 1.4, output: 4.4 },
  "qwen3.6-plus": { currency: "USD", input: 0.5, output: 3.0 },
  "gpt-oss-20b": { currency: "USD", input: 0.07, output: 0.3 },
  "gpt-oss-120b": { currency: "USD", input: 0.15, output: 0.6 },
  "llama4-scout-17b-16e-instruct": { currency: "USD", input: 0.18, output: 0.59 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("deepseek")) return "deepseek";
  if (id.includes("kimi")) return "kimi";
  if (id.includes("minimax")) return "minimax";
  if (id.includes("glm")) return "glm";
  if (id.includes("qwen")) return "qwen";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("llama4")) return "llama-4";
  return "other";
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
  const models: Model[] = [];

  for (const [id, info] of Object.entries(MODELS)) {
    const pricing = HARDCODED_PRICING[id];
    if (!pricing) {
      console.warn(`  Fireworks AI: skipping ${id} — no pricing`);
      continue;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id,
      name: info.name,
      family: deriveFamily(id),
      temperature: true,
      limit: { context: info.context, output: info.output },
      modalities: { input: info.inputModalities, output: info.outputModalities },
      pricing,
      release_date: today,
      last_updated: today,
    };

    if (info.toolCall) modelDef.tool_call = true;
    if (info.openWeights) modelDef.open_weights = true;
    if (info.reasoning) modelDef.reasoning = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Fireworks AI: ${models.length} models`);

  return { provider, models };
}
