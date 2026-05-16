import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "morph",
  name: "Morph",
  url: "https://morphllm.com",
  api_docs: "https://docs.morphllm.com",
  apis: {
    openai: "https://api.morphllm.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: https://morphllm.com/pricing (SSR page, extracted from HTML)
// - Model IDs: Morph pricing page + docs
// - Context lengths: Morph pricing page
//
// Morph is a model producer that builds specialized models for code editing,
// search, routing, and context management. They also host open-source models
// on their infrastructure with custom kernels.
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
// Specialized Models (Morph's own models)
// ---------------------------------------------------------------------------

const SPECIALIZED_MODELS: Record<string, ModelInfo> = {
  // --- Fast Apply family ---
  "morph-v3-fast": {
    name: "Morph v3 Fast",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },
  "morph-v3-large": {
    name: "Morph v3 Large",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
  },

  // --- Compaction ---
  "morph-compact": {
    name: "Morph Compact",
    context: 1048576,
    output: 1048576,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },

  // --- Router ---
  "morph-router": {
    name: "Morph Router",
    context: 0,
    output: 0,
    inputModalities: ["text"],
    outputModalities: ["text"],
  },
};

// ---------------------------------------------------------------------------
// General Models (open-source models on Morph infrastructure)
// ---------------------------------------------------------------------------

const GENERAL_MODELS: Record<string, ModelInfo> = {
  "morph-qwen35-397b": {
    name: "Qwen 3.5 397B on Morph",
    context: 262144,
    output: 262144,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "morph-qwen36-27b": {
    name: "Qwen 3.6 27B on Morph",
    context: 131072,
    output: 131072,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
  "morph-minimax27-230b": {
    name: "MiniMax M2.7 230B on Morph",
    context: 200000,
    output: 200000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    toolCall: true,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens, unless otherwise noted)
//
// Source: https://morphllm.com/pricing (extracted from SSR HTML 2026-05-16)
//
// Specialized Models:
//   morph-v3-fast:  $0.8/M input, $1.2/M output
//   morph-v3-large: $0.9/M input, $1.9/M output
//   morph-compact:  $0.2/M input, $0.5/M output
//   morph-router:   $0.005/request
//
// General Models:
//   morph-qwen35-397b:    $0.48/M input, $3.5/M output
//   morph-qwen36-27b:     $0.498/M input, $2.4/M output
//   morph-minimax27-230b: $0.279/M input, $1.2/M output
//
// Note: morph-warp-grep-v2 is priced per 100K queries ($0.8/100K), not
// per-token — excluded from this catalog.
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // Specialized models — USD per million tokens
  "morph-v3-fast": { currency: "USD", input: 0.8, output: 1.2 },
  "morph-v3-large": { currency: "USD", input: 0.9, output: 1.9 },
  "morph-compact": { currency: "USD", input: 0.2, output: 0.5 },

  // Router — USD per request
  "morph-router": { currency: "USD", unit: "per_request", price: 0.005 },

  // General models — USD per million tokens
  "morph-qwen35-397b": { currency: "USD", input: 0.48, output: 3.5 },
  "morph-qwen36-27b": { currency: "USD", input: 0.498, output: 2.4 },
  "morph-minimax27-230b": { currency: "USD", input: 0.279, output: 1.2 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("morph-v3")) return "morph-v3";
  if (id.includes("morph-compact")) return "morph-compact";
  if (id.includes("morph-router")) return "morph-router";
  if (id.includes("morph-qwen")) return "morph-qwen";
  if (id.includes("morph-minimax")) return "morph-minimax";
  return "morph";
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

  // Process specialized models
  for (const [id, info] of Object.entries(SPECIALIZED_MODELS)) {
    const pricing = HARDCODED_PRICING[id];
    if (!pricing) {
      console.warn(`  Morph: skipping ${id} — no pricing`);
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

  // Process general models
  for (const [id, info] of Object.entries(GENERAL_MODELS)) {
    const pricing = HARDCODED_PRICING[id];
    if (!pricing) {
      console.warn(`  Morph: skipping ${id} — no pricing`);
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

    models.push(defineModel(modelDef));
  }

  console.log(`  Morph: ${models.length} models`);

  return { provider, models };
}
