import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "writer",
  name: "Writer",
  url: "https://writer.com",
  api_docs: "https://dev.writer.com",
  apis: {
    openai: "https://api.writer.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model details: https://dev.writer.com/home/models/choose-a-model (CSR)
// - Pricing: https://dev.writer.com/home/pricing (CSR)
// - API: https://api.writer.com/v1/models (requires auth)
//
// Writer produces Palmyra LLMs — enterprise-focused models.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from dev.writer.com/home/pricing
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Active models
  "palmyra-x5": { currency: "USD", input: 0.6, output: 6 },
  "palmyra-x4": { currency: "USD", input: 2.5, output: 10 },

  // Deprecated models (deprecation date: 2026-07-13)
  "palmyra-x-003-instruct": { currency: "USD", input: 7.5, output: 22.5 },
  "palmyra-med": { currency: "USD", input: 5, output: 12 },
  "palmyra-fin": { currency: "USD", input: 5, output: 12 },
  "palmyra-creative": { currency: "USD", input: 5, output: 12 },
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

  // --- Active models ---
  models.push(
    defineModel({
      id: "palmyra-x5",
      name: "Palmyra X5",
      family: "palmyra",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 1000000, output: 16384 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["palmyra-x5"] as Pricing,
      release_date: "2025-11-01",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "palmyra-x4",
      name: "Palmyra X4",
      family: "palmyra",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 16384 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["palmyra-x4"] as Pricing,
      release_date: "2025-06-01",
      last_updated: today,
    }),
  );

  // --- Deprecated models (deprecation date: 2026-07-13) ---
  models.push(
    defineModel({
      id: "palmyra-x-003-instruct",
      name: "Palmyra X 003 Instruct",
      family: "palmyra",
      temperature: true,
      tool_call: true,
      deprecated: true,
      limit: { context: 8192, output: 8192 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["palmyra-x-003-instruct"] as Pricing,
      release_date: "2024-03-01",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "palmyra-med",
      name: "Palmyra Med",
      family: "palmyra",
      temperature: true,
      deprecated: true,
      limit: { context: 8192, output: 8192 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["palmyra-med"] as Pricing,
      release_date: "2024-06-01",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "palmyra-fin",
      name: "Palmyra Fin",
      family: "palmyra",
      temperature: true,
      deprecated: true,
      limit: { context: 8192, output: 8192 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["palmyra-fin"] as Pricing,
      release_date: "2024-06-01",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "palmyra-creative",
      name: "Palmyra Creative",
      family: "palmyra",
      temperature: true,
      deprecated: true,
      limit: { context: 8192, output: 8192 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["palmyra-creative"] as Pricing,
      release_date: "2024-06-01",
      last_updated: today,
    }),
  );

  console.log(`  Writer: ${models.length} models`);

  return { provider, models };
}
