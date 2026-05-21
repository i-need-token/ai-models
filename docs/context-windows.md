**English** | [中文](./zh/context-windows.md)

# Context Window Comparison

Which models have the largest context windows? This page lists models by context window size and pricing.

> For the full list, download [models.json](https://github.com/i-need-token/ai-models/releases/latest) or browse `providers/`.

## Context Window Distribution

| Tier             | Models | Description                                                |
| ---------------- | -----: | ---------------------------------------------------------- |
| 1M+ tokens       |    391 | Can process entire books, codebases, or long conversations |
| 256K–1M tokens   |    459 | Large documents, multi-turn conversations                  |
| 128K–256K tokens |  1,310 | Standard long-context, most modern models                  |
| 32K–128K tokens  |    194 | Medium-length documents                                    |
| 8K–32K tokens    |     97 | Short documents, single-turn queries                       |
| <8K tokens       |     19 | Legacy models, very short inputs                           |

## Largest Context Windows (1M+ tokens)

| Model                         | Provider      | Context | Input $/1M | Output $/1M | Tool Call | Reasoning |
| ----------------------------- | ------------- | ------- | ---------: | ----------: | --------- | --------- |
| Llama 4 Scout                 | Meta          | 10M     |          — |           — | ✅        | ❌        |
| Llama 4 Scout                 | OpenRouter    | 10M     |      $0.08 |       $0.30 | ✅        | ❌        |
| Gemini 3 Pro Preview          | Google        | 2M      |      $2.00 |      $12.00 | ✅        | ❌        |
| Gemini 3.1 Flash Lite Preview | Google        | 2M      |      $0.25 |       $1.50 | ✅        | ❌        |
| Gemini 3.1 Pro Preview        | Google        | 2M      |      $2.00 |      $12.00 | ✅        | ❌        |
| Grok 4 Fast Reasoning         | xAI           | 2M      |      $0.20 |       $0.50 | ✅        | ✅        |
| GPT-4.1                       | OpenAI        | ~1M     |      $2.00 |       $8.00 | ✅        | ❌        |
| Gemini 2.5 Pro                | Google        | 1M      |      $1.25 |      $10.00 | ✅        | ✅        |
| Gemini 2.5 Flash              | Google        | 1M      |      $0.15 |       $0.60 | ✅        | ✅        |
| Llama 4 Maverick              | Meta          | 1M      |          — |           — | ✅        | ❌        |
| Qwen3-235B-A22B               | Alibaba Cloud | 128K\*  |      ¥1.00 |       ¥4.00 | ✅        | ✅        |
| DeepSeek-V3                   | DeepSeek      | 128K    |      $0.27 |       $1.10 | ✅        | ❌        |

\*Note: Some models have different context limits on different platforms. Check the specific provider's YAML file for exact values.

## Best Value per Context Tier

### 1M+ tokens (cheapest)

| Model            | Provider    |         Input $/1M | Output $/1M |
| ---------------- | ----------- | -----------------: | ----------: |
| Llama 4 Scout    | OpenRouter  |              $0.08 |       $0.30 |
| Gemini 2.5 Flash | Google      |              $0.15 |       $0.60 |
| Llama 4 Scout    | Together AI |              $0.15 |       $0.60 |
| Llama 4 Scout    | Meta        | Free (open-weight) |           — |

### 128K–256K tokens (cheapest)

| Model         | Provider      | Input $/1M | Output $/1M |
| ------------- | ------------- | ---------: | ----------: |
| DeepSeek-V3   | DeepSeek      |      $0.27 |       $1.10 |
| Qwen3-30B-A3B | Alibaba Cloud |      ¥0.10 |       ¥0.30 |
| Phi-4         | Microsoft     |      $0.10 |       $0.40 |
| Gemma 3 27B   | Google        |      $0.20 |       $0.80 |

## Key Takeaways

- **Llama 4 Scout** has the largest context window at **10M tokens** — 10x more than any other model
- **1M+ context** is now available from 6+ providers, including free open-weight models
- **128K context** is the most common tier (1,310 models) — sufficient for most use cases
- **Cost scales with context**: 1M+ context models cost 2–10x more per token than 128K models
- **Cache read pricing** can reduce costs significantly for repeated queries (up to 90% discount)
