import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

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
// AIHubMix inference platform
//
// Sources:
// - Model list & pricing: https://aihubmix.com/call/mdl_info_pagination
//   (public pagination API, no auth required)
// - Context lengths: API metadata `context_window` field
// - Modalities: API metadata `modalities` field
// - Features: API metadata `features` field
//
// AIHubMix is an inference platform and model router providing unified API
// access to models from 30+ providers with per-token USD pricing.
// Pricing shown is AIHubMix's per-1M-token rate (USD).
// Some models have prompt caching pricing (cache_read/cache_write).
//
// Model IDs use "--" instead of "/" to avoid filesystem issues.
// Free variants (model_ratio=0), embedding/rerank/image/audio/video models,
// and router models are excluded.
// Tiered pricing models use tier1 (short context) rates.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// API types
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
  tier_condition: {
    min_tokens: number;
    max_tokens: number;
  };
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
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchJSON(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.json() as Promise<unknown>;
}

async function fetchAllModels(): Promise<ApiModel[]> {
  const allModels: ApiModel[] = [];
  const pageSize = 100;
  let page = 1;

  while (true) {
    const url = `https://aihubmix.com/call/mdl_info_pagination?p=${page}&num=${pageSize}&sort_by=&sort_order=desc`;
    const data = (await fetchJSON(url)) as {
      data: ApiModel[];
      total: number;
      success: boolean;
    };

    if (!data.data || data.data.length === 0) break;
    allModels.push(...data.data);

    if (allModels.length >= data.total) break;
    page++;
  }

  return allModels;
}

// ---------------------------------------------------------------------------
// Model filtering
// ---------------------------------------------------------------------------

const SKIP_PREFIXES = [
  "coding-", // routing variants
  "cc-", // Chinese cloud variants
  "mm-", // multi-modal routing
  "bai-", // Baidu routing
  "aihub-", // AIHubMix routing
  "aihubmix-", // AIHubMix routing
  "AiHubmix-", // AIHubMix routing (capital)
  "Aihubmix-", // AIHubMix routing (capital)
  "ahm-", // AIHubMix routing
  "deepinfra-", // DeepInfra routing
  "alicloud-", // Alibaba Cloud routing
  "azure-", // Azure routing
  "cbs-", // CBS routing
  "moonshot-", // Moonshot routing
  "chutesai/", // Chutes routing
  "Pro/", // Pro routing
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

function shouldSkip(model: ApiModel): boolean {
  const id = model.model;

  // Skip free models
  if (model.model_ratio <= 0) return true;

  // Skip by prefix
  for (const prefix of SKIP_PREFIXES) {
    if (id.startsWith(prefix)) return true;
  }

  // Skip routing variants with parentheses
  if (id.includes("(") || id.includes(")")) return true;

  // Skip by keyword
  const lower = id.toLowerCase();
  for (const kw of SKIP_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) return true;
  }

  // Skip image-only billing models
  const bc = parseBillingConfig(model.billing_config);
  if (bc) {
    const items = bc.enabled_billing_items;
    if (items.includes("image_count") && !items.includes("prompt_tokens")) return true;
    if (items.includes("search_units") && !items.includes("prompt_tokens")) return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// Billing config parsing
// ---------------------------------------------------------------------------

function parseBillingConfig(raw: string): BillingConfig | null {
  if (!raw || !raw.trim()) return null;
  try {
    return JSON.parse(raw) as BillingConfig;
  } catch {
    return null;
  }
}

function computePricing(model: ApiModel): Pricing | null {
  const ratio = model.model_ratio;
  const compRatio = model.completion_ratio;
  if (ratio <= 0) return null;

  const input = Math.round(ratio * 1e6) / 1e6;
  const output = Math.round(ratio * compRatio * 1e6) / 1e6;

  const pricing: Pricing = {
    currency: "USD",
    input,
    output,
  };

  // Check for cache pricing
  const bc = parseBillingConfig(model.billing_config);
  if (bc) {
    const tier1 = bc.token_based_tier_configs?.["tier1"];
    if (tier1) {
      if (
        tier1.cached_tokens_ratio !== undefined &&
        tier1.cached_tokens_ratio > 0 &&
        tier1.cached_tokens_ratio !== 1
      ) {
        const cacheRead = Math.round(ratio * tier1.cached_tokens_ratio * 1e6) / 1e6;
        if (cacheRead > 0) {
          pricing.cache_read = cacheRead;
        }
      }
      if (tier1.cache_write_tokens_ratio !== undefined) {
        const cacheWrite = Math.round(ratio * tier1.cache_write_tokens_ratio * 1e6) / 1e6;
        if (cacheWrite > 0) {
          pricing.cache_write = cacheWrite;
        }
      }
    }
  }

  // Fallback: use cache_ratio from model if billing_config doesn't have it
  if (pricing.cache_read === undefined && model.cache_ratio > 0 && model.cache_ratio !== 1) {
    const cacheRead = Math.round(ratio * model.cache_ratio * 1e6) / 1e6;
    if (cacheRead > 0) {
      pricing.cache_read = cacheRead;
    }
  }

  return pricing;
}

// ---------------------------------------------------------------------------
// Metadata derivation
// ---------------------------------------------------------------------------

function deriveModelId(raw: string): string {
  return raw
    .replace(/\//g, "--")
    .replace(/:/g, "--")
    .replace(/@/g, "--")
    .replace(/\(/g, "--")
    .replace(/\)/g, "")
    .toLowerCase();
}

function deriveName(id: string, developer: string): string {
  // Convert model ID to display name
  let name = id.replace(/--/g, "/").replace(/-/g, " ");
  // Capitalize first letter of each word
  name = name.replace(/\b\w/g, (c) => c.toUpperCase());
  // Add developer prefix if not already present
  if (developer && !name.toLowerCase().startsWith(developer.toLowerCase())) {
    name = `${developer}: ${name}`;
  }
  return name;
}

function deriveFamily(id: string): string {
  const lower = id.toLowerCase().replace(/--/g, "/");

  // Claude family
  if (lower.includes("claude")) {
    if (lower.includes("opus")) return "claude-opus";
    if (lower.includes("sonnet")) return "claude-sonnet";
    if (lower.includes("haiku")) return "claude-haiku";
    return "claude";
  }

  // GPT family
  if (lower.includes("gpt-5.5")) return "gpt-5.5";
  if (lower.includes("gpt-5.4")) return "gpt-5.4";
  if (lower.includes("gpt-5.3")) return "gpt-5.3";
  if (lower.includes("gpt-5.2")) return "gpt-5.2";
  if (lower.includes("gpt-5.1")) return "gpt-5.1";
  if (lower.includes("gpt-5")) return "gpt-5";
  if (lower.includes("gpt-4.1")) return "gpt-4.1";
  if (lower.includes("gpt-4o")) return "gpt-4o";
  if (lower.includes("gpt-4")) return "gpt-4";
  if (lower.includes("gpt-3.5")) return "gpt-3.5";
  if (lower.includes("o4-mini")) return "o4-mini";
  if (lower.includes("o3-pro")) return "o3-pro";
  if (lower.includes("o3-mini")) return "o3-mini";
  if (lower.includes("o3")) return "o3";
  if (lower.includes("o1")) return "o1";
  if (lower.includes("gpt-oss")) return "gpt-oss";

  // Gemini family
  if (lower.includes("gemini-3.1")) return "gemini-3.1";
  if (lower.includes("gemini-3")) return "gemini-3";
  if (lower.includes("gemini-2.5")) return "gemini-2.5";
  if (lower.includes("gemini-2.0")) return "gemini-2.0";
  if (lower.includes("gemini")) return "gemini";

  // DeepSeek family
  if (lower.includes("deepseek-r1")) return "deepseek-r1";
  if (lower.includes("deepseek-v4")) return "deepseek-v4";
  if (lower.includes("deepseek-v3")) return "deepseek-v3";
  if (lower.includes("deepseek")) return "deepseek";

  // Qwen family
  if (lower.includes("qwen3.6")) return "qwen3.6";
  if (lower.includes("qwen3.5")) return "qwen3.5";
  if (lower.includes("qwen3")) return "qwen3";
  if (lower.includes("qwen2.5")) return "qwen2.5";
  if (lower.includes("qwen2")) return "qwen2";
  if (lower.includes("qwq")) return "qwq";
  if (lower.includes("qwen")) return "qwen";

  // Grok family
  if (lower.includes("grok-4.20")) return "grok-4.20";
  if (lower.includes("grok-4.1")) return "grok-4.1";
  if (lower.includes("grok-4")) return "grok-4";
  if (lower.includes("grok-3")) return "grok-3";
  if (lower.includes("grok-2")) return "grok-2";
  if (lower.includes("grok")) return "grok";

  // GLM family
  if (lower.includes("glm-5")) return "glm-5";
  if (lower.includes("glm-4.7")) return "glm-4.7";
  if (lower.includes("glm-4.6")) return "glm-4.6";
  if (lower.includes("glm-4.5")) return "glm-4.5";
  if (lower.includes("glm-4")) return "glm-4";
  if (lower.includes("glm")) return "glm";

  // ERNIE family
  if (lower.includes("ernie-5.1")) return "ernie-5.1";
  if (lower.includes("ernie-5.0")) return "ernie-5.0";
  if (lower.includes("ernie-4.5")) return "ernie-4.5";
  if (lower.includes("ernie-x1")) return "ernie-x1";
  if (lower.includes("ernie")) return "ernie";

  // Kimi family
  if (lower.includes("kimi-k2.6")) return "kimi-k2.6";
  if (lower.includes("kimi-k2.5")) return "kimi-k2.5";
  if (lower.includes("kimi-k2")) return "kimi-k2";
  if (lower.includes("kimi")) return "kimi";

  // MiniMax family
  if (lower.includes("minimax-m2.7")) return "minimax-m2.7";
  if (lower.includes("minimax-m2.5")) return "minimax-m2.5";
  if (lower.includes("minimax-m2.1")) return "minimax-m2.1";
  if (lower.includes("minimax-m2")) return "minimax-m2";
  if (lower.includes("minimax")) return "minimax";

  // Doubao/Seed family
  if (lower.includes("doubao-seed")) return "doubao-seed";
  if (lower.includes("doubao")) return "doubao";
  if (lower.includes("seed-oss")) return "seed-oss";

  // Llama family
  if (lower.includes("llama-4")) return "llama-4";
  if (lower.includes("llama-3.3")) return "llama-3.3";
  if (lower.includes("llama-3.2")) return "llama-3.2";
  if (lower.includes("llama-3.1")) return "llama-3.1";
  if (lower.includes("llama-3")) return "llama-3";
  if (lower.includes("llama2")) return "llama-2";
  if (lower.includes("llama")) return "llama";

  // Mistral family
  if (lower.includes("mistral-large")) return "mistral-large";
  if (lower.includes("mistral-small")) return "mistral-small";
  if (lower.includes("mistral")) return "mistral";

  // Command family
  if (lower.includes("command-a")) return "command-a";
  if (lower.includes("command-r-plus")) return "command-r-plus";
  if (lower.includes("command-r")) return "command-r";
  if (lower.includes("command")) return "command";

  // Mimo family
  if (lower.includes("mimo")) return "mimo";

  // Yi family
  if (lower.includes("yi-")) return "yi";

  // Baichuan family
  if (lower.includes("baichuan")) return "baichuan";

  // Step family
  if (lower.includes("step-")) return "step";

  // Sonar family
  if (lower.includes("sonar")) return "sonar";

  // Jamba family
  if (lower.includes("jamba")) return "jamba";

  // Phi family
  if (lower.includes("phi")) return "phi";

  // Nemotron family
  if (lower.includes("nemotron")) return "nemotron";

  // Hunyuan family
  if (lower.includes("hunyuan")) return "hunyuan";

  // Ling/Ring family
  if (lower.includes("ling-")) return "ling";
  if (lower.includes("ring-")) return "ring";

  // Moonshot family
  if (lower.includes("moonshot")) return "moonshot";

  // GLM-Z family
  if (lower.includes("glm-z")) return "glm-z";

  // Other known families
  if (lower.includes("nova")) return "nova";
  if (lower.includes("chatglm")) return "chatglm";
  if (lower.includes("tongyi")) return "tongyi";
  if (lower.includes("qianfan")) return "qianfan";
  if (lower.includes("codellama")) return "codellama";
  if (lower.includes("wizardlm")) return "wizardlm";
  if (lower.includes("olmo")) return "olmo";
  if (lower.includes("mythomax")) return "mythomax";
  if (lower.includes("granite")) return "granite";

  return "other";
}

function deriveModalities(modStr: string): {
  input: ModelModality[];
  output: ModelModality[];
} {
  const mods = modStr
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const input: ModelModality[] = [];
  const output: ModelModality[] = ["text"]; // All models output text

  if (mods.includes("text")) input.push("text");
  if (mods.includes("image")) input.push("image");
  if (mods.includes("video")) input.push("video");
  if (mods.includes("audio")) input.push("audio");
  if (mods.includes("pdf")) input.push("pdf");

  if (input.length === 0) input.push("text"); // Default to text input

  return { input, output };
}

function deriveFeatures(featureStr: string): {
  reasoning?: boolean;
  tool_call?: boolean;
  structured_output?: boolean;
} {
  const features = featureStr
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const result: {
    reasoning?: boolean;
    tool_call?: boolean;
    structured_output?: boolean;
  } = {};

  if (features.includes("thinking") || features.includes("reasoning")) {
    result.reasoning = true;
  }
  if (features.includes("tools") || features.includes("function_calling")) {
    result.tool_call = true;
  }
  if (features.includes("structured_outputs")) {
    result.structured_output = true;
  }

  return result;
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
  const apiModels = await fetchAllModels();
  console.log(`  AIHubMix: fetched ${apiModels.length} models from API`);

  const models: Model[] = [];
  const skipped: string[] = [];

  for (const apiModel of apiModels) {
    if (shouldSkip(apiModel)) {
      skipped.push(apiModel.model);
      continue;
    }

    const pricing = computePricing(apiModel);
    if (!pricing) {
      skipped.push(`${apiModel.model} (no pricing)`);
      continue;
    }

    const id = deriveModelId(apiModel.model);
    const { input: inputMods, output: outputMods } = deriveModalities(apiModel.modalities);
    const features = deriveFeatures(apiModel.features);

    const modelDef: Parameters<typeof defineModel>[0] = {
      id,
      name: deriveName(id, apiModel.developer),
      family: deriveFamily(id),
      temperature: true,
      pricing,
      release_date: today,
      last_updated: today,
      modalities: { input: inputMods, output: outputMods },
    };

    // Add context window if available
    if (apiModel.context_window > 0) {
      modelDef.limit = { context: apiModel.context_window, output: 16384 };
    }

    // Add features
    if (features.reasoning) modelDef.reasoning = true;
    if (features.tool_call) modelDef.tool_call = true;
    if (features.structured_output) modelDef.structured_output = true;

    models.push(defineModel(modelDef));
  }

  if (skipped.length > 0) {
    console.log(`  AIHubMix: skipped ${skipped.length} models`);
  }
  console.log(`  AIHubMix: ${models.length} valid models`);

  return { provider, models };
}
