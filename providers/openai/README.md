# OpenAI

## Data Source

CSR website (Next.js RSC at `developers.openai.com`)

## Discovery Flow

1. Fetch the models index page to discover all model IDs
2. Detect deprecated models from index page card badges (scoped to each `<a>` card boundary)
3. Fetch each model's detail page for full specs
4. Second deprecated check on detail page header section (before "Snapshots")
5. Combine both sources: `deprecated = indexDeprecated || detailDeprecated`

## Snapshot Parsing

- The Snapshots section has a header entry (model name + "pointing to" snapshot + optional Deprecated badge) and a list of snapshot IDs with colored dots
- Snapshot IDs use two date formats: `YYYY-MM-DD` (e.g., `gpt-4o-2024-08-06`) and `MMDD` (e.g., `gpt-3.5-turbo-0125`). Short-date format has no year.
- Some snapshot IDs don't start with the parent model ID (e.g., `gpt-4-0125-preview` is a snapshot of `gpt-4-turbo-preview`)

## Pricing Patterns

| Model type            | Pattern                | Pricing type                             |
| --------------------- | ---------------------- | ---------------------------------------- |
| Chat/reasoning        | Input + Output divs    | `TokenPricing`                           |
| Image gen (dall-e)    | Resolution + price     | `UnitPricing` with `unit: "per_image"`   |
| Video gen (sora)      | Resolution + price     | `VideoPricing` with `unit: "per_second"` |
| Embedding/TTS/whisper | Single "Cost" div      | `TokenPricing` with input=output         |
| Moderation            | No pricing section     | `FreePricing` with `unit: "free"`        |
| No pricing on page    | (gpt-image-2, gpt-oss) | `FreePricing` with `unit: "free"`        |

## Known Limitations

- `deriveName` and `deriveFamily` use pattern matching on model IDs. New naming conventions may need new rules.
- `open_weights` is determined by `modelId.startsWith("gpt-oss")`. New open-weight naming conventions will need updating.
- `temperature: true` is not extracted per-model — OpenAI's detail page doesn't expose it as a feature.
- Models with no pricing section are marked as `unit: "free"`. This may not be accurate if pricing is available elsewhere.
