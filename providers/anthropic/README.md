# Anthropic

## Data Source

SSR website (Next.js on `platform.claude.com`)

## Discovery Flow

1. Fetch three pages: models, pricing, deprecations
2. Parse models page SSR table for current model specs (context, output, knowledge, reasoning)
3. Parse RSC payload for legacy model specs
4. Parse pricing page SSR table for model pricing
5. Parse deprecations page: Table 0 = Active, Table 1 = Deprecated, Table 2+ = Retired (excluded)
6. Cross-reference stable IDs from deprecation info
7. Reasoning: extracted from "Extended thinking" and "Adaptive thinking" rows

## Known Limitations

- `temperature`, `tool_call`, `attachment`, `structured_output`, `open_weights` are hardcoded for all models because Anthropic's models page doesn't expose these as per-model features. All active models support the first four; none have open weights.
- Input modalities `["text", "image", "pdf"]` are hardcoded for all models (same reason).
- Only the 5-minute cache write price is stored; the 1-hour cache write tier is not captured.
- `knowledge` uses "Reliable knowledge cutoff" from the models page, not "Training data cutoff".
