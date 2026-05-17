import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "fastrouter",
  name: "FastRouter",
  url: "https://fastrouter.ai",
  apis: {
    openai: "https://api.fastrouter.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic model data (from FastRouter public API)
//
// Sources:
// - Model list & pricing: https://api.fastrouter.ai/v1/models (public API)
// - Context lengths: FastRouter API context_length field
// - Modalities: FastRouter API architecture.modality field
// - Max output tokens: FastRouter API top_provider.max_completion_tokens
// - Cache pricing: FastRouter API pricing.input_cache_read / input_cache_write
//
// FastRouter is an inference platform and model router hosting models from
// 20+ providers with per-token pricing. Pricing shown is FastRouter's
// per-1M-token rate (USD). Some models have prompt caching pricing.
//
// Model IDs use "--" instead of "/" to avoid filesystem issues
// (FastRouter API uses "provider/model" format).
// The fastrouter/auto routing model is excluded as it is not a distinct model.
// Non-LLM models (image, video, embedding, audio, classification) are excluded.
// ---------------------------------------------------------------------------

interface FastRouterModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  architecture: {
    modality: string;
    input_modalities: string[];
    output_modalities: string[];
    tokenizer: string;
  };
  pricing: {
    prompt: string;
    completion: string;
    input_cache_read: string;
    input_cache_write: string;
    internal_reasoning: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number | null;
    is_moderated: boolean;
  };
  supported_parameters: string[];
  is_active: boolean;
}

const SKIP_IDS = new Set(["fastrouter/auto"]);

// Modality strings that indicate non-LLM output types
const NON_LLM_OUTPUTS = new Set(["vector", "image", "video", "audio", "classification"]);

function parseModality(mod: string): ModelModality {
  const lower = mod.toLowerCase();
  if (lower === "text") return "text";
  if (lower === "image" || lower === "images") return "image";
  if (lower === "video" || lower === "videos") return "video";
  if (lower === "audio" || lower === "speech") return "audio";
  if (lower === "pdf" || lower === "file") return "pdf";
  return "text";
}

function parseModalities(
  inputMods: string[],
  outputMods: string[],
): { input: ModelModality[]; output: ModelModality[] } {
  const input = (inputMods.length > 0 ? inputMods : ["text"]).map(parseModality);
  const output = (outputMods.length > 0 ? outputMods : ["text"]).map(parseModality);
  return { input, output };
}

function deriveFamily(id: string): string {
  const parts = id.split("/");
  if (parts.length < 2) return "other";
  const provider = parts[0] as string;
  const model = (parts[1] as string).toLowerCase();

  if (provider === "anthropic") return "claude";
  if (provider === "openai") {
    if (model.startsWith("gpt-4o")) return "gpt-4o";
    if (model.startsWith("gpt-4")) return "gpt-4";
    if (model.startsWith("gpt-3.5")) return "gpt-3.5";
    if (model.startsWith("gpt-5")) return "gpt-5";
    if (model.startsWith("gpt-oss")) return "gpt-oss";
    if (model.startsWith("gpt-realtime")) return "gpt-realtime";
    if (model.startsWith("o1")) return "o1";
    if (model.startsWith("o3")) return "o3";
    if (model.startsWith("o4")) return "o4";
    if (model.startsWith("dall-e")) return "dall-e";
    if (model.startsWith("gpt-image")) return "gpt-image";
    return "gpt";
  }
  if (provider === "google") {
    if (model.startsWith("gemini")) return "gemini";
    if (model.startsWith("gemma")) return "gemma";
    if (model.startsWith("imagen")) return "imagen";
    if (model.startsWith("veo")) return "veo";
    return "google";
  }
  if (provider === "meta-llama") return "llama";
  if (provider === "deepseek" || provider === "deepseek-ai") return "deepseek";
  if (provider === "mistralai") return "mistral";
  if (provider === "qwen" || provider === "Qwen") return "qwen";
  if (provider === "nvidia") return "nemotron";
  if (provider === "microsoft") return "phi";
  if (provider === "cohere") return "command";
  if (provider === "perplexity") return "sonar";
  if (provider === "x-ai") return "grok";
  if (provider === "z-ai") return "glm";
  if (provider === "moonshotai") return "kimi";
  if (provider === "minimax") return "minimax";
  if (provider === "stepfun") return "step";
  if (provider === "nousresearch") return "hermes";
  if (provider === "bytedance") return "seed";
  if (provider === "sarvam") return "sarvam";
  if (provider === "inception") return "inception";
  if (provider === "upstage") return "solar";
  if (provider === "writer") return "palmyra";
  if (provider === "reka") return "reka";
  if (provider === "aion") return "aion";
  if (provider === "evroc") return "evroc";
  if (provider === "scaleway") return "scaleway";
  if (provider === "friendli") return "friendli";
  if (provider === "ibm") return "granite";
  if (provider === "black-forest-labs") return "flux";
  if (provider === "leonardo-ai") return "leonardo";
  if (provider === "kling-ai") return "kling";
  if (provider === "runway") return "runway";
  if (provider === "vidu") return "vidu";
  if (provider === "wanx") return "wanx";
  if (provider === "pika") return "pika";
  if (provider === "pollo") return "pollo";
  if (provider === "ace-step") return "ace-step";
  return provider;
}

function toPerMTokens(perTokenStr: string): number {
  const perToken = parseFloat(perTokenStr);
  if (perToken === 0) return 0;
  const perMTokens = perToken * 1e6;
  return Math.round(perMTokens * 1e6) / 1e6;
}

function isLLMModel(modality: string): boolean {
  // Must produce text output and NOT be an embedding/classification/audio/image/video model
  if (!modality.includes("->text")) return false;
  for (const nonLLM of NON_LLM_OUTPUTS) {
    if (modality.includes(`->${nonLLM}`)) return false;
  }
  return true;
}

export async function scrape(): Promise<ScrapeResult> {
  const response = await fetch("https://api.fastrouter.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch FastRouter models: ${response.status}`);
  }
  const data = (await response.json()) as { data: FastRouterModel[] };
  const apiModels = data.data;

  const models: ReturnType<typeof defineModel>[] = [];
  const today = new Date().toISOString().split("T")[0] as string;

  for (const m of apiModels) {
    const id = m.id;

    // Skip routing models
    if (SKIP_IDS.has(id)) continue;

    // Skip inactive models
    if (!m.is_active) continue;

    // Only include LLM models (text output, not embedding/image/video/audio/classification)
    const modality = m.architecture.modality;
    if (!isLLMModel(modality)) continue;

    // Flatten ID for filesystem (lowercase, replace / and : with --)
    const flatId = id.replace("/", "--").replace(":", "--").toLowerCase();

    // Trim name (some API responses have trailing spaces)
    const name = m.name.trim();

    // Parse pricing
    const promptPrice = parseFloat(m.pricing.prompt);
    const completionPrice = parseFloat(m.pricing.completion);

    // Skip models with no pricing data
    if (isNaN(promptPrice) || isNaN(completionPrice)) continue;

    // Determine output limit
    const maxCompletion = m.top_provider.max_completion_tokens;
    const outputLimit = maxCompletion !== null && maxCompletion > 0 ? maxCompletion : 4096;

    // Parse modalities
    const modalities = parseModalities(
      m.architecture.input_modalities,
      m.architecture.output_modalities,
    );

    // Free models (both prompt and completion = 0)
    if (promptPrice === 0 && completionPrice === 0) {
      const modelDef: Parameters<typeof defineModel>[0] = {
        id: flatId,
        name,
        family: deriveFamily(id),
        limit: {
          context: m.context_length,
          output: outputLimit,
        },
        modalities,
        pricing: { unit: "free" },
        release_date: today,
        last_updated: today,
      };

      models.push(defineModel(modelDef));
      continue;
    }

    // Paid models
    const pricing: Pricing = {
      currency: "USD",
      input: toPerMTokens(m.pricing.prompt),
      output: toPerMTokens(m.pricing.completion),
    };

    // Add cache_read if present and non-zero
    if (m.pricing.input_cache_read) {
      const cacheRead = toPerMTokens(m.pricing.input_cache_read);
      if (cacheRead > 0) {
        pricing.cache_read = cacheRead;
      }
    }

    // Add cache_write if present and non-zero
    if (m.pricing.input_cache_write) {
      const cacheWrite = toPerMTokens(m.pricing.input_cache_write);
      if (cacheWrite > 0) {
        pricing.cache_write = cacheWrite;
      }
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: flatId,
      name,
      family: deriveFamily(id),
      limit: {
        context: m.context_length,
        output: outputLimit,
      },
      modalities,
      pricing,
      release_date: today,
      last_updated: today,
    };

    // Check supported parameters for capabilities
    const params = m.supported_parameters;
    if (params.includes("tools") || params.includes("tool_choice")) {
      modelDef.tool_call = true;
    }
    if (params.includes("include_reasoning") || params.includes("reasoning")) {
      modelDef.reasoning = true;
    }

    models.push(defineModel(modelDef));
  }

  console.log(`  FastRouter: fetched ${apiModels.length} models from API`);
  console.log(`  FastRouter: ${models.length} valid LLM models`);

  return { provider, models };
}
