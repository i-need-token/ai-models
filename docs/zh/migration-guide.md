# 迁移指南：切换 AI 模型提供商

[English](../migration-guide.md)

切换 AI 模型提供商的实用指南 — 比较定价、能力和上下文窗口，找到最适合您用例的替代方案。

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models)。

## 为什么要切换提供商？

- **节省成本** — 某些提供商以低 2-10 倍的价格提供相同模型
- **更好的能力** — 新模型可能提供工具调用、推理或视觉能力
- **更大的上下文** — 在单个请求中处理更多数据
- **可靠性** — 减少对单一提供商的依赖
- **合规性** — 数据驻留要求可能需要特定提供商

## 主要提供商对比

| 提供商    | 模型数 | 最低输入 $/M | 最大上下文 | 工具调用 | 推理 |
| --------- | ------ | -----------: | ---------- | -------- | ---- |
| openai    | 28     |        $0.02 | 1047576    | 18       | 8    |
| anthropic | 11     |           $1 | 1000000    | 11       | 11   |
| google    | 21     |       $0.075 | 2097152    | 8        | 2    |
| deepseek  | 4      |        $0.14 | 1000000    | 4        | 3    |
| meta      | 12     |         $0.1 | 10000000   | 9        | 0    |
| mistral   | 16     |        $0.04 | 256000     | 12       | 1    |
| xai       | 6      |         $0.2 | 131072     | 6        | 5    |
| alibaba   | 62     |        $0.15 | 1000000    | 62       | 52   |

## 常见迁移路径

### OpenAI → 更便宜的替代方案

| OpenAI 模型          | 最便宜的替代方案 | 提供商    | 输入 $/M | 节省 |
| -------------------- | ---------------- | --------- | -------- | ---- |
| gpt-4.1 ($2)         | gpt-4.1-mini     | openai    | $0.40    | 80%  |
| gpt-4.1-mini ($0.40) | gpt-4.1-nano     | openai    | $0.10    | 75%  |
| o4-mini ($1.10)      | deepseek-r1      | deepseek  | $0.55    | 50%  |
| gpt-4.1 ($2)         | claude-haiku-4   | anthropic | $1       | 50%  |
| gpt-4.1 ($2)         | gemini-2.5-flash | google    | $0.15    | 93%  |

### Anthropic → 更便宜的替代方案

| Anthropic 模型       | 最便宜的替代方案 | 提供商   | 输入 $/M | 节省 |
| -------------------- | ---------------- | -------- | -------- | ---- |
| claude-opus-4 ($15)  | o4-mini          | openai   | $1.10    | 93%  |
| claude-sonnet-4 ($3) | gemini-2.5-flash | google   | $0.15    | 95%  |
| claude-sonnet-4 ($3) | deepseek-chat    | deepseek | $0.14    | 95%  |
| claude-haiku-4 ($1)  | gemini-2.5-flash | google   | $0.15    | 85%  |

### Google → 更便宜的替代方案

| Google 模型            | 最便宜的替代方案 | 提供商   | 输入 $/M | 节省 |
| ---------------------- | ---------------- | -------- | -------- | ---- |
| gemini-2.5-pro ($1.25) | gemini-2.5-flash | google   | $0.15    | 88%  |
| gemini-2.5-pro ($1.25) | deepseek-chat    | deepseek | $0.14    | 89%  |

## 迁移检查清单

切换提供商时，请验证以下兼容性要点：

- [ ] **API 格式** — OpenAI 兼容 vs 专有 API
- [ ] **模型名称** — 不同提供商使用不同的模型 ID
- [ ] **工具调用格式** — 函数调用语法不同
- [ ] **流式传输** — SSE vs WebSocket vs HTTP 流式传输
- [ ] **速率限制** — 每分钟请求数、每分钟 token 数
- [ ] **上下文窗口** — 可能与原提供商不同
- [ ] **模态** — 视觉、音频、视频支持不同
- [ ] **结构化输出** — JSON 模式可用性
- [ ] **提示缓存** — 可降低 50-90% 成本
- [ ] **数据驻留** — 数据在哪里处理和存储

## OpenAI 兼容提供商

这些提供商提供 OpenAI 兼容 API — 只需最少的代码更改：

| 提供商      | Base URL                        | 备注              |
| ----------- | ------------------------------- | ----------------- |
| openrouter  | `openrouter.ai/api/v1`          | 聚合器，356+ 模型 |
| deepinfra   | `api.deepinfra.com/v1`          | 专注开源模型      |
| togetherai  | `api.together.xyz/v1`           | 开源模型托管      |
| groq        | `api.groq.com/openai/v1`        | 超快推理          |
| cerebras    | `api.cerebras.ai/v1`            | 最快推理速度      |
| fireworks   | `api.fireworks.ai/inference/v1` | 无服务器模型托管  |
| siliconflow | `api.siliconflow.cn/v1`         | 中国市场提供商    |

## 相关文档

- [定价对比](pricing-comparison.md) — 跨提供商定价对比
- [模型选择指南](model-selection.md) — 选择模型的决策框架
- [免费 AI 模型](free-models.md) — 81 个免费模型按能力分类
- [缓存定价](cached-pricing.md) — 1,374 个支持提示缓存的模型
- [聊天模型](chat-models.md) — 2,350 个支持工具调用的聊天模型
- [智能体模型](agentic-models.md) — 1,080 个具备工具调用 + 推理能力的模型
- [API 参考](api.md) — 编程访问模型数据
- [OpenAI 替代方案](openai-alternatives.md) — GPT-4/GPT-3.5 定价替代

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
