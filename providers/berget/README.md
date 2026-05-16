# Berget

Nordic inference platform hosting models from other providers (OpenAI, Mistral, Zhipu AI, Moonshot AI, Google, Meta) with EUR per-token pricing.

## Data Source

- **Model list & pricing**: `https://api.berget.ai/v1/models` (OpenAI-compatible API, no auth required)
- **Pricing**: per-token values converted to per-million-token (value × 1e6), in EUR
- **Context lengths**: hardcoded from well-known model specs (API does not provide them)
- **Capabilities**: `vision`, `function_calling`, `json_mode` from API metadata
- **Reasoning**: hardcoded based on known model features (API does not indicate this)

## Notes

- Model IDs use `--` instead of `/` to avoid filesystem issues (API returns `provider/model` format)
- 7 text models from 6 providers (OpenAI, Mistral, Zhipu, Moonshot, Google, Meta)
- Pricing is in EUR (€ per million tokens)
- `lifecycle_state: "eval"` models are skipped
- Dynamic scrape — fetches from API on each sync run
