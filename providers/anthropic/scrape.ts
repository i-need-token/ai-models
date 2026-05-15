import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "anthropic",
  name: "Anthropic",
  url: "https://www.anthropic.com",
  api_docs: "https://docs.anthropic.com",
  apis: {
    anthropic: "https://api.anthropic.com",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Pricing: Anthropic API documentation (Pricing page)
//   https://platform.claude.com/docs/en/about-claude/pricing
//   (accessed via browser automation — CSR page geo-blocked from CLI)
// - Model specs: Anthropic API documentation (Models overview page)
//   https://platform.claude.com/docs/en/about-claude/models/overview
//   (accessed via browser automation)
// - Context/output limits for non-latest models: OpenRouter API
//   https://openrouter.ai/api/v1/models (anthropic/* models)
//
// Anthropic docs are CSR (client-side rendered) and geo-blocked from CLI fetch.
// Data was extracted using browser automation (agent-browser).
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from Anthropic Pricing page
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Opus family — latest generation ($5/$25)
  "claude-opus-4-7": { currency: "USD", input: 5, output: 25 },
  "claude-opus-4-6": { currency: "USD", input: 5, output: 25 },
  "claude-opus-4-5": { currency: "USD", input: 5, output: 25 },
  // Opus family — legacy generation ($15/$75)
  "claude-opus-4-1": { currency: "USD", input: 15, output: 75 },
  "claude-opus-4-0": { currency: "USD", input: 15, output: 75 },
  // Opus fast variants ($30/$150)
  "claude-opus-4-6-fast": { currency: "USD", input: 30, output: 150 },
  "claude-opus-4-7-fast": { currency: "USD", input: 30, output: 150 },
  // Sonnet family ($3/$15)
  "claude-sonnet-4-6": { currency: "USD", input: 3, output: 15 },
  "claude-sonnet-4-5": { currency: "USD", input: 3, output: 15 },
  "claude-sonnet-4-0": { currency: "USD", input: 3, output: 15 },
  // Haiku family ($1/$5)
  "claude-haiku-4-5": { currency: "USD", input: 1, output: 5 },
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

  // --- Claude Opus 4.7 (latest flagship, 1M context) ---
  // Extended thinking: No, Adaptive thinking: Yes

  models.push(
    defineModel({
      id: "claude-opus-4-7",
      name: "Claude Opus 4.7",
      family: "claude-opus",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      structured_output: true,
      open_weights: false,
      limit: { context: 1000000, output: 128000 },
      modalities: {
        input: ["text", "image", "pdf"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["claude-opus-4-7"] as Pricing,
      knowledge: "2026-01",
      release_date: "2026-05-01",
      last_updated: today,
    }),
  );

  // --- Claude Opus 4.6 (1M context, extended + adaptive thinking) ---

  models.push(
    defineModel({
      id: "claude-opus-4-6",
      name: "Claude Opus 4.6",
      family: "claude-opus",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      structured_output: true,
      open_weights: false,
      limit: { context: 1000000, output: 128000 },
      modalities: {
        input: ["text", "image", "pdf"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["claude-opus-4-6"] as Pricing,
      knowledge: "2025-08",
      release_date: "2026-03-01",
      last_updated: today,
    }),
  );

  // --- Claude Opus 4.5 (200K context, extended + adaptive thinking) ---

  models.push(
    defineModel({
      id: "claude-opus-4-5",
      name: "Claude Opus 4.5",
      family: "claude-opus",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      structured_output: true,
      open_weights: false,
      limit: { context: 200000, output: 64000 },
      modalities: {
        input: ["text", "image", "pdf"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["claude-opus-4-5"] as Pricing,
      knowledge: "2025-01",
      release_date: "2025-02-01",
      last_updated: today,
    }),
  );

  // --- Claude Opus 4.1 (200K context, extended + adaptive thinking) ---

  models.push(
    defineModel({
      id: "claude-opus-4-1",
      name: "Claude Opus 4.1",
      family: "claude-opus",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      structured_output: true,
      open_weights: false,
      limit: { context: 200000, output: 32000 },
      modalities: {
        input: ["text", "image", "pdf"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["claude-opus-4-1"] as Pricing,
      knowledge: "2025-03",
      release_date: "2025-04-01",
      last_updated: today,
    }),
  );

  // --- Claude Opus 4 (deprecated, 200K context) ---

  models.push(
    defineModel({
      id: "claude-opus-4-0",
      name: "Claude Opus 4",
      family: "claude-opus",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      structured_output: true,
      open_weights: false,
      deprecated: true,
      limit: { context: 200000, output: 32000 },
      modalities: {
        input: ["text", "image", "pdf"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["claude-opus-4-0"] as Pricing,
      knowledge: "2025-03",
      release_date: "2025-03-01",
      last_updated: today,
    }),
  );

  // --- Claude Opus 4.6 Fast (1M context, fast mode) ---

  models.push(
    defineModel({
      id: "claude-opus-4-6-fast",
      name: "Claude Opus 4.6 Fast",
      family: "claude-opus",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      structured_output: true,
      open_weights: false,
      limit: { context: 1000000, output: 128000 },
      modalities: {
        input: ["text", "image", "pdf"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["claude-opus-4-6-fast"] as Pricing,
      knowledge: "2025-08",
      release_date: "2026-03-01",
      last_updated: today,
    }),
  );

  // --- Claude Opus 4.7 Fast (1M context, fast mode) ---

  models.push(
    defineModel({
      id: "claude-opus-4-7-fast",
      name: "Claude Opus 4.7 Fast",
      family: "claude-opus",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      structured_output: true,
      open_weights: false,
      limit: { context: 1000000, output: 128000 },
      modalities: {
        input: ["text", "image", "pdf"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["claude-opus-4-7-fast"] as Pricing,
      knowledge: "2026-01",
      release_date: "2026-05-01",
      last_updated: today,
    }),
  );

  // --- Claude Sonnet 4.6 (1M context, extended + adaptive thinking) ---

  models.push(
    defineModel({
      id: "claude-sonnet-4-6",
      name: "Claude Sonnet 4.6",
      family: "claude-sonnet",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      structured_output: true,
      open_weights: false,
      limit: { context: 1000000, output: 128000 },
      modalities: {
        input: ["text", "image", "pdf"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["claude-sonnet-4-6"] as Pricing,
      knowledge: "2025-08",
      release_date: "2026-03-01",
      last_updated: today,
    }),
  );

  // --- Claude Sonnet 4.5 (1M context, extended + adaptive thinking) ---

  models.push(
    defineModel({
      id: "claude-sonnet-4-5",
      name: "Claude Sonnet 4.5",
      family: "claude-sonnet",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      structured_output: true,
      open_weights: false,
      limit: { context: 1000000, output: 64000 },
      modalities: {
        input: ["text", "image", "pdf"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["claude-sonnet-4-5"] as Pricing,
      knowledge: "2025-01",
      release_date: "2025-02-01",
      last_updated: today,
    }),
  );

  // --- Claude Sonnet 4 (deprecated, 1M context) ---

  models.push(
    defineModel({
      id: "claude-sonnet-4-0",
      name: "Claude Sonnet 4",
      family: "claude-sonnet",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      structured_output: true,
      open_weights: false,
      deprecated: true,
      limit: { context: 1000000, output: 64000 },
      modalities: {
        input: ["text", "image", "pdf"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["claude-sonnet-4-0"] as Pricing,
      knowledge: "2025-01",
      release_date: "2025-01-01",
      last_updated: today,
    }),
  );

  // --- Claude Haiku 4.5 (200K context, extended thinking only) ---

  models.push(
    defineModel({
      id: "claude-haiku-4-5",
      name: "Claude Haiku 4.5",
      family: "claude-haiku",
      temperature: true,
      reasoning: true,
      tool_call: true,
      attachment: true,
      structured_output: true,
      open_weights: false,
      limit: { context: 200000, output: 64000 },
      modalities: {
        input: ["text", "image", "pdf"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["claude-haiku-4-5"] as Pricing,
      knowledge: "2025-02",
      release_date: "2025-10-01",
      last_updated: today,
    }),
  );

  console.log(`  Anthropic: ${models.length} models`);

  return { provider, models };
}
