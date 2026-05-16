import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "ovhcloud",
  name: "OVHcloud AI Endpoints",
  url: "https://www.ovhcloud.com/en/public-cloud/ai-endpoints/",
  api_docs: "https://docs.ovh.com/gb/en/publiccloud/ai/endpoints/",
  apis: {
    openai: "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic scrape from OVHcloud AI Endpoints API
//
// Source: https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/models
//         (first-party, no auth required)
//
// OVHcloud AI Endpoints is a European inference platform hosting open-source
// models from Meta, Mistral, Qwen/Alibaba, OpenAI (GPT-OSS), BAAI with
// per-token USD pricing.
//
// Pricing: API returns per-token values; converted to per-million-token (× 1e6)
// Context lengths: API provides context_length and max_completion_tokens
// Model IDs: No "/" in IDs, no flattening needed
// ---------------------------------------------------------------------------

interface OvhcloudPricing {
  currency_unit: string;
  prompt: string;
  completion: string;
  image: string;
  request: string;
  input_cache_reads: string;
  input_cache_writes: string;
}

interface OvhcloudModel {
  id: string;
  created: number;
  object: string;
  owned_by: string;
  pricing: OvhcloudPricing;
  context_length: number;
  max_completion_tokens: number;
}

// ---------------------------------------------------------------------------
// Reasoning models (models that support thinking/reasoning mode)
// ---------------------------------------------------------------------------

const REASONING_MODELS: Set<string> = new Set([
  "Qwen3-32B",
  "Qwen3-Coder-30B-A3B-Instruct",
  "Qwen3.5-9B",
  "gpt-oss-120b",
  "gpt-oss-20b",
]);

// ---------------------------------------------------------------------------
// Tool call support (models known to support tool/function calling)
// ---------------------------------------------------------------------------

const TOOL_CALL_MODELS: Set<string> = new Set([
  "Mistral-Small-3.2-24B-Instruct-2506",
  "gpt-oss-120b",
  "gpt-oss-20b",
  "Qwen3-Coder-30B-A3B-Instruct",
  "Qwen3.5-9B",
  "Qwen3-32B",
]);

// ---------------------------------------------------------------------------
// Vision models (models that accept image input)
// ---------------------------------------------------------------------------

const VISION_MODELS: Set<string> = new Set(["Qwen2.5-VL-72B-Instruct"]);

// ---------------------------------------------------------------------------
// Structured output models
// ---------------------------------------------------------------------------

const STRUCTURED_OUTPUT_MODELS: Set<string> = new Set([
  "Mistral-Small-3.2-24B-Instruct-2506",
  "gpt-oss-120b",
  "gpt-oss-20b",
  "Qwen3-Coder-30B-A3B-Instruct",
  "Qwen3.5-9B",
  "Qwen3-32B",
]);

// ---------------------------------------------------------------------------
// Modality mapping
// ---------------------------------------------------------------------------

function mapInputModalities(id: string): ModelModality[] {
  const result: ModelModality[] = ["text"];
  if (VISION_MODELS.has(id)) {
    result.push("image");
  }
  return result;
}

function mapOutputModalities(): ModelModality[] {
  return ["text"];
}

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  if (lower.includes("gpt-oss")) return "gpt-oss";
  if (lower.includes("qwen3-coder")) return "qwen-coder";
  if (lower.includes("qwen3.5")) return "qwen3.5";
  if (lower.includes("qwen3")) return "qwen3";
  if (lower.includes("qwen2.5-vl")) return "qwen2.5-vl";
  if (lower.includes("mistral-small")) return "mistral-small";
  if (lower.includes("mistral-nemo")) return "mistral-nemo";
  if (lower.includes("mistral-7b")) return "mistral";
  if (lower.includes("llama-3.3") || lower.includes("llama-3_3")) return "llama-3.3";
  if (lower.includes("llama-3.1")) return "llama-3.1";
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

  // Fetch model list from OVHcloud AI Endpoints API
  const response = await fetch("https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch OVHcloud models: ${response.status}`);
  }

  const data = (await response.json()) as { data: OvhcloudModel[] };
  const apiModels = data.data;

  for (const m of apiModels) {
    // Skip non-chat models (embedding, image gen, speech, guard, special)
    if (m.max_completion_tokens === 0 && m.context_length === 0) continue;
    if (m.max_completion_tokens === 0) continue; // embedding models
    if (m.id.toLowerCase().includes("guard")) continue; // guard models
    if (m.id === "ppl") continue; // perplexity special model

    // Convert pricing: per-token → per-million-token (value × 1e6)
    // Round to avoid floating-point noise
    const rawInput = parseFloat(m.pricing.prompt) * 1_000_000;
    const rawOutput = parseFloat(m.pricing.completion) * 1_000_000;
    const inputPrice = Math.round(rawInput * 1e6) / 1e6;
    const outputPrice = Math.round(rawOutput * 1e6) / 1e6;

    // Skip free models (guard models, etc.)
    if (inputPrice === 0 && outputPrice === 0) continue;

    const pricing: Pricing = {
      currency: "USD",
      input: inputPrice,
      output: outputPrice,
    };

    const ctxLen = m.context_length;
    const maxOut = m.max_completion_tokens;

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: m.id,
      name: m.id,
      family: deriveFamily(m.id),
      open_weights: true,
      temperature: true,
      limit: { context: ctxLen, output: maxOut },
      modalities: {
        input: mapInputModalities(m.id),
        output: mapOutputModalities(),
      },
      pricing,
      release_date: today,
      last_updated: today,
    };

    if (REASONING_MODELS.has(m.id)) modelDef.reasoning = true;
    if (TOOL_CALL_MODELS.has(m.id)) modelDef.tool_call = true;
    if (STRUCTURED_OUTPUT_MODELS.has(m.id)) modelDef.structured_output = true;
    if (VISION_MODELS.has(m.id)) modelDef.attachment = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  OVHcloud: ${models.length} models`);

  return { provider, models };
}
