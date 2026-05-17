import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "scaleway",
  name: "Scaleway",
  url: "https://www.scaleway.com",
  api_docs: "https://www.scaleway.com/en/developers/api/generative-apis",
  apis: {
    openai: "https://api.scaleway.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-17)
//
// Source: https://www.scaleway.com/en/generative-apis/ (SSR HTML)
// Scaleway Generative APIs is a European cloud AI inference platform with EUR
// per-token pricing. All prices are in EUR (€) per 1M tokens.
//
// The Generative APIs pricing page lists 16 models total:
// - 12 Chat/Vision models with EUR per-token pricing (included below)
// - 2 Embedding models (not included — not text generation)
// - 1 Audio transcription model (not included — per-minute pricing, not per-token)
// - 1 Audio+Chat model (included — has per-token pricing)
//
// Pricing is in EUR (€) per 1M tokens.
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
  // --- Qwen family ---
  "qwen3.5-397b-a17b": {
    name: "Qwen3.5 397B A17B",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen3-235b-a22b-instruct-2507": {
    name: "Qwen3 235B A22B Instruct 2507",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen3-coder-30b-a3b-instruct": {
    name: "Qwen3 Coder 30B A3B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },

  // --- OpenAI ---
  "gpt-oss-120b": {
    name: "GPT OSS 120B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Google ---
  "gemma-3-27b-it": {
    name: "Gemma 3 27B IT",
    context: 8192,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Mistral family ---
  "mistral-small-3.2-24b-instruct-2506": {
    name: "Mistral Small 3.2 24B Instruct 2506",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "mistral-nemo-instruct-2407": {
    name: "Mistral Nemo Instruct 2407",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "pixtral-12b-2409": {
    name: "Pixtral 12B 2409",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Voxtral (Mistral) ---
  "voxtral-small-24b-2507": {
    name: "Voxtral Small 24B 2507",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "audio"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Holo (Mistral) ---
  "holo2-30b-a3b": {
    name: "Holo2 30B A3B",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Meta ---
  "llama-3.3-70b-instruct": {
    name: "Llama 3.3 70B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "llama-3.1-8b-instruct": {
    name: "Llama 3.1 8B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },

  // --- DeepSeek ---
  "deepseek-r1-distill-llama-70b": {
    name: "DeepSeek R1 Distill Llama 70B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (EUR per million tokens)
//
// Source: https://www.scaleway.com/en/generative-apis/ (SSR HTML, accessed 2026-05-17)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  "qwen3.5-397b-a17b": { currency: "EUR", input: 0.6, output: 3.6 },
  "qwen3-235b-a22b-instruct-2507": { currency: "EUR", input: 0.75, output: 2.25 },
  "qwen3-coder-30b-a3b-instruct": { currency: "EUR", input: 0.2, output: 0.8 },
  "gpt-oss-120b": { currency: "EUR", input: 0.15, output: 0.6 },
  "gemma-3-27b-it": { currency: "EUR", input: 0.25, output: 0.5 },
  "mistral-small-3.2-24b-instruct-2506": { currency: "EUR", input: 0.15, output: 0.35 },
  "mistral-nemo-instruct-2407": { currency: "EUR", input: 0.2, output: 0.2 },
  "pixtral-12b-2409": { currency: "EUR", input: 0.2, output: 0.2 },
  "voxtral-small-24b-2507": { currency: "EUR", input: 0.15, output: 0.35 },
  "holo2-30b-a3b": { currency: "EUR", input: 0.3, output: 0.7 },
  "llama-3.3-70b-instruct": { currency: "EUR", input: 0.9, output: 0.9 },
  "llama-3.1-8b-instruct": { currency: "EUR", input: 0.2, output: 0.2 },
  "deepseek-r1-distill-llama-70b": { currency: "EUR", input: 0.9, output: 0.9 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("qwen3.5")) return "qwen3.5";
  if (id.includes("qwen3-coder")) return "qwen-coder";
  if (id.includes("qwen3")) return "qwen3";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("gemma")) return "gemma";
  if (id.includes("mistral-small")) return "mistral-small";
  if (id.includes("mistral-nemo")) return "mistral-nemo";
  if (id.includes("pixtral")) return "pixtral";
  if (id.includes("voxtral")) return "voxtral";
  if (id.includes("holo")) return "holo";
  if (id.includes("llama")) return "llama";
  if (id.includes("deepseek")) return "deepseek";
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
      console.warn(`  scaleway: skipping ${id} — no pricing`);
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

  console.log(`  scaleway: ${models.length} models`);

  return { provider, models };
}
