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
  id: "auriko",
  name: "Auriko",
  url: "https://auriko.ai",
  apis: {
    openai: "https://api.auriko.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Raw data types (from RSC payload)
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
// RSC payload extraction helpers
// ---------------------------------------------------------------------------

async function fetchModelsData(): Promise<AurikoModelsData> {
  const response = await fetch("https://auriko.ai/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Auriko models page: ${response.status}`);
  }

  const html = await response.text();

  // Extract RSC payload chunks from <script> tags
  const rscRegex = /self\.__next_f\.push\(\[1,"(.*?)"\]\)/g;
  const chunks: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = rscRegex.exec(html)) !== null) {
    chunks.push(match[1] as string);
  }

  // Find the chunk containing the models data
  let modelsData: AurikoModelsData | null = null;
  for (const chunk of chunks) {
    const decoded = chunk
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");

    // Strategy 1: Search for {"data":{"models": pattern
    const dataModelsIdx = decoded.indexOf('"data":{"models"');
    if (dataModelsIdx >= 0) {
      let openBrace = -1;
      for (let i = dataModelsIdx - 1; i >= 0; i--) {
        if (decoded[i] === "{") {
          openBrace = i;
          break;
        }
      }
      if (openBrace >= 0) {
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

    // Strategy 2: Search for "models":{ pattern
    const modelsIdx = decoded.indexOf('"models":{');
    if (modelsIdx >= 0) {
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

  return modelsData;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  // -----------------------------------------------------------------------
  // Step 1: Discover models from RSC payload
  // -----------------------------------------------------------------------
  discover: {
    source: {
      url: "https://auriko.ai/models",
      type: "ssr_rsc",
      description:
        "Auriko models page (Next.js RSC payload) with 180+ models including pricing, context, capabilities, modalities",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const modelsData = await fetchModelsData();
      const discovered: DiscoveredModel[] = [];

      for (const [modelId, mdata] of Object.entries(modelsData.models)) {
        const firstProvider = mdata.providers[0];
        if (!firstProvider) {
          console.warn(`  Skipping ${modelId}: no provider data`);
          continue;
        }

        // Skip models with context_window = 0
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

        // Flatten model ID
        const flatId = modelId.replace(/\//g, "--").replace(/:/g, "--").toLowerCase();

        discovered.push({
          id: flatId,
          raw: {
            modelId,
            mdata,
            firstProvider,
            standardTier,
          },
        });
      }

      return discovered;
    },
  },

  // -----------------------------------------------------------------------
  // Step 2: Extract pricing from RSC payload
  // -----------------------------------------------------------------------
  extractPricing: {
    source: {
      url: "https://auriko.ai/models",
      type: "ssr_rsc",
      description:
        "Pricing from Auriko RSC payload — per-1M-token rates from first provider's standard tier",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      for (const m of models) {
        const raw = m.raw as {
          modelId: string;
          mdata: AurikoModel;
          firstProvider: AurikoProvider;
          standardTier: AurikoTier;
        };
        if (!raw) continue;

        const { standardTier } = raw;
        const inputPrice = standardTier.input_price;
        const outputPrice = standardTier.output_price;

        if (inputPrice === 0 && outputPrice === 0) {
          pricingMap.set(m.id, { unit: "free" });
        } else {
          const p: Pricing = {
            currency: "USD",
            input: inputPrice,
            output: outputPrice,
          };
          if (standardTier.cache_read_price !== null && standardTier.cache_read_price > 0) {
            p.cache_read = standardTier.cache_read_price;
          }
          if (standardTier.cache_write_price !== null && standardTier.cache_write_price > 0) {
            p.cache_write = standardTier.cache_write_price;
          }
          pricingMap.set(m.id, p);
        }
      }

      return pricingMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 3: Extract dates from RSC payload (updated_at field)
  // -----------------------------------------------------------------------
  extractDates: {
    source: {
      url: "https://auriko.ai/models",
      type: "ssr_rsc",
      description: "Dates from Auriko RSC payload — updated_at field from first provider",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        const raw = m.raw as {
          modelId: string;
          mdata: AurikoModel;
          firstProvider: AurikoProvider;
          standardTier: AurikoTier;
        };
        if (!raw) continue;

        // Use updated_at from the provider data
        const updatedAt = raw.firstProvider.updated_at;
        if (updatedAt) {
          // updated_at is typically a full ISO date like "2026-05-15T..."
          const dateStr = updatedAt.slice(0, 10); // YYYY-MM-DD
          datesMap.set(m.id, {
            release_date: dateStr,
            last_updated: dateStr,
          });
        }
      }

      return datesMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 4: Extract limits (context window, max output)
  // -----------------------------------------------------------------------
  extractLimits: {
    source: {
      url: "https://auriko.ai/models",
      type: "ssr_rsc",
      description: "Context window and max output from Auriko RSC payload — first provider data",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();

      for (const m of models) {
        const raw = m.raw as {
          modelId: string;
          mdata: AurikoModel;
          firstProvider: AurikoProvider;
          standardTier: AurikoTier;
        };
        if (!raw) continue;

        const contextWindow = raw.firstProvider.context_window;
        const maxOutput = raw.firstProvider.max_output_tokens;

        if (contextWindow > 0) {
          limitsMap.set(m.id, {
            context: contextWindow,
            ...(maxOutput !== null && maxOutput > 0 ? { output: maxOutput } : {}),
          });
        }
      }

      return limitsMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 5: Extract modalities from RSC payload
  // -----------------------------------------------------------------------
  extractModalities: {
    source: {
      url: "https://auriko.ai/models",
      type: "ssr_rsc",
      description:
        "Modalities from Auriko RSC payload — input/output_modalities from first provider",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();

      for (const m of models) {
        const raw = m.raw as {
          modelId: string;
          mdata: AurikoModel;
          firstProvider: AurikoProvider;
          standardTier: AurikoTier;
        };
        if (!raw) continue;

        const inputModalities: ModelModality[] = [];
        if (raw.firstProvider.input_modalities.includes("text")) inputModalities.push("text");
        if (raw.firstProvider.input_modalities.includes("image")) inputModalities.push("image");
        if (inputModalities.length === 0) inputModalities.push("text");

        const outputModalities: ModelModality[] = [];
        if (raw.firstProvider.output_modalities.includes("text")) outputModalities.push("text");
        if (raw.firstProvider.output_modalities.includes("image")) outputModalities.push("image");
        if (outputModalities.length === 0) outputModalities.push("text");

        modalitiesMap.set(m.id, {
          input: inputModalities,
          output: outputModalities,
        });
      }

      return modalitiesMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 6: Extract features from RSC payload
  // -----------------------------------------------------------------------
  extractFeatures: {
    source: {
      url: "https://auriko.ai/models",
      type: "ssr_rsc",
      description: "Features from Auriko RSC payload — capabilities from first provider",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();

      for (const m of models) {
        const raw = m.raw as {
          modelId: string;
          mdata: AurikoModel;
          firstProvider: AurikoProvider;
          standardTier: AurikoTier;
        };
        if (!raw) continue;

        const caps = raw.firstProvider.capabilities;
        const features: ExtractedFeatures = {};

        if (caps.supports_tools) features.tool_call = true;
        if (caps.supports_reasoning) features.reasoning = true;
        if (caps.supports_structured_output) features.structured_output = true;

        featuresMap.set(m.id, features);
      }

      return featuresMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 7: Derive name from model ID
  // -----------------------------------------------------------------------
  deriveName: {
    execute: (modelId: string): string => {
      // For Auriko, the display_name is available in raw data,
      // but deriveName is a pure function that only takes the ID.
      // We'll do smart formatting from the flattened ID.
      let name = modelId
        // Restore common separators
        .replace(/--/g, "/")
        // Capitalize first letter of each segment
        .split("/")
        .map((segment) =>
          segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        )
        .join("/");
      return name;
    },
  },

  // -----------------------------------------------------------------------
  // Step 8: Derive family from model ID
  // -----------------------------------------------------------------------
  deriveFamily: {
    execute: (modelId: string): string => {
      // Match known prefixes
      const familyRules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /^claude-opus/, family: "claude-opus" },
        { pattern: /^claude-sonnet/, family: "claude-sonnet" },
        { pattern: /^claude-haiku/, family: "claude-haiku" },
        { pattern: /^gpt-oss/, family: "gpt-oss" },
        { pattern: /^gpt/, family: "gpt" },
        { pattern: /^o[0-9]/, family: "o" },
        { pattern: /^gemini/, family: "gemini" },
        { pattern: /^gemma/, family: "gemma" },
        { pattern: /^deepseek/, family: "deepseek" },
        { pattern: /^grok/, family: "grok" },
        { pattern: /^qwen/, family: "qwen" },
        { pattern: /^glm/, family: "glm" },
        { pattern: /^kimi/, family: "kimi" },
        { pattern: /^minimax/, family: "minimax" },
        { pattern: /^llama/, family: "llama" },
        { pattern: /^nemotron/, family: "nemotron" },
        { pattern: /^mistral/, family: "mistral" },
        { pattern: /^phi/, family: "phi" },
        { pattern: /^hunyuan/, family: "hunyuan" },
        { pattern: /^hy/, family: "hy" },
        { pattern: /^lfm/, family: "lfm" },
        { pattern: /^hermes/, family: "hermes" },
        { pattern: /^seed/, family: "seed" },
        { pattern: /^mimo/, family: "mimo" },
        { pattern: /^ling/, family: "ling" },
      ];

      for (const { pattern, family } of familyRules) {
        if (pattern.test(modelId)) return family;
      }

      // Fallback: first segment
      const parts = modelId.split("-");
      return (parts[0] as string) || modelId;
    },
  },
};

// ---------------------------------------------------------------------------
// Main scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);

  return {
    provider,
    models,
  };
}
