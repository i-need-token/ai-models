# Reddit / HN Post Templates

## r/LocalLLaMA

**Title:** I built a catalog of 4,587 AI models across 95 providers — all with structured pricing, context windows, and capabilities

**Body:**

Hey r/LocalLLaMA,

I got tired of checking 95 different websites to compare AI model pricing and capabilities, so I built [AI Models Catalog](https://github.com/i-need-token/ai-models) — a structured YAML catalog of every major AI model.

**The numbers:**

- 4,587 models across 95 providers
- 81 free models, 527 open weights
- 2,350 tool-calling, 1,306 reasoning, 1,487 vision
- All data from first-party APIs (no third-party aggregators)

**What makes it different:**

- Machine-readable YAML (not just a web UI)
- TypeScript types + Zod validation
- Multiple formats: JSON, CSV, npm, GitHub Action
- 68 documentation pages (34 EN + 34 ZH)

**Free models:** 81 models you can use at zero cost, including models on Groq, Cerebras, Cloudflare Workers AI, and more.

**Open weights:** 527 models with downloadable weights (Llama, Mistral, Qwen, DeepSeek, etc.)

**Interactive catalog:** [i-need-token.github.io/ai-models](https://i-need-token.github.io/ai-models/) — search, filter, price calculator, model picker

**Quick start:**

```bash
curl -sL https://github.com/i-need-token/ai-models/releases/latest/download/models.json | jq '.models | length'
# → 4587
```

Would love feedback on what providers or features to add next!

---

## r/MachineLearning

**Title:** [P] AI Models Catalog — 4,587 models, 95 providers, structured YAML with pricing and capabilities

**Body:**

We created a structured catalog of AI model metadata to make model comparison and selection easier for researchers and developers.

**Repository:** https://github.com/i-need-token/ai-models

**Key features:**

- Structured YAML for every model (pricing, context windows, modalities, capabilities)
- First-party data only — scraped from provider APIs
- Zod-validated TypeScript types
- JSON, CSV, npm package, GitHub Action outputs
- 68 documentation pages covering specific use cases

**Research applications:**

- Model selection for experiments
- Pricing analysis across providers
- Capability tracking (tool calling, reasoning, structured output)
- Context window comparison
- Open weights tracking

**Data access:**

```python
import json
with open("models.json") as f:
    catalog = json.load(f)
    models = catalog["models"]
    free = [m for m in models if m.get("pricing", {}).get("unit") == "free"]
    print(f"Free models: {len(free)}")
```

Feedback and contributions welcome!

---

## Hacker News (Show HN)

**Title:** Show HN: AI Models Catalog – 4,587 models, 95 providers, structured pricing and capabilities

**Body:**

I built a structured catalog of AI model metadata because I was tired of visiting 95 different websites to compare models.

Every model has structured YAML with pricing (per-token), context windows, modalities, and capabilities. All data comes from first-party APIs — no third-party aggregators.

Key features:

- 4,587 models across 95 providers
- 81 free models, 527 open weights
- Machine-readable YAML with Zod validation
- JSON, CSV, npm, GitHub Action
- Interactive catalog with price calculator and model picker
- 68 documentation pages

Try it: https://i-need-token.github.io/ai-models/
Repo: https://github.com/i-need-token/ai-models
