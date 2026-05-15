import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "inception",
  name: "Inception Labs",
  url: "https://inceptionlabs.ai",
  api_docs: "https://docs.inceptionlabs.ai",
  apis: {
    openai: "https://api.inceptionlabs.ai/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs & pricing: Inception Labs API
//   https://api.inceptionlabs.ai/v1/models
//   (context_length, max_output_length, pricing, modalities, features)
//
// Inception Labs produces the Mercury family of diffusion large language
// models (dLLMs). Unlike autoregressive LLMs, Mercury models use discrete
// diffusion to generate multiple tokens in parallel, achieving 5-10x speed
// improvement over comparable models.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from Inception Labs API
// All Mercury models share the same pricing: $0.25 input / $0.75 output
const HARDCODED_PRICING: Record<string, Pricing> = {
  mercury: { currency: "USD", input: 0.25, output: 0.75 },
  "mercury-2": { currency: "USD", input: 0.25, output: 0.75 },
  "mercury-coder": { currency: "USD", input: 0.25, output: 0.75 },
  "mercury-edit": { currency: "USD", input: 0.25, output: 0.75 },
  "mercury-edit-2": { currency: "USD", input: 0.25, output: 0.75 },
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

  // --- Mercury (original dLLM, 128K context, 32K output) ---

  models.push(
    defineModel({
      id: "mercury",
      name: "Mercury",
      family: "mercury",
      temperature: true,
      tool_call: true,
      structured_output: true,
      limit: { context: 128000, output: 32000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["mercury"] as Pricing,
      release_date: "2025-02-01",
      last_updated: today,
    }),
  );

  // --- Mercury 2 (reasoning dLLM, 128K context, 50K output) ---

  models.push(
    defineModel({
      id: "mercury-2",
      name: "Mercury 2",
      family: "mercury",
      temperature: true,
      reasoning: true,
      tool_call: true,
      structured_output: true,
      limit: { context: 128000, output: 50000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["mercury-2"] as Pricing,
      release_date: "2025-04-01",
      last_updated: today,
    }),
  );

  // --- Mercury Coder (code-optimized dLLM, 128K context, 32K output) ---

  models.push(
    defineModel({
      id: "mercury-coder",
      name: "Mercury Coder",
      family: "mercury",
      temperature: true,
      tool_call: true,
      structured_output: true,
      limit: { context: 128000, output: 32000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["mercury-coder"] as Pricing,
      release_date: "2025-02-01",
      last_updated: today,
    }),
  );

  // --- Mercury Edit (code editing dLLM, 128K context, 32K output) ---

  models.push(
    defineModel({
      id: "mercury-edit",
      name: "Mercury Edit",
      family: "mercury",
      temperature: true,
      limit: { context: 128000, output: 32000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["mercury-edit"] as Pricing,
      release_date: "2025-03-01",
      last_updated: today,
    }),
  );

  // --- Mercury Edit 2 (next-gen code editing dLLM, 128K context, 32K output) ---

  models.push(
    defineModel({
      id: "mercury-edit-2",
      name: "Mercury Edit 2",
      family: "mercury",
      temperature: true,
      limit: { context: 128000, output: 32000 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["mercury-edit-2"] as Pricing,
      release_date: "2025-05-01",
      last_updated: today,
    }),
  );

  console.log(`  Inception Labs: ${models.length} models`);

  return { provider, models };
}
