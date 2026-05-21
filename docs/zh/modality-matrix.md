[English](../modality-matrix.md) | **中文**

# 模态矩阵

哪些模型支持视觉、音频、图像生成和视频？本页列出各模态的顶级模型。

> 完整列表请浏览 `providers/` 目录或下载 [models.json](https://github.com/i-need-token/ai-models/releases/latest)。

## 视觉（图像输入）

1,487 个模型接受图像输入。以下是最强大的旗舰模型：

| 模型             | 提供商    | 上下文 | 输入 $/1M | 输出 $/1M |
| ---------------- | --------- | ------ | --------: | --------: |
| GPT-4.1          | OpenAI    | 1M     |     $2.00 |     $8.00 |
| Claude Opus 4    | Anthropic | 200K   |    $15.00 |    $75.00 |
| Gemini 2.5 Pro   | Google    | 1M     |     $1.25 |    $10.00 |
| Qwen3-235B-A22B  | 阿里云    | 128K   |     ¥1.00 |     ¥4.00 |
| DeepSeek-V3      | DeepSeek  | 128K   |     $0.27 |     $1.10 |
| Llama 4 Maverick | Meta      | 1M     |         — |         — |
| Mistral Large    | Mistral   | 128K   |     $2.00 |     $6.00 |
| Grok 3           | xAI       | 131K   |     $3.00 |    $15.00 |

**最便宜的视觉模型（USD）：**

| 模型          | 提供商      | 输入 $/1M | 输出 $/1M |
| ------------- | ----------- | --------: | --------: |
| DeepSeek-V3   | DeepSeek    |     $0.27 |     $1.10 |
| Qwen3-30B-A3B | 阿里云      |     ¥0.10 |     ¥0.30 |
| Llama 4 Scout | Together AI |     $0.15 |     $0.60 |
| Gemma 3 27B   | Google      |     $0.20 |     $0.80 |
| Phi-4         | Microsoft   |     $0.10 |     $0.40 |

## 图像输出（图像生成）

28 个模型可以生成图像：

| 模型                 | 提供商            | 类型         |
| -------------------- | ----------------- | ------------ |
| GPT-Image-1          | OpenAI            | 原生图像生成 |
| DALL-E 3             | OpenAI            | 原生图像生成 |
| Gemini 2.0 Flash     | Google            | 多模态输出   |
| Flux Pro             | Black Forest Labs | 图像生成     |
| Flux Dev             | Black Forest Labs | 图像生成     |
| Ideogram 3           | Ideogram          | 图像生成     |
| Stable Diffusion 3.5 | Stability AI      | 图像生成     |
| Midjourney v7        | Midjourney        | 图像生成     |

## 音频输入（语音识别）

118 个模型接受音频输入：

| 模型            | 提供商    | 能力            |
| --------------- | --------- | --------------- |
| GPT-4o-audio    | OpenAI    | 音频理解 + 生成 |
| Gemini 2.5 Pro  | Google    | 音频理解        |
| Claude Sonnet 4 | Anthropic | 音频理解        |
| Qwen2-Audio     | 阿里云    | 音频理解        |
| Whisper         | OpenAI    | 语音识别        |

## 音频输出（语音生成）

34 个模型可以生成音频：

| 模型           | 提供商 | 类型       |
| -------------- | ------ | ---------- |
| GPT-4o-audio   | OpenAI | 音频输出   |
| Gemini 2.5 Pro | Google | 音频输出   |
| Qwen2-Audio    | 阿里云 | 音频输出   |
| TTS-1          | OpenAI | 文本转语音 |
| TTS-1-HD       | OpenAI | 文本转语音 |

## 视频输入

167 个模型接受视频输入：

| 模型             | 提供商    | 上下文      |
| ---------------- | --------- | ----------- |
| Gemini 2.5 Pro   | Google    | 1M tokens   |
| GPT-4.1          | OpenAI    | 1M tokens   |
| Claude Opus 4    | Anthropic | 200K tokens |
| Qwen3-235B-A22B  | 阿里云    | 128K tokens |
| Llama 4 Maverick | Meta      | 1M tokens   |

## 多模态模型（3+ 输入模态）

接受文本 + 至少 2 种额外输入模态的模型：

| 模型           | 提供商    | 输入模态               |
| -------------- | --------- | ---------------------- |
| GPT-4o-audio   | OpenAI    | 文本、图像、音频       |
| Gemini 2.5 Pro | Google    | 文本、图像、音频、视频 |
| Claude Opus 4  | Anthropic | 文本、图像、音频       |
| Qwen2-Audio    | 阿里云    | 文本、图像、音频       |

## 相关文档

- [视觉模型](vision-models.md) — 1,487 个视觉模型
- [音频模型](audio-models.md) — 118 个音频输入 + 34 个音频输出模型
- [视频模型](video-models.md) — 167 个视频输入/输出模型
- [图像生成](image-generation.md) — 28 个图像生成模型
- [模型选择指南](model-selection.md) — 决策框架
