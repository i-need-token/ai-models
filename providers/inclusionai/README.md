# InclusionAI

InclusionAI produces the Ling (instant/instruct) and Ring (thinking/reasoning) families of Mixture-of-Experts models, designed for real-world agent workflows.

## Data Sources

| Data                  | Source                                                                        | Method     |
| --------------------- | ----------------------------------------------------------------------------- | ---------- |
| Model specs & pricing | [OpenRouter API](https://openrouter.ai/api/v1/models) (inclusionai/\* models) | API (JSON) |
| Model descriptions    | OpenRouter model descriptions                                                 | API        |

## Approach

Hardcoded model data and pricing. InclusionAI's website (inclusionai.com) and API are unreachable from this network. Data sourced from OpenRouter which mirrors InclusionAI's specifications.

## Model Families

- **Ling 2.6 1T** — Trillion-parameter flagship MoE model for fast agent execution ($0.30/$2.50 per mtok, 262K context)
- **Ling 2.6 Flash** — Lightweight MoE (104B total, 7.4B active), ultra-fast ($0.01/$0.03 per mtok, 262K context)
- **Ring 2.6 1T** — Trillion-parameter thinking/reasoning MoE (1T total, 63B active) ($0.07/$0.62 per mtok, 262K context)

## Notes

- Ling models are instant (instruct) models for fast execution
- Ring models are thinking/reasoning models for complex tasks
- All models use MoE architecture with trillion-parameter scale
- Ling 2.6 Flash is extremely cost-effective ($0.01/$0.03 per mtok)
- Ring 2.6 1T supports extended thinking with 65K max output
- All pricing in USD per 1M tokens (from OpenRouter)
