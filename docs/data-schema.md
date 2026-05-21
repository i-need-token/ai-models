**English** | [中文](./zh/data-schema.md)

# Data Schema Reference

Complete reference for the YAML data schema used in this catalog. All model data files conform to the TypeScript types in [`types/`](../types/) and are validated at runtime by Zod schemas in [`types/schemas.ts`](../types/schemas.ts).

## Model Schema

Every model is a single YAML file at `providers/<provider>/models/<model-id>.yaml`.

### Required Fields

| Field          | Type    | Description                              | Example                                    |
| -------------- | ------- | ---------------------------------------- | ------------------------------------------ |
| `id`           | string  | Stable model ID (no date suffix)         | `gpt-4o`, `claude-sonnet-4-5`              |
| `name`         | string  | Display name                             | `GPT-4o`, `Claude Sonnet 4.5`              |
| `family`       | string  | Model family (broad lineage)             | `gpt-4o`, `claude-sonnet`                  |
| `pricing`      | Pricing | Model pricing (see below)                | —                                          |
| `modalities`   | object  | Input/output modalities                  | `{ input: [text, image], output: [text] }` |
| `last_updated` | string  | Last data update (YYYY-MM-DD or YYYY-MM) | `2024-08-06`                               |

### Optional Fields

| Field               | Type    | Default | Description                      | Example                              |
| ------------------- | ------- | ------- | -------------------------------- | ------------------------------------ |
| `reasoning`         | boolean | `false` | Supports reasoning/thinking mode | `true`                               |
| `temperature`       | boolean | `true`  | Supports temperature parameter   | `false`                              |
| `tool_call`         | boolean | `false` | Supports tool/function calling   | `true`                               |
| `attachment`        | boolean | `false` | Supports file attachments        | `true`                               |
| `structured_output` | boolean | `false` | Supports structured/JSON output  | `true`                               |
| `open_weights`      | boolean | `false` | Open-weight model                | `true`                               |
| `deprecated`        | boolean | `false` | Deprecated but still accessible  | `true`                               |
| `limit`             | object  | —       | Token limits                     | `{ context: 128000, output: 16384 }` |
| `limit.context`     | number  | —       | Context window size (tokens)     | `128000`                             |
| `limit.output`      | number  | —       | Max output tokens                | `16384`                              |
| `knowledge`         | string  | —       | Training data cutoff             | `2023-10`                            |
| `release_date`      | string  | —       | Model release date               | `2024-05-13`                         |
| `snapshots`         | array   | —       | Dated model versions             | See below                            |

### Modality Types

| Modality | Description           |
| -------- | --------------------- |
| `text`   | Text input or output  |
| `image`  | Image input or output |
| `video`  | Video input           |
| `audio`  | Audio input or output |
| `pdf`    | PDF document input    |

## Pricing Schema

Pricing is a union of four types. Each model uses exactly one.

### TokenPricing (most common)

Per-million-token pricing. Currency defaults to USD, unit defaults to `per_mtok`.

```yaml
pricing:
  currency: USD # optional, defaults to USD
  unit: per_mtok # optional, defaults to per_mtok
  input: 2.5 # $/M input tokens
  output: 10 # $/M output tokens
  cache_write: 1.25 # optional, $/M cache write
  cache_read: 0.625 # optional, $/M cache read
```

**Advanced: Tiered pricing by context length**

```yaml
pricing:
  input:
    - up_to: 128000 # ≤ 128K context
      price: 2.5
    - price: 5.0 # > 128K context (no up_to = final tier)
  output: 10
```

**Advanced: Per-modality pricing**

```yaml
pricing:
  input:
    text: 1.25
    image: 2.5
    audio: 5.0
  output:
    text: 5.0
    audio: 10.0
```

### VideoPricing

Per-second pricing, optionally tiered by resolution.

```yaml
pricing:
  currency: USD
  unit: per_second
  price: 0.03 # fixed price per second
```

```yaml
pricing:
  unit: per_second
  price: # per-resolution pricing
    720p: 0.02
    1080p: 0.03
    4k: 0.05
```

### UnitPricing

Per-image or per-request pricing.

```yaml
pricing:
  unit: per_image
  price: 0.04
```

```yaml
pricing:
  unit: per_request
  price: 0.005
```

### FreePricing

No cost.

```yaml
pricing:
  unit: free
```

## Snapshot Schema

Snapshots represent dated versions of a model. They inherit all parent fields and only override what differs.

```yaml
id: gpt-4o
name: GPT-4o
# ... parent fields ...
snapshots:
  - id: gpt-4o-2024-08-06 # newest first
    last_updated: "2024-08-06"
  - id: gpt-4o-2024-05-13
    deprecated: true # this snapshot is deprecated
    last_updated: "2024-05-13"
```

A snapshot can override any optional field from the parent:

```yaml
snapshots:
  - id: gemini-2.0-flash-exp
    limit:
      context: 1048576 # different context window
      output: 8192
    pricing:
      unit: free # experimental = free
```

## Provider Schema

Each provider has a `provider.yaml` file at `providers/<id>/provider.yaml`.

| Field            | Type   | Required | Description                          | Example                            |
| ---------------- | ------ | -------- | ------------------------------------ | ---------------------------------- |
| `id`             | string | ✅       | Provider ID (matches directory name) | `openai`                           |
| `name`           | string | ✅       | Display name                         | `OpenAI`                           |
| `url`            | string | ✅       | Official website URL                 | `https://openai.com`               |
| `api_docs`       | string | ❌       | API documentation URL                | `https://platform.openai.com/docs` |
| `apis`           | object | ✅       | API endpoints keyed by format        | See below                          |
| `apis.openai`    | string | ❌       | OpenAI-compatible API endpoint       | `https://api.openai.com/v1`        |
| `apis.anthropic` | string | ❌       | Anthropic API endpoint               | —                                  |
| `apis.google`    | string | ❌       | Google AI API endpoint               | —                                  |
| `currency`       | string | ❌       | Default currency (USD/CNY/EUR)       | `USD`                              |

### API Formats

| Format      | Description                            | Used by           |
| ----------- | -------------------------------------- | ----------------- |
| `openai`    | OpenAI-compatible chat completions API | Most providers    |
| `anthropic` | Anthropic Messages API                 | Anthropic         |
| `google`    | Google Generative AI API               | Google, Vertex AI |

## Currency Reference

| Currency     | Code  | Used by                                      |
| ------------ | ----- | -------------------------------------------- |
| US Dollar    | `USD` | Most providers (default)                     |
| Chinese Yuan | `CNY` | Alibaba, 302.AI, AIHubMix, PPIO, etc.        |
| Euro         | `EUR` | Berget, CloudFerro, OVHcloud, Scaleway, etc. |

## Validation

All YAML files are validated against Zod schemas at runtime:

```bash
# Validate all model data
npx tsx scripts/validate.ts

# Validate a specific provider
npx tsx scripts/validate.ts openai
```

The validation uses `ModelSchema` from [`types/schemas.ts`](../types/schemas.ts), which mirrors the TypeScript types exactly. Any YAML file that doesn't conform to the schema will produce a validation error with the specific field path and issue.

## Related Documentation

- [Data Acquisition](data-acquisition.md) — how we acquire and update data
- [API & Programmatic Access](api.md) — npm, CDN, CSV access
- [Code Examples](code-examples.md) — practical code examples
- [Design Principles](lessons-learned.md) — lessons learned
- [FAQ](faq.md) — common questions
