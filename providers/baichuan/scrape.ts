import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "baichuan",
  name: "Baichuan AI",
  url: "https://platform.baichuan-ai.com",
  api_docs: "https://platform.baichuan-ai.com/docs",
  apis: {
    openai: "https://api.baichuan-ai.com/v1",
  },
  currency: "CNY",
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Pricing: Baichuan AI pricing page https://platform.baichuan-ai.com/docs/pricing
//   (browser-verified SSR page with model pricing table)
// - Model IDs & API specs: Baichuan API docs https://platform.baichuan-ai.com/docs
//   (medical model IDs: Baichuan-M3-Plus, Baichuan-M3, Baichuan-M2-Plus, Baichuan-M2;
//    general model IDs: Baichuan4-Turbo, Baichuan4-Air, Baichuan4,
//    Baichuan3-Turbo, Baichuan3-Turbo-128k, Baichuan2-Turbo, Baichuan2-53B)
//
// Pricing is in CNY per 1M tokens (converted from CNY per 1K tokens on the pricing page).
// Some models use blended pricing ("包含输入和输出") where input = output.
// Baichuan2-53B has time-based pricing; we use the daytime rate (8:00~24:00).
// Baichuan2-Turbo-192k has been retired (routes to Baichuan3-Turbo-128k).
// ---------------------------------------------------------------------------

// Pricing (CNY per 1M tokens) — from pricing page, converted from per-1K-tokens
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Medical models — separate input/output pricing
  "baichuan-m3-plus": { currency: "CNY", input: 5, output: 9 },
  "baichuan-m3": { currency: "CNY", input: 10, output: 30 },
  "baichuan-m2-plus": { currency: "CNY", input: 10, output: 30 },
  "baichuan-m2": { currency: "CNY", input: 2, output: 20 },
  // General models — blended pricing (input = output)
  "baichuan4-turbo": { currency: "CNY", input: 15, output: 15 },
  "baichuan4-air": { currency: "CNY", input: 0.98, output: 0.98 },
  baichuan4: { currency: "CNY", input: 100, output: 100 },
  "baichuan3-turbo": { currency: "CNY", input: 12, output: 12 },
  "baichuan3-turbo-128k": { currency: "CNY", input: 24, output: 24 },
  "baichuan2-turbo": { currency: "CNY", input: 8, output: 8 },
  "baichuan2-53b": { currency: "CNY", input: 20, output: 20 },
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

  // --- Baichuan-M3-Plus (medical flagship, 32K, file attachment, reasoning) ---

  models.push(
    defineModel({
      id: "baichuan-m3-plus",
      name: "Baichuan M3 Plus",
      family: "baichuan-m",
      reasoning: true,
      temperature: true,
      attachment: true,
      limit: { context: 32768, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["baichuan-m3-plus"] as Pricing,
      release_date: "2025-04",
      last_updated: today,
    }),
  );

  // --- Baichuan-M3 (medical, 32K, reasoning) ---

  models.push(
    defineModel({
      id: "baichuan-m3",
      name: "Baichuan M3",
      family: "baichuan-m",
      reasoning: true,
      temperature: true,
      limit: { context: 32768, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["baichuan-m3"] as Pricing,
      release_date: "2025-04",
      last_updated: today,
    }),
  );

  // --- Baichuan-M2-Plus (medical, 32K, file attachment) ---

  models.push(
    defineModel({
      id: "baichuan-m2-plus",
      name: "Baichuan M2 Plus",
      family: "baichuan-m",
      temperature: true,
      attachment: true,
      limit: { context: 32768, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["baichuan-m2-plus"] as Pricing,
      release_date: "2025-01",
      last_updated: today,
    }),
  );

  // --- Baichuan-M2 (medical, 32K) ---

  models.push(
    defineModel({
      id: "baichuan-m2",
      name: "Baichuan M2",
      family: "baichuan-m",
      temperature: true,
      limit: { context: 32768, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["baichuan-m2"] as Pricing,
      release_date: "2025-01",
      last_updated: today,
    }),
  );

  // --- Baichuan4-Turbo (flagship, 32K, fast) ---

  models.push(
    defineModel({
      id: "baichuan4-turbo",
      name: "Baichuan4 Turbo",
      family: "baichuan4",
      temperature: true,
      limit: { context: 32768, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["baichuan4-turbo"] as Pricing,
      release_date: "2024-05",
      last_updated: today,
    }),
  );

  // --- Baichuan4-Air (budget, 32K, very cheap) ---

  models.push(
    defineModel({
      id: "baichuan4-air",
      name: "Baichuan4 Air",
      family: "baichuan4",
      temperature: true,
      limit: { context: 32768, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["baichuan4-air"] as Pricing,
      release_date: "2024-05",
      last_updated: today,
    }),
  );

  // --- Baichuan4 (flagship, 32K, expensive) ---

  models.push(
    defineModel({
      id: "baichuan4",
      name: "Baichuan4",
      family: "baichuan4",
      temperature: true,
      limit: { context: 32768, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["baichuan4"] as Pricing,
      release_date: "2024-05",
      last_updated: today,
    }),
  );

  // --- Baichuan3-Turbo (32K) ---

  models.push(
    defineModel({
      id: "baichuan3-turbo",
      name: "Baichuan3 Turbo",
      family: "baichuan3",
      temperature: true,
      limit: { context: 32768, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["baichuan3-turbo"] as Pricing,
      release_date: "2024-01",
      last_updated: today,
    }),
  );

  // --- Baichuan3-Turbo-128k (128K context) ---

  models.push(
    defineModel({
      id: "baichuan3-turbo-128k",
      name: "Baichuan3 Turbo 128K",
      family: "baichuan3",
      temperature: true,
      limit: { context: 131072, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["baichuan3-turbo-128k"] as Pricing,
      release_date: "2024-01",
      last_updated: today,
    }),
  );

  // --- Baichuan2-Turbo (32K, efficient) ---

  models.push(
    defineModel({
      id: "baichuan2-turbo",
      name: "Baichuan2 Turbo",
      family: "baichuan2",
      temperature: true,
      limit: { context: 32768, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["baichuan2-turbo"] as Pricing,
      release_date: "2023-12",
      last_updated: today,
    }),
  );

  // --- Baichuan2-53B (open-weight, 53B params, 32K) ---

  models.push(
    defineModel({
      id: "baichuan2-53b",
      name: "Baichuan2 53B",
      family: "baichuan2",
      temperature: true,
      open_weights: true,
      limit: { context: 32768, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["baichuan2-53b"] as Pricing,
      release_date: "2023-08",
      last_updated: today,
    }),
  );

  console.log(`  Baichuan AI: ${models.length} models`);

  return { provider, models };
}
