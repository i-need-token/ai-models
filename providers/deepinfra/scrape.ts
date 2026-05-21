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
  id: "deepinfra",
  name: "DeepInfra",
  url: "https://deepinfra.com",
  api_docs: "https://docs.deepinfra.com",
  apis: {
    openai: "https://api.deepinfra.com/v1/openai",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from DeepInfra API)
// ---------------------------------------------------------------------------

interface DeepInfraPricing {
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens?: number;
}

interface DeepInfraMetadata {
  description?: string;
  context_length: number;
  max_tokens: number;
  pricing?: DeepInfraPricing;
  tags?: string[];
}

interface DeepInfraModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  root: string;
  parent: string | null;
  metadata: DeepInfraMetadata | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SKIP_KEYWORDS = [
  "embedding",
  "flux",
  "whisper",
  "tts",
  "embed",
  "sdxl",
  "stable-diffusion",
  "audio",
  "musicgen",
  "bark",
  "image-gen",
  "rerank",
  "janus",
  "clip",
  "bge-",
  "jina-",
  "colpali",
  "siglip",
];

function shouldSkip(apiId: string, tags: string[]): boolean {
  const lower = apiId.toLowerCase();
  for (const kw of SKIP_KEYWORDS) {
    if (lower.includes(kw)) return true;
  }
  for (const tag of tags) {
    if (tag === "embedding" || tag === "rerank") return true;
  }
  return false;
}

function flattenId(apiId: string): string {
  const parts = apiId.split("/");
  const modelName = (parts.length === 2 ? parts[1] : apiId) as string;
  return modelName.toLowerCase().replace(/[@:]/g, "--").replace(/[()]/g, "");
}

async function fetchModels(): Promise<DeepInfraModel[]> {
  const response = await fetch("https://api.deepinfra.com/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch DeepInfra models: ${response.status}`);
  }
  const data = (await response.json()) as { data: DeepInfraModel[] };
  return data.data;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://api.deepinfra.com/v1/models",
      type: "api",
      description:
        "DeepInfra models API — returns model list with metadata.pricing, metadata.context_length, metadata.tags",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchModels();
      const discovered: DiscoveredModel[] = [];

      for (const m of apiModels) {
        const meta = m.metadata;
        if (!meta) continue;
        if (!meta.pricing) continue;
        if (meta.pricing.input_tokens === undefined || meta.pricing.input_tokens === null) continue;

        const tags = meta.tags ?? [];
        if (shouldSkip(m.id, tags)) continue;

        const id = flattenId(m.id);
        discovered.push({ id, raw: m });
      }

      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://api.deepinfra.com/v1/models",
      type: "api",
      description: "Pricing from DeepInfra API — per-1M-token USD pricing in metadata.pricing",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      for (const m of models) {
        const raw = m.raw as DeepInfraModel;
        const meta = raw?.metadata;
        if (!meta?.pricing) continue;

        const p: Pricing = {
          currency: "USD",
          input: Math.round(meta.pricing.input_tokens * 1e6) / 1e6,
          output: Math.round(meta.pricing.output_tokens * 1e6) / 1e6,
        };

        const cacheRead = meta.pricing.cache_read_tokens;
        if (cacheRead !== undefined && cacheRead !== null && cacheRead > 0) {
          p.cache_read = Math.round(cacheRead * 1e6) / 1e6;
        }

        pricingMap.set(m.id, p);
      }

      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: "https://api.deepinfra.com/v1/models",
      type: "api",
      description: "Dates from DeepInfra API — no date field available, using created timestamp",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as DeepInfraModel;
        if (!raw) continue;

        if (raw.created && raw.created > 0) {
          const d = new Date(raw.created * 1000);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          datesMap.set(m.id, { release_date: dateStr, last_updated: dateStr });
        }
      }

      return datesMap;
    },
  },

  extractLimits: {
    source: {
      url: "https://api.deepinfra.com/v1/models",
      type: "api",
      description: "Context window and max output from DeepInfra API metadata",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();

      for (const m of models) {
        const raw = m.raw as DeepInfraModel;
        const meta = raw?.metadata;
        if (!meta) continue;

        const contextLength = meta.context_length ?? 0;
        const maxTokens = meta.max_tokens ?? 0;

        if (contextLength > 0) {
          limitsMap.set(m.id, {
            context: contextLength,
            ...(maxTokens > 0 ? { output: maxTokens } : {}),
          });
        }
      }

      return limitsMap;
    },
  },

  extractModalities: {
    source: {
      url: "https://api.deepinfra.com/v1/models",
      type: "api",
      description: "Modalities from DeepInfra API — inferred from metadata.tags (vision tag)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();

      for (const m of models) {
        const raw = m.raw as DeepInfraModel;
        const meta = raw?.metadata;
        const tags = meta?.tags ?? [];

        const input: ModelModality[] = ["text"];
        if (tags.includes("vision")) input.push("image");

        modalitiesMap.set(m.id, { input });
      }

      return modalitiesMap;
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.deepinfra.com/v1/models",
      type: "api",
      description: "Features from DeepInfra API — metadata.tags (reasoning, prompt_cache)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();

      for (const m of models) {
        const raw = m.raw as DeepInfraModel;
        const meta = raw?.metadata;
        const tags = meta?.tags ?? [];

        const features: ExtractedFeatures = {};
        if (tags.includes("reasoning")) features.reasoning = true;
        if (tags.includes("prompt_cache")) features.temperature = true;

        featuresMap.set(m.id, features);
      }

      return featuresMap;
    },
  },

  deriveName: {
    execute: (modelId: string): string => {
      let name = modelId.replace(/--/g, "/").split("/").pop() || modelId;
      name = name
        .replace(/(\d)-(\d)/g, "$1.$2")
        .replace(/-/g, " ")
        .replace(/\b(\w)/g, (_, c: string) => c.toUpperCase());
      return name;
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      const lower = modelId.toLowerCase();
      const rules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /claude-opus/i, family: "claude-opus" },
        { pattern: /claude-sonnet/i, family: "claude-sonnet" },
        { pattern: /claude-haiku/i, family: "claude-haiku" },
        { pattern: /claude/i, family: "claude" },
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /qwen3-coder/i, family: "qwen-coder" },
        { pattern: /qwen3-vl/i, family: "qwen-vl" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /llama/i, family: "llama" },
        { pattern: /gemini/i, family: "gemini" },
        { pattern: /gemma/i, family: "gemma" },
        { pattern: /mistral-small/i, family: "mistral-small" },
        { pattern: /mistral-nemo/i, family: "mistral-nemo" },
        { pattern: /mistral/i, family: "mistral" },
        { pattern: /mixtral/i, family: "mixtral" },
        { pattern: /phi/i, family: "phi" },
        { pattern: /nemotron/i, family: "nemotron" },
        { pattern: /glm/i, family: "glm" },
        { pattern: /hermes/i, family: "hermes" },
        { pattern: /dolphin/i, family: "dolphin" },
        { pattern: /solar/i, family: "solar" },
        { pattern: /seed/i, family: "seed" },
        { pattern: /minimax/i, family: "minimax" },
        { pattern: /mimo/i, family: "mimo" },
        { pattern: /kimi/i, family: "kimi" },
        { pattern: /step/i, family: "step" },
        { pattern: /mythomax/i, family: "mythomax" },
        { pattern: /gpt-oss/i, family: "gpt-oss" },
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
