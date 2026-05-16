import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "privatemode",
  name: "Privatemode AI",
  url: "https://privatemode.ai",
  api_docs: "https://privatemode.ai/docs",
  apis: {
    openai: "https://api.privatemode.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: https://privatemode.ai/pricing (SSR HTML, first-party data)
// - Model IDs: Privatemode pricing page + models page
// - Context lengths: Privatemode pricing page
//
// Privatemode AI is a confidential computing inference platform hosting
// models from MoonshotAI, OpenAI, Google, and Alibaba with per-token
// EUR pricing. All models have cache_read pricing.
//
// Pricing shown is EUR per million tokens.
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
  "kimi-k2-5": {
    name: "Kimi K2.5 on Privatemode",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "gpt-oss-120b": {
    name: "GPT OSS 120B on Privatemode",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    openWeights: true,
  },
  "gemma-3-27b": {
    name: "Gemma 3 27B on Privatemode",
    context: 96000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-4-31b": {
    name: "Gemma 4 31B on Privatemode",
    context: 96000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3-coder-30b-a3b": {
    name: "Qwen3 Coder 30B A3B on Privatemode",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (EUR per million tokens)
//
// Source: SSR HTML from privatemode.ai/pricing (first-party data, 2026-05-16)
// All models include cache_read pricing.
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  "kimi-k2-5": { currency: "EUR", input: 1.55, output: 7.74, cache_read: 0.15 },
  "gpt-oss-120b": { currency: "EUR", input: 0.43, output: 1.7, cache_read: 0.04 },
  "gemma-3-27b": { currency: "EUR", input: 0.77, output: 1.27, cache_read: 0.08 },
  "gemma-4-31b": { currency: "EUR", input: 0.77, output: 1.27, cache_read: 0.08 },
  "qwen3-coder-30b-a3b": { currency: "EUR", input: 0.43, output: 1.7, cache_read: 0.04 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("kimi")) return "kimi";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("gemma-4")) return "gemma-4";
  if (id.includes("gemma")) return "gemma";
  if (id.includes("qwen3-coder")) return "qwen-coder";
  return id;
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
      console.warn(`  Privatemode: skipping ${id} — no pricing`);
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

    if (info.toolCall) modelDef.tool_call = true;
    if (info.openWeights) modelDef.open_weights = true;
    if (info.reasoning) modelDef.reasoning = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Privatemode: ${models.length} models`);

  return { provider, models };
}
