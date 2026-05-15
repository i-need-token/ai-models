# Writer

Writer produces Palmyra LLMs — enterprise-focused models for business applications including general chat, medical, financial, and creative use cases.

## Data Sources

| Data          | Source                                                                                         | Method                            |
| ------------- | ---------------------------------------------------------------------------------------------- | --------------------------------- |
| Model details | [dev.writer.com/home/models/choose-a-model](https://dev.writer.com/home/models/choose-a-model) | CSR (browser)                     |
| Pricing       | [dev.writer.com/home/pricing](https://dev.writer.com/home/pricing)                             | CSR (browser)                     |
| API           | `https://api.writer.com/v1/models`                                                             | OpenAI-compatible (requires auth) |

## Approach

Hardcoded model data and pricing. Writer uses ReadMe docs (CSR). API requires authentication. All data gathered via browser.

## Model Families

- **Palmyra** — Enterprise LLMs (X5 1M context, X4 128K context, plus deprecated X-003/Med/Fin/Creative)

## Notes

- Palmyra X5 has 1M token context window
- 4 models are deprecated with deprecation date 2026-07-13
- Palmyra Med is fine-tuned for medical domain
- Palmyra Fin is fine-tuned for financial domain
- Palmyra Creative is optimized for creative writing
