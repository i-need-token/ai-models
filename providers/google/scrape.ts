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
  id: "google",
  name: "Google",
  url: "https://ai.google.dev",
  api_docs: "https://ai.google.dev/gemini-api/docs",
  apis: {
    openai: "https://generativelanguage.googleapis.com/v1beta/openai",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Google OpenAI-compatible API)
// ---------------------------------------------------------------------------

interface GoogleModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Skip dated snapshot variants like "gemini-2.0-flash-001" */
function shouldSkip(modelId: string): boolean {
  // Skip snapshot versions with numeric suffixes (e.g., gemini-2.0-flash-001)
  if (/-\d{3,}$/.test(modelId)) return true;
  // Skip experimental/preview variants
  if (modelId.endsWith("-exp")) return true;
  if (modelId.endsWith("-preview")) return true;
  return false;
}

/** Fetch model list from Google OpenAI-compatible API. Requires GOOGLE_API_KEY env var. */
async function fetchModels(): Promise<GoogleModel[]> {
  const apiKey = process.env["GOOGLE_API_KEY"];
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY environment variable is required for Google model discovery");
  }
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch Google models: ${response.status}`);
  }
  const data = (await response.json()) as { data: GoogleModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://generativelanguage.googleapis.com/v1beta/openai/models",
      type: "api",
      description: "Google OpenAI-compatible /v1/models API — requires GOOGLE_API_KEY env var",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
        if (shouldSkip(m.id)) continue;
        discovered.push({ id: m.id, raw: m });
      }

      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://generativelanguage.googleapis.com/v1beta/openai/models",
      type: "api",
      description: "Google API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://generativelanguage.googleapis.com/v1beta/openai/models",
      type: "api",
      description: "Google API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://generativelanguage.googleapis.com/v1beta/openai/models",
      type: "api",
      description: "Google API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://generativelanguage.googleapis.com/v1beta/openai/models",
      type: "api",
      description: "Google API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://generativelanguage.googleapis.com/v1beta/openai/models",
      type: "api",
      description: "Dates from Google API — created timestamp field",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as GoogleModel;
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
        { pattern: /^gemini/, family: "gemini" },
        { pattern: /^gemma/, family: "gemma" },
        { pattern: /^imagen/, family: "imagen" },
        { pattern: /^veo/, family: "veo" },
        { pattern: /^lyria/, family: "lyria" },
        { pattern: /^chirp/, family: "chirp" },
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
