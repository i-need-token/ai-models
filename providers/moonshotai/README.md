# Moonshot AI (月之暗面)

## Overview

Moonshot AI (月之暗面) is a Chinese AI company that produces the Kimi series of foundation models. Their latest models include Kimi K2.6, K2.5, and the classic Moonshot V1 series. Available through the Kimi API Platform at [platform.kimi.com](https://platform.kimi.com).

## Data Sources

| Data             | Source                                       | Type          |
| ---------------- | -------------------------------------------- | ------------- |
| Model list       | `platform.kimi.com/docs/api/models-overview` | Mintlify docs |
| Model parameters | `platform.kimi.com/docs/api/models-overview` | Mintlify docs |
| K2.6 pricing     | `platform.kimi.com/docs/pricing/chat-k26`    | Mintlify docs |
| K2.5 pricing     | `platform.kimi.com/docs/pricing/chat-k25`    | Mintlify docs |
| K2 pricing       | `platform.kimi.com/docs/pricing/chat-k2`     | Mintlify docs |
| V1 pricing       | `platform.kimi.com/docs/pricing/chat-v1`     | Mintlify docs |

## Model Families

### Kimi K2.6 (Latest)

| Model          | Context | Input (¥/Mtok) | Output (¥/Mtok) | Cache Read |
| -------------- | ------- | -------------- | --------------- | ---------- |
| kimi-k2.6      | 256K    | ¥6.50          | ¥27.00          | ¥1.10      |
| kimi-k2.6-long | 256K    | ¥6.50          | ¥27.00          | ¥1.10      |

### Kimi K2.5

| Model     | Context | Input (¥/Mtok) | Output (¥/Mtok) | Cache Read |
| --------- | ------- | -------------- | --------------- | ---------- |
| kimi-k2.5 | 256K    | ¥4.00          | ¥21.00          | ¥0.70      |

### Kimi K2 (Deprecated — retiring May 25, 2026)

| Model                  | Context | Input (¥/Mtok) | Output (¥/Mtok) | Cache Read |
| ---------------------- | ------- | -------------- | --------------- | ---------- |
| kimi-k2-0905-preview   | 256K    | ¥4.00          | ¥16.00          | ¥1.00      |
| kimi-k2-0711-preview   | 128K    | ¥4.00          | ¥16.00          | ¥1.00      |
| kimi-k2-turbo-preview  | 256K    | ¥8.00          | ¥58.00          | ¥1.00      |
| kimi-k2-thinking       | 256K    | ¥4.00          | ¥16.00          | ¥1.00      |
| kimi-k2-thinking-turbo | 256K    | ¥8.00          | ¥58.00          | ¥1.00      |

### Kimi VL (Vision-Language)

| Model                | Context | Input (¥/Mtok) | Output (¥/Mtok) | Cache Read |
| -------------------- | ------- | -------------- | --------------- | ---------- |
| kimi-vl-a3b-thinking | 128K    | ¥4.00          | ¥16.00          | ¥0.80      |
| kimi-vl-a3b          | 128K    | ¥4.00          | ¥16.00          | ¥0.80      |

### Moonshot V1 (Deprecated)

| Model                           | Context | Input (¥/Mtok) | Output (¥/Mtok) |
| ------------------------------- | ------- | -------------- | --------------- |
| moonshot-v1-8k                  | 8K      | ¥2.00          | ¥10.00          |
| moonshot-v1-32k                 | 32K     | ¥5.00          | ¥20.00          |
| moonshot-v1-128k                | 128K    | ¥10.00         | ¥30.00          |
| moonshot-v1-8k-vision-preview   | 8K      | ¥2.00          | ¥10.00          |
| moonshot-v1-32k-vision-preview  | 32K     | ¥5.00          | ¥20.00          |
| moonshot-v1-128k-vision-preview | 128K    | ¥10.00         | ¥30.00          |

## Notes

- Moonshot AI docs use Mintlify with `.md` endpoints (append `.md` to any docs URL)
- The `llms.txt` file at `/docs/llms.txt` lists all available documentation pages
- All pricing is in CNY (Chinese Yuan)
- Kimi K2.6 supports thinking mode via `thinking` parameter
- Kimi K2 series is retiring on May 25, 2026 — marked as deprecated
- Moonshot V1 models are the original generation — marked as deprecated
- Moonshot V1 Vision models support image input with same pricing as text-only V1
- Moonshot V1 does not list cache_read pricing in docs — omitted
- Turbo variants offer faster inference (60-100 tokens/sec) at higher cost
