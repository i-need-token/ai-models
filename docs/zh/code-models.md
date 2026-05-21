# 代码模型

[English](../code-models.md)

专为代码生成、代码理解和软件开发任务设计或优化的 AI 模型。包含来自 41 个提供商的代码能力模型。

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models)。

## 为什么代码模型很重要

代码模型针对以下场景优化：

- **代码生成** — 根据描述编写函数、类和完整程序
- **代码补全** — IDE 和编辑器中的自动补全建议
- **代码审查** — 识别 bug、安全问题和风格违规
- **代码解释** — 理解和文档化现有代码
- **代码翻译** — 在编程语言之间转换代码
- **测试生成** — 自动编写单元测试和集成测试

## 统计

| 指标             | 数量 |
| ---------------- | ---- |
| 代码模型         | 189  |
| 提供商           | 41   |
| 免费代码模型     | 0    |
| 开源权重代码模型 | 14   |
| 带推理           | 43   |
| 带工具调用       | 119  |
| 带结构化输出     | 43   |

## 提供商

`302ai`, `aihubmix`, `aimlapi`, `alibaba`, `amazon-bedrock`, `arcee`, `auriko`, `cerebras`, `clarifai`, `cloudflare`, `cortecs`, `databricks`, `deepinfra`, `digitalocean`, `fastrouter`, `gmicloud`, `google-vertex`, `hyperbolic`, `inception`, `inferencenet` 等 21 个

## 免费代码模型

零成本可用的代码模型 — 非常适合开发和原型验证。

| 模型 | 提供商 | 上下文 | 输入 $/M | 输出 $/M | 能力 |
| ---- | ------ | ------ | -------- | -------- | ---- |

## 最便宜代码模型

生产环境使用的最佳性价比代码模型。

| 模型                                        | 提供商       | 上下文 | 输入 $/M | 输出 $/M | 能力  |
| ------------------------------------------- | ------------ | ------ | -------- | -------- | ----- |
| bdc-coder                                   | inferencenet | 131K   | $0.01    | $0.01    | 🔧 🔓 |
| doubao-seed-code-preview-latest             | 302ai        | 131K   | $0.0515  | $0.343   | 🔧    |
| qwen3-coder-30b-a3b-instruct                | cortecs      | 0      | $0.053   | $0.222   | 🧠 🔧 |
| qwen--qwen2.5-coder-32b-instruct            | fastrouter   | 32K    | $0.06    | $0.15    |       |
| qwen3-coder-flash                           | aihubmix     | 0      | $0.068   | $0.272   | 🔧 📋 |
| deepinfra--qwen--qwen2.5-coder-32b-instruct | requesty     | 0      | $0.07    | $0.16    | 🔧    |
| Qwen3-Coder-30B-A3B-Instruct                | ovhcloud     | 262K   | $0.07    | $0.26    |       |
| qwen--qwen3-coder-30b-a3b-instruct          | martian      | 0      | $0.07    | $0.27    |       |
| qwen--qwen3-coder-30b-a3b-instruct          | novitaai     | 160K   | $0.07    | $0.27    | 🔧 📋 |
| qwen--qwen3-coder-30b-a3b-instruct          | openrouter   | 160K   | $0.07    | $0.27    | 🔧 📋 |

## 大上下文代码模型

上下文窗口最大的代码模型 — 适用于大型代码库。

| 模型                       | 提供商     | 上下文 | 输入 $/M | 输出 $/M | 能力  |
| -------------------------- | ---------- | ------ | -------- | -------- | ----- |
| grok-code-fast-1           | jiekou     | 2M     | $0.19    | $0.475   | 🔧    |
| qwen--qwen3-coder          | openrouter | 1M     | $0.22    | $1.8     | 🔧 📋 |
| qwen--qwen3-coder--free    | openrouter | 1M     | Free     | Free     | 🔧    |
| alibaba--qwen3-coder-flash | requesty   | 1M     | $0.3     | $1.5     | 🔧    |
| alibaba--qwen3-coder-plus  | requesty   | 1M     | $1       | $5       | 🔧    |
| gpt-5-3-codex              | meganova   | 1M     | $1.4     | $11.2    | 🔧    |
| qwen--qwen3-coder-flash    | openrouter | 1M     | $0.195   | $0.975   | 🔧 📋 |
| qwen--qwen3-coder-plus     | openrouter | 1M     | $0.65    | $3.25    | 🔧 📋 |
| gpt-5-codex                | 302ai      | 400K   | $1.25    | $10      | 🔧    |
| gpt-5.1-codex              | 302ai      | 400K   | $1.25    | $10      | 🔧    |

## 相关文档

- [模型选择指南](model-selection.md) — 选择模型的决策框架
- [工具调用模型](tool-calling.md) — 2,350 个支持工具调用的模型
- [推理模型](reasoning-models.md) — 1,306 个支持推理的模型
- [结构化输出](structured-output.md) — 829 个 JSON 模式模型
- [免费 AI 模型](free-models.md) — 81 个免费模型按能力分类
- [开源权重模型](open-weights.md) — 527 个可自行运行的模型
- [上下文窗口对比](context-windows.md) — 最大上下文窗口
- [缓存定价](cached-pricing.md) — 1,374 个支持提示缓存的模型

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
