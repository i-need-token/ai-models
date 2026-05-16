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
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Model list & pricing: https://api.deepinfra.com/v1/openai/models
// - Pricing page: https://deepinfra.com/pricing (SSR page, browser-verified)
// - Context lengths: DeepInfra API metadata & pricing page
//
// DeepInfra is an inference platform hosting models from other providers
// (DeepSeek, Alibaba, Meta, Google, Anthropic, NVIDIA, Microsoft, Mistral,
// ByteDance, MiniMax, NousResearch, Xiaomi, Moonshot, StepFun, ZhipuAI,
// Sao10K) with its own per-token pricing.
//
// Pricing shown is DeepInfra's per-1M-token rate (USD).
// Some models have prompt caching pricing (cache_read).
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
  // --- deepseek family ---
  "deepseek-r1-0528": {
    name: "DeepSeek R1 0528",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    reasoning: true,
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
    openWeights: true,
    reasoning: true,
  },
  "deepseek-v3": {
    name: "DeepSeek V3",
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
  "deepseek-v3.1": {
    name: "DeepSeek V3.1",
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
  "deepseek-v3.2": {
    name: "DeepSeek V3.2",
    context: 163840,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "deepseek-v4-flash": {
    name: "DeepSeek V4 Flash",
    context: 1048576,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    reasoning: true,
  },
  "deepseek-v4-pro": {
    name: "DeepSeek V4 Pro",
    context: 65536,
    output: 65536,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    reasoning: true,
  },

  // --- qwen-coder family ---
  "qwen3-coder-480b-a35b-instruct-turbo": {
    name: "Qwen3 Coder 480B A35B Turbo",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- qwen-vl family ---
  "qwen3-vl-235b-a22b-instruct": {
    name: "Qwen3 VL 235B A22B Instruct",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3-vl-30b-a3b-instruct": {
    name: "Qwen3 VL 30B A3B Instruct",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- qwen3-max family ---
  "qwen3-max": {
    name: "Qwen3 Max",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen3-max-thinking": {
    name: "Qwen3 Max Thinking",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    reasoning: true,
  },

  // --- qwen3-next family ---
  "qwen3-next-80b-a3b-instruct": {
    name: "Qwen3 Next 80B A3B Instruct",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- qwen3.5 family ---
  "qwen3.5-0.8b": {
    name: "Qwen3.5 0.8B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "qwen3.5-122b-a10b": {
    name: "Qwen3.5 122B A10B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "qwen3.5-27b": {
    name: "Qwen3.5 27B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "qwen3.5-2b": {
    name: "Qwen3.5 2B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "qwen3.5-35b-a3b": {
    name: "Qwen3.5 35B A3B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "qwen3.5-397b-a17b": {
    name: "Qwen3.5 397B A17B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "qwen3.5-4b": {
    name: "Qwen3.5 4B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "qwen3.5-9b": {
    name: "Qwen3.5 9B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },

  // --- qwen3.6 family ---
  "qwen3.6-27b": {
    name: "Qwen3.6 27B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "qwen3.6-35b-a3b": {
    name: "Qwen3.6 35B A3B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },

  // --- qwen3 family ---
  "qwen3-14b": {
    name: "Qwen3 14B",
    context: 40960,
    output: 40960,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
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
  "qwen3-235b-a22b-thinking-2507": {
    name: "Qwen3 235B A22B Thinking 2507",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "qwen3-30b-a3b": {
    name: "Qwen3 30B A3B",
    context: 40960,
    output: 40960,
    inputModalities: ["text"],
    outputModalities: ["text"],
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

  // --- qwen2.5 family ---
  "qwen2.5-72b-instruct": {
    name: "Qwen 2.5 72B Instruct",
    context: 32768,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- llama-4 family ---
  "llama-4-maverick-17b-128e": {
    name: "Llama 4 Maverick 17Bx128E",
    context: 1048576,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-4-scout-17b-16e": {
    name: "Llama 4 Scout 17Bx16E",
    context: 327680,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- llama-guard family ---
  "llama-guard-4-12b": {
    name: "Llama Guard 4 12B",
    context: 163840,
    output: 163840,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- llama-3.3 family ---
  "llama-3.3-70b-instruct-turbo": {
    name: "Llama 3.3 70B Turbo",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
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

  // --- llama-3.2 family ---
  "llama-3.2-11b-vision-instruct": {
    name: "Llama 3.2 11B Vision",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- llama-3.1 family ---
  "hermes-3-llama-3.1-405b": {
    name: "Hermes 3 Llama 3.1 405B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "hermes-3-llama-3.1-70b": {
    name: "Hermes 3 Llama 3.1 70B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
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

  // --- gemini family ---
  "gemini-1.5-flash": {
    name: "Gemini 1.5 Flash",
    context: 1000000,
    output: 1000000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "gemini-1.5-flash-8b": {
    name: "Gemini 1.5 Flash 8b",
    context: 1000000,
    output: 1000000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "gemini-2.5-flash": {
    name: "Gemini 2.5 Flash",
    context: 999424,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    reasoning: true,
  },
  "gemini-2.5-pro": {
    name: "Gemini 2.5 Pro",
    context: 999424,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    reasoning: true,
  },
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
    toolCall: true,
    reasoning: true,
  },

  // --- gemma-4 family ---
  "gemma-4-26b-a4b-it": {
    name: "Gemma 4 26B A4B IT",
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
  "gemma-4-31b-it-turbo": {
    name: "Gemma 4 31B IT Turbo",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- gemma-3 family ---
  "gemma-3-12b-it": {
    name: "Gemma 3 12B IT",
    context: 131072,
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
  "gemma-3-4b-it": {
    name: "Gemma 3 4B IT",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- nemotron family ---
  "nemotron-3-nano-30b-a3b": {
    name: "Nemotron 3 Nano 30B A3B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nemotron-3-nano-omni-30b-a3b-reasoning": {
    name: "Nemotron 3 Nano Omni 30B A3B Reasoning",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "nvidia-nemotron-3-super-120b-a12b": {
    name: "Nemotron 3 Super 120B A12B",
    context: 262144,
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

  // --- claude family ---
  "claude-haiku-4-5": {
    name: "Claude Haiku 4.5",
    context: 199885,
    output: 8192,
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
  "claude-sonnet-4-6": {
    name: "Claude Sonnet 4.6",
    context: 999424,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- phi family ---
  "phi-4": {
    name: "Phi-4",
    context: 16384,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- mistral family ---
  "mistral-nemo-instruct-2407": {
    name: "Mistral Nemo Instruct 2407",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
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
  "mistral-small-3.2-24b-instruct-2506": {
    name: "Mistral Small 3.2 24B Instruct 2506",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- voxtral family ---
  "voxtral-mini-3b-2507": {
    name: "Voxtral Mini 3B",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "audio"],
    outputModalities: ["text"],
  },
  "voxtral-small-24b-2507": {
    name: "Voxtral Small 24B",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "audio"],
    outputModalities: ["text"],
  },

  // --- seed family ---
  "seed-1.8": {
    name: "Seed 1.8",
    context: 256000,
    output: 256000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "seed-2.0-code": {
    name: "Seed 2.0 Code",
    context: 256000,
    output: 256000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "seed-2.0-mini": {
    name: "Seed 2.0 Mini",
    context: 256000,
    output: 256000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "seed-2.0-pro": {
    name: "Seed 2.0 Pro",
    context: 256000,
    output: 256000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },

  // --- minimax family ---
  "minimax-m2.5": {
    name: "MiniMax M2.5",
    context: 196608,
    output: 196608,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },

  // --- mimo family ---
  "mimo-v2.5": {
    name: "MiMo V2.5",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "mimo-v2.5-pro": {
    name: "MiMo V2.5 Pro",
    context: 1048576,
    output: 1048576,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },

  // --- kimi family ---
  "kimi-k2.5": {
    name: "Kimi K2.5",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "kimi-k2.6": {
    name: "Kimi K2.6",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },

  // --- gpt-oss family ---
  "gpt-oss-120b": {
    name: "Gpt Oss 120b",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "gpt-oss-120b-turbo": {
    name: "Gpt Oss 120b Turbo",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "gpt-oss-20b": {
    name: "Gpt Oss 20b",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },

  // --- step family ---
  "step-3.5-flash": {
    name: "Step 3.5 Flash",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // --- glm family ---
  "glm-4.6": {
    name: "GLM 4.6",
    context: 202752,
    output: 202752,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "glm-4.7": {
    name: "GLM 4.7",
    context: 202752,
    output: 202752,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "glm-4.7-flash": {
    name: "GLM 4.7 Flash",
    context: 202752,
    output: 202752,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "glm-5": {
    name: "GLM 5",
    context: 202752,
    output: 202752,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "glm-5.1": {
    name: "GLM 5.1",
    context: 202752,
    output: 202752,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },

  // --- l3-finetune family ---
  "l3-8b-lunaris-v1-turbo": {
    name: "L3 8B Lunaris v1 Turbo",
    context: 8192,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "l3.1-70b-euryale-v2.2": {
    name: "L3.1 70B Euryale v2.2",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- mythomax family ---
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
// Source: https://api.deepinfra.com/v1/openai/models (accessed 2026-05-16)
// "cached" price = cache_read
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // deepseek family
  "deepseek-r1-0528": { currency: "USD", input: 0.5, output: 2.15, cache_read: 0.35 },
  "deepseek-r1-0528-turbo": { currency: "USD", input: 1.0, output: 3.0 },
  "deepseek-r1-distill-llama-70b": { currency: "USD", input: 0.7, output: 0.8 },
  "deepseek-v3": { currency: "USD", input: 0.32, output: 0.89 },
  "deepseek-v3-0324": { currency: "USD", input: 0.2, output: 0.77, cache_read: 0.135 },
  "deepseek-v3.1": { currency: "USD", input: 0.21, output: 0.79, cache_read: 0.13 },
  "deepseek-v3.1-terminus": { currency: "USD", input: 0.27, output: 0.95, cache_read: 0.13 },
  "deepseek-v3.2": { currency: "USD", input: 0.26, output: 0.38, cache_read: 0.13 },
  "deepseek-v4-flash": { currency: "USD", input: 0.14, output: 0.28, cache_read: 0.028 },
  "deepseek-v4-pro": { currency: "USD", input: 1.74, output: 3.48, cache_read: 0.145 },
  // qwen-coder family
  "qwen3-coder-480b-a35b-instruct-turbo": {
    currency: "USD",
    input: 0.3,
    output: 1.0,
    cache_read: 0.1,
  },
  // qwen-vl family
  "qwen3-vl-235b-a22b-instruct": { currency: "USD", input: 0.2, output: 0.88, cache_read: 0.11 },
  "qwen3-vl-30b-a3b-instruct": { currency: "USD", input: 0.15, output: 0.6 },
  // qwen3-max family
  "qwen3-max": { currency: "USD", input: 1.2, output: 6.0, cache_read: 0.24 },
  "qwen3-max-thinking": { currency: "USD", input: 1.2, output: 6.0, cache_read: 0.24 },
  // qwen3-next family
  "qwen3-next-80b-a3b-instruct": { currency: "USD", input: 0.09, output: 1.1 },
  // qwen3.5 family
  "qwen3.5-0.8b": { currency: "USD", input: 0.01, output: 0.05 },
  "qwen3.5-122b-a10b": { currency: "USD", input: 0.29, output: 2.4 },
  "qwen3.5-27b": { currency: "USD", input: 0.26, output: 2.6 },
  "qwen3.5-2b": { currency: "USD", input: 0.02, output: 0.1 },
  "qwen3.5-35b-a3b": { currency: "USD", input: 0.14, output: 1.0, cache_read: 0.05 },
  "qwen3.5-397b-a17b": { currency: "USD", input: 0.49, output: 3.6, cache_read: 0.3 },
  "qwen3.5-4b": { currency: "USD", input: 0.03, output: 0.15 },
  "qwen3.5-9b": { currency: "USD", input: 0.04, output: 0.15 },
  // qwen3.6 family
  "qwen3.6-27b": { currency: "USD", input: 0.32, output: 3.2 },
  "qwen3.6-35b-a3b": { currency: "USD", input: 0.15, output: 0.95 },
  // qwen3 family
  "qwen3-14b": { currency: "USD", input: 0.12, output: 0.24 },
  "qwen3-235b-a22b-instruct-2507": { currency: "USD", input: 0.071, output: 0.1 },
  "qwen3-235b-a22b-thinking-2507": { currency: "USD", input: 0.23, output: 2.3, cache_read: 0.2 },
  "qwen3-30b-a3b": { currency: "USD", input: 0.09, output: 0.45 },
  "qwen3-32b": { currency: "USD", input: 0.08, output: 0.28 },
  // qwen2.5 family
  "qwen2.5-72b-instruct": { currency: "USD", input: 0.36, output: 0.4 },
  // llama-4 family
  "llama-4-maverick-17b-128e": { currency: "USD", input: 0.15, output: 0.6 },
  "llama-4-scout-17b-16e": { currency: "USD", input: 0.08, output: 0.3 },
  // llama-guard family
  "llama-guard-4-12b": { currency: "USD", input: 0.18, output: 0.18 },
  // llama-3.3 family
  "llama-3.3-70b-instruct-turbo": { currency: "USD", input: 0.1, output: 0.32 },
  "llama-3.3-nemotron-super-49b-v1.5": { currency: "USD", input: 0.1, output: 0.4 },
  // llama-3.2 family
  "llama-3.2-11b-vision-instruct": { currency: "USD", input: 0.245, output: 0.245 },
  // llama-3.1 family
  "hermes-3-llama-3.1-405b": { currency: "USD", input: 1.0, output: 1.0 },
  "hermes-3-llama-3.1-70b": { currency: "USD", input: 0.3, output: 0.3 },
  "meta-llama-3.1-70b-instruct": { currency: "USD", input: 0.4, output: 0.4 },
  "meta-llama-3.1-70b-instruct-turbo": { currency: "USD", input: 0.4, output: 0.4 },
  "meta-llama-3.1-8b-instruct": { currency: "USD", input: 0.02, output: 0.05 },
  "meta-llama-3.1-8b-instruct-turbo": { currency: "USD", input: 0.02, output: 0.03 },
  // gemini family
  "gemini-1.5-flash": { currency: "USD", input: 0.075, output: 0.3 },
  "gemini-1.5-flash-8b": { currency: "USD", input: 0.0375, output: 0.15 },
  "gemini-2.5-flash": { currency: "USD", input: 0.3, output: 2.5 },
  "gemini-2.5-pro": { currency: "USD", input: 1.25, output: 10.0 },
  "gemini-3.1-flash-lite": { currency: "USD", input: 0.25, output: 1.5 },
  "gemini-3.1-pro": { currency: "USD", input: 2.0, output: 12.0 },
  // gemma-4 family
  "gemma-4-26b-a4b-it": { currency: "USD", input: 0.07, output: 0.34 },
  "gemma-4-31b-it": { currency: "USD", input: 0.13, output: 0.38 },
  "gemma-4-31b-it-turbo": { currency: "USD", input: 0.12, output: 0.37 },
  // gemma-3 family
  "gemma-3-12b-it": { currency: "USD", input: 0.04, output: 0.13 },
  "gemma-3-27b-it": { currency: "USD", input: 0.08, output: 0.16 },
  "gemma-3-4b-it": { currency: "USD", input: 0.04, output: 0.08 },
  // nemotron family
  "nemotron-3-nano-30b-a3b": { currency: "USD", input: 0.05, output: 0.2 },
  "nemotron-3-nano-omni-30b-a3b-reasoning": { currency: "USD", input: 0.2, output: 0.8 },
  "nvidia-nemotron-3-super-120b-a12b": { currency: "USD", input: 0.1, output: 0.5 },
  "nvidia-nemotron-nano-9b-v2": { currency: "USD", input: 0.04, output: 0.16 },
  // claude family
  "claude-haiku-4-5": { currency: "USD", input: 1.0, output: 5.0 },
  "claude-opus-4-7": { currency: "USD", input: 5.0, output: 25.0 },
  "claude-sonnet-4-6": { currency: "USD", input: 3.0, output: 15.0 },
  // phi family
  "phi-4": { currency: "USD", input: 0.07, output: 0.14 },
  // mistral family
  "mistral-nemo-instruct-2407": { currency: "USD", input: 0.02, output: 0.04 },
  "mistral-small-24b-instruct-2501": { currency: "USD", input: 0.05, output: 0.08 },
  "mistral-small-3.2-24b-instruct-2506": { currency: "USD", input: 0.075, output: 0.2 },
  // voxtral family
  "voxtral-mini-3b-2507": { unit: "free" },
  "voxtral-small-24b-2507": { unit: "free" },
  // seed family
  "seed-1.8": { currency: "USD", input: 0.25, output: 2.0, cache_read: 0.05 },
  "seed-2.0-code": { currency: "USD", input: 0.5, output: 3.0, cache_read: 0.1 },
  "seed-2.0-mini": { currency: "USD", input: 0.1, output: 0.4, cache_read: 0.02 },
  "seed-2.0-pro": { currency: "USD", input: 0.5, output: 3.0, cache_read: 0.1 },
  // minimax family
  "minimax-m2.5": { currency: "USD", input: 0.15, output: 1.15, cache_read: 0.03 },
  // mimo family
  "mimo-v2.5": { currency: "USD", input: 0.4, output: 2.0, cache_read: 0.08 },
  "mimo-v2.5-pro": { currency: "USD", input: 1.0, output: 3.0, cache_read: 0.2 },
  // kimi family
  "kimi-k2.5": { currency: "USD", input: 0.45, output: 2.25, cache_read: 0.07 },
  "kimi-k2.6": { currency: "USD", input: 0.75, output: 3.5, cache_read: 0.15 },
  // gpt-oss family
  "gpt-oss-120b": { currency: "USD", input: 0.039, output: 0.19 },
  "gpt-oss-120b-turbo": { currency: "USD", input: 0.15, output: 0.6 },
  "gpt-oss-20b": { currency: "USD", input: 0.03, output: 0.14 },
  // step family
  "step-3.5-flash": { currency: "USD", input: 0.1, output: 0.3, cache_read: 0.02 },
  // glm family
  "glm-4.6": { currency: "USD", input: 0.43, output: 1.74, cache_read: 0.08 },
  "glm-4.7": { currency: "USD", input: 0.4, output: 1.75, cache_read: 0.08 },
  "glm-4.7-flash": { currency: "USD", input: 0.06, output: 0.4, cache_read: 0.01 },
  "glm-5": { currency: "USD", input: 0.6, output: 2.08, cache_read: 0.12 },
  "glm-5.1": { currency: "USD", input: 1.05, output: 3.5, cache_read: 0.205 },
  // l3-finetune family
  "l3-8b-lunaris-v1-turbo": { currency: "USD", input: 0.04, output: 0.05 },
  "l3.1-70b-euryale-v2.2": { currency: "USD", input: 0.85, output: 0.85 },
  // mythomax family
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
  if (id.includes("qwen3.5")) return "qwen3.5";
  if (id.includes("qwen3.6")) return "qwen3.6";
  if (id.includes("qwen3-235b")) return "qwen3";
  if (id.includes("qwen3")) return "qwen3";
  if (id.includes("qwen2.5")) return "qwen2.5";
  if (id.includes("llama-4")) return "llama-4";
  if (id.includes("llama-guard")) return "llama-guard";
  if (id.includes("llama-3.3")) return "llama-3.3";
  if (id.includes("llama-3.2")) return "llama-3.2";
  if (id.includes("llama-3.1") || id.includes("meta-llama-3.1")) return "llama-3.1";
  if (id.includes("gemini")) return "gemini";
  if (id.includes("gemma-4")) return "gemma-4";
  if (id.includes("gemma-3")) return "gemma-3";
  if (id.includes("nemotron")) return "nemotron";
  if (id.includes("claude")) return "claude";
  if (id.includes("phi")) return "phi";
  if (id.includes("mistral")) return "mistral";
  if (id.includes("voxtral")) return "voxtral";
  if (id.includes("mythomax")) return "mythomax";
  if (id.includes("seed")) return "seed";
  if (id.includes("minimax")) return "minimax";
  if (id.includes("hermes")) return "hermes";
  if (id.includes("mimo")) return "mimo";
  if (id.includes("kimi")) return "kimi";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("step")) return "step";
  if (id.includes("glm")) return "glm";
  if (id.includes("l3")) return "l3-finetune";
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
