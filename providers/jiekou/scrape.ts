import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "jiekou",
  name: "接口 AI",
  url: "https://jiekou.ai",
  api_docs: "https://jiekou.ai/docs",
  apis: {
    openai: "https://api.jiekou.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: https://jiekou.ai pricing page (SSR HTML, RWP format, first-party data)
// - Context lengths: Jiekou pricing data (context_size field)
// - Model IDs: Jiekou linkPath field
//
// 接口 AI is a Chinese inference platform hosting 70+ frontier models
// with per-token CNY pricing. All models include cache_read pricing
// where available.
//
// Pricing shown is CNY per million tokens.
// "-dd" suffix = dedicated deployment variant (Jiekou-specific).
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
  "claude-opus-4-7": {
    name: "claude-opus-4-7 on Jiekou",
    context: 1000000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "claude-opus-4-6": {
    name: "claude-opus-4-6 on Jiekou",
    context: 1000000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "claude-opus-4-6-dd": {
    name: "claude-opus-4-6-dd on Jiekou",
    context: 1000000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "claude-sonnet-4-6": {
    name: "claude-sonnet-4-6 on Jiekou",
    context: 1000000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "claude-sonnet-4-6-dd": {
    name: "claude-sonnet-4-6-dd on Jiekou",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gemini-3.1-flash-lite-preview": {
    name: "gemini-3.1-flash-lite-preview on Jiekou",
    context: 1048576,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gemini-3.1-pro-preview": {
    name: "gemini-3.1-pro-preview on Jiekou",
    context: 1048576,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gemini-3-flash-preview": {
    name: "gemini-3-flash-preview on Jiekou",
    context: 1048576,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gemini-2.5-flash-lite": {
    name: "gemini-2.5-flash-lite on Jiekou",
    context: 1048576,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gemini-2.5-pro": {
    name: "gemini-2.5-pro on Jiekou",
    context: 1048576,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gemini-2.5-flash": {
    name: "gemini-2.5-flash on Jiekou",
    context: 1048576,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gemini-2.0-flash-lite": {
    name: "gemini-2.0-flash-lite on Jiekou",
    context: 1048576,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "google-gemma-3-12b-it": {
    name: "google-gemma-3-12b-it on Jiekou",
    context: 32768,
    output: 8192,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
    openWeights: true,
  },
  "gpt-5.5-pro": {
    name: "gpt-5.5-pro on Jiekou",
    context: 1050000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.5-light": {
    name: "gpt-5.5-light on Jiekou",
    context: 1050000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.5": {
    name: "gpt-5.5 on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.4-nano": {
    name: "gpt-5.4-nano on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.4-pro": {
    name: "gpt-5.4-pro on Jiekou",
    context: 1050000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.4": {
    name: "gpt-5.4 on Jiekou",
    context: 128000,
    output: 8192,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.3-chat-latest": {
    name: "gpt-5.3-chat-latest on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.3-codex": {
    name: "gpt-5.3-codex on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.2-codex": {
    name: "gpt-5.2-codex on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.2-pro": {
    name: "gpt-5.2-pro on Jiekou",
    context: 128000,
    output: 8192,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.2-chat-latest": {
    name: "gpt-5.2-chat-latest on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.1-codex-max": {
    name: "gpt-5.1-codex-max on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.1-codex-mini": {
    name: "gpt-5.1-codex-mini on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.1-codex": {
    name: "gpt-5.1-codex on Jiekou",
    context: 128000,
    output: 8192,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5.1-chat-latest": {
    name: "gpt-5.1-chat-latest on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5-pro": {
    name: "gpt-5-pro on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5-codex": {
    name: "gpt-5-codex on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5-nano": {
    name: "gpt-5-nano on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-5-mini": {
    name: "gpt-5-mini on Jiekou",
    context: 400000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "openai-gpt-oss-20b": {
    name: "openai-gpt-oss-20b on Jiekou",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "openai-gpt-oss-120b": {
    name: "openai-gpt-oss-120b on Jiekou",
    context: 1047576,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-4.1-mini": {
    name: "gpt-4.1-mini on Jiekou",
    context: 1047576,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-4.1": {
    name: "gpt-4.1 on Jiekou",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  o3: {
    name: "o3 on Jiekou",
    context: 200000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "o3-mini": {
    name: "o3-mini on Jiekou",
    context: 128000,
    output: 8192,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "gpt-4o": {
    name: "gpt-4o on Jiekou",
    context: 2000000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "grok-4.20-0309-reasoning": {
    name: "grok-4.20-0309-reasoning on Jiekou",
    context: 2000000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "grok-4.20-0309-non-reasoning": {
    name: "grok-4.20-0309-non-reasoning on Jiekou",
    context: 2000000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "grok-4-1-fast-reasoning": {
    name: "grok-4-1-fast-reasoning on Jiekou",
    context: 2000000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "grok-4-1-fast-non-reasoning": {
    name: "grok-4-1-fast-non-reasoning on Jiekou",
    context: 256000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "grok-code-fast-1": {
    name: "grok-code-fast-1 on Jiekou",
    context: 2000000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "grok-4-fast-reasoning": {
    name: "grok-4-fast-reasoning on Jiekou",
    context: 2000000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "grok-4-fast-non-reasoning": {
    name: "grok-4-fast-non-reasoning on Jiekou",
    context: 256000,
    output: 16384,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "grok-4-0709": {
    name: "grok-4-0709 on Jiekou",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "grok-3": {
    name: "grok-3 on Jiekou",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "minimax-minimax-m2.1": {
    name: "minimax-minimax-m2.1 on Jiekou",
    context: 1000000,
    output: 16384,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "minimaxai-minimax-m1-80k": {
    name: "minimaxai-minimax-m1-80k on Jiekou",
    context: 204800,
    output: 16384,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "zai-org-glm-4.7-flash": {
    name: "zai-org-glm-4.7-flash on Jiekou",
    context: 204800,
    output: 16384,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "zai-org-glm-4.7": {
    name: "zai-org-glm-4.7 on Jiekou",
    context: 65536,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "zai-org-glm-4.5v": {
    name: "zai-org-glm-4.5v on Jiekou",
    context: 131072,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "zai-org-glm-4.5": {
    name: "zai-org-glm-4.5 on Jiekou",
    context: 262144,
    output: 16384,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "moonshotai-kimi-k2.5": {
    name: "moonshotai-kimi-k2.5 on Jiekou",
    context: 262144,
    output: 16384,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
    openWeights: true,
  },
  "moonshotai-kimi-k2-0905": {
    name: "moonshotai-kimi-k2-0905 on Jiekou",
    context: 131072,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
    openWeights: true,
  },
  "moonshotai-kimi-k2-instruct": {
    name: "moonshotai-kimi-k2-instruct on Jiekou",
    context: 256000,
    output: 16384,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
    openWeights: true,
  },
  "doubao-seed-1-8-251228": {
    name: "doubao-seed-1-8-251228 on Jiekou",
    context: 128000,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "doubao-1-5-pro-32k-250115": {
    name: "doubao-1-5-pro-32k-250115 on Jiekou",
    context: 200000,
    output: 16384,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "doubao-1.5-pro-32k-character-250715": {
    name: "doubao-1.5-pro-32k-character-250715 on Jiekou",
    context: 262144,
    output: 16384,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "qwen-qwen3-coder-next": {
    name: "qwen-qwen3-coder-next on Jiekou",
    context: 65536,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "qwen-qwen3-next-80b-a3b-instruct": {
    name: "qwen-qwen3-next-80b-a3b-instruct on Jiekou",
    context: 65536,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "qwen-qwen3-235b-a22b-thinking-2507": {
    name: "qwen-qwen3-235b-a22b-thinking-2507 on Jiekou",
    context: 262144,
    output: 16384,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "qwen-qwen3-coder-480b-a35b-instruct": {
    name: "qwen-qwen3-coder-480b-a35b-instruct on Jiekou",
    context: 131072,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "qwen-qwen3-235b-a22b-instruct-2507": {
    name: "qwen-qwen3-235b-a22b-instruct-2507 on Jiekou",
    context: 40960,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "qwen-qwen2.5-vl-72b-instruct": {
    name: "qwen-qwen2.5-vl-72b-instruct on Jiekou",
    context: 32000,
    output: 8000,
    inputModalities: ["text", "image"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "qwen-qwen-2.5-72b-instruct": {
    name: "qwen-qwen-2.5-72b-instruct on Jiekou",
    context: 123000,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "baidu-ernie-4.5-vl-424b-a47b": {
    name: "baidu-ernie-4.5-vl-424b-a47b on Jiekou",
    context: 123000,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "baidu-ernie-4.5-300b-a47b-paddle": {
    name: "baidu-ernie-4.5-300b-a47b-paddle on Jiekou",
    context: 1048576,
    output: 16384,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
  },
  "meta-llama-llama-4-maverick-17b-128e-instruct-fp8": {
    name: "meta-llama-llama-4-maverick-17b-128e-instruct-fp8 on Jiekou",
    context: 131072,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama-llama-4-scout-17b-16e-instruct": {
    name: "meta-llama-llama-4-scout-17b-16e-instruct on Jiekou",
    context: 131072,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama-llama-3.3-70b-instruct": {
    name: "meta-llama-llama-3.3-70b-instruct on Jiekou",
    context: 32768,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
    openWeights: true,
  },
  "mistralai-mistral-nemo": {
    name: "mistralai-mistral-nemo on Jiekou",
    context: 32768,
    output: 8192,
    inputModalities: ["text"] as ModelModality[],
    outputModalities: ["text"] as ModelModality[],
    toolCall: true,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (CNY per million tokens)
//
// Source: SSR HTML from jiekou.ai pricing page (first-party data, 2026-05-16)
// cache_read pricing included where available.
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  "claude-opus-4-7": { currency: "CNY", input: 4.75, output: 23.75, cache_read: 0.475 },
  "claude-opus-4-6": { currency: "CNY", input: 2.75, output: 13.75, cache_read: 0.475 },
  "claude-opus-4-6-dd": { currency: "CNY", input: 2.85, output: 14.25, cache_read: 0.275 },
  "claude-sonnet-4-6": { currency: "CNY", input: 1.65, output: 8.25, cache_read: 0.285 },
  "claude-sonnet-4-6-dd": { currency: "CNY", input: 4.75, output: 23.75, cache_read: 0.165 },
  "gemini-3.1-flash-lite-preview": {
    currency: "CNY",
    input: 1.9,
    output: 11.4,
    cache_read: 0.0237,
  },
  "gemini-3.1-pro-preview": { currency: "CNY", input: 0.475, output: 2.85, cache_read: 0.19 },
  "gemini-3-flash-preview": { currency: "CNY", input: 0.095, output: 0.38, cache_read: 0.0475 },
  "gemini-2.5-flash-lite": { currency: "CNY", input: 1.1875, output: 9.5, cache_read: 0.0095 },
  "gemini-2.5-pro": { currency: "CNY", input: 0.285, output: 2.375, cache_read: 0.1187 },
  "gemini-2.5-flash": { currency: "CNY", input: 0.095, output: 0.38, cache_read: 0.0285 },
  "gemini-2.0-flash-lite": { currency: "CNY", input: 0.1425, output: 0.57 },
  "google-gemma-3-12b-it": { currency: "CNY", input: 0.119, output: 0.2 },
  "gpt-5.5-pro": { currency: "CNY", input: 0.25, output: 1.5 },
  "gpt-5.5-light": { currency: "CNY", input: 5.0, output: 30.0, cache_read: 0.025 },
  "gpt-5.5": { currency: "CNY", input: 0.19, output: 1.1875, cache_read: 0.5 },
  "gpt-5.4-nano": { currency: "CNY", input: 0.7125, output: 4.275, cache_read: 0.019 },
  "gpt-5.4-pro": { currency: "CNY", input: 2.375, output: 14.25 },
  "gpt-5.4": { currency: "CNY", input: 1.6625, output: 13.3, cache_read: 0.2375 },
  "gpt-5.3-chat-latest": { currency: "CNY", input: 1.6625, output: 13.3, cache_read: 0.1662 },
  "gpt-5.3-codex": { currency: "CNY", input: 1.75, output: 14.0, cache_read: 0.1662 },
  "gpt-5.2-codex": { currency: "CNY", input: 1.6625, output: 13.3, cache_read: 0.175 },
  "gpt-5.2-pro": { currency: "CNY", input: 1.6625, output: 13.3 },
  "gpt-5.2-chat-latest": { currency: "CNY", input: 1.1875, output: 9.5, cache_read: 0.1662 },
  "gpt-5.1-codex-max": { currency: "CNY", input: 0.2375, output: 1.9, cache_read: 0.1187 },
  "gpt-5.1-codex-mini": { currency: "CNY", input: 1.1875, output: 9.5, cache_read: 0.0237 },
  "gpt-5.1-codex": { currency: "CNY", input: 1.1875, output: 9.5, cache_read: 0.1187 },
  "gpt-5.1-chat-latest": { currency: "CNY", input: 1.1875, output: 9.5, cache_read: 0.1187 },
  "gpt-5-pro": { currency: "CNY", input: 1.1875, output: 9.5 },
  "gpt-5-codex": { currency: "CNY", input: 1.1875, output: 9.5, cache_read: 0.1187 },
  "gpt-5-nano": { currency: "CNY", input: 0.2375, output: 1.9, cache_read: 0.0047 },
  "gpt-5-mini": { currency: "CNY", input: 1.1875, output: 9.5, cache_read: 0.0237 },
  "openai-gpt-oss-20b": { currency: "CNY", input: 0.1, output: 0.5 },
  "openai-gpt-oss-120b": { currency: "CNY", input: 0.4, output: 1.6 },
  "gpt-4.1-mini": { currency: "CNY", input: 0.1, output: 0.4, cache_read: 0.1 },
  "gpt-4.1": { currency: "CNY", input: 9.5, output: 38.0, cache_read: 0.5 },
  o3: { currency: "CNY", input: 1.045, output: 4.18, cache_read: 0.475 },
  "o3-mini": { currency: "CNY", input: 1.045, output: 4.18, cache_read: 0.5225 },
  "gpt-4o": { currency: "CNY", input: 1.9, output: 5.7, cache_read: 1.1875 },
  "grok-4.20-0309-reasoning": { currency: "CNY", input: 1.9, output: 5.7 },
  "grok-4.20-0309-non-reasoning": { currency: "CNY", input: 0.19, output: 0.475 },
  "grok-4-1-fast-reasoning": { currency: "CNY", input: 0.19, output: 0.475 },
  "grok-4-1-fast-non-reasoning": { currency: "CNY", input: 0.19, output: 1.425 },
  "grok-code-fast-1": { currency: "CNY", input: 0.19, output: 0.475, cache_read: 0.019 },
  "grok-4-fast-reasoning": { currency: "CNY", input: 0.19, output: 0.475 },
  "grok-4-fast-non-reasoning": { currency: "CNY", input: 2.85, output: 14.25 },
  "grok-4-0709": { currency: "CNY", input: 2.85, output: 14.25 },
  "grok-3": { currency: "CNY", input: 0.285, output: 0.475 },
  "minimax-minimax-m2.1": { currency: "CNY", input: 0.55, output: 2.2, cache_read: 0.03 },
  "minimaxai-minimax-m1-80k": { currency: "CNY", input: 1.0, output: 3.2 },
  "zai-org-glm-4.7-flash": { currency: "CNY", input: 0.6, output: 2.2, cache_read: 0.01 },
  "zai-org-glm-4.7": { currency: "CNY", input: 0.6, output: 1.8 },
  "zai-org-glm-4.5v": { currency: "CNY", input: 0.6, output: 2.2 },
  "zai-org-glm-4.5": { currency: "CNY", input: 0.6, output: 3.0 },
  "moonshotai-kimi-k2.5": { currency: "CNY", input: 0.6, output: 2.5, cache_read: 0.1 },
  "moonshotai-kimi-k2-0905": { currency: "CNY", input: 0.57, output: 2.3 },
  "moonshotai-kimi-k2-instruct": { currency: "CNY", input: 0.1103, output: 1.1034 },
  "doubao-seed-1-8-251228": { currency: "CNY", input: 0.11, output: 0.275, cache_read: 0.0221 },
  "doubao-1-5-pro-32k-250115": { currency: "CNY", input: 0.11, output: 0.275 },
  "doubao-1.5-pro-32k-character-250715": { currency: "CNY", input: 0.2, output: 1.5 },
  "qwen-qwen3-coder-next": { currency: "CNY", input: 0.15, output: 1.5 },
  "qwen-qwen3-next-80b-a3b-instruct": { currency: "CNY", input: 0.15, output: 1.5 },
  "qwen-qwen3-235b-a22b-thinking-2507": { currency: "CNY", input: 0.29, output: 1.2 },
  "qwen-qwen3-coder-480b-a35b-instruct": { currency: "CNY", input: 0.15, output: 0.8 },
  "qwen-qwen3-235b-a22b-instruct-2507": { currency: "CNY", input: 0.09, output: 0.45 },
  "qwen-qwen2.5-vl-72b-instruct": { currency: "CNY", input: 0.38, output: 0.4 },
  "qwen-qwen-2.5-72b-instruct": { currency: "CNY", input: 0.42, output: 1.25 },
  "baidu-ernie-4.5-vl-424b-a47b": { currency: "CNY", input: 0.28, output: 1.1 },
  "baidu-ernie-4.5-300b-a47b-paddle": { currency: "CNY", input: 0.17, output: 0.85 },
  "meta-llama-llama-4-maverick-17b-128e-instruct-fp8": { currency: "CNY", input: 0.1, output: 0.5 },
  "meta-llama-llama-4-scout-17b-16e-instruct": { currency: "CNY", input: 0.13, output: 0.39 },
  "meta-llama-llama-3.3-70b-instruct": { currency: "CNY", input: 0.03, output: 0.05 },
  "mistralai-mistral-nemo": { currency: "CNY", input: 0.029, output: 0.059 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.startsWith("claude")) return "claude";
  if (id.startsWith("gpt") || id.startsWith("o1") || id.startsWith("o3") || id.startsWith("openai"))
    return "gpt";
  if (id.startsWith("gemini")) return "gemini";
  if (id.startsWith("gemma")) return "gemma";
  if (id.startsWith("deepseek")) return "deepseek";
  if (id.startsWith("qwen")) return "qwen";
  if (id.startsWith("llama") || id.startsWith("meta")) return "llama";
  if (id.startsWith("mistral")) return "mistral";
  if (id.startsWith("grok")) return "grok";
  if (id.startsWith("kimi") || id.startsWith("moonshotai")) return "kimi";
  if (id.startsWith("glm") || id.startsWith("zai")) return "glm";
  if (id.startsWith("mimo") || id.startsWith("xiaomimimo")) return "mimo";
  if (id.startsWith("minimax")) return "minimax";
  if (id.startsWith("doubao")) return "doubao";
  if (id.startsWith("ernie") || id.startsWith("baidu")) return "ernie";
  return id.split("-")[0] as string;
}

// ---------------------------------------------------------------------------
// Date helper
// ---------------------------------------------------------------------------

function getCurrentDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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
      console.warn(`  Jiekou: skipping ${id} — no pricing`);
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

  console.log(`  Jiekou: ${models.length} models`);

  return { provider, models };
}
