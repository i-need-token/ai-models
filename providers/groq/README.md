# Groq

Groq is an inference platform that hosts models from other providers (OpenAI, Meta, Alibaba, Moonshot AI, Canopy Labs) with its own per-token pricing.

## Data Sources

- **Pricing**: https://groq.com/pricing (SSR page, browser-verified)
- **Model IDs**: Groq changelog (https://groq.com/changelog)
- **Context lengths**: Groq pricing page + OpenRouter cross-reference

## Notes

- Groq is an **inference platform**, not a model producer. All models are from other providers.
- Pricing shown is Groq's own per-1M-token rate (USD), which differs from the original providers' pricing.
- Prompt caching pricing (`cache_read`) is from the prompt caching table on the pricing page.
- Enterprise-only models (MiniMax M2.5, Qwen3-VL 32B) are excluded due to lack of public pricing.
- TTS pricing (per M characters) and ASR pricing (per hour) are approximated as `per_request` UnitPricing.
- Model IDs use the format from Groq's API (e.g., `gpt-oss-20b`, not `openai/gpt-oss-20b`).
