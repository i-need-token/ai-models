import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type {
  Model,
  ModelModality,
  ModalityPrice,
  Pricing,
  ResolutionPrice,
  TokenPrice,
} from "../../types/index";

const provider = defineProvider({
  id: "google",
  name: "Google",
  url: "https://ai.google.dev",
  api_docs: "https://ai.google.dev/gemini-api/docs",
  apis: {
    google: "https://generativelanguage.googleapis.com",
  },
});

// ---------------------------------------------------------------------------
// URLs — use .md.txt format for clean markdown parsing
// ---------------------------------------------------------------------------

const MODELS_INDEX_URL = "https://ai.google.dev/gemini-api/docs/models.md.txt";
const MODELS_BASE_URL = "https://ai.google.dev/gemini-api/docs/models";
const PRICING_URL = "https://ai.google.dev/gemini-api/docs/pricing.md.txt";

// ---------------------------------------------------------------------------
// Model discovery
// ---------------------------------------------------------------------------

interface DiscoveredModel {
  slug: string;
  deprecated: boolean;
  shutdown: boolean;
}

async function discoverModels(): Promise<DiscoveredModel[]> {
  const md = await fetchPage(MODELS_INDEX_URL);
  const seen = new Set<string>();
  const models: DiscoveredModel[] = [];

  // Extract model slugs from markdown links
  // Format 1 (table): [Model Name](https://ai.google.dev/gemini-api/docs/models/<slug>)
  // Format 2 (list): [### Model Name\n...](https://ai.google.dev/gemini-api/docs/models/<slug>)
  const linkPattern = /\[[^\]]*\]\(https:\/\/ai\.google\.dev\/gemini-api\/docs\/models\/([^)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(md)) !== null) {
    const slug = match[1]!;
    if (!slug || slug.includes("#") || slug.includes("?") || seen.has(slug)) continue;
    seen.add(slug);
    models.push({ slug, deprecated: false, shutdown: false });
  }

  // Detect deprecated/shut down models from link text
  // Format: [Gemini 2.0 Flash Deprecated](url) or [Gemini 3 Pro Preview Shut down](url)
  const statusLinkPattern =
    /\[([^\]]*?)\s+(Deprecated|Shut down)\s*\]\(https:\/\/ai\.google\.dev\/gemini-api\/docs\/models\/([^)]+)\)/gi;
  while ((match = statusLinkPattern.exec(md)) !== null) {
    const status = match[2]!.toLowerCase();
    const slug = match[3]!;
    const found = models.find((m) => m.slug === slug);
    if (found) {
      found.deprecated = status === "deprecated";
      found.shutdown = status === "shut down";
    }
  }

  return models.sort((a, b) => a.slug.localeCompare(b.slug));
}

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const discovered = await discoverModels();
  const activeCount = discovered.filter((m) => !m.deprecated && !m.shutdown).length;
  const deprecatedCount = discovered.filter((m) => m.deprecated).length;
  const shutdownCount = discovered.filter((m) => m.shutdown).length;
  console.log(
    `  Discovered ${activeCount} active + ${deprecatedCount} deprecated + ${shutdownCount} shut down models`,
  );

  // Fetch pricing page (markdown format)
  const pricingMd = await fetchPage(PRICING_URL);
  const pricingByModelId = parsePricingPage(pricingMd);

  // Discover additional models from pricing page that aren't in the index
  const discoveredSlugs = new Set(
    discovered.filter((m) => !m.deprecated && !m.shutdown).map((m) => m.slug),
  );
  const pricingOnlySlugs: string[] = [];
  for (const modelId of pricingByModelId.keys()) {
    if (!discoveredSlugs.has(modelId)) {
      pricingOnlySlugs.push(modelId);
    }
  }
  if (pricingOnlySlugs.length > 0) {
    console.log(
      `  Found ${pricingOnlySlugs.length} additional models from pricing page: ${pricingOnlySlugs.join(", ")}`,
    );
  }

  // Scrape each model detail page (also .md.txt format)
  const models: Model[] = [];
  const seenModelIds = new Set<string>();

  for (const { slug, deprecated, shutdown } of discovered) {
    if (shutdown || deprecated) {
      console.log(`  ${slug}: ${shutdown ? "shut down" : "deprecated"}, skipping`);
      continue;
    }

    try {
      const md = await fetchPage(`${MODELS_BASE_URL}/${slug}.md.txt`);
      const detailModels = parseModelPage(md, slug, deprecated);
      for (const detail of detailModels) {
        const pricing = pricingByModelId.get(detail.id);
        if (!pricing) {
          console.warn(`  ${detail.id}: no pricing found, using free`);
        }
        models.push(
          defineModel({
            ...detail,
            pricing: pricing || { unit: "free" },
          }),
        );
        seenModelIds.add(detail.id);

        // Promote snapshots that have their own pricing to independent models
        if (detail.snapshots) {
          for (const snap of detail.snapshots) {
            if (snap.id.includes("customtools")) continue;
            const snapPricing = pricingByModelId.get(snap.id);
            if (snapPricing && !seenModelIds.has(snap.id)) {
              seenModelIds.add(snap.id);
              const snapModel: Model = {
                id: snap.id,
                name: deriveName(snap.id, snap.id),
                family: deriveFamily(snap.id),
                temperature: true,
                ...(detail.reasoning ? { reasoning: true } : {}),
                ...(detail.tool_call ? { tool_call: true } : {}),
                ...(detail.attachment ? { attachment: true } : {}),
                ...(detail.structured_output ? { structured_output: true } : {}),
                modalities: detail.modalities,
                pricing: snapPricing,
                release_date: detail.release_date,
                last_updated: detail.last_updated,
              };
              models.push(defineModel(snapModel));
              console.log(`  ${snap.id}: promoted from snapshot (has pricing)`);
            }
          }
        }
      }
    } catch (err) {
      console.warn(`  Failed to scrape ${slug}:`, err);
    }
  }

  // Add pricing-only models (no detail page, create from pricing data)
  const deprecatedPrefixes = ["gemini-2.0-", "veo-2.0-", "veo-3.0-"];
  for (const modelId of pricingOnlySlugs) {
    if (seenModelIds.has(modelId)) continue;
    if (modelId.includes("customtools")) continue;
    if (deprecatedPrefixes.some((p) => modelId.startsWith(p))) continue;
    const pricing = pricingByModelId.get(modelId)!;
    const modalities = guessModalities(modelId);
    models.push(
      defineModel({
        id: modelId,
        name: deriveName(modelId, modelId),
        family: deriveFamily(modelId),
        temperature: true,
        ...(hasImageInput(modalities.input) ? { attachment: true } : {}),
        modalities,
        pricing,
        release_date: "unknown",
        last_updated: "unknown",
      }),
    );
    console.log(`  ${modelId}: added from pricing page (no detail page)`);
  }

  return { provider, models };
}

// ---------------------------------------------------------------------------
// Page fetching
// ---------------------------------------------------------------------------

async function fetchPage(url: string): Promise<string> {
  const resp = await fetch(url, {
    redirect: "follow",
    headers: {
      "Accept-Language": "en",
    },
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch ${url}: ${resp.status}`);
  }
  return resp.text();
}

// ---------------------------------------------------------------------------
// Model detail page parser (markdown format)
// ---------------------------------------------------------------------------

function parseModelPage(md: string, slug: string, indexDeprecated: boolean): Model[] {
  let modelIds: string[] = [];
  let inputModalities: ModelModality[] = ["text"];
  let outputModalities: ModelModality[] = ["text"];
  let contextLimit: number | null = null;
  let outputLimit: number | null = null;
  const capabilities = new Map<string, boolean>();
  let versions: string[] = [];
  let latestUpdate = "";
  let knowledgeCutoff = "";

  // Parse the property table
  // Format: | Property | Description |
  const rows = md.split("\n").filter((l) => l.startsWith("|") && !l.includes("---"));

  for (const row of rows) {
    const cols = row
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cols.length < 2) continue;

    const property = cols[0]!.toLowerCase();
    const description = cols[1]!;

    switch (property) {
      case "model code":
      case "agent code":
        // Extract all backtick-enclosed model IDs
        modelIds = [...description.matchAll(/`([^`]+)`/g)].map((m) => m[1]!);
        break;

      case "supported data types": {
        // Parse "**Inputs** Text, images, video, audio **Output** Text"
        const inputMatch = description.match(/\*\*Inputs?\*\*\s*(.+?)(?=\*\*Output|\s*$)/i);
        if (inputMatch) inputModalities = parseModalityList(inputMatch[1]!);
        const outputMatch = description.match(/\*\*Outputs?\*\*\s*(.+)/i);
        if (outputMatch) outputModalities = parseModalityList(outputMatch[1]!);
        break;
      }

      case "token limits": {
        // Parse "**Input token limit** 1,048,576 **Output token limit** 65,536"
        const inputMatch = description.match(/\*\*Input token limit\*\*\s*([\d,]+)/i);
        if (inputMatch?.[1]) contextLimit = parseInt(inputMatch[1].replace(/,/g, ""), 10);
        const outputMatch = description.match(/\*\*Output token limit\*\*\s*([\d,]+)/i);
        if (outputMatch?.[1]) outputLimit = parseInt(outputMatch[1].replace(/,/g, ""), 10);
        break;
      }

      case "capabilities": {
        // Parse "**Audio generation** Not supported **Batch API** Supported ..."
        const capPattern = /\*\*([^*]+)\*\*\s*(Supported|Not supported)/gi;
        let capMatch: RegExpExecArray | null;
        while ((capMatch = capPattern.exec(description)) !== null) {
          capabilities.set(capMatch[1]!.trim(), capMatch[2]!.toLowerCase() === "supported");
        }
        break;
      }

      case "versions": {
        // Parse "- Stable: `gemini-2.5-flash` - Shut down: `...`"
        // or "- `Stable: gemini-2.5-pro` - `Preview: gemini-3-flash-preview`"
        // Prefixes may be inside or outside the backticks
        const versionCodes = [...description.matchAll(/`([^`]+)`/g)].map((m) => {
          let id = m[1]!.trim();
          // Strip known prefixes that appear inside backticks
          id = id.replace(/^(Stable|Preview|Shut down|Deprecated):\s*/i, "");
          return id;
        });
        // Filter out shut-down/deprecated versions (prefix outside backticks)
        versions = [];
        const parts = description.split(/`[^`]+`/);
        for (let i = 0; i < versionCodes.length; i++) {
          const prefix = (parts[i] || "").trim();
          if (/\b(Shut down|Deprecated)\s*:\s*$/i.test(prefix)) continue;
          versions.push(versionCodes[i]!);
        }
        break;
      }

      case "latest update":
        latestUpdate = description.trim();
        break;

      case "knowledge cutoff":
        knowledgeCutoff = description.trim();
        break;
    }
  }

  if (modelIds.length === 0) {
    console.warn(`  ${slug}: no model IDs found`);
    return [];
  }

  const primaryId = modelIds[0]!;
  const name = deriveName(primaryId, slug);
  const family = deriveFamily(primaryId);
  const releaseDate = formatGoogleDate(latestUpdate) || "unknown";
  const knowledge = formatGoogleDate(knowledgeCutoff);

  const baseModel: Model = {
    id: primaryId,
    name,
    family,
    ...(capabilities.get("Thinking") ? { reasoning: true } : {}),
    temperature: true,
    ...(capabilities.get("Function calling") ? { tool_call: true } : {}),
    ...(hasImageInput(inputModalities) ? { attachment: true } : {}),
    ...(capabilities.get("Structured outputs") ? { structured_output: true } : {}),
    ...(isOpenWeights(primaryId) ? { open_weights: true } : {}),
    ...(indexDeprecated ? { deprecated: true } : {}),
    ...(contextLimit && outputLimit
      ? { limit: { context: contextLimit, output: outputLimit } }
      : {}),
    modalities: {
      input: inputModalities,
      output: outputModalities,
    },
    pricing: { unit: "free" },
    ...(knowledge ? { knowledge } : {}),
    release_date: releaseDate,
    last_updated: releaseDate,
  };

  // Additional model IDs become snapshots
  const snapshots = modelIds.slice(1).map((id) => ({ id }));

  // Versions become snapshots too (excluding the primary ID and shut down versions)
  for (const ver of versions) {
    if (ver !== primaryId && !snapshots.some((s) => s.id === ver)) {
      snapshots.push({ id: ver });
    }
  }

  if (snapshots.length > 0) {
    baseModel.snapshots = snapshots;
  }

  return [baseModel];
}

function parseModalityList(text: string): ModelModality[] {
  const modalityMap: Record<string, ModelModality> = {
    text: "text",
    texts: "text",
    image: "image",
    images: "image",
    video: "video",
    audio: "audio",
    pdf: "pdf",
    pdfs: "pdf",
  };
  const result: ModelModality[] = [];
  const words = text.toLowerCase().split(/[\s,]+/);
  for (const word of words) {
    const mod = modalityMap[word];
    if (mod && !result.includes(mod)) result.push(mod);
  }
  return result.length > 0 ? result : ["text"];
}

function hasImageInput(modalities: ModelModality[]): boolean {
  return modalities.includes("image") || modalities.includes("video") || modalities.includes("pdf");
}

function isOpenWeights(modelId: string): boolean {
  return modelId.startsWith("gemma-");
}

function guessModalities(modelId: string): { input: ModelModality[]; output: ModelModality[] } {
  if (modelId.startsWith("veo-")) return { input: ["text", "image"], output: ["video", "audio"] };
  if (modelId.startsWith("imagen-")) return { input: ["text"], output: ["image"] };
  if (modelId.startsWith("lyria-")) {
    if (modelId.includes("realtime")) return { input: ["text"], output: ["audio"] };
    return { input: ["text", "image"], output: ["audio", "text"] };
  }
  return { input: ["text"], output: ["text"] };
}

// ---------------------------------------------------------------------------
// Pricing page parser (markdown format)
// ---------------------------------------------------------------------------

function parsePricingPage(md: string): Map<string, Pricing> {
  const result = new Map<string, Pricing>();

  // Split by ## headings (each model section starts with ##)
  const sections = md.split(/^## /m).slice(1);

  for (const section of sections) {
    const title = section.split("\n")[0]!.trim();

    // Skip non-model sections
    if (
      title === "Pricing for tools" ||
      title === "Pricing for agents" ||
      title === "Notes" ||
      title === "Free" ||
      title === "Paid" ||
      title === "Enterprise"
    ) {
      continue;
    }

    // Extract model IDs from italic code section:
    // *`model-id-1`, `model-id-2`* or *`model-id-1` and `model-id-2`*
    // First find the italic code block, then extract all backtick-enclosed IDs
    let modelIds: string[] = [];
    const italicCodeMatch = section.match(/\*((?:`[^`]+`[\s,]*(?:and\s*)?)+)\*/);
    if (italicCodeMatch) {
      const codeBlock = italicCodeMatch[1]!;
      modelIds = [...codeBlock.matchAll(/`([^`]+)`/g)].map((m) => m[1]!.trim());
    }
    if (modelIds.length === 0) continue;

    // Skip deprecated models (2.0 Flash, 2.0 Flash-Lite)
    if (modelIds.every((id) => id.startsWith("gemini-2.0-"))) continue;

    // Skip Gemma 4 (no model ID, no paid pricing)
    if (title === "Gemma 4") continue;

    // Determine pricing type
    const isEmbedding = modelIds.some((id) => id.includes("embedding"));
    const isImagen = modelIds.some((id) => id.startsWith("imagen-"));
    const isVeo = modelIds.some((id) => id.startsWith("veo-"));
    const isLyria = modelIds.some((id) => id.startsWith("lyria-"));

    if (isImagen) {
      parseImagenPricing(section, modelIds, result);
    } else if (isVeo) {
      parseVeoPricing(section, modelIds, result);
    } else if (isLyria) {
      parseLyriaPricing(section, modelIds, result);
    } else if (isEmbedding) {
      parseEmbeddingPricing(section, modelIds, result);
    } else {
      // Token-based pricing (Gemini models)
      for (const modelId of modelIds) {
        const pricing = parseGeminiPricing(section, modelId);
        if (pricing) {
          result.set(modelId, pricing);
        }
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Gemini token-based pricing parser (markdown)
// ---------------------------------------------------------------------------

function parseGeminiPricing(section: string, modelId: string): Pricing | null {
  // Find the "Standard" subsection table (first table after ### Standard)
  const standardSection = section.split(/### Standard/)[1];
  if (!standardSection) {
    // Some models only have one table (no Standard/Batch/Flex subsections)
    return parseGeminiPricingTable(section, modelId);
  }

  // Get content up to the next ### heading
  const tableContent = standardSection.split(/### /)[0]!;
  return parseGeminiPricingTable(tableContent, modelId);
}

function parseGeminiPricingTable(tableContent: string, modelId: string): Pricing | null {
  let inputPrice: TokenPrice | null = null;
  let outputPrice: TokenPrice | null = null;
  let cacheReadPrice: TokenPrice | null = null;

  // Parse markdown table rows
  const rows = tableContent.split("\n").filter((l) => l.startsWith("|") && !l.includes("---"));

  for (const row of rows) {
    const cols = row
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cols.length < 3) continue;

    const label = cols[0]!.toLowerCase();
    const paidText = cols[cols.length - 1]!;

    // Skip non-pricing rows
    if (
      label.includes("used to improve") ||
      label.includes("grounding") ||
      label.includes("tuning") ||
      label.includes("image generation")
    )
      continue;

    // Input price
    if (
      label.includes("input") &&
      !label.startsWith("audio input") &&
      !label.startsWith("video input") &&
      !label.startsWith("image input") &&
      !label.startsWith("text input")
    ) {
      const modalityInput = extractModalityPrice(paidText);
      inputPrice = modalityInput ?? extractTokenPrice(paidText);
    }
    // Output price
    else if (label.includes("output") && !label.includes("audio") && !label.includes("video")) {
      // Check for "per image" pricing (e.g., gemini-2.5-flash-image)
      const perImageMatch = paidText.match(/\$([\d.]+)\s+per\s+image/i);
      if (perImageMatch) {
        // Use UnitPricing for per-image output models
        return { unit: "per_image", price: parseFloat(perImageMatch[1]) };
      }
      const modalityOutput = extractModalityPrice(paidText);
      outputPrice = modalityOutput ?? extractTokenPrice(paidText);
    }
    // Context caching read price
    else if (label.includes("context caching") && !label.includes("storage")) {
      const modalityCache = extractModalityPrice(paidText);
      cacheReadPrice = modalityCache ?? extractTokenPrice(paidText);
    }
  }

  if (inputPrice !== null && outputPrice !== null) {
    const pricing: Pricing = { input: inputPrice, output: outputPrice };
    if (cacheReadPrice !== null) {
      pricing.cache_read = cacheReadPrice;
    }
    return pricing;
  }

  if (inputPrice !== null && modelId.includes("embedding")) {
    return { input: inputPrice, output: inputPrice };
  }

  return null;
}

/**
 * Extract modality-split price from a paid text string.
 * Matches patterns like "$12.00 (text and thinking) $120.00 (images)"
 * Also handles "or $X/min" variants: "$3.00 or $0.005/min (audio)"
 * Returns a ModalityPrice if at least 2 modalities found, null otherwise.
 */
function extractModalityPrice(text: string): ModalityPrice | null {
  // Match $price (modality list) segments, ignoring "or $X/min" variants
  const segments = [...text.matchAll(/\$([\d.]+)(?:\s+or\s+\$[\d.]+\/min)?\s*\(([^)]+)\)/g)];
  if (segments.length < 2) return null;

  const result: ModalityPrice = {};
  for (const seg of segments) {
    const price = parseFloat(seg[1]!);
    const modalityText = seg[2]!.toLowerCase();
    if (modalityText.includes("text") || modalityText.includes("thinking")) {
      result.text = price;
    }
    if (modalityText.includes("image")) {
      result.image = price;
    }
    if (modalityText.includes("audio")) {
      result.audio = price;
    }
    if (modalityText.includes("video")) {
      result.video = price;
    }
  }

  return Object.keys(result).length >= 2 ? result : null;
}

/**
 * Extract token price from a paid text string.
 * Handles three patterns:
 *   1. Fixed price: "$0.30" or "$0.30 (text / image / video) $1.00 (audio)"
 *   2. Tiered pricing: "$1.25, prompts <= 200k tokens; $2.50, prompts > 200k tokens"
 *   3. Mixed: "$0.50 (text) $3.00 (audio / video)"
 *
 * For fixed/mixed prices, returns the first (lowest) number.
 * For tiered pricing, returns a ContextTierPrice array.
 */
function extractTokenPrice(text: string): TokenPrice | null {
  // Check for tiered pricing: "$1.25, prompts <= 200k tokens $2.50, prompts > 200k tokens"
  // or: "$10.00, prompts <= 200k tokens $15.00, prompts > 200k"
  const tierPattern = /\$([\d.]+)[^$]*?<=\s*([\d,]+)\s*k[^$]*\$([\d.]+)[^$]*?>\s*([\d,]+)\s*k/i;
  const tierMatch = tierPattern.exec(text);
  if (tierMatch) {
    const lowerPrice = parseFloat(tierMatch[1]!);
    const lowerBound = parseInt(tierMatch[2]!.replace(/,/g, ""), 10) * 1000;
    const higherPrice = parseFloat(tierMatch[3]!);
    return [{ up_to: lowerBound, inclusive: true, price: lowerPrice }, { price: higherPrice }];
  }

  // Fixed price: extract the first dollar amount
  const match = text.match(/\$([\d.]+)/);
  if (match?.[1]) {
    return parseFloat(match[1]);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Imagen per-image pricing parser (markdown)
// ---------------------------------------------------------------------------

function parseImagenPricing(
  section: string,
  modelIds: string[],
  result: Map<string, Pricing>,
): void {
  // Map label keywords to model IDs
  const variantMap: Record<string, string> = {
    fast: modelIds.find((id) => id.includes("fast")) || "",
    standard: modelIds.find((id) => !id.includes("fast") && !id.includes("ultra")) || "",
    ultra: modelIds.find((id) => id.includes("ultra")) || "",
  };

  const rows = section.split("\n").filter((l) => l.startsWith("|") && !l.includes("---"));

  for (const row of rows) {
    const cols = row
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cols.length < 3) continue;

    const label = cols[0]!.toLowerCase();
    // Table format: | Price type | Per unit | Price (free) | Price (paid) |
    // Paid price is always the LAST column
    const paidText = cols[cols.length - 1]!;

    if (label.includes("used to improve")) continue;

    // Match "Imagen 4 Fast image price", "Imagen 4 Standard image price", "Imagen 4 Ultra image price"
    for (const [variant, modelId] of Object.entries(variantMap)) {
      if (!modelId) continue;
      if (label.includes(variant) && label.includes("image price")) {
        const match = paidText.match(/\$(\d+(?:\.\d+)?)/);
        if (match?.[1]) {
          result.set(modelId, { unit: "per_image", price: parseFloat(match[1]) });
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Veo per-second pricing parser (markdown)
// ---------------------------------------------------------------------------

function parseVeoPricing(section: string, modelIds: string[], result: Map<string, Pricing>): void {
  // Map label keywords to model IDs
  const variantMap: Record<string, string> = {};
  for (const id of modelIds) {
    if (id.includes("fast")) variantMap["fast"] = id;
    else if (id.includes("lite")) variantMap["lite"] = id;
    else variantMap["standard"] = id;
  }
  if (!variantMap["standard"]) {
    const base = modelIds.find((id) => !id.includes("fast") && !id.includes("lite"));
    if (base) variantMap["standard"] = base;
  }

  const rows = section.split("\n").filter((l) => l.startsWith("|") && !l.includes("---"));

  for (const row of rows) {
    const cols = row
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cols.length < 3) continue;

    const label = cols[0]!.toLowerCase();
    const paidText = cols[cols.length - 1]!;

    if (label.includes("used to improve")) continue;

    const setPricing = (modelId: string) => {
      const resolutionPrice = extractResolutionPrice(paidText);
      if (resolutionPrice) {
        result.set(modelId, { unit: "per_second", price: resolutionPrice });
      } else {
        const match = paidText.match(/\$(\d+(?:\.\d+)?)/);
        if (match?.[1]) {
          result.set(modelId, { unit: "per_second", price: parseFloat(match[1]) });
        }
      }
    };

    // Veo 2: "Video price" (no variant qualifier)
    if (label === "video price" && modelIds.length === 1) {
      setPricing(modelIds[0]!);
      continue;
    }

    // Veo 3/3.1: "Veo 3.1 Standard video with audio price", etc.
    for (const [variant, modelId] of Object.entries(variantMap)) {
      if (!modelId) continue;
      if (label.includes(variant) && label.includes("video") && label.includes("price")) {
        setPricing(modelId);
      }
    }
  }
}

/**
 * Extract resolution-tiered pricing from a Veo paid text string.
 * Matches patterns like "$0.40 (720p and 1080p) $0.60 (4k)"
 * or "$0.10 (720p) $0.12 (1080p) $0.30 (4k)"
 * Returns a ResolutionPrice if multiple resolutions found, null otherwise.
 */
function extractResolutionPrice(text: string): ResolutionPrice | null {
  const result: ResolutionPrice = {};

  // Match each $price (resolution list) segment
  const segments = [...text.matchAll(/\$([\d.]+)\s*\(([^)]+)\)/g)];
  for (const seg of segments) {
    const price = parseFloat(seg[1]!);
    const resText = seg[2]!;

    // Extract resolution strings like "720p", "1080p", "4k"
    const resolutions = [...resText.matchAll(/\b(\d+p|\dk)\b/g)].map((m) => m[1]!);
    for (const res of resolutions) {
      if (["720p", "1024p", "1080p", "2k", "4k"].includes(res)) {
        result[res as keyof ResolutionPrice] = price;
      }
    }
  }

  return Object.keys(result).length >= 2 ? result : null;
}

// ---------------------------------------------------------------------------
// Lyria per-request pricing parser (markdown)
// ---------------------------------------------------------------------------

function parseLyriaPricing(
  section: string,
  modelIds: string[],
  result: Map<string, Pricing>,
): void {
  const variantMap: Record<string, string> = {};
  for (const id of modelIds) {
    if (id.includes("pro")) variantMap["pro"] = id;
    else if (id.includes("clip")) variantMap["clip"] = id;
    else variantMap["base"] = id;
  }

  const rows = section.split("\n").filter((l) => l.startsWith("|") && !l.includes("---"));

  for (const row of rows) {
    const cols = row
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cols.length < 3) continue;

    const label = cols[0]!.toLowerCase();
    // Table format: | Price type | Per unit | Price (free) | Price (paid) |
    // Paid price is always the LAST column
    const paidText = cols[cols.length - 1]!;

    if (label.includes("used to improve")) continue;

    for (const [variant, modelId] of Object.entries(variantMap)) {
      if (!modelId) continue;
      if (label.includes(variant)) {
        const match = paidText.match(/\$(\d+(?:\.\d+)?)/);
        if (match?.[1]) {
          result.set(modelId, { unit: "per_request", price: parseFloat(match[1]) });
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Embedding pricing parser (markdown)
// ---------------------------------------------------------------------------

function parseEmbeddingPricing(
  section: string,
  modelIds: string[],
  result: Map<string, Pricing>,
): void {
  let textInputPrice: number | null = null;
  const modalityPrices: ModalityPrice = {};

  // Find Standard subsection
  const standardSection = section.split(/### Standard/)[1];
  const tableContent = standardSection ? standardSection.split(/### /)[0]! : section;

  const rows = tableContent.split("\n").filter((l) => l.startsWith("|") && !l.includes("---"));

  for (const row of rows) {
    const cols = row
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cols.length < 3) continue;

    const label = cols[0]!.toLowerCase();
    const paidText = cols[cols.length - 1]!;

    if (label.includes("used to improve")) continue;

    const price = extractTokenPrice(paidText);
    if (price === null) continue;

    if (
      label === "text input price" ||
      label === "text input" ||
      (label === "input price" && modelIds.some((id) => id.includes("embedding-001")))
    ) {
      textInputPrice = price;
    }
    if (label.includes("image") && label.includes("input")) modalityPrices.image = price as number;
    if (label.includes("audio") && label.includes("input")) modalityPrices.audio = price as number;
    if (label.includes("video") && label.includes("input")) modalityPrices.video = price as number;
  }

  if (textInputPrice !== null) {
    // If we have modality-specific prices, use ModalityPrice for input
    const inputPrice: TokenPrice =
      Object.keys(modalityPrices).length > 0
        ? { text: textInputPrice, ...modalityPrices }
        : textInputPrice;
    for (const modelId of modelIds) {
      result.set(modelId, { input: inputPrice, output: textInputPrice });
    }
  }
}

// ---------------------------------------------------------------------------
// Name/family derivation
// ---------------------------------------------------------------------------

function deriveName(modelId: string, _slug: string): string {
  if (modelId.startsWith("gemini-")) {
    // Special cases first (before regex matching)
    if (modelId.includes("computer-use")) {
      const v = modelId.match(/^gemini-(\d+(?:\.\d+)?)/)?.[1] ?? "2.5";
      return `Gemini ${v} Computer Use Preview`;
    }
    if (modelId.includes("native-audio")) {
      const v = modelId.match(/^gemini-(\d+(?:\.\d+)?)/)?.[1] ?? "2.5";
      return `Gemini ${v} Flash Live Preview`;
    }
    if (modelId.includes("embedding-2")) return "Gemini Embedding 2";
    if (modelId.includes("embedding-001")) return "Gemini Embedding";
    if (modelId.includes("robotics-er-1.6")) return "Gemini Robotics-ER 1.6 Preview";
    if (modelId.includes("robotics-er-1.5")) return "Gemini Robotics-ER 1.5 Preview";
    if (modelId.includes("robotics")) return "Gemini Robotics-ER Preview";

    // Longer alternatives first to prevent "flash" from matching before "flash-lite" etc.
    const match = modelId.match(
      /^gemini-(\d+(?:\.\d+)?)-(pro-tts|pro-image|flash-lite|flash-image|flash-live|flash-tts|flash|pro)/,
    );
    if (match) {
      const version = match[1]!;
      const tier = match[2]!;
      // Map known acronyms to their uppercase form
      const acronymMap: Record<string, string> = { tts: "TTS" };
      const tierName = tier
        .split("-")
        .map((w) => acronymMap[w] ?? w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      let name = `Gemini ${version} ${tierName}`;

      if (modelId.includes("-preview")) name += " Preview";
      if (modelId.includes("-customtools")) name += " CustomTools";
      // TTS suffix not in tier (e.g., gemini-2.5-flash-preview-tts)
      if (!tier.includes("-tts") && (modelId.endsWith("-tts") || modelId.includes("-tts-")))
        name += " TTS";
      return name;
    }

    return modelId;
  }

  if (modelId.startsWith("imagen-")) {
    if (modelId.includes("ultra")) return "Imagen 4 Ultra";
    if (modelId.includes("fast")) return "Imagen 4 Fast";
    return "Imagen 4";
  }

  if (modelId.startsWith("veo-")) {
    const match = modelId.match(/^veo-(\d+(?:\.\d+)?)/);
    const version = match?.[1] ?? "";
    const isPreview = modelId.includes("-preview");
    if (modelId.includes("fast")) return `Veo ${version} Fast${isPreview ? " Preview" : ""}`;
    if (modelId.includes("lite")) return `Veo ${version} Lite${isPreview ? " Preview" : ""}`;
    if (isPreview) return `Veo ${version} Preview`;
    return `Veo ${version}`;
  }

  if (modelId.startsWith("lyria-")) {
    if (modelId.includes("realtime")) return "Lyria RealTime";
    if (modelId.includes("clip")) return "Lyria 3 Clip Preview";
    if (modelId.includes("pro")) return "Lyria 3 Pro Preview";
    return modelId;
  }

  if (modelId.startsWith("deep-research")) {
    if (modelId.includes("max")) return "Deep Research Max Preview";
    if (modelId.includes("pro")) return "Deep Research Pro Preview";
    return "Deep Research Preview";
  }

  return modelId;
}

function deriveFamily(modelId: string): string {
  if (modelId.startsWith("gemini-")) {
    if (modelId.includes("embedding")) return "gemini-embedding";
    if (modelId.includes("robotics")) return "gemini-robotics";
    if (modelId.includes("computer-use")) return "gemini-computer-use";
    if (modelId.includes("native-audio")) return "gemini-native-audio";

    // Longer alternatives first to prevent "flash" matching before "flash-lite" etc.
    const match = modelId.match(
      /^gemini-(\d+(?:\.\d+)?)-(pro-tts|pro-image|flash-lite|flash-image|flash-live|flash-tts|flash|pro)/,
    );
    if (match) {
      const version = match[1]!;
      const tier = match[2]!;
      let family = `gemini-${version}-${tier}`;
      // TTS/Live suffix not captured by regex (e.g., gemini-2.5-flash-preview-tts)
      if (!tier.includes("-tts") && (modelId.endsWith("-tts") || modelId.includes("-tts-")))
        family += "-tts";
      if (!tier.includes("-live") && (modelId.endsWith("-live") || modelId.includes("-live-")))
        family += "-live";
      return family;
    }
    return "gemini";
  }

  if (modelId.startsWith("imagen-")) return "imagen";
  if (modelId.startsWith("veo-")) return "veo";
  if (modelId.startsWith("lyria-")) return "lyria";
  if (modelId.startsWith("deep-research")) return "deep-research";

  return modelId;
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

function formatGoogleDate(dateStr: string): string | null {
  if (!dateStr) return null;

  const months: Record<string, string> = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  const match = dateStr.match(/(\w+)\s+(\d{4})/);
  if (!match?.[1] || !match[2]) return null;

  const month = months[match[1]];
  if (!month) return null;
  return `${match[2]}-${month}`;
}
