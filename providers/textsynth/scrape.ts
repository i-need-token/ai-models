import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "textsynth",
  name: "TextSynth",
  url: "https://textsynth.com",
  api_docs: "https://textsynth.com/documentation.html",
  apis: {
    openai: "https://api.textsynth.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Source: https://textsynth.com/pricing.html (static HTML)
// TextSynth is a European inference platform hosting open-source models with
// per-token USD pricing. Separate input and output token rates are provided.
//
// The pricing page lists 7 LLM models. MADLAD400 7B is a translation model
// and is excluded. 6 chat/completion models remain.
//
// Note: TextSynth uses its own API format (not OpenAI-compatible).
// API: POST https://api.textsynth.com/v1/engines/{engine_id}/completions
// ---------------------------------------------------------------------------

interface ModelInfo {
  name: string;
  engineId: string;
  context: number;
  output: number;
  openWeights?: boolean;
}

const MODELS: Record<string, ModelInfo> = {
  "EleutherAI--gpt-j-6B": {
    name: "GPT-J 6B",
    engineId: "gptj_6B",
    context: 2048,
    output: 2048,
    openWeights: true,
  },
  "mistralai--Mistral-7B": {
    name: "Mistral 7B",
    engineId: "mistral_7B",
    context: 8192,
    output: 8192,
    openWeights: true,
  },
  "meta-llama--Llama3-8B": {
    name: "Llama3 8B",
    engineId: "llama3_8B",
    context: 8192,
    output: 8192,
    openWeights: true,
  },
  "meta-llama--Llama3.1-8B-Instruct": {
    name: "Llama3.1 8B Instruct",
    engineId: "llama3.1_8B_instruct",
    context: 131072,
    output: 131072,
    openWeights: true,
  },
  "google--Gemma-3-27B-Instruct": {
    name: "Gemma 3 27B Instruct",
    engineId: "gemma3_27B_it",
    context: 8192,
    output: 8192,
    openWeights: true,
  },
  "meta-llama--Llama3.3-70B-Instruct": {
    name: "Llama3.3 70B Instruct",
    engineId: "llama3.3_70B_instruct",
    context: 131072,
    output: 131072,
    openWeights: true,
  },
};

// ---------------------------------------------------------------------------
// Pricing (USD per million tokens)
//
// Source: https://textsynth.com/pricing.html (static HTML, accessed 2026-05-16)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  "EleutherAI--gpt-j-6B": { currency: "USD", input: 0.2, output: 2.0 },
  "mistralai--Mistral-7B": { currency: "USD", input: 0.2, output: 2.0 },
  "meta-llama--Llama3-8B": { currency: "USD", input: 0.2, output: 2.0 },
  "meta-llama--Llama3.1-8B-Instruct": { currency: "USD", input: 0.2, output: 2.0 },
  "google--Gemma-3-27B-Instruct": { currency: "USD", input: 0.4, output: 4.0 },
  "meta-llama--Llama3.3-70B-Instruct": { currency: "USD", input: 0.7, output: 7.0 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.includes("gpt-j")) return "gpt-j";
  if (id.includes("mistral")) return "mistral";
  if (id.includes("llama3.3")) return "llama-3.3";
  if (id.includes("llama3.1")) return "llama-3.1";
  if (id.includes("llama3")) return "llama-3";
  if (id.includes("gemma")) return "gemma";
  return id.split("--")[0] as string;
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

  for (const [id, info] of Object.entries(MODELS)) {
    const pricing = HARDCODED_PRICING[id];
    if (!pricing) {
      console.warn(`  TextSynth: skipping ${id} — no pricing`);
      continue;
    }

    const modelDef: Parameters<typeof defineModel>[0] = {
      id,
      name: info.name,
      family: deriveFamily(id),
      limit: { context: info.context, output: info.output },
      modalities: { input: ["text"], output: ["text"] },
      pricing,
      release_date: today,
      last_updated: today,
    };

    if (info.openWeights) modelDef.open_weights = true;

    models.push(defineModel(modelDef));
  }

  console.log(`  TextSynth: ${models.length} models`);

  return { provider, models };
}
