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
  id: "moark",
  name: "MoArk AI",
  url: "https://moark.ai",
  api_docs: "https://moark.ai/docs",
  apis: {
    openai: "https://api.moark.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from MoArk AI API)
// ---------------------------------------------------------------------------

interface MoarkModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<MoarkModel[]> {
  const response = await fetch("https://api.moark.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch MoArk AI models: ${response.status}`);
  }
  const data = (await response.json()) as { data: MoarkModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.moark.ai/v1/models",
      type: "api",
      description: "MoArk AI /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://api.moark.ai/v1/models",
      type: "api",
      description: "MoArk AI API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://api.moark.ai/v1/models",
      type: "api",
      description: "MoArk AI API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://api.moark.ai/v1/models",
      type: "api",
      description: "MoArk AI API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.moark.ai/v1/models",
      type: "api",
      description: "MoArk AI API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://api.moark.ai/v1/models",
      type: "api",
      description: "MoArk AI API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as MoarkModel;
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
      return modelId
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .replace(/\b(\w)/g, (_, c: string) => c.toUpperCase());
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      const lower = modelId.toLowerCase();
      const rules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /qwq/i, family: "qwen" },
        { pattern: /glm/i, family: "glm" },
        { pattern: /minimax/i, family: "minimax" },
        { pattern: /kimi/i, family: "kimi" },
        { pattern: /ernie/i, family: "ernie" },
        { pattern: /gemma/i, family: "gemma" },
        { pattern: /gpt-oss/i, family: "gpt-oss" },
        { pattern: /internlm/i, family: "internlm" },
        { pattern: /internvl/i, family: "internvl" },
        { pattern: /baichuan/i, family: "baichuan" },
        { pattern: /hunyuan/i, family: "hunyuan" },
        { pattern: /lingshu/i, family: "lingshu" },
        { pattern: /legalone/i, family: "legalone" },
        { pattern: /sinong/i, family: "sinong" },
        { pattern: /fin/i, family: "fin" },
        { pattern: /dianjin/i, family: "dianjin" },
        { pattern: /medgemma/i, family: "medgemma" },
        { pattern: /mai-ui/i, family: "mai-ui" },
        { pattern: /autoglm/i, family: "autoglm" },
        { pattern: /codegeex/i, family: "codegeex" },
        { pattern: /kat-dev/i, family: "kat" },
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
  console.log(`  MoArk AI: ${models.length} models`);
  return { provider, models };
}
