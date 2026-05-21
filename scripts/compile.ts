import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { ModelSchema } from "../types/schemas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

interface CompiledModel {
  id: string;
  name: string;
  family?: string;
  provider: string;
  reasoning?: boolean | undefined;
  tool_call?: boolean | undefined;
  structured_output?: boolean | undefined;
  open_weights?: boolean | undefined;
  deprecated?: boolean | undefined;
  pricing?: Record<string, unknown> | undefined;
  limit?: Record<string, unknown> | undefined;
  modalities?: Record<string, unknown> | undefined;
  release_date?: string | undefined;
  last_updated?: string | undefined;
}

interface CompiledCatalog {
  generated_at: string;
  stats: {
    providers: number;
    models: number;
    unique_model_ids: number;
    families: number;
  };
  providers: Record<string, { name: string; model_count: number }>;
  models: CompiledModel[];
}

function compile(): CompiledCatalog {
  const providersDir = path.join(PROJECT_ROOT, "providers");
  const providerDirs = fs
    .readdirSync(providersDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => fs.existsSync(path.join(providersDir, name, "models")));

  const models: CompiledModel[] = [];
  const providers: Record<string, { name: string; model_count: number }> = {};
  const uniqueIds = new Set<string>();
  const families = new Set<string>();

  for (const providerId of providerDirs) {
    const modelsDir = path.join(providersDir, providerId, "models");
    const files = fs.readdirSync(modelsDir).filter((f) => f.endsWith(".yaml"));

    // Read provider name from provider.yaml
    let providerName = providerId;
    const providerYamlPath = path.join(providersDir, providerId, "provider.yaml");
    if (fs.existsSync(providerYamlPath)) {
      try {
        const providerRaw = fs.readFileSync(providerYamlPath, "utf-8");
        const providerData = YAML.parse(providerRaw);
        if (providerData?.name) providerName = providerData.name;
      } catch {
        // ignore
      }
    }

    providers[providerId] = { name: providerName, model_count: files.length };

    for (const file of files) {
      const raw = fs.readFileSync(path.join(modelsDir, file), "utf-8");
      const data = YAML.parse(raw);
      const result = ModelSchema.safeParse(data);
      if (!result.success) continue;

      const model = result.data;
      uniqueIds.add(model.id);
      if (model.family) families.add(model.family);

      models.push({
        id: model.id,
        name: model.name,
        family: model.family,
        provider: providerId,
        reasoning: model.reasoning,
        tool_call: model.tool_call,
        structured_output: model.structured_output,
        open_weights: model.open_weights,
        deprecated: model.deprecated,
        pricing: model.pricing as Record<string, unknown> | undefined,
        limit: model.limit as Record<string, unknown> | undefined,
        modalities: model.modalities as Record<string, unknown> | undefined,
        release_date: model.release_date,
        last_updated: model.last_updated,
      });
    }
  }

  return {
    generated_at: new Date().toISOString(),
    stats: {
      providers: providerDirs.length,
      models: models.length,
      unique_model_ids: uniqueIds.size,
      families: families.size,
    },
    providers,
    models,
  };
}

function main(): void {
  const catalog = compile();

  const distDir = path.join(PROJECT_ROOT, "dist");
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  const outPath = path.join(distDir, "models.json");
  fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2));

  console.log(
    `✅ Compiled ${catalog.models.length} models from ${catalog.stats.providers} providers`,
  );
  console.log(
    `   ${catalog.stats.unique_model_ids} unique IDs, ${catalog.stats.families} families`,
  );
  console.log(`   Written to ${outPath}`);
  console.log(`   Size: ${(fs.statSync(outPath).size / 1024 / 1024).toFixed(1)} MB`);
}

main();
