import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "openrouter",
  name: "OpenRouter",
  url: "https://openrouter.ai",
  api_docs: "https://openrouter.ai/docs",
  apis: {
    openai: "https://openrouter.ai/api/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic model data (from OpenRouter public API)
//
// Sources:
// - Model list & pricing: https://openrouter.ai/api/v1/models (public API)
// - Context lengths: OpenRouter API context_length field
// - Modalities: OpenRouter API architecture.modality field
// - Max output tokens: OpenRouter API top_provider.max_completion_tokens
//
// OpenRouter is an inference platform and model router hosting models from
// 50+ providers with its own per-token pricing. Pricing shown is
// OpenRouter's per-1M-token rate (USD), which includes their markup.
// Some models have prompt caching pricing (cache_read/cache_write).
//
// Model IDs use "--" instead of "/" to avoid filesystem issues
// (OpenRouter API uses "provider/model" format).
// Free variants (:free suffix) are included with FreePricing.
// OpenRouter's own routing models (auto, bodybuilder, free, owl-alpha,
// pareto-code) are excluded as they are not distinct models.
// Models with tilde-prefix (~latest, ~exp) are excluded as routing aliases.
// ---------------------------------------------------------------------------

interface OpenRouterModel {
  id: string;
  name: string;
  context_length: number;
  architecture: {
    modality: string;
    input_modalities: string[];
    output_modalities: string[];
  };
  pricing: {
    prompt: string;
    completion: string;
    input_cache_read?: string;
    input_cache_write?: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number | null;
  };
  supported_parameters: string[];
}

const SKIP_IDS = new Set([
  "openrouter/auto",
  "openrouter/bodybuilder",
  "openrouter/free",
  "openrouter/owl-alpha",
  "openrouter/pareto-code",
]);

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
  _modalityStr: string,
  inputMods: string[],
  outputMods: string[],
): { input: ModelModality[]; output: ModelModality[] } {
  // Use explicit modality arrays if available
  const input = (inputMods.length > 0 ? inputMods : ["text"]).map(parseModality);
  const output = (outputMods.length > 0 ? outputMods : ["text"]).map(parseModality);
  return { input, output };
}

function deriveFamily(id: string): string {
  const parts = id.split("/");
  if (parts.length < 2) return "other";
  const provider = parts[0] as string;
  const model = parts[1] as string;

  if (provider === "anthropic") return "claude";
  if (provider === "openai") {
    if (model.startsWith("gpt-4")) return "gpt-4";
    if (model.startsWith("gpt-4o")) return "gpt-4o";
    if (model.startsWith("gpt-3.5")) return "gpt-3.5";
    if (model.startsWith("o1")) return "o1";
    if (model.startsWith("o3")) return "o3";
    if (model.startsWith("o4")) return "o4";
    if (model.startsWith("gpt-oss")) return "gpt-oss";
    return "gpt";
  }
  if (provider === "google") {
    if (model.startsWith("gemini")) return "gemini";
    if (model.startsWith("gemma")) return "gemma";
    return "google";
  }
  if (provider === "meta-llama") return "llama";
  if (provider === "deepseek") return "deepseek";
  if (provider === "mistralai") return "mistral";
  if (provider === "qwen") return "qwen";
  if (provider === "nvidia") return "nemotron";
  if (provider === "microsoft") return "phi";
  if (provider === "cohere") return "command";
  if (provider === "01-ai") return "yi";
  if (provider === "perplexity") return "sonar";
  if (provider === "x-ai") return "grok";
  if (provider === "z-ai") return "glm";
  if (provider === "moonshotai") return "kimi";
  if (provider === "minimax") return "minimax";
  if (provider === "stepfun") return "step";
  if (provider === "nousresearch") return "hermes";
  if (provider === "bytedance") return "seed";
  if (provider === "xiaomimimo") return "mimo";
  if (provider === "liquid") return "lfm";
  if (provider === "poolside") return "laguna";
  if (provider === "baidu") return "cobuddy";
  if (provider === "arcee-ai") return "arcee";
  if (provider === "cognitivecomputations") return "dolphin";
  if (provider === "sao10k") return "l3-finetune";
  if (provider === "gryphe") return "mythomax";
  if (provider === "inception") return "inception";
  if (provider === "reka") return "reka";
  if (provider === "upstage") return "solar";
  if (provider === "writer") return "palmyra";
  if (provider === "voyage") return "voyage";
  if (provider === "sarvam") return "sarvam";
  if (provider === "aion") return "aion";
  if (provider === "evroc") return "evroc";
  if (provider === "scaleway") return "scaleway";
  if (provider === "friendli") return "friendli";
  if (provider === "ibm") return "granite";
  return provider;
}

function toPerMTokens(perTokenStr: string): number {
  const perToken = parseFloat(perTokenStr);
  if (perToken === 0) return 0;
  const perMTokens = perToken * 1e6;
  return Math.round(perMTokens * 1e6) / 1e6;
}

export async function scrape(): Promise<ScrapeResult> {
  const response = await fetch("https://openrouter.ai/api/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenRouter models: ${response.status}`);
  }
  const data = (await response.json()) as { data: OpenRouterModel[] };
  const apiModels = data.data;

  const models: ReturnType<typeof defineModel>[] = [];
  const today = new Date().toISOString().split("T")[0] as string;

  for (const m of apiModels) {
    const id = m.id;

    // Skip routing models
    if (SKIP_IDS.has(id)) continue;

    // Skip tilde-prefix routing aliases
    if (id.startsWith("~")) continue;

    // Flatten ID for filesystem
    const flatId = id.replace("/", "--").replace(":", "--");

    // Parse pricing
    const promptPrice = parseFloat(m.pricing.prompt);
    const completionPrice = parseFloat(m.pricing.completion);

    // Skip models with no pricing
    if (isNaN(promptPrice) || isNaN(completionPrice)) continue;

    // Free models
    if (promptPrice === 0 && completionPrice === 0) {
      const modelDef: Parameters<typeof defineModel>[0] = {
        id: flatId,
        name: m.name,
        family: deriveFamily(id),
        limit: {
          context: m.context_length,
          output: m.top_provider.max_completion_tokens ?? 4096,
        },
        modalities: parseModalities(
          m.architecture.modality,
          m.architecture.input_modalities,
          m.architecture.output_modalities,
        ),
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
      name: m.name,
      family: deriveFamily(id),
      limit: {
        context: m.context_length,
        output: m.top_provider.max_completion_tokens ?? 4096,
      },
      modalities: parseModalities(
        m.architecture.modality,
        m.architecture.input_modalities,
        m.architecture.output_modalities,
      ),
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

  console.log(`  OpenRouter: fetched ${apiModels.length} models from API`);
  console.log(`  OpenRouter: ${models.length} valid models`);

  return { provider, models };
}
