**English** | [中文](./zh/agentic-models.md)

# Agentic AI Models — 1,080 Models for AI Agents

Models with **tool calling + reasoning** capabilities — the essential building blocks for AI agents, autonomous workflows, and multi-step task execution. All data sourced from first-party APIs via the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## What Makes a Model "Agentic"?

An agentic model can:

- **Call tools/functions** — interact with APIs, databases, and external systems
- **Reason step-by-step** — plan, decompose tasks, and verify results
- **Act autonomously** — make decisions and take actions without human intervention

These capabilities are what separate chatbots from AI agents.

## Stats

| Metric                 | Count |
| ---------------------- | ----- |
| Agentic models         | 1076  |
| Providers              | 51    |
| With vision            | 617   |
| With structured output | 453   |
| Free                   | 30    |
| Open weights           | 64    |

## Cheapest Agentic Models (Direct Providers)

| Model                          | Provider     | Context | Input $/1M | Output $/1M | Vision |
| ------------------------------ | ------------ | ------- | ---------- | ----------- | ------ |
| qwen--qwen3-4b-fp8             | novitaai     | 125K    | $0.03      | $0.03       |        |
| openai--gpt-oss-20b            | neuralwatt   | 0       | $0.03      | $0.16       |        |
| openai--gpt-oss-120b           | novitaai     | 128K    | $0.05      | $0.25       | ✅     |
| gpt-oss-120b                   | inferencenet | 128K    | $0.05      | $0.45       |        |
| Qwen--Qwen3.6-35B-A3B          | neuralwatt   | 0       | $0.05      | $0.1        | ✅     |
| qwen3-30b-a3b-fp8              | cloudflare   | 40K     | $0.051     | $0.335      |        |
| glm-4.7-flash                  | cloudflare   | 128K    | $0.06      | $0.4        |        |
| Nemotron-3-Nano-Omni           | nebius       | 125K    | $0.06      | $0.24       | ✅     |
| hermes-4-llama-3.1-8b          | nousresearch | 128K    | $0.06      | $0.12       |        |
| zai-org--glm-4.7-flash         | novitaai     | 195K    | $0.07      | $0.4        |        |
| ring-2.6-1t                    | inclusionai  | 256K    | $0.07      | $0.62       |        |
| seed-1.6-flash                 | bytedance    | 256K    | $0.07      | $0.3        | ✅     |
| microsoft-phi-4-mini-reasoning | microsoft    | 125K    | $0.075     | $0.3        |        |
| Qwen--Qwen3-32B-TEE            | chutes       | 40K     | $0.08      | $0.24       |        |
| qwen--qwen3-30b-a3b-fp8        | novitaai     | 40K     | $0.09      | $0.45       |        |

## Free Agentic Models

| Model                             | Provider | Context | Vision | Structured Output |
| --------------------------------- | -------- | ------- | ------ | ----------------- |
| glm-4.1v-thinking-flash           | zhipuai  | 62K     | ✅     | ✅                |
| qwen--qwen3-omni-30b-a3b-thinking | novitaai | 64K     | ✅     | ✅                |
| qwen--qwen3.5-4b-free             | mixlayer | 128K    |        |                   |

## Largest Context Agentic Models

| Model                       | Provider    | Context | Input $/1M | Output $/1M |
| --------------------------- | ----------- | ------- | ---------- | ----------- |
| deepseek-v4-flash           | baidu       | 1024K   | $0.126     | $0.252      |
| deepseek-v4-pro             | siliconflow | 1024K   | $1.74      | $3.48       |
| deepseek-v4-flash           | siliconflow | 1024K   | $0.14      | $0.28       |
| deepseek--deepseek-v4-pro   | novitaai    | 1024K   | $1.67      | $3.38       |
| xiaomimimo--mimo-v2.5-pro   | novitaai    | 1024K   | $2         | $6          |
| deepseek--deepseek-v4-flash | novitaai    | 1024K   | $0.14      | $0.28       |
| gemini-2.5-flash            | google      | 1024K   | $0.15      | $3.5        |
| gemini-2.5-pro              | google      | 1024K   | $1.25      | $10         |
| deepseek-v4-pro             | fireworks   | 1024K   | $1.74      | $3.48       |
| xiaomi--mimo-v2.5-pro       | hpc-ai      | 1024K   | $1         | $3          |
| xiaomi--mimo-v2.5           | hpc-ai      | 1024K   | $0.4       | $2          |
| mimo-v2.5-pro               | xiaomi      | 1024K   | $1         | $3          |
| mimo-v2-pro                 | xiaomi      | 1024K   | $1         | $3          |
| minimaxai--minimax-m1-80k   | novitaai    | 976K    | $0.55      | $2.2        |
| qwen3.6-flash               | alibaba     | 976K    | $1.2       | $7.2        |

## Building AI Agents

| Agent Type       | Recommended Models          | Key Capabilities               |
| ---------------- | --------------------------- | ------------------------------ |
| Code agents      | Claude Sonnet 4, GPT-4.1    | Tool call + reasoning + code   |
| Research agents  | Gemini 2.5 Pro, DeepSeek R1 | Large context + reasoning      |
| Data agents      | Claude Sonnet 4, Qwen3      | Structured output + tool call  |
| Vision agents    | GPT-4o, Gemini 2.5 Flash    | Vision + tool call + reasoning |
| Customer support | Llama 4 Scout, Qwen3        | Free/cheap + tool call         |

## Related Documentation

- [Tool Calling Models](tool-calling.md) — 2,350 models with function calling
- [Reasoning Models](reasoning-models.md) — 1,306 models with chain-of-thought
- [Structured Output](structured-output.md) — 829 models with JSON mode
- [OpenAI Alternatives](openai-alternatives.md) — GPT-4 alternatives with agent capabilities
- [Vision Models](vision-models.md) — 1,487 models with image understanding
- [Free AI Models](free-models.md) — 81 models at zero cost

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
