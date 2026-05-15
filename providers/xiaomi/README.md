# Xiaomi

Xiaomi is a Chinese technology company that produces the MiMo (Mi Model) family of AI models, optimized for agentic scenarios.

## Data Sources

| Data                  | Source                                                | Method     |
| --------------------- | ----------------------------------------------------- | ---------- |
| Model specs & pricing | [OpenRouter API](https://openrouter.ai/api/v1/models) | API (JSON) |
| Model descriptions    | OpenRouter model descriptions                         | API        |

## Approach

Hardcoded model data and pricing. Xiaomi's own API (api.xiaomi.ai) and documentation site (xiaomi.ai) are unreachable from this network. Data sourced from OpenRouter which mirrors Xiaomi's model specifications and pricing.

## Model Families

- **MiMo V2 Flash** — Lightweight MoE model (309B total, 15B active), cost-effective text-only ($0.10/$0.30 per mtok)
- **MiMo V2 Omni** — Omni-modal model processing image, video, and audio inputs ($0.40/$2.00 per mtok)
- **MiMo V2 Pro** — Flagship agentic model with 1T parameters and 1M context ($1.00/$3.00 per mtok)
- **MiMo V2.5** — Next-gen omnimodal model at half the cost of Pro ($0.40/$2.00 per mtok, 1M context)
- **MiMo V2.5 Pro** — Latest flagship for complex agentic tasks ($1.00/$3.00 per mtok)

## Notes

- Xiaomi's own API and docs are unreachable from this network
- All pricing in USD per 1M tokens (from OpenRouter)
- MiMo models are open-weight (available on HuggingFace)
- MiMo V2 Pro and V2.5 Pro support reasoning/extended thinking
- MiMo V2 Omni and V2.5 support multimodal inputs (image, video, audio)
- MiMo V2.5 Pro has a relatively small max output (16K tokens) compared to V2 Pro (131K)
