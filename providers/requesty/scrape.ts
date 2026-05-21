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
  id: "requesty",
  name: "Requesty",
  url: "https://requesty.ai",
  apis: {
    openai: "https://router.requesty.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Requesty API)
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

// ---------------------------------------------------------------------------
// API fetch helper
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<RequestyModel[]> {
  const response = await fetch("https://router.requesty.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Requesty models: ${response.status}`);
  }
  const data = (await response.json()) as { data: RequestyModel[] };
  return data.data;
}

function toPerMTokens(perToken: number): number {
  if (perToken === 0) return 0;
  const perMTokens = perToken * 1e6;
  return Math.round(perMTokens * 1e6) / 1e6;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://router.requesty.ai/v1/models",
      type: "api",
      description: "Requesty models API — returns model list with pricing, context, capabilities",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];
      for (const m of apiModels) {
        if (m.id.includes("@")) continue;
        if (m.id.startsWith("coding/")) continue;
        if (m.input_price === 0 && m.output_price === 0) continue;
        const flatId = m.id.replace(/\//g, "--").toLowerCase();
        discovered.push({ id: flatId, raw: m });
      }
      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://router.requesty.ai/v1/models",
      type: "api",
      description: "Pricing from Requesty API — per-token USD pricing converted to per-million",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();
      for (const m of models) {
        const raw = m.raw as RequestyModel;
        if (!raw) continue;
        const p: Pricing = {
          currency: "USD",
          input: toPerMTokens(raw.input_price),
          output: toPerMTokens(raw.output_price),
        };
        if (raw.cached_price > 0) p.cache_read = toPerMTokens(raw.cached_price);
        if (raw.caching_price > 0) p.cache_write = toPerMTokens(raw.caching_price);
        pricingMap.set(m.id, p);
      }
      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: "https://router.requesty.ai/v1/models",
      type: "api",
      description: "Dates from Requesty API — created timestamp field",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();
      for (const m of models) {
        const raw = m.raw as RequestyModel;
        if (!raw || !raw.created) continue;
        const d = new Date(raw.created * 1000);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        datesMap.set(m.id, { release_date: dateStr, last_updated: dateStr });
      }
      return datesMap;
    },
  },

  extractLimits: {
    source: {
      url: "https://router.requesty.ai/v1/models",
      type: "api",
      description: "Context window and max output from Requesty API",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();
      for (const m of models) {
        const raw = m.raw as RequestyModel;
        if (!raw) continue;
        if (raw.context_window > 0) {
          limitsMap.set(m.id, {
            context: raw.context_window,
            ...(raw.max_output_tokens > 0 ? { output: raw.max_output_tokens } : {}),
          });
        }
      }
      return limitsMap;
    },
  },

  extractModalities: {
    source: {
      url: "https://router.requesty.ai/v1/models",
      type: "api",
      description: "Modalities from Requesty API — supports_vision field",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();
      for (const m of models) {
        const raw = m.raw as RequestyModel;
        if (!raw) continue;
        const input: ModelModality[] = ["text"];
        if (raw.supports_vision) input.push("image");
        modalitiesMap.set(m.id, { input });
      }
      return modalitiesMap;
    },
  },

  extractFeatures: {
    source: {
      url: "https://router.requesty.ai/v1/models",
      type: "api",
      description: "Features from Requesty API — supports_tool_calling, supports_reasoning",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();
      for (const m of models) {
        const raw = m.raw as RequestyModel;
        if (!raw) continue;
        const features: ExtractedFeatures = {};
        if (raw.supports_tool_calling) features.tool_call = true;
        if (raw.supports_reasoning) features.reasoning = true;
        featuresMap.set(m.id, features);
      }
      return featuresMap;
    },
  },

  deriveName: {
    execute: (modelId: string): string => {
      let name = modelId.replace(/--/g, "/").split("/").pop() || modelId;
      name = name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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
      if (prov === "openai" || prov === "openai-responses") {
        if (model.startsWith("gpt-4o") || model.startsWith("gpt-4") || model.startsWith("gpt-5"))
          return "gpt";
        if (model.startsWith("o3") || model.startsWith("o4")) return "o";
        return "gpt";
      }
      if (prov === "google") {
        if (model.startsWith("gemini")) return "gemini";
        if (model.startsWith("gemma")) return "gemma";
        return "google";
      }
      if (prov === "deepseek") return "deepseek";
      if (prov === "xai") return "grok";
      if (prov === "mistral") return "mistral";
      if (prov === "alibaba") return "qwen";
      if (prov === "moonshot") return "kimi";
      if (prov === "zai") return "glm";
      if (prov === "perplexity") return "sonar";
      return prov;
    },
  },
};

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);
  return { provider, models };
}
