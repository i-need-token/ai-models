# DeepInfra

DeepInfra is an inference platform providing serverless and dedicated endpoint hosting for a wide range of open-source and proprietary AI models.

## Data Sources

- **Model list & pricing**: https://api.deepinfra.com/v1/openai/models (API with per-token pricing in metadata)
- **Pricing page**: https://deepinfra.com/pricing (SSR page, browser-verified)
- **Context lengths**: DeepInfra API metadata & pricing page

## Notes

- DeepInfra is an **inference platform**, not a model producer. All models are from other providers.
- Pricing shown is DeepInfra's per-1M-token rate (USD).
- Some models have prompt caching pricing (`cache_read` field).
- Voxtral audio models are free to use (`unit: free`).
- Only LLM chat/text-to-text models with per-token pricing are included.
- DeepInfra also offers image generation, embeddings, audio, and other model types not included here.
- 90 models as of 2026-05-16 (up from 56 at initial creation).
