# StepFun (阶跃星辰)

## Overview

StepFun (阶跃星辰) is a Chinese AI company that produces its own foundation models across multiple modalities: text, reasoning, vision, audio (TTS/ASR/realtime), and image generation. Their models are available through the StepFun Platform at [platform.stepfun.com](https://platform.stepfun.com).

## Data Sources

| Data             | Source                                                    | Type                    |
| ---------------- | --------------------------------------------------------- | ----------------------- |
| Model overview   | `platform.stepfun.com/docs/zh/guides/models/overview.md`  | Mintlify `.md` endpoint |
| Text models      | `platform.stepfun.com/docs/zh/guides/models/text.md`      | Mintlify `.md` endpoint |
| Reasoning models | `platform.stepfun.com/docs/zh/guides/models/reasoning.md` | Mintlify `.md` endpoint |
| Vision models    | `platform.stepfun.com/docs/zh/guides/models/vision.md`    | Mintlify `.md` endpoint |
| Audio models     | `platform.stepfun.com/docs/zh/guides/models/audio.md`     | Mintlify `.md` endpoint |
| Realtime models  | `platform.stepfun.com/docs/zh/guides/models/realtime.md`  | Mintlify `.md` endpoint |
| Image models     | `platform.stepfun.com/docs/zh/guides/models/image.md`     | Mintlify `.md` endpoint |
| Pricing          | `platform.stepfun.com/docs/zh/guides/pricing/details.md`  | Mintlify `.md` endpoint |

## Model Families

### Text Models

| Model          | Context | Input (¥/Mtok) | Output (¥/Mtok) |
| -------------- | ------- | -------------- | --------------- |
| step-2-mini    | 32K     | ¥1             | ¥2              |
| step-2-16k     | 16K     | ¥38            | ¥120            |
| step-2-16k-exp | 16K     | ¥38            | ¥120            |
| step-1-8k      | 8K      | ¥5             | ¥20             |
| step-1-32k     | 32K     | ¥15            | ¥70             |

### Reasoning Models

| Model               | Context | Input (¥/Mtok) | Output (¥/Mtok) |
| ------------------- | ------- | -------------- | --------------- |
| step-3.5-flash      | 256K    | ¥0.7           | ¥2.1            |
| step-3.5-flash-2603 | 256K    | ¥0.7           | ¥2.1            |
| step-3              | 64K     | ¥1.5           | ¥4              |
| step-r1-v-mini      | 100K    | ¥2.5           | ¥8              |

### Vision Models

| Model                | Context | Input (¥/Mtok) | Output (¥/Mtok) |
| -------------------- | ------- | -------------- | --------------- |
| step-1o-turbo-vision | 32K     | ¥2.5           | ¥8              |
| step-1o-vision-32k   | 32K     | ¥15            | ¥70             |
| step-1v-8k           | 8K      | ¥5             | ¥20             |
| step-1v-32k          | 32K     | ¥15            | ¥70             |

### Audio Models

| Model                  | Type                     | Pricing             |
| ---------------------- | ------------------------ | ------------------- |
| stepaudio-2.5-realtime | Realtime voice           | ¥10/¥70 per Mtok    |
| stepaudio-2.5-chat     | Voice chat (text output) | ¥10/¥25 per Mtok    |
| step-1o-audio          | Realtime voice (stable)  | ¥25/¥60 per Mtok    |
| step-audio-2           | Realtime voice           | ¥10/¥70 per Mtok    |
| step-audio-r1.1        | Reasoning audio          | Free (limited time) |

### TTS Models

| Model             | Pricing     |
| ----------------- | ----------- |
| stepaudio-2.5-tts | ¥5.8/万字符 |
| step-tts-2        | ¥2.8/万字符 |
| step-tts-mini     | ¥0.9/万字符 |

### ASR Models

| Model               | Pricing    |
| ------------------- | ---------- |
| stepaudio-2.5-asr   | ¥0.15/小时 |
| stepaudio-2-asr-pro | ¥2/小时    |
| step-asr            | ¥0.9/小时  |
| step-asr-1.1        | ¥2.2/小时  |
| step-asr-1.1-stream | ¥2.6/小时  |

### Image Models

| Model             | Pricing             |
| ----------------- | ------------------- |
| step-image-edit-2 | ¥0.02/image         |
| step-2x-large     | Free (limited time) |
| step-1x-medium    | ¥0.1/image          |
| step-1x-edit      | Free (limited time) |

### Model Lab (Experimental)

| Model    | Pricing |
| -------- | ------- |
| step-gui | Free    |

## Notes

- StepFun docs use Mintlify with `.md` endpoints (append `.md` to any docs URL)
- The `llms.txt` file at `/docs/llms.txt` lists all available documentation pages
- All pricing is in CNY (Chinese Yuan)
- Text/vision/audio-token models support prompt caching (cache_read pricing)
- `step-2-16k-exp` is an experimental version, not recommended for production
- `step-3.5-flash-2603` is an Agent-optimized variant of `step-3.5-flash`
- `step-3` has tiered pricing based on input/output token count
- `step-router-v1` is excluded as it routes to other models (deepseek-v4-pro / step-3.5-flash)
- ASR pricing converted to per-second for consistency with pricing schema
