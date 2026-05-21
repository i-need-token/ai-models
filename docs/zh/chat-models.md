# 聊天模型

[English](../chat-models.md)

支持**工具调用**的 AI 模型 — 构建聊天应用、AI 助手和对话智能体的核心能力。这些模型可以理解自然语言、生成回复并调用外部工具。

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models)。

## 为什么聊天模型很重要

聊天模型是现代 AI 应用的基石：

- **对话式 AI** — 带上下文的自然语言对话
- **AI 助手** — 面向任务的聊天与工具使用
- **客户支持** — 带知识库访问的自动化支持
- **内容生成** — 写作、摘要、翻译
- **数据分析** — 自然语言查询结构化数据

工具调用是关键差异化能力 — 它允许模型超越文本生成，在现实世界中采取行动。

## 统计

| 指标                     | 数量 |
| ------------------------ | ---- |
| 聊天模型（支持工具调用） | 2350 |
| 提供商                   | 71   |
| 免费聊天模型             | 54   |
| 开源权重聊天模型         | 278  |
| 带推理能力               | 1080 |
| 带结构化输出             | 758  |

## 提供商

`01ai`, `302ai`, `aihubmix`, `aimlapi`, `alibaba`, `amazon`, `amazon-bedrock`, `anthropic`, `arcee`, `auriko`, `baidu`, `baseten`, `berget`, `bytedance`, `cerebras`, `chutes`, `clarifai`, `cloudferro-sherlock`, `cloudflare`, `cortecs`, `databricks`, `deepseek`, `digitalocean`, `dinference`, `evroc` 等 46 个

## 免费聊天模型

支持工具调用的免费模型 — 零成本聊天应用。

| 模型                                                 | 提供商     | 上下文 | 输入 $/M | 输出 $/M | 能力  |
| ---------------------------------------------------- | ---------- | ------ | -------- | -------- | ----- |
| openrouter--owl-alpha                                | openrouter | 1M     | Free     | Free     | 📋    |
| deepseek--deepseek-v4-flash--free                    | openrouter | 1M     | Free     | Free     | 🧠    |
| qwen--qwen3-coder--free                              | openrouter | 1M     | Free     | Free     |       |
| nvidia--nemotron-3-super-120b-a12b--free             | openrouter | 1M     | Free     | Free     | 🧠 📋 |
| google--gemma-4-26b-a4b-it--free                     | openrouter | 262K   | Free     | Free     | 🧠 📋 |
| arcee-ai--trinity-large-thinking--free               | openrouter | 262K   | Free     | Free     | 🧠    |
| google--gemma-4-31b-it--free                         | openrouter | 262K   | Free     | Free     | 🧠 📋 |
| gemma-4-26b-a4b-it                                   | auriko     | 262K   | Free     | Free     | 🧠 📋 |
| gemma-4-31b-it                                       | auriko     | 262K   | Free     | Free     | 🧠 📋 |
| nvidia--nemotron-3-nano-omni-30b-a3b-reasoning--free | openrouter | 256K   | Free     | Free     | 🧠    |

## 最便宜聊天模型

生产环境聊天的最佳性价比模型。

| 模型                                        | 提供商       | 上下文 | 输入 $/M | 输出 $/M | 能力 |
| ------------------------------------------- | ------------ | ------ | -------- | -------- | ---- |
| ernie-4.5-0.3b                              | aihubmix     | 0      | $0.0068  | $0.0272  | 📋   |
| bdc-coder                                   | inferencenet | 131K   | $0.01    | $0.01    | 🔓   |
| inclusionai--ling-2.6-flash                 | openrouter   | 262K   | $0.01    | $0.03    | 📋   |
| ling-2.6-flash                              | inclusionai  | 262K   | $0.01    | $0.03    |      |
| qwen-3.5-0.8b                               | auriko       | 262K   | $0.01    | $0.05    | 🧠   |
| qwen3-vl-flash-2026-01-22                   | aihubmix     | 0      | $0.0103  | $0.103   | 📋   |
| qwen3-vl-flash                              | aihubmix     | 0      | $0.0103  | $0.103   | 📋   |
| klusterai--Meta-Llama-3.1-8B-Instruct-Turbo | klusterai    | 131K   | $0.015   | $0.02    |      |
| granite-4.0-h-micro                         | cloudflare   | 131K   | $0.017   | $0.112   | 🔓   |
| llama-3.1-8b-instruct                       | cortecs      | 0      | $0.018   | $0.054   | 🧠   |

## 大上下文聊天模型

上下文窗口最大的聊天模型 — 适用于长对话和文档分析。

| 模型                         | 提供商     | 上下文 | 输入 $/M | 输出 $/M | 能力 |
| ---------------------------- | ---------- | ------ | -------- | -------- | ---- |
| meta-llama--llama-4-scout    | openrouter | 10M    | $0.08    | $0.3     | 📋   |
| meta-llama-4-scout           | meta       | 10M    | $0.17    | $0.66    |      |
| gemini-1.5-pro               | google     | 2M     | $1.25    | $5       | 📋   |
| grok-code-fast-1             | jiekou     | 2M     | $0.19    | $0.475   |      |
| gpt-4o                       | jiekou     | 2M     | $1.9     | $5.7     |      |
| grok-4.20-0309-non-reasoning | jiekou     | 2M     | $0.19    | $0.475   |      |
| grok-4.20-0309-reasoning     | jiekou     | 2M     | $1.9     | $5.7     |      |
| grok-4-1-fast-reasoning      | jiekou     | 2M     | $0.19    | $0.475   |      |
| grok-4-fast-reasoning        | jiekou     | 2M     | $0.19    | $0.475   |      |
| x-ai--grok-4-fast            | fastrouter | 2M     | $0.2     | $0.5     |      |

## 相关文档

- [智能体模型](agentic-models.md) — 1,080 个具备工具调用 + 推理能力的模型
- [推理模型](reasoning-models.md) — 1,306 个支持推理的模型
- [代码模型](code-models.md) — 189 个代码模型
- [免费 AI 模型](free-models.md) — 81 个免费模型按能力分类
- [结构化输出](structured-output.md) — 829 个 JSON 模式模型
- [模型选择指南](model-selection.md) — 选择模型的决策框架
- [缓存定价](cached-pricing.md) — 1,374 个支持提示缓存的模型

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
