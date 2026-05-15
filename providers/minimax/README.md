# MiniMax

## Overview

MiniMax is a Chinese AI company that produces its own foundation models across multiple modalities: text, speech, video, image, and music. Their models are available through the MiniMax Platform at [platform.minimaxi.com](https://platform.minimaxi.com).

## Data Sources

| Data             | Source                                                 | Type                    |
| ---------------- | ------------------------------------------------------ | ----------------------- |
| Model overview   | `platform.minimaxi.com/docs/guides/models-intro.md`    | Mintlify `.md` endpoint |
| Text model specs | `platform.minimaxi.com/docs/guides/text-generation.md` | Mintlify `.md` endpoint |
| Chat model specs | `platform.minimaxi.com/docs/guides/text-chat.md`       | Mintlify `.md` endpoint |
| Pricing          | `platform.minimaxi.com/docs/guides/pricing-paygo.md`   | Mintlify `.md` endpoint |

## Model Families

### Text Models

| Family                    | Models                               | Context |
| ------------------------- | ------------------------------------ | ------- |
| MiniMax M2.7              | MiniMax-M2.7, MiniMax-M2.7-highspeed | 204,800 |
| MiniMax M2.5              | MiniMax-M2.5, MiniMax-M2.5-highspeed | 204,800 |
| MiniMax M2-Her            | M2-her                               | 64,000  |
| MiniMax M2.1 (deprecated) | MiniMax-M2.1, MiniMax-M2.1-highspeed | 204,800 |
| MiniMax M2 (deprecated)   | MiniMax-M2                           | 204,800 |

### Speech Models

| Model            | Type           |
| ---------------- | -------------- |
| speech-2.8-hd    | HD quality     |
| speech-2.8-turbo | Fast inference |
| speech-2.6-hd    | HD quality     |
| speech-2.6-turbo | Fast inference |
| speech-02-hd     | HD quality     |
| speech-02-turbo  | Fast inference |

### Video Models (Hailuo)

| Model                   | Notes                  |
| ----------------------- | ---------------------- |
| MiniMax-Hailuo-2.3      | Latest generation      |
| MiniMax-Hailuo-2.3-Fast | Fast inference variant |
| MiniMax-Hailuo-02       | Previous generation    |

### Image Models

| Model         | Notes                     |
| ------------- | ------------------------- |
| image-01      | Standard image generation |
| image-01-live | Live image generation     |

### Music Models

| Model       | Notes                   |
| ----------- | ----------------------- |
| music-2.6   | Latest music generation |
| music-cover | Cover song generation   |

## Pricing

All prices are in **CNY** (Chinese Yuan).

### Text Models (per million tokens)

| Model                  | Input | Output | Cache Read | Cache Write |
| ---------------------- | ----- | ------ | ---------- | ----------- |
| MiniMax-M2.7           | ¥2.1  | ¥8.4   | ¥0.42      | ¥2.625      |
| MiniMax-M2.7-highspeed | ¥4.2  | ¥16.8  | ¥0.42      | ¥2.625      |
| MiniMax-M2.5           | ¥2.1  | ¥8.4   | ¥0.21      | ¥2.625      |
| MiniMax-M2.5-highspeed | ¥4.2  | ¥16.8  | ¥0.21      | ¥2.625      |
| M2-her                 | ¥2.1  | ¥8.4   | —          | —           |

### Non-text Models

| Type   | Pricing                                  |
| ------ | ---------------------------------------- |
| Speech | Per 10k characters (HD: ¥3.5, Turbo: ¥2) |
| Video  | Per video (¥0.6–¥2)                      |
| Image  | Per image (¥0.025)                       |
| Music  | Per song (¥1)                            |

## Notes

- MiniMax docs use Mintlify with `.md` endpoints (append `.md` to any docs URL)
- The `llms.txt` file at `/docs/llms.txt` lists all available documentation pages
- Pricing is in CNY; no USD pricing is available from first-party sources
- Text models support prompt caching (cache_read and cache_write pricing)
- "highspeed" variants offer faster inference at higher cost
- Speech models are priced per 10,000 characters, not per token
- Video pricing varies by resolution and duration; the lowest price is used as base
