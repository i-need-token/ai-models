# FastRouter

Inference platform and unified API gateway hosting models from 20+ providers
with per-token pricing. Model list and pricing data sourced from the public API.

## Data Source

- **Model list & pricing**: `https://api.fastrouter.ai/v1/models` (public API, no auth required)
- **Context lengths**: FastRouter API `context_length` field
- **Max output tokens**: FastRouter API `top_provider.max_completion_tokens` field
- **Modalities**: FastRouter API `architecture.modality` and `input_modalities`/`output_modalities` fields
- **Cache pricing**: FastRouter API `pricing.input_cache_read` and `pricing.input_cache_write` fields

## Notes

- FastRouter is a gateway/router platform similar to OpenRouter — it does not produce
  its own models but provides per-token pricing for all hosted models.
- Pricing is in USD per token; the scrape function converts to per-1M-token rates.
- The `fastrouter/auto` routing model is excluded as it is not a distinct model.
- Non-LLM models (image generation, video generation, embeddings, audio, classification)
  are excluded from the catalog.
- Models with empty pricing fields are skipped.
- Free models (both prompt and completion pricing = 0) use `{ unit: "free" }` pricing.
- Model IDs use `--` instead of `/` to avoid filesystem issues
  (FastRouter API uses `provider/model` format).
- `supported_parameters` field is used to detect `tool_call` and `reasoning` capabilities.
