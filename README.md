# AI Models Catalog

A structured, machine-readable catalog of AI model providers and their models. All data is sourced from first-party APIs and official documentation — no third-party aggregators.

## Data Format

Model data is stored as YAML files under `providers/<provider>/models/`. Each file represents one model with its snapshots:

```yaml
id: gpt-4o
name: GPT-4o
family: gpt-4o
reasoning: true
tool_call: true
attachment: true
structured_output: true
pricing:
  input: 2.5
  output: 10
  cache_read: 1.25
limit:
  context: 128000
  output: 16384
modalities:
  input:
    - text
    - image
  output:
    - text
knowledge: "2023-10"
release_date: "2024-05-13"
last_updated: "2024-08-06"
snapshots:
  - id: gpt-4o-2024-08-06
  - id: gpt-4o-2024-05-13
    deprecated: true
```

### Pricing Types

| Type           | When                      | Example                         |
| -------------- | ------------------------- | ------------------------------- |
| `TokenPricing` | Per-million-token pricing | `input: 2.5, output: 10`        |
| `VideoPricing` | Per-second pricing        | `unit: per_second, price: 0.03` |
| `UnitPricing`  | Per-image or per-request  | `unit: per_image, price: 0.04`  |
| `FreePricing`  | No cost                   | `unit: free`                    |

See [`types/pricing.ts`](types/pricing.ts) for the full type definitions.

## Usage

### Install Dependencies

```bash
npm install
```

### Sync Model Data

Fetch the latest model data from a provider's first-party source:

```bash
# Sync a specific provider
npx tsx scripts/sync.ts openai
npx tsx scripts/sync.ts anthropic

# Sync all providers
npx tsx scripts/sync.ts
```

### Validate Model Data

Validate all YAML files against the Zod schemas:

```bash
npx tsx scripts/validate.ts
```

## Project Structure

```
├── providers/
│   ├── openai/
│   │   ├── scrape.ts          # Data acquisition from OpenAI's website
│   │   └── models/            # YAML model data files
│   └── anthropic/
│       ├── scrape.ts          # Data acquisition from Anthropic's website
│       └── models/            # YAML model data files
├── types/
│   ├── model.ts               # Model and Snapshot type definitions
│   ├── pricing.ts             # Pricing type definitions
│   ├── provider.ts            # Provider type definitions
│   ├── schemas.ts             # Zod runtime validation schemas
│   └── index.ts               # Re-exports
├── scripts/
│   ├── sync.ts                # Orchestration: scrape → write YAML
│   ├── validate.ts            # Validate all YAML against schemas
│   └── lib/                   # Shared utilities (defineModel, defineProvider, writer)
└── docs/
    ├── data-acquisition.md    # How we acquire and update model data
    └── lessons-learned.md     # Design principles and pitfalls
```

## Adding a New Provider

1. Create `providers/<id>/scrape.ts` with a `scrape()` function that returns `{ provider, models }`
2. Data must come from a first-party source (provider's API or website)
3. Include a discovery step — no hardcoded model ID lists
4. Run `npx tsx scripts/sync.ts <id>` to generate initial data
5. Validate with `npx tsx scripts/validate.ts`

See [`docs/data-acquisition.md`](docs/data-acquisition.md) for detailed guidelines.

## Design Principles

- **First-party data only** — all model data comes from the provider's own API or website
- **Dynamic discovery** — scrape functions discover models from the source, not from hardcoded lists
- **Include deprecated, exclude retired** — deprecated models are included with a `deprecated: true` flag; retired (inaccessible) models are excluded
- **Never fabricate data** — if required data is missing, skip the model with a warning rather than filling in guessed values
- **YAML source format** — human-readable, supports comments, machine-parseable
- **Snapshot inheritance** — dated model versions are nested within the parent model, inheriting all fields

See [`docs/lessons-learned.md`](docs/lessons-learned.md) for the full set of design principles and pitfalls.

## License

MIT
