**English** | [中文](./zh/providers.md)

# Provider Overview

A comprehensive overview of all 95 AI model providers in this catalog, organized by type.

## Model Producers

Providers that develop and produce their own AI models. Their APIs and documentation are the authoritative source for model data.

| Provider                | ID            | Models | Key Models                         | API Format |
| ----------------------- | ------------- | -----: | ---------------------------------- | ---------- |
| 01.AI (零一万物)        | `01ai`        |      5 | Yi-Lightning, Yi-Vision            | OpenAI     |
| AI21 Labs               | `ai21`        |      2 | Jamba 1.5                          | OpenAI     |
| Alibaba Cloud (Bailian) | `alibaba`     |     62 | Qwen 3, Qwen 2.5                   | OpenAI     |
| Amazon Nova             | `amazon`      |      7 | Nova Pro, Nova Lite                | OpenAI     |
| Anthropic               | `anthropic`   |     11 | Claude Opus 4.7, Claude Sonnet 4.6 | Anthropic  |
| ByteDance               | `bytedance`   |      5 | Doubao-Pro, Doubao-Lite            | OpenAI     |
| Cloudflare Workers AI   | `cloudflare`  |     30 | Llama 3.3, Mistral                 | OpenAI     |
| Cohere                  | `cohere`      |      — | Command R+, Embed 3                | OpenAI     |
| DeepSeek                | `deepseek`    |      4 | DeepSeek-V4-Pro, DeepSeek-R1       | OpenAI     |
| Google                  | `google`      |     21 | Gemini 3.5 Flash, Gemini 3.1 Pro   | Google     |
| IBM Granite             | `ibm`         |      — | Granite 3.3                        | OpenAI     |
| iFlytek SparkDesk       | `iflytek`     |      6 | SparkDesk 4.0 Ultra                | OpenAI     |
| Inception Labs          | `inception`   |      5 | Mercury Coder                      | OpenAI     |
| InclusionAI             | `inclusionai` |      3 | Book3R                             | OpenAI     |
| Meta Llama              | `meta`        |     12 | Llama 4 Maverick, Llama 4 Scout    | OpenAI     |
| Microsoft Phi           | `microsoft`   |     12 | Phi-4, Phi-4-Mini                  | OpenAI     |
| MiniMax                 | `minimax`     |     21 | MiniMax-Text-01, MiniMax-M1        | OpenAI     |
| Mistral AI              | `mistral`     |     16 | Mistral Large, Codestral           | OpenAI     |
| Moonshot AI             | `moonshotai`  |     16 | Kimi K2.6, Kimi K2.5               | OpenAI     |
| NVIDIA                  | `nvidia`      |      — | Nemotron Ultra                     | OpenAI     |
| OpenAI                  | `openai`      |     28 | GPT-5.5, GPT-5.4, o3               | OpenAI     |
| Perplexity              | `perplexity`  |      4 | Sonar, Sonar Pro                   | OpenAI     |
| Reka AI                 | `reka`        |      2 | Reka Core, Reka Flash              | OpenAI     |
| Sarvam AI               | `sarvam`      |      — | Sarvam-M                           | OpenAI     |
| StepFun                 | `stepfun`     |     31 | Step-2, Step-1.5V                  | OpenAI     |
| Tencent Hunyuan         | `tencent`     |     14 | Hunyuan-Turbos                     | OpenAI     |
| Upstage                 | `upstage`     |      8 | Solar Pro, Solar Mini              | OpenAI     |
| Voyage AI               | `voyage`      |     21 | Voyage 3, Voyage Code 3            | OpenAI     |
| Writer                  | `writer`      |      6 | Palmyra X5                         | OpenAI     |
| xAI Grok                | `xai`         |      6 | Grok 3, Grok 3 Mini                | OpenAI     |
| Xiaomi                  | `xiaomi`      |      5 | MiMo                               | OpenAI     |
| Zhipu AI (智谱)         | `zhipuai`     |     20 | GLM-4, GLM-Z1                      | OpenAI     |

## Inference Platforms

Providers that host and serve models produced by others. They offer their own per-token pricing and API access.

| Provider               | ID                    | Models | Pricing Currency | API Format |
| ---------------------- | --------------------- | -----: | ---------------- | ---------- |
| 302.AI                 | `302ai`               |    268 | CNY              | OpenAI     |
| AIHubMix               | `aihubmix`            |    476 | CNY              | OpenAI     |
| AI/ML API              | `aimlapi`             |    147 | USD              | OpenAI     |
| Aion Labs              | `aion`                |      5 | USD              | OpenAI     |
| Arcee AI               | `arcee`               |      7 | USD              | OpenAI     |
| Auriko                 | `auriko`              |    181 | USD              | OpenAI     |
| Baseten                | `baseten`             |      9 | USD              | OpenAI     |
| Berget                 | `berget`              |      7 | EUR              | OpenAI     |
| Cerebras               | `cerebras`            |     11 | USD              | OpenAI     |
| Chutes                 | `chutes`              |     12 | USD              | OpenAI     |
| Clarifai               | `clarifai`            |     12 | USD              | OpenAI     |
| CloudFerro Sherlock    | `cloudferro-sherlock` |     12 | EUR              | OpenAI     |
| Cortecs                | `cortecs`             |    105 | USD              | OpenAI     |
| Databricks             | `databricks`          |     29 | USD              | OpenAI     |
| DeepInfra              | `deepinfra`           |     88 | USD              | OpenAI     |
| DigitalOcean           | `digitalocean`        |     20 | USD              | OpenAI     |
| DInference             | `dinference`          |      6 | CNY              | OpenAI     |
| evroc                  | `evroc`               |      8 | EUR              | OpenAI     |
| FastRouter             | `fastrouter`          |    120 | USD              | OpenAI     |
| Fireworks AI           | `fireworks`           |     10 | USD              | OpenAI     |
| FriendliAI             | `friendli`            |      8 | USD              | OpenAI     |
| GMI Cloud              | `gmicloud`            |     29 | USD              | OpenAI     |
| Google Vertex AI       | `google-vertex`       |     38 | USD              | Google     |
| Groq                   | `groq`                |     12 | USD              | OpenAI     |
| HPC-AI Cloud           | `hpc-ai`              |     11 | CNY              | OpenAI     |
| Hyperbolic             | `hyperbolic`          |     11 | USD              | OpenAI     |
| Inference.net          | `inferencenet`        |     20 | USD              | OpenAI     |
| 接口 AI                | `jiekou`              |     73 | CNY              | OpenAI     |
| Kluster AI             | `klusterai`           |     12 | USD              | OpenAI     |
| LLM Gateway            | `llmgateway`          |    163 | USD              | OpenAI     |
| Martian                | `martian`             |    304 | USD              | OpenAI     |
| MegaNova               | `meganova`            |     63 | USD              | OpenAI     |
| Mixlayer               | `mixlayer`            |      5 | USD              | OpenAI     |
| MoArk AI               | `moark`               |      — | USD              | OpenAI     |
| Morph                  | `morph`               |      7 | USD              | OpenAI     |
| NanoGPT                | `nanogpt`             |    547 | USD              | OpenAI     |
| Nebius                 | `nebius`              |     23 | USD              | OpenAI     |
| NeuralWatt             | `neuralwatt`          |     14 | USD              | OpenAI     |
| Nous Research          | `nousresearch`        |      7 | USD              | OpenAI     |
| Novita AI              | `novitaai`            |    104 | USD              | OpenAI     |
| OrcaRouter             | `orcarouter`          |    120 | USD              | OpenAI     |
| OVHcloud AI Endpoints  | `ovhcloud`            |     12 | EUR              | OpenAI     |
| PPIO                   | `ppio`                |     60 | CNY              | OpenAI     |
| Privatemode AI         | `privatemode`         |      5 | EUR              | OpenAI     |
| Qiniu AI               | `qiniu-ai`            |      — | CNY              | OpenAI     |
| Regolo                 | `regolo`              |      — | EUR              | OpenAI     |
| Requesty               | `requesty`            |    277 | USD              | OpenAI     |
| SambaNova              | `sambanova`           |      7 | USD              | OpenAI     |
| Scaleway               | `scaleway`            |     13 | EUR              | OpenAI     |
| SiliconFlow            | `siliconflow`         |     27 | USD              | OpenAI     |
| SiliconFlow CN         | `siliconflow-cn`      |     37 | CNY              | OpenAI     |
| SubModel               | `submodel`            |      6 | USD              | OpenAI     |
| Tencent Cloud TokenHub | `tencent-tokenhub`    |     19 | CNY              | OpenAI     |
| TextSynth              | `textsynth`           |      6 | USD              | OpenAI     |
| Together AI            | `togetherai`          |     24 | USD              | OpenAI     |
| Venice AI              | `venice`              |     75 | USD              | OpenAI     |
| Vultr Cloud Inference  | `vultr`               |     98 | USD              | OpenAI     |
| Wafer                  | `wafer`               |      2 | USD              | OpenAI     |

## Cloud Provider Hosted Services

Major cloud providers offering hosted AI model services.

| Provider             | ID               | Models | Cloud Platform |
| -------------------- | ---------------- | -----: | -------------- |
| Amazon Bedrock       | `amazon-bedrock` |     57 | AWS            |
| Azure OpenAI Service | `azure`          |      — | Azure          |
| Google Vertex AI     | `google-vertex`  |     38 | GCP            |

## Chinese Market Providers

Providers primarily serving the Chinese market with CNY pricing.

| Provider                | ID                 | Models |
| ----------------------- | ------------------ | -----: |
| 302.AI                  | `302ai`            |    268 |
| AIHubMix                | `aihubmix`         |    476 |
| Alibaba Cloud (Bailian) | `alibaba`          |     62 |
| Baichuan AI             | `baichuan`         |     11 |
| Baidu                   | `baidu`            |      8 |
| ByteDance               | `bytedance`        |      5 |
| DInference              | `dinference`       |      6 |
| HPC-AI Cloud            | `hpc-ai`           |     11 |
| iFlytek SparkDesk       | `iflytek`          |      6 |
| 接口 AI                 | `jiekou`           |     73 |
| MiniMax                 | `minimax`          |     21 |
| Moonshot AI             | `moonshotai`       |     16 |
| PPIO                    | `ppio`             |     60 |
| Qiniu AI                | `qiniu-ai`         |      — |
| SiliconFlow CN          | `siliconflow-cn`   |     37 |
| StepFun                 | `stepfun`          |     31 |
| Tencent Cloud TokenHub  | `tencent-tokenhub` |     19 |
| Tencent Hunyuan         | `tencent`          |     14 |
| Xiaomi                  | `xiaomi`           |      5 |
| Zhipu AI (智谱)         | `zhipuai`          |     20 |

## European Market Providers

Providers with EUR pricing, serving the European market.

| Provider              | ID                    | Models |
| --------------------- | --------------------- | -----: |
| Berget                | `berget`              |      7 |
| CloudFerro Sherlock   | `cloudferro-sherlock` |     12 |
| evroc                 | `evroc`               |      8 |
| OVHcloud AI Endpoints | `ovhcloud`            |     12 |
| Privatemode AI        | `privatemode`         |      5 |
| Regolo                | `regolo`              |      — |
| Scaleway              | `scaleway`            |     13 |

## Related Documentation

- [Model Comparison](model-comparison.md) — flagship, cost-effective, free models
- [Pricing Comparison](pricing-comparison.md) — side-by-side pricing
- [Open-Weight Models](open-weights.md) — 527 models you can run yourself
- [Free AI Models](free-models.md) — 81 free models
- [Data Schema](data-schema.md) — complete YAML schema

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
