import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "amazon",
  name: "Amazon Nova",
  url: "https://aws.amazon.com/bedrock",
  api_docs: "https://docs.aws.amazon.com/nova/latest/userguide/",
  apis: {
    openai: "https://bedrock.us-east-1.amazonaws.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs: https://docs.aws.amazon.com/nova/latest/userguide/what-is-nova.html (SSR)
// - Pricing: AWS Price List API https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/index.json
//
// Amazon Nova models, produced by Amazon via Amazon Bedrock.
// Pricing is in USD per 1M tokens.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from AWS Price List API
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Nova v1 understanding models
  "amazon-nova-premier": { currency: "USD", input: 2.5, output: 12.5 },
  "amazon-nova-pro": { currency: "USD", input: 0.8, output: 3.2 },
  "amazon-nova-lite": { currency: "USD", input: 0.06, output: 0.24 },
  "amazon-nova-micro": { currency: "USD", input: 0.035, output: 0.14 },
  // Nova 2.0 understanding models (text token pricing)
  "amazon-nova-2.0-pro": { currency: "USD", input: 0.625, output: 5.0 },
  "amazon-nova-2.0-lite": { currency: "USD", input: 0.15, output: 1.25 },
  // Nova 2.0 Omni (multimodal generation — text token pricing)
  "amazon-nova-2.0-omni": { currency: "USD", input: 0.2, output: 1.3 },
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

  // --- Nova v1 Understanding Models ---

  models.push(
    defineModel({
      id: "amazon-nova-premier",
      name: "Amazon Nova Premier",
      family: "nova",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 1000000, output: 10000 },
      modalities: { input: ["text", "image", "video"], output: ["text"] },
      pricing: HARDCODED_PRICING["amazon-nova-premier"] as Pricing,
      release_date: "2025-12-02",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "amazon-nova-pro",
      name: "Amazon Nova Pro",
      family: "nova",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 300000, output: 10000 },
      modalities: { input: ["text", "image", "video"], output: ["text"] },
      pricing: HARDCODED_PRICING["amazon-nova-pro"] as Pricing,
      release_date: "2024-12-03",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "amazon-nova-lite",
      name: "Amazon Nova Lite",
      family: "nova",
      temperature: true,
      tool_call: true,
      attachment: true,
      limit: { context: 300000, output: 10000 },
      modalities: { input: ["text", "image", "video"], output: ["text"] },
      pricing: HARDCODED_PRICING["amazon-nova-lite"] as Pricing,
      release_date: "2024-12-03",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "amazon-nova-micro",
      name: "Amazon Nova Micro",
      family: "nova",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 10000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["amazon-nova-micro"] as Pricing,
      release_date: "2024-12-03",
      last_updated: today,
    }),
  );

  // --- Nova 2.0 Understanding Models ---

  models.push(
    defineModel({
      id: "amazon-nova-2.0-pro",
      name: "Amazon Nova 2.0 Pro",
      family: "nova",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      limit: { context: 64000, output: 64000 },
      modalities: { input: ["text", "image", "audio", "video"], output: ["text"] },
      pricing: HARDCODED_PRICING["amazon-nova-2.0-pro"] as Pricing,
      release_date: "2025-12-02",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "amazon-nova-2.0-lite",
      name: "Amazon Nova 2.0 Lite",
      family: "nova",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      limit: { context: 64000, output: 64000 },
      modalities: { input: ["text", "image", "audio", "video"], output: ["text"] },
      pricing: HARDCODED_PRICING["amazon-nova-2.0-lite"] as Pricing,
      release_date: "2025-12-02",
      last_updated: today,
    }),
  );

  // --- Nova 2.0 Omni (Multimodal Generation) ---

  models.push(
    defineModel({
      id: "amazon-nova-2.0-omni",
      name: "Amazon Nova 2.0 Omni",
      family: "nova",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      limit: { context: 64000, output: 64000 },
      modalities: {
        input: ["text", "image", "audio", "video"],
        output: ["text", "image"],
      },
      pricing: HARDCODED_PRICING["amazon-nova-2.0-omni"] as Pricing,
      release_date: "2025-12-02",
      last_updated: today,
    }),
  );

  console.log(`  Amazon Nova: ${models.length} models`);

  return { provider, models };
}
