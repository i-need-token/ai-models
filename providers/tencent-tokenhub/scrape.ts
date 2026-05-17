import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "tencent-tokenhub",
  name: "Tencent Cloud TokenHub",
  url: "https://cloud.tencent.com/product/tokenhub",
  api_docs: "https://cloud.tencent.com/document/product/1823",
  apis: {
    openai: "https://hunyuan.cloud.tencent.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party sources accessed 2026-05-16)
//
// Sources:
// - Pricing: https://cloud.tencent.com/document/product/1823/130055 (CSR)
// - Model list: https://cloud.tencent.com/document/product/1823/130051 (CSR)
// - Product page: https://cloud.tencent.com/product/tokenhub (CSR)
// - API: https://hunyuan.cloud.tencent.com/v1 (requires auth)
//
// Tencent Cloud TokenHub is a large model service platform that integrates
// Tencent's own Hunyuan models and third-party models (DeepSeek, GLM, Kimi,
// MiniMax). Pricing is in Chinese Yuan (CNY) per 1M tokens.
//
// For tiered pricing models, we use tier1 (short context) as default,
// consistent with how AIHubMix handles tiered pricing.
// ---------------------------------------------------------------------------

// Pricing (CNY per 1M tokens) — from TokenHub pricing page
// Tier1 (short context) pricing used for tiered models
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Tencent own models — CNY per 1M tokens
  "hy3-preview": { currency: "CNY", input: 1.2, output: 4, cache_read: 0.4 },
  "hy-2.0-think": { currency: "CNY", input: 3.975, output: 15.9 },
  "hy-2.0-instruct": { currency: "CNY", input: 3.18, output: 7.95 },
  "hunyuan-role": { currency: "CNY", input: 2.4, output: 9.6 },

  // DeepSeek models — CNY per 1M tokens
  "deepseek-v4-flash": { currency: "CNY", input: 1, output: 2, cache_read: 0.2 },
  "deepseek-v4-pro": { currency: "CNY", input: 12, output: 24, cache_read: 1 },
  "deepseek-v3.2": { currency: "CNY", input: 2, output: 3 },
  "deepseek-v3.1": { currency: "CNY", input: 4, output: 12 },
  "deepseek-r1-0528": { currency: "CNY", input: 4, output: 16 },
  "deepseek-v3-0324": { currency: "CNY", input: 2, output: 8 },

  // GLM models — CNY per 1M tokens
  "glm-5.1": { currency: "CNY", input: 6, output: 24, cache_read: 1.3 },
  "glm-5v-turbo": { currency: "CNY", input: 5, output: 22, cache_read: 1.2 },
  "glm-5-turbo": { currency: "CNY", input: 5, output: 22, cache_read: 1.2 },
  "glm-5": { currency: "CNY", input: 4, output: 18, cache_read: 1 },

  // Kimi models — CNY per 1M tokens
  "kimi-k2.6": { currency: "CNY", input: 6.5, output: 27, cache_read: 1.1 },
  "kimi-k2.5": { currency: "CNY", input: 4, output: 21, cache_read: 0.7 },

  // MiniMax models — CNY per 1M tokens
  "minimax-m2.7": { currency: "CNY", input: 2.1, output: 8.4, cache_read: 0.42 },
  "minimax-m2.5": { currency: "CNY", input: 2.1, output: 8.4, cache_read: 0.21 },

  // Multimodal understanding — CNY per 1M tokens
  "yt-vita": { currency: "CNY", input: 1.2, output: 3.5 },
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

  // --- Tencent own models ---
  models.push(
    defineModel({
      id: "hy3-preview",
      name: "Tencent Hy3 Preview",
      family: "hunyuan",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hy3-preview"] as Pricing,
      release_date: "2026-05-16",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hy-2.0-think",
      name: "Tencent HY 2.0 Think",
      family: "hunyuan",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 64000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hy-2.0-think"] as Pricing,
      release_date: "2025-11-09",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hy-2.0-instruct",
      name: "Tencent HY 2.0 Instruct",
      family: "hunyuan",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hy-2.0-instruct"] as Pricing,
      release_date: "2025-11-11",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "hunyuan-role",
      name: "Hunyuan Role",
      family: "hunyuan",
      temperature: true,
      limit: { context: 28000, output: 4000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["hunyuan-role"] as Pricing,
      release_date: "2025-09-24",
      last_updated: today,
    }),
  );

  // --- DeepSeek models ---
  models.push(
    defineModel({
      id: "deepseek-v4-flash",
      name: "DeepSeek V4 Flash",
      family: "deepseek",
      temperature: true,
      tool_call: true,
      limit: { context: 1000000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["deepseek-v4-flash"] as Pricing,
      release_date: "2026-05-16",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "deepseek-v4-pro",
      name: "DeepSeek V4 Pro",
      family: "deepseek",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["deepseek-v4-pro"] as Pricing,
      release_date: "2026-05-16",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "deepseek-v3.2",
      name: "DeepSeek V3.2",
      family: "deepseek",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["deepseek-v3.2"] as Pricing,
      release_date: "2026-05-16",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "deepseek-v3.1",
      name: "DeepSeek V3.1",
      family: "deepseek",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["deepseek-v3.1"] as Pricing,
      release_date: "2026-03-25",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "deepseek-r1-0528",
      name: "DeepSeek R1 0528",
      family: "deepseek",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["deepseek-r1-0528"] as Pricing,
      release_date: "2026-05-28",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "deepseek-v3-0324",
      name: "DeepSeek V3 0324",
      family: "deepseek",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["deepseek-v3-0324"] as Pricing,
      release_date: "2026-03-24",
      last_updated: today,
    }),
  );

  // --- GLM models ---
  models.push(
    defineModel({
      id: "glm-5.1",
      name: "GLM 5.1",
      family: "glm",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["glm-5.1"] as Pricing,
      release_date: "2026-05-16",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "glm-5v-turbo",
      name: "GLM 5V Turbo",
      family: "glm",
      temperature: true,
      attachment: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["glm-5v-turbo"] as Pricing,
      release_date: "2026-05-16",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "glm-5-turbo",
      name: "GLM 5 Turbo",
      family: "glm",
      temperature: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["glm-5-turbo"] as Pricing,
      release_date: "2026-05-16",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "glm-5",
      name: "GLM 5",
      family: "glm",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["glm-5"] as Pricing,
      release_date: "2026-04-14",
      last_updated: today,
    }),
  );

  // --- Kimi models ---
  models.push(
    defineModel({
      id: "kimi-k2.6",
      name: "Kimi K2.6",
      family: "kimi",
      temperature: true,
      attachment: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["kimi-k2.6"] as Pricing,
      release_date: "2026-05-01",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "kimi-k2.5",
      name: "Kimi K2.5",
      family: "kimi",
      temperature: true,
      attachment: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text", "image"], output: ["text"] },
      pricing: HARDCODED_PRICING["kimi-k2.5"] as Pricing,
      release_date: "2026-04-14",
      last_updated: today,
    }),
  );

  // --- MiniMax models ---
  models.push(
    defineModel({
      id: "minimax-m2.7",
      name: "MiniMax M2.7",
      family: "minimax",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["minimax-m2.7"] as Pricing,
      release_date: "2026-04-21",
      last_updated: today,
    }),
  );

  models.push(
    defineModel({
      id: "minimax-m2.5",
      name: "MiniMax M2.5",
      family: "minimax",
      temperature: true,
      reasoning: true,
      tool_call: true,
      limit: { context: 128000, output: 16000 },
      modalities: { input: ["text"], output: ["text"] },
      pricing: HARDCODED_PRICING["minimax-m2.5"] as Pricing,
      release_date: "2026-04-14",
      last_updated: today,
    }),
  );

  // --- Multimodal understanding ---
  models.push(
    defineModel({
      id: "yt-vita",
      name: "YT VITA",
      family: "yt-vision",
      temperature: true,
      attachment: true,
      limit: { context: 32000, output: 8000 },
      modalities: { input: ["text", "image", "video"], output: ["text"] },
      pricing: HARDCODED_PRICING["yt-vita"] as Pricing,
      release_date: "2026-05-16",
      last_updated: today,
    }),
  );

  console.log(`  Tencent Cloud TokenHub: ${models.length} models`);

  return { provider, models };
}
