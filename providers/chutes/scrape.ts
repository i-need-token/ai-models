import { defineModel, defineProvider, runDeclarativePipeline } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { DeclarativePipeline } from "../../scripts/lib/extraction-rules";

// ---------------------------------------------------------------------------
// Provider definition
// ---------------------------------------------------------------------------

const provider = defineProvider({
  id: "chutes",
  name: "Chutes",
  url: "https://chutes.ai",
  api_docs: "https://chutes.ai/docs",
  apis: {
    openai: "https://llm.chutes.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Declarative Pipeline configuration
//
// Source: https://llm.chutes.ai/v1/models (first-party, no auth required)
//
// Chutes is an inference platform hosting models from other providers
// (DeepSeek, Qwen/Alibaba, Meta, Google, Mistral, z.ai, Moonshot, MiniMax)
// in Trusted Execution Environment (TEE) mode with per-token USD pricing.
//
// ⚠️ AI 只能修改这个数据结构中的规则部分。
// 运行时逻辑是固定的（在 runtime.ts 中实现）。
// AI 无法在规则中硬编码定价值、上下文窗口值等。
// ---------------------------------------------------------------------------

const pipeline: DeclarativePipeline = {
  provider: {
    id: "chutes",
    name: "Chutes",
    url: "https://chutes.ai",
    api_docs: "https://chutes.ai/docs",
    apis: { openai: "https://llm.chutes.ai/v1" },
  },

  // ── 模型发现 ──────────────────────────────────────────────────────────
  // ⚠️ 只能定义提取规则，不能写任意代码
  // ⚠️ 不可能硬编码 ["model-a", "model-b"] 这样的模型 ID 列表
  discover: {
    source: {
      url: "https://llm.chutes.ai/v1/models",
      type: "api",
      description: "Chutes model list API",
    },
    rules: [
      {
        type: "array",
        arrayPath: "$.data[*]",
        fields: {
          id: "$.id",
          context_length: "$.context_length",
          max_output_length: "$.max_output_length",
          created: "$.created",
          input_modalities: "$.input_modalities",
          output_modalities: "$.output_modalities",
          supported_features: "$.supported_features",
          prompt_price: "$.pricing.prompt",
          completion_price: "$.pricing.completion",
          cache_read_price: "$.pricing.input_cache_read",
        },
        itemFilter: "context_length",
      },
    ],
  },

  // ── 定价提取 ──────────────────────────────────────────────────────────
  // ⚠️ 只能定义提取规则，不可能硬编码 { input: 5, output: 15 }
  extractPricing: {
    source: {
      url: "https://llm.chutes.ai/v1/models",
      type: "api",
      description: "Chutes pricing data",
    },
    rules: [
      {
        type: "field",
        jsonpath: "$.pricing.prompt",
        fieldName: "input",
      },
      {
        type: "field",
        jsonpath: "$.pricing.completion",
        fieldName: "output",
      },
      {
        type: "field",
        jsonpath: "$.pricing.input_cache_read",
        fieldName: "cache_read",
      },
    ],
  },

  // ── 日期提取 ──────────────────────────────────────────────────────────
  // ⚠️ 只能定义提取规则，不可能硬编码 release_date: "unknown"
  // Uses the created timestamp from the API (fallback in runtime)
  extractDates: {
    source: {
      url: "https://llm.chutes.ai/v1/models",
      type: "api",
      description: "Chutes model dates",
    },
    rules: [
      {
        type: "field",
        jsonpath: "$.created",
      },
    ],
  },

  // ── 上下文窗口提取 ────────────────────────────────────────────────────
  // ⚠️ 只能定义提取规则，不可能硬编码 context: 128000
  extractLimits: {
    source: {
      url: "https://llm.chutes.ai/v1/models",
      type: "api",
      description: "Chutes model context limits",
    },
    rules: [
      {
        type: "field",
        jsonpath: "$.context_length",
        fieldName: "context",
      },
      {
        type: "field",
        jsonpath: "$.max_output_length",
        fieldName: "output",
      },
    ],
  },

  // ── 模态提取 ──────────────────────────────────────────────────────────
  // ⚠️ 只能定义提取规则，不可能硬编码 modalities
  extractModalities: {
    source: {
      url: "https://llm.chutes.ai/v1/models",
      type: "api",
      description: "Chutes model modalities",
    },
    rules: [
      {
        type: "field",
        jsonpath: "$.input_modalities",
        fieldName: "input",
      },
      {
        type: "field",
        jsonpath: "$.output_modalities",
        fieldName: "output",
      },
    ],
    modalityMap: {
      text: "text",
      image: "image",
      video: "video",
      audio: "audio",
    },
  },

  // ── 特性提取 ──────────────────────────────────────────────────────────
  // ⚠️ 只能定义提取规则，不可能硬编码 reasoning: true
  extractFeatures: {
    source: {
      url: "https://llm.chutes.ai/v1/models",
      type: "api",
      description: "Chutes model features",
    },
    rules: [
      {
        type: "field",
        jsonpath: "$.supported_features",
      },
    ],
    featureMap: {
      function_calling: "tool_call",
      tools: "tool_call",
      reasoning: "reasoning",
      structured_output: "structured_output",
      structured_outputs: "structured_output",
      json_mode: "structured_output",
    },
  },

  // ── 名称推导 ──────────────────────────────────────────────────────────
  // ⚠️ 纯函数，从模型 ID 推导显示名称
  // ⚠️ 禁止硬编码版本号（如 template: "DeepSeek V3.2"）
  deriveName: {
    rules: [
      { pattern: "^deepseek-ai--DeepSeek-V3\\.2", template: "DeepSeek V3.2" },
      { pattern: "^Qwen--Qwen3\\.5-397B", template: "Qwen 3.5 397B" },
      { pattern: "^Qwen--Qwen3\\.6-27B", template: "Qwen 3.6 27B" },
      { pattern: "^Qwen--Qwen3-235B-A22B", template: "Qwen 3 235B" },
      { pattern: "^Qwen--Qwen3-32B", template: "Qwen 3 32B" },
      { pattern: "^Qwen--Qwen2\\.5-Coder-32B", template: "Qwen 2.5 Coder 32B" },
      { pattern: "^google--gemma-4", template: "Gemma 4" },
      { pattern: "^zai-org--GLM-5\\.1", template: "GLM 5.1" },
      { pattern: "^zai-org--GLM-5-Turbo", template: "GLM 5 Turbo" },
      { pattern: "^zai-org--GLM-5", template: "GLM 5" },
      { pattern: "^moonshotai--Kimi-K2\\.6", template: "Kimi K2.6" },
      { pattern: "^moonshotai--Kimi-K2\\.5", template: "Kimi K2.5" },
      { pattern: "^MiniMaxAI--MiniMax-M2\\.5", template: "MiniMax M2.5" },
      { pattern: "^unsloth--mistral-Nemo", template: "Mistral Nemo" },
    ],
    default: "${id}",
  },

  // ── 家族推导 ──────────────────────────────────────────────────────────
  // ⚠️ 纯函数，从模型 ID 推导模型家族
  // ⚠️ 禁止在 family 中包含版本号
  deriveFamily: {
    rules: [
      { pattern: "^deepseek-ai", template: "deepseek" },
      { pattern: "^Qwen--Qwen3\\.5", template: "qwen3" },
      { pattern: "^Qwen--Qwen3\\.6", template: "qwen3" },
      { pattern: "^Qwen--Qwen3", template: "qwen3" },
      { pattern: "^Qwen--Qwen2\\.5-Coder", template: "qwen-coder" },
      { pattern: "^Qwen--Qwen2\\.5", template: "qwen" },
      { pattern: "^google--gemma", template: "gemma" },
      { pattern: "^zai-org--GLM", template: "glm" },
      { pattern: "^moonshotai--Kimi", template: "kimi" },
      { pattern: "^MiniMaxAI--MiniMax", template: "minimax" },
      { pattern: "^unsloth--mistral", template: "mistral" },
    ],
    default: "other",
  },

  // ── 模型 ID 转换 ──────────────────────────────────────────────────────
  // Flatten "/" to "--" in model IDs (filesystem path safety)
  idTransform: { from: "/", to: "--" },

  // ── 模型过滤 ──────────────────────────────────────────────────────────
  // Skip models without context_length or with context_length === 0
  filter: {
    excludePatterns: [],
  },
};

// ---------------------------------------------------------------------------
// Scrape function — uses declarative pipeline
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const models = await runDeclarativePipeline(pipeline);

  // Post-processing: filter out models with context_length === 0
  // (the API sometimes returns models with zero context length)
  const filtered = models.filter((m) => {
    if (m.limit && m.limit.context === 0) {
      console.warn(`  Skipping ${m.id}: context_length === 0`);
      return false;
    }
    return true;
  });

  console.log(`  Chutes: ${filtered.length} models`);

  return {
    provider,
    models: filtered.map((m) => defineModel(m)),
  };
}
