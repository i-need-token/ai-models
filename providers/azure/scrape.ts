import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "azure",
  name: "Azure OpenAI Service",
  url: "https://azure.microsoft.com/en-us/products/azure-openai-service/",
  api_docs: "https://learn.microsoft.com/en-us/azure/ai-services/openai/",
  apis: {
    openai: "https://models.inference.ai.azure.com",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: Azure OpenAI pricing page (https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/)
//   Global standard deployment, per-1M-token USD pricing
// - Context lengths: OpenAI documentation + Azure OpenAI documentation
// - Model IDs: Azure OpenAI documentation
//
// Azure OpenAI Service is an inference platform hosting OpenAI models.
// Pricing shown is for Global standard deployment, per-1M-token USD.
// Data Zone and Regional deployments have different pricing (not included).
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context: number;
  output: number;
  inputModalities: ModelModality[];
  outputModalities: ModelModality[];
  toolCall?: boolean;
  openWeights?: boolean;
  deprecated?: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  // --- GPT-5.4 series ---
  "gpt-5-4": {
    name: "GPT-5.4",
    context: 272000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-4-mini": {
    name: "GPT-5.4 mini",
    context: 272000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-4-nano": {
    name: "GPT-5.4 nano",
    context: 272000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- GPT-5.3 series ---
  "gpt-5-3-codex": {
    name: "GPT-5.3 Codex",
    context: 200000,
    output: 100000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-3-chat": {
    name: "GPT-5.3 Chat",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- GPT-5.2 series ---
  "gpt-5-2": {
    name: "GPT-5.2",
    context: 200000,
    output: 100000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-2-codex": {
    name: "GPT-5.2 Codex",
    context: 200000,
    output: 100000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- GPT-5.1 series ---
  "gpt-5-1": {
    name: "GPT-5.1",
    context: 200000,
    output: 100000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-1-codex": {
    name: "GPT-5.1 Codex",
    context: 200000,
    output: 100000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-1-codex-max": {
    name: "GPT-5.1 Codex Max",
    context: 200000,
    output: 100000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-1-codex-mini": {
    name: "GPT-5.1 Codex Mini",
    context: 200000,
    output: 100000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- GPT-5 series ---
  "gpt-5": {
    name: "GPT-5",
    context: 200000,
    output: 100000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-mini": {
    name: "GPT-5 mini",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-nano": {
    name: "GPT-5 nano",
    context: 200000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- o-series reasoning models ---
  o3: {
    name: "o3",
    context: 200000,
    output: 100000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "o3-mini": {
    name: "o3-mini",
    context: 200000,
    output: 100000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "o4-mini": {
    name: "o4-mini",
    context: 200000,
    output: 100000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "o3-deep-research": {
    name: "o3 Deep Research",
    context: 200000,
    output: 100000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- GPT-4.1 series ---
  "gpt-4-1": {
    name: "GPT-4.1",
    context: 1048576,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-4-1-mini": {
    name: "GPT-4.1 mini",
    context: 1048576,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-4-1-nano": {
    name: "GPT-4.1 nano",
    context: 1048576,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- GPT-4o series ---
  "gpt-4o": {
    name: "GPT-4o",
    context: 128000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-4o-mini": {
    name: "GPT-4o mini",
    context: 128000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- GPT-OSS ---
  "gpt-oss-120b": {
    name: "GPT OSS 120B",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Computer Use ---
  "computer-use-preview": {
    name: "Computer Use Preview",
    context: 128000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: Azure OpenAI pricing page
// Global standard deployment, per-1M-token USD pricing
// ---------------------------------------------------------------------------

const PRICING: Record<string, Pricing> = {
  // GPT-5.4 series
  "gpt-5-4": { currency: "USD", input: 2.5, output: 15, cache_read: 0.25 },
  "gpt-5-4-mini": { currency: "USD", input: 0.75, output: 4.5, cache_read: 0.08 },
  "gpt-5-4-nano": { currency: "USD", input: 0.2, output: 1.25, cache_read: 0.02 },

  // GPT-5.3 series
  "gpt-5-3-codex": { currency: "USD", input: 1.75, output: 14, cache_read: 0.18 },
  "gpt-5-3-chat": { currency: "USD", input: 1.75, output: 14, cache_read: 0.18 },

  // GPT-5.2 series
  "gpt-5-2": { currency: "USD", input: 1.75, output: 14, cache_read: 0.18 },
  "gpt-5-2-codex": { currency: "USD", input: 1.75, output: 14, cache_read: 0.18 },

  // GPT-5.1 series
  "gpt-5-1": { currency: "USD", input: 1.25, output: 10, cache_read: 0.13 },
  "gpt-5-1-codex": { currency: "USD", input: 1.25, output: 10, cache_read: 0.13 },
  "gpt-5-1-codex-max": { currency: "USD", input: 1.25, output: 10, cache_read: 0.13 },
  "gpt-5-1-codex-mini": { currency: "USD", input: 0.25, output: 2, cache_read: 0.03 },

  // GPT-5 series
  "gpt-5": { currency: "USD", input: 1.25, output: 10, cache_read: 0.13 },
  "gpt-5-mini": { currency: "USD", input: 0.25, output: 2, cache_read: 0.03 },
  "gpt-5-nano": { currency: "USD", input: 0.05, output: 0.4, cache_read: 0.01 },

  // o-series reasoning models
  o3: { currency: "USD", input: 2, output: 8, cache_read: 0.5 },
  "o3-mini": { currency: "USD", input: 1.1, output: 4.4, cache_read: 0.55 },
  "o4-mini": { currency: "USD", input: 1.1, output: 4.4, cache_read: 0.28 },
  "o3-deep-research": { currency: "USD", input: 10, output: 40, cache_read: 2.5 },

  // GPT-4.1 series
  "gpt-4-1": { currency: "USD", input: 2, output: 8, cache_read: 0.5 },
  "gpt-4-1-mini": { currency: "USD", input: 0.4, output: 1.6, cache_read: 0.1 },
  "gpt-4-1-nano": { currency: "USD", input: 0.1, output: 0.4, cache_read: 0.03 },

  // GPT-4o series
  "gpt-4o": { currency: "USD", input: 2.5, output: 10, cache_read: 1.25 },
  "gpt-4o-mini": { currency: "USD", input: 0.15, output: 0.6, cache_read: 0.075 },

  // GPT-OSS
  "gpt-oss-120b": { currency: "USD", input: 0.15, output: 0.6 },

  // Computer Use
  "computer-use-preview": { currency: "USD", input: 3, output: 12 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.startsWith("gpt-5-4")) return "gpt-5-4";
  if (id.startsWith("gpt-5-3")) return "gpt-5-3";
  if (id.startsWith("gpt-5-2")) return "gpt-5-2";
  if (id.startsWith("gpt-5-1")) return "gpt-5-1";
  if (id.startsWith("gpt-5")) return "gpt-5";
  if (id.startsWith("o3-deep")) return "o3-deep-research";
  if (id.startsWith("o3")) return "o3";
  if (id.startsWith("o4")) return "o4";
  if (id.startsWith("gpt-4-1")) return "gpt-4-1";
  if (id.startsWith("gpt-4o")) return "gpt-4o";
  if (id.startsWith("gpt-oss")) return "gpt-oss";
  if (id.startsWith("computer")) return "computer-use";
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
    const pricing = PRICING[id];
    if (!pricing) {
      console.warn(`  Azure OpenAI: skipping ${id} — no pricing`);
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
    if (info.deprecated) modelDef.deprecated = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Azure OpenAI: ${models.length} models`);

  return { provider, models };
}
