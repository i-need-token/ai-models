# HPC-AI Cloud

HPC-AI Cloud is a GPU cloud platform that offers serverless Model APIs with per-token USD pricing.

## Data Source

- **Pricing**: Browser-scraped from [hpc-ai.com/pricing](https://hpc-ai.com/pricing) (SSR HTML)
- **Model details**: Browser-scraped from individual model pages at `https://hpc-ai.com/models/{provider}/{model}`
- **API docs**: [Quickstart guide](https://www.hpc-ai.com/doc/docs/Model-APIs/User-Guides/Quickstart/)

## Notes

- HPC-AI offers Model APIs as part of their GPU cloud platform
- API is OpenAI-compatible at `https://api.hpc-ai.com/inference/v1`
- Model IDs use `provider/model` format (e.g., `deepseek/deepseek-v4-pro`)
- In YAML filenames and `id` fields, `/` is flattened to `--`
- Pricing includes cache_read rates for most models
- Qwen3.5 models are listed on the pricing page but their model detail pages return "Error: Id not found" — they may be very new or not yet fully available
- Context window data for Qwen3.5 models is not yet available; the `limit` field is omitted per project rule (never fabricate missing data)
