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
  id: "iflytek",
  name: "iFlytek SparkDesk",
  url: "https://xinghuo.xfyun.cn",
  api_docs: "https://www.xfyun.cn/doc/sparkapi.html",
  apis: {
    openai: "https://spark-api-open.xf-yun.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from iFlytek API)
// ---------------------------------------------------------------------------

interface IflytekModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<IflytekModel[]> {
  const response = await fetch("https://spark-api-open.xf-yun.com/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch iFlytek models: ${response.status}`);
  }
  const data = (await response.json()) as { data: IflytekModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://spark-api-open.xf-yun.com/v1/models",
      type: "api",
      description: "iFlytek /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://spark-api-open.xf-yun.com/v1/models",
      type: "api",
      description: "iFlytek API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://spark-api-open.xf-yun.com/v1/models",
      type: "api",
      description: "iFlytek API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://spark-api-open.xf-yun.com/v1/models",
      type: "api",
      description: "iFlytek API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://spark-api-open.xf-yun.com/v1/models",
      type: "api",
      description: "iFlytek API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://spark-api-open.xf-yun.com/v1/models",
      type: "api",
      description: "iFlytek API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as IflytekModel;
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
        { pattern: /spark-x\d/i, family: "spark-x" },
        { pattern: /spark-ultra/i, family: "spark-ultra" },
        { pattern: /spark-pro/i, family: "spark-pro" },
        { pattern: /spark-lite/i, family: "spark-lite" },
        { pattern: /spark/i, family: "spark" },
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
  console.log(`  iFlytek SparkDesk: ${models.length} models`);
  return { provider, models };
}
