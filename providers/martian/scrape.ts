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
  id: "martian",
  name: "Martian",
  url: "https://withmartian.com",
  api_docs: "https://docs.withmartian.com",
  apis: {
    openai: "https://api.withmartian.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Martian API)
// ---------------------------------------------------------------------------

interface MartianModel {
  id: string;
  pricing: {
    prompt: string;
    completion: string;
    image: string;
    request: string;
    web_search: string;
    internal_reasoning: string;
    input_cache_read: string | null;
    input_cache_write: string | null;
  };
  added_at: string;
  updated_at: string;
  reliability_tier: number;
  max_completion_tokens: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SKIP_KEYWORDS = [
  "embed",
  "dall",
  "whisper",
  "tts",
  "stable",
  "flux",
  "image-gen",
  "sora",
  "router",
];

function toPerMTokens(perTokenStr: string): number {
  const perToken = parseFloat(perTokenStr);
  if (perToken === 0 || isNaN(perToken)) return 0;
  const perMTokens = perToken * 1e6;
  return Math.round(perMTokens * 1e6) / 1e6;
}

async function fetchModels(): Promise<MartianModel[]> {
  const response = await fetch("https://api.withmartian.com/v1/models");
  if (!response.ok) throw new Error(`Failed to fetch Martian models: ${response.status}`);
  const data = (await response.json()) as { data: MartianModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.withmartian.com/v1/models",
      type: "api",
      description:
        "Martian models API — returns 300+ models with pricing, capabilities, max_completion_tokens",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
        const flatId = m.id.toLowerCase().replace(/\//g, "--").replace(/:/g, "--");

        // Skip non-LLM models
        if (SKIP_KEYWORDS.some((kw) => flatId.includes(kw))) continue;
        if (flatId === "auto") continue;

        // Skip zero pricing
        const inputPerM = toPerMTokens(m.pricing.prompt);
        const outputPerM = toPerMTokens(m.pricing.completion);
        if (inputPerM === 0 && outputPerM === 0) continue;

        discovered.push({ id: flatId, raw: m });
      }

      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://api.withmartian.com/v1/models",
      type: "api",
      description: "Pricing from Martian API — per-token USD pricing converted to per-million",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      for (const m of models) {
        const raw = m.raw as MartianModel;
        if (!raw) continue;

        const p: Pricing = {
          currency: "USD",
          input: toPerMTokens(raw.pricing.prompt),
          output: toPerMTokens(raw.pricing.completion),
        };

        if (raw.pricing.input_cache_read !== null) {
          const cacheRead = toPerMTokens(raw.pricing.input_cache_read);
          if (cacheRead > 0) p.cache_read = cacheRead;
        }

        if (raw.pricing.input_cache_write !== null) {
          const cacheWrite = toPerMTokens(raw.pricing.input_cache_write);
          if (cacheWrite > 0) p.cache_write = cacheWrite;
        }

        pricingMap.set(m.id, p);
      }

      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: "https://api.withmartian.com/v1/models",
      type: "api",
      description: "Dates from Martian API — updated_at and added_at fields",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as MartianModel;
        if (!raw) continue;

        const updatedAt = raw.updated_at ?? raw.added_at;
        if (updatedAt) {
          const dateStr = updatedAt.substring(0, 10);
          datesMap.set(m.id, { release_date: dateStr, last_updated: dateStr });
        }
      }

      return datesMap;
    },
  },

  extractLimits: {
    source: {
      url: "https://api.withmartian.com/v1/models",
      type: "api",
      description:
        "Max output from Martian API — max_completion_tokens field; context not available from API",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      // Martian API does not provide context_length; limits omitted
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://api.withmartian.com/v1/models",
      type: "api",
      description:
        "Modalities from Martian API — vision detected from pricing.image > 0 or model name",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();

      for (const m of models) {
        const raw = m.raw as MartianModel;
        if (!raw) continue;

        const hasVision = parseFloat(raw.pricing.image) > 0;
        const input: ModelModality[] = hasVision ? ["text", "image"] : ["text"];
        modalitiesMap.set(m.id, { input });
      }

      return modalitiesMap;
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.withmartian.com/v1/models",
      type: "api",
      description:
        "Features from Martian API — reasoning from internal_reasoning pricing > 0, tool_call from provider name",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();

      for (const m of models) {
        const raw = m.raw as MartianModel;
        if (!raw) continue;

        const features: ExtractedFeatures = {};

        if (parseFloat(raw.pricing.internal_reasoning) > 0) features.reasoning = true;

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
      const rules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /claude-opus/i, family: "claude-opus" },
        { pattern: /claude-sonnet/i, family: "claude-sonnet" },
        { pattern: /claude-haiku/i, family: "claude-haiku" },
        { pattern: /claude/i, family: "claude" },
        { pattern: /gpt-oss/i, family: "gpt-oss" },
        { pattern: /gpt/i, family: "gpt" },
        { pattern: /o[0-9]/i, family: "o" },
        { pattern: /gemini/i, family: "gemini" },
        { pattern: /gemma/i, family: "gemma" },
        { pattern: /llama/i, family: "llama" },
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /mistral/i, family: "mistral" },
        { pattern: /grok/i, family: "grok" },
        { pattern: /glm/i, family: "glm" },
        { pattern: /kimi/i, family: "kimi" },
        { pattern: /minimax/i, family: "minimax" },
        { pattern: /phi/i, family: "phi" },
        { pattern: /command/i, family: "command" },
        { pattern: /nova/i, family: "nova" },
        { pattern: /granite/i, family: "granite" },
      ];
      for (const { pattern, family } of rules) {
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
  return { provider, models };
}
