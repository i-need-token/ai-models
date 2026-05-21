# Contributing to AI Models Catalog

Thank you for your interest in contributing! This guide covers everything you need to add a new provider, fix data, or improve the catalog.

## Quick Start

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-provider`
3. Make your changes
4. Validate: `npx tsx scripts/validate.ts`
5. Submit a pull request

## Adding a New Provider

### 1. Create the Provider Directory

```
providers/<id>/
├── provider.yaml    # Provider metadata
├── scrape.ts        # Data acquisition script
└── models/          # Generated YAML model files
```

### 2. Create `provider.yaml`

```yaml
id: my-provider
name: My Provider
url: https://my-provider.com
api_docs: https://my-provider.com/docs
apis:
  openai: https://api.my-provider.com/v1
```

### 3. Create `scrape.ts`

Your scrape function must:

- **Return structured data** — never write files directly
- **Use first-party sources only** — the provider's own API or website
- **Include a discovery step** — fetch the model list dynamically, never hardcode model IDs
- **Skip models with missing data** — don't fabricate values

```typescript
import type { Model, Provider } from "../types";
import { defineProvider } from "../scripts/lib/define-provider";
import { defineModel } from "../scripts/lib/define-model";

const provider = defineProvider({
  id: "my-provider",
  name: "My Provider",
  url: "https://my-provider.com",
  api_docs: "https://my-provider.com/docs",
  apis: { openai: "https://api.my-provider.com/v1" },
});

export async function scrape(): Promise<{ provider: Provider; models: Model[] }> {
  // Discover models from the provider's API
  const resp = await fetch("https://api.my-provider.com/v1/models");
  const data = await resp.json();

  const models = data.data
    .filter((m: any) => shouldInclude(m))
    .map((m: any) =>
      defineModel({
        id: m.id,
        name: deriveName(m.id),
        family: deriveFamily(m.id),
        // ... other fields from the API
      }),
    );

  return { provider, models };
}
```

### 4. Run and Validate

```bash
# Generate YAML files
npx tsx scripts/sync.ts my-provider

# Validate all data
npx tsx scripts/validate.ts
```

## Provider Acceptance Criteria

### Model Producers

Providers that develop their own AI models. We welcome all model producers with public APIs or documentation.

### Inference Platforms

Inference platforms must meet **all** of these criteria:

- ✅ Per-token pricing (not per-second, per-credit, or other units)
- ✅ Pricing in USD, CNY, or EUR
- ✅ First-party data source (public API or website)

**Not accepted:**

| Category            | Examples                                 | Reason                             |
| ------------------- | ---------------------------------------- | ---------------------------------- |
| Auth-required API   | Hyperbolic, Nebius                       | Can't scrape without credentials   |
| Non-token pricing   | Replicate (per-second), Databricks (DBU) | Incompatible pricing model         |
| GPU cloud           | SubModel, GMI Cloud                      | Rent GPUs, not per-token inference |
| Enterprise/research | Abacus AI, Liquid AI                     | No public pricing/API              |
| Model hub           | ModelScope, HuggingFace                  | Duplicate data from producers      |

## Data Quality Rules

- **First-party data only** — no copying from third-party aggregators
- **Never fabricate data** — if a field is missing, omit it rather than guessing
- **Include deprecated models** — mark with `deprecated: true`
- **Exclude retired models** — models no longer accessible via API
- **Dynamic discovery** — scrape functions must discover models from the source

## Code Style

```bash
# Format
npm run fmt

# Lint
npm run lint

# Type check
npm run typecheck

# All checks
npm run check
```

## Reporting Issues

- **Incorrect model data** — open an issue with the provider name, model ID, and what's wrong
- **Missing provider** — open an issue with the provider name and a link to their API/docs
- **Bug in scrape script** — open an issue with the error output and steps to reproduce

## Questions?

Check the documentation first:

- [Data Acquisition Guide](docs/data-acquisition.md) — detailed scraping guidelines
- [Design Principles & Pitfalls](docs/lessons-learned.md) — lessons learned from building the catalog
- [数据采集（中文）](docs/zh/data-acquisition.md) — 中文版数据采集指南
