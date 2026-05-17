# MoArk AI

## Overview

MoArk AI is a Chinese inference platform offering serverless AI model inference with per-token CNY pricing. It hosts 230+ models across categories including text generation, vision, code, embedding, image generation, video, audio, and industry-specific models.

## Data Sources

| Data       | Source                   | Type                  |
| ---------- | ------------------------ | --------------------- |
| Model list | `api.moark.ai/v1/models` | OpenAI-compatible API |
| Pricing    | `moark.ai/pricing`       | Browser-scraped HTML  |

## Pricing Format

MoArk pricing is listed as "¥X/M tokens or ¥Y/call" — we use the per-token rate.
MoArk bills on "combined input + output tokens", so input = output = listed price.

## Model Categories

### Text Generation (CNY/M tokens)

| Model             | Price (¥/Mtok) | Notes             |
| ----------------- | -------------- | ----------------- |
| DeepSeek-V4-Pro   | ¥8             | Most expensive    |
| Qwen3.6-Max       | ¥28            | Most expensive    |
| Qwen3.6-Plus      | ¥15            | Vision            |
| GLM-5.1           | ¥5             |                   |
| Kimi-K2.6         | ¥3.9           | Vision, reasoning |
| Kimi-K2.5         | ¥3             | Vision, reasoning |
| DeepSeek-R1       | ¥2.15          | Reasoning         |
| GLM-5             | ¥3             |                   |
| Kimi-K2-Thinking  | ¥2.5           | Reasoning         |
| kimi-k2-instruct  | ¥2.29          |                   |
| GLM-4.7           | ¥2.2           |                   |
| ERNIE-4.5-Turbo   | ¥1.1           |                   |
| DeepSeek-V3.2     | ¥1             |                   |
| GLM-4.5           | ¥1             |                   |
| Qwen3.6-27B       | ¥1.2           |                   |
| MiniMax-M2.7      | ¥1.2           |                   |
| DeepSeek-V3.1     | ¥0.95          |                   |
| DeepSeek-V4-Flash | ¥0.5           |                   |
| Qwen3-32B         | ¥0.55          |                   |
| QwQ-32B           | ¥0.55          | Reasoning         |
| gpt-oss-120b      | ¥0.45          |                   |
| DeepSeek-V3.2-Exp | ¥0.4           |                   |
| Qwen3.5-9B        | ¥0.4           | Vision            |
| Qwen3-Coder-Next  | ¥0.3           |                   |
| DeepSeek-V3       | ¥0.9           | Deprecated        |

### Free Models

GLM-4.7-Flash, DeepSeek-R1-Distill-Qwen-1.5B/7B/14B, Qwen3-0.6B/4B/8B, Qwen2-7B-Instruct, internlm3-8b-instruct, gpt-oss-20b, InternVL series, Gemma series, DeepSeek-Prover-V2-7B, and others.

## Notes

- All pricing is in CNY (Chinese Yuan)
- MoArk bills on combined input + output tokens (same rate for both)
- Free models use `{ unit: "free" }` pricing
- Model IDs are flattened: `/`, `:`, `@` → `--`, `()` removed, lowercased
- Many models overlap with existing providers (DeepSeek, Qwen, GLM, Kimi, etc.)
- MoArk offers unique models not in other catalogs: Qwen3.6-Max, Qwen3.6-Plus, ERNIE-4.5-Turbo, ERNIE-X1-Turbo, KAT-Dev, Fin-R1, DianJin-R1-32B, etc.
