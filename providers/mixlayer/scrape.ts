import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "mixlayer",
  name: "Mixlayer",
  url: "https://mixlayer.com",
  api_docs: "https://docs.mixlayer.com",
  apis: {
    openai: "https://models.mixlayer.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Model list: https://docs.mixlayer.com/models (6 models, 5 with pricing)
// - Pricing: https://mixlayer.com homepage (per-token USD pricing)
// - Context lengths: Mixlayer docs (131K for all models)
// - Capabilities: Mixlayer docs (Tools, Reasoning for all models)
//
// Mixlayer is an inference platform for open-source AI models.
// All models are from the Qwen 3.5 family with 131K context windows.
// qwen/qwen3.5-4b-free is free (rate-limited, not for production).
// qwen/qwen3.5-122b-a10b is skipped (no pricing data on homepage or docs).
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
  free?: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  "qwen--qwen3.5-4b-free": {
    name: "Qwen 3.5 4B Free",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
    free: true,
  },
  "qwen--qwen3.5-9b": {
    name: "Qwen 3.5 9B",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "qwen--qwen3.5-27b": {
    name: "Qwen 3.5 27B",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "qwen--qwen3.5-35b-a3b": {
    name: "Qwen 3.5 35B A3B",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "qwen--qwen3.5-397b-a17b": {
    name: "Qwen 3.5 397B A17B",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
};

// Pricing per 1M tokens (USD)
const PRICING: Record<string, Pricing> = {
  "qwen--qwen3.5-4b-free": { unit: "free" },
  "qwen--qwen3.5-9b": { currency: "USD", input: 0.1, output: 0.4 },
  "qwen--qwen3.5-27b": { currency: "USD", input: 0.3, output: 2.4 },
  "qwen--qwen3.5-35b-a3b": { currency: "USD", input: 0.25, output: 1.3 },
  "qwen--qwen3.5-397b-a17b": { currency: "USD", input: 0.6, output: 3.6 },
};

function deriveFamily(id: string): string {
  if (id.startsWith("qwen--")) return "qwen3.5";
  return "other";
}

export async function scrape(): Promise<ScrapeResult> {
  const models: ReturnType<typeof defineModel>[] = [];
  const today = new Date().toISOString().split("T")[0] as string;

  for (const [id, info] of Object.entries(MODELS)) {
    const pricing = PRICING[id];
    if (!pricing) {
      console.warn(`  Mixlayer: skipping ${id} — no pricing`);
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
