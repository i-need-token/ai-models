# Anthropic

Anthropic is the developer of the Claude family of large language models, known for their focus on AI safety and helpfulness.

## Data Sources

| Data                  | Source                                                                                                   | Method                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Pricing               | [Anthropic API docs — Pricing](https://platform.claude.com/docs/en/about-claude/pricing)                 | Browser automation (CSR, geo-blocked from CLI) |
| Model specs           | [Anthropic API docs — Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) | Browser automation (CSR, geo-blocked from CLI) |
| Context/output limits | [OpenRouter API](https://openrouter.ai/api/v1/models)                                                    | API (JSON)                                     |

## Approach

Hardcoded model data and pricing. Anthropic's documentation is client-side rendered (Next.js RSC) and geo-blocked from this network's CLI environment, making automated scraping impossible. Data was extracted using browser automation (agent-browser) to access the CSR pages.

## Model Families

- **Claude Opus** — Most capable model family for complex reasoning and agentic coding ($5–$25/mtok)
  - Opus 4.7: Latest flagship, 1M context, 128k output, adaptive thinking
  - Opus 4.6: 1M context, 128k output, extended + adaptive thinking
  - Opus 4.5: 200K context, 64k output
  - Opus 4.1: 200K context, 32k output
  - Opus 4 (deprecated): 200K context, 32k output
  - Opus 4.6/4.7 Fast: $30/$150 per mtok, same specs
- **Claude Sonnet** — Best balance of speed and intelligence ($3/$15/mtok)
  - Sonnet 4.6: 1M context, 128k output
  - Sonnet 4.5: 1M context, 64k output
  - Sonnet 4 (deprecated): 1M context, 64k output
- **Claude Haiku** — Fastest model with near-frontier intelligence ($1/$5/mtok)
  - Haiku 4.5: 200K context, 64k output, extended thinking

## Notes

- Anthropic docs are CSR (Next.js RSC) and geo-blocked — cannot be fetched via CLI
- Pricing includes prompt caching rates (5m/1h cache writes, cache hits at 0.1x)
- Batch API offers 50% discount on all models
- Fast mode variants cost 6x base price ($30/$150 per mtok)
- Opus 4.7 uses a new tokenizer that may use up to 35% more tokens for the same text
- Claude Mythos Preview (defensive cybersecurity) is invitation-only and not included
- Claude Haiku 3.5 is retired on first-party API (still available on Bedrock/Vertex) — excluded
