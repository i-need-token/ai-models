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

