import { defineProvider, runPipeline } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type {
  ScrapePipeline,
  DiscoveredModel,
  ExtractedLimit,
  ExtractedModalities,
  ExtractedFeatures,
  ExtractedDates,
} from "../../scripts/lib/index";
import type { ModelModality, Pricing } from "../../types/index";

const provider = defineProvider({
  id: "cohere",
  name: "Cohere",
  url: "https://cohere.com",
  api_docs: "https://docs.cohere.com",
  apis: {
    openai: "https://api.cohere.com",
  },
});

// ---------------------------------------------------------------------------
// URLs — Fern docs provide .md endpoints for clean Markdown
// ---------------------------------------------------------------------------

const MODELS_MD_URL = "https://docs.cohere.com/docs/models.md";

/** Map from model ID slug to its doc page .md URL */
function modelDocUrl(slug: string): string {
  return `https://docs.cohere.com/docs/${slug}.md`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchPage(url: string): Promise<string> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
  return resp.text();
}

/** Parse a Markdown table row into cells */
function parseMdTableRow(line: string): string[] {
  return line
    .split("|")
    .map((c) => c.trim())
    .filter(Boolean);
}

/** Parse "256k" / "128K" / "8k" etc. into numeric token count */
function parseTokenCount(val: string): number | undefined {
  const match = val.match(/([\d.]+)\s*[KkMmBb]?/);
  if (!match?.[1]) return undefined;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return undefined;
  if (/[Kk]$/.test(val.trim())) return num * 1_000;
  if (/[Mm]$/.test(val.trim())) return num * 1_000_000;
  if (/[Bb]$/.test(val.trim())) return num * 1_000_000_000;
  return num;
}

/** Parse modality string like "Text, Images" into ModelModality[] */
function parseModalityString(val: string): ModelModality[] {
  const modalities: ModelModality[] = [];
  const lower = val.toLowerCase();
  if (lower.includes("text")) modalities.push("text");
  if (lower.includes("image")) modalities.push("image");
  if (lower.includes("video")) modalities.push("video");
  if (lower.includes("audio")) modalities.push("audio");
  if (lower.includes("pdf")) modalities.push("pdf");
  if (modalities.length === 0) modalities.push("text");
  return modalities;
}

// ---------------------------------------------------------------------------
// Model discovery — parse Markdown tables from docs.cohere.com/docs/models.md
// ---------------------------------------------------------------------------

interface RawModelInfo {
  id: string;
  status: string;
  modalityStr: string;
  contextStr: string;
  outputStr: string;
  section: string; // "command", "embed", "rerank", "audio", "aya"
  deprecated: boolean;
}

async function discoverRawModels(): Promise<RawModelInfo[]> {
  const md = await fetchPage(MODELS_MD_URL);
  const lines = md.split("\n");
  const models: RawModelInfo[] = [];

  let currentSection = "";
  let inTable = false;
  let headers: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] as string;

    // Track current section by headings
    if (/^## Command\b/.test(line)) currentSection = "command";
    else if (/^## Embed\b/.test(line)) currentSection = "embed";
    else if (/^## Rerank\b/.test(line)) currentSection = "rerank";
    else if (/^## Audio\b/.test(line)) currentSection = "audio";
    else if (/^## Aya\b/.test(line)) currentSection = "aya";

    // Detect table header
    if (line.startsWith("|") && line.includes("Model Name")) {
      headers = parseMdTableRow(line);
      inTable = true;
      continue;
    }

    // Skip separator row
    if (inTable && line.match(/^\|[\s-:|]+\|$/)) {
      continue;
    }

    // Parse data rows
    if (inTable && line.startsWith("|")) {
      const cells = parseMdTableRow(line);

      // Extract model ID from backtick-wrapped cell
      const idCell = cells[0] ?? "";
      const idMatch = idCell.match(/`([^`]+)`/);
      if (!idMatch?.[1]) continue;

      const id = idMatch[1];

      // Skip if we already have this model (from a more complete table)
      if (models.some((m) => m.id === id)) continue;

      // Find column indices
      const statusIdx = headers.indexOf("Status");
      const modalityIdx =
        headers.indexOf("Modality") !== -1
          ? headers.indexOf("Modality")
          : headers.indexOf("Modalities");
      const contextIdx = headers.indexOf("Context Length");
      const outputIdx = headers.indexOf("Maximum Output Tokens");

      // Skip tables that don't have model info columns (e.g., platform compatibility tables)
      // But allow tables with just Status (like Audio) - they still have model IDs
      const hasModelInfo =
        contextIdx !== -1 || modalityIdx !== -1 || outputIdx !== -1 || statusIdx !== -1;
      if (!hasModelInfo) continue;

      const status = statusIdx !== -1 ? (cells[statusIdx] ?? "") : "";
      const modalityStr = modalityIdx !== -1 ? (cells[modalityIdx] ?? "") : "";
      const contextStr = contextIdx !== -1 ? (cells[contextIdx] ?? "") : "";
      const outputStr = outputIdx !== -1 ? (cells[outputIdx] ?? "") : "";

      const deprecated =
        status.toLowerCase().includes("deprecated") || status.toLowerCase().includes("retired");

      models.push({
        id,
        status,
        modalityStr,
        contextStr,
        outputStr,
        section: currentSection,
        deprecated,
      });
    }

    // End of table
    if (inTable && !line.startsWith("|") && line.trim() !== "") {
      inTable = false;
    }
  }

  return models;
}

// ---------------------------------------------------------------------------
// Pricing extraction — parse <ModelShowcase> JSX from individual model .md pages
// ---------------------------------------------------------------------------

/** Model doc page slugs (derived from model IDs) */
const MODEL_DOC_SLUGS: Record<string, string> = {
  "command-a-03-2025": "command-a",
  "command-r7b-12-2024": "command-r7b",
  "command-a-translate-08-2025": "command-a-translate",
  "command-a-reasoning-08-2025": "command-a-reasoning",
  "command-a-vision-07-2025": "command-a-vision",
  "command-r-plus-08-2024": "command-r-plus",
  "command-r-08-2024": "command-r",
  "command-r-plus-04-2024": "command-r-plus",
  "command-r-03-2024": "command-r",
  "command-r-plus": "command-r-plus",
  "command-r": "command-r",
  "command-light": "command-light",
  command: "command",
  "embed-v4.0": "embed-v4",
  "embed-english-v3.0": "embed-english-v3",
  "embed-english-light-v3.0": "embed-english-light-v3",
  "embed-multilingual-v3.0": "embed-multilingual-v3",
  "embed-multilingual-light-v3.0": "embed-multilingual-light-v3",
  "rerank-v4.0-pro": "rerank-v4",
  "rerank-v4.0-fast": "rerank-v4",
  "rerank-v3.5": "rerank-v3-5",
  "rerank-english-v3.0": "rerank-english-v3",
  "rerank-multilingual-v3.0": "rerank-multilingual-v3",
  "cohere-transcribe-03-2026": "transcribe",
  "tiny-aya-global": "tiny-aya",
  "tiny-aya-earth": "tiny-aya",
  "tiny-aya-fire": "tiny-aya",
  "tiny-aya-water": "tiny-aya",
  "c4ai-aya-expanse-32b": "aya-expanse",
  "c4ai-aya-vision-32b": "aya-vision",
};

/** Pricing data extracted from cohere.com/pricing (Sanity CMS, first-party source) */
const HARDCODED_PRICING: Record<string, Pricing> = {
  // Command models — priced per million tokens
  "command-a-03-2025": { input: 2.5, output: 10.0 },
  "command-r7b-12-2024": { input: 0.0375, output: 0.15 },
  "command-a-translate-08-2025": { input: 2.5, output: 10.0 },
  "command-a-reasoning-08-2025": { input: 2.5, output: 10.0 },
  "command-a-vision-07-2025": { input: 2.5, output: 10.0 },
  "command-r-plus-08-2024": { input: 2.5, output: 10.0 },
  "command-r-08-2024": { input: 0.5, output: 2.0 },
  "command-r-plus-04-2024": { input: 2.5, output: 10.0 },
  "command-r-03-2024": { input: 0.5, output: 2.0 },
  "command-light": { input: 0.5, output: 2.0 },
  command: { input: 1.0, output: 2.0 },
  // Embed models — priced per million tokens
  "embed-v4.0": { input: 0.02, output: 0.02 },
  "embed-english-v3.0": { input: 0.02, output: 0.02 },
  "embed-english-light-v3.0": { input: 0.02, output: 0.02 },
  "embed-multilingual-v3.0": { input: 0.02, output: 0.02 },
  "embed-multilingual-light-v3.0": { input: 0.02, output: 0.02 },
  // Rerank models — priced per search query (per_request)
  "rerank-v4.0-pro": { unit: "per_request", price: 0.002 },
  "rerank-v4.0-fast": { unit: "per_request", price: 0.002 },
  "rerank-v3.5": { unit: "per_request", price: 0.002 },
  "rerank-english-v3.0": { unit: "per_request", price: 0.002 },
  "rerank-multilingual-v3.0": { unit: "per_request", price: 0.002 },
  // Audio — priced per second
  "cohere-transcribe-03-2026": { unit: "per_second", price: 0.006 },
  // Aya models
  "tiny-aya-global": { input: 0.0375, output: 0.15 },
  "tiny-aya-earth": { input: 0.0375, output: 0.15 },
  "tiny-aya-fire": { input: 0.0375, output: 0.15 },
  "tiny-aya-water": { input: 0.0375, output: 0.15 },
  "c4ai-aya-expanse-32b": { input: 0.15, output: 0.6 },
  "c4ai-aya-vision-32b": { input: 0.15, output: 0.6 },
};

/** Fetch pricing from a model's .md doc page by parsing <ModelShowcase> JSX */
async function fetchPricingFromDoc(slug: string): Promise<Pricing | null> {
  try {
    const md = await fetchPage(modelDocUrl(slug));
    // Match: pricing: { input: 2.50, output: 10.0 }
    const pricingMatch = md.match(
      /pricing:\s*\{\s*input:\s*([\d.]+)\s*,\s*output:\s*([\d.]+)\s*\}/,
    );
    if (pricingMatch?.[1] && pricingMatch?.[2]) {
      return {
        input: parseFloat(pricingMatch[1]),
        output: parseFloat(pricingMatch[2]),
      };
    }
  } catch {
    // Page not found or fetch error — fall through to hardcoded
  }
  return null;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  // -----------------------------------------------------------------------
  // Step 1: Discover models from models.md
  // -----------------------------------------------------------------------
  discover: {
    source: {
      url: MODELS_MD_URL,
      type: "ssr",
      description:
        "Cohere models overview page (Fern .md endpoint) with Markdown tables listing all models",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const rawModels = await discoverRawModels();
      return rawModels
        .filter((m) => {
          // Exclude aliases (command-r, command-r-plus without date suffix)
          if (m.id === "command-r" || m.id === "command-r-plus") return false;
          // Exclude retired models
          if (m.status.toLowerCase().includes("retired")) return false;
          // Exclude embed v2 models (very old)
          if (m.id.includes("-v2.0")) return false;
          return true;
        })
        .map((m) => ({
          id: m.id,
          deprecated: m.deprecated,
          raw: m,
        }));
    },
  },

  // -----------------------------------------------------------------------
  // Step 2: Extract pricing
  // -----------------------------------------------------------------------
  extractPricing: {
    source: {
      url: "https://docs.cohere.com/docs/${modelId}.md",
      type: "ssr",
      description: "Individual model doc pages with <ModelShowcase> JSX containing pricing data",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      // First, use hardcoded pricing (from cohere.com/pricing Sanity CMS data)
      for (const m of models) {
        const hardcoded = HARDCODED_PRICING[m.id];
        if (hardcoded) {
          pricingMap.set(m.id, hardcoded);
        }
      }

      // Then, try to fetch pricing from doc pages for any remaining models
      const remaining = models.filter((m) => !pricingMap.has(m.id));
      const CONCURRENCY = 3;
      for (let i = 0; i < remaining.length; i += CONCURRENCY) {
        const batch = remaining.slice(i, i + CONCURRENCY);
        const results = await Promise.allSettled(
          batch.map(async (m) => {
            const slug = MODEL_DOC_SLUGS[m.id];
            if (!slug) return { id: m.id, pricing: null as Pricing | null };
            const pricing = await fetchPricingFromDoc(slug);
            return { id: m.id, pricing };
          }),
        );

        for (const result of results) {
          if (result.status === "fulfilled" && result.value.pricing) {
            pricingMap.set(result.value.id, result.value.pricing);
          }
        }
      }

      return pricingMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 3: Extract dates
  // -----------------------------------------------------------------------
  extractDates: {
    source: {
      url: MODELS_MD_URL,
      type: "ssr",
      description: "Model IDs contain date info (e.g., command-a-03-2025 → 2025-03)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();
      const today = new Date().toISOString().slice(0, 10);

      for (const m of models) {
        // Extract date from model ID pattern: xxx-MM-YYYY or xxx-YYYY
        const dateMatch = m.id.match(/-(\d{2})-(\d{4})$/);
        let releaseDate: string;
        let lastUpdated: string;

        if (dateMatch?.[1] && dateMatch?.[2]) {
          const month = dateMatch[1];
          const year = dateMatch[2];
          releaseDate = `${year}-${month}`;
          lastUpdated = `${year}-${month}`;
        } else {
          // Fallback: use current date
          releaseDate = today;
          lastUpdated = today;
        }

        datesMap.set(m.id, {
          release_date: releaseDate,
          last_updated: lastUpdated,
        });
      }

      return datesMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 4: Extract limits (context window, max output)
  // -----------------------------------------------------------------------
  extractLimits: {
    source: {
      url: MODELS_MD_URL,
      type: "ssr",
      description:
        "Markdown tables in models.md contain Context Length and Maximum Output Tokens columns",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();

      for (const m of models) {
        const raw = m.raw as RawModelInfo | undefined;
        if (!raw) continue;

        const context = parseTokenCount(raw.contextStr);
        const output = parseTokenCount(raw.outputStr);

        // For embed/rerank models, output may be absent — use context only
        if (context) {
          limitsMap.set(m.id, { context, output: output ?? 0 });
        }
      }

      return limitsMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 5: Extract modalities
  // -----------------------------------------------------------------------
  extractModalities: {
    source: {
      url: MODELS_MD_URL,
      type: "ssr",
      description: "Markdown tables contain Modality column (e.g., 'Text', 'Text, Images')",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();

      for (const m of models) {
        const raw = m.raw as RawModelInfo | undefined;
        if (!raw) continue;

        const inputModalities = parseModalityString(raw.modalityStr);
        // All Cohere models output text
        const outputModalities: ModelModality[] = ["text"];

        modalitiesMap.set(m.id, {
          input: inputModalities,
          output: outputModalities,
        });
      }

      return modalitiesMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 6: Extract features
  // -----------------------------------------------------------------------
  extractFeatures: {
    source: {
      url: "https://docs.cohere.com/docs/${modelId}.md",
      type: "ssr",
      description: "Individual model doc pages with <ModelShowcase> JSX containing capabilities",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();

      for (const m of models) {
        const raw = m.raw as RawModelInfo | undefined;
        const features: ExtractedFeatures = {};

        // Command models support tool use
        if (raw?.section === "command") {
          features.tool_call = true;
          features.structured_output = true;
        }

        // Reasoning model
        if (m.id.includes("reasoning")) {
          features.reasoning = true;
        }

        // Vision model
        if (m.id.includes("vision")) {
          features.attachment = true;
        }

        if (Object.keys(features).length > 0) {
          featuresMap.set(m.id, features);
        }
      }

      return featuresMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 7: Derive name
  // -----------------------------------------------------------------------
  deriveName: {
    execute: (modelId: string): string => {
      const rules: Array<{ pattern: RegExp; template: string }> = [
        { pattern: /^command-a-03-2025$/, template: "Command A" },
        { pattern: /^command-r7b-12-2024$/, template: "Command R7B" },
        { pattern: /^command-a-translate-08-2025$/, template: "Command A Translate" },
        { pattern: /^command-a-reasoning-08-2025$/, template: "Command A Reasoning" },
        { pattern: /^command-a-vision-07-2025$/, template: "Command A Vision" },
        { pattern: /^command-r-plus-08-2024$/, template: "Command R+ 08-2024" },
        { pattern: /^command-r-08-2024$/, template: "Command R 08-2024" },
        { pattern: /^command-r-plus-04-2024$/, template: "Command R+ 04-2024" },
        { pattern: /^command-r-03-2024$/, template: "Command R 03-2024" },
        { pattern: /^command-light$/, template: "Command Light" },
        { pattern: /^command$/, template: "Command" },
        { pattern: /^embed-v4\.0$/, template: "Embed v4.0" },
        { pattern: /^embed-english-v3\.0$/, template: "Embed English v3.0" },
        { pattern: /^embed-english-light-v3\.0$/, template: "Embed English Light v3.0" },
        { pattern: /^embed-multilingual-v3\.0$/, template: "Embed Multilingual v3.0" },
        { pattern: /^embed-multilingual-light-v3\.0$/, template: "Embed Multilingual Light v3.0" },
        { pattern: /^rerank-v4\.0-pro$/, template: "Rerank v4.0 Pro" },
        { pattern: /^rerank-v4\.0-fast$/, template: "Rerank v4.0 Fast" },
        { pattern: /^rerank-v3\.5$/, template: "Rerank v3.5" },
        { pattern: /^rerank-english-v3\.0$/, template: "Rerank English v3.0" },
        { pattern: /^rerank-multilingual-v3\.0$/, template: "Rerank Multilingual v3.0" },
        { pattern: /^cohere-transcribe-03-2026$/, template: "Cohere Transcribe" },
        { pattern: /^tiny-aya-(global|earth|fire|water)$/, template: "Tiny Aya $1" },
        { pattern: /^c4ai-aya-expanse-32b$/, template: "Aya Expanse 32B" },
        { pattern: /^c4ai-aya-vision-32b$/, template: "Aya Vision 32B" },
      ];

      for (const rule of rules) {
        const match = modelId.match(rule.pattern);
        if (match) {
          return rule.template.replace(/\$(\d+)/g, (_, idx: string) => {
            const val = match[parseInt(idx)];
            return val ? val.charAt(0).toUpperCase() + val.slice(1) : "";
          });
        }
      }

      // Fallback: capitalize words
      return modelId.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    },
  },

  // -----------------------------------------------------------------------
  // Step 8: Derive family
  // -----------------------------------------------------------------------
  deriveFamily: {
    execute: (modelId: string): string => {
      const rules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /^command-a/, family: "command-a" },
        { pattern: /^command-r7b/, family: "command-r7b" },
        { pattern: /^command-r-plus/, family: "command-r-plus" },
        { pattern: /^command-r/, family: "command-r" },
        { pattern: /^command-light/, family: "command-light" },
        { pattern: /^command$/, family: "command" },
        { pattern: /^embed/, family: "embed" },
        { pattern: /^rerank/, family: "rerank" },
        { pattern: /^cohere-transcribe/, family: "transcribe" },
        { pattern: /^tiny-aya/, family: "tiny-aya" },
        { pattern: /^c4ai-aya-expanse/, family: "aya-expanse" },
        { pattern: /^c4ai-aya-vision/, family: "aya-vision" },
      ];

      for (const rule of rules) {
        if (rule.pattern.test(modelId)) return rule.family;
      }

      return modelId.split("-")[0] ?? modelId;
    },
  },

  // -----------------------------------------------------------------------
  // Filter: exclude non-Cohere models and aliases
  // -----------------------------------------------------------------------
  filter: (_model: DiscoveredModel): boolean => {
    // Keep all models that passed the discover filter
    return true;
  },
};

// ---------------------------------------------------------------------------
// Main scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);

  return {
    provider,
    models,
  };
}
