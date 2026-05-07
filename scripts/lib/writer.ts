import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import type { ScrapeResult } from "./types";

/**
 * Write a ScrapeResult to YAML files.
 * Creates:
 *   <baseDir>/<provider.id>/provider.yaml
 *   <baseDir>/<provider.id>/models/<model.id>.yaml
 *
 * Existing files for the provider are fully regenerated (overwritten).
 */
export function writeScrapeResult(result: ScrapeResult, baseDir: string): void {
  const providerDir = path.join(baseDir, result.provider.id);
  const modelsDir = path.join(providerDir, "models");

  // Clean existing model files
  if (fs.existsSync(modelsDir)) {
    for (const file of fs.readdirSync(modelsDir)) {
      if (file.endsWith(".yaml") || file.endsWith(".yml")) {
        fs.unlinkSync(path.join(modelsDir, file));
      }
    }
  } else {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  // Write provider.yaml
  const providerPath = path.join(providerDir, "provider.yaml");
  fs.writeFileSync(providerPath, YAML.stringify(result.provider, null, 2), "utf-8");

  // Write model files
  for (const model of result.models) {
    const modelPath = path.join(modelsDir, `${model.id}.yaml`);
    fs.writeFileSync(modelPath, YAML.stringify(model, null, 2), "utf-8");
  }

  console.log(`  ${result.provider.id}: ${result.models.length} models written`);
}
