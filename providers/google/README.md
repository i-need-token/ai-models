# Google

## Data Source

Google provides `.md.txt` format pages that serve clean markdown content, which is much easier to parse than HTML:
- Models index: `https://ai.google.dev/gemini-api/docs/models.md.txt`
- Model detail pages: `https://ai.google.dev/gemini-api/docs/models/<slug>.md.txt`
- Pricing page: `https://ai.google.dev/gemini-api/docs/pricing.md.txt`

## Discovery Flow

1. Fetch the models index page (`.md.txt`) to discover all model slugs via markdown links
2. Detect deprecated/shut down status from link text (e.g., `[Gemini 2.0 Flash Deprecated](url)`)
3. Skip shut down and deprecated models
4. Fetch each model's detail page (`.md.txt`) for full specs
5. Fetch the pricing page (`.md.txt`) and match model IDs to pricing tables
6. Promote snapshots that have their own pricing to independent models (e.g. `imagen-4.0-fast-generate-001`)

## Model Detail Page Parsing

Model detail pages use a property table format:

```markdown
## model-id

| Property | Description |
|---|---|
| Model code | `model-id` |
| Supported data types | **Inputs** Text, images, video, audio **Output** Text |
| Token limits | **Input token limit** 1,048,576 **Output token limit** 65,536 |
| Capabilities | **Thinking** Supported **Function calling** Supported ... |
| Versions | - Stable: `model-id` - Preview: `model-id-preview` |
| Latest update | June 2025 |
| Knowledge cutoff | January 2025 |
```

Deep Research models use `Agent code` instead of `Model code`.

## Pricing Page Parsing

### Section structure
Each model section starts with `## Model Name` and contains:
- Model IDs in italic code: `*`model-id-1`, `model-id-2`*` or `*`model-id-1` and `model-id-2`*`
- Pricing tables under `### Standard`, `### Batch`, `### Flex`, `### Priority` subsections
- We only extract the `### Standard` table (paid tier)

### Table format
Tables have 4 columns: `| Price type | Per unit | Price (free) | Price (paid) |`
We extract the last column (paid price).

### Input type dimensionality
Paid text often contains multiple prices by input type:
- `"$0.30 (text / image / video) $1.00 (audio)"` — we extract as `ModalityPrice` `{text: 0.30, audio: 1.00}`
- `"$0.50 (text) $3.00 (audio / video)"` — we extract as `ModalityPrice` `{text: 0.50, audio: 3.00, video: 3.00}`
- `"$0.75 (text) $3.00 or $0.005/min (audio)"` — we extract the per-M-token price as `ModalityPrice` `{text: 0.75, audio: 3.00}` (per-minute rates are ignored)

### Tiered pricing
Some models have prompt-length tiers, represented as `ContextTierPrice` arrays:
- `"$1.25, prompts <= 200k tokens $2.50, prompts > 200k tokens"` → `[{up_to: 200000, inclusive: true, price: 1.25}, {price: 2.50}]`

Affected models: Gemini 2.5 Pro, Gemini 3.1 Pro Preview, Gemini 2.5 Computer Use Preview.

### Per-model-type pricing dispatch
| Model type            | Parser function       | Pricing type                              |
| --------------------- | --------------------- | ----------------------------------------- |
| Gemini chat/reasoning | `parseGeminiPricing`  | `TokenPricing` (input/output per M tokens) |
| Gemini image gen      | `parseGeminiPricing`  | `UnitPricing` with `unit: "per_image"` (2.5 Flash) or `TokenPricing` with `ModalityPrice` output (3 Pro/3.1 Flash) |
| Gemini embedding      | `parseEmbeddingPricing` | `TokenPricing` (text input only)        |
| Image gen (Imagen)    | `parseImagenPricing`  | `UnitPricing` with `unit: "per_image"`    |
| Video gen (Veo)       | `parseVeoPricing`     | `UnitPricing` with `unit: "per_second"` and `ResolutionPrice` for tiered resolutions |
| Music gen (Lyria)     | `parseLyriaPricing`   | `UnitPricing` with `unit: "per_request"`  |

### Imagen: label → model ID mapping
Imagen 4 has 3 variants in one section, each with its own row:
- `"Imagen 4 Fast image price"` → `imagen-4.0-fast-generate-001` ($0.02)
- `"Imagen 4 Standard image price"` → `imagen-4.0-generate-001` ($0.04)
- `"Imagen 4 Ultra image price"` → `imagen-4.0-ultra-generate-001` ($0.06)

### Veo: label → model ID mapping
Veo 3.1 has 3 variants, each with its own row and resolution-tiered pricing:
- `"Veo 3.1 Standard video with audio price"` → `veo-3.1-generate-preview` (`ResolutionPrice`: {720p: 0.40, 1080p: 0.40, 4k: 0.60})
- `"Veo 3.1 Fast video with audio price"` → `veo-3.1-fast-generate-preview` (`ResolutionPrice`: {720p: 0.10, 1080p: 0.12, 4k: 0.30})
- `"Veo 3.1 Lite video with audio price"` → `veo-3.1-lite-generate-preview` (`ResolutionPrice`: {720p: 0.05, 1080p: 0.08})

Veo 2 uses a different label format: `"Video price"` (no variant qualifier).

### Lyria: label → model ID mapping
Lyria 3 has 2 variants:
- `"Lyria 3 Clip Preview (30s)"` → `lyria-3-clip-preview` ($0.04)
- `"Lyria 3 Pro Preview (Full Song)"` → `lyria-3-pro-preview` ($0.08)

### Embedding: input type rows
Gemini Embedding 2 has separate rows per input type:
- `"Text input price"` → $0.20 (extracted)
- `"Image input price"` → $0.45 (ignored — schema can't store per-type prices)
- `"Audio input price"` → $6.50 (ignored)
- `"Video input price"` → $12.00 (ignored)

Gemini Embedding 001 uses a simple `"Input price"` row.

## Known Limitations

- `temperature: true` is set for all models — Google's property table doesn't expose it as a feature.
- `tool_call`, `attachment`, `structured_output` are extracted from the capabilities section only when present.
- `open_weights` is determined by `modelId.startsWith("gemma-")`. New open-weight naming conventions will need updating.
- Tiered pricing (e.g., "prompts <= 200k tokens" vs "> 200k tokens") is fully captured as `ContextTierPrice` arrays.
- Modality-split pricing (e.g., "$0.30 (text/image/video) $1.00 (audio)") is captured as `ModalityPrice` records.
- Resolution-tiered pricing for Veo models is captured as `ResolutionPrice` records.
- Per-minute rates in Live model pricing (e.g., "$3.00 or $0.005/min") are ignored; only the per-M-token price is extracted.
- Audio/video/image-specific input prices are stored as `ModalityPrice` when multiple modalities have different rates; when the schema can't represent mixed pricing (e.g., token input + per-image output), the output pricing model takes precedence.
- Only the `### Standard` table is extracted; Batch, Flex, and Priority tier pricing are ignored.
- Deep Research models have no separate pricing (they use underlying model rates), so they are marked as free.
- `lyria-realtime-exp` has no pricing on the pricing page, so it is marked as free.
- Gemini 2.5 Flash Image has per-image output pricing and uses `UnitPricing` with `unit: "per_image"` instead of `TokenPricing`. The input token price is not stored since the type system cannot represent mixed pricing models.
- Gemini 3 Pro Image and 3.1 Flash Image have modality-split output pricing (text vs image per M tokens) and use `ModalityPrice` for the output field.
- Gemini Live models (native-audio, flash-live) have modality-split input and output pricing with per-minute alternatives (e.g., "$3.00 or $0.005/min (audio)"). Only the per-M-token price is extracted; per-minute rates are ignored.
- The `Accept-Language: en` header is still required for `.md.txt` pages to ensure English content.
- Deprecated and shut down models are skipped entirely (not included in output). This includes models with deprecated prefixes (`gemini-2.0-`, `veo-2.0-`, `veo-3.0-`).

## Pitfalls & Lessons Learned

### Pitfall 1: Use `.md.txt` format instead of HTML
**Problem:** The original scraper parsed Google's SSR HTML pages using `linkedom`, which required complex CSS selector logic, regex matching on collapsed whitespace, and fragile HTML structure assumptions. This led to 8 documented pitfalls.

**Fix:** Google provides `.md.txt` format pages (e.g., `pricing.md.txt`) that serve clean markdown content. Rewrite all parsers to use markdown format instead of HTML.

**Rule:** Always check if a documentation site provides alternative formats (JSON, markdown, YAML) before writing HTML scrapers. These formats are more stable and easier to parse.

### Pitfall 2: Markdown link format uses full URLs
**Problem:** The `.md.txt` models index page uses full URLs in links (`https://ai.google.dev/gemini-api/docs/models/<slug>`) rather than relative paths (`/gemini-api/docs/models/<slug>`), causing the regex to miss all model slugs.

**Fix:** Update the link pattern to match full URLs: `https://ai.google.dev/gemini-api/docs/models/<slug>`.

**Rule:** When switching data source formats, verify the exact URL/link patterns in the new format.

### Pitfall 3: Deprecated status in link text, not separate badge
**Problem:** In the `.md.txt` format, deprecated/shut down status is embedded in the link text (e.g., `[Gemini 2.0 Flash Deprecated](url)`) rather than as a separate badge element. The original code looked for a separate status table.

**Fix:** Parse status from the link text by matching `(Deprecated|Shut down)` at the end of the link label.

**Rule:** Status indicators may appear in different locations depending on the format. Always verify the exact structure.

### Pitfall 4: Pricing table has 4 columns, not 3
**Problem:** The pricing markdown tables have 4 columns: `| Price type | Per unit | Price (free) | Price (paid) |`. The code initially used `cols[2]` (the free column) instead of the last column (paid price).

**Fix:** Always use the last column (`cols[cols.length - 1]`) for the paid price, as the number of columns may vary.

**Rule:** When parsing markdown tables, don't assume a fixed column index for the target data. Use the last column or identify by header.

### Pitfall 5: Multiple model IDs in italic code block
**Problem:** The pricing page lists multiple model IDs in a single italic code block: `*`model-1`, `model-2` and `model-3`*`. The regex `\*`...`\*` only matched the first and last backtick-enclosed ID, missing the middle ones.

**Fix:** First match the entire italic code block, then extract all backtick-enclosed IDs from within it.

**Rule:** When extracting multiple values from a delimited block, use a two-step approach: match the block boundary, then extract all values within.

### Pitfall 6: Deep Research models use "Agent code" not "Model code"
**Problem:** Deep Research model detail pages use `| Agent code |` instead of `| Model code |` in the property table, causing the parser to miss their model IDs.

**Fix:** Handle both `model code` and `agent code` property names.

**Rule:** When parsing property tables, check for alternative property names that may be used by different model types.

### Pitfall 7: Snapshot models with independent pricing
**Problem:** Models like `imagen-4.0-fast-generate-001`, `veo-3.1-fast-generate-preview`, and `lyria-3-pro-preview` were stored as snapshots of their parent model, but they have their own pricing on the pricing page. Treating them as snapshots meant they had no pricing data.

**Fix:** After parsing each model's detail page, check if any of its snapshots have their own pricing on the pricing page. If so, promote them to independent models with their own pricing.

**Rule:** Don't assume snapshots share pricing with their parent. Always check the pricing source for each model ID.

### Pitfall 8: Including deprecated models inflates the model count
**Problem:** The scraper discovered models from alt-paths (old versions) and the pricing page (deprecated models like `veo-2.0-generate-001`), resulting in 40+ models when the official index only shows ~30 active models.

**Fix:** Skip deprecated and shut down models entirely. Filter pricing-only models to exclude known deprecated prefixes (`gemini-2.0-`, `veo-2.0-`, `veo-3.0-`).

**Rule:** Match the user's expectation: only include currently active models. Deprecated models should be excluded, not just flagged.
