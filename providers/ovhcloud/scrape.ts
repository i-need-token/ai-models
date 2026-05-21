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
  id: "ovhcloud",
  name: "OVHcloud AI Endpoints",
  url: "https://www.ovhcloud.com/en/public-cloud/ai-endpoints/",
  api_docs: "https://docs.ovh.com/gb/en/publiccloud/ai/endpoints/",
  apis: {
    openai: "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from OVHcloud API)
// ---------------------------------------------------------------------------

interface OvhcloudPricing {
  currency_unit: string;
  prompt: string;
  completion: string;
  image: string;
  request: string;
  input_cache_reads: string;
  input_cache_writes: string;
}

interface OvhcloudModel {
  id: string;
  created: number;
  object: string;
  owned_by: string;
  pricing: OvhcloudPricing;
  context_length: number;
  max_completion_tokens: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toPerMTokens(perTokenStr: string): number {
  const perToken = parseFloat(perTokenStr);
  if (perToken === 0 || isNaN(perToken)) return 0;
  const perMTokens = perToken * 1e6;
  return Math.round(perMTokens * 1e6) / 1e6;
}

async function fetchModels(): Promise<OvhcloudModel[]> {
  const response = await fetch("https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/models");
  if (!response.ok) throw new Error(`Failed to fetch OVHcloud models: ${response.status}`);
  const data = (await response.json()) as { data: OvhcloudModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/models",
      type: "api",
      description:
        "OVHcloud AI Endpoints API — returns model list with pricing, context_length, max_completion_tokens",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
        // Skip non-chat models (embedding, image gen, speech, guard, special)
        if (m.max_completion_tokens === 0 && m.context_length === 0) continue;
        if (m.max_completion_tokens === 0) continue;
        if (m.id.toLowerCase().includes("guard")) continue;
        if (m.id === "ppl") continue;

        const inputPrice = toPerMTokens(m.pricing.prompt);
        const outputPrice = toPerMTokens(m.pricing.completion);

        // Skip free models
        if (inputPrice === 0 && outputPrice === 0) continue;

        discovered.push({ id: m.id, raw: m });
      }

      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/models",
      type: "api",
      description: "Pricing from OVHcloud API — per-token USD pricing converted to per-million",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      for (const m of models) {
        const raw = m.raw as OvhcloudModel;
        if (!raw) continue;

        const inputPrice = toPerMTokens(raw.pricing.prompt);
        const outputPrice = toPerMTokens(raw.pricing.completion);

        pricingMap.set(m.id, {
          currency: "USD",
          input: inputPrice,
          output: outputPrice,
        });
      }

      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/models",
      type: "api",
      description: "Dates from OVHcloud API — created timestamp field",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as OvhcloudModel;
        if (!raw || !raw.created) continue;

        const d = new Date(raw.created * 1000);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        datesMap.set(m.id, { release_date: dateStr, last_updated: dateStr });
      }

      return datesMap;
    },
  },

  extractLimits: {
    source: {
      url: "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/models",
      type: "api",
      description: "Context window and max output from OVHcloud API",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();

      for (const m of models) {
        const raw = m.raw as OvhcloudModel;
        if (!raw) continue;

        if (raw.context_length > 0) {
          limitsMap.set(m.id, {
            context: raw.context_length,
            ...(raw.max_completion_tokens > 0 ? { output: raw.max_completion_tokens } : {}),
          });
        }
      }

      return limitsMap;
    },
  },

  extractModalities: {
    source: {
      url: "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/models",
      type: "api",
      description: "Modalities not available from API — omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/models",
      type: "api",
      description: "Features not available from API — omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  deriveName: {
    execute: (modelId: string): string => {
      return modelId.replace(/-/g, " ").replace(/\b([a-z])/g, (c) => c.toUpperCase());
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      const lower = modelId.toLowerCase();
      if (lower.includes("gpt-oss")) return "gpt-oss";
      if (lower.includes("qwen3-coder")) return "qwen-coder";
      if (
        lower.includes("qwen3.5") ||
        lower.includes("qwen3") ||
        lower.includes("qwen2.5-vl") ||
        lower.includes("qwen2.5")
      )
        return "qwen";
      if (lower.includes("mistral-small")) return "mistral-small";
      if (lower.includes("mistral-nemo")) return "mistral-nemo";
      if (lower.includes("mistral-7b")) return "mistral";
      if (lower.includes("llama-3.3") || lower.includes("llama-3_3") || lower.includes("llama-3.1"))
        return "llama";
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
