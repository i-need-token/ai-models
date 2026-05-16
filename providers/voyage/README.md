# Voyage AI

Voyage AI (now part of MongoDB) produces embedding and reranking models for search and retrieval.

## Data Sources

- **Model specs**: Voyage AI docs — Text Embeddings, Multimodal Embeddings, Contextualized Chunk Embeddings, Rerankers pages (browser-verified CSR)
- **Pricing**: Voyage AI docs — Pricing page (browser-verified SSR)

## Notes

- The API requires authentication (`Authorization: Bearer <key>`); no public model listing endpoint.
- Embed and reranker models use `output: 0` in limits since they don't generate text output tokens.
- Pricing is per million input tokens only (output pricing = 0).
- Multimodal models have additional pixel-based pricing ($0.60/B pixels) not representable in our schema; only text token pricing is included.
- `voyage-4-nano` is open-weight (available on Hugging Face) with FreePricing.
- Older generation models (Voyage 3 series, Rerank 2/Lite 1) are marked as deprecated.
- Voyage 4 series context lengths: the docs model table shows 32,000 for all Voyage 4 models; the API reference mentions higher limits for the `input_type` parameter's max_token, but the model table values are used as the authoritative context length.
