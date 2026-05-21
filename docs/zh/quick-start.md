[English](../quick-start.md) | **中文**

# 快速入门指南

30 秒内找到适合你需求的 AI 模型。

## 我想找最便宜的模型

→ 查看[定价对比](pricing-comparison.md)，了解各提供商最便宜的模型和跨平台价格对比。

**支持工具调用的最便宜模型：**

| 模型             | 提供商      | 输入（每百万 token） | 输出（每百万 token） |
| ---------------- | ----------- | -------------------: | -------------------: |
| DeepSeek-V3      | DeepSeek    |                $0.27 |                $1.10 |
| Qwen3-235B-A22B  | 阿里云      |                $0.14 |                $0.42 |
| Llama 4 Maverick | Together AI |                $0.20 |                $0.80 |

## 我想找最强大的模型

→ 查看[模型对比](model-comparison.md)，了解旗舰模型对比。

**顶级旗舰模型：**

| 模型           | 上下文 | 工具调用 | 视觉 | 输入 $/1M | 输出 $/1M |
| -------------- | ------ | -------- | ---- | --------: | --------: |
| GPT-4.1        | 1M     | ✅       | ✅   |     $2.00 |     $8.00 |
| Claude Opus 4  | 200K   | ✅       | ✅   |    $15.00 |    $75.00 |
| Gemini 2.5 Pro | 1M     | ✅       | ✅   |     $1.25 |    $10.00 |
| DeepSeek-R1    | 128K   | ✅       | ❌   |     $0.55 |     $2.19 |

## 我想找免费模型

→ 查看[模型对比](model-comparison.md#免费模型)获取完整列表。

**支持工具调用的免费模型：**

- Google Gemini 2.0 Flash（通过 Google AI Studio）
- Cloudflare Workers AI 模型（边缘推理）
- Chutes、Cerebras、Groq 免费层上的各种模型

## 我想找最大上下文窗口

→ 查看[模型对比](model-comparison.md#最大上下文窗口)获取完整列表。

| 模型            |  上下文窗口 |
| --------------- | ----------: |
| Llama 4 Scout   |  10M tokens |
| Gemini 2.5 Pro  |   1M tokens |
| GPT-4.1         |  ~1M tokens |
| Claude Sonnet 4 | 200K tokens |

## 我想浏览所有提供商

→ 查看[提供商概览](providers.md)，95 个提供商按类型分类。

## 我想编程使用数据

### npm 包

```bash
npm install ai-models
```

```typescript
import catalog from "ai-models"; // 4,587 个模型 JSON
import type { Model } from "ai-models"; // TypeScript 类型
```

### 下载数据文件

```bash
# JSON — 完整元数据（2.3 MB）
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.json

# CSV — 适合 Excel/Google Sheets 的表格（560 KB）
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.csv
```

### CDN 访问（无需安装）

编译后的 JSON 可通过 [jsDelivr CDN](https://www.jsdelivr.com/package/npm/ai-models) 访问 — 无需下载或安装：

```bash
# 始终最新，支持 CORS，可在浏览器中使用
curl -s https://github.com/i-need-token/ai-models/releases/latest/download/models.json | jq '.models | length'
```

```html
<script type="module">
  const catalog = await fetch(
    "https://github.com/i-need-token/ai-models/releases/latest/download/models.json",
  ).then((r) => r.json());
  console.log(catalog.models.length);
</script>
```

### 从源码

```bash
# 安装依赖
npm install

# 计算目录统计
npx tsx scripts/stats.ts

# 验证所有模型数据
npx tsx scripts/validate.ts
```

```typescript
import { ModelSchema } from "./types/schemas";
import { parse } from "yaml";
import { readFileSync } from "fs";

// 加载并验证模型
const raw = readFileSync("providers/openai/models/gpt-4.1.yaml", "utf-8");
const model = ModelSchema.parse(parse(raw));

console.log(model.pricing); // { input: 2, output: 8, cache_read: 0.5 }
console.log(model.limit); // { context: 1047576, output: 32768 }
```

## 我想添加新的提供商

→ 查看[贡献指南](../../CONTRIBUTING.md)和[数据采集指南](data-acquisition.md)。

## 我想了解数据格式

→ 查看[数据 Schema 参考](data-schema.md)，了解完整的 YAML Schema。

## 相关文档

- [模型选择指南](model-selection.md) — 选择模型的决策框架
- [常见问题](faq.md) — 关于目录的常见问题
- [API 与编程访问](api.md) — 下载和使用数据
- [代码示例](code-examples.md) — TypeScript、Python、Go、Rust 实用示例
- [术语表](glossary.md) — 关键术语和定义
