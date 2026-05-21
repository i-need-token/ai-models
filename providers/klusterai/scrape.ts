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
  id: "klusterai",
  name: "Kluster AI",
  url: "https://kluster.ai",
  api_docs: "https://docs.kluster.ai",
  apis: {
    openai: "https://api.kluster.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Kluster AI API)
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
// API fetch helper
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<KlusterModel[]> {
  const response = await fetch("https://api.kluster.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Kluster AI models: ${response.status}`);
  }
  const data = (await response.json()) as { data: KlusterModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  // -----------------------------------------------------------------------
  // Step 1: Discover models from API
  // -----------------------------------------------------------------------
  discover: {
    source: {
      url: "https://api.kluster.ai/v1/models",
      type: "api",
      description:
        "Kluster AI models API — returns model list with pricing, context, capabilities, modalities",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
        // Only process chat models (skip verify, embeddings, and deleted models)
        if (m.model_purpose === "verify" || m.model_purpose === "embeddings") continue;
        if (m.deleted || m.status !== "existing") continue;

        const flatId = m.id.replace(/\//g, "--");

        discovered.push({
          id: flatId,
          raw: m,
        });
      }

      return discovered;
    },
  },

  // -----------------------------------------------------------------------
  // Step 2: Extract pricing from API
  // -----------------------------------------------------------------------
  extractPricing: {
    source: {
      url: "https://api.kluster.ai/v1/models",
      type: "api",
      description: "Pricing from Kluster AI API — realtime per-million-token USD pricing",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      for (const m of models) {
        const raw = m.raw as KlusterModel;
        if (!raw) continue;

        const realtimePricing = raw.pricing.realtime;
        pricingMap.set(m.id, {
          currency: "USD",
          input: realtimePricing.input,
          output: realtimePricing.output,
        });
      }

      return pricingMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 3: Extract dates from API (release_date / created fields)
  // -----------------------------------------------------------------------
  extractDates: {
    source: {
      url: "https://api.kluster.ai/v1/models",
      type: "api",
      description: "Dates from Kluster AI API — release_date and created timestamp fields",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as KlusterModel;
        if (!raw) continue;

        // Use release_date if available, otherwise created timestamp
        let releaseDate: string;
        if (raw.release_date && raw.release_date > 0) {
          const d = new Date(raw.release_date);
          releaseDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        } else if (raw.created && raw.created > 0) {
          const d = new Date(raw.created);
          releaseDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        } else {
          // No date data available — omit rather than fabricate
          continue;
        }

        datesMap.set(m.id, {
          release_date: releaseDate,
          last_updated: releaseDate,
        });
      }

      return datesMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 4: Extract limits from API
  // -----------------------------------------------------------------------
  extractLimits: {
    source: {
      url: "https://api.kluster.ai/v1/models",
      type: "api",
      description:
        "Context window and max output from Kluster AI API — context_length and output_length",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();

      for (const m of models) {
        const raw = m.raw as KlusterModel;
        if (!raw) continue;

        if (raw.context_length > 0) {
          limitsMap.set(m.id, {
            context: raw.context_length,
            ...(raw.output_length > 0 ? { output: raw.output_length } : {}),
          });
        }
      }

      return limitsMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 5: Extract modalities from API
  // -----------------------------------------------------------------------
  extractModalities: {
    source: {
      url: "https://api.kluster.ai/v1/models",
      type: "api",
      description:
        "Modalities from Kluster AI API — model_purpose field determines multimodal support",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();

      for (const m of models) {
        const raw = m.raw as KlusterModel;
        if (!raw) continue;

        const isMultimodal = raw.model_purpose === "multimodal";
        const inputModalities: ModelModality[] = isMultimodal ? ["text", "image"] : ["text"];

        modalitiesMap.set(m.id, {
          input: inputModalities,
        });
      }

      return modalitiesMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 6: Extract features from API
  // -----------------------------------------------------------------------
  extractFeatures: {
    source: {
      url: "https://api.kluster.ai/v1/models",
      type: "api",
      description:
        "Features from Kluster AI API — tools_supported, reasoning_model, owned_by fields",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();

      for (const m of models) {
        const raw = m.raw as KlusterModel;
        if (!raw) continue;

        const features: ExtractedFeatures = {};

        if (raw.tools_supported) features.tool_call = true;
        if (raw.reasoning_model === "yes" || raw.reasoning_model === "optional") {
          features.reasoning = true;
        }
        if (raw.owned_by !== "klusterai" && raw.model_purpose !== "verify") {
          features.open_weights = true;
        }

        featuresMap.set(m.id, features);
      }

      return featuresMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 7: Derive name from model ID
  // -----------------------------------------------------------------------
  deriveName: {
    execute: (modelId: string): string => {
      // Kluster AI model IDs are like "provider/Model-Name"
      // After flattening: "provider--Model-Name"
      let name = modelId.replace(/--/g, "/").split("/").pop() || modelId;

      // Smart formatting: capitalize words, handle version numbers
      name = name
        .replace(/-/g, " ")
        .replace(/\b(\d+\.\d+)\b/g, "$1") // keep version numbers like 3.1
        .replace(/\b(\d+b)\b/gi, "$1") // keep size suffixes like 70B
        .replace(/\b([a-z])/g, (c) => c.toUpperCase());

      return name;
    },
  },

  // -----------------------------------------------------------------------
  // Step 8: Derive family from model ID
  // -----------------------------------------------------------------------
  deriveFamily: {
    execute: (modelId: string): string => {
      const familyRules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /Magistral/i, family: "magistral" },
        { pattern: /Mistral-Small/i, family: "mistral-small" },
        { pattern: /Mistral-Nemo/i, family: "mistral-nemo" },
        { pattern: /DeepSeek/i, family: "deepseek" },
        { pattern: /Qwen/i, family: "qwen" },
        { pattern: /Llama/i, family: "llama" },
        { pattern: /gemma/i, family: "gemma" },
      ];

      for (const { pattern, family } of familyRules) {
        if (pattern.test(modelId)) return family;
      }

      return modelId.split("-")[0] ?? modelId;
    },
  },
};

// ---------------------------------------------------------------------------
// Main scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);

  return {
    provider,
    models,
  };
}
