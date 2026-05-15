# Moonshot AI (月之暗面)

## Overview

Moonshot AI (月之暗面) is a Chinese AI company that produces the Kimi series of foundation models. Their latest models include Kimi K2.6, K2, and the classic Moonshot V1 series. Available through the Kimi API Platform at [platform.moonshot.cn](https://platform.moonshot.cn).

## Data Sources

| Data             | Source                                             | Type                    |
| ---------------- | -------------------------------------------------- | ----------------------- |
| Model list       | `platform.moonshot.cn/docs/models.md`              | Mintlify `.md` endpoint |
| Model parameters | `platform.moonshot.cn/docs/api/models-overview.md` | Mintlify `.md` endpoint |
| K2.6 pricing     | `platform.moonshot.cn/docs/pricing/chat-k26.md`    | Mintlify `.md` endpoint |
| K2 pricing       | `platform.moonshot.cn/docs/pricing/chat-k2.md`     | Mintlify `.md` endpoint |
| V1 pricing       | `platform.moonshot.cn/docs/pricing/chat-v1.md`     | Mintlify `.md` endpoint |

## Model Families

### Kimi K2.6 (Latest)

| Model     | Context | Input (¥/Mtok) | Output (¥/Mtok) | Cache Read |
| --------- | ------- | -------------- | --------------- | ---------- |
| kimi-k2.6 | 256K    | ¥4             | ¥16             | ¥0.8       |

### Kimi K2 (Deprecated — retiring May 25, 2026)

| Model                  | Context | Input (¥/Mtok) | Output (¥/Mtok) | Cache Read |
| ---------------------- | ------- | -------------- | --------------- | ---------- |
| kimi-k2-0905-preview   | 256K    | ¥4             | ¥16             | ¥0.8       |
| kimi-k2-0711-preview   | 128K    | ¥4             | ¥16             | ¥0.8       |
| kimi-k2-turbo-preview  | 256K    | ¥8             | ¥58             | ¥0.8       |
| kimi-k2-thinking       | 256K    | ¥4             | ¥16             | ¥0.8       |
| kimi-k2-thinking-turbo | 256K    | ¥8             | ¥58             | ¥0.8       |

### Moonshot V1 (Deprecated)

| Model            | Context | Input (¥/Mtok) | Output (¥/Mtok) | Cache Read |
| ---------------- | ------- | -------------- | --------------- | ---------- |
| moonshot-v1-8k   | 8K      | ¥12            | ¥12             | ¥2.4       |
| moonshot-v1-32k  | 32K     | ¥24            | ¥24             | ¥4.8       |
| moonshot-v1-128k | 128K    | ¥60            | ¥60             | ¥12        |

### Vision Models

| Model                           | Context | Input (¥/Mtok) | Output (¥/Mtok) |
| ------------------------------- | ------- | -------------- | --------------- |
| moonshot-v1-8k-vision-preview   | 8K      | ¥2             | ¥10             |
| moonshot-v1-32k-vision-preview  | 32K     | ¥5             | ¥20             |
| moonshot-v1-128k-vision-preview | 128K    | ¥10            | ¥30             |

## Notes

- Moonshot AI docs use Mintlify with `.md` endpoints (append `.md` to any docs URL)
- The `llms.txt` file at `/docs/llms.txt` lists all available documentation pages
- All pricing is in CNY (Chinese Yuan)
- Kimi K2.6 supports thinking mode via `thinking` parameter
- Kimi K2 series is retiring on May 25, 2026 — marked as deprecated
- Moonshot V1 models are the original generation — marked as deprecated
- Moonshot V1 Vision models support image input but share the same pricing as text-only V1 models
- Cache pricing is available for K2.6, K2, and V1 models
- Turbo variants offer faster inference (60-100 tokens/sec) at higher cost
