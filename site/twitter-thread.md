# Twitter/X Thread Template

## Thread: AI Models Catalog Launch

1/ 🤯 I just cataloged every major AI model on the market.

4,587 models. 95 providers. All with pricing, context windows, and capabilities.

And it's all open source. Let me show you what I built 👇

2/ The problem: Every week a new AI model launches. Every month a new provider.

Keeping track of pricing, context windows, and capabilities across 95 websites is impossible.

So I automated it. All data scraped from first-party APIs.

3/ Every model has structured YAML with:

- 💰 Pricing (input, output, cache)
- 📏 Context window & max output
- 🔧 Tool calling, reasoning, structured output
- 👁️ Vision, audio, video capabilities
- 🆓 Free/open weights status

4/ The numbers:

- 4,587 models across 95 providers
- 2,350 with tool calling
- 1,306 reasoning models
- 81 completely free
- 527 with open weights

5/ But here's the best part — the interactive catalog:

🔍 Search and filter 4,587 models
💰 Price calculator — enter your tokens/month, see monthly costs
🎯 Model picker — answer 2 questions, get top 5 recommendations
⚖️ Side-by-side comparison of any 2-3 models

Try it: i-need-token.github.io/ai-models

6/ Need the cheapest model with 128K+ context and tool calling?

Or the best free model for coding?

The Model Picker answers these in 2 clicks.

7/ All data is machine-readable:

- YAML source with TypeScript types + Zod validation
- JSON & CSV downloads
- npm package (npm install ai-models)
- GitHub Action for CI/CD
- Hugging Face dataset

8/ 68 documentation pages covering:

- Free models guide (81 free models!)
- OpenAI alternatives (70+ compatible providers)
- Agentic models (1,080 with tool calling + reasoning)
- Code models, vision models, audio models
- Pricing comparison, context windows, and more

9/ Quick start:

curl -sL https://github.com/i-need-token/ai-models/releases/latest/download/models.json | jq '.models | length'

# → 4587

Or as a GitHub Action:

- uses: i-need-token/ai-models@v0.2.0

10/ If you're building with AI models, this saves you hours of research.

⭐ Star the repo: github.com/i-need-token/ai-models
🔍 Try the catalog: i-need-token.github.io/ai-models
📖 Read the docs: github.com/i-need-token/ai-models/tree/main/docs

What would you like to see next? 🙏

---

## Single Tweet Version

I built a catalog of 4,587 AI models across 95 providers — all with structured pricing, context windows, and capabilities.

Free, open source, machine-readable. With an interactive catalog that has a price calculator, model picker, and comparison tool.

⭐ github.com/i-need-token/ai-models
🔍 i-need-token.github.io/ai-models
