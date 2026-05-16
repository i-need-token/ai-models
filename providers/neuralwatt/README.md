# NeuralWatt

Inference platform hosting models from other providers (Zhipu AI, Moonshot AI, Qwen/Alibaba, MiniMax, OpenAI, Mistral) with its own per-token pricing.

## Data Source

- **Model list & pricing**: `https://api.neuralwatt.com/v1/models` (OpenAI-compatible API, no auth required)
- **Pricing**: `input_per_million` / `output_per_million` = USD per million tokens
- **Context lengths**: `max_context_length` from API metadata
- **Capabilities**: `tools`, `reasoning`, `vision`, `json_mode` from API metadata

## Notes

- Model IDs use `--` instead of `/` to avoid filesystem issues (API returns `provider/model` format)
- 14 models from 6 providers
- "-fast" variants are the same base models with reasoning/thinking disabled for lower latency
- Dynamic scrape — fetches from API on each sync run
