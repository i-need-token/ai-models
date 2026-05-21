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
  id: "llmgateway",
  name: "LLM Gateway",
  url: "https://llmgateway.io",
  api_docs: "https://llmgateway.io/docs",
  apis: {
    openai: "https://api.llmgateway.io/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from LLM Gateway API)
// ---------------------------------------------------------------------------

interface LLMGatewayModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  family: string;
  free: boolean;
  deprecated_at: string | null;
  deactivated_at: string | null;
  structured_outputs: boolean;
  json_output: boolean;
  architecture: {
    input_modalities: string[];
    output_modalities: string[];
    tokenizer: string;
  };
  pricing: {
    prompt: string;
    completion: string;
    image: string;
    request: string;
    input_cache_read: string;
    input_cache_write: string;
    input_cache_write_1h: string;
    web_search: string;
    internal_reasoning: string;
  };
  providers: {
    providerId: string;
    modelName: string;
    pricing: { prompt: string; completion: string; image: string };
    streaming: boolean;
    cancellation: boolean;
    tools: boolean;
    parallelToolCalls: boolean;
    reasoning: boolean;
  }[];
  supported_parameters: string[];
  stability: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SKIP_IDS = new Set(["custom", "auto"]);
const NON_LLM_OUTPUTS = new Set(["embedding", "video", "image"]);

function parseModality(mod: string): ModelModality {
  const lower = mod.toLowerCase();
  if (lower === "text") return "text";
  if (lower === "image" || lower === "images") return "image";
  if (lower === "video" || lower === "videos") return "video";
  if (lower === "audio" || lower === "speech") return "audio";
  if (lower === "pdf" || lower === "file") return "pdf";
  return "text";
}

function toPerMTokens(perTokenStr: string): number {
  const perToken = parseFloat(perTokenStr);
  if (perToken === 0 || isNaN(perToken)) return 0;
  const perMTokens = perToken * 1e6;
  return Math.round(perMTokens * 1e6) / 1e6;
}

async function fetchModels(): Promise<LLMGatewayModel[]> {
  const response = await fetch("https://api.llmgateway.io/v1/models");
  if (!response.ok) throw new Error(`Failed to fetch LLM Gateway models: ${response.status}`);
  const data = (await response.json()) as { data: LLMGatewayModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.llmgateway.io/v1/models",
      type: "api",
      description:
        "LLM Gateway models API — returns model list with pricing, context, capabilities, modalities",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
        if (SKIP_IDS.has(m.id)) continue;
        if (m.deactivated_at) continue;

        const outputMods = m.architecture.output_modalities;
        const hasTextOutput = outputMods.includes("text");
        const onlyNonLLM = outputMods.every((mod) => NON_LLM_OUTPUTS.has(mod));
        if (onlyNonLLM) continue;

        const promptPrice = parseFloat(m.pricing.prompt);
        const completionPrice = parseFloat(m.pricing.completion);
        const requestPrice = parseFloat(m.pricing.request);
        if (!hasTextOutput && promptPrice === 0 && completionPrice === 0 && requestPrice > 0)
          continue;
        if (hasTextOutput && promptPrice === 0 && completionPrice === 0 && requestPrice > 0)
          continue;
        if (isNaN(promptPrice) || isNaN(completionPrice)) continue;

        const flatId = m.id.toLowerCase();
        discovered.push({ id: flatId, raw: m });
      }

      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://api.llmgateway.io/v1/models",
      type: "api",
      description: "Pricing from LLM Gateway API — per-token USD pricing converted to per-million",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      for (const m of models) {
        const raw = m.raw as LLMGatewayModel;
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

          const cacheRead = toPerMTokens(raw.pricing.input_cache_read);
          if (cacheRead > 0) p.cache_read = cacheRead;

          const cacheWrite = toPerMTokens(raw.pricing.input_cache_write);
          if (cacheWrite > 0) p.cache_write = cacheWrite;

          pricingMap.set(m.id, p);
        }
      }

      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: "https://api.llmgateway.io/v1/models",
      type: "api",
      description: "Dates from LLM Gateway API — no date field available",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      return new Map<string, ExtractedDates>();
    },
  },

  extractLimits: {
    source: {
      url: "https://api.llmgateway.io/v1/models",
      type: "api",
      description:
        "Context window from LLM Gateway API — context_length field; output not available from API",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();

      for (const m of models) {
        const raw = m.raw as LLMGatewayModel;
        if (!raw) continue;

        if (raw.context_length > 0) {
          limitsMap.set(m.id, { context: raw.context_length });
        }
      }

      return limitsMap;
    },
  },

  extractModalities: {
    source: {
      url: "https://api.llmgateway.io/v1/models",
      type: "api",
      description:
        "Modalities from LLM Gateway API — architecture.input_modalities / output_modalities arrays",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();

      for (const m of models) {
        const raw = m.raw as LLMGatewayModel;
        if (!raw) continue;

        const input = (
          raw.architecture.input_modalities.length > 0
            ? raw.architecture.input_modalities
            : ["text"]
        ).map(parseModality);
        const output = (
          raw.architecture.output_modalities.length > 0
            ? raw.architecture.output_modalities
            : ["text"]
        ).map(parseModality);

        modalitiesMap.set(m.id, { input, output });
      }

      return modalitiesMap;
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.llmgateway.io/v1/models",
      type: "api",
      description:
        "Features from LLM Gateway API — providers.tools/reasoning + supported_parameters",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();

      for (const m of models) {
        const raw = m.raw as LLMGatewayModel;
        if (!raw) continue;

        const features: ExtractedFeatures = {};
        const hasTools =
          raw.providers.some((p) => p.tools) ||
          raw.supported_parameters.includes("tools") ||
          raw.supported_parameters.includes("tool_choice");
        const hasReasoning =
          raw.providers.some((p) => p.reasoning) ||
          raw.supported_parameters.includes("include_reasoning") ||
          raw.supported_parameters.includes("reasoning");

        if (hasTools) features.tool_call = true;
        if (hasReasoning) features.reasoning = true;

        featuresMap.set(m.id, features);
      }

      return featuresMap;
    },
  },

  deriveName: {
    execute: (modelId: string): string => {
      let name = modelId.replace(/-/g, " ").replace(/\b([a-z])/g, (c) => c.toUpperCase());
      return name;
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      const lower = modelId.toLowerCase();
      if (lower.includes("claude-opus")) return "claude-opus";
      if (lower.includes("claude-sonnet")) return "claude-sonnet";
      if (lower.includes("claude-haiku")) return "claude-haiku";
      if (lower.includes("claude")) return "claude";
      if (lower.includes("gpt-4o") || lower.includes("gpt-4") || lower.includes("gpt-5"))
        return "gpt";
      if (lower.includes("gpt-oss")) return "gpt-oss";
      if (lower.includes("o4") || lower.includes("o3") || lower.includes("o1")) return "o";
      if (lower.includes("gemini")) return "gemini";
      if (lower.includes("llama")) return "llama";
      if (lower.includes("deepseek")) return "deepseek";
      if (lower.includes("qwen")) return "qwen";
      if (lower.includes("mistral")) return "mistral";
      if (lower.includes("grok")) return "grok";
      if (lower.includes("glm")) return "glm";
      if (lower.includes("kimi")) return "kimi";
      if (lower.includes("minimax")) return "minimax";
      if (lower.includes("phi")) return "phi";
      if (lower.includes("command")) return "command";
      return lower.split("-")[0] ?? lower;
    },
  },
};

// ---------------------------------------------------------------------------
// Main scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);
  return { provider, models };
}
