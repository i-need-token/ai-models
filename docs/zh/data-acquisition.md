[English](../data-acquisition.md) | **中文**

# 数据采集

如何获取和更新各供应商的模型数据。

## 核心原则

1. **数据必须来自第一方来源** — 供应商自身的 API、网站或文档。不从第三方聚合器复制数据。
2. **抓取函数返回数据，不写文件** — 关注点分离：抓取函数生成结构化数据对象；全局编排脚本处理文件 I/O。

## 数据源层级

| 优先级 | 来源                  | 说明                                                                     | 自动化 |
| :----: | --------------------- | ------------------------------------------------------------------------ | ------ |
|   1    | 供应商 API            | 供应商暴露公开或需认证的 API，返回模型列表和/或定价                      | 全自动 |
|   2    | 供应商网站 (llms.txt) | 供应商网站支持 `llms.txt` 协议 — 在 URL 后追加 `.md` 获取干净的 Markdown | 半自动 |
|   3    | 供应商网站 (SSR)      | 服务端渲染页面 — 所有数据在 HTML 中，用 DOM 提取工具解析                 | 半自动 |
|   4    | 供应商网站 (CSR)      | 客户端渲染页面 — 数据来自内部 API 调用；拦截 API 请求                    | 半自动 |
|   5    | 手动                  | 无结构化数据源；人工维护数据                                             | 手动   |

### llms.txt 协议

许多现代网站支持 `llms.txt` 协议。可用时，这是从网站提取结构化数据最简单的方式：

```
https://example.com/pricing       → 网站
https://example.com/pricing.md    → 干净的 Markdown (llms.txt)
```

### 网站解析策略

当 `llms.txt` 不可用时，判断渲染类型并使用相应策略：

| 渲染方式     | 如何检测                   | 提取方法                               |
| ------------ | -------------------------- | -------------------------------------- |
| SSR (服务端) | 初始 HTML 响应包含完整内容 | 解析 HTML → DOM → 提取结构化数据       |
| CSR (客户端) | HTML 是空壳 + JS 包        | 拦截网络请求找到数据 API，然后直接调用 |

## 抓取函数设计

### 关注点分离

```
抓取函数 (每个供应商)     →  返回结构化数据
全局编排脚本              →  写入 YAML 文件
```

抓取函数是**纯数据函数** — 从数据源获取数据，转换为我们定义的 schema，返回对象。绝不触碰文件系统。

### 函数签名

```typescript
import type { Model, Provider } from "../../types";

interface ScrapeResult {
  provider: Provider;
  models: Model[];
}

/**
 * 从供应商的第一方数据源获取模型数据。
 * 返回结构化数据 — 不写入任何文件。
 */
export function scrape(): Promise<ScrapeResult>;
```

### 抓取函数中允许和禁止的内容

| 允许 (转换逻辑)           | 禁止 (硬编码数据)       |
| ------------------------- | ----------------------- |
| API 基础 URL              | 硬编码模型 ID 数组      |
| 字段映射规则              | 硬编码定价值            |
| 聚合器的分组逻辑          | 硬编码能力标志          |
| 缺失字段的默认值          | 硬编码模型名称/系列映射 |
| 过滤规则 (前缀、排除模式) |                         |

**关键**："禁止"列不可协商。如果抓取函数包含硬编码的模型 ID 列表，就违反了第一方数据原则 — 目录无法随供应商增删模型而保持最新。每个抓取函数必须包含从供应商数据源获取模型列表的**发现步骤**。

### 示例：有公开 API 的供应商

```typescript
import type { Model, Provider } from "../../types";

const provider: Provider = {
  id: "deepinfra",
  name: "DeepInfra",
  url: "https://deepinfra.com",
  api_docs: "https://deepinfra.com/docs",
  apis: { openai: "https://api.deepinfra.com/v1/openai" },
};

export async function scrape(): Promise<ScrapeResult> {
  const resp = await fetch("https://api.deepinfra.com/v1/openai/models");
  const data = await resp.json();

  const models: Model[] = data.data
    .filter((m: any) => shouldInclude(m))
    .map((m: any) => transformApiModel(m));

  return { provider, models };
}
```

### 示例：有网站数据源的供应商

```typescript
export async function scrape(): Promise<ScrapeResult> {
  // 优先尝试 llms.txt
  const md = await fetch("https://provider.com/pricing.md");
  if (md.ok) {
    return parseFromMarkdown(await md.text());
  }

  // 回退到 HTML 解析
  const html = await fetch("https://provider.com/pricing");
  return parseFromHtml(await html.text());
}
```

## Pipeline 架构

### 为什么需要 Pipeline？

单一的 `scrape()` 函数给 AI 代理太多自由度 — 它们可以硬编码模型 ID、编造定价或幻觉出能力标志。Pipeline 架构通过类型约束从根本上防止这些问题。

### 两种 Pipeline 风格

| 风格              | AI 定义的内容                                          | 运行时                                      | 防幻觉级别                                |
| ----------------- | ------------------------------------------------------ | ------------------------------------------- | ----------------------------------------- |
| 执行函数 Pipeline | 有类型的步骤函数 (`discover()`, `extractPricing()`, …) | `runPipeline()`                             | 每步骤的类型约束                          |
| 声明式 Pipeline   | 仅 CSS Selector / Regex / JSONPath 规则                | `runDeclarativePipeline()` (固定、不可修改) | AI 只能定义"提取什么"，不能定义"怎么提取" |

### 执行函数 Pipeline

原始 Pipeline 将一个大函数拆成有类型的步骤。每个步骤的输出类型受约束 — `discover()` 只能返回 ID，`extractPricing()` 只能返回定价，等等。`assemble()` 步骤是纯合并，零编造空间。

```
discover()          → DiscoveredModel[]        // 只有 id + deprecated
extractPricing()    → Map<id, Pricing>         // 只有定价
extractLimits()     → Map<id, Limit>           // 只有上下文窗口
extractModalities() → Map<id, Modalities>      // 只有模态
extractFeatures()   → Map<id, Features>        // 只有能力标志
extractDates()      → Map<id, Dates>           // 只有日期 (必填)
deriveName()        → Map<id, string>          // 纯函数，从 id 推导
deriveFamily()      → Map<id, string>          // 纯函数，从 id 推导
assemble()          → Model[]                  // 纯合并，零编造空间
```

关键约束：

1. `discover()` 只返回 `{ id, deprecated }` — 不可能硬编码模态/定价
2. `extractPricing()` 只返回 `Map<id, Pricing>` — 函数签名限制了输出
3. `assemble()` 是纯合并函数 — 没有编造空间
4. 每个提取步骤必须声明数据源 URL (lint 可验证)
5. 缺失数据 = 省略字段，不是 fallback 默认值

### 声明式 Pipeline

声明式 Pipeline 更进一步：AI 只能定义**提取什么**（规则），不能定义**怎么提取**（任意代码）。运行时是固定的、不可修改的。

三种数据源，三种规则语言：

| 数据源     | 规则语言     | 示例                                               |
| ---------- | ------------ | -------------------------------------------------- |
| HTML       | CSS Selector | `label: "Input", valueSelector: "div + div"`       |
| Markdown   | Regex        | `pattern: /\*\*Input token limit\*\*\s*([\d,]+)/i` |
| API (JSON) | JSONPath     | `jsonpath: "$.pricing.input"`                      |

五种提取模式：

| 模式             | 用途                 | 示例                               |
| ---------------- | -------------------- | ---------------------------------- |
| `labelValue`     | 找到标签，提取相邻值 | "Input token limit" → 1,048,576    |
| `table`          | 提取结构化表格数据   | 有 model/input/output 列的定价表   |
| `list`           | 提取所有匹配元素     | 从 `<a>` 链接提取模型 ID 列表      |
| `section`        | 提取某个区域的内容   | 特定的 `<section>` 或 `## Heading` |
| `field` (仅 API) | 提取单个 JSON 字段   | `$.pricing.input`                  |
| `array` (仅 API) | 提取并映射 JSON 数组 | `$.data[*]` 加字段映射             |

值转换函数是固定集合 — AI 只能选择使用哪个，不能定义新的：

```
parseFloat | parseInt | parseNumber | parsePrice | parseDate |
parseModality | toLowerCase | toUpperCase | trim | removeCommas | identity
```

### 何时使用哪种风格

- **声明式 Pipeline**：适用于数据源结构规律、可预测的新供应商（大多数基于 API 的供应商、简单的 HTML 表格）。
- **执行函数 Pipeline**：提取逻辑过于复杂、声明式规则无法处理时使用（如 Cohere 的 `<ModelShowcase>` JSX 组件需要正则解析，超出当前规则类型的能力）。
- **直接 `scrape()` 函数**：向后兼容，大多数现有供应商使用。

## 供应商类型

### 模型生产商

开发和生产自有 AI 模型的供应商。它们是模型数据的**主要来源** — 其 API 和文档是权威数据源。

示例：OpenAI、Anthropic、Google、Meta、DeepSeek、Alibaba、Mistral 等。

### 推理平台

托管和提供其他供应商模型的平台。在所有模型生产商完成后才添加。推理平台必须满足严格标准：

**必要条件：**

- 按 token 定价（非按秒、按信用点、按 DBU 或其他单位）
- 定价仅支持 USD、CNY 或 EUR
- 第一方数据源（平台自身的 API、网站或嵌入的 JS 包）

**已接受的路由器/聚合器平台：** 部分路由器/聚合器平台（如 OpenRouter、nano-gpt）被接受，因为它们拥有可从第一方来源（公开 API 或 JS 包）访问的按 token 定价数据。它们被视为推理平台，因为它们为数百个模型提供按 token USD 定价。

**关于数据可访问性的说明：** 对于定价数据可以从嵌入网站的第一方 JavaScript 包中提取的平台，"公开可访问 API" 的要求可以放宽。这适用于 CSR 渲染的定价页面，其中定价数据嵌入在公开可访问的 JS 块中（例如 nano-gpt 的定价 JS 包）。

**被拒绝的类别：**

| 类别           | 示例                                                                    | 原因                      |
| -------------- | ----------------------------------------------------------------------- | ------------------------- |
| 需认证的 API   | Hyperbolic、Nebius、Replicate                                           | 无法无凭证抓取            |
| 非 token 定价  | Replicate (按秒)、Databricks (DBU)、Snowflake (信用点)、Venice (信用点) | 定价模型不兼容            |
| GPU 云         | SubModel、GMI Cloud、Akash、io.net                                      | 租用 GPU，非按 token 推理 |
| 仅 CSR、无 API | 大多数中国平台                                                          | 无法程序化提取数据        |
| 企业/研究      | Abacus AI、Liquid AI、Inflection AI                                     | 无公开定价/API            |
| 模型中心       | ModelScope、HuggingFace                                                 | 重复生产商的数据          |
| 编程工具       | Umans.ai、Morph                                                         | 不是推理平台              |

## 更新工作流

### 自动更新 (基于 API 的供应商)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ scrape()     │ ──→ │ git diff     │ ──→ │ 变更报告      │
│ 返回数据     │     │ 检测差异     │     │ + 自动提交    │
└──────────────┘     └──────────────┘     └──────────────┘
```

1. 全局脚本调用每个供应商的 `scrape()` 函数
2. 脚本写入 YAML 文件 (每个供应商全量覆盖)
3. `git diff` 显示变更内容
4. 用描述性消息提交变更

### 变更类型

| 变更       | 自动合并 |    人工审核     |
| ---------- | :------: | :-------------: |
| 新增模型   |    ✅    |                 |
| 定价变更   |    ✅    |  ⚠️ 标记需验证  |
| 字段值变更 |    ✅    |  ⚠️ 标记需验证  |
| 模型删除   |          | ✅ 绝不自动删除 |

### 手动更新 (网站/手动供应商)

1. 人工访问供应商网站
2. 直接更新 YAML 文件
3. 将 `last_updated` 设为当前日期
4. 用 `npm run validate` 验证
