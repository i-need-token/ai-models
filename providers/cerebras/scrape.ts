import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "cerebras",
  name: "Cerebras",
  url: "https://cerebras.ai",
  api_docs: "https://docs.cerebras.ai",
  apis: {
    openai: "https://api.cerebras.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Pricing: https://cerebras.ai/pricing (SSR page, browser-verified)
// - Model IDs: Cerebras API docs & changelog
// - Context lengths: Cerebras docs (all models support 128k context)
//
// Cerebras is an inference platform hosting models from other providers
// (Zhipu AI, OpenAI, Meta, Alibaba, DeepSeek) with its own per-token pricing.
// Pricing shown is Cerebras Developer tier per-1M-token rate (USD).
// Models not on the Developer tier pricing table use FreePricing
// (available on the Free tier with rate limits).
//
// Notes:
// - ZAI GLM 4.7 is marked as "Preview" on the pricing page
// - Llama 3.1 8B and Qwen 3 235B Instruct are marked as
//   "Will be deprecated on May 27, 2026"
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context: number;
  output: number;
  inputModalities: ModelModality[];
  outputModalities: ModelModality[];
  toolCall?: boolean;
  openWeights?: boolean;
  deprecated?: boolean;
  reasoning?: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  // --- Zhipu AI / ZAI family ---
  "zai-glm-4.7": {
    name: "ZAI GLM 4.7",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- OpenAI GPT-OSS family ---
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
  "llama3.1-8b": {
    name: "Llama 3.1 8B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
    deprecated: true,
  },
  "llama-3.3-70b": {
    name: "Llama 3.3 70B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-4-scout-17b-16e-instruct": {
    name: "Llama 4 Scout 17Bx16E",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Alibaba Qwen family ---
  "qwen-2.5-32b": {
    name: "Qwen 2.5 32B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwen-2.5-coder-32b": {
    name: "Qwen 2.5 Coder 32B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwen3-235b-instruct": {
    name: "Qwen 3 235B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
    deprecated: true,
  },
  "qwen3-32b": {
    name: "Qwen 3 32B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- DeepSeek family ---
  "deepseek-r1-distill-llama-70b": {
    name: "DeepSeek R1 Distill Llama 70B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "deepseek-r1-distill-llama-8b": {
    name: "DeepSeek R1 Distill Llama 8B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: https://cerebras.ai/pricing — Developer tier Pricing table
// Models not on the pricing table use FreePricing (Free tier access)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // Models with Developer tier pricing
  "zai-glm-4.7": { currency: "USD", input: 2.25, output: 2.75 },
  "gpt-oss-120b": { currency: "USD", input: 0.35, output: 0.75 },
  "llama3.1-8b": { currency: "USD", input: 0.1, output: 0.1 },
  "qwen3-235b-instruct": { currency: "USD", input: 0.6, output: 1.2 },

  // Models without Developer tier pricing — Free tier access
  "llama-3.3-70b": { unit: "free" },
  "llama-4-scout-17b-16e-instruct": { unit: "free" },
  "qwen-2.5-32b": { unit: "free" },
  "qwen-2.5-coder-32b": { unit: "free" },
  "qwen3-32b": { unit: "free" },
  "deepseek-r1-distill-llama-70b": { unit: "free" },
  "deepseek-r1-distill-llama-8b": { unit: "free" },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("glm")) return "glm";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("llama-4")) return "llama-4";
  if (id.includes("llama-3.3")) return "llama-3.3";
  if (id.includes("llama3.1") || id.includes("llama-3.1")) return "llama-3.1";
  if (id.includes("qwen3")) return "qwen3";
  if (id.includes("qwen-2.5-coder")) return "qwen-coder";
  if (id.includes("qwen-2.5")) return "qwen";
  if (id.includes("deepseek")) return "deepseek-r1";
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
    const pricing = HARDCODED_PRICING[id] ?? { unit: "free" };

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
    if (info.deprecated) modelDef.deprecated = true;
    if (info.reasoning) modelDef.reasoning = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Cerebras: ${models.length} models`);

  return { provider, models };
}
