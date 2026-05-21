# Code Examples

**English** | [中文](./zh/code-examples.md)

Practical code examples for working with the AI Models Catalog data in multiple languages.

## Download the Data

```bash
# JSON — full metadata (2.3 MB)
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.json

# CSV — flat table for Excel/Google Sheets (560 KB)
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.csv
```

## TypeScript / JavaScript

### Install the npm package

```bash
npm install ai-models
```

### Basic usage

```typescript
import catalog from "ai-models";
import type { Model } from "ai-models";

// Total number of models
console.log(`Total models: ${catalog.models.length}`);

// Find models by provider
const openaiModels = catalog.models.filter((m) => m.provider === "openai");
console.log(`OpenAI models: ${openaiModels.length}`);
```

### Find the cheapest tool-calling models

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

### Find models with the largest context windows

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

### Find free models with vision

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

### Using the JSON data

```python
import json
import urllib.request

# Download the latest data
url = "https://github.com/i-need-token/ai-models/releases/latest/download/models.json"
urllib.request.urlretrieve(url, "models.json")

with open("models.json") as f:
    catalog = json.load(f)

print(f"Total models: {len(catalog['models'])}")
```

### Find reasoning models under $5/1M output

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

### Using pandas with the CSV

```python
import pandas as pd

df = pd.read_csv("https://github.com/i-need-token/ai-models/releases/latest/download/models.csv")

# Filter and sort
tool_calling = df[df["tool_call"] == True].sort_values("pricing_input")
print(tool_calling[["name", "provider", "pricing_input", "pricing_output"]].head(10))
```

### Find open-weight models with tool calling

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

    // Find tool-calling models under $1/1M input
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

    // Find reasoning models
    let reasoning: Vec<_> = catalog.models.iter()
        .filter(|m| m.tool_call)
        .collect();

    println!("Tool-calling models: {}", reasoning.len());
    Ok(())
}
```

## Shell / jq

```bash
# Download the data
curl -sLO https://github.com/i-need-token/ai-models/releases/latest/download/models.json

# Count total models
jq '.models | length' models.json

# Find all OpenAI models
jq '.models[] | select(.provider == "openai") | .name' models.json

# Find the cheapest models with tool calling
jq '[.models[] | select(.tool_call == true and .pricing.input != null)] | sort_by(.pricing.input) | .[:5] | .[] | {name, provider, input: .pricing.input}' models.json

# Find free models
jq '[.models[] | select(.pricing.unit == "free")] | length' models.json

# List all providers
jq '.providers | keys' models.json
```

## Excel / Google Sheets

1. Download the CSV: `https://github.com/i-need-token/ai-models/releases/latest/download/models.csv`
2. Open in Excel or import into Google Sheets
3. Use filters to find models by provider, capability, or price range

## Common Queries

### Find the best model for coding

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

// Sort by context window (descending), then price (ascending)
codingModels.sort((a, b) => {
  const ctxDiff = (b.limit?.context ?? 0) - (a.limit?.context ?? 0);
  if (ctxDiff !== 0) return ctxDiff;
  return (a.pricing?.input ?? 0) - (b.pricing?.input ?? 0);
});
```

### Compare pricing across providers for the same model family

```typescript
import catalog from "ai-models";

// Group by family
const families = new Map<string, Model[]>();
for (const m of catalog.models) {
  if (!m.family) continue;
  const list = families.get(m.family) ?? [];
  list.push(m);
  families.set(m.family, list);
}

// Find families available on multiple providers
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

### Build a model selector for your app

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

// Example: Find a cheap vision model with tool calling
const results = findModels({
  vision: true,
  toolCall: true,
  maxInputPrice: 1,
  maxOutputPrice: 5,
});
```
