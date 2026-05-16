# evroc

evroc is a European cloud provider offering AI inference through their Think platform,
with EUR per-token pricing and full EU data sovereignty.

## Data Sources

| Data                 | Source                                                          | Access Method               |
| -------------------- | --------------------------------------------------------------- | --------------------------- |
| Model list & pricing | [Think Models page](https://evroc.com/ai-services/think-models) | SSR HTML (browser-verified) |
| Model IDs            | Think Models page + known model names                           | Derived from page content   |

## Notes

- evroc Think provides sovereign European AI inference with EUR per-token pricing.
- The Think Models page lists 15 models total; only 8 chat/vision models with per-token
  pricing are included in this catalog.
- 3 embedding models and 4 transcription models are excluded (not text generation).
- 1 model (Kimi-K2-Thinking) has "Contact us" pricing and is excluded.
- The API requires authentication; model IDs are derived from the Think Models page.
- Model IDs use `--` as separator (flattened from `/` in original IDs).
- Pricing is in EUR (€), making evroc one of only two providers with EUR pricing
  (alongside Privatemode AI).
