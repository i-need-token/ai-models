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
import type { Pricing, ModelModality } from "../../types/index";

const provider = defineProvider({
  id: "novitaai",
  name: "Novita AI",
  url: "https://novita.ai",
  api_docs: "https://docs.novita.ai",
  apis: {
    openai: "https://api.novita.ai/openai",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Novita AI API)
// ---------------------------------------------------------------------------

interface NovitaModel {
  id: string;
  context_size: number;
  max_output_tokens: number;
  input_token_price_per_m: number;
  output_token_price_per_m: number;
  input_modalities: string[];
  output_modalities: string[];
  features: string[];
  model_type: string;
  display_name: string;
}

// ---------------------------------------------------------------------------
// API fetch helper
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<NovitaModel[]> {
  const response = await fetch("https://api.novita.ai/openai/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Novita AI models: ${response.status}`);
  }
  const data = (await response.json()) as { data: NovitaModel[] };
  return data.data;
}

const MODALITY_MAP: Record<string, ModelModality | undefined> = {
  text: "text",
  image: "image",
  video: "video",
  audio: "audio",
};

function mapModalities(raw: string[]): ModelModality[] {
  const result: ModelModality[] = [];
  for (const m of raw) {
    const mapped = MODALITY_MAP[m];
    if (mapped) result.push(mapped);
  }
  if (result.length === 0) result.push("text");
  return result;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.novita.ai/openai/models",
      type: "api",
      description:
        "Novita AI models API — returns model list with pricing, context, capabilities, modalities",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];
      for (const m of apiModels) {
        if (m.model_type !== "chat") continue;
        const flatId = m.id.replace(/\//g, "--");
        discovered.push({ id: flatId, raw: m });
      }
      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://api.novita.ai/openai/models",
      type: "api",
      description: "Pricing from Novita AI API — per-million-token USD pricing (value / 10000)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();
      for (const m of models) {
        const raw = m.raw as NovitaModel;
        if (!raw) continue;
        const inputPrice = raw.input_token_price_per_m / 10000;
        const outputPrice = raw.output_token_price_per_m / 10000;
        if (inputPrice === 0 && outputPrice === 0) {
          pricingMap.set(m.id, { unit: "free" });
        } else {
          pricingMap.set(m.id, { currency: "USD", input: inputPrice, output: outputPrice });
        }
      }
      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: "https://api.novita.ai/openai/models",
      type: "api",
      description: "Dates from Novita AI API — no date field available, derived from model ID",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      // Novita AI API doesn't provide date fields
      // Return empty map — pipeline will use current date for last_updated, omit release_date
      return new Map<string, ExtractedDates>();
    },
  },

  extractLimits: {
    source: {
      url: "https://api.novita.ai/openai/models",
      type: "api",
      description: "Context window and max output from Novita AI API",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();
      for (const m of models) {
        const raw = m.raw as NovitaModel;
        if (!raw) continue;
        if (raw.context_size > 0) {
          limitsMap.set(m.id, { context: raw.context_size, output: raw.max_output_tokens });
        }
      }
      return limitsMap;
    },
  },

  extractModalities: {
    source: {
      url: "https://api.novita.ai/openai/models",
      type: "api",
      description: "Modalities from Novita AI API — input_modalities and output_modalities arrays",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();
      for (const m of models) {
        const raw = m.raw as NovitaModel;
        if (!raw) continue;
        modalitiesMap.set(m.id, {
          input: mapModalities(raw.input_modalities),
          output: mapModalities(raw.output_modalities),
        });
      }
      return modalitiesMap;
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.novita.ai/openai/models",
      type: "api",
      description:
        "Features from Novita AI API — features array (function-calling, reasoning, structured-outputs)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();
      for (const m of models) {
        const raw = m.raw as NovitaModel;
        if (!raw) continue;
        const features: ExtractedFeatures = {};
        const rawFeatures = raw.features ?? [];
        if (rawFeatures.includes("function-calling")) features.tool_call = true;
        if (rawFeatures.includes("reasoning")) features.reasoning = true;
        if (rawFeatures.includes("structured-outputs")) features.structured_output = true;
        featuresMap.set(m.id, features);
      }
      return featuresMap;
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
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /qwen3-coder/i, family: "qwen-coder" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /glm/i, family: "glm" },
        { pattern: /kimi/i, family: "kimi" },
        { pattern: /minimax/i, family: "minimax" },
        { pattern: /llama/i, family: "llama" },
        { pattern: /gemma/i, family: "gemma" },
        { pattern: /mimo/i, family: "mimo" },
        { pattern: /hermes/i, family: "hermes" },
        { pattern: /mistral/i, family: "mistral" },
      ];
      for (const { pattern, family } of rules) {
        if (pattern.test(lower)) return family;
      }
      return lower.split("-")[0] ?? lower;
    },
  },
};

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);
  return { provider, models };
}
