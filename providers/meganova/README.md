# MegaNova

MegaNova is an AI inference platform and model producer. They offer their own Manta model series (Mini, Flash, Pro) — an adaptive routing system that selects the optimal model tier based on request complexity — plus 65+ third-party frontier models with per-token USD pricing. MegaNova also provides Nova OS for regulated enterprises.

## Data Sources

- **Pricing**: SSR HTML from meganova.ai/pricing (first-party data, extracted 2026-05-16)
- **Model IDs**: MegaNova pricing page + models page
- **Context lengths**: Cross-referenced with official provider documentation

## Notes

- MegaNova is a **model producer** — they created the Manta series (Mini, Flash, Pro).
- Manta models use adaptive routing: Mini → Flash → Pro based on request complexity.
- Manta models are free with daily quotas; paid fallback available after quota exhaustion.
- Pricing is per-token (USD per million tokens) for all third-party models.
- The pricing page is server-side rendered (Next.js RWP format).
- API requires authentication but pricing data is publicly accessible.
- Video models (Veo, Seedance) and audio models (TTS) are excluded — they use different pricing units.
- Embedding models are excluded from this catalog.
