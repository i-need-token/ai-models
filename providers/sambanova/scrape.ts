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
  id: "sambanova",
  name: "SambaNova",
  url: "https://sambanova.ai",
  api_docs: "https://docs.sambanova.ai",
  apis: {
    openai: "https://api.sambanova.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// API types
// ---------------------------------------------------------------------------

interface SambaNovaModel {
  id: string;
  context_length: number;
  max_completion_tokens: number;
  object: string;
  owned_by: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  sn_metadata: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Feature inference rules — regex-based instead of static sets
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Pipeline steps
// ---------------------------------------------------------------------------

const API_URL = "https://api.sambanova.ai/v1/models";
const apiSource: DataSource = {
  url: API_URL,
  type: "api",
  description: "SambaNova OpenAI-compatible models API with pricing and context limits",
};

// Step 1: Discover models
const discover = {
  source: apiSource,
  execute: async (): Promise<DiscoveredModel[]> => {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error(`Failed to fetch ${API_URL}: ${resp.status}`);
    const data = (await resp.json()) as { data: SambaNovaModel[] };
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
      const raw = dm.raw as SambaNovaModel;
      const prompt = parseFloat(raw.pricing.prompt);
      const completion = parseFloat(raw.pricing.completion);
      // API gives per-token pricing; convert to per-million-token (multiply by 1M)
      map.set(dm.id, {
        currency: "USD",
        input: prompt * 1_000_000,
        output: completion * 1_000_000,
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
      const raw = dm.raw as SambaNovaModel;
      map.set(dm.id, {
        context: raw.context_length,
        output: raw.max_completion_tokens,
      });
    }
    return map;
  },
};

// Step 4: Extract modalities — not available from API, omitted
const extractModalities = {
  source: apiSource,
  execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
    return new Map<string, ExtractedModalities>();
  },
};

// Step 5: Extract features — not available from API, omitted
const extractFeatures = {
  source: apiSource,
  execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
    return new Map<string, ExtractedFeatures>();
  },
};

// Step 6: Extract dates — no date info from API, omit rather than hallucinate
const extractDates = {
  source: apiSource,
  execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
    return new Map<string, ExtractedDates>();
  },
};

// Step 7: Derive name from model ID
const deriveName = {
  execute: (modelId: string): string => {
    // Handle known patterns
    if (modelId === "DeepSeek-V3.1") return "DeepSeek V3.1";
    if (modelId === "DeepSeek-V3.2") return "DeepSeek V3.2";
    if (modelId === "Llama-4-Maverick-17B-128E-Instruct") return "Llama 4 Maverick 17Bx128E";
    if (modelId === "Meta-Llama-3.3-70B-Instruct") return "Llama 3.3 70B";
    if (modelId === "MiniMax-M2.5") return "MiniMax M2.5";
    if (modelId === "MiniMax-M2.7") return "MiniMax M2.7";
    if (modelId === "gemma-3-12b-it") return "Gemma 3 12B IT";
    if (modelId === "gpt-oss-120b") return "GPT OSS 120B";
    // Generic fallback: replace hyphens with spaces, capitalize words
    return modelId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  },
};

// Step 8: Derive family from model ID
const deriveFamily = {
  execute: (modelId: string): string => {
    if (modelId.includes("DeepSeek")) return "deepseek";
    if (modelId.includes("Llama")) return "llama";
    if (modelId.includes("MiniMax")) return "minimax";
    if (modelId.includes("gemma")) return "gemma";
    if (modelId.includes("gpt-oss")) return "gpt-oss";
    return modelId.split("-")[0] ?? modelId;
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

  console.log(`  SambaNova: ${models.length} models`);

  return { provider, models };
}
