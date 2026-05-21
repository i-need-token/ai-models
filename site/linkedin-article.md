# LinkedIn Article: AI Models Catalog

## Title Options

1. I Built the Most Comprehensive AI Model Catalog — 4,587 Models, 95 Providers, Zero Third-Party Data
2. How to Choose the Right AI Model in 2025: A Data-Driven Guide
3. Stop Guessing Which AI Model to Use — Here's a Catalog of 4,587 Models with Real Pricing

---

## Article Body

As AI practitioners, we face a growing challenge: with 4,500+ models from 95+ providers, how do you find the right model for your use case?

I've been maintaining an open-source AI Models Catalog that solves this problem with first-party data, structured YAML, and an interactive comparison tool.

**The numbers:**

- 4,587 models across 95 providers
- 81 free models
- 2,350 with tool calling
- 1,306 with reasoning
- 1,487 with vision
- 527 open weights
- 2,195 with 128K+ context windows

**What makes it different:**

1️⃣ **First-party data only** — every data point comes from the provider's own API or documentation, not third-party aggregators. This means pricing is accurate, capabilities are verified, and context windows are real.

2️⃣ **Structured & programmable** — every model is a YAML file with Zod-validated TypeScript types. Use it in your code:

```python
import requests
catalog = requests.get(
    "https://github.com/i-need-token/ai-models/releases/latest/download/models.json"
).json()
free_models = [m for m in catalog["models"] if m.get("pricing", {}).get("unit") == "free"]
```

3️⃣ **Interactive catalog** — search, filter by 9 capabilities, compare models side-by-side, calculate monthly costs, and use the model picker wizard at https://i-need-token.github.io/ai-models/

4️⃣ **Free to use** — all data is open source under MIT license. Download as JSON, CSV, or use the npm package.

**Who is this for?**

- 🔧 Developers choosing models for their apps
- 💰 Teams optimizing AI spend
- 🤖 Agent builders needing tool-calling models
- 📊 Researchers tracking the AI landscape
- 🏢 Enterprises evaluating providers

**Key findings from the data:**

- The cheapest model with tool calling costs $0.01/1M input tokens
- 81 models are completely free (including some with 128K+ context)
- Only 527 out of 4,587 models have open weights
- 1,306 models support reasoning (a rapidly growing category)

If you work with AI models, I'd love your feedback. Star the repo, open an issue, or contribute a provider.

🔗 GitHub: https://github.com/i-need-token/ai-models
🔗 Interactive Catalog: https://i-need-token.github.io/ai-models/
🔗 npm: npm install ai-models

#AI #MachineLearning #LLM #OpenSource #ArtificialIntelligence #AIModels #DataScience

---

## Short Post Version (for sharing)

I maintain an open-source catalog of 4,587 AI models from 95 providers — all with first-party data, real pricing, and verified capabilities.

🔍 Interactive catalog: https://i-need-token.github.io/ai-models/
⭐ GitHub: https://github.com/i-need-token/ai-models

Key stats:
• 81 free models
• 2,350 with tool calling
• 1,306 with reasoning
• 527 open weights
• 2,195 with 128K+ context

Search, filter, compare, and calculate costs — all in one place.

#AI #LLM #OpenSource #MachineLearning
