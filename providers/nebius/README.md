# Nebius Token Factory

Inference platform hosting open-source models from DeepSeek, NVIDIA, Z.AI/ZhipuAI, Qwen/Alibaba, Meta, Google, OpenAI (GPT-OSS), Minimax, NousResearch, Prime Intellect, Mistral with per-token USD pricing.

## Data Source

- **Model catalog + pricing**: https://tokenfactory.nebius.com/models (browser-scraped, first-party, no auth required)
- **API format**: OpenAI-compatible (https://api.tokenfactory.nebius.com/v1/)
- **API docs**: https://docs.tokenfactory.nebius.com

## Model Selection

- Only text-to-text and vision models included (embedding model excluded)
- 23 models from 9 providers: DeepSeek, NVIDIA, Z.AI, MiniMax, Qwen, NousResearch, OpenAI, Prime Intellect, Google, Meta
- Base flavor pricing only (Fast flavor has different pricing, append "-fast" to model name)

## Pricing

- Per-1M-token USD values from the Nebius Token Factory catalog page
- All models are open-source/open-weight models
- Nebius offers two flavors: Base (standard) and Fast (lower latency, higher price)

## Features

- **Reasoning**: Most models support reasoning/thinking mode
- **Tool call**: DeepSeek-V4-Pro, Nemotron-3-Nano-Omni, GLM-5.1, MiniMax-M2.5, Qwen3.5-397B-A17B, GLM-5, DeepSeek-V3.2, gpt-oss-120b, INTELLECT-3, Qwen3 series, Gemma-3-27b-it, Nemotron models, Llama-3.3-70B-Instruct
- **Vision**: Qwen2.5-VL-72B-Instruct, Nemotron-3-Nano-Omni, Qwen3.5-397B-A17B, GLM-5.1, MiniMax-M2.5, Gemma-3-27b-it
- **Structured output**: Most models support JSON/structured output

## Notes

- Nebius Token Factory is a European cloud provider (Netherlands-based)
- API requires authentication (Bearer token), but the model catalog page is public
- Model IDs use display names from the Nebius website (not the API format with "/" separator)
- Nebius also offers dedicated endpoints with provisioned throughput (not included)
- Context lengths are from the models original provider docs (verified first-party)
