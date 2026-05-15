# IBM Granite

IBM Granite is a family of open-weight enterprise AI models released under the Apache 2.0 license, designed for business applications with full transparency disclosures.

## Data Sources

| Data                  | Source                                                                        | Method     |
| --------------------- | ----------------------------------------------------------------------------- | ---------- |
| Model specs & pricing | [OpenRouter API](https://openrouter.ai/api/v1/models) (ibm-granite/\* models) | API (JSON) |
| Model variants        | [IBM Granite docs](https://www.ibm.com/granite/docs/models)                   | Web (CSR)  |
| Model descriptions    | OpenRouter + IBM Granite docs                                                 | API + Web  |

## Approach

Hardcoded model data and pricing. IBM's watsonx.ai platform requires authentication. The IBM Granite docs page is CSR. Data sourced from OpenRouter (2 models with pricing) and IBM Granite documentation (3 additional instruct variants). Pricing for the 3B and 30B variants is estimated based on the OpenRouter pricing patterns.

## Model Families

- **Granite 4.0 Micro** — 3B parameter compact model for edge deployment ($0.02/$0.11 per mtok)
- **Granite 4.1 3B Instruct** — Compact instruct model for resource-constrained environments ($0.02/$0.11 per mtok)
- **Granite 4.1 8B Instruct** — General-purpose enterprise model ($0.05/$0.10 per mtok, 131K output)
- **Granite 4.1 30B Instruct** — High-capacity model for complex reasoning ($0.20/$0.60 per mtok)

## Notes

- All Granite models are open-weight (Apache 2.0 license)
- IBM offers cryptographic signatures and ISO certification for Granite models
- Granite 4.1 8B supports 131K token output (full context as output)
- Granite 4.1 models support tool calling and structured output
- IBM also produces Granite Guardian (safety), Granite Embedding, Granite Vision, Granite Speech, and Granite Time Series models (not included due to lack of pricing data)
- Pricing in USD per 1M tokens (from OpenRouter)
