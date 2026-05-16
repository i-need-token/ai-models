import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "neuralwatt",
  name: "NeuralWatt",
  url: "https://neuralwatt.com",
  api_docs: "https://neuralwatt.com/docs",
  apis: {
    openai: "https://api.neuralwatt.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic scrape from NeuralWatt API
//
// Source: https://api.neuralwatt.com/v1/models (first-party, no auth required)
//
// NeuralWatt is an inference platform hosting models from other providers
// (Zhipu AI, Moonshot AI, Qwen/Alibaba, MiniMax, OpenAI, Mistral)
// with its own per-token pricing.
//
// Pricing: input_per_million / output_per_million = USD per million tokens
// Model IDs: API returns "provider/model" format; "/" is flattened to "--"
// to avoid filesystem issues.
//
// The "-fast" variants are the same base models with reasoning/thinking
// disabled for lower latency.
// ---------------------------------------------------------------------------

interface NeuralWattModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  max_model_len: number;
  metadata: {
    display_name: string;
    description: string | null;
    provider: string;
    huggingface_id: string | null;
    pricing: {
      input_per_million: number;
      output_per_million: number;
      cached_input_per_million: number | null;
      cached_output_per_million: number | null;
      currency: string;
      pricing_tbd: boolean;
    };
    capabilities: {
      tools: boolean;
      json_mode: boolean;
      vision: boolean;
      reasoning: boolean;
      reasoning_effort: boolean;
      streaming: boolean;
      system_role: boolean;
      developer_role: boolean;
    };
    limits: {
      max_context_length: number;
      max_output_tokens: number | null;
      max_images: number | null;
    };
    deprecated: boolean;
    deprecated_message: string | null;
  };
}

// ---------------------------------------------------------------------------
// Modality mapping
// ---------------------------------------------------------------------------

function mapInputModalities(meta: NeuralWattModel["metadata"]): ModelModality[] {
  const result: ModelModality[] = ["text"];
  if (meta.capabilities.vision) {
    result.push("image");
  }
  return result;
}

function mapOutputModalities(_meta: NeuralWattModel["metadata"]): ModelModality[] {
  return ["text"];
}

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  if (lower.includes("glm")) return "glm";
  if (lower.includes("kimi")) return "kimi";
  if (lower.includes("qwen3-coder") || lower.includes("qwen3-coder")) return "qwen-coder";
  if (lower.includes("qwen3.6")) return "qwen3.6";
  if (lower.includes("qwen3.5")) return "qwen3.5";
  if (lower.includes("qwen")) return "qwen";
  if (lower.includes("minimax")) return "minimax";
  if (lower.includes("gpt-oss")) return "gpt-oss";
  if (lower.includes("devstral")) return "devstral";
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

  // Fetch model list from NeuralWatt API
  const response = await fetch("https://api.neuralwatt.com/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch NeuralWatt models: ${response.status}`);
  }

  const data = (await response.json()) as { data: NeuralWattModel[] };
  const apiModels = data.data;

  for (const m of apiModels) {
    const meta = m.metadata;
    if (!meta) continue;

    // Skip deprecated models
    if (meta.deprecated) continue;

    // Flatten "/" to "--" in model ID to avoid filesystem issues
    const flatId = m.id.replace(/\//g, "--");

    const pricing: Pricing = {
      currency: "USD",
      input: meta.pricing.input_per_million,
      output: meta.pricing.output_per_million,
    };

    const ctxLen = meta.limits.max_context_length || m.max_model_len || 0;
    const maxOut = meta.limits.max_output_tokens || Math.min(ctxLen, 16384);

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: flatId,
      name: meta.display_name || m.id,
      family: deriveFamily(flatId),
      temperature: true,
      limit: { context: ctxLen, output: maxOut },
      modalities: {
        input: mapInputModalities(meta),
        output: mapOutputModalities(meta),
      },
      pricing,
      release_date: today,
      last_updated: today,
    };

    if (meta.capabilities.tools) modelDef.tool_call = true;
    if (meta.capabilities.reasoning) modelDef.reasoning = true;
    if (meta.capabilities.json_mode) modelDef.structured_output = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  NeuralWatt: ${models.length} models`);

  return { provider, models };
}
