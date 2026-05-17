import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Pricing } from "../../types/index";

const provider = defineProvider({
  id: "moark",
  name: "MoArk AI",
  url: "https://moark.ai",
  api_docs: "https://moark.ai/docs",
  apis: {
    openai: "https://api.moark.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party pricing page accessed 2026-05-16)
// Source: https://moark.ai/pricing
//         https://api.moark.ai/v1/models
//
// Pricing format: "¥X/M tokens or ¥Y/call" — we use the per-token rate.
// MoArk bills on "combined input + output tokens", so input = output = listed price.
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context: number;
  output: number;
  modalities: { input: ("text" | "image")[]; output: "text"[] };
  pricePerM: number; // CNY per million tokens (input = output)
  free?: boolean;
  vision?: boolean;
  reasoning?: boolean;
  deprecated?: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  // === DeepSeek series ===
  "DeepSeek-V3": {
    name: "DeepSeek V3",
    context: 65536,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.9,
    deprecated: true,
  },
  "DeepSeek-R1": {
    name: "DeepSeek R1",
    context: 65536,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 2.15,
    reasoning: true,
  },
  "DeepSeek-V3.2": {
    name: "DeepSeek V3.2",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.0,
  },
  "DeepSeek-V3.2-Exp": {
    name: "DeepSeek V3.2 Exp",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.4,
  },
  "DeepSeek-V4-Flash": {
    name: "DeepSeek V4 Flash",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.5,
  },
  "DeepSeek-V4-Pro": {
    name: "DeepSeek V4 Pro",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 8.0,
  },
  "DeepSeek-V3_1": {
    name: "DeepSeek V3.1",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.95,
  },
  "DeepSeek-V3_1-Terminus": {
    name: "DeepSeek V3.1 Terminus",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.95,
  },
  "DeepSeek-R1-Distill-Qwen-32B": {
    name: "DeepSeek R1 Distill Qwen 32B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.18,
    reasoning: true,
  },
  "DeepSeek-R1-Distill-Qwen-14B": {
    name: "DeepSeek R1 Distill Qwen 14B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
    reasoning: true,
  },
  "DeepSeek-R1-Distill-Qwen-7B": {
    name: "DeepSeek R1 Distill Qwen 7B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
    reasoning: true,
  },
  "DeepSeek-R1-Distill-Qwen-1.5B": {
    name: "DeepSeek R1 Distill Qwen 1.5B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
    reasoning: true,
  },
  "DeepSeek-Prover-V2-7B": {
    name: "DeepSeek Prover V2 7B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },

  // === Qwen3 series ===
  "Qwen3-235B-A22B": {
    name: "Qwen3 235B A22B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.6,
  },
  "Qwen3-235B-A22B-Instruct-2507": {
    name: "Qwen3 235B A22B Instruct 2507",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.6,
  },
  "Qwen3-32B": {
    name: "Qwen3 32B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.55,
  },
  "Qwen3-30B-A3B-Instruct-2507": {
    name: "Qwen3 30B A3B Instruct 2507",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.29,
  },
  "Qwen3-14B": {
    name: "Qwen3 14B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.28,
  },
  "Qwen3-8B": {
    name: "Qwen3 8B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },
  "Qwen3-4B": {
    name: "Qwen3 4B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },
  "Qwen3-0.6B": {
    name: "Qwen3 0.6B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },
  "QwQ-32B": {
    name: "QwQ 32B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.55,
    reasoning: true,
  },

  // === Qwen3.5 series ===
  "Qwen3.5-122B-A10B": {
    name: "Qwen3.5 122B A10B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 3.2,
    vision: true,
  },
  "Qwen3.5-27B": {
    name: "Qwen3.5 27B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 1.2,
    vision: true,
  },
  "Qwen3.5-35B-A3B": {
    name: "Qwen3.5 35B A3B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 1.0,
    vision: true,
  },
  "Qwen3.5-9B": {
    name: "Qwen3.5 9B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0.4,
    vision: true,
  },
  "Qwen3.5-27B-Claude-4.6-Opus-Reasoning-Distilled": {
    name: "Qwen3.5 27B Claude Opus Distilled",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.5,
    reasoning: true,
  },

  // === Qwen3.6 series ===
  "Qwen3.6-Max": {
    name: "Qwen3.6 Max",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 28.0,
    vision: true,
  },
  "Qwen3.6-Plus": {
    name: "Qwen3.6 Plus",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 15.0,
    vision: true,
  },
  "Qwen3.6-27B": {
    name: "Qwen3.6 27B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.2,
  },
  "Qwen3.6-35B-A3B": {
    name: "Qwen3.6 35B A3B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.0,
  },

  // === Qwen3 Next/Coder ===
  "Qwen3-Next-80B-A3B-Instruct": {
    name: "Qwen3 Next 80B A3B Instruct",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.4,
  },
  "Qwen3-Next-80B-A3B-Thinking": {
    name: "Qwen3 Next 80B A3B Thinking",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.56,
    reasoning: true,
  },
  "Qwen3-Coder-480B-A35B-Instruct-FP8": {
    name: "Qwen3 Coder 480B A35B FP8",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.8,
  },
  "Qwen3-Coder-Next": {
    name: "Qwen3 Coder Next",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.3,
  },
  "Qwen3-Coder-30B-A3B-Instruct": {
    name: "Qwen3 Coder 30B A3B Instruct",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.3,
  },

  // === Qwen2.5 series ===
  "Qwen2.5-72B-Instruct": {
    name: "Qwen2.5 72B Instruct",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.5,
  },
  "Qwen2.5-32B-Instruct": {
    name: "Qwen2.5 32B Instruct",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.18,
  },
  "Qwen2.5-7B-Instruct": {
    name: "Qwen2.5 7B Instruct",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },

  // === Qwen2 series ===
  "Qwen2-72B-Instruct": {
    name: "Qwen2 72B Instruct",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },
  "Qwen2-7B-Instruct": {
    name: "Qwen2 7B Instruct",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },

  // === Qwen VL series ===
  "Qwen2.5-VL-72B-Instruct": {
    name: "Qwen2.5 VL 72B Instruct",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0,
    free: true,
    vision: true,
  },
  "Qwen2.5-VL-32B-Instruct": {
    name: "Qwen2.5 VL 32B Instruct",
    context: 32768,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0.27,
    vision: true,
  },
  "Qwen2.5-VL-7B-Instruct": {
    name: "Qwen2.5 VL 7B Instruct",
    context: 32768,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0.05,
    vision: true,
  },
  "Qwen3-VL-30B-A3B-Instruct": {
    name: "Qwen3 VL 30B A3B Instruct",
    context: 32768,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0.9,
    vision: true,
  },
  "Qwen3-VL-8B-Instruct": {
    name: "Qwen3 VL 8B Instruct",
    context: 32768,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0.68,
    vision: true,
  },
  "Qwen3-VL-4B-Instruct": {
    name: "Qwen3 VL 4B Instruct",
    context: 32768,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0.5,
    vision: true,
  },

  // === GLM series ===
  "GLM-5.1": {
    name: "GLM 5.1",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 5.0,
  },
  "GLM-5": {
    name: "GLM 5",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 3.0,
  },
  "GLM-5-FP8": {
    name: "GLM 5 FP8",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 4.5,
  },
  "GLM-4.7": {
    name: "GLM 4.7",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 2.2,
  },
  "GLM-4.7-Flash": {
    name: "GLM 4.7 Flash",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },
  "GLM-4_5": {
    name: "GLM 4.5",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.0,
  },
  "GLM-4_5-Air": {
    name: "GLM 4.5 Air",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.86,
  },
  "GLM-4-32B": {
    name: "GLM 4 32B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.27,
  },
  "GLM-4-9B-0414": {
    name: "GLM 4 9B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },
  "glm-4-9b-chat": {
    name: "GLM 4 9B Chat",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },

  // === GLM Vision ===
  "GLM-4.5V": {
    name: "GLM 4.5V",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0.86,
    vision: true,
  },
  "GLM-4.6V": {
    name: "GLM 4.6V",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0.9,
    vision: true,
  },
  "GLM-4.6V-Flash": {
    name: "GLM 4.6V Flash",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0,
    free: true,
    vision: true,
  },
  "GLM-5V-Turbo": {
    name: "GLM 5V Turbo",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 4.5,
    vision: true,
  },

  // === MiniMax series ===
  "MiniMax-M2.7": {
    name: "MiniMax M2.7",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.2,
  },
  "MiniMax-M2.5": {
    name: "MiniMax M2.5",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.2,
  },
  "MiniMax-M2.1": {
    name: "MiniMax M2.1",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.2,
  },

  // === Kimi series ===
  "Kimi-K2.6": {
    name: "Kimi K2.6",
    context: 262144,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 3.9,
    vision: true,
    reasoning: true,
  },
  "Kimi-K2.5": {
    name: "Kimi K2.5",
    context: 262144,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 3.0,
    vision: true,
    reasoning: true,
  },
  "Kimi-K2-Thinking": {
    name: "Kimi K2 Thinking",
    context: 262144,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 2.5,
    reasoning: true,
  },
  "kimi-k2-instruct": {
    name: "Kimi K2 Instruct",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 2.29,
  },

  // === ERNIE series ===
  "ERNIE-4.5-Turbo": {
    name: "ERNIE 4.5 Turbo",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.1,
  },
  "ERNIE-X1-Turbo": {
    name: "ERNIE X1 Turbo",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.1,
  },
  "ERNIE-4.5-Turbo-VL": {
    name: "ERNIE 4.5 Turbo VL",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 1.2,
    vision: true,
  },

  // === Gemma ===
  "gemma-4-26B-A4B-it": {
    name: "Gemma 4 26B A4B IT",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 1.0,
    vision: true,
  },
  "gemma-3-27b-it": {
    name: "Gemma 3 27B IT",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0,
    free: true,
    vision: true,
  },

  // === gpt-oss ===
  "gpt-oss-120b": {
    name: "GPT OSS 120B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.45,
  },
  "gpt-oss-20b": {
    name: "GPT OSS 20B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },

  // === InternLM ===
  "internlm3-8b-instruct": {
    name: "InternLM3 8B Instruct",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },

  // === KAT ===
  "KAT-Dev": {
    name: "KAT Dev",
    context: 131072,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.75,
  },

  // === InternVL ===
  "InternVL3-78B": {
    name: "InternVL3 78B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0,
    free: true,
    vision: true,
  },
  "InternVL3-38B": {
    name: "InternVL3 38B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0,
    free: true,
    vision: true,
  },
  "InternVL2.5-78B": {
    name: "InternVL2.5 78B",
    context: 131072,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0,
    free: true,
    vision: true,
  },
  "InternVL2.5-26B": {
    name: "InternVL2.5 26B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0,
    free: true,
    vision: true,
  },
  "InternVL2-8B": {
    name: "InternVL2 8B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0,
    free: true,
    vision: true,
  },

  // === Industry AI ===
  "Baichuan-M2-32B": {
    name: "Baichuan M2 32B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.36,
  },
  "Hunyuan-MT-Chimera-7B": {
    name: "Hunyuan MT Chimera 7B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.3,
  },
  "Lingshu-32B": {
    name: "Lingshu 32B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.3,
  },
  "LegalOne-8B": {
    name: "LegalOne 8B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.375,
  },
  "Sinong1.0-32B": {
    name: "Sinong 1.0 32B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.375,
  },
  "HY-MT1.5-7B": {
    name: "HY MT1.5 7B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0.3,
  },
  "Fin-R1": {
    name: "Fin R1",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.5,
    reasoning: true,
  },
  "DianJin-R1-32B": {
    name: "DianJin R1 32B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 1.5,
    reasoning: true,
  },
  "medgemma-4b-it": {
    name: "MedGemma 4B IT",
    context: 32768,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 2.0,
    vision: true,
  },

  // === Other ===
  "MAI-UI-8B": {
    name: "MAI UI 8B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0.5,
    vision: true,
  },
  "AutoGLM-Phone-9B-Multilingual": {
    name: "AutoGLM Phone 9B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text", "image"], output: ["text"] },
    pricePerM: 0.5,
    vision: true,
  },
  "codegeex4-all-9b": {
    name: "CodeGeeX4 9B",
    context: 32768,
    output: 8192,
    modalities: { input: ["text"], output: ["text"] },
    pricePerM: 0,
    free: true,
  },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  if (lower.startsWith("deepseek-r1")) return "deepseek-r1";
  if (lower.startsWith("deepseek-v4")) return "deepseek-v4";
  if (lower.startsWith("deepseek-v3")) return "deepseek-v3";
  if (lower.startsWith("deepseek-prover")) return "deepseek-prover";
  if (lower.startsWith("qwen3.6")) return "qwen3.6";
  if (lower.startsWith("qwen3.5")) return "qwen3.5";
  if (lower.startsWith("qwen3-coder")) return "qwen3-coder";
  if (lower.startsWith("qwen3-next")) return "qwen3-next";
  if (lower.startsWith("qwen3-vl")) return "qwen3-vl";
  if (lower.startsWith("qwen3")) return "qwen3";
  if (lower.startsWith("qwen2.5-vl")) return "qwen2.5-vl";
  if (lower.startsWith("qwen2.5")) return "qwen2.5";
  if (lower.startsWith("qwen2")) return "qwen2";
  if (lower.startsWith("qwq")) return "qwq";
  if (lower.startsWith("glm-5v")) return "glm-5v";
  if (lower.startsWith("glm-5")) return "glm-5";
  if (lower.startsWith("glm-4.7")) return "glm-4.7";
  if (lower.startsWith("glm-4.6v")) return "glm-4.6v";
  if (lower.startsWith("glm-4.5v")) return "glm-4.5v";
  if (lower.startsWith("glm-4_5")) return "glm-4.5";
  if (lower.startsWith("glm-4")) return "glm-4";
  if (lower.startsWith("minimax")) return "minimax";
  if (lower.startsWith("kimi")) return "kimi";
  if (lower.startsWith("ernie")) return "ernie";
  if (lower.startsWith("gemma")) return "gemma";
  if (lower.startsWith("gpt-oss")) return "gpt-oss";
  if (lower.startsWith("internlm")) return "internlm";
  if (lower.startsWith("internvl")) return "internvl";
  if (lower.startsWith("kat")) return "kat";
  if (lower.startsWith("baichuan")) return "baichuan";
  if (lower.startsWith("fin-r1")) return "fin-r1";
  if (lower.startsWith("dianjin")) return "dianjin";
  return "other";
}

// ---------------------------------------------------------------------------
// Model ID flattening
// ---------------------------------------------------------------------------

function flattenId(id: string): string {
  return id
    .replace(/\//g, "--")
    .replace(/:/g, "--")
    .replace(/@/g, "--")
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .toLowerCase();
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
  const models = [];

  for (const [id, info] of Object.entries(MODELS)) {
    const flatId = flattenId(id);
    const pricing: Pricing = info.free
      ? { unit: "free" }
      : { currency: "CNY", input: info.pricePerM, output: info.pricePerM };

    models.push(
      defineModel({
        id: flatId,
        name: info.name,
        family: deriveFamily(id),
        temperature: true,
        ...(info.reasoning ? { reasoning: true } : {}),
        limit: { context: info.context, output: info.output },
        modalities: info.modalities,
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  console.log(`  MoArk AI: ${models.length} models`);

  return { provider, models };
}
