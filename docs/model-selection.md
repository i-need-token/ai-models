# Model Selection Guide

> 📋 **Quick reference?** See the [Model Selection Cheatsheet](model-selection-cheatsheet.md) for a budget-by-budget guide.
> [中文](zh/model-selection.md)

How to choose the right AI model for your use case — practical recommendations based on cost, capabilities, and context windows.

Data sourced from the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Decision Framework

```
What do you need?
├── Cheapest possible → Free models (81 available)
│   ├── With tool calling → See "Free + Tool Calling" below
│   ├── With reasoning → See "Free + Reasoning" below
│   └── Best overall free → See "Best Free Models" below
├── Best value (cheap + capable) → See "Best Value Models" below
├── Largest context → See "Large Context Models" below
├── Specific capability
│   ├── Tool calling → [Tool Calling Models](tool-calling.md)
│   ├── Reasoning → [Reasoning Models](reasoning-models.md)
│   ├── Vision → [Vision Models](vision-models.md)
│   ├── Structured output → [Structured Output](structured-output.md)
│   └── Prompt caching → [Cached Pricing](cached-pricing.md)
└── Full comparison → [Model Comparison](model-comparison.md) · [Pricing Comparison](pricing-comparison.md)
```

## Best Free Models

Models with $0 input and $0 output pricing — perfect for prototyping and development.

| Model | Provider | Context | Capabilities |
| ----- | -------- | ------- | ------------ |

> See [Free AI Models](free-models.md) for the complete list of 81 free models.

## Free + Tool Calling

Free models that support function/tool calling — ideal for building agents at zero cost.

| Model | Provider | Context | Capabilities |
| ----- | -------- | ------- | ------------ |

## Free + Reasoning

Free models with chain-of-thought reasoning — complex problem solving at zero cost.

| Model | Provider | Context | Capabilities |
| ----- | -------- | ------- | ------------ |

## Best Value Models

Cheapest models with tool calling — best bang for the buck for production agents.

| Model                       | Provider     | Context | Input $/M | Output $/M | Capabilities |
| --------------------------- | ------------ | ------- | --------- | ---------- | ------------ |
| ernie-4.5-0.3b              | aihubmix     | 0       | $0.0068   | $0.0272    | 🔧 👁 📋     |
| bdc-coder                   | inferencenet | 131K    | $0.01     | $0.01      | 🔧 🔓        |
| inclusionai--ling-2.6-flash | openrouter   | 262K    | $0.01     | $0.03      | 🔧 📋        |
| ling-2.6-flash              | inclusionai  | 262K    | $0.01     | $0.03      | 🔧           |
| qwen-3.5-0.8b               | auriko       | 262K    | $0.01     | $0.05      | 🧠 🔧 👁     |

Cheapest models with vision:

| Model                | Provider  | Context | Input $/M | Output $/M | Capabilities |
| -------------------- | --------- | ------- | --------- | ---------- | ------------ |
| ernie-4.5-0.3b       | aihubmix  | 0       | $0.0068   | $0.0272    | 🔧 👁 📋     |
| deepseek-ocr         | aihubmix  | 0       | $0.01     | $0.01      | 👁           |
| gemini-2.0-flash-exp | aihubmix  | 0       | $0.01     | $0.04      | 👁           |
| qwen-3.5-0.8b        | auriko    | 262K    | $0.01     | $0.05      | 🧠 🔧 👁     |
| qwen3.5-0.8b         | deepinfra | 262K    | $0.01     | $0.05      | 🧠 👁        |

Cheapest models with reasoning:

| Model                 | Provider  | Context | Input $/M | Output $/M | Capabilities |
| --------------------- | --------- | ------- | --------- | ---------- | ------------ |
| qwen-3.5-0.8b         | auriko    | 262K    | $0.01     | $0.05      | 🧠 🔧 👁     |
| qwen3.5-0.8b          | deepinfra | 262K    | $0.01     | $0.05      | 🧠 👁        |
| gemma-2-2b-it         | cortecs   | 0       | $0.018    | $0.054     | 🧠           |
| llama-3.1-8b-instruct | cortecs   | 0       | $0.018    | $0.054     | 🧠 🔧        |
| qwen-3.5-2b           | auriko    | 262K    | $0.02     | $0.1       | 🧠 🔧 👁     |

## Large Context Models

Models with the largest context windows — for long documents, multi-turn conversations, and codebases.

| Model                        | Provider   | Context | Input $/M | Output $/M | Capabilities |
| ---------------------------- | ---------- | ------- | --------- | ---------- | ------------ |
| meta-llama--llama-4-scout    | openrouter | 10M     | $0.08     | $0.3       | 🔧 👁 📋     |
| meta-llama-4-scout           | meta       | 10M     | $0.17     | $0.66      | 🔧 👁        |
| gemini-1.5-pro               | google     | 2M      | $1.25     | $5         | 🔧 👁 📋     |
| grok-code-fast-1             | jiekou     | 2M      | $0.19     | $0.475     | 🔧 👁        |
| gpt-4o                       | jiekou     | 2M      | $1.9      | $5.7       | 🔧 👁        |
| grok-4.20-0309-non-reasoning | jiekou     | 2M      | $0.19     | $0.475     | 🔧 👁        |
| grok-4.20-0309-reasoning     | jiekou     | 2M      | $1.9      | $5.7       | 🔧 👁        |
| grok-4-1-fast-reasoning      | jiekou     | 2M      | $0.19     | $0.475     | 🔧 👁        |
| grok-4-fast-reasoning        | jiekou     | 2M      | $0.19     | $0.475     | 🔧 👁        |
| x-ai--grok-4-fast            | fastrouter | 2M      | $0.2      | $0.5       | 🔧 👁        |

> See [Context Window Comparison](context-windows.md) for the full analysis.

## Cost Optimization Tips

1. **Use free models for development** — prototype with free models, switch to paid for production
2. **Enable prompt caching** — [1,374 models](cached-pricing.md) support caching with 50-90% input cost savings
3. **Choose the smallest capable model** — e.g., GPT-4.1 Mini instead of GPT-4.1 for simple tasks
4. **Use open-weight models** — [527 models](open-weights.md) can run on your own infrastructure
5. **Compare across providers** — the same model is often cheaper through alternative providers (e.g., Groq, Together AI, DeepInfra)
6. **Batch requests** — some providers offer 50% discount for batch API calls
7. **Monitor usage** — track input/output token ratios to optimize model selection

## Related Documentation

- [Model Comparison](model-comparison.md) — flagship, cost-effective, free, and open-weight models
- [Pricing Comparison](pricing-comparison.md) — side-by-side pricing across providers
- [Cached Pricing](cached-pricing.md) — models with prompt caching support
- [Free AI Models](free-models.md) — 81 free models by capability
- [Open-Weight Models](open-weights.md) — 527 models you can run yourself
- [Context Window Comparison](context-windows.md) — largest context windows
- [Tool Calling Models](tool-calling.md) — 2,350 models with tool calling
- [Reasoning Models](reasoning-models.md) — 1,306 models with reasoning
- [Vision Models](vision-models.md) — 1,487 models with image understanding
- [Quick Start Guide](quick-start.md) — get started in 30 seconds

- [Chat Models](chat-models.md) — 2,350 models with tool calling for chat applications
- [Multimodal Models](multimodal-models.md) — 1,519 models with image/audio/video input

- [Large Context Models](large-context-models.md) — 2,195 models with 128K+ context
- [Small & Edge Models](small-models.md) — 1,153 models for on-device inference

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
