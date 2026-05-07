import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { ModelSchema } from "../types/schemas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

function validateProvider(providerId: string): { ok: number; fail: number } {
  const modelsDir = path.join(PROJECT_ROOT, "providers", providerId, "models");
  if (!fs.existsSync(modelsDir)) return { ok: 0, fail: 0 };

  const files = fs.readdirSync(modelsDir).filter((f) => f.endsWith(".yaml"));
  let ok = 0;
  let fail = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(modelsDir, file), "utf-8");
    const data = YAML.parse(raw);
    const result = ModelSchema.safeParse(data);
    if (result.success) {
      ok++;
    } else {
      fail++;
      const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      console.error(`  ✗ ${providerId}/${file}: ${issues}`);
    }
  }

  return { ok, fail };
}

function main(): void {
  const providerArg = process.argv[2];
  const providersDir = path.join(PROJECT_ROOT, "providers");
  const providers = fs
    .readdirSync(providersDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => fs.existsSync(path.join(providersDir, name, "models")));

  const targets = providerArg ? providers.filter((p) => p === providerArg) : providers;

  if (providerArg && targets.length === 0) {
    console.error(`Unknown provider: ${providerArg}`);
    console.error(`Available: ${providers.join(", ")}`);
    process.exit(1);
  }

  let totalOk = 0;
  let totalFail = 0;

  for (const providerId of targets) {
    const { ok, fail } = validateProvider(providerId);
    totalOk += ok;
    totalFail += fail;
    console.log(`  ${providerId}: ${ok} valid, ${fail} invalid`);
  }

  console.log(`\nTotal: ${totalOk} valid, ${totalFail} invalid`);
  if (totalFail > 0) process.exit(1);
}

main();
