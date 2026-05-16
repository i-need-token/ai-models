import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "hyperbolic",
  name: "Hyperbolic",
  url: "https://hyperbolic.ai",
  api_docs: "https://docs.hyperbolic.ai",
  apis: {
    openai: "https://api.hyperbolic.xyz/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Source: https://www.hyperbolic.ai/inference (SSR HTML)
// Hyperbolic is an inference platform hosting open-source models with
// per-token USD pricing. The pricing is a single rate per M tokens,
// meaning the same rate applies to both input and output.
//
// The public inference page shows 11 text-to-text models.
// The app.hyperbolic.ai/models page (requires login) shows 25+ models
// including newer models (Qwen3-Coder-480B, DeepSeek-R1-0528, etc.)
// but those require authentication to access.
//
// Note: Hyperbolic's pricing is a single flat rate per M tokens,
// not separate input/output rates. We represent this as input == output.
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context: number;
  output: number;
  openWeights?: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  // --- Qwen ---
  "Qwen--Qwen2-VL-72B-Instruct": {
    name: "Qwen2 VL 72B Instruct",
    context: 32768,
    output: 32768,
    openWeights: true,
  },
  "Qwen--Qwen2.5-Coder-32B": {
    name: "Qwen2.5 Coder 32B",
    context: 32768,
    output: 32768,
    openWeights: true,
  },
  "Qwen--Qwen2.5-72B-Instruct": {
    name: "Qwen2.5 72B Instruct",
    context: 32768,
    output: 32768,
    openWeights: true,
  },

  // --- DeepSeek ---
  "deepseek-ai--DeepSeek-V2.5": {
    name: "DeepSeek V2.5",
    context: 163840,
    output: 163840,
    openWeights: true,
  },

  // --- Meta Llama ---
  "meta-llama--Llama-3.2-3B": {
    name: "Llama 3.2 3B",
    context: 131072,
    output: 131072,
    openWeights: true,
  },
  "meta-llama--Llama-3-70B": {
    name: "Llama 3 70B",
    context: 8192,
    output: 8192,
    openWeights: true,
  },
  "meta-llama--Llama-3.1-405B": {
    name: "Llama 3.1 405B",
    context: 131072,
    output: 131072,
    openWeights: true,
  },
  "meta-llama--Llama-3.1-70B": {
    name: "Llama 3.1 70B",
    context: 131072,
    output: 131072,
    openWeights: true,
  },
  "meta-llama--Llama-3.1-8B": {
    name: "Llama 3.1 8B",
    context: 131072,
    output: 131072,
    openWeights: true,
  },
  "meta-llama--Llama-3.1-8B-BF16-Base": {
    name: "Llama 3.1 8B BF16 Base",
    context: 131072,
    output: 131072,
    openWeights: true,
  },

  // --- NousResearch ---
  "NousResearch--Hermes-3-70B": {
    name: "Hermes 3 70B",
    context: 131072,
    output: 131072,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: https://www.hyperbolic.ai/inference (SSR HTML, accessed 2026-05-16)
//
// Note: Hyperbolic shows a single flat rate per M tokens.
// We represent this as input == output (same rate for both).
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  "Qwen--Qwen2-VL-72B-Instruct": { currency: "USD", input: 0.4, output: 0.4 },
  "Qwen--Qwen2.5-Coder-32B": { currency: "USD", input: 0.2, output: 0.2 },
  "Qwen--Qwen2.5-72B-Instruct": { currency: "USD", input: 0.4, output: 0.4 },
  "deepseek-ai--DeepSeek-V2.5": { currency: "USD", input: 2.0, output: 2.0 },
  "meta-llama--Llama-3.2-3B": { currency: "USD", input: 0.1, output: 0.1 },
  "meta-llama--Llama-3-70B": { currency: "USD", input: 0.4, output: 0.4 },
  "meta-llama--Llama-3.1-405B": { currency: "USD", input: 4.0, output: 4.0 },
  "meta-llama--Llama-3.1-70B": { currency: "USD", input: 0.4, output: 0.4 },
  "meta-llama--Llama-3.1-8B": { currency: "USD", input: 0.1, output: 0.1 },
  "meta-llama--Llama-3.1-8B-BF16-Base": { currency: "USD", input: 0.1, output: 0.1 },
  "NousResearch--Hermes-3-70B": { currency: "USD", input: 0.4, output: 0.4 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("qwen2-vl")) return "qwen-vl";
  if (id.includes("qwen2.5-coder")) return "qwen-coder";
  if (id.includes("qwen")) return "qwen";
  if (id.includes("deepseek")) return "deepseek";
  if (id.includes("llama-3.2")) return "llama-3.2";
  if (id.includes("llama-3.1-405b")) return "llama-3.1-405b";
  if (id.includes("llama-3.1-70b")) return "llama-3.1-70b";
  if (id.includes("llama-3.1-8b")) return "llama-3.1-8b";
  if (id.includes("llama-3")) return "llama-3";
  if (id.includes("hermes")) return "hermes";
  return id.split("--")[0] as string;
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
      console.warn(`  Hyperbolic: skipping ${id} — no pricing`);
      continue;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id,
      name: info.name,
      family: deriveFamily(id),
      limit: { context: info.context, output: info.output },
      modalities: { input: ["text"], output: ["text"] },
      pricing,
      release_date: today,
      last_updated: today,
    };

    if (info.openWeights) modelDef.open_weights = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Hyperbolic: ${models.length} models`);

  return { provider, models };
}
