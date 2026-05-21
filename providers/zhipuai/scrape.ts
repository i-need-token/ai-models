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
import type { Pricing } from "../../types/index";

const provider = defineProvider({
  id: "zhipuai",
  name: "Zhipu AI (智谱AI)",
  url: "https://bigmodel.cn",
  api_docs: "https://open.bigmodel.cn/dev/api",
  apis: {
    openai: "https://open.bigmodel.cn/api/paas/v4",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Zhipu AI API)
// ---------------------------------------------------------------------------

interface ZhipuModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<ZhipuModel[]> {
  const response = await fetch("https://open.bigmodel.cn/api/paas/v4/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Zhipu AI models: ${response.status}`);
  }
  const data = (await response.json()) as { data: ZhipuModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://open.bigmodel.cn/api/paas/v4/models",
      type: "api",
      description: "Zhipu AI /v4/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://open.bigmodel.cn/api/paas/v4/models",
      type: "api",
      description: "Zhipu AI API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://open.bigmodel.cn/api/paas/v4/models",
      type: "api",
      description: "Zhipu AI API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://open.bigmodel.cn/api/paas/v4/models",
      type: "api",
      description: "Zhipu AI API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://open.bigmodel.cn/api/paas/v4/models",
      type: "api",
      description: "Zhipu AI API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://open.bigmodel.cn/api/paas/v4/models",
      type: "api",
      description: "Zhipu AI API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as ZhipuModel;
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
        { pattern: /glm-z/i, family: "glm-z" },
        { pattern: /glm/i, family: "glm" },
        { pattern: /cogview/i, family: "cogview" },
        { pattern: /cogvideox/i, family: "cogvideox" },
        { pattern: /cogvideo/i, family: "cogvideo" },
        { pattern: /emohaa/i, family: "emohaa" },
        { pattern: /codegeex/i, family: "codegeex" },
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
  console.log(`  Zhipu AI: ${models.length} models`);
  return { provider, models };
}
