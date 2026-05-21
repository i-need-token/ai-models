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
  id: "nanogpt",
  name: "NanoGPT",
  url: "https://nano-gpt.com",
  api_docs: "https://docs.nano-gpt.com",
  apis: {
    openai: "https://nano-gpt.com/api/v1",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ApiModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

interface PricingEntry {
  inputRate: number;
  outputRate: number;
  cacheReadInputRate?: number;
  cacheWriteInputRate?: number;
}

interface DiscoveredRaw {
  originalId: string;
  apiModel: ApiModel;
  pricingEntry: PricingEntry | null;
}

// ---------------------------------------------------------------------------
// Pricing JS bundle extraction (from original scraper)
// ---------------------------------------------------------------------------

async function findPricingBundleUrl(): Promise<string> {
  const html = await fetch("https://nano-gpt.com/pricing").then((r) => r.text());
  const allChunks = html.match(/src="(\/_next\/static\/chunks\/\d+-[a-f0-9]+\.js[^"]*)"/g);
  if (!allChunks) throw new Error("Could not find any JS bundle URLs");

  for (const chunkRef of allChunks) {
    const urlMatch = chunkRef.match(/src="([^"]+)"/);
    if (!urlMatch || !urlMatch[1]) continue;
    let url: string = urlMatch[1];
    if (url.startsWith("/")) url = `https://nano-gpt.com${url}`;

    const numMatch = url.match(/\/([\d]+)-/);
    if (!numMatch || !numMatch[1]) continue;
    const chunkNum = parseInt(numMatch[1], 10);
    if (chunkNum < 10000) continue;

    try {
      const sample = await fetch(url).then((r) => r.text());
      if (
        sample.includes("inputRate") &&
        sample.includes("outputRate") &&
        sample.includes("default")
      ) {
        return url;
      }
    } catch {
      // Skip chunks that fail to download
    }
  }
  throw new Error("Could not find pricing JS bundle URL");
}

function parsePricingBundle(jsContent: string): Record<string, PricingEntry> {
  const result: Record<string, PricingEntry> = {};

  const entryPattern = /"([^"]+)":\{([^}]+)\}/g;
  let match: RegExpExecArray | null;

  while ((match = entryPattern.exec(jsContent)) !== null) {
    const modelId = match[1] ?? "";
    const valueStr = match[2] ?? "";

    if (!valueStr.includes("inputRate") && !valueStr.includes("outputRate")) continue;

    const inputRateMatch = valueStr.match(/inputRate:([\d.e\-+]+)(\/R)?/);
    const outputRateMatch = valueStr.match(/outputRate:([\d.e\-+]+)(\/R)?/);
    const cacheReadMatch = valueStr.match(/cacheReadInputRate:([\d.e\-+]+)(\/R)?/);
    const cacheWriteMatch = valueStr.match(/cacheWriteInputRate:([\d.e\-+]+)(\/R)?/);

    if (!inputRateMatch || !outputRateMatch || !inputRateMatch[1] || !outputRateMatch[1]) continue;

    const inputRate = parseFloat(inputRateMatch[1]);
    const outputRate = parseFloat(outputRateMatch[1]);

    const entry: PricingEntry = { inputRate, outputRate };

    if (cacheReadMatch && cacheReadMatch[1]) {
      entry.cacheReadInputRate = parseFloat(cacheReadMatch[1]);
    }
    if (cacheWriteMatch && cacheWriteMatch[1]) {
      entry.cacheWriteInputRate = parseFloat(cacheWriteMatch[1]);
    }

    result[modelId] = entry;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Model filtering
// ---------------------------------------------------------------------------

const EXCLUDE_PATTERNS = [
  "video",
  "kling",
  "veo",
  "wan-video",
  "hunyuan-video",
  "seedance",
  "pixverse",
  "runway",
  "ltx",
  "midjourney",
  "vidu",
  "avatar",
  "lipsync",
  "upscaler",
  "realtime",
  "tts",
  "music",
  "lyria",
  "mureka",
  "omnivoice",
  "ernie-image",
  "dall-e",
  "flux",
  "sdxl",
  "stable-diffusion",
  "imagen",
  "leonardo",
  "sonar",
  "exa",
  "fastgpt",
  "universal-summarizer",
  "deep-research",
  "auto-model",
  "coding-router",
  "claw-",
  "hermes-",
  "owl",
  "brave",
  "v0",
  "venice-uncensored",
  "search",
  "embed",
  "e5",
  "bge",
  "text-embedding",
  "image-gen",
  "img-gen",
  "paint",
  "draw",
  "inpaint",
  "upscale",
  "happyhorse",
  "pika",
  "cogview",
  "ltx-video",
];

function isLLMModel(id: string): boolean {
  const lower = id.toLowerCase();
  if (lower.startsWith("nanogpt/") || lower.startsWith("auto-")) return false;
  for (const pattern of EXCLUDE_PATTERNS) {
    if (lower.includes(pattern.toLowerCase())) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Static supplemental data — for fields not available from API/JS bundle
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  if (
    lower.includes("gpt-5") ||
    lower.includes("gpt-4o") ||
    lower.includes("gpt-4") ||
    lower.includes("gpt-3")
  )
    return "gpt";
  if (lower.includes("o1") || lower.includes("o3") || lower.includes("o4")) return "o";
  if (lower.includes("claude-opus")) return "claude-opus";
  if (lower.includes("claude-sonnet")) return "claude-sonnet";
  if (lower.includes("claude-haiku")) return "claude-haiku";
  if (lower.includes("gemini")) return "gemini";
  if (lower.includes("gemma")) return "gemma";
  if (lower.includes("llama")) return "llama";
  if (lower.includes("deepseek")) return "deepseek";
  if (lower.includes("qwen")) return "qwen";
  if (lower.includes("mistral") || lower.includes("mixtral")) return "mistral";
  if (lower.includes("grok")) return "grok";
  if (lower.includes("kimi")) return "kimi";
  if (lower.includes("glm")) return "glm";
  if (lower.includes("ernie")) return "ernie";
  if (lower.includes("minimax")) return "minimax";
  if (lower.includes("doubao")) return "doubao";
  if (lower.includes("jamba")) return "jamba";
  if (lower.includes("command")) return "command";
  if (lower.includes("phi")) return "phi";
  if (lower.includes("yi")) return "yi";
  if (lower.includes("step")) return "step";
  if (lower.includes("mimo")) return "mimo";
  if (lower.includes("devstral")) return "devstral";
  if (lower.includes("ministral")) return "ministral";
  if (lower.includes("aion")) return "aion";
  if (lower.includes("perceptron")) return "perceptron";
  if (lower.includes("lfm")) return "lfm";
  if (lower.includes("manta")) return "manta";
  if (lower.includes("cogito")) return "cogito";
  if (lower.includes("dracarys")) return "dracarys";
  if (lower.includes("arcee")) return "arcee";
  if (lower.includes("nova")) return "nova";
  if (lower.includes("saaras") || lower.includes("bulbul")) return "sarvam";
  return id.split("-")[0] ?? id;
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: "https://nano-gpt.com/api/v1/models",
      type: "api",
      description: "NanoGPT /v1/models API + pricing JS bundle from nano-gpt.com/pricing",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      // 1. Fetch model list from API
      const apiResp = (await fetch("https://nano-gpt.com/api/v1/models").then((r) => r.json())) as {
        data: ApiModel[];
      };
      const apiModels = apiResp.data ?? [];

      // 2. Fetch pricing from JS bundle
      let pricingData: Record<string, PricingEntry> = {};
      try {
        const bundleUrl = await findPricingBundleUrl();
        const jsContent = await fetch(bundleUrl).then((r) => r.text());
        pricingData = parsePricingBundle(jsContent);
      } catch (e) {
        console.warn("  nanogpt: could not fetch pricing JS bundle:", e);
      }

      // 3. Merge API models with pricing data
      return apiModels
        .filter((am) => isLLMModel(am.id))
        .filter((am) => {
          const pe = pricingData[am.id];
          if (!pe) return false;
          if (pe.inputRate === 0 && pe.outputRate === 0) return false;
          return true;
        })
        .map((am) => ({
          id: am.id.replace(/[/:]/g, "--"),
          raw: {
            apiModel: am,
            pricingEntry: pricingData[am.id] ?? null,
            originalId: am.id,
          },
        }));
    },
  },

  extractPricing: {
    source: {
      url: "https://nano-gpt.com/pricing",
      type: "api",
      description: "Pricing from JS bundle — milli-dollars per M token, *1000 = USD per M token",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const map = new Map<string, Pricing>();
      for (const dm of models) {
        const raw = dm.raw as DiscoveredRaw;
        const pe = raw.pricingEntry;
        if (!pe) continue;

        const inputPerM = Math.round(pe.inputRate * 1000 * 1e6) / 1e6;
        const outputPerM = Math.round(pe.outputRate * 1000 * 1e6) / 1e6;

        const pricing: Pricing = { currency: "USD", input: inputPerM, output: outputPerM };
        if (pe.cacheReadInputRate != null && pe.cacheReadInputRate > 0) {
          pricing.cache_read = Math.round(pe.cacheReadInputRate * 1000 * 1e6) / 1e6;
        }
        if (pe.cacheWriteInputRate != null && pe.cacheWriteInputRate > 0) {
          pricing.cache_write = Math.round(pe.cacheWriteInputRate * 1000 * 1e6) / 1e6;
        }
        map.set(dm.id, pricing);
      }
      return map;
    },
  },

  extractLimits: {
    source: {
      url: "https://nano-gpt.com",
      type: "api",
      description: "Context/output limits derived from model ID naming patterns",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      return new Map<string, ExtractedLimit>();
    },
  },

  extractModalities: {
    source: {
      url: "https://nano-gpt.com",
      type: "api",
      description: "Modalities not available from API — omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      return new Map<string, ExtractedModalities>();
    },
  },

  extractFeatures: {
    source: {
      url: "https://nano-gpt.com",
      type: "api",
      description: "Features not available from API — omitted",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      return new Map<string, ExtractedFeatures>();
    },
  },

  extractDates: {
    source: {
      url: "https://nano-gpt.com/api/v1/models",
      type: "api",
      description: "No date data available from API or JS bundle",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      return new Map<string, ExtractedDates>();
    },
  },

  deriveName: {
    execute: (modelId: string): string => {
      // Convert flat ID back to readable name
      // "openai--gpt-4o" → "OpenAI: GPT 4o"
      const parts = modelId.split("--");
      const providerPart = parts.length > 1 ? parts[0] : "";
      const modelPart = parts.length > 1 ? parts.slice(1).join("--") : modelId;

      const providerMap: Record<string, string> = {
        openai: "OpenAI",
        anthropic: "Anthropic",
        google: "Google",
        "x-ai": "xAI",
        deepseek: "DeepSeek",
        "deepseek-ai": "DeepSeek",
        qwen: "Qwen",
        Qwen: "Qwen",
        mistralai: "Mistral",
        moonshotai: "MoonshotAI",
        moonshot: "MoonshotAI",
        meta: "Meta",
        "meta-llama": "Meta",
        zhipu: "ZhipuAI",
        "z-ai": "ZhipuAI",
        minimax: "MiniMax",
        baidu: "Baidu",
        "stepfun-ai": "StepFun",
        stepfun: "StepFun",
        nvidia: "NVIDIA",
        xiaomi: "Xiaomi",
        doubao: "Doubao",
        alibaba: "Alibaba",
        cohere: "Cohere",
        ai21: "AI21",
        aionlabs: "AionLabs",
        arcee: "Arcee",
        baichuan: "Baichuan",
        tencent: "Tencent",
        upstage: "Upstage",
        sarvam: "Sarvam",
        ibm: "IBM",
        inception: "Inception",
        inclusionai: "InclusionAI",
        microsoft: "Microsoft",
        amazon: "Amazon",
        "meganova-ai": "MegaNova",
        perceptron: "Perceptron",
        liquid: "Liquid",
        poolside: "Poolside",
        inflection: "Inflection",
        dmind: "DMind",
        NousResearch: "NousResearch",
        nousresearch: "NousResearch",
        gemini: "Google",
      };

      const provDisplay =
        providerPart && providerPart in providerMap
          ? (providerMap[providerPart] ?? providerPart)
          : providerPart
            ? providerPart.charAt(0).toUpperCase() + providerPart.slice(1)
            : modelPart;

      const cleanModel = modelPart.replace(/:thinking(?::(max|medium|low))?$/, "");

      const display = cleanModel
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .replace(/\b(ai|vl|it|api|llm|nlp|rp|pro|max|mini|nano|turbo|flash|lite|fast)\b/gi, (w) =>
          w.toUpperCase(),
        )
        .replace(/\b(\d+b)\b/gi, (w) => w.toUpperCase());

      return providerPart ? `${provDisplay}: ${display}` : display;
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      // Use the original ID (with /) for family derivation
      const originalId = modelId.replace(/--/g, "/");
      return deriveFamily(originalId);
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
