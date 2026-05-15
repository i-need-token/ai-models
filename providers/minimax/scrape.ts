import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "minimax",
  name: "MiniMax",
  url: "https://platform.minimaxi.com",
  api_docs: "https://platform.minimaxi.com/docs",
  apis: {
    openai: "https://api.minimaxi.com/v1",
    anthropic: "https://api.minimaxi.com/anthropic",
  },
});

// URLs — Mintlify .md endpoints (used for future dynamic scraping)
// const MODELS_OVERVIEW_URL = "https://platform.minimaxi.com/docs/guides/models-intro.md";
// const TEXT_GENERATION_URL = "https://platform.minimaxi.com/docs/guides/text-generation.md";
// const TEXT_CHAT_URL = "https://platform.minimaxi.com/docs/guides/text-chat.md";
// const PRICING_URL = "https://platform.minimaxi.com/docs/guides/pricing-paygo.md";

// Page fetching (used for future dynamic scraping)
// async function fetchPage(url: string): Promise<string> {
//   const resp = await fetch(url, {
//     redirect: "follow",
//     headers: { "Accept-Language": "en" },
//   });
//   if (!resp.ok) {
//     throw new Error(`Failed to fetch ${url}: ${resp.status}`);
//   }
//   return resp.text();
// }

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party docs accessed 2026-05-15)
// ---------------------------------------------------------------------------

// Text models from models-intro.md and text-generation.md
const TEXT_MODELS: Record<string, { name: string; context: number; deprecated: boolean }> = {
  "MiniMax-M2.7": { name: "MiniMax M2.7", context: 204800, deprecated: false },
  "MiniMax-M2.7-highspeed": { name: "MiniMax M2.7 Highspeed", context: 204800, deprecated: false },
  "MiniMax-M2.5": { name: "MiniMax M2.5", context: 204800, deprecated: false },
  "MiniMax-M2.5-highspeed": { name: "MiniMax M2.5 Highspeed", context: 204800, deprecated: false },
  "M2-her": { name: "MiniMax M2-Her", context: 64000, deprecated: false },
  "MiniMax-M2.1": { name: "MiniMax M2.1", context: 204800, deprecated: true },
  "MiniMax-M2.1-highspeed": { name: "MiniMax M2.1 Highspeed", context: 204800, deprecated: true },
  "MiniMax-M2": { name: "MiniMax M2", context: 204800, deprecated: true },
};

// Speech models from models-intro.md
const SPEECH_MODELS: Record<string, { name: string; deprecated: boolean }> = {
  "speech-2.8-hd": { name: "Speech 2.8 HD", deprecated: false },
  "speech-2.8-turbo": { name: "Speech 2.8 Turbo", deprecated: false },
  "speech-2.6-hd": { name: "Speech 2.6 HD", deprecated: false },
  "speech-2.6-turbo": { name: "Speech 2.6 Turbo", deprecated: false },
  "speech-02-hd": { name: "Speech 02 HD", deprecated: false },
  "speech-02-turbo": { name: "Speech 02 Turbo", deprecated: false },
};

// Video models from models-intro.md
const VIDEO_MODELS: Record<string, { name: string; deprecated: boolean }> = {
  "MiniMax-Hailuo-2.3": { name: "MiniMax Hailuo 2.3", deprecated: false },
  "MiniMax-Hailuo-2.3-Fast": { name: "MiniMax Hailuo 2.3 Fast", deprecated: false },
  "MiniMax-Hailuo-02": { name: "MiniMax Hailuo 02", deprecated: false },
};

// Image models from models-intro.md
const IMAGE_MODELS: Record<string, { name: string; deprecated: boolean }> = {
  "image-01": { name: "Image 01", deprecated: false },
  "image-01-live": { name: "Image 01 Live", deprecated: false },
};

// Music models from models-intro.md
const MUSIC_MODELS: Record<string, { name: string; deprecated: boolean }> = {
  "music-2.6": { name: "Music 2.6", deprecated: false },
  "music-cover": { name: "Music Cover", deprecated: false },
};

// Pricing from pricing-paygo.md (CNY per million tokens for text)
// Source: https://platform.minimaxi.com/docs/guides/pricing-paygo.md (accessed 2026-05-15)
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Text models — CNY per million tokens
  "MiniMax-M2.7": {
    currency: "CNY",
    input: 2.1,
    output: 8.4,
    cache_read: 0.42,
    cache_write: 2.625,
  },
  "MiniMax-M2.7-highspeed": {
    currency: "CNY",
    input: 4.2,
    output: 16.8,
    cache_read: 0.42,
    cache_write: 2.625,
  },
  "MiniMax-M2.5": {
    currency: "CNY",
    input: 2.1,
    output: 8.4,
    cache_read: 0.21,
    cache_write: 2.625,
  },
  "MiniMax-M2.5-highspeed": {
    currency: "CNY",
    input: 4.2,
    output: 16.8,
    cache_read: 0.21,
    cache_write: 2.625,
  },
  "M2-her": { currency: "CNY", input: 2.1, output: 8.4 },
  "MiniMax-M2.1": {
    currency: "CNY",
    input: 2.1,
    output: 8.4,
    cache_read: 0.21,
    cache_write: 2.625,
  },
  "MiniMax-M2.1-highspeed": {
    currency: "CNY",
    input: 4.2,
    output: 16.8,
    cache_read: 0.21,
    cache_write: 2.625,
  },
  "MiniMax-M2": { currency: "CNY", input: 2.1, output: 8.4, cache_read: 0.21, cache_write: 2.625 },

  // Speech models — CNY per 10k characters
  "speech-2.8-hd": { currency: "CNY", unit: "per_request", price: 3.5 },
  "speech-2.8-turbo": { currency: "CNY", unit: "per_request", price: 2 },
  "speech-2.6-hd": { currency: "CNY", unit: "per_request", price: 3.5 },
  "speech-2.6-turbo": { currency: "CNY", unit: "per_request", price: 2 },
  "speech-02-hd": { currency: "CNY", unit: "per_request", price: 3.5 },
  "speech-02-turbo": { currency: "CNY", unit: "per_request", price: 2 },

  // Video models — CNY per video (lowest price)
  "MiniMax-Hailuo-2.3": { currency: "CNY", unit: "per_request", price: 2 },
  "MiniMax-Hailuo-2.3-Fast": { currency: "CNY", unit: "per_request", price: 1.35 },
  "MiniMax-Hailuo-02": { currency: "CNY", unit: "per_request", price: 0.6 },

  // Image models — CNY per image
  "image-01": { currency: "CNY", unit: "per_image", price: 0.025 },
  "image-01-live": { currency: "CNY", unit: "per_image", price: 0.025 },

  // Music models — CNY per song
  "music-2.6": { currency: "CNY", unit: "per_request", price: 1 },
  "music-cover": { currency: "CNY", unit: "per_request", price: 1 },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string, type: string): string {
  if (type === "text") {
    if (id === "M2-her") return "minimax-m2-her";
    if (id.includes("M2.7")) return "minimax-m2.7";
    if (id.includes("M2.5")) return "minimax-m2.5";
    if (id.includes("M2.1")) return "minimax-m2.1";
    if (id.includes("M2")) return "minimax-m2";
    return "minimax";
  }
  if (type === "speech") return "minimax-speech";
  if (type === "video") return "minimax-hailuo";
  if (type === "image") return "minimax-image";
  if (type === "music") return "minimax-music";
  return "minimax";
}

// ---------------------------------------------------------------------------
// Modalities
// ---------------------------------------------------------------------------

function deriveModalities(type: string): { input: ModelModality[]; output: ModelModality[] } {
  if (type === "text") return { input: ["text"], output: ["text"] };
  if (type === "speech") return { input: ["text"], output: ["audio"] };
  if (type === "video") return { input: ["text", "image"], output: ["video"] };
  if (type === "image") return { input: ["text", "image"], output: ["image"] };
  if (type === "music") return { input: ["text"], output: ["audio"] };
  return { input: ["text"], output: ["text"] };
}

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

  // Text models
  for (const [id, info] of Object.entries(TEXT_MODELS)) {
    const pricing = HARDCODED_PRICING[id] || { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id, "text"),
        temperature: true,
        limit: { context: info.context, output: info.context },
        modalities: deriveModalities("text"),
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  // Speech models
  for (const [id, info] of Object.entries(SPEECH_MODELS)) {
    const pricing = HARDCODED_PRICING[id] || { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id, "speech"),
        temperature: false,
        modalities: deriveModalities("speech"),
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  // Video models
  for (const [id, info] of Object.entries(VIDEO_MODELS)) {
    const pricing = HARDCODED_PRICING[id] || { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id, "video"),
        temperature: false,
        modalities: deriveModalities("video"),
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  // Image models
  for (const [id, info] of Object.entries(IMAGE_MODELS)) {
    const pricing = HARDCODED_PRICING[id] || { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id, "image"),
        temperature: false,
        modalities: deriveModalities("image"),
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  // Music models
  for (const [id, info] of Object.entries(MUSIC_MODELS)) {
    const pricing = HARDCODED_PRICING[id] || { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id, "music"),
        temperature: false,
        modalities: deriveModalities("music"),
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  console.log(`  MiniMax: ${models.length} models`);

  return { provider, models };
}
