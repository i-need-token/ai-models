import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "dinference",
  name: "DInference",
  url: "https://dinference.com",
  api_docs: "https://dinference.com/docs",
  apis: {
    openai: "https://api.dinference.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: https://dinference.com/pricing (browser-scraped)
// - Model details: https://dinference.com/models (browser-scraped)
// - API docs: https://dinference.com/docs
//
// DInference is a US-hosted inference platform providing OpenAI-compatible
// API endpoints for open-source and Chinese LLMs.
// ---------------------------------------------------------------------------

// Pricing (USD per million tokens) — from dinference.com/pricing
const HARDCODED_PRICING: Record<string, Pricing> = {
  "gpt-oss-20b": { currency: "USD", input: 0.07, output: 0.25 },
  "gpt-oss-120b": { currency: "USD", input: 0.09, output: 0.36 },
  "minimax-m2.5": { currency: "USD", input: 0.22, output: 0.88 },
  "glm-4.7": { currency: "USD", input: 0.45, output: 1.65 },
  "glm-5": { currency: "USD", input: 0.75, output: 2.4 },
  "glm-5.1": { currency: "USD", input: 1.25, output: 3.89 },
};

// ---------------------------------------------------------------------------
// Date helper
// ---------------------------------------------------------------------------

function getCurrentDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}` as string;
}

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const today = getCurrentDate();
  const models: Model[] = [];

  // GPT-OSS-20B — 20B params, 131K context / 33K output
  models.push(
    defineModel({
      id: "gpt-oss-20b",
      name: "GPT-OSS 20B",
      family: "gpt-oss",
      open_weights: true,
      limit: { context: 131072, output: 33000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["gpt-oss-20b"] as Pricing,
      release_date: "2025-08-26",
      last_updated: today,
    }),
  );

  // GPT-OSS-120B — 120B params, 131K context / 33K output, reasoning
  models.push(
    defineModel({
      id: "gpt-oss-120b",
      name: "GPT-OSS 120B",
      family: "gpt-oss",
      reasoning: true,
      open_weights: true,
      limit: { context: 131072, output: 33000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["gpt-oss-120b"] as Pricing,
      release_date: "2025-08-26",
      last_updated: today,
    }),
  );

  // MiniMax-M2.5 — 229B params, 204800 context / 16384 output
  models.push(
    defineModel({
      id: "minimax-m2.5",
      name: "MiniMax M2.5",
      family: "minimax-m2.5",
      temperature: true,
      limit: { context: 204800, output: 16384 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["minimax-m2.5"] as Pricing,
      release_date: "2026-03-10",
      last_updated: today,
    }),
  );

  // GLM-4.7 — 200K context / 128K output, tool_call
  models.push(
    defineModel({
      id: "glm-4.7",
      name: "GLM-4.7",
      family: "glm-4",
      tool_call: true,
      limit: { context: 200000, output: 128000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["glm-4.7"] as Pricing,
      release_date: "2026-04-01",
      last_updated: today,
    }),
  );

  // GLM-5 — 200K context / 128K output, tool_call, caching
  models.push(
    defineModel({
      id: "glm-5",
      name: "GLM-5",
      family: "glm-5",
      tool_call: true,
      limit: { context: 200000, output: 128000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["glm-5"] as Pricing,
      release_date: "2026-05-01",
      last_updated: today,
    }),
  );

  // GLM-5.1 — 200K context / 128K output, tool_call, reasoning, caching
  models.push(
    defineModel({
      id: "glm-5.1",
      name: "GLM-5.1",
      family: "glm-5",
      reasoning: true,
      tool_call: true,
      structured_output: true,
      limit: { context: 200000, output: 128000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["glm-5.1"] as Pricing,
      release_date: "2026-05-01",
      last_updated: today,
    }),
  );

  console.log(`  DInference: ${models.length} models`);

  return { provider, models };
}
