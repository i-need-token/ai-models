import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "togetherai",
  name: "Together AI",
  url: "https://together.ai",
  api_docs: "https://docs.together.ai",
  apis: {
    openai: "https://api.together.xyz/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Pricing: https://together.ai/pricing (SSR page, browser-verified)
// - Model IDs: Together AI API & docs
// - Context lengths: Together AI docs (most models support 128k)
//
// Together AI is an inference platform hosting models from other providers
// (Zhipu AI, MiniMax, Moonshot AI, DeepSeek, Alibaba, OpenAI, Liquid AI,
// Google, Meta, Cogito, Essential AI) with its own per-token pricing.
// Pricing shown is Together AI's per-1M-token rate (USD).
// Some models have prompt caching pricing (cache_read).
//
// Model IDs use "--" instead of "/" to avoid filesystem issues
// (Together AI API uses "provider/model" format).
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
  // --- Zhipu AI / ZAI GLM family ---
  "zai-org--GLM-5.1": {
    name: "GLM 5.1",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "zai-org--GLM-5": {
    name: "GLM 5",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- MiniMax family ---
  "MiniMaxAI--MiniMax-M2.7": {
    name: "MiniMax M2.7",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "MiniMaxAI--MiniMax-M2.5": {
    name: "MiniMax M2.5",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Moonshot AI / Kimi family ---
  "moonshotai--Kimi-K2.6": {
    name: "Kimi K2.6",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "moonshotai--Kimi-K2.5": {
    name: "Kimi K2.5",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- DeepSeek family ---
  "deepseek-ai--DeepSeek-V4-Pro": {
    name: "DeepSeek V4 Pro",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },
  "deepseek-ai--DeepSeek-V3.1": {
    name: "DeepSeek V3.1",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Alibaba Qwen family ---
  "Qwen--Qwen3.6-Plus": {
    name: "Qwen 3.6 Plus",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "Qwen--Qwen3.5-397B-A17B": {
    name: "Qwen 3.5 397B A17B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "Qwen--Qwen3-Coder-Next": {
    name: "Qwen 3 Coder Next",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "Qwen--Qwen3-Coder-480B-A35B-Instruct": {
    name: "Qwen 3 Coder 480B A35B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "Qwen--Qwen3.5-9B": {
    name: "Qwen 3.5 9B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "Qwen--Qwen3-235B-A22B-FP8-Throughput": {
    name: "Qwen 3 235B A22B FP8 Throughput",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "Qwen--Qwen2.5-7B-Instruct-Turbo": {
    name: "Qwen 2.5 7B Instruct Turbo",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- OpenAI GPT-OSS family ---
  "openai--gpt-oss-120b": {
    name: "GPT OSS 120B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "openai--gpt-oss-20b": {
    name: "GPT OSS 20B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Liquid AI LFM family ---
  "liquid-ai--LFM2-24B-A2B": {
    name: "LFM2 24B A2B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Google Gemma family ---
  "google--gemma-4-31B-it": {
    name: "Gemma 4 31B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "google--gemma-3n-E4B-it": {
    name: "Gemma 3n E4B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Meta Llama family ---
  "meta-llama--Llama-3.3-70B-Instruct-Turbo": {
    name: "Llama 3.3 70B Turbo",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama--Meta-Llama-3.1-8B-Instruct-Lite": {
    name: "Llama 3.1 8B Lite",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Cogito family ---
  "cogito-ai--Cogito-v2.1-671B": {
    name: "Cogito v2.1 671B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },

  // --- Essential AI family ---
  "essential-ai--Rnj-1-Instruct": {
    name: "Rnj-1 Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: https://together.ai/pricing (browser-verified 2026-05-15)
// Some models have prompt caching pricing (cache_read).
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // ZAI GLM family
  "zai-org--GLM-5.1": { currency: "USD", input: 1.4, output: 4.4 },
  "zai-org--GLM-5": { currency: "USD", input: 1.0, output: 3.2 },

  // MiniMax family
  "MiniMaxAI--MiniMax-M2.7": { currency: "USD", input: 0.3, output: 1.2, cache_read: 0.06 },
  "MiniMaxAI--MiniMax-M2.5": { currency: "USD", input: 0.3, output: 1.2, cache_read: 0.06 },

  // Kimi family
  "moonshotai--Kimi-K2.6": { currency: "USD", input: 1.2, output: 4.5, cache_read: 0.2 },
  "moonshotai--Kimi-K2.5": { currency: "USD", input: 0.5, output: 2.8 },

  // DeepSeek family
  "deepseek-ai--DeepSeek-V4-Pro": { currency: "USD", input: 2.1, output: 4.4, cache_read: 0.2 },
  "deepseek-ai--DeepSeek-V3.1": { currency: "USD", input: 0.6, output: 1.7 },

  // Qwen family
  "Qwen--Qwen3.6-Plus": { currency: "USD", input: 0.5, output: 3.0 },
  "Qwen--Qwen3.5-397B-A17B": { currency: "USD", input: 0.6, output: 3.6 },
  "Qwen--Qwen3-Coder-Next": { currency: "USD", input: 0.5, output: 1.2 },
  "Qwen--Qwen3-Coder-480B-A35B-Instruct": { currency: "USD", input: 2.0, output: 2.0 },
  "Qwen--Qwen3.5-9B": { currency: "USD", input: 0.1, output: 0.15 },
  "Qwen--Qwen3-235B-A22B-FP8-Throughput": { currency: "USD", input: 0.2, output: 0.6 },
  "Qwen--Qwen2.5-7B-Instruct-Turbo": { currency: "USD", input: 0.3, output: 0.3 },

  // GPT-OSS family
  "openai--gpt-oss-120b": { currency: "USD", input: 0.15, output: 0.6 },
  "openai--gpt-oss-20b": { currency: "USD", input: 0.05, output: 0.2 },

  // Liquid AI family
  "liquid-ai--LFM2-24B-A2B": { currency: "USD", input: 0.03, output: 0.12 },

  // Gemma family
  "google--gemma-4-31B-it": { currency: "USD", input: 0.39, output: 0.97 },
  "google--gemma-3n-E4B-it": { currency: "USD", input: 0.06, output: 0.12 },

  // Llama family
  "meta-llama--Llama-3.3-70B-Instruct-Turbo": { currency: "USD", input: 0.88, output: 0.88 },
  "meta-llama--Meta-Llama-3.1-8B-Instruct-Lite": { currency: "USD", input: 0.1, output: 0.1 },

  // Cogito family
  "cogito-ai--Cogito-v2.1-671B": { currency: "USD", input: 1.25, output: 1.25 },

  // Essential AI family
  "essential-ai--Rnj-1-Instruct": { currency: "USD", input: 0.15, output: 0.15 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("GLM")) return "glm";
  if (id.includes("MiniMax")) return "minimax";
  if (id.includes("Kimi")) return "kimi";
  if (id.includes("DeepSeek")) return "deepseek";
  if (id.includes("Qwen3-Coder")) return "qwen-coder";
  if (id.includes("Qwen3.6")) return "qwen3.6";
  if (id.includes("Qwen3.5")) return "qwen3.5";
  if (id.includes("Qwen3")) return "qwen3";
  if (id.includes("Qwen2.5")) return "qwen2.5";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("LFM")) return "lfm";
  if (id.includes("gemma-4")) return "gemma-4";
  if (id.includes("gemma-3n")) return "gemma-3n";
  if (id.includes("Llama-3.3")) return "llama-3.3";
  if (id.includes("Llama-3.1") || id.includes("Llama3.1")) return "llama-3.1";
  if (id.includes("Cogito")) return "cogito";
  if (id.includes("Rnj")) return "rnj";
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
      console.warn(`  Together AI: skipping ${id} — no pricing`);
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

  console.log(`  Together AI: ${models.length} models`);

  return { provider, models };
}
