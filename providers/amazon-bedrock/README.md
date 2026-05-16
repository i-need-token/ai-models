# Amazon Bedrock

Inference platform hosting models from multiple providers (Anthropic, Meta, Mistral, Amazon, DeepSeek, Google, NVIDIA, Qwen, Moonshot AI, Z AI, MiniMax AI, OpenAI, Writer).

## Data Sources

- **Pricing**: AWS Pricing API (`https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/index.json`) — standard on-demand tier, us-east-1 region, per-1M-token USD pricing
- **Context lengths**: Original provider documentation (Anthropic, Meta, Mistral, Amazon, etc.)
- **Capabilities**: Original provider documentation

## Notes

- Pricing is for the **standard on-demand tier** in **us-east-1** region
- Bedrock also offers priority, flex, and batch tiers with different pricing
- Prompt caching (cache_read) pricing is available for Amazon Nova models
- Claude models (3.5 Sonnet, 4 Opus, etc.) are "extended access" models with separate pricing not included in the AWS Pricing API
- Non-text models (Nova Canvas, Nova Reel, Nova Sonic, Nova 2.0 Omni) are excluded
- Deprecated Claude models (2.0, 2.1, 3 Sonnet, Instant) are excluded due to missing output pricing in the API
