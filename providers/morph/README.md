# Morph

Morph is a model producer that builds specialized models for code editing, search, routing, and context management. They also host open-source models on their infrastructure with custom kernels.

## Data Sources

- **Pricing**: https://morphllm.com/pricing (SSR page, extracted 2026-05-16)
- **Model IDs**: Morph pricing page + docs (https://docs.morphllm.com)
- **Context lengths**: Morph pricing page

## Notes

- Morph is a **model producer** — they build their own specialized models (morph-v3-fast, morph-v3-large, morph-compact, morph-router, morph-warp-grep-v2).
- They also host open-source models (Qwen, MiniMax) on their infrastructure with custom kernels and spec decoding.
- The API is OpenAI-compatible at `https://api.morphllm.com/v1` (requires API key).
- Pricing is per-token (USD per million tokens) for chat/apply models.
- `morph-warp-grep-v2` is a code search model priced per 100K queries, not per-token — excluded from this catalog.
- `morph-router` is a routing model priced per request — included with UnitPricing.
- `morph-compact` is a context compaction model with per-token pricing.
- General models (morph-qwen*, morph-minimax*) are open-source models hosted on Morph infrastructure — they are NOT produced by Morph.
