# Provider Comparison

[中文](zh/provider-comparison.md)

Side-by-side comparison of AI model providers — model count, capabilities, pricing, and context windows at a glance.

Data sourced from the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Top 30 Providers by Model Count

| Provider       | Models | Free | Tool Call | Reasoning | Vision | Cheapest $/M | Capabilities |
| -------------- | -----: | ---: | --------: | --------: | -----: | -----------: | ------------ |
| nanogpt        |    547 |    0 |         0 |         0 |      0 |        $0.02 |              |
| aihubmix       |    476 |    0 |       132 |        74 |    145 |        $0.00 | 🔧 🧠 👁️ 🎤  |
| openrouter     |    356 |   29 |       263 |       190 |    160 |        $0.01 | 🔧 🧠 👁️ 🎤  |
| martian        |    304 |    0 |         0 |         3 |      2 |        $0.02 | 🧠 👁️        |
| requesty       |    277 |    0 |       251 |       139 |    151 |        $0.02 | 🔧 🧠 👁️     |
| 302ai          |    268 |    0 |       190 |        44 |    144 |        $0.00 | 🔧 🧠 👁️ 🔓  |
| auriko         |    181 |    5 |       154 |       108 |     93 |        $0.01 | 🔧 🧠 👁️ 🖼️  |
| llmgateway     |    163 |    3 |       158 |        85 |     89 |        $0.03 | 🔧 🧠 👁️ 🖼️  |
| aimlapi        |    147 |    2 |        21 |         0 |     14 |        $0.01 | 🔧 👁️        |
| fastrouter     |    120 |    2 |        94 |        66 |     65 |        $0.02 | 🔧 🧠 👁️ 🎤  |
| orcarouter     |    120 |    0 |       102 |        64 |    111 |        $0.05 | 🔧 🧠 👁️ 🔓  |
| cortecs        |    105 |    0 |        97 |        82 |     52 |        $0.02 | 🔧 🧠 👁️ 🎤  |
| novitaai       |    104 |    2 |        72 |        53 |     33 |        $0.02 | 🔧 🧠 👁️ 🎤  |
| vultr          |     98 |    0 |        11 |        22 |     23 |        $0.55 | 🔧 🧠 👁️ 🎤  |
| deepinfra      |     88 |    0 |         0 |        51 |     38 |        $0.01 | 🧠 👁️        |
| venice         |     75 |    0 |        64 |        55 |     39 |        $0.05 | 🔧 🧠 👁️     |
| jiekou         |     73 |    0 |        73 |         0 |     49 |        $0.03 | 🔧 👁️ 🔓     |
| meganova       |     63 |    4 |        60 |         7 |     37 |        $0.02 | 🔧 🧠 👁️ 🔓  |
| alibaba        |     62 |    0 |        62 |        52 |      0 |        $0.15 | 🔧 🧠        |
| ppio           |     60 |    1 |        46 |        12 |     11 |        $0.21 | 🔧 🧠 👁️ 🔓  |
| amazon-bedrock |     57 |    0 |        37 |         0 |     16 |        $0.04 | 🔧 👁️ 🎤 🎬  |
| google-vertex  |     38 |    0 |        32 |         0 |     19 |        $0.07 | 🔧 👁️ 🎤 🎬  |
| siliconflow-cn |     37 |    0 |         2 |         7 |      9 |        $0.50 | 🔧 🧠 👁️     |
| stepfun        |     31 |   14 |         0 |         0 |     11 |        $0.70 | 👁️ 🎤 🖼️     |
| cloudflare     |     30 |    0 |        15 |        10 |      7 |        $0.02 | 🔧 🧠 👁️ 🔓  |
| gmicloud       |     29 |    0 |        11 |        10 |      0 |        $0.07 | 🔧 🧠 🔓     |
| databricks     |     29 |    0 |         4 |         0 |     10 |        $0.05 | 🔧 👁️ 🔓     |
| openai         |     28 |    5 |        18 |         8 |     12 |        $0.02 | 🔧 🧠 👁️ 🎤  |
| siliconflow    |     27 |    0 |        24 |         2 |      3 |        $0.04 | 🔧 🧠 👁️ 🔓  |
| togetherai     |     24 |    0 |        22 |         2 |      0 |        $0.03 | 🔧 🧠 🔓     |

## Provider Categories

### Aggregators (Multi-Provider Access)

These providers offer access to models from multiple AI companies through a single API:

| Provider   | Models | Notes                                           |
| ---------- | -----: | ----------------------------------------------- |
| openrouter |    356 | Largest model aggregator, OpenAI-compatible API |
| requesty   |    277 | Smart routing across providers                  |
| martian    |    304 | Multi-provider with load balancing              |
| aihubmix   |    476 | Chinese market aggregator                       |
| nanogpt    |    547 | Pay-per-token, no subscription                  |
| llmgateway |    163 | Enterprise API gateway                          |
| fastrouter |    120 | Fast model routing                              |
| orcarouter |    120 | Multi-provider routing                          |

### Direct Providers (First-Party APIs)

| Provider  | Models | Specialty                          |
| --------- | -----: | ---------------------------------- |
| openai    |     28 | GPT-4.1, o3/o4 reasoning models    |
| anthropic |     11 | Claude 4 family, best for agents   |
| google    |     21 | Gemini 2.5, 1M+ context            |
| deepseek  |      4 | DeepSeek R1, best open reasoning   |
| meta      |     12 | Llama 4, open weights              |
| mistral   |     16 | Mistral Large, Codestral           |
| xai       |      6 | Grok 3, real-time data             |
| alibaba   |     62 | Qwen 3, largest open-source family |

### Infrastructure Providers (Hosted Open-Source)

| Provider   | Models | Specialty                      |
| ---------- | -----: | ------------------------------ |
| groq       |     12 | Fastest inference (LPU)        |
| cerebras   |     11 | Ultra-fast inference (CS-3)    |
| togetherai |     24 | Serverless open-source hosting |
| deepinfra  |     88 | Cost-effective inference       |
| fireworks  |     10 | Serverless model hosting       |
| cloudflare |     30 | Edge inference (Workers AI)    |

### Regional Providers

| Provider            | Models | Region           |
| ------------------- | -----: | ---------------- |
| siliconflow         |     27 | China            |
| siliconflow-cn      |     37 | China (domestic) |
| stepfun             |     31 | China            |
| zhipuai             |     20 | China            |
| baichuan            |     11 | China            |
| baidu               |      8 | China            |
| iflytek             |      6 | China            |
| tencent             |     14 | China            |
| ppio                |     60 | China            |
| ovhcloud            |     12 | Europe (France)  |
| scaleway            |     13 | Europe (France)  |
| cloudferro-sherlock |     12 | Europe (EU)      |

## Choosing a Provider

| If you need...        | Best provider                  | Why                       |
| --------------------- | ------------------------------ | ------------------------- |
| **Cheapest prices**   | deepseek, google               | Input from $0.14/M tokens |
| **Fastest inference** | groq, cerebras                 | Sub-100ms latency         |
| **Largest context**   | google, meta                   | 1M-10M token context      |
| **Most models**       | nanogpt, aihubmix              | 500+ models each          |
| **Best for agents**   | anthropic, openai              | Tool calling + reasoning  |
| **Open weights**      | meta, deepseek                 | Run on your own hardware  |
| **EU data residency** | ovhcloud, scaleway, cloudferro | EU-hosted inference       |
| **China access**      | siliconflow, ppio, stepfun     | China-based endpoints     |

## Related Documentation

- [Migration Guide](migration-guide.md) — switching providers with pricing comparison
- [Pricing Comparison](pricing-comparison.md) — side-by-side pricing across providers
- [Providers Overview](providers.md) — all 95 providers listed
- [Model Selection Guide](model-selection.md) — decision framework
- [Free AI Models](free-models.md) — 81 free models by capability
- [Chat Models](chat-models.md) — 2,350 models with tool calling
- [Agentic Models](agentic-models.md) — 1,080 models with tool calling + reasoning

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
