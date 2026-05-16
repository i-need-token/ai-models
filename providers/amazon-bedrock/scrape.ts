import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "amazon-bedrock",
  name: "Amazon Bedrock",
  url: "https://aws.amazon.com/bedrock/",
  api_docs: "https://docs.aws.amazon.com/bedrock/",
  apis: {
    openai: "https://bedrock-runtime.us-east-1.amazonaws.com/openai",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: AWS Pricing API (https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/index.json)
//   Standard on-demand tier, us-east-1 region, per-1M-token USD pricing
// - Context lengths: Original provider docs (Anthropic, Meta, Mistral, Amazon, etc.)
// - Model IDs: AWS Bedrock documentation
//
// Amazon Bedrock is an inference platform hosting models from multiple providers.
// Pricing shown is Bedrock's own per-1M-token rate (USD), standard on-demand tier.
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context: number;
  output: number;
  inputModalities: ModelModality[];
  outputModalities: ModelModality[];
  toolCall?: boolean;
  openWeights?: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  // --- Amazon Nova family ---
  "amazon-nova-2-lite": {
    name: "Amazon Nova 2.0 Lite",
    context: 64000,
    output: 64000,
    inputModalities: ["text", "image", "video"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "amazon-nova-lite": {
    name: "Amazon Nova Lite",
    context: 300000,
    output: 10000,
    inputModalities: ["text", "image", "video"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "amazon-nova-micro": {
    name: "Amazon Nova Micro",
    context: 128000,
    output: 10000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "amazon-nova-premier": {
    name: "Amazon Nova Premier",
    context: 1000000,
    output: 10000,
    inputModalities: ["text", "image", "video"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "amazon-nova-pro": {
    name: "Amazon Nova Pro",
    context: 300000,
    output: 10000,
    inputModalities: ["text", "image", "video"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "amazon-nova-pro-latency-optimized": {
    name: "Amazon Nova Pro Latency Optimized",
    context: 300000,
    output: 10000,
    inputModalities: ["text", "image", "video"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Meta Llama family ---
  "meta-llama-3-70b": {
    name: "Meta Llama 3 70B Instruct",
    context: 8192,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "meta-llama-3-8b": {
    name: "Meta Llama 3 8B Instruct",
    context: 8192,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "meta-llama-3-1-70b": {
    name: "Meta Llama 3.1 70B Instruct",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama-3-1-70b-latency-optimized": {
    name: "Meta Llama 3.1 70B Latency Optimized",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama-3-1-8b": {
    name: "Meta Llama 3.1 8B Instruct",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama-3-2-11b": {
    name: "Meta Llama 3.2 11B Vision Instruct",
    context: 128000,
    output: 4096,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama-3-2-1b": {
    name: "Meta Llama 3.2 1B Instruct",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "meta-llama-3-2-3b": {
    name: "Meta Llama 3.2 3B Instruct",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "meta-llama-3-2-90b": {
    name: "Meta Llama 3.2 90B Vision Instruct",
    context: 128000,
    output: 4096,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama-3-3-70b": {
    name: "Meta Llama 3.3 70B Instruct",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama-4-maverick-17b": {
    name: "Meta Llama 4 Maverick 17Bx128E Instruct",
    context: 1048576,
    output: 4096,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "meta-llama-4-scout-17b": {
    name: "Meta Llama 4 Scout 17Bx16E Instruct",
    context: 1048576,
    output: 4096,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Mistral family ---
  "mistral-mistral-7b": {
    name: "Mistral 7B Instruct",
    context: 32000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "mistral-mistral-large": {
    name: "Mistral Large 2407",
    context: 128000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "mistral-mistral-large-3": {
    name: "Mistral Large 3",
    context: 128000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "mistral-mistral-small": {
    name: "Mistral Small",
    context: 128000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "mistral-mixtral-8x7b": {
    name: "Mixtral 8x7B Instruct",
    context: 32000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "mistral-ministral-3b": {
    name: "Ministral 3B 3.0",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "mistral-ministral-8b": {
    name: "Ministral 8B 3.0",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "mistral-ministral-14b": {
    name: "Ministral 14B 3.0",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "mistral-magistral-small": {
    name: "Magistral Small 1.2",
    context: 128000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "mistral-pixtral-large": {
    name: "Pixtral Large 25.02",
    context: 128000,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "mistral-devstral": {
    name: "Devstral",
    context: 128000,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "mistral-voxtral-mini": {
    name: "Voxtral Mini 1.0",
    context: 128000,
    output: 4096,
    inputModalities: ["text", "audio"],
    outputModalities: ["text"],
  },
  "mistral-voxtral-small": {
    name: "Voxtral Small 1.0",
    context: 128000,
    output: 4096,
    inputModalities: ["text", "audio"],
    outputModalities: ["text"],
  },

  // --- DeepSeek family ---
  "deepseek-r1": {
    name: "DeepSeek R1",
    context: 65536,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "deepseek-v3-2": {
    name: "DeepSeek V3.2",
    context: 65536,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Google Gemma family ---
  "google-gemma-3-4b": {
    name: "Gemma 3 4B IT",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "google-gemma-3-12b": {
    name: "Gemma 3 12B IT",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "google-gemma-3-27b": {
    name: "Gemma 3 27B IT",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- NVIDIA Nemotron family ---
  "nvidia-nemotron-3-super-120b": {
    name: "NVIDIA Nemotron 3 Super 120B A12B",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nvidia-nemotron-nano-2": {
    name: "NVIDIA Nemotron Nano 2",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nvidia-nemotron-nano-2-vl": {
    name: "NVIDIA Nemotron Nano 2 VL",
    context: 4096,
    output: 4096,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nvidia-nemotron-nano-3-30b": {
    name: "Nemotron Nano 3 30B",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Qwen family ---
  "qwen-qwen3-32b": {
    name: "Qwen3 32B",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwen-qwen3-coder-30b-a3b": {
    name: "Qwen3 Coder 30B A3B",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "qwen-qwen3-coder-next": {
    name: "Qwen3 Coder Next",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "qwen-qwen3-vl-235b-a22b": {
    name: "Qwen3 VL 235B A22B",
    context: 131072,
    output: 8192,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Kimi / Moonshot AI ---
  "kimi-k2-thinking": {
    name: "Kimi K2 Thinking",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "moonshot-kimi-k2-5": {
    name: "Kimi K2.5",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Z AI (Zhipu) ---
  "zai-glm-4-7": {
    name: "GLM 4.7",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "zai-glm-4-7-flash": {
    name: "GLM 4.7 Flash",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "zai-glm-5": {
    name: "GLM 5",
    context: 131072,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- MiniMax AI ---
  "minimax-m2-5": {
    name: "MiniMax M2.5",
    context: 1048576,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "minimax-m2": {
    name: "Minimax M2",
    context: 1048576,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "minimax-m2-1": {
    name: "Minimax M2.1",
    context: 1048576,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- OpenAI GPT-OSS ---
  "openai-gpt-oss-120b": {
    name: "GPT OSS 120B",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "openai-gpt-oss-20b": {
    name: "GPT OSS 20B",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "openai-gpt-oss-safeguard-120b": {
    name: "GPT OSS Safeguard 120B",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "openai-gpt-oss-safeguard-20b": {
    name: "GPT OSS Safeguard 20B",
    context: 131072,
    output: 16384,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Writer ---
  "writer-palmyra-vision-7b": {
    name: "Writer Palmyra Vision 7B",
    context: 8192,
    output: 4096,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: AWS Pricing API (https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/index.json)
// Standard on-demand tier, us-east-1 region
// ---------------------------------------------------------------------------

const PRICING: Record<string, Pricing> = {
  // Amazon Nova — USD per 1M tokens
  "amazon-nova-2-lite": { currency: "USD", input: 0.33, output: 2.75, cache_read: 0.0825 },
  "amazon-nova-lite": { currency: "USD", input: 0.06, output: 0.24, cache_read: 0.015 },
  "amazon-nova-micro": { currency: "USD", input: 0.035, output: 0.14, cache_read: 0.00875 },
  "amazon-nova-premier": { currency: "USD", input: 2.5, output: 12.5, cache_read: 0.625 },
  "amazon-nova-pro": { currency: "USD", input: 0.8, output: 3.2, cache_read: 0.2 },
  "amazon-nova-pro-latency-optimized": { currency: "USD", input: 1.0, output: 4.0 },

  // Meta Llama — USD per 1M tokens
  "meta-llama-3-70b": { currency: "USD", input: 2.65, output: 3.5 },
  "meta-llama-3-8b": { currency: "USD", input: 0.3, output: 0.6 },
  "meta-llama-3-1-70b": { currency: "USD", input: 0.72, output: 0.72 },
  "meta-llama-3-1-70b-latency-optimized": { currency: "USD", input: 0.9, output: 0.9 },
  "meta-llama-3-1-8b": { currency: "USD", input: 0.22, output: 0.22 },
  "meta-llama-3-2-11b": { currency: "USD", input: 0.16, output: 0.16 },
  "meta-llama-3-2-1b": { currency: "USD", input: 0.1, output: 0.1 },
  "meta-llama-3-2-3b": { currency: "USD", input: 0.15, output: 0.15 },
  "meta-llama-3-2-90b": { currency: "USD", input: 0.72, output: 0.72 },
  "meta-llama-3-3-70b": { currency: "USD", input: 0.72, output: 0.72 },
  "meta-llama-4-maverick-17b": { currency: "USD", input: 0.24, output: 0.97 },
  "meta-llama-4-scout-17b": { currency: "USD", input: 0.17, output: 0.66 },

  // Mistral — USD per 1M tokens
  "mistral-mistral-7b": { currency: "USD", input: 0.15, output: 0.2 },
  "mistral-mistral-large": { currency: "USD", input: 4.0, output: 12.0 },
  "mistral-mistral-large-3": { currency: "USD", input: 0.5, output: 1.5 },
  "mistral-mistral-small": { currency: "USD", input: 1.0, output: 3.0 },
  "mistral-mixtral-8x7b": { currency: "USD", input: 0.45, output: 0.7 },
  "mistral-ministral-3b": { currency: "USD", input: 0.1, output: 0.1 },
  "mistral-ministral-8b": { currency: "USD", input: 0.15, output: 0.15 },
  "mistral-ministral-14b": { currency: "USD", input: 0.2, output: 0.2 },
  "mistral-magistral-small": { currency: "USD", input: 0.5, output: 1.5 },
  "mistral-pixtral-large": { currency: "USD", input: 2.0, output: 6.0 },
  "mistral-devstral": { currency: "USD", input: 0.4, output: 2.0 },
  "mistral-voxtral-mini": { currency: "USD", input: 0.04, output: 0.04 },
  "mistral-voxtral-small": { currency: "USD", input: 0.1, output: 0.3 },

  // DeepSeek — USD per 1M tokens
  "deepseek-r1": { currency: "USD", input: 1.35, output: 5.4 },
  "deepseek-v3-2": { currency: "USD", input: 0.62, output: 1.85 },

  // Google Gemma — USD per 1M tokens
  "google-gemma-3-4b": { currency: "USD", input: 0.04, output: 0.08 },
  "google-gemma-3-12b": { currency: "USD", input: 0.09, output: 0.29 },
  "google-gemma-3-27b": { currency: "USD", input: 0.23, output: 0.38 },

  // NVIDIA Nemotron — USD per 1M tokens
  "nvidia-nemotron-3-super-120b": { currency: "USD", input: 0.15, output: 0.65 },
  "nvidia-nemotron-nano-2": { currency: "USD", input: 0.06, output: 0.23 },
  "nvidia-nemotron-nano-2-vl": { currency: "USD", input: 0.2, output: 0.6 },
  "nvidia-nemotron-nano-3-30b": { currency: "USD", input: 0.06, output: 0.24 },

  // Qwen — USD per 1M tokens
  "qwen-qwen3-32b": { currency: "USD", input: 0.15, output: 0.6 },
  "qwen-qwen3-coder-30b-a3b": { currency: "USD", input: 0.15, output: 0.6 },
  "qwen-qwen3-coder-next": { currency: "USD", input: 0.5, output: 1.2 },
  "qwen-qwen3-vl-235b-a22b": { currency: "USD", input: 0.53, output: 2.66 },

  // Kimi / Moonshot AI — USD per 1M tokens
  "kimi-k2-thinking": { currency: "USD", input: 0.6, output: 2.5 },
  "moonshot-kimi-k2-5": { currency: "USD", input: 0.6, output: 3.0 },

  // Z AI (Zhipu) — USD per 1M tokens
  "zai-glm-4-7": { currency: "USD", input: 0.6, output: 2.2 },
  "zai-glm-4-7-flash": { currency: "USD", input: 0.07, output: 0.4 },
  "zai-glm-5": { currency: "USD", input: 1.0, output: 3.2 },

  // MiniMax AI — USD per 1M tokens
  "minimax-m2-5": { currency: "USD", input: 0.3, output: 1.2 },
  "minimax-m2": { currency: "USD", input: 0.3, output: 1.2 },
  "minimax-m2-1": { currency: "USD", input: 0.3, output: 1.2 },

  // OpenAI GPT-OSS — USD per 1M tokens
  "openai-gpt-oss-120b": { currency: "USD", input: 0.15, output: 0.6 },
  "openai-gpt-oss-20b": { currency: "USD", input: 0.07, output: 0.3 },
  "openai-gpt-oss-safeguard-120b": { currency: "USD", input: 0.15, output: 0.6 },
  "openai-gpt-oss-safeguard-20b": { currency: "USD", input: 0.07, output: 0.2 },

  // Writer — USD per 1M tokens
  "writer-palmyra-vision-7b": { currency: "USD", input: 0.15, output: 0.6 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.startsWith("amazon-nova")) return "nova";
  if (id.startsWith("meta-llama-3")) return "llama-3";
  if (id.startsWith("meta-llama-4")) return "llama-4";
  if (id.startsWith("mistral-mistral-large")) return "mistral-large";
  if (id.startsWith("mistral-mistral-small")) return "mistral-small";
  if (id.startsWith("mistral-mistral-7b")) return "mistral-7b";
  if (id.startsWith("mistral-mixtral")) return "mixtral";
  if (id.startsWith("mistral-ministral")) return "ministral";
  if (id.startsWith("mistral-magistral")) return "magistral";
  if (id.startsWith("mistral-pixtral")) return "pixtral";
  if (id.startsWith("mistral-devstral")) return "devstral";
  if (id.startsWith("mistral-voxtral")) return "voxtral";
  if (id.startsWith("deepseek")) return "deepseek";
  if (id.startsWith("google-gemma")) return "gemma";
  if (id.startsWith("nvidia-nemotron")) return "nemotron";
  if (id.startsWith("qwen")) return "qwen";
  if (id.startsWith("kimi")) return "kimi";
  if (id.startsWith("moonshot")) return "kimi";
  if (id.startsWith("zai-glm")) return "glm";
  if (id.startsWith("minimax")) return "minimax";
  if (id.startsWith("openai-gpt-oss")) return "gpt-oss";
  if (id.startsWith("writer")) return "palmyra";
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
    const pricing = PRICING[id];
    if (!pricing) {
      console.warn(`  Amazon Bedrock: skipping ${id} — no pricing`);
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

    models.push(defineModel(modelDef));
  }

  console.log(`  Amazon Bedrock: ${models.length} models`);

  return { provider, models };
}
