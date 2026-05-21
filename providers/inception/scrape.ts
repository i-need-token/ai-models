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
  id: "inception",
  name: "Inception Labs",
  url: "https://inceptionlabs.ai",
  api_docs: "https://docs.inceptionlabs.ai",
  apis: {
    openai: "https://api.inceptionlabs.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// API types — Inception Labs OpenAI-compatible models endpoint
// ---------------------------------------------------------------------------

interface InceptionModel {
  id: string;
  name: string;
  created: number;
  input_modalities: string[];
  output_modalities: string[];
  context_length: number;
  max_output_length: number;
  pricing: {
    prompt: string;
    completion: string;
    image: string;
    request: string;
    input_cache_reads: string;
    input_cache_writes: string;
  };
  supported_sampling_parameters: string[];
  supported_features: string[];
  description: string;
}

// ---------------------------------------------------------------------------
// Pipeline steps
// ---------------------------------------------------------------------------

const API_URL = "https://api.inceptionlabs.ai/v1/models";
const apiSource: DataSource = {
  url: API_URL,
  type: "api",
  description:
    "Inception Labs OpenAI-compatible models API with pricing, context, modalities, and features",
};

// Step 1: Discover models
const discover = {
  source: apiSource,
  execute: async (): Promise<DiscoveredModel[]> => {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error(`Failed to fetch ${API_URL}: ${resp.status}`);
    const data = (await resp.json()) as { data: InceptionModel[] };
    return data.data.map((m) => ({
      id: m.id,
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
      const raw = dm.raw as InceptionModel;
      const prompt = parseFloat(raw.pricing.prompt);
      const completion = parseFloat(raw.pricing.completion);
      const cacheRead = parseFloat(raw.pricing.input_cache_reads);
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

// Step 3: Extract limits — context_length and max_output_length from API
const extractLimits = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
    const map = new Map<string, ExtractedLimit>();
    for (const dm of models) {
      const raw = dm.raw as InceptionModel;
      map.set(dm.id, {
        context: raw.context_length,
        output: raw.max_output_length,
      });
    }
    return map;
  },
};

// Step 4: Extract modalities — input/output modalities from API
const extractModalities = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
    const map = new Map<string, ExtractedModalities>();
    for (const dm of models) {
      const raw = dm.raw as InceptionModel;
      const input = raw.input_modalities as ExtractedModalities["input"];
      const output = raw.output_modalities as ExtractedModalities["output"];
      map.set(dm.id, {
        input,
        ...(output ? { output } : {}),
      });
    }
    return map;
  },
};

// Step 5: Extract features — supported_features from API
const extractFeatures = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
    const map = new Map<string, ExtractedFeatures>();
    for (const dm of models) {
      const raw = dm.raw as InceptionModel;
      const features: ExtractedFeatures = {
        temperature: raw.supported_sampling_parameters.includes("temperature"),
      };
      // Map supported_features to model feature flags
      if (raw.supported_features.includes("tools")) features.tool_call = true;
      if (raw.supported_features.includes("structured_outputs")) features.structured_output = true;
      if (raw.supported_features.includes("json_mode")) features.structured_output = true;
      map.set(dm.id, features);
    }
    return map;
  },
};

// Step 6: Extract dates — created timestamp from API
const extractDates = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
    const map = new Map<string, ExtractedDates>();
    for (const dm of models) {
      const raw = dm.raw as InceptionModel;
      // API provides created timestamp (seconds since epoch)
      const releaseDate = new Date(raw.created * 1000).toISOString().slice(0, 10);
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
    // Most inception models have simple IDs
    if (modelId === "mercury") return "Mercury";
    if (modelId === "mercury-2") return "Mercury 2";
    if (modelId === "mercury-coder") return "Mercury Coder";
    if (modelId === "mercury-edit") return "Mercury Edit";
    if (modelId === "mercury-edit-2") return "Mercury Edit 2";
    // Generic fallback
    return modelId.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  },
};

// Step 8: Derive family from model ID
const deriveFamily = {
  execute: (_modelId: string): string => {
    // All Inception models are in the mercury family
    return "mercury";
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

  console.log(`  Inception Labs: ${models.length} models`);

  return { provider, models };
}
