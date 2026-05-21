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
- [`docs/large-context-models.md`](docs/large-context-models.md) — 2,195 models with 128K+ context, 397 with 1M+ ([中文](docs/zh/large-context-models.md))
- [`docs/small-models.md`](docs/small-models.md) — 1,153 small/edge models under 10B params ([中文](docs/zh/small-models.md))
- [`docs/provider-comparison.md`](docs/provider-comparison.md) — Top 30 providers by model count and capabilities ([中文](docs/zh/provider-comparison.md))
- [`docs/free-models.md`](docs/free-models.md) — 81 free AI models by capability ([中文](docs/zh/free-models.md))
- [`docs/open-weights.md`](docs/open-weights.md) — 513 open-weight models ([中文](docs/zh/open-weights.md))
- [`docs/reasoning-models.md`](docs/reasoning-models.md) — 1,306 reasoning models ([中文](docs/zh/reasoning-models.md))
- [`docs/tool-calling.md`](docs/tool-calling.md) — 2,350 tool-calling models ([中文](docs/zh/tool-calling.md))
- [`docs/vision-models.md`](docs/vision-models.md) — 1,487 vision models ([中文](docs/zh/vision-models.md))
- [`docs/video-models.md`](docs/video-models.md) — 167 video models ([中文](docs/zh/video-models.md))
- [`docs/image-generation.md`](docs/image-generation.md) — 28 image generation models ([中文](docs/zh/image-generation.md))
- [`docs/audio-models.md`](docs/audio-models.md) — 118 audio input + 34 audio output models ([中文](docs/zh/audio-models.md))
- [`docs/code-models.md`](docs/code-models.md) — 189 code-focused models across 41 providers ([中文](docs/zh/code-models.md))
- [`docs/agentic-models.md`](docs/agentic-models.md) — Models with tool calling + reasoning for AI agents ([中文](docs/zh/agentic-models.md))
- [`docs/openai-alternatives.md`](docs/openai-alternatives.md) — GPT-4/GPT-3.5 alternatives with pricing, free options, OpenAI-compatible providers ([中文](docs/zh/openai-alternatives.md))
- [`docs/chat-models.md`](docs/chat-models.md) — 2,350 models with tool calling for chat applications ([中文](docs/zh/chat-models.md))
- [`docs/multimodal-models.md`](docs/multimodal-models.md) — 1,519 models with image/audio/video input ([中文](docs/zh/multimodal-models.md))
- [`docs/embedding-models.md`](docs/embedding-models.md) — 5 embedding models for search, RAG, similarity ([中文](docs/zh/embedding-models.md))
- [`docs/structured-output.md`](docs/structured-output.md) — 829 structured output models ([中文](docs/zh/structured-output.md))
- [`docs/modality-matrix.md`](docs/modality-matrix.md) — Model capabilities matrix ([中文](docs/zh/modality-matrix.md))
- [`docs/providers.md`](docs/providers.md) — Provider overview by type and market ([中文](docs/zh/providers.md))
- [`docs/model-comparison.md`](docs/model-comparison.md) — Model comparison tables ([中文](docs/zh/model-comparison.md))
- [`docs/pricing-comparison.md`](docs/pricing-comparison.md) — Pricing comparison across providers ([中文](docs/zh/pricing-comparison.md))
- [`docs/cached-pricing.md`](docs/cached-pricing.md) — Models with prompt caching, 50-90% input cost savings ([中文](docs/zh/cached-pricing.md))
- [`docs/data-schema.md`](docs/data-schema.md) — Data schema reference ([中文](docs/zh/data-schema.md))
- [`docs/quick-start.md`](docs/quick-start.md) — Quick start guide ([中文](docs/zh/quick-start.md))
- [`docs/model-selection.md`](docs/model-selection.md) — Model selection guide: free, best value, large context ([中文](docs/zh/model-selection.md))
- [`docs/migration-guide.md`](docs/migration-guide.md) — Switch providers: pricing, API compatibility, checklist ([中文](docs/zh/migration-guide.md))
- [`docs/api.md`](docs/api.md) — API & programmatic access ([中文](docs/zh/api.md))
- [`docs/code-examples.md`](docs/code-examples.md) — code examples in multiple languages ([中文](docs/zh/code-examples.md))
- [`docs/faq.md`](docs/faq.md) — frequently asked questions ([中文](docs/zh/faq.md))
- [`docs/glossary.md`](docs/glossary.md) — key terms and definitions ([中文](docs/zh/glossary.md))

## SEO Comparison Pages

Curated standalone pages targeting high-volume search queries. All cross-linked with JSON-LD Article schema and OpenGraph/Twitter meta tags.

- [`site/best-ai-models.html`](site/best-ai-models.html) — Best AI Models in 2025 (curated picks, quick compare)
- [`site/free-ai-models.html`](site/free-ai-models.html) — Free AI Models (81 models, zero cost)
- [`site/llm-pricing.html`](site/llm-pricing.html) — LLM Pricing Comparison (95 providers, cheapest per tier)
- [`site/openai-alternatives.html`](site/openai-alternatives.html) — OpenAI Alternatives (95 providers, flagship comparison)
- [`site/ai-models-by-provider.html`](site/ai-models-by-provider.html) — AI Models by Provider (95 providers, 20 detailed sections)
- [`site/context-window-comparison.html`](site/context-window-comparison.html) — Context Window Comparison (7 context tiers, cheapest per tier)
- [`site/best-ai-models-for-coding.html`](site/best-ai-models-for-coding.html) — Best AI Models for Coding (flagship, value, free, open-weight, large context, agentic)
- [`site/best-ai-models-for-agents.html`](site/best-ai-models-for-agents.html) — Best AI Models for Agents (full-stack agentic, TC+reasoning, cheapest TC, free TC)
- [`site/reasoning-models-comparison.html`](site/reasoning-models-comparison.html) — Reasoning Models Comparison (flagship head-to-head, cheapest, free, open weights, reasoning+TC)
- [`site/cheapest-ai-models.html`](site/cheapest-ai-models.html) — Cheapest AI Models (cheapest overall, TC, reasoning, vision, 128K+, per provider)
- [`site/tool-calling-models-comparison.html`](site/tool-calling-models-comparison.html) — Tool Calling Models Comparison (flagship, cheapest, free, open weights, TC+reasoning, TC+vision, TC+large context)
- [`site/ai-model-pricing-calculator.html`](site/ai-model-pricing-calculator.html) — AI Model Pricing Calculator (interactive cost calculator, quick comparison, cheapest tables)
- [`site/best-ai-models-for-image-generation.html`](site/best-ai-models-for-image-generation.html) — Best AI Models for Image Generation (DALL·E, Imagen, GPT-5 Image, Midjourney, cheapest, free, open-weight)
- [`site/best-ai-models-for-vision.html`](site/best-ai-models-for-vision.html) — Best AI Models for Vision (GPT-4o, Claude, Gemini, 1,487 vision models, cheapest, free, vision+tool_call, vision+large context)
- [`site/structured-output-models-comparison.html`](site/structured-output-models-comparison.html) — Structured Output Models Comparison (829 structured output models, JSON mode, SO+tool_call, SO+reasoning, cheapest, free)
- [`site/open-source-ai-models.html`](site/open-source-ai-models.html) — Open Source AI Models (527 open-weight models, free, tool calling, reasoning, vision, large context)
- [`site/multimodal-ai-models.html`](site/multimodal-ai-models.html) — Multimodal AI Models (1,548 vision/audio/image models, modality breakdown, flagship, free)

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
