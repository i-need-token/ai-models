# API 与编程访问

在你的应用中使用目录数据。

## npm 包

将目录作为 npm 依赖安装：

```bash
npm install ai-models
```

```typescript
import catalog from "ai-models"; // 4,587 个模型 JSON
import type { Model } from "ai-models"; // TypeScript 类型

// 查找支持工具调用且输入价格低于 $1/1M 的模型
const affordable = catalog.models.filter((m) => m.tool_call && m.pricing.input < 1);
```

包内容包括：

- `dist/models.json` — 完整目录 JSON
- `dist/index.d.ts` — TypeScript 类型定义
- `types/` — 源类型定义（Model、Snapshot、Provider、Pricing）

## 编译 JSON

访问所有模型数据最简单的方式是通过编译后的 `models.json` 文件。

### 从 GitHub Releases 下载

```bash
# 最新版本
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.json

# 特定版本
curl -LO https://github.com/i-need-token/ai-models/releases/download/v0.1.0/models.json
```

### 本地编译

```bash
npm install
npx tsx scripts/compile.ts
# 输出：dist/models.json (2.3 MB)
```

### JSON 结构

```json
{
  "generated_at": "2026-05-21T02:13:04.076Z",
  "stats": {
    "providers": 95,
    "models": 4587,
    "unique_model_ids": 2712,
    "families": 441
  },
  "providers": {
    "openai": { "name": "OpenAI", "model_count": 28 },
    "anthropic": { "name": "Anthropic", "model_count": 11 }
  },
  "models": [
    {
      "id": "gpt-4.1",
      "name": "GPT-4.1",
      "family": "gpt-4.1",
      "provider": "openai",
      "tool_call": true,
      "structured_output": true,
      "pricing": { "currency": "USD", "input": 2, "output": 8, "cache_read": 0.5 },
      "limit": { "context": 1047576, "output": 32768 },
      "modalities": { "input": ["text", "image"], "output": ["text"] }
    }
  ]
}
```

### 使用示例

**JavaScript/TypeScript：**

```javascript
const catalog = require("./models.json");

// 查找所有支持工具调用且输入价格低于 $1/1M token 的模型
const cheap = catalog.models.filter(
  (m) => m.tool_call && m.pricing?.input < 1 && m.pricing?.currency === "USD",
);

// 查找每个提供商最便宜的模型
const byProvider = {};
for (const m of catalog.models) {
  if (!m.pricing?.input) continue;
  if (!byProvider[m.provider] || m.pricing.input < byProvider[m.provider].pricing.input) {
    byProvider[m.provider] = m;
  }
}

// 获取所有视觉模型
const vision = catalog.models.filter((m) => m.modalities?.input?.includes("image"));
```

**Python：**

```python
import json

with open("models.json") as f:
    catalog = json.load(f)

# 查找所有推理模型
reasoning = [m for m in catalog["models"] if m.get("reasoning")]

# 查找上下文窗口最大的模型
by_context = sorted(
    catalog["models"],
    key=lambda m: (m.get("limit", {}) or {}).get("context", 0),
    reverse=True,
)[:10]
```

## 单个 YAML 文件

对于单个模型的类型安全访问，直接使用 YAML 文件配合 Zod 校验：

```typescript
import { ModelSchema } from "./types/schemas";
import { parse } from "yaml";
import { readFileSync } from "fs";

const raw = readFileSync("providers/openai/models/gpt-4.1.yaml", "utf-8");
const model = ModelSchema.parse(parse(raw)); // 运行时校验

console.log(model.pricing); // { input: 2, output: 8, cache_read: 0.5 }
```

## CLI 工具

```bash
# 验证所有 YAML 数据
npx tsx scripts/validate.ts

# 计算目录统计
npx tsx scripts/stats.ts          # 表格格式
npx tsx scripts/stats.ts json     # JSON 格式

# 编译为 models.json
npx tsx scripts/compile.ts

# 从提供商同步数据
npx tsx scripts/sync.ts openai    # 单个提供商
npx tsx scripts/sync.ts           # 所有提供商
```
