# Cerebras

Cerebras is an inference platform that runs models on CS-3 wafer-scale chips, offering extremely fast inference speeds. It hosts models from other providers (Zhipu AI, OpenAI, Meta, Alibaba, DeepSeek) with its own per-token pricing.

## Data Sources

- **Pricing**: https://cerebras.ai/pricing (SSR page, browser-verified)
- **Model IDs**: Cerebras API docs & changelog
- **Context lengths**: Cerebras docs (all models support 128k context)

## Notes

- Cerebras is an **inference platform**, not a model producer. All models are from other providers.
- Pricing shown is Cerebras Developer tier per-1M-token rate (USD).
- Models not on the Developer tier pricing table use FreePricing (available on the Free tier with rate limits).
- ZAI GLM 4.7 is marked as "Preview" on the pricing page.
- Llama 3.1 8B and Qwen 3 235B Instruct are marked as "Will be deprecated on May 27, 2026".
- Model IDs use the format from Cerebras's API (e.g., `llama3.1-8b`, not `llama-3.1-8b`).
