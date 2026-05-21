# Glossary

[中文](zh/glossary.md)

A quick reference for terms used throughout the AI Models Catalog.

## Model Properties

| Term           | Definition                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Model ID**   | The stable, unique identifier for a model (e.g., `gpt-4.1`, `claude-sonnet-4`). No date suffix, no aliases.                                   |
| **Family**     | A group of related models sharing the same architecture or brand (e.g., `gpt-4.1` family includes `gpt-4.1`, `gpt-4.1-mini`, `gpt-4.1-nano`). |
| **Snapshot**   | A dated version of a model, nested within the parent model file. Inherits all parent fields and only overrides what differs.                  |
| **Deprecated** | A model still listed in the provider's API but no longer recommended for new projects. Marked with `deprecated: true`.                        |
| **Retired**    | A model completely removed from the provider's API. Excluded from the catalog.                                                                |

## Capabilities

| Term                  | Definition                                                                                                                                                             |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tool calling**      | The model can invoke external tools/functions during generation (e.g., web search, calculator, API calls). Also known as "function calling".                           |
| **Structured output** | The model can generate responses in a specific format (typically JSON) conforming to a provided schema. Also known as "JSON mode".                                     |
| **Reasoning**         | The model uses chain-of-thought or extended thinking to solve complex problems step-by-step before producing a final answer.                                           |
| **Open weights**      | The model's weights are publicly available, allowing you to run it on your own infrastructure. Not all open-weight models are truly "open source" — check the license. |

## Modalities

| Term                     | Definition                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| **Text input**           | The model accepts text prompts as input.                                                         |
| **Text output**          | The model generates text as output.                                                              |
| **Image input (Vision)** | The model can process images as part of the input. Also known as "vision" or "multimodal input". |
| **Image output**         | The model can generate images (e.g., DALL·E, Imagen). Also known as "image generation".          |
| **Audio input**          | The model can process audio files or speech as input.                                            |
| **Audio output**         | The model can generate audio or speech as output (e.g., TTS models).                             |
| **Video input**          | The model can process video files as input.                                                      |
| **Video output**         | The model can generate video as output.                                                          |
| **Embedding output**     | The model produces vector embeddings rather than text, used for similarity search and retrieval. |

## Pricing

| Term                  | Definition                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Input price**       | Cost per million input tokens, in USD (or CNY/EUR for some providers).                                     |
| **Output price**      | Cost per million output tokens, in USD (or CNY/EUR for some providers).                                    |
| **Cache read price**  | Discounted price for reading from a previously cached prompt. Typically 50-90% cheaper than regular input. |
| **Cache write price** | Price for writing a prompt to the provider's cache. Some providers charge this separately.                 |
| **Free**              | The model has zero cost for both input and output tokens. May have rate limits.                            |
| **Token**             | A unit of text processing. Approximately 4 characters or 0.75 words in English.                            |

## Context & Limits

| Term               | Definition                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Context window** | Maximum number of tokens the model can process in a single request (input + output combined in some providers, input-only in others). |
| **Output limit**   | Maximum number of tokens the model can generate in a single response.                                                                 |
| **Rate limit**     | Maximum number of requests or tokens per minute/hour, set by the provider. Not included in the catalog (check provider docs).         |

## Data & Architecture

| Term                     | Definition                                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **YAML**                 | The source format for all model data. Human-readable, supports comments, and allows snapshot inheritance.                           |
| **Snapshot inheritance** | Within a model file, snapshots inherit all fields from the parent model and only override what differs. No cross-model inheritance. |
| **First-party data**     | Data sourced directly from the provider's own API or official documentation, never from third-party aggregators.                    |
| **Zod schema**           | Runtime validation schema used to ensure all YAML model files conform to the expected structure.                                    |
| **models.json**          | The compiled JSON output containing all models, generated from YAML source files. Available via npm, CDN, and GitHub Releases.      |

---

See [Data Schema Reference](data-schema.md) for the complete YAML field specification.

## Related Documentation

- [FAQ](faq.md) — common questions
- [Data Schema](data-schema.md) — complete YAML schema reference
- [Quick Start](quick-start.md) — find the right model in 30 seconds
- [Model Comparison](model-comparison.md) — compare models
- [Modality Matrix](modality-matrix.md) — all modalities at a glance

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
