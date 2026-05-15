/**
 * 声明式提取运行时 — 固定代码，AI 不能修改
 *
 * 传入 (原始数据 + 提取规则) → 结构化数据
 * 运行时只做规则应用，不做任何数据编造
 */

import type { Model, ModelModality, Pricing } from "../../types/index";
import {
  type DeclarativePipeline,
  type HtmlExtractionRule,
  type MdExtractionRule,
  type ApiExtractionRule,
  type Transform,
  type HtmlLabelValueRule,
  type HtmlTableRule,
  type HtmlListRule,
  type HtmlSectionRule,
  type MdLabelValueRule,
  type MdTableRule,
  type MdListRule,
  type MdSectionRule,
  type ApiFieldRule,
  type ApiArrayRule,
} from "./extraction-rules";

// ===========================================================================
// 值转换函数 — 固定实现，AI 不能添加新的
// ===========================================================================

const transformFns: Record<Transform, (value: string) => unknown> = {
  parseFloat: (v) => parseFloat(v.replace(/[$,]/g, "")),
  parseInt: (v) => parseInt(v.replace(/[,]/g, ""), 10),
  parseNumber: (v) => parseInt(v.replace(/[,]/g, ""), 10),
  parsePrice: (v) => parseFloat(v.replace(/[$,]/g, "")),
  parseDate: (v) => {
    // Try YYYY-MM-DD
    const ymd = v.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (ymd?.[1] && ymd?.[2] && ymd?.[3]) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`;
    // Try Mon DD, YYYY (e.g., "Jan 15, 2024")
    const months: Record<string, string> = {
      jan: "01",
      feb: "02",
      mar: "03",
      apr: "04",
      may: "05",
      jun: "06",
      jul: "07",
      aug: "08",
      sep: "09",
      oct: "10",
      nov: "11",
      dec: "12",
    };
    const mdy = v.match(/(\w{3})\s+(\d{1,2}),?\s+(\d{4})/i);
    if (mdy?.[1]) {
      const mm = months[mdy[1].toLowerCase()];
      if (mm && mdy[3]) return `${mdy[3]}-${mm}`;
    }
    // Try YYYY-MM
    const ym = v.match(/(\d{4})-(\d{2})/);
    if (ym?.[1] && ym?.[2]) return `${ym[1]}-${ym[2]}`;
    return v;
  },
  parseModality: (v) => v.toLowerCase().trim() as ModelModality,
  toLowerCase: (v) => v.toLowerCase(),
  toUpperCase: (v) => v.toUpperCase(),
  trim: (v) => v.trim(),
  removeCommas: (v) => v.replace(/,/g, ""),
  identity: (v) => v,
};

function applyTransform(value: string, transform: Transform | undefined): unknown {
  if (!transform) return value;
  return transformFns[transform](value);
}

// ===========================================================================
// HTML 提取运行时
// ===========================================================================

/**
 * 对 HTML 内容应用提取规则
 */
export function extractHtml(
  rawHtml: string,
  rules: HtmlExtractionRule[],
): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case "labelValue":
        applyHtmlLabelValue(rawHtml, rule, results);
        break;
      case "table":
        applyHtmlTable(rawHtml, rule, results);
        break;
      case "list":
        applyHtmlList(rawHtml, rule, results);
        break;
      case "section":
        applyHtmlSection(rawHtml, rule, results);
        break;
    }
  }

  return results;
}

function applyHtmlLabelValue(
  html: string,
  rule: HtmlLabelValueRule,
  results: Record<string, unknown>[],
): void {
  // 使用正则从 HTML 中查找标签+相邻值
  const labelEscaped = rule.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`${labelEscaped}<\\/[^>]+><[^>]+>[^$]*?\\$?([\\d,.]+)`, "i");
  const match = html.match(pattern);
  if (match?.[1]) {
    const value = applyTransform(match[1], rule.transform);
    results.push({ [rule.label]: value });
  }
}

function applyHtmlTable(
  html: string,
  rule: HtmlTableRule,
  results: Record<string, unknown>[],
): void {
  // 提取表格中的所有行
  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellPattern = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;

  let rowMatch: RegExpExecArray | null;
  let headerRow: string[] | null = null;

  while ((rowMatch = rowPattern.exec(html)) !== null) {
    const rowContent = rowMatch[1];
    if (!rowContent) continue;

    const cells: string[] = [];
    let cellMatch: RegExpExecArray | null;

    // Reset lastIndex for cell pattern
    cellPattern.lastIndex = 0;
    while ((cellMatch = cellPattern.exec(rowContent)) !== null) {
      cells.push((cellMatch[1] as string).replace(/<[^>]+>/g, "").trim());
    }

    if (!headerRow) {
      headerRow = cells;
      continue;
    }

    // Map columns by header
    const row: Record<string, unknown> = {};
    for (const [fieldName, headerText] of Object.entries(rule.columns)) {
      const colIdx = headerRow.indexOf(headerText);
      if (colIdx >= 0 && colIdx < cells.length) {
        const transform = rule.transforms?.[fieldName];
        row[fieldName] = applyTransform(cells[colIdx] as string, transform);
      }
    }

    if (rule.rowFilter && !rowContent.includes(rule.rowFilter)) continue;
    if (Object.keys(row).length > 0) results.push(row);
  }
}

function applyHtmlList(html: string, rule: HtmlListRule, results: Record<string, unknown>[]): void {
  // 用正则模拟 CSS Selector 匹配
  const selectorRegex = cssSelectorToRegex(rule.selector, rule.extract);
  const pattern = new RegExp(selectorRegex, "gi");
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null) {
    let value = match[1] ?? match[0];

    if (rule.pattern) {
      const subPattern = new RegExp(rule.pattern);
      const subMatch = value.match(subPattern);
      if (subMatch?.[1]) {
        value = subMatch[1];
      } else {
        continue;
      }
    }

    if (rule.transform) {
      value = String(applyTransform(value, rule.transform));
    }

    results.push({ value });
  }
}

function applyHtmlSection(
  html: string,
  rule: HtmlSectionRule,
  results: Record<string, unknown>[],
): void {
  const startIdx = html.indexOf(rule.sectionStart);
  if (startIdx === -1) return;

  const endIdx = rule.sectionEnd ? html.indexOf(rule.sectionEnd, startIdx) : html.length;

  const section = html.slice(startIdx, endIdx !== -1 ? endIdx : html.length);
  const subResults = extractHtml(section, rule.rules);
  results.push(...subResults);
}

/**
 * 将简单的 CSS Selector 转换为正则表达式
 * 只支持子集：元素名、属性选择器
 */
function cssSelectorToRegex(selector: string, extract: string): string {
  // a[href^='/api/docs/models/'] → <a[^>]*href="(/api/docs/models/[^"]*)"[^>]*>
  const hrefMatch = selector.match(/^(\w+)\[href\^='([^']+)'\]$/);
  if (hrefMatch?.[1] && hrefMatch?.[2]) {
    const tag = hrefMatch[1];
    const prefix = hrefMatch[2];
    if (extract === "href") {
      return `<${tag}[^>]*href="(${prefix}[^"]*)"[^>]*>`;
    }
    return `<${tag}[^>]*href="${prefix}[^"]*"[^>]*>([^<]*)<\\/${tag}>`;
  }

  // div.classname → <div[^>]*class="[^"]*classname[^"]*"[^>]*>
  const classMatch = selector.match(/^(\w+)\.([a-zA-Z0-9_-]+)$/);
  if (classMatch?.[1] && classMatch?.[2]) {
    return `<${classMatch[1]}[^>]*class="[^"]*${classMatch[2]}[^"]*"[^>]*>([^<]*)<\\/${classMatch[1]}>`;
  }

  // 通用标签匹配
  const tagMatch = selector.match(/^(\w+)$/);
  if (tagMatch?.[1]) {
    return `<${tagMatch[1]}[^>]*>([^<]*)<\\/${tagMatch[1]}>`;
  }

  // Fallback: 直接用 selector 作为正则
  return selector;
}

// ===========================================================================
// Markdown 提取运行时
// ===========================================================================

/**
 * 对 Markdown 内容应用提取规则
 */
export function extractMarkdown(
  rawMd: string,
  rules: MdExtractionRule[],
): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case "labelValue":
        applyMdLabelValue(rawMd, rule, results);
        break;
      case "table":
        applyMdTable(rawMd, rule, results);
        break;
      case "list":
        applyMdList(rawMd, rule, results);
        break;
      case "section":
        applyMdSection(rawMd, rule, results);
        break;
    }
  }

  return results;
}

function applyMdLabelValue(
  md: string,
  rule: MdLabelValueRule,
  results: Record<string, unknown>[],
): void {
  const regex = new RegExp(rule.pattern, "i");
  const match = md.match(regex);
  if (match) {
    const group = rule.group ?? 1;
    const value = match[group];
    if (value != null) {
      results.push({ [rule.label]: applyTransform(value, rule.transform) });
    }
  }
}

function applyMdTable(md: string, rule: MdTableRule, results: Record<string, unknown>[]): void {
  const lines = md.split("\n");
  let headerIdx = -1;
  let headers: string[] = [];

  // Find header row
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i] as string;
    if (ln && (ln.includes(rule.headerPattern) || new RegExp(rule.headerPattern).test(ln))) {
      headers = ln
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      headerIdx = i;
      break;
    }
  }

  if (headerIdx === -1) return;

  // Skip separator row (|---|---|)
  const dataStart = headerIdx + 2;

  for (let i = dataStart; i < lines.length; i++) {
    const line = (lines[i] as string).trim();
    if (!line.startsWith("|")) break;

    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    const row: Record<string, unknown> = {};

    for (const [fieldName, headerText] of Object.entries(rule.columns)) {
      const colIdx = headers.indexOf(headerText);
      if (colIdx >= 0 && colIdx < cells.length) {
        const transform = rule.transforms?.[fieldName];
        row[fieldName] = applyTransform(cells[colIdx] as string, transform);
      }
    }

    if (rule.rowFilter && !line.includes(rule.rowFilter)) continue;
    if (Object.keys(row).length > 0) results.push(row);
  }
}

function applyMdList(md: string, rule: MdListRule, results: Record<string, unknown>[]): void {
  const regex = new RegExp(rule.pattern, "gi");
  let match: RegExpExecArray | null;

  while ((match = regex.exec(md)) !== null) {
    const row: Record<string, unknown> = {};
    for (const [fieldName, groupIdx] of Object.entries(rule.groups)) {
      const value = match[groupIdx];
      if (value != null) {
        const transform = rule.transforms?.[fieldName];
        row[fieldName] = applyTransform(value, transform);
      }
    }
    if (Object.keys(row).length > 0) results.push(row);
  }
}

function applyMdSection(md: string, rule: MdSectionRule, results: Record<string, unknown>[]): void {
  const headingRegex = new RegExp(rule.headingPattern, "i");
  const lines = md.split("\n");
  let startIdx = -1;
  let endIdx = md.length;

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i] as string;
    if (ln && headingRegex.test(ln)) {
      startIdx = md.indexOf(ln);
    } else if (startIdx !== -1 && ln && /^#{1,3}\s/.test(ln) && i > 0) {
      endIdx = md.indexOf(ln);
      break;
    }
  }

  if (startIdx === -1) return;
  const section = md.slice(startIdx, endIdx);
  const subResults = extractMarkdown(section, rule.rules);
  results.push(...subResults);
}

// ===========================================================================
// API (JSON) 提取运行时
// ===========================================================================

/**
 * 对 JSON 数据应用提取规则
 *
 * 使用简化的 JSONPath 实现（支持 $, ., [], [*]）
 */
export function extractJson(data: unknown, rules: ApiExtractionRule[]): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case "field":
        applyApiField(data, rule, results);
        break;
      case "array":
        applyApiArray(data, rule, results);
        break;
    }
  }

  return results;
}

function applyApiField(
  data: unknown,
  rule: ApiFieldRule,
  results: Record<string, unknown>[],
): void {
  const value = jsonPath(data, rule.jsonpath);
  if (value !== undefined) {
    const transformed =
      typeof value === "string" && rule.transform ? applyTransform(value, rule.transform) : value;
    results.push({ value: transformed });
  }
}

function applyApiArray(
  data: unknown,
  rule: ApiArrayRule,
  results: Record<string, unknown>[],
): void {
  const arr = jsonPath(data, rule.arrayPath);
  if (!Array.isArray(arr)) return;

  for (const item of arr) {
    if (rule.itemFilter) {
      if (!JSON.stringify(item).includes(rule.itemFilter)) continue;
    }

    const row: Record<string, unknown> = {};
    for (const [fieldName, path] of Object.entries(rule.fields)) {
      const value = jsonPath(item, path);
      if (value !== undefined) {
        const transform = rule.transforms?.[fieldName];
        row[fieldName] =
          typeof value === "string" && transform ? applyTransform(value, transform) : value;
      }
    }
    if (Object.keys(row).length > 0) results.push(row);
  }
}

/**
 * 简化的 JSONPath 实现
 * 支持: $, .property, [index], [*]
 */
function jsonPath(data: unknown, path: string): unknown {
  if (!path.startsWith("$")) return undefined;

  const parts = path
    .slice(1) // 去掉 $
    .split(/\.|\[(\d+|\*)\]/)
    .filter(Boolean);

  let current: unknown = data;

  for (const part of parts) {
    if (current == null) return undefined;

    if (part === "*") {
      if (Array.isArray(current)) {
        return current;
      }
      if (typeof current === "object" && current !== null) {
        return Object.values(current as Record<string, unknown>);
      }
      return undefined;
    }

    if (/^\d+$/.test(part)) {
      const idx = parseInt(part, 10);
      if (Array.isArray(current) && idx < current.length) {
        current = current[idx];
      } else {
        return undefined;
      }
    } else {
      if (typeof current === "object" && current !== null && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
  }

  return current;
}

// ===========================================================================
// 数据获取
// ===========================================================================

interface SourceInput {
  url: string;
  type: "html" | "markdown" | "api";
  requestOptions?: {
    headers?: Record<string, string>;
    timeout?: number;
  };
}

interface SourceResult {
  html?: string;
  markdown?: string;
  json?: unknown;
}

/** 获取数据源内容 */
async function fetchSource(source: SourceInput): Promise<SourceResult> {
  const init: RequestInit = {};
  if (source.requestOptions?.headers) {
    init.headers = source.requestOptions.headers;
  }
  const resp = await fetch(source.url, init);

  if (!resp.ok) {
    throw new Error(`Failed to fetch ${source.url}: ${resp.status}`);
  }

  const text = await resp.text();
  switch (source.type) {
    case "html":
      return { html: text };
    case "markdown":
      return { markdown: text };
    case "api":
      return { json: JSON.parse(text) };
  }
}

// ===========================================================================
// Pipeline 执行器 — 固定流程，AI 不能修改
// ===========================================================================

interface DiscoveredModel {
  id: string;
  deprecated?: boolean;
  raw?: unknown;
}

/**
 * 执行声明式 Pipeline
 *
 * 固定流程：
 * 1. 发现模型（从数据源 + 规则）
 * 2. 对每个模型，并行提取各维度数据
 * 3. 合并为 Model[]
 *
 * ⚠️ 这个函数本身不可能产生幻觉，因为它只做规则应用和数据合并
 */
export async function runDeclarativePipeline(pipeline: DeclarativePipeline): Promise<Model[]> {
  // Step 1: 发现模型
  const discovered = await discoverModels(pipeline.discover, pipeline.filter);
  console.log(`  发现 ${discovered.length} 个模型`);

  // Step 2: 对每个模型提取各维度数据
  const models: Model[] = [];
  const skipped: string[] = [];

  for (const model of discovered) {
    try {
      const result = await extractModelData(model, pipeline);
      if (result) {
        models.push(result);
      } else {
        skipped.push(model.id);
      }
    } catch (err) {
      console.warn(`  提取 ${model.id} 失败:`, err);
      skipped.push(model.id);
    }
  }

  if (skipped.length > 0) {
    console.warn(`  跳过 ${skipped.length} 个模型: ${skipped.join(", ")}`);
  }

  return models;
}

async function discoverModels(
  config: DeclarativePipeline["discover"],
  filter?: DeclarativePipeline["filter"],
): Promise<DiscoveredModel[]> {
  const source = await fetchSource(config.source);
  let rawResults: Record<string, unknown>[];

  switch (config.source.type) {
    case "html":
      rawResults = extractHtml(source.html ?? "", config.rules as HtmlExtractionRule[]);
      break;
    case "markdown":
      rawResults = extractMarkdown(source.markdown ?? "", config.rules as MdExtractionRule[]);
      break;
    case "api":
      rawResults = extractJson(source.json, config.rules as ApiExtractionRule[]);
      break;
  }

  // 将提取结果转换为 DiscoveredModel[]
  const models: DiscoveredModel[] = rawResults
    .map((r) => ({
      id: String(r["value"] ?? r["id"] ?? r["slug"] ?? ""),
      deprecated: r["deprecated"] === true || r["deprecated"] === "true",
      raw: r,
    }))
    .filter((m) => m.id.length > 0);

  // 应用过滤规则
  if (filter?.excludePatterns) {
    return models.filter((m) => {
      for (const pattern of filter.excludePatterns) {
        if (new RegExp(pattern).test(m.id)) return false;
      }
      return true;
    });
  }

  return models;
}

async function extractModelData(
  discovered: DiscoveredModel,
  pipeline: DeclarativePipeline,
): Promise<Model | null> {
  const { id, deprecated } = discovered;

  // 解析 URL 模板变量
  const resolveUrl = (url: string) => url.replace(/\$\{modelId\}/g, id);

  // 并行提取各维度数据
  const [
    pricingResult,
    limitsResult,
    modalitiesResult,
    featuresResult,
    datesResult,
    snapshotsResult,
  ] = await Promise.all([
    extractDimension(pipeline.extractPricing, resolveUrl),
    pipeline.extractLimits
      ? extractDimension(pipeline.extractLimits, resolveUrl)
      : Promise.resolve([]),
    pipeline.extractModalities
      ? extractDimension(pipeline.extractModalities, resolveUrl)
      : Promise.resolve([]),
    pipeline.extractFeatures
      ? extractDimension(pipeline.extractFeatures, resolveUrl)
      : Promise.resolve([]),
    extractDimension(pipeline.extractDates, resolveUrl),
    pipeline.extractSnapshots
      ? extractDimension(pipeline.extractSnapshots, resolveUrl)
      : Promise.resolve([]),
  ]);

  // 定价是必须的
  const pricing = buildPricing(pricingResult);
  if (!pricing) {
    console.warn(`  ${id}: 无定价数据`);
    return null;
  }

  // 日期是必须的
  const dates = buildDates(datesResult);
  if (!dates) {
    console.warn(`  ${id}: 无日期数据`);
    return null;
  }

  // 上下文窗口
  const limit = buildLimit(limitsResult);

  // 模态
  const modalities = buildModalities(modalitiesResult, pipeline.extractModalities?.modalityMap);

  // 特性
  const features = buildFeatures(featuresResult, pipeline.extractFeatures?.featureMap);

  // 快照
  const snapshots = buildSnapshots(snapshotsResult);

  // 名称和家族
  const name = applyDeriveRule(id, pipeline.deriveName);
  const family = applyDeriveRule(id, pipeline.deriveFamily);

  // 合并为 Model
  const model: Model = {
    id,
    name,
    family,
    ...(deprecated ? { deprecated: true } : {}),
    pricing,
    ...(limit ? { limit } : {}),
    modalities,
    ...features,
    ...dates,
    ...(snapshots.length > 0 ? { snapshots } : {}),
  };

  return model;
}

async function extractDimension(
  config: {
    source: SourceInput;
    rules: HtmlExtractionRule[] | MdExtractionRule[] | ApiExtractionRule[];
  },
  resolveUrl: (url: string) => string,
): Promise<Record<string, unknown>[]> {
  const url = resolveUrl(config.source.url);
  const source = await fetchSource({ ...config.source, url });

  switch (config.source.type) {
    case "html":
      return extractHtml(source.html ?? "", config.rules as HtmlExtractionRule[]);
    case "markdown":
      return extractMarkdown(source.markdown ?? "", config.rules as MdExtractionRule[]);
    case "api":
      return extractJson(source.json, config.rules as ApiExtractionRule[]);
  }
}

// ===========================================================================
// 数据构建函数 — 从提取结果构建类型化的数据
// ===========================================================================

function buildPricing(results: Record<string, unknown>[]): Pricing | null {
  if (results.length === 0) return null;
  const merged = Object.assign({}, ...results);

  // Token pricing
  if (merged["input"] != null && merged["output"] != null) {
    return {
      input: Number(merged["input"]),
      output: Number(merged["output"]),
      ...(merged["cache_read"] != null ? { cache_read: Number(merged["cache_read"]) } : {}),
    };
  }

  // Unit pricing
  if (merged["unit"] === "free") return { unit: "free" };
  if (merged["price"] != null && merged["unit"] != null) {
    return { unit: merged["unit"] as "per_image" | "per_second", price: Number(merged["price"]) };
  }

  return null;
}

function buildDates(
  results: Record<string, unknown>[],
): { release_date: string; last_updated: string; knowledge?: string } | null {
  if (results.length === 0) return null;
  const merged = Object.assign({}, ...results);

  const release_date = merged["release_date"] ?? merged["releaseDate"];
  const last_updated = merged["last_updated"] ?? merged["lastUpdated"];
  const knowledge = merged["knowledge"];

  if (!release_date || !last_updated) return null;

  return {
    release_date: String(release_date),
    last_updated: String(last_updated),
    ...(knowledge ? { knowledge: String(knowledge) } : {}),
  };
}

function buildLimit(
  results: Record<string, unknown>[],
): { context: number; output: number } | null {
  if (results.length === 0) return null;
  const merged = Object.assign({}, ...results);

  const context = merged["context"] ?? merged["inputLimit"];
  const output = merged["output"] ?? merged["outputLimit"];

  if (context == null || output == null) return null;

  return { context: Number(context), output: Number(output) };
}

function buildModalities(
  results: Record<string, unknown>[],
  modalityMap?: Record<string, ModelModality>,
): { input: ModelModality[]; output: ModelModality[] } {
  const defaultModalities: { input: ModelModality[]; output: ModelModality[] } = {
    input: ["text"],
    output: ["text"],
  };

  if (results.length === 0) return defaultModalities;

  const merged = Object.assign({}, ...results);
  const map = modalityMap ?? {};

  const input = Array.isArray(merged["input"])
    ? (merged["input"] as string[]).map((m) => (map[m] ?? m.toLowerCase()) as ModelModality)
    : defaultModalities.input;

  const output = Array.isArray(merged["output"])
    ? (merged["output"] as string[]).map((m) => (map[m] ?? m.toLowerCase()) as ModelModality)
    : defaultModalities.output;

  return { input, output };
}

function buildFeatures(
  results: Record<string, unknown>[],
  featureMap?: Record<string, string>,
): Record<string, boolean> {
  if (results.length === 0) return {};

  const merged = Object.assign({}, ...results);
  const features: Record<string, boolean> = {};
  const map = featureMap ?? {};

  for (const [key, value] of Object.entries(merged)) {
    const fieldName = map[key] ?? key;
    if (typeof value === "boolean") {
      features[fieldName] = value;
    }
  }

  return features;
}

function buildSnapshots(
  results: Record<string, unknown>[],
): Array<{ id: string; overrides?: Record<string, unknown> }> {
  if (results.length === 0) return [];

  return results
    .filter((r) => r["id"] || r["snapshotId"])
    .map((r) => {
      const id = String(r["id"] ?? r["snapshotId"] ?? "");
      const rest = { ...r };
      delete rest["id"];
      delete rest["snapshotId"];
      const deprecated = rest["deprecated"];
      delete rest["deprecated"];
      return {
        id,
        ...(deprecated != null
          ? { overrides: { deprecated: deprecated === true || deprecated === "true", ...rest } }
          : Object.keys(rest).length > 0
            ? { overrides: rest }
            : {}),
      };
    });
}

function applyDeriveRule(
  modelId: string,
  config: { rules: Array<{ pattern: string; template: string }>; default: string },
): string {
  for (const rule of config.rules) {
    const regex = new RegExp(rule.pattern);
    const match = modelId.match(regex);
    if (match) {
      return rule.template.replace(/\$(\d+)/g, (_, idx: string) => match[parseInt(idx)] ?? "");
    }
  }
  return config.default.replace(/\$\{id\}/g, modelId);
}
