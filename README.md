<div align="center">

# 🤖 AI Models Catalog

**The most comprehensive structured catalog of AI models on GitHub**

95 providers · 4,682 models · 2,804 unique model IDs · First-party data only

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Models](https://img.shields.io/badge/Models-4%2C682-green.svg)](providers/)
[![Providers](https://img.shields.io/badge/Providers-95-orange.svg)](providers/)

</div>

---

Machine-readable YAML catalog of every major AI model provider and their models — pricing, context windows, modalities, capabilities, and more. All data sourced from first-party APIs and official documentation, never third-party aggregators.

## Why This Catalog?

|                                         |                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------- |
| 🔍 **Compare models at a glance**       | Pricing, context windows, capabilities — all in one place, all structured |
| 📊 **4,682 models across 95 providers** | From OpenAI to Zhipu, from cloud APIs to open-weights                     |
| ✅ **First-party data only**            | Every data point comes from the provider's own API or docs                |
| 🤖 **Machine-readable YAML**            | TypeScript types + Zod validation = programmatic access with confidence   |
| 🔄 **Automated sync**                   | Scrape scripts pull fresh data from provider APIs                         |

## Quick Numbers

| Metric                      | Count |
| --------------------------- | ----: |
| Providers                   |    95 |
| Model files                 | 4,682 |
| Unique model IDs            | 2,804 |
| Model families              |   441 |
| Reasoning models            | 1,306 |
| Tool-calling models         | 2,347 |
| Open-weight models          |   527 |
| Free models                 |    81 |
| Vision (image input) models | 1,488 |
| Image output models         |    84 |
| Audio input models          |   148 |
| Video input models          |   171 |

## Data at a Glance

Each model is a single YAML file with structured metadata:

```yaml
id: gpt-4o
name: GPT-4o
family: gpt-4o
reasoning: true
tool_call: true
attachment: true
structured_output: true
pricing:
  input: 2.5 # USD per million tokens
  output: 10
  cache_read: 1.25
limit:
  context: 128000 # tokens
  output: 16384
modalities:
  input: [text, image]
  output: [text]
knowledge: "2023-10"
release_date: "2024-05-13"
last_updated: "2024-08-06"
snapshots:
  - id: gpt-4o-2024-08-06
  - id: gpt-4o-2024-05-13
    deprecated: true
```

### Pricing Types

| Type           | When                      | Example                         |
| -------------- | ------------------------- | ------------------------------- |
| `TokenPricing` | Per-million-token pricing | `input: 2.5, output: 10`        |
| `VideoPricing` | Per-second pricing        | `unit: per_second, price: 0.03` |
| `UnitPricing`  | Per-image or per-request  | `unit: per_image, price: 0.04`  |
| `FreePricing`  | No cost                   | `unit: free`                    |

## Covered Providers

<details>
<summary><strong>Model Producers</strong> (develop their own models)</summary>

- **Anthropic** — Claude series
- **Google** — Gemini series
- **Meta** — Llama series
- **OpenAI** — GPT series
- **DeepSeek** — DeepSeek-V/R series
- **Alibaba Cloud** — Qwen series
- **Mistral AI** — Mistral series
- **Cohere** — Command series
- **xAI** — Grok series
- **Reka AI** — Reka series
- **AI21 Labs** — Jamba series
- **01.AI** — Yi series
- **ByteDance** — Doubao series
- **MiniMax** — MiniMax series
- **Moonshot AI** — Kimi series
- **Zhipu AI** — GLM series
- **NVIDIA** — Nemotron series
- **IBM** — Granite series
- **Microsoft** — Phi series
- **StepFun** — Step series
- **iFlytek** — SparkDesk series
- **Baidu** — ERNIE series
- **Baichuan AI** — Baichuan series
- **Tencent** — Hunyuan series
- **Xiaomi** — MiMo series
- **Sarvam AI** — Sarvam series
- **InclusionAI** — Book series
- **Writer** — Palmyra series
- **Upstage** — Solar series
- **Voyage AI** — Voyage series

</details>

<details>
<summary><strong>Inference Platforms</strong> (host and serve models)</summary>

- **Amazon Bedrock** — Multi-provider inference on AWS
- **Azure OpenAI Service** — OpenAI models on Azure
- **Google Vertex AI** — Multi-provider inference on GCP
- **OpenRouter** — 300+ models with unified API
- **Together AI** — Open-source model hosting
- **Fireworks AI** — Fast inference for open models
- **Groq** — LPU-accelerated inference
- **Cerebras** — CS-3 wafer-scale inference
- **DeepInfra** — Cost-effective model hosting
- **SiliconFlow** — GPU cloud inference
- **Novita AI** — Multi-model API
- **SambaNova** — SN40L accelerated inference
- **Cohere** — Command models + hosted models
- **Databricks** — MosaicML inference
- **Cloudflare Workers AI** — Edge inference
- **DigitalOcean** — GPU Droplets inference
- **Nebius** — AI cloud inference
- **OVHcloud** — AI Endpoints
- **Scaleway** — GPU inference
- **Vultr** — Cloud inference
- **Chutes** — Community inference
- **Kluster AI** — Distributed inference
- **NanoGPT** — Simple API, 500+ models
- **And 40+ more platforms…**

</details>

<details>
<summary><strong>Full Provider List (95)</strong></summary>

01.AI · 302.AI · AI21 Labs · AIHubMix · AI/ML API · Aion Labs · Alibaba Cloud · Amazon Bedrock · Amazon Nova · Anthropic · Arcee AI · Auriko · Azure OpenAI · Baichuan AI · Baidu · Baseten · Berget · ByteDance · Cerebras · Chutes · Clarifai · CloudFerro Sherlock · Cloudflare Workers AI · Cohere · Cortecs · DInference · Databricks · DeepInfra · DeepSeek · DigitalOcean · evroc · FastRouter · Fireworks AI · FriendliAI · GMI Cloud · Google · Google Vertex AI · Groq · HPC-AI Cloud · Hyperbolic · IBM Granite · iFlytek SparkDesk · Inception Labs · InclusionAI · Inference.net · Kluster AI · LLM Gateway · Martian · MegaNova · Meta Llama · Microsoft Phi · MiniMax · Mistral AI · Mixlayer · MoArk AI · Moonshot AI · Morph · NanoGPT · Nebius · NeuralWatt · Nous Research · Novita AI · NVIDIA · OpenAI · OpenRouter · OrcaRouter · OVHcloud · PPIO · Perplexity · Privatemode AI · Qiniu AI · Regolo · Reka AI · Requesty · SambaNova · Sarvam AI · Scaleway · SiliconFlow · SiliconFlow CN · StepFun · SubModel · Tencent Cloud TokenHub · Tencent Hunyuan · TextSynth · Together AI · Upstage · Venice AI · Voyage AI · Vultr · Wafer · Writer · xAI Grok · Xiaomi · Zhipu AI · 接口 AI

</details>

## Quick Start

### Browse the Data

No installation needed — just browse `providers/<provider>/models/` for YAML files. Every file is human-readable.

### Install & Sync

```bash
# Install dependencies
npm install

# Fetch latest data from a specific provider
npx tsx scripts/sync.ts openai
npx tsx scripts/sync.ts anthropic

# Fetch all providers
npx tsx scripts/sync.ts

# Validate all YAML files
npx tsx scripts/validate.ts
```

### Use Programmatically

```typescript
import { ModelSchema } from "./types/schemas";
import { parse } from "yaml";
import { readFileSync } from "fs";

// Load and validate a model
const raw = readFileSync("providers/openai/models/gpt-4o.yaml", "utf-8");
const model = ModelSchema.parse(parse(raw));

console.log(model.pricing); // { input: 2.5, output: 10, cache_read: 1.25 }
console.log(model.limit); // { context: 128000, output: 16384 }
console.log(model.modalities); // { input: ["text", "image"], output: ["text"] }
```

## Project Structure

```
├── providers/           # 95 provider directories
│   └── <provider>/
│       ├── provider.yaml    # Provider metadata (name, URL, API endpoints)
│       ├── scrape.ts        # Data acquisition script
│       ├── models/          # YAML model data files
│       └── README.md        # Provider-specific notes
├── types/               # TypeScript type definitions + Zod schemas
│   ├── model.ts             # Model, Snapshot, ModelModality
│   ├── pricing.ts           # TokenPricing, VideoPricing, UnitPricing, FreePricing
│   ├── provider.ts          # Provider, ProviderGroup
│   └── schemas.ts           # Zod runtime validation
├── scripts/             # CLI tools
│   ├── sync.ts              # Orchestration: scrape → write YAML
│   ├── validate.ts          # Validate all YAML against schemas
│   └── lib/                 # Shared utilities
└── docs/                # Documentation (English + 中文)
    ├── data-acquisition.md
    └── lessons-learned.md
```

## Adding a New Provider

1. Create `providers/<id>/scrape.ts` with a `scrape()` function that returns `{ provider, models }`
2. Data must come from a first-party source (provider's API or website)
3. Include a discovery step — no hardcoded model ID lists
4. Run `npx tsx scripts/sync.ts <id>` to generate initial data
5. Validate with `npx tsx scripts/validate.ts`

See [`docs/data-acquisition.md`](docs/data-acquisition.md) for detailed guidelines.

## Documentation

| Document                                                | Description                                                    |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| [Model Comparison](docs/model-comparison.md)            | Compare flagship, cost-effective, free, and open-weight models |
| [Provider Overview](docs/providers.md)                  | All 95 providers organized by type and market                  |
| [Data Acquisition](docs/data-acquisition.md)            | How we acquire and update model data                           |
| [Design Principles & Pitfalls](docs/lessons-learned.md) | Lessons learned from building the catalog                      |
| [模型对比（中文）](docs/zh/model-comparison.md)         | 旗舰、高性价比、免费和开源模型对比                             |
| [提供商概览（中文）](docs/zh/providers.md)              | 95 个提供商按类型和市场分类                                    |
| [数据采集（中文）](docs/zh/data-acquisition.md)         | 数据采集指南                                                   |
| [设计原则与陷阱（中文）](docs/zh/lessons-learned.md)    | 经验教训                                                       |

## Design Principles

- **First-party data only** — all model data comes from the provider's own API or website
- **Dynamic discovery** — scrape functions discover models from the source, not from hardcoded lists
- **Include deprecated, exclude retired** — deprecated models are included with `deprecated: true`; retired (inaccessible) models are excluded
- **Never fabricate data** — if required data is missing, skip the model with a warning rather than filling in guessed values
- **YAML source format** — human-readable, supports comments, machine-parseable
- **Snapshot inheritance** — dated model versions are nested within the parent model, inheriting all fields

## Contributing

Contributions are welcome! Whether it's adding a new provider, fixing data, or improving documentation:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-provider`)
3. Follow the [data acquisition guidelines](docs/data-acquisition.md)
4. Validate your changes (`npx tsx scripts/validate.ts`)
5. Submit a pull request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

[MIT](LICENSE)
