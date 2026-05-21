[English](../image-generation.md) | **中文**

# AI 图像生成模型

本目录中有 28 个模型可以生成图像（图像输出模态）。本页涵盖文本生成图像、图像编辑和多模态生成模型。

> 所有数据来自一手 API 和文档。"图像输出"表示模型在回复中生成图像。

## 快速统计

| 能力           | 图像生成模型数 |
| -------------- | -------------: |
| 总图像生成模型 |             28 |
| 唯一模型 ID    |             19 |
| 支持推理       |              5 |
| 支持工具调用   |              1 |
| 免费使用       |              9 |

## 所有图像生成模型

| 模型                           | 输入                      | 输出 $/1M | 上下文 | 推理 | 免费 |
| ------------------------------ | ------------------------- | --------: | ------ | ---- | ---- |
| DALL·E 3                       | text                      |         — | —      | ❌   | ✅   |
| Imagen 4.0 Fast                | text, image               |         — | —      | ❌   | ✅   |
| Imagen 4.0                     | text, image               |         — | —      | ❌   | ✅   |
| Image 01                       | text, image               |         — | —      | ❌   | ✅   |
| Image 01 Live                  | text, image               |         — | —      | ❌   | ✅   |
| Step 1X Edit                   | text, image               |         — | —      | ❌   | ✅   |
| Step 1X Medium                 | text, image               |         — | —      | ❌   | ✅   |
| Step 2X Large                  | text, image               |         — | —      | ❌   | ✅   |
| Step Image Edit 2              | text, image               |         — | —      | ❌   | ✅   |
| Gemini 2.5 Flash Image         | text, image               |    $0.039 | 33K    | ❌   | ❌   |
| Gemini 3.1 Flash Image Preview | text, image               |     $1.50 | 66K    | ✅   | ❌   |
| Gemini 3 Pro Image Preview     | text, image               |    $12.00 | 131K   | ✅   | ❌   |
| GPT-5 Image Mini               | text, image, PDF          |     $2.00 | 400K   | ✅   | ❌   |
| GPT-5 Image                    | text, image, PDF          |    $10.00 | 400K   | ✅   | ❌   |
| GPT-5.4 Image 2                | text, image, PDF          |    $15.00 | 272K   | ✅   | ❌   |
| Amazon Nova 2.0 Omni           | text, image, audio, video |     $1.30 | 64K    | ✅   | ❌   |

## 最佳性价比图像生成

| 用途                         | 最佳模型                            | 原因                             |
| ---------------------------- | ----------------------------------- | -------------------------------- |
| **免费文本生成图像**         | DALL·E 3, Imagen 4.0                | 零成本，高质量                   |
| **免费图像编辑**             | Step 1X Edit, Step Image Edit 2     | 免费编辑现有图像                 |
| **最便宜 API**               | Gemini 2.5 Flash Image              | $0.039/1M 输出 tokens            |
| **最佳质量**                 | GPT-5.4 Image 2, Gemini 3 Pro Image | 最先进的生成能力                 |
| **多模态（音频+视频+图像）** | Amazon Nova 2.0 Omni                | 唯一支持所有模态的模型           |
| **大上下文**                 | GPT-5 Image Mini                    | 400K 上下文适合复杂提示          |
| **推理 + 生成**              | GPT-5 Image Mini                    | $2.50/1M 输入，400K 上下文，推理 |

## 要点总结

- **9 个免费图像生成模型** — DALL·E 3、Imagen 4.0、Step 系列等
- **Gemini 2.5 Flash Image** 是最便宜的 API 选项，仅 $0.039/1M 输出 tokens
- **GPT-5 Image Mini** 提供推理 + 生成 + 大上下文的最佳组合
- **Amazon Nova 2.0 Omni** 是唯一可以从音频和视频输入生成图像的模型
- 大多数图像生成模型同时接受文本和图像输入（用于编辑/参考）
