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
  id: "nvidia",
  name: "NVIDIA",
  url: "https://build.nvidia.com",
  api_docs: "https://docs.api.nvidia.com",
  apis: {
    openai: "https://integrate.api.nvidia.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from NVIDIA API)
// ---------------------------------------------------------------------------

interface NvidiaModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<NvidiaModel[]> {
  const response = await fetch("https://integrate.api.nvidia.com/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch NVIDIA models: ${response.status}`);
  }
  const data = (await response.json()) as { data: NvidiaModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://integrate.api.nvidia.com/v1/models",
      type: "api",
      description: "NVIDIA /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const seen = new Set<string>();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
        // Strip "nvidia/" prefix if present to get slug
        const slug = m.id.includes("/") ? m.id.split("/").slice(1).join("/") : m.id;
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
      url: "https://integrate.api.nvidia.com/v1/models",
      type: "api",
      description: "NVIDIA API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://integrate.api.nvidia.com/v1/models",
      type: "api",
      description: "NVIDIA API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://integrate.api.nvidia.com/v1/models",
      type: "api",
      description: "NVIDIA API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://integrate.api.nvidia.com/v1/models",
      type: "api",
      description: "NVIDIA API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://integrate.api.nvidia.com/v1/models",
      type: "api",
      description: "NVIDIA API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as NvidiaModel;
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
        { pattern: /nemotron-ultra/i, family: "nemotron-ultra" },
        { pattern: /nemotron-super/i, family: "nemotron-super" },
        { pattern: /nemotron-nano/i, family: "nemotron-nano" },
        { pattern: /nemotron-mini/i, family: "nemotron-mini" },
        { pattern: /chatqa/i, family: "chatqa" },
        { pattern: /minitron/i, family: "minitron" },
        { pattern: /cosmos/i, family: "cosmos" },
        { pattern: /nemotron/i, family: "nemotron" },
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
