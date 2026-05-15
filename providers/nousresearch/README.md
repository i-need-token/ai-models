# Nous Research

Nous Research produces the Hermes family of fine-tuned open-weight models, built on Llama and Mixtral base models with DPO/RLHF alignment for agentic capabilities, tool use, and structured outputs.

## Data Sources

| Data                  | Source                                                                         | Method     |
| --------------------- | ------------------------------------------------------------------------------ | ---------- |
| Model specs & pricing | [OpenRouter API](https://openrouter.ai/api/v1/models) (nousresearch/\* models) | API (JSON) |
| Model descriptions    | OpenRouter model descriptions                                                  | API        |

## Approach

Hardcoded model data and pricing. Nous Research's website does not expose a public model API. Data sourced from OpenRouter which mirrors Nous Research's specifications.

## Model Families

- **Hermes 4 Llama 3.1 405B** — Flagship reasoning model with hybrid reasoning mode ($3.00/$15.00 per mtok)
- **Hermes 4 Llama 3.1 70B** — Balanced reasoning model ($0.60/$2.40 per mtok)
- **Hermes 4 Llama 3.1 8B** — Lightweight reasoning model ($0.06/$0.12 per mtok)
- **Hermes 3 Llama 3.1 405B** — Previous gen flagship (deprecated) ($3.00/$15.00 per mtok)
- **Hermes 3 Llama 3.1 70B** — Previous gen balanced (deprecated) ($0.60/$2.40 per mtok)
- **Hermes 3 Llama 3.1 8B** — Previous gen lightweight (deprecated) ($0.06/$0.12 per mtok)
- **Nous Hermes 2 Mixtral 8x7B DPO** — Legacy MoE model (deprecated) ($0.30/$1.10 per mtok)

## Notes

- All Hermes models are open-weight (based on Llama/Mixtral)
- Hermes 4 introduces hybrid reasoning mode (model chooses to deliberate or respond directly)
- Hermes 3 models are deprecated in favor of Hermes 4
- All models support tool calling and structured outputs
- Pricing in USD per 1M tokens (from OpenRouter)
