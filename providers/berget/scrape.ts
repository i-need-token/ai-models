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
  id: "berget",
  name: "Berget",
  url: "https://berget.ai",
  api_docs: "https://berget.ai/docs",
  apis: {
    openai: "https://api.berget.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Berget API)
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

async function fetchModels(): Promise<BergetModel[]> {
  const response = await fetch("https://api.berget.ai/v1/models");
  if (!response.ok) throw new Error(`Failed to fetch Berget models: ${response.status}`);
  const data = (await response.json()) as { data: BergetModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.berget.ai/v1/models",
      type: "api",
      description:
        "Berget models API — returns model list with pricing, capabilities, lifecycle_state",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
        if (m.model_type !== "text") continue;
        if (m.lifecycle_state === "eval") continue;

        const flatId = m.id.replace(/\//g, "--");
        discovered.push({ id: flatId, raw: m });
      }

      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://api.berget.ai/v1/models",
      type: "api",
      description: "Pricing from Berget API — per-1M-token EUR pricing",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      for (const m of models) {
        const raw = m.raw as BergetModel;
        if (!raw) continue;

        // API returns per-1M-token values already
        const rawInput = raw.pricing.input * 1_000_000;
        const rawOutput = raw.pricing.output * 1_000_000;

        pricingMap.set(m.id, {
          currency: "EUR",
          input: Math.round(rawInput * 1e6) / 1e6,
          output: Math.round(rawOutput * 1e6) / 1e6,
        });
      }

      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: "https://api.berget.ai/v1/models",
      type: "api",
      description: "Dates from Berget API — release_date field",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as BergetModel;
        if (!raw) continue;

        if (raw.release_date) {
          datesMap.set(m.id, { release_date: raw.release_date, last_updated: raw.release_date });
        }
      }

      return datesMap;
    },
  },

  extractLimits: {
    source: {
      url: "https://api.berget.ai/v1/models",
      type: "api",
      description: "Berget API (context/output limits not available from API — omitted)",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();
      // API does not provide context/output limits — omit
      return limitsMap;
    },
  },

  extractModalities: {
    source: {
      url: "https://api.berget.ai/v1/models",
      type: "api",
      description: "Modalities from Berget API — capabilities.vision boolean",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();

      for (const m of models) {
        const raw = m.raw as BergetModel;
        if (!raw) continue;

        const input: ModelModality[] = ["text"];
        if (raw.capabilities.vision) input.push("image");
        modalitiesMap.set(m.id, { input });
      }

      return modalitiesMap;
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.berget.ai/v1/models",
      type: "api",
      description:
        "Features from Berget API — capabilities (function_calling, json_mode) + reasoning overrides",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();

      for (const m of models) {
        const raw = m.raw as BergetModel;
        if (!raw) continue;

        const features: ExtractedFeatures = {};
        if (raw.capabilities.function_calling) features.tool_call = true;
        if (raw.capabilities.json_mode) features.structured_output = true;

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
      const lower = modelId.toLowerCase();
      if (lower.includes("gpt-oss")) return "gpt-oss";
      if (lower.includes("mistral-medium")) return "mistral-medium";
      if (lower.includes("mistral-small") || lower.includes("devstral")) return "mistral-small";
      if (lower.includes("glm")) return "glm";
      if (lower.includes("kimi")) return "kimi";
      if (lower.includes("gemma")) return "gemma";
      if (lower.includes("llama-3.3") || lower.includes("llama-3.1")) return "llama";
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
