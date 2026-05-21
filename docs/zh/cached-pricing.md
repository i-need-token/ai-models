# 缓存定价

[English](../cached-pricing.md)

支持提示缓存的 AI 模型，展示标准定价与缓存定价对比。缓存输入可比标准输入 token **便宜 50-90%**。

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models)。

## 为什么缓存定价很重要

提示缓存允许你存储重复的提示前缀（系统提示、少样本示例、工具定义），并在多个请求中复用。这显著降低了：

- **成本**：输入 token 节省 50-90%
- **延迟**：缓存内容的首 token 时间更快
- **吞吐量**：更高效地利用速率限制

## 统计

| 指标               | 数量 |
| ------------------ | ---- |
| 支持缓存定价的模型 | 1374 |
| 提供商             | 39   |

## 提供商

`aihubmix`, `aion`, `amazon-bedrock`, `auriko`, `baidu`, `baseten`, `chutes`, `clarifai`, `cloudflare`, `cortecs`, `databricks`, `deepinfra`, `deepseek`, `digitalocean`, `fastrouter`, `friendli`, `google`, `google-vertex`, `groq`, `hpc-ai`, `inception`, `jiekou`, `llmgateway`, `martian`, `minimax`, `moonshotai`, `nanogpt`, `openai`, `openrouter`, `ppio`, `privatemode`, `requesty`, `siliconflow`, `stepfun`, `tencent-tokenhub`, `togetherai`, `upstage`, `venice`, `wafer`

## 模型定价

| 模型                                          | 提供商         | 上下文 | 输入 $/M            | 缓存读取 $/M         | 缓存写入 $/M | 节省  |
| --------------------------------------------- | -------------- | ------ | ------------------- | -------------------- | ------------ | ----- |
| aistudio_gemini-2.0-flash                     | aihubmix       | —      | $0.05               | $0.125               | —            | -150% |
| aistudio_gpt-4.1-mini                         | aihubmix       | —      | $0.2                | $0.05                | —            | 75%   |
| anthropic-opus-4-6                            | aihubmix       | —      | $2.5                | $0.25                | $3.125       | 90%   |
| claude-haiku-4-5                              | aihubmix       | —      | $0.55               | $0.055               | $0.6875      | 90%   |
| claude-sonnet-4-0                             | aihubmix       | —      | $1.65               | $0.165               | $2.0625      | 90%   |
| claude-sonnet-4-5                             | aihubmix       | —      | $1.65               | $0.165               | $2.0625      | 90%   |
| claude-sonnet-4-5-think                       | aihubmix       | —      | $1.65               | $0.165               | $2.0625      | 90%   |
| codex-mini-latest                             | aihubmix       | —      | $0.75               | $0.1875              | —            | 75%   |
| deepseek-v3.2                                 | aihubmix       | —      | $0.151              | $0.0151              | —            | 90%   |
| deepseek-v3.2-exp                             | aihubmix       | —      | $0.137              | $0.0137              | —            | 90%   |
| deepseek-v3.2-exp-think                       | aihubmix       | —      | $0.137              | $0.0137              | —            | 90%   |
| deepseek-v3.2-think                           | aihubmix       | —      | $0.151              | $0.0151              | —            | 90%   |
| doubao-1.5-lite-32k                           | aihubmix       | —      | $0.025              | $0.005               | —            | 80%   |
| doubao-1.5-pro-32k                            | aihubmix       | —      | $0.067              | $0.0134              | —            | 80%   |
| doubao-lite-32k                               | aihubmix       | —      | $0.03               | $0.006               | —            | 80%   |
| doubao-pro-32k                                | aihubmix       | —      | $0.07               | $0.014               | —            | 80%   |
| doubao-seed-1-6                               | aihubmix       | —      | $0.09               | $0.018               | —            | 80%   |
| doubao-seed-1-6-250615                        | aihubmix       | —      | $0.09               | $0.018               | —            | 80%   |
| doubao-seed-1-6-flash                         | aihubmix       | —      | $0.022              | $0.0044              | —            | 80%   |
| doubao-seed-1-6-flash-250615                  | aihubmix       | —      | $0.022              | $0.0044              | —            | 80%   |
| doubao-seed-1-6-lite                          | aihubmix       | —      | $0.041              | $0.0082              | —            | 80%   |
| doubao-seed-1-6-thinking                      | aihubmix       | —      | $0.09               | $0.018               | —            | 80%   |
| doubao-seed-1-6-thinking-250615               | aihubmix       | —      | $0.09               | $0.018               | —            | 80%   |
| doubao-seed-1-6-vision-250815                 | aihubmix       | —      | $0.054795           | $0.010959            | —            | 80%   |
| doubao-seed-1-8                               | aihubmix       | —      | $0.054795           | $0.010959            | —            | 80%   |
| gemini-2.0-flash                              | aihubmix       | —      | $0.05               | $0.0125              | —            | 75%   |
| gemini-2.0-flash-001                          | aihubmix       | —      | $0.05               | $0.125               | —            | -150% |
| gemini-2.0-flash-search                       | aihubmix       | —      | $0.05               | $0.0125              | —            | 75%   |
| gemini-2.5-flash                              | aihubmix       | —      | $0.15               | $0.015               | —            | 90%   |
| gemini-2.5-flash-lite                         | aihubmix       | —      | $0.05               | $0.005               | —            | 90%   |
| gemini-2.5-flash-lite-nothink                 | aihubmix       | —      | $0.05               | $0.005               | —            | 90%   |
| gemini-2.5-flash-lite-preview-09-2025         | aihubmix       | —      | $0.05               | $0.005               | —            | 90%   |
| gemini-2.5-flash-lite-preview-09-2025-nothink | aihubmix       | —      | $0.05               | $0.005               | —            | 90%   |
| gemini-2.5-flash-nothink                      | aihubmix       | —      | $0.15               | $0.015               | —            | 90%   |
| gemini-2.5-flash-preview-05-20-nothink        | aihubmix       | —      | $0.15               | $0.015               | —            | 90%   |
| gemini-2.5-flash-preview-05-20-search         | aihubmix       | —      | $0.15               | $0.015               | —            | 90%   |
| gemini-2.5-flash-preview-09-2025              | aihubmix       | —      | $0.15               | $0.015               | —            | 90%   |
| gemini-2.5-flash-search                       | aihubmix       | —      | $0.15               | $0.015               | —            | 90%   |
| gemini-2.5-pro                                | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gemini-2.5-pro-exp-03-25                      | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gemini-2.5-pro-preview-03-25                  | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gemini-2.5-pro-preview-03-25-search           | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gemini-2.5-pro-preview-05-06                  | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gemini-2.5-pro-preview-05-06-search           | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gemini-2.5-pro-preview-06-05                  | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gemini-2.5-pro-preview-06-05-search           | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gemini-2.5-pro-search                         | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| glm-4.5-airx                                  | aihubmix       | —      | $0.55               | $0.11                | —            | 80%   |
| glm-4.5-x                                     | aihubmix       | —      | $1.1                | $0.22                | —            | 80%   |
| glm-4.6                                       | aihubmix       | —      | $0.136987           | $0.027397            | —            | 80%   |
| glm-4.6v                                      | aihubmix       | —      | $0.0685             | $0.0137              | —            | 80%   |
| glm-4.7                                       | aihubmix       | —      | $0.136987           | $0.027397            | —            | 80%   |
| gpt-4.1                                       | aihubmix       | —      | $1                  | $0.25                | —            | 75%   |
| gpt-4.1-mini                                  | aihubmix       | —      | $0.2                | $0.05                | —            | 75%   |
| gpt-4.1-nano                                  | aihubmix       | —      | $0.05               | $0.0125              | —            | 75%   |
| gpt-4o                                        | aihubmix       | —      | $1.25               | $0.625               | —            | 50%   |
| gpt-4o-2024-08-06                             | aihubmix       | —      | $1.25               | $0.625               | —            | 50%   |
| gpt-4o-2024-08-06-global                      | aihubmix       | —      | $1.25               | $0.625               | —            | 50%   |
| gpt-4o-2024-11-20                             | aihubmix       | —      | $1.25               | $0.625               | —            | 50%   |
| gpt-4o-mini                                   | aihubmix       | —      | $0.075              | $0.0375              | —            | 50%   |
| gpt-4o-mini-2024-07-18                        | aihubmix       | —      | $0.075              | $0.0375              | —            | 50%   |
| gpt-4o-mini-global                            | aihubmix       | —      | $0.075              | $0.0375              | —            | 50%   |
| gpt-4o-mini-search-preview                    | aihubmix       | —      | $0.075              | $0.0375              | —            | 50%   |
| gpt-4o-search-preview                         | aihubmix       | —      | $1.25               | $0.625               | —            | 50%   |
| gpt-5                                         | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gpt-5-chat-latest                             | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gpt-5-codex                                   | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gpt-5-mini                                    | aihubmix       | —      | $0.125              | $0.0125              | —            | 90%   |
| gpt-5-nano                                    | aihubmix       | —      | $0.025              | $0.0025              | —            | 90%   |
| gpt-5.1                                       | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gpt-5.1-chat-latest                           | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gpt-5.1-codex                                 | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gpt-5.1-codex-max                             | aihubmix       | —      | $0.625              | $0.0625              | —            | 90%   |
| gpt-5.1-codex-mini                            | aihubmix       | —      | $0.125              | $0.0125              | —            | 90%   |
| gpt-5.2                                       | aihubmix       | —      | $0.875              | $0.0875              | —            | 90%   |
| gpt-5.2-chat-latest                           | aihubmix       | —      | $0.875              | $0.0875              | —            | 90%   |
| gpt-5.2-codex                                 | aihubmix       | —      | $0.875              | $0.0875              | —            | 90%   |
| gpt-5.2-high                                  | aihubmix       | —      | $0.875              | $0.0875              | —            | 90%   |
| gpt-5.2-low                                   | aihubmix       | —      | $0.875              | $0.0875              | —            | 90%   |
| gpt-5.2-pro                                   | aihubmix       | —      | $10.5               | $1.05                | —            | 90%   |
| grok-4                                        | aihubmix       | —      | $1.65               | $0.4125              | —            | 75%   |
| grok-4-1-fast-non-reasoning                   | aihubmix       | —      | $0.1                | $0.025               | —            | 75%   |
| grok-4-1-fast-reasoning                       | aihubmix       | —      | $0.1                | $0.025               | —            | 75%   |
| grok-4-fast-non-reasoning                     | aihubmix       | —      | $0.1                | $0.025               | —            | 75%   |
| grok-4-fast-reasoning                         | aihubmix       | —      | $0.1                | $0.025               | —            | 75%   |
| grok-4.20-beta-0309-non-reasoning             | aihubmix       | —      | $1                  | $0.1                 | —            | 90%   |
| grok-4.20-beta-0309-reasoning                 | aihubmix       | —      | $1                  | $0.1                 | —            | 90%   |
| grok-4.20-multi-agent-0309                    | aihubmix       | —      | $1                  | $0.1                 | —            | 90%   |
| grok-4.20-multi-agent-beta-0309               | aihubmix       | —      | $1                  | $0.1                 | —            | 90%   |
| grok-code-fast-1                              | aihubmix       | —      | $0.1                | $0.025               | —            | 75%   |
| kimi-k2-thinking                              | aihubmix       | —      | $0.274              | $0.0685              | —            | 75%   |
| kimi-k2-turbo-preview                         | aihubmix       | —      | $0.6                | $0.15                | —            | 75%   |
| kimi-k2.5                                     | aihubmix       | —      | $0.3                | $0.0525              | —            | 82%   |
| mimo-v2-flash                                 | aihubmix       | —      | $0.0959             | $0.01918             | —            | 80%   |
| mimo-v2-omni                                  | aihubmix       | —      | $0.22               | $0.044               | —            | 80%   |
| mimo-v2-pro                                   | aihubmix       | —      | $0.55               | $0.11                | —            | 80%   |
| nvidia-nemotron-3-super-120b-a12b             | aihubmix       | —      | $0.055              | $0.01375             | —            | 75%   |
| o1                                            | aihubmix       | —      | $7.5                | $3.75                | —            | 50%   |
| o1-2024-12-17                                 | aihubmix       | —      | $7.5                | $3.75                | —            | 50%   |
| o1-global                                     | aihubmix       | —      | $7.5                | $3.75                | —            | 50%   |
| o1-mini                                       | aihubmix       | —      | $1.5                | $0.75                | —            | 50%   |
| o1-mini-2024-09-12                            | aihubmix       | —      | $1.5                | $0.75                | —            | 50%   |
| o1-preview                                    | aihubmix       | —      | $7.5                | $3.75                | —            | 50%   |
| o1-preview-2024-09-12                         | aihubmix       | —      | $7.5                | $3.75                | —            | 50%   |
| o3                                            | aihubmix       | —      | $1                  | $0.25                | —            | 75%   |
| o3-deep-research                              | aihubmix       | —      | $5                  | $1.25                | —            | 75%   |
| o3-global                                     | aihubmix       | —      | $1                  | $0.25                | —            | 75%   |
| o3-mini                                       | aihubmix       | —      | $0.55               | $0.275               | —            | 50%   |
| o3-mini-global                                | aihubmix       | —      | $0.55               | $0.275               | —            | 50%   |
| o4-mini                                       | aihubmix       | —      | $0.55               | $0.1375              | —            | 75%   |
| qwen-plus                                     | aihubmix       | —      | $0.0563             | $0.01126             | $0.070375    | 80%   |
| qwen-plus-2025-04-28                          | aihubmix       | —      | $0.0563             | $0.01126             | $0.070375    | 80%   |
| qwen-plus-2025-07-28                          | aihubmix       | —      | $0.0563             | $0.01126             | $0.070375    | 80%   |
| qwen-plus-latest                              | aihubmix       | —      | $0.0563             | $0.01126             | $0.070375    | 80%   |
| qwen-turbo                                    | aihubmix       | —      | $0.023              | $0.0046              | —            | 80%   |
| qwen-turbo-latest                             | aihubmix       | —      | $0.023              | $0.0046              | —            | 80%   |
| qwen3-coder-plus                              | aihubmix       | —      | $0.27               | $0.054               | —            | 80%   |
| qwen3-max                                     | aihubmix       | —      | $0.2254             | $0.04508             | $0.28175     | 80%   |
| qwen3-max-2026-01-23                          | aihubmix       | —      | $0.2254             | $0.04508             | $0.28175     | 80%   |
| qwen3-max-preview                             | aihubmix       | —      | $0.423              | $0.0846              | —            | 80%   |
| qwen3-vl-flash                                | aihubmix       | —      | $0.0103             | $0.00206             | —            | 80%   |
| qwen3-vl-plus                                 | aihubmix       | —      | $0.0685             | $0.0137              | —            | 80%   |
| zai-glm-5-turbo                               | aihubmix       | —      | $0.6                | $0.12                | —            | 80%   |
| aion-2.0                                      | aion           | —      | $0.7999999999999999 | $0.19999999999999998 | —            | 75%   |
| aion-2.5                                      | aion           | —      | $1                  | $0.35                | —            | 65%   |
| amazon-nova-2-lite                            | amazon-bedrock | —      | $0.33               | $0.0825              | —            | 75%   |
| amazon-nova-lite                              | amazon-bedrock | —      | $0.06               | $0.015               | —            | 75%   |
| amazon-nova-micro                             | amazon-bedrock | —      | $0.035              | $0.00875             | —            | 75%   |
| amazon-nova-premier                           | amazon-bedrock | —      | $2.5                | $0.625               | —            | 75%   |
| amazon-nova-pro                               | amazon-bedrock | —      | $0.8                | $0.2                 | —            | 75%   |
| claude-haiku-4-5-20251001                     | auriko         | —      | $1                  | $0.1                 | $1.25        | 90%   |
| claude-opus-4-1-20250805                      | auriko         | —      | $15                 | $1.5                 | $18.75       | 90%   |
| claude-opus-4-20250514                        | auriko         | —      | $15                 | $1.5                 | $18.75       | 90%   |
| claude-opus-4-5-20251101                      | auriko         | —      | $5                  | $0.5                 | $6.25        | 90%   |
| claude-opus-4-6                               | auriko         | —      | $5                  | $0.5                 | $6.25        | 90%   |
| claude-opus-4-7                               | auriko         | —      | $5                  | $0.5                 | $6.25        | 90%   |
| claude-sonnet-4-20250514                      | auriko         | —      | $3                  | $0.3                 | $3.75        | 90%   |
| claude-sonnet-4-5-20250929                    | auriko         | —      | $3                  | $0.3                 | $3.75        | 90%   |
| claude-sonnet-4-6                             | auriko         | —      | $3                  | $0.3                 | $3.75        | 90%   |
| deepseek-r1-0528                              | auriko         | —      | $0.5                | $0.35                | —            | 30%   |
| deepseek-v3-0324                              | auriko         | —      | $0.2                | $0.135               | —            | 32%   |
| deepseek-v3.1                                 | auriko         | —      | $0.21               | $0.13                | —            | 38%   |
| deepseek-v3.1-terminus                        | auriko         | —      | $0.27               | $0.13                | —            | 52%   |
| deepseek-v3.2                                 | auriko         | —      | $0.26               | $0.13                | —            | 50%   |
| deepseek-v4-flash                             | auriko         | —      | $0.14               | $0.0028              | —            | 98%   |
| deepseek-v4-pro                               | auriko         | —      | $0.435              | $0.003625            | —            | 99%   |
| gemini-2.5-flash                              | auriko         | —      | $0.3                | $0.03                | —            | 90%   |
| gemini-2.5-flash-lite                         | auriko         | —      | $0.1                | $0.01                | —            | 90%   |
| gemini-2.5-pro                                | auriko         | —      | $1.25               | $0.125               | —            | 90%   |
| gemini-3-flash-preview                        | auriko         | —      | $0.5                | $0.05                | —            | 90%   |
| gemini-3.1-flash-lite                         | auriko         | —      | $0.25               | $0.025               | —            | 90%   |
| gemini-3.1-flash-lite-preview                 | auriko         | —      | $0.25               | $0.025               | —            | 90%   |
| gemini-3.1-pro-preview                        | auriko         | —      | $2                  | $0.2                 | —            | 90%   |
| gemini-3.1-pro-preview-customtools            | auriko         | —      | $2                  | $0.2                 | —            | 90%   |
| gemini-flash-latest                           | auriko         | —      | $0.5                | $0.05                | —            | 90%   |
| gemini-flash-lite-latest                      | auriko         | —      | $0.1                | $0.01                | —            | 90%   |
| gemini-pro-latest                             | auriko         | —      | $2                  | $0.2                 | —            | 90%   |
| glm-4.5                                       | auriko         | —      | $0.6                | $0.11                | —            | 82%   |
| glm-4.5-air                                   | auriko         | —      | $0.2                | $0.03                | —            | 85%   |
| glm-4.5-airx                                  | auriko         | —      | $1.1                | $0.22                | —            | 80%   |
| glm-4.5-x                                     | auriko         | —      | $2.2                | $0.45                | —            | 80%   |
| glm-4.5v                                      | auriko         | —      | $0.6                | $0.11                | —            | 82%   |
| glm-4.6                                       | auriko         | —      | $0.6                | $0.11                | —            | 82%   |
| glm-4.6v                                      | auriko         | —      | $0.3                | $0.05                | —            | 83%   |
| glm-4.6v-flashx                               | auriko         | —      | $0.04               | $0.004               | —            | 90%   |
| glm-4.7                                       | auriko         | —      | $0.6                | $0.11                | —            | 82%   |
| glm-4.7-flashx                                | auriko         | —      | $0.07               | $0.01                | —            | 86%   |
| glm-5                                         | auriko         | —      | $1                  | $0.2                 | —            | 80%   |
| glm-5-turbo                                   | auriko         | —      | $1.2                | $0.24                | —            | 80%   |
| glm-5.1                                       | auriko         | —      | $1.4                | $0.26                | —            | 81%   |
| glm-5v-turbo                                  | auriko         | —      | $1.2                | $0.24                | —            | 80%   |
| gpt-4.1-2025-04-14                            | auriko         | —      | $2                  | $0.5                 | —            | 75%   |
| gpt-4.1-mini-2025-04-14                       | auriko         | —      | $0.4                | $0.1                 | —            | 75%   |
| gpt-4.1-nano-2025-04-14                       | auriko         | —      | $0.1                | $0.025               | —            | 75%   |
| gpt-4o-2024-08-06                             | auriko         | —      | $2.5                | $1.25                | —            | 50%   |
| gpt-4o-2024-11-20                             | auriko         | —      | $2.5                | $1.25                | —            | 50%   |
| gpt-4o-mini-2024-07-18                        | auriko         | —      | $0.15               | $0.075               | —            | 50%   |
| gpt-5-2025-08-07                              | auriko         | —      | $1.25               | $0.125               | —            | 90%   |
| gpt-5-chat-latest                             | auriko         | —      | $1.25               | $0.125               | —            | 90%   |
| gpt-5-mini-2025-08-07                         | auriko         | —      | $0.25               | $0.025               | —            | 90%   |
| gpt-5-nano-2025-08-07                         | auriko         | —      | $0.05               | $0.005               | —            | 90%   |
| gpt-5.1-2025-11-13                            | auriko         | —      | $1.25               | $0.125               | —            | 90%   |
| gpt-5.1-chat-latest                           | auriko         | —      | $1.25               | $0.125               | —            | 90%   |
| gpt-5.2-2025-12-11                            | auriko         | —      | $1.75               | $0.175               | —            | 90%   |
| gpt-5.2-chat-latest                           | auriko         | —      | $1.75               | $0.175               | —            | 90%   |
| gpt-5.3-chat-latest                           | auriko         | —      | $1.75               | $0.175               | —            | 90%   |
| gpt-5.4-2026-03-05                            | auriko         | —      | $2.5                | $0.25                | —            | 90%   |
| gpt-5.4-mini-2026-03-17                       | auriko         | —      | $0.75               | $0.075               | —            | 90%   |
| gpt-5.4-nano-2026-03-17                       | auriko         | —      | $0.2                | $0.02                | —            | 90%   |
| gpt-5.5-2026-04-23                            | auriko         | —      | $5                  | $0.5                 | —            | 90%   |
| gpt-oss-120b                                  | auriko         | —      | $0.15               | $0.01                | —            | 93%   |
| gpt-oss-20b                                   | auriko         | —      | $0.07               | $0.04                | —            | 43%   |
| grok-4.20-0309-non-reasoning                  | auriko         | —      | $1.25               | $0.2                 | —            | 84%   |
| grok-4.20-0309-reasoning                      | auriko         | —      | $1.25               | $0.2                 | —            | 84%   |
| grok-4.3                                      | auriko         | —      | $1.25               | $0.2                 | —            | 84%   |
| hy3-preview                                   | auriko         | —      | $0.066              | $0.029               | —            | 56%   |
| kimi-k2-0711-preview                          | auriko         | —      | $0.6                | $0.15                | —            | 75%   |
| kimi-k2-0905-preview                          | auriko         | —      | $0.6                | $0.15                | —            | 75%   |
| kimi-k2-thinking                              | auriko         | —      | $0.6                | $0.15                | —            | 75%   |
| kimi-k2-thinking-turbo                        | auriko         | —      | $1.15               | $0.15                | —            | 87%   |

> 📄 显示前 200 个，共 1374 个模型。使用[交互式目录](https://i-need-token.github.io/ai-models/)浏览全部。

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。

## 相关文档

- [模型选择指南](model-selection.md) — 成本优化技巧
- [定价对比](pricing-comparison.md) — 各提供商定价并排对比
- [免费 AI 模型](free-models.md) — 81 个免费模型
- [上下文窗口对比](context-windows.md) — 最大上下文窗口
- [开源权重模型](open-weights.md) — 527 个可自行运行的模型
