# Tencent Hunyuan

Tencent Hunyuan (混元) is Tencent's family of large language models, covering text, vision, video, translation, and embedding capabilities.

## Data Sources

| Data          | Source                                                                                                   | Method                            |
| ------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Model details | [cloud.tencent.com/document/product/1729/104753](https://cloud.tencent.com/document/product/1729/104753) | CSR (browser)                     |
| Pricing       | [cloud.tencent.com/document/product/1729/97731](https://cloud.tencent.com/document/product/1729/97731)   | CSR (browser)                     |
| API           | `https://api.hunyuan.cloud.tencent.com/v1`                                                               | OpenAI-compatible (requires auth) |

## Approach

Hardcoded model data and pricing. Tencent Cloud docs are CSR with Chinese content. All data gathered via browser.

## Model Families

- **Hunyuan** — Chat LLMs (HY 2.0 Think/Instruct, T1, TurboS, A13B, Lite, Role)
- **Hunyuan Vision** — Vision models (Vision 1.5, TurboS Vision, T1 Vision, Video)
- **Hunyuan Embedding** — Embedding model
- **Hunyuan Translation** — Translation models (standard + lite)

## Notes

- Pricing is in Chinese Yuan (CNY) per 1M tokens
- HY 2.0 models have tiered pricing based on input length (0-32K vs 32K-128K); we use the lower tier
- Hunyuan Lite is free to use
- Hunyuan A13B is open-weight (80B total, 13B active, MoE)
- Hunyuan T1 is a reasoning model (Hybrid-Transformer-Mamba architecture)
- Hunyuan is being migrated to TokenHub platform
- Free tier: 1M tokens shared across all models for new users
