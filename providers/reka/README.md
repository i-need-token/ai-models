# Reka AI

Reka AI produces multimodal AI models with native vision capabilities, including image and video understanding.

## Data Sources

| Data                  | Source                                                                   | Method     |
| --------------------- | ------------------------------------------------------------------------ | ---------- |
| Model specs & pricing | [OpenRouter API](https://openrouter.ai/api/v1/models) (rekaai/\* models) | API (JSON) |
| Model descriptions    | OpenRouter model descriptions                                            | API        |

## Approach

Hardcoded model data and pricing. Reka AI's API requires authentication. Data sourced from OpenRouter which mirrors Reka's specifications.

## Model Families

- **Reka Flash 3** — 21B MoE multimodal model for general chat, coding, and tool use ($0.10/$0.40 per mtok)
- **Reka Edge 2** — 7B lightweight multimodal model for edge deployment ($0.03/$0.10 per mtok)

## Notes

- Both models support image input (multimodal)
- Reka Flash 3 supports tool calling and structured outputs
- Reka Edge 2 is open-weight and optimized for edge deployment
- Pricing in USD per 1M tokens (from OpenRouter)
