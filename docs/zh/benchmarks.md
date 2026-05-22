# AI 模型基准测试与排行榜

[English](../benchmarks.md)

AI 模型如何被评估 — 关键基准测试、排行榜格局，以及这些数字对模型选择的意义。

数据来源：[AI Models Catalog](https://github.com/i-need-token/ai-models)。

## 为什么基准测试很重要

基准测试提供了跨任务比较 AI 模型的标准化方式。然而，没有任何单一基准测试能说明全部问题。本指南涵盖主要基准测试、如何解读它们，以及如何将它们与我们的目录数据（定价、上下文窗口、能力）结合使用，以做出明智的模型选择。

## 主要基准测试

### 通用语言理解

| 基准测试  | 测试内容               | 顶级模型                               | 备注                             |
| --------- | ---------------------- | -------------------------------------- | -------------------------------- |
| MMLU      | 多任务知识（57个学科） | GPT-4.1, Claude Opus 4, Gemini 2.5 Pro | 标准学术基准；可能不反映实际使用 |
| MMLU-Pro  | 更难的 MMLU，需要推理  | o3, Claude Sonnet 4, Gemini 2.5 Pro    | 更具挑战性的版本                 |
| GPQA      | 研究生水平科学问答     | o3, Gemini 2.5 Pro                     | 专家级推理                       |
| HellaSwag | 常识推理               | 大多数前沿模型接近满分                 | 接近饱和                         |

### 推理与数学

| 基准测试      | 测试内容 | 顶级模型                    | 备注               |
| ------------- | -------- | --------------------------- | ------------------ |
| MATH-500      | 竞赛数学 | o3, DeepSeek R1, Qwen3-235B | 量化任务的关键指标 |
| AIME 2024     | 数学竞赛 | o3, DeepSeek R1             | 非常有挑战性       |
| GSM8K         | 小学数学 | 大多数模型 >90%             | 接近饱和           |
| ARC-Challenge | 科学推理 | 大多数前沿模型              | 小学科学           |

### 编程

| 基准测试      | 测试内容             | 顶级模型                              | 备注                |
| ------------- | -------------------- | ------------------------------------- | ------------------- |
| HumanEval     | Python 代码生成      | Claude Sonnet 4, GPT-4.1, DeepSeek V3 | 164 个 Python 问题  |
| SWE-bench     | 真实 GitHub 问题修复 | Claude Sonnet 4, o3                   | 比 HumanEval 更真实 |
| LiveCodeBench | 持续更新的编程测试   | 各种                                  | 避免数据污染        |
| MBPP          | 基础 Python 编程     | 大多数模型 >80%                       | 接近饱和            |

### 多模态

| 基准测试  | 测试内容     | 顶级模型                        | 备注         |
| --------- | ------------ | ------------------------------- | ------------ |
| MMMU      | 多模态理解   | Gemini 2.5 Pro, Claude Sonnet 4 | 图像 + 文本  |
| MathVista | 视觉数学推理 | Gemini 2.5 Pro                  | 图表 + 数学  |
| AI2D      | 科学图表     | Gemini 2.5 Pro                  | 科学图表理解 |
| DocVQA    | 文档理解     | Gemini 2.5 Pro                  | 图像中的文本 |

### 工具使用与智能体

| 基准测试 | 测试内容       | 顶级模型                 | 备注                    |
| -------- | -------------- | ------------------------ | ----------------------- |
| BFCL v3  | 函数调用准确率 | GPT-4.1, Claude Sonnet 4 | Berkeley 函数调用排行榜 |
| τ-bench  | 智能体任务完成 | 各种                     | 基于终端的智能体任务    |
| WebArena | 网页交互       | 各种                     | 真实网页任务            |

## 关键排行榜

| 排行榜               | 侧重         | URL                                                                     |
| -------------------- | ------------ | ----------------------------------------------------------------------- |
| LMSYS Chatbot Arena  | 人类偏好排名 | https://chat.lmsys.org/                                                 |
| Open LLM Leaderboard | 开源模型排名 | https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard |
| AlpacaEval           | 指令遵循     | https://tatsu-lab.github.io/alpaca_eval/                                |
| MT-Bench             | 多轮对话     | Chatbot Arena 的一部分                                                  |
| BigBench             | 超越基础任务 | https://github.com/google/BIG-bench                                     |
| MTEB                 | 嵌入模型     | https://huggingface.co/spaces/mteb/leaderboard                          |

## 如何将基准测试与我们的目录结合使用

仅靠基准测试不足以进行模型选择。将它们与我们的目录数据结合使用：

1. **从你的用例开始** → 参见[模型选择指南](model-selection.md)
2. **按能力筛选** → 工具调用、推理、视觉等
3. **查看基准测试分数** → 针对你的特定任务领域
4. **比较定价** → 使用我们的[定价比较](pricing-comparison.md)
5. **考虑上下文窗口** → 参见[上下文窗口](context-windows.md)
6. **用你的数据测试** → 基准测试是代理；实际性能可能不同

## 基准测试的局限性

- **数据污染**：模型可能在训练期间见过基准测试数据
- **任务狭窄**：基准测试测试特定技能，而非通用实用性
- **排行榜博弈**：为基准测试优化可能损害实际性能
- **时效性**：随着模型改进，基准测试老化；饱和的基准测试变得无信息量
- **文化偏见**：大多数基准测试以英语和西方为中心
- **成本盲区**：基准测试忽略定价、延迟和可用性

## 实用建议

- **编程**：使用 SWE-bench 而非 HumanEval（更真实）
- **智能体**：用你实际的工具套件测试；BFCL 是起点
- **推理**：MATH-500 和 GPQA 比 MMLU 更有区分度
- **聊天**：Chatbot Arena 与人类偏好最相关
- **成本敏感**：先使用我们的[免费模型](free-models.md)指南

## 相关文档

- [模型选择指南](model-selection.md) — 选择模型的决策框架
- [定价比较](pricing-comparison.md) — 跨提供商成本分析
- [免费模型](free-models.md) — 81 个免费模型及其能力
- [工具调用模型](tool-calling.md) — 2,350 个支持函数调用的模型
- [推理模型](reasoning-models.md) — 1,306 个支持扩展思考的模型
- [视觉模型](vision-models.md) — 1,487 个支持图像理解的模型
- [编程模型](code-models.md) — 针对编程优化的模型
- [开放权重](open-weights.md) — 527 个开放权重模型
- [上下文窗口](context-windows.md) — 上下文窗口比较
- [交互式目录](https://i-need-token.github.io/ai-models/) — 浏览和比较所有模型
