# Frequently Asked Questions

[中文](zh/faq.md)

## General

### What is AI Models Catalog?

AI Models Catalog is a structured YAML catalog of AI model metadata from 95+ providers. It includes pricing, context windows, modalities, capabilities, and more — all sourced from first-party APIs and official documentation.

### How is this different from other model directories?

- **First-party data only** — all data comes directly from provider APIs and official docs, not third-party aggregators
- **Structured YAML** — machine-readable with TypeScript types and Zod validation
- **Comprehensive metadata** — pricing, context windows, modalities, capabilities, snapshots
- **Programmatic access** — npm package, CDN, GitHub Action, CSV export
- **Open source** — community-driven with automated scraping

### How often is the data updated?

Data is synced weekly via automated CI workflows. Provider APIs are scraped on a Monday cron schedule, and the npm package is automatically published when new releases are created.

## Access & Usage

### How do I get the data?

There are several ways:

| Method                                                   | Use Case                       |
| -------------------------------------------------------- | ------------------------------ |
| `npm install ai-models`                                  | TypeScript/JavaScript projects |
| `curl cdn.jsdelivr.net/npm/ai-models@latest/models.json` | Quick access from any language |
| GitHub Action                                            | CI/CD pipelines                |
| CSV download                                             | Excel, data analysis           |
| Hugging Face dataset                                     | ML workflows                   |

See [Quick Start](quick-start.md) for detailed instructions.

### Is the data free to use?

Yes! The catalog data is released under the MIT License. You can use it in commercial and non-commercial projects without restriction.

### How accurate is the pricing data?

Pricing data is sourced directly from each provider's official API and documentation. However, providers may change pricing without notice. Always verify critical pricing decisions against the provider's own website.

## Technical

### Why YAML instead of JSON?

YAML supports comments, is more human-readable for manual editing, and allows snapshot inheritance within a model file. The data is compiled to JSON for programmatic consumption.

### What is snapshot inheritance?

Within a single model file, snapshots inherit fields from their parent model and only override what differs. This keeps model files DRY without cross-model inheritance.

### How do I validate my YAML files?

```bash
# Using the built-in validator
npx tsx scripts/validate.ts

# Using the JSON Schema
npx ajv validate -s schema.json -d providers/openai/models/gpt-4o.yaml
```

### Can I use this in my CI/CD pipeline?

Yes! Use the reusable GitHub Action:

```yaml
- uses: i-need-token/ai-models@v1
  with:
    format: json
    filter: "[?tool_call && open_weights]"
```

See [API Documentation](api.md#github-action) for details.

## Contributing

### How do I add a new provider?

See [Contributing Guide](https://github.com/i-need-token/ai-models/blob/main/CONTRIBUTING.md) for step-by-step instructions. In short:

1. Create `providers/<id>/provider.yaml`
2. Create `providers/<id>/scrape.ts` with a `scrape()` function
3. Run `npx tsx scripts/validate.ts` to verify

### How do I report incorrect data?

Open a [Data Update issue](https://github.com/i-need-token/ai-models/issues/new?template=data_update.md) with the provider name, model ID, and what needs correcting.

### Can I help without writing code?

Absolutely! You can:

- ⭐ Star the repo to help others discover it
- 📢 Share it with your network
- 🐛 Report data issues or bugs
- 📖 Improve documentation
- 🏷️ Suggest new providers to add

---

More questions? [Open an issue](https://github.com/i-need-token/ai-models/issues/new) or start a [discussion](https://github.com/i-need-token/ai-models/discussions).
