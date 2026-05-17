import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";
import * as fs from "fs";
import * as path from "path";

const provider = defineProvider({
  id: "martian",
  name: "Martian",
  url: "https://withmartian.com",
  api_docs: "https://docs.withmartian.com",
  apis: {
    openai: "https://api.withmartian.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic model data (from Martian public API)
//
// Sources:
// - Model list & pricing: https://api.withmartian.com/v1/models (public API)
// - Context lengths: looked up from existing provider YAML files in catalog
// - Max output tokens: Martian API max_completion_tokens field
// - Cache pricing: Martian API pricing.input_cache_read field
// - Vision detection: Martian API pricing.image > 0
// - Reasoning detection: Martian API pricing.internal_reasoning > 0
// - Tool call detection: inferred from provider name
//
// Martian is a gateway/router platform ("Gateway API for 200+ AI models").
// Pricing shown is Martian's per-1M-token rate (USD). Most models have
// pass-through pricing (0% markup), though some providers have a markup
// (e.g., Anthropic models have ~25% markup).
//
// Model IDs use "--" instead of "/" to avoid filesystem issues
// (Martian API uses "provider/model" format).
// Models without context_length data (not in our catalog) are skipped.
// ---------------------------------------------------------------------------

interface MartianModel {
  id: string;
  pricing: {
    prompt: string;
    completion: string;
    image: string;
    request: string;
    web_search: string;
    internal_reasoning: string;
    input_cache_read: string | null;
    input_cache_write: string | null;
  };
  added_at: string;
  updated_at: string;
  reliability_tier: number;
  max_completion_tokens: number;
}

// Default context lengths for models not in our catalog
const KNOWN_CONTEXT: Record<string, number> = {
  "qwen-vl-max": 256000,
};

// Default output limits for models without max_completion_tokens
const DEFAULT_OUTPUT = 4096;

// ---------------------------------------------------------------------------
// Context length lookup from existing catalog
// ---------------------------------------------------------------------------

function buildCatalogLookup(): Record<string, { context: number; output: number }> {
  const lookup: Record<string, { context: number; output: number }> = {};
  const providersDir = path.join(process.cwd(), "providers");

  for (const providerDir of fs.readdirSync(providersDir)) {
    const modelsDir = path.join(providersDir, providerDir, "models");
    if (!fs.existsSync(modelsDir) || !fs.statSync(modelsDir).isDirectory()) continue;

    for (const yamlFile of fs.readdirSync(modelsDir)) {
      if (!yamlFile.endsWith(".yaml") || yamlFile === "provider.yaml") continue;
      const modelId = yamlFile.replace(".yaml", "");
      const content = fs.readFileSync(path.join(modelsDir, yamlFile), "utf-8");

      let ctx: number | undefined = undefined;
      let output: number | undefined = undefined;
      for (const line of content.split("\n")) {
        if (line.startsWith("  context:")) {
          const val = parseInt(line.split(":")[1] as string, 10);
          if (!isNaN(val)) ctx = val;
        } else if (line.startsWith("  output:")) {
          const val = parseInt(line.split(":")[1] as string, 10);
          if (!isNaN(val)) output = val;
        }
      }

      if (ctx !== undefined) {
        const entry: { context: number; output: number } = {
          context: ctx,
          output: output ?? DEFAULT_OUTPUT,
        };
        lookup[modelId] = entry;
      }

      // Also index by snapshot IDs
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.startsWith("- id:")) {
          const snapId = (trimmed.split("id:")[1] as string).trim();
          if (ctx !== undefined) {
            lookup[snapId] = lookup[modelId] as { context: number; output: number };
          }
        }
      }
    }
  }

  return lookup;
}

// ---------------------------------------------------------------------------
// Family derivation from model ID
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const parts = id.split("/");
  const provider = parts[0] as string;
  const model = (parts.length > 1 ? (parts[1] as string) : id).toLowerCase();

  if (provider === "anthropic") return "claude";
  if (provider === "openai") {
    if (model.startsWith("gpt-4o")) return "gpt-4o";
    if (model.startsWith("gpt-4")) return "gpt-4";
    if (model.startsWith("gpt-5")) return "gpt-5";
    if (model.startsWith("o1")) return "o1";
    if (model.startsWith("o3")) return "o3";
    if (model.startsWith("o4")) return "o4";
    if (model.startsWith("chatgpt")) return "chatgpt";
    return "gpt";
  }
  if (provider === "google") {
    if (model.startsWith("gemini")) return "gemini";
    if (model.startsWith("gemma")) return "gemma";
    return "google";
  }
  if (provider === "meta-llama") return "llama";
  if (provider === "mistralai") {
    if (model.startsWith("codestral")) return "codestral";
    if (model.startsWith("mistral-large")) return "mistral-large";
    if (model.startsWith("mistral-medium")) return "mistral-medium";
    if (model.startsWith("mistral-small")) return "mistral-small";
    if (model.startsWith("pixtral")) return "pixtral";
    return "mistral";
  }
  if (provider === "deepseek") return "deepseek";
  if (provider === "x-ai") return "grok";
  if (provider === "qwen") return "qwen";
  if (provider === "minimax") return "minimax";
  if (provider === "cohere") {
    if (model.startsWith("command-r")) return "command-r";
    if (model.startsWith("command-a")) return "command-a";
    return "command";
  }
  if (provider === "nvidia") return "nvidia";
  if (provider === "amazon") return "nova";
  if (provider === "moonshotai") return "kimi";
  if (provider === "perplexity") return "sonar";
  if (provider === "xiaomi") return "mimo";
  if (provider === "z-ai") return "glm";
  if (provider === "bytedance-seed" || provider === "bytedance") return "seed";
  if (provider === "ibm-granite") return "granite";
  if (provider === "inclusionai") return "inclusion";
  if (provider === "morph") return "morph";
  if (provider === "tencent") return "hunyuan";
  if (provider === "baidu") return "ernie";
  if (provider === "arcee-ai") return "arcee";
  if (provider === "nousresearch") return "nous";
  if (provider === "aion-labs") return "aion";
  if (provider === "microsoft") return "phi";
  if (provider === "sao10k") return "sao10k";
  if (provider === "thedrummer") return "thedrummer";
  if (provider === "anthracite-org") return "anthracite";
  if (provider === "databricks") return "dbrx";
  if (provider === "deepcogito") return "deepcogito";
  if (provider === "essentialai") return "essential";
  if (provider === "gryphe") return "gryphe";
  if (provider === "inception") return "inception";
  if (provider === "kwaipilot") return "kwaipilot";
  if (provider === "liquid") return "liquid";
  if (provider === "mancer") return "mancer";
  if (provider === "nex-agi") return "nex";
  if (provider === "perceptron") return "perceptron";
  if (provider === "prime-intellect") return "prime";
  if (provider === "rekaai") return "reka";
  if (provider === "relace") return "relace";
  if (provider === "stepfun") return "stepfun";
  if (provider === "undi95") return "undi95";
  if (provider === "writer") return "palmyra";
  if (provider === "alibaba") return "qwen";
  if (provider === "deepinfra") {
    const subParts = model.split("/");
    if (subParts.length > 1) {
      return deriveFamily((subParts[0] as string) + "/" + subParts.slice(1).join("/"));
    }
    return "deepinfra";
  }

  const baseName = model.split("/").pop() as string;
  return baseName.replace(/[-_]\d+b.*$/, "").replace(/[-_]v\d+.*$/, "");
}

// ---------------------------------------------------------------------------
// Model name formatting
// ---------------------------------------------------------------------------

const BRAND_NAMES: Record<string, string> = {
  gpt: "GPT",
  claude: "Claude",
  gemini: "Gemini",
  deepseek: "DeepSeek",
  llama: "Llama",
  qwen: "Qwen",
  grok: "Grok",
  glm: "GLM",
  mistral: "Mistral",
  codestral: "Codestral",
  pixtral: "Pixtral",
  command: "Command",
  nova: "Nova",
  kimi: "Kimi",
  sonar: "Sonar",
  phi: "Phi",
  mimo: "MiMo",
  seed: "Seed",
  granite: "Granite",
  ernie: "ERNIE",
  hunyuan: "Hunyuan",
  palmyra: "Palmyra",
  dbrx: "DBRX",
  aion: "Aion",
  morph: "Morph",
};

function formatModelName(baseId: string): string {
  const name = baseId.replace(/^.*--/, "");
  const parts = name.split("-");
  const result: string[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i] as string;
    const lower = part.toLowerCase();

    if (lower in BRAND_NAMES) {
      result.push(BRAND_NAMES[lower] as string);
    } else if (/^\d+$/.test(part)) {
      // Pure number - check if next part is also a single digit (version like 4-5 → 4.5)
      if (i + 1 < parts.length && /^\d$/.test(parts[i + 1] as string)) {
        result.push(part + "." + (parts[i + 1] as string));
        i++; // Skip next part since we consumed it
      } else {
        result.push(part);
      }
    } else if (/^\d+b$/i.test(part)) {
      result.push(part.toUpperCase());
    } else {
      result.push(part.charAt(0).toUpperCase() + part.slice(1));
    }
  }

  return result.join(" ");
}

// ---------------------------------------------------------------------------
// Tool call detection from provider name
// ---------------------------------------------------------------------------

const TOOL_CALL_PROVIDERS = new Set([
  "anthropic",
  "openai",
  "google",
  "mistralai",
  "cohere",
  "deepseek",
  "x-ai",
  "qwen",
  "minimax",
  "moonshotai",
  "perplexity",
  "xiaomi",
  "z-ai",
  "bytedance-seed",
  "bytedance",
  "nvidia",
  "amazon",
  "ibm-granite",
  "inclusionai",
  "morph",
  "tencent",
  "baidu",
  "arcee-ai",
  "aion-labs",
  "stepfun",
  "writer",
  "inception",
  "databricks",
  "alibaba",
]);

const NO_TOOL_CALL_MODELS = new Set(["o1", "o1-mini", "o1-pro", "o1-2024-12-17"]);

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const today = new Date().toISOString().split("T")[0] as string;
  const catalogLookup = buildCatalogLookup();

  const response = await fetch("https://api.withmartian.com/v1/models");
  const data = (await response.json()) as { data: MartianModel[] };

  const models: Model[] = [];
  let skipped = 0;

  for (const apiModel of data.data) {
    const mid = apiModel.id;

    // Flatten model ID: replace / and : with --
    const flatId = mid.toLowerCase().replace(/\//g, "--").replace(/:/g, "--");
    const parts = mid.split("/");
    const baseName =
      parts.length > 1
        ? (parts[parts.length - 1] as string).toLowerCase().replace(/:/g, "--")
        : flatId;

    // Skip non-LLM models
    if (
      flatId.includes("embed") ||
      flatId.includes("dall") ||
      flatId.includes("whisper") ||
      flatId.includes("tts") ||
      flatId.includes("stable") ||
      flatId.includes("flux") ||
      flatId.includes("image-gen") ||
      flatId.includes("sora")
    ) {
      skipped++;
      continue;
    }

    // Skip routing models
    if (flatId.includes("router") || flatId === "auto") {
      skipped++;
      continue;
    }

    // Look up context_length from catalog
    let contextLength: number | undefined = undefined;
    let outputLimit: number | undefined = undefined;

    const catEntry = catalogLookup[flatId] ?? catalogLookup[baseName];
    if (catEntry !== undefined) {
      contextLength = catEntry.context;
      outputLimit = catEntry.output;
    } else if (KNOWN_CONTEXT[baseName] !== undefined) {
      contextLength = KNOWN_CONTEXT[baseName];
      outputLimit = DEFAULT_OUTPUT;
    }

    // Skip models without context_length data
    if (contextLength === undefined) {
      console.warn(`  Martian: No context_length for ${mid}, skipping`);
      skipped++;
      continue;
    }

    // Use API max_completion_tokens if available, otherwise catalog output
    const maxOut =
      apiModel.max_completion_tokens > 0
        ? apiModel.max_completion_tokens
        : (outputLimit ?? DEFAULT_OUTPUT);

    // Convert per-token pricing to per-1M-token
    const promptPerToken = parseFloat(apiModel.pricing.prompt);
    const completionPerToken = parseFloat(apiModel.pricing.completion);
    const inputPerMTokens = Math.round(promptPerToken * 1e6 * 1e6) / 1e6;
    const outputPerMTokens = Math.round(completionPerToken * 1e6 * 1e6) / 1e6;

    // Skip models with zero pricing
    if (inputPerMTokens === 0 && outputPerMTokens === 0) {
      skipped++;
      continue;
    }

    // Build pricing object
    const pricing: Pricing = { currency: "USD", input: inputPerMTokens, output: outputPerMTokens };

    // Add cache_read pricing if available
    if (apiModel.pricing.input_cache_read !== null) {
      const cacheReadPerToken = parseFloat(apiModel.pricing.input_cache_read);
      if (cacheReadPerToken > 0) {
        const cacheReadPerMTokens = Math.round(cacheReadPerToken * 1e6 * 1e6) / 1e6;
        pricing.cache_read = cacheReadPerMTokens;
      }
    }

    // Add cache_write pricing if available
    if (apiModel.pricing.input_cache_write !== null) {
      const cacheWritePerToken = parseFloat(apiModel.pricing.input_cache_write);
      if (cacheWritePerToken > 0) {
        const cacheWritePerMTokens = Math.round(cacheWritePerToken * 1e6 * 1e6) / 1e6;
        pricing.cache_write = cacheWritePerMTokens;
      }
    }

    // Detect vision capability from image pricing or model name
    const hasVision =
      parseFloat(apiModel.pricing.image) > 0 ||
      flatId.includes("vl") ||
      flatId.includes("vision") ||
      flatId.includes("gpt-4o") ||
      flatId.includes("gemini") ||
      flatId.includes("pixtral") ||
      flatId.includes("claude-opus-4") ||
      flatId.includes("claude-sonnet-4") ||
      flatId.includes("claude-haiku-4") ||
      flatId.includes("nova") ||
      flatId.includes("glm-4v") ||
      flatId.includes("qwen2.5-vl");

    // Detect reasoning capability from internal_reasoning pricing or model name
    const hasReasoning =
      parseFloat(apiModel.pricing.internal_reasoning) > 0 ||
      flatId.includes("o1") ||
      flatId.includes("o3") ||
      flatId.includes("o4") ||
      flatId.includes("deepseek-r1") ||
      flatId.includes("thinking") ||
      flatId.includes("reasoning") ||
      flatId.includes("kimi-k2") ||
      flatId.includes("glm-5") ||
      flatId.includes("claude-opus-4") ||
      flatId.includes("claude-sonnet-4") ||
      flatId.includes("claude-haiku-4");

    // Detect tool call capability
    const providerPrefix = (parts[0] as string).toLowerCase();
    const hasToolCall =
      TOOL_CALL_PROVIDERS.has(providerPrefix) && !NO_TOOL_CALL_MODELS.has(baseName);

    // Detect structured output capability
    const hasStructuredOutput =
      providerPrefix === "anthropic" ||
      providerPrefix === "openai" ||
      providerPrefix === "google" ||
      providerPrefix === "mistralai" ||
      providerPrefix === "cohere" ||
      providerPrefix === "deepseek" ||
      providerPrefix === "x-ai" ||
      providerPrefix === "qwen" ||
      providerPrefix === "z-ai";

    // Build modalities
    const inputModalities: ModelModality[] = hasVision ? ["text", "image"] : ["text"];
    const outputModalities: ModelModality[] = ["text"];

    // Derive display name
    const modelName = formatModelName(baseName);

    // Derive release_date from updated_at or added_at
    const updatedAt = apiModel.updated_at ?? apiModel.added_at ?? "2025-01-01";
    const releaseDate = updatedAt.substring(0, 10) as string;

    models.push(
      defineModel({
        id: flatId,
        name: modelName,
        family: deriveFamily(mid),
        reasoning: hasReasoning,
        temperature: true,
        tool_call: hasToolCall,
        structured_output: hasStructuredOutput,
        limit: { context: contextLength, output: maxOut },
        modalities: { input: inputModalities, output: outputModalities },
        pricing,
        release_date: releaseDate,
        last_updated: today,
      }),
    );
  }

  console.log(`  Martian: ${models.length} models, ${skipped} skipped`);

  return { provider, models };
}
