<div align="center">

# 🤖 AI Models Catalog [![Awesome](https://awesome.re/badge-flat2.svg)](https://github.com/sindresorhus/awesome)

**The most comprehensive structured catalog of AI models on GitHub**

95 providers · 4,587 model files · 2,712 unique model IDs · First-party data only

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/ai-models.svg)](https://www.npmjs.com/package/ai-models)
[![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97-Dataset-blue)](https://huggingface.co/datasets/i-need-token/ai-models)
[![Models](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/i-need-token/ai-models/main/.github/badges/models.json)](providers/)
[![Providers](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/i-need-token/ai-models/main/.github/badges/providers.json)](providers/)
[![CI](https://github.com/i-need-token/ai-models/actions/workflows/validate.yml/badge.svg)](https://github.com/i-need-token/ai-models/actions/workflows/validate.yml) [![GitHub stars](https://img.shields.io/github/stars/i-need-token/ai-models?style=social)](https://github.com/i-need-token/ai-models/stargazers) [![Last Updated](https://img.shields.io/github/last-commit/i-need-token/ai-models?label=updated)](https://github.com/i-need-token/ai-models/commits/main) [![Star History](https://api.star-history.com/svg?repos=i-need-token/ai-models&type=Date)](https://star-history.com/#i-need-token/ai-models&Date)

</div>

> ⭐ **If this catalog helps you choose the right model, please star this repo — it helps others discover it!**

---

Machine-readable YAML catalog of every major AI model provider and their models — pricing, context windows, modalities, capabilities, and more. All data sourced from first-party APIs and official documentation, never third-party aggregators.

**[Quick start →](docs/quick-start.md)** · **[Choose a model →](docs/model-selection.md)** · **[Compare pricing →](docs/pricing-comparison.md)** · **[🔍 Search →](https://i-need-token.github.io/ai-models/)** · **[Download CSV →](https://github.com/i-need-token/ai-models/releases/latest/download/models.csv)** · **[JSON →](https://github.com/i-need-token/ai-models/releases/latest/download/models.json)**

> 🆓 **81 free models** with tool calling, reasoning, and vision — [see the list →](docs/free-models.md) · 💰 **Cheapest models from $0.01/M tokens** — [compare pricing →](docs/pricing-comparison.md) · 🤖 **1,080 agentic models** for AI agents — [find yours →](docs/agentic-models.md)

> 💡 **Try it now** — fetch model data in one command:
>
> ```bash
> curl -sL https://github.com/i-need-token/ai-models/releases/latest/download/models.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{len(d["models"])} models across {len(set(m["provider"] for m in d["models"]))} providers')"
> ```

## 💡 Quick Value Demo

> **What's the cheapest model with tool calling?** → ling-2.6-flash at **$0.01/$0.03** per M tokens ([see all 2,350 →](docs/tool-calling.md))
> **What's the best free reasoning model?** → DeepSeek R1 — **92% MATH-500** ([see all 81 free →](docs/free-models.md))
> **Which model has the largest context window?** → Gemini 2.5 Pro — **1,048,576 tokens** ([see all context windows →](docs/context-windows.md))

## 🖥️ Interactive Catalog

[![AI Models Catalog — Interactive model comparison tool](docs/images/catalog-screenshot.png)](https://i-need-token.github.io/ai-models/)

**[Try it live →](https://i-need-token.github.io/ai-models/)** — Search, filter, compare 4,587+ models with 25+ features including dark/light theme, keyboard shortcuts, price calculator, and model picker wizard.

## Why This Catalog?

|                                         |                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------- |
| 🔍 **Compare models at a glance**       | Pricing, context windows, capabilities — all in one place, all structured |
| 📊 **4,587 models across 95 providers** | From OpenAI to Zhipu, from cloud APIs to open-weights                     |
| ✅ **First-party data only**            | Every data point comes from the provider's own API or docs                |
| 🤖 **Machine-readable YAML**            | TypeScript types + Zod validation = programmatic access with confidence   |
| 🔄 **Automated sync**                   | Scrape scripts pull fresh data from provider APIs                         |

## Contents

- [Quick Compare](#quick-compare)
- [🏆 Model Picks](#-model-picks)
- [Use Cases](#use-cases)
- [Quick Numbers](#quick-numbers)
- [Example Model](#example-model)
- [Programmatic Usage](#programmatic-usage)
- [GitHub Action](#use-as-github-action)
- [Documentation](#documentation)
- [Provider Showcase](#provider-showcase)
- [Contributing](#contributing)
- [Who's Using This](#whos-using-this)
- [License](#license)

## Quick Compare

> Popular models at a glance — full data for [4,587 models](docs/model-comparison.md)

| Model            | Provider  | Context | Input $/M | Output $/M | Tools | Reason | Vision |
| ---------------- | --------- | ------- | --------- | ---------- | ----- | ------ | ------ |
| gpt-4.1          | openai    | 1M      | $2        | $8         | ✓     |        | ✓      |
| gpt-4.1-mini     | openai    | 1M      | $0.40     | $1.60      | ✓     |        | ✓      |
| gpt-4.1-nano     | openai    | 1M      | $0.10     | $0.40      | ✓     |        | ✓      |
| o3               | openai    | 200K    | $10       | $40        | ✓     | ✓      | ✓      |
| o4-mini          | openai    | 200K    | $1.10     | $4.40      | ✓     | ✓      | ✓      |
| claude-opus-4    | anthropic | 200K    | $15       | $75        | ✓     | ✓      | ✓      |
| claude-sonnet-4  | anthropic | 200K    | $3        | $15        | ✓     | ✓      | ✓      |
| claude-haiku-4   | anthropic | 200K    | $1        | $5         | ✓     | ✓      | ✓      |
| gemini-2.5-pro   | google    | 1M      | $1.25     | $10        | ✓     | ✓      | ✓      |
| gemini-2.5-flash | google    | 1M      | $0.15     | $0.60      | ✓     | ✓      | ✓      |
| deepseek-r1      | deepseek  | 128K    | $0.55     | $2.19      |       | ✓      |        |
| deepseek-chat    | deepseek  | 128K    | $0.14     | $0.28      | ✓     |        |        |
| llama-4-maverick | meta      | 1M      | $0.20     | $0.20      | ✓     |        | ✓      |
| llama-4-scout    | meta      | 10M     | $0.03     | $0.03      | ✓     |        | ✓      |
| grok-3           | xai       | 131K    | $3        | $15        | ✓     |        | ✓      |
| grok-3-mini      | xai       | 131K    | $0.30     | $0.50      | ✓     | ✓      | ✓      |
| mistral-large    | mistral   | 128K    | $2        | $6         | ✓     |        | ✓      |
| qwen3-235b-a22b  | alibaba   | 128K    | $0.14     | $0.42      | ✓     | ✓      | ✓      |
| qwen3-30b-a3b    | alibaba   | 128K    | $0.03     | $0.05      | ✓     | ✓      | ✓      |

<details><summary>📖 How to read this table</summary>

- **Context**: Maximum context window (input + output tokens)
- **Input/Output $/M**: Price per million tokens
- **Tools**: Supports function/tool calling
- **Reason**: Uses chain-of-thought reasoning
- **Vision**: Accepts image input
- Prices shown are for standard (non-cached) API calls. Many providers offer 50-90% discounts for cached inputs.

</details>

## 🏆 Model Picks

> Curated recommendations for common use cases — from [4,587 models](docs/model-comparison.md) across 95 providers

| Use Case              | Model            | Why                                     | Input $/M | Context |
| --------------------- | ---------------- | --------------------------------------- | --------- | ------- |
| **Coding**            | gpt-4.1          | Best code generation + 1M context       | $2        | 1M      |
| **Coding (cheap)**    | gpt-4.1-nano     | 20x cheaper, great for autocomplete     | $0.10     | 1M      |
| **Reasoning**         | o4-mini          | Best cost-effective reasoning           | $1.10     | 200K    |
| **Reasoning (power)** | claude-opus-4    | Deepest reasoning for hard problems     | $15       | 200K    |
| **Agents**            | claude-sonnet-4  | Best tool use + reasoning balance       | $3        | 200K    |
| **Agents (cheap)**    | gemini-2.5-flash | Fastest agent loop under $1             | $0.15     | 1M      |
| **Vision**            | gemini-2.5-pro   | Best multimodal understanding           | $1.25     | 1M      |
| **Free**              | llama-4-scout    | 10M context, open weights, free on Groq | $0        | 10M     |
| **Open weights**      | deepseek-r1      | Best open reasoning model               | $0.55     | 128K    |
| **Large context**     | gemini-2.5-flash | 1M context at lowest price              | $0.15     | 1M      |

## Use Cases

| Use Case                       | How This Catalog Helps                                                                                                                             |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 💰 **Find the cheapest model** | [Pricing comparison](docs/pricing-comparison.md) across 95 providers                                                                               |
| 🔎 **Pick the right model**    | [Model comparison](docs/model-comparison.md) by capability, context, cost                                                                          |
| 🔍 **Search & compare models** | [Interactive catalog](https://i-need-token.github.io/ai-models/) — search, filter, compare, price calc, model picker, copy-as-code, share, j/k nav |
| 🔌 **Build an API gateway**    | Structured pricing + modality data for routing decisions                                                                                           |
| 📊 **Track the AI landscape**  | 2,712 models with release dates, deprecation status                                                                                                |
| 🤖 **Power an AI tool**        | TypeScript types + Zod validation = type-safe access                                                                                               |
| 🌍 **Find local/EU providers** | [Provider overview](docs/providers.md) with market segmentation                                                                                    |
| 🎯 **Choose the right model**  | [Model selection guide](docs/model-selection.md) — decision framework                                                                              |
| 💸 **Optimize API costs**      | [Cached pricing](docs/cached-pricing.md) — 1,374 models with 50-90% savings                                                                        |
| 🧪 **Prototype for free**      | [Free models](docs/free-models.md) — 81 models at zero cost                                                                                        |
| 💬 **Build chat apps**         | [Chat models](docs/chat-models.md) — 2,350 models with tool calling                                                                                |
| 🖼️ **Process images/audio**    | [Multimodal models](docs/multimodal-models.md) — 1,519 models with vision/audio/video                                                              |
| 🔎 **Power semantic search**   | [Embedding models](docs/embedding-models.md) — vector search & RAG                                                                                 |
| 🤖 **Build AI agents**         | [Agentic models](docs/agentic-models.md) — 1,080 models with tool_call + reasoning                                                                 |
| 💻 **Generate & review code**  | [Code models](docs/code-models.md) — 189 code-focused models                                                                                       |
| 🎙️ **Add voice/speech**        | [Audio models](docs/audio-models.md) — 118 audio input + 34 audio output                                                                           |
| 🔄 **Switch from OpenAI**      | [OpenAI alternatives](docs/openai-alternatives.md) — pricing, free options, compat                                                                 |

## Quick Numbers

| Metric                      | Count |
| --------------------------- | ----: |
| Providers                   |    95 |
| Model files                 | 4,587 |
| Unique model IDs            | 2,712 |
| Model families              |   441 |
| Reasoning models            | 1,306 |
| Tool-calling models         | 2,350 |
| Open-weight models          |   527 |
| Free models                 |    81 |
| Vision (image input) models | 1,487 |
| Image output models         |    28 |
| Audio input models          |   118 |
| Audio output models         |    34 |
| Video input models          |   167 |

## Data at a Glance

Each model is a single YAML file with structured metadata:

```yaml
id: gpt-4.1
name: GPT-4.1
family: gpt-4.1
tool_call: true
structured_output: true
pricing:
  input: 2.0 # USD per million tokens
  output: 8.0
  cache_read: 0.5
limit:
  context: 1047576 # tokens (~1M)
  output: 32768
modalities:
  input: [text, image]
  output: [text]
release_date: "2026-05-18"
last_updated: "2026-05-18"
```

<details>
<summary>Same model as JSON (from <code>models.json</code>)</summary>

```json
{
  "id": "gpt-4.1",
  "name": "GPT-4.1",
  "family": "gpt-4.1",
  "tool_call": true,
  "structured_output": true,
  "pricing": { "input": 2.0, "output": 8.0, "cache_read": 0.5 },
  "limit": { "context": 1047576, "output": 32768 },
  "modalities": { "input": ["text", "image"], "output": ["text"] },
  "release_date": "2026-05-18",
  "last_updated": "2026-05-18"
}
```

</details>

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

### Install from npm

```bash
npm install ai-models
```

```typescript
import catalog from "ai-models"; // 4,587 models as JSON
import type { Model } from "ai-models"; // TypeScript types
```

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

# Compute catalog statistics
npx tsx scripts/stats.ts

# Compile to a single models.json
npx tsx scripts/compile.ts
```

Or use the Makefile shortcuts:

```bash
make install    # npm install
make validate   # validate all YAML
make scrape     # sync all providers
make build      # compile models.json
make stats      # compute statistics
make check      # run all checks (fmt + lint + typecheck + validate)
```

### Use Programmatically

```typescript
import { ModelSchema } from "./types/schemas";
import { parse } from "yaml";
import { readFileSync } from "fs";

// Load and validate a model
const raw = readFileSync("providers/openai/models/gpt-4.1.yaml", "utf-8");
const model = ModelSchema.parse(parse(raw));

console.log(model.pricing); // { input: 2, output: 8, cache_read: 0.5 }
console.log(model.limit); // { context: 1047576, output: 32768 }
console.log(model.modalities); // { input: ["text", "image"], output: ["text"] }
```

### Download Data

Available in JSON and CSV formats from [GitHub Releases](https://github.com/i-need-token/ai-models/releases/latest):

```bash
# JSON — full metadata (2.3 MB)
curl -sLO https://github.com/i-need-token/ai-models/releases/latest/download/models.json

# CSV — flat table for Excel/Google Sheets (560 KB)
curl -LO https://github.com/i-need-token/ai-models/releases/latest/download/models.csv
```

```html
<!-- Use in any HTML page -->
<script type="module">
  const catalog = await fetch(
    "https://github.com/i-need-token/ai-models/releases/latest/download/models.json",
  ).then((r) => r.json());
  console.log(catalog.models.length); // 4,587
</script>
```

```python
# Python — no pip install needed
import urllib.request, json
catalog = json.loads(urllib.request.urlopen("https://github.com/i-need-token/ai-models/releases/latest/download/models.json").read())
print(len(catalog['models']))  # 4587
```

```bash
# Quick stats with jq
curl -sL https://github.com/i-need-token/ai-models/releases/latest/download/models.json | jq '.models | length'
```

See [API & Programmatic Access](docs/api.md) for full usage examples in JavaScript and Python.

### Use as GitHub Action

```yaml
- uses: i-need-token/ai-models@main
  id: catalog

- name: Use catalog data
  run: |
    echo "Models: ${{ steps.catalog.outputs.model-count }}"
    echo "Providers: ${{ steps.catalog.outputs.provider-count }}"
    echo "File: ${{ steps.catalog.outputs.file-path }}"
```

Download a specific version or format:

```yaml
- uses: i-need-token/ai-models@main
  with:
    version: v0.1.0 # specific release tag
    format: csv # csv or json
    output-dir: data # directory to save files
```

See [`action.yml`](action.yml) for all inputs and outputs.

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
│   ├── stats.ts             # Compute catalog statistics
│   ├── compile.ts           # Compile to dist/models.json
│   └── lib/                 # Shared utilities
└── docs/                # Documentation (English + 中文)
```

## Adding a New Provider

1. Create `providers/<id>/scrape.ts` with a `scrape()` function that returns `{ provider, models }`
2. Data must come from a first-party source (provider's API or website)
3. Include a discovery step — no hardcoded model ID lists
4. Run `npx tsx scripts/sync.ts <id>` to generate initial data
5. Validate with `npx tsx scripts/validate.ts`

See [`docs/data-acquisition.md`](docs/data-acquisition.md) for detailed guidelines.

## Documentation

| Document                                                            | Description                                                     |
| ------------------------------------------------------------------- | --------------------------------------------------------------- |
| [Tool Calling Models](docs/tool-calling.md)                         | 2,350 tool-calling models — cheapest, largest context, free     |
| [Vision Models](docs/vision-models.md)                              | 1,487 vision models — cheapest, largest context, open-weight    |
| [Image Generation](docs/image-generation.md)                        | 28 image generation models — DALL·E, Imagen, GPT-5 Image        |
| [Audio Models](docs/audio-models.md)                                | 118 audio input + 34 audio output models                        |
| [Code Models](docs/code-models.md)                                  | 189 code-focused models across 41 providers                     |
| [Agentic Models](docs/agentic-models.md)                            | 1,080 models with tool calling + reasoning for AI agents        |
| [Chat Models](docs/chat-models.md)                                  | 2,350 models with tool calling for chat applications            |
| [Multimodal Models](docs/multimodal-models.md)                      | 1,519 models with image/audio/video input                       |
| [Embedding Models](docs/embedding-models.md)                        | 5 embedding models for search, RAG, similarity                  |
| [Video Models](docs/video-models.md)                                | 167 video input + 4 video output models                         |
| [Structured Output](docs/structured-output.md)                      | 829 JSON-mode models — cheapest, free, with tool calling        |
| [🔍 Interactive Catalog](https://i-need-token.github.io/ai-models/) | Search, sort, and filter all 4,587 models in your browser       |
| [Quick Start Guide](docs/quick-start.md)                            | Find the right model in 30 seconds                              |
| [Model Selection Guide](docs/model-selection.md)                    | Decision framework: free, best value, large context models      |
| [Benchmarks & Leaderboards](docs/benchmarks.md)                     | MMLU, MATH, HumanEval, SWE-bench, Chatbot Arena guide           |
| [Migration Guide](docs/migration-guide.md)                          | Switch providers — pricing, API compatibility, checklist        |
| [API & Programmatic Access](docs/api.md)                            | Download models.json, code examples in JS/Python                |
| [Code Examples](docs/code-examples.md)                              | Practical examples in TypeScript, Python, Go, Rust, jq          |
| [FAQ](docs/faq.md)                                                  | Common questions about the catalog, data, and contributing      |
| [Glossary](docs/glossary.md)                                        | Key terms and definitions for AI model terminology              |
| [Model Comparison](docs/model-comparison.md)                        | Compare flagship, cost-effective, free, and open-weight models  |
| [Pricing Comparison](docs/pricing-comparison.md)                    | Side-by-side pricing across providers and platforms             |
| [Cached Pricing](docs/cached-pricing.md)                            | 1,374 models with prompt caching — 50-90% input cost savings    |
| [Modality Matrix](docs/modality-matrix.md)                          | Vision, image gen, audio, video — which models support what     |
| [Context Window Comparison](docs/context-windows.md)                | Largest context windows, best value per tier                    |
| [Large Context Models](docs/large-context-models.md)                | 2,195 models with 128K+ context — 397 with 1M+                  |
| [Small & Edge Models](docs/small-models.md)                         | 1,153 models under 10B params for on-device use                 |
| [Provider Comparison](docs/provider-comparison.md)                  | Top 30 providers by model count, capabilities, pricing          |
| [Free AI Models](docs/free-models.md)                               | 81 free models — tool calling, reasoning, vision at no cost     |
| [Open-Weight Models](docs/open-weights.md)                          | 513 open-weight models — run on your own infrastructure         |
| [Reasoning Models](docs/reasoning-models.md)                        | 1,306 reasoning models — chain-of-thought and extended thinking |
| [OpenAI Alternatives](docs/openai-alternatives.md)                  | GPT-4/GPT-3.5 alternatives — pricing, free options, compat      |
| [Provider Overview](docs/providers.md)                              | All 95 providers organized by type and market                   |
| [Data Schema Reference](docs/data-schema.md)                        | Complete YAML schema — model, pricing, snapshot, provider       |
| [Data Acquisition](docs/data-acquisition.md)                        | How we acquire and update model data                            |
| [Design Principles & Pitfalls](docs/lessons-learned.md)             | Lessons learned from building the catalog                       |

**中文文档：**

| 文档                                              | 描述                                             |
| ------------------------------------------------- | ------------------------------------------------ |
| [工具调用模型](docs/zh/tool-calling.md)           | 2,350 个工具调用模型 — 最便宜、最大上下文、免费  |
| [视觉模型](docs/zh/vision-models.md)              | 1,487 个视觉模型 — 最便宜、最大上下文、开源权重  |
| [快速入门](docs/zh/quick-start.md)                | 30 秒内找到适合的模型                            |
| [图像生成](docs/zh/image-generation.md)           | 28 个图像生成模型 — DALL·E、Imagen、GPT-5 Image  |
| [音频模型](docs/zh/audio-models.md)               | 118 个音频输入 + 34 个音频输出模型               |
| [视频模型](docs/zh/video-models.md)               | 167 个视频输入 + 4 个视频输出模型                |
| [API 与编程访问](docs/zh/api.md)                  | 下载 models.json，JS/Python 代码示例             |
| [代码示例](docs/zh/code-examples.md)              | TypeScript、Python、Go、Rust、jq 实用示例        |
| [常见问题](docs/zh/faq.md)                        | 关于目录、数据和贡献的常见问题                   |
| [结构化输出](docs/zh/structured-output.md)        | 829 个 JSON 模式模型 — 最便宜、免费、带工具调用  |
| [模型对比](docs/zh/model-comparison.md)           | 旗舰、高性价比、免费和开源模型对比               |
| [定价对比](docs/zh/pricing-comparison.md)         | 各提供商和平台定价并排对比                       |
| [缓存定价](docs/zh/cached-pricing.md)             | 1,374 个支持提示缓存的模型 — 输入成本节省 50-90% |
| [模态矩阵](docs/zh/modality-matrix.md)            | 视觉、图像生成、音频、视频 — 各模型支持什么      |
| [上下文窗口对比](docs/zh/context-windows.md)      | 最大上下文窗口，各层级最佳性价比                 |
| [大上下文模型](docs/zh/large-context-models.md)   | 2,195 个 128K+ 上下文模型 — 397 个 1M+           |
| [小型/边缘模型](docs/zh/small-models.md)          | 1,153 个 10B 参数以下模型，适合端侧部署          |
| [提供商对比](docs/zh/provider-comparison.md)      | 按模型数量、能力、定价对比前 30 个提供商         |
| [免费 AI 模型](docs/zh/free-models.md)            | 81 个免费模型 — 工具调用、推理、视觉零成本       |
| [开源权重模型](docs/zh/open-weights.md)           | 513 个开源权重模型 — 自有基础设施运行            |
| [提供商概览](docs/zh/providers.md)                | 95 个提供商按类型和市场分类                      |
| [推理模型](docs/zh/reasoning-models.md)           | 1,306 个推理模型 — 链式思维和扩展思考            |
| [数据 Schema 参考](docs/zh/data-schema.md)        | 完整 YAML Schema — 模型、定价、快照、提供商      |
| [数据采集](docs/zh/data-acquisition.md)           | 数据采集指南                                     |
| [设计原则与陷阱](docs/zh/lessons-learned.md)      | 经验教训                                         |
| [智能体模型](docs/zh/agentic-models.md)           | 1,080 个工具调用+推理模型，用于 AI 智能体        |
| [代码模型](docs/zh/code-models.md)                | 189 个代码模型：生成、审查、调试                 |
| [OpenAI 替代方案](docs/zh/openai-alternatives.md) | GPT-4/GPT-3.5 替代方案：定价、免费选项、兼容性   |
| [聊天模型](docs/zh/chat-models.md)                | 2,350 个带工具调用的聊天模型                     |
| [多模态模型](docs/zh/multimodal-models.md)        | 1,519 个支持图像/音频/视频输入的模型             |
| [嵌入模型](docs/zh/embedding-models.md)           | 5 个嵌入模型用于搜索、RAG、相似度                |
| [模型选择指南](docs/zh/model-selection.md)        | 决策框架：免费、最佳性价比、大上下文模型         |
| [迁移指南](docs/zh/migration-guide.md)            | 切换提供商：定价、API 兼容性、检查清单           |
| [术语表](docs/zh/glossary.md)                     | AI 模型术语的关键词和定义                        |

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

## Alternatives

| Project                                                                   | Scope                       | Data Source      | Format            | Auto-Update | Free    |
| ------------------------------------------------------------------------- | --------------------------- | ---------------- | ----------------- | ----------- | ------- |
| **This catalog**                                                          | 95 providers, 4,587+ models | First-party APIs | YAML + JSON + CSV | Weekly CI   | ✅      |
| [Artificial Analysis](https://artificialanalysis.ai/)                     | ~30 providers               | Mixed            | Web UI            | ✅          | Partial |
| [LLM Price](https://llmprice.com/)                                        | ~25 providers               | Mixed            | Web UI            | ✅          | ✅      |
| [OpenRouter models](https://openrouter.ai/models)                         | OpenRouter only             | OpenRouter API   | Web UI            | ✅          | ✅      |
| [Helicone models](https://helicone.ai/models)                             | ~20 providers               | Mixed            | Web UI            | ✅          | Partial |
| [BerriAI/litellm](https://github.com/BerriAI/litellm)                     | 100+ providers              | Community        | Python config     | ✅          | ✅      |
| [dariubs/awesome-ai-models](https://github.com/dariubs/awesome-ai-models) | ~20 providers               | Manual           | Markdown list     | ❌          | ✅      |
| [Vellum AI](https://www.vellum.ai/)                                       | ~15 providers               | Mixed            | Web UI + API      | ✅          | Partial |
| [openai/models](https://github.com/openai/openai-python)                  | OpenAI only                 | OpenAI API       | Python SDK        | ✅          | ✅      |

**Key differentiators of this catalog:**

- **First-party data only** — scraped directly from provider APIs, not aggregated from third parties
- **Machine-readable YAML** — structured data with Zod validation, not just a web UI
- **Multiple access formats** — npm, CDN, CSV, GitHub Action, Hugging Face dataset
- **Comprehensive metadata** — pricing, context windows, modalities, capabilities, snapshots
- **Bilingual docs** — 34 English + 34 Chinese documentation pages
- **Open data** — all model data is open and programmatically accessible

## Ecosystem & Integrations

| Integration              | Description                                             | Link                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **npm package**          | Install models.json via npm                             | [`npm install ai-models`](https://www.npmjs.com/package/ai-models)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **jsDelivr CDN**         | Fetch models.json from CDN                              | [cdn.jsdelivr.net/npm/ai-models](https://cdn.jsdelivr.net/npm/ai-models@latest/models.json)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **GitHub Action**        | Use in CI/CD workflows                                  | [action.yml](action.yml)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Hugging Face**         | Dataset on HF Hub                                       | [huggingface.co/datasets/i-need-token/ai-models](https://huggingface.co/datasets/i-need-token/ai-models)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **CSV download**         | Import into Excel/Sheets                                | [GitHub Releases](https://github.com/i-need-token/ai-models/releases)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Interactive catalog**  | Search, filter, compare, price calculator, model picker | [i-need-token.github.io/ai-models](https://i-need-token.github.io/ai-models/)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **SEO comparison pages** | 21 curated comparison pages for discoverability         | [Best Models](https://i-need-token.github.io/ai-models/best-ai-models.html), [Free Models](https://i-need-token.github.io/ai-models/free-ai-models.html), [Pricing](https://i-need-token.github.io/ai-models/llm-pricing.html), [OpenAI Alt](https://i-need-token.github.io/ai-models/openai-alternatives.html), [By Provider](https://i-need-token.github.io/ai-models/ai-models-by-provider.html), [Context](https://i-need-token.github.io/ai-models/context-window-comparison.html), [Coding](https://i-need-token.github.io/ai-models/best-ai-models-for-coding.html), [Agents](https://i-need-token.github.io/ai-models/best-ai-models-for-agents.html), [Reasoning](https://i-need-token.github.io/ai-models/reasoning-models-comparison.html), [Cheapest](https://i-need-token.github.io/ai-models/cheapest-ai-models.html), [Tool Calling](https://i-need-token.github.io/ai-models/tool-calling-models-comparison.html), [Pricing Calc](https://i-need-token.github.io/ai-models/ai-model-pricing-calculator.html), [Image Gen](https://i-need-token.github.io/ai-models/best-ai-models-for-image-generation.html), [Vision](https://i-need-token.github.io/ai-models/best-ai-models-for-vision.html), [Structured Output](https://i-need-token.github.io/ai-models/structured-output-models-comparison.html), [Open Source](https://i-need-token.github.io/ai-models/open-source-ai-models.html), [Multimodal](https://i-need-token.github.io/ai-models/multimodal-ai-models.html), [State of AI](https://i-need-token.github.io/ai-models/state-of-ai-models.html), [Benchmarks](https://i-need-token.github.io/ai-models/ai-model-benchmarks.html), [ChatGPT vs Claude vs Gemini](https://i-need-token.github.io/ai-models/chatgpt-vs-claude-vs-gemini.html), [Comparison Chart](https://i-need-token.github.io/ai-models/ai-model-comparison-chart.html) |

## What's New

### v0.2.0 (May 2025)

- **21 SEO comparison pages** — Best Models, Free Models, LLM Pricing, OpenAI Alternatives, By Provider, Context Windows, Coding, Agents, Reasoning, Cheapest, Tool Calling, Pricing Calculator, Image Generation, Open Source, Multimodal, State of AI Models 2025
- **Interactive catalog** — 25+ features including dark/light theme, keyboard shortcuts, model detail modal, price calculator, model picker wizard, copy as code, share button, j/k vim navigation
- **95 providers** — comprehensive coverage of all major AI providers
- **4,587+ models** — with pricing, context windows, modalities, and capabilities
- **GitHub Action v2** — version, format, and output-dir inputs
- **npm package** — `npm install ai-models`
- **70 docs** — 35 EN + 35 ZH, all bilingual, all cross-linked

## Roadmap

- [x] ~~Embedding models documentation~~ → [docs/embedding-models.md](docs/embedding-models.md)
- [x] ~~Provider comparison~~ → [docs/provider-comparison.md](docs/provider-comparison.md)
- [x] ~~Large context models~~ → [docs/large-context-models.md](docs/large-context-models.md)
- [x] ~~Small/edge models~~ → [docs/small-models.md](docs/small-models.md)
- [x] ~~Migration guide~~ → [docs/migration-guide.md](docs/migration-guide.md)
- [ ] Model benchmarking data integration
- [ ] Streaming support metadata
- [ ] Fine-tuning availability tracking
- [ ] Regional availability data
- [ ] Community-contributed model reviews
- 🔜 **REST API** — hosted API for querying the catalog
- 🔜 **Historical pricing** — track pricing changes over time
- 🔜 **Community scrapers** — enable community-contributed scrape scripts with automated validation

## Who's Using This?

Built something with this catalog? [Open a PR](https://github.com/i-need-token/ai-models/edit/main/README.md) to add your project!

| Use Case                   | How the Catalog Is Used                                                  |
| -------------------------- | ------------------------------------------------------------------------ |
| **AI API gateways**        | Route requests to the cheapest provider with real-time pricing data      |
| **Model comparison tools** | Compare capabilities, context windows, and costs across providers        |
| **Cost optimization**      | Find the cheapest model for each task (reasoning, vision, tool calling)  |
| **AI agent frameworks**    | Select models with tool calling + structured output for agent workflows  |
| **Research & analysis**    | Track the AI landscape — 2,712 models with release dates and deprecation |
| **CI/CD pipelines**        | Use the [GitHub Action](action.yml) to fetch model data in workflows     |
| **Data dashboards**        | Import CSV into Excel/Google Sheets for visual pricing analysis          |
| **Chatbot builders**       | Pick the right model by context window, modality, and budget             |

## Contributors

Thanks to everyone who has contributed to this catalog!

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Want to contribute? Check out [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

- 📋 [Changelog](CHANGELOG.md) — what's new in each release
- 🔒 [Security Policy](SECURITY.md) — reporting vulnerabilities

## Project Timeline

| Date    | Milestone                                                   |
| ------- | ----------------------------------------------------------- |
| 2026-05 | 🚀 Public launch — 4,587 models, 95 providers, 68 docs      |
| 2026-05 | 📊 Interactive catalog live at GitHub Pages                 |
| 2026-05 | 📦 npm package, CSV export, GitHub Action                   |
| 2026-05 | 🌐 Bilingual docs — 34 EN + 34 ZH pages                     |
| 2026-05 | 🤖 1,080 agentic models, 2,350 tool-calling models          |
| Future  | 📈 More providers, REST API, historical pricing, benchmarks |

[![Star History Chart](https://api.star-history.com/svg?repos=i-need-token/ai-models&type=Date)](https://star-history.com/#i-need-token/ai-models&Date)

## Sponsors

Support this project by [sponsoring us on GitHub](https://github.com/sponsors/i-need-token). Your sponsorship helps maintain and expand the catalog.

## License

[MIT](LICENSE)
