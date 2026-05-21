# 大上下文模型

[English](../large-context-models.md)

具有 **128K+ token 上下文窗口**的 AI 模型 — 在单个请求中处理整个代码库、长文档和多小时对话。

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models)。

## 为什么大上下文很重要

大上下文窗口解锁了小模型无法实现的能力：

- **完整代码库分析** — 在一个提示中理解整个仓库
- **文档处理** — 无需分块即可分析 100+ 页 PDF
- **多轮对话** — 在长聊天会话中保持上下文
- **数据分析** — 在单个请求中处理大型数据集
- **法律/医疗审查** — 审查冗长的合同和医疗记录
- **内容创作** — 在长篇写作中保持一致性

## 统计

| 指标                 | 数量 |
| -------------------- | ---- |
| 大上下文模型 (128K+) | 2195 |
| 256K+ 上下文         | 861  |
| 1M+ 上下文           | 397  |
| 提供商               | 78   |
| 免费大上下文模型     | 51   |
| 带工具调用           | 1637 |

## 提供商

`302ai`、`ai21`、`aimlapi`、`aion`、`alibaba`、`amazon`、`amazon-bedrock`、`anthropic`、`arcee`、`auriko`、`baichuan`、`baidu`、`baseten`、`bytedance`、`cerebras`、`chutes`、`clarifai`、`cloudferro-sherlock`、`cloudflare`、`databricks`、`deepinfra`、`deepseek`、`digitalocean`、`dinference`、`evroc` 等 53 个

## 最大上下文窗口

可用上下文窗口最大的模型。

| 模型                           | 提供商     | 上下文 | 输入 $/M | 输出 $/M | 能力     |
| ------------------------------ | ---------- | ------ | -------- | -------- | -------- |
| meta-llama--llama-4-scout      | openrouter | 10M    | $0.08    | $0.3     | 🔧 📋    |
| meta-llama-4-scout             | meta       | 10M    | $0.17    | $0.66    | 🔧       |
| gemini-1.5-pro                 | google     | 2M     | $1.25    | $5       | 🔧 📋    |
| grok-code-fast-1               | jiekou     | 2M     | $0.19    | $0.475   | 🔧       |
| gpt-4o                         | jiekou     | 2M     | $1.9     | $5.7     | 🔧       |
| grok-4.20-0309-non-reasoning   | jiekou     | 2M     | $0.19    | $0.475   | 🔧       |
| grok-4.20-0309-reasoning       | jiekou     | 2M     | $1.9     | $5.7     | 🔧       |
| grok-4-1-fast-reasoning        | jiekou     | 2M     | $0.19    | $0.475   | 🔧       |
| grok-4-fast-reasoning          | jiekou     | 2M     | $0.19    | $0.475   | 🔧       |
| x-ai--grok-4-fast              | fastrouter | 2M     | $0.2     | $0.5     | 🔧       |
| x-ai--grok-4.1-fast            | fastrouter | 2M     | $0.2     | $0.5     | 🔧       |
| xai--grok-4-fast-reasoning     | aimlapi    | 2M     | $0.52    | $1.3     | 🔧       |
| xai--grok-4-fast-non-reasoning | aimlapi    | 2M     | $0.52    | $1.3     | 🔧       |
| grok-4-20-multi-agent          | venice     | 2M     | $1.42    | $2.83    | 🧠 📋    |
| grok-4-20                      | venice     | 2M     | $1.42    | $2.83    | 🔧 🧠 📋 |

## 最便宜的 1M+ 上下文模型

1M+ token 上下文的最佳性价比模型 — 处理超长输入。

| 模型                              | 提供商        | 上下文 | 输入 $/M | 输出 $/M | 能力     |
| --------------------------------- | ------------- | ------ | -------- | -------- | -------- |
| gemini-1.5-flash-8b               | deepinfra     | 1M     | $0.0375  | $0.15    |          |
| gpt-5-nano                        | meganova      | 1M     | $0.04    | $0.32    | 🔧       |
| qwen--qwen3.5-flash-02-23         | openrouter    | 1M     | $0.065   | $0.26    | 🔧 🧠 📋 |
| google--gemini-2.0-flash-lite-001 | openrouter    | 1M     | $0.075   | $0.3     | 🔧 📋    |
| google--gemini-2.0-flash-lite-001 | fastrouter    | 1M     | $0.075   | $0.3     | 🔧       |
| gemini-1.5-flash                  | deepinfra     | 1M     | $0.075   | $0.3     |          |
| gemini-2.0-flash-lite             | google        | 1M     | $0.075   | $0.3     | 🔧 📋    |
| gemini-1.5-flash                  | google        | 1M     | $0.075   | $0.3     | 🔧 📋    |
| gemini-1.5-flash-8b               | google        | 1M     | $0.075   | $0.3     | 🔧 📋    |
| gemini-2-0-flash-lite             | google-vertex | 1M     | $0.075   | $0.3     | 🔧       |

## 免费大上下文模型

128K+ 上下文的免费模型 — 零成本长文档处理。

| 模型                                     | 提供商     | 上下文 | 输入 $/M | 输出 $/M | 能力     |
| ---------------------------------------- | ---------- | ------ | -------- | -------- | -------- |
| openrouter--owl-alpha                    | openrouter | 1M     | Free     | Free     | 🔧 📋    |
| deepseek--deepseek-v4-flash--free        | openrouter | 1M     | Free     | Free     | 🔧 🧠    |
| google--lyria-3-clip-preview             | openrouter | 1M     | Free     | Free     | 📋       |
| google--lyria-3-pro-preview              | openrouter | 1M     | Free     | Free     | 📋       |
| qwen--qwen3-coder--free                  | openrouter | 1M     | Free     | Free     | 🔧       |
| nvidia--nemotron-3-super-120b-a12b--free | openrouter | 1M     | Free     | Free     | 🔧 🧠 📋 |
| google--gemma-4-26b-a4b-it--free         | openrouter | 262K   | Free     | Free     | 🔧 🧠 📋 |
| arcee-ai--trinity-large-thinking--free   | openrouter | 262K   | Free     | Free     | 🔧 🧠    |
| google--gemma-4-31b-it--free             | openrouter | 262K   | Free     | Free     | 🔧 🧠 📋 |
| gemma-4-26b-a4b-it                       | auriko     | 262K   | Free     | Free     | 🔧 🧠 📋 |

## 上下文窗口层级

| 层级 | 上下文 | 用例               | 示例模型                  |
| ---- | ------ | ------------------ | ------------------------- |
| 标准 | 128K   | 长文档、代码文件   | gpt-4.1, claude-sonnet-4  |
| 扩展 | 256K   | 代码库、多文件分析 | claude-opus-4, o3         |
| 超大 | 1M     | 完整仓库、书籍     | gemini-2.5-flash, gpt-4.1 |
| 巨型 | 10M    | 整个数据集、视频   | llama-4-scout             |

## 相关文档

- [上下文窗口](context-windows.md) — 详细的上下文窗口对比
- [聊天模型](chat-models.md) — 2,350 个支持工具调用的聊天模型
- [代码模型](code-models.md) — 189 个代码模型
- [免费 AI 模型](free-models.md) — 81 个免费模型按能力分类
- [模型选择指南](model-selection.md) — 选择模型的决策框架
- [迁移指南](migration-guide.md) — 切换提供商
- [提供商对比](provider-comparison.md) — 前 30 个提供商

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
