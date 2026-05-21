# Multimodal Models

[中文](zh/multimodal-models.md)

AI models that can process **multiple input modalities** — images, audio, and video alongside text. These models power visual Q&A, document analysis, video understanding, and audio transcription.

Data sourced from the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Why Multimodal Models Matter

Multimodal models break the text-only barrier:

- **Visual Q&A** — ask questions about images and documents
- **Document Analysis** — extract information from PDFs, screenshots, and scans
- **Video Understanding** — analyze video content, summarize clips
- **Audio Processing** — transcribe speech, analyze audio content
- **Accessibility** — describe images for visually impaired users
- **Content Moderation** — detect inappropriate content across modalities

## Stats

| Metric                        | Count |
| ----------------------------- | ----- |
| Multimodal models             | 1519  |
| Providers                     | 61    |
| Image input                   | 1487  |
| Audio input                   | 118   |
| Video input                   | 167   |
| Free multimodal models        | 53    |
| Open-weight multimodal models | 119   |
| With tool calling             | 1179  |
| With reasoning                | 701   |

## Providers

`01ai`, `302ai`, `aihubmix`, `aimlapi`, `amazon`, `amazon-bedrock`, `anthropic`, `arcee`, `auriko`, `baidu`, `berget`, `bytedance`, `chutes`, `clarifai`, `cloudferro-sherlock`, `cloudflare`, `cortecs`, `databricks`, `deepinfra`, `digitalocean`, `evroc`, `fastrouter`, `fireworks`, `google`, `google-vertex` and 36 more

## Free Multimodal Models

Free models with multimodal input — zero-cost visual/audio applications.

| Model                                                | Provider   | Context | Input $/M | Output $/M | Modalities     |
| ---------------------------------------------------- | ---------- | ------- | --------- | ---------- | -------------- |
| google--lyria-3-clip-preview                         | openrouter | 1M      | Free      | Free       | 🖼️             |
| google--lyria-3-pro-preview                          | openrouter | 1M      | Free      | Free       | 🖼️             |
| google--gemma-4-26b-a4b-it--free                     | openrouter | 262K    | Free      | Free       | 🖼️ 🎬 🔧 🧠    |
| google--gemma-4-31b-it--free                         | openrouter | 262K    | Free      | Free       | 🖼️ 🎬 🔧 🧠    |
| gemma-4-26b-a4b-it                                   | auriko     | 262K    | Free      | Free       | 🖼️ 🔧 🧠       |
| gemma-4-31b-it                                       | auriko     | 262K    | Free      | Free       | 🖼️ 🔧 🧠       |
| nvidia--nemotron-3-nano-omni-30b-a3b-reasoning--free | openrouter | 256K    | Free      | Free       | 🖼️ 🎤 🎬 🔧 🧠 |
| spotlight                                            | arcee      | 131K    | Free      | Free       | 🖼️             |
| gemma-3-4b-it                                        | google     | 131K    | Free      | Free       | 🖼️             |
| gemma-3-12b-it                                       | google     | 131K    | Free      | Free       | 🖼️             |

## Cheapest Multimodal Models

Best value multimodal models for production.

| Model                      | Provider  | Context | Input $/M | Output $/M | Modalities |
| -------------------------- | --------- | ------- | --------- | ---------- | ---------- |
| ernie-4.5-0.3b             | aihubmix  | 0       | $0.0068   | $0.0272    | 🖼️ 🔧      |
| deepseek-ocr               | aihubmix  | 0       | $0.01     | $0.01      | 🖼️         |
| gemini-2.0-flash-exp       | aihubmix  | 0       | $0.01     | $0.04      | 🖼️ 🎤 🎬   |
| qwen-3.5-0.8b              | auriko    | 262K    | $0.01     | $0.05      | 🖼️ 🔧 🧠   |
| qwen3.5-0.8b               | deepinfra | 262K    | $0.01     | $0.05      | 🖼️ 🧠      |
| qwen3-vl-flash-2026-01-22  | aihubmix  | 0       | $0.0103   | $0.103     | 🖼️ 🎬 🔧   |
| qwen3-vl-flash             | aihubmix  | 0       | $0.0103   | $0.103     | 🖼️ 🎬 🔧   |
| glm-ocr                    | aihubmix  | 0       | $0.0141   | $0.0141    | 🖼️         |
| paddlepaddle--paddleocr-vl | novitaai  | 16K     | $0.02     | $0.02      | 🖼️         |
| qwen-3.5-2b                | auriko    | 262K    | $0.02     | $0.1       | 🖼️ 🔧 🧠   |

## Largest Context Multimodal Models

Multimodal models with the largest context windows — for processing long documents and videos.

| Model                        | Provider   | Context | Input $/M | Output $/M | Modalities  |
| ---------------------------- | ---------- | ------- | --------- | ---------- | ----------- |
| meta-llama--llama-4-scout    | openrouter | 10M     | $0.08     | $0.3       | 🖼️ 🔧       |
| meta-llama-4-scout           | meta       | 10M     | $0.17     | $0.66      | 🖼️ 🔧       |
| gemini-1.5-pro               | google     | 2M      | $1.25     | $5         | 🖼️ 🎤 🎬 🔧 |
| grok-code-fast-1             | jiekou     | 2M      | $0.19     | $0.475     | 🖼️ 🔧       |
| gpt-4o                       | jiekou     | 2M      | $1.9      | $5.7       | 🖼️ 🔧       |
| grok-4.20-0309-non-reasoning | jiekou     | 2M      | $0.19     | $0.475     | 🖼️ 🔧       |
| grok-4.20-0309-reasoning     | jiekou     | 2M      | $1.9      | $5.7       | 🖼️ 🔧       |
| grok-4-1-fast-reasoning      | jiekou     | 2M      | $0.19     | $0.475     | 🖼️ 🔧       |
| grok-4-fast-reasoning        | jiekou     | 2M      | $0.19     | $0.475     | 🖼️ 🔧       |
| x-ai--grok-4-fast            | fastrouter | 2M      | $0.2      | $0.5       | 🖼️ 🔧       |

## Related Documentation

- [Vision Models](vision-models.md) — 1,487 models with image input
- [Video Models](video-models.md) — models with video understanding
- [Audio Models](audio-models.md) — models with audio input/output
- [Image Generation](image-generation.md) — 28 models that generate images
- [Agentic Models](agentic-models.md) — 1,080 models with tool calling + reasoning
- [Free AI Models](free-models.md) — 81 free models by capability
- [Model Selection Guide](model-selection.md) — decision framework

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
