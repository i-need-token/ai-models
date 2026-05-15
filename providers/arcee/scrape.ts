import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "arcee",
  name: "Arcee AI",
  url: "https://arcee.ai",
  api_docs: "https://docs.arcee.ai",
  apis: {
    openai: "https://api.arcee.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs & pricing: OpenRouter API https://openrouter.ai/api/v1/models
//   (arcee-ai/* models — context windows, max output, modalities, USD pricing)
// - Model descriptions: OpenRouter model descriptions
//
// Arcee AI produces fine-tuned and original model families including
// Trinity (MoE), Virtuoso, Maestro, Spotlight, and Coder.
// The arcee.ai website and API are unreachable from this network.
// Data sourced from OpenRouter which mirrors Arcee's specifications.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from OpenRouter
const HARDCODED_PRICING: Record<string, Pricing> = {
  "trinity-large-preview": { currency: "USD", input: 0.15, output: 0.45 },
  "trinity-large-thinking": { currency: "USD", input: 0.22, output: 0.85 },
  "trinity-mini": { currency: "USD", input: 0.04, output: 0.15 },
  "virtuoso-large": { currency: "USD", input: 0.75, output: 1.2 },
  "maestro-reasoning": { currency: "USD", input: 0.9, output: 3.3 },
  spotlight: { currency: "USD", input: 0.18, output: 0.18 },
  "coder-large": { currency: "USD", input: 0.5, output: 0.8 },
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

  // --- Trinity Large Preview (400B MoE, 13B active, open-weight) ---

  models.push(
    defineModel({
      id: "trinity-large-preview",
      name: "Trinity Large Preview",
      family: "trinity",
      temperature: true,
      tool_call: true,
      open_weights: true,
      limit: { context: 131000, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["trinity-large-preview"] as Pricing,
      release_date: "2025-05-01",
      last_updated: today,
    }),
  );

  // --- Trinity Large Thinking (reasoning variant, 400B MoE) ---

  models.push(
    defineModel({
      id: "trinity-large-thinking",
      name: "Trinity Large Thinking",
      family: "trinity",
      temperature: true,
      reasoning: true,
      tool_call: true,
      open_weights: true,
      limit: { context: 262144, output: 262144 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["trinity-large-thinking"] as Pricing,
      release_date: "2025-05-01",
      last_updated: today,
    }),
  );

  // --- Trinity Mini (26B MoE, 3B active, efficient) ---

  models.push(
    defineModel({
      id: "trinity-mini",
      name: "Trinity Mini",
      family: "trinity",
      temperature: true,
      tool_call: true,
      open_weights: true,
      limit: { context: 131072, output: 131072 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["trinity-mini"] as Pricing,
      release_date: "2025-05-01",
      last_updated: today,
    }),
  );

  // --- Virtuoso Large (72B, general-purpose) ---

  models.push(
    defineModel({
      id: "virtuoso-large",
      name: "Virtuoso Large",
      family: "virtuoso",
      temperature: true,
      tool_call: true,
      limit: { context: 131072, output: 64000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["virtuoso-large"] as Pricing,
      release_date: "2025-04-01",
      last_updated: today,
    }),
  );

  // --- Maestro Reasoning (32B, step-by-step analysis) ---

  models.push(
    defineModel({
      id: "maestro-reasoning",
      name: "Maestro Reasoning",
      family: "maestro",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 131072, output: 32000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["maestro-reasoning"] as Pricing,
      release_date: "2025-04-01",
      last_updated: today,
    }),
  );

  // --- Spotlight (7B, vision-language) ---

  models.push(
    defineModel({
      id: "spotlight",
      name: "Spotlight",
      family: "spotlight",
      temperature: true,
      attachment: true,
      limit: { context: 131072, output: 65536 },
      modalities: {
        input: ["text", "image"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["spotlight"] as Pricing,
      release_date: "2025-04-01",
      last_updated: today,
    }),
  );

  // --- Coder Large (32B, code generation) ---

  models.push(
    defineModel({
      id: "coder-large",
      name: "Coder Large",
      family: "arcee-coder",
      temperature: true,
      tool_call: true,
      limit: { context: 32768, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["coder-large"] as Pricing,
      release_date: "2025-02-01",
      last_updated: today,
    }),
  );

  console.log(`  Arcee AI: ${models.length} models`);

  return { provider, models };
}
