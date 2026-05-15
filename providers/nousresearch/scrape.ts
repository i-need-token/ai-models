import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "nousresearch",
  name: "Nous Research",
  url: "https://nousresearch.com",
  api_docs: "https://docs.nousresearch.com",
  apis: {
    openai: "https://api.nousresearch.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs & pricing: OpenRouter API https://openrouter.ai/api/v1/models
//   (nousresearch/* models — context windows, max output, modalities, USD pricing)
// - Model descriptions: OpenRouter model descriptions
//
// Nous Research produces the Hermes family of fine-tuned open-weight models,
// built on Llama and Mixtral base models with DPO/RLHF alignment.
// The nousresearch.com website is reachable but does not expose a public API.
// Data sourced from OpenRouter which mirrors Nous Research's specifications.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from OpenRouter
const HARDCODED_PRICING: Record<string, Pricing> = {
  "hermes-4-llama-3.1-405b": { currency: "USD", input: 3.0, output: 15.0 },
  "hermes-4-llama-3.1-70b": { currency: "USD", input: 0.6, output: 2.4 },
  "hermes-4-llama-3.1-8b": { currency: "USD", input: 0.06, output: 0.12 },
  "hermes-3-llama-3.1-405b": { currency: "USD", input: 3.0, output: 15.0 },
  "hermes-3-llama-3.1-70b": { currency: "USD", input: 0.6, output: 2.4 },
  "hermes-3-llama-3.1-8b": { currency: "USD", input: 0.06, output: 0.12 },
  "nous-hermes-2-mixtral-8x7b-dpo": { currency: "USD", input: 0.3, output: 1.1 },
};

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

  // --- Hermes 4 Llama 3.1 405B (flagship, reasoning + tool use) ---

  models.push(
    defineModel({
      id: "hermes-4-llama-3.1-405b",
      name: "Hermes 4 Llama 3.1 405B",
      family: "hermes",
      temperature: true,
      reasoning: true,
      tool_call: true,
      structured_output: true,
      open_weights: true,
      limit: { context: 131072, output: 32000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["hermes-4-llama-3.1-405b"] as Pricing,
      release_date: "2025-04-01",
      last_updated: today,
    }),
  );

  // --- Hermes 4 Llama 3.1 70B (balanced performance) ---

  models.push(
    defineModel({
      id: "hermes-4-llama-3.1-70b",
      name: "Hermes 4 Llama 3.1 70B",
      family: "hermes",
      temperature: true,
      reasoning: true,
      tool_call: true,
      structured_output: true,
      open_weights: true,
      limit: { context: 131072, output: 32000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["hermes-4-llama-3.1-70b"] as Pricing,
      release_date: "2025-04-01",
      last_updated: today,
    }),
  );

  // --- Hermes 4 Llama 3.1 8B (lightweight, fast) ---

  models.push(
    defineModel({
      id: "hermes-4-llama-3.1-8b",
      name: "Hermes 4 Llama 3.1 8B",
      family: "hermes",
      temperature: true,
      reasoning: true,
      tool_call: true,
      structured_output: true,
      open_weights: true,
      limit: { context: 131072, output: 32000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["hermes-4-llama-3.1-8b"] as Pricing,
      release_date: "2025-04-01",
      last_updated: today,
    }),
  );

  // --- Hermes 3 Llama 3.1 405B (previous generation flagship) ---

  models.push(
    defineModel({
      id: "hermes-3-llama-3.1-405b",
      name: "Hermes 3 Llama 3.1 405B",
      family: "hermes",
      temperature: true,
      tool_call: true,
      structured_output: true,
      open_weights: true,
      deprecated: true,
      limit: { context: 131072, output: 32000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["hermes-3-llama-3.1-405b"] as Pricing,
      release_date: "2024-08-01",
      last_updated: today,
    }),
  );

  // --- Hermes 3 Llama 3.1 70B (previous generation) ---

  models.push(
    defineModel({
      id: "hermes-3-llama-3.1-70b",
      name: "Hermes 3 Llama 3.1 70B",
      family: "hermes",
      temperature: true,
      tool_call: true,
      structured_output: true,
      open_weights: true,
      deprecated: true,
      limit: { context: 131072, output: 32000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["hermes-3-llama-3.1-70b"] as Pricing,
      release_date: "2024-08-01",
      last_updated: today,
    }),
  );

  // --- Hermes 3 Llama 3.1 8B (previous generation lightweight) ---

  models.push(
    defineModel({
      id: "hermes-3-llama-3.1-8b",
      name: "Hermes 3 Llama 3.1 8B",
      family: "hermes",
      temperature: true,
      tool_call: true,
      structured_output: true,
      open_weights: true,
      deprecated: true,
      limit: { context: 131072, output: 32000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["hermes-3-llama-3.1-8b"] as Pricing,
      release_date: "2024-08-01",
      last_updated: today,
    }),
  );

  // --- Nous Hermes 2 Mixtral 8x7B DPO (legacy MoE) ---

  models.push(
    defineModel({
      id: "nous-hermes-2-mixtral-8x7b-dpo",
      name: "Nous Hermes 2 Mixtral 8x7B DPO",
      family: "hermes",
      temperature: true,
      tool_call: true,
      open_weights: true,
      deprecated: true,
      limit: { context: 32768, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["nous-hermes-2-mixtral-8x7b-dpo"] as Pricing,
      release_date: "2024-01-01",
      last_updated: today,
    }),
  );

  console.log(`  Nous Research: ${models.length} models`);

  return { provider, models };
}
