**English** | [中文](./zh/audio-models.md)

# Audio AI Models — Speech, Voice, and Audio Understanding

Models with **audio input** (speech recognition, voice understanding) and **audio output** (text-to-speech, voice generation) capabilities. All data sourced from first-party APIs via the [AI Models Catalog](https://github.com/i-need-token/ai-models).

## Stats

| Metric              | Count |
| ------------------- | ----- |
| Audio input models  | 115   |
| Audio output models | 34    |
| Total audio models  | 133   |
| Providers           | 20    |
| With tool calling   | 69    |
| Free                | 8     |

## Audio Input Models (Speech/Voice Understanding)

Models that can process audio input — transcribe speech, analyze audio, understand voice commands:

| Model                           | Provider       | Context | Input $/1M | Output $/1M | Tool Call |
| ------------------------------- | -------------- | ------- | ---------- | ----------- | --------- |
| mistral-voxtral-mini            | amazon-bedrock | 125K    | $0.04      | $0.04       |           |
| voxtral-mini                    | mistral        | 125K    | $0.04      | $0.04       |           |
| gemini-2.0-flash-lite           | google         | 1024K   | $0.075     | $0.3        | ✅        |
| gemini-2-0-flash-lite           | google-vertex  | 1024K   | $0.075     | $0.3        | ✅        |
| microsoft-phi-4-mini-multimodal | microsoft      | 125K    | $0.08      | $0.32       | ✅        |
| gemini-2.0-flash                | google         | 1024K   | $0.1       | $0.4        | ✅        |
| gemini-2.5-flash-lite           | google         | 1024K   | $0.1       | $0.4        | ✅        |
| mistral-voxtral-small           | amazon-bedrock | 125K    | $0.1       | $0.3        |           |
| voxtral-small                   | mistral        | 125K    | $0.1       | $0.3        |           |
| amazon-nova-2.0-lite            | amazon         | 62K     | $0.15      | $1.25       | ✅        |
| gemini-2.5-flash                | google         | 1024K   | $0.15      | $3.5        | ✅        |
| gemini-2-0-flash                | google-vertex  | 1024K   | $0.15      | $0.6        | ✅        |
| voxtral-small-24b-2507          | scaleway       | 128K    | $0.15      | $0.35       |           |
| amazon-nova-2.0-omni            | amazon         | 62K     | $0.2       | $1.3        | ✅        |
| xiaomi--mimo-v2.5               | hpc-ai         | 1024K   | $0.4       | $2          | ✅        |

## Audio Output Models (Text-to-Speech / Voice Generation)

Models that can generate audio output — text-to-speech, voice synthesis:

| Model                  | Provider | Input $/1M | Output $/1M |
| ---------------------- | -------- | ---------- | ----------- |
| gpt-4o-audio           | openai   | $2.5       | $10         |
| gpt-4o-realtime        | openai   | $5         | $20         |
| step-audio-2           | stepfun  | $10        | $70         |
| stepaudio-2.5-realtime | stepfun  | $10        | $70         |
| o1-realtime            | openai   | $15        | $60         |
| step-1o-audio          | stepfun  | $25        | $60         |

## Free Audio Models

| Model                             | Provider | Audio In | Audio Out | Context |
| --------------------------------- | -------- | -------- | --------- | ------- |
| qwen--qwen3-omni-30b-a3b-instruct | novitaai | ✅       | ✅        | 64K     |
| qwen--qwen3-omni-30b-a3b-thinking | novitaai | ✅       |           | 64K     |
| gemma-3n-E2B-it                   | google   | ✅       |           | 128K    |
| gemma-3n-E4B-it                   | google   | ✅       |           | 128K    |
| step-audio-r1.1                   | stepfun  | ✅       | ✅        | 0       |

## Choosing an Audio Model

| Use Case            | Recommended               | Key Feature               |
| ------------------- | ------------------------- | ------------------------- |
| Voice assistants    | GPT-4o-audio              | Audio in/out + tool call  |
| Transcription       | Whisper, Gemini 2.5 Flash | Fast, cheap audio input   |
| Voice agents        | GPT-4o-realtime           | Real-time audio streaming |
| Text-to-speech      | OpenAI TTS, ElevenLabs    | Natural voice output      |
| Multilingual speech | Gemini 2.5 Pro            | 100+ languages            |

## Related Documentation

- [Multimodal Models](multimodal-models.md) — 1,519 models with image/audio/video
- [Vision Models](vision-models.md) — 1,487 models with image understanding
- [Chat Models](chat-models.md) — 2,350 models with tool calling
- [Tool Calling Models](tool-calling.md) — function calling capabilities
- [Free AI Models](free-models.md) — 81 models at zero cost

---

Data sourced from [AI Models Catalog](https://github.com/i-need-token/ai-models) — structured YAML with pricing, context windows, and capabilities for 4,587+ models across 95 providers.
