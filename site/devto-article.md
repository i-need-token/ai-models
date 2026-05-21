# I Built the Most Comprehensive AI Model Catalog on GitHub (4,587 Models, 95 Providers)

_Choosing the right AI model shouldn't require visiting 95 different websites._

## The Problem

Every week, a new AI model launches. Every month, a new provider enters the market. Keeping track of pricing, context windows, capabilities, and which models support tool calling or structured output is a full-time job.

I got tired of:

- Checking OpenAI's pricing page, then Anthropic's, then Google's...
- Wondering "which models support tool calling again?"
- Not knowing the cheapest model with a 128K+ context window
- Manually comparing prices across providers for the same model

So I built [AI Models Catalog](https://github.com/i-need-token/ai-models) — a structured YAML catalog of 4,587 AI models across 95 providers, all with first-party data.

## What's Inside

Every model file includes:

```yaml
id: gpt-4.1
name: GPT-4.1
provider: openai
family: gpt-4
pricing:
  input: 2 # $/M tokens
  output: 8
  cache_read: 0.5
limit:
  context: 1047576 # 1M tokens
  output: 32768
tool_call: true
structured_output: true
reasoning: false
modalities:
  input: [text, image]
  output: [text]
```

No more guessing. No more visiting 95 websites.

## The Numbers

| Metric              | Count |
| ------------------- | ----- |
| Total models        | 4,587 |
| Providers           | 95    |
| Tool-calling models | 2,350 |
| Reasoning models    | 1,306 |
| Vision models       | 1,487 |
| Free models         | 81    |
| Open weights        | 527   |
| Structured output   | 829   |

## Key Design Decisions

### First-Party Data Only

Every data point comes from the provider's own API or documentation. No third-party aggregators. This means:

- Pricing is always accurate and up-to-date
- Model capabilities are verified against official sources
- No stale or incorrect data from middlemen

### Machine-Readable YAML

Not a web UI you can't query. Not a PDF you can't parse. Structured YAML with:

- TypeScript type definitions
- Zod runtime validation
- JSON Schema for other languages

### Automated Sync

Scrape scripts pull fresh data from provider APIs. CI validates everything on every push. No manual updates needed.

## How to Use It

### One Command

```bash
# Download the latest data
curl -sL https://github.com/i-need-token/ai-models/releases/latest/download/models.json | jq '.models | length'
# → 4587
```

### npm Package

```bash
npm install ai-models
```

```javascript
import catalog from "ai-models/models.json";
console.log(catalog.models.length); // 4587
```

### GitHub Action

```yaml
- uses: i-need-token/ai-models@v0.2.0
  id: catalog
- run: echo "Models: ${{ steps.catalog.outputs.model-count }}"
```

### Interactive Catalog

Try it live: [i-need-token.github.io/ai-models](https://i-need-token.github.io/ai-models/)

Features:

- 🔍 Search, sort, and filter 4,587 models
- 💰 **Price Calculator** — enter your token usage, see monthly costs
- 🎯 **Model Picker** — answer 2 questions, get top 5 recommendations
- 📋 Model detail modal with full metadata
- ⬇️ Export CSV/JSON
- 🔗 Shareable URL filters

## Unique Features You Won't Find Elsewhere

### Price Calculator

Enter your monthly token usage and instantly see the cheapest, median, and most expensive model. Filter by capability first (e.g., "only tool-calling models"), then calculate.

### Model Picker

Answer 2 questions:

1. What do you need? (chat, code, agents, reasoning, vision, cheap, free, large context)
2. What's your budget? (any, free, low, mid, high)

Get the top 5 recommended models with pricing and capability badges.

### 68 Documentation Pages

34 English + 34 Chinese pages covering:

- [Free Models](https://github.com/i-need-token/ai-models/blob/main/docs/free-models.md) — 81 free models
- [OpenAI Alternatives](https://github.com/i-need-token/ai-models/blob/main/docs/openai-alternatives.md) — 70+ OpenAI-compatible providers
- [Agentic Models](https://github.com/i-need-token/ai-models/blob/main/docs/agentic-models.md) — 1,080 models with tool_call + reasoning
- [Code Models](https://github.com/i-need-token/ai-models/blob/main/docs/code-models.md) — 189 code-focused models
- [Pricing Comparison](https://github.com/i-need-token/ai-models/blob/main/docs/pricing-comparison.md) — side-by-side pricing
- And 29 more...

## How It Compares

| Project             | Scope                       | Data Source      | Format            | Auto-Update | Free    |
| ------------------- | --------------------------- | ---------------- | ----------------- | ----------- | ------- |
| **This catalog**    | 95 providers, 4,587+ models | First-party APIs | YAML + JSON + CSV | Weekly CI   | ✅      |
| OpenRouter models   | OpenRouter only             | OpenRouter API   | Web UI            | ✅          | ✅      |
| Artificial Analysis | ~30 providers               | Mixed            | Web UI            | ✅          | Partial |
| Helicone models     | ~20 providers               | Mixed            | Web UI            | ✅          | Partial |
| BerriAI/litellm     | 100+ providers              | Community        | Python config     | ✅          | ✅      |

Key differentiators:

- **First-party data only** — not aggregated from third parties
- **Machine-readable** — structured data with validation, not just a web UI
- **Multiple formats** — YAML, JSON, CSV, npm, GitHub Action, Hugging Face
- **Bilingual docs** — 68 pages in English and Chinese

## What's Next

- Model benchmarking data integration
- Historical pricing trends
- REST API for querying model data
- Python package (`pip install ai-models`)
- Regional availability data

## Get Started

⭐ [Star the repo](https://github.com/i-need-token/ai-models) if you find it useful

🔍 [Try the interactive catalog](https://i-need-token.github.io/ai-models/)

📦 [Download the data](https://github.com/i-need-token/ai-models/releases)

📖 [Read the docs](https://github.com/i-need-token/ai-models/tree/main/docs)

---

_If you're building with AI models, this catalog saves you hours of research. Give it a star and help others find it too!_
