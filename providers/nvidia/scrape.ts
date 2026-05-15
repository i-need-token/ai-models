import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "nvidia",
  name: "NVIDIA",
  url: "https://build.nvidia.com",
  api_docs: "https://docs.api.nvidia.com",
  apis: {
    openai: "https://integrate.api.nvidia.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model list: https://integrate.api.nvidia.com/v1/models (API)
// - Model details & pricing: https://build.nvidia.com (CSR site)
// - Context limits & features: NVIDIA NIM model cards on build.nvidia.com
//
// NVIDIA pricing is per-token via partner endpoints (DeepInfra, Together, etc.)
// on build.nvidia.com Deploy tabs. Pricing shown is the lowest available
// serverless per-1M-token rate across all partner endpoints.
//
// Models without serverless endpoints (self-hosted only) use FreePricing
// since NVIDIA's own API offers free trial credits.
// ---------------------------------------------------------------------------

// Core LLM/chat models — all NVIDIA-produced
interface ModelInfo {
  name: string;
  context: number;
  output: number;
  inputModalities: ModelModality[];
  outputModalities: ModelModality[];
  reasoning?: boolean;
  toolCall?: boolean;
  vision?: boolean;
  deprecated?: boolean;
  openWeights?: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  // --- Nemotron Ultra / Super / Nano families ---
  "llama-3.1-nemotron-ultra-253b-v1": {
    name: "Llama 3.1 Nemotron Ultra 253B",
    context: 128000,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    deprecated: true,
    openWeights: true,
  },
  "llama-3.3-nemotron-super-49b-v1": {
    name: "Llama 3.3 Nemotron Super 49B v1",
    context: 128000,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    deprecated: true,
    openWeights: true,
  },
  "llama-3.3-nemotron-super-49b-v1.5": {
    name: "Llama 3.3 Nemotron Super 49B v1.5",
    context: 128000,
    output: 128000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    reasoning: true,
    toolCall: true,
    openWeights: true,
  },
  "llama-3.1-nemotron-70b-instruct": {
    name: "Llama 3.1 Nemotron 70B Instruct",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    deprecated: true,
    openWeights: true,
  },
  "llama-3.1-nemotron-51b-instruct": {
    name: "Llama 3.1 Nemotron 51B Instruct",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    deprecated: true,
    openWeights: true,
  },
  "llama-3.1-nemotron-nano-8b-v1": {
    name: "Llama 3.1 Nemotron Nano 8B v1",
    context: 128000,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    deprecated: true,
    openWeights: true,
  },

  // --- Nemotron 3 family ---
  "nemotron-3-super-120b-a12b": {
    name: "Nemotron 3 Super 120B",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    deprecated: true,
    openWeights: true,
  },
  "nemotron-3-nano-30b-a3b": {
    name: "Nemotron 3 Nano 30B",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    deprecated: true,
    openWeights: true,
  },
  "nemotron-3-nano-omni-30b-a3b-reasoning": {
    name: "Nemotron 3 Nano Omni 30B Reasoning",
    context: 4096,
    output: 4096,
    inputModalities: ["text", "image", "video", "audio"],
    outputModalities: ["text"],
    reasoning: true,
    vision: true,
    openWeights: true,
  },

  // --- Nemotron 4 family ---
  "nemotron-4-340b-instruct": {
    name: "Nemotron 4 340B Instruct",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    deprecated: true,
    openWeights: true,
  },
  "nemotron-4-340b-reward": {
    name: "Nemotron 4 340B Reward",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },

  // --- Nemotron Mini / Nano v2 ---
  "nemotron-mini-4b-instruct": {
    name: "Nemotron Mini 4B Instruct",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    deprecated: true,
    openWeights: true,
  },
  "nemotron-nano-3-30b-a3b": {
    name: "Nemotron Nano 3 30B",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nvidia-nemotron-nano-9b-v2": {
    name: "NVIDIA Nemotron Nano 9B v2",
    context: 8192,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    openWeights: true,
  },
  "nemotron-nano-12b-v2-vl": {
    name: "Nemotron Nano 12B v2 VL",
    context: 16384,
    output: 16384,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    vision: true,
    openWeights: true,
  },

  // --- Vision models ---
  "llama-3.1-nemotron-nano-vl-8b-v1": {
    name: "Llama 3.1 Nemotron Nano VL 8B v1",
    context: 128000,
    output: 4096,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    vision: true,
    deprecated: true,
    openWeights: true,
  },
  "cosmos-reason2-8b": {
    name: "Cosmos Reason2 8B",
    context: 16384,
    output: 16384,
    inputModalities: ["text", "image", "video"],
    outputModalities: ["text"],
    reasoning: true,
    vision: true,
    openWeights: true,
  },

  // --- Other NVIDIA models ---
  "llama3-chatqa-1.5-70b": {
    name: "Llama3 ChatQA 1.5 70B",
    context: 4096,
    output: 4096,
    inputModalities: ["text"],
    outputModalities: ["text"],
    deprecated: true,
    openWeights: true,
  },
  "mistral-nemo-minitron-8b-8k-instruct": {
    name: "Mistral Nemo Minitron 8B 8K Instruct",
    context: 8192,
    output: 8192,
    inputModalities: ["text"],
    outputModalities: ["text"],
    deprecated: true,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: build.nvidia.com Deploy tabs — lowest serverless partner endpoint rate
// Models without serverless endpoints use FreePricing (NVIDIA free trial API)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // Active models with serverless partner endpoints
  "llama-3.3-nemotron-super-49b-v1.5": {
    currency: "USD",
    input: 0.13,
    output: 0.38,
  },
  "nemotron-3-nano-omni-30b-a3b-reasoning": {
    currency: "USD",
    input: 0.13,
    output: 0.38,
  },
  "nemotron-nano-12b-v2-vl": {
    currency: "USD",
    input: 0.06,
    output: 0.06,
  },
  "nvidia-nemotron-nano-9b-v2": {
    currency: "USD",
    input: 0.06,
    output: 0.06,
  },
  "cosmos-reason2-8b": {
    currency: "USD",
    input: 0.06,
    output: 0.06,
  },

  // Deprecated models — pricing from partner endpoints at time of deprecation
  "llama-3.1-nemotron-ultra-253b-v1": {
    currency: "USD",
    input: 0.2,
    output: 0.8,
  },
  "llama-3.3-nemotron-super-49b-v1": {
    currency: "USD",
    input: 0.13,
    output: 0.38,
  },
  "llama-3.1-nemotron-70b-instruct": {
    currency: "USD",
    input: 0.06,
    output: 0.18,
  },
  "llama-3.1-nemotron-51b-instruct": {
    currency: "USD",
    input: 0.06,
    output: 0.18,
  },
  "llama-3.1-nemotron-nano-8b-v1": {
    currency: "USD",
    input: 0.02,
    output: 0.04,
  },
  "nemotron-4-340b-instruct": {
    currency: "USD",
    input: 0.4,
    output: 1.2,
  },
  "nemotron-3-super-120b-a12b": {
    currency: "USD",
    input: 0.2,
    output: 0.6,
  },
  "nemotron-3-nano-30b-a3b": {
    currency: "USD",
    input: 0.02,
    output: 0.04,
  },
  "nemotron-mini-4b-instruct": {
    currency: "USD",
    input: 0.02,
    output: 0.04,
  },
  "llama-3.1-nemotron-nano-vl-8b-v1": {
    currency: "USD",
    input: 0.02,
    output: 0.04,
  },
  "llama3-chatqa-1.5-70b": {
    currency: "USD",
    input: 0.06,
    output: 0.18,
  },
  "mistral-nemo-minitron-8b-8k-instruct": {
    currency: "USD",
    input: 0.02,
    output: 0.04,
  },

  // Reward model — free via NVIDIA API
  "nemotron-4-340b-reward": { unit: "free" },
  // Nano models without partner endpoints — free via NVIDIA API
  "nemotron-nano-3-30b-a3b": { unit: "free" },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("nemotron-ultra")) return "nemotron-ultra";
  if (id.includes("nemotron-super")) return "nemotron-super";
  if (id.includes("nemotron-nano")) return "nemotron-nano";
  if (id.includes("nemotron-mini")) return "nemotron-mini";
  if (id.includes("nemotron-3")) return "nemotron-3";
  if (id.includes("nemotron-4")) return "nemotron-4";
  if (id.includes("chatqa")) return "chatqa";
  if (id.includes("minitron")) return "minitron";
  if (id.includes("cosmos")) return "cosmos";
  return "nemotron";
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
    const pricing = HARDCODED_PRICING[id] ?? { unit: "free" };

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

    if (info.reasoning) modelDef.reasoning = true;
    if (info.toolCall) modelDef.tool_call = true;
    if (info.vision) modelDef.attachment = true;
    if (info.openWeights) modelDef.open_weights = true;
    if (info.deprecated) modelDef.deprecated = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  NVIDIA: ${models.length} models`);

  return { provider, models };
}
