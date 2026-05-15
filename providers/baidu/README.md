# Baidu

Baidu is a leading Chinese AI company that produces the ERNIE (文心) family of large language models, available through the Baidu Qianfan platform.

## Data Sources

| Data                                       | Source                                                                  | Method     |
| ------------------------------------------ | ----------------------------------------------------------------------- | ---------- |
| ERNIE model specs & pricing                | [OpenRouter API](https://openrouter.ai/api/v1/models) (baidu/\* models) | API (JSON) |
| CoBuddy & Qianfan-OCR-Fast specs & pricing | [Baidu Qianfan API](https://qianfan.baidubce.com/v1/models)             | API (JSON) |

## Approach

Hardcoded model data and pricing. Baidu's own documentation (cloud.baidu.com) is CSR and geo-blocked from CLI. The Qianfan API only returns 2 of Baidu's own models (cobuddy, qianfan-ocr-fast). ERNIE model data sourced from OpenRouter which mirrors Baidu's specifications.

## Model Families

- **ERNIE 4.5 21B A3B** — Lightweight MoE (21B total, 3B active), text-only ($0.07/$0.28 per mtok)
- **ERNIE 4.5 21B A3B Thinking** — Reasoning variant of 21B MoE ($0.07/$0.28 per mtok, 65K output)
- **ERNIE 4.5 300B A47B** — Flagship text MoE (300B total, 47B active) ($0.28/$1.10 per mtok)
- **ERNIE 4.5 VL 28B A3B** — Multimodal MoE (28B total, 3B active), text+image ($0.14/$0.56 per mtok)
- **ERNIE 4.5 VL 424B A47B** — Flagship multimodal MoE (424B total, 47B active) ($0.42/$1.25 per mtok)
- **CoBuddy** — Free code generation model optimized for coding and Agent workflows
- **Qianfan OCR Fast** — Domain-specific OCR model, text+image input ($0.68/$2.81 per mtok)

## Notes

- ERNIE 4.5 series uses Mixture-of-Experts architecture with modality-isolated routing
- All ERNIE 4.5 models support tool calling
- ERNIE 4.5 21B A3B Thinking is the reasoning/extended thinking variant
- VL models support image input (multimodal)
- CoBuddy is free to use (Baidu's code generation model)
- Qianfan OCR Fast is specialized for OCR tasks
- Pricing in USD per 1M tokens (from OpenRouter)
- Baidu's own pricing is in CNY on the Qianfan platform
