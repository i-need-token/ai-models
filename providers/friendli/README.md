# FriendliAI

Inference platform hosting models from other providers (Meta, Qwen/Alibaba, Zhipu AI, MiniMax, DeepSeek, LG AI EXAONE) with per-token USD pricing.

## Data Source

- **Model list & pricing**: `https://api.friendli.ai/serverless/v1/models` (OpenAI-compatible API, no auth required)
- **Pricing**: `input`/`output` fields = USD per million tokens
- **Cache read pricing**: `input_cache_read` field (USD per million tokens)
- **Context lengths**: `context_length` and `max_completion_tokens` from API
- **Features**: `functionality` object (tool_call, structured_output, parallel_tool_call, builtin_tool)

## Notes

- Model IDs use `--` instead of `/` to avoid filesystem issues (API returns `provider/model` format)
- 8 models from 6 providers
- Dynamic scrape — fetches from API on each sync run
- FriendliAI also offers dedicated endpoints (GPU rental) and container deployment
