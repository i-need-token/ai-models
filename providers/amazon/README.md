# Amazon Nova

Amazon Nova is Amazon's family of foundation models, available through Amazon Bedrock. They cover text, image, video, audio, and speech modalities.

## Data Sources

| Data        | Source                                                                                                           | Method     |
| ----------- | ---------------------------------------------------------------------------------------------------------------- | ---------- |
| Model specs | [docs.aws.amazon.com/nova/latest/userguide](https://docs.aws.amazon.com/nova/latest/userguide/what-is-nova.html) | SSR        |
| Pricing     | [AWS Price List API](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/index.json)   | API (JSON) |

## Approach

Hardcoded model data and pricing. Model specs from AWS Nova documentation (SSR). Pricing from the AWS Price List Service API, which is a first-party JSON endpoint providing per-SKU pricing for all Bedrock models.

## Model Families

- **Nova v1** — Understanding models (Premier, Pro, Lite, Micro)
- **Nova 2.0** — Next-generation models (Pro, Lite, Omni)

## Notes

- Pricing is in USD per 1M tokens (standard on-demand, us-east-1 region)
- Nova Premier has 1M context window — the largest of any Nova model
- Nova Micro is text-only; all other understanding models accept text+image+video
- Nova 2.0 Omni supports multimodal generation (text+image output)
- Nova 2.0 models have extended thinking/reasoning capability
- Nova Canvas (image generation) and Nova Reel (video generation) are not included — they use per-image/per-video pricing, not token pricing
- Nova Sonic (speech-to-speech) is not included — it uses per-second pricing
- Amazon Bedrock also offers cross-region inference, flex pricing, and priority pricing tiers; we use standard on-demand pricing
