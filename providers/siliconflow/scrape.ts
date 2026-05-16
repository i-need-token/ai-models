import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "siliconflow",
  name: "SiliconFlow",
  url: "https://siliconflow.com",
  api_docs: "https://docs.siliconflow.cn",
  apis: {
    openai: "https://api.siliconflow.cn/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Pricing: https://siliconflow.com/pricing (SSR page, browser-verified)
// - Model IDs: SiliconFlow API & docs
// - Context lengths: SiliconFlow pricing page
//
// SiliconFlow is an inference platform hosting models from other providers
// (DeepSeek, Alibaba, Zhipu AI, Moonshot AI, MiniMax, OpenAI, Google,
// Tencent) with its own per-token pricing.
//
// Pricing shown is SiliconFlow's per-1M-token rate (USD).
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
  "deepseek-v4-flash": {
    name: "DeepSeek V4 Flash",
    context: 1048576,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },
  "deepseek-v3.2": {
    name: "DeepSeek V3.2",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-v3.2-exp": {
    name: "DeepSeek V3.2 Exp",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-v3.1-terminus": {
    name: "DeepSeek V3.1 Terminus",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-v3.1-nex-n1": {
    name: "DeepSeek V3.1 Nex N1",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Alibaba Qwen family ---
  "qwen3.6-27b": {
    name: "Qwen 3.6 27B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3.6-35b-a3b": {
    name: "Qwen 3.6 35B A3B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3.5-9b": {
    name: "Qwen 3.5 9B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwen3.5-122b-a10b": {
    name: "Qwen 3.5 122B A10B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3.5-27b": {
    name: "Qwen 3.5 27B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Zhipu AI / ZAI GLM family ---
  "glm-5.1": {
    name: "GLM 5.1",
    context: 204800,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "glm-5": {
    name: "GLM 5",
    context: 204800,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "glm-4.7": {
    name: "GLM 4.7",
    context: 204800,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "glm-4.6v": {
    name: "GLM 4.6V",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "glm-4.6": {
    name: "GLM 4.6",
    context: 204800,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Moonshot AI / Kimi family ---
  "kimi-k2-instruct": {
    name: "Kimi K2 Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "kimi-k2-instruct-0905": {
    name: "Kimi K2 Instruct 0905",
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
  "kimi-k2.6": {
    name: "Kimi K2.6",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- MiniMax family ---
  "minimax-m2.5": {
    name: "MiniMax M2.5",
    context: 196608,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
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
  "gpt-oss-20b": {
    name: "GPT OSS 20B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Google Gemma family ---
  "gemma-4-26b-a4b-it": {
    name: "Gemma 4 26B A4B IT",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-4-31b-it": {
    name: "Gemma 4 31B IT",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Tencent Hunyuan family ---
  "hunyuan-a13b-instruct": {
    name: "Hunyuan A13B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Hy3 ---
  "hy3-preview": {
    name: "Hy3 Preview",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: https://siliconflow.com/pricing (browser-verified 2026-05-15)
// "Cached Input" price = cache_read
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // DeepSeek family
  "deepseek-v4-pro": { currency: "USD", input: 1.74, output: 3.48, cache_read: 0.145 },
  "deepseek-v4-flash": { currency: "USD", input: 0.14, output: 0.28, cache_read: 0.028 },
  "deepseek-v3.2": { currency: "USD", input: 0.27, output: 0.42, cache_read: 0.135 },
  "deepseek-v3.2-exp": { currency: "USD", input: 0.27, output: 0.41 },
  "deepseek-v3.1-terminus": { currency: "USD", input: 0.27, output: 1.0 },
  "deepseek-v3.1-nex-n1": { currency: "USD", input: 0.27, output: 1.0 },

  // Qwen family
  "qwen3.6-27b": { currency: "USD", input: 0.3, output: 3.2 },
  "qwen3.6-35b-a3b": { currency: "USD", input: 0.2, output: 1.6 },
  "qwen3.5-9b": { currency: "USD", input: 0.1, output: 0.15 },
  "qwen3.5-122b-a10b": { currency: "USD", input: 0.26, output: 2.08 },
  "qwen3.5-27b": { currency: "USD", input: 0.25, output: 2.0 },

  // GLM family
  "glm-5.1": { currency: "USD", input: 1.4, output: 4.4, cache_read: 0.26 },
  "glm-5": { currency: "USD", input: 0.95, output: 2.55, cache_read: 0.2 },
  "glm-4.7": { currency: "USD", input: 0.42, output: 2.2, cache_read: 0.11 },
  "glm-4.6v": { currency: "USD", input: 0.3, output: 0.9 },
  "glm-4.6": { currency: "USD", input: 0.39, output: 1.9 },

  // Kimi family
  "kimi-k2-instruct": { currency: "USD", input: 0.58, output: 2.29 },
  "kimi-k2-instruct-0905": { currency: "USD", input: 0.4, output: 2.0 },
  "kimi-k2.5": { currency: "USD", input: 0.45, output: 2.25, cache_read: 0.07 },
  "kimi-k2.6": { currency: "USD", input: 0.9, output: 4.0, cache_read: 0.2 },

  // MiniMax family
  "minimax-m2.5": { currency: "USD", input: 0.3, output: 1.2, cache_read: 0.03 },

  // GPT-OSS family
  "gpt-oss-120b": { currency: "USD", input: 0.05, output: 0.45 },
  "gpt-oss-20b": { currency: "USD", input: 0.04, output: 0.18 },

  // Gemma family
  "gemma-4-26b-a4b-it": { currency: "USD", input: 0.12, output: 0.4 },
  "gemma-4-31b-it": { currency: "USD", input: 0.13, output: 0.4 },

  // Tencent Hunyuan family
  "hunyuan-a13b-instruct": { currency: "USD", input: 0.14, output: 0.57 },

  // Hy3
  "hy3-preview": { currency: "USD", input: 0.066, output: 0.26, cache_read: 0.029 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("deepseek-v4")) return "deepseek-v4";
  if (id.includes("deepseek-v3.2")) return "deepseek-v3.2";
  if (id.includes("deepseek-v3.1-terminus")) return "deepseek-v3.1";
  if (id.includes("deepseek-v3.1")) return "deepseek-v3.1";
  if (id.includes("deepseek")) return "deepseek";
  if (id.includes("qwen3.6")) return "qwen3.6";
  if (id.includes("qwen3.5")) return "qwen3.5";
  if (id.includes("glm")) return "glm";
  if (id.includes("kimi")) return "kimi";
  if (id.includes("minimax")) return "minimax";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("gemma")) return "gemma";
  if (id.includes("hunyuan")) return "hunyuan";
  if (id.includes("hy3")) return "hy3";
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
      console.warn(`  SiliconFlow: skipping ${id} — no pricing`);
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

  console.log(`  SiliconFlow: ${models.length} models`);

  return { provider, models };
}
