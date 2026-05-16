# Kluster AI

Inference platform hosting models from Mistral, DeepSeek, Qwen, Meta, Google, and their own klusterai turbo models.

## Data Source

- **API**: `https://api.kluster.ai/v1/models` (first-party, no auth required)
- **Pricing**: Per-million-token USD pricing from API `pricing.realtime` field
- **Model specs**: Context length, output length, tool support, reasoning, and vision from API

## Notes

- Model IDs use "provider/model" format in the API; "/" is flattened to "--" in YAML filenames
- Only chat models are included (text and multimodal); verify and embedding models are skipped
- Uses realtime pricing (not async/batch pricing)
- `release_date` falls back to `created` timestamp when `release_date` is not available
- klusterai turbo models (owned_by: "klusterai") are optimized versions of open-source models
