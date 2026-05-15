/**
 * 声明式提取规则 — AI 只能定义"提取什么"，不能定义"怎么提取"
 *
 * 核心思路：
 * - HTML → 只能定义 CSS Selector
 * - Markdown → 只能定义 Regex
 * - API → 只能定义 JSONPath
 *
 * 运行时是固定的：传入 (原始数据 + 提取规则) → 结构化数据
 * AI 不能写任意代码，只能修改规则数据结构
 *
 * 三种提取模式：
 * 1. 按标签+相邻值提取 (labelValue) — 找到标签，提取相邻的值
 *    HTML: <div>Input</div><div>$5.00</div>
 *          → label="Input", valueSelector="div + div", transform="parsePrice"
 *    Markdown: **Input token limit** 1,048,576
 *          → pattern=/\*\*Input token limit\*\*\s*([\d,]+)/i
 *    API: { pricing: { input: 5 } }
 *          → jsonpath="$.pricing.input"
 *
 * 2. 表格提取 (table) — 找到表格，按列标题提取行数据
 *    HTML: <table> with header row → tableSelector, columns by header text
 *    Markdown: | Model | Input | Output | → regex for table rows
 *    API: [{ id, input, output }] → jsonpath for array
 *
 * 3. 列表/集合提取 (list) — 找到所有匹配元素，提取每个的值
 *    HTML: 所有 <a href="/models/xxx"> 链接 → selector, extract pattern
 *    Markdown: 所有 ### 标题 → regex pattern
 *    API: data[*].id → jsonpath
 */

import type { ModelModality } from "../../types/index";

// ===========================================================================
// 值转换函数 — 固定集合，AI 不能添加新的
// ===========================================================================

/**
 * 值转换函数 — 固定集合，AI 只能选择使用哪个，不能定义新的转换逻辑
 */
export type Transform =
  | "parseFloat" // 字符串 → 浮点数（如 "5.00" → 5.00）
  | "parseInt" // 字符串 → 整数（如 "128000" → 128000）
  | "parseNumber" // 带逗号的数字 → 整数（如 "1,048,576" → 1048576）
  | "parsePrice" // 价格字符串 → 浮点数（移除 $ 和逗号，如 "$5.00" → 5.00）
  | "parseDate" // 日期字符串 → YYYY-MM-DD 或 YYYY-MM
  | "parseModality" // 模态字符串 → ModelModality（如 "Text" → "text"）
  | "toLowerCase" // 字符串 → 小写
  | "toUpperCase" // 字符串 → 大写
  | "trim" // 字符串 → 去除空白
  | "removeCommas" // 字符串 → 移除逗号（如 "1,048,576" → "1048576"）
  | "identity"; // 不转换，保持原值

// ===========================================================================
// HTML 提取规则 — 只能定义 CSS Selector
// ===========================================================================

/**
 * 按标签+相邻值提取 — 找到包含标签文本的元素，提取相邻元素的值
 *
 * 示例（OpenAI 定价）：
 *   <div>Input</div><div class="text-2xl font-semibold">$5.00</div>
 *   → label="Input", valueSelector="div + div", transform="parsePrice"
 */
export interface HtmlLabelValueRule {
  type: "labelValue";
  /** 标签文本 */
  label: string;
  /** 值元素的选择器（相对于标签元素） */
  valueSelector: string;
  /** 值转换函数 */
  transform: Transform;
}

/**
 * 表格提取 — 找到表格，按列标题提取行数据
 *
 * 示例（Anthropic 定价）：
 *   <table> with columns "Model", "Base Input", "Output"
 *   → tableSelector="table", columns: { model: "Model", input: "Base Input", output: "Output" }
 */
export interface HtmlTableRule {
  type: "table";
  /** 表格的 CSS 选择器 */
  tableSelector: string;
  /** 列映射：字段名 → 列标题文本 */
  columns: Record<string, string>;
  /** 每列的转换函数 */
  transforms?: Record<string, Transform>;
  /** 行过滤：只提取匹配条件的行（如排除 "Deprecated" 行） */
  rowFilter?: string;
}

/**
 * 列表/集合提取 — 找到所有匹配元素，提取每个的值
 *
 * 示例（OpenAI 模型发现）：
 *   所有 <a href="/api/docs/models/xxx"> 链接
 *   → selector="a[href^='/api/docs/models/']", extract="href", pattern="/api/docs/models/(.+)"
 */
export interface HtmlListRule {
  type: "list";
  /** 匹配元素的 CSS 选择器 */
  selector: string;
  /** 从每个元素提取什么 */
  extract: "text" | "href" | "textContent" | "innerHTML";
  /** 从提取值中匹配子串的正则（如 /\/api\/docs\/models\/(.+)/） */
  pattern?: string;
  /** 值转换函数 */
  transform?: Transform;
}

/**
 * Section 提取 — 先限定搜索范围到某个 section，再在范围内提取
 *
 * 示例（OpenAI 快照提取）：
 *   先找到 "Snapshots" section，再在范围内提取快照 ID
 */
export interface HtmlSectionRule {
  type: "section";
  /** section 的起始标记 */
  sectionStart: string;
  /** section 的结束标记 */
  sectionEnd?: string;
  /** 在 section 内应用的子规则 */
  rules: HtmlExtractionRule[];
}

/** HTML 提取规则联合类型 */
export type HtmlExtractionRule =
  | HtmlLabelValueRule
  | HtmlTableRule
  | HtmlListRule
  | HtmlSectionRule;

// ===========================================================================
// Markdown 提取规则 — 只能定义 Regex
// ===========================================================================

/**
 * 按关键词+相邻值提取
 *
 * 示例（Google 上下文窗口）：
 *   **Input token limit** 1,048,576
 *   → pattern="\\*\\*Input token limit\\*\\*\\s*([\\d,]+)", group=1, transform="parseNumber"
 */
export interface MdLabelValueRule {
  type: "labelValue";
  /** 关键词文本 */
  label: string;
  /** 匹配关键词+值的正则表达式 */
  pattern: string;
  /** 正则中捕获组的索引（默认 1） */
  group?: number;
  /** 值转换函数 */
  transform: Transform;
}

/**
 * Markdown 表格提取 — 从 Markdown 表格中按列标题提取行数据
 *
 * 示例（Google 模型详情）：
 *   | Property | Description |
 *   | Model code | `gemini-2.5-flash` |
 *   → headerPattern="| Property |", columns: { id: "Model code" }
 */
export interface MdTableRule {
  type: "table";
  /** 表格起始行的匹配模式 */
  headerPattern: string;
  /** 列映射：字段名 → 列标题文本 */
  columns: Record<string, string>;
  /** 每列的转换函数 */
  transforms?: Record<string, Transform>;
  /** 行过滤：只提取匹配条件的行 */
  rowFilter?: string;
}

/**
 * Markdown 列表提取 — 从 Markdown 中提取所有匹配项
 *
 * 示例（Google 模型发现）：
 *   [Model Name](https://ai.google.dev/gemini-api/docs/models/<slug>)
 *   → pattern="\\[([^\\]]*)\\]\\(https://ai\\.google\\.dev/gemini-api/docs/models/([^)]+)\\)"
 *   → groups: { name: 1, slug: 2 }
 */
export interface MdListRule {
  type: "list";
  /** 匹配所有项的正则表达式（必须带 g 标志） */
  pattern: string;
  /** 每个匹配中捕获组的映射 */
  groups: Record<string, number>;
  /** 值转换函数 */
  transforms?: Record<string, Transform>;
}

/**
 * Markdown Section 提取 — 先限定到某个 section，再在范围内提取
 *
 * 示例（Google 定价）：
 *   先找到 ## Gemini 2.5 Flash section，再在范围内提取定价表格
 */
export interface MdSectionRule {
  type: "section";
  /** section 的标题匹配模式（如 "## Gemini 2.5 Flash"） */
  headingPattern: string;
  /** 在 section 内应用的子规则 */
  rules: MdExtractionRule[];
}

/** Markdown 提取规则联合类型 */
export type MdExtractionRule = MdLabelValueRule | MdTableRule | MdListRule | MdSectionRule;

// ===========================================================================
// API (JSON) 提取规则 — 只能定义 JSONPath
// ===========================================================================

/**
 * JSONPath 单字段提取
 *
 * 示例（定价提取）：
 *   { pricing: { input: 5, output: 15 } }
 *   → jsonpath="$.pricing.input"
 */
export interface ApiFieldRule {
  type: "field";
  /** JSONPath 表达式 */
  jsonpath: string;
  /** 值转换函数 */
  transform?: Transform;
}

/**
 * API 数组提取 — 从 JSON 数组中提取多个对象
 *
 * 示例（模型列表）：
 *   { data: [{ id: "gpt-4o", pricing: { input: 5 } }] }
 *   → arrayPath="$.data[*]", fields: { id: "$.id", input: "$.pricing.input" }
 */
export interface ApiArrayRule {
  type: "array";
  /** 数组的 JSONPath 表达式 */
  arrayPath: string;
  /** 每个元素中各字段的 JSONPath（相对于数组元素） */
  fields: Record<string, string>;
  /** 每个字段的转换函数 */
  transforms?: Record<string, Transform>;
  /** 元素过滤：只提取匹配条件的元素 */
  itemFilter?: string;
}

/** API 提取规则联合类型 */
export type ApiExtractionRule = ApiFieldRule | ApiArrayRule;

// ===========================================================================
// Pipeline 配置 — AI 只能修改这些数据结构
// ===========================================================================

/** 数据源配置 */
export interface SourceConfig {
  /** 数据源 URL（支持模板变量如 ${modelId}） */
  url: string;
  /** 数据源类型 */
  type: "html" | "markdown" | "api";
  /** 数据源描述 */
  description: string;
  /** 请求参数 */
  requestOptions?: {
    headers?: Record<string, string>;
    timeout?: number;
  };
}

/** 模型发现配置 */
export interface DiscoverConfig {
  source: SourceConfig;
  rules: HtmlExtractionRule[] | MdExtractionRule[] | ApiExtractionRule[];
  /** 弃用状态检测规则 */
  deprecatedDetection?: HtmlExtractionRule[] | MdExtractionRule[] | ApiExtractionRule[];
}

/** 定价提取配置 */
export interface ExtractPricingConfig {
  source: SourceConfig;
  rules: HtmlExtractionRule[] | MdExtractionRule[] | ApiExtractionRule[];
}

/** 上下文窗口提取配置 */
export interface ExtractLimitsConfig {
  source: SourceConfig;
  rules: HtmlExtractionRule[] | MdExtractionRule[] | ApiExtractionRule[];
}

/** 模态提取配置 */
export interface ExtractModalitiesConfig {
  source: SourceConfig;
  rules: HtmlExtractionRule[] | MdExtractionRule[] | ApiExtractionRule[];
  /** 模态名称映射（如 "Text" → "text", "Vision" → "image"） */
  modalityMap?: Record<string, ModelModality>;
}

/** 特性提取配置 */
export interface ExtractFeaturesConfig {
  source: SourceConfig;
  rules: HtmlExtractionRule[] | MdExtractionRule[] | ApiExtractionRule[];
  /** 特性名称映射（如 "Function calling" → "tool_call"） */
  featureMap?: Record<string, string>;
}

/** 日期提取配置 */
export interface ExtractDatesConfig {
  source: SourceConfig;
  rules: HtmlExtractionRule[] | MdExtractionRule[] | ApiExtractionRule[];
}

/** 快照提取配置 */
export interface ExtractSnapshotsConfig {
  source: SourceConfig;
  rules: HtmlExtractionRule[] | MdExtractionRule[] | ApiExtractionRule[];
}

/** 名称推导配置 — 纯函数，从模型 ID 推导显示名称 */
export interface DeriveNameConfig {
  /** 名称推导规则列表（按优先级排序，第一个匹配的生效） */
  rules: Array<{
    /** 匹配模型 ID 的正则 */
    pattern: string;
    /** 名称模板（$1, $2 等引用正则捕获组） */
    template: string;
  }>;
  /** 默认名称模板（当所有规则都不匹配时） */
  default: string;
}

/** 家族推导配置 — 纯函数，从模型 ID 推导模型家族 */
export interface DeriveFamilyConfig {
  /** 家族推导规则列表 */
  rules: Array<{
    /** 匹配模型 ID 的正则 */
    pattern: string;
    /** 家族名称模板 */
    template: string;
  }>;
  /** 默认家族模板 */
  default: string;
}

// ===========================================================================
// 完整 Pipeline 配置 — AI 只能修改这个数据结构
// ===========================================================================

/**
 * 声明式 Pipeline 配置
 *
 * AI 只能修改这个数据结构中的规则部分。
 * 运行时逻辑是固定的（在 runtime.ts 中实现）。
 *
 * ⚠️ 防幻觉原理：
 * - AI 只能定义 CSS Selector/Regex/JSONPath，不能写任意代码
 * - 运行时是固定的，传入 (原始数据 + 提取规则) → 结构化数据
 * - 如果提取失败，是规则不对，不是 AI 编造了数据
 * - AI 无法在规则中硬编码定价值、上下文窗口值等
 */
export interface DeclarativePipeline {
  /** 供应商定义 */
  provider: {
    id: string;
    name: string;
    url: string;
    api_docs?: string;
    apis: Record<string, string>;
  };

  /** 模型发现配置（必须） */
  discover: DiscoverConfig;

  /** 定价提取配置（必须） */
  extractPricing: ExtractPricingConfig;

  /** 日期提取配置（必须，因为 Model 的 release_date 和 last_updated 是必填字段） */
  extractDates: ExtractDatesConfig;

  /** 上下文窗口提取配置（可选） */
  extractLimits?: ExtractLimitsConfig;

  /** 模态提取配置（可选） */
  extractModalities?: ExtractModalitiesConfig;

  /** 特性提取配置（可选） */
  extractFeatures?: ExtractFeaturesConfig;

  /** 快照提取配置（可选） */
  extractSnapshots?: ExtractSnapshotsConfig;

  /** 名称推导配置（必须） */
  deriveName: DeriveNameConfig;

  /** 家族推导配置（必须） */
  deriveFamily: DeriveFamilyConfig;

  /** 模型过滤规则（可选） */
  filter?: {
    /** 排除模式列表（模型 ID 匹配这些正则的会被排除） */
    excludePatterns: string[];
  };
}
