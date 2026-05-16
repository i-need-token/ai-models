# Privatemode AI

Privatemode AI is a confidential computing inference platform. All inference runs inside hardware-encrypted Trusted Execution Environments (TEEs), ensuring no one — not even Privatemode — can access prompts or outputs. They host models from MoonshotAI, OpenAI, Google, and Alibaba with per-token EUR pricing.

## Data Sources

- **Pricing**: SSR HTML from privatemode.ai/pricing (first-party data, extracted 2026-05-16)
- **Model IDs**: Privatemode pricing page + models page
- **Context lengths**: Privatemode pricing page

## Notes

- Privatemode AI is an **inference platform** — they host others' models, not their own.
- All inference runs inside hardware-encrypted TEEs (confidential computing).
- Pricing is per-token (EUR per million tokens) for all models.
- All models have cache_read pricing (approximately 10% of input price).
- The pricing page is server-side rendered, so model names and prices are accessible without JavaScript.
- Only 5 LLMs with per-token pricing on the pricing page.
- API requires authentication but the pricing data is publicly accessible.
