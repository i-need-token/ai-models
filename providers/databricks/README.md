# Databricks

Major data and AI platform offering Foundation Model APIs with Pay-Per-Token pricing.

## Data Source

- Open model pricing: https://www.databricks.com/product/pricing/foundation-model-serving
- Proprietary model pricing: https://www.databricks.com/product/pricing/proprietary-foundation-model-serving

## Pricing

All prices are in USD per million tokens, converted from DBU (Databricks Units) using the Premium tier rate of $0.07/DBU on AWS.

## Notes

- Databricks Foundation Model APIs offer both open-source and proprietary models
- Pricing is in DBU (Databricks Units), converted to USD at $0.07/DBU (Premium tier, AWS)
- Global endpoint pricing used (In-geo pricing is ~10% higher)
- Open models: Llama, Qwen, Gemma, GPT OSS
- Proprietary models: OpenAI (GPT-5 series), Anthropic (Claude), Google (Gemini)
- Proprietary models include cache_write and cache_read pricing
- Open models do not have cache pricing
- Models without Pay-Per-Token pricing (Llama 3.2 1B/3B) are excluded
- Embedding models are excluded (not text generation)
