[English](../data-schema.md) | **中文**

# 数据 Schema 参考

本目录使用的 YAML 数据 Schema 完整参考。所有模型数据文件遵循 [`types/`](../../types/) 中的 TypeScript 类型定义，并在运行时由 [`types/schemas.ts`](../../types/schemas.ts) 中的 Zod schema 校验。

## 模型 Schema

每个模型是 `providers/<provider>/models/<model-id>.yaml` 下的单个 YAML 文件。

### 必填字段

| 字段           | 类型    | 描述                                     | 示例                                       |
| -------------- | ------- | ---------------------------------------- | ------------------------------------------ |
| `id`           | string  | 稳定的模型 ID（无日期后缀）              | `gpt-4o`, `claude-sonnet-4-5`              |
| `name`         | string  | 显示名称                                 | `GPT-4o`, `Claude Sonnet 4.5`              |
| `family`       | string  | 模型家族（广泛谱系）                     | `gpt-4o`, `claude-sonnet`                  |
| `pricing`      | Pricing | 模型定价（见下文）                       | —                                          |
| `modalities`   | object  | 输入/输出模态                            | `{ input: [text, image], output: [text] }` |
| `last_updated` | string  | 最后数据更新日期 (YYYY-MM-DD 或 YYYY-MM) | `2024-08-06`                               |

### 可选字段

| 字段                | 类型    | 默认值  | 描述                     | 示例                                 |
| ------------------- | ------- | ------- | ------------------------ | ------------------------------------ |
| `reasoning`         | boolean | `false` | 支持推理/思考模式        | `true`                               |
| `temperature`       | boolean | `true`  | 支持 temperature 参数    | `false`                              |
| `tool_call`         | boolean | `false` | 支持工具/函数调用        | `true`                               |
| `attachment`        | boolean | `false` | 支持文件附件             | `true`                               |
| `structured_output` | boolean | `false` | 支持结构化/JSON 输出     | `true`                               |
| `open_weights`      | boolean | `false` | 开源权重模型             | `true`                               |
| `deprecated`        | boolean | `false` | 已弃用但仍可访问         | `true`                               |
| `limit`             | object  | —       | Token 限制               | `{ context: 128000, output: 16384 }` |
| `limit.context`     | number  | —       | 上下文窗口大小（tokens） | `128000`                             |
| `limit.output`      | number  | —       | 最大输出 tokens          | `16384`                              |
| `knowledge`         | string  | —       | 训练数据截止日期         | `2023-10`                            |
| `release_date`      | string  | —       | 模型发布日期             | `2024-05-13`                         |
| `snapshots`         | array   | —       | 带日期的模型版本         | 见下文                               |

### 模态类型

| 模态    | 描述           |
| ------- | -------------- |
| `text`  | 文本输入或输出 |
| `image` | 图像输入或输出 |
| `video` | 视频输入       |
| `audio` | 音频输入或输出 |
| `pdf`   | PDF 文档输入   |

## 定价 Schema

定价是四种类型的联合体。每个模型只使用一种。

### TokenPricing（最常见）

按百万 token 计费。货币默认 USD，单位默认 `per_mtok`。

```yaml
pricing:
  currency: USD # 可选，默认 USD
  unit: per_mtok # 可选，默认 per_mtok
  input: 2.5 # $/百万 输入 token
  output: 10 # $/百万 输出 token
  cache_write: 1.25 # 可选，$/百万 缓存写入
  cache_read: 0.625 # 可选，$/百万 缓存读取
```

**进阶：按上下文长度分层定价**

```yaml
pricing:
  input:
    - up_to: 128000 # ≤ 128K 上下文
      price: 2.5
    - price: 5.0 # > 128K 上下文（无 up_to = 最终层级）
  output: 10
```

**进阶：按模态定价**

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

按秒计费，可选按分辨率分层。

```yaml
pricing:
  currency: USD
  unit: per_second
  price: 0.03 # 固定每秒价格
```

```yaml
pricing:
  unit: per_second
  price: # 按分辨率定价
    720p: 0.02
    1080p: 0.03
    4k: 0.05
```

### UnitPricing

按图像或按请求计费。

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

免费。

```yaml
pricing:
  unit: free
```

## 快照 Schema

快照代表模型的带日期版本。它们继承父级的所有字段，只覆盖不同的部分。

```yaml
id: gpt-4o
name: GPT-4o
# ... 父级字段 ...
snapshots:
  - id: gpt-4o-2024-08-06 # 最新的在前
    last_updated: "2024-08-06"
  - id: gpt-4o-2024-05-13
    deprecated: true # 此快照已弃用
    last_updated: "2024-05-13"
```

快照可以覆盖父级的任何可选字段：

```yaml
snapshots:
  - id: gemini-2.0-flash-exp
    limit:
      context: 1048576 # 不同的上下文窗口
      output: 8192
    pricing:
      unit: free # 实验版 = 免费
```

## 提供商 Schema

每个提供商在 `providers/<id>/provider.yaml` 有一个 `provider.yaml` 文件。

| 字段             | 类型   | 必填 | 描述                      | 示例                               |
| ---------------- | ------ | ---- | ------------------------- | ---------------------------------- |
| `id`             | string | ✅   | 提供商 ID（与目录名匹配） | `openai`                           |
| `name`           | string | ✅   | 显示名称                  | `OpenAI`                           |
| `url`            | string | ✅   | 官方网站 URL              | `https://openai.com`               |
| `api_docs`       | string | ❌   | API 文档 URL              | `https://platform.openai.com/docs` |
| `apis`           | object | ✅   | 按格式分类的 API 端点     | 见下文                             |
| `apis.openai`    | string | ❌   | OpenAI 兼容 API 端点      | `https://api.openai.com/v1`        |
| `apis.anthropic` | string | ❌   | Anthropic API 端点        | —                                  |
| `apis.google`    | string | ❌   | Google AI API 端点        | —                                  |
| `currency`       | string | ❌   | 默认货币 (USD/CNY/EUR)    | `USD`                              |

### API 格式

| 格式        | 描述                               | 使用者            |
| ----------- | ---------------------------------- | ----------------- |
| `openai`    | OpenAI 兼容的 Chat Completions API | 大多数提供商      |
| `anthropic` | Anthropic Messages API             | Anthropic         |
| `google`    | Google Generative AI API           | Google, Vertex AI |

## 货币参考

| 货币   | 代码  | 使用者                                    |
| ------ | ----- | ----------------------------------------- |
| 美元   | `USD` | 大多数提供商（默认）                      |
| 人民币 | `CNY` | 阿里云、302.AI、AIHubMix、PPIO 等         |
| 欧元   | `EUR` | Berget、CloudFerro、OVHcloud、Scaleway 等 |

## 校验

所有 YAML 文件在运行时由 Zod schema 校验：

```bash
# 校验所有模型数据
npx tsx scripts/validate.ts

# 校验特定提供商
npx tsx scripts/validate.ts openai
```

校验使用 [`types/schemas.ts`](../../types/schemas.ts) 中的 `ModelSchema`，与 TypeScript 类型完全对应。任何不符合 schema 的 YAML 文件将产生校验错误，包含具体的字段路径和问题。

## 相关文档

- [数据获取](data-acquisition.md) — 如何获取和更新数据
- [API 与编程访问](api.md) — npm、CDN、CSV 访问
- [代码示例](code-examples.md) — 实用代码示例
- [设计原则](lessons-learned.md) — 经验教训
- [常见问题](faq.md) — 常见问题

---

数据来源于 [AI Models Catalog](https://github.com/i-need-token/ai-models) — 结构化 YAML，包含 95 个提供商 4,587+ 模型的定价、上下文窗口和能力信息。
