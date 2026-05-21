# Migration Guide: Switching AI Model Providers

[中文](zh/migration-guide.md)

A practical guide for switching between AI model providers — compare pricing, capabilities, and context windows to find the best alternative for your use case.

Data sourced from the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Why Switch Providers?

- **Cost savings** — some providers offer the same models at 2-10× lower prices
- **Better capabilities** — newer models may offer tool calling, reasoning, or vision
- **Larger context** — process more data in a single request
- **Reliability** — reduce dependency on a single provider
- **Compliance** — data residency requirements may require specific providers

## Major Provider Comparison

| Provider  | Models | Cheapest Input $/M | Largest Context | Tool Calling | Reasoning |
| --------- | ------ | -----------------: | --------------- | ------------ | --------- |
| openai    | 28     |              $0.02 | 1047576         | 18           | 8         |
| anthropic | 11     |                 $1 | 1000000         | 11           | 11        |
| google    | 21     |             $0.075 | 2097152         | 8            | 2         |
| deepseek  | 4      |              $0.14 | 1000000         | 4            | 3         |
| meta      | 12     |               $0.1 | 10000000        | 9            | 0         |
| mistral   | 16     |              $0.04 | 256000          | 12           | 1         |
| xai       | 6      |               $0.2 | 131072          | 6            | 5         |
| alibaba   | 62     |              $0.15 | 1000000         | 62           | 52        |

## Common Migration Paths

### OpenAI → Cheaper Alternatives

| OpenAI Model         | Cheapest Alternative | Provider  | Input $/M | Savings |
| -------------------- | -------------------- | --------- | --------- | ------- |
| gpt-4.1 ($2)         | gpt-4.1-mini         | openai    | $0.40     | 80%     |
| gpt-4.1-mini ($0.40) | gpt-4.1-nano         | openai    | $0.10     | 75%     |
| o4-mini ($1.10)      | deepseek-r1          | deepseek  | $0.55     | 50%     |
| gpt-4.1 ($2)         | claude-haiku-4       | anthropic | $1        | 50%     |
| gpt-4.1 ($2)         | gemini-2.5-flash     | google    | $0.15     | 93%     |

### Anthropic → Cheaper Alternatives

| Anthropic Model      | Cheapest Alternative | Provider | Input $/M | Savings |
| -------------------- | -------------------- | -------- | --------- | ------- |
| claude-opus-4 ($15)  | o4-mini              | openai   | $1.10     | 93%     |
| claude-sonnet-4 ($3) | gemini-2.5-flash     | google   | $0.15     | 95%     |
| claude-sonnet-4 ($3) | deepseek-chat        | deepseek | $0.14     | 95%     |
| claude-haiku-4 ($1)  | gemini-2.5-flash     | google   | $0.15     | 85%     |

### Google → Cheaper Alternatives

| Google Model           | Cheapest Alternative | Provider | Input $/M | Savings |
| ---------------------- | -------------------- | -------- | --------- | ------- |
| gemini-2.5-pro ($1.25) | gemini-2.5-flash     | google   | $0.15     | 88%     |
| gemini-2.5-pro ($1.25) | deepseek-chat        | deepseek | $0.14     | 89%     |

## Migration Checklist

When switching providers, verify these compatibility points:

- [ ] **API format** — OpenAI-compatible vs proprietary API
- [ ] **Model names** — different providers use different model IDs
- [ ] **Tool calling format** — function calling syntax varies
- [ ] **Streaming** — SSE vs WebSocket vs HTTP streaming
- [ ] **Rate limits** — requests per minute, tokens per minute
- [ ] **Context window** — may differ from original provider
- [ ] **Modalities** — vision, audio, video support varies
- [ ] **Structured output** — JSON mode availability
- [ ] **Prompt caching** — can reduce costs 50-90%
- [ ] **Data residency** — where is data processed and stored

## OpenAI-Compatible Providers

These providers offer OpenAI-compatible APIs — minimal code changes needed:

| Provider    | Base URL                        | Notes                       |
| ----------- | ------------------------------- | --------------------------- |
| openrouter  | `openrouter.ai/api/v1`          | Aggregator, 356+ models     |
| deepinfra   | `api.deepinfra.com/v1`          | Focus on open-source models |
| togetherai  | `api.together.xyz/v1`           | Open-source model hosting   |
| groq        | `api.groq.com/openai/v1`        | Ultra-fast inference        |
| cerebras    | `api.cerebras.ai/v1`            | Fastest inference speed     |
| fireworks   | `api.fireworks.ai/inference/v1` | Serverless model hosting    |
| siliconflow | `api.siliconflow.cn/v1`         | China-focused provider      |

## Related Documentation

- [Pricing Comparison](pricing-comparison.md) — side-by-side pricing across providers
- [Model Selection Guide](model-selection.md) — decision framework for choosing models
- [Free AI Models](free-models.md) — 81 free models by capability
- [Cached Pricing](cached-pricing.md) — 1,374 models with prompt caching
- [Chat Models](chat-models.md) — 2,350 models with tool calling
- [Agentic Models](agentic-models.md) — 1,080 models with tool calling + reasoning
- [API Reference](api.md) — programmatic access to model data

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
