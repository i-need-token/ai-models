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
  id: "regolo",
  name: "Regolo",
  url: "https://regolo.ai",
  api_docs: "https://regolo.ai/docs",
  apis: {
    openai: "https://api.regolo.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Regolo API)
// ---------------------------------------------------------------------------

interface RegoloModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<RegoloModel[]> {
  const response = await fetch("https://api.regolo.ai/v1/models");
  if (!response.ok) throw new Error(`Failed to fetch Regolo models: ${response.status}`);
  const data = (await response.json()) as { data: RegoloModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.regolo.ai/v1/models",
      type: "api",
      description: "Regolo /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
        // Flatten org/model format: "meta-llama/llama-4-maverick" → "meta-llama--llama-4-maverick"
        const flatId = m.id.replace(/\//g, "--");
        discovered.push({ id: flatId, raw: m });
      }

      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://api.regolo.ai/v1/models",
      type: "api",
      description: "Regolo API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://api.regolo.ai/v1/models",
      type: "api",
      description: "Regolo API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://api.regolo.ai/v1/models",
      type: "api",
      description: "Regolo API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.regolo.ai/v1/models",
      type: "api",
      description: "Regolo API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://api.regolo.ai/v1/models",
      type: "api",
      description: "Regolo API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as RegoloModel;
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
      let name = modelId.replace(/--/g, "/").split("/").pop() || modelId;
      name = name.replace(/-/g, " ").replace(/\b([a-z])/g, (c) => c.toUpperCase());
      return name;
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      const lower = modelId.toLowerCase();
      const rules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /llama/i, family: "llama" },
        { pattern: /mistral-large/i, family: "mistral-large" },
        { pattern: /mistral-small/i, family: "mistral-small" },
        { pattern: /mistral-nemo/i, family: "mistral-nemo" },
        { pattern: /mistral/i, family: "mistral" },
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /gemma/i, family: "gemma" },
        { pattern: /phi/i, family: "phi" },
      ];
      for (const { pattern, family } of rules) {
        if (pattern.test(lower)) return family;
      }
      return lower.split("-")[0] ?? lower;
    },
  },
};

// ---------------------------------------------------------------------------
// Main scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);
  return { provider, models };
}
