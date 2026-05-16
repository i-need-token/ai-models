# nano-gpt

nano-gpt is an inference platform and model router hosting models from 40+ providers with per-token USD pricing.

## Data Sources

- **Model list**: `https://nano-gpt.com/api/v1/models` (public API, 618 models)
- **Pricing**: JS bundle at `https://nano-gpt.com/_next/static/chunks/30244-*` (per-token USD pricing, extracted from first-party JavaScript)

## Pricing Notes

- nano-gpt uses a profit margin multiplier R=1.7 in its pricing JS bundle
- Entries with `/R` suffix store at-cost pricing (at-cost = value / R); the value BEFORE `/R` IS the customer price
- Entries without `/R` suffix store customer pricing as-is
- Final customer prices match official provider prices (verified against OpenAI, Anthropic, Google, etc.)
- Rates are in "milli-dollars per M token" format: rate × 1000 = USD per M tokens

## Model Coverage

- LLM models with per-token pricing from 40+ providers
- Excludes: video/image/audio/embedding models, router/aggregator models, free models
- Model IDs use `--` instead of `/` to avoid filesystem issues

## Excluded Models

- Router/aggregator models: `nanogpt/coding-router`, `auto-model`
- Video models: kling, veo, wan-video, seedance, etc.
- Image models: dall-e, flux, sdxl, imagen, etc.
- Audio models: tts, music, lyria, etc.
- Embedding models: e5, bge, text-embedding, etc.
- Search/research tools: sonar, exa, deep-research, etc.
