# AI/ML API

Inference platform hosting models from multiple providers (OpenAI, Anthropic, Google, DeepSeek, Alibaba Cloud, xAI, MiniMax, Zhipu AI, Moonshot AI, ByteDance, Baidu, NVIDIA, Xiaomi, Perplexity, NousResearch) with per-token pricing.

## Data Source

- **Pricing**: https://aimlapi.com/ai-ml-api-pricing (Webflow SSR page, browser-scraped)
- **Model list**: https://api.aimlapi.com/v1/models (public API, 441 models)
- **API endpoint**: https://api.aimlapi.com/v1 (OpenAI-compatible)

## Notes

- Pricing is per 1M tokens (USD)
- Model IDs are derived from the website pricing page model names (not API model IDs)
- The website pricing page is CSR-rendered (Webflow), requiring browser automation to extract
- 105 text/code models with pricing are included; image/video/embedding models are excluded
- Free models (NVIDIA Nemotron 3 Nano Omni, Baidu ERNIE 4.5 0.3B) use FreePricing
- Some models include cache_read pricing
