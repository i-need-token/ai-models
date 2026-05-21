import { defineProvider, runPipeline } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type {
  ScrapePipeline,
  DiscoveredModel,
  ExtractedLimit,
  ExtractedFeatures,
  ExtractedDates,
  ExtractedSnapshot,
} from "../../scripts/lib/index";
import type { Pricing } from "../../types/index";

const provider = defineProvider({
  id: "ai21",
  name: "AI21 Labs",
  url: "https://www.ai21.com",
  api_docs: "https://docs.ai21.com",
  apis: {
    openai: "https://api.ai21.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from AI21 API)
// ---------------------------------------------------------------------------

interface Ai21Model {
  id: string;
  name: string;
  updated: string;
  context_length: number;
  quantization: string;
  max_completion_tokens: number;
  pricing: { prompt: string; completion: string };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<Ai21Model[]> {
  const response = await fetch("https://api.ai21.com/studio/v1/models");
  if (!response.ok) throw new Error(`Failed to fetch AI21 models: ${response.status}`);
  const data = (await response.json()) as { data: Ai21Model[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.ai21.com/studio/v1/models",
      type: "api",
      description: "AI21 Studio API — returns current Jamba models with pricing and context",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://api.ai21.com/studio/v1/models",
      type: "api",
      description: "Pricing from AI21 API — per-token USD pricing converted to per-million",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      for (const m of models) {
        const raw = m.raw as Ai21Model;
        if (!raw || !raw.pricing) continue;

        if ("prompt" in raw.pricing && "completion" in raw.pricing) {
          const promptPerToken = parseFloat(raw.pricing.prompt as string);
          const completionPerToken = parseFloat(raw.pricing.completion as string);
          pricingMap.set(m.id, {
            currency: "USD",
            input: Math.round(promptPerToken * 1e6 * 1e6) / 1e6,
            output: Math.round(completionPerToken * 1e6 * 1e6) / 1e6,
          });
        }
      }

      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: "https://api.ai21.com/studio/v1/models",
      type: "api",
      description: "Dates from AI21 API — updated field (YYYY-MM format)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as Ai21Model;
        if (!raw || !raw.updated) continue;

        datesMap.set(m.id, {
          release_date: `${raw.updated}-01`,
          last_updated: `${raw.updated}-01`,
        });
      }

      return datesMap;
    },
  },

  extractLimits: {
    source: {
      url: "https://api.ai21.com/studio/v1/models",
      type: "api",
      description: "Context window and max output from AI21 API",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();

      for (const m of models) {
        const raw = m.raw as Ai21Model;
        if (!raw || !raw.context_length) continue;

        limitsMap.set(m.id, {
          context: raw.context_length,
          ...(raw.max_completion_tokens ? { output: raw.max_completion_tokens } : {}),
        });
      }

      return limitsMap;
    },
  },

  // Note: extractModalities removed — API doesn't provide modality data.
  // Pipeline will use default { input: ["text"], output: ["text"] }

  extractFeatures: {
    source: {
      url: "https://api.ai21.com/studio/v1/models",
      type: "api",
      description: "Features — API doesn't provide feature flags, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractSnapshots: {
    source: {
      url: "https://api.ai21.com/studio/v1/models",
      type: "api",
      description: "Snapshots — API model IDs are snapshot IDs (e.g., jamba-large-1.7-2025-07)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedSnapshot[]>> => {
      const snapshotsMap = new Map<string, ExtractedSnapshot[]>();
      for (const m of models) {
        const raw = m.raw as Ai21Model;
        if (raw && raw.id !== m.id) {
          snapshotsMap.set(m.id, [{ id: raw.id }]);
        }
      }
      return snapshotsMap;
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
        { pattern: /jamba-large/i, family: "jamba-large" },
        { pattern: /jamba-mini/i, family: "jamba-mini" },
        { pattern: /jamba/i, family: "jamba" },
      ];
      for (const { pattern, family } of rules) {
        if (pattern.test(lower)) return family;
      }
      return "jamba";
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
