# Arcee AI

Arcee AI produces fine-tuned and original model families including Trinity (MoE), Virtuoso, Maestro, Spotlight, and Coder, focused on enterprise and domain-specific applications.

## Data Sources

| Data                  | Source                                                                     | Method     |
| --------------------- | -------------------------------------------------------------------------- | ---------- |
| Model specs & pricing | [OpenRouter API](https://openrouter.ai/api/v1/models) (arcee-ai/\* models) | API (JSON) |
| Model descriptions    | OpenRouter model descriptions                                              | API        |

## Approach

Hardcoded model data and pricing. The arcee.ai website and API are unreachable from this network. Data sourced from OpenRouter which mirrors Arcee's specifications.

## Model Families

- **Trinity Large Preview** — 400B MoE (13B active), open-weight ($0.15/$0.45 per mtok)
- **Trinity Large Thinking** — Reasoning variant, 400B MoE ($0.22/$0.85 per mtok, 262K context/output)
- **Trinity Mini** — 26B MoE (3B active), efficient ($0.04/$0.15 per mtok, 131K context/output)
- **Virtuoso Large** — 72B general-purpose ($0.75/$1.20 per mtok)
- **Maestro Reasoning** — 32B step-by-step analysis ($0.90/$3.30 per mtok)
- **Spotlight** — 7B vision-language model ($0.18/$0.18 per mtok)
- **Coder Large** — 32B code generation ($0.50/$0.80 per mtok)

## Notes

- Trinity models use sparse MoE architecture (original Arcee design)
- Trinity Large Thinking supports extended reasoning with 262K token output
- Trinity Mini is extremely cost-effective ($0.04/$0.15 per mtok)
- Spotlight is a vision-language model derived from Qwen 2.5-VL
- Maestro Reasoning is tuned with DPO and chain-of-thought RL
- Coder Large is trained on permissively-licensed code data
- All pricing in USD per 1M tokens (from OpenRouter)
