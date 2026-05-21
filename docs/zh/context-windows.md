[English](../context-windows.md) | **中文**

# 上下文窗口对比

哪些模型拥有最大的上下文窗口？本页按上下文窗口大小和定价列出模型。

> 完整列表请下载 [models.json](https://github.com/i-need-token/ai-models/releases/latest) 或浏览 `providers/`。

## 上下文窗口分布

| 层级             | 模型数 | 描述                             |
| ---------------- | -----: | -------------------------------- |
| 1M+ tokens       |    391 | 可处理整本书、整个代码库或长对话 |
| 256K–1M tokens   |    459 | 大型文档、多轮对话               |
| 128K–256K tokens |  1,310 | 标准长上下文，大多数现代模型     |
| 32K–128K tokens  |    194 | 中等长度文档                     |
| 8K–32K tokens    |     97 | 短文档、单轮查询                 |
| <8K tokens       |     19 | 旧模型，极短输入                 |

## 最大上下文窗口（1M+ tokens）

| 模型                          | 提供商     | 上下文 | 输入 $/1M | 输出 $/1M | 工具调用 | 推理 |
| ----------------------------- | ---------- | ------ | --------: | --------: | -------- | ---- |
| Llama 4 Scout                 | Meta       | 10M    |         — |         — | ✅       | ❌   |
| Llama 4 Scout                 | OpenRouter | 10M    |     $0.08 |     $0.30 | ✅       | ❌   |
| Gemini 3 Pro Preview          | Google     | 2M     |     $2.00 |    $12.00 | ✅       | ❌   |
| Gemini 3.1 Flash Lite Preview | Google     | 2M     |     $0.25 |     $1.50 | ✅       | ❌   |
| Gemini 3.1 Pro Preview        | Google     | 2M     |     $2.00 |    $12.00 | ✅       | ❌   |
| Grok 4 Fast Reasoning         | xAI        | 2M     |     $0.20 |     $0.50 | ✅       | ✅   |
| GPT-4.1                       | OpenAI     | ~1M    |     $2.00 |     $8.00 | ✅       | ❌   |
| Gemini 2.5 Pro                | Google     | 1M     |     $1.25 |    $10.00 | ✅       | ✅   |
| Gemini 2.5 Flash              | Google     | 1M     |     $0.15 |     $0.60 | ✅       | ✅   |
| Llama 4 Maverick              | Meta       | 1M     |         — |         — | ✅       | ❌   |
| Qwen3-235B-A22B               | 阿里云     | 128K\* |     ¥1.00 |     ¥4.00 | ✅       | ✅   |
| DeepSeek-V3                   | DeepSeek   | 128K   |     $0.27 |     $1.10 | ✅       | ❌   |

\*注：部分模型在不同平台上的上下文限制不同。请查看特定提供商的 YAML 文件获取准确值。

## 各上下文层级的最佳性价比

### 1M+ tokens（最便宜）

| 模型             | 提供商      |        输入 $/1M | 输出 $/1M |
| ---------------- | ----------- | ---------------: | --------: |
| Llama 4 Scout    | OpenRouter  |            $0.08 |     $0.30 |
| Gemini 2.5 Flash | Google      |            $0.15 |     $0.60 |
| Llama 4 Scout    | Together AI |            $0.15 |     $0.60 |
| Llama 4 Scout    | Meta        | 免费（开源权重） |         — |

### 128K–256K tokens（最便宜）

| 模型          | 提供商    | 输入 $/1M | 输出 $/1M |
| ------------- | --------- | --------: | --------: |
| DeepSeek-V3   | DeepSeek  |     $0.27 |     $1.10 |
| Qwen3-30B-A3B | 阿里云    |     ¥0.10 |     ¥0.30 |
| Phi-4         | Microsoft |     $0.10 |     $0.40 |
| Gemma 3 27B   | Google    |     $0.20 |     $0.80 |

## 要点总结

- **Llama 4 Scout** 拥有最大的上下文窗口，达 **10M tokens** — 是其他模型的 10 倍
- **1M+ 上下文**现已在 6+ 个提供商中可用，包括免费开源权重模型
- **128K 上下文**是最常见的层级（1,310 个模型）— 足以满足大多数用例
- **成本随上下文增长**：1M+ 上下文模型的每 token 成本是 128K 模型的 2–10 倍
- **缓存读取定价**可显著降低重复查询的成本（最高 90% 折扣）

## 相关文档

- [模型选择指南](model-selection.md) — 大上下文模型推荐
- [定价对比](pricing-comparison.md) — 各提供商定价并排对比
- [免费 AI 模型](free-models.md) — 81 个免费模型按上下文窗口分类
- [视觉模型](vision-models.md) — 1,487 个视觉模型含上下文信息
- [缓存定价](cached-pricing.md) — 1,374 个支持提示缓存的模型

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
