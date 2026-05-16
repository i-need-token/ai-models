import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "voyage",
  name: "Voyage AI",
  url: "https://voyageai.com",
  api_docs: "https://docs.voyageai.com",
  apis: {
    openai: "https://api.voyageai.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Model specs: Voyage AI docs — Text Embeddings, Multimodal Embeddings,
//   Contextualized Chunk Embeddings, Rerankers pages
//   https://docs.voyageai.com/docs/introduction (browser-verified CSR pages)
// - Pricing: Voyage AI docs — Pricing page
//   https://docs.voyageai.com/docs/pricing (browser-verified SSR page)
//
// Voyage AI (now part of MongoDB) produces embedding and reranking models.
// The API requires authentication. Data sourced from first-party docs.
// ---------------------------------------------------------------------------

// Pricing (USD per 1M tokens) — from pricing page
// Embed models: input-only pricing (output = 0 since no text output tokens)
// Reranker models: input-only pricing (output = 0 since no text output tokens)
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Voyage 4 series (current generation)
  "voyage-4-large": { currency: "USD", input: 0.12, output: 0 },
  "voyage-4": { currency: "USD", input: 0.06, output: 0 },
  "voyage-4-lite": { currency: "USD", input: 0.02, output: 0 },
  // Voyage context & code (current)
  "voyage-context-3": { currency: "USD", input: 0.18, output: 0 },
  "voyage-code-3": { currency: "USD", input: 0.18, output: 0 },
  // Domain-specific (current)
  "voyage-finance-2": { currency: "USD", input: 0.12, output: 0 },
  "voyage-law-2": { currency: "USD", input: 0.12, output: 0 },
  "voyage-code-2": { currency: "USD", input: 0.12, output: 0 },
  // Multimodal (current) — text token pricing only; pixel pricing ($0.60/B pixels) not representable
  "voyage-multimodal-3.5": { currency: "USD", input: 0.12, output: 0 },
  "voyage-multimodal-3": { currency: "USD", input: 0.12, output: 0 },
  // Reranker (current) — priced per million tokens processed
  "rerank-2.5": { currency: "USD", input: 0.05, output: 0 },
  "rerank-2.5-lite": { currency: "USD", input: 0.02, output: 0 },
  // Voyage 3 series (older, still available)
  "voyage-3-large": { currency: "USD", input: 0.18, output: 0 },
  "voyage-3.5": { currency: "USD", input: 0.06, output: 0 },
  "voyage-3.5-lite": { currency: "USD", input: 0.02, output: 0 },
  "voyage-3": { currency: "USD", input: 0.06, output: 0 },
  "voyage-3-lite": { currency: "USD", input: 0.02, output: 0 },
  // Domain-specific (older)
  "voyage-multilingual-2": { currency: "USD", input: 0.12, output: 0 },
  // Reranker (older)
  "rerank-2": { currency: "USD", input: 0.05, output: 0 },
  "rerank-lite-1": { currency: "USD", input: 0.02, output: 0 },
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

  // =========================================================================
  // Voyage 4 Series — Current generation text embedding models
  // =========================================================================

  // --- Voyage 4 Large (32K context, best quality) ---

  models.push(
    defineModel({
      id: "voyage-4-large",
      name: "Voyage 4 Large",
      family: "voyage-4",
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-4-large"] as Pricing,
      release_date: "2025-05",
      last_updated: today,
    }),
  );

  // --- Voyage 4 (32K context, balanced) ---

  models.push(
    defineModel({
      id: "voyage-4",
      name: "Voyage 4",
      family: "voyage-4",
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-4"] as Pricing,
      release_date: "2025-05",
      last_updated: today,
    }),
  );

  // --- Voyage 4 Lite (32K context, optimized for latency/cost) ---

  models.push(
    defineModel({
      id: "voyage-4-lite",
      name: "Voyage 4 Lite",
      family: "voyage-4",
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-4-lite"] as Pricing,
      release_date: "2025-05",
      last_updated: today,
    }),
  );

  // --- Voyage 4 Nano (32K context, open-weight, free) ---

  models.push(
    defineModel({
      id: "voyage-4-nano",
      name: "Voyage 4 Nano",
      family: "voyage-4",
      open_weights: true,
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: { unit: "free" },
      release_date: "2025-05",
      last_updated: today,
    }),
  );

  // =========================================================================
  // Contextualized Chunk Embeddings
  // =========================================================================

  // --- Voyage Context 3 (32K context, contextualized chunk embeddings) ---

  models.push(
    defineModel({
      id: "voyage-context-3",
      name: "Voyage Context 3",
      family: "voyage-context",
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-context-3"] as Pricing,
      release_date: "2025-03",
      last_updated: today,
    }),
  );

  // =========================================================================
  // Code Embedding Models
  // =========================================================================

  // --- Voyage Code 3 (32K context, code retrieval) ---

  models.push(
    defineModel({
      id: "voyage-code-3",
      name: "Voyage Code 3",
      family: "voyage-code",
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-code-3"] as Pricing,
      release_date: "2025-02",
      last_updated: today,
    }),
  );

  // --- Voyage Code 2 (16K context, code retrieval, older generation) ---

  models.push(
    defineModel({
      id: "voyage-code-2",
      name: "Voyage Code 2",
      family: "voyage-code",
      deprecated: true,
      limit: { context: 16000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-code-2"] as Pricing,
      release_date: "2024-03",
      last_updated: today,
    }),
  );

  // =========================================================================
  // Domain-Specific Embedding Models
  // =========================================================================

  // --- Voyage Finance 2 (32K context, finance retrieval) ---

  models.push(
    defineModel({
      id: "voyage-finance-2",
      name: "Voyage Finance 2",
      family: "voyage-finance",
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-finance-2"] as Pricing,
      release_date: "2024-07",
      last_updated: today,
    }),
  );

  // --- Voyage Law 2 (16K context, legal retrieval) ---

  models.push(
    defineModel({
      id: "voyage-law-2",
      name: "Voyage Law 2",
      family: "voyage-law",
      limit: { context: 16000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-law-2"] as Pricing,
      release_date: "2024-07",
      last_updated: today,
    }),
  );

  // =========================================================================
  // Multimodal Embedding Models
  // =========================================================================

  // --- Voyage Multimodal 3.5 (32K context, text + image + video) ---

  models.push(
    defineModel({
      id: "voyage-multimodal-3.5",
      name: "Voyage Multimodal 3.5",
      family: "voyage-multimodal",
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text", "image", "video"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-multimodal-3.5"] as Pricing,
      release_date: "2025-04",
      last_updated: today,
    }),
  );

  // --- Voyage Multimodal 3 (32K context, text + image + video) ---

  models.push(
    defineModel({
      id: "voyage-multimodal-3",
      name: "Voyage Multimodal 3",
      family: "voyage-multimodal",
      deprecated: true,
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text", "image", "video"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-multimodal-3"] as Pricing,
      release_date: "2025-01",
      last_updated: today,
    }),
  );

  // =========================================================================
  // Reranker Models
  // =========================================================================

  // --- Rerank 2.5 (32K context, instruction-following + multilingual) ---

  models.push(
    defineModel({
      id: "rerank-2.5",
      name: "Rerank 2.5",
      family: "rerank",
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["rerank-2.5"] as Pricing,
      release_date: "2025-03",
      last_updated: today,
    }),
  );

  // --- Rerank 2.5 Lite (32K context, optimized for latency/cost) ---

  models.push(
    defineModel({
      id: "rerank-2.5-lite",
      name: "Rerank 2.5 Lite",
      family: "rerank",
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["rerank-2.5-lite"] as Pricing,
      release_date: "2025-03",
      last_updated: today,
    }),
  );

  // =========================================================================
  // Older Models (still available on pricing page)
  // =========================================================================

  // --- Voyage 3 Large (older, best quality of v3 generation) ---

  models.push(
    defineModel({
      id: "voyage-3-large",
      name: "Voyage 3 Large",
      family: "voyage-3",
      deprecated: true,
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-3-large"] as Pricing,
      release_date: "2024-10",
      last_updated: today,
    }),
  );

  // --- Voyage 3.5 (older, balanced) ---

  models.push(
    defineModel({
      id: "voyage-3.5",
      name: "Voyage 3.5",
      family: "voyage-3",
      deprecated: true,
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-3.5"] as Pricing,
      release_date: "2024-11",
      last_updated: today,
    }),
  );

  // --- Voyage 3.5 Lite (older, latency/cost optimized) ---

  models.push(
    defineModel({
      id: "voyage-3.5-lite",
      name: "Voyage 3.5 Lite",
      family: "voyage-3",
      deprecated: true,
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-3.5-lite"] as Pricing,
      release_date: "2024-11",
      last_updated: today,
    }),
  );

  // --- Voyage 3 (older, standard) ---

  models.push(
    defineModel({
      id: "voyage-3",
      name: "Voyage 3",
      family: "voyage-3",
      deprecated: true,
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-3"] as Pricing,
      release_date: "2024-09",
      last_updated: today,
    }),
  );

  // --- Voyage 3 Lite (older, lightweight) ---

  models.push(
    defineModel({
      id: "voyage-3-lite",
      name: "Voyage 3 Lite",
      family: "voyage-3",
      deprecated: true,
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-3-lite"] as Pricing,
      release_date: "2024-09",
      last_updated: today,
    }),
  );

  // --- Voyage Multilingual 2 (older, multilingual support) ---

  models.push(
    defineModel({
      id: "voyage-multilingual-2",
      name: "Voyage Multilingual 2",
      family: "voyage-multilingual",
      deprecated: true,
      limit: { context: 32000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["voyage-multilingual-2"] as Pricing,
      release_date: "2024-07",
      last_updated: today,
    }),
  );

  // --- Rerank 2 (older, standard reranker) ---

  models.push(
    defineModel({
      id: "rerank-2",
      name: "Rerank 2",
      family: "rerank",
      deprecated: true,
      limit: { context: 16000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["rerank-2"] as Pricing,
      release_date: "2024-06",
      last_updated: today,
    }),
  );

  // --- Rerank Lite 1 (older, lightweight reranker) ---

  models.push(
    defineModel({
      id: "rerank-lite-1",
      name: "Rerank Lite 1",
      family: "rerank",
      deprecated: true,
      limit: { context: 4000, output: 0 },
      modalities: {
        input: ["text"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing: HARDCODED_PRICING["rerank-lite-1"] as Pricing,
      release_date: "2024-01",
      last_updated: today,
    }),
  );

  console.log(`  Voyage AI: ${models.length} models`);

  return { provider, models };
}
