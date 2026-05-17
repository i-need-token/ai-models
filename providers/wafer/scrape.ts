import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "wafer",
  name: "Wafer",
  url: "https://wafer.ai",
  api_docs: "https://docs.wafer.ai",
  apis: {
    openai: "https://pass.wafer.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Model list & context: https://docs.wafer.ai/wafer-pass.md
// - Pricing: https://wafer.ai homepage (serverless per-token rates)
//   + https://docs.wafer.ai/wafer-pass.md (overage pricing = per-token rates)
//
// Wafer is an inference optimization platform hosting open-source models
// with per-token USD pricing. Cache-read tokens billed at 10% of input.
//
// Wafer Pass subscription includes free requests within plan limits;
// overage is billed at per-token rates shown below.
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

const MODELS: Record<string, ModelInfo> = {
  "Qwen3.5-397B-A17B": {
    name: "Qwen 3.5 397B A17B",
    context: 262144,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "GLM-5.1": {
    name: "GLM 5.1",
    context: 202752,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },
};

// Pricing per 1M tokens (USD) — serverless/overage rates
// Cache-read tokens billed at 10% of input price
const PRICING: Record<string, Pricing> = {
  "Qwen3.5-397B-A17B": {
    currency: "USD",
    input: 0.6,
    output: 3.6,
    cache_read: 0.06,
  },
  "GLM-5.1": {
    currency: "USD",
    input: 1.5,
    output: 4.5,
    cache_read: 0.15,
  },
};

function deriveFamily(id: string): string {
  if (id.startsWith("Qwen")) return "qwen3.5";
  if (id.startsWith("GLM")) return "glm";
  return "other";
}

export async function scrape(): Promise<ScrapeResult> {
  const models: ReturnType<typeof defineModel>[] = [];
  const today = new Date().toISOString().split("T")[0] as string;

  for (const [id, info] of Object.entries(MODELS)) {
    const pricing = PRICING[id];
    if (!pricing) {
      console.warn(`  Wafer: skipping ${id} — no pricing`);
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
    if (info.toolCall) modelDef.tool_call = true;

    models.push(defineModel(modelDef));
  }

  return { provider, models };
}
