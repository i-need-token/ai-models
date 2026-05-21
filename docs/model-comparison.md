**English** | [中文](./zh/model-comparison.md)

# Model Comparison

Quick-reference comparisons for popular AI model categories. All data sourced from first-party provider APIs and documentation.

## Top-Tier Flagship Models

The most capable models from each major provider. Pricing shown for direct provider API.

| Model            | Provider  | Context | Input $/Mtok | Output $/Mtok | Reasoning | Tool Call | Vision |
| ---------------- | --------- | ------: | -----------: | ------------: | :-------: | :-------: | :----: |
| o3               | OpenAI    |    200K |        10.00 |         40.00 |    ✅     |    ✅     |   ✅   |
| Claude Opus 4.7  | Anthropic |      1M |         5.00 |         25.00 |    ✅     |    ✅     |   ✅   |
| Gemini 2.5 Pro   | Google    |      1M |         1.25 |         10.00 |    ✅     |    ✅     |   ✅   |
| DeepSeek-V4-Pro  | DeepSeek  |      1M |        0.435 |          0.87 |    ✅     |    ✅     |   ❌   |
| Grok 4           | xAI       |    131K |         3.00 |         15.00 |    ✅     |    ✅     |   ✅   |
| Llama 4 Maverick | Meta      |      1M |         0.24 |          0.97 |    ❌     |    ✅     |   ✅   |
| Qwen3-235B       | Alibaba   |       — |         2.00 |          8.00 |    ✅     |    ✅     |   ❌   |
| Mistral Large    | Mistral   |    128K |         2.00 |          6.00 |    ❌     |    ✅     |   ✅   |

## Cost-Effective Models

Best value models for high-volume workloads.

| Model             | Provider  | Context | Input $/Mtok | Output $/Mtok | Reasoning | Tool Call |
| ----------------- | --------- | ------: | -----------: | ------------: | :-------: | :-------: |
| GPT-4.1 Nano      | OpenAI    |      1M |         0.10 |          0.40 |    ❌     |    ✅     |
| o4-mini           | OpenAI    |    200K |         1.10 |          4.40 |    ✅     |    ✅     |
| Claude Haiku 4.5  | Anthropic |    200K |         1.00 |          5.00 |    ✅     |    ✅     |
| Gemini 2.5 Flash  | Google    |      1M |         0.15 |          3.50 |    ✅     |    ✅     |
| DeepSeek-V4-Flash | DeepSeek  |      1M |         0.14 |          0.28 |    ✅     |    ✅     |
| Llama 4 Scout     | Meta      |     10M |         0.17 |          0.66 |    ❌     |    ✅     |
| Qwen3-30B         | Alibaba   |       — |         0.75 |          3.00 |    ✅     |    ✅     |
| Mistral Small     | Mistral   |    128K |         0.20 |          0.60 |    ❌     |    ✅     |
| Grok 3 Mini       | xAI       |    131K |         0.25 |          1.27 |    ✅     |    ✅     |

## Largest Context Windows

Models with the biggest context windows for long-document processing.

| Model             | Provider  | Context (tokens) | Input $/Mtok | Output $/Mtok |
| ----------------- | --------- | ---------------: | -----------: | ------------: |
| Llama 4 Scout     | Meta      |       10,000,000 |         0.17 |          0.66 |
| Claude Opus 4.7   | Anthropic |        1,000,000 |         5.00 |         25.00 |
| Claude Sonnet 4.6 | Anthropic |        1,000,000 |         3.00 |         15.00 |
| GPT-4.1           | OpenAI    |        1,048,576 |         2.00 |          8.00 |
| Gemini 2.5 Pro    | Google    |        1,048,576 |         1.25 |         10.00 |
| Gemini 2.5 Flash  | Google    |        1,048,576 |         0.15 |          3.50 |
| Llama 4 Maverick  | Meta      |        1,000,000 |         0.24 |          0.97 |
| DeepSeek-V4-Pro   | DeepSeek  |        1,000,000 |        0.435 |          0.87 |

## Free Models

Models available at no cost (as of data collection date).

| Model                         | Provider | Context | Reasoning | Tool Call |
| ----------------------------- | -------- | ------: | :-------: | :-------: |
| DeepSeek-V4-Flash (free tier) | DeepSeek |      1M |    ✅     |    ✅     |
| Gemini 2.5 Flash (free tier)  | Google   |      1M |    ✅     |    ✅     |
| Llama 4 Scout (self-hosted)   | Meta     |     10M |    ❌     |    ✅     |
| Qwen3-30B (self-hosted)       | Alibaba  |       — |    ✅     |    ✅     |
| Mistral Small (self-hosted)   | Mistral  |    128K |    ❌     |    ✅     |

> Free tiers typically have rate limits. Self-hosted models require your own infrastructure.

## Vision-Capable Models

Models that accept image inputs.

| Model            | Provider  | Image Input | Image Output | Video Input |
| ---------------- | --------- | :---------: | :----------: | :---------: |
| o3               | OpenAI    |     ✅      |      ❌      |     ❌      |
| Claude Opus 4.7  | Anthropic |     ✅      |      ❌      |     ❌      |
| Gemini 2.5 Pro   | Google    |     ✅      |      ❌      |     ❌      |
| GPT-4.1          | OpenAI    |     ✅      |      ❌      |     ❌      |
| Llama 4 Maverick | Meta      |     ✅      |      ❌      |     ❌      |
| Grok 3           | xAI       |     ✅      |      ❌      |     ❌      |

## Open-Weight Models

Models with publicly available weights for self-hosting.

| Model             | Provider  | Context | Input $/Mtok | Output $/Mtok | Reasoning |
| ----------------- | --------- | ------: | -----------: | ------------: | :-------: |
| Llama 4 Maverick  | Meta      |      1M |         0.24 |          0.97 |    ❌     |
| Llama 4 Scout     | Meta      |     10M |         0.17 |          0.66 |    ❌     |
| Qwen3-235B        | Alibaba   |       — |         2.00 |          8.00 |    ✅     |
| Qwen3-30B         | Alibaba   |       — |         0.75 |          3.00 |    ✅     |
| Mistral Small 3.2 | Mistral   |    128K |         0.20 |          0.60 |    ❌     |
| Phi-4             | Microsoft |     16K |        0.125 |          0.50 |    ❌     |

> Pricing shown for hosted inference. Self-hosted models have no per-token cost but require infrastructure.

---

**Note**: All pricing and capability data is from first-party sources. Prices may vary on inference platforms. Check `providers/<id>/models/` for the most current data.
