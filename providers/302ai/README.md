# 302.AI

302.AI is a Chinese AI platform providing per-token USD pricing for 260+ frontier models from OpenAI, Anthropic, Google, DeepSeek, xAI, Alibaba, ZhipuAI, MiniMax, Bytedance, Baidu, Meta, Mistral, MoonshotAI, Tencent, Baichuan, SenseTime, Perplexity, Microsoft, and others.

## Data Sources

- **Pricing**: https://302.ai/product/list?cate=api&tag=语言大模型 (CSR-rendered page, browser-scraped first-party data, extracted 2026-05-16)
  - Data extracted by navigating each brand sub-page and parsing model cards with per-token pricing
  - All prices are USD per million tokens
- **Context lengths**: Cross-referenced with official provider documentation and existing catalog entries
- **Model IDs**: 302.AI model card identifiers

## Notes

- 302.AI is an **inference platform** — they host others' models, not their own.
- Pricing is per-token (USD per million tokens) for all models.
- The pricing page is CSR-rendered (Nuxt.js) and requires browser-based extraction.
- API requires authentication but pricing data is publicly accessible on the website.
- Some pricing may differ from official provider pricing due to 302.AI's own service tiers.
- DeepSeek models with "-aliyun", "-baidu", "-huoshan" suffixes represent different hosting regions in China.
- "-thinking" suffix variants support extended reasoning / chain-of-thought.
- Gemini "-search" and "-deepsearch" suffixes represent search-augmented variants with higher pricing.
