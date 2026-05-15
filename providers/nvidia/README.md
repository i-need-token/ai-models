# NVIDIA

NVIDIA NIM (NVIDIA Inference Microservices) provides optimized inference for AI models, including their own Nemotron family.

## Data Sources

| Data          | Source                                                  | Method                  |
| ------------- | ------------------------------------------------------- | ----------------------- |
| Model list    | `https://integrate.api.nvidia.com/v1/models`            | API (OpenAI-compatible) |
| Model details | `https://build.nvidia.com/nvidia/<model-id>`            | CSR (browser only)      |
| Pricing       | `https://build.nvidia.com/nvidia/<model-id>` Deploy tab | CSR (browser only)      |

## Approach

Hardcoded model data and pricing. The NVIDIA API returns model IDs but no context limits or pricing. The build.nvidia.com site is fully client-side rendered and not scrapable via curl. Pricing is available only on individual model Deploy tabs via partner endpoints.

## Model Families

- **Nemotron Ultra** — 253B parameter reasoning model (deprecated)
- **Nemotron Super** — 49B parameter reasoning model (active: v1.5)
- **Nemotron 3** — Earlier generation (Super 120B, Nano 30B, Nano Omni 30B)
- **Nemotron 4** — 340B parameter models (Instruct, Reward)
- **Nemotron Mini/Nano** — Small models (4B, 9B, 12B, 30B)
- **Cosmos** — Vision-language reasoning models
- **ChatQA** — RAG-optimized models
- **Minitron** — Distilled models from Mistral Nemo

## Notes

- NVIDIA offers free trial API credits; models without partner serverless endpoints use `FreePricing`
- Partner endpoint pricing (DeepInfra, Together, etc.) varies; we record the lowest available rate
- Many older Nemotron models are deprecated but still accessible
- All NVIDIA-produced models are open-weight
