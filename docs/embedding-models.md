# Embedding Models

[中文](zh/embedding-models.md)

AI models that generate **vector embeddings** — numerical representations of text, images, and other data. Essential for semantic search, RAG (Retrieval-Augmented Generation), clustering, and similarity tasks.

Data sourced from the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Why Embedding Models Matter

Embedding models are the foundation of many AI systems:

- **Semantic Search** — find relevant documents by meaning, not keywords
- **RAG** — retrieve context for LLMs to generate grounded answers
- **Clustering** — group similar items together
- **Similarity** — find duplicates, recommendations, and related content
- **Classification** — zero-shot and few-shot classification via embeddings

## Stats

| Metric                       | Count |
| ---------------------------- | ----- |
| Embedding models             | 5     |
| Providers                    | 3     |
| Free embedding models        | 0     |
| Open-weight embedding models | 1     |

## Providers

`openai`, `tencent`, `upstage`

## Free Embedding Models

Free embedding models — zero-cost semantic search and RAG.

| Model | Provider | Context | Input $/M |
| ----- | -------- | ------- | --------- |

## Cheapest Embedding Models

Best value embedding models for production.

| Model                   | Provider | Context | Input $/M |
| ----------------------- | -------- | ------- | --------- | --- |
| text-embedding-3-small  | openai   | 8K      | $0.02     |     |
| solar-embedding-1-large | upstage  | 0       | $0.1      | 🔓  |
| text-embedding-ada-002  | openai   | 8K      | $0.1      |     |
| text-embedding-3-large  | openai   | 8K      | $0.13     |     |
| hunyuan-embedding       | tencent  | 0       | $0.7      |     |

## Largest Context Embedding Models

Embedding models with the largest context windows — for embedding long documents.

| Model                  | Provider | Context | Input $/M |
| ---------------------- | -------- | ------- | --------- | --- |
| text-embedding-ada-002 | openai   | 8K      | $0.1      |     |
| text-embedding-3-small | openai   | 8K      | $0.02     |     |
| text-embedding-3-large | openai   | 8K      | $0.13     |     |

## Related Documentation

- [Free AI Models](free-models.md) — 81 free models by capability
- [Open Weights](open-weights.md) — 527 open-weight models
- [Model Selection Guide](model-selection.md) — decision framework
- [API Reference](api.md) — programmatic access
- [Quick Start](quick-start.md) — get started in 5 minutes

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
