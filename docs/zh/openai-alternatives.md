[English](../openai-alternatives.md) | **中文**

# OpenAI 替代方案 — GPT-4、GPT-3.5 及更多

全面对比 OpenAI GPT-4、GPT-4o 和 GPT-3.5 Turbo 的替代模型 — 包含定价、能力和 API 兼容性。所有数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) 一手 API。

## 快速对比：GPT-4 级别替代方案

具备 **工具调用 + 推理 + 视觉** 的模型（完整 GPT-4 能力集）：

| Model                         | Provider   | Context | Input $/1M | Output $/1M | Open Weights |
| ----------------------------- | ---------- | ------- | ---------- | ----------- | ------------ |
| openai--gpt-oss-120b          | novitaai   | 128K    | $0.05      | $0.25       |              |
| Qwen--Qwen3.6-35B-A3B         | neuralwatt | 0       | $0.05      | $0.1        |              |
| Nemotron-3-Nano-Omni          | nebius     | 125K    | $0.06      | $0.24       | ✅           |
| seed-1.6-flash                | bytedance  | 256K    | $0.07      | $0.3        |              |
| gemma-4-26b-a4b-it            | cloudflare | 256K    | $0.1       | $0.3        | ✅           |
| Gemma-3-27b-it                | nebius     | 93K     | $0.1       | $0.3        | ✅           |
| seed-2.0-mini                 | bytedance  | 256K    | $0.1       | $0.4        |              |
| google--gemma-4-26b-a4b-it    | novitaai   | 256K    | $0.13      | $0.4        |              |
| google--gemma-4-31B-turbo-TEE | chutes     | 128K    | $0.13      | $0.38       |              |
| baidu--ernie-4.5-vl-28b-a3b   | novitaai   | 29K     | $0.14      | $0.56       |              |
| google--gemma-4-31b-it        | novitaai   | 256K    | $0.14      | $0.4        |              |
| amazon-nova-2.0-lite          | amazon     | 62K     | $0.15      | $1.25       |              |
| gemini-2.5-flash              | google     | 1024K   | $0.15      | $3.5        |              |
| amazon-nova-2.0-omni          | amazon     | 62K     | $0.2       | $1.3        |              |
| xai-grok-4.1                  | xai        | 128K    | $0.2       | $0.5        |              |

> 完整列表：50+ 提供商共 617 个具备工具调用+推理+视觉的模型。详见 [智能体模型](agentic-models.md)。

## 最便宜的工具调用模型

最具性价比的函数/工具调用模型（仅直连提供商）：

| Model                                       | Provider       | Context | Input $/1M | Output $/1M |
| ------------------------------------------- | -------------- | ------- | ---------- | ----------- |
| ling-2.6-flash                              | inclusionai    | 256K    | $0.01      | $0.03       |
| bdc-coder                                   | inferencenet   | 128K    | $0.01      | $0.01       |
| klusterai--Meta-Llama-3.1-8B-Instruct-Turbo | klusterai      | 127K    | $0.015     | $0.02       |
| granite-4.0-h-micro                         | cloudflare     | 128K    | $0.017     | $0.112      |
| schematron-v3                               | inferencenet   | 128K    | $0.02      | $0.05       |
| schematron-3b                               | inferencenet   | 128K    | $0.02      | $0.05       |
| llama-3.1-8b-instruct--fp-16                | inferencenet   | 128K    | $0.02      | $0.03       |
| liquid-ai--LFM2-24B-A2B                     | togetherai     | 128K    | $0.03      | $0.12       |
| qwen--qwen3-4b-fp8                          | novitaai       | 125K    | $0.03      | $0.03       |
| schematron-v2-turbo                         | inferencenet   | 128K    | $0.03      | $0.15       |
| gpt-oss-20b                                 | inferencenet   | 128K    | $0.03      | $0.15       |
| openai--gpt-oss-20b                         | neuralwatt     | 0       | $0.03      | $0.16       |
| amazon-nova-micro                           | amazon         | 125K    | $0.035     | $0.14       |
| amazon-nova-micro                           | amazon-bedrock | 125K    | $0.035     | $0.14       |
| mistral-nemo-12b-instruct--fp-8             | inferencenet   | 128K    | $0.0375    | $0.1        |

> 完整列表：67 个提供商共 2,350 个工具调用模型。详见 [工具调用模型](tool-calling.md)。

## GPT-4 免费替代方案

零成本的工具调用模型（仅直连提供商）：

| Model                             | Provider | Context | Capabilities                 |
| --------------------------------- | -------- | ------- | ---------------------------- |
| glm-4.7-flash                     | zhipuai  | 195K    | Tool Call                    |
| glm-4.1v-thinking-flash           | zhipuai  | 62K     | Reasoning, Vision, Tool Call |
| glm-4-flash-250414                | zhipuai  | 125K    | Tool Call                    |
| glm-4v-flash                      | zhipuai  | 15K     | Vision, Tool Call            |
| autoglm-phone                     | zhipuai  | 19K     | Vision, Tool Call            |
| glm-ocr                           | zhipuai  | 0       | Vision, Tool Call            |
| glm-4.6v-flash                    | zhipuai  | 125K    | Vision, Tool Call            |
| cobuddy                           | baidu    | 128K    | Tool Call                    |
| qwen--qwen3-omni-30b-a3b-instruct | novitaai | 64K     | Vision, Tool Call            |
| qwen--qwen3-omni-30b-a3b-thinking | novitaai | 64K     | Reasoning, Vision, Tool Call |
| baidu--ernie-4.5-0.3b             | aimlapi  | 117K    | Tool Call                    |
| qwen--qwen3.5-4b-free             | mixlayer | 128K    | Reasoning, Tool Call         |
| llama-4-scout-17b-16e-instruct    | cerebras | 128K    | Tool Call                    |
| qwen-2.5-32b                      | cerebras | 128K    | Tool Call                    |
| llama-3.3-70b                     | cerebras | 128K    | Tool Call                    |

> 完整列表：81 个免费模型。详见 [免费 AI 模型](free-models.md)。

## 最大上下文窗口的工具调用模型

| Model                                              | Provider    | Context | Input $/1M | Output $/1M |
| -------------------------------------------------- | ----------- | ------- | ---------- | ----------- |
| meta-llama-4-scout                                 | meta        | 9765K   | $0.17      | $0.66       |
| xai--grok-4-fast-reasoning                         | aimlapi     | 1953K   | $0.52      | $1.3        |
| xai--grok-4-fast-non-reasoning                     | aimlapi     | 1953K   | $0.52      | $1.3        |
| meta-llama--Llama-4-Maverick-17B-128E-Instruct-FP8 | gmicloud    | 1024K   | $0.25      | $0.8        |
| minimax-m2-5                                       | baseten     | 1024K   | $0.3       | $1.2        |
| deepseek-v4-flash                                  | baidu       | 1024K   | $0.126     | $0.252      |
| deepseek-v4-pro                                    | siliconflow | 1024K   | $1.74      | $3.48       |
| deepseek-v4-flash                                  | siliconflow | 1024K   | $0.14      | $0.28       |
| deepseek--deepseek-v4-pro                          | novitaai    | 1024K   | $1.67      | $3.38       |
| xiaomimimo--mimo-v2.5-pro                          | novitaai    | 1024K   | $2         | $6          |
| deepseek--deepseek-v4-flash                        | novitaai    | 1024K   | $0.14      | $0.28       |
| gemini-2.0-flash-lite                              | google      | 1024K   | $0.075     | $0.3        |
| gemini-2.5-flash                                   | google      | 1024K   | $0.15      | $3.5        |
| gemini-2.5-pro                                     | google      | 1024K   | $1.25      | $10         |
| gemini-2.0-flash                                   | google      | 1024K   | $0.1       | $0.4        |

> 完整列表：2,195 个 128K+ 上下文模型。详见 [大上下文模型](large-context-models.md)。

## OpenAI 兼容提供商

70 个提供商提供 OpenAI 兼容 API 端点 — 最少代码修改即可切换：

| Provider        | API Endpoint                                 | Model Count | Free Tier |
| --------------- | -------------------------------------------- | ----------- | --------- |
| Regolo          | `https://api.regolo.ai/v1`                   | 1           | —         |
| MegaNova        | `https://api.meganova.ai/v1`                 | 1           | —         |
| GMI Cloud       | `https://api.gmi-serving.com/v1`             | 1           | —         |
| Cohere          | `https://api.cohere.com`                     | 1           | —         |
| Requesty        | `https://router.requesty.ai/v1`              | 1           | —         |
| 接口 AI         | `https://api.jiekou.ai/v1`                   | 1           | —         |
| Zhipu AI (智谱) | `https://open.bigmodel.cn/api/paas/v4`       | 1           | —         |
| SambaNova       | `https://api.sambanova.ai/v1`                | 1           | —         |
| Baseten         | `https://model-api.baseten.co/v1`            | 1           | —         |
| Wafer           | `https://pass.wafer.ai/v1`                   | 1           | —         |
| Arcee AI        | `https://api.arcee.ai/v1`                    | 1           | —         |
| Moonshot AI     | `https://api.moonshot.cn/v1`                 | 1           | —         |
| Amazon Nova     | `https://bedrock.us-east-1.amazonaws.com/v1` | 1           | —         |
| Baidu           | `https://qianfan.baidubce.com/v1`            | 1           | —         |
| Together AI     | `https://api.together.xyz/v1`                | 1           | —         |
| OpenRouter      | `https://openrouter.ai/api/v1`               | 1           | —         |
| FastRouter      | `https://api.fastrouter.ai/v1`               | 1           | —         |
| SubModel        | `https://api.submodel.ai/v1`                 | 1           | —         |
| Inception Labs  | `https://api.inceptionlabs.ai/v1`            | 1           | —         |
| SiliconFlow     | `https://api.siliconflow.cn/v1`              | 1           | —         |

> 详见 [迁移指南](migration-guide.md) 了解从 OpenAI 切换的步骤。

## 选择你的替代方案

| 需求               | 最佳选择                           | 详见                                  |
| ------------------ | ---------------------------------- | ------------------------------------- |
| 最便宜的工具调用   | DeepSeek, Qwen3                    | [定价对比](pricing-comparison.md)     |
| GPT-4 级别推理     | Claude Opus 4, Gemini 2.5 Pro      | [推理模型](reasoning-models.md)       |
| 免费原型开发       | Google Gemini, Cloudflare          | [Free Models](free-models.md)         |
| 最大上下文         | Gemini 2.5 Pro (1M), Llama 4 (10M) | [Context Windows](context-windows.md) |
| 开源权重自部署     | Llama 4, Qwen3                     | [Open-Weight Models](open-weights.md) |
| 轻松从 OpenAI 迁移 | Any OpenAI-compatible provider     | [迁移指南](migration-guide.md)        |
| 运行 AI 智能体     | Models with tool_call + reasoning  | [智能体模型](agentic-models.md)       |

## 相关文档

- [工具调用模型](tool-calling.md) — 2,350 models with function calling
- [推理模型](reasoning-models.md) — 1,306 models with chain-of-thought
- [视觉模型](vision-models.md) — 1,487 models with image understanding
- [免费 AI 模型](free-models.md) — 81 models at zero cost
- [定价对比](pricing-comparison.md) — side-by-side pricing across providers
- [迁移指南](migration-guide.md) — switch providers with minimal code changes
- [提供商对比](provider-comparison.md) — top 30 providers by model count
- [智能体模型](agentic-models.md) — 1,080 models for AI agents
- [代码模型](code-models.md) — 189 个代码模型

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
