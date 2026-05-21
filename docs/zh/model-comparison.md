[English](../model-comparison.md) | **中文**

# 模型对比

热门 AI 模型类别的快速参考对比。所有数据来自第一方提供商 API 和文档。

## 顶级旗舰模型

截至 2025 年 5 月，各主要提供商最强大的模型。

| 模型             | 提供商    | 上下文 | 输入 $/百万token | 输出 $/百万token | 推理 | 工具调用 | 视觉 |
| ---------------- | --------- | -----: | ---------------: | ---------------: | :--: | :------: | :--: |
| GPT-5.5          | OpenAI    |   512K |            10.00 |            30.00 |  ✅  |    ✅    |  ✅  |
| Claude Opus 4.7  | Anthropic |   200K |            15.00 |            75.00 |  ✅  |    ✅    |  ✅  |
| Gemini 3.1 Pro   | Google    |     1M |             1.25 |            10.00 |  ✅  |    ✅    |  ✅  |
| DeepSeek-V4-Pro  | DeepSeek  |   128K |             2.50 |            10.00 |  ✅  |    ✅    |  ✅  |
| Grok 3           | xAI       |   131K |             3.00 |            15.00 |  ✅  |    ✅    |  ✅  |
| Llama 4 Maverick | Meta      |     1M |                — |                — |  ✅  |    ✅    |  ✅  |
| Qwen3-235B       | 阿里云    |   128K |                — |                — |  ✅  |    ✅    |  ✅  |
| Mistral Large    | Mistral   |   128K |             2.00 |             6.00 |  ✅  |    ✅    |  ✅  |

> 定价为直接提供商 API 价格。推理平台可能提供不同费率。

## 高性价比模型

适合高吞吐量工作负载的最佳性价比模型。

| 模型              | 提供商    | 上下文 | 输入 $/百万token | 输出 $/百万token | 推理 | 工具调用 |
| ----------------- | --------- | -----: | ---------------: | ---------------: | :--: | :------: |
| GPT-5.4 Nano      | OpenAI    |   128K |             0.03 |             0.12 |  ❌  |    ✅    |
| Claude Haiku 4.5  | Anthropic |   200K |             0.80 |             4.00 |  ✅  |    ✅    |
| Gemini 3.5 Flash  | Google    |     1M |             0.15 |             0.60 |  ✅  |    ✅    |
| DeepSeek-V4-Flash | DeepSeek  |   128K |             0.10 |             0.40 |  ✅  |    ✅    |
| Llama 4 Scout     | Meta      |    10M |                — |                — |  ✅  |    ✅    |
| Qwen3-30B         | 阿里云    |   128K |                — |                — |  ✅  |    ✅    |
| Mistral Small     | Mistral   |   128K |             0.20 |             0.60 |  ❌  |    ✅    |
| Grok 3 Mini       | xAI       |   131K |             0.30 |             0.50 |  ✅  |    ✅    |

## 最大上下文窗口

适合长文档处理的最大上下文窗口模型。

| 模型              | 提供商    | 上下文 (tokens) | 输入 $/百万token | 输出 $/百万token |
| ----------------- | --------- | --------------: | ---------------: | ---------------: |
| Llama 4 Scout     | Meta      |      10,000,000 |                — |                — |
| Gemini 3.1 Pro    | Google    |       1,048,576 |             1.25 |            10.00 |
| Gemini 3.5 Flash  | Google    |       1,048,576 |             0.15 |             0.60 |
| Llama 4 Maverick  | Meta      |       1,000,000 |                — |                — |
| GPT-5.5           | OpenAI    |         512,000 |            10.00 |            30.00 |
| Qwen3-Coder-480B  | 阿里云    |       1,048,576 |                — |                — |
| Claude Opus 4.7   | Anthropic |         200,000 |            15.00 |            75.00 |
| Claude Sonnet 4.6 | Anthropic |         200,000 |             3.00 |            15.00 |

## 免费模型

数据采集时免费可用的模型。

| 模型                       | 提供商   | 上下文 | 推理 | 工具调用 |
| -------------------------- | -------- | -----: | :--: | :------: |
| DeepSeek-V4-Flash (免费层) | DeepSeek |   128K |  ✅  |    ✅    |
| Gemini 3.5 Flash (免费层)  | Google   |     1M |  ✅  |    ✅    |
| Llama 4 Scout (自托管)     | Meta     |    10M |  ✅  |    ✅    |
| Qwen3-8B (自托管)          | 阿里云   |   128K |  ✅  |    ✅    |
| Mistral-Small (自托管)     | Mistral  |   128K |  ❌  |    ✅    |

> 免费层通常有速率限制。自托管模型需要自己的基础设施。

## 视觉模型

支持图像输入的模型。

| 模型             | 提供商    | 图像输入 | 图像输出 | 视频输入 |
| ---------------- | --------- | :------: | :------: | :------: |
| GPT-5.5          | OpenAI    |    ✅    |    ✅    |    ✅    |
| Claude Opus 4.7  | Anthropic |    ✅    |    ❌    |    ❌    |
| Gemini 3.1 Pro   | Google    |    ✅    |    ✅    |    ✅    |
| DeepSeek-V4-Pro  | DeepSeek  |    ✅    |    ❌    |    ❌    |
| Qwen3-VL         | 阿里云    |    ✅    |    ❌    |    ❌    |
| Llama 4 Maverick | Meta      |    ✅    |    ❌    |    ❌    |

## 开源权重模型

权重公开可用的自托管模型。

| 模型              | 提供商    |  参数量  | 上下文 | 推理 |
| ----------------- | --------- | :------: | -----: | :--: |
| Llama 4 Maverick  | Meta      | 400B MoE |     1M |  ✅  |
| Llama 4 Scout     | Meta      | 109B MoE |    10M |  ✅  |
| Qwen3-235B        | 阿里云    | 235B MoE |   128K |  ✅  |
| Qwen3-30B         | 阿里云    | 30B MoE  |   128K |  ✅  |
| DeepSeek-R1       | DeepSeek  | 671B MoE |   128K |  ✅  |
| DeepSeek-V3.2     | DeepSeek  | 685B MoE |   128K |  ✅  |
| Mistral Small 3.2 | Mistral   |   24B    |   128K |  ❌  |
| Phi-4             | Microsoft |   14B    |    16K |  ✅  |

> 参数量和架构为近似值。详见各模型 YAML 文件获取准确信息。

---

**注意**：所有定价和能力数据来自第一方来源。推理平台价格可能不同。查看 `providers/<id>/models/` 获取最新数据。
