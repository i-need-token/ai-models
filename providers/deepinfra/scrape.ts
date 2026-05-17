import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

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
// Dynamic scrape from DeepInfra API
//
// Source: https://api.deepinfra.com/v1/models (first-party, no auth required)
//
// DeepInfra is an inference platform hosting models from other providers
// (DeepSeek, Alibaba/Qwen, Meta/Llama, Google/Gemini/Gemma, Anthropic/Claude,
// NVIDIA/Nemotron, Microsoft/Phi, Mistral, ByteDance/Seed, MiniMax,
// NousResearch/Hermes, Xiaomi/MiMo, Moonshot/Kimi, StepFun, ZhipuAI/GLM,
// Sao10K, OpenAI/gpt-oss) with per-token USD pricing.
//
// Pricing: API returns per-1M-token USD values in metadata.pricing
// Model IDs: API returns "provider/ModelName" format; provider prefix is
//            stripped and the model name is lowercased to form the catalog ID
// Context lengths: API provides metadata.context_length and metadata.max_tokens
// Capabilities: API provides metadata.tags (vision, reasoning, prompt_cache)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// API response types
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
  metadata?: DeepInfraMetadata;
}

// ---------------------------------------------------------------------------
// Model ID flattening: strip provider prefix, lowercase, flatten special chars
// ---------------------------------------------------------------------------

function flattenId(apiId: string): string {
  // Strip provider prefix (e.g., "deepseek-ai/DeepSeek-V3" → "DeepSeek-V3")
  const parts = apiId.split("/");
  const modelName = (parts.length === 2 ? parts[1] : apiId) as string;
  // Lowercase and flatten special chars
  return modelName.toLowerCase().replace(/[@:]/g, "--").replace(/[()]/g, "");
}

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  // Claude family
  if (lower.includes("claude-opus")) return "claude-opus";
  if (lower.includes("claude-sonnet")) return "claude-sonnet";
  if (lower.includes("claude-haiku")) return "claude-haiku";
  if (lower.includes("claude")) return "claude";
  // DeepSeek family
  if (lower.includes("deepseek-v4")) return "deepseek-v4";
  if (lower.includes("deepseek-v3.1")) return "deepseek-v3.1";
  if (lower.includes("deepseek-v3.2")) return "deepseek-v3.2";
  if (lower.includes("deepseek-v3")) return "deepseek-v3";
  if (lower.includes("deepseek-r1")) return "deepseek-r1";
  if (lower.includes("deepseek")) return "deepseek";
  // Qwen family
  if (lower.includes("qwen3-coder")) return "qwen-coder";
  if (lower.includes("qwen3-vl")) return "qwen-vl";
  if (lower.includes("qwen3-max")) return "qwen3-max";
  if (lower.includes("qwen3-next")) return "qwen3-next";
  if (lower.includes("qwen3.5")) return "qwen3.5";
  if (lower.includes("qwen3.6")) return "qwen3.6";
  if (lower.includes("qwen3")) return "qwen3";
  if (lower.includes("qwen2.5")) return "qwen2.5";
  if (lower.includes("qwen")) return "qwen";
  // Llama family
  if (lower.includes("llama-4")) return "llama-4";
  if (lower.includes("llama-guard")) return "llama-guard";
  if (lower.includes("llama-3.3")) return "llama-3.3";
  if (lower.includes("llama-3.2")) return "llama-3.2";
  if (lower.includes("llama-3.1") || lower.includes("meta-llama-3.1")) return "llama-3.1";
  if (lower.includes("llama")) return "llama";
  // Gemini/Gemma family
  if (lower.includes("gemini-3-1") || lower.includes("gemini-3.1")) return "gemini-3.1";
  if (lower.includes("gemini-3")) return "gemini-3";
  if (lower.includes("gemini-2-5") || lower.includes("gemini-2.5")) return "gemini-2.5";
  if (lower.includes("gemini-1-5") || lower.includes("gemini-1.5")) return "gemini-1.5";
  if (lower.includes("gemini")) return "gemini";
  if (lower.includes("gemma-4")) return "gemma-4";
  if (lower.includes("gemma-3")) return "gemma-3";
  if (lower.includes("gemma")) return "gemma";
  // NVIDIA/Nemotron family
  if (lower.includes("nemotron")) return "nemotron";
  // Mistral/Voxtral family
  if (lower.includes("voxtral")) return "voxtral";
  if (lower.includes("mistral-small-3.2")) return "mistral-small-3.2";
  if (lower.includes("mistral-small")) return "mistral-small";
  if (lower.includes("mistral-nemo")) return "mistral-nemo";
  if (lower.includes("mistral")) return "mistral";
  // Other families
  if (lower.includes("gpt-oss")) return "gpt-oss";
  if (lower.includes("phi")) return "phi";
  if (lower.includes("seed")) return "seed";
  if (lower.includes("minimax")) return "minimax";
  if (lower.includes("hermes")) return "hermes";
  if (lower.includes("mimo")) return "mimo";
  if (lower.includes("kimi")) return "kimi";
  if (lower.includes("step")) return "step";
  if (lower.includes("glm")) return "glm";
  if (lower.includes("mythomax")) return "mythomax";
  if (lower.includes("l3") || lower.includes("lunaris") || lower.includes("euryale"))
    return "l3-finetune";
  return "other";
}

// ---------------------------------------------------------------------------
// Tool call inference: models known to support function calling
// ---------------------------------------------------------------------------

const TOOL_CALL_FAMILIES: Record<string, boolean | undefined> = {
  claude: true,
  "claude-opus": true,
  "claude-sonnet": true,
  "claude-haiku": true,
  deepseek: true,
  "deepseek-v3": true,
  "deepseek-v3.1": true,
  "deepseek-v4": true,
  "deepseek-r1": true,
  gemini: true,
  "gemini-1.5": true,
  "gemini-2.5": true,
  "gemini-3.1": true,
  "llama-3.1": true,
  "llama-3.3": true,
  "llama-4": true,
  "mistral-small-3.2": true,
  qwen3: true,
  "qwen3-max": true,
  "qwen-coder": true,
  "qwen-vl": true,
};

// ---------------------------------------------------------------------------
// Open weights inference: models known to be open-source
// ---------------------------------------------------------------------------

const OPEN_WEIGHTS_FAMILIES: Record<string, boolean | undefined> = {
  gemma: true,
  "gemma-3": true,
  "gemma-4": true,
  llama: true,
  "llama-3.1": true,
  "llama-3.2": true,
  "llama-3.3": true,
  "llama-4": true,
  "llama-guard": true,
  "mistral-nemo": true,
  "mistral-small": true,
  "mistral-small-3.2": true,
  phi: true,
  qwen: true,
  "qwen2.5": true,
  qwen3: true,
  "qwen3.5": true,
  "qwen3.6": true,
  nemotron: true,
  hermes: true,
  mythomax: true,
  "l3-finetune": true,
  "deepseek-r1": true,
};

// ---------------------------------------------------------------------------
// Skip non-LLM models
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

// ---------------------------------------------------------------------------
// Display name derivation
// ---------------------------------------------------------------------------

function deriveName(apiId: string): string {
  // Strip provider prefix and format nicely
  const parts = apiId.split("/");
  const modelName = (parts.length === 2 ? parts[1] : apiId) as string;
  let name = modelName
    // Convert version patterns like "4-7" → "4.7", "3-1" → "3.1"
    .replace(/(\d)-(\d)/g, "$1.$2")
    // Replace remaining hyphens with spaces
    .replace(/-/g, " ")
    // Capitalize words
    .replace(/\b(\w)/g, (_, c) => c.toUpperCase());
  return name;
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

// ---------------------------------------------------------------------------
// Max output overrides: API returns max_tokens == context_length, but actual
// output limits are smaller for many models. These overrides are from
// DeepInfra's documentation and testing.
// ---------------------------------------------------------------------------

const MAX_OUTPUT_OVERRIDES: Record<string, number> = {
  "claude-haiku-4-5": 8192,
  "claude-opus-4-7": 16384,
  "claude-sonnet-4-6": 16384,
  "deepseek-r1-0528": 131072,
  "deepseek-r1-0528-turbo": 32768,
  "deepseek-v3": 131072,
  "deepseek-v3-0324": 131072,
  "deepseek-v3.1": 131072,
  "deepseek-v3.1-terminus": 131072,
  "deepseek-v3.2": 131072,
  "deepseek-v4-flash": 131072,
  "gemini-2.5-flash": 131072,
  "gemini-2.5-pro": 131072,
  "gemini-3.1-flash-lite": 131072,
  "gemini-3.1-pro": 131072,
  "gemma-4-26b-a4b-it": 131072,
  "gemma-4-31b-it": 131072,
  "gemma-4-31b-it-turbo": 131072,
  "llama-4-maverick-17b-128e-instruct-fp8": 131072,
  "llama-4-scout-17b-16e-instruct": 131072,
  "nemotron-3-nano-30b-a3b": 131072,
  "nemotron-3-nano-omni-30b-a3b-reasoning": 131072,
  "nvidia-nemotron-3-super-120b-a12b": 131072,
  "phi-4": 4096,
  "qwen3-235b-a22b-instruct-2507": 131072,
  "qwen3-235b-a22b-thinking-2507": 131072,
  "qwen3-coder-480b-a35b-instruct-turbo": 131072,
  "qwen3-max": 131072,
  "qwen3-max-thinking": 131072,
  "qwen3-next-80b-a3b-instruct": 131072,
  "qwen3-vl-235b-a22b-instruct": 131072,
  "qwen3-vl-30b-a3b-instruct": 131072,
};

export async function scrape(): Promise<ScrapeResult> {
  const today = getCurrentDate();
  const models: Model[] = [];

  // Fetch model list from DeepInfra API
  const response = await fetch("https://api.deepinfra.com/v1/models");
  const data = (await response.json()) as { data: DeepInfraModel[] };

  for (const m of data.data) {
    const meta = m.metadata ?? ({} as DeepInfraMetadata);
    const pricing = meta.pricing;
    const tags = meta.tags ?? [];
    const contextLength = meta.context_length ?? 0;
    const maxTokens = meta.max_tokens ?? 0;

    // Skip non-LLM models
    if (shouldSkip(m.id, tags)) continue;

    // Skip models without pricing
    if (!pricing || pricing.input_tokens === undefined || pricing.input_tokens === null) {
      console.warn(`  DeepInfra: skipping ${m.id} — no pricing`);
      continue;
    }

    const id = flattenId(m.id);
    const family = deriveFamily(id);

    // Derive modalities from tags
    const inputModalities: ModelModality[] = ["text"];
    if (tags.includes("vision")) inputModalities.push("image");
    const outputModalities: ModelModality[] = ["text"];

    // Build pricing object
    const pricingObj: Pricing = {
      currency: "USD",
      input: Math.round(pricing.input_tokens * 1e6) / 1e6,
      output: Math.round(pricing.output_tokens * 1e6) / 1e6,
    };
    // Add cache_read if available and > 0
    const cacheRead = pricing.cache_read_tokens;
    if (cacheRead !== undefined && cacheRead !== null && cacheRead > 0) {
      pricingObj.cache_read = Math.round(cacheRead * 1e6) / 1e6;
    }

    // Build model definition
    const modelDef: Parameters<typeof defineModel>[0] = {
      id,
      name: deriveName(m.id),
      family,
      temperature: true,
      limit: { context: contextLength, output: MAX_OUTPUT_OVERRIDES[id] ?? maxTokens },
      modalities: { input: inputModalities, output: outputModalities },
      pricing: pricingObj,
      release_date: today,
      last_updated: today,
    };

    // Add capabilities inferred from tags and family
    if (tags.includes("reasoning")) modelDef.reasoning = true;
    if (TOOL_CALL_FAMILIES[family]) modelDef.tool_call = true;
    if (OPEN_WEIGHTS_FAMILIES[family]) modelDef.open_weights = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  DeepInfra: ${models.length} models`);

  return { provider, models };
}
