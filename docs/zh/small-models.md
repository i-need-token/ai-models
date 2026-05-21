# 小型与边缘模型

[English](../small-models.md)

专为**边缘部署、设备端推理和资源受限环境**设计的 AI 模型 — 参数量在 ~16B 以下的模型，可在消费级硬件、移动设备和嵌入式系统上运行。

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models)。

## 为什么小型模型很重要

小型模型使 AI 在云连接有限或延迟关键的场景中成为可能：

- **设备端推理** — 在手机和笔记本电脑上无需互联网运行 AI
- **边缘计算** — 部署在 IoT 设备、机器人和车辆中
- **低延迟** — 亚 100ms 响应时间，适用于实时应用
- **成本效益** — 运行成本更低，尤其是在大规模场景
- **隐私** — 数据不离开设备
- **离线能力** — 无需网络连接即可使用的 AI

## 统计

| 指标             | 数量 |
| ---------------- | ---- |
| 小型/边缘模型    | 1153 |
| 提供商           | 63   |
| 免费小型模型     | 30   |
| 开源权重小型模型 | 272  |
| 带工具调用       | 434  |
| 带推理能力       | 250  |

## 提供商

`302ai`、`aihubmix`、`aimlapi`、`aion`、`alibaba`、`amazon-bedrock`、`auriko`、`baichuan`、`berget`、`bytedance`、`cerebras`、`chutes`、`clarifai`、`cloudferro-sherlock`、`cloudflare`、`cortecs`、`databricks`、`deepinfra`、`digitalocean`、`evroc`、`fastrouter`、`fireworks`、`friendli`、`gmicloud`、`google`、`google-vertex`、`groq`、`hpc-ai`、`hyperbolic`、`inferencenet`、`jiekou`、`klusterai`、`llmgateway`、`martian`、`meganova`、`meta`、`microsoft`、`mistral`、`mixlayer`、`moonshotai`、`morph`、`nanogpt`、`nebius`、`neuralwatt`、`nousresearch`、`novitaai`、`openrouter`、`orcarouter`、`ovhcloud`、`ppio`、`privatemode`、`requesty`、`sambanova`、`scaleway`、`siliconflow`、`siliconflow-cn`、`submodel`、`tencent`、`textsynth`、`togetherai`、`venice`、`vultr`、`wafer`

## 免费小型模型

免费小型模型 — 零成本边缘 AI。

| 模型                                                 | 提供商     | 上下文 | 输入 $/M | 输出 $/M | 能力     |
| ---------------------------------------------------- | ---------- | ------ | -------- | -------- | -------- |
| nvidia--nemotron-3-super-120b-a12b--free             | openrouter | 1M     | Free     | Free     | 🔧 🧠 📋 |
| google--gemma-4-26b-a4b-it--free                     | openrouter | 262K   | Free     | Free     | 🔧 🧠 📋 |
| google--gemma-4-31b-it--free                         | openrouter | 262K   | Free     | Free     | 🔧 🧠 📋 |
| gemma-4-26b-a4b-it                                   | auriko     | 262K   | Free     | Free     | 🔧 🧠 📋 |
| gemma-4-31b-it                                       | auriko     | 262K   | Free     | Free     | 🔧 🧠 📋 |
| nvidia--nemotron-3-nano-omni-30b-a3b-reasoning--free | openrouter | 256K   | Free     | Free     | 🔧 🧠    |
| gemma-3-4b-it                                        | google     | 131K   | Free     | Free     |          |
| gemma-3-12b-it                                       | google     | 131K   | Free     | Free     |          |
| gemma-3-27b-it                                       | google     | 131K   | Free     | Free     |          |
| gemma-3n-E2B-it                                      | google     | 131K   | Free     | Free     |          |

## 最便宜小型模型

生产环境小型应用的最佳性价比模型。

| 模型                                            | 提供商   | 上下文 | 输入 $/M | 输出 $/M | 能力  |
| ----------------------------------------------- | -------- | ------ | -------- | -------- | ----- |
| llama3-groq-8b-8192-tool-use-preview            | aihubmix | 0      | $9.5e-05 | $9.5e-05 |       |
| mistralai--mistral-7b-instruct--free            | aihubmix | 0      | $0.001   | $0.001   |       |
| deepseek-ai--deepseek-r1-distill-llama-8b       | aihubmix | 0      | $0.005   | $0.005   |       |
| deepseek-ai--deepseek-r1-distill-qwen-7b        | aihubmix | 0      | $0.005   | $0.005   |       |
| deepseek-ai--deepseek-r1-distill-qwen-1.5b      | aihubmix | 0      | $0.005   | $0.005   |       |
| ernie-4.5-0.3b                                  | aihubmix | 0      | $0.0068  | $0.0272  | 🔧 📋 |
| google--gemma-2-9b-it--free                     | aihubmix | 0      | $0.01    | $0.01    |       |
| meta-llama--llama-3.2-3b-instruct--free         | aihubmix | 0      | $0.01    | $0.01    |       |
| meta-llama--llama-3.2-11b-vision-instruct--free | aihubmix | 0      | $0.01    | $0.01    |       |
| meta-llama--llama-3.1-8b-instruct--free         | aihubmix | 0      | $0.01    | $0.01    |       |

## 相关文档

- [开源权重](open-weights.md) — 527 个开源权重模型
- [免费 AI 模型](free-models.md) — 81 个免费模型按能力分类
- [聊天模型](chat-models.md) — 2,350 个支持工具调用的聊天模型
- [代码模型](code-models.md) — 189 个代码模型
- [模型选择指南](model-selection.md) — 选择模型的决策框架
- [提供商对比](provider-comparison.md) — 前 30 个提供商

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
