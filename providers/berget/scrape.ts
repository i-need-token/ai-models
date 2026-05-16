import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "berget",
  name: "Berget",
  url: "https://berget.ai",
  api_docs: "https://berget.ai/docs",
  apis: {
    openai: "https://api.berget.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic scrape from Berget API
//
// Source: https://api.berget.ai/v1/models (first-party, no auth required)
//
// Berget is a Nordic inference platform hosting models from other providers
// (OpenAI, Mistral, Zhipu AI, Moonshot AI, Google, Meta) with EUR per-token pricing.
//
// Pricing: API returns per-token values; converted to per-million-token (value × 1e6)
// Context lengths: API does not provide them; hardcoded from well-known model specs
// Model IDs: API returns "provider/model" format; "/" is flattened to "--"
// ---------------------------------------------------------------------------

interface BergetModel {
  id: string;
  name: string;
  object: string;
  created: number;
  owned_by: string;
  model_type: string;
  capabilities: {
    vision: boolean;
    function_calling: boolean;
    json_mode: boolean;
    classification: boolean;
    embeddings: boolean;
    formatted_output: boolean;
    streaming: boolean;
  };
  pricing: {
    input: number;
    output: number;
    unit: string;
    currency: string;
  };
  release_date: string;
  lifecycle_state: string;
}

// ---------------------------------------------------------------------------
// Context length overrides (API does not provide context lengths)
// ---------------------------------------------------------------------------

const CONTEXT_LENGTHS: Record<string, { context: number; output: number }> = {
  "openai/gpt-oss-120b": { context: 131072, output: 32768 },
  "mistralai/Mistral-Medium-3.5-128B": { context: 131072, output: 131072 },
  "mistralai/Mistral-Small-3.2-24B-Instruct-2506": { context: 131072, output: 131072 },
  "zai-org/GLM-4.7-FP8": { context: 204800, output: 131072 },
  "moonshotai/Kimi-K2.6": { context: 262144, output: 262144 },
  "google/gemma-4-31B-it": { context: 262144, output: 131072 },
  "meta-llama/Llama-3.3-70B-Instruct": { context: 131072, output: 131072 },
  "meta-llama/Llama-3.1-8B-Instruct": { context: 131072, output: 131072 },
};

// ---------------------------------------------------------------------------
// Reasoning overrides (API does not indicate reasoning capability)
// ---------------------------------------------------------------------------

const REASONING_MODELS: Set<string> = new Set([
  "openai/gpt-oss-120b",
  "mistralai/Mistral-Medium-3.5-128B",
  "zai-org/GLM-4.7-FP8",
  "moonshotai/Kimi-K2.6",
  "google/gemma-4-31B-it",
]);

// ---------------------------------------------------------------------------
// Modality mapping
// ---------------------------------------------------------------------------

function mapInputModalities(caps: BergetModel["capabilities"]): ModelModality[] {
  const result: ModelModality[] = ["text"];
  if (caps.vision) result.push("image");
  return result;
}

function mapOutputModalities(): ModelModality[] {
  return ["text"];
}

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("gpt-oss")) return "gpt-oss";
  if (id.includes("Mistral-Medium")) return "mistral-medium";
  if (id.includes("Mistral-Small") || id.includes("Devstral")) return "mistral-small";
  if (id.includes("GLM") || id.includes("glm")) return "glm";
  if (id.includes("Kimi") || id.includes("kimi")) return "kimi";
  if (id.includes("gemma")) return "gemma";
  if (id.includes("Llama-3.3")) return "llama-3.3";
  if (id.includes("Llama-3.1")) return "llama-3.1";
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

  // Fetch model list from Berget API
  const response = await fetch("https://api.berget.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Berget models: ${response.status}`);
  }

  const data = (await response.json()) as { data: BergetModel[] };
  const apiModels = data.data;

  for (const m of apiModels) {
    // Only process text/chat models (skip rerank, embedding, speech-to-text)
    if (m.model_type !== "text") continue;

    // Skip eval lifecycle models
    if (m.lifecycle_state === "eval") continue;

    const flatId = m.id.replace(/\//g, "--");

    // Convert pricing: per-token → per-million-token (value × 1e6), rounded to avoid floating-point noise
    const rawInput = m.pricing.input * 1_000_000;
    const rawOutput = m.pricing.output * 1_000_000;
    const pricing: Pricing = {
      currency: "EUR",
      input: Math.round(rawInput * 1e6) / 1e6,
      output: Math.round(rawOutput * 1e6) / 1e6,
    };

    // Get context lengths from overrides (API doesn't provide them)
    const ctxInfo = CONTEXT_LENGTHS[m.id];
    if (!ctxInfo) {
      console.warn(`  Skipping ${m.id}: no context length data`);
      continue;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: flatId,
      name: m.name || m.id,
      family: deriveFamily(m.id),
      temperature: true,
      limit: { context: ctxInfo.context, output: ctxInfo.output },
      modalities: {
        input: mapInputModalities(m.capabilities),
        output: mapOutputModalities(),
      },
      pricing,
      release_date: today,
      last_updated: today,
    };

    if (m.capabilities.function_calling) modelDef.tool_call = true;
    if (REASONING_MODELS.has(m.id)) modelDef.reasoning = true;
    if (m.capabilities.json_mode) modelDef.structured_output = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Berget: ${models.length} models`);

  return { provider, models };
}
