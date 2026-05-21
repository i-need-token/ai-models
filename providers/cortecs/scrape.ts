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
  id: "cortecs",
  name: "Cortecs",
  url: "https://cortecs.ai",
  api_docs: "https://docs.cortecs.ai",
  apis: {
    openai: "https://api.cortecs.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Cortecs API)
// ---------------------------------------------------------------------------

interface CortecsModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  description: string;
  pricing: {
    input_token: number;
    output_token: number;
    currency: string;
    cache_read_cost?: number | null;
    cache_write_cost?: number | null;
  };
  context_size: number;
  tags: string[];
}

// ---------------------------------------------------------------------------
// API fetch helper
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<CortecsModel[]> {
  const response = await fetch("https://api.cortecs.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Cortecs models: ${response.status}`);
  }
  const data = (await response.json()) as { data: CortecsModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.cortecs.ai/v1/models",
      type: "api",
      description: "Cortecs models API — returns model list with pricing, context, tags",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];
      for (const m of apiModels) {
        if (m.pricing.input_token === 0 && m.pricing.output_token === 0) continue;
        discovered.push({ id: m.id, raw: m });
      }
      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://api.cortecs.ai/v1/models",
      type: "api",
      description: "Pricing from Cortecs API — per-million-token EUR pricing with cache_read",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();
      for (const m of models) {
        const raw = m.raw as CortecsModel;
        if (!raw) continue;
        const p: Pricing = {
          currency:
            raw.pricing.currency === "USD" ||
            raw.pricing.currency === "CNY" ||
            raw.pricing.currency === "EUR"
              ? raw.pricing.currency
              : "EUR",
          input: raw.pricing.input_token,
          output: raw.pricing.output_token,
        };
        if (raw.pricing.cache_read_cost != null && raw.pricing.cache_read_cost > 0) {
          (p as { cache_read?: number }).cache_read =
            Math.round(raw.pricing.cache_read_cost * 1e6) / 1e6;
        }
        pricingMap.set(m.id, p);
      }
      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: "https://api.cortecs.ai/v1/models",
      type: "api",
      description: "Dates from Cortecs API — created timestamp field",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();
      for (const m of models) {
        const raw = m.raw as CortecsModel;
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
      url: "https://api.cortecs.ai/v1/models",
      type: "api",
      description: "Context window from Cortecs API — context_size field",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();
      for (const m of models) {
        const raw = m.raw as CortecsModel;
        if (!raw) continue;
        if (raw.context_size > 0) {
          limitsMap.set(m.id, { context: raw.context_size });
        }
      }
      return limitsMap;
    },
  },

  extractModalities: {
    source: {
      url: "https://api.cortecs.ai/v1/models",
      type: "api",
      description: "Modalities from Cortecs API — tags field (Image, Audio)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();
      const TAG_MODALITY_MAP: Record<string, ModelModality | undefined> = {
        Image: "image",
        Audio: "audio",
      };
      for (const m of models) {
        const raw = m.raw as CortecsModel;
        if (!raw) continue;
        const input: ModelModality[] = ["text"];
        for (const tag of raw.tags) {
          const mapped = TAG_MODALITY_MAP[tag];
          if (mapped) input.push(mapped);
        }
        modalitiesMap.set(m.id, { input });
      }
      return modalitiesMap;
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.cortecs.ai/v1/models",
      type: "api",
      description: "Features from Cortecs API — tags field (Tools, Reasoning)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();
      for (const m of models) {
        const raw = m.raw as CortecsModel;
        if (!raw) continue;
        const features: ExtractedFeatures = {};
        if (raw.tags.includes("Tools")) features.tool_call = true;
        if (raw.tags.includes("Reasoning")) features.reasoning = true;
        featuresMap.set(m.id, features);
      }
      return featuresMap;
    },
  },

  deriveName: {
    execute: (modelId: string): string => {
      return modelId;
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      const lower = modelId.toLowerCase();
      const rules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /qwen3-coder/i, family: "qwen-coder" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /llama/i, family: "llama" },
        { pattern: /glm/i, family: "glm" },
        { pattern: /minimax/i, family: "minimax" },
        { pattern: /mistral-large/i, family: "mistral-large" },
        { pattern: /mistral-small/i, family: "mistral-small" },
        { pattern: /claude/i, family: "claude" },
        { pattern: /gpt/i, family: "gpt" },
        { pattern: /gemini/i, family: "gemini" },
        { pattern: /gemma/i, family: "gemma" },
        { pattern: /kimi/i, family: "kimi" },
        { pattern: /hermes/i, family: "hermes" },
        { pattern: /nemotron/i, family: "nemotron" },
        { pattern: /nova/i, family: "nova" },
      ];
      for (const { pattern, family } of rules) {
        if (pattern.test(lower)) return family;
      }
      return lower.split("-")[0] ?? lower;
    },
  },
};

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);
  return { provider, models };
}
