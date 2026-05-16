# Hyperbolic

Hyperbolic is an open-access AI cloud providing serverless inference for
open-source models with per-token USD pricing.

## Data Sources

| Data                 | Source                                                | Access Method               |
| -------------------- | ----------------------------------------------------- | --------------------------- |
| Model list & pricing | [Inference page](https://www.hyperbolic.ai/inference) | SSR HTML (browser-verified) |
| Model IDs            | Inference page + known model names                    | Derived from page content   |

## Notes

- Hyperbolic provides serverless inference for open-source models via an
  OpenAI-compatible API at `https://api.hyperbolic.xyz/v1`.
- The public inference page lists 11 text-to-text models with per-token pricing.
- The app dashboard (requires login) shows 25+ models including newer models
  (Qwen3-Coder-480B, DeepSeek-R1-0528, etc.), but those require authentication.
- Pricing is a single flat rate per M tokens (same rate for input and output).
- Model IDs use `--` as separator (flattened from `/` in original IDs).
- All models are open-source/open-weights.
