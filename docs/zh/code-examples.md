# 代码示例

[English](../code-examples.md) | **中文**

多种语言使用 AI Models Catalog 数据的实用代码示例。

## 下载数据

```bash
# JSON — 完整元数据 (2.3 MB)
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.json

# CSV — 适用于 Excel/Google Sheets 的平面表格 (560 KB)
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.csv
```

或使用 [jsDelivr CDN](https://www.jsdelivr.com/package/npm/ai-models)（无需下载，支持 CORS）：

```bash
# 始终最新，可在浏览器中使用
curl -s https://github.com/i-need-token/ai-models/releases/latest/download/models.json | jq '.models | length'
```

## TypeScript / JavaScript

### 安装 npm 包

```bash
npm install ai-models
```

### 基本用法

```typescript
import catalog from "ai-models";
import type { Model } from "ai-models";

// 模型总数
console.log(`Total models: ${catalog.models.length}`);

// 按提供商查找模型
const openaiModels = catalog.models.filter((m) => m.provider === "openai");
console.log(`OpenAI models: ${openaiModels.length}`);
```

### 查找最便宜的工具调用模型

```typescript
import catalog from "ai-models";

const affordable = catalog.models
  .filter((m) => m.tool_call && m.pricing?.input && m.pricing.input < 1)
  .sort((a, b) => a.pricing.input - b.pricing.input)
  .slice(0, 10);

for (const m of affordable) {
  console.log(`${m.name}: $${m.pricing.input}/1M input, $${m.pricing.output}/1M output`);
}
```

### 查找最大上下文窗口的模型

```typescript
import catalog from "ai-models";

const largest = catalog.models
  .filter((m) => m.limit?.context)
  .sort((a, b) => b.limit.context - a.limit.context)
  .slice(0, 10);

for (const m of largest) {
  console.log(`${m.name}: ${(m.limit.context / 1_000_000).toFixed(1)}M context`);
}
```

### 查找支持视觉的免费模型

```typescript
import catalog from "ai-models";

const freeVision = catalog.models.filter(
  (m) => m.pricing?.unit === "free" && m.modalities?.input?.includes("image"),
);

console.log(`Free vision models: ${freeVision.length}`);
for (const m of freeVision) {
  console.log(`- ${m.name} (${m.provider})`);
}
```

## Python

### 使用 JSON 数据

```python
import json
import urllib.request

# 下载最新数据
url = "https://github.com/i-need-token/ai-models/releases/latest/download/models.json"
urllib.request.urlretrieve(url, "models.json")

with open("models.json") as f:
    catalog = json.load(f)

print(f"Total models: {len(catalog['models'])}")
```

### 查找输出价格低于 $5/1M 的推理模型

```python
reasoning_cheap = [
    m for m in catalog["models"]
    if m.get("reasoning")
    and m.get("pricing", {}).get("output")
    and m["pricing"]["output"] < 5
]

for m in sorted(reasoning_cheap, key=lambda x: x["pricing"]["output"]):
    print(f"{m['name']}: ${m['pricing']['output']}/1M output")
```

### 使用 pandas 处理 CSV

```python
import pandas as pd

df = pd.read_csv("https://github.com/i-need-token/ai-models/releases/latest/download/models.csv")

# 筛选和排序
tool_calling = df[df["tool_call"] == True].sort_values("pricing_input")
print(tool_calling[["name", "provider", "pricing_input", "pricing_output"]].head(10))
```

### 查找支持工具调用的开源模型

```python
open_tool = [
    m for m in catalog["models"]
    if m.get("open_weights") and m.get("tool_call")
]

print(f"Open-weight models with tool calling: {len(open_tool)}")
for m in open_tool[:10]:
    print(f"  - {m['name']} ({m['provider']})")
```

## Go

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type Catalog struct {
    Models []Model `json:"models"`
}

type Model struct {
    ID       string  `json:"id"`
    Name     string  `json:"name"`
    Provider string  `json:"provider"`
    ToolCall bool    `json:"tool_call"`
    Pricing  Pricing `json:"pricing"`
}

type Pricing struct {
    Input  float64 `json:"input"`
    Output float64 `json:"output"`
}

func main() {
    resp, err := http.Get("https://github.com/i-need-token/ai-models/releases/latest/download/models.json")
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    var catalog Catalog
    json.NewDecoder(resp.Body).Decode(&catalog)

    fmt.Printf("Total models: %d\n", len(catalog.Models))

    // 查找输入价格低于 $1/1M 的工具调用模型
    for _, m := range catalog.Models {
        if m.ToolCall && m.Pricing.Input > 0 && m.Pricing.Input < 1 {
            fmt.Printf("%s: $%.2f/1M input\n", m.Name, m.Pricing.Input)
        }
    }
}
```

## Rust

```rust
use serde::Deserialize;

#[derive(Deserialize)]
struct Catalog {
    models: Vec<Model>,
}

#[derive(Deserialize)]
struct Model {
    id: String,
    name: String,
    provider: String,
    #[serde(default)]
    tool_call: bool,
    pricing: Option<Pricing>,
}

#[derive(Deserialize)]
struct Pricing {
    input: f64,
    output: f64,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let data = reqwest::blocking::get(
        "https://github.com/i-need-token/ai-models/releases/latest/download/models.json"
    )?.text()?;

    let catalog: Catalog = serde_json::from_str(&data)?;
    println!("Total models: {}", catalog.models.len());

    // 查找推理模型
    let reasoning: Vec<_> = catalog.models.iter()
        .filter(|m| m.tool_call)
        .collect();

    println!("Tool-calling models: {}", reasoning.len());
    Ok(())
}
```

## Shell / jq

```bash
# 下载数据
curl -sLO https://github.com/i-need-token/ai-models/releases/latest/download/models.json

# 统计模型总数
jq '.models | length' models.json

# 查找所有 OpenAI 模型
jq '.models[] | select(.provider == "openai") | .name' models.json

# 查找最便宜的工具调用模型
jq '[.models[] | select(.tool_call == true and .pricing.input != null)] | sort_by(.pricing.input) | .[:5] | .[] | {name, provider, input: .pricing.input}' models.json

# 查找免费模型
jq '[.models[] | select(.pricing.unit == "free")] | length' models.json

# 列出所有提供商
jq '.providers | keys' models.json
```

## Excel / Google Sheets

1. 下载 CSV：`https://github.com/i-need-token/ai-models/releases/latest/download/models.csv`
2. 在 Excel 中打开或导入 Google Sheets
3. 使用筛选器按提供商、能力或价格范围查找模型

## 常见查询

### 查找最适合编程的模型

```typescript
import catalog from "ai-models";

const codingModels = catalog.models.filter(
  (m) =>
    m.tool_call &&
    m.structured_output &&
    m.limit?.context >= 128000 &&
    m.pricing?.input &&
    m.pricing.input <= 5,
);

// 按上下文窗口（降序）排序，然后按价格（升序）排序
codingModels.sort((a, b) => {
  const ctxDiff = (b.limit?.context ?? 0) - (a.limit?.context ?? 0);
  if (ctxDiff !== 0) return ctxDiff;
  return (a.pricing?.input ?? 0) - (b.pricing?.input ?? 0);
});
```

### 比较同一模型系列在不同提供商的价格

```typescript
import catalog from "ai-models";

// 按系列分组
const families = new Map<string, Model[]>();
for (const m of catalog.models) {
  if (!m.family) continue;
  const list = families.get(m.family) ?? [];
  list.push(m);
  families.set(m.family, list);
}

// 查找在多个提供商上可用的系列
for (const [family, models] of families) {
  const providers = new Set(models.map((m) => m.provider));
  if (providers.size > 1) {
    console.log(`\n${family}:`);
    for (const m of models) {
      console.log(`  ${m.provider}: $${m.pricing?.input}/1M in, $${m.pricing?.output}/1M out`);
    }
  }
}
```

### 为你的应用构建模型选择器

```typescript
import catalog from "ai-models";
import type { Model } from "ai-models";

interface ModelRequirements {
  toolCall?: boolean;
  vision?: boolean;
  reasoning?: boolean;
  structuredOutput?: boolean;
  minContext?: number;
  maxInputPrice?: number;
  maxOutputPrice?: number;
  openWeights?: boolean;
  provider?: string;
}

function findModels(req: ModelRequirements): Model[] {
  return catalog.models.filter((m) => {
    if (req.toolCall && !m.tool_call) return false;
    if (req.vision && !m.modalities?.input?.includes("image")) return false;
    if (req.reasoning && !m.reasoning) return false;
    if (req.structuredOutput && !m.structured_output) return false;
    if (req.minContext && (m.limit?.context ?? 0) < req.minContext) return false;
    if (req.maxInputPrice && (m.pricing?.input ?? Infinity) > req.maxInputPrice) return false;
    if (req.maxOutputPrice && (m.pricing?.output ?? Infinity) > req.maxOutputPrice) return false;
    if (req.openWeights && !m.open_weights) return false;
    if (req.provider && m.provider !== req.provider) return false;
    return true;
  });
}

// 示例：查找支持视觉和工具调用的便宜模型
const results = findModels({
  vision: true,
  toolCall: true,
  maxInputPrice: 1,
  maxOutputPrice: 5,
});
```

## 相关文档

- [API 与编程访问](api.md) — npm、CDN、CSV、GitHub Action
- [快速入门](quick-start.md) — 30 秒内找到适合的模型
- [数据模式](data-schema.md) — 完整 YAML 模式参考
- [常见问题](faq.md) — 常见问题
- [术语表](glossary.md) — 关键术语和定义
