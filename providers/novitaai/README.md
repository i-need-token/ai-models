# Novita AI

Inference platform hosting models from other providers (DeepSeek, Qwen/Alibaba, Zhipu AI, Meta, Baidu, Moonshot AI, MiniMax, Google, etc.) with its own per-token pricing.

## Data Source

- **Model list & pricing**: `https://api.novita.ai/openai/models` (OpenAI-compatible API, no auth required)
- **Pricing conversion**: `input_token_price_per_m / 10000` = USD per million tokens
- **Context lengths & max output**: Same API response (`context_size`, `max_output_tokens`)
- **Modalities**: `input_modalities`, `output_modalities` fields
- **Features**: `features` array (function-calling, reasoning, structured-outputs, serverless)

## Notes

- Model IDs use `--` instead of `/` to avoid filesystem issues (API returns `provider/model` format)
- 104 chat models from 22+ providers
- Free models (zero pricing) use `FreePricing` (`{ unit: "free" }`)
- Dynamic scrape — fetches from API on each sync run
