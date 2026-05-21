# Small & Edge Models

[中文](zh/small-models.md)

AI models designed for **edge deployment, on-device inference, and resource-constrained environments** — models under ~16B parameters that can run on consumer hardware, mobile devices, and embedded systems.

Data sourced from the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Why Small Models Matter

Small models enable AI where cloud connectivity is limited or latency is critical:

- **On-device inference** — run AI without internet, on phones and laptops
- **Edge computing** — deploy in IoT devices, robotics, and vehicles
- **Low latency** — sub-100ms response times for real-time applications
- **Cost efficiency** — cheaper to run, especially at scale
- **Privacy** — data never leaves the device
- **Offline capability** — AI that works without connectivity

## Stats

| Metric                   | Count |
| ------------------------ | ----- |
| Small/edge models        | 1153  |
| Providers                | 63    |
| Free small models        | 30    |
| Open-weight small models | 272   |
| With tool calling        | 434   |
| With reasoning           | 250   |

## Providers

`302ai`, `aihubmix`, `aimlapi`, `aion`, `alibaba`, `amazon-bedrock`, `auriko`, `baichuan`, `berget`, `bytedance`, `cerebras`, `chutes`, `clarifai`, `cloudferro-sherlock`, `cloudflare`, `cortecs`, `databricks`, `deepinfra`, `digitalocean`, `evroc`, `fastrouter`, `fireworks`, `friendli`, `gmicloud`, `google`, `google-vertex`, `groq`, `hpc-ai`, `hyperbolic`, `inferencenet`, `jiekou`, `klusterai`, `llmgateway`, `martian`, `meganova`, `meta`, `microsoft`, `mistral`, `mixlayer`, `moonshotai`, `morph`, `nanogpt`, `nebius`, `neuralwatt`, `nousresearch`, `novitaai`, `openrouter`, `orcarouter`, `ovhcloud`, `ppio`, `privatemode`, `requesty`, `sambanova`, `scaleway`, `siliconflow`, `siliconflow-cn`, `submodel`, `tencent`, `textsynth`, `togetherai`, `venice`, `vultr`, `wafer`

## Free Small Models

Free small models — zero-cost edge AI.

| Model                                                | Provider   | Context | Input $/M | Output $/M | Capabilities |
| ---------------------------------------------------- | ---------- | ------- | --------- | ---------- | ------------ |
| nvidia--nemotron-3-super-120b-a12b--free             | openrouter | 1M      | Free      | Free       | 🔧 🧠 📋     |
| google--gemma-4-26b-a4b-it--free                     | openrouter | 262K    | Free      | Free       | 🔧 🧠 📋     |
| google--gemma-4-31b-it--free                         | openrouter | 262K    | Free      | Free       | 🔧 🧠 📋     |
| gemma-4-26b-a4b-it                                   | auriko     | 262K    | Free      | Free       | 🔧 🧠 📋     |
| gemma-4-31b-it                                       | auriko     | 262K    | Free      | Free       | 🔧 🧠 📋     |
| nvidia--nemotron-3-nano-omni-30b-a3b-reasoning--free | openrouter | 256K    | Free      | Free       | 🔧 🧠        |
| gemma-3-4b-it                                        | google     | 131K    | Free      | Free       |              |
| gemma-3-12b-it                                       | google     | 131K    | Free      | Free       |              |
| gemma-3-27b-it                                       | google     | 131K    | Free      | Free       |              |
| gemma-3n-E2B-it                                      | google     | 131K    | Free      | Free       |              |

## Cheapest Small Models

Best value small models for production.

| Model                                           | Provider | Context | Input $/M | Output $/M | Capabilities |
| ----------------------------------------------- | -------- | ------- | --------- | ---------- | ------------ |
| llama3-groq-8b-8192-tool-use-preview            | aihubmix | 0       | $9.5e-05  | $9.5e-05   |              |
| mistralai--mistral-7b-instruct--free            | aihubmix | 0       | $0.001    | $0.001     |              |
| deepseek-ai--deepseek-r1-distill-llama-8b       | aihubmix | 0       | $0.005    | $0.005     |              |
| deepseek-ai--deepseek-r1-distill-qwen-7b        | aihubmix | 0       | $0.005    | $0.005     |              |
| deepseek-ai--deepseek-r1-distill-qwen-1.5b      | aihubmix | 0       | $0.005    | $0.005     |              |
| ernie-4.5-0.3b                                  | aihubmix | 0       | $0.0068   | $0.0272    | 🔧 📋        |
| google--gemma-2-9b-it--free                     | aihubmix | 0       | $0.01     | $0.01      |              |
| meta-llama--llama-3.2-3b-instruct--free         | aihubmix | 0       | $0.01     | $0.01      |              |
| meta-llama--llama-3.2-11b-vision-instruct--free | aihubmix | 0       | $0.01     | $0.01      |              |
| meta-llama--llama-3.1-8b-instruct--free         | aihubmix | 0       | $0.01     | $0.01      |              |

## Related Documentation

- [Open Weights](open-weights.md) — 527 open-weight models
- [Free AI Models](free-models.md) — 81 free models by capability
- [Chat Models](chat-models.md) — 2,350 models with tool calling
- [Code Models](code-models.md) — 189 code-focused models
- [Model Selection Guide](model-selection.md) — decision framework
- [Provider Comparison](provider-comparison.md) — top 30 providers

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
