**English** | [中文](./zh/free-models.md)

# Free AI Models

81 models in this catalog are free to use. This page lists them by capability so you can find the right free model for your project.

> All data sourced from first-party APIs and documentation. Free tiers may have rate limits — check the provider's website for details.

## Quick Stats

| Capability                | Free Models |
| ------------------------- | ----------: |
| Total free models         |          81 |
| With tool calling         |          45 |
| With reasoning            |          11 |
| With vision (image input) |          17 |

## Free Models with Tool Calling

These models support function/tool calling at no cost — ideal for building AI agents and automation:

| Model                          | Provider | Context | Vision |
| ------------------------------ | -------- | ------- | ------ |
| gemini-2.0-flash               | Google   | 1M      | ✅     |
| gemini-2.5-flash-preview-05-20 | Google   | 1M      | ✅     |
| gemma-3-27b-it                 | Chutes   | 128K    | ✅     |
| qwen3-235b-a22b                | Chutes   | 128K    | ✅     |
| qwen3-30b-a3b                  | Chutes   | 128K    | ✅     |
| qwen3-4b                       | Chutes   | 128K    | ✅     |
| deepseek-r1                    | Chutes   | 128K    | ❌     |
| deepseek-v3-0324               | Chutes   | 128K    | ❌     |
| llama-4-maverick               | Chutes   | 1M      | ✅     |
| llama-4-scout                  | Chutes   | 10M     | ✅     |
| llama-3.3-70b-instruct         | Chutes   | 128K    | ❌     |
| qwen2.5-72b-instruct           | Chutes   | 128K    | ❌     |
| mistral-small-3.1-24b-instruct | Chutes   | 128K    | ✅     |
| phi-4                          | Chutes   | 16K     | ❌     |
| command-r                      | Chutes   | 128K    | ❌     |

## Free Models with Reasoning

These models support chain-of-thought reasoning at no cost:

| Model                          | Provider | Context |
| ------------------------------ | -------- | ------- |
| gemini-2.5-flash-preview-05-20 | Google   | 1M      |
| deepseek-r1                    | Chutes   | 128K    |
| deepseek-r1-0528               | Chutes   | 128K    |
| qwen3-235b-a22b                | Chutes   | 128K    |
| qwen3-30b-a3b                  | Chutes   | 128K    |
| qwen3-4b                       | Chutes   | 128K    |
| gemma-3-27b-it                 | Chutes   | 128K    |
| phi-4-reasoning                | Chutes   | 32K     |

## Free Models with Vision

These models accept image input at no cost:

| Model                          | Provider | Context |
| ------------------------------ | -------- | ------- |
| gemini-2.0-flash               | Google   | 1M      |
| gemini-2.5-flash-preview-05-20 | Google   | 1M      |
| gemma-3-27b-it                 | Chutes   | 128K    |
| qwen3-235b-a22b                | Chutes   | 128K    |
| llama-4-maverick               | Chutes   | 1M      |
| llama-4-scout                  | Chutes   | 10M     |
| mistral-small-3.1-24b-instruct | Chutes   | 128K    |

## Free Models by Provider

### Google (via AI Studio)

Google offers free access to Gemini models through AI Studio with rate limits:

- gemini-2.0-flash — 1M context, tool calling, vision, reasoning
- gemini-2.5-flash-preview-05-20 — 1M context, tool calling, vision, reasoning

### Chutes

Chutes provides free community-hosted inference for open-weight models:

- 70+ free models including Llama 4, Qwen3, DeepSeek-R1, Gemma 3, Mistral, Phi-4
- Largest free model: Llama 4 Scout (10M context)
- Best free reasoning: DeepSeek-R1, Qwen3-235B-A22B

### Cloudflare Workers AI

Cloudflare offers free inference on edge for select models:

- Various small and medium models with rate limits
- Edge deployment for low latency

### Cerebras

Cerebras offers free tier for some models with rate limits:

- Fast inference using CS-3 wafer-scale engine

### Groq

Groq offers free tier for some models with rate limits:

- Ultra-fast inference using LPU acceleration

## Key Takeaways

- **Google AI Studio** offers the best free models overall — 1M context, tool calling, vision, and reasoning
- **Chutes** has the largest selection of free models — 70+ including all major open-weight models
- **Llama 4 Scout** on Chutes offers the largest free context window at 10M tokens
- Free tiers typically have rate limits (requests per minute) — check provider docs for specifics
- For production use, consider upgrading to paid tiers for reliability and higher rate limits

## Related Documentation

- [Model Selection Guide](model-selection.md) — decision framework for choosing models
- [Open-Weight Models](open-weights.md) — 527 models you can run yourself
- [Cached Pricing](cached-pricing.md) — 1,374 models with prompt caching
- [Tool Calling Models](tool-calling.md) — 2,350 models with tool calling
- [Reasoning Models](reasoning-models.md) — 1,306 models with reasoning

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
