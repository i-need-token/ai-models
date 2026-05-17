# Qiniu AI

Qiniu AI (七牛云 AI 大模型推理) is an inference platform by Qiniu Cloud
offering serverless model APIs with per-token CNY pricing.

## Data Sources

| Data             | Source                                                  | Access Method            |
| ---------------- | ------------------------------------------------------- | ------------------------ |
| Model list & IDs | [API models endpoint](https://api.qnaigc.com/v1/models) | Public API (58 models)   |
| Pricing          | [Model catalog page](https://qiniu.com/ai/models)       | Browser-scraped SSR HTML |

## Notes

- Qiniu AI provides serverless inference for models from DeepSeek, MoonshotAI,
  ZhipuAI (Z-AI), MiniMax, Xiaomi, Bytedance (Doubao), Alibaba (Qwen), NVIDIA,
  Meituan, and Tencent.
- API is OpenAI-compatible at `https://api.qnaigc.com/v1`.
- Anthropic-compatible API at `https://api.qnaigc.com`.
- Pricing is in CNY per K tokens on the website; converted to CNY per M tokens
  (multiply by 1000) for our catalog.
- Model IDs use `provider/model` format (e.g., `deepseek/deepseek-v4-pro`).
  In YAML filenames and `id` fields, `/` is flattened to `--`.
- Some models on the website show "更多 X 个价格" (more X prices) indicating
  tiered pricing; we use the primary (short context) rate as default.
- Models marked "已退役" (retired) on the website are included with
  `deprecated: true`.
- Models marked "免费" (free) or "限时免费" (limited time free) use FreePricing.
- Models in the API but without pricing on the website are skipped per project
  rule (never fabricate missing data). This includes: `glm-4.5-air`,
  `deepseek/deepseek-v3.2-speciale-or`.
- Models on the website but not in the API are also skipped (no verified model
  IDs). This includes: Doubao Seed 2.0 series, Minimax M2.5 Highspeed,
  Qwen3.5 35B A3B, gpt-oss-120b (website name differs from API).
- Qwen3.5-Plus and Qwen3.6-Plus are skipped because the website pricing format
  shows output and cache_read first but doesn't clearly show the input price.
