import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "submodel",
  name: "SubModel",
  url: "https://submodel.ai",
  api_docs: "https://submodel.ai/#/document",
  apis: {
    openai: "https://api.submodel.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Model list & pricing: https://submodel.ai homepage (MaaS section)
// - Context lengths: SubModel homepage
//
// SubModel is a GPU cloud + inference platform hosting models from other
// providers (Qwen, ZhipuAI, OpenAI, DeepSeek) with per-token USD pricing.
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context: number;
  output: number;
  inputModalities: ModelModality[];
  outputModalities: ModelModality[];
  openWeights?: boolean;
  reasoning?: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  // --- qwen family ---
  "qwen--Qwen3-Coder-480B-A35B-Instruct": {
    name: "Qwen3 Coder 480B A35B Instruct",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen--Qwen3-235B-A22B-Instruct-2507": {
    name: "Qwen3 235B A22B Instruct 2507",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- zai (zhipuai) family ---
  "zai--GLM-4.5": {
    name: "GLM 4.5",
    context: 131072,
    output: 65536,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- openai family ---
  "openai--gpt-oss-120b": {
    name: "GPT OSS 120B",
    context: 131072,
    output: 65536,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- deepseek family ---
  "deepseek--DeepSeek-R1": {
    name: "DeepSeek R1",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "deepseek--DeepSeek-V3.1": {
    name: "DeepSeek V3.1",
    context: 163840,
    output: 65536,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
};

// Pricing per 1M tokens (USD)
const PRICING: Record<string, Pricing> = {
  "qwen--Qwen3-Coder-480B-A35B-Instruct": {
    currency: "USD",
    input: 0.2,
    output: 0.8,
  },
  "qwen--Qwen3-235B-A22B-Instruct-2507": {
    currency: "USD",
    input: 0.2,
    output: 0.3,
  },
  "zai--GLM-4.5": {
    currency: "USD",
    input: 0.2,
    output: 0.8,
  },
  "openai--gpt-oss-120b": {
    currency: "USD",
    input: 0.1,
    output: 0.5,
  },
  "deepseek--DeepSeek-R1": {
    currency: "USD",
    input: 0.2,
    output: 0.8,
  },
  "deepseek--DeepSeek-V3.1": {
    currency: "USD",
    input: 0.2,
    output: 0.8,
  },
};

function deriveFamily(id: string): string {
  if (id.startsWith("qwen--")) return "qwen";
  if (id.startsWith("zai--")) return "glm";
  if (id.startsWith("openai--")) return "gpt-oss";
  if (id.startsWith("deepseek--")) return "deepseek";
  return "other";
}

export async function scrape(): Promise<ScrapeResult> {
  const models: ReturnType<typeof defineModel>[] = [];
  const today = new Date().toISOString().split("T")[0] as string;

  for (const [id, info] of Object.entries(MODELS)) {
    const pricing = PRICING[id];
    if (!pricing) {
      console.warn(`Skipping ${id}: no pricing`);
      continue;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: id as string,
      name: info.name as string,
      family: deriveFamily(id as string),
      limit: { context: info.context, output: info.output },
      modalities: { input: info.inputModalities, output: info.outputModalities },
      pricing,
      release_date: today,
      last_updated: today,
    };

    if (info.openWeights) modelDef.open_weights = true;
    if (info.reasoning) modelDef.reasoning = true;

    models.push(defineModel(modelDef));
  }

  return { provider, models };
}
