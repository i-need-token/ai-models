import { defineProvider, runPipeline } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Pricing } from "../../types/index";
import type {
  DiscoveredModel,
  DataSource,
  ExtractedLimit,
  ExtractedModalities,
  ExtractedFeatures,
  ExtractedDates,
} from "../../scripts/lib/pipeline";

const provider = defineProvider({
  id: "aion",
  name: "Aion Labs",
  url: "https://aionlabs.ai",
  api_docs: "https://docs.aionlabs.ai",
  apis: {
    openai: "https://api.aionlabs.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// API types — Aion Labs models endpoint
// ---------------------------------------------------------------------------

interface AionModel {
  id: string;
  date: string;
  name: string;
  description: string;
  context_length: number;
  max_completion_tokens: number;
  reasoning: boolean;
  is_moderated: boolean;
  architecture: {
    modality: string;
  };
  pricing: {
    prompt: string;
    completion: string;
    input_cache_read?: string;
  };
  expires_at: string | null;
  replacement_model_id: string | null;
}

// ---------------------------------------------------------------------------
// Pipeline steps
// ---------------------------------------------------------------------------

const API_URL = "https://api.aionlabs.ai/v1/models";
const apiSource: DataSource = {
  url: API_URL,
  type: "api",
  description: "Aion Labs models API with pricing, context, modalities, reasoning, and dates",
};

// Step 1: Discover models
const discover = {
  source: apiSource,
  execute: async (): Promise<DiscoveredModel[]> => {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error(`Failed to fetch ${API_URL}: ${resp.status}`);
    const data = (await resp.json()) as { models: AionModel[] };
    return data.models.map((m) => ({
      id: m.id.replace("aion-labs/", ""), // Strip namespace prefix
      raw: m,
    }));
  },
};

// Step 2: Extract pricing — per-token pricing from API, convert to per-M-token
const extractPricing = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
    const map = new Map<string, Pricing>();
    for (const dm of models) {
      const raw = dm.raw as AionModel;
      const prompt = parseFloat(raw.pricing.prompt);
      const completion = parseFloat(raw.pricing.completion);
      const cacheRead = raw.pricing.input_cache_read ? parseFloat(raw.pricing.input_cache_read) : 0;
      // API gives per-token pricing; convert to per-million-token (multiply by 1M)
      map.set(dm.id, {
        currency: "USD",
        input: prompt * 1_000_000,
        output: completion * 1_000_000,
        ...(cacheRead > 0 ? { cache_read: cacheRead * 1_000_000 } : {}),
      });
    }
    return map;
  },
};

// Step 3: Extract limits — context_length and max_completion_tokens from API
const extractLimits = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
    const map = new Map<string, ExtractedLimit>();
    for (const dm of models) {
      const raw = dm.raw as AionModel;
      map.set(dm.id, {
        context: raw.context_length,
        output: raw.max_completion_tokens,
      });
    }
    return map;
  },
};

// Step 4: Extract modalities — from architecture.modality field
const extractModalities = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
    const map = new Map<string, ExtractedModalities>();
    for (const dm of models) {
      const raw = dm.raw as AionModel;
      // Parse modality string like "text->text" or "text+image->text"
      const modality = raw.architecture.modality;
      const inputPart = modality.split("->")[0] ?? "text";
      const hasImage = inputPart.includes("image");
      map.set(dm.id, {
        input: hasImage ? ["text", "image"] : ["text"],
      });
    }
    return map;
  },
};

// Step 5: Extract features — reasoning from API, temperature for all
const extractFeatures = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
    const map = new Map<string, ExtractedFeatures>();
    for (const dm of models) {
      const raw = dm.raw as AionModel;
      map.set(dm.id, {
        reasoning: raw.reasoning,
      });
    }
    return map;
  },
};

// Step 6: Extract dates — date field from API
const extractDates = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
    const map = new Map<string, ExtractedDates>();
    for (const dm of models) {
      const raw = dm.raw as AionModel;
      // API provides date in YYYY-MM-DD format
      const releaseDate = raw.date;
      map.set(dm.id, {
        release_date: releaseDate,
        last_updated: releaseDate,
      });
    }
    return map;
  },
};

// Step 7: Derive name from model ID
const deriveName = {
  execute: (modelId: string): string => {
    if (modelId === "aion-1.0-mini") return "Aion 1.0 Mini";
    if (modelId === "aion-1.0") return "Aion 1.0";
    if (modelId === "aion-2.0") return "Aion 2.0";
    if (modelId === "aion-2.5") return "Aion 2.5";
    if (modelId === "aion-rp-llama-3.1-8b") return "Aion RP Llama 3.1 8B";
    // Generic fallback
    return modelId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  },
};

// Step 8: Derive family from model ID
const deriveFamily = {
  execute: (modelId: string): string => {
    if (modelId.startsWith("aion-rp")) return "aion-rp";
    return "aion";
  },
};

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline({
    discover,
    extractPricing,
    extractLimits,
    extractModalities,
    extractFeatures,
    extractDates,
    deriveName,
    deriveFamily,
  });

  console.log(`  Aion Labs: ${models.length} models`);

  return { provider, models };
}
