# Mixlayer

Inference platform for open-source AI models with per-token USD pricing.

## Data Sources

- **Model list**: https://docs.mixlayer.com/models (6 models documented)
- **Pricing**: https://mixlayer.com homepage (per-token USD pricing)
- **Context lengths**: Mixlayer docs (131K for all models)
- **Capabilities**: Mixlayer docs (Tools, Reasoning for all models)

## Notes

- Mixlayer is an inference platform, not a model producer
- All models are from the Qwen 3.5 family
- API endpoint: `https://models.mixlayer.ai/v1` (OpenAI-compatible, requires auth)
- `qwen/qwen3.5-4b-free` is free (rate-limited, not for production)
- `qwen/qwen3.5-122b-a10b` is skipped (no pricing data available)
- All models support tool calling and reasoning/thinking mode
- 5 models available as of 2026-05-16
