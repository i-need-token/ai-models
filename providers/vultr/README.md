# Vultr Cloud Inference

Vultr Cloud Inference is a serverless inference platform providing OpenAI-compatible API access to a wide range of open-source and proprietary AI models.

## Data Sources

- **Model list**: https://docs.vultr.com/models (browser-scraped Model Library)
- **Pricing**: https://www.vultr.com/products/cloud-inference/ (SSR content: $0.55/1M input, $2.75/1M output)
- **Context lengths**: Original model provider specs

## Notes

- Vultr is an **inference platform**, not a model producer. All models are from other providers.
- Pricing is **flat rate** for all models: $0.55/1M input tokens, $2.75/1M output tokens.
- Model list was browser-scraped from the Vultr Docs Model Library (33 families, ~100 models).
- Context lengths and output limits are sourced from the original model providers' known specs.
- Vultr's API requires authentication; model data was collected from the public docs site.
