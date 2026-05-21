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
  id: "reka",
  name: "Reka AI",
  url: "https://reka.ai",
  api_docs: "https://docs.reka.ai",
  apis: {
    openai: "https://api.reka.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Reka API)
// ---------------------------------------------------------------------------

interface RekaModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<RekaModel[]> {
  const response = await fetch("https://api.reka.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Reka models: ${response.status}`);
  }
  const data = (await response.json()) as { data: RekaModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.reka.ai/v1/models",
      type: "api",
      description: "Reka AI /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://docs.reka.ai/docs/pricing",
      type: "api",
      description: "Reka AI pricing — not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      // Reka API does not provide pricing data
      // Pricing must be sourced from docs or OpenRouter; omit if unavailable
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://api.reka.ai/v1/models",
      type: "api",
      description: "Reka AI API — context/output limits not in API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      // Reka API does not provide context/output limits
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://api.reka.ai/v1/models",
      type: "api",
      description: "Reka AI API — modalities not in API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      // Reka API does not provide modality data
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.reka.ai/v1/models",
      type: "api",
      description: "Reka AI API — features not in API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      // Reka API does not provide feature data
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://api.reka.ai/v1/models",
      type: "api",
      description: "Reka AI API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as RekaModel;
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
        { pattern: /flash/i, family: "reka-flash" },
        { pattern: /edge/i, family: "reka-edge" },
        { pattern: /core/i, family: "reka-core" },
      ];
      for (const { pattern, family } of rules) {
        if (pattern.test(lower)) return family;
      }
      return "reka";
    },
  },
};

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);
  console.log(`  Reka AI: ${models.length} models`);
  return { provider, models };
}
