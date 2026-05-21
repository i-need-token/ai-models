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
  id: "cloudferro-sherlock",
  name: "CloudFerro Sherlock",
  url: "https://sherlock.cloudferro.com",
  api_docs: "https://docs.sherlock.cloudferro.com",
  apis: {
    openai: "https://api.sherlock.cloudferro.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from CloudFerro Sherlock OpenAI-compatible API)
// ---------------------------------------------------------------------------

interface SherlockModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<SherlockModel[]> {
  const response = await fetch("https://api.sherlock.cloudferro.com/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch CloudFerro Sherlock models: ${response.status}`);
  }
  const data = (await response.json()) as { data: SherlockModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.sherlock.cloudferro.com/v1/models",
      type: "api",
      description: "CloudFerro Sherlock /v1/models API — OpenAI-compatible model listing",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://api.sherlock.cloudferro.com/v1/models",
      type: "api",
      description: "CloudFerro Sherlock API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://api.sherlock.cloudferro.com/v1/models",
      type: "api",
      description: "CloudFerro Sherlock API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://api.sherlock.cloudferro.com/v1/models",
      type: "api",
      description: "CloudFerro Sherlock API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.sherlock.cloudferro.com/v1/models",
      type: "api",
      description: "CloudFerro Sherlock API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://api.sherlock.cloudferro.com/v1/models",
      type: "api",
      description: "Dates from CloudFerro Sherlock API — created timestamp field",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as SherlockModel;
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
        { pattern: /deepseek-r1/i, family: "deepseek" },
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /llama/i, family: "llama" },
        { pattern: /mistral/i, family: "mistral" },
        { pattern: /pixtral/i, family: "pixtral" },
        { pattern: /minimax/i, family: "minimax" },
        { pattern: /bielik/i, family: "bielik" },
        { pattern: /gpt-oss/i, family: "gpt-oss" },
        { pattern: /villanova/i, family: "villanova" },
        { pattern: /pllum/i, family: "pllum" },
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
