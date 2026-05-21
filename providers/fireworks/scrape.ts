import { defineProvider, runPipeline } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Pricing } from "../../types/index";
import type {
  ScrapePipeline,
  DiscoveredModel,
  ExtractedLimit,
  ExtractedModalities,
  ExtractedFeatures,
  ExtractedDates,
} from "../../scripts/lib/index";

const provider = defineProvider({
  id: "fireworks",
  name: "Fireworks AI",
  url: "https://fireworks.ai",
  api_docs: "https://docs.fireworks.ai",
  apis: {
    openai: "https://api.fireworks.ai/inference/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Fireworks AI API)
// ---------------------------------------------------------------------------

interface FireworksModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<FireworksModel[]> {
  const response = await fetch("https://api.fireworks.ai/inference/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Fireworks AI models: ${response.status}`);
  }
  const data = (await response.json()) as { data: FireworksModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.fireworks.ai/inference/v1/models",
      type: "api",
      description: "Fireworks AI /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://api.fireworks.ai/inference/v1/models",
      type: "api",
      description: "Fireworks AI API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://api.fireworks.ai/inference/v1/models",
      type: "api",
      description: "Fireworks AI API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://api.fireworks.ai/inference/v1/models",
      type: "api",
      description: "Fireworks AI API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.fireworks.ai/inference/v1/models",
      type: "api",
      description: "Fireworks AI API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://api.fireworks.ai/inference/v1/models",
      type: "api",
      description: "Fireworks AI API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as FireworksModel;
        if (!raw || !raw.created) continue;

        const d = new Date(raw.created * 1000);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        datesMap.set(m.id, { release_date: dateStr, last_updated: dateStr });
      }

      return datesMap;
    },
  },

  deriveName: {
    execute: (modelId: string): string => {
      return modelId.replace(/-/g, " ").replace(/\b(\w)/g, (_, c: string) => c.toUpperCase());
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      const lower = modelId.toLowerCase();
      const rules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /llama/i, family: "llama" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /mistral/i, family: "mistral" },
        { pattern: /gemma/i, family: "gemma" },
        { pattern: /mixtral/i, family: "mixtral" },
      ];
      for (const { pattern, family } of rules) {
        if (pattern.test(lower)) return family;
      }
      return lower.split("-")[0] ?? lower;
    },
  },
};

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);
  console.log(`  Fireworks AI: ${models.length} models`);
  return { provider, models };
}
