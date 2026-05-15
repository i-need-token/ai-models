# DeepSeek

## Data Sources

| Data                                       | Source                                      | Format                        | URL            |
| ------------------------------------------ | ------------------------------------------- | ----------------------------- | -------------- |
| Model discovery, pricing, features, limits | `api-docs.deepseek.com/quick_start/pricing` | HTML table (Docusaurus SSR)   | Single page    |
| Release dates                              | `api-docs.deepseek.com/updates`             | HTML article (Docusaurus SSR) | Changelog page |

## Key Notes

- **Docusaurus SSR**: Both pages are server-side rendered, so all data is available in the initial HTML response — no JS execution needed.
- **Single pricing table**: The pricing page has one HTML table with all model data: context length, max output, features (JSON output, tool calls, chat prefix, FIM), and pricing (cache hit, cache miss, output).
- **Colspan/Rowspan**: The pricing table uses `colspan` for shared values and `rowspan` for grouped rows (Features, Pricing). The parser expands `colspan` cells and takes the last N cells as model values.
- **Deprecated aliases**: `deepseek-chat` and `deepseek-reasoner` are deprecated aliases for `deepseek-v4-flash` (non-thinking and thinking modes respectively). They are included with `deprecated: true`.
- **Discount pricing**: V4-Pro pricing shows both discounted and original prices (e.g., "$0.435 (75% off) $1.74"). The scraper extracts the first (discounted) price as the current effective price.
- **Cache read pricing**: Both models have cache hit pricing (`cache_read` in the output), extracted from the "1M INPUT TOKENS (CACHE HIT)" row.
- **Thinking mode**: Both V4-Flash and V4-Pro support thinking mode. The `reasoning: true` feature flag is set for both.
- **FIM completion**: V4-Flash supports FIM completion in non-thinking mode only. V4-Pro also supports it in non-thinking mode.
- **Release dates**: Extracted from the `/updates` changelog page. The V4 models were released on 2026-04-24.
- **All models are text-in/text-out**: No multimodal support in the current API.

## Model Reference

| Model ID          | Name              | Context | Output | Input $/1M | Output $/1M | Deprecated |
| ----------------- | ----------------- | ------- | ------ | ---------- | ----------- | ---------- |
| deepseek-v4-flash | DeepSeek V4 Flash | 1M      | 384K   | $0.14      | $0.28       | No         |
| deepseek-v4-pro   | DeepSeek V4 Pro   | 1M      | 384K   | $0.435     | $0.87       | No         |
| deepseek-chat     | DeepSeek Chat     | 1M      | 384K   | $0.14      | $0.28       | Yes        |
| deepseek-reasoner | DeepSeek Reasoner | 1M      | 384K   | $0.14      | $0.28       | Yes        |
