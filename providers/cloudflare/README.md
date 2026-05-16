# Cloudflare Workers AI

Cloudflare Workers AI is an inference platform providing serverless hosting for a wide range of open-source AI models across Cloudflare's global edge network.

## Data Sources

- **Pricing**: https://developers.cloudflare.com/workers-ai/platform/pricing/ (Markdown endpoint, verified)
- **Model IDs**: Cloudflare Workers AI API (@cf/ prefix)
- **Context lengths**: Known from model providers + Cloudflare docs

## Notes

- Cloudflare Workers AI is an **inference platform**, not a model producer. All models are from other providers.
- Pricing shown is Cloudflare's per-1M-token rate (USD).
- Some models have prompt caching pricing (`cache_read` field).
- Many older models are marked "Planned deprecation" on the Cloudflare models page — included with `deprecated: true`.
- Cloudflare bills in "Neurons" internally but displays per-token pricing for comparison.
- 10,000 Neurons per day are free on both Free and Paid plans.
- Only LLM models from the pricing page are included.
- Cloudflare also offers embedding, image, audio, and other model types not included here.
