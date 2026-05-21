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
  id: "aihubmix",
  name: "AIHubMix",
  url: "https://aihubmix.com",
  api_docs: "https://aihubmix.com/docs",
  apis: {
    openai: "https://api.aihubmix.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from AIHubMix pagination API)
// ---------------------------------------------------------------------------

interface ApiModel {
  model: string;
  model_ratio: number;
  completion_ratio: number;
  cache_ratio: number;
  billing_config: string;
  modalities: string;
  context_window: number;
  developer: string;
  features: string;
  flag: number;
  desc_en: string;
  latency: number;
  throughput: number;
}

interface BillingTier {
  tier_condition: { min_tokens: number; max_tokens: number };
  model_ratio: number;
  prompt_tokens_ratio: number;
  completion_tokens_ratio: number;
  cached_tokens_ratio?: number;
  cache_write_tokens_ratio?: number;
}

interface BillingConfig {
  model_name: string;
  default_tier: string;
  token_based_tier_configs: Record<string, BillingTier>;
  enabled_billing_items: string[];
  per_unit_price_config: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SKIP_PREFIXES = [
  "coding-",
  "cc-",
  "mm-",
  "bai-",
  "aihub-",
  "aihubmix-",
  "AiHubmix-",
  "Aihubmix-",
  "ahm-",
  "deepinfra-",
  "alicloud-",
  "azure-",
  "cbs-",
  "moonshot-",
  "chutesai/",
  "Pro/",
];

const SKIP_KEYWORDS = [
  "embed",
  "rerank",
  "whisper",
  "tts",
  "flux",
  "sdxl",
  "stable-diffusion",
  "dall",
  "ideogram",
  "kolors",
  "cogview",
  "seedream",
  "seedance",
  "wan2",
  "happyhorse",
  "jina-",
  "florence",
  "rmbg",
  "uvdoc",
  "esrgan",
  "dreamo",
  "hidream",
  "vajra",
  "instant",
  "omni-consistency",
  "sam3",
  "longcat",
  "codestral",
  "sora",
  "imagen",
  "musesteamer",
  "pp-structure",
  "qwen-image",
  "DESCRIBE",
  "UPSCALE",
  "V_1",
  "V_2",
  "V_3",
  "bge-",
  "bge/",
  "gpt-image",
  "computer-use",
];

function shouldSkip(apiModel: ApiModel): boolean {
  const id = apiModel.model;
  if (apiModel.model_ratio <= 0) return true;
  for (const prefix of SKIP_PREFIXES) {
    if (id.startsWith(prefix)) return true;
  }
  if (id.includes("(") || id.includes(")")) return true;
  const lower = id.toLowerCase();
  for (const kw of SKIP_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) return true;
  }
  const bc = parseBillingConfig(apiModel.billing_config);
  if (bc) {
    const items = bc.enabled_billing_items;
    if (items.includes("image_count") && !items.includes("prompt_tokens")) return true;
    if (items.includes("search_units") && !items.includes("prompt_tokens")) return true;
  }
  return false;
}

function parseBillingConfig(raw: string): BillingConfig | null {
  if (!raw || !raw.trim()) return null;
  try {
    return JSON.parse(raw) as BillingConfig;
  } catch {
    return null;
  }
}

function deriveModelId(raw: string): string {
  return raw
    .replace(/\//g, "--")
    .replace(/:/g, "--")
    .replace(/@/g, "--")
    .replace(/\(/g, "--")
    .replace(/\)/g, "")
    .toLowerCase();
}

const MODALITY_MAP: Record<string, ModelModality | undefined> = {
  text: "text",
  image: "image",
  video: "video",
  audio: "audio",
  pdf: "pdf",
};

async function fetchAllModels(): Promise<ApiModel[]> {
  const allModels: ApiModel[] = [];
  const pageSize = 100;
  let page = 1;
  while (true) {
    const url = `https://aihubmix.com/call/mdl_info_pagination?p=${page}&num=${pageSize}&sort_by=&sort_order=desc`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
    const data = (await res.json()) as { data: ApiModel[]; total: number; success: boolean };
    if (!data.data || data.data.length === 0) break;
    allModels.push(...data.data);
    if (allModels.length >= data.total) break;
    page++;
  }
  return allModels;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://aihubmix.com/call/mdl_info_pagination",
      type: "api",
      description:
        "AIHubMix pagination API — returns model list with pricing, context, modalities, features",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const apiModels = await fetchAllModels();
      const discovered: DiscoveredModel[] = [];
      for (const m of apiModels) {
        if (shouldSkip(m)) continue;
        const id = deriveModelId(m.model);
        discovered.push({ id, raw: m });
      }
      return discovered;
    },
  },

  extractPricing: {
    source: {
      url: "https://aihubmix.com/call/mdl_info_pagination",
      type: "api",
      description: "Pricing from AIHubMix API — model_ratio * completion_ratio per-1M-token USD",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();
      for (const m of models) {
        const raw = m.raw as ApiModel;
        if (!raw) continue;
        const ratio = raw.model_ratio;
        const compRatio = raw.completion_ratio;
        if (ratio <= 0) continue;
        const input = Math.round(ratio * 1e6) / 1e6;
        const output = Math.round(ratio * compRatio * 1e6) / 1e6;
        const p: Pricing = { currency: "USD", input, output };
        const bc = parseBillingConfig(raw.billing_config);
        if (bc) {
          const tier1 = bc.token_based_tier_configs?.["tier1"];
          if (tier1) {
            if (
              tier1.cached_tokens_ratio !== undefined &&
              tier1.cached_tokens_ratio > 0 &&
              tier1.cached_tokens_ratio !== 1
            ) {
              const cacheRead = Math.round(ratio * tier1.cached_tokens_ratio * 1e6) / 1e6;
              if (cacheRead > 0) p.cache_read = cacheRead;
            }
            if (tier1.cache_write_tokens_ratio !== undefined) {
              const cacheWrite = Math.round(ratio * tier1.cache_write_tokens_ratio * 1e6) / 1e6;
              if (cacheWrite > 0) p.cache_write = cacheWrite;
            }
          }
        }
        if (p.cache_read === undefined && raw.cache_ratio > 0 && raw.cache_ratio !== 1) {
          const cacheRead = Math.round(ratio * raw.cache_ratio * 1e6) / 1e6;
          if (cacheRead > 0) p.cache_read = cacheRead;
        }
        pricingMap.set(m.id, p);
      }
      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: "https://aihubmix.com/call/mdl_info_pagination",
      type: "api",
      description: "Dates from AIHubMix API — no date field available",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      return new Map<string, ExtractedDates>();
    },
  },

  extractLimits: {
    source: {
      url: "https://aihubmix.com/call/mdl_info_pagination",
      type: "api",
      description: "Context window from AIHubMix API — context_window field",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();
      for (const m of models) {
        const raw = m.raw as ApiModel;
        if (!raw) continue;
        if (raw.context_window > 0) {
          limitsMap.set(m.id, { context: raw.context_window });
        }
      }
      return limitsMap;
    },
  },

  extractModalities: {
    source: {
      url: "https://aihubmix.com/call/mdl_info_pagination",
      type: "api",
      description: "Modalities from AIHubMix API — modalities comma-separated string",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();
      for (const m of models) {
        const raw = m.raw as ApiModel;
        if (!raw) continue;
        const mods = raw.modalities
          .split(",")
          .map((s: string) => s.trim().toLowerCase())
          .filter(Boolean);
        const input: ModelModality[] = [];
        for (const mod of mods) {
          const mapped = MODALITY_MAP[mod];
          if (mapped && mapped !== "text") input.push(mapped);
        }
        if (!input.includes("text")) input.unshift("text");
        modalitiesMap.set(m.id, { input });
      }
      return modalitiesMap;
    },
  },

  extractFeatures: {
    source: {
      url: "https://aihubmix.com/call/mdl_info_pagination",
      type: "api",
      description: "Features from AIHubMix API — features comma-separated string",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();
      for (const m of models) {
        const raw = m.raw as ApiModel;
        if (!raw) continue;
        const feats = raw.features
          .split(",")
          .map((s: string) => s.trim().toLowerCase())
          .filter(Boolean);
        const features: ExtractedFeatures = {};
        if (feats.includes("thinking") || feats.includes("reasoning")) features.reasoning = true;
        if (feats.includes("tools") || feats.includes("function_calling"))
          features.tool_call = true;
        if (feats.includes("structured_outputs")) features.structured_output = true;
        featuresMap.set(m.id, features);
      }
      return featuresMap;
    },
  },

  deriveName: {
    execute: (modelId: string): string => {
      let name = modelId.replace(/--/g, "/").replace(/-/g, " ");
      name = name.replace(/\b\w/g, (c: string) => c.toUpperCase());
      return name;
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      const lower = modelId.toLowerCase().replace(/--/g, "/");
      const rules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /claude-opus/i, family: "claude-opus" },
        { pattern: /claude-sonnet/i, family: "claude-sonnet" },
        { pattern: /claude-haiku/i, family: "claude-haiku" },
        { pattern: /claude/i, family: "claude" },
        { pattern: /gpt-oss/i, family: "gpt-oss" },
        { pattern: /gpt/i, family: "gpt" },
        { pattern: /o4/i, family: "o" },
        { pattern: /o3/i, family: "o" },
        { pattern: /o1/i, family: "o" },
        { pattern: /gemini/i, family: "gemini" },
        { pattern: /deepseek/i, family: "deepseek" },
        { pattern: /qwen3-coder/i, family: "qwen-coder" },
        { pattern: /qwen/i, family: "qwen" },
        { pattern: /qwq/i, family: "qwq" },
        { pattern: /grok/i, family: "grok" },
        { pattern: /glm/i, family: "glm" },
        { pattern: /ernie/i, family: "ernie" },
        { pattern: /kimi/i, family: "kimi" },
        { pattern: /minimax/i, family: "minimax" },
        { pattern: /doubao-seed/i, family: "doubao-seed" },
        { pattern: /doubao/i, family: "doubao" },
        { pattern: /seed-oss/i, family: "seed-oss" },
        { pattern: /llama/i, family: "llama" },
        { pattern: /mistral-large/i, family: "mistral-large" },
        { pattern: /mistral-small/i, family: "mistral-small" },
        { pattern: /mistral/i, family: "mistral" },
        { pattern: /command-a/i, family: "command-a" },
        { pattern: /command-r-plus/i, family: "command-r-plus" },
        { pattern: /command-r/i, family: "command-r" },
        { pattern: /command/i, family: "command" },
        { pattern: /mimo/i, family: "mimo" },
        { pattern: /yi-/i, family: "yi" },
        { pattern: /baichuan/i, family: "baichuan" },
        { pattern: /step-/i, family: "step" },
        { pattern: /sonar/i, family: "sonar" },
        { pattern: /jamba/i, family: "jamba" },
        { pattern: /phi/i, family: "phi" },
        { pattern: /nemotron/i, family: "nemotron" },
        { pattern: /hunyuan/i, family: "hunyuan" },
        { pattern: /nova/i, family: "nova" },
        { pattern: /chatglm/i, family: "chatglm" },
        { pattern: /granite/i, family: "granite" },
        { pattern: /mythomax/i, family: "mythomax" },
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
