# Meta Llama

Meta Llama is Meta's family of open-weight large language models, ranging from 1B to 405B parameters. Llama 4 introduces native multimodality and MoE architecture.

## Data Sources

| Data          | Source                                                                                                          | Method         |
| ------------- | --------------------------------------------------------------------------------------------------------------- | -------------- |
| Model specs   | [GitHub model cards](https://github.com/meta-llama/llama-models)                                                | API (Markdown) |
| Output limits | [AWS Bedrock model parameters](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-meta.html) | SSR            |
| Pricing       | [AWS Price List API](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/index.json)  | API (JSON)     |

## Approach

Hardcoded model data and pricing. Model specs from GitHub model cards (first-party Markdown). Output limits from AWS Bedrock model parameters documentation. Pricing from the AWS Price List Service API, which provides per-SKU pricing for all Bedrock models including Meta Llama.

## Model Families

- **Llama 4** — MoE multimodal models (Scout 17Bx16E, Maverick 17Bx128E)
- **Llama 3.3** — Text-only multilingual (70B)
- **Llama 3.2** — Vision models (90B, 11B) + text-only edge models (3B, 1B)
- **Llama 3.1** — Text-only (8B, 70B, 405B)
- **Llama 3** — Original text-only (8B, 70B) — **deprecated**

## Notes

- Pricing is in USD per 1M tokens (AWS Bedrock standard on-demand, us-east-1)
- Llama 3.1 405B pricing is from us-west-2 (not available in us-east-1)
- Llama 4 Scout has 10M context window — the largest of any Llama model
- Llama 4 Maverick has 1M context window
- Llama 3.x text models have 128K context; Llama 3 has 8K context
- Llama 3.2 Vision models accept text+image input
- Llama 3 and Llama 3.1 8B/70B are deprecated; superseded by Llama 3.1/3.3
- Meta Llama API is in waitlist mode; no public pricing from Meta directly
- Llama Guard (safety classifier) and Code Shield are not included — they are not general LLMs
