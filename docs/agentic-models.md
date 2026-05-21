# Agentic Models

[中文](zh/agentic-models.md)

AI models with both **tool calling** and **reasoning** capabilities — the key requirements for building AI agents. These models can plan, reason through multi-step tasks, and use external tools to accomplish goals.

Data sourced from the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Why Agentic Models Matter

Agentic models combine two critical capabilities:

- **Tool calling** — invoke functions, APIs, and external tools to take actions
- **Reasoning** — chain-of-thought thinking to plan and decompose complex tasks

Together, these enable:

- **Autonomous agents** — models that can plan, act, and iterate independently
- **Multi-step workflows** — break complex tasks into subtasks with tool use
- **Self-correction** — reason about failures and retry with different approaches
- **Code agents** — write, execute, and debug code autonomously
- **Research agents** — search, synthesize, and summarize information

## Stats

| Metric                                 | Count |
| -------------------------------------- | ----- |
| Agentic models (tool call + reasoning) | 1080  |
| Providers                              | 51    |
| Free agentic models                    | 0     |
| Open-weight agentic models             | 65    |
| With structured output                 | 455   |

## Providers

`302ai`, `aihubmix`, `alibaba`, `amazon`, `anthropic`, `arcee`, `auriko`, `baidu`, `baseten`, `bytedance`, `chutes`, `clarifai`, `cloudflare`, `cortecs`, `deepseek`, `digitalocean`, `dinference`, `fastrouter`, `fireworks`, `google`, `hpc-ai`, `inclusionai`, `inferencenet`, `klusterai`, `llmgateway` and 26 more

## Free Agentic Models

Free models with both tool calling and reasoning — zero-cost agents.

| Model | Provider | Context | Input $/M | Output $/M | Capabilities |
| ----- | -------- | ------- | --------- | ---------- | ------------ |

## Cheapest Agentic Models

Best value agentic models for production agents.

| Model                   | Provider   | Context | Input $/M | Output $/M | Capabilities |
| ----------------------- | ---------- | ------- | --------- | ---------- | ------------ |
| qwen-3.5-0.8b           | auriko     | 262K    | $0.01     | $0.05      |              |
| llama-3.1-8b-instruct   | cortecs    | 0       | $0.018    | $0.054     |              |
| qwen-3.5-2b             | auriko     | 262K    | $0.02     | $0.1       |              |
| openai--gpt-5-nano:flex | requesty   | 400K    | $0.025    | $0.2       |              |
| gpt-5-nano              | aihubmix   | 0       | $0.025    | $0.2       | 📋           |
| gpt-oss-20b             | cortecs    | 0       | $0.027    | $0.124     |              |
| qwen--qwen3-4b-fp8      | novitaai   | 128K    | $0.03     | $0.03      |              |
| openai--gpt-oss-20b     | openrouter | 131K    | $0.03     | $0.14      | 📋           |
| qwen-3.5-4b             | auriko     | 262K    | $0.03     | $0.15      |              |
| openai--gpt-oss-20b     | neuralwatt | 0       | $0.03     | $0.16      | 📋           |

## Largest Context Agentic Models

Agentic models with the largest context windows — for complex multi-step tasks.

| Model                         | Provider | Context | Input $/M | Output $/M | Capabilities |
| ----------------------------- | -------- | ------- | --------- | ---------- | ------------ |
| grok-4-20                     | venice   | 2M      | $1.42     | $2.83      | 📋           |
| grok-4.20-beta-0309-reasoning | 302ai    | 2M      | $2        | $6         |              |
| grok-4-1-fast-reasoning       | 302ai    | 2M      | $0.2      | $0.5       |              |
| grok-4-fast-reasoning         | 302ai    | 2M      | $0.2      | $0.5       |              |
| openai--gpt-5.5               | requesty | 1M      | $5        | $30        |              |
| openai-responses--gpt-5.4     | requesty | 1M      | $2.5      | $15        |              |
| openai-responses--gpt-5.5     | requesty | 1M      | $5        | $30        |              |
| openai--gpt-5.4               | requesty | 1M      | $2.5      | $15        |              |
| openai-responses--gpt-5.4-pro | requesty | 1M      | $30       | $180       |              |
| openai-responses--gpt-5.5-pro | requesty | 1M      | $30       | $180       |              |

## Related Documentation

- [Model Selection Guide](model-selection.md) — decision framework for choosing models
- [Tool Calling Models](tool-calling.md) — 2,350 models with tool calling
- [Reasoning Models](reasoning-models.md) — 1,306 models with reasoning
- [Code Models](code-models.md) — 189 code-focused models
- [Structured Output](structured-output.md) — 829 JSON-mode models
- [Free AI Models](free-models.md) — 81 free models by capability
- [Cached Pricing](cached-pricing.md) — 1,374 models with prompt caching

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
