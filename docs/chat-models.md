# Chat Models

[中文](zh/chat-models.md)

AI models with **tool calling** support — the essential capability for building chat-based applications, AI assistants, and conversational agents. These models can understand natural language, generate responses, and invoke external tools.

Data sourced from the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Why Chat Models Matter

Chat models are the backbone of modern AI applications:

- **Conversational AI** — natural language dialogue with context
- **AI Assistants** — task-oriented chat with tool use
- **Customer Support** — automated support with knowledge base access
- **Content Generation** — writing, summarization, translation
- **Data Analysis** — natural language queries over structured data

Tool calling is the key differentiator — it allows models to go beyond text generation and take actions in the real world.

## Stats

| Metric                          | Count |
| ------------------------------- | ----- |
| Chat models (with tool calling) | 2350  |
| Providers                       | 71    |
| Free chat models                | 54    |
| Open-weight chat models         | 278   |
| With reasoning                  | 1080  |
| With structured output          | 758   |

## Providers

`01ai`, `302ai`, `aihubmix`, `aimlapi`, `alibaba`, `amazon`, `amazon-bedrock`, `anthropic`, `arcee`, `auriko`, `baidu`, `baseten`, `berget`, `bytedance`, `cerebras`, `chutes`, `clarifai`, `cloudferro-sherlock`, `cloudflare`, `cortecs`, `databricks`, `deepseek`, `digitalocean`, `dinference`, `evroc` and 46 more

## Free Chat Models

Free models with tool calling — zero-cost chat applications.

| Model                                                | Provider   | Context | Input $/M | Output $/M | Capabilities |
| ---------------------------------------------------- | ---------- | ------- | --------- | ---------- | ------------ |
| openrouter--owl-alpha                                | openrouter | 1M      | Free      | Free       | 📋           |
| deepseek--deepseek-v4-flash--free                    | openrouter | 1M      | Free      | Free       | 🧠           |
| qwen--qwen3-coder--free                              | openrouter | 1M      | Free      | Free       |              |
| nvidia--nemotron-3-super-120b-a12b--free             | openrouter | 1M      | Free      | Free       | 🧠 📋        |
| google--gemma-4-26b-a4b-it--free                     | openrouter | 262K    | Free      | Free       | 🧠 📋        |
| arcee-ai--trinity-large-thinking--free               | openrouter | 262K    | Free      | Free       | 🧠           |
| google--gemma-4-31b-it--free                         | openrouter | 262K    | Free      | Free       | 🧠 📋        |
| gemma-4-26b-a4b-it                                   | auriko     | 262K    | Free      | Free       | 🧠 📋        |
| gemma-4-31b-it                                       | auriko     | 262K    | Free      | Free       | 🧠 📋        |
| nvidia--nemotron-3-nano-omni-30b-a3b-reasoning--free | openrouter | 256K    | Free      | Free       | 🧠           |

## Cheapest Chat Models

Best value chat models for production.

| Model                                       | Provider     | Context | Input $/M | Output $/M | Capabilities |
| ------------------------------------------- | ------------ | ------- | --------- | ---------- | ------------ |
| ernie-4.5-0.3b                              | aihubmix     | 0       | $0.0068   | $0.0272    | 📋           |
| bdc-coder                                   | inferencenet | 131K    | $0.01     | $0.01      | 🔓           |
| inclusionai--ling-2.6-flash                 | openrouter   | 262K    | $0.01     | $0.03      | 📋           |
| ling-2.6-flash                              | inclusionai  | 262K    | $0.01     | $0.03      |              |
| qwen-3.5-0.8b                               | auriko       | 262K    | $0.01     | $0.05      | 🧠           |
| qwen3-vl-flash-2026-01-22                   | aihubmix     | 0       | $0.0103   | $0.103     | 📋           |
| qwen3-vl-flash                              | aihubmix     | 0       | $0.0103   | $0.103     | 📋           |
| klusterai--Meta-Llama-3.1-8B-Instruct-Turbo | klusterai    | 131K    | $0.015    | $0.02      |              |
| granite-4.0-h-micro                         | cloudflare   | 131K    | $0.017    | $0.112     | 🔓           |
| llama-3.1-8b-instruct                       | cortecs      | 0       | $0.018    | $0.054     | 🧠           |

## Largest Context Chat Models

Chat models with the largest context windows — for long conversations and document analysis.

| Model                        | Provider   | Context | Input $/M | Output $/M | Capabilities |
| ---------------------------- | ---------- | ------- | --------- | ---------- | ------------ |
| meta-llama--llama-4-scout    | openrouter | 10M     | $0.08     | $0.3       | 📋           |
| meta-llama-4-scout           | meta       | 10M     | $0.17     | $0.66      |              |
| gemini-1.5-pro               | google     | 2M      | $1.25     | $5         | 📋           |
| grok-code-fast-1             | jiekou     | 2M      | $0.19     | $0.475     |              |
| gpt-4o                       | jiekou     | 2M      | $1.9      | $5.7       |              |
| grok-4.20-0309-non-reasoning | jiekou     | 2M      | $0.19     | $0.475     |              |
| grok-4.20-0309-reasoning     | jiekou     | 2M      | $1.9      | $5.7       |              |
| grok-4-1-fast-reasoning      | jiekou     | 2M      | $0.19     | $0.475     |              |
| grok-4-fast-reasoning        | jiekou     | 2M      | $0.19     | $0.475     |              |
| x-ai--grok-4-fast            | fastrouter | 2M      | $0.2      | $0.5       |              |

## Related Documentation

- [Agentic Models](agentic-models.md) — 1,080 models with tool calling + reasoning
- [Reasoning Models](reasoning-models.md) — 1,306 models with reasoning
- [Code Models](code-models.md) — 189 code-focused models
- [Free AI Models](free-models.md) — 81 free models by capability
- [Structured Output](structured-output.md) — 829 JSON-mode models
- [Model Selection Guide](model-selection.md) — decision framework
- [Cached Pricing](cached-pricing.md) — 1,374 models with prompt caching

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
