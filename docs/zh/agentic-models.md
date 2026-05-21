# 智能体模型

[English](../agentic-models.md)

同时具备**工具调用**和**推理**能力的 AI 模型 — 构建 AI Agent 的关键要求。这些模型可以规划、推理多步骤任务，并使用外部工具完成目标。

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models)。

## 为什么智能体模型很重要

智能体模型结合了两个关键能力：

- **工具调用** — 调用函数、API 和外部工具来执行操作
- **推理** — 链式思维思考，规划和分解复杂任务

两者结合可以实现：

- **自主智能体** — 独立规划、行动和迭代的模型
- **多步骤工作流** — 将复杂任务分解为子任务并使用工具
- **自我纠正** — 推理失败原因并使用不同方法重试
- **代码智能体** — 自主编写、执行和调试代码
- **研究智能体** — 搜索、综合和总结信息

## 统计

| 指标                          | 数量 |
| ----------------------------- | ---- |
| 智能体模型（工具调用 + 推理） | 1080 |
| 提供商                        | 51   |
| 免费智能体模型                | 0    |
| 开源权重智能体模型            | 65   |
| 带结构化输出                  | 455  |

## 提供商

`302ai`, `aihubmix`, `alibaba`, `amazon`, `anthropic`, `arcee`, `auriko`, `baidu`, `baseten`, `bytedance`, `chutes`, `clarifai`, `cloudflare`, `cortecs`, `deepseek`, `digitalocean`, `dinference`, `fastrouter`, `fireworks`, `google`, `hpc-ai`, `inclusionai`, `inferencenet`, `klusterai`, `llmgateway` 等 26 个

## 免费智能体模型

同时具备工具调用和推理的免费模型 — 零成本 Agent。

| 模型 | 提供商 | 上下文 | 输入 $/M | 输出 $/M | 能力 |
| ---- | ------ | ------ | -------- | -------- | ---- |

## 最便宜智能体模型

生产环境 Agent 的最佳性价比模型。

| 模型                    | 提供商     | 上下文 | 输入 $/M | 输出 $/M | 能力 |
| ----------------------- | ---------- | ------ | -------- | -------- | ---- |
| qwen-3.5-0.8b           | auriko     | 262K   | $0.01    | $0.05    |      |
| llama-3.1-8b-instruct   | cortecs    | 0      | $0.018   | $0.054   |      |
| qwen-3.5-2b             | auriko     | 262K   | $0.02    | $0.1     |      |
| openai--gpt-5-nano:flex | requesty   | 400K   | $0.025   | $0.2     |      |
| gpt-5-nano              | aihubmix   | 0      | $0.025   | $0.2     | 📋   |
| gpt-oss-20b             | cortecs    | 0      | $0.027   | $0.124   |      |
| qwen--qwen3-4b-fp8      | novitaai   | 128K   | $0.03    | $0.03    |      |
| openai--gpt-oss-20b     | openrouter | 131K   | $0.03    | $0.14    | 📋   |
| qwen-3.5-4b             | auriko     | 262K   | $0.03    | $0.15    |      |
| openai--gpt-oss-20b     | neuralwatt | 0      | $0.03    | $0.16    | 📋   |

## 大上下文智能体模型

上下文窗口最大的智能体模型 — 适用于复杂多步骤任务。

| 模型                          | 提供商   | 上下文 | 输入 $/M | 输出 $/M | 能力 |
| ----------------------------- | -------- | ------ | -------- | -------- | ---- |
| grok-4-20                     | venice   | 2M     | $1.42    | $2.83    | 📋   |
| grok-4.20-beta-0309-reasoning | 302ai    | 2M     | $2       | $6       |      |
| grok-4-1-fast-reasoning       | 302ai    | 2M     | $0.2     | $0.5     |      |
| grok-4-fast-reasoning         | 302ai    | 2M     | $0.2     | $0.5     |      |
| openai--gpt-5.5               | requesty | 1M     | $5       | $30      |      |
| openai-responses--gpt-5.4     | requesty | 1M     | $2.5     | $15      |      |
| openai-responses--gpt-5.5     | requesty | 1M     | $5       | $30      |      |
| openai--gpt-5.4               | requesty | 1M     | $2.5     | $15      |      |
| openai-responses--gpt-5.4-pro | requesty | 1M     | $30      | $180     |      |
| openai-responses--gpt-5.5-pro | requesty | 1M     | $30      | $180     |      |

## 相关文档

- [模型选择指南](model-selection.md) — 选择模型的决策框架
- [工具调用模型](tool-calling.md) — 2,350 个支持工具调用的模型
- [推理模型](reasoning-models.md) — 1,306 个支持推理的模型
- [代码模型](code-models.md) — 189 个代码模型
- [结构化输出](structured-output.md) — 829 个 JSON 模式模型
- [免费 AI 模型](free-models.md) — 81 个免费模型按能力分类
- [缓存定价](cached-pricing.md) — 1,374 个支持提示缓存的模型

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
