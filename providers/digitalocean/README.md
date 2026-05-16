# DigitalOcean

Inference platform hosting models from other providers.

- **URL**: https://www.digitalocean.com/products/inference
- **API Docs**: https://docs.digitalocean.com/products/inference/
- **API**: OpenAI-compatible at `https://inference.do.ai/v1` (requires auth)

## Data Source

- **Pricing**: https://docs.digitalocean.com/products/inference/details/pricing/ (Markdown endpoint available)
- **Model specs**: https://docs.digitalocean.com/products/inference/details/models/ (Markdown endpoint available)
- **llms.txt**: https://docs.digitalocean.com/llms.txt

## Notes

- DigitalOcean hosts both commercial models (Anthropic, OpenAI) and open-source models
- Only "DigitalOcean-Hosted" chat models are included; commercial models are covered by their own providers
- API requires authentication; data is scraped from public docs (Markdown endpoints)
- Per-token USD pricing; some models have off-peak discounts (30% off during 05:00–11:00 UTC)
- Includes GPT-OSS open-source models from OpenAI and Arcee Trinity Large thinking model
- Non-chat models (TTS, video, image, embedding, reranking) are excluded
