# 嵌入模型

[English](../embedding-models.md)

生成**向量嵌入**的 AI 模型 — 文本、图像和其他数据的数值表示。语义搜索、RAG（检索增强生成）、聚类和相似度任务的基础。

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models)。

## 为什么嵌入模型很重要

嵌入模型是许多 AI 系统的基础：

- **语义搜索** — 按含义而非关键词查找相关文档
- **RAG** — 为 LLM 检索上下文以生成有依据的答案
- **聚类** — 将相似项目分组
- **相似度** — 查找重复项、推荐和相关内容
- **分类** — 通过嵌入进行零样本和少样本分类

## 统计

| 指标             | 数量 |
| ---------------- | ---- |
| 嵌入模型         | 5    |
| 提供商           | 3    |
| 免费嵌入模型     | 0    |
| 开源权重嵌入模型 | 1    |

## 提供商

`openai`、`tencent`、`upstage`

## 免费嵌入模型

免费嵌入模型 — 零成本语义搜索和 RAG。

| 模型 | 提供商 | 上下文 | 输入 $/M |
| ---- | ------ | ------ | -------- |

## 最便宜嵌入模型

生产环境嵌入的最佳性价比模型。

| 模型                    | 提供商  | 上下文 | 输入 $/M |
| ----------------------- | ------- | ------ | -------- | --- |
| text-embedding-3-small  | openai  | 8K     | $0.02    |     |
| solar-embedding-1-large | upstage | 0      | $0.1     | 🔓  |
| text-embedding-ada-002  | openai  | 8K     | $0.1     |     |
| text-embedding-3-large  | openai  | 8K     | $0.13    |     |
| hunyuan-embedding       | tencent | 0      | $0.7     |     |

## 大上下文嵌入模型

上下文窗口最大的嵌入模型 — 适用于嵌入长文档。

| 模型                   | 提供商 | 上下文 | 输入 $/M |
| ---------------------- | ------ | ------ | -------- | --- |
| text-embedding-ada-002 | openai | 8K     | $0.1     |     |
| text-embedding-3-small | openai | 8K     | $0.02    |     |
| text-embedding-3-large | openai | 8K     | $0.13    |     |

## 相关文档

- [免费 AI 模型](free-models.md) — 81 个免费模型按能力分类
- [开源权重](open-weights.md) — 527 个开源权重模型
- [模型选择指南](model-selection.md) — 选择模型的决策框架
- [API 参考](api.md) — 编程访问
- [快速入门](quick-start.md) — 5 分钟上手

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
