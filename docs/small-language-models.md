# Small Language Models (SLM) Guide

> Complete guide to 2,000+ small language models for edge deployment, mobile apps, and cost-efficient production.

## What Are Small Language Models?

Small Language Models (SLMs) are AI models with fewer than ~10 billion parameters, designed for efficiency, low latency, and deployment on resource-constrained hardware. They offer a practical alternative to large frontier models when cost, speed, or privacy matters.

### Key Advantages

| Factor                | Small Model (SLM)      | Large Model (LLM)          |
| --------------------- | ---------------------- | -------------------------- |
| Cost per 1M tokens    | $0.01 – $0.20          | $1 – $40                   |
| Latency (first token) | 50 – 200ms             | 200 – 2000ms               |
| Deployment            | On-device, edge, cloud | Cloud only                 |
| Privacy               | Data stays on device   | Data sent to cloud         |
| Customization         | Easy fine-tuning       | Expensive fine-tuning      |
| Complex reasoning     | Good for simple tasks  | Superior for complex tasks |

## Quick Stats

| Metric                | Count |
| --------------------- | ----- |
| Total small models    | 2,002 |
| With tool calling     | 928   |
| With reasoning        | 557   |
| Free SLMs             | 48    |
| First-party providers | 689   |

## Best SLMs by Use Case

### AI Agents on a Budget

Need tool calling + reasoning + low latency for high-volume agent workflows.

- **Best value**: ling-2.6-flash ($0.01/$0.03/M) — cheapest tool-calling model with 262K context
- **Balanced**: GPT-4.1-mini ($0.40/$1.60/M) — reliable + 1M context
- **Free**: Gemma 4 27B IT — free vision + tool calling

### On-Device / Edge Deployment

Need models that run on smartphones, IoT devices, or edge servers.

- **Ultra-compact**: Qwen3.5 0.8B — reasoning in a tiny package
- **Balanced**: Qwen3 4B ($0.03/$0.15/M) — open-source with reasoning
- **Vision**: Gemma 4 27B IT — free with vision + tool calling

### Code Completion

Need tool calling + structured output for coding assistance.

- **Cheapest**: bdc-coder ($0.01/$0.01/M) — cheapest coding model
- **Balanced**: GPT-4.1-nano ($0.10/$0.40/M) — fast + cheap
- **Open-source**: Qwen3 4B ($0.03/$0.15/M) — reasoning + tool calling

### Math & Reasoning

Need reasoning capability for step-by-step problem solving.

- **Free**: DeepSeek R1 Distill Llama 8B — free reasoning model
- **Cheapest**: Qwen3.5 0.8B ($0.01/$0.05/M) — cheapest reasoning
- **Balanced**: Qwen3.5 4B ($0.03/$0.15/M) — open-source reasoning

### Chat & RAG

Need large context + low cost for retrieval-augmented generation.

- **Cheapest**: Qwen3 4B ($0.03/$0.15/M) — cheap + 262K context
- **Fast**: GPT-4.1-nano ($0.10/$0.40/M) — fast + cheap
- **Large context**: Gemini 2.5 Flash ($0.15/$0.60/M) — 1M context + reasoning

## Cheapest Small Models with Tool Calling

| Model                                       | Provider  | Input $/M | Output $/M | Context | Reasoning |
| ------------------------------------------- | --------- | --------- | ---------- | ------- | --------- |
| ling-2.6-flash                              | ling      | $0.01     | $0.03      | 262K    | —         |
| klusterai--Meta-Llama-3.1-8B-Instruct-Turbo | klusterai | $0.015    | $0.02      | 131K    | —         |
| granite-4.0-h-micro                         | ibm       | $0.017    | $0.112     | 131K    | —         |
| llama-3.1-8b-instruct--fp-16                | fireworks | $0.02     | $0.03      | 131K    | —         |
| schematron-3b                               | fireworks | $0.02     | $0.05      | 131K    | —         |

## Free Small Language Models

48 small models available at zero cost — perfect for prototyping and development:

| Model                          | Provider | Context | Tool Calling | Reasoning |
| ------------------------------ | -------- | ------- | ------------ | --------- |
| deepseek-r1-distill-llama-8b   | cerebras | 131K    | —            | ✓         |
| llama-4-scout-17b-16e-instruct | cerebras | 131K    | ✓            | —         |
| qwen-2.5-32b                   | cerebras | 131K    | ✓            | —         |
| gemma-4-26b-a4b-it             | auriko   | 262K    | ✓            | —         |
| glm-4.5-flash                  | auriko   | 200K    | ✓            | —         |

## Small Models with Reasoning

557 small models with reasoning capabilities:

| Model                        | Provider  | Input $/M | Output $/M | Context | Tool Calling |
| ---------------------------- | --------- | --------- | ---------- | ------- | ------------ |
| qwen3.5-0.8b                 | qwen      | $0.01     | $0.05      | 262K    | —            |
| qwen3.5-2b                   | qwen      | $0.02     | $0.10      | 262K    | —            |
| qwen--qwen3-4b-fp8           | fireworks | $0.03     | $0.03      | 128K    | —            |
| qwen3.5-4b                   | qwen      | $0.03     | $0.15      | 262K    | —            |
| deepseek-r1-distill-llama-8b | cerebras  | Free      | Free       | 131K    | —            |

## How to Choose the Right SLM

1. **Define your constraints**: Budget, latency, deployment target (cloud vs edge)
2. **Identify required capabilities**: Tool calling? Reasoning? Vision? Structured output?
3. **Check context window**: How much text do you need to process?
4. **Compare pricing**: Use the [interactive catalog](https://i-need-token.github.io/ai-models/) or [pricing calculator](https://i-need-token.github.io/ai-models/ai-model-pricing-calculator.html)
5. **Test with your data**: Small models vary significantly in quality for specific domains

## Related Documentation

- [Free Models Guide](free-models.md) — all 81 free models
- [Tool Calling Guide](tool-calling.md) — 2,350 models with tool calling
- [Reasoning Models Guide](reasoning-models.md) — 1,306 reasoning models
- [Pricing Comparison](pricing-comparison.md) — find the cheapest model
- [Context Windows](context-windows.md) — largest context windows
- [Model Selection Cheatsheet](model-selection-cheatsheet.md) — quick-reference guide
- [Small Language Models Comparison](https://i-need-token.github.io/ai-models/small-language-models.html) — interactive SEO page

---

_Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — first-party data only, updated automatically._
