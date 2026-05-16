import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "novitaai",
  name: "Novita AI",
  url: "https://novita.ai",
  api_docs: "https://docs.novita.ai",
  apis: {
    openai: "https://api.novita.ai/openai",
  },
});

// ---------------------------------------------------------------------------
// Dynamic scrape from Novita AI API
//
// Source: https://api.novita.ai/openai/models (first-party, no auth required)
//
// Novita AI is an inference platform hosting models from other providers
// (DeepSeek, Qwen/Alibaba, Zhipu AI, Meta, Baidu, Moonshot AI, MiniMax, etc.)
// with its own per-token pricing.
//
// Pricing: input_token_price_per_m / 10000 = USD per million tokens
// Model IDs: API returns "provider/model" format; "/" is flattened to "--"
// to avoid filesystem issues.
// ---------------------------------------------------------------------------

interface NovitaModel {
  id: string;
  context_size: number;
  max_output_tokens: number;
  input_token_price_per_m: number;
  output_token_price_per_m: number;
  input_modalities: string[];
  output_modalities: string[];
  features: string[];
  model_type: string;
  display_name: string;
}

// ---------------------------------------------------------------------------
// Modality mapping
// ---------------------------------------------------------------------------

const MODALITY_MAP: Record<string, ModelModality | undefined> = {
  text: "text",
  image: "image",
  video: "video",
  audio: "audio",
};

function mapModalities(raw: string[]): ModelModality[] {
  const result: ModelModality[] = [];
  for (const m of raw) {
    const mapped = MODALITY_MAP[m];
    if (mapped) result.push(mapped);
  }
  // Ensure at least "text" is present
  if (result.length === 0) result.push("text");
  return result;
}

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  if (lower.includes("deepseek")) return "deepseek";
  if (lower.includes("qwen3-coder") || lower.includes("qwen3-coder")) return "qwen-coder";
  if (lower.includes("qwen3.6")) return "qwen3.6";
  if (lower.includes("qwen3.5")) return "qwen3.5";
  if (lower.includes("qwen3")) return "qwen3";
  if (lower.includes("qwen2.5")) return "qwen2.5";
  if (lower.includes("qwen")) return "qwen";
  if (lower.includes("glm")) return "glm";
  if (lower.includes("kimi")) return "kimi";
  if (lower.includes("minimax")) return "minimax";
  if (lower.includes("ernie")) return "ernie";
  if (lower.includes("llama-4")) return "llama-4";
  if (lower.includes("llama-3")) return "llama-3";
  if (lower.includes("gemma")) return "gemma";
  if (lower.includes("gpt-oss")) return "gpt-oss";
  if (lower.includes("mimo")) return "mimo";
  if (lower.includes("ling") || lower.includes("ring")) return "ling";
  if (lower.includes("kat-coder")) return "kat-coder";
  if (lower.includes("hermes")) return "hermes";
  if (lower.includes("mistral")) return "mistral";
  if (lower.includes("wizardlm")) return "wizardlm";
  if (lower.includes("euryale") || lower.includes("lunaris") || lower.includes("stheno"))
    return "sao10k";
  if (lower.includes("mythomax")) return "mythomax";
  if (lower.includes("baichuan")) return "baichuan";
  if (lower.includes("paddleocr")) return "paddleocr";
  if (lower.includes("autoglm")) return "autoglm";
  if (lower.includes("elephant")) return "elephant";
  return "other";
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

  // Fetch model list from Novita AI API
  const response = await fetch("https://api.novita.ai/openai/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Novita AI models: ${response.status}`);
  }

  const data = (await response.json()) as { data: NovitaModel[] };
  const apiModels = data.data;

  for (const m of apiModels) {
    // Only process chat models
    if (m.model_type !== "chat") continue;

    // Flatten "/" to "--" in model ID to avoid filesystem issues
    const flatId = m.id.replace(/\//g, "--");

    // Convert pricing: value / 10000 = USD per million tokens
    const inputPrice = m.input_token_price_per_m / 10000;
    const outputPrice = m.output_token_price_per_m / 10000;

    // Skip models with zero pricing (free models with no cost data)
    if (inputPrice === 0 && outputPrice === 0) {
      // Use FreePricing for genuinely free models
      const modelDef: Parameters<typeof defineModel>[0] = {
        id: flatId,
        name: m.display_name || m.id,
        family: deriveFamily(flatId),
        temperature: true,
        limit: { context: m.context_size, output: m.max_output_tokens },
        modalities: {
          input: mapModalities(m.input_modalities),
          output: mapModalities(m.output_modalities),
        },
        pricing: { unit: "free" },
        release_date: today,
        last_updated: today,
      };

      const features = m.features || [];
      if (features.includes("function-calling")) modelDef.tool_call = true;
      if (features.includes("reasoning")) modelDef.reasoning = true;
      if (features.includes("structured-outputs")) modelDef.structured_output = true;

      models.push(defineModel(modelDef));
      continue;
    }

    const pricing: Pricing = {
      currency: "USD",
      input: inputPrice,
      output: outputPrice,
    };

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: flatId,
      name: m.display_name || m.id,
      family: deriveFamily(flatId),
      temperature: true,
      limit: { context: m.context_size, output: m.max_output_tokens },
      modalities: {
        input: mapModalities(m.input_modalities),
        output: mapModalities(m.output_modalities),
      },
      pricing,
      release_date: today,
      last_updated: today,
    };

    const features = m.features || [];
    if (features.includes("function-calling")) modelDef.tool_call = true;
    if (features.includes("reasoning")) modelDef.reasoning = true;
    if (features.includes("structured-outputs")) modelDef.structured_output = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Novita AI: ${models.length} models`);

  return { provider, models };
}
