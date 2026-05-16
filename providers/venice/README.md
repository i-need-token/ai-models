# Venice AI

Privacy-focused inference platform hosting models from multiple providers (Anthropic, OpenAI, Google, DeepSeek, Qwen/Alibaba, Meta, Mistral, xAI, Moonshot, MiniMax, ZhipuAI/Z.AI, NVIDIA, Arcee, Inception/Mercury, NousResearch) with per-token USD pricing.

## Data Source

- **Model list + pricing + capabilities**: `https://api.venice.ai/api/v1/models` (first-party, no auth required)
- **API format**: OpenAI-compatible (`/v1/chat/completions`)

## Model Selection

- Only text/chat models included (type === "text")
- E2EE (end-to-end encrypted) models excluded (encrypted variants of existing models)
- Offline models excluded
- Models with zero pricing excluded

## Pricing

- API returns per-1M-token USD values directly
- `cache_input` pricing included as `cache_read` when available and non-zero

## Features

- **Reasoning**: Derived from `supportsReasoning` capability in API response
- **Tool call**: Derived from `supportsFunctionCalling` capability
- **Vision**: Derived from `supportsVision` capability
- **Structured output**: Derived from `supportsResponseSchema` capability

## Notes

- Venice AI is a privacy-focused platform; all inference is private (no data retention)
- E2EE models provide end-to-end encryption for sensitive use cases
- Venice hosts some proprietary models (e.g., Claude, GPT, Gemini) alongside open-source ones
- `venice-uncensored` models are Venice's own fine-tuned models
- Model IDs use Venice's own naming convention (e.g., `claude-opus-4-7` not `anthropic/claude-opus-4-7`)
