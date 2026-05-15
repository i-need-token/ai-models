# Sarvam AI

Sarvam AI produces purpose-built AI models for Indian languages, covering chat LLMs, speech-to-text, text-to-speech, translation, and document intelligence.

## Data Sources

| Data           | Source                                                                                                                               | Method                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| Model details  | [docs.sarvam.ai/api-reference-docs/getting-started/models.mdx](https://docs.sarvam.ai/api-reference-docs/getting-started/models.mdx) | Fern .mdx endpoint      |
| Pricing        | [docs.sarvam.ai/api-reference-docs/pricing.mdx](https://docs.sarvam.ai/api-reference-docs/pricing.mdx)                               | Fern .mdx endpoint      |
| API model list | `https://api.sarvam.ai/v1/models`                                                                                                    | API (OpenAI-compatible) |

## Approach

Hardcoded model data and pricing. Sarvam AI uses Fern docs with accessible `.mdx` endpoints. Pricing is originally in Indian Rupees (INR) and converted to USD at ~83.5 INR/USD.

## Model Families

- **Sarvam Chat** — MoE chat LLMs (105B flagship, 30B efficient, 24B legacy)
- **Saaras** — Speech-to-text model (23 languages)
- **Bulbul** — Text-to-speech model (11 languages)
- **Sarvam Translate / Mayura** — Translation models (23/11 languages)
- **Sarvam Vision** — Document intelligence VLM (3B, 23 languages)

## Notes

- All models are optimized for Indian languages (22 Indic + English)
- Sarvam-105B and Sarvam-30B are MoE models with Apache 2.0 license
- Sarvam-M is a legacy model built on Mistral-Small, deprecated
- Pricing was originally in INR, converted to USD for consistency
