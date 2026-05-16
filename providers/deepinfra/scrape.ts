import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "deepinfra",
  name: "DeepInfra",
  url: "https://deepinfra.com",
  api_docs: "https://docs.deepinfra.com",
  apis: {
    openai: "https://api.deepinfra.com/v1/openai",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Pricing: https://deepinfra.com/pricing (SSR page, browser-verified)
// - Model IDs: DeepInfra API & docs
// - Context lengths: DeepInfra pricing page
//
// DeepInfra is an inference platform hosting models from other providers
// (DeepSeek, Alibaba, Meta, Google, Anthropic, NVIDIA, Microsoft, Mistral)
// with its own per-token pricing.
//
// Pricing shown is DeepInfra's per-1M-token rate (USD).
// Some models have prompt caching pricing (cache_read).
// "cached" in the pricing page means cache_read price.
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
  "deepseek-v4-pro": {
    name: "DeepSeek V4 Pro",
    context: 65536,
    output: 65536,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },
  "deepseek-v4-flash": {
    name: "DeepSeek V4 Flash",
    context: 1048576,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },
  "deepseek-v3.2": {
    name: "DeepSeek V3.2",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-v3.1-terminus": {
    name: "DeepSeek V3.1 Terminus",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-v3.1": {
    name: "DeepSeek V3.1",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-v3-0324": {
    name: "DeepSeek V3 0324",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-v3": {
    name: "DeepSeek V3",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-r1-0528": {
    name: "DeepSeek R1 0528",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },
  "deepseek-r1-0528-turbo": {
    name: "DeepSeek R1 0528 Turbo",
    context: 32768,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "deepseek-r1-distill-llama-70b": {
    name: "DeepSeek R1 Distill Llama 70B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },

  // --- Alibaba Qwen family ---
  "qwen3-vl-30b-a3b-instruct": {
    name: "Qwen3 VL 30B A3B Instruct",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3-vl-235b-a22b-instruct": {
    name: "Qwen3 VL 235B A22B Instruct",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3-max-thinking": {
    name: "Qwen3 Max Thinking",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },
  "qwen3-max": {
    name: "Qwen3 Max",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3-next-80b-a3b-instruct": {
    name: "Qwen3 Next 80B A3B Instruct",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3-coder-480b-a35b-instruct-turbo": {
    name: "Qwen3 Coder 480B A35B Turbo",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3-235b-a22b-thinking-2507": {
    name: "Qwen3 235B A22B Thinking 2507",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "qwen3-235b-a22b-instruct-2507": {
    name: "Qwen3 235B A22B Instruct 2507",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwen3-32b": {
    name: "Qwen3 32B",
    context: 40960,
    output: 40960,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwen3-30b-a3b": {
    name: "Qwen3 30B A3B",
    context: 40960,
    output: 40960,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3-14b": {
    name: "Qwen3 14B",
    context: 40960,
    output: 40960,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen2.5-72b-instruct": {
    name: "Qwen 2.5 72B Instruct",
    context: 32768,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Meta Llama family ---
  "llama-4-scout-17b-16e": {
    name: "Llama 4 Scout 17Bx16E",
    context: 327680,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-4-maverick-17b-128e": {
    name: "Llama 4 Maverick 17Bx128E",
    context: 1048576,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-guard-4-12b": {
    name: "Llama Guard 4 12B",
    context: 163840,
    output: 163840,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "llama-3.3-70b-instruct-turbo": {
    name: "Llama 3.3 70B Turbo",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-3.2-11b-vision-instruct": {
    name: "Llama 3.2 11B Vision",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "meta-llama-3.1-70b-instruct": {
    name: "Llama 3.1 70B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama-3.1-70b-instruct-turbo": {
    name: "Llama 3.1 70B Turbo",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama-3.1-8b-instruct": {
    name: "Llama 3.1 8B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama-3.1-8b-instruct-turbo": {
    name: "Llama 3.1 8B Turbo",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Google family ---
  "gemini-3.1-flash-lite": {
    name: "Gemini 3.1 Flash Lite",
    context: 999424,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gemini-3.1-pro": {
    name: "Gemini 3.1 Pro",
    context: 999424,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },
  "gemini-2.5-pro": {
    name: "Gemini 2.5 Pro",
    context: 999424,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },
  "gemini-2.5-flash": {
    name: "Gemini 2.5 Flash",
    context: 999424,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },
  "gemma-4-31b-it-turbo": {
    name: "Gemma 4 31B IT Turbo",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-4-31b-it": {
    name: "Gemma 4 31B IT",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-4-26b-a4b-it": {
    name: "Gemma 4 26B A4B IT",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-3-27b-it": {
    name: "Gemma 3 27B IT",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-3-12b-it": {
    name: "Gemma 3 12B IT",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-3-4b-it": {
    name: "Gemma 3 4B IT",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- NVIDIA family ---
  "nemotron-3-nano-omni-30b-a3b-reasoning": {
    name: "Nemotron 3 Nano Omni 30B A3B Reasoning",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "nvidia-nemotron-3-super-120b-a12b": {
    name: "Nemotron 3 Super 120B A12B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nemotron-3-nano-30b-a3b": {
    name: "Nemotron 3 Nano 30B A3B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "llama-3.3-nemotron-super-49b-v1.5": {
    name: "Llama 3.3 Nemotron Super 49B v1.5",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nvidia-nemotron-nano-9b-v2": {
    name: "Nemotron Nano 9B v2",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Anthropic family ---
  "claude-haiku-4-5": {
    name: "Claude Haiku 4.5",
    context: 199885,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-sonnet-4-6": {
    name: "Claude Sonnet 4.6",
    context: 999424,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-opus-4-7": {
    name: "Claude Opus 4.7",
    context: 999424,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Microsoft family ---
  "phi-4": {
    name: "Phi-4",
    context: 16384,
    output: 4096,
    inputModalities: ["text"],
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
    toolCall: true,
    openWeights: true,
  },
  "mistral-small-24b-instruct-2501": {
    name: "Mistral Small 24B Instruct 2501",
    context: 32768,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "mistral-nemo-instruct-2407": {
    name: "Mistral Nemo Instruct 2407",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Voxtral family (audio) ---
  "voxtral-small-24b-2507": {
    name: "Voxtral Small 24B",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "audio"],
    outputModalities: ["text"],
  },
  "voxtral-mini-3b-2507": {
    name: "Voxtral Mini 3B",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "audio"],
    outputModalities: ["text"],
  },

  // --- Other ---
  "mythomax-l2-13b": {
    name: "MythoMax L2 13B",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: https://deepinfra.com/pricing (browser-verified 2026-05-15)
// "cached" price = cache_read
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // DeepSeek family
  "deepseek-v4-pro": { currency: "USD", input: 1.74, output: 3.48, cache_read: 0.145 },
  "deepseek-v4-flash": { currency: "USD", input: 0.14, output: 0.28, cache_read: 0.028 },
  "deepseek-v3.2": { currency: "USD", input: 0.26, output: 0.38, cache_read: 0.13 },
  "deepseek-v3.1-terminus": { currency: "USD", input: 0.27, output: 0.95, cache_read: 0.13 },
  "deepseek-v3.1": { currency: "USD", input: 0.21, output: 0.79, cache_read: 0.13 },
  "deepseek-v3-0324": { currency: "USD", input: 0.2, output: 0.77, cache_read: 0.135 },
  "deepseek-v3": { currency: "USD", input: 0.32, output: 0.89 },
  "deepseek-r1-0528": { currency: "USD", input: 0.5, output: 2.15, cache_read: 0.35 },
  "deepseek-r1-0528-turbo": { currency: "USD", input: 1.0, output: 3.0 },
  "deepseek-r1-distill-llama-70b": { currency: "USD", input: 0.7, output: 0.8 },

  // Qwen family
  "qwen3-vl-30b-a3b-instruct": { currency: "USD", input: 0.15, output: 0.6 },
  "qwen3-vl-235b-a22b-instruct": { currency: "USD", input: 0.2, output: 0.88, cache_read: 0.11 },
  "qwen3-max-thinking": { currency: "USD", input: 1.2, output: 6.0, cache_read: 0.24 },
  "qwen3-max": { currency: "USD", input: 1.2, output: 6.0, cache_read: 0.24 },
  "qwen3-next-80b-a3b-instruct": { currency: "USD", input: 0.09, output: 1.1 },
  "qwen3-coder-480b-a35b-instruct-turbo": {
    currency: "USD",
    input: 0.3,
    output: 1.0,
    cache_read: 0.1,
  },
  "qwen3-235b-a22b-thinking-2507": { currency: "USD", input: 0.23, output: 2.3, cache_read: 0.2 },
  "qwen3-235b-a22b-instruct-2507": { currency: "USD", input: 0.071, output: 0.1 },
  "qwen3-32b": { currency: "USD", input: 0.08, output: 0.28 },
  "qwen3-30b-a3b": { currency: "USD", input: 0.09, output: 0.45 },
  "qwen3-14b": { currency: "USD", input: 0.12, output: 0.24 },
  "qwen2.5-72b-instruct": { currency: "USD", input: 0.36, output: 0.4 },

  // Llama family
  "llama-4-scout-17b-16e": { currency: "USD", input: 0.08, output: 0.3 },
  "llama-4-maverick-17b-128e": { currency: "USD", input: 0.15, output: 0.6 },
  "llama-guard-4-12b": { currency: "USD", input: 0.18, output: 0.18 },
  "llama-3.3-70b-instruct-turbo": { currency: "USD", input: 0.1, output: 0.32 },
  "llama-3.2-11b-vision-instruct": { currency: "USD", input: 0.245, output: 0.245 },
  "meta-llama-3.1-70b-instruct": { currency: "USD", input: 0.4, output: 0.4 },
  "meta-llama-3.1-70b-instruct-turbo": { currency: "USD", input: 0.4, output: 0.4 },
  "meta-llama-3.1-8b-instruct": { currency: "USD", input: 0.02, output: 0.05 },
  "meta-llama-3.1-8b-instruct-turbo": { currency: "USD", input: 0.02, output: 0.03 },

  // Google family
  "gemini-3.1-flash-lite": { currency: "USD", input: 0.25, output: 1.5 },
  "gemini-3.1-pro": { currency: "USD", input: 2.0, output: 12.0 },
  "gemini-2.5-pro": { currency: "USD", input: 1.25, output: 10.0 },
  "gemini-2.5-flash": { currency: "USD", input: 0.3, output: 2.5 },
  "gemma-4-31b-it-turbo": { currency: "USD", input: 0.12, output: 0.37 },
  "gemma-4-31b-it": { currency: "USD", input: 0.13, output: 0.38 },
  "gemma-4-26b-a4b-it": { currency: "USD", input: 0.07, output: 0.34 },
  "gemma-3-27b-it": { currency: "USD", input: 0.08, output: 0.16 },
  "gemma-3-12b-it": { currency: "USD", input: 0.04, output: 0.13 },
  "gemma-3-4b-it": { currency: "USD", input: 0.04, output: 0.08 },

  // NVIDIA family
  "nemotron-3-nano-omni-30b-a3b-reasoning": { currency: "USD", input: 0.2, output: 0.8 },
  "nvidia-nemotron-3-super-120b-a12b": { currency: "USD", input: 0.1, output: 0.5 },
  "nemotron-3-nano-30b-a3b": { currency: "USD", input: 0.05, output: 0.2 },
  "llama-3.3-nemotron-super-49b-v1.5": { currency: "USD", input: 0.1, output: 0.4 },
  "nvidia-nemotron-nano-9b-v2": { currency: "USD", input: 0.04, output: 0.16 },

  // Anthropic family
  "claude-haiku-4-5": { currency: "USD", input: 1.0, output: 5.0 },
  "claude-sonnet-4-6": { currency: "USD", input: 3.0, output: 15.0 },
  "claude-opus-4-7": { currency: "USD", input: 5.0, output: 25.0 },

  // Microsoft family
  "phi-4": { currency: "USD", input: 0.07, output: 0.14 },

  // Mistral family
  "mistral-small-3.2-24b-instruct-2506": { currency: "USD", input: 0.075, output: 0.2 },
  "mistral-small-24b-instruct-2501": { currency: "USD", input: 0.05, output: 0.08 },
  "mistral-nemo-instruct-2407": { currency: "USD", input: 0.02, output: 0.04 },

  // Voxtral family (audio input, per-second pricing approximated as per_request)
  "voxtral-small-24b-2507": { unit: "free" },
  "voxtral-mini-3b-2507": { unit: "free" },

  // Other
  "mythomax-l2-13b": { currency: "USD", input: 0.4, output: 0.4 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("deepseek")) return "deepseek";
  if (id.includes("qwen3-coder")) return "qwen-coder";
  if (id.includes("qwen3-vl")) return "qwen-vl";
  if (id.includes("qwen3-max")) return "qwen3-max";
  if (id.includes("qwen3-next")) return "qwen3-next";
  if (id.includes("qwen3-235b")) return "qwen3";
  if (id.includes("qwen3")) return "qwen3";
  if (id.includes("qwen2.5")) return "qwen2.5";
  if (id.includes("llama-4")) return "llama-4";
  if (id.includes("llama-guard")) return "llama-guard";
  if (id.includes("llama-3.3") || id.includes("llama-3.3")) return "llama-3.3";
  if (id.includes("llama-3.2")) return "llama-3.2";
  if (id.includes("llama-3.1") || id.includes("meta-llama-3.1")) return "llama-3.1";
  if (id.includes("gemini")) return "gemini";
  if (id.includes("gemma-4")) return "gemma-4";
  if (id.includes("gemma-3")) return "gemma-3";
  if (id.includes("nemotron") || id.includes("Nemotron")) return "nemotron";
  if (id.includes("claude")) return "claude";
  if (id.includes("phi")) return "phi";
  if (id.includes("mistral")) return "mistral";
  if (id.includes("voxtral")) return "voxtral";
  if (id.includes("mythomax")) return "mythomax";
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
    const pricing = HARDCODED_PRICING[id];
    if (!pricing) {
      console.warn(`  DeepInfra: skipping ${id} — no pricing`);
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
    if (info.reasoning) modelDef.reasoning = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  DeepInfra: ${models.length} models`);

  return { provider, models };
}
