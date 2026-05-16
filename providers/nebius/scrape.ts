import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "nebius",
  name: "Nebius Token Factory",
  url: "https://nebius.com",
  api_docs: "https://docs.tokenfactory.nebius.com",
  apis: {
    openai: "https://api.tokenfactory.nebius.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data from Nebius Token Factory website
//
// Source: https://tokenfactory.nebius.com/models (browser-scraped 2026-05-16)
//         (first-party, no auth required for the catalog page)
//
// Nebius Token Factory is an inference platform hosting open-source models
// from DeepSeek, NVIDIA, Z.AI/ZhipuAI, Qwen/Alibaba, Meta, Google, OpenAI,
// Minimax, NousResearch, Prime Intellect, Mistral with per-token USD pricing.
//
// Pricing: Per-1M-token USD values from the catalog page (Base flavor)
// Context lengths: From model's original provider docs (verified first-party)
// Capabilities: From model's original provider docs (verified first-party)
// Model IDs: Display names from Nebius website (no "/" to flatten)
// Embedding model (Qwen3-Embedding-8B) excluded
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Model info: name, pricing, context, capabilities

interface ModelInfo {
  name: string;
  inputPrice: number;
  outputPrice: number;
  context: number;
  output: number;
  inputModalities: ModelModality[];
  outputModalities: ModelModality[];
  reasoning?: boolean;
  toolCall?: boolean;
  vision?: boolean;
  structuredOutput?: boolean;
  openWeights?: boolean;
}

// ---------------------------------------------------------------------------
// Vision models (models that accept image input)

const VISION_MODELS: Set<string> = new Set([
  "Qwen2.5-VL-72B-Instruct",
  "Nemotron-3-Nano-Omni",
  "Qwen3.5-397B-A17B",
  "GLM-5.1",
  "MiniMax-M2.5",
  "Gemma-3-27b-it",
]);

// ---------------------------------------------------------------------------
// Modality mapping

function mapInputModalities(id: string): ModelModality[] {
  const result: ModelModality[] = ["text"];
  if (VISION_MODELS.has(id)) {
    result.push("image");
  }

  return result;
}

function mapOutputModalities(): ModelModality[] {
  return ["text"];
}

// ---------------------------------------------------------------------------
// Family derivation

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();

  // DeepSeek family
  if (lower.includes("deepseek-v4")) return "deepseek-v4";
  if (lower.includes("deepseek-v3")) return "deepseek-v3";
  // NVIDIA/Nemotron family
  if (lower.includes("nemotron-3-nano-omni")) return "nemotron-nano-omni";
  if (lower.includes("nemotron-3-super")) return "nemotron-super";
  if (lower.includes("nemotron-ultra")) return "nemotron-ultra";
  if (lower.includes("nemotron-3-nano")) return "nemotron-nano";
  if (lower.includes("nemotron")) return "nemotron";
  // GLM/ZhipuAI family
  if (lower.includes("glm-5.1")) return "glm-5.1";
  if (lower.includes("glm-5")) return "glm-5";
  // MiniMax family
  if (lower.includes("minimax-m2")) return "minimax-m2";
  // Qwen family
  if (lower.includes("qwen3-coder")) return "qwen-coder";
  if (lower.includes("qwen3-vl") || lower.includes("qwen2.5-vl")) return "qwen-vl";
  if (lower.includes("qwen3.5")) return "qwen3.5";
  if (lower.includes("qwen3-next")) return "qwen3-next";
  if (lower.includes("qwen3-235b")) return "qwen3";
  if (lower.includes("qwen3-30b")) return "qwen3";
  if (lower.includes("qwen3")) return "qwen3";
  // Hermes/NousResearch family
  if (lower.includes("hermes")) return "hermes";
  // GPT-OSS family
  if (lower.includes("gpt-oss")) return "gpt-oss";
  // INTELLECT family
  if (lower.includes("intellect")) return "intellect";
  // Gemma family
  if (lower.includes("gemma-3")) return "gemma-3";
  if (lower.includes("gemma-2")) return "gemma-2";
  // Llama family
  if (lower.includes("llama-3.3")) return "llama-3.3";
  if (lower.includes("llama-3_1")) return "llama-3.1";
  if (lower.includes("meta-llama-3.1")) return "llama-3.1";
  if (lower.includes("llama")) return "llama";
  // Mistral family
  if (lower.includes("mistral")) return "mistral";
  return "other";
}

// ---------------------------------------------------------------------------
// Date helper

function getCurrentDate(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Scrape function

export async function scrape(): Promise<ScrapeResult> {
  const today = getCurrentDate();

  const models: Model[] = [];

  for (const [id, info] of Object.entries(MODELS)) {
    const pricing: Pricing = {
      currency: "USD",

      input: info.inputPrice,

      output: info.outputPrice,
    };

    const modelDef: Parameters<typeof defineModel>[0] = {
      id,

      name: info.name,

      family: deriveFamily(id),

      temperature: true,

      limit: { context: info.context, output: info.output },

      modalities: {
        input: mapInputModalities(id),

        output: mapOutputModalities(),
      },

      pricing,

      release_date: today,

      last_updated: today,
    };

    if (info.reasoning) modelDef.reasoning = true;

    if (info.toolCall) modelDef.tool_call = true;

    if (info.structuredOutput) modelDef.structured_output = true;

    if (info.vision) modelDef.attachment = true;

    if (info.openWeights) modelDef.open_weights = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Nebius: ${models.length} models`);

  return { provider, models };
}

// ---------------------------------------------------------------------------
// Model data (from Nebius Token Factory website, browser-scraped 2026-05-16)
//
// Pricing: Per-1M-token USD (Base flavor)
// Context lengths: From model's original provider docs
// Capabilities: From model's original provider docs

const MODELS: Record<string, ModelInfo> = {
  // --- DeepSeek family ---
  "DeepSeek-V4-Pro": {
    name: "DeepSeek V4 Pro",
    inputPrice: 1.75,
    outputPrice: 3.5,
    context: 1000000,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  "DeepSeek-V3.2": {
    name: "DeepSeek V3.2",
    inputPrice: 0.3,
    outputPrice: 0.45,
    context: 160000,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  // --- NVIDIA/Nemotron family ---
  "Nemotron-3-Nano-Omni": {
    name: "Nemotron 3 Nano Omni",
    inputPrice: 0.06,
    outputPrice: 0.24,
    context: 128000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  "Nemotron-3-Super-120b-a12b": {
    name: "Nemotron 3 Super 120B A12B",
    inputPrice: 0.3,
    outputPrice: 0.9,
    context: 256000,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  "Llama-3_1-Nemotron-Ultra-253B-v1": {
    name: "Llama 3.1 Nemotron Ultra 253B v1",
    inputPrice: 0.6,
    outputPrice: 1.8,
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  "Nemotron-3-Nano-30B-A3B": {
    name: "Nemotron 3 Nano 30B A3B",
    inputPrice: 0.06,
    outputPrice: 0.24,
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  // --- GLM/ZhipuAI family ---
  "GLM-5.1": {
    name: "GLM 5.1",
    inputPrice: 1.4,
    outputPrice: 4.4,
    context: 200000,
    output: 24000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  "GLM-5": {
    name: "GLM 5",
    inputPrice: 1.0,
    outputPrice: 3.2,
    context: 198000,
    output: 32000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  // --- MiniMax family ---
  "MiniMax-M2.5": {
    name: "MiniMax M2.5",
    inputPrice: 0.3,
    outputPrice: 1.2,
    context: 198000,
    output: 32768,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  // --- Qwen family ---
  "Qwen3.5-397B-A17B": {
    name: "Qwen 3.5 397B A17B",
    inputPrice: 0.6,
    outputPrice: 3.6,
    context: 128000,
    output: 32768,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  "Qwen3-235B-A22B-Instruct-2507": {
    name: "Qwen3 235B A22B Instruct 2507",
    inputPrice: 0.2,
    outputPrice: 0.6,
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  "Qwen3-30B-A3B-Instruct-2507": {
    name: "Qwen3 30B A3B Instruct 2507",
    inputPrice: 0.1,
    outputPrice: 0.3,
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  "Qwen3-Next-80B-A3B-Thinking": {
    name: "Qwen3 Next 80B A3B Thinking",
    inputPrice: 0.15,
    outputPrice: 1.2,
    context: 256000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  "Qwen3-32B": {
    name: "Qwen3 32B",
    inputPrice: 0.1,
    outputPrice: 0.3,
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  // --- Vision model ---
  "Qwen2.5-VL-72B-Instruct": {
    name: "Qwen2.5 VL 72B Instruct",
    inputPrice: 0.25,
    outputPrice: 0.75,
    context: 128000,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    vision: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  // --- Hermes/NousResearch family ---
  "Hermes-4-405B": {
    name: "Hermes 4 405B",
    inputPrice: 1.0,
    outputPrice: 3.0,
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  "Hermes-4-70B": {
    name: "Hermes 4 70B",
    inputPrice: 0.13,
    outputPrice: 0.4,
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  // --- OpenAI/GPT-OSS family ---
  "gpt-oss-120b": {
    name: "GPT-OSS 120B",
    inputPrice: 0.15,
    outputPrice: 0.6,
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  // --- Prime Intellect family ---
  "INTELLECT-3": {
    name: "INTELLECT 3",
    inputPrice: 0.2,
    outputPrice: 1.1,
    context: 128000,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  // --- Google/Gemma family ---
  "Gemma-3-27b-it": {
    name: "Gemma 3 27B IT",
    inputPrice: 0.1,
    outputPrice: 0.3,
    context: 96000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  "Gemma-2-2b-it": {
    name: "Gemma 2 2B IT",
    inputPrice: 0.02,
    outputPrice: 0.06,
    context: 8192,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Meta/Llama family ---
  "Llama-3.3-70B-Instruct": {
    name: "Llama 3.3 70B Instruct",
    inputPrice: 0.13,
    outputPrice: 0.4,
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    structuredOutput: true,
    openWeights: true,
  },

  "Meta-Llama-3.1-8B-Instruct": {
    name: "Meta Llama 3.1 8B Instruct",
    inputPrice: 0.02,
    outputPrice: 0.06,
    context: 131072,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Mistral family ---
  // (Mistral-Nemo-Instruct-2407 was in docs but not on the browser page)
  // Skipping - not visible on current catalog page
};
