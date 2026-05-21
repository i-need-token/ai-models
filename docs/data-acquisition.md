**English** | [中文](./zh/data-acquisition.md)

# Data Acquisition

How we obtain and update model data for each provider.

## Core Principles

1. **Data must come from first-party sources** — provider's own API, website, or documentation. No copying from third-party aggregators.
2. **Scrape functions return data, they don't write files** — separation of concerns: scrape functions produce structured data objects; a global orchestration script handles file I/O.

## Data Source Hierarchy

| Priority | Source                      | Description                                                                                           | Automation |
| :------: | --------------------------- | ----------------------------------------------------------------------------------------------------- | ---------- |
|    1     | Provider API                | The provider exposes a public or authenticated API that returns model lists and/or pricing            | Full auto  |
|    2     | Provider website (llms.txt) | The provider's website supports the `llms.txt` protocol — append `.md` to a URL to get clean Markdown | Semi-auto  |
|    3     | Provider website (SSR)      | Server-side rendered pages — all data is in the HTML, parse with DOM extraction tools                 | Semi-auto  |
|    4     | Provider website (CSR)      | Client-side rendered pages — data comes from internal API calls; intercept the API                    | Semi-auto  |
|    5     | Manual                      | No structured data source available; human maintains the data                                         | Manual     |

### llms.txt Protocol

Many modern websites support the `llms.txt` protocol. When available, this is the easiest way to extract structured data from a website:

```
https://example.com/pricing       → website
https://example.com/pricing.md    → clean Markdown (llms.txt)
```

### Website Parsing Strategy

When `llms.txt` is not available, determine the rendering type and use the appropriate strategy:

| Rendering         | How to detect                         | Extraction method                                                      |
| ----------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| SSR (Server-Side) | Full content in initial HTML response | Parse HTML → DOM → extract structured data                             |
| CSR (Client-Side) | HTML is a shell with JS bundles       | Intercept network requests to find the data API, then call it directly |

## Scrape Function Design

### Separation of Concerns

```
scrape function (per provider)     →  returns structured data
global orchestration script        →  writes YAML files
```

The scrape function is a **pure data function** — it fetches from a source, transforms to our schema, and returns an object. It never touches the filesystem.

### Function Signature

```typescript
import type { Model, Provider } from "../../types";

interface ScrapeResult {
  provider: Provider;
  models: Model[];
}

/**
 * Fetches model data from the provider's first-party source.
 * Returns structured data — does NOT write any files.
 */
export function scrape(): Promise<ScrapeResult>;
```

### What Goes Into a Scrape Function

| Allowed (transformation logic)               | Not allowed (data)                   |
| -------------------------------------------- | ------------------------------------ |
| API base URLs                                | Hardcoded model ID arrays            |
| Field mapping rules                          | Hardcoded pricing values             |
| Grouping logic for aggregators               | Hardcoded capability flags           |
| Default values for missing fields            | Hardcoded model name/family mappings |
| Filtering rules (prefixes, exclude patterns) |                                      |

**Critical**: The "Not allowed" column is non-negotiable. If a scrape function contains a hardcoded list of model IDs, it violates the first-party data principle — the catalog cannot stay up-to-date as providers add or remove models. Every scrape function must include a discovery step that fetches the model list from the provider's data source.

### Example: Provider with Public API

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

### Example: Provider with Website Source

```typescript
export async function scrape(): Promise<ScrapeResult> {
  // Try llms.txt first
  const md = await fetch("https://provider.com/pricing.md");
  if (md.ok) {
    return parseFromMarkdown(await md.text());
  }

  // Fall back to HTML parsing
  const html = await fetch("https://provider.com/pricing");
  return parseFromHtml(await html.text());
}
```

## Pipeline Architecture

### Why Pipelines?

A monolithic `scrape()` function gives AI agents too much freedom — they can hardcode model IDs, fabricate pricing, or hallucinate capabilities. The pipeline architecture prevents this by design through type constraints.

### Two Pipeline Styles

| Style                     | AI defines                                                 | Runtime                                       | Prevention level                                  |
| ------------------------- | ---------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------- |
| Execute-function pipeline | Typed step functions (`discover()`, `extractPricing()`, …) | `runPipeline()`                               | Type constraints per step                         |
| Declarative pipeline      | CSS Selectors / Regex / JSONPath rules only                | `runDeclarativePipeline()` (fixed, immutable) | AI can only define "what to extract", never "how" |

### Execute-Function Pipeline

The original pipeline splits one big function into typed steps. Each step has a constrained output type — `discover()` can only return IDs, `extractPricing()` can only return pricing, etc. The `assemble()` step is a pure merge with zero fabrication space.

```
discover()          → DiscoveredModel[]        // Only id + deprecated
extractPricing()    → Map<id, Pricing>         // Only pricing
extractLimits()     → Map<id, Limit>           // Only context window
extractModalities() → Map<id, Modalities>      // Only modalities
extractFeatures()   → Map<id, Features>        // Only capability flags
extractDates()      → Map<id, Dates>           // Only dates (required)
deriveName()        → Map<id, string>          // Pure function from id
deriveFamily()      → Map<id, string>          // Pure function from id
assemble()          → Model[]                  // Pure merge, zero fabrication
```

Key constraints:

1. `discover()` only returns `{ id, deprecated }` — impossible to hardcode modalities/pricing
2. `extractPricing()` only returns `Map<id, Pricing>` — function signature limits output
3. `assemble()` is a pure merge — no space for fabrication
4. Each extraction step must declare its source URL (lint-verifiable)
5. Missing data = omit the field, never use fallback defaults

### Declarative Pipeline

The declarative pipeline goes further: AI can only define **what to extract** (rules), never **how to extract** (arbitrary code). The runtime is fixed and immutable.

Three source types, three rule languages:

| Source type | Rule language | Example                                            |
| ----------- | ------------- | -------------------------------------------------- |
| HTML        | CSS Selector  | `label: "Input", valueSelector: "div + div"`       |
| Markdown    | Regex         | `pattern: /\*\*Input token limit\*\*\s*([\d,]+)/i` |
| API (JSON)  | JSONPath      | `jsonpath: "$.pricing.input"`                      |

Five extraction modes:

| Mode               | Purpose                            | Example                                        |
| ------------------ | ---------------------------------- | ---------------------------------------------- |
| `labelValue`       | Find label, extract adjacent value | "Input token limit" → 1,048,576                |
| `table`            | Extract structured table data      | Pricing tables with model/input/output columns |
| `list`             | Extract all matching elements      | Model ID list from `<a>` links                 |
| `section`          | Extract content within a section   | A specific `<section>` or `## Heading`         |
| `field` (API only) | Extract a single JSON field        | `$.pricing.input`                              |
| `array` (API only) | Extract and map a JSON array       | `$.data[*]` with field mappings                |

Value transforms are a fixed set — AI can only choose which one to apply:

```
parseFloat | parseInt | parseNumber | parsePrice | parseDate |
parseModality | toLowerCase | toUpperCase | trim | removeCommas | identity
```

### When to Use Which Style

- **Declarative pipeline**: Preferred for new providers where the data source has a regular, predictable structure (most API-based providers, simple HTML tables).
- **Execute-function pipeline**: Needed when extraction logic is too complex for declarative rules (e.g., Cohere's `<ModelShowcase>` JSX component requires regex parsing beyond current rule types).
- **Direct `scrape()` function**: Still supported for backward compatibility; used by most existing providers.

## Provider Types

### Model Producers

Providers that develop and produce their own AI models. They are the **primary source** for model data — their APIs and documentation are authoritative.

Examples: OpenAI, Anthropic, Google, Meta, DeepSeek, Alibaba, Mistral, etc.

### Inference Platforms

Providers that host and serve models produced by others. They are added **after all model producers** are covered. Inference platforms must meet strict criteria:

**Required:**

- Per-token pricing (not per-second, per-credit, per-DBU, or other units)
- Pricing in USD, CNY, or EUR only
- First-party data source (the platform's own API, website, or embedded JS bundles)

**Accepted router/aggregator platforms:** Some router/aggregator platforms (e.g., OpenRouter, nano-gpt) are accepted because they have their own per-token pricing data accessible from first-party sources (public API or JS bundles). They are treated as inference platforms since they expose per-token USD pricing for hundreds of models.

**Note on data accessibility:** The "publicly accessible API" requirement is relaxed for platforms where pricing data can be extracted from first-party JavaScript bundles embedded in their website. This applies to CSR-rendered pricing pages where the pricing data is embedded in publicly accessible JS chunks (e.g., nano-gpt's pricing JS bundle).

**Rejected categories:**

| Category            | Examples                                                                        | Reason                              |
| ------------------- | ------------------------------------------------------------------------------- | ----------------------------------- |
| Auth-required API   | Hyperbolic, Nebius, Replicate                                                   | Can't scrape without credentials    |
| Non-token pricing   | Replicate (per-second), Databricks (DBU), Snowflake (credits), Venice (credits) | Incompatible pricing model          |
| GPU cloud           | SubModel, GMI Cloud, Akash, io.net                                              | Rent GPUs, not per-token inference  |
| CSR-only, no API    | Most Chinese platforms                                                          | Can't extract data programmatically |
| Enterprise/research | Abacus AI, Liquid AI, Inflection AI                                             | No public pricing/API               |
| Model hub           | ModelScope, HuggingFace                                                         | Duplicate data from producers       |
| Coding tools        | Umans.ai, Morph                                                                 | Not inference platforms             |

## Update Workflow

### Automated Updates (API-based providers)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ scrape()     │ ──→ │ git diff     │ ──→ │ change report │
│ returns data │     │ detect delta │     │ + auto commit │
└──────────────┘     └──────────────┘     └──────────────┘
```

1. Global script calls each provider's `scrape()` function
2. Script writes YAML files (full overwrite per provider)
3. `git diff` reveals what changed
4. Changes are committed with a descriptive message

### Change Types

| Change              | Auto-merge |       Human review       |
| ------------------- | :--------: | :----------------------: |
| New model added     |     ✅     |                          |
| Pricing changed     |     ✅     | ⚠️ Flag for verification |
| Field value changed |     ✅     | ⚠️ Flag for verification |
| Model removed       |            |   ✅ Never auto-delete   |

### Manual Updates (website/manual providers)

1. Human visits the provider's website
2. Updates the YAML file directly
3. Sets `last_updated` to current date
4. Validates with `npm run validate`

## Related Documentation

- [Data Schema](data-schema.md) — complete YAML schema reference
- [Design Principles](lessons-learned.md) — lessons learned
- [Provider Overview](providers.md) — all 95 providers
- [FAQ](faq.md) — common questions
- [Contributing](https://github.com/i-need-token/ai-models/blob/main/CONTRIBUTING.md) — how to contribute

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
