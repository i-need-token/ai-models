# AI Models Catalog

A structured catalog of AI model providers and their models, stored as YAML files. All data is sourced from first-party APIs and official documentation.

## Key Files

- [`types/model.ts`](types/model.ts) — Model, Snapshot, and ModelModality type definitions
- [`types/pricing.ts`](types/pricing.ts) — Pricing type definitions (TokenPricing, VideoPricing, UnitPricing, FreePricing)
- [`types/provider.ts`](types/provider.ts) — Provider and ProviderGroup type definitions
- [`types/schemas.ts`](types/schemas.ts) — Zod runtime validation schemas
- [`docs/data-acquisition.md`](docs/data-acquisition.md) — How we acquire and update model data ([中文](docs/zh/data-acquisition.md))
- [`docs/lessons-learned.md`](docs/lessons-learned.md) — Design principles and pitfalls ([中文](docs/zh/lessons-learned.md))
- [`docs/providers.md`](docs/providers.md) — Provider overview by type and market ([中文](docs/zh/providers.md))
- [`docs/model-comparison.md`](docs/model-comparison.md) — Model comparison tables ([中文](docs/zh/model-comparison.md))
- [`docs/data-schema.md`](docs/data-schema.md) — Data schema reference ([中文](docs/zh/data-schema.md))

## Key Design Decisions

- **YAML as the single source format** — flat, self-contained, no inheritance syntax in YAML
- **Snapshot inheritance** — within a model file, snapshots inherit parent fields and only override what differs
- **No cross-model inheritance** — aggregator models are complete copies; DRY is handled at the scrape script level
- **First-party data only** — data comes from the provider's own API or website, not third-party aggregators
- **Scrape functions return data, not files** — separation of concerns: scrape produces objects, global script writes files
- **Model ID is the stable name** — no date suffix, no alias field; dated snapshot IDs live in the `snapshots` array

## Conventions

- Scrape functions live at `providers/<id>/scrape.ts` and export `scrape(): Promise<ScrapeResult>`
- Provider-specific notes live at `providers/<id>/README.md` (English only)
- Use `defineModel()` and `defineProvider()` for runtime Zod validation
- Never hardcode model ID lists — always include a discovery step
- Never fabricate missing data — skip the model with a warning instead
- Include deprecated models with `deprecated: true`; exclude retired models
- **Bilingual docs** — documentation exists in English (`docs/`) and Chinese (`docs/zh/`). When modifying docs, update both languages simultaneously
