[English](../api.md) | **中文**

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

## CDN 访问（无需安装）

编译后的 JSON 可通过 [jsDelivr CDN](https://www.jsdelivr.com/package/npm/ai-models) 访问 — 无需下载或安装。CDN 自动提供最新的 npm 发布版本：

```html
<!-- 在任何 HTML 页面中使用 -->
<script type="module">
  const catalog = await fetch("https://cdn.jsdelivr.net/npm/ai-models@latest/models.json").then(
    (r) => r.json(),
  );
  console.log(catalog.models.length); // 4,587
</script>
```

```bash
# 直接 curl（始终最新）
curl -s https://cdn.jsdelivr.net/npm/ai-models@latest/models.json | jq '.models | length'

# 锁定特定版本
curl -s https://cdn.jsdelivr.net/npm/ai-models@0.1.0/models.json | jq '.stats'
```

```python
# Python — 无需 pip install
import urllib.request, json
catalog = json.loads(urllib.request.urlopen("https://cdn.jsdelivr.net/npm/ai-models@latest/models.json").read())
print(len(catalog["models"]))  # 4587
```

```go
// Go — 无需依赖
resp, err := http.Get("https://cdn.jsdelivr.net/npm/ai-models@latest/models.json")
```

### CDN 与 GitHub Releases 对比

| 特性       | jsDelivr CDN                                | GitHub Releases                               |
| ---------- | ------------------------------------------- | --------------------------------------------- |
| URL 稳定性 | `cdn.jsdelivr.net/npm/ai-models@latest/...` | `github.com/.../releases/latest/download/...` |
| CORS       | ✅ 支持 — 可在浏览器中使用                  | ❌ 不支持 — 仅下载                            |
| 缓存       | 7 天（版本化），5 分钟（`@latest`）         | 无缓存                                        |
| 速度       | 全球 CDN，300+ 边缘节点                     | GitHub CDN                                    |
| 适用场景   | Web 应用、浏览器脚本、快速原型              | CLI 工具、CI/CD、批处理                       |

## 编译 JSON

所有模型数据可以从 [GitHub Releases](https://github.com/i-need-token/ai-models/releases/latest) 下载，提供两种格式：

| 文件          | 格式 | 大小    | 适用场景                       |
| ------------- | ---- | ------- | ------------------------------ |
| `models.json` | JSON | ~2.3 MB | 编程访问、Web 应用、TypeScript |
| `models.csv`  | CSV  | ~560 KB | Excel、Google Sheets、数据分析 |
| `stats.json`  | JSON | ~1 KB   | 目录统计摘要                   |

```bash
# 下载 JSON（完整元数据）
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.json

# 下载 CSV（适合电子表格）
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.csv

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
