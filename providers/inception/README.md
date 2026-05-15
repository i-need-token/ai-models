# Inception Labs

Inception Labs produces the Mercury family of diffusion large language models (dLLMs). Unlike traditional autoregressive LLMs, Mercury models use discrete diffusion to generate and refine multiple tokens in parallel, achieving 5-10x speed improvement over comparable models.

## Data Sources

| Data                  | Source                                                       | Method     |
| --------------------- | ------------------------------------------------------------ | ---------- |
| Model specs & pricing | [Inception Labs API](https://api.inceptionlabs.ai/v1/models) | API (JSON) |

## Approach

Hardcoded model data and pricing from the Inception Labs API (`api.inceptionlabs.ai/v1/models`). The API returns complete model specifications including context length, max output, pricing, modalities, and supported features.

## Model Families

- **Mercury** — Original dLLM, 128K context, 32K output, supports tools/JSON/structured outputs ($0.25/$0.75 per mtok)
- **Mercury 2** — Reasoning dLLM, 128K context, 50K output, supports tools/JSON/structured outputs ($0.25/$0.75 per mtok)
- **Mercury Coder** — Code-optimized dLLM, 128K context, 32K output, supports tools/JSON/structured outputs ($0.25/$0.75 per mtok)
- **Mercury Edit** — Code editing dLLM, 128K context, 32K output ($0.25/$0.75 per mtok)
- **Mercury Edit 2** — Next-gen code editing dLLM, 128K context, 32K output ($0.25/$0.75 per mtok)

## Notes

- All Mercury models use discrete diffusion architecture (dLLM), not autoregressive
- All models share the same pricing: $0.25/$0.75 per 1M tokens
- Prompt caching available at $0.025 per 1M tokens for cache reads
- Mercury 2 is the reasoning variant (supports extended thinking)
- Mercury Coder is optimized for code generation tasks
- Mercury Edit / Edit 2 are specialized for code editing (no tool calling)
- API is OpenAI-compatible at `api.inceptionlabs.ai/v1`
