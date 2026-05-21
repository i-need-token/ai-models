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
  id: "openai",
  name: "OpenAI",
  url: "https://openai.com",
  api_docs: "https://platform.openai.com/docs",
  apis: {
    openai: "https://api.openai.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from OpenAI API)
// ---------------------------------------------------------------------------

interface OpenAIModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Skip non-LLM models (fine-tunes, legacy snapshots, etc.) */
const SKIP_PREFIXES = [
  "ft:", // fine-tuned models
  "curie:", // legacy fine-tune base
  "babbage:", // legacy fine-tune base
  "davinci:", // legacy fine-tune base
  "ada:", // legacy fine-tune base (not ada-002)
];

function shouldSkip(modelId: string): boolean {
  for (const prefix of SKIP_PREFIXES) {
    if (modelId.startsWith(prefix)) return true;
  }
  // Skip dated snapshot variants like "gpt-4-0314", "gpt-4o-2024-05-13"
  if (/-\d{4}-\d{2}-\d{2}$/.test(modelId)) return true;
  if (/-\d{6}$/.test(modelId)) return true;
  return false;
}

/** Fetch model list from OpenAI API. Requires OPENAI_API_KEY env var. */
async function fetchModels(): Promise<OpenAIModel[]> {
  const apiKey = process.env["OPENAI_API_KEY"];
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required for OpenAI model discovery");
  }
  const response = await fetch("https://api.openai.com/v1/models", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAI models: ${response.status}`);
  }
  const data = (await response.json()) as { data: OpenAIModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.openai.com/v1/models",
      type: "api",
      description: "OpenAI /v1/models API — requires OPENAI_API_KEY env var",
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
      url: "https://api.openai.com/v1/models",
      type: "api",
      description: "OpenAI API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://api.openai.com/v1/models",
      type: "api",
      description: "OpenAI API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://api.openai.com/v1/models",
      type: "api",
      description: "OpenAI API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.openai.com/v1/models",
      type: "api",
      description: "OpenAI API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://api.openai.com/v1/models",
      type: "api",
      description: "Dates from OpenAI API — created timestamp field",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as OpenAIModel;
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
      // Special cases that regex can't handle
      if (modelId === "dall-e-3") return "DALL·E 3";
      if (modelId === "dall-e-2") return "DALL·E 2";

      // General rule: replace hyphens with spaces, capitalize each word
      return modelId.replace(/-/g, " ").replace(/\b(\w)/g, (_, c: string) => c.toUpperCase());
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      const lower = modelId.toLowerCase();
      const rules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /^chatgpt/i, family: "chatgpt" },
        { pattern: /^gpt-image/i, family: "gpt-image" },
        { pattern: /^gpt/i, family: "gpt" },
        { pattern: /^o[0-9]/, family: "o" },
        { pattern: /^dall-e/i, family: "dall-e" },
        { pattern: /^whisper/i, family: "whisper" },
        { pattern: /^tts/i, family: "tts" },
        { pattern: /^codex/i, family: "codex" },
        { pattern: /^text-embedding/i, family: "text-embedding" },
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
