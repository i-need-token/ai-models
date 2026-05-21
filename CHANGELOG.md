# Changelog

All notable changes to the AI Models Catalog.

## 2025-05

### Added

- **95 providers** with structured YAML model data
- **4,682 model files** covering 2,807 unique model IDs across 441 families
- TypeScript type definitions (`types/model.ts`, `types/pricing.ts`, `types/provider.ts`)
- Zod runtime validation schemas (`types/schemas.ts`)
- Automated scrape scripts for each provider (`providers/<id>/scrape.ts`)
- CLI tools: `scripts/sync.ts` (data sync), `scripts/validate.ts` (validation)
- Documentation:
  - [Model Comparison](docs/model-comparison.md) — flagship, cost-effective, free, vision, open-weight comparisons
  - [Pricing Comparison](docs/pricing-comparison.md) — side-by-side pricing across providers and platforms
  - [Provider Overview](docs/providers.md) — all providers organized by type and market
  - [Data Schema Reference](docs/data-schema.md) — complete YAML schema documentation
  - [Data Acquisition Guide](docs/data-acquisition.md) — how we acquire and update model data
  - [Design Principles & Pitfalls](docs/lessons-learned.md) — lessons learned
  - All docs available in Chinese (`docs/zh/`)
- Community files: CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md
- GitHub issue templates (bug report, provider request, data update)
- GitHub PR template
- GitHub Actions CI workflow (validate, type check, lint)

### Provider Coverage

- **Model producers**: OpenAI, Anthropic, Google, Meta, DeepSeek, Alibaba Cloud, Mistral, xAI, Cohere, NVIDIA, IBM, Microsoft, and 18 more
- **Inference platforms**: OpenRouter, Together AI, Fireworks AI, Groq, Cerebras, DeepInfra, and 40+ more
- **Cloud provider hosted**: Amazon Bedrock, Azure OpenAI, Google Vertex AI
- **Chinese market**: 20 providers with CNY pricing
- **European market**: 7 providers with EUR pricing

### Data Highlights

- 1,306 reasoning models
- 2,350 tool-calling models
- 527 open-weight models
- 81 free models
- 1,487 vision (image input) models
- 28 image output models
- 118 audio input models
- 34 audio output models
- 167 video input models
- Context windows up to 10M tokens (Llama 4 Scout)
