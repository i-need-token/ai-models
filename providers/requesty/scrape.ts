import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "requesty",
  name: "Requesty",
  url: "https://requesty.ai",
  apis: {
    openai: "https://router.requesty.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic model data (from Requesty public API)
//
// Sources:
// - Model list & pricing: https://router.requesty.ai/v1/models (public API)
// - Context lengths: Requesty API context_window field
// - Max output tokens: Requesty API max_output_tokens field
// - Modalities: Requesty API supports_vision field
// - Cache pricing: Requesty API caching_price / cached_price fields
// - Capabilities: Requesty API supports_tool_calling / supports_reasoning
//
// Requesty is a gateway/router platform with 5% markup on provider pricing.
// Pricing shown is Requesty's per-1M-token rate (USD).
//
// Model IDs use "--" instead of "/" to avoid filesystem issues.
// Models with @region suffix are excluded (regional variants).
// Models with "coding/" prefix are excluded (routing models).
// ---------------------------------------------------------------------------

interface RequestyModel {
  api: string;
  id: string;
  object: string;
  created: number;
  owned_by: string;
  input_price: number;
  caching_price: number;
  cached_price: number;
  output_price: number;
  max_output_tokens: number;
  context_window: number;
  supports_caching: boolean;
  supports_vision: boolean;
  supports_computer_use: boolean;
  supports_reasoning: boolean;
  supports_image_generation: boolean;
  supports_tool_calling: boolean;
  description: string;
  privacy_comments: string;
  geolocation: string;
}

function deriveFamily(id: string): string {
  const parts = id.split("/");
  if (parts.length < 2) return "other";
  const provider = parts[0] as string;
  const model = (parts[1] as string).toLowerCase();

  if (provider === "anthropic") return "claude";
  if (provider === "openai" || provider === "openai-responses") {
    if (model.startsWith("gpt-4o")) return "gpt-4o";
    if (model.startsWith("gpt-4")) return "gpt-4";
    if (model.startsWith("gpt-3.5")) return "gpt-3.5";
    if (model.startsWith("gpt-5")) return "gpt-5";
    if (model.startsWith("o1")) return "o1";
    if (model.startsWith("o3")) return "o3";
    if (model.startsWith("o4")) return "o4";
    if (model.startsWith("chatgpt")) return "chatgpt";
    return "gpt";
  }
  if (provider === "google") {
    if (model.startsWith("gemini")) return "gemini";
    if (model.startsWith("gemma")) return "gemma";
    return "google";
  }
  if (provider === "vertex") {
    if (model.startsWith("claude")) return "claude";
    if (model.startsWith("gemini")) return "gemini";
    return "vertex";
  }
  if (provider === "azure") {
    if (model.startsWith("claude")) return "claude";
    if (model.startsWith("gpt")) return "gpt";
    return "azure";
  }
  if (provider === "bedrock") {
    if (model.startsWith("claude")) return "claude";
    return "bedrock";
  }
  if (provider === "deepseek") return "deepseek";
  if (provider === "xai") return "grok";
  if (provider === "mistral") return "mistral";
  if (provider === "together") {
    if (model.includes("llama")) return "llama";
    if (model.includes("qwen")) return "qwen";
    if (model.includes("deepseek")) return "deepseek";
    return "together";
  }
  if (provider === "fireworks") {
    if (model.includes("llama")) return "llama";
    if (model.includes("qwen")) return "qwen";
    if (model.includes("deepseek")) return "deepseek";
    return "fireworks";
  }
  if (provider === "novita") return "novita";
  if (provider === "deepinfra") {
    if (model.includes("llama")) return "llama";
    if (model.includes("qwen")) return "qwen";
    if (model.includes("deepseek")) return "deepseek";
    return "deepinfra";
  }
  if (provider === "alibaba") return "qwen";
  if (provider === "moonshot") return "kimi";
  if (provider === "minimaxi") return "minimax";
  if (provider === "perplexity") return "sonar";
  if (provider === "zai") return "glm";
  if (provider === "nebius") return "nebius";
  if (provider === "groq") return "groq";
  if (provider === "parasail") return "parasail";
  if (provider === "inceptron") return "inceptron";
  return provider;
}

function toPerMTokens(perToken: number): number {
  if (perToken === 0) return 0;
  const perMTokens = perToken * 1e6;
  return Math.round(perMTokens * 1e6) / 1e6;
}

export async function scrape(): Promise<ScrapeResult> {
  const response = await fetch("https://router.requesty.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Requesty models: ${response.status}`);
  }
  const data = (await response.json()) as { data: RequestyModel[] };
  const apiModels = data.data;

  const models: ReturnType<typeof defineModel>[] = [];
  const today = new Date().toISOString().split("T")[0] as string;

  for (const m of apiModels) {
    const id = m.id;

    // Skip models with @region suffix (regional variants)
    if (id.includes("@")) continue;

    // Skip coding/ prefix (Requesty routing models)
    if (id.startsWith("coding/")) continue;

    // Flatten ID for filesystem (lowercase, replace / with --)
    const flatId = id.replace(/\//g, "--").toLowerCase();

    // Parse pricing (already in $/token as a number)
    const inputPrice = m.input_price;
    const outputPrice = m.output_price;

    // Skip models with no pricing
    if (inputPrice === 0 && outputPrice === 0) continue;

    // Determine output limit
    const maxOut = m.max_output_tokens;
    const outputLimit = maxOut > 0 ? maxOut : 4096;

    // Parse modalities
    const inputModalities: ModelModality[] = ["text"];
    if (m.supports_vision) inputModalities.push("image");
    const outputModalities: ModelModality[] = ["text"];

    // Build pricing
    const pricing: Pricing = {
      currency: "USD",
      input: toPerMTokens(inputPrice),
      output: toPerMTokens(outputPrice),
    };

    // Add cache_read if present and non-zero
    if (m.cached_price > 0) {
      pricing.cache_read = toPerMTokens(m.cached_price);
    }

    // Add cache_write if present and non-zero
    if (m.caching_price > 0) {
      pricing.cache_write = toPerMTokens(m.caching_price);
    }

    // Derive name from ID
    const nameParts = id.split("/");
    const name = (nameParts[nameParts.length - 1] as string)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: flatId,
      name,
      family: deriveFamily(id),
      limit: {
        context: m.context_window,
        output: outputLimit,
      },
      modalities: { input: inputModalities, output: outputModalities },
      pricing,
      release_date: today,
      last_updated: today,
    };

    // Set capabilities
    if (m.supports_tool_calling) {
      modelDef.tool_call = true;
    }
    if (m.supports_reasoning) {
      modelDef.reasoning = true;
    }

    models.push(defineModel(modelDef));
  }

  console.log(`  Requesty: fetched ${apiModels.length} models from API`);
  console.log(`  Requesty: ${models.length} valid LLM models`);

  return { provider, models };
}
