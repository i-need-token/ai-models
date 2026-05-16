# Clarifai

Clarifai is an AI inference platform hosting models from other providers (MoonshotAI, Alibaba, OpenBMB, Mistral, OpenAI, Anthropic, xAI, Google, Meta) with per-token USD pricing.

## Data Sources

- **Pricing**: SSR HTML from clarifai.com/pricing (first-party data, extracted 2026-05-16)
- **Model IDs**: Clarifai pricing page + explore page
- **Context lengths**: Clarifai pricing page (max_tokens field)

## Notes

- Clarifai is an **inference platform** — they host others' models, not their own.
- Pricing is per-token (USD per million tokens) for all models.
- The pricing page is server-side rendered, so model names and prices are accessible without JavaScript.
- Some models have cache_read pricing (10% of input price).
- Model IDs use underscores instead of hyphens and dots (e.g., `Kimi-K2_Thinking`).
- API requires authentication but the pricing data is publicly accessible.
- 12 LLMs + 6 VLMs with per-token pricing on the pricing page.
- New models not in existing providers: MiniCPM4-8B, MiniCPM-o-2.6, Ministral-3-14B-Reasoning-2512, Kimi-K2-Thinking, Qwen3-Next-80B-A3B-Thinking.
