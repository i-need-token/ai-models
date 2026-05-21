**English** | [中文](./zh/openai-alternatives.md)

# OpenAI Alternatives — GPT-4, GPT-3.5, and Beyond

Comprehensive guide to AI models comparable to OpenAI's GPT-4, GPT-4o, and GPT-3.5 Turbo — with pricing, capabilities, and API compatibility. All data sourced from first-party APIs via the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Quick Comparison: GPT-4 Class Alternatives

Models with **tool calling + reasoning + vision** (the full GPT-4 capability set):

| Model                         | Provider   | Context | Input $/1M | Output $/1M | Open Weights |
| ----------------------------- | ---------- | ------- | ---------- | ----------- | ------------ |
| openai--gpt-oss-120b          | novitaai   | 128K    | $0.05      | $0.25       |              |
| Qwen--Qwen3.6-35B-A3B         | neuralwatt | 0       | $0.05      | $0.1        |              |
| Nemotron-3-Nano-Omni          | nebius     | 125K    | $0.06      | $0.24       | ✅           |
| seed-1.6-flash                | bytedance  | 256K    | $0.07      | $0.3        |              |
| gemma-4-26b-a4b-it            | cloudflare | 256K    | $0.1       | $0.3        | ✅           |
| Gemma-3-27b-it                | nebius     | 93K     | $0.1       | $0.3        | ✅           |
| seed-2.0-mini                 | bytedance  | 256K    | $0.1       | $0.4        |              |
| google--gemma-4-26b-a4b-it    | novitaai   | 256K    | $0.13      | $0.4        |              |
| google--gemma-4-31B-turbo-TEE | chutes     | 128K    | $0.13      | $0.38       |              |
| baidu--ernie-4.5-vl-28b-a3b   | novitaai   | 29K     | $0.14      | $0.56       |              |
| google--gemma-4-31b-it        | novitaai   | 256K    | $0.14      | $0.4        |              |
| amazon-nova-2.0-lite          | amazon     | 62K     | $0.15      | $1.25       |              |
| gemini-2.5-flash              | google     | 1024K   | $0.15      | $3.5        |              |
| amazon-nova-2.0-omni          | amazon     | 62K     | $0.2       | $1.3        |              |
| xai-grok-4.1                  | xai        | 128K    | $0.2       | $0.5        |              |

> Full list: 617 models with tool calling + reasoning + vision across 50+ providers. See [Agentic Models](agentic-models.md) for the complete catalog.

## Cheapest Tool-Calling Models

Best value models with function/tool calling (direct providers only):

| Model                                       | Provider       | Context | Input $/1M | Output $/1M |
| ------------------------------------------- | -------------- | ------- | ---------- | ----------- |
| ling-2.6-flash                              | inclusionai    | 256K    | $0.01      | $0.03       |
| bdc-coder                                   | inferencenet   | 128K    | $0.01      | $0.01       |
| klusterai--Meta-Llama-3.1-8B-Instruct-Turbo | klusterai      | 127K    | $0.015     | $0.02       |
| granite-4.0-h-micro                         | cloudflare     | 128K    | $0.017     | $0.112      |
| schematron-v3                               | inferencenet   | 128K    | $0.02      | $0.05       |
| schematron-3b                               | inferencenet   | 128K    | $0.02      | $0.05       |
| llama-3.1-8b-instruct--fp-16                | inferencenet   | 128K    | $0.02      | $0.03       |
| liquid-ai--LFM2-24B-A2B                     | togetherai     | 128K    | $0.03      | $0.12       |
| qwen--qwen3-4b-fp8                          | novitaai       | 125K    | $0.03      | $0.03       |
| schematron-v2-turbo                         | inferencenet   | 128K    | $0.03      | $0.15       |
| gpt-oss-20b                                 | inferencenet   | 128K    | $0.03      | $0.15       |
| openai--gpt-oss-20b                         | neuralwatt     | 0       | $0.03      | $0.16       |
| amazon-nova-micro                           | amazon         | 125K    | $0.035     | $0.14       |
| amazon-nova-micro                           | amazon-bedrock | 125K    | $0.035     | $0.14       |
| mistral-nemo-12b-instruct--fp-8             | inferencenet   | 128K    | $0.0375    | $0.1        |

> Full list: 2,350 tool-calling models across 67 providers. See [Tool Calling Models](tool-calling.md).

## Free Alternatives to GPT-4

Models with tool calling at zero cost (direct providers):

| Model                             | Provider | Context | Capabilities                 |
| --------------------------------- | -------- | ------- | ---------------------------- |
| glm-4.7-flash                     | zhipuai  | 195K    | Tool Call                    |
| glm-4.1v-thinking-flash           | zhipuai  | 62K     | Reasoning, Vision, Tool Call |
| glm-4-flash-250414                | zhipuai  | 125K    | Tool Call                    |
| glm-4v-flash                      | zhipuai  | 15K     | Vision, Tool Call            |
| autoglm-phone                     | zhipuai  | 19K     | Vision, Tool Call            |
| glm-ocr                           | zhipuai  | 0       | Vision, Tool Call            |
| glm-4.6v-flash                    | zhipuai  | 125K    | Vision, Tool Call            |
| cobuddy                           | baidu    | 128K    | Tool Call                    |
| qwen--qwen3-omni-30b-a3b-instruct | novitaai | 64K     | Vision, Tool Call            |
| qwen--qwen3-omni-30b-a3b-thinking | novitaai | 64K     | Reasoning, Vision, Tool Call |
| baidu--ernie-4.5-0.3b             | aimlapi  | 117K    | Tool Call                    |
| qwen--qwen3.5-4b-free             | mixlayer | 128K    | Reasoning, Tool Call         |
| llama-4-scout-17b-16e-instruct    | cerebras | 128K    | Tool Call                    |
| qwen-2.5-32b                      | cerebras | 128K    | Tool Call                    |
| llama-3.3-70b                     | cerebras | 128K    | Tool Call                    |

> Full list: 81 free models. See [Free AI Models](free-models.md).

## Largest Context Windows with Tool Calling

| Model                                              | Provider    | Context | Input $/1M | Output $/1M |
| -------------------------------------------------- | ----------- | ------- | ---------- | ----------- |
| meta-llama-4-scout                                 | meta        | 9765K   | $0.17      | $0.66       |
| xai--grok-4-fast-reasoning                         | aimlapi     | 1953K   | $0.52      | $1.3        |
| xai--grok-4-fast-non-reasoning                     | aimlapi     | 1953K   | $0.52      | $1.3        |
| meta-llama--Llama-4-Maverick-17B-128E-Instruct-FP8 | gmicloud    | 1024K   | $0.25      | $0.8        |
| minimax-m2-5                                       | baseten     | 1024K   | $0.3       | $1.2        |
| deepseek-v4-flash                                  | baidu       | 1024K   | $0.126     | $0.252      |
| deepseek-v4-pro                                    | siliconflow | 1024K   | $1.74      | $3.48       |
| deepseek-v4-flash                                  | siliconflow | 1024K   | $0.14      | $0.28       |
| deepseek--deepseek-v4-pro                          | novitaai    | 1024K   | $1.67      | $3.38       |
| xiaomimimo--mimo-v2.5-pro                          | novitaai    | 1024K   | $2         | $6          |
| deepseek--deepseek-v4-flash                        | novitaai    | 1024K   | $0.14      | $0.28       |
| gemini-2.0-flash-lite                              | google      | 1024K   | $0.075     | $0.3        |
| gemini-2.5-flash                                   | google      | 1024K   | $0.15      | $3.5        |
| gemini-2.5-pro                                     | google      | 1024K   | $1.25      | $10         |
| gemini-2.0-flash                                   | google      | 1024K   | $0.1       | $0.4        |

> Full list: 2,195 models with 128K+ context. See [Large Context Models](large-context-models.md).

## OpenAI-Compatible Providers

70 providers offer OpenAI-compatible API endpoints — switch with minimal code changes:

| Provider        | API Endpoint                                 | Model Count | Free Tier |
| --------------- | -------------------------------------------- | ----------- | --------- |
| Regolo          | `https://api.regolo.ai/v1`                   | 1           | —         |
| MegaNova        | `https://api.meganova.ai/v1`                 | 1           | —         |
| GMI Cloud       | `https://api.gmi-serving.com/v1`             | 1           | —         |
| Cohere          | `https://api.cohere.com`                     | 1           | —         |
| Requesty        | `https://router.requesty.ai/v1`              | 1           | —         |
| 接口 AI         | `https://api.jiekou.ai/v1`                   | 1           | —         |
| Zhipu AI (智谱) | `https://open.bigmodel.cn/api/paas/v4`       | 1           | —         |
| SambaNova       | `https://api.sambanova.ai/v1`                | 1           | —         |
| Baseten         | `https://model-api.baseten.co/v1`            | 1           | —         |
| Wafer           | `https://pass.wafer.ai/v1`                   | 1           | —         |
| Arcee AI        | `https://api.arcee.ai/v1`                    | 1           | —         |
| Moonshot AI     | `https://api.moonshot.cn/v1`                 | 1           | —         |
| Amazon Nova     | `https://bedrock.us-east-1.amazonaws.com/v1` | 1           | —         |
| Baidu           | `https://qianfan.baidubce.com/v1`            | 1           | —         |
| Together AI     | `https://api.together.xyz/v1`                | 1           | —         |
| OpenRouter      | `https://openrouter.ai/api/v1`               | 1           | —         |
| FastRouter      | `https://api.fastrouter.ai/v1`               | 1           | —         |
| SubModel        | `https://api.submodel.ai/v1`                 | 1           | —         |
| Inception Labs  | `https://api.inceptionlabs.ai/v1`            | 1           | —         |
| SiliconFlow     | `https://api.siliconflow.cn/v1`              | 1           | —         |

> See [Migration Guide](migration-guide.md) for step-by-step instructions on switching from OpenAI.

## Choosing Your Alternative

| Need                          | Best Option                        | See                                         |
| ----------------------------- | ---------------------------------- | ------------------------------------------- |
| Cheapest tool calling         | DeepSeek, Qwen3                    | [Pricing Comparison](pricing-comparison.md) |
| GPT-4-level reasoning         | Claude Opus 4, Gemini 2.5 Pro      | [Reasoning Models](reasoning-models.md)     |
| Free for prototyping          | Google Gemini, Cloudflare          | [Free Models](free-models.md)               |
| Largest context               | Gemini 2.5 Pro (1M), Llama 4 (10M) | [Context Windows](context-windows.md)       |
| Open weights for self-hosting | Llama 4, Qwen3                     | [Open-Weight Models](open-weights.md)       |
| Easy migration from OpenAI    | Any OpenAI-compatible provider     | [Migration Guide](migration-guide.md)       |
| Running AI agents             | Models with tool_call + reasoning  | [Agentic Models](agentic-models.md)         |

## Related Documentation

- [Tool Calling Models](tool-calling.md) — 2,350 models with function calling
- [Reasoning Models](reasoning-models.md) — 1,306 models with chain-of-thought
- [Vision Models](vision-models.md) — 1,487 models with image understanding
- [Free AI Models](free-models.md) — 81 models at zero cost
- [Pricing Comparison](pricing-comparison.md) — side-by-side pricing across providers
- [Migration Guide](migration-guide.md) — switch providers with minimal code changes
- [Provider Comparison](provider-comparison.md) — top 30 providers by model count
- [Agentic Models](agentic-models.md) — 1,080 models for AI agents
- [Code Models](code-models.md) — 189 code-focused models

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
