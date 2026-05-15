import { defineProvider, runPipeline } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type {
  ScrapePipeline,
  DiscoveredModel,
  ExtractedLimit,
  ExtractedModalities,
  ExtractedFeatures,
  ExtractedDates,
  ExtractedSnapshot,
} from "../../scripts/lib/index";
import type { Pricing } from "../../types/index";

// ===========================================================================
// Provider definition
// ===========================================================================

const provider = defineProvider({
  id: "zhipuai",
  name: "Zhipu AI (智谱)",
  url: "https://open.bigmodel.cn",
  api_docs: "https://docs.bigmodel.cn",
  apis: {
    openai: "https://open.bigmodel.cn/api/paas/v4",
  },
});

// ===========================================================================
// Data sources
// ===========================================================================

const MODEL_OVERVIEW_URL = "https://docs.bigmodel.cn/cn/guide/start/model-overview.md";

// ===========================================================================
// Types
// ===========================================================================

interface RawModelInfo {
  id: string;
  name: string;
  contextStr: string;
  outputStr: string;
  category: string;
  free: boolean;
}

// ===========================================================================
// Helpers
// ===========================================================================

function parseTokenCount(val: string): number | undefined {
  if (!val || val === "/" || val === "-") return undefined;
  const cleaned = val.replace(/<[^>]+>/g, "").trim();
  const kMatch = cleaned.match(/^(\d+\.?\d*)K$/i);
  if (kMatch) return Math.round(parseFloat(kMatch[1] ?? "0") * 1000);
  const mMatch = cleaned.match(/^(\d+\.?\d*)M$/i);
  if (mMatch) return Math.round(parseFloat(mMatch[1] ?? "0") * 1000000);
  const numMatch = cleaned.match(/^(\d+)$/);
  if (numMatch) return parseInt(numMatch[1] ?? "0", 10);
  return undefined;
}

function defaultOutputLimit(id: string): number {
  const rules: Array<{ pattern: RegExp; limit: number }> = [
    { pattern: /^glm-5/, limit: 128_000 },
    { pattern: /^glm-4\.7/, limit: 128_000 },
    { pattern: /^glm-4\.6/, limit: 128_000 },
    { pattern: /^glm-4\.5-air/, limit: 96_000 },
    { pattern: /^glm-4-flashx/, limit: 16_000 },
    { pattern: /^glm-4-long/, limit: 4_000 },
    { pattern: /^glm-4-plus/, limit: 4_000 },
    { pattern: /^glm-4\.6v/, limit: 32_000 },
    { pattern: /^glm-5v/, limit: 128_000 },
  ];
  for (const { pattern, limit } of rules) {
    if (pattern.test(id)) return limit;
  }
  return 4096;
}

function getCurrentDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// ===========================================================================
// Step 1: Discover models from Markdown overview page
// ===========================================================================

async function fetchModels(): Promise<RawModelInfo[]> {
  const resp = await fetch(MODEL_OVERVIEW_URL);
  const md = await resp.text();

  const models: RawModelInfo[] = [];
  const lines = md.split("\n");

  let currentSection = "";
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^###\s+(.+)$/);
    if (headingMatch) {
      currentSection = (headingMatch[1] ?? "").trim();
      inTable = false;
      tableHeader = [];
      tableRows = [];
      continue;
    }

    if (line.startsWith("|")) {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      if (!inTable) {
        tableHeader = cells;
        inTable = true;
      } else if (cells.every((c) => /^[-:]+$/.test(c))) {
        continue;
      } else {
        tableRows.push(cells);
      }
    } else if (inTable) {
      processTable(tableHeader, tableRows, currentSection, models);
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }
  }

  if (inTable && tableRows.length > 0) {
    processTable(tableHeader, tableRows, currentSection, models);
  }

  return models;
}

function processTable(
  header: string[],
  rows: string[][],
  section: string,
  models: RawModelInfo[],
): void {
  const modelCol = header.findIndex((h) => h.includes("模型"));
  const contextCol = header.findIndex((h) => h.includes("上下文"));
  const outputCol = header.findIndex((h) => h.includes("最大输出"));

  if (modelCol === -1) return;

  for (const row of rows) {
    if (row.length <= modelCol) continue;

    const modelCell = row[modelCol] ?? "";
    const nameMatch = modelCell.match(/\[([^\]]+)\]/);
    if (!nameMatch) continue;

    const displayName = nameMatch[1] ?? "";
    const id = displayName.toLowerCase().replace(/\s+/g, "-");

    const contextStr = contextCol >= 0 ? (row[contextCol] ?? "") : "";
    const outputStr = outputCol >= 0 ? (row[outputCol] ?? "") : "";

    const free = modelCell.includes("免费") || section.includes("免费");
    const deprecated = modelCell.includes("即将下线") || modelCell.includes("弃用");

    const isTextModel = section.includes("文本") || section.includes("其他");
    const isVisionModel = section.includes("视觉");
    const isImageVideoAudio =
      section.includes("图像生成") || section.includes("视频生成") || section.includes("音视频");

    if (!isTextModel && !isVisionModel) continue;
    if (isImageVideoAudio) continue;
    if (deprecated) continue;

    models.push({
      id,
      name: displayName,
      contextStr,
      outputStr,
      category: isTextModel ? "text" : "vision",
      free,
    });
  }
}

// ===========================================================================
// Step 2: Extract pricing (hardcoded from first-party pricing page)
// ===========================================================================

// Pricing data from https://open.bigmodel.cn/pricing (CSR page, accessed 2026-05-15)
// Note: Some models have tiered pricing. We use the base tier (input length [0, 32K)).
const HARDCODED_PRICING: Record<string, { input: number; output: number; free: boolean }> = {
  // 旗舰模型 (Flagship)
  "glm-5.1": { input: 6, output: 24, free: false },
  "glm-5": { input: 4, output: 18, free: false },
  "glm-5-turbo": { input: 5, output: 22, free: false },
  "glm-4.7": { input: 2, output: 8, free: false },
  "glm-4.7-flashx": { input: 0.5, output: 3, free: false },
  "glm-4.7-flash": { input: 0, output: 0, free: true },
  "glm-4.6": { input: 2, output: 8, free: false },
  "glm-4.5-air": { input: 0.8, output: 2, free: false },
  "glm-4.5-airx": { input: 0.8, output: 6, free: false },
  "glm-4.5-flash": { input: 0, output: 0, free: true },
  "glm-4-long": { input: 1, output: 4, free: false },
  "glm-4-flashx-250414": { input: 0.1, output: 0.1, free: false },
  "glm-4-flash-250414": { input: 0, output: 0, free: true },
  // 模型推理 (Model inference)
  "glm-4-plus": { input: 5, output: 5, free: false },
  "glm-4-air-250414": { input: 0.5, output: 0.5, free: false },
  "glm-4-airx": { input: 10, output: 10, free: false },
  "glm-4-assistant": { input: 5, output: 5, free: false },
  // Vision models
  "glm-5v-turbo": { input: 5, output: 22, free: false },
  "glm-4.6v": { input: 2, output: 8, free: false },
  "glm-4.6v-flash": { input: 0, output: 0, free: true },
  "glm-4.1v-thinking-flashx": { input: 0.5, output: 3, free: false },
  "glm-4.1v-thinking-flash": { input: 0, output: 0, free: true },
  "glm-4v-flash": { input: 0, output: 0, free: true },
  "glm-ocr": { input: 0, output: 0, free: true },
  "autoglm-phone": { input: 0, output: 0, free: true },
};

// ===========================================================================
// Pipeline definition
// ===========================================================================

const pipeline: ScrapePipeline = {
  discover: {
    source: {
      url: MODEL_OVERVIEW_URL,
      type: "llms_txt",
      description: "Zhipu AI model overview page (Markdown via Mintlify .md endpoint)",
    },
    execute: async (): Promise<DiscoveredModel[]> => {
      const rawModels = await fetchModels();
      return rawModels.map((m) => ({
        id: m.id,
        raw: m as unknown,
      }));
    },
  },

  extractPricing: {
    source: {
      url: "https://open.bigmodel.cn/pricing",
      type: "csr",
      description: "Zhipu AI pricing page (CSR — using hardcoded first-party data)",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, Pricing>> => {
      const pricingMap = new Map<string, Pricing>();

      for (const m of models) {
        const pricing = HARDCODED_PRICING[m.id];
        if (!pricing) {
          console.warn(`  ${m.id}: no pricing found`);
          continue;
        }

        if (pricing.free) {
          pricingMap.set(m.id, { unit: "free" });
        } else {
          pricingMap.set(m.id, {
            currency: "CNY",
            input: pricing.input,
            output: pricing.output,
          });
        }
      }

      return pricingMap;
    },
  },

  extractDates: {
    source: {
      url: MODEL_OVERVIEW_URL,
      type: "llms_txt",
      description: "Zhipu AI model overview page",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedDates>> => {
      const dateMap = new Map<string, ExtractedDates>();
      const currentDate = getCurrentDate();

      for (const m of models) {
        dateMap.set(m.id, {
          release_date: currentDate,
          last_updated: currentDate,
        });
      }

      return dateMap;
    },
  },

  extractLimits: {
    source: {
      url: MODEL_OVERVIEW_URL,
      type: "llms_txt",
      description: "Zhipu AI model overview page",
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
            output: output ?? defaultOutputLimit(m.id),
          });
        }
      }

      return limitsMap;
    },
  },

  extractModalities: {
    source: {
      url: MODEL_OVERVIEW_URL,
      type: "llms_txt",
      description: "Zhipu AI model overview page",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedModalities>> => {
      const modalitiesMap = new Map<string, ExtractedModalities>();

      for (const m of models) {
        const raw = m.raw as RawModelInfo | undefined;
        if (!raw) continue;

        if (raw.category === "vision") {
          modalitiesMap.set(m.id, {
            input: ["text", "image"],
            output: ["text"],
          });
        } else {
          modalitiesMap.set(m.id, {
            input: ["text"],
            output: ["text"],
          });
        }
      }

      return modalitiesMap;
    },
  },

  extractFeatures: {
    source: {
      url: MODEL_OVERVIEW_URL,
      type: "llms_txt",
      description: "Zhipu AI model overview page",
    },
    execute: async (models: DiscoveredModel[]): Promise<Map<string, ExtractedFeatures>> => {
      const featuresMap = new Map<string, ExtractedFeatures>();

      for (const m of models) {
        const features: ExtractedFeatures = {
          reasoning:
            m.id.includes("thinking") || m.id.startsWith("glm-5") || m.id.startsWith("glm-z1"),
          tool_call: true,
          structured_output: true,
        };

        featuresMap.set(m.id, features);
      }

      return featuresMap;
    },
  },

  extractSnapshots: {
    source: {
      url: MODEL_OVERVIEW_URL,
      type: "llms_txt",
      description: "Zhipu AI model overview page",
    },
    execute: async (_models: DiscoveredModel[]): Promise<Map<string, ExtractedSnapshot[]>> => {
      return new Map();
    },
  },

  deriveName: {
    execute: (modelId: string): string => {
      const rules: Array<{ pattern: RegExp; template: string }> = [
        { pattern: /^glm-5\.1$/, template: "GLM-5.1" },
        { pattern: /^glm-5$/, template: "GLM-5" },
        { pattern: /^glm-5-turbo$/, template: "GLM-5-Turbo" },
        { pattern: /^glm-5v-turbo$/, template: "GLM-5V-Turbo" },
        { pattern: /^glm-4\.7$/, template: "GLM-4.7" },
        { pattern: /^glm-4\.7-flashx$/, template: "GLM-4.7-FlashX" },
        { pattern: /^glm-4\.7-flash$/, template: "GLM-4.7-Flash" },
        { pattern: /^glm-4\.6$/, template: "GLM-4.6" },
        { pattern: /^glm-4\.6v$/, template: "GLM-4.6V" },
        { pattern: /^glm-4\.6v-flash$/, template: "GLM-4.6V-Flash" },
        { pattern: /^glm-4\.5-air$/, template: "GLM-4.5-Air" },
        { pattern: /^glm-4\.5-airx$/, template: "GLM-4.5-AirX" },
        { pattern: /^glm-4\.5-flash$/, template: "GLM-4.5-Flash" },
        { pattern: /^glm-4\.1v-thinking-flashx$/, template: "GLM-4.1V-Thinking-FlashX" },
        { pattern: /^glm-4\.1v-thinking-flash$/, template: "GLM-4.1V-Thinking-Flash" },
        { pattern: /^glm-4-long$/, template: "GLM-4-Long" },
        { pattern: /^glm-4-plus$/, template: "GLM-4-Plus" },
        { pattern: /^glm-4-air-250414$/, template: "GLM-4-Air-250414" },
        { pattern: /^glm-4-airx$/, template: "GLM-4-AirX" },
        { pattern: /^glm-4-assistant$/, template: "GLM-4-Assistant" },
        { pattern: /^glm-4-flashx-250414$/, template: "GLM-4-FlashX-250414" },
        { pattern: /^glm-4-flash-250414$/, template: "GLM-4-Flash-250414" },
        { pattern: /^glm-4v-flash$/, template: "GLM-4V-Flash" },
        { pattern: /^glm-ocr$/, template: "GLM-OCR" },
        { pattern: /^autoglm-phone$/, template: "AutoGLM-Phone" },
      ];

      for (const rule of rules) {
        if (rule.pattern.test(modelId)) return rule.template;
      }

      return modelId
        .replace(/^glm/, "GLM")
        .replace(/-flashx$/i, "-FlashX")
        .replace(/-flash$/i, "-Flash")
        .replace(/-air$/i, "-Air")
        .replace(/-airx$/i, "-AirX")
        .replace(/-long$/i, "-Long")
        .replace(/-plus$/i, "-Plus")
        .replace(/-turbo$/i, "-Turbo")
        .replace(/-assistant$/i, "-Assistant")
        .replace(/-thinking$/i, "-Thinking")
        .replace(/-ocr$/i, "-OCR")
        .replace(/-voice$/i, "-Voice");
    },
  },

  deriveFamily: {
    execute: (modelId: string): string => {
      const rules: Array<{ pattern: RegExp; family: string }> = [
        { pattern: /^glm-5\.1/, family: "glm-5" },
        { pattern: /^glm-5-turbo/, family: "glm-5" },
        { pattern: /^glm-5v/, family: "glm-5v" },
        { pattern: /^glm-4\.7/, family: "glm-4.7" },
        { pattern: /^glm-4\.6v/, family: "glm-4.6v" },
        { pattern: /^glm-4\.6/, family: "glm-4.6" },
        { pattern: /^glm-4\.5-air/, family: "glm-4.5" },
        { pattern: /^glm-4\.5-flash/, family: "glm-4.5" },
        { pattern: /^glm-4\.1v/, family: "glm-4.1v" },
        { pattern: /^glm-4-long/, family: "glm-4-long" },
        { pattern: /^glm-4-plus/, family: "glm-4-plus" },
        { pattern: /^glm-4-air/, family: "glm-4-air" },
        { pattern: /^glm-4-flash/, family: "glm-4-flash" },
        { pattern: /^glm-4v/, family: "glm-4v" },
        { pattern: /^autoglm/, family: "autoglm" },
      ];

      for (const rule of rules) {
        if (rule.pattern.test(modelId)) return rule.family;
      }

      return modelId.split("-").slice(0, 2).join("-");
    },
  },

  filter: (_model: DiscoveredModel): boolean => {
    return true;
  },
};

// ===========================================================================
// Scrape function
// ===========================================================================

export async function scrape(): Promise<ScrapeResult> {
  const models = await runPipeline(pipeline);

  return {
    provider,
    models,
  };
}
