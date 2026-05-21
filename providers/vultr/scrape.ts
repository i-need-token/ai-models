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
  id: "vultr",
  name: "Vultr Cloud Inference",
  url: "https://www.vultr.com/products/cloud-inference/",
  api_docs: "https://docs.vultr.com/cloud-inference",
  apis: {
    openai: "https://inference.vultr.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Vultr Cloud Inference API)
// ---------------------------------------------------------------------------

interface VultrModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<VultrModel[]> {
  const response = await fetch("https://inference.vultr.com/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Vultr Cloud Inference models: ${response.status}`);
  }
  const data = (await response.json()) as { data: VultrModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://inference.vultr.com/v1/models",
      type: "api",
      description: "Vultr Cloud Inference /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://inference.vultr.com/v1/models",
      type: "api",
      description: "Vultr Cloud Inference API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://inference.vultr.com/v1/models",
      type: "api",
      description: "Vultr Cloud Inference API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://inference.vultr.com/v1/models",
      type: "api",
      description: "Vultr Cloud Inference API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://inference.vultr.com/v1/models",
      type: "api",
      description: "Vultr Cloud Inference API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://inference.vultr.com/v1/models",
      type: "api",
      description: "Vultr Cloud Inference API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as VultrModel;
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
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /llama/i, family: "llama" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /mistral/i, family: "mistral" },
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
  console.log(`  Vultr: ${models.length} models`);
  return { provider, models };
}
