# Regolo AI

European AI inference API provider with OpenAI-compatible endpoints.

## Data Source

- **Model list + specs**: Homepage (`https://regolo.ai`) embeds a `regolo_model_list` JSON object in a `<script>` tag containing model metadata (context limits, pricing, capabilities)
- **API**: `https://api.regolo.ai/v1/models` (public, no auth required) — returns basic model IDs only; no pricing or specs

## Pricing

EUR per million tokens (input and output). Pricing is extracted from the homepage's embedded JSON as per-token values and converted to per-million-token (×1e6).

## Notes

- 13 chat models from 7+ providers (Swiss AI Initiative, OpenAI, Google, Meta, MiniMax, Mistral, Alibaba/Qwen)
- `brick-v1-beta` is a semantic router (not a real model) — skipped
- Non-chat models (embedding, OCR, STT, image generation, reranker) are excluded
- All models support `response_format` parameter → `structured_output: true`
