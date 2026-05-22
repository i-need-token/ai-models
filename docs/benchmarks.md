# AI Model Benchmarks & Leaderboards

[中文](zh/benchmarks.md)

How AI models are evaluated — key benchmarks, leaderboard landscape, and what the numbers mean for model selection.

Data sourced from the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Why Benchmarks Matter

Benchmarks provide standardized ways to compare AI models across tasks. However, no single benchmark tells the whole story. This guide covers the major benchmarks, how to interpret them, and how to use them alongside our catalog data (pricing, context windows, capabilities) for informed model selection.

## Major Benchmarks

### General Language Understanding

| Benchmark | What It Tests                      | Top Models                             | Notes                                                         |
| --------- | ---------------------------------- | -------------------------------------- | ------------------------------------------------------------- |
| MMLU      | Multi-task knowledge (57 subjects) | GPT-4.1, Claude Opus 4, Gemini 2.5 Pro | Standard academic benchmark; may not reflect real-world usage |
| MMLU-Pro  | Harder MMLU with reasoning         | o3, Claude Sonnet 4, Gemini 2.5 Pro    | More challenging version                                      |
| GPQA      | Graduate-level science Q&A         | o3, Gemini 2.5 Pro                     | Expert-level reasoning                                        |
| HellaSwag | Common-sense reasoning             | Most frontier models near ceiling      | Near-saturated                                                |

### Reasoning & Math

| Benchmark     | What It Tests           | Top Models                  | Notes                      |
| ------------- | ----------------------- | --------------------------- | -------------------------- |
| MATH-500      | Competition mathematics | o3, DeepSeek R1, Qwen3-235B | Key for quantitative tasks |
| AIME 2024     | Math competition        | o3, DeepSeek R1             | Very challenging           |
| GSM8K         | Grade-school math       | Most models >90%            | Near-saturated             |
| ARC-Challenge | Scientific reasoning    | Most frontier models        | Grade-school science       |

### Coding

| Benchmark     | What It Tests                | Top Models                            | Notes                         |
| ------------- | ---------------------------- | ------------------------------------- | ----------------------------- |
| HumanEval     | Python code generation       | Claude Sonnet 4, GPT-4.1, DeepSeek V3 | 164 Python problems           |
| SWE-bench     | Real GitHub issue resolution | Claude Sonnet 4, o3                   | More realistic than HumanEval |
| LiveCodeBench | Continuously updated coding  | Various                               | Avoids data contamination     |
| MBPP          | Basic Python programming     | Most models >80%                      | Near-saturated                |

### Multimodal

| Benchmark | What It Tests             | Top Models                      | Notes                           |
| --------- | ------------------------- | ------------------------------- | ------------------------------- |
| MMMU      | Multi-modal understanding | Gemini 2.5 Pro, Claude Sonnet 4 | Images + text                   |
| MathVista | Visual math reasoning     | Gemini 2.5 Pro                  | Diagrams + math                 |
| AI2D      | Science diagrams          | Gemini 2.5 Pro                  | Scientific figure understanding |
| DocVQA    | Document understanding    | Gemini 2.5 Pro                  | Text in images                  |

### Tool Use & Agents

| Benchmark | What It Tests             | Top Models               | Notes                                 |
| --------- | ------------------------- | ------------------------ | ------------------------------------- |
| BFCL v3   | Function calling accuracy | GPT-4.1, Claude Sonnet 4 | Berkeley Function Calling Leaderboard |
| τ-bench   | Agent task completion     | Various                  | Terminal-based agent tasks            |
| WebArena  | Web interaction           | Various                  | Realistic web tasks                   |

## Key Leaderboards

| Leaderboard          | Focus                     | URL                                                                     |
| -------------------- | ------------------------- | ----------------------------------------------------------------------- |
| LMSYS Chatbot Arena  | Human preference ranking  | https://chat.lmsys.org/                                                 |
| Open LLM Leaderboard | Open-source model ranking | https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard |
| AlpacaEval           | Instruction-following     | https://tatsu-lab.github.io/alpaca_eval/                                |
| MT-Bench             | Multi-turn conversation   | Part of Chatbot Arena                                                   |
| BigBench             | Beyond basic tasks        | https://github.com/google/BIG-bench                                     |
| MTEB                 | Embedding models          | https://huggingface.co/spaces/mteb/leaderboard                          |

## How to Use Benchmarks with Our Catalog

Benchmarks alone are insufficient for model selection. Combine them with our catalog data:

1. **Start with your use case** → See [Model Selection Guide](model-selection.md)
2. **Filter by capabilities** → Tool calling, reasoning, vision, etc.
3. **Check benchmark scores** → For your specific task domain
4. **Compare pricing** → Use our [Pricing Comparison](pricing-comparison.md)
5. **Consider context windows** → See [Context Windows](context-windows.md)
6. **Test with your data** → Benchmarks are proxies; real performance may differ

## Benchmark Limitations

- **Data contamination**: Models may have seen benchmark data during training
- **Task narrowness**: Benchmarks test specific skills, not general utility
- **Leaderboard gaming**: Optimizing for benchmarks can hurt real-world performance
- **Staleness**: Benchmarks age as models improve; saturated benchmarks become uninformative
- **Cultural bias**: Most benchmarks are English-centric and Western-focused
- **Cost blindness**: Benchmarks ignore pricing, latency, and availability

## Practical Recommendations

- For **coding**: Use SWE-bench over HumanEval (more realistic)
- For **agents**: Test with your actual tool suite; BFCL is a starting point
- For **reasoning**: MATH-500 and GPQA are more discriminating than MMLU
- For **chat**: Chatbot Arena correlates best with human preference
- For **cost-sensitive**: Use our [Free Models](free-models.md) guide first

## Related Documentation

- [Model Selection Guide](model-selection.md) — Decision framework for choosing models
- [Pricing Comparison](pricing-comparison.md) — Cost analysis across providers
- [Free Models](free-models.md) — 81 free models with capabilities
- [Tool Calling Models](tool-calling.md) — 2,350 models with function calling
- [Reasoning Models](reasoning-models.md) — 1,306 models with extended thinking
- [Vision Models](vision-models.md) — 1,487 models with image understanding
- [Code Models](code-models.md) — Models optimized for programming
- [Open Weights](open-weights.md) — 527 open-weight models
- [Context Windows](context-windows.md) — Context window comparison
- [Interactive Catalog](https://i-need-token.github.io/ai-models/) — Browse and compare all models
