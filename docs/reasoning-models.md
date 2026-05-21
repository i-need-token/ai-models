**English** | [中文](./zh/reasoning-models.md)

# AI Reasoning Models

1,306 models in this catalog support reasoning (chain-of-thought / extended thinking). This page highlights the most capable and cost-effective reasoning models available.

> All data sourced from first-party APIs and documentation. "Reasoning" means the model can produce extended chain-of-thought before answering.

## Quick Stats

| Capability                | Reasoning Models |
| ------------------------- | ---------------: |
| Total reasoning models    |            1,306 |
| Unique model IDs          |              868 |
| With tool calling         |            1,076 |
| With vision (image input) |              697 |
| Open-weight               |              119 |

## Top Reasoning Models by Context

The largest-context reasoning models — ideal for complex, multi-step tasks:

| Model                         | Context | Tool Call | Vision | Input $/1M | Providers |
| ----------------------------- | ------- | --------- | ------ | ---------: | --------: |
| Grok 4 Fast Reasoning         | 2M      | ✅        | ✅     |      $0.20 |         2 |
| Grok 4.1 Fast Reasoning       | 2M      | ✅        | ✅     |      $0.20 |         2 |
| Grok 4.20                     | 2M      | ✅        | ✅     |      $1.42 |         1 |
| GPT-5.4                       | 1M      | ✅        | ✅     |      $2.50 |         4 |
| GPT-5.5                       | 1M      | ✅        | ✅     |      $5.00 |         4 |
| Gemini 2.5 Pro                | 1M      | ✅        | ✅     |      $1.25 |         4 |
| Gemini 2.5 Flash              | 1M      | ✅        | ✅     |      $0.15 |         3 |
| Gemini 2.5 Flash Lite         | 1M      | ✅        | ✅     |      $0.10 |         3 |
| Gemini 3 Flash Preview        | 1M      | ✅        | ✅     |      $0.50 |         4 |
| Gemini 3.1 Flash Lite Preview | 1M      | ✅        | ✅     |      $0.25 |         3 |
| DeepSeek Reasoner             | 1M      | ✅        | ✅     |      $0.43 |         1 |

## Cheapest Reasoning Models

Best value for reasoning capability:

| Model                 | Provider  | Input $/1M | Output $/1M | Context |
| --------------------- | --------- | ---------: | ----------: | ------- |
| Qwen 3.5 0.8B         | Auriko    |      $0.01 |       $0.05 | 262K    |
| Qwen 3.5 0.8B         | DeepInfra |      $0.01 |       $0.05 | 262K    |
| Qwen 3.5 2B           | Auriko    |      $0.02 |       $0.10 | 262K    |
| Qwen 3.5 2B           | DeepInfra |      $0.02 |       $0.10 | 262K    |
| GPT-5 Nano            | Requesty  |     $0.025 |       $0.20 | 400K    |
| Qwen 3.5 4B           | Auriko    |      $0.03 |       $0.15 | 262K    |
| Qwen 3.5 4B           | DeepInfra |      $0.03 |       $0.15 | 262K    |
| Gemini 2.5 Flash Lite | Google    |      $0.10 |       $0.60 | 1M      |
| Gemini 2.5 Flash      | Google    |      $0.15 |       $0.60 | 1M      |
| Grok 4 Fast Reasoning | xAI       |      $0.20 |       $0.50 | 2M      |

## Best Reasoning + Vision Models

Models that can reason about images — ideal for visual analysis:

| Model                   | Context | Input $/1M | Providers |
| ----------------------- | ------- | ---------: | --------: |
| Grok 4 Fast Reasoning   | 2M      |      $0.20 |         2 |
| Gemini 2.5 Flash        | 1M      |      $0.15 |         3 |
| Gemini 2.5 Pro          | 1M      |      $1.25 |         4 |
| GPT-5.4                 | 1M      |      $2.50 |         4 |
| DeepSeek Reasoner       | 1M      |      $0.43 |         1 |
| MiMo V2.5 (open-weight) | 1M      |     varies |         2 |

## Open-Weight Reasoning Models

119 open-weight models support reasoning — run them on your own hardware:

| Model                   | Context | Tool Call | Vision | Providers |
| ----------------------- | ------- | --------- | ------ | --------: |
| MiMo V2.5 Pro           | 1M      | ✅        | ❌     |         2 |
| MiMo V2.5               | 1M      | ✅        | ✅     |         2 |
| DeepSeek-V4 Pro         | 1M      | ✅        | ❌     |         1 |
| Qwen3 Next 80B Thinking | 262K    | ✅        | ❌     |         4 |
| Kimi K2.6               | 262K    | ✅        | ✅     |         4 |
| Trinity Large Thinking  | 262K    | ✅        | ❌     |         1 |
| Nemotron 3 120B         | 262K    | ✅        | ❌     |         1 |
| Qwen3.5 397B A17B       | 262K    | ✅        | ❌     |         2 |

## Key Takeaways

- **1,306 reasoning models** across 868 unique IDs — the largest reasoning model catalog available
- **Grok 4 Fast Reasoning** offers the best value at 2M context for $0.20/1M input
- **Gemini 2.5 Flash Lite** is the cheapest 1M-context reasoning model at $0.10/1M
- **MiMo V2.5** is the only open-weight model combining 1M context, reasoning, and vision
- **697 reasoning models** also support vision — the most common combined capability
- Small reasoning models (Qwen 3.5 0.8B–4B) cost as little as $0.01–$0.03/1M tokens
