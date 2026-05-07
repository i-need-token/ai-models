import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeScrapeResult } from "./lib/index";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

/** Discover all providers with a scrape.ts file. */
function discoverProviders(): string[] {
  const providersDir = path.join(PROJECT_ROOT, "providers");
  return fs
    .readdirSync(providersDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => fs.existsSync(path.join(providersDir, name, "scrape.ts")));
}

async function runProvider(id: string): Promise<void> {
  const scrapePath = path.join(PROJECT_ROOT, "providers", id, "scrape.ts");
  console.log(`Syncing ${id}...`);
  const { scrape } = await import(scrapePath);
  const result = await scrape();
  writeScrapeResult(result, path.join(PROJECT_ROOT, "providers"));
}

async function main() {
  const providerArg = process.argv[2];
  const providers = discoverProviders();

  if (providerArg) {
    if (!providers.includes(providerArg)) {
      console.error(`Unknown provider: ${providerArg}`);
      console.error(`Available: ${providers.join(", ")}`);
      process.exit(1);
    }
    await runProvider(providerArg);
  } else {
    for (const id of providers) {
      try {
        await runProvider(id);
      } catch (err) {
        console.error(`  Error syncing ${id}:`, err);
      }
    }
  }
}

main();
