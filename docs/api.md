**English** | [中文](./zh/api.md)

# API & Programmatic Access

Use the catalog data in your applications.

## npm Package

Install the catalog as an npm dependency:

```bash
npm install ai-models
```

```typescript
import catalog from "ai-models"; // 4,587 models as JSON
import type { Model } from "ai-models"; // TypeScript types

// Find models with tool calling under $1/1M input
const affordable = catalog.models.filter((m) => m.tool_call && m.pricing.input < 1);
```

The package includes:

- `dist/models.json` — full catalog as JSON
- `dist/index.d.ts` — TypeScript type definitions
- `types/` — source type definitions (Model, Snapshot, Provider, Pricing)

## CDN Access (No Install)

The compiled JSON is available via [jsDelivr CDN](https://www.jsdelivr.com/package/npm/ai-models) — no download or install needed. The CDN automatically serves the latest npm release:

```html
<!-- Use in any HTML page -->
<script type="module">
  const catalog = await fetch("https://cdn.jsdelivr.net/npm/ai-models@latest/models.json").then(
    (r) => r.json(),
  );
  console.log(catalog.models.length); // 4,587
</script>
```

```bash
# Direct curl (always up-to-date)
curl -s https://cdn.jsdelivr.net/npm/ai-models@latest/models.json | jq '.models | length'

# Pin to a specific version
curl -s https://cdn.jsdelivr.net/npm/ai-models@0.1.0/models.json | jq '.stats'
```

```python
# Python — no pip install needed
import urllib.request, json
catalog = json.loads(urllib.request.urlopen("https://cdn.jsdelivr.net/npm/ai-models@latest/models.json").read())
print(len(catalog["models"]))  # 4587
```

```go
// Go — no dependencies needed
resp, err := http.Get("https://cdn.jsdelivr.net/npm/ai-models@latest/models.json")
```

### CDN vs GitHub Releases

| Feature       | jsDelivr CDN                                 | GitHub Releases                               |
| ------------- | -------------------------------------------- | --------------------------------------------- |
| URL stability | `cdn.jsdelivr.net/npm/ai-models@latest/...`  | `github.com/.../releases/latest/download/...` |
| CORS          | ✅ Yes — works in browsers                   | ❌ No — download only                         |
| Caching       | 7 days (versioned), 5 min (`@latest`)        | No caching                                    |
| Speed         | Global CDN, 300+ edge locations              | GitHub CDN                                    |
| Best for      | Web apps, browser scripts, quick prototyping | CLI tools, CI/CD, batch processing            |

## Compiled JSON

All model data is available from [GitHub Releases](https://github.com/i-need-token/ai-models/releases/latest) in two formats:

| File          | Format | Size    | Best For                                  |
| ------------- | ------ | ------- | ----------------------------------------- |
| `models.json` | JSON   | ~2.3 MB | Programmatic access, web apps, TypeScript |
| `models.csv`  | CSV    | ~560 KB | Excel, Google Sheets, data analysis       |
| `stats.json`  | JSON   | ~1 KB   | Catalog statistics summary                |

Also available on [Hugging Face Datasets](https://huggingface.co/datasets/i-need-token/ai-models) for the ML community.

```bash
# Download JSON (full metadata)
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.json

# Download CSV (flat table for spreadsheets)
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.csv

# Specific version
curl -LO https://github.com/i-need-token/ai-models/releases/download/v0.1.0/models.json
```

### Compile Locally

```bash
npm install
npx tsx scripts/compile.ts
# Output: dist/models.json (2.3 MB)
```

### JSON Structure

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

### Usage Examples

**JavaScript/TypeScript:**

```javascript
const catalog = require("./models.json");

// Find all models with tool calling under $1/1M input tokens
const cheap = catalog.models.filter(
  (m) => m.tool_call && m.pricing?.input < 1 && m.pricing?.currency === "USD",
);

// Find the cheapest model per provider
const byProvider = {};
for (const m of catalog.models) {
  if (!m.pricing?.input) continue;
  if (!byProvider[m.provider] || m.pricing.input < byProvider[m.provider].pricing.input) {
    byProvider[m.provider] = m;
  }
}

// Get all vision models
const vision = catalog.models.filter((m) => m.modalities?.input?.includes("image"));
```

**Python:**

```python
import json

with open("models.json") as f:
    catalog = json.load(f)

# Find all reasoning models
reasoning = [m for m in catalog["models"] if m.get("reasoning")]

# Find models with largest context windows
by_context = sorted(
    catalog["models"],
    key=lambda m: (m.get("limit", {}) or {}).get("context", 0),
    reverse=True,
)[:10]
```

## Individual YAML Files

For type-safe access to individual models, use the YAML files directly with Zod validation:

```typescript
import { ModelSchema } from "./types/schemas";
import { parse } from "yaml";
import { readFileSync } from "fs";

const raw = readFileSync("providers/openai/models/gpt-4.1.yaml", "utf-8");
const model = ModelSchema.parse(parse(raw)); // Runtime-validated

console.log(model.pricing); // { input: 2, output: 8, cache_read: 0.5 }
```

## CLI Tools

```bash
# Validate all YAML data
npx tsx scripts/validate.ts

# Compute catalog statistics
npx tsx scripts/stats.ts          # table format
npx tsx scripts/stats.ts json     # JSON format

# Compile to models.json
npx tsx scripts/compile.ts

# Sync data from providers
npx tsx scripts/sync.ts openai    # single provider
npx tsx scripts/sync.ts           # all providers
```
