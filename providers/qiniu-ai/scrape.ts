import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "qiniu-ai",
  name: "Qiniu AI",
  url: "https://qiniu.com/ai",
  api_docs: "https://developer.qiniu.com/aitokenapi/12884/how-to-get-api-key",
  apis: {
    openai: "https://api.qnaigc.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-17)
//
// Pricing source: https://qiniu.com/ai/models (browser-scraped SSR HTML)
// Model IDs source: https://api.qnaigc.com/v1/models (public API, 58 models)
//
// Qiniu AI is an inference platform by Qiniu Cloud (七牛云) offering
// serverless model APIs with per-token CNY pricing. It hosts models from
// DeepSeek, MoonshotAI, ZhipuAI (Z-AI), MiniMax, Xiaomi, Bytedance (Doubao),
// Alibaba (Qwen), OpenAI, NVIDIA, Meituan, and Tencent.
//
// Pricing is in CNY per K tokens on the website; converted to CNY per M tokens
// (multiply by 1000) using Math.round(value * 1e6) / 1e6 to avoid float noise.
//
// Model IDs use provider/model format (e.g., deepseek/deepseek-v4-pro).
// In YAML filenames and id fields, / is flattened to --.
//
// Some models on the website show "更多 X 个价格" (more X prices) indicating
// tiered pricing. We use the primary (short context) rate as default.
//
// Models marked "已退役" (retired) on the website are included with
// deprecated: true.
//
// Models marked "免费" (free) or "限时免费" (limited time free) use FreePricing.
//
// Models in the API but without pricing on the website are skipped per
// project rule (never fabricate missing data).
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context?: number;
  output?: number;
  openWeights?: boolean;
  reasoning?: boolean;
  toolCall?: boolean;
  deprecated?: boolean;
  modalities?: { input: ModelModality[]; output: ModelModality[] };
}

const MODELS: Record<string, ModelInfo> = {
  // --- DeepSeek ---
  "deepseek--deepseek-v4-pro": {
    name: "DeepSeek V4 Pro",
    context: 1000000,
    output: 1000000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "deepseek--deepseek-v4-flash": {
    name: "DeepSeek V4 Flash",
    context: 1000000,
    output: 1000000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "deepseek--deepseek-v3.2-251201": {
    name: "DeepSeek V3.2",
    context: 131072,
    output: 131072,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "deepseek--deepseek-v3.2-exp": {
    name: "DeepSeek V3.2 Exp",
    context: 131072,
    output: 131072,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "deepseek--deepseek-v3.2-exp-thinking": {
    name: "DeepSeek V3.2 Exp Thinking",
    context: 131072,
    output: 131072,
    openWeights: true,
    reasoning: true,
  },
  "deepseek--deepseek-v3.1-terminus": {
    name: "DeepSeek V3.1 Terminus",
    context: 131072,
    output: 131072,
    openWeights: true,
    toolCall: true,
  },
  "deepseek--deepseek-v3.1-terminus-thinking": {
    name: "DeepSeek V3.1 Terminus Thinking",
    context: 131072,
    output: 131072,
    openWeights: true,
    reasoning: true,
  },
  "deepseek-v3.1": {
    name: "DeepSeek V3.1",
    context: 131072,
    output: 131072,
    openWeights: true,
    toolCall: true,
  },
  "deepseek-v3-0324": {
    name: "DeepSeek V3 0324",
    context: 131072,
    output: 131072,
    openWeights: true,
    toolCall: true,
  },
  "deepseek-v3": {
    name: "DeepSeek V3",
    context: 131072,
    output: 131072,
    openWeights: true,
    toolCall: true,
  },
  "deepseek-r1-0528": {
    name: "DeepSeek R1 0528",
    context: 163840,
    output: 163840,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "deepseek-r1": {
    name: "DeepSeek R1",
    context: 163840,
    output: 163840,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },

  // --- MoonshotAI / Kimi ---
  "moonshotai--kimi-k2.6": {
    name: "Kimi K2.6",
    context: 262144,
    output: 262144,
    openWeights: true,
    reasoning: true,
    toolCall: true,
    modalities: { input: ["text", "image"], output: ["text"] },
  },
  "moonshotai--kimi-k2.5": {
    name: "Kimi K2.5",
    context: 262144,
    output: 262144,
    openWeights: true,
    reasoning: true,
    toolCall: true,
    modalities: { input: ["text", "image"], output: ["text"] },
  },
  "moonshotai--kimi-k2-thinking": {
    name: "Kimi K2 Thinking",
    context: 262144,
    output: 262144,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "kimi-k2": {
    name: "Kimi K2",
    context: 262144,
    output: 262144,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },

  // --- ZhipuAI / Z-AI / GLM ---
  "z-ai--glm-5.1": {
    name: "GLM 5.1",
    context: 200000,
    output: 200000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "z-ai--glm-5": {
    name: "GLM 5",
    context: 200000,
    output: 200000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "z-ai--glm-4.7": {
    name: "GLM 4.7",
    context: 200000,
    output: 200000,
    openWeights: true,
    toolCall: true,
  },
  "z-ai--glm-4.6": {
    name: "GLM 4.6",
    context: 200000,
    output: 200000,
    openWeights: true,
    toolCall: true,
  },
  "glm-4.5": {
    name: "GLM 4.5",
    context: 128000,
    output: 128000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },

  // --- MiniMax ---
  "minimax--minimax-m2.7": {
    name: "MiniMax M2.7",
    context: 204800,
    output: 204800,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "minimax--minimax-m2.5": {
    name: "MiniMax M2.5",
    context: 204800,
    output: 204800,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "minimax--minimax-m2.1": {
    name: "MiniMax M2.1",
    context: 204800,
    output: 204800,
    openWeights: true,
    toolCall: true,
  },
  "minimax--minimax-m2": {
    name: "MiniMax M2",
    context: 204800,
    output: 204800,
    openWeights: true,
    toolCall: true,
    deprecated: true,
  },
  "MiniMax-M1": {
    name: "MiniMax M1",
    context: 1000000,
    output: 80000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },

  // --- Xiaomi ---
  "xiaomi--mimo-v2-flash": {
    name: "MiMo V2 Flash",
    context: 262144,
    output: 262144,
    openWeights: true,
    reasoning: true,
  },

  // --- Doubao (Bytedance) ---
  "doubao-seed-1.6-flash": {
    name: "Doubao Seed 1.6 Flash",
    context: 256000,
    output: 16000,
    modalities: { input: ["text", "image"], output: ["text"] },
  },
  "doubao-seed-1.6": {
    name: "Doubao Seed 1.6",
    context: 256000,
    output: 16000,
    modalities: { input: ["text", "image"], output: ["text"] },
    toolCall: true,
  },
  "doubao-1.5-pro-32k": {
    name: "Doubao 1.5 Pro 32k",
    context: 128000,
    output: 16000,
    toolCall: true,
  },
  "doubao-1.5-thinking-pro": {
    name: "Doubao 1.5 Thinking Pro",
    context: 128000,
    output: 16000,
    reasoning: true,
    deprecated: true,
  },
  "doubao-1.5-vision-pro": {
    name: "Doubao 1.5 Vision Pro",
    context: 128000,
    output: 16000,
    modalities: { input: ["text", "image"], output: ["text"] },
    deprecated: true,
  },
  "doubao-seed-1.6-thinking": {
    name: "Doubao Seed 1.6 Thinking",
    context: 256000,
    output: 16000,
    modalities: { input: ["text", "image"], output: ["text"] },
    reasoning: true,
    deprecated: true,
  },

  // --- Qwen ---
  "qwen3-max": {
    name: "Qwen3 Max",
    context: 256000,
    output: 256000,
    toolCall: true,
  },
  "qwen3-max-preview": {
    name: "Qwen3 Max Preview",
    context: 256000,
    output: 256000,
    toolCall: true,
  },
  "qwen3-coder-480b-a35b-instruct": {
    name: "Qwen3 Coder 480B A35B Instruct",
    context: 256000,
    output: 256000,
    openWeights: true,
    toolCall: true,
  },
  "qwen3-235b-a22b": {
    name: "Qwen3 235B A22B",
    context: 256000,
    output: 256000,
    openWeights: true,
    toolCall: true,
  },
  "qwen3-235b-a22b-instruct-2507": {
    name: "Qwen3 235B A22B Instruct 2507",
    context: 256000,
    output: 256000,
    openWeights: true,
    toolCall: true,
  },
  "qwen3-235b-a22b-thinking-2507": {
    name: "Qwen3 235B A22B Thinking 2507",
    context: 256000,
    output: 256000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "qwen3-32b": {
    name: "Qwen3 32B",
    context: 256000,
    output: 256000,
    openWeights: true,
    toolCall: true,
  },
  "qwen3-30b-a3b": {
    name: "Qwen3 30B A3B",
    context: 256000,
    output: 256000,
    openWeights: true,
    toolCall: true,
  },
  "qwen3-30b-a3b-instruct-2507": {
    name: "Qwen3 30B A3B Instruct 2507",
    context: 256000,
    output: 256000,
    openWeights: true,
    toolCall: true,
  },
  "qwen3-30b-a3b-thinking-2507": {
    name: "Qwen3 30B A3B Thinking 2507",
    context: 256000,
    output: 256000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "qwen3-next-80b-a3b-instruct": {
    name: "Qwen3 Next 80B A3B Instruct",
    context: 256000,
    output: 256000,
    openWeights: true,
    toolCall: true,
  },
  "qwen3-next-80b-a3b-thinking": {
    name: "Qwen3 Next 80B A3B Thinking",
    context: 256000,
    output: 256000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "qwen3-vl-30b-a3b-thinking": {
    name: "Qwen3 VL 30B A3B Thinking",
    context: 256000,
    output: 256000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
    modalities: { input: ["text", "image"], output: ["text"] },
  },
  "qwen-max-2025-01-25": {
    name: "Qwen2.5 Max 2025-01-25",
    context: 256000,
    output: 256000,
    toolCall: true,
  },
  "qwen-turbo": {
    name: "Qwen Turbo",
    context: 256000,
    output: 256000,
    toolCall: true,
    reasoning: true,
  },
  "qwen-vl-max-2025-01-25": {
    name: "Qwen VL Max 2025-01-25",
    context: 256000,
    output: 256000,
    modalities: { input: ["text", "image"], output: ["text"] },
    toolCall: true,
  },
  "qwen2.5-vl-72b-instruct": {
    name: "Qwen2.5 VL 72B Instruct",
    context: 256000,
    output: 256000,
    openWeights: true,
    modalities: { input: ["text", "image"], output: ["text"] },
    toolCall: true,
  },
  "qwen2.5-vl-7b-instruct": {
    name: "Qwen2.5 VL 7B Instruct",
    context: 256000,
    output: 256000,
    openWeights: true,
    modalities: { input: ["text", "image"], output: ["text"] },
    toolCall: true,
  },

  // --- NVIDIA ---
  "nvidia--nemotron-3-super-120b-a12b": {
    name: "Nemotron 3 Super 120B A12B",
    context: 1000000,
    output: 1000000,
    openWeights: true,
  },

  // --- Meituan ---
  "meituan--longcat-flash-lite": {
    name: "LongCat Flash Lite",
    context: 256000,
    output: 256000,
    openWeights: true,
    toolCall: true,
  },

  // --- Tencent ---
  "tencent--hy3-preview": {
    name: "Hy3 Preview",
    context: 256000,
    output: 256000,
    reasoning: true,
    toolCall: true,
    deprecated: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (CNY per million tokens)
//
// Source: https://qiniu.com/ai/models (browser-scraped, accessed 2026-05-17)
// Original prices are CNY per K tokens; converted to per M tokens (×1000).
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // DeepSeek
  "deepseek--deepseek-v4-pro": { currency: "CNY", input: 12, output: 24 },
  "deepseek--deepseek-v4-flash": { currency: "CNY", input: 1, output: 2 },
  "deepseek--deepseek-v3.2-251201": { currency: "CNY", input: 2, output: 3 },
  "deepseek--deepseek-v3.2-exp": { currency: "CNY", input: 2, output: 3 },
  "deepseek--deepseek-v3.2-exp-thinking": { currency: "CNY", input: 2, output: 3 },
  "deepseek--deepseek-v3.1-terminus": { currency: "CNY", input: 4, output: 12 },
  "deepseek--deepseek-v3.1-terminus-thinking": { currency: "CNY", input: 4, output: 12 },
  "deepseek-v3.1": { currency: "CNY", input: 4, output: 12 },
  "deepseek-v3-0324": { currency: "CNY", input: 2, output: 8 },
  "deepseek-v3": { currency: "CNY", input: 2, output: 8 },
  "deepseek-r1-0528": { currency: "CNY", input: 4, output: 16 },
  "deepseek-r1": { currency: "CNY", input: 4, output: 16 },

  // MoonshotAI / Kimi
  "moonshotai--kimi-k2.6": { currency: "CNY", input: 6.5, output: 27 },
  "moonshotai--kimi-k2.5": { currency: "CNY", input: 4, output: 21 },
  "moonshotai--kimi-k2-thinking": { currency: "CNY", input: 4, output: 16 },
  "kimi-k2": { currency: "CNY", input: 4, output: 16 },

  // GLM
  "z-ai--glm-5.1": { currency: "CNY", input: 6, output: 24 },
  "z-ai--glm-5": { currency: "CNY", input: 4, output: 18 },
  "z-ai--glm-4.7": { currency: "CNY", input: 3.168, output: 12.528 },
  "z-ai--glm-4.6": { currency: "CNY", input: 7.2, output: 12.6 },
  "glm-4.5": { currency: "CNY", input: 4, output: 16 },

  // MiniMax
  "minimax--minimax-m2.7": { currency: "CNY", input: 2.1, output: 8.4 },
  "minimax--minimax-m2.5": { currency: "CNY", input: 2.1, output: 8.4 },
  "minimax--minimax-m2.1": { currency: "CNY", input: 2.1, output: 8.4 },
  "minimax--minimax-m2": { currency: "CNY", input: 2.1, output: 8.4 },
  "MiniMax-M1": { currency: "CNY", input: 4, output: 16 },

  // Xiaomi
  "xiaomi--mimo-v2-flash": { currency: "CNY", input: 0.7, output: 2.1 },

  // Doubao
  "doubao-seed-1.6-flash": { currency: "CNY", input: 0.15, output: 1.5 },
  "doubao-seed-1.6": { currency: "CNY", input: 0.8, output: 2 },
  "doubao-1.5-pro-32k": { currency: "CNY", input: 0.8, output: 2 },
  "doubao-1.5-thinking-pro": { currency: "CNY", input: 4, output: 16 },
  "doubao-1.5-vision-pro": { currency: "CNY", input: 3, output: 9 },
  "doubao-seed-1.6-thinking": { currency: "CNY", input: 0.8, output: 8 },

  // Qwen
  "qwen3-max": { currency: "CNY", input: 6, output: 24 },
  "qwen3-max-preview": { currency: "CNY", input: 6, output: 24 },
  "qwen3-coder-480b-a35b-instruct": { currency: "CNY", input: 6, output: 24 },
  "qwen3-235b-a22b": { currency: "CNY", input: 2, output: 8 },
  "qwen3-235b-a22b-instruct-2507": { currency: "CNY", input: 2, output: 8 },
  "qwen3-235b-a22b-thinking-2507": { currency: "CNY", input: 2, output: 20 },
  "qwen3-32b": { currency: "CNY", input: 2, output: 8 },
  "qwen3-30b-a3b": { currency: "CNY", input: 0.75, output: 3 },
  "qwen3-30b-a3b-instruct-2507": { currency: "CNY", input: 0.75, output: 3 },
  "qwen3-30b-a3b-thinking-2507": { currency: "CNY", input: 0.75, output: 7.5 },
  "qwen3-next-80b-a3b-instruct": { currency: "CNY", input: 1, output: 4 },
  "qwen3-next-80b-a3b-thinking": { currency: "CNY", input: 1, output: 10 },
  "qwen3-vl-30b-a3b-thinking": { currency: "CNY", input: 0.75, output: 7.5 },
  "qwen-max-2025-01-25": { currency: "CNY", input: 2.4, output: 9.6 },
  "qwen-turbo": { currency: "CNY", input: 0.3, output: 1 },
  "qwen-vl-max-2025-01-25": { currency: "CNY", input: 3, output: 9 },
  "qwen2.5-vl-72b-instruct": { currency: "CNY", input: 16, output: 48 },
  "qwen2.5-vl-7b-instruct": { currency: "CNY", input: 2, output: 5 },

  // Free models
  "nvidia--nemotron-3-super-120b-a12b": { unit: "free" },
  "meituan--longcat-flash-lite": { unit: "free" },
  "tencent--hy3-preview": { unit: "free" },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("deepseek-v4-pro")) return "deepseek-v4-pro";
  if (id.includes("deepseek-v4-flash")) return "deepseek-v4-flash";
  if (id.includes("deepseek-v3.2")) return "deepseek-v3.2";
  if (id.includes("deepseek-v3.1")) return "deepseek-v3.1";
  if (id.includes("deepseek-v3")) return "deepseek-v3";
  if (id.includes("deepseek-r1")) return "deepseek-r1";
  if (id.includes("kimi-k2.6")) return "kimi-k2.6";
  if (id.includes("kimi-k2.5")) return "kimi-k2.5";
  if (id.includes("kimi-k2-thinking")) return "kimi-k2-thinking";
  if (id.includes("kimi-k2")) return "kimi-k2";
  if (id.includes("glm-5.1")) return "glm-5.1";
  if (id.includes("glm-5")) return "glm-5";
  if (id.includes("glm-4.7")) return "glm-4.7";
  if (id.includes("glm-4.6")) return "glm-4.6";
  if (id.includes("glm-4.5")) return "glm-4.5";
  if (id.includes("minimax-m2.7")) return "minimax-m2.7";
  if (id.includes("minimax-m2.5")) return "minimax-m2.5";
  if (id.includes("minimax-m2.1")) return "minimax-m2.1";
  if (id.includes("minimax-m2")) return "minimax-m2";
  if (id.includes("minimax-m1") || id.includes("MiniMax-M1")) return "minimax-m1";
  if (id.includes("mimo-v2")) return "mimo-v2";
  if (id.includes("doubao-seed")) return "doubao-seed";
  if (id.includes("doubao-1.5")) return "doubao-1.5";
  if (id.includes("qwen3-coder")) return "qwen3-coder";
  if (id.includes("qwen3-max")) return "qwen3-max";
  if (id.includes("qwen3-235b")) return "qwen3-235b";
  if (id.includes("qwen3-32b")) return "qwen3-32b";
  if (id.includes("qwen3-30b")) return "qwen3-30b";
  if (id.includes("qwen3-next")) return "qwen3-next";
  if (id.includes("qwen3-vl")) return "qwen3-vl";
  if (id.includes("qwen2.5-vl")) return "qwen2.5-vl";
  if (id.includes("qwen-vl")) return "qwen-vl";
  if (id.includes("qwen-max")) return "qwen-max";
  if (id.includes("qwen-turbo")) return "qwen-turbo";
  if (id.includes("nemotron")) return "nemotron";
  if (id.includes("longcat")) return "longcat";
  if (id.includes("hy3")) return "hy3";
  return id.split("--")[0] as string;
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
      console.warn(`  Qiniu AI: skipping ${id} — no pricing`);
      continue;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id,
      name: info.name,
      family: deriveFamily(id),
      modalities: info.modalities ?? { input: ["text"], output: ["text"] },
      pricing,
      release_date: today,
      last_updated: today,
    };

    if (info.context !== undefined && info.output !== undefined) {
      modelDef.limit = { context: info.context, output: info.output };
    }

    if (info.openWeights) modelDef.open_weights = true;
    if (info.reasoning) modelDef.reasoning = true;
    if (info.toolCall) modelDef.tool_call = true;
    if (info.deprecated) modelDef.deprecated = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Qiniu AI: ${models.length} models`);

  return { provider, models };
}
