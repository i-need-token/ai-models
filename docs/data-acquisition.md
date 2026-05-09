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
