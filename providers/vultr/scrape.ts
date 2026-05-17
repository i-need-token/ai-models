import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "vultr",
  name: "Vultr Cloud Inference",
  url: "https://www.vultr.com/products/cloud-inference/",
  api_docs: "https://docs.vultr.com/cloud-inference",
  apis: {
    openai: "https://inference.vultr.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-17)
//
// Sources:
// - Model list: https://docs.vultr.com/models (browser-scraped Model Library)
// - Pricing: https://www.vultr.com/products/cloud-inference/ (SSR: $0.55/1M input, $2.75/1M output)
// - Context/output specs: original model provider specs (cross-referenced with catalog YAMLs)
//
// Vultr Cloud Inference is a serverless inference platform hosting models from
// other providers (DeepSeek, Alibaba/Qwen, Meta/Llama, Google/Gemma, NVIDIA/Nemotron,
// Microsoft/Phi, Mistral, MiniMax, Xiaomi/MiMo, Moonshot/Kimi, ZhipuAI/GLM,
// StepFun, Sarvam AI, Cohere/TinyAya, AllenAI/OLMo, Meituan/LongCat, OpenAI/GPT-OSS)
// with flat per-token USD pricing.
//
// Pricing: $0.55/1M input tokens, $2.75/1M output tokens (same for ALL models).
// Model list was browser-scraped from the Vultr Docs Model Library (33 families).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Flat pricing for all models
// ---------------------------------------------------------------------------

const PRICING: Pricing = { currency: "USD", input: 0.55, output: 2.75 };

// ---------------------------------------------------------------------------
// Model info type
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

// ---------------------------------------------------------------------------
// Model data (98 models from 33 families)
// ---------------------------------------------------------------------------

const MODELS: Record<string, ModelInfo> = {
  // === Xiaomi MiMo V2.5 ===
  "mimo-v2.5": {
    name: "Xiaomi MiMo V2.5",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "mimo-v2.5-pro": {
    name: "Xiaomi MiMo V2.5 Pro",
    context: 1048576,
    output: 1048576,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === NVIDIA Nemotron v3 ===
  "nemotron-3-nano-omni-30b-a3b-reasoning": {
    name: "NVIDIA Nemotron 3 Nano Omni 30B-A3B Reasoning",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "nemotron-3-super-120b-a12b-bf16": {
    name: "NVIDIA Nemotron 3 Super 120B-A12B",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3-nemotron-235b-a22b-genrm": {
    name: "NVIDIA Qwen3-Nemotron 235B-A22B GenRM",
    context: 262144,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nemotron-3-nano-30b-a3b-bf16": {
    name: "NVIDIA Nemotron 3 Nano 30B-A3B",
    context: 262144,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nemotron-3-nano-30b-a3b-base-bf16": {
    name: "NVIDIA Nemotron 3 Nano 30B-A3B Base",
    context: 262144,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === DeepSeek V4 ===
  "deepseek-v4-pro": {
    name: "DeepSeek V4 Pro",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "deepseek-v4-flash": {
    name: "DeepSeek V4 Flash",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === Alibaba Qwen 3.6 ===
  "qwen3.6-27b": {
    name: "Alibaba Qwen3.6-27B",
    context: 120000,
    output: 120000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3.6-35b-a3b": {
    name: "Alibaba Qwen3.6-35B-A3B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === Moonshot AI Kimi K2.6 ===
  "kimi-k2.6": {
    name: "Moonshot AI Kimi K2.6",
    context: 262144,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // === Zhipu AI GLM 5.1 ===
  "glm-5.1-fp8": {
    name: "Zhipu AI GLM 5.1 FP8",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // === Google Gemma 4 ===
  "gemma-4-e4b-it": {
    name: "Google Gemma 4 E4B IT",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image", "video", "audio"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-4-e2b-it": {
    name: "Google Gemma 4 E2B IT",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image", "video", "audio"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-4-31b-it": {
    name: "Google Gemma 4 31B IT",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image", "video", "audio"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-4-26b-a4b-it": {
    name: "Google Gemma 4 26B-A4B IT",
    context: 262144,
    output: 131072,
    inputModalities: ["text", "image", "video", "audio"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === NVIDIA Nemotron Cascade 2 ===
  "nemotron-cascade-2-30b-a3b": {
    name: "NVIDIA Nemotron Cascade 2 30B-A3B",
    context: 262144,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },

  // === MiniMax M2 ===
  "minimax-m2.7": {
    name: "MiniMax M2.7",
    context: 128000,
    output: 16000,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "minimax-m2.5": {
    name: "MiniMax M2.5",
    context: 95000,
    output: 95000,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "minimax-m2.1": {
    name: "MiniMax M2.1",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "minimax-m2": {
    name: "MiniMax M2",
    context: 1048576,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // === Mistral Small 4 ===
  "mistral-small-4-119b-2603": {
    name: "Mistral Small 4 119B",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },

  // === Sarvam AI ===
  "sarvam-105b": {
    name: "Sarvam AI 105B",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "sarvam-30b": {
    name: "Sarvam AI 30B",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === Alibaba Qwen 3.5 ===
  "qwen3.5-2b": {
    name: "Alibaba Qwen3.5-2B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3.5-0.8b": {
    name: "Alibaba Qwen3.5-0.8B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3.5-9b": {
    name: "Alibaba Qwen3.5-9B",
    context: 80000,
    output: 120000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3.5-4b": {
    name: "Alibaba Qwen3.5-4B",
    context: 262144,
    output: 262144,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3.5-35b-a3b": {
    name: "Alibaba Qwen3.5-35B-A3B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3.5-122b-a10b": {
    name: "Alibaba Qwen3.5-122B-A10B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3.5-27b": {
    name: "Alibaba Qwen3.5-27B",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3.5-397b-a17b": {
    name: "Alibaba Qwen3.5-397B-A17B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === Cohere Tiny Aya ===
  "tiny-aya-water": {
    name: "Cohere Tiny Aya Water",
    context: 8000,
    output: 8000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "tiny-aya-global": {
    name: "Cohere Tiny Aya Global",
    context: 8000,
    output: 8000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "tiny-aya-fire": {
    name: "Cohere Tiny Aya Fire",
    context: 8000,
    output: 8000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "tiny-aya-earth": {
    name: "Cohere Tiny Aya Earth",
    context: 8000,
    output: 8000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "tiny-aya-base": {
    name: "Cohere Tiny Aya Base",
    context: 8000,
    output: 8000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === Zhipu AI GLM 5 ===
  "glm-5-fp8": {
    name: "Zhipu AI GLM 5 FP8",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // === StepFun Step 3.5 Flash ===
  "step-3.5-flash": {
    name: "StepFun Step 3.5 Flash",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // === Moonshot AI Kimi K2.5 ===
  "kimi-k25": {
    name: "Moonshot AI Kimi K2.5",
    context: 262144,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // === Zhipu AI GLM 4.7 ===
  "glm-4.7-flash": {
    name: "Zhipu AI GLM 4.7 Flash",
    context: 200000,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "glm-47": {
    name: "Zhipu AI GLM 4.7",
    context: 200000,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // === NVIDIA Cosmos Reason 2 ===
  "cosmos-reason-2-8b": {
    name: "NVIDIA Cosmos Reason 2 8B",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "cosmos-reason-2-2b": {
    name: "NVIDIA Cosmos Reason 2 2B",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },

  // === Xiaomi MiMo ===
  "mimo-v2-flash": {
    name: "Xiaomi MiMo V2 Flash",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === Allen AI OLMo 3.1 ===
  "olmo-3.1-32b-think": {
    name: "Allen AI OLMo 3.1 32B Think",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "olmo-3.1-32b-instruct": {
    name: "Allen AI OLMo 3.1 32B Instruct",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === Mistral Large 3 ===
  "mistral-large-3-675b-instruct-2512": {
    name: "Mistral Large 3 675B",
    context: 262144,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },

  // === DeepSeek V3.2 ===
  "deepseek-v32-speciale": {
    name: "DeepSeek V3.2 Speciale",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "deepseek-v32": {
    name: "DeepSeek V3.2",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "deepseek-v32-exp": {
    name: "DeepSeek V3.2 Exp",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === Zhipu AI GLM 4.6 ===
  "glm-46": {
    name: "Zhipu AI GLM 4.6",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // === Meituan LongCat Flash ===
  "longcat-flash-thinking": {
    name: "Meituan LongCat Flash Thinking",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "longcat-flash-chat": {
    name: "Meituan LongCat Flash Chat",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === Moonshot AI Kimi K2 ===
  "kimi-k2-instruct-0905": {
    name: "Moonshot AI Kimi K2 Instruct 0905",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "kimi-k2-thinking": {
    name: "Moonshot AI Kimi K2 Thinking",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },

  // === Google Gemma 3 ===
  "gemma-3-270m-it": {
    name: "Google Gemma 3 270M IT",
    context: 8192,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-3-27b-it": {
    name: "Google Gemma 3 27B IT",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-3-12b-it": {
    name: "Google Gemma 3 12B IT",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-3-4b-it": {
    name: "Google Gemma 3 4B IT",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gemma-3-1b-it": {
    name: "Google Gemma 3 1B IT",
    context: 8192,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === Alibaba Qwen 3 ===
  "qwen3-4b-thinking-2507": {
    name: "Alibaba Qwen3-4B Thinking 2507",
    context: 262144,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "qwen3-4b-instruct-2507": {
    name: "Alibaba Qwen3-4B Instruct 2507",
    context: 262144,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3-30b-a3b-thinking-2507": {
    name: "Alibaba Qwen3-30B-A3B Thinking 2507",
    context: 256000,
    output: 8000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "qwen3-30b-a3b-instruct-2507": {
    name: "Alibaba Qwen3-30B-A3B Instruct 2507",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3-235b-a22b-thinking-2507": {
    name: "Alibaba Qwen3-235B-A22B Thinking 2507",
    context: 262144,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "qwen3-235b-a22b-instruct-2507": {
    name: "Alibaba Qwen3-235B-A22B Instruct 2507",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3-32b": {
    name: "Alibaba Qwen3-32B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3-14b": {
    name: "Alibaba Qwen3-14B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3-8b": {
    name: "Alibaba Qwen3-8B",
    context: 256000,
    output: 8000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "qwen3-4b": {
    name: "Alibaba Qwen3-4B",
    context: 256000,
    output: 8000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === OpenAI GPT-OSS ===
  "gpt-oss-120b": {
    name: "OpenAI GPT-OSS 120B",
    context: 30000,
    output: 90000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "gpt-oss-20b": {
    name: "OpenAI GPT-OSS 20B",
    context: 30000,
    output: 90000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === DeepSeek R1 ===
  "deepseek-r1-0528": {
    name: "DeepSeek R1 0528",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "deepseek-r1-distill-qwen-32b": {
    name: "DeepSeek R1 Distill Qwen 32B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "deepseek-r1-distill-qwen-14b": {
    name: "DeepSeek R1 Distill Qwen 14B",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "deepseek-r1-distill-qwen-7b": {
    name: "DeepSeek R1 Distill Qwen 7B",
    context: 32768,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "deepseek-r1-distill-qwen-1.5b": {
    name: "DeepSeek R1 Distill Qwen 1.5B",
    context: 32768,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
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
  "deepseek-r1-distill-llama-8b": {
    name: "DeepSeek R1 Distill Llama 8B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },

  // === Microsoft Phi 4 ===
  "phi-4-reasoning-plus": {
    name: "Microsoft Phi-4 Reasoning Plus",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "phi-4-reasoning": {
    name: "Microsoft Phi-4 Reasoning",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "phi-4-mini-reasoning": {
    name: "Microsoft Phi-4 Mini Reasoning",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
  },
  "phi-4-mini-instruct": {
    name: "Microsoft Phi-4 Mini Instruct",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "phi-4": {
    name: "Microsoft Phi-4",
    context: 16384,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // === Meta Llama 4 ===
  "llama-4-scout-17b-16e": {
    name: "Meta Llama 4 Scout 17B-16E",
    context: 327680,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "llama-4-maverick-17b-128e-instruct": {
    name: "Meta Llama 4 Maverick 17B-128E Instruct",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "llama-4-maverick-17b-128e": {
    name: "Meta Llama 4 Maverick 17B-128E",
    context: 131072,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "llama-4-scout-17b-16e-instruct": {
    name: "Meta Llama 4 Scout 17B-16E Instruct",
    context: 327680,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },

  // === Alibaba Qwen3 Coder ===
  "qwen3-coder-480b-a35b-instruct": {
    name: "Alibaba Qwen3 Coder 480B-A35B Instruct",
    context: 256000,
    output: 64000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen3-coder-30b-a3b-instruct": {
    name: "Alibaba Qwen3 Coder 30B-A3B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },

  // === Meta Llama 3.1 ===
  "llama-3.1-405b-instruct": {
    name: "Meta Llama 3.1 405B Instruct",
    context: 128000,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "llama-3.1-405b": {
    name: "Meta Llama 3.1 405B",
    context: 128000,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "llama-3.1-70b-instruct": {
    name: "Meta Llama 3.1 70B Instruct",
    context: 128000,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "llama-3.1-70b": {
    name: "Meta Llama 3.1 70B",
    context: 128000,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "llama-3.1-8b-instruct": {
    name: "Meta Llama 3.1 8B Instruct",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "llama-3.1-8b": {
    name: "Meta Llama 3.1 8B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  if (lower.startsWith("mimo")) return "mimo";
  if (lower.startsWith("nemotron-cascade")) return "nemotron-cascade";
  if (lower.startsWith("nemotron")) return "nemotron";
  if (lower.startsWith("deepseek-v4")) return "deepseek-v4";
  if (lower.startsWith("deepseek-v3")) return "deepseek-v3";
  if (lower.startsWith("deepseek-r1")) return "deepseek-r1";
  if (lower.startsWith("qwen3-coder")) return "qwen3-coder";
  if (lower.startsWith("qwen3.6")) return "qwen3.6";
  if (lower.startsWith("qwen3.5")) return "qwen3.5";
  if (lower.startsWith("qwen3")) return "qwen3";
  if (lower.startsWith("kimi")) return "kimi";
  if (lower.startsWith("glm-5")) return "glm-5";
  if (lower.startsWith("glm-4.7")) return "glm-4.7";
  if (lower.startsWith("glm-4.6")) return "glm-4.6";
  if (lower.startsWith("glm")) return "glm";
  if (lower.startsWith("gemma-4")) return "gemma-4";
  if (lower.startsWith("gemma-3")) return "gemma-3";
  if (lower.startsWith("minimax")) return "minimax-m2";
  if (lower.startsWith("mistral-small")) return "mistral-small";
  if (lower.startsWith("mistral-large")) return "mistral-large";
  if (lower.startsWith("sarvam")) return "sarvam";
  if (lower.startsWith("tiny-aya")) return "tiny-aya";
  if (lower.startsWith("step")) return "step";
  if (lower.startsWith("cosmos")) return "cosmos";
  if (lower.startsWith("olmo")) return "olmo";
  if (lower.startsWith("longcat")) return "longcat";
  if (lower.startsWith("gpt-oss")) return "gpt-oss";
  if (lower.startsWith("phi")) return "phi";
  if (lower.startsWith("llama-4")) return "llama-4";
  if (lower.startsWith("llama")) return "llama";
  return lower.split("-")[0] as string;
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
    const modelDef: Parameters<typeof defineModel>[0] = {
      id,
      name: info.name,
      family: deriveFamily(id),
      temperature: true,
      limit: { context: info.context, output: info.output },
      modalities: { input: info.inputModalities, output: info.outputModalities },
      pricing: PRICING,
      release_date: today,
      last_updated: today,
    };

    if (info.openWeights) modelDef.open_weights = true;
    if (info.reasoning) modelDef.reasoning = true;
    if (info.toolCall) modelDef.tool_call = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Vultr: ${models.length} models`);

  return { provider, models };
}
