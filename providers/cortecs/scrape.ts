import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "cortecs",
  name: "Cortecs",
  url: "https://cortecs.ai",
  api_docs: "https://docs.cortecs.ai",
  apis: {
    openai: "https://api.cortecs.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic scrape from Cortecs API
//
// Source: https://api.cortecs.ai/v1/models (no auth required)
//
// Cortecs is an inference platform hosting models from other providers
// (Alibaba, Anthropic, DeepSeek, Google, Meta, Mistral, MiniMax, Moonshot,
// NousResearch, Nvidia, OpenAI, Z.ai, Amazon, H Company, PrimeIntellect)
// with per-token EUR pricing.
//
// Pricing: input_token/output_token fields = EUR per million tokens
// Model IDs: flat format (no "/" separator)
// ---------------------------------------------------------------------------

interface CortecsModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  description: string;
  pricing: {
    input_token: number;
    output_token: number;
    currency: string;
    cache_read_cost?: number | null;
    cache_write_cost?: number | null;
  };
  context_size: number;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  if (lower.includes("deepseek")) return "deepseek";
  if (lower.includes("qwen3-coder")) return "qwen-coder";
  if (lower.includes("qwen3.6")) return "qwen3.6";
  if (lower.includes("qwen3.5")) return "qwen3.5";
  if (lower.includes("qwen3")) return "qwen3";
  if (lower.includes("qwen2.5")) return "qwen2.5";
  if (lower.includes("qwen")) return "qwen";
  if (lower.includes("llama-4")) return "llama-4";
  if (lower.includes("llama-3")) return "llama-3";
  if (lower.includes("glm")) return "glm";
  if (lower.includes("minimax")) return "minimax";
  if (lower.includes("mistral-large")) return "mistral-large";
  if (lower.includes("mistral-medium")) return "mistral-medium";
  if (lower.includes("mistral-small")) return "mistral-small";
  if (lower.includes("mistral-nemo")) return "mistral-nemo";
  if (lower.includes("ministral")) return "ministral";
  if (lower.includes("magistral")) return "magistral";
  if (lower.includes("mistral-7b")) return "mistral-7b";
  if (lower.includes("mistral")) return "mistral";
  if (lower.includes("codestral")) return "codestral";
  if (lower.includes("devstral")) return "devstral";
  if (lower.includes("pixtral")) return "pixtral";
  if (lower.includes("mixtral")) return "mixtral";
  if (lower.includes("voxtral")) return "voxtral";
  if (lower.includes("claude")) return "claude";
  if (lower.includes("gpt-5")) return "gpt-5";
  if (lower.includes("gpt-4")) return "gpt-4";
  if (lower.includes("gpt-oss")) return "gpt-oss";
  if (lower.includes("gemini")) return "gemini";
  if (lower.includes("gemma")) return "gemma";
  if (lower.includes("kimi")) return "kimi";
  if (lower.includes("hermes")) return "hermes";
  if (lower.includes("nemotron")) return "nemotron";
  if (lower.includes("nova")) return "nova";
  if (lower.includes("holo")) return "holo";
  if (lower.includes("intellect")) return "intellect";
  if (lower.includes("codellama")) return "codellama";
  return "other";
}

// ---------------------------------------------------------------------------
// Modality mapping from tags
// ---------------------------------------------------------------------------

const TAG_MODALITY_MAP: Record<string, ModelModality | undefined> = {
  Image: "image",
  Audio: "audio",
};

function mapModalities(tags: string[]): { input: ModelModality[]; output: ModelModality[] } {
  const input: ModelModality[] = ["text"];
  const output: ModelModality[] = ["text"];

  for (const tag of tags) {
    const mapped = TAG_MODALITY_MAP[tag];
    if (mapped) {
      input.push(mapped);
    }
  }

  return { input, output };
}

// ---------------------------------------------------------------------------
// Date helper
// ---------------------------------------------------------------------------

function getCurrentDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function timestampToDate(ts: number): string {
  const d = new Date(ts * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const today = getCurrentDate();
  const models: Model[] = [];

  const response = await fetch("https://api.cortecs.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Cortecs models: ${response.status}`);
  }

  const data = (await response.json()) as { data: CortecsModel[] };
  const apiModels = data.data;

  for (const m of apiModels) {
    // Skip safety-guard models with zero pricing
    if (m.pricing.input_token === 0 && m.pricing.output_token === 0) {
      console.warn(`  Skipping ${m.id}: zero pricing (safety-guard)`);
      continue;
    }

    const pricing: Pricing = {
      currency: "EUR",
      input: m.pricing.input_token,
      output: m.pricing.output_token,
    };

    // Add cache_read pricing if available and positive
    if (
      m.pricing.cache_read_cost !== undefined &&
      m.pricing.cache_read_cost !== null &&
      m.pricing.cache_read_cost > 0
    ) {
      (pricing as { cache_read?: number }).cache_read =
        Math.round(m.pricing.cache_read_cost * 1e6) / 1e6;
    }

    const modalities = mapModalities(m.tags);

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: m.id,
      name: m.id,
      family: deriveFamily(m.id),
      temperature: true,
      limit: { context: m.context_size, output: m.context_size },
      modalities,
      pricing,
      release_date: m.created > 0 ? timestampToDate(m.created) : today,
      last_updated: today,
    };

    // Map tags to features
    const tags = m.tags || [];
    if (tags.includes("Tools")) modelDef.tool_call = true;
    if (tags.includes("Reasoning")) modelDef.reasoning = true;
    if (tags.includes("Code")) {
      // Code is not a direct feature flag, but indicates coding capability
    }

    models.push(defineModel(modelDef));
  }

  console.log(`  Cortecs: ${models.length} models`);

  return { provider, models };
}
