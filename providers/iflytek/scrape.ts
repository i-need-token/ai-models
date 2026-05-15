import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "iflytek",
  name: "iFlytek SparkDesk",
  url: "https://xinghuo.xfyun.cn",
  api_docs: "https://www.xfyun.cn/doc/sparkapi.html",
  apis: {
    openai: "https://spark-api-open.xf-yun.com/v1",
  },
  currency: "CNY",
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-15)
//
// Sources:
// - Pricing: iFlytek SparkDesk API pricing page
//   https://xinghuo.xfyun.cn/sparkapi (browser-verified CSR page)
// - Model IDs & API specs: iFlytek API docs
//   https://www.xfyun.cn/doc/sparkapi.html
//
// Pricing is in CNY per 1M tokens (blended — same for input and output).
// Spark X2 Flash has volume-based pricing (1.0~2.0 CNY/mtok);
// we use the standard rate (简享包: 2.0 CNY/mtok).
// Spark Lite is free (0 CNY/mtok).
// ---------------------------------------------------------------------------

// Pricing (CNY per 1M tokens, blended) — from pricing page
const HARDCODED_PRICING: Record<string, Pricing> = {
  "spark-x2-flash": { currency: "CNY", input: 2, output: 2 },
  "spark-x2": { currency: "CNY", input: 2, output: 2 },
  "spark-ultra": { currency: "CNY", input: 0.8, output: 0.8 },
  "spark-pro": { currency: "CNY", input: 5, output: 5 },
  "spark-pro-128k": { currency: "CNY", input: 5, output: 5 },
  "spark-lite": { unit: "free" },
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

  // --- Spark X2 Flash (deep reasoning, fast/slow thinking, 256K) ---

  models.push(
    defineModel({
      id: "spark-x2-flash",
      name: "Spark X2 Flash",
      family: "spark-x2",
      reasoning: true,
      temperature: true,
      limit: { context: 262144, output: 16384 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["spark-x2-flash"] as Pricing,
      release_date: "2025-05",
      last_updated: today,
    }),
  );

  // --- Spark X2 (deep reasoning, 128K) ---

  models.push(
    defineModel({
      id: "spark-x2",
      name: "Spark X2",
      family: "spark-x2",
      reasoning: true,
      temperature: true,
      limit: { context: 131072, output: 16384 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["spark-x2"] as Pricing,
      release_date: "2025-03",
      last_updated: today,
    }),
  );

  // --- Spark Ultra (high cost-performance, 128K) ---

  models.push(
    defineModel({
      id: "spark-ultra",
      name: "Spark Ultra",
      family: "spark-ultra",
      temperature: true,
      limit: { context: 131072, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["spark-ultra"] as Pricing,
      release_date: "2024-10",
      last_updated: today,
    }),
  );

  // --- Spark Pro (strong performance, 8K) ---

  models.push(
    defineModel({
      id: "spark-pro",
      name: "Spark Pro",
      family: "spark-pro",
      temperature: true,
      limit: { context: 8192, output: 4096 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["spark-pro"] as Pricing,
      release_date: "2024-04",
      last_updated: today,
    }),
  );

  // --- Spark Pro 128K (strong performance, 128K context) ---

  models.push(
    defineModel({
      id: "spark-pro-128k",
      name: "Spark Pro 128K",
      family: "spark-pro",
      temperature: true,
      limit: { context: 131072, output: 8192 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["spark-pro-128k"] as Pricing,
      release_date: "2024-06",
      last_updated: today,
    }),
  );

  // --- Spark Lite (free, 8K) ---

  models.push(
    defineModel({
      id: "spark-lite",
      name: "Spark Lite",
      family: "spark-lite",
      temperature: true,
      limit: { context: 8192, output: 4096 },
      modalities: { input: ["text"] as ModelModality[], output: ["text"] as ModelModality[] },
      pricing: HARDCODED_PRICING["spark-lite"] as Pricing,
      release_date: "2024-01",
      last_updated: today,
    }),
  );

  console.log(`  iFlytek SparkDesk: ${models.length} models`);

  return { provider, models };
}
