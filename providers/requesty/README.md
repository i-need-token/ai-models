# Requesty

Unified LLM Gateway hosting models from 24+ providers with 5% markup on
provider pricing. Model list and pricing data sourced from the public API.

## Data Source

- **Model list & pricing**: `https://router.requesty.ai/v1/models` (public API, no auth required)
- **Context lengths**: Requesty API `context_window` field
- **Max output tokens**: Requesty API `max_output_tokens` field
- **Modalities**: Requesty API `supports_vision` field
- **Cache pricing**: Requesty API `caching_price` (cache_write) and `cached_price` (cache_read) fields
- **Capabilities**: Requesty API `supports_tool_calling`, `supports_reasoning`, `supports_computer_use` fields

## Notes

- Requesty is a gateway/router platform — it does not produce its own models
  but provides per-token pricing with a 5% markup on underlying provider costs.
- Pricing is in USD per token (scientific notation); the scrape function converts
  to per-1M-token rates.
- Models with `@region` suffix (e.g., `vertex/gemini-2.5-pro@us-east1`) are
  excluded as regional variants of the same base model.
- Models with `coding/` prefix are excluded as Requesty's own routing models.
- Models with `openai-responses/` prefix are included as they use a different
  API format (Responses API vs Chat Completions API).
- Model IDs use `--` instead of `/` to avoid filesystem issues.
- `max_output_tokens` of 0 is treated as 4096 (default fallback).
