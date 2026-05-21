# 常见问题

[English](../faq.md)

## 通用

### 什么是 AI Models Catalog？

AI Models Catalog 是一个结构化的 YAML 目录，收录了 95+ 个 AI 提供商的模型元数据。包括定价、上下文窗口、模态、能力等信息——所有数据均来自一手 API 和官方文档。

### 与其他模型目录有何不同？

- **仅使用一手数据** — 所有数据直接来自提供商 API 和官方文档，而非第三方聚合器
- **结构化 YAML** — 机器可读，支持 TypeScript 类型和 Zod 校验
- **全面的元数据** — 定价、上下文窗口、模态、能力、快照
- **编程访问** — npm 包、CDN、GitHub Action、CSV 导出
- **开源** — 社区驱动，自动化抓取

### 数据多久更新一次？

数据通过自动化 CI 工作流每周同步。提供商 API 在周一定时抓取，npm 包在新版本发布时自动发布。

## 访问与使用

### 如何获取数据？

有多种方式：

| 方式                                                     | 适用场景                   |
| -------------------------------------------------------- | -------------------------- |
| `npm install ai-models`                                  | TypeScript/JavaScript 项目 |
| `curl cdn.jsdelivr.net/npm/ai-models@latest/models.json` | 任何语言的快速访问         |
| GitHub Action                                            | CI/CD 流水线               |
| CSV 下载                                                 | Excel、数据分析            |
| Hugging Face 数据集                                      | ML 工作流                  |

详见[快速入门](quick-start.md)。

### 数据免费使用吗？

是的！目录数据采用 MIT 许可证发布，可在商业和非商业项目中无限制使用。

### 定价数据准确吗？

定价数据直接来自每个提供商的官方 API 和文档。但提供商可能在不通知的情况下更改定价。在做出关键定价决策时，请务必对照提供商自己的网站进行核实。

## 技术

### 为什么用 YAML 而不是 JSON？

YAML 支持注释，更适合手动编辑，并允许模型文件内的快照继承。数据会编译为 JSON 以供编程使用。

### 什么是快照继承？

在单个模型文件内，快照从父模型继承字段，只覆盖不同的部分。这使模型文件保持 DRY，无需跨模型继承。

### 如何校验 YAML 文件？

```bash
# 使用内置校验器
npx tsx scripts/validate.ts

# 使用 JSON Schema
npx ajv validate -s schema.json -d providers/openai/models/gpt-4o.yaml
```

### 可以在 CI/CD 流水线中使用吗？

可以！使用可复用的 GitHub Action：

```yaml
- uses: i-need-token/ai-models@v1
  with:
    format: json
    filter: "[?tool_call && open_weights]"
```

详见 [API 文档](api.md#github-action)。

## 贡献

### 如何添加新的提供商？

参见[贡献指南](https://github.com/i-need-token/ai-models/blob/main/CONTRIBUTING.md)的分步说明。简要步骤：

1. 创建 `providers/<id>/provider.yaml`
2. 创建 `providers/<id>/scrape.ts`，包含 `scrape()` 函数
3. 运行 `npx tsx scripts/validate.ts` 校验

### 如何报告数据错误？

提交[数据更新 issue](https://github.com/i-need-token/ai-models/issues/new?template=data_update.md)，注明提供商名称、模型 ID 和需要更正的内容。

### 不写代码也能贡献吗？

当然可以！你可以：

- ⭐ 给仓库加星，帮助更多人发现
- 📢 分享给你的网络
- 🐛 报告数据问题或 bug
- 📖 改进文档
- 🏷️ 建议添加新的提供商

---

更多问题？[提交 issue](https://github.com/i-need-token/ai-models/issues/new) 或发起[讨论](https://github.com/i-need-token/ai-models/discussions)。
