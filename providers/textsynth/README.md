# TextSynth

TextSynth is a European inference platform hosting open-source models with
per-token USD pricing and separate input/output token rates.

## Data Sources

| Data                 | Source                                                         | Access Method             |
| -------------------- | -------------------------------------------------------------- | ------------------------- |
| Model list & pricing | [Pricing page](https://textsynth.com/pricing.html)             | Static HTML (curl)        |
| API documentation    | [Documentation page](https://textsynth.com/documentation.html) | Static HTML (curl)        |
| Model IDs            | Pricing page + documentation engine IDs                        | Derived from page content |

## Notes

- TextSynth uses its own API format (not OpenAI-compatible).
  API: `POST https://api.textsynth.com/v1/engines/{engine_id}/completions`
- The pricing page lists 7 LLM models. MADLAD400 7B is a translation model
  and is excluded. 6 chat/completion models remain.
- Pricing has separate input and output token rates (output is 10x input).
- Pricing is available in USD, EUR, and credits. We use USD.
- Model IDs use `--` as separator (flattened from `/` in original IDs).
- All models are open-source/open-weights.
- TextSynth also offers embedding, image generation, speech-to-text, and
  text-to-speech models, but these are not included in this catalog.
