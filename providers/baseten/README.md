# Baseten

Baseten is an inference platform that hosts open-source and proprietary models with per-token pricing. They provide OpenAI-compatible Model APIs.

## Data Sources

- **Pricing**: https://baseten.co/pricing (SSR page, extracted 2026-05-16)
- **Model IDs**: Baseten pricing page + docs (https://docs.baseten.co)
- **Context lengths**: Cross-referenced with upstream providers (DeepSeek, Moonshot, ZhipuAI, NVIDIA, OpenAI, MiniMax)

## Notes

- Baseten is an **inference platform** — they host models from other providers, not produce their own.
- The API is OpenAI-compatible at `https://model-api.baseten.co/v1` (requires API key).
- Pricing is per-token (USD per million tokens) for all models.
- Cache read pricing is available for most models.
- Model IDs use the format `provider-model-name` (e.g., `deepseek-v4`, `kimi-k2-6`).
- Context lengths are cross-referenced with upstream providers since Baseten's model pages are CSR-rendered.
