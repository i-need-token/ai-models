**English** | [中文](./zh/vision-models.md)

# AI Vision Models

1,487 models in this catalog accept image input (vision). This page highlights the most capable and cost-effective vision models for image understanding, document analysis, and visual reasoning.

> All data sourced from first-party APIs and documentation. "Vision" means the model accepts image input; image generation is a separate capability.

## Quick Stats

| Capability          | Vision Models |
| ------------------- | ------------: |
| Total vision models |         1,487 |
| Unique model IDs    |           930 |
| With tool calling   |         1,063 |
| With reasoning      |           697 |
| Open-weight         |           104 |

## Cheapest Vision Models

Best value for image understanding:

| Model                 | Provider    | Input $/1M | Output $/1M | Context | Tool Call | Reasoning |
| --------------------- | ----------- | ---------: | ----------: | ------- | --------- | --------- |
| Qwen 3.5 0.8B         | Auriko      |      $0.01 |       $0.05 | 262K    | ✅        | ✅        |
| Qwen 3.5 0.8B         | DeepInfra   |      $0.01 |       $0.05 | 262K    | ✅        | ✅        |
| Qwen 3.5 2B           | Auriko      |      $0.02 |       $0.10 | 262K    | ✅        | ✅        |
| Qwen 3.5 2B           | DeepInfra   |      $0.02 |       $0.10 | 262K    | ✅        | ✅        |
| Qwen 3.5 4B           | Auriko      |      $0.03 |       $0.15 | 262K    | ✅        | ✅        |
| Qwen 3.5 4B           | DeepInfra   |      $0.03 |       $0.15 | 262K    | ✅        | ✅        |
| Gemini 2.5 Flash Lite | Google      |      $0.10 |       $0.60 | 1M      | ✅        | ✅        |
| Gemini 2.5 Flash      | Google      |      $0.15 |       $0.60 | 1M      | ✅        | ✅        |
| Llama 4 Maverick      | Together AI |      $0.15 |       $0.60 | 1M      | ✅        | ❌        |
| Grok 4 Fast Reasoning | xAI         |      $0.20 |       $0.50 | 2M      | ✅        | ✅        |

## Largest Context Vision Models

For analyzing large documents, multi-page PDFs, or long image sequences:

| Model                 | Context | Input $/1M | Tool Call | Reasoning | Providers |
| --------------------- | ------- | ---------: | --------- | --------- | --------: |
| Llama 4 Scout         | 10M     |      $0.08 | ✅        | ❌        |         4 |
| Grok 4 Fast Reasoning | 2M      |      $0.20 | ✅        | ✅        |         2 |
| GPT-5.4               | 1M      |      $2.50 | ✅        | ✅        |         4 |
| Gemini 2.5 Pro        | 1M      |      $1.25 | ✅        | ✅        |         4 |
| Gemini 2.5 Flash      | 1M      |      $0.15 | ✅        | ✅        |         3 |
| DeepSeek Reasoner     | 1M      |      $0.43 | ✅        | ✅        |         1 |
| GPT-4.1               | 1M      |      $2.00 | ✅        | ❌        |         4 |
| Llama 4 Maverick      | 1M      |      $0.15 | ✅        | ❌        |         3 |

## Best Vision + Tool Calling + Reasoning

The most capable vision models — can see, reason, and act:

| Model                   | Context | Input $/1M | Providers |
| ----------------------- | ------- | ---------: | --------: |
| Grok 4 Fast Reasoning   | 2M      |      $0.20 |         2 |
| Gemini 2.5 Flash        | 1M      |      $0.15 |         3 |
| Gemini 2.5 Pro          | 1M      |      $1.25 |         4 |
| GPT-5.4                 | 1M      |      $2.50 |         4 |
| DeepSeek Reasoner       | 1M      |      $0.43 |         1 |
| MiMo V2.5 (open-weight) | 1M      |     varies |         2 |
| Kimi K2.6 (open-weight) | 262K    |     varies |         4 |

## Open-Weight Vision Models

104 open-weight models accept image input — run vision AI on your own hardware:

| Model              | Context | Tool Call | Reasoning | Providers |
| ------------------ | ------- | --------- | --------- | --------: |
| MiMo V2.5          | 1M      | ✅        | ✅        |         2 |
| Llama 4 Maverick   | 1M      | ✅        | ❌        |         3 |
| Llama 4 Scout      | 10M     | ✅        | ❌        |         2 |
| Gemma 4 31B IT     | 1M      | ✅        | ❌        |         3 |
| Qwen3.5 Flash      | 1M      | ✅        | ❌        |         1 |
| Kimi K2.6          | 262K    | ✅        | ✅        |         4 |
| Gemma 4 26B A4B IT | 262K    | ✅        | ✅        |         3 |
| Llama 4 Scout 17B  | 328K    | ✅        | ❌        |         4 |

## Key Takeaways

- **1,487 vision models** across 930 unique IDs — the largest vision model catalog available
- **Gemini 2.5 Flash** is the best value: 1M context, vision, tool calling, and reasoning for $0.15/1M
- **Llama 4 Scout** has the largest vision context at 10M tokens
- **Grok 4 Fast Reasoning** is the only model combining 2M context, vision, tool calling, and reasoning
- **104 open-weight vision models** available — run vision AI on your own infrastructure
- Small vision models (Qwen 3.5 0.8B–4B) cost as little as $0.01–$0.03/1M tokens

## Related Documentation

- [Model Selection Guide](model-selection.md) — decision framework for choosing models
- [Image Generation](image-generation.md) — 28 image generation models
- [Video Models](video-models.md) — 167 video input/output models
- [Modality Matrix](modality-matrix.md) — all modalities at a glance
- [Free AI Models](free-models.md) — 81 free models, some with vision

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
