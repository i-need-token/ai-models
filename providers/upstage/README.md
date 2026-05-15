# Upstage

Upstage produces Solar LLMs and Document Intelligence models, optimized for Korean with English and Japanese support.

## Data Sources

| Data          | Source                                                                                   | Method                            |
| ------------- | ---------------------------------------------------------------------------------------- | --------------------------------- |
| Model details | [console.upstage.ai/docs/models](https://console.upstage.ai/docs/models)                 | CSR (browser)                     |
| Model history | [console.upstage.ai/docs/models/history](https://console.upstage.ai/docs/models/history) | CSR (browser)                     |
| Pricing       | [upstage.ai/pricing/api](https://www.upstage.ai/pricing/api)                             | CSR (browser)                     |
| API           | `https://api.upstage.ai/v1`                                                              | OpenAI-compatible (requires auth) |

## Approach

Hardcoded model data and pricing. Upstage uses a Next.js CSR console with no `.md`/`.mdx` fallback. The `llms.txt` endpoint exists but returns CSR HTML. All data was gathered via browser.

## Model Families

- **Solar** — Chat LLMs (Pro 3 MoE 102B, Pro 2 31B, Mini 10.7B)
- **Solar Embedding** — Embedding model (query + passage variants)
- **Document Parse** — Document → HTML/Markdown conversion
- **Document OCR** — Text recognition from images/PDFs
- **Information Extract** — Structured key-value extraction
- **Document Classify** — Semantic document classification

## Notes

- Solar Pro 3 is a MoE model: 102B total / 12B active parameters
- Solar Mini is open-weight (Apache 2.0)
- Solar Embedding has two aliases: `embedding-query` and `embedding-passage`
- Document Intelligence models are priced per page, not per token
- Syn Pro (Japanese-focused 31B) was excluded due to unlisted pricing
- Solar DocVision (experimental VQA) was excluded as preview without pricing
- Groundedness Check was excluded as beta without pricing
