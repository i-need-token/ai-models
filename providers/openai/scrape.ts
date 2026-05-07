import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "openai",
  name: "OpenAI",
  url: "https://www.openai.com",
  api_docs: "https://platform.openai.com/docs",
  apis: {
    openai: "https://api.openai.com",
  },
});

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

const MODELS_BASE_URL = "https://developers.openai.com/api/docs/models";
const MODELS_INDEX_URL = `${MODELS_BASE_URL}/all`;

// ---------------------------------------------------------------------------
// Model discovery
// ---------------------------------------------------------------------------

interface DiscoveredModel {
  id: string;
  deprecated: boolean;
}

async function discoverModelIds(): Promise<DiscoveredModel[]> {
  const html = await fetchPage(MODELS_INDEX_URL);

  const linkPattern = /href="\/api\/docs\/models\/([^"]+)"/g;
  const seen = new Set<string>();
  const ids: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(html)) !== null) {
    const id = match[1];
    if (!id) continue;
    if (!seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  }

  return ids
    .map((id) => ({ id, deprecated: isDeprecatedInIndex(html, id) }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function isDeprecatedInIndex(html: string, modelId: string): boolean {
  const pattern = new RegExp(`<a href="/api/docs/models/${escapeRegex(modelId)}"[^>]*>`);
  const match = pattern.exec(html);
  if (!match) return true;

  const afterLink = html.slice(match.index, match.index + 1500);
  const endOfCard = afterLink.indexOf("</a>");
  if (endOfCard === -1) return false;

  const cardContent = afterLink.slice(0, endOfCard);
  return cardContent.includes("Deprecated");
}

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const models: Model[] = [];

  const discovered = await discoverModelIds();
  const activeCount = discovered.filter((m) => !m.deprecated).length;
  const deprecatedCount = discovered.filter((m) => m.deprecated).length;
  console.log(`  Discovered ${activeCount} active + ${deprecatedCount} deprecated models`);

  for (const { id: modelId, deprecated } of discovered) {
    try {
      const html = await fetchPage(`${MODELS_BASE_URL}/${modelId}`);
      const detail = parseModelPage(html, modelId, deprecated);
      if (detail) {
        models.push(defineModel(detail));
      }
    } catch (err) {
      console.warn(`  Failed to scrape ${modelId}:`, err);
    }
  }

  return { provider, models };
}

// ---------------------------------------------------------------------------
// Page fetching
// ---------------------------------------------------------------------------

async function fetchPage(url: string): Promise<string> {
  const resp = await fetch(url, { redirect: "follow" });
  if (!resp.ok) {
    throw new Error(`Failed to fetch ${url}: ${resp.status}`);
  }
  return resp.text();
}

// ---------------------------------------------------------------------------
// Model page parser
// ---------------------------------------------------------------------------

function parseModelPage(html: string, modelId: string, indexDeprecated: boolean): Model | null {
  // Check for 404 page
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
  if (titleMatch && titleMatch[1]?.includes("Page not found")) {
    console.warn(`  ${modelId}: page not found`);
    return null;
  }

  // Check for deprecated model on detail page (header section only)
  const snapshotSectionIdx = html.indexOf("Snapshots");
  const modelSection = snapshotSectionIdx !== -1 ? html.slice(0, snapshotSectionIdx) : html;
  const detailDeprecated = modelSection.includes(">Deprecated</div>");
  const deprecated = indexDeprecated || detailDeprecated;

  if (deprecated) {
    console.log(`  ${modelId}: deprecated (index=${indexDeprecated}, detail=${detailDeprecated})`);
  }

  // Parse features
  const features = extractFeatures(html);

  // Parse modalities
  const { input: inputModalities, output: outputModalities } = extractModalities(html);

  // Parse limit (optional — absent for image/embedding/moderation models)
  const contextMatch = html.match(/(\d[\d,]+)<!--\s*-->\s*context window/i);
  const context = contextMatch?.[1] ? parseNumber(contextMatch[1]) : null;
  const outputMatch = html.match(/(\d[\d,]+)<!--\s*-->\s*max output tokens/i);
  const output = outputMatch?.[1] ? parseNumber(outputMatch[1]) : null;

  // Parse knowledge cutoff (optional)
  const cutoffMatch = html.match(/(\w{3}\s+\d{1,2},?\s+\d{4})<!--\s*-->\s*knowledge cutoff/i);
  const knowledge = cutoffMatch?.[1] ? formatKnowledgeDate(cutoffMatch[1]) : undefined;

  // Parse snapshots from the Snapshots section
  const snapshots = extractSnapshots(html, modelId);

  // Derive release_date from the "pointing to" snapshot (current default), or first snapshot
  const releaseDate = deriveReleaseDate(snapshots, modelId);

  // Parse pricing
  const pricing = parsePricing(html, modelId);
  if (!pricing) {
    console.warn(`  ${modelId}: no pricing found`);
    return null;
  }

  const name = deriveName(modelId);
  const family = deriveFamily(modelId);

  return {
    id: modelId,
    name,
    family,
    ...(features.reasoning ? { reasoning: true } : {}),
    ...(features.functionCalling ? { tool_call: true } : {}),
    ...(features.imageInput ? { attachment: true } : {}),
    ...(features.structuredOutputs ? { structured_output: true } : {}),
    ...(modelId.startsWith("gpt-oss") ? { open_weights: true } : {}),
    ...(deprecated ? { deprecated: true } : {}),
    ...(context && output ? { limit: { context, output } } : {}),
    modalities: {
      input: inputModalities,
      output: outputModalities,
    },
    pricing,
    ...(knowledge ? { knowledge } : {}),
    release_date: releaseDate,
    last_updated: releaseDate,
    ...(snapshots.length > 0 ? { snapshots } : {}),
  };
}

// ---------------------------------------------------------------------------
// Pricing parser
// ---------------------------------------------------------------------------

function parsePricing(html: string, modelId: string): Pricing | null {
  // Token pricing: <div>Input</div><div class="...">$5.00</div>
  const inputPriceMatch = html.match(/<div>Input<\/div><div[^>]*>\$(\d+(?:\.\d+)?)/);
  const outputPriceMatch = html.match(/<div>Output<\/div><div[^>]*>\$(\d+(?:\.\d+)?)/);
  const cachedPriceMatch = html.match(/<div>Cached input<\/div><div[^>]*>\$(\d+(?:\.\d+)?)/);

  if (inputPriceMatch && outputPriceMatch) {
    const inputVal = inputPriceMatch[1];
    const outputVal = outputPriceMatch[1];
    if (!inputVal || !outputVal) return null;
    return {
      input: parseFloat(inputVal),
      output: parseFloat(outputVal),
      ...(cachedPriceMatch?.[1] ? { cache_read: parseFloat(cachedPriceMatch[1]) } : {}),
    };
  }

  // Resolution + price pattern (shared by dall-e-3 and sora-2)
  const perImageContexts = html.match(
    /(\d+x\d+)<\/div><div class="text-2xl font-semibold">\$(\d+(?:\.\d+)?)/g,
  );
  if (perImageContexts && perImageContexts.length > 0) {
    const firstPrice = perImageContexts[0].match(/\$(\d+(?:\.\d+)?)/);
    if (firstPrice?.[1]) {
      const price = parseFloat(firstPrice[1]);
      if (modelId.startsWith("sora")) {
        return { unit: "per_second", price };
      }
      return { unit: "per_image", price };
    }
  }

  // Single-rate pricing (embedding, TTS, whisper):
  // <div>Cost</div><div class="text-2xl font-semibold">$0.13</div>
  const costMatch = html.match(
    /<div>Cost<\/div><div class="text-2xl font-semibold">\$(\d+(?:\.\d+)?)/,
  );
  if (costMatch?.[1]) {
    const price = parseFloat(costMatch[1]);
    return { input: price, output: price };
  }

  // Free models (moderation)
  if (modelId.includes("moderation")) {
    return { unit: "free" };
  }

  // Models with no pricing section on their detail page (gpt-image-2, gpt-oss)
  return { unit: "free" };
}

// ---------------------------------------------------------------------------
// Feature extraction
// ---------------------------------------------------------------------------

interface Features {
  reasoning: boolean;
  functionCalling: boolean;
  structuredOutputs: boolean;
  imageInput: boolean;
}

function extractFeatures(html: string): Features {
  const featurePattern =
    /<div class="text-sm font-semibold[^"]*">(.*?)<\/div><div class="text-xs text-tertiary">(.*?)<\/div>/g;

  const supported = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = featurePattern.exec(html)) !== null) {
    const name = match[1]?.trim();
    const status = match[2]?.trim();
    if (!name || !status) continue;
    if (status === "Supported") {
      supported.add(name);
    }
  }

  return {
    reasoning:
      supported.has("Reasoning token support") || html.includes("Reasoning token support</div>"),
    functionCalling: supported.has("Function calling"),
    structuredOutputs: supported.has("Structured outputs"),
    imageInput: supported.has("Image input"),
  };
}

function extractModalities(html: string): {
  input: ModelModality[];
  output: ModelModality[];
} {
  const input: ModelModality[] = ["text"];
  const output: ModelModality[] = ["text"];

  const modalityPattern =
    /<div class="text-sm font-semibold(?:\s+text-gray-400)?">(Text|Image|Audio|Video)<\/div>/g;

  let match: RegExpExecArray | null;
  while ((match = modalityPattern.exec(html)) !== null) {
    const fullMatch = match[0];
    const isDisabled = fullMatch.includes("text-gray-400");
    if (isDisabled) continue;

    const modalityName = match[1]?.toLowerCase() as ModelModality | undefined;
    if (!modalityName) continue;
    const modalityEnd = match.index + match[0].length;

    const ahead = html.slice(modalityEnd, modalityEnd + 200);
    const directionMatch = ahead.match(/Input and output|Input only|Output only/i);

    if (!directionMatch) continue;

    const direction = directionMatch[0].toLowerCase();

    if (direction.includes("input") && modalityName !== "text") {
      input.push(modalityName);
    }
    if (direction.includes("output") && modalityName !== "text") {
      output.push(modalityName);
    }
  }

  return { input, output };
}

// ---------------------------------------------------------------------------
// Snapshot extraction
// ---------------------------------------------------------------------------

interface SnapshotEntry {
  id: string;
  deprecated?: boolean;
}

function extractSnapshots(html: string, modelId: string): SnapshotEntry[] {
  const snapshotSectionIdx = html.indexOf("Snapshots");
  if (snapshotSectionIdx === -1) return [];

  const rateLimitsIdx = html.indexOf("Rate limits", snapshotSectionIdx);
  const sectionEnd = rateLimitsIdx !== -1 ? rateLimitsIdx : html.length;
  const section = html.slice(snapshotSectionIdx, sectionEnd);

  // The snapshot section has two parts:
  // 1. Header: model icon + model name + "pointing to" snapshot ID + optional Deprecated badge
  // 2. List: snapshot IDs with colored dots

  // Extract "pointing to" snapshot IDs (header entries with arrow icon)
  const pointingIds: string[] = [];
  const pointingPattern = /clip-rule="evenodd"><\/path><\/svg><div>([^<]+)<\/div>/g;
  let pMatch: RegExpExecArray | null;
  while ((pMatch = pointingPattern.exec(section)) !== null) {
    const id = pMatch[1]?.trim();
    if (!id) continue;
    // Exclude the model name itself (it appears as a header, not a snapshot)
    if (id !== modelId) {
      pointingIds.push(id);
    }
  }

  // Extract list snapshot IDs (entries with colored dots)
  const listIds: string[] = [];
  const listPattern = /rounded-full bg-[^"]+"><\/div><\/div>([^<]+)<\/div>/g;
  let lMatch: RegExpExecArray | null;
  while ((lMatch = listPattern.exec(section)) !== null) {
    const id = lMatch[1]?.trim();
    if (!id) continue;
    // Exclude the model name itself
    if (id !== modelId) {
      listIds.push(id);
    }
  }

  // Combine: "pointing to" IDs first (these are the current/default), then list IDs
  const seen = new Set<string>(pointingIds);
  const allIds = [...pointingIds, ...listIds.filter((id) => !seen.has(id))];

  if (allIds.length === 0) return [];

  // Check for deprecated badges in the snapshot section
  const snapshots: SnapshotEntry[] = allIds.map((id) => {
    const idIdx = section.indexOf(id);
    if (idIdx === -1) return { id };

    // Search for "Deprecated" within a window after the ID.
    // The "pointing to" header entry has the badge in a sibling div after the ID,
    // so we need a generous window. The next snapshot ID marks a natural boundary.
    const afterId = section.slice(idIdx + id.length, idIdx + id.length + 500);
    const nextSnapshotIdx = afterId.search(/rounded-full bg-|clip-rule="evenodd/);
    const window = nextSnapshotIdx !== -1 ? afterId.slice(0, nextSnapshotIdx) : afterId;

    return {
      id,
      ...(window.includes("Deprecated") ? { deprecated: true } : {}),
    };
  });

  return snapshots;
}

function deriveReleaseDate(snapshots: SnapshotEntry[], _modelId: string): string {
  // Try to extract date from the first (current) snapshot ID
  if (snapshots.length > 0) {
    const first = snapshots[0];
    if (first) {
      const date = extractDateFromSnapshotId(first.id);
      if (date) return date;
    }
  }

  return "unknown";
}

function extractDateFromSnapshotId(snapshotId: string): string | null {
  // Full date format: model-YYYY-MM-DD
  const fullMatch = snapshotId.match(/-(\d{4})-(\d{2})-(\d{2})$/);
  if (fullMatch) {
    return `${fullMatch[1]}-${fullMatch[2]}-${fullMatch[3]}`;
  }

  // Short date format: model-MMDD (e.g., gpt-3.5-turbo-0125, gpt-4-0613)
  const shortMatch = snapshotId.match(/-(\d{2})(\d{2})$/);
  if (shortMatch) {
    // Can't determine year from the ID alone — return null so caller uses "unknown"
    return null;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Name/family derivation
// ---------------------------------------------------------------------------

function deriveName(modelId: string): string {
  if (modelId.startsWith("gpt-oss-")) {
    return `GPT-OSS ${modelId.slice(8)}`;
  }

  if (modelId.startsWith("gpt-")) {
    const rest = modelId.slice(4);
    const formatted = rest
      .replace(/^(o?\d+(?:\.\d+)?)/, (m) => m.toUpperCase())
      .replace(/-pro$/, " Pro")
      .replace(/-mini$/, " mini")
      .replace(/-nano$/, " nano")
      .replace(/-preview$/, " Preview")
      .replace(/-codex$/, " Codex")
      .replace(/-chat-latest$/, " Chat Latest")
      .replace(/-/, " ");
    return `GPT-${formatted}`;
  }

  if (modelId.startsWith("o")) {
    return modelId
      .replace(/-pro$/, " Pro")
      .replace(/-mini$/, " mini")
      .replace(/-deep-research$/, " Deep Research")
      .replace(/-preview$/, " Preview")
      .replace(/-/, " ");
  }

  // Non-chat models: use the ID as-is with basic cleanup
  return modelId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveFamily(modelId: string): string {
  if (modelId.startsWith("gpt-oss-")) return "gpt-oss";

  if (modelId.startsWith("gpt-")) {
    if (modelId.match(/^gpt-\d+(?:\.\d+)?-codex/)) return "gpt-codex";
    if (modelId.match(/^gpt-\d+(?:\.\d+)?-chat/)) return "gpt-chat";

    const match = modelId.match(/^gpt-(\d+)(o)?/);
    if (match?.[1]) {
      return match[2] ? "gpt-o" : "gpt";
    }
  }

  if (modelId.startsWith("o")) {
    if (modelId.includes("deep-research")) return "o-deep-research";

    const match = modelId.match(/^o\d+/);
    if (match) return "o";
  }

  // Non-chat model families
  if (modelId.startsWith("dall-e")) return "dall-e";
  if (modelId.startsWith("sora")) return "sora";
  if (modelId.startsWith("tts")) return "tts";
  if (modelId.startsWith("whisper")) return "whisper";
  if (modelId.startsWith("text-embedding")) return "text-embedding";
  if (modelId.includes("moderation")) return "moderation";
  if (modelId.startsWith("codex")) return "codex";
  if (modelId.startsWith("chatgpt")) return "chatgpt";
  if (modelId.startsWith("computer-use")) return "computer-use";
  if (modelId.startsWith("gpt-realtime")) return "gpt-realtime";
  if (modelId.startsWith("gpt-image")) return "gpt-image";
  if (modelId.startsWith("gpt-audio")) return "gpt-audio";
  if (modelId === "babbage-002" || modelId === "davinci-002") return "legacy";

  return modelId;
}

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

function parseNumber(text: string): number {
  return parseInt(text.replace(/,/g, ""), 10);
}

function formatKnowledgeDate(dateStr: string): string | undefined {
  const months: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const match = dateStr.match(/(\w{3})\s+(\d{1,2}),?\s+(\d{4})/);
  if (!match?.[1] || !match[3]) return undefined;

  const mm = months[match[1]];
  if (!mm) return undefined;
  return `${match[3]}-${mm}`;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
