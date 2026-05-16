# GMI Cloud

GMI Cloud is a GPU cloud and inference platform offering serverless LLM inference
with per-token USD pricing.

## Data Sources

| Data       | Source                                                                     | Access Method          |
| ---------- | -------------------------------------------------------------------------- | ---------------------- |
| Model list | [LLM Models docs](https://docs.gmicloud.ai/llm-models.md)                  | Public docs (Mintlify) |
| Pricing    | [Pricing docs](https://docs.gmicloud.ai/inference-engine/billing/price.md) | Public docs (Mintlify) |
| Model IDs  | [LLM Models docs](https://docs.gmicloud.ai/llm-models.md)                  | Public docs (Mintlify) |

## Notes

- GMI Cloud hosts models from other providers (DeepSeek, ZAI/ZhipuAI, Qwen, Meta,
  MoonshotAI, OpenAI) with its own per-token USD pricing.
- The docs model list has 88 LLM models, but only 30 have pricing data in the docs.
- One model (DeepSeek R1 Distill Qwen 1.5B) has $0.00/$0.00 pricing (free) and is
  excluded from this catalog.
- Context lengths are cross-referenced with other providers in this catalog.
- The API requires authentication; model IDs are taken from the docs model list.
- Model IDs use `--` as separator (flattened from `/` in the original IDs like
  `deepseek-ai/DeepSeek-R1`).
