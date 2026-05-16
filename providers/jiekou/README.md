# 接口 AI (Jiekou)

接口 AI is a Chinese inference platform providing per-token CNY pricing for 70+ frontier models from Anthropic, OpenAI, Google, DeepSeek, xAI, MoonshotAI, Alibaba, ZhipuAI, MiniMax, Bytedance, Baidu, Meta, Mistral, and Xiaomi. All models include cache_read pricing (CNY per million tokens).

## Data Sources

- **Pricing**: SSR HTML from jiekou.ai pricing page (first-party data, extracted 2026-05-16)
  - Data extracted from RWP (React Web Protocol) serialized payloads in `<script>` tags
  - Fields: `input_token_price_per_m_toString`, `output_token_price_per_m_toString`, `cache_read_input_token_price_per_m`
  - Raw values are in 0.0001 CNY units; `toString` values are in CNY per M tokens
- **Context lengths**: From Jiekou's pricing data (`context_size` field)
- **Model IDs**: Jiekou's `linkPath` field (format: `provider-model-name`)

## Notes

- 接口 AI is an **inference platform** — they host others' models, not their own.
- Pricing is per-token (CNY per million tokens) for all models.
- ALL models include cache_read pricing — this is extremely rare in our catalog.
- "-dd" suffix variants represent "dedicated deployment" with guaranteed availability at higher pricing.
- The pricing page is server-side rendered (Next.js RWP format).
- API requires authentication but pricing data is publicly accessible.
- Some pricing may differ from official provider pricing due to Jiekou's own service tiers.
- Models with suspiciously inconsistent pricing have been excluded (see scrape.ts for details).
