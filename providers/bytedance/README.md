# ByteDance

ByteDance produces the Seed family of AI models through its Seed research team, and the UI-TARS family of GUI agent models. Available through the Volcengine (Ark) platform.

## Data Sources

| Data                  | Source                                                                                        | Method     |
| --------------------- | --------------------------------------------------------------------------------------------- | ---------- |
| Model specs & pricing | [OpenRouter API](https://openrouter.ai/api/v1/models) (bytedance-seed/_, bytedance/ui-tars-_) | API (JSON) |
| Model descriptions    | OpenRouter model descriptions                                                                 | API        |

## Approach

Hardcoded model data and pricing. ByteDance's Volcengine/Ark API requires authentication. The seed.bytedance.com website is CSR and not scrapable from CLI. Data sourced from OpenRouter which mirrors ByteDance's model specifications.

## Model Families

- **Seed 1.6** — General-purpose multimodal model with adaptive deep thinking ($0.25/$2.00 per mtok, 262K context)
- **Seed 1.6 Flash** — Ultra-fast multimodal deep thinking model ($0.07/$0.30 per mtok, 262K context)
- **Seed 2.0 Lite** — Cost-efficient enterprise model with multimodal + agent capabilities ($0.25/$2.00 per mtok, 131K output)
- **Seed 2.0 Mini** — Latency-sensitive model with 4 reasoning effort modes ($0.10/$0.40 per mtok, 131K output)
- **UI-TARS 1.5 7B** — GUI agent model for desktop/web/mobile environments ($0.10/$0.20 per mtok)

## Notes

- Seed models support multimodal input (text, image, video)
- Seed 1.6 and 1.6 Flash support adaptive deep thinking (reasoning)
- Seed 2.0 Mini supports 4 reasoning effort modes: minimal/low/medium/high
- UI-TARS is specialized for GUI interaction (desktop, web, mobile, games)
- UI-TARS has a small max output (2048 tokens) as it generates action commands
- All pricing in USD per 1M tokens (from OpenRouter)
- ByteDance's own pricing is in CNY on the Volcengine platform
