import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "venice",
  name: "Venice AI",
  url: "https://venice.ai",
  api_docs: "https://docs.venice.ai",
  apis: {
    openai: "https://api.venice.ai/api/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic scrape from Venice AI API
//
// Source: https://api.venice.ai/api/v1/models
//         (first-party, no auth required)
//
// Venice AI is a privacy-focused inference platform hosting models from
// multiple providers (Anthropic, OpenAI, Google, DeepSeek, Qwen/Alibaba,
// Meta, Mistral, xAI, Moonshot, MiniMax, ZhipuAI/Z.AI, NVIDIA, Arcee,
// Inception/Mercury, NousResearch) with per-token USD pricing.
//
// E2EE models: End-to-end encrypted variants with higher pricing;
//              included as separate entries (e.g. e2ee-glm-5-1)
// Pricing: API returns per-1M-token USD values
// Context lengths: API provides context_length and maxCompletionTokens
// Capabilities: API provides supportsReasoning, supportsFunctionCalling,
//               supportsVision, supportsResponseSchema
// Model IDs: No "/" in IDs, no flattening needed
// ---------------------------------------------------------------------------

interface VenicePricing {
  input: { usd: number; diem: number };
  output: { usd: number; diem: number };
  cache_input?: { usd: number; diem: number };
}

interface VeniceCapabilities {
  supportsReasoning: boolean;
  supportsFunctionCalling: boolean;
  supportsVision: boolean;
  supportsResponseSchema: boolean;
  supportsAudioInput: boolean;
  supportsWebSearch: boolean;
  quantization?: string;
}

interface VeniceModelSpec {
  pricing: VenicePricing;
  capabilities: VeniceCapabilities;
  maxCompletionTokens: number;
  availableContextTokens: number;
  name: string;
  offline: boolean;
  description?: string;
}

interface VeniceModel {
  id: string;
  created: number;
  object: string;
  owned_by: string;
  type: string;
  context_length: number;
  model_spec: VeniceModelSpec;
}

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  // Claude family
  if (lower.includes("claude-opus")) return "claude-opus";
  if (lower.includes("claude-sonnet")) return "claude-sonnet";
  // GPT family
  if (lower.includes("gpt-55")) return "gpt-55";
  if (lower.includes("gpt-54")) return "gpt-54";
  if (lower.includes("gpt-53")) return "gpt-53";
  if (lower.includes("gpt-52")) return "gpt-52";
  if (lower.includes("gpt-4o")) return "gpt-4o";
  if (lower.includes("gpt-oss")) return "gpt-oss";
  // Gemini/Gemma family
  if (lower.includes("gemini-3-1")) return "gemini-3.1";
  if (lower.includes("gemini-3")) return "gemini-3";
  if (lower.includes("gemma-4")) return "gemma-4";
  if (lower.includes("gemma-3")) return "gemma-3";
  // DeepSeek family
  if (lower.includes("deepseek-v4")) return "deepseek-v4";
  if (lower.includes("deepseek-v3")) return "deepseek-v3";
  // Qwen family
  if (lower.includes("qwen3-coder")) return "qwen-coder";
  if (lower.includes("qwen3-vl")) return "qwen-vl";
  if (lower.includes("qwen3-5")) return "qwen3.5";
  if (lower.includes("qwen3-6")) return "qwen3.6";
  if (lower.includes("qwen3")) return "qwen3";
  if (lower.includes("qwen-3-6")) return "qwen3.6";
  // GLM/ZhipuAI family
  if (lower.includes("glm-5-1") || lower.includes("glm-5.1")) return "glm-5.1";
  if (lower.includes("glm-5v")) return "glm-5v";
  if (lower.includes("glm-5")) return "glm-5";
  if (lower.includes("glm-4.7")) return "glm-4.7";
  if (lower.includes("glm-4.6")) return "glm-4.6";
  // Grok/xAI family
  if (lower.includes("grok-4-20")) return "grok-4.20";
  if (lower.includes("grok-4-3")) return "grok-4.3";
  if (lower.includes("grok-4")) return "grok-4";
  // Mistral family
  if (lower.includes("mistral-small")) return "mistral-small";
  // Llama family
  if (lower.includes("llama-3.3")) return "llama-3.3";
  if (lower.includes("llama-3.2")) return "llama-3.2";
  // Kimi/Moonshot family
  if (lower.includes("kimi-k2")) return "kimi-k2";
  // MiniMax family
  if (lower.includes("minimax-m2")) return "minimax-m2";
  // Nemotron/NVIDIA family
  if (lower.includes("nemotron")) return "nemotron";
  // Mercury/Inception family
  if (lower.includes("mercury")) return "mercury";
  // Arcee family
  if (lower.includes("arcee")) return "arcee";
  // Aion family
  if (lower.includes("aion")) return "aion";
  // Hermes/NousResearch family
  if (lower.includes("hermes")) return "hermes";
  // Venice own models
  if (lower.includes("venice-uncensored")) return "venice-uncensored";
  // E2EE encrypted variants
  if (lower.startsWith("e2ee-")) return "e2ee-" + deriveFamily(lower.replace("e2ee-", ""));
  return "other";
}

// ---------------------------------------------------------------------------
// Name derivation
// ---------------------------------------------------------------------------

function deriveName(id: string, specName: string): string {
  // Use the spec name if available and meaningful
  if (specName && specName !== id) return specName;
  // Otherwise use the ID
  return id;
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

  // Fetch model list from Venice AI API
  const response = await fetch("https://api.venice.ai/api/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch Venice models: ${response.status}`);
  }

  const data = (await response.json()) as { data: VeniceModel[] };
  const apiModels = data.data;

  for (const m of apiModels) {
    // Skip non-text models
    if (m.type !== "text") continue;

    // Skip offline models
    if (m.model_spec.offline) continue;

    const spec = m.model_spec;
    const caps = spec.capabilities;
    const pricing = spec.pricing;

    // Skip models with zero pricing
    if (pricing.input.usd === 0 && pricing.output.usd === 0) continue;

    const ctxLen = m.context_length;
    const maxOut = spec.maxCompletionTokens;

    // Build pricing object
    const tokenPricing: Pricing = {
      currency: "USD",
      input: pricing.input.usd,
      output: pricing.output.usd,
    };

    // Add cache_read if available and non-zero
    if (pricing.cache_input && pricing.cache_input.usd > 0) {
      tokenPricing.cache_read = pricing.cache_input.usd;
    }

    // Build modalities
    const inputModalities: ModelModality[] = ["text"];
    if (caps.supportsVision) inputModalities.push("image");

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: m.id,
      name: deriveName(m.id, spec.name),
      family: deriveFamily(m.id),
      temperature: true,
      limit: { context: ctxLen, output: maxOut },
      modalities: {
        input: inputModalities,
        output: ["text"],
      },
      pricing: tokenPricing,
      release_date: today,
      last_updated: today,
    };

    if (caps.supportsReasoning) modelDef.reasoning = true;
    if (caps.supportsFunctionCalling) modelDef.tool_call = true;
    if (caps.supportsResponseSchema) modelDef.structured_output = true;
    if (caps.supportsVision) modelDef.attachment = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  Venice: ${models.length} models`);

  return { provider, models };
}
