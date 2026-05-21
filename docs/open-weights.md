# Open-Weight AI Models

513 models in this catalog are open-weight — you can download the weights and run them on your own infrastructure. This page highlights the most capable and widely available open-weight models.

> All data sourced from first-party APIs and documentation. "Open-weight" means the model weights are publicly available; license terms vary by model.

## Quick Stats

| Capability                | Open-Weight Models |
| ------------------------- | -----------------: |
| Total open-weight models  |                513 |
| Unique model IDs          |                420 |
| With tool calling         |                270 |
| With reasoning            |                101 |
| With vision (image input) |                104 |

## Most Widely Available

These open-weight models are available on the most providers — easy to find, easy to switch:

| Model                         | Providers | Context | Tool Call | Reasoning | Vision |
| ----------------------------- | --------: | ------- | --------- | --------- | ------ |
| GPT-OSS-120B                  |        14 | 131K    | ✅        | ✅        | ❌     |
| GPT-OSS-20B                   |         8 | 131K    | ✅        | ✅        | ❌     |
| Qwen3.5-397B-A17B             |         4 | 262K    | ✅        | ✅        | ❌     |
| Kimi K2 Thinking              |         4 | 262K    | ✅        | ✅        | ✅     |
| DeepSeek-R1-Distill-Llama-70B |         4 | 131K    | ✅        | ✅        | ❌     |
| Llama 4 Scout 17B             |         4 | 328K    | ✅        | ❌        | ✅     |
| DeepSeek-R1                   |         3 | 131K    | ✅        | ✅        | ❌     |
| Llama 4 Maverick              |         3 | 1M      | ✅        | ❌        | ✅     |
| Qwen3-32B                     |         3 | 131K    | ✅        | ✅        | ❌     |
| Gemma 4 31B IT                |         3 | 262K    | ✅        | ✅        | ✅     |

## Largest Context Windows

Open-weight models with the largest context windows:

| Model             | Context | Tool Call | Reasoning | Vision |
| ----------------- | ------- | --------- | --------- | ------ |
| Llama 4 Scout     | 10M     | ✅        | ❌        | ✅     |
| Qwen3.5 Flash     | 1M      | ✅        | ❌        | ✅     |
| Qwen3.6 Flash     | 1M      | ✅        | ❌        | ✅     |
| Llama 4 Maverick  | 1M      | ✅        | ❌        | ✅     |
| DeepSeek-V4 Flash | 1M      | ✅        | ✅        | ❌     |
| DeepSeek-V4 Pro   | 1M      | ✅        | ✅        | ❌     |
| MiMo V2.5         | 1M      | ✅        | ✅        | ✅     |
| Minimax M2.5      | 1M      | ✅        | ❌        | ❌     |
| Gemma 4 31B IT    | 1M      | ✅        | ❌        | ✅     |

## Best Open-Weight Reasoning Models

These open-weight models support chain-of-thought reasoning:

| Model                | Context | Tool Call | Vision | Providers |
| -------------------- | ------- | --------- | ------ | --------: |
| DeepSeek-V4 Flash    | 1M      | ✅        | ❌     |         2 |
| DeepSeek-V4 Pro      | 1M      | ✅        | ❌     |         2 |
| MiMo V2.5 Pro        | 1M      | ✅        | ❌     |         1 |
| MiMo V2.5            | 1M      | ✅        | ✅     |         1 |
| Gemma 4 26B A4B IT   | 262K    | ✅        | ✅     |         3 |
| Kimi K2.6            | 262K    | ✅        | ✅     |         2 |
| Qwen3.5-397B-A17B    | 262K    | ✅        | ❌     |         2 |
| Nemotron-3-120B-A12B | 262K    | ✅        | ❌     |         1 |
| DeepSeek-R1          | 131K    | ✅        | ❌     |         3 |
| Qwen3-32B            | 131K    | ✅        | ✅     |         3 |

## Best Open-Weight Vision Models

Open-weight models that accept image input:

| Model              | Context | Tool Call | Reasoning | Providers |
| ------------------ | ------- | --------- | --------- | --------: |
| MiMo V2.5          | 1M      | ✅        | ✅        |         1 |
| Llama 4 Maverick   | 1M      | ✅        | ❌        |         3 |
| Llama 4 Scout      | 10M     | ✅        | ❌        |         2 |
| Gemma 4 31B IT     | 1M      | ✅        | ❌        |         3 |
| Qwen3.5 Flash      | 1M      | ✅        | ❌        |         1 |
| Kimi K2.6          | 262K    | ✅        | ✅        |         2 |
| Gemma 4 26B A4B IT | 262K    | ✅        | ✅        |         3 |
| Llama 4 Scout 17B  | 328K    | ✅        | ❌        |         4 |

## Cheapest Open-Weight Models

Lowest per-token pricing for open-weight inference:

| Model                      | Provider     | Input $/1M | Output $/1M | Context |
| -------------------------- | ------------ | ---------: | ----------: | ------- |
| GLM-4-Flash                | 302AI        |    $0.0014 |     $0.0014 | 131K    |
| Mistral-Nemo-Instruct-2407 | KlusterAI    |     $0.008 |      $0.001 | 131K    |
| BDC-Coder                  | InferenceNet |      $0.01 |       $0.01 | 131K    |
| Granite 4.0 H Micro        | Cloudflare   |     $0.017 |      $0.112 | 131K    |
| Llama 3.1 8B Instruct      | InferenceNet |      $0.02 |       $0.03 | 131K    |
| Mistral Nemo Instruct 2407 | MegaNova     |      $0.02 |       $0.04 | 131K    |
| Meta-Llama-3.1-8B-Instruct | Nebius       |      $0.02 |       $0.06 | 131K    |
| Llama 3.2 1B Instruct      | Cloudflare   |     $0.027 |      $0.201 | 131K    |

## Key Takeaways

- **513 open-weight models** across 420 unique model IDs — the largest open-weight model catalog available
- **GPT-OSS-120B** is the most widely available, offered by 14 providers
- **Llama 4 Scout** has the largest context window at 10M tokens
- **DeepSeek-R1** is the most popular open-weight reasoning model, available on 3 providers
- **MiMo V2.5** is the only open-weight model combining 1M context, reasoning, and vision
- Pricing varies widely — the cheapest open-weight models cost under $0.01/1M tokens
