# SambaNova

Inference platform hosting third-party models with per-token pricing.

## Data Source

- **Model list & pricing**: `https://api.sambanova.ai/v1/models` (OpenAI-compatible API)
- Pricing is per-token in the API response; converted to per-million-token (USD)

## Notes

- SambaNova provides an OpenAI-compatible API endpoint
- 8 models available as of 2026-05-15
- DeepSeek-V3.2 has a 32K context limit (not 128K like other models)
- DeepSeek-V3.1 and V3.2 have limited max_completion_tokens (7168)
- Llama-4-Maverick has limited max_completion_tokens (4096)
- Meta-Llama-3.3-70B has limited max_completion_tokens (3072)
- MiniMax-M2.5 has 163840 context, MiniMax-M2.7 has 196608 context
- Gemma 3 12B IT supports image input (vision model)
