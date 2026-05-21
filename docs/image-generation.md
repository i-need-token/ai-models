**English** | [中文](./zh/image-generation.md)

# AI Image Generation Models

28 models in this catalog can generate images (image output modality). This page covers text-to-image, image editing, and multimodal generation models.

> All data sourced from first-party APIs and documentation. "Image output" means the model generates images as part of its response.

## Quick Stats

| Capability                    | Image Gen Models |
| ----------------------------- | ---------------: |
| Total image generation models |               28 |
| Unique model IDs              |               19 |
| With reasoning                |                5 |
| With tool calling             |                1 |
| Free to use                   |                9 |

## All Image Generation Models

| Model                          | Input                     | Output $/1M | Context | Reasoning | Free Tier |
| ------------------------------ | ------------------------- | ----------: | ------- | --------- | --------- |
| DALL·E 3                       | text                      |           — | —       | ❌        | ✅        |
| Imagen 4.0 Fast                | text, image               |           — | —       | ❌        | ✅        |
| Imagen 4.0                     | text, image               |           — | —       | ❌        | ✅        |
| Image 01                       | text, image               |           — | —       | ❌        | ✅        |
| Image 01 Live                  | text, image               |           — | —       | ❌        | ✅        |
| Step 1X Edit                   | text, image               |           — | —       | ❌        | ✅        |
| Step 1X Medium                 | text, image               |           — | —       | ❌        | ✅        |
| Step 2X Large                  | text, image               |           — | —       | ❌        | ✅        |
| Step Image Edit 2              | text, image               |           — | —       | ❌        | ✅        |
| Gemini 2.5 Flash Image         | text, image               |      $0.039 | 33K     | ❌        | ❌        |
| Gemini 3.1 Flash Image Preview | text, image               |       $1.50 | 66K     | ✅        | ❌        |
| Gemini 3 Pro Image Preview     | text, image               |      $12.00 | 131K    | ✅        | ❌        |
| GPT-5 Image Mini               | text, image, PDF          |       $2.00 | 400K    | ✅        | ❌        |
| GPT-5 Image                    | text, image, PDF          |      $10.00 | 400K    | ✅        | ❌        |
| GPT-5.4 Image 2                | text, image, PDF          |      $15.00 | 272K    | ✅        | ❌        |
| Amazon Nova 2.0 Omni           | text, image, audio, video |       $1.30 | 64K     | ✅        | ❌        |

## Best Value Image Generation

| Use Case                           | Best Model                          | Why                                     |
| ---------------------------------- | ----------------------------------- | --------------------------------------- |
| **Free text-to-image**             | DALL·E 3, Imagen 4.0                | Zero cost, high quality                 |
| **Free image editing**             | Step 1X Edit, Step Image Edit 2     | Edit existing images at no cost         |
| **Cheapest API**                   | Gemini 2.5 Flash Image              | $0.039/1M output tokens                 |
| **Best quality**                   | GPT-5.4 Image 2, Gemini 3 Pro Image | State-of-the-art generation             |
| **Multimodal (audio+video+image)** | Amazon Nova 2.0 Omni                | Only model with all modalities          |
| **Large context**                  | GPT-5 Image Mini                    | 400K context for complex prompts        |
| **Reasoning + generation**         | GPT-5 Image Mini                    | $2.50/1M input, 400K context, reasoning |

## Key Takeaways

- **9 free image generation models** — DALL·E 3, Imagen 4.0, Step models, and more
- **Gemini 2.5 Flash Image** is the cheapest API option at $0.039/1M output tokens
- **GPT-5 Image Mini** offers the best combination of reasoning + generation + large context
- **Amazon Nova 2.0 Omni** is the only model that generates images from audio and video input
- Most image generation models accept both text and image input (for editing/reference)
