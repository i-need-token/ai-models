import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "evroc",
  name: "evroc",
  url: "https://evroc.com",
  api_docs: "https://evroc.com/ai-services/think-api",
  apis: {
    openai: "https://api.think.evroc.com",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Source: https://evroc.com/ai-services/think-models (SSR HTML)
// evroc Think is a European cloud AI inference platform with EUR per-token pricing.
//
// The Think Models page lists 15 models total:
// - 8 Chat/Vision models with EUR per-token pricing (included below)
// - 3 Embedding models (not included — not text generation)
// - 4 Transcription models (not included — per-minute pricing, not per-token)
// - 1 model with "Contact us" pricing (not included — no public pricing)
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
  // --- Microsoft ---
  "microsoft--Phi-4-multimodal-instruct": {
    name: "Phi-4 Multimodal Instruct",
    context: 16384,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Mistral AI ---
  "mistralai--Devstral-Small-2-24B-Instruct": {
    name: "Devstral Small 2 24B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "mistralai--Magistral-Small": {
    name: "Magistral Small",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },

  // --- Moonshot AI ---
  "moonshotai--Kimi-K2.5": {
    name: "Kimi K2.5",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Meta (hosted by Nvidia) ---
  "meta-llama--Llama-3.3-70B-Instruct": {
    name: "Llama 3.3 70B Instruct",
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

  // --- Qwen ---
  "Qwen--Qwen3-30B-A3B-Instruct": {
    name: "Qwen3 30B A3B Instruct",
    context: 40960,
    output: 40960,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "Qwen--Qwen3-VL-30B-A3B-Instruct": {
    name: "Qwen3 VL 30B A3B Instruct",
    context: 40960,
    output: 40960,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (EUR per million tokens)
//
// Source: https://evroc.com/ai-services/think-models (SSR HTML, accessed 2026-05-16)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  "microsoft--Phi-4-multimodal-instruct": { currency: "EUR", input: 0.1, output: 0.4 },
  "mistralai--Devstral-Small-2-24B-Instruct": { currency: "EUR", input: 0.1, output: 0.4 },
  "mistralai--Magistral-Small": { currency: "EUR", input: 0.5, output: 2.0 },
  "moonshotai--Kimi-K2.5": { currency: "EUR", input: 1.25, output: 5.0 },
  "meta-llama--Llama-3.3-70B-Instruct": { currency: "EUR", input: 1.0, output: 1.0 },
  "openai--gpt-oss-120b": { currency: "EUR", input: 0.2, output: 0.8 },
  "Qwen--Qwen3-30B-A3B-Instruct": { currency: "EUR", input: 0.1, output: 0.8 },
  "Qwen--Qwen3-VL-30B-A3B-Instruct": { currency: "EUR", input: 0.2, output: 0.8 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("phi")) return "phi";
  if (id.includes("devstral")) return "devstral";
  if (id.includes("magistral")) return "magistral";
  if (id.includes("kimi")) return "kimi";
  if (id.includes("llama")) return "llama";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("qwen3-vl")) return "qwen-vl";
  if (id.includes("qwen")) return "qwen";
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
      console.warn(`  evroc: skipping ${id} — no pricing`);
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

  console.log(`  evroc: ${models.length} models`);

  return { provider, models };
}
