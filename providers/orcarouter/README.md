# OrcaRouter

Zero-markup AI model router providing pass-through pricing from leading AI providers.

## Data Source

- **Model list**: [sitemap.xml](https://www.orcarouter.ai/sitemap.xml) (155 model URLs)
- **Pricing**: Browser-scraped from per-model pages at `https://www.orcarouter.ai/models/{id}`
- **Context lengths**: Browser-scraped from per-model pages
- **Capabilities**: Inferred from model family/name

## Notes

- OrcaRouter charges the same rates as the underlying provider with 0% markup
- API requires authentication (`https://orcarouter.ai/v1`)
- The website is CSR-rendered; pricing data is not available via public API
- Non-LLM models (TTS, embedding, image/video generation) are excluded
- Tiered pricing uses tier1 (short context) rates
- Output limits are derived from known data in the original provider catalogs
