**English** | [中文](./zh/pricing-comparison.md)

# Pricing Comparison

Side-by-side pricing comparison for AI model inference across providers and platforms. All prices in USD per million tokens, sourced from first-party APIs.

## Direct Provider Pricing

Pricing from the model producer's own API.

### OpenAI

| Model        | Input $/Mtok | Output $/Mtok | Cache Read $/Mtok | Context |
| ------------ | -----------: | ------------: | ----------------: | ------: |
| GPT-4.1 Nano |         0.10 |          0.40 |             0.025 |      1M |
| GPT-4o Mini  |         0.15 |          0.60 |             0.075 |    128K |
| GPT-4.1 Mini |         0.40 |          1.60 |              0.10 |      1M |
| GPT-4.1      |         2.00 |          8.00 |              0.50 |      1M |
| GPT-4o       |         2.50 |         10.00 |              1.25 |    128K |
| o4-mini      |         1.10 |          4.40 |             0.275 |    200K |
| o3           |        10.00 |         40.00 |              2.50 |    200K |

### Anthropic

| Model             | Input $/Mtok | Output $/Mtok | Context |
| ----------------- | -----------: | ------------: | ------: |
| Claude Haiku 4.5  |         1.00 |          5.00 |    200K |
| Claude Sonnet 4.0 |         3.00 |         15.00 |      1M |
| Claude Sonnet 4.5 |         3.00 |         15.00 |      1M |
| Claude Sonnet 4.6 |         3.00 |         15.00 |      1M |
| Claude Opus 4.5   |         5.00 |         25.00 |    200K |
| Claude Opus 4.7   |         5.00 |         25.00 |      1M |

### Google

| Model                 | Input $/Mtok | Output $/Mtok | Cache Read $/Mtok | Context |
| --------------------- | -----------: | ------------: | ----------------: | ------: |
| Gemini 1.5 Flash 8B   |        0.075 |          0.30 |                 — |      1M |
| Gemini 2.0 Flash Lite |        0.075 |          0.30 |                 — |      1M |
| Gemini 2.0 Flash      |         0.10 |          0.40 |                 — |      1M |
| Gemini 2.5 Flash Lite |         0.10 |          0.40 |                 — |      1M |
| Gemini 2.5 Flash      |         0.15 |          3.50 |            0.0375 |      1M |
| Gemini 2.5 Pro        |         1.25 |         10.00 |             0.315 |      1M |

### DeepSeek

| Model             | Input $/Mtok | Output $/Mtok | Cache Read $/Mtok | Context |
| ----------------- | -----------: | ------------: | ----------------: | ------: |
| DeepSeek-V4-Flash |         0.14 |          0.28 |            0.0028 |      1M |
| DeepSeek-V4-Pro   |        0.435 |          0.87 |          0.003625 |      1M |

### xAI

| Model       | Input $/Mtok | Output $/Mtok | Context |
| ----------- | -----------: | ------------: | ------: |
| Grok 4 Fast |         0.20 |          0.50 |    131K |
| Grok 4.1    |         0.20 |          0.50 |    131K |
| Grok 3 Mini |         0.25 |          1.27 |    131K |
| Grok 4.2    |         2.00 |          6.00 |    131K |
| Grok 3      |         3.00 |         15.00 |    131K |
| Grok 4      |         3.00 |         15.00 |    131K |

### Meta (via hosted inference)

| Model            | Input $/Mtok | Output $/Mtok | Context |
| ---------------- | -----------: | ------------: | ------: |
| Llama 3.2 1B     |         0.10 |          0.10 |    128K |
| Llama 4 Scout    |         0.17 |          0.66 |     10M |
| Llama 4 Maverick |         0.24 |          0.97 |      1M |

### Mistral

| Model         | Input $/Mtok | Output $/Mtok | Context |
| ------------- | -----------: | ------------: | ------: |
| Ministral 3B  |         0.04 |          0.04 |    128K |
| Ministral 8B  |         0.10 |          0.10 |    128K |
| Mistral Small |         0.20 |          0.60 |    128K |
| Mistral Large |         2.00 |          6.00 |    128K |

## Cross-Platform Price Comparison

Same model on different inference platforms — prices can vary significantly.

### Llama 4 Scout (10M context)

| Platform      | Input $/Mtok | Output $/Mtok |
| ------------- | -----------: | ------------: |
| AIHubMix      |        0.061 |         0.183 |
| Auriko        |         0.08 |          0.30 |
| DeepInfra     |         0.08 |          0.30 |
| Kluster AI    |         0.08 |          0.45 |
| Meta (direct) |         0.17 |          0.66 |

### Llama 4 Maverick (1M context)

| Platform        | Input $/Mtok | Output $/Mtok |
| --------------- | -----------: | ------------: |
| AIHubMix        |         0.10 |          0.10 |
| 接口 AI         |         0.10 |          0.50 |
| AIHubMix (Groq) |         0.11 |          0.33 |
| Cortecs         |        0.124 |         0.603 |
| Auriko          |         0.15 |          0.60 |
| Meta (direct)   |         0.24 |          0.97 |

## Cheapest Models Overall

The absolute cheapest per-token models across all providers.

| Model               | Provider | Input $/Mtok | Output $/Mtok | Context |
| ------------------- | -------- | -----------: | ------------: | ------: |
| Ministral 3B        | Mistral  |         0.04 |          0.04 |    128K |
| Voxtral Mini        | Mistral  |         0.04 |          0.04 |    128K |
| Ministral 8B        | Mistral  |         0.10 |          0.10 |    128K |
| Llama 3.2 1B        | Meta     |         0.10 |          0.10 |    128K |
| GPT-4.1 Nano        | OpenAI   |         0.10 |          0.40 |      1M |
| Gemini 1.5 Flash 8B | Google   |        0.075 |          0.30 |      1M |
| DeepSeek-V4-Flash   | DeepSeek |         0.14 |          0.28 |      1M |

---

**Note**: All pricing from first-party sources as of data collection date. Inference platform prices may differ. Check `providers/<id>/models/` for current data. CNY and EUR pricing available in provider YAML files.

## Related Documentation

- [Model Selection Guide](model-selection.md) — decision framework for choosing models
- [Cached Pricing](cached-pricing.md) — 1,374 models with prompt caching
- [Free AI Models](free-models.md) — 81 free models
- [Context Window Comparison](context-windows.md) — largest context windows
- [Provider Overview](providers.md) — all 95 providers
- [OpenAI Alternatives](openai-alternatives.md) — cheapest GPT-4 alternatives

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
