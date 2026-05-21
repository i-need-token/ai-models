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
  id: "302ai",
  name: "302.AI",
  url: "https://302.ai",
  api_docs: "https://302.ai/docs",
  apis: {
    openai: "https://dash-api.302.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from 302.AI API)
// ---------------------------------------------------------------------------

interface Ai302Model {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<Ai302Model[]> {
  const response = await fetch("https://dash-api.302.ai/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch 302.AI models: ${response.status}`);
  }
  const data = (await response.json()) as { data: Ai302Model[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://dash-api.302.ai/v1/models",
      type: "api",
      description: "302.AI /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://dash-api.302.ai/v1/models",
      type: "api",
      description: "302.AI API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://dash-api.302.ai/v1/models",
      type: "api",
      description: "302.AI API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://dash-api.302.ai/v1/models",
      type: "api",
      description: "302.AI API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://dash-api.302.ai/v1/models",
      type: "api",
      description: "302.AI API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://dash-api.302.ai/v1/models",
      type: "api",
      description: "302.AI API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as Ai302Model;
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
        { pattern: /claude/i, family: "claude" },
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /gpt/i, family: "gpt" },
        { pattern: /gemini/i, family: "gemini" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /llama/i, family: "llama" },
        { pattern: /mistral/i, family: "mistral" },
        { pattern: /doubao/i, family: "doubao" },
        { pattern: /hunyuan/i, family: "hunyuan" },
        { pattern: /yi/i, family: "yi" },
        { pattern: /glm/i, family: "glm" },
        { pattern: /ernie/i, family: "ernie" },
        { pattern: /grok/i, family: "grok" },
        { pattern: /minimax/i, family: "minimax" },
        { pattern: /moonshot/i, family: "moonshot" },
        { pattern: /step/i, family: "step" },
        { pattern: /kimi/i, family: "kimi" },
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
  console.log(`  302.AI: ${models.length} models`);
  return { provider, models };
}
