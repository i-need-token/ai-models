import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "stepfun",
  name: "StepFun",
  url: "https://platform.stepfun.com",
  api_docs: "https://platform.stepfun.com/docs",
  apis: {
    openai: "https://api.stepfun.com/v1",
  },
});

// ---------------------------------------------------------------------------
// Hardcoded model data (from first-party Mintlify docs accessed 2026-05-15)
// Source: https://platform.stepfun.com/docs/zh/guides/models/overview.md
//         https://platform.stepfun.com/docs/zh/guides/pricing/details.md
// ---------------------------------------------------------------------------

// Text models — CNY per million tokens
const TEXT_MODELS: Record<string, { name: string; context: number; deprecated: boolean }> = {
  "step-2-mini": { name: "Step 2 Mini", context: 32000, deprecated: false },
  "step-2-16k": { name: "Step 2 (16K)", context: 16000, deprecated: false },
  "step-2-16k-exp": { name: "Step 2 (16K) Exp", context: 16000, deprecated: false },
  "step-1-8k": { name: "Step 1 (8K)", context: 8000, deprecated: false },
  "step-1-32k": { name: "Step 1 (32K)", context: 32000, deprecated: false },
};

// Reasoning models — CNY per million tokens
const REASONING_MODELS: Record<string, { name: string; context: number; deprecated: boolean }> = {
  "step-3.5-flash": { name: "Step 3.5 Flash", context: 256000, deprecated: false },
  "step-3.5-flash-2603": { name: "Step 3.5 Flash 2603", context: 256000, deprecated: false },
  "step-3": { name: "Step 3", context: 64000, deprecated: false },
  "step-r1-v-mini": { name: "Step R1-V Mini", context: 100000, deprecated: false },
};

// Vision models — CNY per million tokens
const VISION_MODELS: Record<string, { name: string; context: number; deprecated: boolean }> = {
  "step-1o-turbo-vision": { name: "Step-1o Turbo Vision", context: 32000, deprecated: false },
  "step-1o-vision-32k": { name: "Step-1o Vision (32K)", context: 32000, deprecated: false },
  "step-1v-8k": { name: "Step 1V (8K)", context: 8000, deprecated: false },
  "step-1v-32k": { name: "Step 1V (32K)", context: 32000, deprecated: false },
};

// End-to-end audio models (token-based) — CNY per million tokens
const AUDIO_TOKEN_MODELS: Record<string, { name: string; context: number; deprecated: boolean }> = {
  "stepaudio-2.5-realtime": { name: "StepAudio 2.5 Realtime", context: 0, deprecated: false },
  "stepaudio-2.5-chat": { name: "StepAudio 2.5 Chat", context: 0, deprecated: false },
  "step-1o-audio": { name: "Step-1o Audio", context: 0, deprecated: false },
  "step-audio-2": { name: "Step Audio 2", context: 0, deprecated: false },
  "step-audio-r1.1": { name: "Step Audio R1.1", context: 0, deprecated: false },
};

// TTS models — CNY per 10k characters
const TTS_MODELS: Record<string, { name: string; deprecated: boolean }> = {
  "stepaudio-2.5-tts": { name: "StepAudio 2.5 TTS", deprecated: false },
  "step-tts-2": { name: "Step TTS 2", deprecated: false },
  "step-tts-mini": { name: "Step TTS Mini", deprecated: false },
};

// ASR models — CNY per hour
const ASR_MODELS: Record<string, { name: string; deprecated: boolean }> = {
  "stepaudio-2.5-asr": { name: "StepAudio 2.5 ASR", deprecated: false },
  "stepaudio-2-asr-pro": { name: "StepAudio 2 ASR Pro", deprecated: false },
  "step-asr": { name: "Step ASR", deprecated: false },
  "step-asr-1.1": { name: "Step ASR 1.1", deprecated: false },
  "step-asr-1.1-stream": { name: "Step ASR 1.1 Stream", deprecated: false },
};

// Image models — CNY per image
const IMAGE_MODELS: Record<string, { name: string; deprecated: boolean }> = {
  "step-image-edit-2": { name: "Step Image Edit 2", deprecated: false },
  "step-2x-large": { name: "Step 2X Large", deprecated: false },
  "step-1x-medium": { name: "Step 1X Medium", deprecated: false },
  "step-1x-edit": { name: "Step 1X Edit", deprecated: false },
};

// Model Lab (experimental, free)
const LAB_MODELS: Record<string, { name: string; deprecated: boolean }> = {
  "step-gui": { name: "Step GUI", deprecated: false },
};

// ---------------------------------------------------------------------------
// Pricing — CNY per million tokens (from pricing/details.md)
// ---------------------------------------------------------------------------

const HARDCODED_PRICING: Record<string, Pricing> = {
  // Text models
  "step-2-mini": { currency: "CNY", input: 1, output: 2, cache_read: 0.2 },
  "step-2-16k": { currency: "CNY", input: 38, output: 120, cache_read: 7.6 },
  "step-2-16k-exp": { currency: "CNY", input: 38, output: 120, cache_read: 7.6 },
  "step-1-8k": { currency: "CNY", input: 5, output: 20, cache_read: 1 },
  "step-1-32k": { currency: "CNY", input: 15, output: 70, cache_read: 3 },

  // Reasoning models
  "step-3.5-flash": { currency: "CNY", input: 0.7, output: 2.1, cache_read: 0.14 },
  "step-3.5-flash-2603": { currency: "CNY", input: 0.7, output: 2.1, cache_read: 0.14 },
  "step-3": { currency: "CNY", input: 1.5, output: 4, cache_read: 0.3 },
  "step-r1-v-mini": { currency: "CNY", input: 2.5, output: 8, cache_read: 0.5 },

  // Vision models
  "step-1o-turbo-vision": { currency: "CNY", input: 2.5, output: 8, cache_read: 0.5 },
  "step-1o-vision-32k": { currency: "CNY", input: 15, output: 70, cache_read: 3 },
  "step-1v-8k": { currency: "CNY", input: 5, output: 20, cache_read: 1 },
  "step-1v-32k": { currency: "CNY", input: 15, output: 70, cache_read: 3 },

  // End-to-end audio models (token-based)
  "stepaudio-2.5-realtime": { currency: "CNY", input: 10, output: 70, cache_read: 2 },
  "stepaudio-2.5-chat": { currency: "CNY", input: 10, output: 25, cache_read: 2 },
  "step-1o-audio": { currency: "CNY", input: 25, output: 60, cache_read: 5 },
  "step-audio-2": { currency: "CNY", input: 10, output: 70, cache_read: 2 },
  "step-audio-r1.1": { unit: "free" },

  // TTS models — per 10k characters
  "stepaudio-2.5-tts": { currency: "CNY", unit: "per_request", price: 5.8 },
  "step-tts-2": { currency: "CNY", unit: "per_request", price: 2.8 },
  "step-tts-mini": { currency: "CNY", unit: "per_request", price: 0.9 },

  // ASR models — per hour
  "stepaudio-2.5-asr": { currency: "CNY", unit: "per_second", price: 0.000042 },
  "stepaudio-2-asr-pro": { currency: "CNY", unit: "per_second", price: 0.000556 },
  "step-asr": { currency: "CNY", unit: "per_second", price: 0.00025 },
  "step-asr-1.1": { currency: "CNY", unit: "per_second", price: 0.000611 },
  "step-asr-1.1-stream": { currency: "CNY", unit: "per_second", price: 0.000722 },

  // Image models — per image
  "step-image-edit-2": { currency: "CNY", unit: "per_image", price: 0.02 },
  "step-2x-large": { unit: "free" },
  "step-1x-medium": { currency: "CNY", unit: "per_image", price: 0.1 },
  "step-1x-edit": { unit: "free" },

  // Model Lab — free
  "step-gui": { unit: "free" },
};

// ---------------------------------------------------------------------------
// Family derivation
// ---------------------------------------------------------------------------

function deriveFamily(id: string): string {
  if (id.startsWith("step-3.5")) return "step-3.5";
  if (id.startsWith("step-3")) return "step-3";
  if (id.startsWith("step-r1")) return "step-r1";
  if (id.startsWith("step-2-mini")) return "step-2-mini";
  if (id.startsWith("step-2-16k")) return "step-2";
  if (id.startsWith("step-2x")) return "step-2x";
  if (id.startsWith("step-1o-turbo")) return "step-1o-turbo";
  if (id.startsWith("step-1o-vision")) return "step-1o-vision";
  if (id.startsWith("step-1o-audio")) return "step-1o-audio";
  if (id.startsWith("step-1x")) return "step-1x";
  if (id.startsWith("step-1v")) return "step-1v";
  if (id.startsWith("step-1-")) return "step-1";
  if (id.startsWith("stepaudio-2.5")) return "stepaudio-2.5";
  if (id.startsWith("stepaudio-2")) return "stepaudio-2";
  if (id.startsWith("step-audio")) return "step-audio";
  if (id.startsWith("step-tts")) return "step-tts";
  if (id.startsWith("step-asr")) return "step-asr";
  if (id.startsWith("step-gui")) return "step-gui";
  if (id.startsWith("step-image")) return "step-image";
  return "stepfun";
}

// ---------------------------------------------------------------------------
// Modalities
// ---------------------------------------------------------------------------

function deriveModalities(id: string): { input: ModelModality[]; output: ModelModality[] } {
  // Text models
  if (
    id.startsWith("step-1-") ||
    id.startsWith("step-2-") ||
    id.startsWith("step-3.5") ||
    id.startsWith("step-3-")
  ) {
    return { input: ["text"], output: ["text"] };
  }
  // Reasoning models with vision
  if (id === "step-r1-v-mini" || id === "step-3") {
    return { input: ["text", "image"], output: ["text"] };
  }
  // Vision models
  if (id.includes("vision") || id.startsWith("step-1v-") || id === "step-1o-turbo-vision") {
    return { input: ["text", "image"], output: ["text"] };
  }
  // Realtime audio models
  if (
    id === "stepaudio-2.5-realtime" ||
    id === "step-1o-audio" ||
    id === "step-audio-2" ||
    id === "step-audio-r1.1"
  ) {
    return { input: ["audio"], output: ["audio"] };
  }
  // Chat audio model (text output)
  if (id === "stepaudio-2.5-chat") {
    return { input: ["audio"], output: ["text"] };
  }
  // TTS models
  if (id.startsWith("step-tts") || id.startsWith("stepaudio-2.5-tts")) {
    return { input: ["text"], output: ["audio"] };
  }
  // ASR models
  if (
    id.startsWith("step-asr") ||
    id.startsWith("stepaudio-2.5-asr") ||
    id.startsWith("stepaudio-2-asr")
  ) {
    return { input: ["audio"], output: ["text"] };
  }
  // Image models
  if (id.startsWith("step-1x-") || id.startsWith("step-2x-") || id.startsWith("step-image-")) {
    return { input: ["text", "image"], output: ["image"] };
  }
  // GUI model
  if (id === "step-gui") {
    return { input: ["text", "image"], output: ["text"] };
  }
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
    const pricing = HARDCODED_PRICING[id] ?? { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id),
        temperature: true,
        limit: { context: info.context, output: info.context },
        modalities: deriveModalities(id),
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  // Reasoning models
  for (const [id, info] of Object.entries(REASONING_MODELS)) {
    const pricing = HARDCODED_PRICING[id] ?? { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id),
        temperature: true,
        limit: { context: info.context, output: info.context },
        modalities: deriveModalities(id),
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  // Vision models
  for (const [id, info] of Object.entries(VISION_MODELS)) {
    const pricing = HARDCODED_PRICING[id] ?? { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id),
        temperature: true,
        limit: { context: info.context, output: info.context },
        modalities: deriveModalities(id),
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  // End-to-end audio models (token-based)
  for (const [id, info] of Object.entries(AUDIO_TOKEN_MODELS)) {
    const pricing = HARDCODED_PRICING[id] ?? { unit: "free" };
    const modelObj: Model = {
      id,
      name: info.name,
      family: deriveFamily(id),
      temperature: false,
      modalities: deriveModalities(id),
      ...(info.deprecated ? { deprecated: true } : {}),
      pricing,
      release_date: today,
      last_updated: today,
    };
    models.push(defineModel(modelObj));
  }

  // TTS models
  for (const [id, info] of Object.entries(TTS_MODELS)) {
    const pricing = HARDCODED_PRICING[id] ?? { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id),
        temperature: false,
        modalities: deriveModalities(id),
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  // ASR models
  for (const [id, info] of Object.entries(ASR_MODELS)) {
    const pricing = HARDCODED_PRICING[id] ?? { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id),
        temperature: false,
        modalities: deriveModalities(id),
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  // Image models
  for (const [id, info] of Object.entries(IMAGE_MODELS)) {
    const pricing = HARDCODED_PRICING[id] ?? { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id),
        temperature: false,
        modalities: deriveModalities(id),
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  // Model Lab (experimental, free)
  for (const [id, info] of Object.entries(LAB_MODELS)) {
    const pricing = HARDCODED_PRICING[id] ?? { unit: "free" };
    models.push(
      defineModel({
        id,
        name: info.name,
        family: deriveFamily(id),
        temperature: false,
        modalities: deriveModalities(id),
        ...(info.deprecated ? { deprecated: true } : {}),
        pricing,
        release_date: today,
        last_updated: today,
      }),
    );
  }

  console.log(`  StepFun: ${models.length} models`);

  return { provider, models };
}
