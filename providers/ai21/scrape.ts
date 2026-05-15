import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "ai21",
  name: "AI21 Labs",
  url: "https://www.ai21.com",
  api_docs: "https://docs.ai21.com",
  apis: {
    openai: "https://api.ai21.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model details: https://docs.ai21.com/docs/jamba-foundation-models.md
// - Pricing: https://www.ai21.com/pricing/ (browser-verified)
// - API: https://api.ai21.com/studio/v1/models
//
// AI21 produces the Jamba family of open-weight models built on the
// Mamba-Transformer hybrid architecture.
// ---------------------------------------------------------------------------

// Pricing (USD per million tokens) — from ai21.com/pricing
const HARDCODED_PRICING: Record<string, Pricing> = {
  "jamba-large": { currency: "USD", input: 2, output: 8 },
  "jamba-mini": { currency: "USD", input: 0.2, output: 0.4 },
  "jamba-3b": { unit: "free" },
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

  // Jamba Large — 398B (94B active), 256K context
  models.push(
    defineModel({
      id: "jamba-large",
      name: "Jamba Large",
      family: "jamba-large",
      temperature: true,
      tool_call: true,
      structured_output: true,
      open_weights: true,
      limit: { context: 256000, output: 256000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["jamba-large"] as Pricing,
      knowledge: "2024-08-22",
      release_date: "2025-07-01",
      last_updated: today,
      snapshots: [
        {
          id: "jamba-large-1.7-2025-07",
        },
      ],
    }),
  );

  // Jamba Mini — 52B (12B active), 256K context
  models.push(
    defineModel({
      id: "jamba-mini",
      name: "Jamba Mini",
      family: "jamba-mini",
      temperature: true,
      tool_call: true,
      structured_output: true,
      open_weights: true,
      limit: { context: 256000, output: 256000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["jamba-mini"] as Pricing,
      knowledge: "2024-08-22",
      release_date: "2026-01-01",
      last_updated: today,
      snapshots: [
        {
          id: "jamba-mini-2-2026-01",
        },
      ],
    }),
  );

  // Jamba 3B — 3B, 256K context (no API endpoint, self-hosted only)
  models.push(
    defineModel({
      id: "jamba-3b",
      name: "Jamba 3B",
      family: "jamba-3b",
      temperature: true,
      open_weights: true,
      limit: { context: 256000, output: 256000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["jamba-3b"] as Pricing,
      knowledge: "2024-08-22",
      release_date: "2026-01-01",
      last_updated: today,
    }),
  );

  // Deprecated models
  models.push(
    defineModel({
      id: "jamba-mini-1.7",
      name: "Jamba Mini 1.7",
      family: "jamba-mini",
      temperature: true,
      deprecated: true,
      open_weights: true,
      limit: { context: 256000, output: 256000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: { currency: "USD", input: 0.2, output: 0.4 },
      release_date: "2025-07-01",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "jamba-large-1.6",
      name: "Jamba Large 1.6",
      family: "jamba-large",
      temperature: true,
      deprecated: true,
      open_weights: true,
      limit: { context: 256000, output: 256000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: { currency: "USD", input: 2, output: 8 },
      release_date: "2025-03-01",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "jamba-mini-1.6",
      name: "Jamba Mini 1.6",
      family: "jamba-mini",
      temperature: true,
      deprecated: true,
      open_weights: true,
      limit: { context: 256000, output: 256000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: { currency: "USD", input: 0.2, output: 0.4 },
      release_date: "2025-03-01",
      last_updated: today,
    }),
  );

  console.log(`  AI21 Labs: ${models.length} models`);

  return { provider, models };
}
