import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "nanogpt",
  name: "nano-gpt",
  url: "https://nano-gpt.com",
  api_docs: "https://docs.nano-gpt.com",
  apis: {
    openai: "https://nano-gpt.com/api/v1",
  },
});

// ---------------------------------------------------------------------------
// nano-gpt inference platform
//
// Sources:
// - Model list: https://nano-gpt.com/api/v1/models (public API)
// - Pricing: JS bundle (per-token USD pricing, extracted from first-party JavaScript)
//   The pricing JS bundle URL is found by scraping the pricing page HTML.
//   The JS bundle uses R=1.7 as a profit margin multiplier. Entries with /R
//   suffix store at-cost pricing (at-cost = value / R), but the value BEFORE
//   /R division IS the customer price. So we do NOT apply R.
//   Rates are in "milli-dollars per M token" format: rate * 1000 = USD per M tokens.
//
// nano-gpt is an inference platform and model router hosting models from
// 40+ providers. Pricing shown is nano-gpt's per-1M-token rate (USD),
// which matches official provider prices for most models.
//
// Model IDs use "--" instead of "/" to avoid filesystem issues.
// Router/aggregator models (nanogpt/coding-router, auto-model) are excluded.
// Video/image/audio/embedding/search models are excluded.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchJSON(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.json() as Promise<unknown>;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

// ---------------------------------------------------------------------------
// Pricing JS bundle extraction
// ---------------------------------------------------------------------------

async function findPricingBundleUrl(): Promise<string> {
  const html = await fetchText("https://nano-gpt.com/pricing");
  // The pricing data chunk number changes over time (was 30244, then 75855).
  // Instead of hardcoding, find the largest numbered chunk that contains pricing data.
  // We look for chunks with 5-digit numbers (e.g., 30244, 75855) which are
  // typically the data bundles.
  const allChunks = html.match(/src="(\/_next\/static\/chunks\/\d+-[a-f0-9]+\.js[^"]*)"/g);
  if (!allChunks) throw new Error("Could not find any JS bundle URLs");

  // Try each chunk to find the one with pricing data
  for (const chunkRef of allChunks) {
    const urlMatch = chunkRef.match(/src="([^"]+)"/);
    if (!urlMatch || !urlMatch[1]) continue;
    let url = urlMatch[1] as string;
    if (url.startsWith("/")) url = `https://nano-gpt.com${url}`;

    // Only check large numbered chunks (likely data bundles)
    const numMatch = url.match(/\/([\d]+)-/);
    if (!numMatch || !numMatch[1]) continue;
    const chunkNum = parseInt(numMatch[1] as string, 10);
    if (chunkNum < 10000) continue; // Skip small chunks (framework code)

    try {
      // Download a sample of the chunk to check for pricing data
      const sample = await fetchText(url);
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

interface PricingEntry {
  inputRate: number;
  outputRate: number;
  cacheReadInputRate?: number;
  cacheWriteInputRate?: number;
}

function parsePricingBundle(jsContent: string): Record<string, PricingEntry> {
  const result: Record<string, PricingEntry> = {};

  // Extract all model pricing entries from the JS bundle
  // Pattern: "model-id":{inputRate:X,outputRate:Y,...}
  // The /R suffix indicates at-cost pricing, but the value before /R
  // IS the customer price. So we do NOT apply the R multiplier.
  const entryPattern = /"([^"]+)":\{([^}]+)\}/g;
  let match: RegExpExecArray | null;

  while ((match = entryPattern.exec(jsContent)) !== null) {
    const modelId = match[1] as string;
    const valueStr = match[2] as string;

    if (!valueStr.includes("inputRate") && !valueStr.includes("outputRate")) continue;

    const inputRateMatch = valueStr.match(/inputRate:([\d.e\-+]+)(\/R)?/);
    const outputRateMatch = valueStr.match(/outputRate:([\d.e\-+]+)(\/R)?/);
    const cacheReadMatch = valueStr.match(/cacheReadInputRate:([\d.e\-+]+)(\/R)?/);
    const cacheWriteMatch = valueStr.match(/cacheWriteInputRate:([\d.e\-+]+)(\/R)?/);

    if (!inputRateMatch || !outputRateMatch) continue;
    if (!inputRateMatch[1] || !outputRateMatch[1]) continue;

    // Customer price = raw value (before /R division)
    // /R suffix means at-cost = customer/R, but customer price is the raw value
    const inputRate = parseFloat(inputRateMatch[1] as string);
    const outputRate = parseFloat(outputRateMatch[1] as string);

    const entry: PricingEntry = { inputRate, outputRate };

    if (cacheReadMatch && cacheReadMatch[1]) {
      const cacheRead = parseFloat(cacheReadMatch[1] as string);
      entry.cacheReadInputRate = cacheRead;
    }

    if (cacheWriteMatch && cacheWriteMatch[1]) {
      const cacheWrite = parseFloat(cacheWriteMatch[1] as string);
      entry.cacheWriteInputRate = cacheWrite;
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
// Model property derivation
// ---------------------------------------------------------------------------

function deriveName(id: string): string {
  const parts = id.split("/");
  const modelPart = parts.length > 1 ? (parts[1] as string) : id;
  const providerPrefix = parts.length > 1 ? (parts[0] as string) : "";

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
    providerPrefix in providerMap
      ? (providerMap[providerPrefix] as string)
      : providerPrefix.charAt(0).toUpperCase() + providerPrefix.slice(1);

  // Strip :thinking/:low/:medium/:max suffixes from model part for display
  const cleanModel = modelPart.replace(/:thinking(?::(max|medium|low))?$/, "");

  const display = cleanModel
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b(ai|vl|it|api|llm|nlp|rp|pro|max|mini|nano|turbo|flash|lite|fast)\b/gi, (w) =>
      w.toUpperCase(),
    )
    .replace(/\b(\d+b)\b/gi, (w) => w.toUpperCase());

  return providerPrefix ? `${provDisplay}: ${display}` : display;
}

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  if (lower.includes("gpt-5")) return "gpt-5";
  if (lower.includes("gpt-4")) return "gpt-4";
  if (lower.includes("gpt-3")) return "gpt-3";
  if (lower.includes("o1") || lower.includes("o3") || lower.includes("o4")) return "o-series";
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
  return "other";
}

function deriveContext(id: string): number {
  const lower = id.toLowerCase();
  if (
    lower.includes("gpt-5.5-pro") ||
    lower.includes("gpt-5.4-pro") ||
    lower.includes("gpt-5.2-pro")
  )
    return 128000;
  if (lower.includes("gpt-5") && !lower.includes("pro")) return 1048576;
  if (lower.includes("gpt-4o")) return 128000;
  if (lower.includes("gpt-4") && !lower.includes("mini")) return 128000;
  if (lower.includes("gpt-4-mini")) return 128000;
  if (lower.includes("gpt-3.5-16k")) return 16385;
  if (lower.includes("gpt-3.5")) return 4096;
  if (lower.includes("claude-opus") || lower.includes("claude-4-opus")) return 200000;
  if (lower.includes("claude-sonnet") || lower.includes("claude-4-sonnet")) return 200000;
  if (lower.includes("claude-haiku")) return 200000;
  if (lower.includes("gemini-2.5-pro")) return 1048576;
  if (lower.includes("gemini-2.5-flash")) return 1048576;
  if (lower.includes("gemini-3")) return 1048576;
  if (lower.includes("gemini-2.0")) return 1048576;
  if (lower.includes("gemini-1.5")) return 1048576;
  if (lower.includes("llama-4")) return 1048576;
  if (lower.includes("llama-3")) return 131072;
  if (lower.includes("deepseek-r1") || lower.includes("deepseek-v4")) return 65536;
  if (lower.includes("deepseek-v3")) return 163840;
  if (lower.includes("qwen3")) return 131072;
  if (lower.includes("qwen2.5")) return 131072;
  if (lower.includes("kimi")) return 131072;
  if (lower.includes("glm")) return 131072;
  if (lower.includes("ernie")) return 131072;
  if (lower.includes("grok")) return 131072;
  if (lower.includes("mistral-large")) return 131072;
  if (lower.includes("mistral-small") || lower.includes("mistral-nemo")) return 32768;
  if (lower.includes("mixtral")) return 32768;
  return 131072;
}

function deriveOutput(id: string): number {
  const lower = id.toLowerCase();
  if (lower.includes("gpt-5") && !lower.includes("pro")) return 131072;
  if (lower.includes("claude-opus") || lower.includes("claude-sonnet")) return 128000;
  if (lower.includes("claude-haiku")) return 64000;
  if (lower.includes("gemini-2.5")) return 65536;
  if (lower.includes("deepseek-r1") || lower.includes("deepseek-v4")) return 65536;
  if (lower.includes("deepseek-v3")) return 131072;
  if (lower.includes("kimi")) return 131072;
  return 16384;
}

function deriveModalities(id: string): { input: ModelModality[]; output: ModelModality[] } {
  const lower = id.toLowerCase();
  const input: ModelModality[] = ["text"];
  const output: ModelModality[] = ["text"];
  if (
    lower.includes("vl") ||
    lower.includes("vision") ||
    lower.includes("gpt-4o") ||
    lower.includes("gpt-5") ||
    lower.includes("claude-4") ||
    lower.includes("gemini") ||
    lower.includes("llama-4") ||
    lower.includes("qwen2.5-vl") ||
    lower.includes("mimo")
  ) {
    input.push("image");
  }
  return { input, output };
}

function deriveFeatures(id: string): { toolCall: boolean; reasoning: boolean } {
  const lower = id.toLowerCase();
  const toolCall =
    lower.includes("gpt-4") ||
    lower.includes("gpt-5") ||
    lower.includes("claude-4") ||
    lower.includes("claude-3.5") ||
    lower.includes("gemini-2") ||
    lower.includes("gemini-3") ||
    lower.includes("deepseek-v3") ||
    lower.includes("deepseek-v4") ||
    lower.includes("qwen3") ||
    lower.includes("kimi-k2") ||
    lower.includes("mistral-large") ||
    lower.includes("grok-4");
  const reasoning =
    lower.includes("o1") ||
    lower.includes("o3") ||
    lower.includes("o4") ||
    lower.includes("r1") ||
    lower.includes("thinking") ||
    lower.includes("reasoning") ||
    lower.includes("deepseek-r1") ||
    lower.includes("devstral") ||
    lower.includes("cogito");
  return { toolCall, reasoning };
}

// ---------------------------------------------------------------------------
// Date helper
// ---------------------------------------------------------------------------

function getCurrentDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const today = getCurrentDate();

  // 1. Fetch model list from API
  console.log("  nano-gpt: fetching model list from API...");
  const apiData = (await fetchJSON("https://nano-gpt.com/api/v1/models")) as {
    data: Array<{ id: string; object: string; created: number; owned_by: string }>;
  };
  const apiModels = apiData.data ?? [];
  console.log(`  nano-gpt: ${apiModels.length} models from API`);

  // 2. Fetch pricing from JS bundle
  console.log("  nano-gpt: fetching pricing JS bundle...");
  const bundleUrl = await findPricingBundleUrl();
  const jsContent = await fetchText(bundleUrl);
  const pricingData = parsePricingBundle(jsContent);
  console.log(`  nano-gpt: ${Object.keys(pricingData).length} pricing entries from JS bundle`);

  // 3. Combine API + pricing data
  const models: Model[] = [];

  for (const apiModel of apiModels) {
    const id = apiModel.id;

    // Skip non-LLM models
    if (!isLLMModel(id)) continue;

    // Check if pricing exists
    const pricingEntry = pricingData[id];
    if (!pricingEntry) {
      console.warn(`  nano-gpt: skipping ${id} — no pricing`);
      continue;
    }

    // Skip free models
    if (pricingEntry.inputRate === 0 && pricingEntry.outputRate === 0) continue;

    // Convert rates to per-M-token USD
    // JS bundle rates are in "milli-dollars per M token" format:
    // rate * 1000 = USD per M tokens
    const inputPerM = Math.round(pricingEntry.inputRate * 1000 * 1e6) / 1e6;
    const outputPerM = Math.round(pricingEntry.outputRate * 1000 * 1e6) / 1e6;

    // Build pricing object
    const pricing: Pricing = { unit: "per_mtok", input: inputPerM, output: outputPerM };
    if (pricingEntry.cacheReadInputRate != null && pricingEntry.cacheReadInputRate > 0) {
      pricing.cache_read = Math.round(pricingEntry.cacheReadInputRate * 1000 * 1e6) / 1e6;
    }
    if (pricingEntry.cacheWriteInputRate != null && pricingEntry.cacheWriteInputRate > 0) {
      pricing.cache_write = Math.round(pricingEntry.cacheWriteInputRate * 1000 * 1e6) / 1e6;
    }

    // Flatten "/" and ":" to "--" for filesystem compatibility
    const flatId = id.replace(/[/:]/g, "--");

    // Derive model properties
    const { toolCall, reasoning } = deriveFeatures(id);
    const modalities = deriveModalities(id);

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: flatId,
      name: deriveName(id),
      family: deriveFamily(id),
      temperature: true,
      limit: { context: deriveContext(id), output: deriveOutput(id) },
      modalities,
      pricing,
      release_date: today,
      last_updated: today,
    };

    if (toolCall) modelDef.tool_call = true;
    if (reasoning) modelDef.reasoning = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  nano-gpt: ${models.length} models`);

  return { provider, models };
}
