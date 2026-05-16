# Google Vertex AI

Inference platform hosting models from multiple providers (Google, Anthropic, xAI, DeepSeek, MiniMax, Moonshot AI, Qwen, GLM, OpenAI, Meta, Mistral).

## Data Sources

- **Pricing**: Google Vertex AI pricing page (https://cloud.google.com/vertex-ai/generative-ai/pricing) — Global standard deployment, per-1M-token USD pricing
- **Context lengths**: Original provider documentation
- **Capabilities**: Original provider documentation

## Notes

- Pricing is for the **Global standard deployment** tier
- Vertex AI also offers Priority and Flex/Batch tiers with different pricing
- Non-global (regional) deployment has ~10% higher pricing
- Context lengths >200K tokens trigger long-context pricing (2x input rate) for some models
- Image/video/audio generation models (Imagen, Veo, Lyria) are excluded
- Embedding models are excluded
- Deprecated Claude models (3 Haiku, 3.5 Haiku, 3.7 Sonnet) are excluded
- Mistral OCR is excluded (per-page pricing, not per-token)
