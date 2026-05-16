import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "meganova",
  name: "MegaNova",
  url: "https://meganova.ai",
  api_docs: "https://docs.meganova.ai",
  apis: {
    openai: "https://api.meganova.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: https://meganova.ai/pricing (SSR HTML, first-party data)
// - Model IDs: MegaNova pricing page + models page
// - Context lengths: Cross-referenced with official provider documentation
//
// MegaNova is a model producer (Manta series) and inference platform
// hosting 65+ third-party models with per-token USD pricing.
//
// Pricing shown is USD per million tokens.
// Manta models are free with daily quotas.
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
  // ── MegaNova own models (Manta series) ──────────────────────────────
  "manta-mini-1.0": {
    name: "Manta Mini 1.0 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "manta-flash-1.0": {
    name: "Manta Flash 1.0 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "manta-pro-1.0": {
    name: "Manta Pro 1.0 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // ── Anthropic ────────────────────────────────────────────────────────
  "claude-opus-4-7": {
    name: "Claude Opus 4.7 on MegaNova",
    context: 200000,
    output: 32000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-opus-4-6": {
    name: "Claude Opus 4.6 on MegaNova",
    context: 200000,
    output: 32000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-opus-4-5": {
    name: "Claude Opus 4.5 on MegaNova",
    context: 200000,
    output: 32000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-opus-4": {
    name: "Claude Opus 4 on MegaNova",
    context: 200000,
    output: 32000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-sonnet-4-6": {
    name: "Claude Sonnet 4.6 on MegaNova",
    context: 200000,
    output: 16000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-sonnet-4-5": {
    name: "Claude Sonnet 4.5 on MegaNova",
    context: 200000,
    output: 16000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "claude-haiku-4-5": {
    name: "Claude Haiku 4.5 on MegaNova",
    context: 200000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // ── OpenAI ───────────────────────────────────────────────────────────
  "gpt-5-5": {
    name: "GPT-5.5 on MegaNova",
    context: 1047576,
    output: 32768,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-4": {
    name: "GPT-5.4 on MegaNova",
    context: 1047576,
    output: 32768,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-3-chat": {
    name: "GPT-5.3 Chat on MegaNova",
    context: 1047576,
    output: 32768,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-3-codex": {
    name: "GPT-5.3 Codex on MegaNova",
    context: 1047576,
    output: 32768,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-2": {
    name: "GPT-5.2 on MegaNova",
    context: 1047576,
    output: 32768,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-1": {
    name: "GPT-5.1 on MegaNova",
    context: 1047576,
    output: 32768,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5": {
    name: "GPT-5 on MegaNova",
    context: 1047576,
    output: 32768,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-mini": {
    name: "GPT-5 Mini on MegaNova",
    context: 1047576,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-5-nano": {
    name: "GPT-5 Nano on MegaNova",
    context: 1047576,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-4-turbo": {
    name: "GPT-4 Turbo on MegaNova",
    context: 128000,
    output: 4096,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gpt-4o-mini": {
    name: "GPT-4o Mini on MegaNova",
    context: 128000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // ── Google ───────────────────────────────────────────────────────────
  "gemini-3-1-pro-preview": {
    name: "Gemini 3.1 Pro Preview on MegaNova",
    context: 1048576,
    output: 65536,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    reasoning: true,
  },
  "gemini-3-1-flash-lite": {
    name: "Gemini 3.1 Flash Lite on MegaNova",
    context: 1048576,
    output: 65536,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gemini-3-1-flash-lite-preview": {
    name: "Gemini 3.1 Flash Lite Preview on MegaNova",
    context: 1048576,
    output: 65536,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gemini-3-flash-preview": {
    name: "Gemini 3 Flash Preview on MegaNova",
    context: 1048576,
    output: 65536,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gemini-2-5-pro": {
    name: "Gemini 2.5 Pro on MegaNova",
    context: 1048576,
    output: 65536,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    reasoning: true,
  },
  "gemini-2-5-flash": {
    name: "Gemini 2.5 Flash on MegaNova",
    context: 1048576,
    output: 65536,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    reasoning: true,
  },
  "gemini-2-5-flash-lite": {
    name: "Gemini 2.5 Flash Lite on MegaNova",
    context: 1048576,
    output: 65536,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "gemma-4-31b": {
    name: "Gemma 4 31B on MegaNova",
    context: 96000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // ── DeepSeek ─────────────────────────────────────────────────────────
  "deepseek-v4-pro": {
    name: "DeepSeek V4 Pro on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    reasoning: true,
  },
  "deepseek-v4-flash": {
    name: "DeepSeek V4 Flash on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-v3-2": {
    name: "DeepSeek V3.2 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-v3-2-exp": {
    name: "DeepSeek V3.2 Exp on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-v3-1": {
    name: "DeepSeek V3.1 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-v3-0324": {
    name: "DeepSeek V3 0324 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-r1-0528": {
    name: "DeepSeek R1 0528 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },

  // ── xAI ──────────────────────────────────────────────────────────────
  "grok-4-3": {
    name: "Grok 4.3 on MegaNova",
    context: 131072,
    output: 32768,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    reasoning: true,
  },
  "grok-4-fast": {
    name: "Grok 4 Fast on MegaNova",
    context: 131072,
    output: 32768,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // ── MoonshotAI ───────────────────────────────────────────────────────
  "kimi-k2-6": {
    name: "Kimi K2.6 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "kimi-k2-5": {
    name: "Kimi K2.5 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "kimi-k2-thinking": {
    name: "Kimi K2 Thinking on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    openWeights: true,
  },

  // ── Alibaba ──────────────────────────────────────────────────────────
  "qwen3-6-plus": {
    name: "Qwen3.6 Plus on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3-5-plus": {
    name: "Qwen3.5 Plus on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3-vl-plus": {
    name: "Qwen3 VL Plus on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3-vl-flash": {
    name: "Qwen3 VL Flash on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3-235b-a22b-instruct-2507": {
    name: "Qwen3 235B A22B Instruct 2507 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwen2-5-vl-32b-instruct": {
    name: "Qwen2.5 VL 32B Instruct on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // ── ZhipuAI ──────────────────────────────────────────────────────────
  "glm-5-1": {
    name: "GLM-5.1 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "glm-5": {
    name: "GLM-5 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "glm-4-7": {
    name: "GLM-4.7 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "glm-4-7-flash": {
    name: "GLM-4.7 Flash on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "glm-4-6": {
    name: "GLM-4.6 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // ── Xiaomi ───────────────────────────────────────────────────────────
  "mimo-v2-5-pro": {
    name: "MiMo V2.5 Pro on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "mimo-v2-5": {
    name: "MiMo V2.5 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "mimo-v2-omni": {
    name: "MiMo V2 Omni on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "mimo-v2-pro": {
    name: "MiMo V2 Pro on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "mimo-v2-flash": {
    name: "MiMo V2 Flash on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // ── MiniMax ──────────────────────────────────────────────────────────
  "minimax-m2-7": {
    name: "MiniMax M2.7 on MegaNova",
    context: 1048576,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "minimax-m2-5": {
    name: "MiniMax M2.5 on MegaNova",
    context: 1048576,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "minimax-m2-1": {
    name: "MiniMax M2.1 on MegaNova",
    context: 1048576,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // ── Mistral ──────────────────────────────────────────────────────────
  "mistral-small-4": {
    name: "Mistral Small 4 on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "mistral-nemo-instruct-2407": {
    name: "Mistral Nemo Instruct 2407 on MegaNova",
    context: 131072,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // ── Meta ─────────────────────────────────────────────────────────────
  "llama3-3-70b": {
    name: "Llama 3.3 70B on MegaNova",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: SSR HTML from meganova.ai/pricing (first-party data, 2026-05-16)
// Manta models are free with daily quotas.
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // MegaNova own models (free)
  "manta-mini-1.0": { unit: "free" },
  "manta-flash-1.0": { unit: "free" },
  "manta-pro-1.0": { unit: "free" },

  // Anthropic
  "claude-opus-4-7": { currency: "USD", input: 4.0, output: 20.0 },
  "claude-opus-4-6": { currency: "USD", input: 4.0, output: 20.0 },
  "claude-opus-4-5": { currency: "USD", input: 4.0, output: 20.0 },
  "claude-opus-4": { currency: "USD", input: 12.0, output: 60.0 },
  "claude-sonnet-4-6": { currency: "USD", input: 2.4, output: 12.0 },
  "claude-sonnet-4-5": { currency: "USD", input: 2.4, output: 12.0 },
  "claude-haiku-4-5": { currency: "USD", input: 0.8, output: 4.0 },

  // OpenAI
  "gpt-5-5": { currency: "USD", input: 4.0, output: 24.0 },
  "gpt-5-4": { currency: "USD", input: 2.0, output: 12.0 },
  "gpt-5-3-chat": { currency: "USD", input: 1.4, output: 11.2 },
  "gpt-5-3-codex": { currency: "USD", input: 1.4, output: 11.2 },
  "gpt-5-2": { currency: "USD", input: 1.4, output: 11.2 },
  "gpt-5-1": { currency: "USD", input: 1.0, output: 8.0 },
  "gpt-5": { currency: "USD", input: 1.0, output: 8.0 },
  "gpt-5-mini": { currency: "USD", input: 0.2, output: 1.6 },
  "gpt-5-nano": { currency: "USD", input: 0.04, output: 0.32 },
  "gpt-4-turbo": { currency: "USD", input: 8.0, output: 24.0 },
  "gpt-4o-mini": { currency: "USD", input: 0.12, output: 0.48 },

  // Google
  "gemini-3-1-pro-preview": { currency: "USD", input: 1.6, output: 9.6 },
  "gemini-3-1-flash-lite": { currency: "USD", input: 0.25, output: 1.5 },
  "gemini-3-1-flash-lite-preview": { currency: "USD", input: 0.2, output: 1.2 },
  "gemini-3-flash-preview": { currency: "USD", input: 0.4, output: 2.4 },
  "gemini-2-5-pro": { currency: "USD", input: 1.0, output: 8.0 },
  "gemini-2-5-flash": { currency: "USD", input: 0.24, output: 2.0 },
  "gemini-2-5-flash-lite": { currency: "USD", input: 0.08, output: 0.32 },
  "gemma-4-31b": { currency: "USD", input: 0.13, output: 0.38 },

  // DeepSeek
  "deepseek-v4-pro": { currency: "USD", input: 1.74, output: 3.48 },
  "deepseek-v4-flash": { currency: "USD", input: 0.14, output: 0.28 },
  "deepseek-v3-2": { currency: "USD", input: 0.26, output: 0.38 },
  "deepseek-v3-2-exp": { currency: "USD", input: 0.26, output: 0.38 },
  "deepseek-v3-1": { currency: "USD", input: 0.19, output: 0.79 },
  "deepseek-v3-0324": { currency: "USD", input: 0.2, output: 0.7 },
  "deepseek-r1-0528": { currency: "USD", input: 0.5, output: 2.15 },

  // xAI
  "grok-4-3": { currency: "USD", input: 1.25, output: 2.5 },
  "grok-4-fast": { currency: "USD", input: 0.2, output: 0.5 },

  // MoonshotAI
  "kimi-k2-6": { currency: "USD", input: 0.95, output: 4.0 },
  "kimi-k2-5": { currency: "USD", input: 0.4, output: 2.2 },
  "kimi-k2-thinking": { currency: "USD", input: 0.6, output: 2.6 },

  // Alibaba
  "qwen3-6-plus": { currency: "USD", input: 0.5, output: 3.0 },
  "qwen3-5-plus": { currency: "USD", input: 0.4, output: 2.4 },
  "qwen3-vl-plus": { currency: "USD", input: 0.2, output: 1.6 },
  "qwen3-vl-flash": { currency: "USD", input: 0.05, output: 0.4 },
  "qwen3-235b-a22b-instruct-2507": { currency: "USD", input: 0.09, output: 0.57 },
  "qwen2-5-vl-32b-instruct": { currency: "USD", input: 0.2, output: 0.6 },

  // ZhipuAI
  "glm-5-1": { currency: "USD", input: 1.4, output: 4.4 },
  "glm-5": { currency: "USD", input: 0.8, output: 2.56 },
  "glm-4-7": { currency: "USD", input: 0.2, output: 0.8 },
  "glm-4-7-flash": { unit: "free" },
  "glm-4-6": { currency: "USD", input: 0.45, output: 1.9 },

  // Xiaomi
  "mimo-v2-5-pro": { currency: "USD", input: 1.0, output: 3.0 },
  "mimo-v2-5": { currency: "USD", input: 0.4, output: 2.0 },
  "mimo-v2-omni": { currency: "USD", input: 0.4, output: 2.0 },
  "mimo-v2-pro": { currency: "USD", input: 1.0, output: 3.0 },
  "mimo-v2-flash": { currency: "USD", input: 0.1, output: 0.3 },

  // MiniMax
  "minimax-m2-7": { currency: "USD", input: 0.3, output: 1.2 },
  "minimax-m2-5": { currency: "USD", input: 0.3, output: 1.2 },
  "minimax-m2-1": { currency: "USD", input: 0.28, output: 1.2 },

  // Mistral
  "mistral-small-4": { currency: "USD", input: 0.15, output: 0.6 },
  "mistral-nemo-instruct-2407": { currency: "USD", input: 0.02, output: 0.04 },

  // Meta
  "llama3-3-70b": { currency: "USD", input: 0.1, output: 0.3 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.startsWith("manta")) return "manta";
  if (id.startsWith("claude")) return "claude";
  if (id.startsWith("gpt")) return "gpt";
  if (id.startsWith("gemini")) return "gemini";
  if (id.startsWith("gemma")) return "gemma";
  if (id.startsWith("deepseek")) return "deepseek";
  if (id.startsWith("grok")) return "grok";
  if (id.startsWith("kimi")) return "kimi";
  if (id.startsWith("qwen3-vl")) return "qwen-vl";
  if (id.startsWith("qwen3")) return "qwen";
  if (id.startsWith("qwen2")) return "qwen";
  if (id.startsWith("glm")) return "glm";
  if (id.startsWith("mimo")) return "mimo";
  if (id.startsWith("minimax")) return "minimax";
  if (id.startsWith("mistral")) return "mistral";
  if (id.startsWith("llama")) return "llama";
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
      console.warn(`  MegaNova: skipping ${id} — no pricing`);
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

  console.log(`  MegaNova: ${models.length} models`);

  return { provider, models };
}
