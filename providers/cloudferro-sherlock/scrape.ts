import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "cloudferro-sherlock",
  name: "CloudFerro Sherlock",
  url: "https://sherlock.cloudferro.com",
  api_docs: "https://docs.sherlock.cloudferro.com",
  apis: {
    openai: "https://api.sherlock.cloudferro.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from Sherlock website JS bundle + catalog lookup)
//
// Sources:
// - Pricing: extracted from sherlock.cloudferro.com JS bundle (EUR per 1M tokens)
// - Context lengths: looked up from existing provider YAML files in catalog
// - Capabilities: inferred from model names and original provider data
//
// CloudFerro Sherlock is a fully managed Generative AI service by CloudFerro
// with OpenAI-compatible endpoints. Pricing is in EUR per 1M tokens.
// Only active LLM models are included (embeddings and comingSoon excluded).
// Retiring models are included with deprecated: true.
// ---------------------------------------------------------------------------

const MODELS: Record<
  string,
  {
    name: string;
    family: string;
    context: number;
    output: number;
    input: number;
    outputPrice: number;
    deprecated?: boolean;
    reasoning?: boolean;
    tool_call?: boolean;
    structured_output?: boolean;
    vision?: boolean;
  }
> = {
  "bielik-11b-v3.0-instruct": {
    name: "Bielik 11B v3.0 Instruct",
    family: "bielik",
    context: 32768,
    output: 4096,
    input: 0.56,
    outputPrice: 0.56,
  },
  "gpt-oss-120b": {
    name: "GPT-OSS 120B",
    family: "gpt-oss",
    context: 131072,
    output: 32768,
    input: 2.44,
    outputPrice: 2.44,
    tool_call: true,
    structured_output: true,
  },
  "villanova-2b-2512-preview-apnea-ft": {
    name: "Villanova 2B 2512 Preview Apnea FT",
    family: "villanova",
    context: 8192,
    output: 4096,
    input: 0.33,
    outputPrice: 0.33,
  },
  "minimax-m2.5": {
    name: "MiniMax M2.5",
    family: "minimax",
    context: 1000000,
    output: 65536,
    input: 0.26,
    outputPrice: 1.04,
    tool_call: true,
    structured_output: true,
  },
  "llama-3.3-70b-instruct": {
    name: "Llama 3.3 70B Instruct",
    family: "llama",
    context: 131072,
    output: 65536,
    input: 2.44,
    outputPrice: 2.44,
    tool_call: true,
  },
  "llama-3.1-8b-instruct": {
    name: "Llama 3.1 8B Instruct",
    family: "llama",
    context: 131072,
    output: 4096,
    input: 0.33,
    outputPrice: 0.33,
    tool_call: true,
  },
  "pllum-12b-instruct": {
    name: "PLLuM 12B Instruct",
    family: "pllum",
    context: 32768,
    output: 4096,
    input: 0.56,
    outputPrice: 0.56,
  },
  "deepseek-r1-distill-llama-70b": {
    name: "DeepSeek R1 Distill Llama 70B",
    family: "deepseek",
    context: 131072,
    output: 65536,
    input: 2.44,
    outputPrice: 2.44,
    reasoning: true,
  },
  // Retiring models
  "bielik-11b-v2.6-instruct": {
    name: "Bielik 11B v2.6 Instruct",
    family: "bielik",
    context: 32768,
    output: 4096,
    input: 0.56,
    outputPrice: 0.56,
    deprecated: true,
  },
  "bielik-10b-v2.3-instruct": {
    name: "Bielik 10B v2.3 Instruct",
    family: "bielik",
    context: 8192,
    output: 4096,
    input: 0.33,
    outputPrice: 0.33,
    deprecated: true,
  },
  "mistral-small-24b-instruct-2501": {
    name: "Mistral Small 24B Instruct 2501",
    family: "mistral",
    context: 32768,
    output: 4096,
    input: 1.26,
    outputPrice: 1.26,
    deprecated: true,
    tool_call: true,
  },
  "pixtral-12b-2409": {
    name: "Pixtral 12B 2409",
    family: "pixtral",
    context: 131072,
    output: 4096,
    input: 0.33,
    outputPrice: 0.33,
    deprecated: true,
    vision: true,
  },
};

export async function scrape(): Promise<ScrapeResult> {
  const today = new Date().toISOString().split("T")[0] as string;
  const models: Model[] = [];

  for (const [id, data] of Object.entries(MODELS)) {
    const inputModalities: ("text" | "image")[] = data.vision ? ["text", "image"] : ["text"];

    const pricing: Pricing = {
      currency: "EUR",
      input: data.input,
      output: data.outputPrice,
    };

    const modelData: Model = {
      id,
      name: data.name,
      family: data.family,
      temperature: true,
      limit: { context: data.context, output: data.output },
      modalities: { input: inputModalities, output: ["text"] as ("text" | "image")[] },
      pricing,
      release_date: "2025-06-01",
      last_updated: today,
    };

    if (data.deprecated) modelData.deprecated = true;
    if (data.reasoning) modelData.reasoning = true;
    if (data.tool_call) modelData.tool_call = true;
    if (data.structured_output) modelData.structured_output = true;

    models.push(defineModel(modelData));
  }

  console.log(`  CloudFerro Sherlock: ${models.length} models`);

  return { provider, models };
}
