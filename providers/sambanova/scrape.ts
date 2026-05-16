import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "sambanova",
  name: "SambaNova",
  url: "https://sambanova.ai",
  api_docs: "https://docs.sambanova.ai",
  apis: {
    openai: "https://api.sambanova.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model list & pricing: https://api.sambanova.ai/v1/models (OpenAI-compatible API)
// - Context lengths & max output: same API response
// - Pricing is per-token in the API; converted to per-million-token (USD)
//
// SambaNova is an inference platform hosting models from other providers
// (DeepSeek, Meta, MiniMax, Google, OpenAI) with its own per-token pricing.
//
// Notes:
// - DeepSeek-V3.2 has a 32K context limit (not 128K like other models)
// - DeepSeek-V3.1 and V3.2 have limited max_completion_tokens (7168)
// - Llama-4-Maverick has limited max_completion_tokens (4096)
// - Meta-Llama-3.3-70B has limited max_completion_tokens (3072)
// - MiniMax-M2.5 has 163840 context, MiniMax-M2.7 has 196608 context
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
  // --- DeepSeek family ---
  "DeepSeek-V3.1": {
    name: "DeepSeek V3.1",
    context: 131072,
    output: 7168,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "DeepSeek-V3.2": {
    name: "DeepSeek V3.2",
    context: 32768,
    output: 7168,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Meta Llama family ---
  "Llama-4-Maverick-17B-128E-Instruct": {
    name: "Llama 4 Maverick 17Bx128E",
    context: 131072,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "Meta-Llama-3.3-70B-Instruct": {
    name: "Llama 3.3 70B",
    context: 131072,
    output: 3072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- MiniMax family ---
  "MiniMax-M2.5": {
    name: "MiniMax M2.5",
    context: 163840,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "MiniMax-M2.7": {
    name: "MiniMax M2.7",
    context: 196608,
    output: 196608,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Google Gemma family ---
  "gemma-3-12b-it": {
    name: "Gemma 3 12B IT",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: false,
    openWeights: true,
  },

  // --- OpenAI GPT-OSS family ---
  "gpt-oss-120b": {
    name: "GPT OSS 120B",
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
// Source: https://api.sambanova.ai/v1/models — pricing field (per-token, converted to per-M-token)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  "DeepSeek-V3.1": { currency: "USD", input: 3.0, output: 4.5 },
  "DeepSeek-V3.2": { currency: "USD", input: 3.0, output: 4.5 },
  "Llama-4-Maverick-17B-128E-Instruct": { currency: "USD", input: 0.63, output: 1.8 },
  "Meta-Llama-3.3-70B-Instruct": { currency: "USD", input: 0.6, output: 1.2 },
  "MiniMax-M2.5": { currency: "USD", input: 0.3, output: 1.2 },
  "MiniMax-M2.7": { currency: "USD", input: 0.6, output: 2.4 },
  "gemma-3-12b-it": { currency: "USD", input: 0.35, output: 0.59 },
  "gpt-oss-120b": { currency: "USD", input: 0.22, output: 0.59 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("DeepSeek")) return "deepseek";
  if (id.includes("Llama-4")) return "llama-4";
  if (id.includes("Llama-3.3") || id.includes("Meta-Llama")) return "llama-3.3";
  if (id.includes("MiniMax")) return "minimax";
  if (id.includes("gemma")) return "gemma";
  if (id.includes("gpt-oss")) return "gpt-oss";
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
    const pricing = HARDCODED_PRICING[id] ?? { unit: "free" };

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
    if (info.reasoning) modelDef.reasoning = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  SambaNova: ${models.length} models`);

  return { provider, models };
}
