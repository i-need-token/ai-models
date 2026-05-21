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
  id: "ibm",
  name: "IBM Granite",
  url: "https://www.ibm.com/granite",
  api_docs: "https://www.ibm.com/granite/docs",
  apis: {
    openai: "https://us-south.ml.cloud.ibm.com/ml/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from IBM watsonx.ai API)
// ---------------------------------------------------------------------------

interface IbmModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<IbmModel[]> {
  const response = await fetch("https://us-south.ml.cloud.ibm.com/ml/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch IBM models: ${response.status}`);
  }
  const data = (await response.json()) as { data: IbmModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://us-south.ml.cloud.ibm.com/ml/v1/models",
      type: "api",
      description: "IBM watsonx.ai /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const seen = new Set<string>();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
        // Strip "ibm/" prefix if present
        const slug = m.id.startsWith("ibm/") ? m.id.slice(4) : m.id;
        if (!seen.has(slug)) {
          seen.add(slug);
          discovered.push({ id: slug, raw: m });
        }
      }

      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://us-south.ml.cloud.ibm.com/ml/v1/models",
      type: "api",
      description: "IBM API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://us-south.ml.cloud.ibm.com/ml/v1/models",
      type: "api",
      description: "IBM API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://us-south.ml.cloud.ibm.com/ml/v1/models",
      type: "api",
      description: "IBM API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://us-south.ml.cloud.ibm.com/ml/v1/models",
      type: "api",
      description: "IBM API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://us-south.ml.cloud.ibm.com/ml/v1/models",
      type: "api",
      description: "IBM API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as IbmModel;
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
    execute: (_modelId: string): string => {
      return "granite";
    },
  },
};

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);
  console.log(`  IBM Granite: ${models.length} models`);
  return { provider, models };
}
