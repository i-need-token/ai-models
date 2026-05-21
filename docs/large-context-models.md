# Large Context Models

[中文](zh/large-context-models.md)

AI models with **128K+ token context windows** — process entire codebases, long documents, and multi-hour conversations in a single request.

Data sourced from the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Why Large Context Matters

Large context windows unlock capabilities impossible with smaller models:

- **Full codebase analysis** — understand entire repositories in one prompt
- **Document processing** — analyze 100+ page PDFs without chunking
- **Multi-turn conversations** — maintain context across long chat sessions
- **Data analysis** — process large datasets in a single request
- **Legal/medical review** — review lengthy contracts and medical records
- **Content creation** — maintain consistency across long-form writing

## Stats

| Metric                       | Count |
| ---------------------------- | ----- |
| Large context models (128K+) | 2195  |
| 256K+ context                | 861   |
| 1M+ context                  | 397   |
| Providers                    | 78    |
| Free large context models    | 51    |
| With tool calling            | 1637  |

## Providers

`302ai`, `ai21`, `aimlapi`, `aion`, `alibaba`, `amazon`, `amazon-bedrock`, `anthropic`, `arcee`, `auriko`, `baichuan`, `baidu`, `baseten`, `bytedance`, `cerebras`, `chutes`, `clarifai`, `cloudferro-sherlock`, `cloudflare`, `databricks`, `deepinfra`, `deepseek`, `digitalocean`, `dinference`, `evroc` and 53 more

## Largest Context Windows

Models with the biggest context windows available.

| Model                          | Provider   | Context | Input $/M | Output $/M | Capabilities |
| ------------------------------ | ---------- | ------- | --------- | ---------- | ------------ |
| meta-llama--llama-4-scout      | openrouter | 10M     | $0.08     | $0.3       | 🔧 📋        |
| meta-llama-4-scout             | meta       | 10M     | $0.17     | $0.66      | 🔧           |
| gemini-1.5-pro                 | google     | 2M      | $1.25     | $5         | 🔧 📋        |
| grok-code-fast-1               | jiekou     | 2M      | $0.19     | $0.475     | 🔧           |
| gpt-4o                         | jiekou     | 2M      | $1.9      | $5.7       | 🔧           |
| grok-4.20-0309-non-reasoning   | jiekou     | 2M      | $0.19     | $0.475     | 🔧           |
| grok-4.20-0309-reasoning       | jiekou     | 2M      | $1.9      | $5.7       | 🔧           |
| grok-4-1-fast-reasoning        | jiekou     | 2M      | $0.19     | $0.475     | 🔧           |
| grok-4-fast-reasoning          | jiekou     | 2M      | $0.19     | $0.475     | 🔧           |
| x-ai--grok-4-fast              | fastrouter | 2M      | $0.2      | $0.5       | 🔧           |
| x-ai--grok-4.1-fast            | fastrouter | 2M      | $0.2      | $0.5       | 🔧           |
| xai--grok-4-fast-reasoning     | aimlapi    | 2M      | $0.52     | $1.3       | 🔧           |
| xai--grok-4-fast-non-reasoning | aimlapi    | 2M      | $0.52     | $1.3       | 🔧           |
| grok-4-20-multi-agent          | venice     | 2M      | $1.42     | $2.83      | 🧠 📋        |
| grok-4-20                      | venice     | 2M      | $1.42     | $2.83      | 🔧 🧠 📋     |

## Cheapest 1M+ Context Models

Best value models with 1M+ token context — for processing very long inputs.

| Model                             | Provider      | Context | Input $/M | Output $/M | Capabilities |
| --------------------------------- | ------------- | ------- | --------- | ---------- | ------------ |
| gemini-1.5-flash-8b               | deepinfra     | 1M      | $0.0375   | $0.15      |              |
| gpt-5-nano                        | meganova      | 1M      | $0.04     | $0.32      | 🔧           |
| qwen--qwen3.5-flash-02-23         | openrouter    | 1M      | $0.065    | $0.26      | 🔧 🧠 📋     |
| google--gemini-2.0-flash-lite-001 | openrouter    | 1M      | $0.075    | $0.3       | 🔧 📋        |
| google--gemini-2.0-flash-lite-001 | fastrouter    | 1M      | $0.075    | $0.3       | 🔧           |
| gemini-1.5-flash                  | deepinfra     | 1M      | $0.075    | $0.3       |              |
| gemini-2.0-flash-lite             | google        | 1M      | $0.075    | $0.3       | 🔧 📋        |
| gemini-1.5-flash                  | google        | 1M      | $0.075    | $0.3       | 🔧 📋        |
| gemini-1.5-flash-8b               | google        | 1M      | $0.075    | $0.3       | 🔧 📋        |
| gemini-2-0-flash-lite             | google-vertex | 1M      | $0.075    | $0.3       | 🔧           |

## Free Large Context Models

Free models with 128K+ context — zero-cost long document processing.

| Model                                    | Provider   | Context | Input $/M | Output $/M | Capabilities |
| ---------------------------------------- | ---------- | ------- | --------- | ---------- | ------------ |
| openrouter--owl-alpha                    | openrouter | 1M      | Free      | Free       | 🔧 📋        |
| deepseek--deepseek-v4-flash--free        | openrouter | 1M      | Free      | Free       | 🔧 🧠        |
| google--lyria-3-clip-preview             | openrouter | 1M      | Free      | Free       | 📋           |
| google--lyria-3-pro-preview              | openrouter | 1M      | Free      | Free       | 📋           |
| qwen--qwen3-coder--free                  | openrouter | 1M      | Free      | Free       | 🔧           |
| nvidia--nemotron-3-super-120b-a12b--free | openrouter | 1M      | Free      | Free       | 🔧 🧠 📋     |
| google--gemma-4-26b-a4b-it--free         | openrouter | 262K    | Free      | Free       | 🔧 🧠 📋     |
| arcee-ai--trinity-large-thinking--free   | openrouter | 262K    | Free      | Free       | 🔧 🧠        |
| google--gemma-4-31b-it--free             | openrouter | 262K    | Free      | Free       | 🔧 🧠 📋     |
| gemma-4-26b-a4b-it                       | auriko     | 262K    | Free      | Free       | 🔧 🧠 📋     |

## Context Window Tiers

| Tier     | Context | Use Case                       | Example Models            |
| -------- | ------- | ------------------------------ | ------------------------- |
| Standard | 128K    | Long documents, code files     | gpt-4.1, claude-sonnet-4  |
| Extended | 256K    | Codebases, multi-file analysis | claude-opus-4, o3         |
| Ultra    | 1M      | Full repositories, books       | gemini-2.5-flash, gpt-4.1 |
| Massive  | 10M     | Entire datasets, video         | llama-4-scout             |

## Related Documentation

- [Context Windows](context-windows.md) — detailed context window comparison
- [Chat Models](chat-models.md) — 2,350 models with tool calling
- [Code Models](code-models.md) — 189 code-focused models
- [Free AI Models](free-models.md) — 81 free models by capability
- [Model Selection Guide](model-selection.md) — decision framework
- [Migration Guide](migration-guide.md) — switching providers
- [Provider Comparison](provider-comparison.md) — top 30 providers

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
