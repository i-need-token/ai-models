import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "databricks",
  name: "Databricks",
  url: "https://www.databricks.com",
  api_docs:
    "https://docs.databricks.com/en/machine-learning/model-serving/score-foundation-models.html",
  apis: {
    openai: "https://databricks-demo.cloud.databricks.com/serving-endpoints",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-17)
//
// Source: https://www.databricks.com/product/pricing/foundation-model-serving
//         https://www.databricks.com/product/pricing/proprietary-foundation-model-serving
//
// Databricks Foundation Model APIs offer Pay-Per-Token pricing for both
// open-source and proprietary models. Pricing is in DBU (Databricks Units)
// per million tokens, converted to USD using the Premium tier DBU rate
// of $0.07/DBU on AWS.
//
// The pricing pages list:
// - Foundation Model Serving: 7 open-source LLM models + 3 embedding models
// - Proprietary Foundation Model Serving: 12 OpenAI, 5 Anthropic, 5 Google models
//
// Only LLM models with pay-per-token pricing are included below.
// Embedding models, models without pay-per-token pricing (Llama 3.2 1B/3B),
// and models with only Provisioned Throughput pricing are excluded.
//
// DBU-to-USD conversion: DBU_rate × $0.07 = USD per 1M tokens
// Global endpoint pricing used (not In-geo, which is ~10% higher).
// For models with Short/Long context tiers, Short context pricing is used
// (Long context is 2× input/output for most models).
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
  // --- Foundation Model Serving (Open Models) ---
  "databricks-llama-4-maverick": {
    name: "Llama 4 Maverick",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "databricks-meta-llama-3-3-70b-instruct": {
    name: "Llama 3.3 70B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "databricks-qwen3-next-80b-a3b-instruct": {
    name: "Qwen 3 Next 80B A3B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "databricks-gpt-oss-120b": {
    name: "GPT OSS 120B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "databricks-gemma-3-12b": {
    name: "Gemma 3 12B",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "databricks-meta-llama-3-1-8b-instruct": {
    name: "Llama 3.1 8B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "databricks-gpt-oss-20b": {
    name: "GPT OSS 20B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Proprietary Foundation Model Serving (OpenAI) ---
  "databricks-gpt-5-5": {
    name: "GPT 5.5",
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "databricks-gpt-5-4": {
    name: "GPT 5.4",
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "databricks-gpt-5-4-mini": {
    name: "GPT 5.4 mini",
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "databricks-gpt-5-4-nano": {
    name: "GPT 5.4 nano",
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "databricks-gpt-5-2-codex": {
    name: "GPT 5.2/5.3 Codex",
    context: 200000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "databricks-gpt-5-2": {
    name: "GPT 5.2",
    context: 200000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "databricks-gpt-5-1": {
    name: "GPT 5.1",
    context: 200000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "databricks-gpt-5-1-codex-max": {
    name: "GPT 5.1 Codex Max",
    context: 200000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "databricks-gpt-5": {
    name: "GPT 5",
    context: 200000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "databricks-gpt-5-mini": {
    name: "GPT 5 mini",
    context: 200000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "databricks-gpt-5-1-codex-mini": {
    name: "GPT 5.1 Codex Mini",
    context: 200000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "databricks-gpt-5-nano": {
    name: "GPT 5 nano",
    context: 200000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // --- Proprietary Foundation Model Serving (Anthropic) ---
  "databricks-claude-opus-4-5": {
    name: "Claude Opus 4.5/4.6/4.7",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "databricks-claude-opus-4-1": {
    name: "Claude Opus 4/4.1",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "databricks-claude-sonnet-4-5": {
    name: "Claude Sonnet 4.5/4.6",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "databricks-claude-sonnet-4": {
    name: "Claude Sonnet 4/4.1",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "databricks-claude-haiku-4-5": {
    name: "Claude Haiku 4.5",
    context: 200000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // --- Proprietary Foundation Model Serving (Google) ---
  "databricks-gemini-3-1-flash-lite": {
    name: "Gemini 3.1 Flash Lite",
    context: 128000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "databricks-gemini-3-1-pro": {
    name: "Gemini 3.1 Pro",
    context: 128000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "databricks-gemini-3-flash": {
    name: "Gemini 3 Flash",
    context: 128000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "databricks-gemini-2-5-pro": {
    name: "Gemini 2.5 Pro",
    context: 128000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "databricks-gemini-2-5-flash": {
    name: "Gemini 2.5 Flash",
    context: 128000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: https://www.databricks.com/product/pricing/foundation-model-serving
//         https://www.databricks.com/product/pricing/proprietary-foundation-model-serving
//
// DBU rates converted to USD using Premium tier rate: $0.07/DBU on AWS.
// Global endpoint pricing used (not In-geo, which is ~10% higher).
// For models with Short/Long context tiers, Short context pricing is used.
// ---------------------------------------------------------------------------

const DBU_PRICE = 0.07; // $0.07/DBU for Premium tier on AWS

function dbuToUsd(dbu: number): number {
  // Round to nearest cent, then to 6 decimal places for our format
  const raw = dbu * DBU_PRICE;
  const rounded = Math.round(raw * 100) / 100;
  return Math.round(rounded * 1e6) / 1e6;
}

const HARDCODED_PRICING: Record<string, Pricing> = {
  // Foundation Model Serving (Open Models)
  "databricks-llama-4-maverick": {
    currency: "USD",
    input: dbuToUsd(7.143),
    output: dbuToUsd(21.429),
  },
  "databricks-meta-llama-3-3-70b-instruct": {
    currency: "USD",
    input: dbuToUsd(7.143),
    output: dbuToUsd(21.429),
  },
  "databricks-qwen3-next-80b-a3b-instruct": {
    currency: "USD",
    input: dbuToUsd(2.143),
    output: dbuToUsd(17.143),
  },
  "databricks-gpt-oss-120b": { currency: "USD", input: dbuToUsd(2.143), output: dbuToUsd(8.571) },
  "databricks-gemma-3-12b": { currency: "USD", input: dbuToUsd(2.143), output: dbuToUsd(7.143) },
  "databricks-meta-llama-3-1-8b-instruct": {
    currency: "USD",
    input: dbuToUsd(2.143),
    output: dbuToUsd(6.429),
  },
  "databricks-gpt-oss-20b": { currency: "USD", input: dbuToUsd(1.0), output: dbuToUsd(4.286) },

  // Proprietary Foundation Model Serving (OpenAI)
  "databricks-gpt-5-5": {
    currency: "USD",
    input: dbuToUsd(71.429),
    output: dbuToUsd(428.571),
    cache_write: dbuToUsd(71.429),
    cache_read: dbuToUsd(7.143),
  },
  "databricks-gpt-5-4": {
    currency: "USD",
    input: dbuToUsd(35.714),
    output: dbuToUsd(214.286),
    cache_write: dbuToUsd(35.714),
    cache_read: dbuToUsd(3.571),
  },
  "databricks-gpt-5-4-mini": {
    currency: "USD",
    input: dbuToUsd(10.714),
    output: dbuToUsd(64.286),
    cache_write: dbuToUsd(10.714),
    cache_read: dbuToUsd(1.071),
  },
  "databricks-gpt-5-4-nano": {
    currency: "USD",
    input: dbuToUsd(2.857),
    output: dbuToUsd(17.857),
    cache_write: dbuToUsd(2.857),
    cache_read: dbuToUsd(0.286),
  },
  "databricks-gpt-5-2-codex": {
    currency: "USD",
    input: dbuToUsd(25.0),
    output: dbuToUsd(200.0),
    cache_write: dbuToUsd(25.0),
    cache_read: dbuToUsd(2.5),
  },
  "databricks-gpt-5-2": {
    currency: "USD",
    input: dbuToUsd(25.0),
    output: dbuToUsd(200.0),
    cache_write: dbuToUsd(25.0),
    cache_read: dbuToUsd(2.5),
  },
  "databricks-gpt-5-1": {
    currency: "USD",
    input: dbuToUsd(17.857),
    output: dbuToUsd(142.857),
    cache_write: dbuToUsd(17.857),
    cache_read: dbuToUsd(1.786),
  },
  "databricks-gpt-5-1-codex-max": {
    currency: "USD",
    input: dbuToUsd(17.857),
    output: dbuToUsd(142.857),
    cache_write: dbuToUsd(17.857),
    cache_read: dbuToUsd(1.786),
  },
  "databricks-gpt-5": {
    currency: "USD",
    input: dbuToUsd(17.857),
    output: dbuToUsd(142.857),
    cache_write: dbuToUsd(17.857),
    cache_read: dbuToUsd(1.786),
  },
  "databricks-gpt-5-mini": {
    currency: "USD",
    input: dbuToUsd(3.571),
    output: dbuToUsd(28.571),
    cache_write: dbuToUsd(3.571),
    cache_read: dbuToUsd(0.357),
  },
  "databricks-gpt-5-1-codex-mini": {
    currency: "USD",
    input: dbuToUsd(3.571),
    output: dbuToUsd(28.571),
    cache_write: dbuToUsd(3.571),
    cache_read: dbuToUsd(0.357),
  },
  "databricks-gpt-5-nano": {
    currency: "USD",
    input: dbuToUsd(0.714),
    output: dbuToUsd(5.714),
    cache_write: dbuToUsd(0.714),
    cache_read: dbuToUsd(0.071),
  },

  // Proprietary Foundation Model Serving (Anthropic)
  "databricks-claude-opus-4-5": {
    currency: "USD",
    input: dbuToUsd(71.429),
    output: dbuToUsd(357.143),
    cache_write: dbuToUsd(89.286),
    cache_read: dbuToUsd(7.143),
  },
  "databricks-claude-opus-4-1": {
    currency: "USD",
    input: dbuToUsd(214.286),
    output: dbuToUsd(1071.429),
    cache_write: dbuToUsd(267.857),
    cache_read: dbuToUsd(21.429),
  },
  "databricks-claude-sonnet-4-5": {
    currency: "USD",
    input: dbuToUsd(42.857),
    output: dbuToUsd(214.286),
    cache_write: dbuToUsd(53.571),
    cache_read: dbuToUsd(4.286),
  },
  "databricks-claude-sonnet-4": {
    currency: "USD",
    input: dbuToUsd(42.857),
    output: dbuToUsd(214.286),
    cache_write: dbuToUsd(53.571),
    cache_read: dbuToUsd(4.286),
  },
  "databricks-claude-haiku-4-5": {
    currency: "USD",
    input: dbuToUsd(14.286),
    output: dbuToUsd(71.429),
    cache_write: dbuToUsd(17.857),
    cache_read: dbuToUsd(1.429),
  },

  // Proprietary Foundation Model Serving (Google)
  "databricks-gemini-3-1-flash-lite": {
    currency: "USD",
    input: dbuToUsd(3.571),
    output: dbuToUsd(21.429),
    cache_write: dbuToUsd(3.571),
    cache_read: dbuToUsd(0.357),
  },
  "databricks-gemini-3-1-pro": {
    currency: "USD",
    input: dbuToUsd(35.714),
    output: dbuToUsd(214.286),
    cache_write: dbuToUsd(35.714),
    cache_read: dbuToUsd(3.571),
  },
  "databricks-gemini-3-flash": {
    currency: "USD",
    input: dbuToUsd(8.929),
    output: dbuToUsd(53.571),
    cache_write: dbuToUsd(8.929),
    cache_read: dbuToUsd(0.893),
  },
  "databricks-gemini-2-5-pro": {
    currency: "USD",
    input: dbuToUsd(17.857),
    output: dbuToUsd(142.857),
  },
  "databricks-gemini-2-5-flash": {
    currency: "USD",
    input: dbuToUsd(4.286),
    output: dbuToUsd(35.714),
  },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("llama-4")) return "llama-4";
  if (id.includes("llama-3-3")) return "llama-3.3";
  if (id.includes("llama-3-1")) return "llama-3.1";
  if (id.includes("qwen3-next")) return "qwen3-next";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("gemma")) return "gemma";
  if (id.includes("gpt-5-5")) return "gpt-5.5";
  if (id.includes("gpt-5-4")) return "gpt-5.4";
  if (id.includes("gpt-5-2")) return "gpt-5.2";
  if (id.includes("gpt-5-1")) return "gpt-5.1";
  if (id.includes("gpt-5")) return "gpt-5";
  if (id.includes("claude-opus")) return "claude-opus";
  if (id.includes("claude-sonnet")) return "claude-sonnet";
  if (id.includes("claude-haiku")) return "claude-haiku";
  if (id.includes("gemini-3-1")) return "gemini-3.1";
  if (id.includes("gemini-3")) return "gemini-3";
  if (id.includes("gemini-2-5")) return "gemini-2.5";
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
      console.warn(`  databricks: skipping ${id} — no pricing`);
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

  console.log(`  databricks: ${models.length} models`);

  return { provider, models };
}
