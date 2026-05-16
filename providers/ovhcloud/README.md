# OVHcloud AI Endpoints

European inference platform hosting open-source models from Meta, Mistral, Qwen/Alibaba, OpenAI (GPT-OSS), and BAAI with per-token USD pricing.

## Data Source

- **Model list + pricing**: `https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/models` (first-party, no auth required)
- **API format**: OpenAI-compatible (`/v1/chat/completions`, `/v1/embeddings`)

## Model Selection

- Only chat/text models included (embedding, image generation, speech, and guard models excluded)
- `ppl` model excluded (perplexity special model)
- Models with zero pricing excluded (guard models, etc.)

## Pricing

- API returns per-token USD values; converted to per-million-token (× 1e6)
- `input_cache_reads` and `input_cache_writes` fields available but not included (cache pricing)
- Rounding: `Math.round(value * 1e6) / 1e6` to avoid floating-point noise

## Features

- **Reasoning**: Qwen3-32B, Qwen3-Coder-30B-A3B-Instruct, Qwen3.5-9B, gpt-oss-120b, gpt-oss-20b
- **Tool call**: Mistral-Small-3.2-24B-Instruct-2506, gpt-oss-120b, gpt-oss-20b, Qwen3-Coder-30B-A3B-Instruct, Qwen3.5-9B, Qwen3-32B
- **Vision**: Qwen2.5-VL-72B-Instruct
- **Structured output**: Mistral-Small-3.2-24B-Instruct-2506, gpt-oss-120b, gpt-oss-20b, Qwen3-Coder-30B-A3B-Instruct, Qwen3.5-9B, Qwen3-32B

## Notes

- OVHcloud is a French cloud provider; data hosted in Europe (GDPR compliance)
- AI Endpoints offer "Base" (no commitment) and "Fast" (with commitment) tiers; pricing shown is for Base tier
- `gpt-oss` models are OpenAI's open-source models hosted by OVHcloud
