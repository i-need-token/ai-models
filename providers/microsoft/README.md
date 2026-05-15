# Microsoft Phi

Microsoft Phi is a family of small language models (SLMs) designed for cost-effective, high-performance AI at the edge. Ranging from 3.8B to 14B parameters, Phi models punch above their weight class.

## Data Sources

| Data        | Source                                                                                                 | Method     |
| ----------- | ------------------------------------------------------------------------------------------------------ | ---------- |
| Model specs | [Azure Phi product page](https://azure.microsoft.com/en-us/products/phi)                               | SSR        |
| Model IDs   | [GitHub Models API](https://models.github.ai/v1/models)                                                | API (JSON) |
| Pricing     | [Azure Retail Prices API](https://prices.azure.com/api/retail/prices?productName=Azure%20Phi%20Models) | API (JSON) |

## Approach

Hardcoded model data and pricing. Model specs from the Azure Phi product page. Model IDs from the GitHub Models API. Pricing from the Azure Retail Prices API, which provides per-SKU pricing for all Azure MaaS models.

## Model Families

- **Phi-4** — Current generation (14B text, 3.8B mini, reasoning variants, multimodal)
- **Phi-3.5** — Previous generation (3.8B mini, MoE, Vision) — **deprecated**
- **Phi-3** — Original generation (14B medium, 7B small, 3.8B mini) — **deprecated**

## Notes

- Pricing is in USD per 1M tokens (Azure MaaS standard, eastus region)
- Phi-4 has 16K context; Phi-4-mini and Phi-3.x have 128K context
- Phi-4-mini-multimodal accepts text+image+audio input
- Phi-3.5-Vision accepts text+image input
- Phi-4-reasoning and Phi-4-mini-reasoning support extended thinking
- Phi models are also available for free through GitHub Models (rate-limited)
- Phi-3 and Phi-3.5 series are deprecated; superseded by Phi-4
- Microsoft also produces MAI-DS-R1 (DeepSeek distill) but it's not a Phi model
