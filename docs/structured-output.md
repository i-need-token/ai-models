**English** | [中文](./zh/structured-output.md)

# AI Structured Output Models (JSON Mode)

829 models in this catalog support structured output — the ability to generate responses that conform to a specified JSON schema. This is essential for building reliable AI-powered APIs, data pipelines, and automation.

> All data sourced from first-party APIs and documentation. "Structured output" means the model can enforce a JSON schema on its response (also known as JSON mode, constrained decoding, or guided generation).

## Quick Stats

| Capability                     | Structured Output Models |
| ------------------------------ | -----------------------: |
| Total structured output models |                      829 |
| Unique model IDs               |                      704 |
| With tool calling              |                      749 |
| With reasoning                 |                      473 |
| With vision                    |                      411 |
| Open-weight                    |                       24 |

## Cheapest Structured Output Models

Best value for generating reliable JSON responses:

| Model                 | Provider   | Input $/1M | Output $/1M | Context | Tool Call | Reasoning |
| --------------------- | ---------- | ---------: | ----------: | ------- | --------- | --------- |
| Ernie 4.5 0.3B        | AIHubMix   |    $0.0068 |     $0.0272 | —       | ✅        | ❌        |
| Ling 2.6 Flash        | OpenRouter |      $0.01 |       $0.03 | 262K    | ✅        | ❌        |
| Qwen3 VL Flash        | AIHubMix   |    $0.0103 |      $0.103 | —       | ✅        | ❌        |
| Llama 3.1 8B Instruct | Auriko     |      $0.02 |       $0.03 | 131K    | ✅        | ❌        |
| Mistral Nemo          | OpenRouter |      $0.02 |       $0.02 | —       | ✅        | ❌        |
| Doubao Seed 1.6 Flash | AIHubMix   |     $0.022 |      $0.022 | —       | ✅        | ❌        |
| GPT-5 Nano            | AIHubMix   |     $0.025 |       $0.20 | —       | ✅        | ✅        |
| GPT-OSS 20B           | NeuralWatt |      $0.03 |       $0.03 | —       | ✅        | ✅        |
| Granite 4.0 H Micro   | Cloudflare |     $0.017 |      $0.112 | 131K    | ✅        | ❌        |
| Gemini 2.5 Flash Lite | Google     |      $0.10 |       $0.60 | 1M      | ✅        | ✅        |

## Free Structured Output Models

24 models offer free structured output — ideal for prototyping:

| Model                     | Provider   | Context | Tool Call | Reasoning |
| ------------------------- | ---------- | ------- | --------- | --------- |
| Ernie 4.5 0.3B            | AIMLAPI    | —       | ✅        | ❌        |
| Gemma 4 26B A4B IT        | Auriko     | —       | ✅        | ✅        |
| Gemma 4 31B IT            | Auriko     | —       | ✅        | ❌        |
| Qwen3 Omni 30B A3B        | NovitaAI   | —       | ✅        | ✅        |
| Dolphin Mistral 24B       | OpenRouter | —       | ✅        | ❌        |
| Gemma 4 26B A4B IT (free) | OpenRouter | —       | ✅        | ✅        |
| Gemma 4 31B IT (free)     | OpenRouter | —       | ✅        | ❌        |

## Best Structured Output + Tool Calling + Reasoning

For AI agents that need to return structured data, call tools, and reason:

| Model                 | Context | Input $/1M | Tool Call | Reasoning | Providers |
| --------------------- | ------- | ---------: | --------- | --------- | --------: |
| Grok 4 Fast Reasoning | 2M      |      $0.20 | ✅        | ✅        |         2 |
| Gemini 2.5 Flash      | 1M      |      $0.15 | ✅        | ✅        |         3 |
| Gemini 2.5 Pro        | 1M      |      $1.25 | ✅        | ✅        |         4 |
| GPT-5.4               | 1M      |      $2.50 | ✅        | ✅        |         4 |
| DeepSeek Reasoner     | 1M      |      $0.43 | ✅        | ✅        |         1 |
| GPT-5 Nano            | —       |     $0.025 | ✅        | ✅        |         4 |

## Key Takeaways

- **829 structured output models** — the largest catalog of JSON-mode models
- **749 models** combine structured output with tool calling — perfect for AI agents
- **24 free models** support structured output — start building at zero cost
- **Gemini 2.5 Flash** is the best value: 1M context, structured output, tool calling, and reasoning for $0.15/1M
- Small models (Ernie 4.5 0.3B, Ling 2.6 Flash) cost as little as $0.01/1M with structured output
- 91% of structured output models also support tool calling — these capabilities go hand-in-hand
