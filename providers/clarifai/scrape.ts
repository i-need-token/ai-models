import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "clarifai",
  name: "Clarifai",
  url: "https://clarifai.com",
  api_docs: "https://docs.clarifai.com",
  apis: {
    openai: "https://api.clarifai.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: https://clarifai.com/pricing (SSR HTML, first-party data)
// - Model IDs: Clarifai pricing page
// - Context lengths: Clarifai pricing page (max_tokens field)
//
// Clarifai is an inference platform hosting models from MoonshotAI, Alibaba,
// OpenBMB, Mistral, OpenAI, Anthropic, xAI, Google, Meta with per-token
// USD pricing.
//
// Pricing shown is USD per million tokens.
// Some models have cache_read pricing (10% of input price).
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

// ---------------------------------------------------------------------------
// All models with per-token pricing on the Clarifai pricing page
// ---------------------------------------------------------------------------

const MODELS: Record<string, ModelInfo> = {
  // MoonshotAI models
  "kimi-k2-thinking": {
    name: "Kimi K2 Thinking on Clarifai",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    openWeights: true,
  },
  // Alibaba models
  "qwen3-next-80b-a3b-thinking": {
    name: "Qwen3 Next 80B A3B Thinking on Clarifai",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    openWeights: true,
  },
  "qwen3-coder-30b-a3b-instruct": {
    name: "Qwen3 Coder 30B A3B on Clarifai",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  // OpenBMB models
  "minicpm4-8b": {
    name: "MiniCPM4 8B on Clarifai",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "minicpm-o-2-6-language": {
    name: "MiniCPM-o 2.6 Language on Clarifai",
    context: 131072,
    output: 131072,
    inputModalities: ["image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  // Mistral models
  "ministral-3-14b-reasoning-2512": {
    name: "Ministral 3 14B Reasoning on Clarifai",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    openWeights: true,
  },
  // OpenAI models
  "gpt-oss-120b": {
    name: "GPT OSS 120B on Clarifai",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    openWeights: true,
  },
  "gpt-5-1": {
    name: "GPT-5.1 on Clarifai",
    context: 1048576,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  // Anthropic models
  "claude-opus-4-5": {
    name: "Claude Opus 4.5 on Clarifai",
    context: 200000,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  // xAI models
  "grok-4-1-fast": {
    name: "Grok 4 1 Fast on Clarifai",
    context: 131072,
    output: 131072,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  // Google models
  "qwen2-5-vl-7b-instruct": {
    name: "Qwen 2.5 VL 7B on Clarifai",
    context: 131072,
    output: 131072,
    inputModalities: ["image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  // Meta models
  "llama-3-2-3b-instruct": {
    name: "Llama 3.2 3B Instruct on Clarifai",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: SSR HTML from clarifai.com/pricing (first-party data, 2026-05-16)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // MoonshotAI
  "kimi-k2-thinking": { currency: "USD", input: 1.5, output: 1.5, cache_read: 0.15 },
  // Alibaba
  "qwen3-next-80b-a3b-thinking": { currency: "USD", input: 1.09, output: 1.08 },
  "qwen3-coder-30b-a3b-instruct": { currency: "USD", input: 0.36, output: 1.3 },
  // OpenBMB
  "minicpm4-8b": { currency: "USD", input: 0.86, output: 1.43 },
  "minicpm-o-2-6-language": { currency: "USD", input: 0.66, output: 1.11 },
  // Mistral
  "ministral-3-14b-reasoning-2512": { currency: "USD", input: 2.5, output: 1.7 },
  // OpenAI
  "gpt-oss-120b": { currency: "USD", input: 0.09, output: 0.36 },
  "gpt-5-1": { currency: "USD", input: 1.5625, output: 12.5 },
  // Anthropic
  "claude-opus-4-5": { currency: "USD", input: 6.25, output: 31.25 },
  // xAI
  "grok-4-1-fast": { currency: "USD", input: 0.25, output: 0.625 },
  // Google
  "qwen2-5-vl-7b-instruct": { currency: "USD", input: 0.44, output: 1.32 },
  // Meta
  "llama-3-2-3b-instruct": { currency: "USD", input: 0.13, output: 0.63 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("kimi")) return "kimi";
  if (id.includes("qwen3-next")) return "qwen3-next";
  if (id.includes("qwen3-coder")) return "qwen-coder";
  if (id.includes("qwen2-5-vl")) return "qwen-vl";
  if (id.includes("minicpm4")) return "minicpm4";
  if (id.includes("minicpm-o")) return "minicpm-o";
  if (id.includes("ministral")) return "ministral";
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("gpt-5")) return "gpt-5";
  if (id.includes("claude")) return "claude";
  if (id.includes("grok")) return "grok";
  if (id.includes("llama")) return "llama-3";
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
      console.warn(`  Clarifai: skipping ${id} — no pricing`);
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

  console.log(`  Clarifai: ${models.length} models`);

  return { provider, models };
}
