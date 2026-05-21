# 多模态模型

[English](../multimodal-models.md)

能够处理**多种输入模态**的 AI 模型 — 图像、音频和视频与文本并行。这些模型驱动视觉问答、文档分析、视频理解和音频转录。

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models)。

## 为什么多模态模型很重要

多模态模型打破了纯文本的限制：

- **视觉问答** — 对图像和文档提问
- **文档分析** — 从 PDF、截图和扫描件中提取信息
- **视频理解** — 分析视频内容，总结片段
- **音频处理** — 转录语音，分析音频内容
- **无障碍** — 为视障用户描述图像
- **内容审核** — 跨模态检测不当内容

## 统计

| 指标               | 数量 |
| ------------------ | ---- |
| 多模态模型         | 1519 |
| 提供商             | 61   |
| 图像输入           | 1487 |
| 音频输入           | 118  |
| 视频输入           | 167  |
| 免费多模态模型     | 53   |
| 开源权重多模态模型 | 119  |
| 带工具调用         | 1179 |
| 带推理能力         | 701  |

## 提供商

`01ai`, `302ai`, `aihubmix`, `aimlapi`, `amazon`, `amazon-bedrock`, `anthropic`, `arcee`, `auriko`, `baidu`, `berget`, `bytedance`, `chutes`, `clarifai`, `cloudferro-sherlock`, `cloudflare`, `cortecs`, `databricks`, `deepinfra`, `digitalocean`, `evroc`, `fastrouter`, `fireworks`, `google`, `google-vertex` 等 36 个

## 免费多模态模型

支持多模态输入的免费模型 — 零成本视觉/音频应用。

| 模型                                                 | 提供商     | 上下文 | 输入 $/M | 输出 $/M | 模态           |
| ---------------------------------------------------- | ---------- | ------ | -------- | -------- | -------------- |
| google--lyria-3-clip-preview                         | openrouter | 1M     | Free     | Free     | 🖼️             |
| google--lyria-3-pro-preview                          | openrouter | 1M     | Free     | Free     | 🖼️             |
| google--gemma-4-26b-a4b-it--free                     | openrouter | 262K   | Free     | Free     | 🖼️ 🎬 🔧 🧠    |
| google--gemma-4-31b-it--free                         | openrouter | 262K   | Free     | Free     | 🖼️ 🎬 🔧 🧠    |
| gemma-4-26b-a4b-it                                   | auriko     | 262K   | Free     | Free     | 🖼️ 🔧 🧠       |
| gemma-4-31b-it                                       | auriko     | 262K   | Free     | Free     | 🖼️ 🔧 🧠       |
| nvidia--nemotron-3-nano-omni-30b-a3b-reasoning--free | openrouter | 256K   | Free     | Free     | 🖼️ 🎤 🎬 🔧 🧠 |
| spotlight                                            | arcee      | 131K   | Free     | Free     | 🖼️             |
| gemma-3-4b-it                                        | google     | 131K   | Free     | Free     | 🖼️             |
| gemma-3-12b-it                                       | google     | 131K   | Free     | Free     | 🖼️             |

## 最便宜多模态模型

生产环境多模态应用的最佳性价比模型。

| 模型                       | 提供商    | 上下文 | 输入 $/M | 输出 $/M | 模态     |
| -------------------------- | --------- | ------ | -------- | -------- | -------- |
| ernie-4.5-0.3b             | aihubmix  | 0      | $0.0068  | $0.0272  | 🖼️ 🔧    |
| deepseek-ocr               | aihubmix  | 0      | $0.01    | $0.01    | 🖼️       |
| gemini-2.0-flash-exp       | aihubmix  | 0      | $0.01    | $0.04    | 🖼️ 🎤 🎬 |
| qwen-3.5-0.8b              | auriko    | 262K   | $0.01    | $0.05    | 🖼️ 🔧 🧠 |
| qwen3.5-0.8b               | deepinfra | 262K   | $0.01    | $0.05    | 🖼️ 🧠    |
| qwen3-vl-flash-2026-01-22  | aihubmix  | 0      | $0.0103  | $0.103   | 🖼️ 🎬 🔧 |
| qwen3-vl-flash             | aihubmix  | 0      | $0.0103  | $0.103   | 🖼️ 🎬 🔧 |
| glm-ocr                    | aihubmix  | 0      | $0.0141  | $0.0141  | 🖼️       |
| paddlepaddle--paddleocr-vl | novitaai  | 16K    | $0.02    | $0.02    | 🖼️       |
| qwen-3.5-2b                | auriko    | 262K   | $0.02    | $0.1     | 🖼️ 🔧 🧠 |

## 大上下文多模态模型

上下文窗口最大的多模态模型 — 适用于处理长文档和视频。

| 模型                         | 提供商     | 上下文 | 输入 $/M | 输出 $/M | 模态        |
| ---------------------------- | ---------- | ------ | -------- | -------- | ----------- |
| meta-llama--llama-4-scout    | openrouter | 10M    | $0.08    | $0.3     | 🖼️ 🔧       |
| meta-llama-4-scout           | meta       | 10M    | $0.17    | $0.66    | 🖼️ 🔧       |
| gemini-1.5-pro               | google     | 2M     | $1.25    | $5       | 🖼️ 🎤 🎬 🔧 |
| grok-code-fast-1             | jiekou     | 2M     | $0.19    | $0.475   | 🖼️ 🔧       |
| gpt-4o                       | jiekou     | 2M     | $1.9     | $5.7     | 🖼️ 🔧       |
| grok-4.20-0309-non-reasoning | jiekou     | 2M     | $0.19    | $0.475   | 🖼️ 🔧       |
| grok-4.20-0309-reasoning     | jiekou     | 2M     | $1.9     | $5.7     | 🖼️ 🔧       |
| grok-4-1-fast-reasoning      | jiekou     | 2M     | $0.19    | $0.475   | 🖼️ 🔧       |
| grok-4-fast-reasoning        | jiekou     | 2M     | $0.19    | $0.475   | 🖼️ 🔧       |
| x-ai--grok-4-fast            | fastrouter | 2M     | $0.2     | $0.5     | 🖼️ 🔧       |

## 相关文档

- [视觉模型](vision-models.md) — 1,487 个支持图像输入的模型
- [视频模型](video-models.md) — 支持视频理解的模型
- [音频模型](audio-models.md) — 支持音频输入/输出的模型
- [图像生成](image-generation.md) — 28 个图像生成模型
- [智能体模型](agentic-models.md) — 1,080 个具备工具调用 + 推理能力的模型
- [免费 AI 模型](free-models.md) — 81 个免费模型按能力分类
- [模型选择指南](model-selection.md) — 选择模型的决策框架

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
