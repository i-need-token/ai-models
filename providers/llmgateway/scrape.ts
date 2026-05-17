import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { ModelModality, Pricing } from "../../types/index";
import * as fs from "fs";
import * as path from "path";

const provider = defineProvider({
  id: "llmgateway",
  name: "LLM Gateway",
  url: "https://llmgateway.io",
  api_docs: "https://llmgateway.io/docs",
  apis: {
    openai: "https://api.llmgateway.io/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic model data (from LLM Gateway public API)
//
// Sources:
// - Model list & pricing: https://api.llmgateway.io/v1/models (public API)
// - Context lengths: LLM Gateway API context_length field
// - Modalities: LLM Gateway API architecture.input_modalities / output_modalities
// - Max output tokens: catalog lookup from existing provider YAML files
// - Cache pricing: LLM Gateway API pricing.input_cache_read / input_cache_write
//
// LLM Gateway is an inference platform and model router hosting models from
// 16+ providers with per-token pricing. Pricing shown is LLM Gateway's
// per-1M-token rate (USD), which is pass-through (0% markup).
// Some models have prompt caching pricing (cache_read/cache_write).
//
// Model IDs are flat (no provider/ prefix) and lowercased for filesystem
// consistency. The "custom" and "auto" routing models are excluded.
// Deactivated models are excluded. Non-LLM models (embedding-only,
// image-only, video-only) are excluded. Image generation models with
// only per-request pricing (no per-token) are excluded.
// ---------------------------------------------------------------------------

interface LLMGatewayModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  family: string;
  free: boolean;
  deprecated_at: string | null;
  deactivated_at: string | null;
  structured_outputs: boolean;
  json_output: boolean;
  architecture: {
    input_modalities: string[];
    output_modalities: string[];
    tokenizer: string;
  };
  pricing: {
    prompt: string;
    completion: string;
    image: string;
    request: string;
    input_cache_read: string;
    input_cache_write: string;
    input_cache_write_1h: string;
    web_search: string;
    internal_reasoning: string;
  };
  providers: {
    providerId: string;
    modelName: string;
    pricing: {
      prompt: string;
      completion: string;
      image: string;
    };
    streaming: boolean;
    cancellation: boolean;
    tools: boolean;
    parallelToolCalls: boolean;
    reasoning: boolean;
  }[];
  supported_parameters: string[];
  stability: string | null;
}

const SKIP_IDS = new Set(["custom", "auto"]);

// Output modalities that indicate non-LLM models
const NON_LLM_OUTPUTS = new Set(["embedding", "video", "image"]);

function parseModality(mod: string): ModelModality {
  const lower = mod.toLowerCase();
  if (lower === "text") return "text";
  if (lower === "image" || lower === "images") return "image";
  if (lower === "video" || lower === "videos") return "video";
  if (lower === "audio" || lower === "speech") return "audio";
  if (lower === "pdf" || lower === "file") return "pdf";
  return "text";
}

function parseModalities(
  inputMods: string[],
  outputMods: string[],
): { input: ModelModality[]; output: ModelModality[] } {
  const input = (inputMods.length > 0 ? inputMods : ["text"]).map(parseModality);
  const output = (outputMods.length > 0 ? outputMods : ["text"]).map(parseModality);
  return { input, output };
}

function toPerMTokens(perTokenStr: string): number {
  const perToken = parseFloat(perTokenStr);
  if (perToken === 0) return 0;
  const perMTokens = perToken * 1e6;
  return Math.round(perMTokens * 1e6) / 1e6;
}

// Build output limit lookup from existing catalog YAML files
function buildCatalogLookup(): Map<string, number> {
  const lookup = new Map<string, number>();
  const providersDir = path.join(process.cwd(), "providers");
  // Skip our own provider to avoid circular dependency (our own YAML files
  // may have incorrect output limits from a previous run)
  const selfId = "llmgateway";
  try {
    const entries = fs.readdirSync(providersDir);
    for (const entry of entries) {
      if (entry === selfId) continue; // Skip our own provider
      const modelsDir = path.join(providersDir, entry, "models");
      if (!fs.statSync(path.join(providersDir, entry)).isDirectory()) continue;
      if (!fs.existsSync(modelsDir)) continue;
      const yamlFiles = fs.readdirSync(modelsDir).filter((f) => f.endsWith(".yaml"));
      for (const yf of yamlFiles) {
        const content = fs.readFileSync(path.join(modelsDir, yf), "utf-8");
        // Match id: at start of line
        const idMatch = content.match(/^id:\s*(.+)$/m);
        // Extract the limit section by finding "limit:" and reading until the next
        // top-level key (a line that starts with a word character at column 0)
        const limitStart = content.indexOf("limit:");
        if (idMatch && limitStart !== -1) {
          // Find the end of the limit section (next top-level key)
          const afterLimit = content.slice(limitStart);
          const nextKeyMatch = afterLimit.match(/\n\w/m);
          const limitSection = nextKeyMatch
            ? afterLimit.slice(0, nextKeyMatch.index as number)
            : afterLimit;
          const outputMatch = limitSection.match(/\n\s+output:\s*(\d+)/);
          if (outputMatch) {
            const id = idMatch[1] as string;
            const output = parseInt(outputMatch[1] as string, 10);
            // Only set if not already present (prefer first match from original producer)
            if (output > 0 && !lookup.has(id)) {
              lookup.set(id, output);
            }
          }
        }
      }
    }
  } catch {
    // Ignore errors - will use default output limit
  }
  return lookup;
}

// Derive family from API family field, with fallback mapping
function deriveFamily(apiFamily: string, modelId: string): string {
  // The API provides a family field - use it directly with some normalization
  const family = apiFamily.toLowerCase();

  if (family === "openai") {
    if (modelId.startsWith("gpt-4o")) return "gpt-4o";
    if (modelId.startsWith("gpt-4")) return "gpt-4";
    if (modelId.startsWith("gpt-3.5")) return "gpt-3.5";
    if (modelId.startsWith("gpt-5")) return "gpt-5";
    if (modelId.startsWith("gpt-oss")) return "gpt-oss";
    if (modelId.startsWith("o1")) return "o1";
    if (modelId.startsWith("o3")) return "o3";
    if (modelId.startsWith("o4")) return "o4";
    return "gpt";
  }
  if (family === "anthropic") return "claude";
  if (family === "google") return "gemini";
  if (family === "meta") return "llama";
  if (family === "deepseek") return "deepseek";
  if (family === "mistral") return "mistral";
  if (family === "xai") return "grok";
  if (family === "glm" || family === "zai") return "glm";
  if (family === "alibaba" || family === "qwen") return "qwen";
  if (family === "moonshot") return "kimi";
  if (family === "minimax") return "minimax";
  if (family === "bytedance") return "seed";
  if (family === "xiaomi") return "mimo";
  if (family === "nousresearch") return "hermes";
  if (family === "perplexity") return "sonar";
  return family;
}

export async function scrape(): Promise<ScrapeResult> {
  const response = await fetch("https://api.llmgateway.io/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch LLM Gateway models: ${response.status}`);
  }
  const data = (await response.json()) as { data: LLMGatewayModel[] };
  const apiModels = data.data;

  const catalogLookup = buildCatalogLookup();

  const models: ReturnType<typeof defineModel>[] = [];
  const today = new Date().toISOString().split("T")[0] as string;

  for (const m of apiModels) {
    const id = m.id;

    // Skip routing models
    if (SKIP_IDS.has(id)) continue;

    // Skip deactivated models
    if (m.deactivated_at) continue;

    // Skip non-LLM models (embedding-only, video-only, image-only)
    const outputMods = m.architecture.output_modalities;
    const hasTextOutput = outputMods.includes("text");
    const onlyNonLLM = outputMods.every((mod) => NON_LLM_OUTPUTS.has(mod));
    if (onlyNonLLM) continue;

    // Skip image generation models with only per-request pricing
    const promptPrice = parseFloat(m.pricing.prompt);
    const completionPrice = parseFloat(m.pricing.completion);
    const requestPrice = parseFloat(m.pricing.request);
    if (!hasTextOutput && promptPrice === 0 && completionPrice === 0 && requestPrice > 0) continue;

    // Also skip models where text output exists but pricing is only per-request
    // (these are image gen models that also return text descriptions)
    if (hasTextOutput && promptPrice === 0 && completionPrice === 0 && requestPrice > 0) continue;

    // Flatten ID for filesystem (lowercase)
    const flatId = id.toLowerCase();

    // Trim name
    const name = m.name.trim();

    // Parse pricing
    if (isNaN(promptPrice) || isNaN(completionPrice)) continue;

    // Determine output limit from catalog lookup, default to 4096
    const catalogOutput = catalogLookup.get(flatId);
    const outputLimit = catalogOutput !== undefined ? catalogOutput : 4096;

    // Parse modalities
    const modalities = parseModalities(
      m.architecture.input_modalities,
      m.architecture.output_modalities,
    );

    // Free models (both prompt and completion = 0)
    if (promptPrice === 0 && completionPrice === 0) {
      const modelDef: Parameters<typeof defineModel>[0] = {
        id: flatId,
        name,
        family: deriveFamily(m.family, id),
        limit: {
          context: m.context_length,
          output: outputLimit,
        },
        modalities,
        pricing: { unit: "free" },
        release_date: today,
        last_updated: today,
      };

      models.push(defineModel(modelDef));
      continue;
    }

    // Paid models
    const pricing: Pricing = {
      currency: "USD",
      input: toPerMTokens(m.pricing.prompt),
      output: toPerMTokens(m.pricing.completion),
    };

    // Add cache_read if present and non-zero
    const cacheRead = toPerMTokens(m.pricing.input_cache_read);
    if (cacheRead > 0) {
      pricing.cache_read = cacheRead;
    }

    // Add cache_write if present and non-zero
    const cacheWrite = toPerMTokens(m.pricing.input_cache_write);
    if (cacheWrite > 0) {
      pricing.cache_write = cacheWrite;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: flatId,
      name,
      family: deriveFamily(m.family, id),
      limit: {
        context: m.context_length,
        output: outputLimit,
      },
      modalities,
      pricing,
      release_date: today,
      last_updated: today,
    };

    // Check capabilities from providers
    const hasTools =
      m.providers.some((p) => p.tools) ||
      m.supported_parameters.includes("tools") ||
      m.supported_parameters.includes("tool_choice");
    const hasReasoning =
      m.providers.some((p) => p.reasoning) ||
      m.supported_parameters.includes("include_reasoning") ||
      m.supported_parameters.includes("reasoning");

    if (hasTools) modelDef.tool_call = true;
    if (hasReasoning) modelDef.reasoning = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  LLM Gateway: fetched ${apiModels.length} models from API`);
  console.log(`  LLM Gateway: ${models.length} valid LLM models`);

  return { provider, models };
}
