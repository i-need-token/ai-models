**English** | [中文](./zh/tool-calling.md)

# AI Tool Calling Models

2,350 models in this catalog support tool calling (function calling). This page highlights the most capable and cost-effective models for building AI agents and automation.

> All data sourced from first-party APIs and documentation. "Tool calling" means the model can invoke external functions/tools as part of its response.

## Quick Stats

| Capability                | Tool-Calling Models |
| ------------------------- | ------------------: |
| Total tool-calling models |               2,350 |
| Unique model IDs          |               1,540 |
| With reasoning            |               1,076 |
| With vision (image input) |               1,063 |
| With structured output    |                 829 |
| Open-weight               |                 270 |

## Cheapest Tool-Calling Models

Best value for building AI agents:

| Model                      | Provider     | Input $/1M | Output $/1M | Context | Reasoning |
| -------------------------- | ------------ | ---------: | ----------: | ------- | --------- |
| GLM-4-Flash                | 302AI        |    $0.0014 |     $0.0014 | 131K    | ❌        |
| Mistral-Nemo-Instruct-2407 | KlusterAI    |     $0.008 |      $0.001 | 131K    | ❌        |
| BDC-Coder                  | InferenceNet |      $0.01 |       $0.01 | 131K    | ❌        |
| Qwen 3.5 0.8B              | Auriko       |      $0.01 |       $0.05 | 262K    | ✅        |
| Qwen 3.5 0.8B              | DeepInfra    |      $0.01 |       $0.05 | 262K    | ✅        |
| Qwen 3.5 2B                | Auriko       |      $0.02 |       $0.10 | 262K    | ✅        |
| Qwen 3.5 2B                | DeepInfra    |      $0.02 |       $0.10 | 262K    | ✅        |
| GPT-5 Nano                 | Requesty     |     $0.025 |       $0.20 | 400K    | ✅        |
| Gemini 2.5 Flash Lite      | Google       |      $0.10 |       $0.60 | 1M      | ✅        |
| Gemini 2.5 Flash           | Google       |      $0.15 |       $0.60 | 1M      | ✅        |
| Grok 4 Fast Reasoning      | xAI          |      $0.20 |       $0.50 | 2M      | ✅        |

## Largest Context Tool-Calling Models

For agents that need to process large documents or long conversation histories:

| Model                 | Context | Input $/1M | Reasoning | Providers |
| --------------------- | ------- | ---------: | --------- | --------: |
| Llama 4 Scout         | 10M     |      $0.08 | ❌        |         4 |
| Grok 4 Fast Reasoning | 2M      |      $0.20 | ✅        |         2 |
| GPT-5.4               | 1M      |      $2.50 | ✅        |         4 |
| Gemini 2.5 Pro        | 1M      |      $1.25 | ✅        |         4 |
| Gemini 2.5 Flash      | 1M      |      $0.15 | ✅        |         3 |
| DeepSeek-V4 Flash     | 1M      |      $0.27 | ✅        |         2 |
| GPT-4.1               | 1M      |      $2.00 | ❌        |         4 |
| Llama 4 Maverick      | 1M      |      $0.15 | ❌        |         3 |

## Best Tool-Calling + Reasoning + Vision

The "holy trinity" for advanced AI agents — tool calling, reasoning, and vision in one model:

| Model                   | Context | Input $/1M | Providers |
| ----------------------- | ------- | ---------: | --------: |
| Grok 4 Fast Reasoning   | 2M      |      $0.20 |         2 |
| Gemini 2.5 Flash        | 1M      |      $0.15 |         3 |
| Gemini 2.5 Pro          | 1M      |      $1.25 |         4 |
| GPT-5.4                 | 1M      |      $2.50 |         4 |
| DeepSeek Reasoner       | 1M      |      $0.43 |         1 |
| MiMo V2.5 (open-weight) | 1M      |     varies |         2 |
| Kimi K2.6 (open-weight) | 262K    |     varies |         4 |

## Free Tool-Calling Models

45 free models support tool calling — ideal for prototyping and testing:

| Model                          | Provider | Context | Reasoning | Vision |
| ------------------------------ | -------- | ------- | --------- | ------ |
| gemini-2.0-flash               | Google   | 1M      | ✅        | ✅     |
| gemini-2.5-flash-preview-05-20 | Google   | 1M      | ✅        | ✅     |
| llama-4-scout                  | Chutes   | 10M     | ❌        | ✅     |
| llama-4-maverick               | Chutes   | 1M      | ❌        | ✅     |
| deepseek-r1                    | Chutes   | 128K    | ✅        | ❌     |
| qwen3-235b-a22b                | Chutes   | 128K    | ✅        | ✅     |
| gemma-3-27b-it                 | Chutes   | 128K    | ✅        | ✅     |

## Key Takeaways

- **2,350 tool-calling models** across 1,540 unique IDs — the largest tool-calling model catalog
- **Gemini 2.5 Flash** is the best value: 1M context, tool calling, reasoning, and vision for $0.15/1M
- **Grok 4 Fast Reasoning** offers the largest context (2M) with all three capabilities
- **45 free models** support tool calling — start building agents at zero cost
- **829 models** also support structured output — perfect for reliable JSON responses
- Small models (Qwen 3.5 0.8B–4B) cost as little as $0.01–$0.03/1M tokens with tool calling

## Related Documentation

- [Model Selection Guide](model-selection.md) — decision framework for choosing models
- [Free AI Models](free-models.md) — 81 free models, many with tool calling
- [Structured Output](structured-output.md) — 829 JSON-mode models
- [Reasoning Models](reasoning-models.md) — 1,306 models with reasoning
- [Cached Pricing](cached-pricing.md) — 1,374 models with prompt caching
- [OpenAI Alternatives](openai-alternatives.md) — GPT-4/GPT-3.5 alternatives with tool calling

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
