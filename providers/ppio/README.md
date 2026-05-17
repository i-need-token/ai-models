# PPIO (派欧云)

Chinese cloud AI inference platform offering per-token CNY pricing for models from multiple providers.

## Data Source

- Pricing page: https://ppio.com/pricing (browser-scraped SSR HTML)

## Pricing

All prices are in CNY (￥) per million tokens.

## Notes

- PPIO hosts models from DeepSeek, Qwen, GLM (ZhipuAI), MiniMax, Baidu, Kimi (MoonshotAI), MiMo (Xiaomi), and others
- 60 LLM models with per-token or free pricing included
- ~13 models with tiered pricing (阶梯计费) excluded — pricing varies by usage volume
- Some models include cache_read and cache_write pricing
- API is OpenAI-compatible at https://api.ppinfra.com/v1
- Model IDs use `--` instead of `/` to avoid filesystem issues
