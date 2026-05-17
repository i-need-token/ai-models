# Wafer

Inference optimization platform hosting open-source models with per-token USD pricing.

## Data Sources

- **Model list & context lengths**: https://docs.wafer.ai/wafer-pass.md
- **Pricing**: https://wafer.ai homepage (serverless per-token rates) + docs (overage pricing)
- **Capabilities**: Wafer docs (reasoning, tool calling for all models)

## Notes

- Wafer is an inference optimization platform, not a model producer
- Wafer optimizes open-source models for speed (2.8x faster than base SGLang)
- API endpoint: `https://pass.wafer.ai/v1` (OpenAI-compatible, requires subscription)
- Also exposes Anthropic-compatible endpoint: `https://pass.wafer.ai/v1/messages`
- Wafer Pass subscription includes free requests within plan limits
- Overage/serverless pricing is per-token USD with cache_read at 10% of input
- 2 models available as of 2026-05-16 (more coming soon per docs)
- GLM-5.1 context window: 202,752 tokens (hard cap from docs)
