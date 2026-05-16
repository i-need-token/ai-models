import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "baseten",
  name: "Baseten",
  url: "https://baseten.co",
  api_docs: "https://docs.baseten.co",
  apis: {
    openai: "https://model-api.baseten.co/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: https://baseten.co/pricing (SSR page, extracted from HTML)
// - Model IDs: Baseten pricing page + docs
// - Context lengths: Cross-referenced with upstream providers
//
// Baseten is an inference platform that hosts models from other providers
// with per-token pricing. They provide OpenAI-compatible Model APIs.
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
// Models with per-token pricing (from Baseten pricing page)
//
// Pricing (USD per million tokens):
//   DeepSeek V4:        input $1.74, output $3.48, cache_read $0.145
//   DeepSeek V3.1:      input $0.50, output $1.50, cache_read $0.25
//   Kimi K2.6:          input $1.00, output $3.90, cache_read $0.20
//   Kimi K2.5:          input $0.60, output $3.00, cache_read $0.12
//   NVIDIA Nemotron 3 Super: input $0.30, output $0.75, cache_read $0.06
//   MiniMax M2.5:       input $0.30, output $1.20, cache_read $0.06
//   GLM 5:              input $0.95, output $3.15, cache_read $0.20
//   GLM 4.7:            input $0.60, output $2.20, cache_read $0.12
//   GPT OSS 120B:       input $0.10, output $0.50
// ---------------------------------------------------------------------------

const MODELS: Record<string, ModelInfo> = {
  // --- DeepSeek family ---
  "deepseek-v4": {
    name: "DeepSeek V4 on Baseten",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
    reasoning: true,
  },
  "deepseek-v3-1": {
    name: "DeepSeek V3.1 on Baseten",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- Kimi family ---
  "kimi-k2-6": {
    name: "Kimi K2.6 on Baseten",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "kimi-k2-5": {
    name: "Kimi K2.5 on Baseten",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- NVIDIA family ---
  "nvidia-nemotron-3-super": {
    name: "NVIDIA Nemotron 3 Super on Baseten",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- MiniMax family ---
  "minimax-m2-5": {
    name: "MiniMax M2.5 on Baseten",
    context: 1048576,
    output: 1048576,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- GLM family ---
  "glm-5": {
    name: "GLM 5 on Baseten",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "glm-4-7": {
    name: "GLM 4.7 on Baseten",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },

  // --- OpenAI family ---
  "gpt-oss-120b": {
    name: "GPT OSS 120B on Baseten",
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
// Source: https://baseten.co/pricing (SSR HTML, extracted 2026-05-16)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  "deepseek-v4": { currency: "USD", input: 1.74, output: 3.48, cache_read: 0.145 },
  "deepseek-v3-1": { currency: "USD", input: 0.5, output: 1.5, cache_read: 0.25 },
  "kimi-k2-6": { currency: "USD", input: 1.0, output: 3.9, cache_read: 0.2 },
  "kimi-k2-5": { currency: "USD", input: 0.6, output: 3.0, cache_read: 0.12 },
  "nvidia-nemotron-3-super": { currency: "USD", input: 0.3, output: 0.75, cache_read: 0.06 },
  "minimax-m2-5": { currency: "USD", input: 0.3, output: 1.2, cache_read: 0.06 },
  "glm-5": { currency: "USD", input: 0.95, output: 3.15, cache_read: 0.2 },
  "glm-4-7": { currency: "USD", input: 0.6, output: 2.2, cache_read: 0.12 },
  "gpt-oss-120b": { currency: "USD", input: 0.1, output: 0.5 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("deepseek")) return "deepseek";
  if (id.includes("kimi")) return "kimi";
  if (id.includes("nemotron")) return "nemotron";
  if (id.includes("minimax")) return "minimax";
  if (id.includes("glm")) return "glm";
  if (id.includes("gpt-oss")) return "gpt-oss";
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
      console.warn(`  Baseten: skipping ${id} — no pricing`);
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

  console.log(`  Baseten: ${models.length} models`);

  return { provider, models };
}
