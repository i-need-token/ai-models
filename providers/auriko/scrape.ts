import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "auriko",
  name: "Auriko",
  url: "https://auriko.ai",
  apis: {
    openai: "https://api.auriko.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic scrape from Auriko models page (RSC payload)
//
// Source: https://auriko.ai/models (first-party, SSR-rendered Next.js RSC payload)
//
// Auriko is a deep cost-optimized inference gateway hosting models from 20+
// providers with 0% markup (pass-through pricing). Pricing shown is the
// original provider's per-1M-token rate (USD).
//
// Data extraction: The /models page embeds model data in Next.js RSC (React
// Server Components) payload within <script> tags. The payload contains a
// JSON object with 180+ models including pricing, context lengths, capabilities,
// and modalities.
//
// For models with multiple providers (e.g., DeepSeek V4 Flash available via
// DeepSeek, DeepInfra, and SiliconFlow), we use the FIRST provider's standard
// tier pricing (typically the original model producer).
//
// Model IDs are lowercased and flattened (replace / and : with --).
// Free models ($0/$0 pricing) use FreePricing.
// Models with context_window=0 are skipped (no context limit data).
// Cache pricing is included when available (cache_read_price, cache_write_price).
// ---------------------------------------------------------------------------

interface AurikoTier {
  name: string;
  input_price: number;
  output_price: number;
  cache_read_price: number | null;
  cache_write_price: number | null;
  latency_hint: string | null;
  price_variants: unknown[];
}

interface AurikoCapabilities {
  supports_streaming: boolean;
  supports_structured_output: boolean;
  supports_tools: boolean;
  supports_json_mode: boolean;
  supports_vision: boolean;
  supports_reasoning: boolean;
  supports_prompt_caching: boolean;
  supports_computer_use: boolean;
  supports_web_search: boolean;
  supports_code_interpreter: boolean;
}

interface AurikoProvider {
  provider: string;
  provider_model_id: string;
  context_window: number;
  max_output_tokens: number | null;
  capabilities: AurikoCapabilities;
  input_modalities: string[];
  output_modalities: string[];
  tiers: AurikoTier[];
  updated_at: string;
  data_policy: string;
}

interface AurikoModel {
  family: string;
  author: string;
  display_name: string;
  providers: AurikoProvider[];
}

interface AurikoModelsData {
  models: Record<string, AurikoModel>;
}

// ---------------------------------------------------------------------------
// Family derivation from model ID and author
// ---------------------------------------------------------------------------

const FAMILY_MAP: Record<string, string> = {
  "claude-opus": "claude-opus",
  "claude-sonnet": "claude-sonnet",
  "claude-haiku": "claude-haiku",
  "gpt-4": "gpt-4",
  "gpt-4o": "gpt-4o",
  "gpt-4.1": "gpt-4.1",
  "gpt-5": "gpt-5",
  "gpt-5.1": "gpt-5.1",
  "gpt-5.2": "gpt-5.2",
  "gpt-5.3": "gpt-5.3",
  "gpt-5.4": "gpt-5.4",
  "gpt-5.5": "gpt-5.5",
  "gpt-oss": "gpt-oss",
  o3: "o3",
  "o3-mini": "o3-mini",
  "o4-mini": "o4-mini",
  gemini: "gemini",
  gemma: "gemma",
  deepseek: "deepseek",
  grok: "grok",
  qwen: "qwen",
  glm: "glm",
  kimi: "kimi",
  moonshot: "moonshot",
  minimax: "minimax",
  llama: "llama",
  nemotron: "nemotron",
  mistral: "mistral",
  phi: "phi",
  hunyuan: "hunyuan",
  hy: "hy",
  lfm: "lfm",
  rnj: "rnj",
  sao10k: "sao10k",
  hermes: "hermes",
  mythomax: "mythomax",
  seed: "seed",
  mimo: "mimo",
  ling: "ling",
};

function deriveFamily(modelId: string): string {
  // Try matching known prefixes
  for (const prefix of Object.keys(FAMILY_MAP)) {
    if (modelId.startsWith(prefix)) {
      return FAMILY_MAP[prefix] as string;
    }
  }
  // Fallback: use the first part of the model ID
  const parts = modelId.split("-");
  return (parts[0] as string) || modelId;
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
  const models: Model[] = [];

  // Fetch the models page HTML
  const response = await fetch("https://auriko.ai/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Auriko models page: ${response.status}`);
  }

  const html = await response.text();

  // Extract RSC payload chunks from <script> tags
  // Pattern: self.__next_f.push([1,"encoded_json_string"])
  const rscRegex = /self\.__next_f\.push\(\[1,"(.*?)"\]\)/g;
  const chunks: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = rscRegex.exec(html)) !== null) {
    chunks.push(match[1] as string);
  }

  // Find the chunk containing the models data
  // The models data is in a JSON object: {"data":{"models":{...}}}
  let modelsData: AurikoModelsData | null = null;
  for (const chunk of chunks) {
    // Decode the JSON-encoded string (unicode escapes)
    const decoded = chunk
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");

    // Strategy 1: Search for {"data":{"models": pattern
    const dataModelsIdx = decoded.indexOf('"data":{"models"');
    if (dataModelsIdx >= 0) {
      // Find the opening { before "data"
      let openBrace = -1;
      for (let i = dataModelsIdx - 1; i >= 0; i--) {
        if (decoded[i] === "{") {
          openBrace = i;
          break;
        }
      }
      if (openBrace >= 0) {
        // Find the matching closing brace
        let braceCount = 0;
        let closeBrace = -1;
        for (let i = openBrace; i < decoded.length; i++) {
          if (decoded[i] === "{") braceCount++;
          else if (decoded[i] === "}") {
            braceCount--;
            if (braceCount === 0) {
              closeBrace = i + 1;
              break;
            }
          }
        }
        if (closeBrace >= 0) {
          const jsonStr = decoded.slice(openBrace, closeBrace);
          try {
            const parsed = JSON.parse(jsonStr) as { data: AurikoModelsData };
            if (parsed.data?.models && typeof parsed.data.models === "object") {
              modelsData = parsed.data;
              break;
            }
          } catch {
            // Fall through to strategy 2
          }
        }
      }
    }

    // Strategy 2: Search for "models":{ pattern and parse directly
    const modelsIdx = decoded.indexOf('"models":{');
    if (modelsIdx >= 0) {
      // Find the value start (the { after "models":)
      const valueStart = decoded.indexOf("{", modelsIdx + 9);
      if (valueStart >= 0) {
        let braceCount = 0;
        let valueEnd = -1;
        for (let i = valueStart; i < decoded.length; i++) {
          if (decoded[i] === "{") braceCount++;
          else if (decoded[i] === "}") {
            braceCount--;
            if (braceCount === 0) {
              valueEnd = i + 1;
              break;
            }
          }
        }
        if (valueEnd >= 0) {
          const modelsJson = decoded.slice(valueStart, valueEnd);
          try {
            modelsData = JSON.parse(modelsJson) as AurikoModelsData;
            break;
          } catch {
            continue;
          }
        }
      }
    }
  }

  if (!modelsData || !modelsData.models) {
    throw new Error("Failed to extract model data from Auriko RSC payload");
  }

  const aurikoModels = modelsData.models;

  for (const [modelId, mdata] of Object.entries(aurikoModels)) {
    // Use the first provider (typically the original model producer)
    const firstProvider = mdata.providers[0];
    if (!firstProvider) {
      console.warn(`  Skipping ${modelId}: no provider data`);
      continue;
    }

    // Skip models with context_window = 0 (no context limit data)
    if (firstProvider.context_window === 0) {
      console.warn(`  Skipping ${modelId}: context_window=0`);
      continue;
    }

    // Get the standard tier pricing
    const standardTier =
      firstProvider.tiers.find((t) => t.name === "standard") ?? firstProvider.tiers[0];
    if (!standardTier) {
      console.warn(`  Skipping ${modelId}: no pricing tier`);
      continue;
    }

    // Flatten model ID (lowercase, replace / and : with --)
    const flatId = modelId.replace(/\//g, "--").replace(/:/g, "--").toLowerCase();

    // Determine pricing
    const inputPrice = standardTier.input_price;
    const outputPrice = standardTier.output_price;

    let pricing: Pricing;
    if (inputPrice === 0 && outputPrice === 0) {
      pricing = { unit: "free" };
    } else {
      const tokenPricing: Pricing = {
        currency: "USD",
        input: inputPrice,
        output: outputPrice,
      };
      // Add cache pricing if available
      if (standardTier.cache_read_price !== null && standardTier.cache_read_price > 0) {
        tokenPricing.cache_read = standardTier.cache_read_price;
      }
      if (standardTier.cache_write_price !== null && standardTier.cache_write_price > 0) {
        tokenPricing.cache_write = standardTier.cache_write_price;
      }
      pricing = tokenPricing;
    }

    // Build modalities
    const inputModalities: ModelModality[] = [];
    if (firstProvider.input_modalities.includes("text")) inputModalities.push("text");
    if (firstProvider.input_modalities.includes("image")) inputModalities.push("image");
    if (inputModalities.length === 0) inputModalities.push("text"); // default

    const outputModalities: ModelModality[] = [];
    if (firstProvider.output_modalities.includes("text")) outputModalities.push("text");
    if (firstProvider.output_modalities.includes("image")) outputModalities.push("image");
    if (outputModalities.length === 0) outputModalities.push("text"); // default

    // Build model definition
    const modelDef: Parameters<typeof defineModel>[0] = {
      id: flatId,
      name: mdata.display_name || modelId,
      family: deriveFamily(modelId),
      temperature: true,
      modalities: {
        input: inputModalities,
        output: outputModalities,
      },
      pricing,
      release_date: today,
      last_updated: today,
    };

    // Add context/output limits
    const contextWindow = firstProvider.context_window;
    const maxOutput = firstProvider.max_output_tokens;
    if (contextWindow > 0) {
      if (maxOutput !== null && maxOutput > 0) {
        modelDef.limit = { context: contextWindow, output: maxOutput };
      } else {
        modelDef.limit = { context: contextWindow, output: contextWindow }; // default output = context
      }
    }

    // Add capabilities
    const caps = firstProvider.capabilities;
    if (caps.supports_tools) modelDef.tool_call = true;
    if (caps.supports_reasoning) modelDef.reasoning = true;
    if (caps.supports_vision && !inputModalities.includes("image")) {
      // Vision capability but not in modalities list — still add image
      inputModalities.push("image");
    }
    if (caps.supports_structured_output) modelDef.structured_output = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Auriko: ${models.length} models`);

  return { provider, models };
}
