[English](../tool-calling.md) | **中文**

# AI 工具调用模型

本目录中有 2,350 个模型支持工具调用（函数调用）。本页重点介绍构建 AI 代理和自动化最有能力和最具性价比的模型。

> 所有数据来自一手 API 和文档。"工具调用"表示模型可以在回复中调用外部函数/工具。

## 快速统计

| 能力                 | 工具调用模型数 |
| -------------------- | -------------: |
| 总工具调用模型       |          2,350 |
| 唯一模型 ID          |          1,540 |
| 支持推理             |          1,076 |
| 支持视觉（图像输入） |          1,063 |
| 支持结构化输出       |            829 |
| 开源权重             |            270 |

## 最便宜的工具调用模型

构建 AI 代理的最佳性价比：

| 模型                       | 提供商       | 输入 $/1M | 输出 $/1M | 上下文 | 推理 |
| -------------------------- | ------------ | --------: | --------: | ------ | ---- |
| GLM-4-Flash                | 302AI        |   $0.0014 |   $0.0014 | 131K   | ❌   |
| Mistral-Nemo-Instruct-2407 | KlusterAI    |    $0.008 |    $0.001 | 131K   | ❌   |
| BDC-Coder                  | InferenceNet |     $0.01 |     $0.01 | 131K   | ❌   |
| Qwen 3.5 0.8B              | Auriko       |     $0.01 |     $0.05 | 262K   | ✅   |
| Qwen 3.5 0.8B              | DeepInfra    |     $0.01 |     $0.05 | 262K   | ✅   |
| Qwen 3.5 2B                | Auriko       |     $0.02 |     $0.10 | 262K   | ✅   |
| Qwen 3.5 2B                | DeepInfra    |     $0.02 |     $0.10 | 262K   | ✅   |
| GPT-5 Nano                 | Requesty     |    $0.025 |     $0.20 | 400K   | ✅   |
| Gemini 2.5 Flash Lite      | Google       |     $0.10 |     $0.60 | 1M     | ✅   |
| Gemini 2.5 Flash           | Google       |     $0.15 |     $0.60 | 1M     | ✅   |
| Grok 4 Fast Reasoning      | xAI          |     $0.20 |     $0.50 | 2M     | ✅   |

## 最大上下文工具调用模型

适合处理大型文档或长对话历史的代理：

| 模型                  | 上下文 | 输入 $/1M | 推理 | 提供商数 |
| --------------------- | ------ | --------: | ---- | -------: |
| Llama 4 Scout         | 10M    |     $0.08 | ❌   |        4 |
| Grok 4 Fast Reasoning | 2M     |     $0.20 | ✅   |        2 |
| GPT-5.4               | 1M     |     $2.50 | ✅   |        4 |
| Gemini 2.5 Pro        | 1M     |     $1.25 | ✅   |        4 |
| Gemini 2.5 Flash      | 1M     |     $0.15 | ✅   |        3 |
| DeepSeek-V4 Flash     | 1M     |     $0.27 | ✅   |        2 |
| GPT-4.1               | 1M     |     $2.00 | ❌   |        4 |
| Llama 4 Maverick      | 1M     |     $0.15 | ❌   |        3 |

## 最佳工具调用 + 推理 + 视觉

高级 AI 代理的"三位一体" — 工具调用、推理和视觉一体：

| 模型                  | 上下文 | 输入 $/1M | 提供商数 |
| --------------------- | ------ | --------: | -------: |
| Grok 4 Fast Reasoning | 2M     |     $0.20 |        2 |
| Gemini 2.5 Flash      | 1M     |     $0.15 |        3 |
| Gemini 2.5 Pro        | 1M     |     $1.25 |        4 |
| GPT-5.4               | 1M     |     $2.50 |        4 |
| DeepSeek Reasoner     | 1M     |     $0.43 |        1 |
| MiMo V2.5（开源权重） | 1M     |    varies |        2 |
| Kimi K2.6（开源权重） | 262K   |    varies |        4 |

## 免费工具调用模型

45 个免费模型支持工具调用 — 适合原型设计和测试：

| 模型                           | 提供商 | 上下文 | 推理 | 视觉 |
| ------------------------------ | ------ | ------ | ---- | ---- |
| gemini-2.0-flash               | Google | 1M     | ✅   | ✅   |
| gemini-2.5-flash-preview-05-20 | Google | 1M     | ✅   | ✅   |
| llama-4-scout                  | Chutes | 10M    | ❌   | ✅   |
| llama-4-maverick               | Chutes | 1M     | ❌   | ✅   |
| deepseek-r1                    | Chutes | 128K   | ✅   | ❌   |
| qwen3-235b-a22b                | Chutes | 128K   | ✅   | ✅   |
| gemma-3-27b-it                 | Chutes | 128K   | ✅   | ✅   |

## 要点总结

- **2,350 个工具调用模型**，涵盖 1,540 个唯一模型 ID — 最大的工具调用模型目录
- **Gemini 2.5 Flash** 是最佳性价比：1M 上下文、工具调用、推理和视觉，仅 $0.15/1M
- **Grok 4 Fast Reasoning** 提供最大上下文（2M）且具备全部三种能力
- **45 个免费模型**支持工具调用 — 零成本开始构建代理
- **829 个模型**同时支持结构化输出 — 完美适合可靠的 JSON 响应
- 小型模型（Qwen 3.5 0.8B–4B）带工具调用仅需 $0.01–$0.03/1M tokens

## 相关文档

- [模型选择指南](model-selection.md) — 选择模型的决策框架
- [免费 AI 模型](free-models.md) — 81 个免费模型，多数支持工具调用
- [结构化输出](structured-output.md) — 829 个 JSON 模式模型
- [推理模型](reasoning-models.md) — 1,306 个支持推理的模型
- [缓存定价](cached-pricing.md) — 1,374 个支持提示缓存的模型
- [OpenAI 替代方案](openai-alternatives.md) — GPT-4/GPT-3.5 工具调用替代

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
