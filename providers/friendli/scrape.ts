import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "friendli",
  name: "FriendliAI",
  url: "https://friendli.ai",
  api_docs: "https://docs.friendli.ai",
  apis: {
    openai: "https://api.friendli.ai/serverless/v1",
  },
});

// ---------------------------------------------------------------------------
// Dynamic scrape from FriendliAI Serverless API
//
// Source: https://api.friendli.ai/serverless/v1/models (no auth required)
//
// FriendliAI is an inference platform hosting models from other providers
// (Meta, Qwen/Alibaba, Zhipu AI, MiniMax, DeepSeek, LG AI EXAONE)
// with per-token USD pricing.
//
// Pricing: input/output fields = USD per million tokens
// Model IDs: API returns "provider/model" format; "/" is flattened to "--"
// ---------------------------------------------------------------------------

interface FriendliModel {
  id: string;
  name: string;
  max_completion_tokens: number;
  context_length: number;
  functionality: {
    tool_call: boolean;
    builtin_tool: boolean;
    parallel_tool_call: boolean;
    structured_output: boolean;
  };
  pricing: {
    input: number;
    output: number;
    prompt: number;
    completion: number;
    response_time: number;
    unit_type: string;
    input_cache_read?: number;
  };
  hugging_face_url: string;
  description: string;
  license: string;
  policy: string;
  created: number;
}

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  const lower = id.toLowerCase();
  if (lower.includes("deepseek")) return "deepseek";
  if (lower.includes("qwen3")) return "qwen3";
  if (lower.includes("qwen")) return "qwen";
  if (lower.includes("llama-4")) return "llama-4";
  if (lower.includes("llama-3")) return "llama-3";
  if (lower.includes("glm")) return "glm";
  if (lower.includes("minimax")) return "minimax";
  if (lower.includes("exaone")) return "exaone";
  return "other";
}

// ---------------------------------------------------------------------------
// Date helper
// ---------------------------------------------------------------------------

function getCurrentDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function timestampToDate(ts: number): string {
  const d = new Date(ts * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const today = getCurrentDate();
  const models: Model[] = [];

  const response = await fetch("https://api.friendli.ai/serverless/v1/models");
  if (!response.ok) {
    throw new Error(`Failed to fetch FriendliAI models: ${response.status}`);
  }

  const data = (await response.json()) as { data: FriendliModel[] };
  const apiModels = data.data;

  for (const m of apiModels) {
    // Flatten "/" to "--" in model ID
    const flatId = m.id.replace(/\//g, "--");

    const pricing: Pricing = {
      currency: "USD",
      input: m.pricing.input,
      output: m.pricing.output,
    };

    // Add cache_read pricing if available
    if (m.pricing.input_cache_read !== undefined && m.pricing.input_cache_read > 0) {
      (pricing as { cache_read?: number }).cache_read =
        Math.round(m.pricing.input_cache_read * 1e6) / 1e6;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id: flatId,
      name: m.name.split("/").pop() || m.name,
      family: deriveFamily(flatId),
      temperature: true,
      limit: { context: m.context_length, output: m.max_completion_tokens },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing,
      release_date: m.created > 0 ? timestampToDate(m.created) : today,
      last_updated: today,
    };

    const func = m.functionality;
    if (func.tool_call) modelDef.tool_call = true;
    if (func.structured_output) modelDef.structured_output = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  FriendliAI: ${models.length} models`);

  return { provider, models };
}
