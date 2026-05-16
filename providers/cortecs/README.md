# Cortecs

Inference platform hosting models from other providers (Alibaba, Anthropic, DeepSeek, Google, Meta, Mistral, MiniMax, Moonshot, NousResearch, Nvidia, OpenAI, Z.ai, Amazon, H Company, PrimeIntellect) with per-token EUR pricing.

## Data Source

- **Model list & pricing**: `https://api.cortecs.ai/v1/models` (OpenAI-compatible API, no auth required)
- **Pricing**: `input_token`/`output_token` fields = EUR per million tokens
- **Cache read pricing**: `cache_read_cost` field (EUR per million tokens)
- **Cache write pricing**: `cache_write_cost` field (EUR per million tokens)
- **Context lengths**: `context_size` from API
- **Features**: `tags` array (Instruct, Reasoning, Tools, Code, Image, Audio, Safety-guard)

## Notes

- 103 models from 16 providers (after skipping 2 safety-guard models with zero pricing)
- EUR per-token pricing — different from USD pricing from original providers
- Model IDs are flat format (no "/" separator needed)
- Dynamic scrape — fetches from API on each sync run
- `output` limit defaults to `context_size` (API doesn't provide max_output_tokens separately)
- Safety-guard models (qwen3guard-gen) skipped due to zero pricing
