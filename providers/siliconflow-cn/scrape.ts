import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "siliconflow-cn",
  name: "SiliconFlow CN",
  url: "https://siliconflow.cn",
  api_docs: "https://docs.siliconflow.cn",
  apis: {
    openai: "https://api.siliconflow.cn/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: https://siliconflow.cn/models (browser-scraped, CNY per M tokens)
// - Model IDs: SiliconFlow CN website
// - Context lengths: cross-referenced with official provider documentation
//
// SiliconFlow CN is the Chinese version of SiliconFlow, hosting models from
// other providers (DeepSeek, Alibaba/Qwen, Zhipu AI/GLM, Moonshot AI/Kimi,
// MiniMax, StepFun, InclusionAI, ByteDance, Tencent, THUDM) with CNY per-token
// pricing.
//
// Pricing shown is SiliconFlow CN's per-1M-token rate (CNY).
// "Pro/" variants (dedicated deployment) are excluded — same model, same price.
// Free models (￥0/￥0) with small size (< 10B) or specialized purpose are excluded.
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
  "deepseek-v4-flash": {
    name: "DeepSeek V4 Flash",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "deepseek-v3.2": {
    name: "DeepSeek V3.2",
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
    reasoning: true,
  },
  "deepseek-r1": {
    name: "DeepSeek R1",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "deepseek-v3": {
    name: "DeepSeek V3",
    context: 163840,
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
  },

  // --- Qwen3.6 family ---
  "qwen3.6-35b-a3b": {
    name: "Qwen 3.6 35B A3B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "qwen3.6-27b": {
    name: "Qwen 3.6 27B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // --- Qwen3.5 family ---
  "qwen3.5-397b-a17b": {
    name: "Qwen 3.5 397B A17B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "qwen3.5-122b-a10b": {
    name: "Qwen 3.5 122B A10B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "qwen3.5-35b-a3b": {
    name: "Qwen 3.5 35B A3B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "qwen3.5-27b": {
    name: "Qwen 3.5 27B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "qwen3.5-9b": {
    name: "Qwen 3.5 9B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // --- Qwen3-VL family ---
  "qwen3-vl-32b-instruct": {
    name: "Qwen3 VL 32B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "qwen3-vl-32b-thinking": {
    name: "Qwen3 VL 32B Thinking",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "qwen3-vl-8b-instruct": {
    name: "Qwen3 VL 8B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "qwen3-vl-8b-thinking": {
    name: "Qwen3 VL 8B Thinking",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "qwen3-vl-30b-a3b-instruct": {
    name: "Qwen3 VL 30B A3B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "qwen3-vl-30b-a3b-thinking": {
    name: "Qwen3 VL 30B A3B Thinking",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },

  // --- Qwen3-Omni family ---
  "qwen3-omni-30b-a3b-instruct": {
    name: "Qwen3 Omni 30B A3B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "qwen3-omni-30b-a3b-thinking": {
    name: "Qwen3 Omni 30B A3B Thinking",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },

  // --- Qwen3 family ---
  "qwen3-coder-30b-a3b-instruct": {
    name: "Qwen3 Coder 30B A3B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "qwen3-30b-a3b-instruct-2507": {
    name: "Qwen3 30B A3B Instruct 2507",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "qwen3-32b": {
    name: "Qwen3 32B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "qwen3-14b": {
    name: "Qwen3 14B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // --- StepFun family ---
  "step-3.5-flash": {
    name: "Step 3.5 Flash",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // --- InclusionAI family ---
  "ling-flash-2.0": {
    name: "Ling Flash 2.0",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "ling-mini-2.0": {
    name: "Ling Mini 2.0",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // --- ByteDance family ---
  "seed-oss-36b-instruct": {
    name: "Seed OSS 36B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // --- GLM family ---
  "glm-4.5v": {
    name: "GLM 4.5V",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "glm-4.5-air": {
    name: "GLM 4.5 Air",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "glm-4-32b-0414": {
    name: "GLM 4 32B 0414",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // --- Tencent Hunyuan family ---
  "hunyuan-a13b-instruct": {
    name: "Hunyuan A13B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // --- Qwen2.5 family ---
  "qwen2.5-72b-instruct-128k": {
    name: "Qwen 2.5 72B Instruct 128K",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "qwen2.5-72b-instruct": {
    name: "Qwen 2.5 72B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "qwen2.5-32b-instruct": {
    name: "Qwen 2.5 32B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "qwen2.5-14b-instruct": {
    name: "Qwen 2.5 14B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
};

// ---------------------------------------------------------------------------
// Hardcoded CNY pricing (per 1M tokens)
// Source: https://siliconflow.cn/models (browser-scraped 2026-05-16)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // DeepSeek family
  "deepseek-v4-flash": { currency: "CNY", input: 1, output: 2 },
  "deepseek-v3.2": { currency: "CNY", input: 2, output: 3 },
  "deepseek-v3.1-terminus": { currency: "CNY", input: 4, output: 12 },
  "deepseek-r1": { currency: "CNY", input: 4, output: 16 },
  "deepseek-v3": { currency: "CNY", input: 2, output: 8 },

  // MiniMax family
  "minimax-m2.5": { currency: "CNY", input: 2.1, output: 8.4 },

  // Qwen3.6 family
  "qwen3.6-35b-a3b": { currency: "CNY", input: 1.6, output: 12.8 },
  "qwen3.6-27b": { currency: "CNY", input: 1.8, output: 14.4 },

  // Qwen3.5 family
  "qwen3.5-397b-a17b": { currency: "CNY", input: 2, output: 1.2 },
  "qwen3.5-122b-a10b": { currency: "CNY", input: 2, output: 16 },
  "qwen3.5-35b-a3b": { currency: "CNY", input: 1.6, output: 12.8 },
  "qwen3.5-27b": { currency: "CNY", input: 1.8, output: 14.4 },
  "qwen3.5-9b": { currency: "CNY", input: 1.5, output: 12 },

  // Qwen3-VL family
  "qwen3-vl-32b-instruct": { currency: "CNY", input: 1, output: 4 },
  "qwen3-vl-32b-thinking": { currency: "CNY", input: 1, output: 10 },
  "qwen3-vl-8b-instruct": { currency: "CNY", input: 0.5, output: 2 },
  "qwen3-vl-8b-thinking": { currency: "CNY", input: 0.5, output: 5 },
  "qwen3-vl-30b-a3b-instruct": { currency: "CNY", input: 0.7, output: 2.8 },
  "qwen3-vl-30b-a3b-thinking": { currency: "CNY", input: 0.7, output: 2.8 },

  // Qwen3-Omni family
  "qwen3-omni-30b-a3b-instruct": { currency: "CNY", input: 0.7, output: 2.8 },
  "qwen3-omni-30b-a3b-thinking": { currency: "CNY", input: 0.7, output: 2.8 },

  // Qwen3 family
  "qwen3-coder-30b-a3b-instruct": { currency: "CNY", input: 0.7, output: 2.8 },
  "qwen3-30b-a3b-instruct-2507": { currency: "CNY", input: 0.7, output: 2.8 },
  "qwen3-32b": { currency: "CNY", input: 1, output: 4 },
  "qwen3-14b": { currency: "CNY", input: 0.5, output: 2 },

  // StepFun family
  "step-3.5-flash": { currency: "CNY", input: 0.7, output: 2.1 },

  // InclusionAI family
  "ling-flash-2.0": { currency: "CNY", input: 1, output: 4 },
  "ling-mini-2.0": { currency: "CNY", input: 0.5, output: 2 },

  // ByteDance family
  "seed-oss-36b-instruct": { currency: "CNY", input: 1.5, output: 4 },

  // GLM family
  "glm-4.5v": { currency: "CNY", input: 1, output: 6 },
  "glm-4.5-air": { currency: "CNY", input: 1, output: 6 },
  "glm-4-32b-0414": { currency: "CNY", input: 1.89, output: 1.89 },

  // Tencent Hunyuan family
  "hunyuan-a13b-instruct": { currency: "CNY", input: 1, output: 4 },

  // Qwen2.5 family
  "qwen2.5-72b-instruct-128k": { currency: "CNY", input: 4.13, output: 4.13 },
  "qwen2.5-72b-instruct": { currency: "CNY", input: 4.13, output: 4.13 },
  "qwen2.5-32b-instruct": { currency: "CNY", input: 1.26, output: 1.26 },
  "qwen2.5-14b-instruct": { currency: "CNY", input: 0.7, output: 0.7 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("deepseek-v4")) return "deepseek-v4";
  if (id.includes("deepseek-v3.2")) return "deepseek-v3.2";
  if (id.includes("deepseek-v3.1-terminus")) return "deepseek-v3.1";
  if (id.includes("deepseek-v3")) return "deepseek-v3";
  if (id.includes("deepseek-r1")) return "deepseek-r1";
  if (id.includes("deepseek")) return "deepseek";
  if (id.includes("qwen3.6")) return "qwen3.6";
  if (id.includes("qwen3.5")) return "qwen3.5";
  if (id.includes("qwen3-vl")) return "qwen3-vl";
  if (id.includes("qwen3-omni")) return "qwen3-omni";
  if (id.includes("qwen3-coder")) return "qwen3-coder";
  if (id.includes("qwen3")) return "qwen3";
  if (id.includes("qwen2.5")) return "qwen2.5";
  if (id.includes("minimax")) return "minimax";
  if (id.includes("glm")) return "glm";
  if (id.includes("step")) return "step";
  if (id.includes("ling")) return "ling";
  if (id.includes("seed-oss")) return "seed-oss";
  if (id.includes("hunyuan")) return "hunyuan";
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
      console.warn(`  SiliconFlow CN: skipping ${id} — no pricing`);
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

  console.log(`  SiliconFlow CN: ${models.length} models`);

  return { provider, models };
}
