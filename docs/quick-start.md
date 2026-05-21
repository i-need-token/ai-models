**English** | [中文](./zh/quick-start.md)

# Quick Start Guide

Find the right AI model for your needs in 30 seconds.

## I want to find the cheapest model

→ See [Pricing Comparison](pricing-comparison.md) for the cheapest models per provider and cross-platform price comparisons.

**Cheapest models with tool calling:**

| Model            | Provider      | Input (per 1M tokens) | Output (per 1M tokens) |
| ---------------- | ------------- | --------------------: | ---------------------: |
| DeepSeek-V3      | DeepSeek      |                 $0.27 |                  $1.10 |
| Qwen3-235B-A22B  | Alibaba Cloud |                 $0.14 |                  $0.42 |
| Llama 4 Maverick | Together AI   |                 $0.20 |                  $0.80 |

## I want the most capable model

→ See [Model Comparison](model-comparison.md) for flagship model comparisons.

**Top-tier flagships:**

| Model          | Context | Tool Call | Vision | Input $/1M | Output $/1M |
| -------------- | ------- | --------- | ------ | ---------: | ----------: |
| GPT-4.1        | 1M      | ✅        | ✅     |      $2.00 |       $8.00 |
| Claude Opus 4  | 200K    | ✅        | ✅     |     $15.00 |      $75.00 |
| Gemini 2.5 Pro | 1M      | ✅        | ✅     |      $1.25 |      $10.00 |
| DeepSeek-R1    | 128K    | ✅        | ❌     |      $0.55 |       $2.19 |

## I want a free model

→ See [Model Comparison](model-comparison.md#free-models) for the full list.

**Free models with tool calling:**

- Google Gemini 2.0 Flash (via Google AI Studio)
- Cloudflare Workers AI models (edge inference)
- Various models on Chutes, Cerebras, Groq free tiers

## I want the largest context window

→ See [Model Comparison](model-comparison.md#largest-context-windows) for the full list.

| Model           | Context Window |
| --------------- | -------------: |
| Llama 4 Scout   |     10M tokens |
| Gemini 2.5 Pro  |      1M tokens |
| GPT-4.1         |     ~1M tokens |
| Claude Sonnet 4 |    200K tokens |

## I want to browse all providers

→ See [Provider Overview](providers.md) for all 95 providers organized by type.

## I want to use the data programmatically

### npm package

```bash
npm install ai-models
```

```typescript
import catalog from "ai-models"; // 4,587 models as JSON
import type { Model } from "ai-models"; // TypeScript types
```

### Download data files

```bash
# JSON — full metadata (2.3 MB)
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.json

# CSV — flat table for Excel/Google Sheets (560 KB)
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.csv
```

### CDN access (no install)

The compiled JSON is available via [jsDelivr CDN](https://www.jsdelivr.com/package/npm/ai-models) — no download or install needed:

```bash
# Always up-to-date, CORS-enabled, works in browsers
curl -s https://cdn.jsdelivr.net/npm/ai-models@latest/models.json | jq '.models | length'
```

```html
<script type="module">
  const catalog = await fetch("https://cdn.jsdelivr.net/npm/ai-models@latest/models.json").then(
    (r) => r.json(),
  );
  console.log(catalog.models.length);
</script>
```

### From source

```bash
# Install dependencies
npm install

# Compute catalog statistics
npx tsx scripts/stats.ts

# Validate all model data
npx tsx scripts/validate.ts
```

```typescript
import { ModelSchema } from "./types/schemas";
import { parse } from "yaml";
import { readFileSync } from "fs";

// Load and validate a model
const raw = readFileSync("providers/openai/models/gpt-4.1.yaml", "utf-8");
const model = ModelSchema.parse(parse(raw));

console.log(model.pricing); // { input: 2, output: 8, cache_read: 0.5 }
console.log(model.limit); // { context: 1047576, output: 32768 }
```

## I want to add a new provider

→ See [Contributing Guide](../CONTRIBUTING.md) and [Data Acquisition Guide](data-acquisition.md).

## I want to understand the data format

→ See [Data Schema Reference](data-schema.md) for the complete YAML schema.

## Related Documentation

- [Model Selection Guide](model-selection.md) — decision framework for choosing models
- [FAQ](faq.md) — common questions about the catalog
- [API & Programmatic Access](api.md) — download and use the data
- [Code Examples](code-examples.md) — practical examples in TypeScript, Python, Go, Rust
- [Glossary](glossary.md) — key terms and definitions
