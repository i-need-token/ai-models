# Cached Pricing

[中文](zh/cached-pricing.md)

AI models with prompt caching support, showing standard vs. cached pricing. Cached inputs can be **50-90% cheaper** than standard input tokens.

Data sourced from the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Why Cached Pricing Matters

Prompt caching lets you store repeated prompt prefixes (system prompts, few-shot examples, tool definitions) and reuse them across requests. This dramatically reduces:

- **Cost**: 50-90% savings on input tokens
- **Latency**: Faster time-to-first-token for cached content
- **Throughput**: More efficient use of rate limits

## Stats

| Metric                    | Count |
| ------------------------- | ----- |
| Models with cache pricing | 1374  |
| Providers                 | 39    |

## Providers

`aihubmix`, `aion`, `amazon-bedrock`, `auriko`, `baidu`, `baseten`, `chutes`, `clarifai`, `cloudflare`, `cortecs`, `databricks`, `deepinfra`, `deepseek`, `digitalocean`, `fastrouter`, `friendli`, `google`, `google-vertex`, `groq`, `hpc-ai`, `inception`, `jiekou`, `llmgateway`, `martian`, `minimax`, `moonshotai`, `nanogpt`, `openai`, `openrouter`, `ppio`, `privatemode`, `requesty`, `siliconflow`, `stepfun`, `tencent-tokenhub`, `togetherai`, `upstage`, `venice`, `wafer`

## Model Pricing

| Model                                         | Provider       | Context | Input $/M           | Cache Read $/M       | Cache Write $/M | Savings |
| --------------------------------------------- | -------------- | ------- | ------------------- | -------------------- | --------------- | ------- |
| aistudio_gemini-2.0-flash                     | aihubmix       | —       | $0.05               | $0.125               | —               | -150%   |
| aistudio_gpt-4.1-mini                         | aihubmix       | —       | $0.2                | $0.05                | —               | 75%     |
| anthropic-opus-4-6                            | aihubmix       | —       | $2.5                | $0.25                | $3.125          | 90%     |
| claude-haiku-4-5                              | aihubmix       | —       | $0.55               | $0.055               | $0.6875         | 90%     |
| claude-sonnet-4-0                             | aihubmix       | —       | $1.65               | $0.165               | $2.0625         | 90%     |
| claude-sonnet-4-5                             | aihubmix       | —       | $1.65               | $0.165               | $2.0625         | 90%     |
| claude-sonnet-4-5-think                       | aihubmix       | —       | $1.65               | $0.165               | $2.0625         | 90%     |
| codex-mini-latest                             | aihubmix       | —       | $0.75               | $0.1875              | —               | 75%     |
| deepseek-v3.2                                 | aihubmix       | —       | $0.151              | $0.0151              | —               | 90%     |
| deepseek-v3.2-exp                             | aihubmix       | —       | $0.137              | $0.0137              | —               | 90%     |
| deepseek-v3.2-exp-think                       | aihubmix       | —       | $0.137              | $0.0137              | —               | 90%     |
| deepseek-v3.2-think                           | aihubmix       | —       | $0.151              | $0.0151              | —               | 90%     |
| doubao-1.5-lite-32k                           | aihubmix       | —       | $0.025              | $0.005               | —               | 80%     |
| doubao-1.5-pro-32k                            | aihubmix       | —       | $0.067              | $0.0134              | —               | 80%     |
| doubao-lite-32k                               | aihubmix       | —       | $0.03               | $0.006               | —               | 80%     |
| doubao-pro-32k                                | aihubmix       | —       | $0.07               | $0.014               | —               | 80%     |
| doubao-seed-1-6                               | aihubmix       | —       | $0.09               | $0.018               | —               | 80%     |
| doubao-seed-1-6-250615                        | aihubmix       | —       | $0.09               | $0.018               | —               | 80%     |
| doubao-seed-1-6-flash                         | aihubmix       | —       | $0.022              | $0.0044              | —               | 80%     |
| doubao-seed-1-6-flash-250615                  | aihubmix       | —       | $0.022              | $0.0044              | —               | 80%     |
| doubao-seed-1-6-lite                          | aihubmix       | —       | $0.041              | $0.0082              | —               | 80%     |
| doubao-seed-1-6-thinking                      | aihubmix       | —       | $0.09               | $0.018               | —               | 80%     |
| doubao-seed-1-6-thinking-250615               | aihubmix       | —       | $0.09               | $0.018               | —               | 80%     |
| doubao-seed-1-6-vision-250815                 | aihubmix       | —       | $0.054795           | $0.010959            | —               | 80%     |
| doubao-seed-1-8                               | aihubmix       | —       | $0.054795           | $0.010959            | —               | 80%     |
| gemini-2.0-flash                              | aihubmix       | —       | $0.05               | $0.0125              | —               | 75%     |
| gemini-2.0-flash-001                          | aihubmix       | —       | $0.05               | $0.125               | —               | -150%   |
| gemini-2.0-flash-search                       | aihubmix       | —       | $0.05               | $0.0125              | —               | 75%     |
| gemini-2.5-flash                              | aihubmix       | —       | $0.15               | $0.015               | —               | 90%     |
| gemini-2.5-flash-lite                         | aihubmix       | —       | $0.05               | $0.005               | —               | 90%     |
| gemini-2.5-flash-lite-nothink                 | aihubmix       | —       | $0.05               | $0.005               | —               | 90%     |
| gemini-2.5-flash-lite-preview-09-2025         | aihubmix       | —       | $0.05               | $0.005               | —               | 90%     |
| gemini-2.5-flash-lite-preview-09-2025-nothink | aihubmix       | —       | $0.05               | $0.005               | —               | 90%     |
| gemini-2.5-flash-nothink                      | aihubmix       | —       | $0.15               | $0.015               | —               | 90%     |
| gemini-2.5-flash-preview-05-20-nothink        | aihubmix       | —       | $0.15               | $0.015               | —               | 90%     |
| gemini-2.5-flash-preview-05-20-search         | aihubmix       | —       | $0.15               | $0.015               | —               | 90%     |
| gemini-2.5-flash-preview-09-2025              | aihubmix       | —       | $0.15               | $0.015               | —               | 90%     |
| gemini-2.5-flash-search                       | aihubmix       | —       | $0.15               | $0.015               | —               | 90%     |
| gemini-2.5-pro                                | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gemini-2.5-pro-exp-03-25                      | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gemini-2.5-pro-preview-03-25                  | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gemini-2.5-pro-preview-03-25-search           | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gemini-2.5-pro-preview-05-06                  | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gemini-2.5-pro-preview-05-06-search           | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gemini-2.5-pro-preview-06-05                  | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gemini-2.5-pro-preview-06-05-search           | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gemini-2.5-pro-search                         | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| glm-4.5-airx                                  | aihubmix       | —       | $0.55               | $0.11                | —               | 80%     |
| glm-4.5-x                                     | aihubmix       | —       | $1.1                | $0.22                | —               | 80%     |
| glm-4.6                                       | aihubmix       | —       | $0.136987           | $0.027397            | —               | 80%     |
| glm-4.6v                                      | aihubmix       | —       | $0.0685             | $0.0137              | —               | 80%     |
| glm-4.7                                       | aihubmix       | —       | $0.136987           | $0.027397            | —               | 80%     |
| gpt-4.1                                       | aihubmix       | —       | $1                  | $0.25                | —               | 75%     |
| gpt-4.1-mini                                  | aihubmix       | —       | $0.2                | $0.05                | —               | 75%     |
| gpt-4.1-nano                                  | aihubmix       | —       | $0.05               | $0.0125              | —               | 75%     |
| gpt-4o                                        | aihubmix       | —       | $1.25               | $0.625               | —               | 50%     |
| gpt-4o-2024-08-06                             | aihubmix       | —       | $1.25               | $0.625               | —               | 50%     |
| gpt-4o-2024-08-06-global                      | aihubmix       | —       | $1.25               | $0.625               | —               | 50%     |
| gpt-4o-2024-11-20                             | aihubmix       | —       | $1.25               | $0.625               | —               | 50%     |
| gpt-4o-mini                                   | aihubmix       | —       | $0.075              | $0.0375              | —               | 50%     |
| gpt-4o-mini-2024-07-18                        | aihubmix       | —       | $0.075              | $0.0375              | —               | 50%     |
| gpt-4o-mini-global                            | aihubmix       | —       | $0.075              | $0.0375              | —               | 50%     |
| gpt-4o-mini-search-preview                    | aihubmix       | —       | $0.075              | $0.0375              | —               | 50%     |
| gpt-4o-search-preview                         | aihubmix       | —       | $1.25               | $0.625               | —               | 50%     |
| gpt-5                                         | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gpt-5-chat-latest                             | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gpt-5-codex                                   | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gpt-5-mini                                    | aihubmix       | —       | $0.125              | $0.0125              | —               | 90%     |
| gpt-5-nano                                    | aihubmix       | —       | $0.025              | $0.0025              | —               | 90%     |
| gpt-5.1                                       | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gpt-5.1-chat-latest                           | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gpt-5.1-codex                                 | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gpt-5.1-codex-max                             | aihubmix       | —       | $0.625              | $0.0625              | —               | 90%     |
| gpt-5.1-codex-mini                            | aihubmix       | —       | $0.125              | $0.0125              | —               | 90%     |
| gpt-5.2                                       | aihubmix       | —       | $0.875              | $0.0875              | —               | 90%     |
| gpt-5.2-chat-latest                           | aihubmix       | —       | $0.875              | $0.0875              | —               | 90%     |
| gpt-5.2-codex                                 | aihubmix       | —       | $0.875              | $0.0875              | —               | 90%     |
| gpt-5.2-high                                  | aihubmix       | —       | $0.875              | $0.0875              | —               | 90%     |
| gpt-5.2-low                                   | aihubmix       | —       | $0.875              | $0.0875              | —               | 90%     |
| gpt-5.2-pro                                   | aihubmix       | —       | $10.5               | $1.05                | —               | 90%     |
| grok-4                                        | aihubmix       | —       | $1.65               | $0.4125              | —               | 75%     |
| grok-4-1-fast-non-reasoning                   | aihubmix       | —       | $0.1                | $0.025               | —               | 75%     |
| grok-4-1-fast-reasoning                       | aihubmix       | —       | $0.1                | $0.025               | —               | 75%     |
| grok-4-fast-non-reasoning                     | aihubmix       | —       | $0.1                | $0.025               | —               | 75%     |
| grok-4-fast-reasoning                         | aihubmix       | —       | $0.1                | $0.025               | —               | 75%     |
| grok-4.20-beta-0309-non-reasoning             | aihubmix       | —       | $1                  | $0.1                 | —               | 90%     |
| grok-4.20-beta-0309-reasoning                 | aihubmix       | —       | $1                  | $0.1                 | —               | 90%     |
| grok-4.20-multi-agent-0309                    | aihubmix       | —       | $1                  | $0.1                 | —               | 90%     |
| grok-4.20-multi-agent-beta-0309               | aihubmix       | —       | $1                  | $0.1                 | —               | 90%     |
| grok-code-fast-1                              | aihubmix       | —       | $0.1                | $0.025               | —               | 75%     |
| kimi-k2-thinking                              | aihubmix       | —       | $0.274              | $0.0685              | —               | 75%     |
| kimi-k2-turbo-preview                         | aihubmix       | —       | $0.6                | $0.15                | —               | 75%     |
| kimi-k2.5                                     | aihubmix       | —       | $0.3                | $0.0525              | —               | 82%     |
| mimo-v2-flash                                 | aihubmix       | —       | $0.0959             | $0.01918             | —               | 80%     |
| mimo-v2-omni                                  | aihubmix       | —       | $0.22               | $0.044               | —               | 80%     |
| mimo-v2-pro                                   | aihubmix       | —       | $0.55               | $0.11                | —               | 80%     |
| nvidia-nemotron-3-super-120b-a12b             | aihubmix       | —       | $0.055              | $0.01375             | —               | 75%     |
| o1                                            | aihubmix       | —       | $7.5                | $3.75                | —               | 50%     |
| o1-2024-12-17                                 | aihubmix       | —       | $7.5                | $3.75                | —               | 50%     |
| o1-global                                     | aihubmix       | —       | $7.5                | $3.75                | —               | 50%     |
| o1-mini                                       | aihubmix       | —       | $1.5                | $0.75                | —               | 50%     |
| o1-mini-2024-09-12                            | aihubmix       | —       | $1.5                | $0.75                | —               | 50%     |
| o1-preview                                    | aihubmix       | —       | $7.5                | $3.75                | —               | 50%     |
| o1-preview-2024-09-12                         | aihubmix       | —       | $7.5                | $3.75                | —               | 50%     |
| o3                                            | aihubmix       | —       | $1                  | $0.25                | —               | 75%     |
| o3-deep-research                              | aihubmix       | —       | $5                  | $1.25                | —               | 75%     |
| o3-global                                     | aihubmix       | —       | $1                  | $0.25                | —               | 75%     |
| o3-mini                                       | aihubmix       | —       | $0.55               | $0.275               | —               | 50%     |
| o3-mini-global                                | aihubmix       | —       | $0.55               | $0.275               | —               | 50%     |
| o4-mini                                       | aihubmix       | —       | $0.55               | $0.1375              | —               | 75%     |
| qwen-plus                                     | aihubmix       | —       | $0.0563             | $0.01126             | $0.070375       | 80%     |
| qwen-plus-2025-04-28                          | aihubmix       | —       | $0.0563             | $0.01126             | $0.070375       | 80%     |
| qwen-plus-2025-07-28                          | aihubmix       | —       | $0.0563             | $0.01126             | $0.070375       | 80%     |
| qwen-plus-latest                              | aihubmix       | —       | $0.0563             | $0.01126             | $0.070375       | 80%     |
| qwen-turbo                                    | aihubmix       | —       | $0.023              | $0.0046              | —               | 80%     |
| qwen-turbo-latest                             | aihubmix       | —       | $0.023              | $0.0046              | —               | 80%     |
| qwen3-coder-plus                              | aihubmix       | —       | $0.27               | $0.054               | —               | 80%     |
| qwen3-max                                     | aihubmix       | —       | $0.2254             | $0.04508             | $0.28175        | 80%     |
| qwen3-max-2026-01-23                          | aihubmix       | —       | $0.2254             | $0.04508             | $0.28175        | 80%     |
| qwen3-max-preview                             | aihubmix       | —       | $0.423              | $0.0846              | —               | 80%     |
| qwen3-vl-flash                                | aihubmix       | —       | $0.0103             | $0.00206             | —               | 80%     |
| qwen3-vl-plus                                 | aihubmix       | —       | $0.0685             | $0.0137              | —               | 80%     |
| zai-glm-5-turbo                               | aihubmix       | —       | $0.6                | $0.12                | —               | 80%     |
| aion-2.0                                      | aion           | —       | $0.7999999999999999 | $0.19999999999999998 | —               | 75%     |
| aion-2.5                                      | aion           | —       | $1                  | $0.35                | —               | 65%     |
| amazon-nova-2-lite                            | amazon-bedrock | —       | $0.33               | $0.0825              | —               | 75%     |
| amazon-nova-lite                              | amazon-bedrock | —       | $0.06               | $0.015               | —               | 75%     |
| amazon-nova-micro                             | amazon-bedrock | —       | $0.035              | $0.00875             | —               | 75%     |
| amazon-nova-premier                           | amazon-bedrock | —       | $2.5                | $0.625               | —               | 75%     |
| amazon-nova-pro                               | amazon-bedrock | —       | $0.8                | $0.2                 | —               | 75%     |
| claude-haiku-4-5-20251001                     | auriko         | —       | $1                  | $0.1                 | $1.25           | 90%     |
| claude-opus-4-1-20250805                      | auriko         | —       | $15                 | $1.5                 | $18.75          | 90%     |
| claude-opus-4-20250514                        | auriko         | —       | $15                 | $1.5                 | $18.75          | 90%     |
| claude-opus-4-5-20251101                      | auriko         | —       | $5                  | $0.5                 | $6.25           | 90%     |
| claude-opus-4-6                               | auriko         | —       | $5                  | $0.5                 | $6.25           | 90%     |
| claude-opus-4-7                               | auriko         | —       | $5                  | $0.5                 | $6.25           | 90%     |
| claude-sonnet-4-20250514                      | auriko         | —       | $3                  | $0.3                 | $3.75           | 90%     |
| claude-sonnet-4-5-20250929                    | auriko         | —       | $3                  | $0.3                 | $3.75           | 90%     |
| claude-sonnet-4-6                             | auriko         | —       | $3                  | $0.3                 | $3.75           | 90%     |
| deepseek-r1-0528                              | auriko         | —       | $0.5                | $0.35                | —               | 30%     |
| deepseek-v3-0324                              | auriko         | —       | $0.2                | $0.135               | —               | 32%     |
| deepseek-v3.1                                 | auriko         | —       | $0.21               | $0.13                | —               | 38%     |
| deepseek-v3.1-terminus                        | auriko         | —       | $0.27               | $0.13                | —               | 52%     |
| deepseek-v3.2                                 | auriko         | —       | $0.26               | $0.13                | —               | 50%     |
| deepseek-v4-flash                             | auriko         | —       | $0.14               | $0.0028              | —               | 98%     |
| deepseek-v4-pro                               | auriko         | —       | $0.435              | $0.003625            | —               | 99%     |
| gemini-2.5-flash                              | auriko         | —       | $0.3                | $0.03                | —               | 90%     |
| gemini-2.5-flash-lite                         | auriko         | —       | $0.1                | $0.01                | —               | 90%     |
| gemini-2.5-pro                                | auriko         | —       | $1.25               | $0.125               | —               | 90%     |
| gemini-3-flash-preview                        | auriko         | —       | $0.5                | $0.05                | —               | 90%     |
| gemini-3.1-flash-lite                         | auriko         | —       | $0.25               | $0.025               | —               | 90%     |
| gemini-3.1-flash-lite-preview                 | auriko         | —       | $0.25               | $0.025               | —               | 90%     |
| gemini-3.1-pro-preview                        | auriko         | —       | $2                  | $0.2                 | —               | 90%     |
| gemini-3.1-pro-preview-customtools            | auriko         | —       | $2                  | $0.2                 | —               | 90%     |
| gemini-flash-latest                           | auriko         | —       | $0.5                | $0.05                | —               | 90%     |
| gemini-flash-lite-latest                      | auriko         | —       | $0.1                | $0.01                | —               | 90%     |
| gemini-pro-latest                             | auriko         | —       | $2                  | $0.2                 | —               | 90%     |
| glm-4.5                                       | auriko         | —       | $0.6                | $0.11                | —               | 82%     |
| glm-4.5-air                                   | auriko         | —       | $0.2                | $0.03                | —               | 85%     |
| glm-4.5-airx                                  | auriko         | —       | $1.1                | $0.22                | —               | 80%     |
| glm-4.5-x                                     | auriko         | —       | $2.2                | $0.45                | —               | 80%     |
| glm-4.5v                                      | auriko         | —       | $0.6                | $0.11                | —               | 82%     |
| glm-4.6                                       | auriko         | —       | $0.6                | $0.11                | —               | 82%     |
| glm-4.6v                                      | auriko         | —       | $0.3                | $0.05                | —               | 83%     |
| glm-4.6v-flashx                               | auriko         | —       | $0.04               | $0.004               | —               | 90%     |
| glm-4.7                                       | auriko         | —       | $0.6                | $0.11                | —               | 82%     |
| glm-4.7-flashx                                | auriko         | —       | $0.07               | $0.01                | —               | 86%     |
| glm-5                                         | auriko         | —       | $1                  | $0.2                 | —               | 80%     |
| glm-5-turbo                                   | auriko         | —       | $1.2                | $0.24                | —               | 80%     |
| glm-5.1                                       | auriko         | —       | $1.4                | $0.26                | —               | 81%     |
| glm-5v-turbo                                  | auriko         | —       | $1.2                | $0.24                | —               | 80%     |
| gpt-4.1-2025-04-14                            | auriko         | —       | $2                  | $0.5                 | —               | 75%     |
| gpt-4.1-mini-2025-04-14                       | auriko         | —       | $0.4                | $0.1                 | —               | 75%     |
| gpt-4.1-nano-2025-04-14                       | auriko         | —       | $0.1                | $0.025               | —               | 75%     |
| gpt-4o-2024-08-06                             | auriko         | —       | $2.5                | $1.25                | —               | 50%     |
| gpt-4o-2024-11-20                             | auriko         | —       | $2.5                | $1.25                | —               | 50%     |
| gpt-4o-mini-2024-07-18                        | auriko         | —       | $0.15               | $0.075               | —               | 50%     |
| gpt-5-2025-08-07                              | auriko         | —       | $1.25               | $0.125               | —               | 90%     |
| gpt-5-chat-latest                             | auriko         | —       | $1.25               | $0.125               | —               | 90%     |
| gpt-5-mini-2025-08-07                         | auriko         | —       | $0.25               | $0.025               | —               | 90%     |
| gpt-5-nano-2025-08-07                         | auriko         | —       | $0.05               | $0.005               | —               | 90%     |
| gpt-5.1-2025-11-13                            | auriko         | —       | $1.25               | $0.125               | —               | 90%     |
| gpt-5.1-chat-latest                           | auriko         | —       | $1.25               | $0.125               | —               | 90%     |
| gpt-5.2-2025-12-11                            | auriko         | —       | $1.75               | $0.175               | —               | 90%     |
| gpt-5.2-chat-latest                           | auriko         | —       | $1.75               | $0.175               | —               | 90%     |
| gpt-5.3-chat-latest                           | auriko         | —       | $1.75               | $0.175               | —               | 90%     |
| gpt-5.4-2026-03-05                            | auriko         | —       | $2.5                | $0.25                | —               | 90%     |
| gpt-5.4-mini-2026-03-17                       | auriko         | —       | $0.75               | $0.075               | —               | 90%     |
| gpt-5.4-nano-2026-03-17                       | auriko         | —       | $0.2                | $0.02                | —               | 90%     |
| gpt-5.5-2026-04-23                            | auriko         | —       | $5                  | $0.5                 | —               | 90%     |
| gpt-oss-120b                                  | auriko         | —       | $0.15               | $0.01                | —               | 93%     |
| gpt-oss-20b                                   | auriko         | —       | $0.07               | $0.04                | —               | 43%     |
| grok-4.20-0309-non-reasoning                  | auriko         | —       | $1.25               | $0.2                 | —               | 84%     |
| grok-4.20-0309-reasoning                      | auriko         | —       | $1.25               | $0.2                 | —               | 84%     |
| grok-4.3                                      | auriko         | —       | $1.25               | $0.2                 | —               | 84%     |
| hy3-preview                                   | auriko         | —       | $0.066              | $0.029               | —               | 56%     |
| kimi-k2-0711-preview                          | auriko         | —       | $0.6                | $0.15                | —               | 75%     |
| kimi-k2-0905-preview                          | auriko         | —       | $0.6                | $0.15                | —               | 75%     |
| kimi-k2-thinking                              | auriko         | —       | $0.6                | $0.15                | —               | 75%     |
| kimi-k2-thinking-turbo                        | auriko         | —       | $1.15               | $0.15                | —               | 87%     |

> 📄 Showing first 200 of 1374 models. Use the [interactive catalog](https://i-need-token.github.io/ai-models/) to browse all.

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.

## Related Documentation

- [Model Selection Guide](model-selection.md) — cost optimization tips
- [Pricing Comparison](pricing-comparison.md) — side-by-side pricing across providers
- [Free AI Models](free-models.md) — 81 free models
- [Context Window Comparison](context-windows.md) — largest context windows
- [Open-Weight Models](open-weights.md) — 527 models you can run yourself
