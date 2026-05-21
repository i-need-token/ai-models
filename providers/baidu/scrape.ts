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
  id: "baidu",
  name: "Baidu",
  url: "https://yiyan.baidu.com",
  api_docs: "https://cloud.baidu.com/doc/WENXINWORKSHOP",
  apis: {
    openai: "https://qianfan.baidubce.com/v1",
  },
});

// ---------------------------------------------------------------------------
// API types — Baidu Qianfan models endpoint
// ---------------------------------------------------------------------------

interface BaiduModel {
  id: string;
  name: string;
  created: number;
  context_length: number;
  max_output_length: number;
  input_modalities: string[];
  output_modalities: string[];
  pricing: {
    prompt: string;
    completion: string;
    image: string;
    request: string;
    input_cache_read: string;
  };
  supported_features: string[];
  supported_sampling_parameters: string[];
  description: string;
  quantization: string;
  deprecation_date: string;
  hugging_face_id: string;
  openrouter: { slug: string };
  datacenters: Array<{ country_code: string }>;
}

// ---------------------------------------------------------------------------
// Pipeline steps
// ---------------------------------------------------------------------------

const API_URL = "https://qianfan.baidubce.com/v1/models";
const apiSource: DataSource = {
  url: API_URL,
  type: "api",
  description:
    "Baidu Qianfan models API with pricing, context, modalities, and features for platform models",
};

// Step 1: Discover models — API models + static ERNIE models
const discover = {
  source: apiSource,
  execute: async (): Promise<DiscoveredModel[]> => {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error(`Failed to fetch ${API_URL}: ${resp.status}`);
    const data = (await resp.json()) as { data: BaiduModel[] };

    // API models only — ERNIE models not in API are omitted
    const apiModels: DiscoveredModel[] = data.data.map((m) => ({
      id: m.id,
      raw: m,
    }));

    return apiModels;
  },
};

// Step 2: Extract pricing — API models from API, ERNIE from static dict
const extractPricing = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
    const map = new Map<string, Pricing>();
    for (const dm of models) {
      const raw = dm.raw as BaiduModel | null;
      if (!raw) continue;
      const prompt = parseFloat(raw.pricing.prompt);
      const completion = parseFloat(raw.pricing.completion);
      const cacheRead = parseFloat(raw.pricing.input_cache_read);
      // cobuddy has zero pricing → free
      if (prompt === 0 && completion === 0) {
        map.set(dm.id, { unit: "free" });
      } else {
        map.set(dm.id, {
          currency: "USD",
          input: prompt * 1_000_000,
          output: completion * 1_000_000,
          ...(cacheRead > 0 ? { cache_read: cacheRead * 1_000_000 } : {}),
        });
      }
    }
    return map;
  },
};

// Step 3: Extract limits — API models from API, ERNIE from static dict
const extractLimits = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
    const map = new Map<string, ExtractedLimit>();
    for (const dm of models) {
      const raw = dm.raw as BaiduModel | null;
      if (!raw) continue;
      map.set(dm.id, {
        context: raw.context_length,
        output: raw.max_output_length,
      });
    }
    return map;
  },
};

// Step 4: Extract modalities — API models from API, ERNIE from static dict
const extractModalities = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
    const map = new Map<string, ExtractedModalities>();
    for (const dm of models) {
      const raw = dm.raw as BaiduModel | null;
      if (!raw) continue;
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

// Step 5: Extract features — API models from API, ERNIE from static dict
const extractFeatures = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
    const map = new Map<string, ExtractedFeatures>();
    for (const dm of models) {
      const raw = dm.raw as BaiduModel | null;
      if (!raw) continue;
      const features: ExtractedFeatures = {
        temperature: raw.supported_sampling_parameters.includes("temperature"),
      };
      if (raw.supported_features.includes("tools")) features.tool_call = true;
      if (raw.supported_features.includes("structured_outputs")) features.structured_output = true;
      if (raw.supported_features.includes("reasoning")) features.reasoning = true;
      // Vision models have attachment
      if (raw.input_modalities.includes("image")) features.attachment = true;
      map.set(dm.id, features);
    }
    return map;
  },
};

// Step 6: Extract dates — API models from created timestamp, ERNIE from static dict
const extractDates = {
  source: apiSource,
  execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
    const map = new Map<string, ExtractedDates>();
    for (const dm of models) {
      const raw = dm.raw as BaiduModel | null;
      if (!raw) continue;
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
    // ERNIE models
    if (modelId === "ernie-4.5-21b-a3b") return "ERNIE 4.5 21B A3B";
    if (modelId === "ernie-4.5-21b-a3b-thinking") return "ERNIE 4.5 21B A3B Thinking";
    if (modelId === "ernie-4.5-300b-a47b") return "ERNIE 4.5 300B A47B";
    if (modelId === "ernie-4.5-vl-28b-a3b") return "ERNIE 4.5 VL 28B A3B";
    if (modelId === "ernie-4.5-vl-424b-a47b") return "ERNIE 4.5 VL 424B A47B";
    if (modelId === "cobuddy") return "CoBuddy";
    if (modelId === "qianfan-ocr-fast") return "Qianfan OCR Fast";
    // Generic: capitalize words
    return modelId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  },
};

// Step 8: Derive family from model ID
const deriveFamily = {
  execute: (modelId: string): string => {
    if (modelId.startsWith("ernie")) return "ernie";
    if (modelId === "cobuddy") return "cobuddy";
    if (modelId.startsWith("qianfan")) return "qianfan";
    if (modelId.startsWith("deepseek")) return "deepseek";
    if (modelId.startsWith("glm")) return "glm";
    if (modelId.startsWith("minimax")) return "minimax";
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

  console.log(`  Baidu: ${models.length} models`);

  return { provider, models };
}
