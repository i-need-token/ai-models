**English** | [中文](./zh/modality-matrix.md)

# Modality Matrix

Which models support vision, audio, image generation, and video? This page lists the top models for each modality.

> For the full list, browse the `providers/` directory or download [models.json](https://github.com/i-need-token/ai-models/releases/latest).

## Vision (Image Input)

1,487 models accept images as input. Here are the most capable flagships:

| Model            | Provider      | Context | Input $/1M | Output $/1M |
| ---------------- | ------------- | ------- | ---------: | ----------: |
| GPT-4.1          | OpenAI        | 1M      |      $2.00 |       $8.00 |
| Claude Opus 4    | Anthropic     | 200K    |     $15.00 |      $75.00 |
| Gemini 2.5 Pro   | Google        | 1M      |      $1.25 |      $10.00 |
| Qwen3-235B-A22B  | Alibaba Cloud | 128K    |      ¥1.00 |       ¥4.00 |
| DeepSeek-V3      | DeepSeek      | 128K    |      $0.27 |       $1.10 |
| Llama 4 Maverick | Meta          | 1M      |          — |           — |
| Mistral Large    | Mistral       | 128K    |      $2.00 |       $6.00 |
| Grok 3           | xAI           | 131K    |      $3.00 |      $15.00 |

**Cheapest vision models (USD):**

| Model         | Provider      | Input $/1M | Output $/1M |
| ------------- | ------------- | ---------: | ----------: |
| DeepSeek-V3   | DeepSeek      |      $0.27 |       $1.10 |
| Qwen3-30B-A3B | Alibaba Cloud |      ¥0.10 |       ¥0.30 |
| Llama 4 Scout | Together AI   |      $0.15 |       $0.60 |
| Gemma 3 27B   | Google        |      $0.20 |       $0.80 |
| Phi-4         | Microsoft     |      $0.10 |       $0.40 |

## Image Output (Image Generation)

28 models can generate images:

| Model                | Provider          | Type                    |
| -------------------- | ----------------- | ----------------------- |
| GPT-Image-1          | OpenAI            | Native image generation |
| DALL-E 3             | OpenAI            | Native image generation |
| Gemini 2.0 Flash     | Google            | Multimodal output       |
| Flux Pro             | Black Forest Labs | Image generation        |
| Flux Dev             | Black Forest Labs | Image generation        |
| Ideogram 3           | Ideogram          | Image generation        |
| Stable Diffusion 3.5 | Stability AI      | Image generation        |
| Midjourney v7        | Midjourney        | Image generation        |

## Audio Input (Speech Recognition)

118 models accept audio as input:

| Model           | Provider      | Capabilities                     |
| --------------- | ------------- | -------------------------------- |
| GPT-4o-audio    | OpenAI        | Audio understanding + generation |
| Gemini 2.5 Pro  | Google        | Audio understanding              |
| Claude Sonnet 4 | Anthropic     | Audio understanding              |
| Qwen2-Audio     | Alibaba Cloud | Audio understanding              |
| Whisper         | OpenAI        | Speech recognition               |

## Audio Output (Speech Generation)

34 models can generate audio:

| Model          | Provider      | Type           |
| -------------- | ------------- | -------------- |
| GPT-4o-audio   | OpenAI        | Audio output   |
| Gemini 2.5 Pro | Google        | Audio output   |
| Qwen2-Audio    | Alibaba Cloud | Audio output   |
| TTS-1          | OpenAI        | Text-to-speech |
| TTS-1-HD       | OpenAI        | Text-to-speech |

## Video Input

167 models accept video as input:

| Model            | Provider      | Context     |
| ---------------- | ------------- | ----------- |
| Gemini 2.5 Pro   | Google        | 1M tokens   |
| GPT-4.1          | OpenAI        | 1M tokens   |
| Claude Opus 4    | Anthropic     | 200K tokens |
| Qwen3-235B-A22B  | Alibaba Cloud | 128K tokens |
| Llama 4 Maverick | Meta          | 1M tokens   |

## Multimodal Models (3+ Input Modalities)

Models that accept text + at least 2 additional input modalities:

| Model          | Provider      | Input Modalities          |
| -------------- | ------------- | ------------------------- |
| GPT-4o-audio   | OpenAI        | text, image, audio        |
| Gemini 2.5 Pro | Google        | text, image, audio, video |
| Claude Opus 4  | Anthropic     | text, image, audio        |
| Qwen2-Audio    | Alibaba Cloud | text, image, audio        |
