import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "chutes",
  name: "Chutes",
  url: "https://chutes.ai",
  api_docs: "https://chutes.ai/docs",
  apis: {
    openai: "https://llm.chutes.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic scrape from Chutes API
//
// Source: https://llm.chutes.ai/v1/models (first-party, no auth required)
//
// Chutes is an inference platform hosting models from other providers
// (DeepSeek, Qwen/Alibaba, Meta, Google, Mistral) in Trusted Execution
// Environment (TEE) mode with per-token USD pricing.
//
// Pricing: prompt/completion fields = USD per million tokens
// Model IDs: API returns "provider/model-TEE" format; "/" is flattened to "--"
// ---------------------------------------------------------------------------

interface ChutesModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  context_length: number;
  max_output_length: number;
  input_modalities: string[];
  output_modalities: string[];
  supported_features: string[];
  is_tee: boolean;
  pricing: {
    prompt: number;
    completion: number;
    input_cache_read: number | null;
  };
}

// ---------------------------------------------------------------------------
// Modality mapping
// ---------------------------------------------------------------------------

const MODALITY_MAP: Record<string, ModelModality | undefined> = {
  text: "text",
  image: "image",
  video: "video",
  audio: "audio",
};

function mapModalities(raw: string[] | null | undefined): ModelModality[] {
  const result: ModelModality[] = [];
  if (raw && Array.isArray(raw)) {
    for (const m of raw) {
      const mapped = MODALITY_MAP[m];
      if (mapped) result.push(mapped);
    }
  }
  if (result.length === 0) result.push("text");
  return result;
}

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  if (lower.includes("deepseek")) return "deepseek";
  if (lower.includes("qwen3-coder")) return "qwen-coder";
  if (lower.includes("qwen3")) return "qwen3";
  if (lower.includes("qwen")) return "qwen";
  if (lower.includes("llama-4")) return "llama-4";
  if (lower.includes("llama-3")) return "llama-3";
  if (lower.includes("gemma")) return "gemma";
  if (lower.includes("mistral")) return "mistral";
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

  const response = await fetch("https://llm.chutes.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Chutes models: ${response.status}`);
  }

  const data = (await response.json()) as { data: ChutesModel[] };
  const apiModels = data.data;

  for (const m of apiModels) {
    // Skip models without context length info
    if (!m.context_length || m.context_length === 0) {
      console.warn(`  Skipping ${m.id}: no context length`);
      continue;
    }

    // Flatten "/" to "--" in model ID
    const flatId = m.id.replace(/\//g, "--");

    const pricing: Pricing = {
      currency: "USD",
      input: m.pricing.prompt,
      output: m.pricing.completion,
    };

    // Add cache_read pricing if available
    if (m.pricing.input_cache_read !== null && m.pricing.input_cache_read > 0) {
      (pricing as { cache_read?: number }).cache_read = m.pricing.input_cache_read;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: flatId,
      name: m.id.split("/").pop() || m.id,
      family: deriveFamily(flatId),
      temperature: true,
      limit: { context: m.context_length, output: m.max_output_length },
      modalities: {
        input: mapModalities(m.input_modalities),
        output: mapModalities(m.output_modalities),
      },
      pricing,
      release_date: today,
      last_updated: today,
    };

    const features = m.supported_features || [];
    if (features.includes("function_calling") || features.includes("tools")) {
      modelDef.tool_call = true;
    }
    if (features.includes("reasoning")) modelDef.reasoning = true;
    if (features.includes("structured_output") || features.includes("json_mode")) {
      modelDef.structured_output = true;
    }

    models.push(defineModel(modelDef));
  }

  console.log(`  Chutes: ${models.length} models`);

  return { provider, models };
}
