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
  id: "venice",
  name: "Venice AI",
  url: "https://venice.ai",
  api_docs: "https://docs.venice.ai",
  apis: {
    openai: "https://api.venice.ai/api/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from Venice AI API)
// ---------------------------------------------------------------------------

interface VenicePricing {
  input: { usd: number; diem: number };
  output: { usd: number; diem: number };
  cache_input?: { usd: number; diem: number };
}

interface VeniceCapabilities {
  supportsReasoning: boolean;
  supportsFunctionCalling: boolean;
  supportsVision: boolean;
  supportsResponseSchema: boolean;
  supportsAudioInput: boolean;
  supportsWebSearch: boolean;
  quantization?: string;
}

interface VeniceModelSpec {
  pricing: VenicePricing;
  capabilities: VeniceCapabilities;
  maxCompletionTokens: number;
  availableContextTokens: number;
  name: string;
  offline: boolean;
  description?: string;
}

interface VeniceModel {
  id: string;
  created: number;
  object: string;
  owned_by: string;
  type: string;
  context_length: number;
  model_spec: VeniceModelSpec;
}

// ---------------------------------------------------------------------------
// API fetch helper
// ---------------------------------------------------------------------------

async function fetchModels(): Promise<VeniceModel[]> {
  const response = await fetch("https://api.venice.ai/api/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Venice models: ${response.status}`);
  }
  const data = (await response.json()) as { data: VeniceModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.venice.ai/api/v1/models",
      type: "api",
      description:
        "Venice AI models API — returns model list with pricing, context, capabilities, modalities",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
        if (m.type !== "text") continue;
        if (m.model_spec.offline) continue;
        const pricing = m.model_spec.pricing;
        if (pricing.input.usd === 0 && pricing.output.usd === 0) continue;

        discovered.push({ id: m.id, raw: m });
      }

      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://api.venice.ai/api/v1/models",
      type: "api",
      description: "Pricing from Venice AI API — per-1M-token USD pricing with cache_input",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();
      for (const m of models) {
        const raw = m.raw as VeniceModel;
        if (!raw) continue;
        const p: Pricing = {
          currency: "USD",
          input: raw.model_spec.pricing.input.usd,
          output: raw.model_spec.pricing.output.usd,
        };
        if (raw.model_spec.pricing.cache_input && raw.model_spec.pricing.cache_input.usd > 0) {
          p.cache_read = raw.model_spec.pricing.cache_input.usd;
        }
        pricingMap.set(m.id, p);
      }
      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: "https://api.venice.ai/api/v1/models",
      type: "api",
      description: "Dates from Venice AI API — created timestamp field",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();
      for (const m of models) {
        const raw = m.raw as VeniceModel;
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
      url: "https://api.venice.ai/api/v1/models",
      type: "api",
      description: "Context window and max output from Venice AI API",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();
      for (const m of models) {
        const raw = m.raw as VeniceModel;
        if (!raw) continue;
        if (raw.context_length > 0) {
          limitsMap.set(m.id, {
            context: raw.context_length,
            output: raw.model_spec.maxCompletionTokens,
          });
        }
      }
      return limitsMap;
    },
  },

  extractModalities: {
    source: {
      url: "https://api.venice.ai/api/v1/models",
      type: "api",
      description: "Modalities from Venice AI API — vision capability determines image input",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();
      for (const m of models) {
        const raw = m.raw as VeniceModel;
        if (!raw) continue;
        const inputModalities: ModelModality[] = ["text"];
        if (raw.model_spec.capabilities.supportsVision) inputModalities.push("image");
        modalitiesMap.set(m.id, { input: inputModalities });
      }
      return modalitiesMap;
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.venice.ai/api/v1/models",
      type: "api",
      description:
        "Features from Venice AI API — reasoning, function calling, response schema, vision",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();
      for (const m of models) {
        const raw = m.raw as VeniceModel;
        if (!raw) continue;
        const caps = raw.model_spec.capabilities;
        const features: ExtractedFeatures = {};
        if (caps.supportsReasoning) features.reasoning = true;
        if (caps.supportsFunctionCalling) features.tool_call = true;
        if (caps.supportsResponseSchema) features.structured_output = true;
        if (caps.supportsVision) features.attachment = true;
        featuresMap.set(m.id, features);
      }
      return featuresMap;
    },
  },

  deriveName: {
    execute: (modelId: string): string => {
      // Venice model names are already human-readable
      return modelId;
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      const lower = modelId.toLowerCase();
      const rules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /claude-opus/i, family: "claude-opus" },
        { pattern: /claude-sonnet/i, family: "claude-sonnet" },
        { pattern: /gpt-oss/i, family: "gpt-oss" },
        { pattern: /gpt/i, family: "gpt" },
        { pattern: /gemini/i, family: "gemini" },
        { pattern: /gemma/i, family: "gemma" },
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /qwen-coder/i, family: "qwen-coder" },
        { pattern: /qwen-vl/i, family: "qwen-vl" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /glm/i, family: "glm" },
        { pattern: /grok/i, family: "grok" },
        { pattern: /mistral-small/i, family: "mistral-small" },
        { pattern: /mistral/i, family: "mistral" },
        { pattern: /llama/i, family: "llama" },
        { pattern: /kimi/i, family: "kimi" },
        { pattern: /minimax/i, family: "minimax" },
        { pattern: /nemotron/i, family: "nemotron" },
        { pattern: /mercury/i, family: "mercury" },
        { pattern: /arcee/i, family: "arcee" },
        { pattern: /aion/i, family: "aion" },
        { pattern: /hermes/i, family: "hermes" },
        { pattern: /venice-uncensored/i, family: "venice-uncensored" },
      ];
      for (const { pattern, family } of rules) {
        if (pattern.test(lower)) return family;
      }
      if (lower.startsWith("e2ee-"))
        return "e2ee-" + pipeline.deriveFamily.execute(lower.replace("e2ee-", ""));
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
