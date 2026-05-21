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
  id: "amazon-bedrock",
  name: "Amazon Bedrock",
  url: "https://aws.amazon.com/bedrock/",
  api_docs: "https://docs.aws.amazon.com/bedrock/",
  apis: {
    openai: "https://bedrock-runtime.us-east-1.amazonaws.com/openai",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Amazon Bedrock API)
// ---------------------------------------------------------------------------

interface AmazonBedrockModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<AmazonBedrockModel[]> {
  const response = await fetch("https://bedrock-runtime.us-east-1.amazonaws.com/openai/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Amazon Bedrock models: ${response.status}`);
  }
  const data = (await response.json()) as { data: AmazonBedrockModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://bedrock-runtime.us-east-1.amazonaws.com/openai/models",
      type: "api",
      description: "Amazon Bedrock /v1/models API — dynamic model discovery",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      return apiModels.map((m) => ({ id: m.id, raw: m }));
    },
  },

  extractPricing: {
    source: {
      url: "https://bedrock-runtime.us-east-1.amazonaws.com/openai/models",
      type: "api",
      description: "Amazon Bedrock API — pricing not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      return new Map<string, Pricing>();
    },
  },

  extractLimits: {
    source: {
      url: "https://bedrock-runtime.us-east-1.amazonaws.com/openai/models",
      type: "api",
      description: "Amazon Bedrock API — limits not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://bedrock-runtime.us-east-1.amazonaws.com/openai/models",
      type: "api",
      description: "Amazon Bedrock API — modalities not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://bedrock-runtime.us-east-1.amazonaws.com/openai/models",
      type: "api",
      description: "Amazon Bedrock API — features not available via API, omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://bedrock-runtime.us-east-1.amazonaws.com/openai/models",
      type: "api",
      description: "Amazon Bedrock API — created timestamp for dates",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as AmazonBedrockModel;
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
        { pattern: /nova/i, family: "nova" },
        { pattern: /llama/i, family: "llama" },
        { pattern: /mistral/i, family: "mistral" },
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /gemma/i, family: "gemma" },
        { pattern: /nemotron/i, family: "nemotron" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /kimi/i, family: "kimi" },
        { pattern: /glm/i, family: "glm" },
        { pattern: /minimax/i, family: "minimax" },
        { pattern: /gpt-oss/i, family: "gpt-oss" },
        { pattern: /writer/i, family: "palmyra" },
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
  console.log(`  Amazon Bedrock: ${models.length} models`);
  return { provider, models };
}
