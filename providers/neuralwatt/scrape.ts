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
  id: "neuralwatt",
  name: "NeuralWatt",
  url: "https://neuralwatt.com",
  api_docs: "https://neuralwatt.com/docs",
  apis: {
    openai: "https://api.neuralwatt.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from NeuralWatt API)
// ---------------------------------------------------------------------------

interface NeuralWattModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  max_model_len: number;
  metadata: {
    display_name: string;
    description: string | null;
    provider: string;
    huggingface_id: string | null;
    pricing: {
      input_per_million: number;
      output_per_million: number;
      cached_input_per_million: number | null;
      cached_output_per_million: number | null;
      currency: string;
      pricing_tbd: boolean;
    };
    capabilities: {
      tools: boolean;
      json_mode: boolean;
      vision: boolean;
      reasoning: boolean;
      reasoning_effort: boolean;
      streaming: boolean;
      system_role: boolean;
      developer_role: boolean;
    };
    limits: {
      max_context_length: number;
      max_output_tokens: number | null;
      max_images: number | null;
    };
    deprecated: boolean;
    deprecated_message: string | null;
  };
}

// ---------------------------------------------------------------------------
// API fetch helper
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<NeuralWattModel[]> {
  const response = await fetch("https://api.neuralwatt.com/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch NeuralWatt models: ${response.status}`);
  }
  const data = (await response.json()) as { data: NeuralWattModel[] };
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
      url: "https://api.neuralwatt.com/v1/models",
      type: "api",
      description:
        "NeuralWatt models API — returns model list with pricing, context, capabilities, modalities",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
        const meta = m.metadata;
        if (!meta) continue;

        // Skip deprecated models
        if (meta.deprecated) continue;

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
      url: "https://api.neuralwatt.com/v1/models",
      type: "api",
      description: "Pricing from NeuralWatt API — per-million-token USD pricing with cache pricing",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      for (const m of models) {
        const raw = m.raw as NeuralWattModel;
        if (!raw) continue;

        const meta = raw.metadata;
        const p: Pricing = {
          currency: "USD",
          input: meta.pricing.input_per_million,
          output: meta.pricing.output_per_million,
        };

        if (
          meta.pricing.cached_input_per_million !== null &&
          meta.pricing.cached_input_per_million > 0
        ) {
          p.cache_read = meta.pricing.cached_input_per_million;
        }

        pricingMap.set(m.id, p);
      }

      return pricingMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 3: Extract dates from API (created timestamp)
  // -----------------------------------------------------------------------
  extractDates: {
    source: {
      url: "https://api.neuralwatt.com/v1/models",
      type: "api",
      description: "Dates from NeuralWatt API — created timestamp field",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as NeuralWattModel;
        if (!raw) continue;

        if (raw.created && raw.created > 0) {
          // created is in seconds (like OpenAI API), convert to milliseconds
          const d = new Date(raw.created * 1000);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          datesMap.set(m.id, {
            release_date: dateStr,
            last_updated: dateStr,
          });
        }
      }

      return datesMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 4: Extract limits from API
  // -----------------------------------------------------------------------
  extractLimits: {
    source: {
      url: "https://api.neuralwatt.com/v1/models",
      type: "api",
      description:
        "Context window and max output from NeuralWatt API — max_context_length and max_output_tokens",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();

      for (const m of models) {
        const raw = m.raw as NeuralWattModel;
        if (!raw) continue;

        const meta = raw.metadata;
        const ctxLen = meta.limits.max_context_length || raw.max_model_len || 0;
        const maxOut = meta.limits.max_output_tokens || 0;

        if (ctxLen > 0) {
          limitsMap.set(m.id, {
            context: ctxLen,
            ...(maxOut > 0 ? { output: maxOut } : {}),
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
      url: "https://api.neuralwatt.com/v1/models",
      type: "api",
      description: "Modalities from NeuralWatt API — vision capability determines image input",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();

      for (const m of models) {
        const raw = m.raw as NeuralWattModel;
        if (!raw) continue;

        const meta = raw.metadata;
        const inputModalities: ModelModality[] = ["text"];
        if (meta.capabilities.vision) {
          inputModalities.push("image");
        }

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
      url: "https://api.neuralwatt.com/v1/models",
      type: "api",
      description: "Features from NeuralWatt API — tools, reasoning, json_mode capabilities",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();

      for (const m of models) {
        const raw = m.raw as NeuralWattModel;
        if (!raw) continue;

        const meta = raw.metadata;
        const features: ExtractedFeatures = {};

        if (meta.capabilities.tools) features.tool_call = true;
        if (meta.capabilities.reasoning) features.reasoning = true;
        if (meta.capabilities.json_mode) features.structured_output = true;

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
      // NeuralWatt model IDs are like "provider/model-name"
      // After flattening: "provider--model-name"
      let name = modelId.replace(/--/g, "/").split("/").pop() || modelId;

      // Smart formatting
      name = name.replace(/-/g, " ").replace(/\b([a-z])/g, (c) => c.toUpperCase());

      return name;
    },
  },

  // -----------------------------------------------------------------------
  // Step 8: Derive family from model ID
  // -----------------------------------------------------------------------
  deriveFamily: {
    execute: (modelId: string): string => {
      const lower = modelId.toLowerCase();
      const familyRules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /glm/i, family: "glm" },
        { pattern: /kimi/i, family: "kimi" },
        { pattern: /qwen3-coder/i, family: "qwen-coder" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /minimax/i, family: "minimax" },
        { pattern: /gpt-oss/i, family: "gpt-oss" },
        { pattern: /devstral/i, family: "devstral" },
      ];

      for (const { pattern, family } of familyRules) {
        if (pattern.test(lower)) return family;
      }

      return lower.split("-")[0] ?? lower;
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
