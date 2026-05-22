# AI Model Selection Cheatsheet

> Quick-reference guide to picking the right AI model for your use case. All data from [AI Models Catalog](https://github.com/i-need-token/ai-models) — 4,587+ models across 95 providers.

## 🎯 Decision Tree

```
What do you need?
├── Cheapest model with tool calling → ling-2.6-flash ($0.01/$0.03/M)
├── Best free reasoning model → DeepSeek R1 (92% MATH-500)
├── Largest context window → Gemini 2.5 Pro (1M tokens)
├── Best coding assistant → Claude Sonnet 4 / GPT-4.1
├── Open-source with tool calling → Qwen3 4B ($0.03/$0.15/M)
├── Free model with vision → Gemma 4 27B IT
└── Cheapest for production → bdc-coder ($0.01/$0.01/M)
```

## 💰 By Budget

| Budget        | Best Pick       | Input/Output $/M | Why                              |
| ------------- | --------------- | ---------------- | -------------------------------- |
| **Free**      | DeepSeek R1     | $0/$0            | Best reasoning among free models |
| **Free**      | Gemma 4 27B IT  | $0/$0            | Free vision + tool calling       |
| **< $0.05/M** | ling-2.6-flash  | $0.01/$0.03      | Cheapest tool calling            |
| **< $0.10/M** | Qwen3 4B        | $0.03/$0.15      | Open-source reasoning + TC       |
| **< $0.50/M** | GPT-4.1-mini    | $0.40/$1.60      | Best value frontier model        |
| **< $2/M**    | Claude Sonnet 4 | $3/$15           | Top coding + reasoning           |
| **< $5/M**    | GPT-4.1         | $2/$8            | 1M context + vision              |
| **Premium**   | o3              | $10/$40          | Best reasoning benchmark scores  |

## 🛠️ By Use Case

### AI Agents

Need: tool calling + reasoning + low latency

- **Best value**: ling-2.6-flash ($0.01/$0.03/M) — cheapest TC model
- **Balanced**: GPT-4.1-mini ($0.40/$1.60/M) — reliable + 1M context
- **Premium**: Claude Sonnet 4 ($3/$15/M) — best agentic performance

### Code Generation

Need: tool calling + structured output + large context

- **Best value**: bdc-coder ($0.01/$0.01/M) — cheapest coding model
- **Balanced**: GPT-4.1-mini ($0.40/$1.60/M) — great code quality
- **Premium**: Claude Sonnet 4 ($3/$15/M) — SOTA on SWE-bench

### Chat / RAG

Need: large context + low cost + fast responses

- **Best value**: Qwen3 4B ($0.03/$0.15/M) — cheap + 262K context
- **Balanced**: GPT-4.1-nano ($0.10/$0.40/M) — fast + cheap
- **Premium**: Gemini 2.5 Pro ($1.25/$10/M) — 1M context + reasoning

### Vision / Multimodal

Need: image input + text output + tool calling

- **Free**: Gemma 4 27B IT — free vision + TC
- **Best value**: GPT-4.1-mini ($0.40/$1.60/M) — vision + 1M context
- **Premium**: Claude Sonnet 4 ($3/$15/M) — best vision understanding

### Reasoning / Math

Need: reasoning capability + structured output

- **Free**: DeepSeek R1 — 92% MATH-500
- **Best value**: Qwen3.5 4B ($0.03/$0.15/M) — cheap reasoning
- **Premium**: o3 ($10/$40/M) — SOTA on GPQA, MATH-500

### High-Volume Production

Need: lowest cost per token + reliability

- **Cheapest TC**: ling-2.6-flash ($0.01/$0.03/M)
- **Cheapest reasoning**: Qwen3.5 0.8B ($0.01/$0.05/M)
- **Cheapest coding**: bdc-coder ($0.01/$0.01/M)

## 📊 Quick Stats

| Metric              | Count |
| ------------------- | ----- |
| Total models        | 4,587 |
| Providers           | 95    |
| Free models         | 81    |
| Tool-calling models | 2,350 |
| Reasoning models    | 1,306 |
| Vision models       | 1,487 |
| Open-weight models  | 527   |
| Structured output   | 829   |

## 🔗 Explore More

- [Interactive Catalog](https://i-need-token.github.io/ai-models/) — search, filter, compare all models
- [Free Models Guide](free-models.md) — all 81 free models
- [Tool Calling Guide](tool-calling.md) — 2,350 models with tool calling
- [Pricing Comparison](pricing-comparison.md) — find the cheapest model
- [Context Windows](context-windows.md) — largest context windows
- [Model Comparison](model-comparison.md) — head-to-head comparisons

---

_Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — first-party data only, updated automatically._
