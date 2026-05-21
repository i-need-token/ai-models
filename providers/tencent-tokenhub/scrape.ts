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
  id: "tencent-tokenhub",
  name: "Tencent Cloud TokenHub",
  url: "https://cloud.tencent.com/product/tokenhub",
  api_docs: "https://cloud.tencent.com/document/product/1823",
  apis: {
    openai: "https://hunyuan.cloud.tencent.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Tencent Cloud TokenHub API)
// ---------------------------------------------------------------------------

interface TencentTokenhubModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<TencentTokenhubModel[]> {
  const response = await fetch("https://hunyuan.cloud.tencent.com/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Tencent Cloud TokenHub models: ${response.status}`);
  }
  const data = (await response.json()) as { data: TencentTokenhubModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://hunyuan.cloud.tencent.com/v1/models",
      type: "api",
      description: "Tencent Cloud TokenHub /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://hunyuan.cloud.tencent.com/v1/models",
      type: "api",
      description: "Tencent Cloud TokenHub API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://hunyuan.cloud.tencent.com/v1/models",
      type: "api",
      description: "Tencent Cloud TokenHub API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://hunyuan.cloud.tencent.com/v1/models",
      type: "api",
      description: "Tencent Cloud TokenHub API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://hunyuan.cloud.tencent.com/v1/models",
      type: "api",
      description: "Tencent Cloud TokenHub API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://hunyuan.cloud.tencent.com/v1/models",
      type: "api",
      description: "Tencent Cloud TokenHub API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as TencentTokenhubModel;
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
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /llama/i, family: "llama" },
        { pattern: /glm/i, family: "glm" },
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
  console.log(`  Tencent TokenHub: ${models.length} models`);
  return { provider, models };
}
