import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "hpc-ai",
  name: "HPC-AI Cloud",
  url: "https://hpc-ai.com",
  api_docs: "https://www.hpc-ai.com/doc/docs/Model-APIs/User-Guides/Quickstart/",
  apis: {
    openai: "https://api.hpc-ai.com/inference/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Source: https://hpc-ai.com/pricing (SSR HTML, browser-verified)
// Model detail pages: https://hpc-ai.com/models/{provider}/{model}
// API docs: https://www.hpc-ai.com/doc/docs/Model-APIs/User-Guides/Quickstart/
//
// HPC-AI Cloud is a GPU cloud platform that also offers serverless Model APIs
// with per-token USD pricing. The pricing page lists 11 LLM models with
// clear input/output/cache_read rates per million tokens.
//
// Model IDs use provider/model format (e.g., deepseek/deepseek-v4-pro).
// In YAML filenames and id fields, / is flattened to --.
//
// Context window data:
// - DeepSeek V4 Pro/Flash: 1M (confirmed from model page)
// - MiMo V2.5/V2.5 Pro: 1M (confirmed from model page)
// - Kimi K2.5/K2.6: 262144 (from moonshotai provider catalog)
// - MiniMax M2.5: 204800 (from minimax provider catalog)
// - GLM 5.1: 200000 (from zhipuai provider catalog, glm-5.1)
// - Qwen3.5 models: not yet available in our catalog or on HPC-AI model pages;
//   limit field omitted per project rule (never fabricate missing data)
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  context?: number;
  output?: number;
  openWeights?: boolean;
  reasoning?: boolean;
  toolCall?: boolean;
  modalities?: { input: ModelModality[]; output: ModelModality[] };
}

const MODELS: Record<string, ModelInfo> = {
  // --- DeepSeek ---
  "deepseek--deepseek-v4-pro": {
    name: "DeepSeek V4 Pro",
    context: 1000000,
    output: 1000000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "deepseek--deepseek-v4-flash": {
    name: "DeepSeek V4 Flash",
    context: 1000000,
    output: 1000000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },

  // --- Xiaomi ---
  "xiaomi--mimo-v2.5-pro": {
    name: "MiMo V2.5 Pro",
    context: 1048576,
    output: 1048576,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },
  "xiaomi--mimo-v2.5": {
    name: "MiMo V2.5",
    context: 1048576,
    output: 1048576,
    openWeights: true,
    reasoning: true,
    toolCall: true,
    modalities: { input: ["text", "image", "video", "audio"], output: ["text"] },
  },

  // --- MoonshotAI ---
  "moonshotai--kimi-k2.6": {
    name: "Kimi K2.6",
    context: 262144,
    output: 262144,
    openWeights: true,
    reasoning: true,
    toolCall: true,
    modalities: { input: ["text", "image"], output: ["text"] },
  },
  "moonshotai--kimi-k2.5": {
    name: "Kimi K2.5",
    context: 262144,
    output: 262144,
    openWeights: true,
    reasoning: true,
    toolCall: true,
    modalities: { input: ["text", "image"], output: ["text"] },
  },

  // --- Z.ai (ZhipuAI) ---
  "zai--glm-5.1": {
    name: "GLM 5.1",
    context: 200000,
    output: 200000,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },

  // --- MiniMax ---
  "minimax--minimax-m2.5": {
    name: "MiniMax M2.5",
    context: 204800,
    output: 204800,
    openWeights: true,
    reasoning: true,
    toolCall: true,
  },

  // --- Qwen ---
  "qwen--qwen3.5-397b-a17b": {
    name: "Qwen3.5 397B A17B",
    openWeights: true,
    reasoning: true,
    toolCall: true,
    // Context window not yet verified; limit omitted
  },
  "qwen--qwen3.5-35b-a3b": {
    name: "Qwen3.5 35B A3B",
    openWeights: true,
    reasoning: true,
    toolCall: true,
    // Context window not yet verified; limit omitted
  },
  "qwen--qwen3.5-27b": {
    name: "Qwen3.5 27B",
    openWeights: true,
    reasoning: true,
    toolCall: true,
    // Context window not yet verified; limit omitted
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: https://hpc-ai.com/pricing (browser-verified, accessed 2026-05-16)
//
// All prices are USD per million tokens.
// "-" means no cache_read pricing available; omit the field.
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  "deepseek--deepseek-v4-pro": { currency: "USD", input: 1.74, output: 3.48, cache_read: 0.145 },
  "deepseek--deepseek-v4-flash": { currency: "USD", input: 0.14, output: 0.28, cache_read: 0.028 },
  "xiaomi--mimo-v2.5-pro": { currency: "USD", input: 1.0, output: 3.0, cache_read: 0.2 },
  "xiaomi--mimo-v2.5": { currency: "USD", input: 0.4, output: 2.0, cache_read: 0.08 },
  "moonshotai--kimi-k2.6": { currency: "USD", input: 0.95, output: 4.0, cache_read: 0.16 },
  "moonshotai--kimi-k2.5": { currency: "USD", input: 0.6, output: 3.0, cache_read: 0.1 },
  "zai--glm-5.1": { currency: "USD", input: 1.4, output: 4.4, cache_read: 0.26 },
  "minimax--minimax-m2.5": { currency: "USD", input: 0.3, output: 1.2, cache_read: 0.03 },
  "qwen--qwen3.5-397b-a17b": { currency: "USD", input: 0.6, output: 3.6 },
  "qwen--qwen3.5-35b-a3b": { currency: "USD", input: 0.25, output: 2.0 },
  "qwen--qwen3.5-27b": { currency: "USD", input: 0.3, output: 2.4 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("deepseek")) return "deepseek";
  if (id.includes("mimo")) return "mimo";
  if (id.includes("kimi")) return "kimi";
  if (id.includes("glm")) return "glm";
  if (id.includes("minimax")) return "minimax";
  if (id.includes("qwen3.5-397b")) return "qwen3.5-397b";
  if (id.includes("qwen3.5-35b")) return "qwen3.5-35b";
  if (id.includes("qwen3.5-27b")) return "qwen3.5-27b";
  if (id.includes("qwen")) return "qwen";
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
      console.warn(`  HPC-AI: skipping ${id} — no pricing`);
      continue;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id,
      name: info.name,
      family: deriveFamily(id),
      modalities: info.modalities ?? { input: ["text"], output: ["text"] },
      pricing,
      release_date: today,
      last_updated: today,
    };

    if (info.context !== undefined && info.output !== undefined) {
      modelDef.limit = { context: info.context, output: info.output };
    }

    if (info.openWeights) modelDef.open_weights = true;
    if (info.reasoning) modelDef.reasoning = true;
    if (info.toolCall) modelDef.tool_call = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  HPC-AI: ${models.length} models`);

  return { provider, models };
}
