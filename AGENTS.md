# AI Models Catalog

A structured catalog of AI model providers and their models, stored as YAML files. All data is sourced from first-party APIs and official documentation.

## Key Files

- [`types/model.ts`](types/model.ts) — Model, Snapshot, and ModelModality type definitions
- [`types/pricing.ts`](types/pricing.ts) — Pricing type definitions (TokenPricing, VideoPricing, UnitPricing, FreePricing)
- [`types/provider.ts`](types/provider.ts) — Provider and ProviderGroup type definitions
- [`types/schemas.ts`](types/schemas.ts) — Zod runtime validation schemas
- [`docs/data-acquisition.md`](docs/data-acquisition.md) — How we acquire and update model data ([中文](docs/zh/data-acquisition.md))
- [`docs/lessons-learned.md`](docs/lessons-learned.md) — Design principles and pitfalls ([中文](docs/zh/lessons-learned.md))
- [`docs/context-windows.md`](docs/context-windows.md) — Context window comparison by size and pricing ([中文](docs/zh/context-windows.md))
- [`docs/free-models.md`](docs/free-models.md) — 81 free AI models by capability ([中文](docs/zh/free-models.md))
- [`docs/open-weights.md`](docs/open-weights.md) — 513 open-weight models ([中文](docs/zh/open-weights.md))
- [`docs/reasoning-models.md`](docs/reasoning-models.md) — 1,306 reasoning models ([中文](docs/zh/reasoning-models.md))
- [`docs/tool-calling.md`](docs/tool-calling.md) — 2,350 tool-calling models ([中文](docs/zh/tool-calling.md))
- [`docs/vision-models.md`](docs/vision-models.md) — 1,487 vision models ([中文](docs/zh/vision-models.md))
- [`docs/image-generation.md`](docs/image-generation.md) — 28 image generation models ([中文](docs/zh/image-generation.md))
- [`docs/structured-output.md`](docs/structured-output.md) — 829 structured output models ([中文](docs/zh/structured-output.md))
- [`docs/modality-matrix.md`](docs/modality-matrix.md) — Model capabilities matrix ([中文](docs/zh/modality-matrix.md))
- [`docs/providers.md`](docs/providers.md) — Provider overview by type and market ([中文](docs/zh/providers.md))
- [`docs/model-comparison.md`](docs/model-comparison.md) — Model comparison tables ([中文](docs/zh/model-comparison.md))
- [`docs/pricing-comparison.md`](docs/pricing-comparison.md) — Pricing comparison across providers ([中文](docs/zh/pricing-comparison.md))
- [`docs/data-schema.md`](docs/data-schema.md) — Data schema reference ([中文](docs/zh/data-schema.md))
- [`docs/quick-start.md`](docs/quick-start.md) — Quick start guide ([中文](docs/zh/quick-start.md))
- [`docs/api.md`](docs/api.md) — API & programmatic access ([中文](docs/zh/api.md))
- [`docs/code-examples.md`](docs/code-examples.md) — code examples in multiple languages ([中文](docs/zh/code-examples.md))

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
