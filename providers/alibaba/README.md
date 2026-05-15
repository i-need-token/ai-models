# Alibaba Cloud (Bailian / 百炼)

## Data Sources

| Data                | Source                           | URL                                                                | Format              |
| ------------------- | -------------------------------- | ------------------------------------------------------------------ | ------------------- |
| Model list & limits | Models page                      | `https://help.aliyun.com/zh/model-studio/text-generation-model/`   | SSR (ICE framework) |
| Pricing             | Billing page                     | `https://help.aliyun.com/zh/model-studio/billing-for-model-studio` | SSR (ICE framework) |
| Release dates       | Models page (changelog sections) | Same as model list                                                 | SSR                 |

## Extraction Method

Both pages use Alibaba's ICE (React SSR) framework. The page HTML contains a `<script>` tag with `__ICE_PAGE_PROPS__` assignment holding a JSON object. The actual content is HTML embedded within this JSON structure:

```
__ICE_PAGE_PROPS__ = { "docDetailData": { "storeData": { "data": { "content": "<html-tables>" } } } };
```

### Models Page

The models page contains **12+ HTML tables** organized by model family:

- **Summary tables** (0, 4-11): List model IDs, names, and status — but lack "最大输出" (max output) column
- **Detailed tables** (1-3): Include context limits, output limits, and modality info

Models appearing in both table types get their output limits from the detailed table. Models only in summary tables receive family-based default output limits via `defaultOutputLimit()`.

### Billing Page

The billing page contains **70+ HTML tables** covering all model types (text, vision, audio, image generation, etc.). Key challenges:

1. **Sub-headers with rowspan/colspan**: Some tables split the "输出单价" column into "非思考模式" and "思考模式（思维链+回答）" sub-columns. The HTML uses `rowspan`/`colspan` attributes that our simple table parser doesn't handle, so we use hardcoded pricing for affected models.
2. **Thinking-only models**: Models like `qwen3-235b-a22b-thinking-2507` have "-" for non-thinking output price and the actual price in the thinking output column. The code falls back to the thinking output price when the non-thinking price is missing.
3. **Model ID aliases**: Some models have different IDs in the billing page vs. the models page (e.g., `qwen2.5-72b-instruct-1m` → `qwen2.5-72b-instruct`). These are handled via an alias mapping.

## Pricing Notes

- All prices are in **CNY** (Chinese Yuan) per million tokens
- The billing page shows prices with "元" suffix (e.g., "2元" = ¥2.00/M tokens)
- Some models have separate pricing for thinking mode vs. non-thinking mode
- Open-weight models (e.g., `qwen3-235b-a22b`) have the same pricing as API-served models
- Free tier quotas are listed in the billing page but not captured in our data

## Hardcoded Pricing

Three models require hardcoded pricing because the billing page table uses complex rowspan/colspan sub-headers that our table parser cannot handle:

| Model                           | Input (¥/M tokens) | Output (¥/M tokens) | Source                |
| ------------------------------- | ------------------ | ------------------- | --------------------- |
| `qwen3-235b-a22b-thinking-2507` | 2                  | 20                  | Billing page Table 64 |
| `qwen3-next-80b-a3b-thinking`   | 1                  | 8                   | Billing page Table 64 |
| `qwen3-30b-a3b-thinking-2507`   | 0.5                | 4                   | Billing page Table 64 |

These prices are sourced from the first-party billing page, not fabricated.

## Model Coverage

- **56 models** total (as of 2026-05)
- Text generation: qwen3.6, qwen3.5, qwen3, qwen2.5, qwen-long, qwen-plus, qwen-max, qwen-flash, qwen-turbo
- Code: qwen3-coder-plus, qwen3-coder-flash, qwen3-coder-next
- Translation: qwen-mt-plus, qwen-mt-turbo, qwen-mt-flash, qwen-mt-lite
- Open-weight: qwen3-235b-a22b, qwen3-30b-a3b, qwen3-32b, qwen2.5-72b, etc.
- Vision, audio, image, TTS, and embedding models are NOT included (not text-generation)
