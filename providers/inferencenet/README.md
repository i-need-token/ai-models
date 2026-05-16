# Inference.net

Inference.net is a model producer and inference platform. They build their own specialized models (Schematron, BDC-Coder, ClipTagger) and host third-party models with per-token pricing.

## Data Sources

- **Pricing**: JS bundle (`getModelPricePerMillionTokensUSD-BbaVt-U1.js` + `main-tLp8Fz3K.js`) from inference.net (first-party data, extracted 2026-05-16)
- **Model IDs**: Inference.net models page + JS bundle pricing map (FKe)
- **Context lengths**: SSR HTML from models page + JS bundle

## Notes

- Inference.net is a **model producer** — they build Schematron (structured output), BDC-Coder (code), and ClipTagger (vision-language) models.
- They also host third-party models (DeepSeek, Llama, Qwen, GPT-OSS, etc.) with specific quantization variants.
- Pricing is per-token (USD per million tokens) for all models.
- The pricing data is extracted from the JS bundle which uses environment variables with hardcoded default fallbacks. The defaults match the SSR HTML prices shown on the models page.
- Model IDs use the format `provider/model/quantization` (e.g., `meta-llama/llama-3.1-8b-instruct/fp-16`). We flatten `/` to `--` for filesystem-safe IDs.
- Quantization variants (fp-8, fp-16, bf-16, q4-k-m) are different model IDs on Inference.net's platform but represent the same underlying model with different quantization. We include only the most popular quantization per model family.
- Inference.net's own models (Schematron, BDC-Coder, ClipTagger) are all included regardless of overlap.
- The API requires authentication but the pricing data is publicly accessible in the JS bundle.
