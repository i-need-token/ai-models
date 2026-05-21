**English** | [中文](./zh/model-comparison.md)

# Model Comparison

Quick-reference comparisons for popular AI model categories. All data sourced from first-party provider APIs and documentation.

## Top-Tier Flagship Models

The most capable models from each major provider as of May 2025.

| Model            | Provider  | Context | Input $/Mtok | Output $/Mtok | Reasoning | Tool Call | Vision |
| ---------------- | --------- | ------: | -----------: | ------------: | :-------: | :-------: | :----: |
| GPT-5.5          | OpenAI    |    512K |        10.00 |         30.00 |    ✅     |    ✅     |   ✅   |
| Claude Opus 4.7  | Anthropic |    200K |        15.00 |         75.00 |    ✅     |    ✅     |   ✅   |
| Gemini 3.1 Pro   | Google    |      1M |         1.25 |         10.00 |    ✅     |    ✅     |   ✅   |
| DeepSeek-V4-Pro  | DeepSeek  |    128K |         2.50 |         10.00 |    ✅     |    ✅     |   ✅   |
| Grok 3           | xAI       |    131K |         3.00 |         15.00 |    ✅     |    ✅     |   ✅   |
| Llama 4 Maverick | Meta      |      1M |            — |             — |    ✅     |    ✅     |   ✅   |
| Qwen3-235B       | Alibaba   |    128K |            — |             — |    ✅     |    ✅     |   ✅   |
| Mistral Large    | Mistral   |    128K |         2.00 |          6.00 |    ✅     |    ✅     |   ✅   |

> Pricing shown for direct provider API. Inference platforms may offer different rates.

## Cost-Effective Models

Best value models for high-volume workloads.

| Model             | Provider  | Context | Input $/Mtok | Output $/Mtok | Reasoning | Tool Call |
| ----------------- | --------- | ------: | -----------: | ------------: | :-------: | :-------: |
| GPT-5.4 Nano      | OpenAI    |    128K |         0.03 |          0.12 |    ❌     |    ✅     |
| Claude Haiku 4.5  | Anthropic |    200K |         0.80 |          4.00 |    ✅     |    ✅     |
| Gemini 3.5 Flash  | Google    |      1M |         0.15 |          0.60 |    ✅     |    ✅     |
| DeepSeek-V4-Flash | DeepSeek  |    128K |         0.10 |          0.40 |    ✅     |    ✅     |
| Llama 4 Scout     | Meta      |     10M |            — |             — |    ✅     |    ✅     |
| Qwen3-30B         | Alibaba   |    128K |            — |             — |    ✅     |    ✅     |
| Mistral Small     | Mistral   |    128K |         0.20 |          0.60 |    ❌     |    ✅     |
| Grok 3 Mini       | xAI       |    131K |         0.30 |          0.50 |    ✅     |    ✅     |

## Largest Context Windows

Models with the biggest context windows for long-document processing.

| Model             | Provider  | Context (tokens) | Input $/Mtok | Output $/Mtok |
| ----------------- | --------- | ---------------: | -----------: | ------------: |
| Llama 4 Scout     | Meta      |       10,000,000 |            — |             — |
| Gemini 3.1 Pro    | Google    |        1,048,576 |         1.25 |         10.00 |
| Gemini 3.5 Flash  | Google    |        1,048,576 |         0.15 |          0.60 |
| Llama 4 Maverick  | Meta      |        1,000,000 |            — |             — |
| GPT-5.5           | OpenAI    |          512,000 |        10.00 |         30.00 |
| Qwen3-Coder-480B  | Alibaba   |        1,048,576 |            — |             — |
| Claude Opus 4.7   | Anthropic |          200,000 |        15.00 |         75.00 |
| Claude Sonnet 4.6 | Anthropic |          200,000 |         3.00 |         15.00 |

## Free Models

Models available at no cost (as of data collection date).

| Model                         | Provider | Context | Reasoning | Tool Call |
| ----------------------------- | -------- | ------: | :-------: | :-------: |
| DeepSeek-V4-Flash (free tier) | DeepSeek |    128K |    ✅     |    ✅     |
| Gemini 3.5 Flash (free tier)  | Google   |      1M |    ✅     |    ✅     |
| Llama 4 Scout (self-hosted)   | Meta     |     10M |    ✅     |    ✅     |
| Qwen3-8B (self-hosted)        | Alibaba  |    128K |    ✅     |    ✅     |
| Mistral-Small (self-hosted)   | Mistral  |    128K |    ❌     |    ✅     |

> Free tiers typically have rate limits. Self-hosted models require your own infrastructure.

## Vision-Capable Models

Models that accept image inputs.

| Model            | Provider  | Image Input | Image Output | Video Input |
| ---------------- | --------- | :---------: | :----------: | :---------: |
| GPT-5.5          | OpenAI    |     ✅      |      ✅      |     ✅      |
| Claude Opus 4.7  | Anthropic |     ✅      |      ❌      |     ❌      |
| Gemini 3.1 Pro   | Google    |     ✅      |      ✅      |     ✅      |
| DeepSeek-V4-Pro  | DeepSeek  |     ✅      |      ❌      |     ❌      |
| Qwen3-VL         | Alibaba   |     ✅      |      ❌      |     ❌      |
| Llama 4 Maverick | Meta      |     ✅      |      ❌      |     ❌      |

## Open-Weight Models

Models with publicly available weights for self-hosting.

| Model             | Provider  | Parameters | Context | Reasoning |
| ----------------- | --------- | :--------- | ------: | :-------: |
| Llama 4 Maverick  | Meta      | 400B MoE   |      1M |    ✅     |
| Llama 4 Scout     | Meta      | 109B MoE   |     10M |    ✅     |
| Qwen3-235B        | Alibaba   | 235B MoE   |    128K |    ✅     |
| Qwen3-30B         | Alibaba   | 30B MoE    |    128K |    ✅     |
| DeepSeek-R1       | DeepSeek  | 671B MoE   |    128K |    ✅     |
| DeepSeek-V3.2     | DeepSeek  | 685B MoE   |    128K |    ✅     |
| Mistral Small 3.2 | Mistral   | 24B        |    128K |    ❌     |
| Phi-4             | Microsoft | 14B        |     16K |    ✅     |

> Parameter counts and architectures are approximate. See individual model YAML files for exact details.

---

**Note**: All pricing and capability data is from first-party sources. Prices may vary on inference platforms. Check `providers/<id>/models/` for the most current data.
