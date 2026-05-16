import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "inferencenet",
  name: "Inference.net",
  url: "https://inference.net",
  api_docs: "https://inference.net/docs",
  apis: {
    openai: "https://inference.net/api/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: JS bundle (getModelPricePerMillionTokensUSD + main JS chunk)
//   from inference.net — uses env vars with hardcoded default fallbacks
// - Model IDs: Inference.net models page + JS bundle pricing map (FKe)
// - Context lengths: SSR HTML from models page
//
// Inference.net is a model producer (Schematron, BDC-Coder, ClipTagger)
// and inference platform hosting third-party models.
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

// ---------------------------------------------------------------------------
// Inference.net's own models
// ---------------------------------------------------------------------------

const OWN_MODELS: Record<string, ModelInfo> = {
  "schematron-3b": {
    name: "Schematron 3B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "schematron-8b": {
    name: "Schematron 8B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "schematron-v2-small": {
    name: "Schematron V2 Small",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "schematron-v2-turbo": {
    name: "Schematron V2 Turbo",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "schematron-v3": {
    name: "Schematron V3",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "bdc-coder": {
    name: "BDC Coder",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "cliptagger-12b": {
    name: "ClipTagger 12B",
    context: 8192,
    output: 8192,
    inputModalities: ["image", "video"],
    outputModalities: ["text"],
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Third-party models (one quantization per model family)
// ---------------------------------------------------------------------------

const THIRD_PARTY_MODELS: Record<string, ModelInfo> = {
  "deepseek-v3--fp-8": {
    name: "DeepSeek V3 on Inference.net",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "deepseek-r1-0528--fp-8": {
    name: "DeepSeek R1 0528 on Inference.net",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "llama-3.1-8b-instruct--fp-16": {
    name: "Llama 3.1 8B Instruct on Inference.net",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-3.3-70b-instruct--fp-8": {
    name: "Llama 3.3 70B Instruct on Inference.net",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "gpt-oss-120b": {
    name: "GPT OSS 120B on Inference.net",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
    reasoning: true,
  },
  "gpt-oss-20b": {
    name: "GPT OSS 20B on Inference.net",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwen3-30b-a3b--fp8": {
    name: "Qwen3 30B A3B on Inference.net",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwq-32b--fp-8": {
    name: "QwQ 32B on Inference.net",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "gemma-3-27b-instruct--bf-16": {
    name: "Gemma 3 27B on Inference.net",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nemotron3-super": {
    name: "Nemotron 3 Super on Inference.net",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "mistral-nemo-12b-instruct--fp-8": {
    name: "Mistral Nemo 12B on Inference.net",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "hermes-3-llama-3.1-405b--fp-8": {
    name: "Hermes 3 Llama 3.1 405B on Inference.net",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwen2.5-72b-instruct--fp-8": {
    name: "Qwen 2.5 72B on Inference.net",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: JS bundle from inference.net (getModelPricePerMillionTokensUSD
// function + FKe pricing map with default fallbacks, extracted 2026-05-16)
//
// Conversion: hogans_per_token * 1e-6 = USD_per_M_tokens
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // Own models
  "schematron-3b": { currency: "USD", input: 0.02, output: 0.05 },
  "schematron-8b": { currency: "USD", input: 0.04, output: 0.1 },
  "schematron-v2-small": { currency: "USD", input: 0.05, output: 0.25 },
  "schematron-v2-turbo": { currency: "USD", input: 0.03, output: 0.15 },
  "schematron-v3": { currency: "USD", input: 0.02, output: 0.05 },
  "bdc-coder": { currency: "USD", input: 0.01, output: 0.01 },
  "cliptagger-12b": { currency: "USD", input: 0.3, output: 0.5 },

  // Third-party models
  "deepseek-v3--fp-8": { currency: "USD", input: 0.4, output: 1.2 },
  "deepseek-r1-0528--fp-8": { currency: "USD", input: 0.5, output: 2.15 },
  "llama-3.1-8b-instruct--fp-16": { currency: "USD", input: 0.02, output: 0.03 },
  "llama-3.3-70b-instruct--fp-8": { currency: "USD", input: 0.1, output: 0.25 },
  "gpt-oss-120b": { currency: "USD", input: 0.05, output: 0.45 },
  "gpt-oss-20b": { currency: "USD", input: 0.03, output: 0.15 },
  "qwen3-30b-a3b--fp8": { currency: "USD", input: 0.08, output: 0.29 },
  "qwq-32b--fp-8": { currency: "USD", input: 0.2, output: 0.2 },
  "gemma-3-27b-instruct--bf-16": { currency: "USD", input: 0.15, output: 0.3 },
  "nemotron3-super": { currency: "USD", input: 2.5, output: 5.0 },
  "mistral-nemo-12b-instruct--fp-8": { currency: "USD", input: 0.0375, output: 0.1 },
  "hermes-3-llama-3.1-405b--fp-8": { currency: "USD", input: 0.8, output: 0.8 },
  "qwen2.5-72b-instruct--fp-8": { currency: "USD", input: 0.35, output: 0.35 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("schematron")) return "schematron";
  if (id.includes("bdc-coder")) return "bdc-coder";
  if (id.includes("cliptagger")) return "cliptagger";
  if (id.includes("deepseek-v3")) return "deepseek-v3";
  if (id.includes("deepseek-r1")) return "deepseek-r1";
  if (id.includes("llama-3.1")) return "llama-3.1";
  if (id.includes("llama-3.3")) return "llama-3.3";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("qwen3")) return "qwen3";
  if (id.includes("qwq")) return "qwq";
  if (id.includes("gemma")) return "gemma";
  if (id.includes("nemotron")) return "nemotron";
  if (id.includes("mistral")) return "mistral";
  if (id.includes("hermes")) return "hermes";
  if (id.includes("qwen2.5")) return "qwen2.5";
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

  // Process own models
  for (const [id, info] of Object.entries(OWN_MODELS)) {
    const pricing = HARDCODED_PRICING[id];
    if (!pricing) {
      console.warn(`  Inference.net: skipping ${id} — no pricing`);
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

  // Process third-party models
  for (const [id, info] of Object.entries(THIRD_PARTY_MODELS)) {
    const pricing = HARDCODED_PRICING[id];
    if (!pricing) {
      console.warn(`  Inference.net: skipping ${id} — no pricing`);
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

  console.log(`  Inference.net: ${models.length} models`);

  return { provider, models };
}
