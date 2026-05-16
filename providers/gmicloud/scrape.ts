import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "gmicloud",
  name: "GMI Cloud",
  url: "https://gmicloud.ai",
  api_docs: "https://docs.gmicloud.ai",
  apis: {
    openai: "https://api.gmi-serving.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: https://docs.gmicloud.ai/inference-engine/billing/price.md
//   (LLM Serverless Pricing table, 30 models with per-token USD pricing)
// - Model IDs: https://docs.gmicloud.ai/llm-models.md (88 LLM models)
// - Context lengths: Cross-referenced with other providers in this catalog
//
// GMI Cloud is an inference platform hosting models from other providers
// (DeepSeek, ZAI/ZhipuAI, Qwen, Meta, Anthropic, Google, OpenAI, NVIDIA,
// MoonshotAI, MiniMax, Xiaomi) with its own per-token USD pricing.
//
// Pricing shown is GMI Cloud's per-1M-token rate (USD).
// One model (DeepSeek R1 Distill Qwen 1.5B) has $0.00 pricing (free) and
// is excluded from this catalog.
//
// Note: The docs pricing page lists 30 models, but only 29 are included here
// (1 free model excluded). The docs model list has 88 LLM models total,
// but only 30 have pricing data in the docs.
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context: number;
  output: number;
  inputModalities: ModelModality[];
  outputModalities: ModelModality[];
  openWeights?: boolean;
  reasoning?: boolean;
  toolCall?: boolean;
}

// ---------------------------------------------------------------------------
// Model definitions
// ---------------------------------------------------------------------------

const MODELS: Record<string, ModelInfo> = {
  // --- ZAI / ZhipuAI ---
  "zai-org--GLM-4.6": {
    name: "GLM-4.6",
    context: 200000,
    output: 200000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "zai-org--GLM-4.5-FP8": {
    name: "GLM-4.5 FP8",
    context: 128000,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "zai-org--GLM-4.5-Air-FP8": {
    name: "GLM-4.5 Air FP8",
    context: 128000,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- DeepSeek ---
  "deepseek-ai--DeepSeek-V3.2-Exp": {
    name: "DeepSeek V3.2 Exp",
    context: 163840,
    output: 163840,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "deepseek-ai--DeepSeek-V3.1-Terminus": {
    name: "DeepSeek V3.1 Terminus",
    context: 163840,
    output: 163840,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "deepseek-ai--DeepSeek-V3.1": {
    name: "DeepSeek V3.1",
    context: 163840,
    output: 163840,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "deepseek-ai--DeepSeek-V3-0324": {
    name: "DeepSeek V3 0324",
    context: 163840,
    output: 163840,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "deepseek-ai--DeepSeek-R1-0528": {
    name: "DeepSeek R1 0528",
    context: 163840,
    output: 163840,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "deepseek-ai--DeepSeek-Prover-V2-671B": {
    name: "DeepSeek Prover V2 671B",
    context: 163840,
    output: 163840,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "deepseek-ai--DeepSeek-R1": {
    name: "DeepSeek R1",
    context: 163840,
    output: 163840,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "deepseek-ai--DeepSeek-R1-Distill-Llama-70B": {
    name: "DeepSeek R1 Distill Llama 70B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "deepseek-ai--DeepSeek-R1-Distill-Llama-8B": {
    name: "DeepSeek R1 Distill Llama 8B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "deepseek-ai--DeepSeek-R1-Distill-Qwen-14B": {
    name: "DeepSeek R1 Distill Qwen 14B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "deepseek-ai--DeepSeek-R1-Distill-Qwen-32B": {
    name: "DeepSeek R1 Distill Qwen 32B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "deepseek-ai--DeepSeek-R1-Distill-Qwen-7B": {
    name: "DeepSeek R1 Distill Qwen 7B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },

  // --- Qwen ---
  "Qwen--Qwen3-Next-80B-A3B-Thinking": {
    name: "Qwen3 Next 80B A3B Thinking",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "Qwen--Qwen3-Next-80B-A3B-Instruct": {
    name: "Qwen3 Next 80B A3B Instruct",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "Qwen--Qwen3-Coder-480B-A35B-Instruct-FP8": {
    name: "Qwen3 Coder 480B A35B Instruct FP8",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "Qwen--Qwen3-235B-A22B-Instruct-2507-FP8": {
    name: "Qwen3 235B A22B Instruct 2507 FP8",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "Qwen--Qwen3-32B-FP8": {
    name: "Qwen3 32B FP8",
    context: 40960,
    output: 40960,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "Qwen--Qwen3-235B-A22B-FP8": {
    name: "Qwen3 235B A22B FP8",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "Qwen--Qwen3-235B-A22B-Thinking-2507-FP8": {
    name: "Qwen3 235B A22B Thinking 2507 FP8",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "Qwen--Qwen3-30B-A3B": {
    name: "Qwen3 30B A3B",
    context: 40960,
    output: 40960,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- MoonshotAI ---
  "moonshotai--Kimi-K2-Instruct-0905": {
    name: "Kimi K2 Instruct 0905",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "moonshotai--Kimi-K2-Instruct": {
    name: "Kimi K2 Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- OpenAI ---
  "openai--gpt-oss-120b": {
    name: "GPT OSS 120B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Meta ---
  "meta-llama--Llama-3.3-70B-Instruct": {
    name: "Llama 3.3 70B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama--Llama-4-Maverick-17B-128E-Instruct-FP8": {
    name: "Llama 4 Maverick 17B 128E Instruct FP8",
    context: 1048576,
    output: 1048576,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama--Llama-4-Scout-17B-16E-Instruct": {
    name: "Llama 4 Scout 17B 16E Instruct",
    context: 327680,
    output: 327680,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: https://docs.gmicloud.ai/inference-engine/billing/price.md
// (LLM Serverless Pricing table, accessed 2026-05-16)
//
// Note: DeepSeek R1 Distill Qwen 1.5B has $0.00/$0.00 pricing (free) and
// is excluded from this catalog.
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // ZAI / ZhipuAI
  "zai-org--GLM-4.6": { currency: "USD", input: 0.6, output: 2.0 },
  "zai-org--GLM-4.5-FP8": { currency: "USD", input: 0.6, output: 2.2 },
  "zai-org--GLM-4.5-Air-FP8": { currency: "USD", input: 0.2, output: 1.1 },

  // DeepSeek
  "deepseek-ai--DeepSeek-V3.2-Exp": { currency: "USD", input: 0.27, output: 0.41 },
  "deepseek-ai--DeepSeek-V3.1-Terminus": { currency: "USD", input: 0.27, output: 1.0 },
  "deepseek-ai--DeepSeek-V3.1": { currency: "USD", input: 0.27, output: 1.0 },
  "deepseek-ai--DeepSeek-V3-0324": { currency: "USD", input: 0.28, output: 0.88 },
  "deepseek-ai--DeepSeek-R1-0528": { currency: "USD", input: 0.7, output: 2.3 },
  "deepseek-ai--DeepSeek-Prover-V2-671B": { currency: "USD", input: 0.5, output: 2.18 },
  "deepseek-ai--DeepSeek-R1": { currency: "USD", input: 0.5, output: 2.18 },
  "deepseek-ai--DeepSeek-R1-Distill-Llama-70B": { currency: "USD", input: 0.25, output: 0.75 },
  "deepseek-ai--DeepSeek-R1-Distill-Llama-8B": { currency: "USD", input: 0.14, output: 0.39 },
  "deepseek-ai--DeepSeek-R1-Distill-Qwen-14B": { currency: "USD", input: 0.2, output: 0.2 },
  "deepseek-ai--DeepSeek-R1-Distill-Qwen-32B": { currency: "USD", input: 0.5, output: 0.9 },
  "deepseek-ai--DeepSeek-R1-Distill-Qwen-7B": { currency: "USD", input: 0.1, output: 0.2 },

  // Qwen
  "Qwen--Qwen3-Next-80B-A3B-Thinking": { currency: "USD", input: 0.15, output: 1.5 },
  "Qwen--Qwen3-Next-80B-A3B-Instruct": { currency: "USD", input: 0.15, output: 1.5 },
  "Qwen--Qwen3-Coder-480B-A35B-Instruct-FP8": { currency: "USD", input: 0.29, output: 1.2 },
  "Qwen--Qwen3-235B-A22B-Instruct-2507-FP8": { currency: "USD", input: 0.17, output: 1.09 },
  "Qwen--Qwen3-32B-FP8": { currency: "USD", input: 0.1, output: 0.6 },
  "Qwen--Qwen3-235B-A22B-FP8": { currency: "USD", input: 0.17, output: 1.09 },
  "Qwen--Qwen3-235B-A22B-Thinking-2507-FP8": { currency: "USD", input: 0.6, output: 3.0 },
  "Qwen--Qwen3-30B-A3B": { currency: "USD", input: 0.08, output: 0.25 },

  // MoonshotAI
  "moonshotai--Kimi-K2-Instruct-0905": { currency: "USD", input: 0.6, output: 2.5 },
  "moonshotai--Kimi-K2-Instruct": { currency: "USD", input: 1.0, output: 3.0 },

  // OpenAI
  "openai--gpt-oss-120b": { currency: "USD", input: 0.07, output: 0.28 },

  // Meta
  "meta-llama--Llama-3.3-70B-Instruct": { currency: "USD", input: 0.25, output: 0.75 },
  "meta-llama--Llama-4-Maverick-17B-128E-Instruct-FP8": {
    currency: "USD",
    input: 0.25,
    output: 0.8,
  },
  "meta-llama--Llama-4-Scout-17B-16E-Instruct": { currency: "USD", input: 0.08, output: 0.5 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("glm")) return "glm";
  if (id.includes("deepseek")) return "deepseek";
  if (id.includes("qwen")) return "qwen";
  if (id.includes("kimi")) return "kimi";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("llama")) return "llama";
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
      console.warn(`  GMI Cloud: skipping ${id} — no pricing`);
      continue;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id,
      name: info.name,
      family: deriveFamily(id),
      limit: { context: info.context, output: info.output },
      modalities: { input: info.inputModalities, output: info.outputModalities },
      pricing,
      release_date: today,
      last_updated: today,
    };

    if (info.openWeights) modelDef.open_weights = true;
    if (info.reasoning) modelDef.reasoning = true;
    if (info.toolCall) modelDef.tool_call = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  GMI Cloud: ${models.length} models`);

  return { provider, models };
}
