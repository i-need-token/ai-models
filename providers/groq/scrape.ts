import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "groq",
  name: "Groq",
  url: "https://groq.com",
  api_docs: "https://console.groq.com/docs",
  apis: {
    openai: "https://api.groq.com/openai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Pricing: https://groq.com/pricing (SSR page, browser-verified)
// - Model IDs: Groq changelog (https://groq.com/changelog)
// - Context lengths: Groq pricing page + OpenRouter cross-reference
//
// Groq is an inference platform hosting models from other providers.
// Pricing shown is Groq's own per-1M-token rate (USD).
// Prompt caching pricing (cache_read) is from the prompt caching table
// on the pricing page.
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context: number;
  output: number;
  inputModalities: ModelModality[];
  outputModalities: ModelModality[];
  toolCall?: boolean;
  openWeights?: boolean;
}

// ---------------------------------------------------------------------------
// LLM Models
// ---------------------------------------------------------------------------

const LLM_MODELS: Record<string, ModelInfo> = {
  // --- OpenAI GPT-OSS family ---
  "gpt-oss-20b": {
    name: "GPT OSS 20B 128k",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "gpt-oss-safeguard-20b": {
    name: "GPT OSS Safeguard 20B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "gpt-oss-120b": {
    name: "GPT OSS 120B 128k",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Meta Llama family ---
  "llama-4-scout-17b-16e-instruct": {
    name: "Llama 4 Scout 17Bx16E 128k",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-3.3-70b-versatile": {
    name: "Llama 3.3 70B Versatile 128k",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-3.1-8b-instant": {
    name: "Llama 3.1 8B Instant 128k",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Alibaba Qwen family ---
  "qwen3-32b": {
    name: "Qwen3 32B 131k",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Moonshot AI Kimi family ---
  "kimi-k2-instruct-0905": {
    name: "Kimi K2 Instruct 0905",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// TTS Models
// ---------------------------------------------------------------------------

const TTS_MODELS: Record<string, ModelInfo> = {
  "orpheus-en": {
    name: "Orpheus English",
    context: 0,
    output: 0,
    inputModalities: ["text"],
    outputModalities: ["audio"],
  },
  "orpheus-ar-sa": {
    name: "Orpheus Arabic Saudi",
    context: 0,
    output: 0,
    inputModalities: ["text"],
    outputModalities: ["audio"],
  },
};

// ---------------------------------------------------------------------------
// ASR Models
// ---------------------------------------------------------------------------

const ASR_MODELS: Record<string, ModelInfo> = {
  "whisper-large-v3": {
    name: "Whisper Large v3",
    context: 0,
    output: 0,
    inputModalities: ["audio"],
    outputModalities: ["text"],
  },
  "whisper-large-v3-turbo": {
    name: "Whisper Large v3 Turbo",
    context: 0,
    output: 0,
    inputModalities: ["audio"],
    outputModalities: ["text"],
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD)
//
// Source: https://groq.com/pricing (browser-verified 2026-05-15)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // LLM models — USD per million tokens
  "gpt-oss-20b": { currency: "USD", input: 0.075, output: 0.3, cache_read: 0.0375 },
  "gpt-oss-safeguard-20b": { currency: "USD", input: 0.075, output: 0.3 },
  "gpt-oss-120b": { currency: "USD", input: 0.15, output: 0.6, cache_read: 0.075 },
  "llama-4-scout-17b-16e-instruct": { currency: "USD", input: 0.11, output: 0.34 },
  "qwen3-32b": { currency: "USD", input: 0.29, output: 0.59 },
  "llama-3.3-70b-versatile": { currency: "USD", input: 0.59, output: 0.79 },
  "llama-3.1-8b-instant": { currency: "USD", input: 0.05, output: 0.08 },
  "kimi-k2-instruct-0905": { currency: "USD", input: 1.0, output: 3.0, cache_read: 0.5 },

  // TTS models — USD per M characters (approximated as per_request)
  "orpheus-en": { currency: "USD", unit: "per_request", price: 22 },
  "orpheus-ar-sa": { currency: "USD", unit: "per_request", price: 40 },

  // ASR models — USD per hour transcribed (approximated as per_request)
  "whisper-large-v3": { currency: "USD", unit: "per_request", price: 0.111 },
  "whisper-large-v3-turbo": { currency: "USD", unit: "per_request", price: 0.04 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("llama-4")) return "llama-4";
  if (id.includes("llama-3.3")) return "llama-3.3";
  if (id.includes("llama-3.1")) return "llama-3.1";
  if (id.includes("qwen")) return "qwen";
  if (id.includes("kimi")) return "kimi";
  if (id.includes("orpheus")) return "orpheus";
  if (id.includes("whisper")) return "whisper";
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

  // Process LLM models
  for (const [id, info] of Object.entries(LLM_MODELS)) {
    const pricing = HARDCODED_PRICING[id];
    if (!pricing) {
      console.warn(`  Groq: skipping ${id} — no pricing`);
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

    models.push(defineModel(modelDef));
  }

  // Process TTS models
  for (const [id, info] of Object.entries(TTS_MODELS)) {
    const pricing = HARDCODED_PRICING[id];
    if (!pricing) {
      console.warn(`  Groq: skipping ${id} — no pricing`);
      continue;
    }

    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id),
        modalities: { input: info.inputModalities, output: info.outputModalities },
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  // Process ASR models
  for (const [id, info] of Object.entries(ASR_MODELS)) {
    const pricing = HARDCODED_PRICING[id];
    if (!pricing) {
      console.warn(`  Groq: skipping ${id} — no pricing`);
      continue;
    }

    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id),
        modalities: { input: info.inputModalities, output: info.outputModalities },
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  console.log(`  Groq: ${models.length} models`);

  return { provider, models };
}
