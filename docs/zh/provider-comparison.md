# 提供商对比

[English](../provider-comparison.md)

AI 模型提供商的并排对比 — 模型数量、能力、定价和上下文窗口一目了然。

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models)。

## 按模型数量排名的前 30 个提供商

| 提供商         | 模型 | 免费 | 工具调用 | 推理 | 视觉 | 最低 $/M | 能力        |
| -------------- | ---: | ---: | -------: | ---: | ---: | -------: | ----------- |
| nanogpt        |  547 |    0 |        0 |    0 |    0 |    $0.02 |             |
| aihubmix       |  476 |    0 |      132 |   74 |  145 |    $0.00 | 🔧 🧠 👁️ 🎤 |
| openrouter     |  356 |   29 |      263 |  190 |  160 |    $0.01 | 🔧 🧠 👁️ 🎤 |
| martian        |  304 |    0 |        0 |    3 |    2 |    $0.02 | 🧠 👁️       |
| requesty       |  277 |    0 |      251 |  139 |  151 |    $0.02 | 🔧 🧠 👁️    |
| 302ai          |  268 |    0 |      190 |   44 |  144 |    $0.00 | 🔧 🧠 👁️ 🔓 |
| auriko         |  181 |    5 |      154 |  108 |   93 |    $0.01 | 🔧 🧠 👁️ 🖼️ |
| llmgateway     |  163 |    3 |      158 |   85 |   89 |    $0.03 | 🔧 🧠 👁️ 🖼️ |
| aimlapi        |  147 |    2 |       21 |    0 |   14 |    $0.01 | 🔧 👁️       |
| fastrouter     |  120 |    2 |       94 |   66 |   65 |    $0.02 | 🔧 🧠 👁️ 🎤 |
| orcarouter     |  120 |    0 |      102 |   64 |  111 |    $0.05 | 🔧 🧠 👁️ 🔓 |
| cortecs        |  105 |    0 |       97 |   82 |   52 |    $0.02 | 🔧 🧠 👁️ 🎤 |
| novitaai       |  104 |    2 |       72 |   53 |   33 |    $0.02 | 🔧 🧠 👁️ 🎤 |
| vultr          |   98 |    0 |       11 |   22 |   23 |    $0.55 | 🔧 🧠 👁️ 🎤 |
| deepinfra      |   88 |    0 |        0 |   51 |   38 |    $0.01 | 🧠 👁️       |
| venice         |   75 |    0 |       64 |   55 |   39 |    $0.05 | 🔧 🧠 👁️    |
| jiekou         |   73 |    0 |       73 |    0 |   49 |    $0.03 | 🔧 👁️ 🔓    |
| meganova       |   63 |    4 |       60 |    7 |   37 |    $0.02 | 🔧 🧠 👁️ 🔓 |
| alibaba        |   62 |    0 |       62 |   52 |    0 |    $0.15 | 🔧 🧠       |
| ppio           |   60 |    1 |       46 |   12 |   11 |    $0.21 | 🔧 🧠 👁️ 🔓 |
| amazon-bedrock |   57 |    0 |       37 |    0 |   16 |    $0.04 | 🔧 👁️ 🎤 🎬 |
| google-vertex  |   38 |    0 |       32 |    0 |   19 |    $0.07 | 🔧 👁️ 🎤 🎬 |
| siliconflow-cn |   37 |    0 |        2 |    7 |    9 |    $0.50 | 🔧 🧠 👁️    |
| stepfun        |   31 |   14 |        0 |    0 |   11 |    $0.70 | 👁️ 🎤 🖼️    |
| cloudflare     |   30 |    0 |       15 |   10 |    7 |    $0.02 | 🔧 🧠 👁️ 🔓 |
| gmicloud       |   29 |    0 |       11 |   10 |    0 |    $0.07 | 🔧 🧠 🔓    |
| databricks     |   29 |    0 |        4 |    0 |   10 |    $0.05 | 🔧 👁️ 🔓    |
| openai         |   28 |    5 |       18 |    8 |   12 |    $0.02 | 🔧 🧠 👁️ 🎤 |
| siliconflow    |   27 |    0 |       24 |    2 |    3 |    $0.04 | 🔧 🧠 👁️ 🔓 |
| togetherai     |   24 |    0 |       22 |    2 |    0 |    $0.03 | 🔧 🧠 🔓    |

## 提供商分类

### 聚合器（多提供商访问）

这些提供商通过单一 API 提供多家 AI 公司的模型：

| 提供商     | 模型 | 备注                              |
| ---------- | ---: | --------------------------------- |
| openrouter |  356 | 最大的模型聚合器，OpenAI 兼容 API |
| requesty   |  277 | 智能路由                          |
| martian    |  304 | 多提供商负载均衡                  |
| aihubmix   |  476 | 中国市场聚合器                    |
| nanogpt    |  547 | 按量付费，无需订阅                |
| llmgateway |  163 | 企业 API 网关                     |
| fastrouter |  120 | 快速模型路由                      |
| orcarouter |  120 | 多提供商路由                      |

### 直供提供商（第一方 API）

| 提供商    | 模型 | 专长                        |
| --------- | ---: | --------------------------- |
| openai    |   28 | GPT-4.1, o3/o4 推理模型     |
| anthropic |   11 | Claude 4 系列，最适合 Agent |
| google    |   21 | Gemini 2.5, 1M+ 上下文      |
| deepseek  |    4 | DeepSeek R1，最佳开源推理   |
| meta      |   12 | Llama 4，开源权重           |
| mistral   |   16 | Mistral Large, Codestral    |
| xai       |    6 | Grok 3，实时数据            |
| alibaba   |   62 | Qwen 3，最大的开源家族      |

### 基础设施提供商（托管开源模型）

| 提供商     | 模型 | 专长                  |
| ---------- | ---: | --------------------- |
| groq       |   12 | 最快推理 (LPU)        |
| cerebras   |   11 | 超快推理 (CS-3)       |
| togetherai |   24 | 无服务器开源托管      |
| deepinfra  |   88 | 高性价比推理          |
| fireworks  |   10 | 无服务器模型托管      |
| cloudflare |   30 | 边缘推理 (Workers AI) |

### 区域提供商

| 提供商              | 模型 | 区域         |
| ------------------- | ---: | ------------ |
| siliconflow         |   27 | 中国         |
| siliconflow-cn      |   37 | 中国（国内） |
| stepfun             |   31 | 中国         |
| zhipuai             |   20 | 中国         |
| baichuan            |   11 | 中国         |
| baidu               |    8 | 中国         |
| iflytek             |    6 | 中国         |
| tencent             |   14 | 中国         |
| ppio                |   60 | 中国         |
| ovhcloud            |   12 | 欧洲（法国） |
| scaleway            |   13 | 欧洲（法国） |
| cloudferro-sherlock |   12 | 欧洲（欧盟） |

## 选择提供商

| 如果您需要...    | 最佳提供商                     | 原因                   |
| ---------------- | ------------------------------ | ---------------------- |
| **最低价格**     | deepseek, google               | 输入低至 $0.14/M token |
| **最快推理**     | groq, cerebras                 | 亚 100ms 延迟          |
| **最大上下文**   | google, meta                   | 1M-10M token 上下文    |
| **最多模型**     | nanogpt, aihubmix              | 各 500+ 模型           |
| **最适合 Agent** | anthropic, openai              | 工具调用 + 推理        |
| **开源权重**     | meta, deepseek                 | 在自有硬件上运行       |
| **欧盟数据驻留** | ovhcloud, scaleway, cloudferro | 欧盟托管推理           |
| **中国访问**     | siliconflow, ppio, stepfun     | 中国节点               |

## 相关文档

- [迁移指南](migration-guide.md) — 切换提供商的定价对比
- [定价对比](pricing-comparison.md) — 跨提供商定价对比
- [提供商概览](providers.md) — 全部 95 个提供商列表
- [模型选择指南](model-selection.md) — 选择模型的决策框架
- [免费 AI 模型](free-models.md) — 81 个免费模型按能力分类
- [聊天模型](chat-models.md) — 2,350 个支持工具调用的聊天模型
- [智能体模型](agentic-models.md) — 1,080 个具备工具调用 + 推理能力的模型

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
