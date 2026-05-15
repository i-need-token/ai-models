# Zhipu AI (智谱)

## Data Sources

| Data                | Source              | URL                                                         | Format                                |
| ------------------- | ------------------- | ----------------------------------------------------------- | ------------------------------------- |
| Model list & limits | Model overview page | `https://docs.bigmodel.cn/cn/guide/start/model-overview.md` | Markdown (Mintlify `.md` endpoint)    |
| Pricing             | Pricing page        | `https://open.bigmodel.cn/pricing`                          | CSR (hardcoded from first-party data) |

## Extraction Method

### Model Discovery

The model overview page is hosted on Mintlify and supports a `.md` endpoint that returns clean Markdown with structured tables. Each table contains model names (as Markdown links), context limits, and output limits.

The page organizes models into sections:

- **文本模型** (Text models): Flagship, high-intelligence, cost-effective, long-context, high-speed/low-cost
- **视觉理解** (Vision models): Flagship, cost-effective, free
- **其他** (Other): OCR, AutoGLM

Tables are parsed by detecting `|`-delimited rows and extracting model names from Markdown link syntax `[GLM-5.1](/cn/guide/models/text/glm-5.1)`.

### Pricing

The pricing page (`open.bigmodel.cn/pricing`) is a Mintlify CSR page with no accessible SSR data or API endpoint. Pricing data is hardcoded from first-party data accessed via browser automation on 2026-05-15.

Key pricing notes:

- All prices are in **CNY** (Chinese Yuan) per million tokens
- Some models have **tiered pricing** based on input length (e.g., [0, 32K), [32K, 128K)). We use the base tier.
- Free models have `unit: free` pricing
- GLM-4-AirX has a high price (¥10/M tokens) for 8K context
- GLM-4-Plus and GLM-4-Assistant have flat pricing (same input/output rate)

### Model ID Convention

Display names like "GLM-5.1" are converted to lowercase API model IDs like "glm-5.1". The mapping is straightforward: lowercase + replace spaces with hyphens.

## Model Coverage

- **20 models** total (as of 2026-05)
- Text generation: GLM-5.1, GLM-5, GLM-5-Turbo, GLM-4.7, GLM-4.6, GLM-4.5-Air, GLM-4.5-AirX, GLM-4-Long, GLM-4-Plus, GLM-4-Air, GLM-4-AirX, GLM-4-Assistant, GLM-4-FlashX, GLM-4-Flash
- Vision: GLM-5V-Turbo, GLM-4.6V, GLM-4.1V-Thinking
- Free: GLM-4.7-Flash, GLM-4.5-Flash, GLM-4-Flash, GLM-4.6V-Flash, GLM-4V-Flash, GLM-OCR, AutoGLM-Phone
- Not included: Image generation (CogView), video generation (CogVideoX), audio, embedding models
