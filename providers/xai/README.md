# xAI Grok

xAI is Elon Musk's AI company, producing the Grok family of large language models. Known for real-time knowledge integration via X (Twitter) data.

## Data Sources

| Data        | Source                                                                                                  | Method     |
| ----------- | ------------------------------------------------------------------------------------------------------- | ---------- |
| Model IDs   | [GitHub Models API](https://models.github.ai/v1/models)                                                 | API (JSON) |
| Pricing     | [Azure Retail Prices API](https://prices.azure.com/api/retail/prices?productName=Azure%20Grok%20Models) | API (JSON) |
| Model specs | Microsoft Foundry docs (Azure-hosted Grok)                                                              | SSR        |

## Approach

Hardcoded model data and pricing. xAI's own API (docs.x.ai) is currently unreachable from this network, so we use Azure-hosted Grok model data as a first-party source. Pricing from the Azure Retail Prices API.

## Model Families

- **Grok-3** — First reasoning model (3, 3 Mini)
- **Grok-4** — Second generation (4, 4 Fast)
- **Grok-4.1/4.2** — Latest generation

## Notes

- Pricing is in USD per 1M tokens (Azure global standard, eastus region)
- Azure pricing may differ from xAI's direct API pricing
- All Grok models support 131K context and 131K output
- Grok-3, Grok-4, Grok-4.1, Grok-4.2 support extended thinking/reasoning
- Grok-4 Fast is the non-reasoning fast variant
- Grok-3 Mini is the smaller reasoning variant
- xAI's own docs (docs.x.ai) were unreachable during data collection
