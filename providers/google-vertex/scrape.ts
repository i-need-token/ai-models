import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "google-vertex",
  name: "Google Vertex AI",
  url: "https://cloud.google.com/vertex-ai",
  api_docs: "https://cloud.google.com/vertex-ai/docs",
  apis: {
    openai: "https://vertex-ai.googleapis.com/v1/openai",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: Google Vertex AI pricing page
//   (https://cloud.google.com/vertex-ai/generative-ai/pricing)
//   Global standard deployment, per-1M-token USD pricing
// - Context lengths: Original provider documentation
// - Model IDs: Google Vertex AI documentation
//
// Google Vertex AI is an inference platform hosting models from multiple
// providers (Google, Anthropic, xAI, DeepSeek, MiniMax, Moonshot, Qwen,
// GLM, OpenAI, Meta, Mistral).
// Pricing shown is for Global standard deployment, per-1M-token USD.
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
  // --- Google Gemini 3 series ---
  "gemini-3-pro": {
    name: "Gemini 3 Pro Preview",
    context: 200000,
    output: 65536,
    inputModalities: ["text", "image", "video", "audio"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gemini-3-flash": {
    name: "Gemini 3 Flash Preview",
    context: 200000,
    output: 65536,
    inputModalities: ["text", "image", "video"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gemini-3-1-flash-lite": {
    name: "Gemini 3.1 Flash Lite",
    context: 200000,
    output: 65536,
    inputModalities: ["text", "image", "video"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Google Gemini 2.5 series ---
  "gemini-2-5-pro": {
    name: "Gemini 2.5 Pro",
    context: 1048576,
    output: 65536,
    inputModalities: ["text", "image", "video", "audio"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gemini-2-5-flash": {
    name: "Gemini 2.5 Flash",
    context: 1048576,
    output: 65536,
    inputModalities: ["text", "image", "video"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gemini-2-5-flash-lite": {
    name: "Gemini 2.5 Flash Lite",
    context: 1048576,
    output: 65536,
    inputModalities: ["text", "image", "video"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Google Gemini 2.0 series ---
  "gemini-2-0-flash": {
    name: "Gemini 2.0 Flash",
    context: 1048576,
    output: 8192,
    inputModalities: ["text", "image", "audio"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gemini-2-0-flash-lite": {
    name: "Gemini 2.0 Flash Lite",
    context: 1048576,
    output: 8192,
    inputModalities: ["text", "image", "audio"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Google Gemma ---
  "gemma-4-26b": {
    name: "Gemma 4 26B",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Anthropic Claude series ---
  "claude-opus-4-7": {
    name: "Claude Opus 4.7",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-opus-4-6": {
    name: "Claude Opus 4.6",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-opus-4-5": {
    name: "Claude Opus 4.5",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-opus-4-1": {
    name: "Claude Opus 4.1",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-opus-4": {
    name: "Claude Opus 4",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-sonnet-4-6": {
    name: "Claude Sonnet 4.6",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-sonnet-4-5": {
    name: "Claude Sonnet 4.5",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-sonnet-4": {
    name: "Claude Sonnet 4",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-haiku-4-5": {
    name: "Claude Haiku 4.5",
    context: 200000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- xAI Grok series ---
  "grok-4-20": {
    name: "Grok 4.20",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "grok-4-1-fast": {
    name: "Grok 4.1 Fast",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- DeepSeek series ---
  "deepseek-v3-2": {
    name: "DeepSeek V3.2",
    context: 65536,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "deepseek-v3-1": {
    name: "DeepSeek V3.1",
    context: 65536,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "deepseek-r1": {
    name: "DeepSeek R1",
    context: 65536,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- MiniMax ---
  "minimax-m2": {
    name: "MiniMax M2",
    context: 1048576,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Moonshot AI ---
  "kimi-k2-thinking": {
    name: "Kimi K2 Thinking",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Qwen series ---
  "qwen3-next-80b-thinking": {
    name: "Qwen3 Next 80B A3B Thinking",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3-coder-480b-a35b": {
    name: "Qwen3 Coder 480B A35B Instruct",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3-235b-a22b": {
    name: "Qwen3 235B A22B Instruct",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- GLM series ---
  "glm-4-7": {
    name: "GLM 4.7",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "glm-5": {
    name: "GLM 5",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- OpenAI GPT-OSS ---
  "gpt-oss-120b": {
    name: "GPT OSS 120B",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "gpt-oss-20b": {
    name: "GPT OSS 20B",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Meta Llama series ---
  "llama-3-3-70b": {
    name: "Llama 3.3 70B Instruct",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-4-scout": {
    name: "Llama 4 Scout 17Bx16E Instruct",
    context: 1048576,
    output: 4096,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-4-maverick": {
    name: "Llama 4 Maverick 17Bx128E Instruct",
    context: 1048576,
    output: 4096,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Mistral series ---
  "mistral-medium-3": {
    name: "Mistral Medium 3",
    context: 128000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "mistral-small-3-1": {
    name: "Mistral Small 3.1",
    context: 128000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "codestral-2": {
    name: "Codestral 2",
    context: 256000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: Google Vertex AI pricing page
// Global standard deployment, per-1M-token USD pricing
// ---------------------------------------------------------------------------

const PRICING: Record<string, Pricing> = {
  // Google Gemini 3 series
  "gemini-3-pro": { currency: "USD", input: 2, output: 12, cache_read: 0.2 },
  "gemini-3-flash": { currency: "USD", input: 0.5, output: 3, cache_read: 0.05 },
  "gemini-3-1-flash-lite": { currency: "USD", input: 0.25, output: 1.5, cache_read: 0.025 },

  // Google Gemini 2.5 series
  "gemini-2-5-pro": { currency: "USD", input: 1.25, output: 10, cache_read: 0.13 },
  "gemini-2-5-flash": { currency: "USD", input: 0.3, output: 2.5, cache_read: 0.03 },
  "gemini-2-5-flash-lite": { currency: "USD", input: 0.1, output: 0.4, cache_read: 0.01 },

  // Google Gemini 2.0 series
  "gemini-2-0-flash": { currency: "USD", input: 0.15, output: 0.6 },
  "gemini-2-0-flash-lite": { currency: "USD", input: 0.075, output: 0.3 },

  // Google Gemma
  "gemma-4-26b": { currency: "USD", input: 0.15, output: 0.6, cache_read: 0.015 },

  // Anthropic Claude series
  "claude-opus-4-7": { currency: "USD", input: 5, output: 25, cache_read: 0.5 },
  "claude-opus-4-6": { currency: "USD", input: 5, output: 25, cache_read: 0.5 },
  "claude-opus-4-5": { currency: "USD", input: 5, output: 25, cache_read: 0.5 },
  "claude-opus-4-1": { currency: "USD", input: 15, output: 75, cache_read: 1.5 },
  "claude-opus-4": { currency: "USD", input: 15, output: 75, cache_read: 1.5 },
  "claude-sonnet-4-6": { currency: "USD", input: 3, output: 15, cache_read: 0.3 },
  "claude-sonnet-4-5": { currency: "USD", input: 3, output: 15, cache_read: 0.3 },
  "claude-sonnet-4": { currency: "USD", input: 3, output: 15, cache_read: 0.3 },
  "claude-haiku-4-5": { currency: "USD", input: 1, output: 5, cache_read: 0.1 },

  // xAI Grok series
  "grok-4-20": { currency: "USD", input: 2, output: 6, cache_read: 0.2 },
  "grok-4-1-fast": { currency: "USD", input: 0.2, output: 0.5, cache_read: 0.05 },

  // DeepSeek series
  "deepseek-v3-2": { currency: "USD", input: 0.56, output: 1.68, cache_read: 0.056 },
  "deepseek-v3-1": { currency: "USD", input: 0.6, output: 1.7, cache_read: 0.06 },
  "deepseek-r1": { currency: "USD", input: 1.35, output: 5.4 },

  // MiniMax
  "minimax-m2": { currency: "USD", input: 0.3, output: 1.2, cache_read: 0.03 },

  // Moonshot AI
  "kimi-k2-thinking": { currency: "USD", input: 0.6, output: 2.5, cache_read: 0.06 },

  // Qwen series
  "qwen3-next-80b-thinking": { currency: "USD", input: 0.15, output: 1.2 },
  "qwen3-coder-480b-a35b": { currency: "USD", input: 0.22, output: 1.8, cache_read: 0.022 },
  "qwen3-235b-a22b": { currency: "USD", input: 0.22, output: 0.88 },

  // GLM series
  "glm-4-7": { currency: "USD", input: 0.6, output: 2.2 },
  "glm-5": { currency: "USD", input: 1, output: 3.2, cache_read: 0.1 },

  // OpenAI GPT-OSS
  "gpt-oss-120b": { currency: "USD", input: 0.09, output: 0.36 },
  "gpt-oss-20b": { currency: "USD", input: 0.07, output: 0.25, cache_read: 0.007 },

  // Meta Llama series
  "llama-3-3-70b": { currency: "USD", input: 0.72, output: 0.72 },
  "llama-4-scout": { currency: "USD", input: 0.25, output: 0.7 },
  "llama-4-maverick": { currency: "USD", input: 0.35, output: 1.15 },

  // Mistral series
  "mistral-medium-3": { currency: "USD", input: 0.4, output: 2 },
  "mistral-small-3-1": { currency: "USD", input: 0.1, output: 0.3 },
  "codestral-2": { currency: "USD", input: 0.3, output: 0.9 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.startsWith("gemini-3")) return "gemini-3";
  if (id.startsWith("gemini-2-5")) return "gemini-2-5";
  if (id.startsWith("gemini-2-0")) return "gemini-2-0";
  if (id.startsWith("gemma")) return "gemma";
  if (id.startsWith("claude-opus")) return "claude-opus";
  if (id.startsWith("claude-sonnet")) return "claude-sonnet";
  if (id.startsWith("claude-haiku")) return "claude-haiku";
  if (id.startsWith("grok")) return "grok";
  if (id.startsWith("deepseek")) return "deepseek";
  if (id.startsWith("minimax")) return "minimax";
  if (id.startsWith("kimi")) return "kimi";
  if (id.startsWith("qwen")) return "qwen";
  if (id.startsWith("glm")) return "glm";
  if (id.startsWith("gpt-oss")) return "gpt-oss";
  if (id.startsWith("llama")) return "llama";
  if (id.startsWith("mistral")) return "mistral";
  if (id.startsWith("codestral")) return "codestral";
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
      console.warn(`  Google Vertex AI: skipping ${id} — no pricing`);
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

  console.log(`  Google Vertex AI: ${models.length} models`);

  return { provider, models };
}
