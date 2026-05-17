# AIHubMix

AIHubMix is an inference platform and model router that provides unified API access to models from 30+ providers with per-token USD pricing.

## Data Sources

- **Model list & pricing**: [AIHubMix pagination API](https://aihubmix.com/call/mdl_info_pagination) (public, no auth required)
- **Context lengths**: API metadata `context_window` field
- **Modalities**: API metadata `modalities` field
- **Features**: API metadata `features` field

## Notes

- AIHubMix is a **router/aggregator**, not a model producer. It hosts models from other providers with its own pricing.
- Pricing shown is AIHubMix's per-1M-token rate in USD.
- Pricing is computed from `model_ratio` (input price) and `completion_ratio` (output/input multiplier).
- Some models have prompt caching pricing (`cache_read`/`cache_write`), derived from `billing_config` tier ratios.
- Model IDs use `--` instead of `/` to avoid filesystem issues.
- Free variants (`model_ratio=0`), embedding/rerank/image/audio/video models, and routing variants are excluded.
- Tiered pricing models use tier1 (short context) rates.
- Models with `coding-`, `cc-`, `aihubmix-`, `alicloud-`, `azure-` prefixes are routing variants and excluded.
