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
  id: "azure",
  name: "Azure OpenAI Service",
  url: "https://azure.microsoft.com/en-us/products/azure-openai-service/",
  api_docs: "https://learn.microsoft.com/en-us/azure/ai-services/openai/",
  apis: {
    openai: "https://models.inference.ai.azure.com",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Azure OpenAI Service API)
// ---------------------------------------------------------------------------

interface AzureModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<AzureModel[]> {
  const response = await fetch("https://models.inference.ai.azure.com/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Azure OpenAI Service models: ${response.status}`);
  }
  const data = (await response.json()) as { data?: AzureModel[] };
  return data.data ?? [];
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://models.inference.ai.azure.com/models",
      type: "api",
      description: "Azure OpenAI Service /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://models.inference.ai.azure.com/models",
      type: "api",
      description: "Azure OpenAI Service API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://models.inference.ai.azure.com/models",
      type: "api",
      description: "Azure OpenAI Service API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://models.inference.ai.azure.com/models",
      type: "api",
      description: "Azure OpenAI Service API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://models.inference.ai.azure.com/models",
      type: "api",
      description: "Azure OpenAI Service API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://models.inference.ai.azure.com/models",
      type: "api",
      description: "Azure OpenAI Service API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as AzureModel;
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
        { pattern: /gpt-oss/i, family: "gpt-oss" },
        { pattern: /gpt/i, family: "gpt" },
        { pattern: /o[0-9]/i, family: "o" },
        { pattern: /computer-use/i, family: "computer-use" },
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
  console.log(`  Azure OpenAI: ${models.length} models`);
  return { provider, models };
}
