# Mistral AI

Mistral AI is a French AI company producing open-weight and commercial LLMs, ranging from 3B to 123B parameters.

## Data Sources

| Data                  | Source                                                                                                                 | Method     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------- |
| Model IDs             | [GitHub Models API](https://models.github.ai/v1/models)                                                                | API (JSON) |
| Pricing (most models) | [AWS Bedrock Price List API](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/index.json) | API (JSON) |
| Pricing (Codestral)   | [Azure Retail Prices API](https://prices.azure.com/api/retail/prices?productName=Azure%20Mistral%20Models)             | API (JSON) |

## Approach

Hardcoded model data and pricing. Mistral's own API (docs.mistral.ai) is currently unreachable from this network, so we use AWS Bedrock and Azure pricing as first-party sources.

## Model Families

- **Mistral Large** — Flagship 123B model, multimodal (text+image input)
- **Mistral Medium** — Mid-tier model
- **Mistral Small** — Efficient 22B model
- **Mistral Nemo** — 12B open-weight model (co-developed with NVIDIA)
- **Codestral** — 22B code generation model, 256K context
- **Ministral** — Edge/small models (3B, 8B)
- **Pixtral** — Vision model (text+image input)
- **Devstral** — Code agent model, tool-calling optimized
- **Magistral** — Reasoning model (extended thinking)
- **Voxtral** — Speech-to-text model (text+audio input)
- **Mixtral** — MoE models (8x7B, 8x22B) — **deprecated**
- **Mistral 7B** — Original open-weight model — **deprecated**

## Notes

- Pricing is in USD per 1M tokens (AWS Bedrock us-east-1 standard on-demand)
- Codestral pricing from Azure (not available on Bedrock)
- Devstral, Magistral, Voxtral pricing from AWS Bedrock (not yet on Azure)
- Mistral Large 3 pricing: $2.00/$6.00 per mtok (same as Pixtral Large)
- Deprecated models: Mistral Large 2407, Mixtral 8x22B, Mixtral 8x7B, Mistral 7B
- docs.mistral.ai was unreachable during data collection
