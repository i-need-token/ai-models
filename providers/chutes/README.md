# Chutes

Inference platform hosting models from other providers (DeepSeek, Qwen/Alibaba, Zhipu AI, Moonshot AI, MiniMax, Google, Mistral) in Trusted Execution Environment (TEE) mode with per-token USD pricing.

## Data Source

- **Model list & pricing**: `https://llm.chutes.ai/v1/models` (OpenAI-compatible API, no auth required)
- **Pricing**: `prompt`/`completion` fields = USD per million tokens
- **Cache read pricing**: `input_cache_read` field (USD per million tokens)
- **Context lengths**: `context_length` and `max_output_length` from API
- **Modalities**: `input_modalities`, `output_modalities` from API
- **Features**: `supported_features` array (json_mode, tools, structured_outputs, reasoning)

## Notes

- Model IDs use `--` instead of `/` to avoid filesystem issues (API returns `provider/model` format)
- 12 models from 6 providers (after skipping 2 models without context info)
- All models are TEE variants (Trusted Execution Environment)
- Dynamic scrape — fetches from API on each sync run
- Models without context length info are skipped
