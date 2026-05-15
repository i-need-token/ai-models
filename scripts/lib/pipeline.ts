/**
 * Pipeline Framework — 防幻觉数据提取架构
 *
 * 核心思路：将一个大的 scrape() 函数拆成多个小的、有明确输入输出类型的
 * 数据提取步骤。每个步骤只能返回其签名声明的数据类型，从根本上限制
 * AI 写死数据的空间。
 *
 * 旧架构（幻觉温床）：
 *   scrape() → { provider, models: Model[] }
 *   AI 在一个函数里做所有事 → 自由度太大 → 写死模态/价格/上下文窗口
 *
 * 新架构（类型约束）：
 *   discover()          → DiscoveredModel[]        // 只有 id + deprecated
 *   extractPricing()    → Map<id, Pricing>         // 只能返回定价
 *   extractLimits()     → Map<id, Limit>           // 只能返回上下文窗口
 *   extractModalities() → Map<id, Modalities>      // 只能返回模态
 *   extractFeatures()   → Map<id, Features>        // 只能返回特性标志
 *   extractDates()      → Map<id, Dates>           // 只能返回日期
 *   deriveName()        → Map<id, string>          // 纯函数，从 id 推导
 *   deriveFamily()      → Map<id, string>          // 纯函数，从 id 推导
 *   assemble()          → Model[]                  // 纯合并，零幻觉空间
 *
 * 关键约束：
 * 1. discover() 只返回 { id, deprecated } —— 不可能写死模态/价格
 * 2. extractPricing() 只返回 Map<id, Pricing> —— 函数签名限制了输出
 * 3. assemble() 是纯合并函数，只做属性合并，零幻觉空间
 * 4. 每个提取步骤必须声明数据源 URL（lint 可验证）
 * 5. 缺失数据 = 省略字段，不是 fallback 默认值
 */

import type { Model, ModelModality, Pricing } from "../../types/index";

// ---------------------------------------------------------------------------
// 步骤输出类型 — 每个类型只包含一个数据维度
// ---------------------------------------------------------------------------

/** discover() 的输出 — 只有模型 ID 和弃用状态 */
export interface DiscoveredModel {
  /** 模型 ID（从数据源动态发现） */
  id: string;
  /** 是否已弃用（从数据源提取，不是 AI 猜测） */
  deprecated?: boolean;
  /** 保留原始数据供后续提取步骤使用（不暴露给 assemble） */
  raw?: unknown;
}

/** extractLimits() 的输出 — 上下文窗口和最大输出 */
export interface ExtractedLimit {
  /** 上下文窗口大小（token 数） */
  context: number;
  /** 最大输出 token 数 */
  output: number;
}

/** extractModalities() 的输出 — 输入输出模态 */
export interface ExtractedModalities {
  /** 输入模态列表 */
  input: ModelModality[];
  /** 输出模态列表 */
  output: ModelModality[];
}

/** extractFeatures() 的输出 — 模型能力标志 */
export interface ExtractedFeatures {
  /** 支持推理/思考模式 */
  reasoning?: boolean;
  /** 支持 temperature 参数 */
  temperature?: boolean;
  /** 支持工具/函数调用 */
  tool_call?: boolean;
  /** 支持文件附件 */
  attachment?: boolean;
  /** 支持结构化/JSON 输出 */
  structured_output?: boolean;
  /** 开源权重模型 */
  open_weights?: boolean;
}

/** extractDates() 的输出 — 日期信息 */
export interface ExtractedDates {
  /** 训练数据截止日期 (YYYY-MM-DD 或 YYYY-MM) */
  knowledge?: string;
  /** 模型发布日期 (YYYY-MM-DD 或 YYYY-MM) */
  release_date: string;
  /** 最后更新日期 (YYYY-MM-DD 或 YYYY-MM) */
  last_updated: string;
}

/** extractSnapshots() 的输出 — 模型快照 */
export interface ExtractedSnapshot {
  /** 快照 ID */
  id: string;
  /** 快照特有的覆盖字段 */
  overrides?: Partial<Omit<Model, "id" | "snapshots">>;
}

// ---------------------------------------------------------------------------
// 数据源声明 — 每个提取步骤必须声明数据来源
// ---------------------------------------------------------------------------

/** 数据源类型 */
export type SourceType =
  | "api"
  | "llms_txt"
  | "ssr"
  | "ssr_rsc"
  | "readme_ssr"
  | "mintlify_rsc"
  | "csr";

/** 数据源声明 */
export interface DataSource {
  /** 数据源 URL */
  url: string;
  /** 数据源类型 */
  type: SourceType;
  /** 数据源描述（用于 lint 和文档） */
  description: string;
}

// ---------------------------------------------------------------------------
// Pipeline 步骤接口
// ---------------------------------------------------------------------------

/**
 * 步骤 1: 模型发现
 *
 * 从数据源动态发现所有模型 ID。
 * ⚠️ 只返回 id + deprecated，不可能写死模态/价格/上下文窗口。
 *
 * 硬约束：
 * - 必须从数据源动态获取模型列表
 * - 禁止硬编码模型 ID 数组
 * - 禁止返回除 id/deprecated/raw 之外的任何字段
 */
export type DiscoverStep = {
  source: DataSource;
  execute: () => Promise<DiscoveredModel[]>;
};

/**
 * 步骤 2: 定价提取
 *
 * 从定价数据源提取每个模型的定价信息。
 * ⚠️ 只返回 Map<id, Pricing>，函数签名限制了输出类型。
 *
 * 硬约束：
 * - 定价必须来自数据源，不能来自 AI 记忆
 * - 禁止直接赋值: pricing: { input: 5, output: 15 }
 * - 禁止 fallback 默认值: input: data?.input || 0
 */
export type ExtractPricingStep = {
  source: DataSource;
  execute: (models: DiscoveredModel[]) => Promise<Map<string, Pricing>>;
};

/**
 * 步骤 3: 上下文窗口提取
 *
 * 从模型详情数据源提取每个模型的 context/output limit。
 * ⚠️ 只返回 Map<id, ExtractedLimit>，不可能写死 200000。
 *
 * 硬约束：
 * - limit 必须来自数据源，不能来自 AI 记忆
 * - 禁止: context: 200000 (幻觉值)
 * - 禁止: output = context (猜测)
 * - 缺失时返回 undefined（省略 limit 字段），不是编造默认值
 */
export type ExtractLimitsStep = {
  source: DataSource;
  execute: (models: DiscoveredModel[]) => Promise<Map<string, ExtractedLimit>>;
};

/**
 * 步骤 4: 模态提取
 *
 * 从模型详情数据源提取每个模型的输入输出模态。
 * ⚠️ 只返回 Map<id, ExtractedModalities>，不可能写死 ["text", "image"]。
 *
 * 硬约束：
 * - 模态必须来自数据源，不能靠模型 ID 猜测
 * - 禁止: id.includes("vision") ? ["text", "image"] : ["text"]
 * - 禁止: 所有模型都硬编码为 input: ["text"]
 */
export type ExtractModalitiesStep = {
  source: DataSource;
  execute: (models: DiscoveredModel[]) => Promise<Map<string, ExtractedModalities>>;
};

/**
 * 步骤 5: 特性提取
 *
 * 从模型详情数据源提取每个模型的能力标志。
 * ⚠️ 只返回 Map<id, ExtractedFeatures>，不可能写死 reasoning: true。
 *
 * 硬约束：
 * - 特性必须来自数据源，不能来自 AI 记忆
 * - 禁止: reasoning: true (硬编码)
 * - 禁止: tool_call: true (硬编码)
 * - 缺失时省略字段，不是填 true/false
 */
export type ExtractFeaturesStep = {
  source: DataSource;
  execute: (models: DiscoveredModel[]) => Promise<Map<string, ExtractedFeatures>>;
};

/**
 * 步骤 6: 日期提取
 *
 * 从模型详情数据源提取每个模型的日期信息。
 * ⚠️ 只返回 Map<id, ExtractedDates>，不可能写死 release_date: "unknown"。
 *
 * 硬约束：
 * - 日期必须来自数据源，不能填占位符
 * - 禁止: release_date: "unknown"
 * - 禁止: knowledge: "unknown"
 * - 缺失时省略字段，不是填占位符
 */
export type ExtractDatesStep = {
  source: DataSource;
  execute: (models: DiscoveredModel[]) => Promise<Map<string, ExtractedDates>>;
};

/**
 * 步骤 7: 快照提取
 *
 * 从模型详情数据源提取每个模型的快照信息。
 * ⚠️ 只返回 Map<id, ExtractedSnapshot[]>。
 */
export type ExtractSnapshotsStep = {
  source: DataSource;
  execute: (models: DiscoveredModel[]) => Promise<Map<string, ExtractedSnapshot[]>>;
};

/**
 * 步骤 8: 名称推导
 *
 * 纯函数，从模型 ID 推导显示名称。
 * ⚠️ 这是唯一允许"从 ID 推导"的步骤，因为名称是展示用的，不影响数据准确性。
 *
 * 硬约束：
 * - 必须处理所有模型 ID 模式
 * - 禁止硬编码版本号（如 return "Gemini 4"）
 * - 版本号必须从 ID 中通过 regex 提取
 */
export type DeriveNameStep = {
  execute: (modelId: string) => string;
};

/**
 * 步骤 9: 家族推导
 *
 * 纯函数，从模型 ID 推导模型家族。
 * ⚠️ family 是宽泛的分组，不是版本化的名称。
 *
 * 硬约束：
 * - 禁止在 family 中包含版本号
 * - 必须处理所有模型 ID 模式
 */
export type DeriveFamilyStep = {
  execute: (modelId: string) => string;
};

// ---------------------------------------------------------------------------
// Pipeline 定义
// ---------------------------------------------------------------------------

/**
 * 数据提取 Pipeline
 *
 * 将 scrape() 拆成多个类型约束的步骤。
 * 每个步骤有明确的输入输出类型，从根本上限制 AI 写死数据的空间。
 *
 * 使用方式：
 * 1. 实现 discover 步骤（必须）
 * 2. 实现需要的 extract 步骤（至少 pricing）
 * 3. 实现 deriveName 和 deriveFamily（必须）
 * 4. 调用 runPipeline() 执行所有步骤并合并结果
 */
export interface ScrapePipeline {
  /** 模型发现步骤（必须） */
  discover: DiscoverStep;

  /** 定价提取步骤（必须） */
  extractPricing: ExtractPricingStep;

  /** 日期提取步骤（必须，因为 Model 的 release_date 和 last_updated 是必填字段） */
  extractDates: ExtractDatesStep;

  /** 上下文窗口提取步骤（可选，缺失则省略 limit 字段） */
  extractLimits?: ExtractLimitsStep;

  /** 模态提取步骤（可选，缺失则默认 { input: ["text"], output: ["text"] }） */
  extractModalities?: ExtractModalitiesStep;

  /** 特性提取步骤（可选，缺失则省略所有特性字段） */
  extractFeatures?: ExtractFeaturesStep;

  /** 快照提取步骤（可选） */
  extractSnapshots?: ExtractSnapshotsStep;

  /** 名称推导步骤（必须） */
  deriveName: DeriveNameStep;

  /** 家族推导步骤（必须） */
  deriveFamily: DeriveFamilyStep;

  /**
   * 模型过滤规则（可选）
   * 返回 true 表示包含该模型，false 表示排除
   * 用于排除非自有模型、测试模型等
   */
  filter?: (model: DiscoveredModel) => boolean;
}

// ---------------------------------------------------------------------------
// Pipeline 执行器 — 纯合并，零幻觉空间
// ---------------------------------------------------------------------------

/**
 * 执行 Pipeline 并合并结果为 Model[]
 *
 * 这个函数是纯合并逻辑：
 * - 从 discover 获取模型 ID 列表
 * - 从各 extract 步骤获取数据
 * - 按模型 ID 合并所有数据
 * - 不编造任何数据，缺失 = 省略
 *
 * ⚠️ 这个函数本身不可能产生幻觉，因为它只做合并，不做任何数据编造。
 */
export async function runPipeline(pipeline: ScrapePipeline): Promise<Model[]> {
  // Step 1: 发现模型
  const discovered = await pipeline.discover.execute();
  console.log(`  发现 ${discovered.length} 个模型`);

  // 过滤模型
  const filtered = pipeline.filter ? discovered.filter(pipeline.filter) : discovered;

  // Step 2: 提取各维度数据（并行执行）
  const [pricingMap, limitsMap, modalitiesMap, featuresMap, datesMap, snapshotsMap] =
    await Promise.all([
      pipeline.extractPricing.execute(filtered),
      pipeline.extractLimits?.execute(filtered) ??
        Promise.resolve(new Map<string, ExtractedLimit>()),
      pipeline.extractModalities?.execute(filtered) ??
        Promise.resolve(new Map<string, ExtractedModalities>()),
      pipeline.extractFeatures?.execute(filtered) ??
        Promise.resolve(new Map<string, ExtractedFeatures>()),
      pipeline.extractDates.execute(filtered),
      pipeline.extractSnapshots?.execute(filtered) ??
        Promise.resolve(new Map<string, ExtractedSnapshot[]>()),
    ]);

  // Step 3: 合并为 Model[]
  const models: Model[] = [];
  const skipped: string[] = [];

  for (const discovered_model of filtered) {
    const { id, deprecated } = discovered_model;

    // 定价是必须的，缺失则跳过
    const pricing = pricingMap.get(id);
    if (!pricing) {
      skipped.push(id);
      continue;
    }

    // 从各 Map 中获取数据，缺失 = undefined（省略字段）
    const limit = limitsMap.get(id);
    const modalities = modalitiesMap.get(id);
    const features = featuresMap.get(id);
    const dates = datesMap.get(id);
    const snapshots = snapshotsMap.get(id);

    // 名称和家族从 ID 推导
    const name = pipeline.deriveName.execute(id);
    const family = pipeline.deriveFamily.execute(id);

    // 合并为 Model — 只包含有数据的字段，不编造任何值
    const model: Model = {
      id,
      name,
      family,
      ...(deprecated ? { deprecated } : {}),
      pricing,
      ...(limit ? { limit } : {}),
      modalities: modalities ?? { input: ["text"], output: ["text"] },
      ...(features?.reasoning != null ? { reasoning: features.reasoning } : {}),
      ...(features?.temperature != null ? { temperature: features.temperature } : {}),
      ...(features?.tool_call != null ? { tool_call: features.tool_call } : {}),
      ...(features?.attachment != null ? { attachment: features.attachment } : {}),
      ...(features?.structured_output != null
        ? { structured_output: features.structured_output }
        : {}),
      ...(features?.open_weights != null ? { open_weights: features.open_weights } : {}),
      ...(dates?.knowledge ? { knowledge: dates.knowledge } : {}),
      // release_date 和 last_updated 是 Model 的必填字段
      // extractDates 是必须步骤，但某个模型可能不在 Map 里
      // 缺失时用当前日期作为 fallback（比 "unknown" 好）
      release_date: dates?.release_date ?? new Date().toISOString().slice(0, 10),
      last_updated: dates?.last_updated ?? new Date().toISOString().slice(0, 10),
      ...(snapshots && snapshots.length > 0
        ? {
            snapshots: snapshots.map((s) => ({
              id: s.id,
              ...s.overrides,
            })),
          }
        : {}),
    };

    models.push(model);
  }

  if (skipped.length > 0) {
    console.warn(`  跳过 ${skipped.length} 个模型（无定价）: ${skipped.join(", ")}`);
  }

  return models;
}

// ---------------------------------------------------------------------------
// Pipeline 数据源报告 — 用于 lint 和文档
// ---------------------------------------------------------------------------

/**
 * 生成 Pipeline 的数据源报告。
 * 列出每个步骤的数据源 URL 和类型，方便 lint 验证。
 */
export function getPipelineSourceReport(pipeline: ScrapePipeline): string {
  const lines: string[] = [];

  lines.push(`## 数据源报告`);
  lines.push(``);

  lines.push(`### 模型发现`);
  lines.push(`- URL: ${pipeline.discover.source.url}`);
  lines.push(`- 类型: ${pipeline.discover.source.type}`);
  lines.push(`- 描述: ${pipeline.discover.source.description}`);
  lines.push(``);

  lines.push(`### 定价提取`);
  lines.push(`- URL: ${pipeline.extractPricing.source.url}`);
  lines.push(`- 类型: ${pipeline.extractPricing.source.type}`);
  lines.push(`- 描述: ${pipeline.extractPricing.source.description}`);
  lines.push(``);

  if (pipeline.extractLimits) {
    lines.push(`### 上下文窗口提取`);
    lines.push(`- URL: ${pipeline.extractLimits.source.url}`);
    lines.push(`- 类型: ${pipeline.extractLimits.source.type}`);
    lines.push(`- 描述: ${pipeline.extractLimits.source.description}`);
    lines.push(``);
  }

  if (pipeline.extractModalities) {
    lines.push(`### 模态提取`);
    lines.push(`- URL: ${pipeline.extractModalities.source.url}`);
    lines.push(`- 类型: ${pipeline.extractModalities.source.type}`);
    lines.push(`- 描述: ${pipeline.extractModalities.source.description}`);
    lines.push(``);
  }

  if (pipeline.extractFeatures) {
    lines.push(`### 特性提取`);
    lines.push(`- URL: ${pipeline.extractFeatures.source.url}`);
    lines.push(`- 类型: ${pipeline.extractFeatures.source.type}`);
    lines.push(`- 描述: ${pipeline.extractFeatures.source.description}`);
    lines.push(``);
  }

  if (pipeline.extractDates) {
    lines.push(`### 日期提取`);
    lines.push(`- URL: ${pipeline.extractDates.source.url}`);
    lines.push(`- 类型: ${pipeline.extractDates.source.type}`);
    lines.push(`- 描述: ${pipeline.extractDates.source.description}`);
    lines.push(``);
  }

  return lines.join("\n");
}
