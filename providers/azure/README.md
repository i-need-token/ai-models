# Azure OpenAI Service

Inference platform hosting OpenAI models (GPT, o-series) on Microsoft Azure.

## Data Sources

- **Pricing**: Azure OpenAI pricing page (https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/) — Global standard deployment, per-1M-token USD pricing
- **Context lengths**: OpenAI documentation + Azure OpenAI documentation
- **Capabilities**: OpenAI documentation

## Notes

- Pricing is for **Global standard deployment** (default on-demand)
- Data Zone and Regional deployments have different pricing (not included)
- Prompt caching (cache_read) pricing is available for most models
- Azure OpenAI only hosts OpenAI models; non-OpenAI models are in Azure AI Foundry (separate service)
- GPT-OSS models are open-weight models hosted by OpenAI
