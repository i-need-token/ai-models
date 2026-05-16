import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "klusterai",
  name: "Kluster AI",
  url: "https://kluster.ai",
  api_docs: "https://docs.kluster.ai",
  apis: {
    openai: "https://api.kluster.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic scrape from Kluster AI API
//
// Source: https://api.kluster.ai/v1/models (first-party, no auth required)
//
// Kluster AI is an inference platform hosting models from Mistral, DeepSeek,
// Qwen, Meta, Google, and their own klusterai turbo models, with USD per-token pricing.
//
// Pricing: API returns per-million-token values in USD (realtime pricing)
// Context lengths: API provides context_length and output_length
// Model IDs: API returns "provider/model" format; "/" is flattened to "--"
// ---------------------------------------------------------------------------

interface KlusterModel {
  id: string;
  internal_model_id: string;
  object: string;
  created: number;
  owned_by: string;
  reasoning_model: string;
  tools_supported: boolean;
  name: string;
  description: string;
  context_length: number;
  output_length: number;
  model_type: string;
  model_purpose: string;
  status: string;
  deleted: boolean;
  tags: string[];
  release_date: number;
  model_size: string;
  pricing: {
    asynchronous: {
      asap: { input: number; output: number };
      "24h": { input: number; output: number };
      "48h": { input: number; output: number };
      "72h": { input: number; output: number };
    };
    realtime: { input: number; output: number };
  };
  limits: {
    concurrent_requests: number;
    max_async_queue_size: number;
    request_limit: number;
    request_limit_time_unit: string;
  };
  image_url: string;
}

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("Magistral")) return "magistral";
  if (id.includes("Mistral-Small")) return "mistral-small";
  if (id.includes("Mistral-Nemo")) return "mistral-nemo";
  if (id.includes("DeepSeek-R1")) return "deepseek-r1";
  if (id.includes("DeepSeek-V3")) return "deepseek-v3";
  if (id.includes("Qwen3-235B")) return "qwen3";
  if (id.includes("Qwen2.5-VL")) return "qwen2.5-vl";
  if (id.includes("Llama-4-Maverick")) return "llama-4-maverick";
  if (id.includes("Llama-4-Scout")) return "llama-4-scout";
  if (id.includes("Llama-3.3")) return "llama-3.3";
  if (id.includes("Llama-3.1")) return "llama-3.1";
  if (id.includes("gemma")) return "gemma";
  return "other";
}

// ---------------------------------------------------------------------------
// Date helper
// ---------------------------------------------------------------------------

function timestampToDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getCurrentDate(): string {
  return timestampToDate(Date.now());
}

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const today = getCurrentDate();
  const models: Model[] = [];

  // Fetch model list from Kluster AI API
  const response = await fetch("https://api.kluster.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Kluster AI models: ${response.status}`);
  }

  const data = (await response.json()) as { data: KlusterModel[] };
  const apiModels = data.data;

  for (const m of apiModels) {
    // Only process chat models (skip verify, embeddings, and deleted models)
    if (m.model_purpose === "verify" || m.model_purpose === "embeddings") continue;
    if (m.deleted || m.status !== "existing") continue;

    const flatId = m.id.replace(/\//g, "--");

    // Use realtime pricing (per million tokens, USD)
    const realtimePricing = m.pricing.realtime;
    const pricing: Pricing = {
      input: realtimePricing.input,
      output: realtimePricing.output,
    };

    // Determine modalities
    const isMultimodal = m.model_purpose === "multimodal";
    const inputModalities: ModelModality[] = isMultimodal ? ["text", "image"] : ["text"];
    const outputModalities: ModelModality[] = ["text"];

    // Use release_date if available, otherwise created timestamp, otherwise today
    let releaseDate: string;
    if (m.release_date && m.release_date > 0) {
      releaseDate = timestampToDate(m.release_date);
    } else if (m.created && m.created > 0) {
      releaseDate = timestampToDate(m.created);
    } else {
      releaseDate = today;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: flatId,
      name: m.name || m.id,
      family: deriveFamily(m.id),
      temperature: true,
      limit: {
        context: m.context_length,
        output: m.output_length > 0 ? m.output_length : m.context_length,
      },
      modalities: {
        input: inputModalities,
        output: outputModalities,
      },
      pricing,
      release_date: releaseDate,
      last_updated: today,
    };

    // Tool calling
    if (m.tools_supported) modelDef.tool_call = true;

    // Reasoning
    if (m.reasoning_model === "yes" || m.reasoning_model === "optional") {
      modelDef.reasoning = true;
    }

    // Open weights for open-source models
    if (m.owned_by !== "klusterai" && m.model_purpose !== "verify") {
      modelDef.open_weights = true;
    }

    models.push(defineModel(modelDef));
  }

  console.log(`  Kluster AI: ${models.length} models`);

  return { provider, models };
}
