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
  id: "databricks",
  name: "Databricks",
  url: "https://www.databricks.com",
  api_docs:
    "https://docs.databricks.com/en/machine-learning/model-serving/score-foundation-models.html",
  apis: {
    openai: "https://databricks-demo.cloud.databricks.com/serving-endpoints",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Databricks API)
// ---------------------------------------------------------------------------

interface DatabricksModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<DatabricksModel[]> {
  const response = await fetch(
    "https://databricks-demo.cloud.databricks.com/serving-endpoints/models",
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch Databricks models: ${response.status}`);
  }
  const data = (await response.json()) as { data: DatabricksModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://databricks-demo.cloud.databricks.com/serving-endpoints/models",
      type: "api",
      description: "Databricks /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://databricks-demo.cloud.databricks.com/serving-endpoints/models",
      type: "api",
      description: "Databricks API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://databricks-demo.cloud.databricks.com/serving-endpoints/models",
      type: "api",
      description: "Databricks API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://databricks-demo.cloud.databricks.com/serving-endpoints/models",
      type: "api",
      description: "Databricks API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://databricks-demo.cloud.databricks.com/serving-endpoints/models",
      type: "api",
      description: "Databricks API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://databricks-demo.cloud.databricks.com/serving-endpoints/models",
      type: "api",
      description: "Databricks API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as DatabricksModel;
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
        { pattern: /databricks/i, family: "databricks" },
        { pattern: /llama/i, family: "llama" },
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
  console.log(`  Databricks: ${models.length} models`);
  return { provider, models };
}
