import { defineProvider, runPipeline } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type {
  ScrapePipeline,
  DiscoveredModel,
  ExtractedLimit,
  ExtractedFeatures,
  ExtractedDates,
} from "../../scripts/lib/index";
import type { Pricing } from "../../types/index";

const provider = defineProvider({
  id: "friendli",
  name: "FriendliAI",
  url: "https://friendli.ai",
  api_docs: "https://docs.friendli.ai",
  apis: {
    openai: "https://api.friendli.ai/serverless/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from FriendliAI API)
// ---------------------------------------------------------------------------

interface FriendliModel {
  id: string;
  name: string;
  max_completion_tokens: number;
  context_length: number;
  functionality: {
    tool_call: boolean;
    builtin_tool: boolean;
    parallel_tool_call: boolean;
    structured_output: boolean;
  };
  pricing: {
    input: number;
    output: number;
    prompt: number;
    completion: number;
    response_time: number;
    unit_type: string;
    input_cache_read?: number;
  };
  hugging_face_url: string;
  description: string;
  license: string;
  policy: string;
  created: number;
}

// ---------------------------------------------------------------------------
// API fetch helper
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<FriendliModel[]> {
  const response = await fetch("https://api.friendli.ai/serverless/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch FriendliAI models: ${response.status}`);
  }
  const data = (await response.json()) as { data: FriendliModel[] };
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
      url: "https://api.friendli.ai/serverless/v1/models",
      type: "api",
      description:
        "FriendliAI Serverless models API — returns model list with pricing, context, capabilities",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
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
      url: "https://api.friendli.ai/serverless/v1/models",
      type: "api",
      description: "Pricing from FriendliAI API — per-million-token USD pricing with cache_read",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      for (const m of models) {
        const raw = m.raw as FriendliModel;
        if (!raw) continue;

        const p: Pricing = {
          currency: "USD",
          input: raw.pricing.input,
          output: raw.pricing.output,
        };

        if (raw.pricing.input_cache_read !== undefined && raw.pricing.input_cache_read > 0) {
          p.cache_read = Math.round(raw.pricing.input_cache_read * 1e6) / 1e6;
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
      url: "https://api.friendli.ai/serverless/v1/models",
      type: "api",
      description: "Dates from FriendliAI API — created timestamp field (Unix epoch seconds)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as FriendliModel;
        if (!raw) continue;

        if (raw.created > 0) {
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
      url: "https://api.friendli.ai/serverless/v1/models",
      type: "api",
      description:
        "Context window and max output from FriendliAI API — context_length and max_completion_tokens",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();

      for (const m of models) {
        const raw = m.raw as FriendliModel;
        if (!raw) continue;

        if (raw.context_length > 0) {
          limitsMap.set(m.id, {
            context: raw.context_length,
            output: raw.max_completion_tokens,
          });
        }
      }

      return limitsMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 5: Extract features from API
  // -----------------------------------------------------------------------
  extractFeatures: {
    source: {
      url: "https://api.friendli.ai/serverless/v1/models",
      type: "api",
      description: "Features from FriendliAI API — tool_call and structured_output capabilities",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();

      for (const m of models) {
        const raw = m.raw as FriendliModel;
        if (!raw) continue;

        const func = raw.functionality;
        const features: ExtractedFeatures = {};

        if (func.tool_call) features.tool_call = true;
        if (func.structured_output) features.structured_output = true;

        featuresMap.set(m.id, features);
      }

      return featuresMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 6: Derive name from model ID
  // -----------------------------------------------------------------------
  deriveName: {
    execute: (modelId: string): string => {
      // FriendliAI model IDs are like "provider/model-name"
      // After flattening: "provider--model-name"
      let name = modelId.replace(/--/g, "/").split("/").pop() || modelId;

      // Smart formatting
      name = name.replace(/-/g, " ").replace(/\b([a-z])/g, (c) => c.toUpperCase());

      return name;
    },
  },

  // -----------------------------------------------------------------------
  // Step 7: Derive family from model ID
  // -----------------------------------------------------------------------
  deriveFamily: {
    execute: (modelId: string): string => {
      const lower = modelId.toLowerCase();
      const familyRules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /llama/i, family: "llama" },
        { pattern: /glm/i, family: "glm" },
        { pattern: /minimax/i, family: "minimax" },
        { pattern: /exaone/i, family: "exaone" },
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
