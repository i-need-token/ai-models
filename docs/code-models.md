# Code Models

[中文](zh/code-models.md)

AI models specifically designed or optimized for code generation, code understanding, and software development tasks. Includes models from 41 providers with code-focused capabilities.

Data sourced from the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Why Code Models Matter

Code-focused models are optimized for:

- **Code generation** — write functions, classes, and entire programs from descriptions
- **Code completion** — autocomplete suggestions in IDEs and editors
- **Code review** — identify bugs, security issues, and style violations
- **Code explanation** — understand and document existing code
- **Code translation** — convert code between programming languages
- **Test generation** — write unit tests and integration tests automatically

## Stats

| Metric                  | Count |
| ----------------------- | ----- |
| Code-focused models     | 189   |
| Providers               | 41    |
| Free code models        | 0     |
| Open-weight code models | 14    |
| With reasoning          | 43    |
| With tool calling       | 119   |
| With structured output  | 43    |

## Providers

`302ai`, `aihubmix`, `aimlapi`, `alibaba`, `amazon-bedrock`, `arcee`, `auriko`, `cerebras`, `clarifai`, `cloudflare`, `cortecs`, `databricks`, `deepinfra`, `digitalocean`, `fastrouter`, `gmicloud`, `google-vertex`, `hyperbolic`, `inception`, `inferencenet` and 21 more

## Free Code Models

Code models available at zero cost — perfect for development and prototyping.

| Model | Provider | Context | Input $/M | Output $/M | Capabilities |
| ----- | -------- | ------- | --------- | ---------- | ------------ |

## Cheapest Code Models

Best value code models for production use.

| Model                                       | Provider     | Context | Input $/M | Output $/M | Capabilities |
| ------------------------------------------- | ------------ | ------- | --------- | ---------- | ------------ |
| bdc-coder                                   | inferencenet | 131K    | $0.01     | $0.01      | 🔧 🔓        |
| doubao-seed-code-preview-latest             | 302ai        | 131K    | $0.0515   | $0.343     | 🔧           |
| qwen3-coder-30b-a3b-instruct                | cortecs      | 0       | $0.053    | $0.222     | 🧠 🔧        |
| qwen--qwen2.5-coder-32b-instruct            | fastrouter   | 32K     | $0.06     | $0.15      |              |
| qwen3-coder-flash                           | aihubmix     | 0       | $0.068    | $0.272     | 🔧 📋        |
| deepinfra--qwen--qwen2.5-coder-32b-instruct | requesty     | 0       | $0.07     | $0.16      | 🔧           |
| Qwen3-Coder-30B-A3B-Instruct                | ovhcloud     | 262K    | $0.07     | $0.26      |              |
| qwen--qwen3-coder-30b-a3b-instruct          | martian      | 0       | $0.07     | $0.27      |              |
| qwen--qwen3-coder-30b-a3b-instruct          | novitaai     | 160K    | $0.07     | $0.27      | 🔧 📋        |
| qwen--qwen3-coder-30b-a3b-instruct          | openrouter   | 160K    | $0.07     | $0.27      | 🔧 📋        |

## Largest Context Code Models

Code models with the largest context windows — for working with large codebases.

| Model                      | Provider   | Context | Input $/M | Output $/M | Capabilities |
| -------------------------- | ---------- | ------- | --------- | ---------- | ------------ |
| grok-code-fast-1           | jiekou     | 2M      | $0.19     | $0.475     | 🔧           |
| qwen--qwen3-coder          | openrouter | 1M      | $0.22     | $1.8       | 🔧 📋        |
| qwen--qwen3-coder--free    | openrouter | 1M      | Free      | Free       | 🔧           |
| alibaba--qwen3-coder-flash | requesty   | 1M      | $0.3      | $1.5       | 🔧           |
| alibaba--qwen3-coder-plus  | requesty   | 1M      | $1        | $5         | 🔧           |
| gpt-5-3-codex              | meganova   | 1M      | $1.4      | $11.2      | 🔧           |
| qwen--qwen3-coder-flash    | openrouter | 1M      | $0.195    | $0.975     | 🔧 📋        |
| qwen--qwen3-coder-plus     | openrouter | 1M      | $0.65     | $3.25      | 🔧 📋        |
| gpt-5-codex                | 302ai      | 400K    | $1.25     | $10        | 🔧           |
| gpt-5.1-codex              | 302ai      | 400K    | $1.25     | $10        | 🔧           |

## Related Documentation

- [Model Selection Guide](model-selection.md) — decision framework for choosing models
- [Tool Calling Models](tool-calling.md) — 2,350 models with tool calling
- [Reasoning Models](reasoning-models.md) — 1,306 models with reasoning
- [Structured Output](structured-output.md) — 829 JSON-mode models
- [Free AI Models](free-models.md) — 81 free models by capability
- [Open-Weight Models](open-weights.md) — 527 models you can run yourself
- [Context Window Comparison](context-windows.md) — largest context windows
- [Cached Pricing](cached-pricing.md) — 1,374 models with prompt caching

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
