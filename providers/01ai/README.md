# 01.AI

## Overview

01.AI (零一万物) is a Chinese AI company founded by Kai-Fu Lee that produces the Yi series of large language models.

## Data Sources

- **Model details & pricing**: https://platform.lingyiwanwu.com/docs (RSC page, extracted from Next.js RSC payload)
- **API endpoint**: https://api.lingyiwanwu.com/v1 (OpenAI-compatible, requires auth)

## Notes

- Current API models use **smart routing** — they automatically select the best backend model (e.g., DeepSeek-V3, Qwen3-30B-A3B, Yi-Lightning) based on user input.
- Pricing is in CNY per million tokens with the **same rate for input and output** tokens.
- Converted to USD at ~7.2 CNY/USD.
- The platform also offers yi-mixed (video mixing) and yi-mixed-docs (API docs) but these are not LLM models.
