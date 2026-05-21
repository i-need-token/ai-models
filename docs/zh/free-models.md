[English](../free-models.md) | **中文**

# 免费 AI 模型

本目录中有 81 个模型可免费使用。本页按能力分类列出，帮助你找到适合项目的免费模型。

> 所有数据来自一手 API 和文档。免费层可能有速率限制 — 请查看提供商网站了解详情。

## 快速统计

| 能力                 | 免费模型数 |
| -------------------- | ---------: |
| 总免费模型           |         81 |
| 支持工具调用         |         45 |
| 支持推理             |         11 |
| 支持视觉（图像输入） |         17 |

## 支持工具调用的免费模型

这些模型支持函数/工具调用且零成本 — 适合构建 AI 代理和自动化：

| 模型                           | 提供商 | 上下文 | 视觉 |
| ------------------------------ | ------ | ------ | ---- |
| gemini-2.0-flash               | Google | 1M     | ✅   |
| gemini-2.5-flash-preview-05-20 | Google | 1M     | ✅   |
| gemma-3-27b-it                 | Chutes | 128K   | ✅   |
| qwen3-235b-a22b                | Chutes | 128K   | ✅   |
| qwen3-30b-a3b                  | Chutes | 128K   | ✅   |
| qwen3-4b                       | Chutes | 128K   | ✅   |
| deepseek-r1                    | Chutes | 128K   | ❌   |
| deepseek-v3-0324               | Chutes | 128K   | ❌   |
| llama-4-maverick               | Chutes | 1M     | ✅   |
| llama-4-scout                  | Chutes | 10M    | ✅   |
| llama-3.3-70b-instruct         | Chutes | 128K   | ❌   |
| qwen2.5-72b-instruct           | Chutes | 128K   | ❌   |
| mistral-small-3.1-24b-instruct | Chutes | 128K   | ✅   |
| phi-4                          | Chutes | 16K    | ❌   |
| command-r                      | Chutes | 128K   | ❌   |

## 支持推理的免费模型

这些模型支持链式思维推理且零成本：

| 模型                           | 提供商 | 上下文 |
| ------------------------------ | ------ | ------ |
| gemini-2.5-flash-preview-05-20 | Google | 1M     |
| deepseek-r1                    | Chutes | 128K   |
| deepseek-r1-0528               | Chutes | 128K   |
| qwen3-235b-a22b                | Chutes | 128K   |
| qwen3-30b-a3b                  | Chutes | 128K   |
| qwen3-4b                       | Chutes | 128K   |
| gemma-3-27b-it                 | Chutes | 128K   |
| phi-4-reasoning                | Chutes | 32K    |

## 支持视觉的免费模型

这些模型接受图像输入且零成本：

| 模型                           | 提供商 | 上下文 |
| ------------------------------ | ------ | ------ |
| gemini-2.0-flash               | Google | 1M     |
| gemini-2.5-flash-preview-05-20 | Google | 1M     |
| gemma-3-27b-it                 | Chutes | 128K   |
| qwen3-235b-a22b                | Chutes | 128K   |
| llama-4-maverick               | Chutes | 1M     |
| llama-4-scout                  | Chutes | 10M    |
| mistral-small-3.1-24b-instruct | Chutes | 128K   |

## 按提供商分类

### Google（通过 AI Studio）

Google 通过 AI Studio 提供免费 Gemini 模型访问（有速率限制）：

- gemini-2.0-flash — 1M 上下文，工具调用，视觉，推理
- gemini-2.5-flash-preview-05-20 — 1M 上下文，工具调用，视觉，推理

### Chutes

Chutes 提供免费社区托管推理，支持开源权重模型：

- 70+ 个免费模型，包括 Llama 4、Qwen3、DeepSeek-R1、Gemma 3、Mistral、Phi-4
- 最大免费模型：Llama 4 Scout（10M 上下文）
- 最佳免费推理：DeepSeek-R1、Qwen3-235B-A22B

### Cloudflare Workers AI

Cloudflare 提供免费边缘推理：

- 各种小型和中型模型（有速率限制）
- 边缘部署，低延迟

### Cerebras

Cerebras 为部分模型提供免费层：

- 使用 CS-3 晶圆级引擎的快速推理

### Groq

Groq 为部分模型提供免费层：

- 使用 LPU 加速的超快推理

## 要点总结

- **Google AI Studio** 提供整体最佳的免费模型 — 1M 上下文、工具调用、视觉和推理
- **Chutes** 拥有最多的免费模型选择 — 70+ 个，包括所有主要开源权重模型
- **Llama 4 Scout** 在 Chutes 上提供最大的免费上下文窗口（10M tokens）
- 免费层通常有速率限制（每分钟请求数）— 请查看提供商文档了解具体限制
- 生产环境建议升级到付费层以获得可靠性和更高的速率限制
