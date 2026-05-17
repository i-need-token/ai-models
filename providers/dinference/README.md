# DInference

High-performance LLM inference platform by Dechat Inc. US-hosted, OpenAI-compatible API endpoints.

## Data Sources

- **Pricing**: https://dinference.com/pricing (browser-scraped 2026-05-16)
- **Model details**: https://dinference.com/models (browser-scraped 2026-05-16)
- **API docs**: https://dinference.com/docs

## Notes

- 6 models available: GPT-OSS-20B, GPT-OSS-120B, MiniMax-M2.5, GLM-4.7, GLM-5, GLM-5.1
- Per-token pricing in USD per million tokens
- US-hosted infrastructure, zero-retention policy
- OpenAI-compatible API at `https://api.dinference.com/v1`
- API requires authentication (no public model listing endpoint)
- Also available via OpenRouter (coming soon)
- Context limits from models page: GPT-OSS 131K in / 33K out, GLM 200K in / 128K out
- MiniMax-M2.5 and GLM-5.1 context limits inferred from original provider catalogs
