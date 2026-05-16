# OpenRouter

OpenRouter is an inference platform and model router that provides unified API access to models from 50+ providers with its own per-token pricing.

## Data Sources

- **Model list & pricing**: [OpenRouter API](https://openrouter.ai/api/v1/models) (public, no auth required)
- **Context lengths**: OpenRouter API model metadata (`context_length`, `top_provider.max_completion_tokens`)
- **Modalities**: OpenRouter API `architecture.modality` field

## Notes

- OpenRouter is a **router/aggregator**, not a model producer. It hosts models from other providers with its own pricing (which includes markup).
- Pricing shown is OpenRouter's per-1M-token rate in USD.
- Some models have prompt caching pricing (`cache_read`/`cache_write`).
- Model IDs use `--` instead of `/` (OpenRouter API uses `provider/model` format).
- Free variants (`:free`), tilde-prefix (`~`) optimizations, and OpenRouter's own router models are excluded.
- The `reasoning` flag is set based on whether the model supports the `include_reasoning` or `reasoning` parameter.
- The `tool_call` flag is set based on whether the model supports `tools` or `tool_choice` parameters.
