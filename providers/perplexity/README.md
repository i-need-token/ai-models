# Perplexity

Perplexity is an AI-powered search engine company that produces the Sonar family of online search-augmented language models. These models ground their responses in web sources with citations.

## Data Sources

| Data               | Source                                                                                         | Method         |
| ------------------ | ---------------------------------------------------------------------------------------------- | -------------- |
| Pricing            | [Perplexity API docs](https://docs.perplexity.ai/docs/getting-started/pricing) (GitHub mirror) | Mintlify `.md` |
| Model specs        | [OpenRouter API](https://openrouter.ai/api/v1/models)                                          | API (JSON)     |
| Model descriptions | [Perplexity Sonar models page](https://docs.perplexity.ai/docs/sonar/models) (GitHub mirror)   | Mintlify `.md` |

## Approach

Hardcoded model data and pricing. Perplexity's own API (docs.perplexity.ai) is unreachable from this network, so we use a GitHub mirror of their Mintlify documentation as a first-party source. Context window sizes from OpenRouter's API (which mirrors Perplexity's data).

## Model Families

- **Sonar** — Lightweight, cost-effective search model with grounding ($1/$1 per mtok)
- **Sonar Pro** — Advanced search with complex queries and follow-ups ($3/$15 per mtok, 200K context)
- **Sonar Reasoning Pro** — Chain-of-Thought reasoning with search grounding ($2/$8 per mtok)
- **Sonar Deep Research** — Exhaustive research with comprehensive reports ($2/$8 per mtok)

## Notes

- Pricing is in USD per 1M tokens (token-based pricing only)
- Sonar models also charge per-request fees based on search context size (Low/Medium/High)
- Sonar Deep Research has additional costs: citation tokens ($2/mtok), search queries ($5/1K), reasoning tokens ($3/mtok)
- Perplexity's own docs (docs.perplexity.ai) were unreachable during data collection
- Pricing data sourced from GitHub mirror of Perplexity's Mintlify documentation
- Perplexity also offers an Agent API (third-party models from OpenAI, Anthropic, Google, xAI) and Embeddings API
