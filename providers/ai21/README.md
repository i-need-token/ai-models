# AI21 Labs

AI21 Labs produces the Jamba family of open-weight models, built on the novel Mamba-Transformer hybrid architecture.

## Data Sources

| Data           | Source                                                                                                 | Method                 |
| -------------- | ------------------------------------------------------------------------------------------------------ | ---------------------- |
| Model details  | [docs.ai21.com/docs/jamba-foundation-models.md](https://docs.ai21.com/docs/jamba-foundation-models.md) | Mintlify .md endpoint  |
| Pricing        | [ai21.com/pricing](https://www.ai21.com/pricing)                                                       | CSR (browser-verified) |
| API model list | `https://api.ai21.com/studio/v1/models`                                                                | API (requires auth)    |

## Approach

Hardcoded model data and pricing. AI21's docs use Mintlify and provide `.md` endpoints for model details, but pricing is only available on the CSR-only ai21.com/pricing page. The API requires authentication.

## Model Families

- **Jamba Large** — 398B (94B active) parameter model, 256K context
- **Jamba Mini** — 52B (12B active) parameter model, 256K context
- **Jamba 3B** — 3B parameter on-device model, 256K context (no API endpoint)

## Notes

- All Jamba models are open-weight and self-deployable
- Jamba uses a Mamba-Transformer hybrid architecture for efficiency
- Knowledge cutoff: August 22, 2024
- Officially supports 9 languages: English, Spanish, French, Portuguese, Italian, Dutch, German, Arabic, Hebrew
- Deprecated models (1.5, 1.6, Mini 1.7) are included for historical reference
