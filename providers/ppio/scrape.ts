import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "ppio",
  name: "PPIO",
  url: "https://ppio.com",
  api_docs: "https://docs.ppio.ai",
  apis: {
    openai: "https://api.ppinfra.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-17)
//
// Source: https://ppio.com/pricing (browser-scraped SSR HTML)
//
// PPIO (派欧云) is a Chinese cloud AI inference platform offering
// per-token CNY pricing for models from DeepSeek, Qwen, GLM, MiniMax,
// Baidu, Kimi, MiMo, and others.
//
// The pricing page lists 60 LLM models with per-token pricing (CNY/Mt),
// 1 free model, and ~13 models with tiered pricing (阶梯计费).
// Only models with per-token or free pricing are included below.
// Tiered models are excluded because their pricing varies by usage volume.
//
// Pricing is in CNY (￥) per 1M tokens.
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
  "deepseek--deepseek-v4-flash": {
    name: "deepseek-v4-flash",
    context: 1048576,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "deepseek--deepseek-v4-pro": {
    name: "deepseek-v4-pro",
    context: 1048576,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "deepseek--deepseek-ocr-2": {
    name: "deepseek-ocr-2",
    context: 8192,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "deepseek--deepseek-v3.2": {
    name: "deepseek-v3.2",
    context: 163840,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "deepseek--deepseek-v3.2-exp": {
    name: "deepseek-v3.2-exp",
    context: 163840,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "deepseek--deepseek-v3.1-terminus": {
    name: "deepseek-v3.1-terminus",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "deepseek--deepseek-v3-0324": {
    name: "deepseek-v3-0324",
    context: 163840,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "deepseek--deepseek-v3.1": {
    name: "deepseek-v3.1",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "deepseek--deepseek-prover-v2-671b": {
    name: "deepseek-prover-v2-671b",
    context: 160000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "deepseek--deepseek-r1-turbo": {
    name: "deepseek-r1-turbo",
    context: 64000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "deepseek--deepseek-r1-0528": {
    name: "deepseek-r1-0528",
    context: 163840,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "deepseek--deepseek-v3-turbo": {
    name: "deepseek-v3-turbo",
    context: 64000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "deepseek--deepseek-v3--community": {
    name: "deepseek-v3",
    context: 64000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "deepseek--deepseek-r1--community": {
    name: "deepseek-r1",
    context: 64000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "deepseek--deepseek-r1-distill-llama-70b": {
    name: "deepseek-r1-distill-llama-70b",
    context: 32000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "qwen--qwen3.6-27b": {
    name: "qwen3.6-27b",
    context: 262144,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen3-coder-next": {
    name: "qwen3-coder-next",
    context: 262144,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen3-omni-30b-a3b-thinking": {
    name: "qwen3-omni-30b-a3b-thinking",
    context: 65536,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "qwen--qwen3-vl-235b-a22b-thinking": {
    name: "qwen3-vl-235b-a22b-thinking",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "qwen--qwen3-vl-235b-a22b-instruct": {
    name: "qwen3-vl-235b-a22b-instruct",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen3-235b-a22b-thinking-2507": {
    name: "qwen3-235b-a22b-thinking-2507",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "qwen--qwen3-235b-a22b-instruct-2507": {
    name: "qwen3-235b-a22b-instruct-2507",
    context: 262144,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen3-235b-a22b-fp8": {
    name: "qwen3-235b-a22b-fp8",
    context: 40960,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen3-32b-fp8": {
    name: "qwen3-32b-fp8",
    context: 128000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen3-30b-a3b-fp8": {
    name: "qwen3-30b-a3b-fp8",
    context: 40960,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen3-next-80b-a3b-instruct": {
    name: "qwen3-next-80b-a3b-instruct",
    context: 65536,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen3-next-80b-a3b-thinking": {
    name: "qwen3-next-80b-a3b-thinking",
    context: 65536,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "qwen--qwen-2.5-72b-instruct": {
    name: "qwen-2.5-72b-instruct",
    context: 32000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen2.5-vl-72b-instruct": {
    name: "qwen2.5-vl-72b-instruct",
    context: 32000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen2.5-7b-instruct": {
    name: "qwen2.5-7b-instruct",
    context: 32000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen3-vl-8b-instruct": {
    name: "qwen3-vl-8b-instruct",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen3-vl-30b-a3b-thinking": {
    name: "qwen3-vl-30b-a3b-thinking",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "qwen--qwen3-vl-30b-a3b-instruct": {
    name: "qwen3-vl-30b-a3b-instruct",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen3-omni-30b-a3b-instruct": {
    name: "qwen3-omni-30b-a3b-instruct",
    context: 65536,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "qwen--qwen3-4b-fp8": {
    name: "qwen3-4b-fp8",
    context: 128000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
    toolCall: true,
  },
  "zai-org--glm-4.7-flash": {
    name: "glm-4.7-flash",
    context: 200000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "zai-org--autoglm-phone-9b-multilingual": {
    name: "autoglm-phone-9b-multilingual",
    context: 65536,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "zai-org--glm-4.6": {
    name: "glm-4.6",
    context: 204800,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "zai-org--glm-4.5v": {
    name: "glm-4.5v",
    context: 65536,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "zai-org--glm-4.5": {
    name: "glm-4.5",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "zai-org--glm-4.5-air": {
    name: "glm-4.5-air",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "minimax--minimax-m2.7-highspeed": {
    name: "minimax-m2.7-highspeed",
    context: 204800,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "minimax--minimax-m2.7": {
    name: "minimax-m2.7",
    context: 204800,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "minimax--minimax-m2.5-highspeed": {
    name: "minimax-m2.5-highspeed",
    context: 204800,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "minimax--minimax-m2.5": {
    name: "minimax-m2.5",
    context: 204800,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "minimax--minimax-m2.1": {
    name: "minimax-m2.1",
    context: 204800,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "minimax--minimax-m2": {
    name: "minimax-m2",
    context: 204800,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "minimaxai--minimax-m1-80k": {
    name: "minimax-m1-80k",
    context: 128000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "baidu--ernie-4.5-0.3b": {
    name: "ernie-4.5-0.3b",
    context: 120000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "baidu--ernie-4.5-vl-424b-a47b": {
    name: "ernie-4.5-vl-424b-a47b",
    context: 123000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "baidu--ernie-4.5-300b-a47b-paddle": {
    name: "ernie-4.5-300b-a47b-paddle",
    context: 123000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "baidu--ernie-4.5-21b-a3b-thinking": {
    name: "ernie-4.5-21b-a3b-thinking",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
  },
  "baidu--ernie-4.5-21B-a3b": {
    name: "ernie-4.5-21B-a3b",
    context: 120000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "baidu--ernie-4.5-vl-28b-a3b": {
    name: "ernie-4.5-vl-28b-a3b",
    context: 30000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
  },
  "xiaomimimo--mimo-v2-flash": {
    name: "mimo-v2-flash",
    context: 262144,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
  "moonshotai--kimi-k2-thinking": {
    name: "kimi-k2-thinking",
    context: 262144,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
  },
  "moonshotai--kimi-k2-0905": {
    name: "kimi-k2-0905",
    context: 262144,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "moonshotai--kimi-k2.6": {
    name: "kimi-k2.6",
    context: 262144,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "moonshotai--kimi-k2.5": {
    name: "kimi-k2.5",
    context: 262144,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "moonshotai--kimi-k2-instruct": {
    name: "kimi-k2-instruct",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (CNY per million tokens)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  "deepseek--deepseek-v4-flash": { currency: "CNY", input: 1.0, output: 2.0, cache_read: 0.2 },
  "deepseek--deepseek-v4-pro": { currency: "CNY", input: 12.0, output: 24.0, cache_read: 1.0 },
  "deepseek--deepseek-ocr-2": { currency: "CNY", input: 0.216, output: 0.216 },
  "deepseek--deepseek-v3.2": { currency: "CNY", input: 2.0, output: 3.0, cache_read: 0.2 },
  "deepseek--deepseek-v3.2-exp": { currency: "CNY", input: 2.0, output: 3.0 },
  "deepseek--deepseek-v3.1-terminus": {
    currency: "CNY",
    input: 4.0,
    output: 12.0,
    cache_read: 2.0,
  },
  "deepseek--deepseek-v3-0324": { currency: "CNY", input: 2.0, output: 8.0, cache_read: 0.6 },
  "deepseek--deepseek-v3.1": { currency: "CNY", input: 4.0, output: 12.0, cache_read: 2.0 },
  "deepseek--deepseek-prover-v2-671b": { currency: "CNY", input: 4.0, output: 16.0 },
  "deepseek--deepseek-r1-turbo": { currency: "CNY", input: 4.0, output: 16.0 },
  "deepseek--deepseek-r1-0528": { currency: "CNY", input: 4.0, output: 16.0 },
  "deepseek--deepseek-v3-turbo": { currency: "CNY", input: 2.0, output: 8.0 },
  "deepseek--deepseek-v3--community": { currency: "CNY", input: 2.0, output: 8.0 },
  "deepseek--deepseek-r1--community": { currency: "CNY", input: 4.0, output: 16.0 },
  "deepseek--deepseek-r1-distill-llama-70b": { currency: "CNY", input: 5.8, output: 5.8 },
  "qwen--qwen3.6-27b": { currency: "CNY", input: 3, output: 18 },
  "qwen--qwen3-coder-next": { currency: "CNY", input: 1.4, output: 10.5 },
  "qwen--qwen3-omni-30b-a3b-thinking": { currency: "CNY", input: 1.8, output: 1.8 },
  "qwen--qwen3-vl-235b-a22b-thinking": { currency: "CNY", input: 2, output: 20 },
  "qwen--qwen3-vl-235b-a22b-instruct": { currency: "CNY", input: 2, output: 8 },
  "qwen--qwen3-235b-a22b-thinking-2507": { currency: "CNY", input: 2, output: 20 },
  "qwen--qwen3-235b-a22b-instruct-2507": { currency: "CNY", input: 1.45, output: 5.8 },
  "qwen--qwen3-235b-a22b-fp8": { currency: "CNY", input: 1.45, output: 5.8 },
  "qwen--qwen3-32b-fp8": { currency: "CNY", input: 0.72, output: 3.26 },
  "qwen--qwen3-30b-a3b-fp8": { currency: "CNY", input: 0.72, output: 3.26 },
  "qwen--qwen3-next-80b-a3b-instruct": { currency: "CNY", input: 1, output: 4 },
  "qwen--qwen3-next-80b-a3b-thinking": { currency: "CNY", input: 1, output: 10 },
  "qwen--qwen-2.5-72b-instruct": { currency: "CNY", input: 4, output: 12 },
  "qwen--qwen2.5-vl-72b-instruct": { currency: "CNY", input: 4.2, output: 4.2 },
  "qwen--qwen2.5-7b-instruct": { currency: "CNY", input: 0.35, output: 0.35 },
  "qwen--qwen3-vl-8b-instruct": { currency: "CNY", input: 0.5, output: 2 },
  "qwen--qwen3-vl-30b-a3b-thinking": { currency: "CNY", input: 0.75, output: 7.5 },
  "qwen--qwen3-vl-30b-a3b-instruct": { currency: "CNY", input: 0.75, output: 3 },
  "qwen--qwen3-omni-30b-a3b-instruct": { currency: "CNY", input: 1.8, output: 1.8 },
  "qwen--qwen3-4b-fp8": { currency: "CNY", input: 0.2145, output: 0.2145 },
  "zai-org--glm-4.7-flash": { currency: "CNY", input: 0.5, output: 3, cache_read: 0.1 },
  "zai-org--autoglm-phone-9b-multilingual": { currency: "CNY", input: 0.25, output: 1 },
  "zai-org--glm-4.6": { currency: "CNY", input: 4, output: 16, cache_read: 0.8, cache_write: 0.8 },
  "zai-org--glm-4.5v": { currency: "CNY", input: 4, output: 12, cache_read: 0.8 },
  "zai-org--glm-4.5": { currency: "CNY", input: 4, output: 16, cache_read: 0.8 },
  "zai-org--glm-4.5-air": { currency: "CNY", input: 1.2, output: 2, cache_read: 0.24 },
  "minimax--minimax-m2.7-highspeed": {
    currency: "CNY",
    input: 4.2,
    output: 16.8,
    cache_read: 0.42,
    cache_write: 2.625,
  },
  "minimax--minimax-m2.7": {
    currency: "CNY",
    input: 2.1,
    output: 8.4,
    cache_read: 0.42,
    cache_write: 2.625,
  },
  "minimax--minimax-m2.5-highspeed": {
    currency: "CNY",
    input: 4.2,
    output: 16.8,
    cache_read: 0.21,
    cache_write: 2.625,
  },
  "minimax--minimax-m2.5": {
    currency: "CNY",
    input: 2.1,
    output: 8.4,
    cache_read: 0.21,
    cache_write: 2.625,
  },
  "minimax--minimax-m2.1": {
    currency: "CNY",
    input: 2.1,
    output: 8.4,
    cache_read: 0.21,
    cache_write: 2.625,
  },
  "minimax--minimax-m2": {
    currency: "CNY",
    input: 2.1,
    output: 8.4,
    cache_read: 0.21,
    cache_write: 2.625,
  },
  "minimaxai--minimax-m1-80k": { currency: "CNY", input: 4.0, output: 16.0 },
  "baidu--ernie-4.5-0.3b": { unit: "free" },
  "baidu--ernie-4.5-vl-424b-a47b": { currency: "CNY", input: 3.0, output: 9.0 },
  "baidu--ernie-4.5-300b-a47b-paddle": { currency: "CNY", input: 2.0, output: 7.0 },
  "baidu--ernie-4.5-21b-a3b-thinking": { currency: "CNY", input: 0.5, output: 2.0 },
  "baidu--ernie-4.5-21B-a3b": { currency: "CNY", input: 0.5, output: 2.0 },
  "baidu--ernie-4.5-vl-28b-a3b": { currency: "CNY", input: 1.0, output: 4.0 },
  "xiaomimimo--mimo-v2-flash": { currency: "CNY", input: 0.7, output: 2.1, cache_read: 0.07 },
  "moonshotai--kimi-k2-thinking": { currency: "CNY", input: 4, output: 16 },
  "moonshotai--kimi-k2-0905": { currency: "CNY", input: 4, output: 16 },
  "moonshotai--kimi-k2.6": { currency: "CNY", input: 6.5, output: 27, cache_read: 1.1 },
  "moonshotai--kimi-k2.5": { currency: "CNY", input: 4, output: 21, cache_read: 0.7 },
  "moonshotai--kimi-k2-instruct": { currency: "CNY", input: 4, output: 16 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.startsWith("deepseek--")) return "deepseek";
  if (id.startsWith("qwen--")) return "qwen";
  if (id.startsWith("zai-org--")) return "glm";
  if (id.startsWith("minimax--")) return "minimax";
  if (id.startsWith("minimaxai--")) return "minimax";
  if (id.startsWith("baidu--")) return "ernie";
  if (id.startsWith("xiaomimimo--")) return "mimo";
  if (id.startsWith("moonshotai--")) return "kimi";
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
      console.warn(`  ppio: skipping ${id} — no pricing`);
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

  console.log(`  ppio: ${models.length} models`);

  return { provider, models };
}
