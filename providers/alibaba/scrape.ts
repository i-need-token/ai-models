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
  id: "alibaba",
  name: "Alibaba Cloud (Bailian)",
  url: "https://www.aliyun.com/product/bailian",
  api_docs: "https://help.aliyun.com/zh/model-studio/",
  apis: {
    openai: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  },
  currency: "CNY",
});

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

const MODELS_URL = "https://help.aliyun.com/zh/model-studio/text-generation-model/";
const BILLING_URL = "https://help.aliyun.com/zh/model-studio/billing-for-model-studio";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchPage(url: string): Promise<string> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
  return resp.text();
}

/** Extract ICE_PAGE_PROPS JSON from Alibaba help page HTML */
function extractIceProps(html: string): Record<string, unknown> | null {
  const match = html.match(/__ICE_PAGE_PROPS__\s*=\s*(\{.*?\})\s*;?\s*$/m);
  if (!match?.[1]) return null;
  try {
    return JSON.parse(match[1]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Get the content HTML from ICE_PAGE_PROPS */
function getContentHtml(html: string): string {
  const props = extractIceProps(html);
  if (!props) return "";
  const data = props["docDetailData"] as Record<string, unknown> | undefined;
  const storeData = data?.["storeData"] as Record<string, unknown> | undefined;
  const pageData = storeData?.["data"] as Record<string, unknown> | undefined;
  return (pageData?.["content"] as string) ?? "";
}

/** Strip HTML tags */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parse "1M" / "256k" / "10M" into numeric token count */
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

/** Parse "2.5元" / "9元" into number */
function parseCnyPrice(val: string): number | undefined {
  const match = val.match(/([\d.]+)\s*元/);
  if (!match?.[1]) return undefined;
  return parseFloat(match[1]);
}

/** Parse HTML table rows into arrays of cell text */
function parseTable(tableHtml: string): string[][] {
  const rows: string[][] = [];
  const rowPattern = /<tr[^>]*>(.*?)<\/tr>/gs;
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowPattern.exec(tableHtml)) !== null) {
    const rowHtml = rowMatch[1] ?? "";
    const cells: string[] = [];
    const cellPattern = /<t[dh][^>]*>(.*?)<\/t[dh]>/gs;
    let cellMatch: RegExpExecArray | null;
    while ((cellMatch = cellPattern.exec(rowHtml)) !== null) {
      const content = cellMatch[1] ?? "";
      cells.push(stripHtml(content));
    }
    rows.push(cells);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Raw data types
// ---------------------------------------------------------------------------

interface RawModelInfo {
  id: string;
  /** Context length string, e.g., "1M", "256k" */
  contextStr: string;
  /** Max output string, e.g., "64k" */
  outputStr: string;
  /** Thinking budget string, e.g., "80k", "128k" */
  thinkingBudgetStr: string;
  /** Whether model supports thinking mode */
  thinkingMode: boolean;
  /** Whether model supports function calling */
  functionCalling: boolean;
  /** Whether model supports structured output */
  structuredOutput: boolean;
  /** Model family for grouping */
  family: string;
}

interface RawPricingInfo {
  input: number;
  output: number;
  /** Thinking mode output price (思维链+回答) */
  thinkingOutput?: number;
}

// ---------------------------------------------------------------------------
// Model discovery - parse text generation model page
// ---------------------------------------------------------------------------

async function discoverRawModels(): Promise<RawModelInfo[]> {
  const html = await fetchPage(MODELS_URL);
  const contentHtml = getContentHtml(html);
  if (!contentHtml) throw new Error("No content found in models page");

  const models: RawModelInfo[] = [];
  const seenIds = new Set<string>();

  // Parse all tables in the content
  const tablePattern = /<table[^>]*>(.*?)<\/table>/gs;
  let tableMatch: RegExpExecArray | null;
  let tableIdx = 0;

  while ((tableMatch = tablePattern.exec(contentHtml)) !== null) {
    const tableHtml = tableMatch[1] ?? "";
    const rows = parseTable(tableHtml);
    tableIdx++;

    if (rows.length < 2) continue;

    // Check if this table has model data (first row should be header with "模型" or "模型ID")
    const header = rows[0];
    if (!header) continue;
    const headerStr = header.join(" ");
    if (!headerStr.includes("模型") && !headerStr.includes("模型ID")) continue;

    // Determine column indices
    const modelCol = header.findIndex((h) => h.includes("模型ID") || h === "模型");
    const contextCol = header.findIndex((h) => h.includes("上下文"));
    const outputCol = header.findIndex((h) => h.includes("最大输出"));
    const thinkingBudgetCol = header.findIndex((h) => h.includes("思考预算"));
    const thinkingCol = header.findIndex((h) => h.includes("思考模式"));
    const fcCol = header.findIndex((h) => h.includes("Function Calling"));
    const structuredCol = header.findIndex((h) => h.includes("结构化输出"));

    if (modelCol === -1) continue;

    // Skip tables without output column if we already have the model
    const hasOutputCol = outputCol >= 0;

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;

      const modelCell = row[modelCol] ?? "";
      // Extract model ID - might have extra text like "当前能力等同于..."
      const idMatch = modelCell.match(/^([\w.-]+)/);
      if (!idMatch?.[1]) continue;
      const id = idMatch[1];

      // Skip third-party models (deepseek, glm, kimi, MiniMax, etc.)
      if (/^(deepseek|glm|kimi|MiniMax|Moonshot|qwq|qvq)/.test(id)) continue;
      // Skip non-qwen models
      if (!id.startsWith("qwen")) continue;

      // Skip if already seen AND this table doesn't have output column
      if (seenIds.has(id) && !hasOutputCol) continue;

      const contextStr = contextCol >= 0 ? (row[contextCol] ?? "") : "";
      const outputStr = outputCol >= 0 ? (row[outputCol] ?? "") : "";
      const thinkingBudgetStr = thinkingBudgetCol >= 0 ? (row[thinkingBudgetCol] ?? "") : "";

      // Parse thinking mode
      let thinkingMode = false;
      if (thinkingCol >= 0) {
        const val = row[thinkingCol] ?? "";
        thinkingMode = val.includes("支持");
      }

      // Parse function calling
      let functionCalling = false;
      if (fcCol >= 0) {
        const val = row[fcCol] ?? "";
        functionCalling = val.includes("支持");
      }

      // Parse structured output
      let structuredOutput = false;
      if (structuredCol >= 0) {
        const val = row[structuredCol] ?? "";
        structuredOutput = val.includes("支持");
      }

      // Determine family
      const family = deriveFamilyFromId(id);

      // If we already have this model but this table has output data, update it
      if (seenIds.has(id) && hasOutputCol) {
        const existing = models.find((m) => m.id === id);
        if (existing && !existing.outputStr && outputStr) {
          existing.outputStr = outputStr;
        }
        continue;
      }

      seenIds.add(id);

      models.push({
        id,
        contextStr,
        outputStr,
        thinkingBudgetStr,
        thinkingMode,
        functionCalling,
        structuredOutput,
        family,
      });
    }
  }

  return models;
}

function deriveFamilyFromId(id: string): string {
  // qwen3.6-plus → qwen
  // qwen3.6-plus-2026-04-02 → qwen
  // qwen3-max → qwen
  // qwen3-coder-plus → qwen-coder
  // qwen2.5-72b-instruct → qwen
  // qwen-mt-plus → qwen-mt
  // qwen-long → qwen-long
  // qwen-plus-character → qwen-character
  const patterns: Array<{ pattern: RegExp; family: string }> = [
    { pattern: /^qwen3-coder/, family: "qwen-coder" },
    { pattern: /^qwen3-omni/, family: "qwen-omni" },
    { pattern: /^qwen3-vl/, family: "qwen-vl" },
    { pattern: /^qwen3-tts/, family: "qwen-tts" },
    { pattern: /^qwen3-asr/, family: "qwen-asr" },
    { pattern: /^qwen2\.5-omni/, family: "qwen-omni" },
    { pattern: /^qwen2\.5-vl/, family: "qwen-vl" },
    { pattern: /^qwen2\.5-math/, family: "qwen-math" },
    { pattern: /^qwen-mt/, family: "qwen-mt" },
    { pattern: /^qwen-long/, family: "qwen-long" },
    { pattern: /^qwen-plus-character/, family: "qwen-character" },
    { pattern: /^qwen-flash-character/, family: "qwen-character" },
    { pattern: /^qwen-vl/, family: "qwen-vl" },
    { pattern: /^qwen-tts/, family: "qwen-tts" },
    { pattern: /^qwen/, family: "qwen" },
    { pattern: /^qwq/, family: "qwq" },
    { pattern: /^qvq/, family: "qvq" },
  ];

  for (const { pattern, family } of patterns) {
    if (pattern.test(id)) return family;
  }

  // Fallback: first two segments
  return id.split("-").slice(0, 2).join("-");
}

// ---------------------------------------------------------------------------
// Pricing extraction - parse billing page
// ---------------------------------------------------------------------------

async function fetchPricing(): Promise<Map<string, RawPricingInfo>> {
  const html = await fetchPage(BILLING_URL);
  const contentHtml = getContentHtml(html);
  if (!contentHtml) throw new Error("No content found in billing page");

  const pricingMap = new Map<string, RawPricingInfo>();

  // Parse all tables
  const tablePattern = /<table[^>]*>(.*?)<\/table>/gs;
  let tableMatch: RegExpExecArray | null;

  while ((tableMatch = tablePattern.exec(contentHtml)) !== null) {
    const tableHtml = tableMatch[1] ?? "";
    const rows = parseTable(tableHtml);

    if (rows.length < 2) continue;

    const header = rows[0];
    if (!header) continue;

    // Find relevant columns
    const modelCol = header.findIndex((h) => h.includes("模型名称"));
    const inputCol = header.findIndex((h) => h.includes("输入单价"));
    const outputCol = header.findIndex((h) => h.includes("输出单价"));
    const tokenRangeCol = header.findIndex((h) => h.includes("输入Token"));

    if (modelCol === -1 || inputCol === -1 || outputCol === -1) continue;

    // Check if this is a China region table (has "元" prices, not international)
    // We'll process all tables and let the first match win (China tables come first)

    // Check if there's a "思维链+回答" output column
    // Check for thinking output column in both header and sub-header (Row 1)
    // Some tables have a sub-header row like: ['非思考模式', '思考模式（思维链+回答）']
    const thinkingOutputCol = header.findIndex((h) => h.includes("思维链"));
    const subHeader = rows[1];
    const thinkingOutputFromSub = subHeader ? subHeader.findIndex((h) => h.includes("思维链")) : -1;
    // Use the sub-header column if the main header doesn't have it
    const effectiveThinkingCol = thinkingOutputCol >= 0 ? thinkingOutputCol : thinkingOutputFromSub;

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;

      const modelCell = row[modelCol] ?? "";
      // Extract model ID
      const idMatch = modelCell.match(/^([\w./-]+)/);
      if (!idMatch?.[1]) continue;
      const id = idMatch[1];

      // Skip third-party models
      if (
        /^(deepseek|glm|kimi|MiniMax|Moonshot|siliconflow|vanchin|Tripo|pixverse|kling|vidu)/.test(
          id,
        )
      )
        continue;
      // Skip non-qwen models (except qwq, qvq)
      if (!id.startsWith("qwen") && !id.startsWith("qwq") && !id.startsWith("qvq")) continue;

      // Skip if already have pricing (first match = China region)
      if (pricingMap.has(id)) continue;

      // Check token range - we want the first tier (lowest range)
      if (tokenRangeCol >= 0) {
        const range = row[tokenRangeCol] ?? "";
        // Skip if this is a higher tier (not the first tier)
        // First tier starts with "0<Token" or "无阶梯计价"
        if (range && !range.includes("0<") && !range.includes("无阶梯") && !range.includes("0＜")) {
          continue;
        }
      }

      // Check mode - prefer "非思考和思考模式" over "仅非思考模式" or "仅思考模式"
      // We'll take the first match regardless

      const inputPrice = parseCnyPrice(row[inputCol] ?? "");
      let outputPrice = parseCnyPrice(row[outputCol] ?? "");

      // For thinking-only models, the non-thinking output price is "-"
      // In this case, use the thinking output price as the output price
      if (!outputPrice && effectiveThinkingCol >= 0) {
        outputPrice = parseCnyPrice(row[effectiveThinkingCol] ?? "");
      }

      if (!inputPrice || !outputPrice) continue;

      const info: RawPricingInfo = {
        input: inputPrice,
        output: outputPrice,
      };

      // Check for thinking mode output price
      if (effectiveThinkingCol >= 0) {
        const thinkingPrice = parseCnyPrice(row[effectiveThinkingCol] ?? "");
        if (thinkingPrice) {
          info.thinkingOutput = thinkingPrice;
        }
      }

      pricingMap.set(id, info);
    }
  }

  return pricingMap;
}

// ---------------------------------------------------------------------------
// Pipeline definition
// ---------------------------------------------------------------------------

const pipeline: ScrapePipeline = {
  // -----------------------------------------------------------------------
  // Step 1: Discover models from models page
  // -----------------------------------------------------------------------
  discover: {
    source: {
      url: MODELS_URL,
      type: "ssr",
      description: "Alibaba Bailian text generation model page (ICE SSR) with model specs tables",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const rawModels = await discoverRawModels();
      return rawModels.map(
        (m): DiscoveredModel => ({
          id: m.id,
          raw: m,
        }),
      );
    },
  },

  // -----------------------------------------------------------------------
  // Step 2: Extract pricing from billing page
  // -----------------------------------------------------------------------
  extractPricing: {
    source: {
      url: BILLING_URL,
      type: "ssr",
      description: "Alibaba Bailian billing page (ICE SSR) with pricing tables per model",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();
      const rawPricing = await fetchPricing();

      for (const m of models) {
        const pricing = rawPricing.get(m.id);
        if (!pricing) {
          console.warn(`  ${m.id}: no pricing found`);
          continue;
        }

        const p: Pricing = {
          currency: "CNY",
          input: pricing.input,
          output: pricing.output,
        };

        pricingMap.set(m.id, p);
      }

      return pricingMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 3: Extract dates
  // -----------------------------------------------------------------------
  extractDates: {
    source: {
      url: MODELS_URL,
      type: "ssr",
      description:
        "Release dates extracted from model IDs (dated snapshots like qwen3.6-plus-2026-04-02)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const datesMap = new Map<string, ExtractedDates>();

      for (const m of models) {
        // Extract date from model ID (e.g., qwen3.6-plus-2026-04-02 → 2026-04)
        const dateMatch = m.id.match(/-(\d{4})-(\d{2})-(\d{2})$/);
        if (dateMatch?.[1] && dateMatch?.[2]) {
          const date = `${dateMatch[1]}-${dateMatch[2]}`;
          datesMap.set(m.id, {
            release_date: date,
            last_updated: date,
          });
        } else {
          // No date available from model ID — omit
          // Pipeline will skip models without dates
        }
      }

      return datesMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 4: Extract limits (context window, max output)
  // -----------------------------------------------------------------------
  extractLimits: {
    source: {
      url: MODELS_URL,
      type: "ssr",
      description: "Context length and max output from the models page tables",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedLimit>> => {
      const limitsMap = new Map<string, ExtractedLimit>();

      for (const m of models) {
        const raw = m.raw as RawModelInfo | undefined;
        if (!raw) continue;

        const context = parseTokenCount(raw.contextStr);
        const output = parseTokenCount(raw.outputStr);

        if (context) {
          limitsMap.set(m.id, {
            context,
            ...(output ? { output } : {}),
          });
        }
      }

      return limitsMap;
    },
  },

  // -----------------------------------------------------------------------
  // Step 5: Extract features
  // -----------------------------------------------------------------------
  // Note: extractModalities removed — page tables don't provide modality data.
  // Pipeline will use default { input: ["text"], output: ["text"] }

  extractFeatures: {
    source: {
      url: MODELS_URL,
      type: "ssr",
      description:
        "Features from the models page tables (thinking mode, function calling, structured output)",
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

        if (raw.functionCalling) {
          features.tool_call = true;
        }

        if (raw.structuredOutput) {
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
      // Remove date suffix
      const baseId = modelId.replace(/-\d{4}-\d{2}-\d{2}$/, "");

      const rules: Array<{ pattern: RegExp; template: string }> = [
        // Qwen 3.6 series
        { pattern: /^qwen3\.6-max-preview$/, template: "Qwen 3.6 Max Preview" },
        { pattern: /^qwen3\.6-plus$/, template: "Qwen 3.6 Plus" },
        { pattern: /^qwen3\.6-flash$/, template: "Qwen 3.6 Flash" },
        // Qwen 3.5 series
        { pattern: /^qwen3\.5-plus$/, template: "Qwen 3.5 Plus" },
        { pattern: /^qwen3\.5-flash$/, template: "Qwen 3.5 Flash" },
        { pattern: /^qwen3\.5-397b-a17b$/, template: "Qwen 3.5 397B-A17B" },
        { pattern: /^qwen3\.5-122b-a10b$/, template: "Qwen 3.5 122B-A10B" },
        { pattern: /^qwen3\.5-27b$/, template: "Qwen 3.5 27B" },
        { pattern: /^qwen3\.5-35b-a3b$/, template: "Qwen 3.5 35B-A3B" },
        // Qwen 3 series
        { pattern: /^qwen3-max$/, template: "Qwen 3 Max" },
        { pattern: /^qwen3-max-preview$/, template: "Qwen 3 Max Preview" },
        { pattern: /^qwen3-coder-plus$/, template: "Qwen 3 Coder Plus" },
        { pattern: /^qwen3-coder-flash$/, template: "Qwen 3 Coder Flash" },
        { pattern: /^qwen3-coder-next$/, template: "Qwen 3 Coder Next" },
        // Qwen 3 open-weight MoE
        { pattern: /^qwen3-235b-a22b$/, template: "Qwen 3 235B-A22B" },
        { pattern: /^qwen3-235b-a22b-instruct-2507$/, template: "Qwen 3 235B-A22B Instruct" },
        { pattern: /^qwen3-235b-a22b-thinking-2507$/, template: "Qwen 3 235B-A22B Thinking" },
        { pattern: /^qwen3-30b-a3b$/, template: "Qwen 3 30B-A3B" },
        { pattern: /^qwen3-30b-a3b-instruct-2507$/, template: "Qwen 3 30B-A3B Instruct" },
        { pattern: /^qwen3-30b-a3b-thinking-2507$/, template: "Qwen 3 30B-A3B Thinking" },
        { pattern: /^qwen3-next-80b-a3b-thinking$/, template: "Qwen 3 Next 80B-A3B Thinking" },
        { pattern: /^qwen3-next-80b-a3b-instruct$/, template: "Qwen 3 Next 80B-A3B Instruct" },
        { pattern: /^qwen3-coder-30b-a3b-instruct$/, template: "Qwen 3 Coder 30B-A3B Instruct" },
        {
          pattern: /^qwen3-coder-480b-a35b-instruct$/,
          template: "Qwen 3 Coder 480B-A35B Instruct",
        },
        // Qwen 3 open-weight dense
        { pattern: /^qwen3-32b$/, template: "Qwen 3 32B" },
        { pattern: /^qwen3-14b$/, template: "Qwen 3 14B" },
        { pattern: /^qwen3-8b$/, template: "Qwen 3 8B" },
        { pattern: /^qwen3-4b$/, template: "Qwen 3 4B" },
        { pattern: /^qwen3-1\.7b$/, template: "Qwen 3 1.7B" },
        { pattern: /^qwen3-0\.6b$/, template: "Qwen 3 0.6B" },
        // Qwen 2.5 series
        { pattern: /^qwen2\.5-72b-instruct$/, template: "Qwen 2.5 72B Instruct" },
        { pattern: /^qwen2\.5-72b-instruct-1m$/, template: "Qwen 2.5 72B Instruct 1M" },
        { pattern: /^qwen2\.5-32b-instruct$/, template: "Qwen 2.5 32B Instruct" },
        { pattern: /^qwen2\.5-14b-instruct$/, template: "Qwen 2.5 14B Instruct" },
        { pattern: /^qwen2\.5-14b-instruct-1m$/, template: "Qwen 2.5 14B Instruct 1M" },
        { pattern: /^qwen2\.5-7b-instruct$/, template: "Qwen 2.5 7B Instruct" },
        { pattern: /^qwen2\.5-7b-instruct-1m$/, template: "Qwen 2.5 7B Instruct 1M" },
        { pattern: /^qwen2\.5-omni-7b$/, template: "Qwen 2.5 Omni 7B" },
        { pattern: /^qwen2\.5-vl-72b-instruct$/, template: "Qwen 2.5 VL 72B Instruct" },
        { pattern: /^qwen2\.5-vl-32b-instruct$/, template: "Qwen 2.5 VL 32B Instruct" },
        { pattern: /^qwen2\.5-vl-7b-instruct$/, template: "Qwen 2.5 VL 7B Instruct" },
        { pattern: /^qwen2\.5-vl-3b-instruct$/, template: "Qwen 2.5 VL 3B Instruct" },
        // Old Qwen series
        { pattern: /^qwen-long$/, template: "Qwen Long" },
        { pattern: /^qwen-plus$/, template: "Qwen Plus" },
        { pattern: /^qwen-max$/, template: "Qwen Max" },
        { pattern: /^qwen-flash$/, template: "Qwen Flash" },
        { pattern: /^qwen-turbo$/, template: "Qwen Turbo" },
        { pattern: /^qwen-mt-plus$/, template: "Qwen MT Plus" },
        { pattern: /^qwen-mt-turbo$/, template: "Qwen MT Turbo" },
        { pattern: /^qwen-mt-flash$/, template: "Qwen MT Flash" },
        { pattern: /^qwen-mt-lite$/, template: "Qwen MT Lite" },
        { pattern: /^qwq-32b$/, template: "QwQ 32B" },
      ];

      for (const rule of rules) {
        if (rule.pattern.test(baseId)) return rule.template;
      }

      // Fallback: smart formatting
      // Handle patterns like:
      //   qwen3.6-plus-2026-04-02 → Qwen 3.6 Plus
      //   qwen3-235b-a22b → Qwen 3 235B-A22B
      //   qwen2.5-72b-instruct → Qwen 2.5 72B Instruct
      //   qwen3-0.6b → Qwen 3 0.6B
      let name = baseId
        // Remove date suffix
        .replace(/-\d{4}-\d{2}-\d{2}$/, "")
        // qwen → Qwen
        .replace(/^qwen/, "Qwen")
        // qwq → QwQ
        .replace(/^qwq/, "QwQ")
        // qvq → QvQ
        .replace(/^qvq/, "QvQ")
        // Separate version number: 3.6 → 3.6, 2.5 → 2.5
        .replace(/^(Qwen|QwQ|QvQ)(\d+\.\d+)/, "$1 $2")
        // Separate major version: 3 → 3
        .replace(/^(Qwen|QwQ|QvQ)(\d+)/, "$1 $2")
        // Size suffixes: -72b → 72B, -a22b → A22B
        .replace(/-a(\d+b)$/i, " A$1")
        .replace(/-(\d+b)$/i, " $1")
        // Size suffixes in middle: -72b- → 72B-
        .replace(/-a(\d+b)-/gi, " A$1-")
        .replace(/-(\d+b)-/gi, " $1-")
        // Common words: -instruct → Instruct, -chat → Chat
        .replace(/-instruct/gi, " Instruct")
        .replace(/-chat/gi, " Chat")
        .replace(/-coder/gi, " Coder")
        .replace(/-thinking/gi, " Thinking")
        .replace(/-preview/gi, " Preview")
        .replace(/-omni/gi, " Omni")
        .replace(/-vl/gi, " VL")
        .replace(/-tts/gi, " TTS")
        .replace(/-asr/gi, " ASR")
        .replace(/-mt/gi, " MT")
        .replace(/-long/gi, " Long")
        .replace(/-plus/gi, " Plus")
        .replace(/-max/gi, " Max")
        .replace(/-flash/gi, " Flash")
        .replace(/-turbo/gi, " Turbo")
        .replace(/-next/gi, " Next")
        .replace(/-lite/gi, " Lite")
        .replace(/-character/gi, " Character")
        .replace(/-latest$/gi, " Latest")
        .replace(/-1m$/gi, " 1M")
        // Language suffixes: -ja → JA
        .replace(/-ja$/gi, " JA")
        // Capitalize remaining words
        .replace(/-([a-z])/gi, " $1")
        // Clean up
        .replace(/\s+/g, " ")
        .trim();

      // Fix size suffixes: "72b" → "72B"
      name = name.replace(/\b(\d+)b\b/gi, "$1B");

      return name;
    },
  },

  // -----------------------------------------------------------------------
  // Step 8: Derive family
  // -----------------------------------------------------------------------
  deriveFamily: {
    execute: (modelId: string): string => {
      return deriveFamilyFromId(modelId);
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
