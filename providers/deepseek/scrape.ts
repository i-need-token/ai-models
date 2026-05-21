import { defineProvider, runPipeline } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type {
  ScrapePipeline,
  DiscoveredModel,
  ExtractedLimit,
  ExtractedFeatures,
  ExtractedDates,
} from "../../scripts/lib/index";
import type { Pricing } from "../../types/index";

const provider = defineProvider({
  id: "deepseek",
  name: "DeepSeek",
  url: "https://deepseek.com",
  api_docs: "https://api-docs.deepseek.com",
  apis: {
    openai: "https://api.deepseek.com",
  },
});

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

const PRICING_URL = "https://api-docs.deepseek.com/quick_start/pricing";
const UPDATES_URL = "https://api-docs.deepseek.com/updates";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchPage(url: string): Promise<string> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
  return resp.text();
}

/** Parse "1M" / "384K" / "128k" into numeric token count */
function parseTokenCount(val: string): number | undefined {
  const match = val.match(/([\d.]+)\s*([KkMmBb])?/);
  if (!match?.[1]) return undefined;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return undefined;
  const unit = match[2]?.toUpperCase();
  if (unit === "K") return num * 1_000;
  if (unit === "M") return num * 1_000_000;
  if (unit === "B") return num * 1_000_000_000;
  return num;
}

/** Parse "$0.14” / “$0.435 (75% off) $1.74” into number
 *  When there are multiple prices (discount + original), take the first (discounted) price
 */
function parsePrice(val: string): number | undefined {
  // First, try to match the first dollar amount (which is the current/discounted price)
  const match = val.match(/\$([\d.]+)/);
  if (!match?.[1]) return undefined;
  return parseFloat(match[1]);
}

/** Extract text from HTML, stripping tags */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Raw data types - parsed from pricing page HTML table
// ---------------------------------------------------------------------------

interface RawModelInfo {
  id: string;
  /** Display version name, e.g., "DeepSeek-V4-Flash" */
  version: string;
  /** Context length string, e.g., "1M" */
  contextStr: string;
  /** Max output string, e.g., "MAXIMUM: 384K" */
  outputStr: string;
  /** Features: json output, tool calls, etc. */
  features: {
    jsonOutput: boolean;
    toolCalls: boolean;
    chatPrefix: boolean;
    fimCompletion: boolean;
  };
  /** Pricing per 1M tokens (cache miss) */
  pricing: {
    input: number;
    output: number;
    cacheRead?: number;
  };
  /** Whether this model supports thinking mode */
  thinkingMode: boolean;
  /** Whether this model ID is deprecated (alias) */
  deprecated: boolean;
}

// ---------------------------------------------------------------------------
// Model discovery - parse pricing page HTML table
// ---------------------------------------------------------------------------

async function discoverRawModels(): Promise<RawModelInfo[]> {
  const html = await fetchPage(PRICING_URL);

  // Extract the pricing table
  const tableMatch = html.match(/<table[^>]*>(.*?)<\/table>/s);
  if (!tableMatch) throw new Error("No pricing table found on DeepSeek pricing page");

  const tableHtml = tableMatch[1] ?? "";
  const rows: string[][] = [];

  // Parse all rows, handling colspan attributes
  const rowPattern = /<tr[^>]*>(.*?)<\/tr>/gs;
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowPattern.exec(tableHtml)) !== null) {
    const rowHtml = rowMatch[1] ?? "";
    const cells: string[] = [];
    // Parse cells with colspan info
    const cellPattern = /<t[dh]([^>]*)>(.*?)<\/t[dh]>/gs;
    let cellMatch: RegExpExecArray | null;
    while ((cellMatch = cellPattern.exec(rowHtml)) !== null) {
      const attrs = cellMatch[1] ?? "";
      const content = cellMatch[2] ?? "";
      const colspanMatch = attrs.match(/colspan="(\d+)"/);
      const colspan = colspanMatch?.[1] ? parseInt(colspanMatch[1]) : 1;
      // Expand colspan: repeat the cell content for each column it spans
      for (let c = 0; c < colspan; c++) {
        cells.push(content);
      }
    }
    rows.push(cells);
  }

  if (rows.length === 0) throw new Error("No rows found in pricing table");

  // Row 0 = header: with colspan expansion, it's [MODEL, MODEL, deepseek-v4-flash, deepseek-v4-pro]
  // The first N cells are the label column (expanded by colspan), then model columns start
  const headerRow = rows[0];
  if (!headerRow || headerRow.length < 3) throw new Error("Unexpected table header format");

  // Determine the number of model columns: total cells minus label cells
  // The label column "MODEL" has colspan=2, so it expands to 2 cells
  // The remaining cells are model columns
  // Count how many unique model IDs we can extract
  const modelIds: string[] = [];
  const numLabelCells = 2; // "MODEL" with colspan=2 expands to 2 cells
  for (let i = numLabelCells; i < headerRow.length; i++) {
    const cell = stripHtml(headerRow[i] ?? "");
    // Extract model ID (strip footnote markers like "(1)")
    const idMatch = cell.match(/^([\w-]+)/);
    if (idMatch?.[1]) {
      modelIds.push(idMatch[1]);
    }
  }

  // Build a map: row label → cell values per model
  // With colspan expansion, shared values are duplicated
  // Strategy: always take the LAST N cells as model values (N = number of model columns)
  // Everything before that is the label (possibly expanded by colspan)
  const rowData: Map<string, string[]> = new Map();
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;
    // The label is everything before the model values
    // Model values are the last N cells
    const labelCells = row.slice(0, row.length - modelIds.length);
    const label = labelCells
      .map((c) => stripHtml(c))
      .join(" ")
      .toUpperCase();
    const values = row.slice(row.length - modelIds.length).map((c) => stripHtml(c));
    rowData.set(label, values);
  }

  // Extract data per model
  const models: RawModelInfo[] = [];

  for (let i = 0; i < modelIds.length; i++) {
    const id = modelIds[i] as string;

    const version = [...rowData.keys()].find((k) => k.includes("MODEL VERSION")) ?? "";
    const versionVal = version ? (rowData.get(version)?.[i] ?? "") : "";
    const contextStr = [...rowData.keys()].find((k) => k.includes("CONTEXT LENGTH")) ?? "";
    const contextVal = contextStr ? (rowData.get(contextStr)?.[i] ?? "") : "";
    const outputStr = [...rowData.keys()].find((k) => k.includes("MAX OUTPUT")) ?? "";
    const outputVal = outputStr ? (rowData.get(outputStr)?.[i] ?? "") : "";

    // Features - these are in sub-rows under the FEATURES label
    const jsonOutput = rowData.get("JSON OUTPUT")?.[i]?.includes("✓") ?? false;
    const toolCalls = rowData.get("TOOL CALLS")?.[i]?.includes("✓") ?? false;
    const chatPrefix =
      rowData.get("CHAT PREFIX COMPLETION(BETA)")?.[i]?.includes("✓") ??
      rowData.get("CHAT PREFIX COMPLETION(BETA)")?.[i]?.includes("✓") ??
      false;
    const fimStr =
      rowData.get("FIM COMPLETION(BETA)")?.[i] ?? rowData.get("FIM COMPLETION(BETA)")?.[i] ?? "";
    const fimCompletion = fimStr !== "" && !fimStr.toLowerCase().includes("not supported");

    // Pricing (cache miss = regular price)
    const inputPriceStr = rowData.get("1M INPUT TOKENS (CACHE MISS)")?.[i] ?? "";
    const outputPriceStr = rowData.get("1M OUTPUT TOKENS")?.[i] ?? "";
    // Cache hit row label may include footnote marker like "(2)"
    const cacheReadStr = [...rowData.keys()].find((k) => k.includes("CACHE HIT")) ?? "";
    const cacheReadVal = cacheReadStr ? rowData.get(cacheReadStr)?.[i] : undefined;

    const input = parsePrice(inputPriceStr);
    const output = parsePrice(outputPriceStr);
    const cacheRead = parsePrice(cacheReadVal ?? "");

    if (!input || !output) {
      console.warn(`  ${id}: missing pricing (input=${inputPriceStr}, output=${outputPriceStr})`);
      continue;
    }

    // Thinking mode
    const thinkingStr =
      [...rowData.keys()]
        .filter((k) => k.includes("THINKING MODE"))
        .map((k) => rowData.get(k)?.[i] ?? "")
        .find((v) => v !== "") ?? "";
    const thinkingMode = thinkingStr.toLowerCase().includes("thinking");

    // The "deepseek-chat" and "deepseek-reasoner" names are deprecated aliases
    // per the footnote: they point to deepseek-v4-flash's non-thinking/thinking modes
    const deprecated = id === "deepseek-chat" || id === "deepseek-reasoner";

    models.push({
      id,
      version: versionVal,
      contextStr: contextVal,
      outputStr: outputVal,
      features: {
        jsonOutput,
        toolCalls,
        chatPrefix,
        fimCompletion,
      },
      pricing: {
        input,
        output,
        ...(cacheRead ? { cacheRead } : {}),
      },
      thinkingMode,
      deprecated,
    });
  }

  // Also include deprecated alias models: deepseek-chat and deepseek-reasoner
  // Per footnote: they are aliases for deepseek-v4-flash (non-thinking / thinking modes)
  const flashModel = models.find((m) => m.id === "deepseek-v4-flash");
  if (flashModel) {
    models.push({
      ...flashModel,
      id: "deepseek-chat",
      version: "DeepSeek-V4-Flash (non-thinking mode)",
      deprecated: true,
      thinkingMode: false,
    });
    models.push({
      ...flashModel,
      id: "deepseek-reasoner",
      version: "DeepSeek-V4-Flash (thinking mode)",
      deprecated: true,
      thinkingMode: true,
    });
  }

  return models;
}

// ---------------------------------------------------------------------------
// Release dates - parse from updates/changelog page
// ---------------------------------------------------------------------------

interface ReleaseDate {
  date: string; // YYYY-MM or YYYY-MM-DD
  description: string;
}

async function fetchReleaseDates(): Promise<Map<string, ReleaseDate>> {
  const html = await fetchPage(UPDATES_URL);
  const articleMatch = html.match(/<article[^>]*>(.*?)<\/article>/s);
  if (!articleMatch) return new Map();

  // Strip HTML tags but preserve line breaks
  const text =
    articleMatch[1]
      ?.replace(/<[^>]+>/g, "\n")
      .replace(/\n+/g, "\n")
      .trim() ?? "";

  const dateMap = new Map<string, ReleaseDate>();

  // Parse date entries: "Date: YYYY-MM-DD" followed by model info
  const lines = text.split("\n");
  let currentDate: string | null = null;
  let currentContent: string = "";

  for (const line of lines) {
    const dateMatch = line.match(/^Date:\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch?.[1]) {
      // Process previous date's content
      if (currentDate) {
        processDateContent(currentDate, currentContent, dateMap);
      }
      currentDate = dateMatch[1];
      currentContent = "";
    } else if (currentDate) {
      currentContent += line + " ";
    }
  }

  // Process last date
  if (currentDate) {
    processDateContent(currentDate, currentContent, dateMap);
  }

  return dateMap;
}

function processDateContent(
  date: string,
  content: string,
  dateMap: Map<string, ReleaseDate>,
): void {
  const monthDate = date.slice(0, 7); // YYYY-MM

  // Map model names mentioned in this entry to the date
  const modelPatterns: Array<{ pattern: RegExp; modelId: string }> = [
    { pattern: /\bdeepseek-v4-flash\b/i, modelId: "deepseek-v4-flash" },
    { pattern: /\bdeepseek-v4-pro\b/i, modelId: "deepseek-v4-pro" },
    { pattern: /\bdeepseek-v4\b/i, modelId: "deepseek-v4-flash" }, // V4 announcement covers both
    { pattern: /\bdeepseek-chat\b/i, modelId: "deepseek-chat" },
    { pattern: /\bdeepseek-reasoner\b/i, modelId: "deepseek-reasoner" },
  ];

  for (const { pattern, modelId } of modelPatterns) {
    if (pattern.test(content) && !dateMap.has(modelId)) {
      dateMap.set(modelId, {
        date: monthDate,
        description: content.slice(0, 100).trim(),
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  // -----------------------------------------------------------------------
  // Step 1: Discover models from pricing page
  // -----------------------------------------------------------------------
  discover: {
    source: {
      url: PRICING_URL,
      type: "ssr",
      description:
        "DeepSeek pricing page (Docusaurus SSR) with HTML table listing all models, features, and pricing",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const rawModels = await discoverRawModels();

      // Also include legacy model IDs that are still accessible via API
      // even though they're not in the pricing table
      const legacyModels: Array<{
        id: string;
        version: string;
        deprecated: boolean;
        pricing: { input: number; output: number };
        contextStr: string;
        outputStr: string;
        thinkingMode: boolean;
        features: RawModelInfo["features"];
      }> = [
        // deepseek-chat and deepseek-reasoner are already in the pricing table
        // as aliases for deepseek-v4-flash modes
      ];

      // Combine discovered + legacy
      const allModels = [
        ...rawModels,
        ...legacyModels.map((m) => ({
          ...m,
          id: m.id,
          version: m.version,
          contextStr: m.contextStr,
          outputStr: m.outputStr,
          features: m.features,
          pricing: m.pricing,
          thinkingMode: m.thinkingMode,
          deprecated: m.deprecated,
        })),
      ];

      return allModels.map((m) => ({
        id: m.id,
        deprecated: m.deprecated,
        raw: m,
      }));
    },
  },

  // -----------------------------------------------------------------------
  // Step 2: Extract pricing (already available from discovery)
  // -----------------------------------------------------------------------
  extractPricing: {
    source: {
      url: PRICING_URL,
      type: "ssr",
      description: "Pricing data extracted from the HTML table on the pricing page",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      for (const m of models) {
        const raw = m.raw as RawModelInfo | undefined;
        if (!raw) continue;

        const p: Pricing = {
          input: raw.pricing.input,
          output: raw.pricing.output,
        };

        if (raw.pricing.cacheRead) {
          p.cache_read = raw.pricing.cacheRead;
        }

        pricingMap.set(m.id, p);
      }

      return pricingMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 3: Extract dates from changelog
  // -----------------------------------------------------------------------
  extractDates: {
    source: {
      url: UPDATES_URL,
      type: "ssr",
      description: "DeepSeek changelog page with release dates for each model version",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();
      const releaseDates = await fetchReleaseDates();

      for (const m of models) {
        const raw = m.raw as RawModelInfo | undefined;
        const releaseInfo = releaseDates.get(m.id);

        if (releaseInfo) {
          datesMap.set(m.id, {
            release_date: releaseInfo.date,
            last_updated: releaseInfo.date,
          });
        } else if (raw?.version) {
          // Try to extract date from version string
          const dateMatch = raw.version.match(/(\d{4})-(\d{2})/);
          if (dateMatch?.[1] && dateMatch?.[2]) {
            const date = `${dateMatch[1]}-${dateMatch[2]}`;
            datesMap.set(m.id, {
              release_date: date,
              last_updated: date,
            });
          }
          // If no date extractable, omit — runtime will try raw.created fallback
        }
        // If no date data available at all, omit — runtime will try raw.created fallback
      }

      return datesMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 4: Extract limits (context window, max output)
  // -----------------------------------------------------------------------
  extractLimits: {
    source: {
      url: PRICING_URL,
      type: "ssr",
      description: "Context length and max output from the pricing page HTML table",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();

      for (const m of models) {
        const raw = m.raw as RawModelInfo | undefined;
        if (!raw) continue;

        const context = parseTokenCount(raw.contextStr);
        // Output string may be "MAXIMUM: 384K" - extract the number
        const outputNum = parseTokenCount(raw.outputStr.replace(/^MAXIMUM:\s*/i, ""));

        if (context) {
          limitsMap.set(m.id, {
            context,
            ...(outputNum ? { output: outputNum } : {}),
          });
        }
      }

      return limitsMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 5: Extract features
  // -----------------------------------------------------------------------
  // Note: extractModalities removed — pricing page doesn't provide modality data.
  // Pipeline will use default { input: ["text"], output: ["text"] }

  extractFeatures: {
    source: {
      url: PRICING_URL,
      type: "ssr",
      description: "Features from the pricing page HTML table (JSON output, tool calls, etc.)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();

      for (const m of models) {
        const raw = m.raw as RawModelInfo | undefined;
        if (!raw) continue;

        const features: ExtractedFeatures = {};

        if (raw.thinkingMode) {
          features.reasoning = true;
        }

        if (raw.features.toolCalls) {
          features.tool_call = true;
        }

        if (raw.features.jsonOutput) {
          features.structured_output = true;
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
        { pattern: /^deepseek-v4-flash$/, template: "DeepSeek V4 Flash" },
        { pattern: /^deepseek-v4-pro$/, template: "DeepSeek V4 Pro" },
        { pattern: /^deepseek-chat$/, template: "DeepSeek Chat" },
        { pattern: /^deepseek-reasoner$/, template: "DeepSeek Reasoner" },
      ];

      for (const rule of rules) {
        if (rule.pattern.test(modelId)) return rule.template;
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
        { pattern: /^deepseek-v4-flash$/, family: "deepseek" },
        { pattern: /^deepseek-v4-pro$/, family: "deepseek" },
        { pattern: /^deepseek-chat$/, family: "deepseek-chat" },
        { pattern: /^deepseek-reasoner$/, family: "deepseek-reasoner" },
      ];

      for (const rule of rules) {
        if (rule.pattern.test(modelId)) return rule.family;
      }

      return modelId.split("-").slice(0, 2).join("-");
    },
  },

  // -----------------------------------------------------------------------
  // Filter
  // -----------------------------------------------------------------------
  filter: (_model: DiscoveredModel): boolean => {
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
