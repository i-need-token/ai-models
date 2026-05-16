import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "regolo",
  name: "Regolo AI",
  url: "https://regolo.ai",
  api_docs: "https://regolo.ai/docs",
  apis: {
    openai: "https://api.regolo.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic scrape from Regolo AI homepage + API
//
// Source: https://regolo.ai (homepage embeds model data JSON in script tag)
// Source: https://api.regolo.ai/v1/models (public, no auth required)
//
// Regolo AI is a European inference platform hosting models from other providers
// (Swiss AI Initiative, OpenAI, Google, Meta, MiniMax, Mistral, Alibaba/Qwen)
// with EUR per-token pricing.
//
// Pricing: Homepage JSON provides per-token costs; converted to per-million-token (×1e6)
// Context lengths: Homepage JSON provides max_input_tokens and max_output_tokens
// Features: Homepage JSON provides supports_vision, supports_function_calling,
//           supports_reasoning, supported_openai_params
// Model IDs: flat format (no "/" separator)
// ---------------------------------------------------------------------------

interface RegoloModel {
  model_group: string;
  providers: string[];
  max_tokens: number | null;
  quantization: string | null;
  max_input_tokens: number | null;
  max_output_tokens: number | null;
  input_cost_per_token: number;
  output_cost_per_token: number;
  mode: string;
  supports_parallel_function_calling: boolean;
  supports_vision: boolean;
  supports_web_search: boolean;
  supports_reasoning: boolean;
  supports_function_calling: boolean;
  supports_audio_input: boolean | null;
  supports_video_understanding: boolean;
  supported_openai_params: string[];
  description: string;
}

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  if (lower.includes("apertus")) return "apertus";
  if (lower.includes("gpt-oss")) return "gpt-oss";
  if (lower.includes("gemma")) return "gemma";
  if (lower.includes("llama-3.3")) return "llama-3.3";
  if (lower.includes("llama-3.1")) return "llama-3.1";
  if (lower.includes("minimax")) return "minimax";
  if (lower.includes("mistral-small-4")) return "mistral-small";
  if (lower.includes("mistral-small3")) return "mistral-small";
  if (lower.includes("qwen3-coder")) return "qwen-coder";
  if (lower.includes("qwen3.6")) return "qwen3.6";
  if (lower.includes("qwen3.5")) return "qwen3.5";
  if (lower.includes("qwen3")) return "qwen3";
  return "other";
}

// ---------------------------------------------------------------------------
// Modality mapping
// ---------------------------------------------------------------------------

function mapInputModalities(m: RegoloModel): ModelModality[] {
  const result: ModelModality[] = ["text"];
  if (m.supports_vision) result.push("image");
  return result;
}

function mapOutputModalities(): ModelModality[] {
  return ["text"];
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

  // Fetch homepage HTML to extract embedded model data JSON
  const homeResponse = await fetch("https://regolo.ai");
  if (!homeResponse.ok) {
    throw new Error(`Failed to fetch Regolo homepage: ${homeResponse.status}`);
  }

  const html = await homeResponse.text();

  // Extract the regolo_model_list JSON from the embedded script
  const idx = html.indexOf("regolo_model_list");
  if (idx < 0) {
    throw new Error("Could not find regolo_model_list in homepage HTML");
  }

  const jsonStart = html.indexOf("{", idx);
  let depth = 0;
  let jsonEnd = jsonStart;
  for (let j = jsonStart; j < Math.min(html.length, jsonStart + 100000); j++) {
    if (html[j] === "{") depth += 1;
    else if (html[j] === "}") {
      depth -= 1;
      if (depth === 0) {
        jsonEnd = j + 1;
        break;
      }
    }
  }

  const jsonStr = html.slice(jsonStart, jsonEnd);
  const modelData = JSON.parse(jsonStr) as { json: RegoloModel[] };
  const apiModels = modelData.json;

  for (const m of apiModels) {
    // Only process chat models (skip embedding, OCR, STT, image, reranker)
    if (m.mode !== "chat") continue;

    // Skip semantic router (brick-v1-beta is not a real model)
    if (m.model_group === "brick-v1-beta") continue;

    // Skip models with no context length data
    if (m.max_input_tokens === null || m.max_output_tokens === null) {
      console.warn(`  Skipping ${m.model_group}: no context length data`);
      continue;
    }

    // Convert pricing: per-token → per-million-token (×1e6), rounded to avoid floating-point noise
    const rawInput = m.input_cost_per_token * 1_000_000;
    const rawOutput = m.output_cost_per_token * 1_000_000;

    // Use FreePricing for zero-cost models
    let pricing: Pricing;
    if (rawInput === 0 && rawOutput === 0) {
      pricing = { unit: "free" };
    } else {
      pricing = {
        currency: "EUR",
        input: Math.round(rawInput * 1e6) / 1e6,
        output: Math.round(rawOutput * 1e6) / 1e6,
      };
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: m.model_group,
      name: m.model_group,
      family: deriveFamily(m.model_group),
      temperature: true,
      limit: {
        context: m.max_input_tokens as number,
        output: m.max_output_tokens as number,
      },
      modalities: {
        input: mapInputModalities(m),
        output: mapOutputModalities(),
      },
      pricing,
      release_date: today,
      last_updated: today,
    };

    // Map features from model data
    if (m.supports_function_calling || m.supports_parallel_function_calling) {
      modelDef.tool_call = true;
    }
    if (m.supports_reasoning) modelDef.reasoning = true;
    if (m.supported_openai_params.includes("response_format")) {
      modelDef.structured_output = true;
    }

    models.push(defineModel(modelDef));
  }

  console.log(`  Regolo: ${models.length} models`);

  return { provider, models };
}
