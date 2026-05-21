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
  id: "aimlapi",
  name: "AI/ML API",
  url: "https://aimlapi.com",
  api_docs: "https://aimlapi.com/ai-ml-api-pricing",
  apis: {
    openai: "https://api.aimlapi.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Types for API and pricing page data
// ---------------------------------------------------------------------------

interface ApiModel {
  id: string;
  type: string;
  info?: {
    name?: string;
    developer?: string;
    description?: string;
    contextLength?: number;
    maxTokens?: number;
  };
  features?: string[];
  endpoints?: string[];
}

interface PricingPageModel {
  displayName: string;
  modelId: string;
  developer: string;
  modelName: string;
  context: string;
  inputPrice: number;
  outputPrice: number;
  hasOutputPrice: boolean;
  apiModel: ApiModel | null;
}

// ---------------------------------------------------------------------------
// Helper: parse context shorthand to numeric tokens
// ---------------------------------------------------------------------------

function parseContext(ctx: string): number {
  if (!ctx) return 0;
  const normalized = ctx.replace(/К/g, "K").replace(/к/g, "k");
  const lower = normalized.toLowerCase();
  const numStr = lower.replace(/[km]/g, "");
  const num = parseFloat(numStr);
  if (isNaN(num)) return 0;
  if (lower.includes("m")) return num * 1_000_000;
  if (lower.includes("k")) return num * 1_000;
  return num;
}

// ---------------------------------------------------------------------------
// Helper: extract pricing data from HTML page
// ---------------------------------------------------------------------------

function extractPricingFromHtml(html: string): PricingPageModel[] {
  const results: PricingPageModel[] = [];

  const blocks = html.split("total-table-price w-dyn-item");
  for (const block of blocks.slice(1)) {
    const nameMatch = block.match(/footer-headline break">(.*?)<\/div>/);
    if (!nameMatch) continue;
    const displayName = nameMatch[1]?.trim() ?? "";

    const slashIdx = displayName.indexOf(" / ");
    let developer = "";
    let modelName = displayName;
    if (slashIdx >= 0) {
      developer = displayName.slice(0, slashIdx).trim();
      modelName = displayName.slice(slashIdx + 3).trim();
    }

    const devSlug = developer.toLowerCase().replace(/\s+/g, "-");
    const modelSlug = modelName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[()[\]]/g, "");
    const modelId = developer ? `${devSlug}--${modelSlug}` : modelSlug;

    const ctxMatch = block.match(/context-table">(.*?)<\/div>/);
    const context = ctxMatch ? (ctxMatch[1]?.trim() ?? "") : "";

    const inputMatch = block.match(/input-table[^>]*>(.*?)<\/div>/);
    const inputStr = inputMatch ? (inputMatch[1]?.trim() ?? "0") : "0";
    const inputPrice = parseFloat(inputStr) || 0;

    const outputMatch = block.match(/output-table[^>]*>(.*?)<\/div>/);
    const outputStr = outputMatch ? (outputMatch[1]?.trim() ?? "") : "";
    const outputPrice = outputStr ? parseFloat(outputStr) || 0 : 0;
    const hasOutputPrice = outputStr !== "";

    results.push({
      displayName,
      modelId,
      developer,
      modelName,
      context,
      inputPrice,
      outputPrice,
      hasOutputPrice,
      apiModel: null,
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Helper: deduplicate pricing page models (page lists them twice)
// ---------------------------------------------------------------------------

function deduplicate(models: PricingPageModel[]): PricingPageModel[] {
  const seen = new Map<string, PricingPageModel>();
  for (const m of models) {
    if (!seen.has(m.modelId)) {
      seen.set(m.modelId, m);
    }
  }
  return Array.from(seen.values());
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://aimlapi.com/ai-ml-api-pricing",
      type: "api",
      description: "AI/ML API pricing page HTML + /v1/models API for features",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      // 1. Fetch pricing page HTML
      const html = await fetch("https://aimlapi.com/ai-ml-api-pricing").then((r) => r.text());
      const pricingModels = deduplicate(extractPricingFromHtml(html));

      // 2. Fetch API /v1/models for features and context
      const apiResp = (await fetch("https://api.aimlapi.com/v1/models").then((r) => r.json())) as {
        data: ApiModel[];
      };
      const apiChatModels = apiResp.data.filter((m) => m.type === "chat-completion");

      // Build name→API model map for enrichment
      const apiByName = new Map<string, ApiModel>();
      for (const m of apiChatModels) {
        const name = m.info?.name ?? "";
        if (name) apiByName.set(name.toLowerCase(), m);
      }

      // Enrich pricing models with API data
      for (const pm of pricingModels) {
        const apiModel = apiByName.get(pm.modelName.toLowerCase());
        if (apiModel) {
          pm.apiModel = apiModel;
        }
      }

      // 3. Filter to chat-completion models (those with output price or $0 pricing)
      const chatModels = pricingModels.filter((m) => m.hasOutputPrice || m.inputPrice === 0);

      return chatModels.map((pm) => ({
        id: pm.modelId,
        raw: pm,
      }));
    },
  },

  extractPricing: {
    source: {
      url: "https://aimlapi.com/ai-ml-api-pricing",
      type: "api",
      description: "Pricing from HTML page — per-1M-token USD pricing",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const map = new Map<string, Pricing>();
      for (const dm of models) {
        const raw = dm.raw as PricingPageModel;
        if (raw.inputPrice === 0 && raw.outputPrice === 0) {
          map.set(dm.id, { unit: "free" });
        } else if (raw.inputPrice > 0) {
          map.set(dm.id, {
            currency: "USD",
            input: raw.inputPrice,
            output: raw.outputPrice,
          });
        }
      }
      return map;
    },
  },

  extractLimits: {
    source: {
      url: "https://api.aimlapi.com/v1/models",
      type: "api",
      description: "Context and output limits from API, supplemented by pricing page",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const map = new Map<string, ExtractedLimit>();
      for (const dm of models) {
        const raw = dm.raw as PricingPageModel;
        const contextFromPage = parseContext(raw.context);
        const apiContext = raw.apiModel?.info?.contextLength ?? 0;
        const apiOutput = raw.apiModel?.info?.maxTokens;
        const bestContext = apiContext > 0 ? apiContext : contextFromPage;
        if (bestContext > 0) {
          map.set(dm.id, { context: bestContext, ...(apiOutput ? { output: apiOutput } : {}) });
        }
      }
      return map;
    },
  },

  extractModalities: {
    source: {
      url: "https://api.aimlapi.com/v1/models",
      type: "api",
      description: "Modalities from API features (vision flag)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const map = new Map<string, ExtractedModalities>();
      for (const dm of models) {
        const raw = dm.raw as PricingPageModel;
        const features = raw.apiModel?.features ?? [];
        const inputModalities: ModelModality[] = ["text"];
        if (features.some((f) => f.includes("vision"))) {
          inputModalities.push("image");
        }
        map.set(dm.id, { input: inputModalities });
      }
      return map;
    },
  },

  extractFeatures: {
    source: {
      url: "https://api.aimlapi.com/v1/models",
      type: "api",
      description: "Features from API (temperature, function calling, response-format)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const map = new Map<string, ExtractedFeatures>();
      for (const dm of models) {
        const raw = dm.raw as PricingPageModel;
        const features = raw.apiModel?.features ?? [];
        map.set(dm.id, {
          temperature: features.some((f) => f.includes("temperature")),
          tool_call: features.some((f) => f.includes("function")),
          structured_output: features.some((f) => f.includes("response-format")),
        });
      }
      return map;
    },
  },

  extractDates: {
    source: {
      url: "https://api.aimlapi.com/v1/models",
      type: "api",
      description: "No date data available from either source",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      return new Map<string, ExtractedDates>();
    },
  },

  deriveName: {
    execute: (modelId: string): string => {
      // Convert ID to readable name: "xai--grok-4-3" → "Xai / Grok 4 3"
      return modelId
        .replace(/--/g, " / ")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      // aimlapi is an aggregator; models belong to various families
      return modelId.split("-")[0] ?? modelId;
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
