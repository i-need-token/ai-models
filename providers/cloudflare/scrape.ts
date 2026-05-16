import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "cloudflare",
  name: "Cloudflare Workers AI",
  url: "https://ai.cloudflare.com",
  api_docs: "https://developers.cloudflare.com/workers-ai",
  apis: {
    openai: "https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
//   (Markdown endpoint, verified 2026-05-15)
// - Model IDs: Cloudflare Workers AI API (@cf/ prefix)
// - Context lengths: Known from model providers + Cloudflare docs
//
// Cloudflare Workers AI is an inference platform hosting models from other
// providers (Meta, DeepSeek, Mistral, Google, Qwen, OpenAI, Zhipu AI,
// NVIDIA, Moonshot AI, IBM, AI Singapore) with per-token pricing.
//
// Pricing shown is Cloudflare's per-1M-token rate (USD).
// Some models have prompt caching pricing (cache_read).
// Many older models are marked "Planned deprecation" — included with
// deprecated flag.
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
  deprecated?: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  // --- Meta Llama family ---
  "llama-3.2-1b-instruct": {
    name: "Llama 3.2 1B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "llama-3.2-3b-instruct": {
    name: "Llama 3.2 3B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "llama-3.1-8b-instruct-fp8-fast": {
    name: "Llama 3.1 8B FP8 Fast",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-3.2-11b-vision-instruct": {
    name: "Llama 3.2 11B Vision",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "llama-3.1-70b-instruct-fp8-fast": {
    name: "Llama 3.1 70B FP8 Fast",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-3.3-70b-instruct-fp8-fast": {
    name: "Llama 3.3 70B FP8 Fast",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-3.1-8b-instruct": {
    name: "Llama 3.1 8B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
    deprecated: true,
  },
  "llama-3.1-8b-instruct-fp8": {
    name: "Llama 3.1 8B FP8",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "llama-3.1-8b-instruct-awq": {
    name: "Llama 3.1 8B AWQ",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    deprecated: true,
  },
  "llama-3-8b-instruct": {
    name: "Llama 3 8B Instruct",
    context: 8192,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    deprecated: true,
  },
  "llama-3-8b-instruct-awq": {
    name: "Llama 3 8B AWQ",
    context: 8192,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    deprecated: true,
  },
  "llama-2-7b-chat-fp16": {
    name: "Llama 2 7B Chat FP16",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    deprecated: true,
  },
  "llama-guard-3-8b": {
    name: "Llama Guard 3 8B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "llama-4-scout-17b-16e-instruct": {
    name: "Llama 4 Scout 17Bx16E",
    context: 327680,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- DeepSeek family ---
  "deepseek-r1-distill-qwen-32b": {
    name: "DeepSeek R1 Distill Qwen 32B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },

  // --- Mistral family ---
  "mistral-7b-instruct-v0.1": {
    name: "Mistral 7B Instruct v0.1",
    context: 32768,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    deprecated: true,
  },
  "mistral-small-3.1-24b-instruct": {
    name: "Mistral Small 3.1 24B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Google Gemma family ---
  "gemma-3-12b-it": {
    name: "Gemma 3 12B IT",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    deprecated: true,
  },
  "gemma-4-26b-a4b-it": {
    name: "Gemma 4 26B A4B IT",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    reasoning: true,
    openWeights: true,
  },

  // --- Qwen family ---
  "qwq-32b": {
    name: "QwQ 32B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "qwen2.5-coder-32b-instruct": {
    name: "Qwen 2.5 Coder 32B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3-30b-a3b-fp8": {
    name: "Qwen 3 30B A3B FP8",
    context: 40960,
    output: 40960,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
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
    reasoning: true,
    toolCall: true,
    openWeights: true,
  },
  "gpt-oss-20b": {
    name: "GPT OSS 20B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    openWeights: true,
  },

  // --- Zhipu AI GLM family ---
  "glm-4.7-flash": {
    name: "GLM 4.7 Flash",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },

  // --- NVIDIA Nemotron family ---
  "nemotron-3-120b-a12b": {
    name: "Nemotron 3 120B A12B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    openWeights: true,
  },

  // --- Moonshot AI Kimi family ---
  "kimi-k2.5": {
    name: "Kimi K2.5",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    openWeights: true,
    deprecated: true,
  },
  "kimi-k2.6": {
    name: "Kimi K2.6",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    openWeights: true,
  },

  // --- AI Singapore SEA-LION family ---
  "gemma-sea-lion-v4-27b-it": {
    name: "SEA-LION v4 27B IT",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- IBM Granite family ---
  "granite-4.0-h-micro": {
    name: "Granite 4.0 H Micro",
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
// Source: https://developers.cloudflare.com/workers-ai/platform/pricing/
// (Markdown endpoint, verified 2026-05-15)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // Meta Llama family
  "llama-3.2-1b-instruct": { currency: "USD", input: 0.027, output: 0.201 },
  "llama-3.2-3b-instruct": { currency: "USD", input: 0.051, output: 0.335 },
  "llama-3.1-8b-instruct-fp8-fast": { currency: "USD", input: 0.045, output: 0.384 },
  "llama-3.2-11b-vision-instruct": { currency: "USD", input: 0.049, output: 0.676 },
  "llama-3.1-70b-instruct-fp8-fast": { currency: "USD", input: 0.293, output: 2.253 },
  "llama-3.3-70b-instruct-fp8-fast": { currency: "USD", input: 0.293, output: 2.253 },
  "llama-3.1-8b-instruct": { currency: "USD", input: 0.282, output: 0.827 },
  "llama-3.1-8b-instruct-fp8": { currency: "USD", input: 0.152, output: 0.287 },
  "llama-3.1-8b-instruct-awq": { currency: "USD", input: 0.123, output: 0.266 },
  "llama-3-8b-instruct": { currency: "USD", input: 0.282, output: 0.827 },
  "llama-3-8b-instruct-awq": { currency: "USD", input: 0.123, output: 0.266 },
  "llama-2-7b-chat-fp16": { currency: "USD", input: 0.556, output: 6.667 },
  "llama-guard-3-8b": { currency: "USD", input: 0.484, output: 0.03 },
  "llama-4-scout-17b-16e-instruct": { currency: "USD", input: 0.27, output: 0.85 },

  // DeepSeek family
  "deepseek-r1-distill-qwen-32b": { currency: "USD", input: 0.497, output: 4.881 },

  // Mistral family
  "mistral-7b-instruct-v0.1": { currency: "USD", input: 0.11, output: 0.19 },
  "mistral-small-3.1-24b-instruct": { currency: "USD", input: 0.351, output: 0.555 },

  // Google Gemma family
  "gemma-3-12b-it": { currency: "USD", input: 0.345, output: 0.556 },
  "gemma-4-26b-a4b-it": { currency: "USD", input: 0.1, output: 0.3 },

  // Qwen family
  "qwq-32b": { currency: "USD", input: 0.66, output: 1.0 },
  "qwen2.5-coder-32b-instruct": { currency: "USD", input: 0.66, output: 1.0 },
  "qwen3-30b-a3b-fp8": { currency: "USD", input: 0.051, output: 0.335 },

  // OpenAI GPT-OSS family
  "gpt-oss-120b": { currency: "USD", input: 0.35, output: 0.75 },
  "gpt-oss-20b": { currency: "USD", input: 0.2, output: 0.3 },

  // GLM family
  "glm-4.7-flash": { currency: "USD", input: 0.06, output: 0.4 },

  // NVIDIA Nemotron family
  "nemotron-3-120b-a12b": { currency: "USD", input: 0.5, output: 1.5 },

  // Kimi family (with cache_read)
  "kimi-k2.5": { currency: "USD", input: 0.6, output: 3.0, cache_read: 0.1 },
  "kimi-k2.6": { currency: "USD", input: 0.95, output: 4.0, cache_read: 0.16 },

  // AI Singapore SEA-LION family
  "gemma-sea-lion-v4-27b-it": { currency: "USD", input: 0.351, output: 0.555 },

  // IBM Granite family
  "granite-4.0-h-micro": { currency: "USD", input: 0.017, output: 0.112 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("llama-4")) return "llama-4";
  if (id.includes("llama-guard")) return "llama-guard";
  if (id.includes("llama-3.3")) return "llama-3.3";
  if (id.includes("llama-3.2")) return "llama-3.2";
  if (id.includes("llama-3.1")) return "llama-3.1";
  if (id.includes("llama-3")) return "llama-3";
  if (id.includes("llama-2")) return "llama-2";
  if (id.includes("deepseek")) return "deepseek-r1";
  if (id.includes("mistral")) return "mistral";
  if (id.includes("gemma-4")) return "gemma-4";
  if (id.includes("gemma-3")) return "gemma-3";
  if (id.includes("qwq")) return "qwq";
  if (id.includes("qwen2.5-coder")) return "qwen-coder";
  if (id.includes("qwen3")) return "qwen3";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("glm")) return "glm";
  if (id.includes("nemotron")) return "nemotron";
  if (id.includes("kimi")) return "kimi";
  if (id.includes("sea-lion")) return "sea-lion";
  if (id.includes("granite")) return "granite";
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
      console.warn(`  Cloudflare: skipping ${id} — no pricing`);
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
    if (info.deprecated) modelDef.deprecated = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Cloudflare: ${models.length} models`);

  return { provider, models };
}
