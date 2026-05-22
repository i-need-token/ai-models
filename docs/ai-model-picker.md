# AI Model Picker

Answer 4 simple questions to find the best AI model for your use case.

**[Try the interactive picker →](https://i-need-token.github.io/ai-models/ai-model-picker.html)**

## How It Works

The AI Model Picker asks you four questions:

1. **What are you building?** — AI Agents, Code Generation, Chat/RAG, Math & Reasoning, Vision/Multimodal, or High-Volume Production
2. **What's your budget?** — Free, Under $0.10/M tokens, Under $1/M, or Premium
3. **How much context do you need?** — Under 32K, 32K–128K, 128K–512K, or 512K+
4. **What matters most?** — Lowest Cost, Best Quality, Lowest Latency, or Privacy/On-Device

Based on your answers, the picker scores and ranks all 4,587+ models across 95 providers, filtering by budget and context requirements, then weighting by use case and priority.

## Scoring Logic

| Use Case               | Key Capabilities                                          | Weight                            |
| ---------------------- | --------------------------------------------------------- | --------------------------------- |
| AI Agents              | Tool Calling (+10), Reasoning (+5)                        | Cost penalty for expensive models |
| Code Generation        | Tool Calling (+8), Reasoning (+5), Structured Output (+3) | —                                 |
| Chat / RAG             | Large Context (+5), Tool Calling (+3)                     | —                                 |
| Math & Reasoning       | Reasoning (+10), Tool Calling (+3)                        | —                                 |
| Vision / Multimodal    | Image Input (+10), Tool Calling (+3)                      | —                                 |
| High-Volume Production | Tool Calling (+5)                                         | Cost penalty scaled 5×            |

Aggregator providers (OpenRouter, Requesty, etc.) are excluded to avoid duplicate model entries.

## Quick Recommendations

### Best Free Models by Use Case

| Use Case        | Top Pick                 | Why                         |
| --------------- | ------------------------ | --------------------------- |
| AI Agents       | DeepSeek V4 Flash (Free) | Tool calling + 1M context   |
| Code Generation | Qwen3 Coder (Free)       | Tool calling + 1M context   |
| Chat / RAG      | DeepSeek V4 Flash (Free) | 1M context window           |
| Reasoning       | DeepSeek R1 (Free)       | 92% MATH-500, reasoning     |
| Vision          | —                        | Limited free vision options |

### Best Budget Models (Under $0.10/M)

| Use Case        | Top Pick       | Price           |
| --------------- | -------------- | --------------- |
| AI Agents       | ling-2.6-flash | $0.01/$0.03/M   |
| Code Generation | bdc-coder      | $0.01/$0.01/M   |
| Reasoning       | qwen3.5-0.8b   | $0.01/$0.05/M   |
| General         | Mistral Nemo   | $0.008/$0.001/M |

## Related Documentation

- [Free Models](free-models.md) — Complete list of 81 free models
- [Pricing Comparison](pricing-comparison.md) — Compare costs across all providers
- [Tool Calling](tool-calling.md) — 2,350 models with tool calling
- [Reasoning Models](reasoning-models.md) — 1,306 reasoning models
- [Context Windows](context-windows.md) — Compare context window sizes
- [Model Selection Cheatsheet](model-selection-cheatsheet.md) — Decision tree and budget table
- [Quick Start](quick-start.md) — Get started with the catalog

## Data Source

All data is sourced from first-party APIs and official documentation. See [Data Acquisition](data-acquisition.md) for details.
