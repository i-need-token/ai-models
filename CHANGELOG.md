# Changelog

All notable changes to the AI Models Catalog.

## v0.1.0 (2026-05)

### Core Data

- **95 providers** with structured YAML model data
- **4,587 model files** covering 2,712 unique model IDs across 441 families
- TypeScript type definitions (`types/model.ts`, `types/pricing.ts`, `types/provider.ts`)
- Zod runtime validation schemas (`types/schemas.ts`)
- JSON Schema for YAML validation (`schema.json`)
- Automated scrape scripts for each provider (`providers/<id>/scrape.ts`)
- CLI tools: `scripts/sync.ts`, `scripts/validate.ts`, `scripts/stats.ts`, `scripts/compile.ts`, `scripts/export-csv.ts`

### Programmatic Access

- npm package (`ai-models`) with TypeScript types and JSON data
- jsDelivr CDN access (`cdn.jsdelivr.net/npm/ai-models@latest/models.json`)
- CSV export (`models.csv`) available from GitHub Releases
- Reusable GitHub Action (`action.yml`) for CI/CD pipelines
- Hugging Face dataset sync (`huggingface.co/datasets/i-need-token/ai-models`)
- Interactive model catalog on GitHub Pages (`i-need-token.github.io/ai-models/`)

### Documentation (22 EN + 22 ZH = 44 pages)

- [Quick Start](docs/quick-start.md) — find the right model in 30 seconds
- [API & Programmatic Access](docs/api.md) — npm, CDN, CSV, GitHub Action, Hugging Face
- [FAQ](docs/faq.md) — common questions about the catalog, data, and contributing
- [Glossary](docs/glossary.md) — key terms and definitions for AI model terminology
- [Code Examples](docs/code-examples.md) — TypeScript, Python, Go, Rust, jq, Excel
- [Model Comparison](docs/model-comparison.md) — flagship, cost-effective, free, open-weight
- [Pricing Comparison](docs/pricing-comparison.md) — side-by-side pricing across providers
- [Context Window Comparison](docs/context-windows.md) — largest context windows by tier
- [Modality Matrix](docs/modality-matrix.md) — which models support what modalities
- [Tool Calling Models](docs/tool-calling.md) — 2,350 tool-calling models
- [Reasoning Models](docs/reasoning-models.md) — 1,306 reasoning models
- [Structured Output](docs/structured-output.md) — 829 JSON-mode models
- [Vision Models](docs/vision-models.md) — 1,487 vision models
- [Video Models](docs/video-models.md) — 167 video input models
- [Audio Models](docs/audio-models.md) — 118 audio input + 34 audio output models
- [Image Generation](docs/image-generation.md) — 28 image generation models
- [Free AI Models](docs/free-models.md) — 81 free models
- [Open-Weight Models](docs/open-weights.md) — 527 open-weight models
- [Provider Overview](docs/providers.md) — all 95 providers by type and market
- [Data Schema Reference](docs/data-schema.md) — complete YAML schema
- [Data Acquisition](docs/data-acquisition.md) — how we acquire and update model data
- [Design Principles](docs/lessons-learned.md) — lessons learned from building the catalog
- All docs available in Chinese (`docs/zh/`) with cross-language links

### Community & Infrastructure

- CONTRIBUTING.md with Good First Issues table
- CODE_OF_CONDUCT.md, SECURITY.md, CHANGELOG.md
- CITATION.cff for academic discoverability (18 keywords)
- 6 GitHub issue templates + PR template + config.yml
- 10 CI workflows (validate, stats, release, publish, sync, sync-hf, pages, labeler, auto-merge, welcome)
- PR auto-labeler, Dependabot auto-merge, Renovate config
- Welcome workflow for first-time contributors
- CODEOWNERS, .editorconfig, .npmignore, Makefile
- llms.txt + llms-full.txt for AI discoverability
- Social preview SVG, robots.txt, sitemap.xml for SEO

### Provider Coverage

- **Model producers**: OpenAI, Anthropic, Google, Meta, DeepSeek, Alibaba Cloud, Mistral, xAI, Cohere, NVIDIA, IBM, Microsoft, and 18 more
- **Inference platforms**: OpenRouter, Together AI, Fireworks AI, Groq, Cerebras, DeepInfra, and 40+ more
- **Cloud provider hosted**: Amazon Bedrock, Azure OpenAI, Google Vertex AI
- **Chinese market**: 20 providers with CNY pricing
- **European market**: 7 providers with EUR pricing

### Data Highlights

- 1,306 reasoning models
- 2,350 tool-calling models
- 829 structured output models
- 527 open-weight models
- 81 free models
- 1,487 vision (image input) models
- 28 image output models
- 118 audio input models
- 34 audio output models
- 167 video input models
- Context windows up to 10M tokens (Llama 4 Scout)
