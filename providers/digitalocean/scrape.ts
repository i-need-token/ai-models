import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "digitalocean",
  name: "DigitalOcean",
  url: "https://www.digitalocean.com/products/inference",
  api_docs: "https://docs.digitalocean.com/products/inference/",
  apis: {
    openai: "https://inference.do.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: https://docs.digitalocean.com/products/inference/details/pricing/
// - Model specs: https://docs.digitalocean.com/products/inference/details/models/
//
// DigitalOcean is an inference platform hosting models from other providers.
// Only "DigitalOcean-Hosted" chat models are included (not commercial models
// from Anthropic/OpenAI which are covered by their own providers, and not
// TTS/video/image/embedding/reranking models).
// Pricing shown is DigitalOcean's own per-1M-token rate (USD).
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context: number;
  output: number;
  inputModalities: ModelModality[];
  outputModalities: ModelModality[];
  toolCall?: boolean;
  reasoning?: boolean;
  openWeights?: boolean;
}

// ---------------------------------------------------------------------------
// Chat Models
// ---------------------------------------------------------------------------

const CHAT_MODELS: Record<string, ModelInfo> = {
  // --- Alibaba Qwen family ---
  "alibaba-qwen3-32b": {
    name: "Qwen3 32B",
    context: 131072,
    output: 40960,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwen3-coder-flash": {
    name: "Qwen3 Coder Flash",
    context: 131072,
    output: 65536,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwen3.5-397b-a17b": {
    name: "Qwen 3.5 397B A17B",
    context: 131072,
    output: 81920,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- DeepSeek family ---
  "deepseek-r1-distill-llama-70b": {
    name: "DeepSeek R1 Distill Llama 70B",
    context: 131072,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  "deepseek-v4-pro": {
    name: "DeepSeek V4 Pro",
    context: 163840,
    output: 1048576,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    openWeights: true,
  },
  "deepseek-3.2": {
    name: "DeepSeek V3.2",
    context: 131072,
    output: 64000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Google Gemma family ---
  "gemma-4-31b-it": {
    name: "Gemma 4 31B",
    context: 262144,
    output: 256000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- MiniMax family ---
  "minimax-m2.5": {
    name: "MiniMax M2.5",
    context: 131072,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Moonshot AI Kimi family ---
  "kimi-k2.5": {
    name: "Kimi K2.5",
    context: 131072,
    output: 32768,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "kimi-k2.6": {
    name: "Kimi K2.6",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Meta Llama family ---
  "llama3.3-70b-instruct": {
    name: "Llama 3.3 70B Instruct",
    context: 131072,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "llama-4-maverick": {
    name: "Llama 4 Maverick 17B 128E",
    context: 1048576,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Mistral family ---
  "mistral-3-14b": {
    name: "Ministral 3 14B Instruct",
    context: 131072,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- NVIDIA Nemotron family ---
  "nvidia-nemotron-3-super-120b": {
    name: "Nemotron 3 Super 120B",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nemotron-3-nano-omni": {
    name: "Nemotron Nano 3 Omni",
    context: 65536,
    output: 65536,
    inputModalities: ["text", "image", "audio"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nemotron-nano-12b-v2-vl": {
    name: "Nemotron Nano 12B v2 VL",
    context: 16384,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Zhipu AI GLM family ---
  "glm-5": {
    name: "GLM 5",
    context: 131072,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- OpenAI GPT-OSS family (open-source, hosted on DO) ---
  "openai-gpt-oss-120b": {
    name: "GPT OSS 120B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "openai-gpt-oss-20b": {
    name: "GPT OSS 20B",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Arcee family ---
  "arcee-trinity-large-thinking": {
    name: "Trinity Large Thinking",
    context: 131072,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: https://docs.digitalocean.com/products/inference/details/pricing/
// (DigitalOcean-Hosted Models section, accessed 2026-05-16)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // Alibaba Qwen family
  "alibaba-qwen3-32b": { currency: "USD", input: 0.25, output: 0.55 },
  "qwen3-coder-flash": { currency: "USD", input: 0.45, output: 1.7 },
  "qwen3.5-397b-a17b": { currency: "USD", input: 0.55, output: 3.5 },

  // DeepSeek family
  "deepseek-r1-distill-llama-70b": { currency: "USD", input: 0.99, output: 0.99 },
  "deepseek-v4-pro": { currency: "USD", input: 1.74, output: 3.48 },
  "deepseek-3.2": { currency: "USD", input: 0.5, output: 1.6 },

  // Google Gemma family
  "gemma-4-31b-it": { currency: "USD", input: 0.18, output: 0.5 },

  // MiniMax family
  "minimax-m2.5": { currency: "USD", input: 0.3, output: 1.2 },

  // Moonshot AI Kimi family
  "kimi-k2.5": { currency: "USD", input: 0.5, output: 2.7 },
  "kimi-k2.6": { currency: "USD", input: 0.95, output: 4.0 },

  // Meta Llama family
  "llama3.3-70b-instruct": { currency: "USD", input: 0.65, output: 0.65 },
  "llama-4-maverick": { currency: "USD", input: 0.25, output: 0.87 },

  // Mistral family
  "mistral-3-14b": { currency: "USD", input: 0.2, output: 0.2 },

  // NVIDIA Nemotron family
  "nvidia-nemotron-3-super-120b": { currency: "USD", input: 0.3, output: 0.65 },
  "nemotron-3-nano-omni": { currency: "USD", input: 0.5, output: 0.9 },
  "nemotron-nano-12b-v2-vl": { currency: "USD", input: 0.2, output: 0.6 },

  // Zhipu AI GLM family
  "glm-5": { currency: "USD", input: 1.0, output: 3.2 },

  // OpenAI GPT-OSS family
  "openai-gpt-oss-120b": { currency: "USD", input: 0.1, output: 0.7 },
  "openai-gpt-oss-20b": { currency: "USD", input: 0.05, output: 0.45 },

  // Arcee family
  "arcee-trinity-large-thinking": { currency: "USD", input: 0.25, output: 0.9, cache_read: 0.06 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("qwen3.5")) return "qwen3.5";
  if (id.includes("qwen3-coder")) return "qwen3-coder";
  if (id.includes("qwen3")) return "qwen3";
  if (id.includes("deepseek-r1")) return "deepseek-r1";
  if (id.includes("deepseek-v4")) return "deepseek-v4";
  if (id.includes("deepseek")) return "deepseek-v3";
  if (id.includes("gemma")) return "gemma";
  if (id.includes("minimax")) return "minimax-m";
  if (id.includes("kimi-k2.6")) return "kimi-k2.6";
  if (id.includes("kimi")) return "kimi-k2.5";
  if (id.includes("llama-4")) return "llama-4";
  if (id.includes("llama")) return "llama-3.3";
  if (id.includes("mistral")) return "ministral";
  if (id.includes("nemotron-3-nano")) return "nemotron-nano";
  if (id.includes("nemotron-nano")) return "nemotron-nano";
  if (id.includes("nemotron")) return "nemotron";
  if (id.includes("glm")) return "glm";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("trinity")) return "trinity";
  return id.split("-")[0] as string;
}

// ---------------------------------------------------------------------------
// Build models
// ---------------------------------------------------------------------------

function buildModels(): Model[] {
  const models: Model[] = [];
  const today = new Date().toISOString().slice(0, 10) as string;

  for (const [id, info] of Object.entries(CHAT_MODELS)) {
    const pricing = HARDCODED_PRICING[id];
    if (!pricing) {
      console.warn(`  DigitalOcean: skipping ${id} — no pricing`);
      continue;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id,
      name: info.name,
      family: deriveFamily(id),
      temperature: true,
      limit: { context: info.context, output: info.output },
      modalities: {
        input: info.inputModalities,
        output: info.outputModalities,
      },
      pricing,
      release_date: today,
      last_updated: today,
      open_weights: info.openWeights ?? true,
    };

    if (info.toolCall) modelDef.tool_call = true;
    if (info.reasoning) modelDef.reasoning = true;

    models.push(defineModel(modelDef));
  }

  return models;
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const models = buildModels();
  console.log(`  DigitalOcean: ${models.length} models`);
  return { provider, models };
}
