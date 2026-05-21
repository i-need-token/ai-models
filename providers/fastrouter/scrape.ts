import { defineProvider, runPipeline } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type {
  ScrapePipeline,
  DiscoveredModel,
  ExtractedLimit,
  ExtractedModalities,
  ExtractedFeatures,
  ExtractedDates,
} from "../../scripts/lib/index";
import type { Pricing, ModelModality } from "../../types/index";

const provider = defineProvider({
  id: "fastrouter",
  name: "FastRouter",
  url: "https://fastrouter.ai",
  apis: {
    openai: "https://api.fastrouter.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from FastRouter API)
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

function isLLMModel(modality: string): boolean {
  if (!modality.includes("->text")) return false;
  for (const nonLLM of NON_LLM_OUTPUTS) {
    if (modality.includes(`->${nonLLM}`)) return false;
  }
  return true;
}

function toPerMTokens(perTokenStr: string): number {
  const perToken = parseFloat(perTokenStr);
  if (perToken === 0) return 0;
  const perMTokens = perToken * 1e6;
  return Math.round(perMTokens * 1e6) / 1e6;
}

async function fetchModels(): Promise<FastRouterModel[]> {
  const response = await fetch("https://api.fastrouter.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch FastRouter models: ${response.status}`);
  }
  const data = (await response.json()) as { data: FastRouterModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.fastrouter.ai/v1/models",
      type: "api",
      description:
        "FastRouter models API — returns model list with pricing, context, capabilities, modalities",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];
      for (const m of apiModels) {
        if (SKIP_IDS.has(m.id)) continue;
        if (!m.is_active) continue;
        if (!isLLMModel(m.architecture.modality)) continue;
        const promptPrice = parseFloat(m.pricing.prompt);
        const completionPrice = parseFloat(m.pricing.completion);
        if (isNaN(promptPrice) || isNaN(completionPrice)) continue;
        const flatId = m.id.replace("/", "--").replace(":", "--").toLowerCase();
        discovered.push({ id: flatId, raw: m });
      }
      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://api.fastrouter.ai/v1/models",
      type: "api",
      description: "Pricing from FastRouter API — per-token USD pricing converted to per-million",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();
      for (const m of models) {
        const raw = m.raw as FastRouterModel;
        if (!raw) continue;
        const promptPrice = parseFloat(raw.pricing.prompt);
        const completionPrice = parseFloat(raw.pricing.completion);
        if (promptPrice === 0 && completionPrice === 0) {
          pricingMap.set(m.id, { unit: "free" });
        } else {
          const p: Pricing = {
            currency: "USD",
            input: toPerMTokens(raw.pricing.prompt),
            output: toPerMTokens(raw.pricing.completion),
          };
          if (raw.pricing.input_cache_read) {
            const cacheRead = toPerMTokens(raw.pricing.input_cache_read);
            if (cacheRead > 0) p.cache_read = cacheRead;
          }
          if (raw.pricing.input_cache_write) {
            const cacheWrite = toPerMTokens(raw.pricing.input_cache_write);
            if (cacheWrite > 0) p.cache_write = cacheWrite;
          }
          pricingMap.set(m.id, p);
        }
      }
      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: "https://api.fastrouter.ai/v1/models",
      type: "api",
      description: "Dates from FastRouter API — no date field available",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      return new Map<string, ExtractedDates>();
    },
  },

  extractLimits: {
    source: {
      url: "https://api.fastrouter.ai/v1/models",
      type: "api",
      description: "Context window and max output from FastRouter API",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();
      for (const m of models) {
        const raw = m.raw as FastRouterModel;
        if (!raw) continue;
        if (raw.context_length > 0) {
          const maxCompletion = raw.top_provider.max_completion_tokens;
          limitsMap.set(m.id, {
            context: raw.context_length,
            ...(maxCompletion !== null && maxCompletion > 0 ? { output: maxCompletion } : {}),
          });
        }
      }
      return limitsMap;
    },
  },

  extractModalities: {
    source: {
      url: "https://api.fastrouter.ai/v1/models",
      type: "api",
      description: "Modalities from FastRouter API — input_modalities and output_modalities arrays",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();
      for (const m of models) {
        const raw = m.raw as FastRouterModel;
        if (!raw) continue;
        const input = (
          raw.architecture.input_modalities.length > 0
            ? raw.architecture.input_modalities
            : ["text"]
        ).map(parseModality);
        const output =
          raw.architecture.output_modalities.length > 0
            ? raw.architecture.output_modalities.map(parseModality)
            : undefined;
        modalitiesMap.set(m.id, { input, ...(output ? { output } : {}) });
      }
      return modalitiesMap;
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.fastrouter.ai/v1/models",
      type: "api",
      description: "Features from FastRouter API — supported_parameters (tools, reasoning)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();
      for (const m of models) {
        const raw = m.raw as FastRouterModel;
        if (!raw) continue;
        const features: ExtractedFeatures = {};
        const params = raw.supported_parameters;
        if (params.includes("tools") || params.includes("tool_choice")) features.tool_call = true;
        if (params.includes("include_reasoning") || params.includes("reasoning"))
          features.reasoning = true;
        featuresMap.set(m.id, features);
      }
      return featuresMap;
    },
  },

  deriveName: {
    execute: (modelId: string): string => {
      let name = modelId.replace(/--/g, "/").split("/").pop() || modelId;
      name = name.replace(/-/g, " ").replace(/\b([a-z])/g, (c) => c.toUpperCase());
      return name;
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      const parts = modelId.split("--");
      if (parts.length < 2) return modelId.split("-")[0] ?? modelId;
      const prov = parts[0] as string;
      const model = (parts[1] as string).toLowerCase();
      if (prov === "anthropic") return "claude";
      if (prov === "openai") {
        if (model.startsWith("gpt-4o") || model.startsWith("gpt-4") || model.startsWith("gpt-5"))
          return "gpt";
        return "gpt";
      }
      if (prov === "google") {
        if (model.startsWith("gemini")) return "gemini";
        if (model.startsWith("gemma")) return "gemma";
        return "google";
      }
      if (prov === "meta-llama") return "llama";
      if (prov === "deepseek" || prov === "deepseek-ai") return "deepseek";
      if (prov === "mistralai") return "mistral";
      if (prov === "qwen") return "qwen";
      if (prov === "nvidia") return "nemotron";
      if (prov === "microsoft") return "phi";
      if (prov === "cohere") return "command";
      if (prov === "perplexity") return "sonar";
      if (prov === "x-ai") return "grok";
      if (prov === "z-ai") return "glm";
      return prov;
    },
  },
};

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);
  return { provider, models };
}
