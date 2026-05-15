# Cohere

## Data Sources

| Data                     | Source                           | Format                   | URL                 |
| ------------------------ | -------------------------------- | ------------------------ | ------------------- |
| Model discovery          | `docs.cohere.com/docs/models.md` | Markdown tables          | Fern `.md` endpoint |
| Pricing (command models) | `docs.cohere.com/docs/{slug}.md` | `<ModelShowcase>` JSX    | Fern `.md` endpoint |
| Pricing (all models)     | `cohere.com/pricing`             | Sanity CMS (RSC payload) | CSR page            |
| Model capabilities       | `docs.cohere.com/docs/{slug}.md` | `<ModelShowcase>` JSX    | Fern `.md` endpoint |

## Key Notes

- **Fern `.md` endpoints**: Cohere uses Fern for docs, which provides clean `.md` versions of every page (e.g., `docs.cohere.com/docs/command-a.md`). These contain Markdown tables and `<ModelShowcase>` JSX components with structured data.
- **Pricing data**: The `cohere.com/pricing` page is client-side rendered (CSR), but pricing data is embedded in the RSC payload from Sanity CMS. The `_type:"model"` entries contain `modelName`, `inputPrice`, and `outputPrice` fields.
- **ModelShowcase JSX**: Individual model doc pages contain `<ModelShowcase>` components with pricing info like `pricing: { input: 2.50, output: 10.0 }` and `knowledgeCutoff` dates.
- **Multiple table types**: The models.md page has multiple tables per section — the first table has model info (modality, context length, etc.), while subsequent tables may have platform compatibility info. The scraper only processes the first table per section.
- **Embed models**: Support "Text, Images, Mixed texts/images (i.e. PDFs)" as input modalities. They have context lengths but no maximum output tokens.
- **Rerank models**: Priced per search query (`per_request`), not per token. They have context lengths but no output tokens.
- **Audio models**: The `cohere-transcribe` model is priced per second (`per_second`).
- **Model ID format**: Most model IDs include a date suffix (e.g., `command-a-03-2025` → released 2025-03). The date is extracted from the ID pattern `xxx-MM-YYYY`.
- **Nightly builds**: `command-nightly` and `command-light-nightly` are excluded (no pricing, not production models).
- **Aliases**: `command-r` and `command-r-plus` without date suffixes are excluded (they're aliases for the latest dated version).

## Pricing Reference

All pricing data is sourced from the Sanity CMS embedded in `cohere.com/pricing`:

| Model                | Input ($/1M tokens) | Output ($/1M tokens) |
| -------------------- | ------------------- | -------------------- |
| Command A            | 2.50                | 10.00                |
| Command R7B          | 0.0375              | 0.15                 |
| Command A Translate  | 2.50                | 10.00                |
| Command A Reasoning  | 2.50                | 10.00                |
| Command A Vision     | 2.50                | 10.00                |
| Command R+ (08-2024) | 2.50                | 10.00                |
| Command R (08-2024)  | 0.50                | 2.00                 |
| Command R+ (04-2024) | 2.50                | 10.00                |
| Command R (03-2024)  | 0.50                | 2.00                 |
| Command Light        | 0.50                | 2.00                 |
| Command              | 1.00                | 2.00                 |
| Embed v4.0           | 0.02                | 0.02                 |
| Rerank v4.0 Pro      | $0.002/query        | —                    |
| Cohere Transcribe    | $0.006/second       | —                    |
